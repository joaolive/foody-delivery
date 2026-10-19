package com.joaolive.foody_delivery.order.dto;

import com.joaolive.foody_delivery.order.Order;
import com.joaolive.foody_delivery.order.OrderItem;
import com.joaolive.foody_delivery.order.OrderStatus;
import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

public record OrderResponse(UUID id, UUID clientId, String address, OrderStatus status, Instant createdAt,
		Instant updatedAt, List<OrderItemResponse> items) {
	public static OrderResponse fromEntity(Order order) {
		List<OrderItemResponse> items = order.getItems().stream()
				.sorted(Comparator.comparing(item -> item.getId().getProductId())).map(OrderResponse::toItemResponse)
				.toList();
		return new OrderResponse(order.getId(), order.getClientId(), order.getAddress(), order.getStatus(),
				order.getCreatedAt(), order.getUpdatedAt(), items);
	}

	private static OrderItemResponse toItemResponse(OrderItem item) {
		return new OrderItemResponse(item.getId().getProductId(), item.getUnitPrice(), item.getQuantity());
	}
}
