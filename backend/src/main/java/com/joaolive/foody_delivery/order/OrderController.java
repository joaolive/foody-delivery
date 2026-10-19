package com.joaolive.foody_delivery.order;

import com.joaolive.foody_delivery.auth.web.CurrentUser;
import com.joaolive.foody_delivery.auth.web.UserContext;
import com.joaolive.foody_delivery.order.dto.CreateOrderRequest;
import com.joaolive.foody_delivery.order.dto.OrderResponse;
import com.joaolive.foody_delivery.order.dto.UpdateOrderStatusRequest;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@RestController
@RequestMapping("/orders")
public class OrderController {
	private final OrderService orderService;

	public OrderController(OrderService orderService) {
		this.orderService = orderService;
	}

	@PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
	@PostMapping
	public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody CreateOrderRequest request,
			@CurrentUser UserContext user) {
		OrderResponse order = orderService.createOrder(request, user.id());
		URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(order.id())
				.toUri();
		return ResponseEntity.created(location).body(order);
	}

	@PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
	@GetMapping("/mine")
	public Page<OrderResponse> findOrdersForUser(@CurrentUser UserContext user,
			@PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
		return orderService.findOrdersForUser(user.id(), pageable);
	}

	@PreAuthorize("hasRole('ADMIN')")
	@GetMapping
	public Page<OrderResponse> findAllOrders(@RequestParam(required = false) UUID clientId,
			@PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
		return orderService.findAllOrders(clientId, pageable);
	}

	@PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
	@GetMapping("/{id}")
	public OrderResponse findOrderById(@PathVariable UUID id, @CurrentUser UserContext user) {
		return orderService.findOrderById(id, user.id(), user.hasRole("ADMIN"));
	}

	@PreAuthorize("hasRole('ADMIN')")
	@PatchMapping("/{id}/status")
	public OrderResponse updateOrderStatus(@PathVariable UUID id,
			@Valid @RequestBody UpdateOrderStatusRequest request) {
		return orderService.updateOrderStatus(id, request.status());
	}

}
