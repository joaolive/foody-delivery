package com.joaolive.foody_delivery;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.context.ActiveProfiles;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ApiFlowIntegrationTests {
	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

	@Test
	void loginAndRolesProtectOrderRoutes() throws Exception {
		mockMvc.perform(get("/orders")).andExpect(status().isUnauthorized());
		mockMvc.perform(post("/auth/login").contentType(MediaType.APPLICATION_JSON).content("""
				{"email":"alex.green@example.com","password":"wrong-password"}
				""")).andExpect(status().isUnauthorized());

		String adminToken = login("alex.green@example.com", "admin123");
		String clientToken = login("maria.brown@example.com", "client123");
		mockMvc.perform(get("/orders").header("Authorization", bearer(adminToken))).andExpect(status().isOk());
		mockMvc.perform(get("/orders").header("Authorization", bearer(clientToken))).andExpect(status().isForbidden());
		mockMvc.perform(get("/orders/mine").header("Authorization", bearer(clientToken))).andExpect(status().isOk());
		mockMvc.perform(get("/orders/mine").header("Authorization", bearer(adminToken)))
				.andExpect(status().isForbidden());
		mockMvc.perform(post("/orders").header("Authorization", bearer(adminToken))
				.contentType(MediaType.APPLICATION_JSON).content(
						"""
								{"addressId":"0ddcb601-fbd4-4947-8658-2159184ed963","items":[{"productId":"bed49b8b-800a-4f24-a57c-1641878790c7","quantity":1}]}
								"""))
				.andExpect(status().isForbidden());
	}

	@Test
	void clientCanCreateAndCancelOwnOrderWhileAdminManagesStatus() throws Exception {
		String clientToken = login("maria.brown@example.com", "client123");
		String adminToken = login("alex.green@example.com", "admin123");
		JsonNode addresses = responseJson(
				mockMvc.perform(get("/addresses").header("Authorization", bearer(clientToken)))
						.andExpect(status().isOk()).andReturn().getResponse().getContentAsString());
		JsonNode products = responseJson(mockMvc.perform(get("/product").header("Authorization", bearer(clientToken)))
				.andExpect(status().isOk()).andReturn().getResponse().getContentAsString());
		String addressId = addresses.get(0).get("id").asText();
		String productId = products.get("content").get(0).get("id").asText();

		String orderId = createOrder(clientToken, addressId, productId);
		mockMvc.perform(get("/orders/{id}", orderId).header("Authorization", bearer(clientToken)))
				.andExpect(status().isOk()).andExpect(jsonPath("$.status").value("RECEIVED"));
		mockMvc.perform(get("/orders/{id}", orderId).header("Authorization", bearer(adminToken)))
				.andExpect(status().isOk());

		String otherEmail = "other-" + UUID.randomUUID() + "@example.com";
		mockMvc.perform(post("/user").contentType(MediaType.APPLICATION_JSON)
				.content("{\"name\":\"Other Client\",\"email\":\"" + otherEmail + "\",\"password\":\"client123\"}"))
				.andExpect(status().isCreated());
		String otherToken = login(otherEmail, "client123");
		mockMvc.perform(get("/orders/{id}", orderId).header("Authorization", bearer(otherToken)))
				.andExpect(status().isNotFound());
		mockMvc.perform(post("/orders").header("Authorization", bearer(otherToken))
				.contentType(MediaType.APPLICATION_JSON).content(orderPayload(addressId, productId)))
				.andExpect(status().isNotFound());
		mockMvc.perform(patch("/orders/{id}/cancel", orderId).header("Authorization", bearer(otherToken)))
				.andExpect(status().isNotFound());

		mockMvc.perform(patch("/orders/{id}/status", orderId).header("Authorization", bearer(adminToken))
				.contentType(MediaType.APPLICATION_JSON).content("{\"status\":\"PREPARING\"}"))
				.andExpect(status().isOk());
		mockMvc.perform(patch("/orders/{id}/status", orderId).header("Authorization", bearer(adminToken))
				.contentType(MediaType.APPLICATION_JSON).content("{\"status\":\"DELIVERED\"}"))
				.andExpect(status().isConflict());
		mockMvc.perform(patch("/orders/{id}/cancel", orderId).header("Authorization", bearer(clientToken)))
				.andExpect(status().isOk()).andExpect(jsonPath("$.status").value("CANCELED"));
		mockMvc.perform(patch("/orders/{id}/status", orderId).header("Authorization", bearer(adminToken))
				.contentType(MediaType.APPLICATION_JSON).content("{\"status\":\"PREPARING\"}"))
				.andExpect(status().isConflict());

		String deliveredOrderId = createOrder(clientToken, addressId, productId);
		for (String nextStatus : new String[]{"PREPARING", "OUT_FOR_DELIVERY", "DELIVERED"}) {
			mockMvc.perform(patch("/orders/{id}/status", deliveredOrderId).header("Authorization", bearer(adminToken))
					.contentType(MediaType.APPLICATION_JSON).content("{\"status\":\"" + nextStatus + "\"}"))
					.andExpect(status().isOk()).andExpect(jsonPath("$.status").value(nextStatus));
		}
		mockMvc.perform(patch("/orders/{id}/cancel", deliveredOrderId).header("Authorization", bearer(clientToken)))
				.andExpect(status().isConflict());
	}

	@Test
	void invalidRegistrationAndOrderPayloadsReturnBadRequest() throws Exception {
		String tooLongName = "A".repeat(256);
		mockMvc.perform(post("/user").contentType(MediaType.APPLICATION_JSON).content(
				"{\"name\":\"" + tooLongName + "\",\"email\":\"long@example.com\",\"password\":\"client123\"}"))
				.andExpect(status().isBadRequest());
		String clientToken = login("maria.brown@example.com", "client123");
		mockMvc.perform(
				post("/orders").header("Authorization", bearer(clientToken)).contentType(MediaType.APPLICATION_JSON)
						.content("{\"addressId\":\"0ddcb601-fbd4-4947-8658-2159184ed963\",\"items\":[]}"))
				.andExpect(status().isBadRequest());
	}

	private String createOrder(String token, String addressId, String productId) throws Exception {
		String body = mockMvc
				.perform(post("/orders").header("Authorization", bearer(token)).contentType(MediaType.APPLICATION_JSON)
						.content(orderPayload(addressId, productId)))
				.andExpect(status().isCreated()).andExpect(jsonPath("$.status").value("RECEIVED"))
				.andExpect(jsonPath("$.items[0].quantity").value(2)).andReturn().getResponse().getContentAsString();
		return responseJson(body).get("id").asText();
	}

	private String login(String email, String password) throws Exception {
		String body = mockMvc
				.perform(post("/auth/login").contentType(MediaType.APPLICATION_JSON)
						.content("{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}"))
				.andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
		return responseJson(body).get("accessToken").asText();
	}

	private JsonNode responseJson(String body) {
		return objectMapper.readTree(body);
	}

	private static String bearer(String token) {
		return "Bearer " + token;
	}

	private static String orderPayload(String addressId, String productId) {
		return "{\"addressId\":\"" + addressId + "\",\"items\":[{\"productId\":\"" + productId + "\",\"quantity\":2}]}";
	}
}
