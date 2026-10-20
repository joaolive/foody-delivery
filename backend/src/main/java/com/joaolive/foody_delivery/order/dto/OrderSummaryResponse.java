package com.joaolive.foody_delivery.order.dto;

import com.joaolive.foody_delivery.order.Order;
import com.joaolive.foody_delivery.order.OrderStatus;
import java.time.Instant;
import java.util.UUID;

public record OrderSummaryResponse(UUID id, UUID clientId, OrderStatus status, Instant createdAt, Instant updatedAt) {
	public static OrderSummaryResponse fromEntity(Order order) {
		return new OrderSummaryResponse(order.getId(), order.getClientId(), order.getStatus(), order.getCreatedAt(),
				order.getUpdatedAt());
	}
}
