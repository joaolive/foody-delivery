package com.joaolive.foody_delivery.order;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import com.joaolive.foody_delivery.address.Address;
import com.joaolive.foody_delivery.address.AddressRepository;
import com.joaolive.foody_delivery.common.ResourceNotFoundException;
import com.joaolive.foody_delivery.order.dto.CreateOrderItemRequest;
import com.joaolive.foody_delivery.order.dto.CreateOrderRequest;
import com.joaolive.foody_delivery.order.dto.OrderResponse;
import com.joaolive.foody_delivery.product.Product;
import com.joaolive.foody_delivery.product.ProductRepository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class OrderServiceTest {
	private final OrderRepository orderRepository = mock(OrderRepository.class);
	private final ProductRepository productRepository = mock(ProductRepository.class);
	private final AddressRepository addressRepository = mock(AddressRepository.class);
	private final OrderService service = new OrderService(orderRepository, productRepository, addressRepository);

	@Test
	void createOrderUsesOwnedAddressAndCatalogPrice() {
		UUID clientId = UUID.randomUUID();
		Address address = new Address(clientId, "Rua das Flores, 10");
		Product product = new Product("Burger", new BigDecimal("29.90"), "/images/burger.jpg");
		when(addressRepository.findByIdAndUserId(address.getId(), clientId)).thenReturn(Optional.of(address));
		when(productRepository.findById(product.getId())).thenReturn(Optional.of(product));
		when(orderRepository.saveAndFlush(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

		OrderResponse result = service.createOrder(
				new CreateOrderRequest(address.getId(), List.of(new CreateOrderItemRequest(product.getId(), 2))),
				clientId);

		assertEquals(clientId, result.clientId());
		assertEquals(address.getId(), result.addressId());
		assertEquals("Rua das Flores, 10", result.address());
		assertEquals(OrderStatus.RECEBIDO, result.status());
		assertEquals(new BigDecimal("29.90"), result.items().getFirst().unitPrice());
		assertEquals(2, result.items().getFirst().quantity());
		verify(addressRepository).findByIdAndUserId(address.getId(), clientId);
	}

	@Test
	void createOrderRejectsAddressFromAnotherClient() {
		UUID clientId = UUID.randomUUID();
		UUID addressId = UUID.randomUUID();
		UUID productId = UUID.randomUUID();
		CreateOrderRequest request = new CreateOrderRequest(addressId,
				List.of(new CreateOrderItemRequest(productId, 1)));

		assertThrows(ResourceNotFoundException.class, () -> service.createOrder(request, clientId));
		verify(addressRepository).findByIdAndUserId(addressId, clientId);
		verifyNoInteractions(productRepository, orderRepository);
	}
}
