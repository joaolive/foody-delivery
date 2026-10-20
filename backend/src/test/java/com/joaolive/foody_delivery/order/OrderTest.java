package com.joaolive.foody_delivery.order;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.math.BigDecimal;
import java.util.UUID;
import org.junit.jupiter.api.Test;

class OrderTest {
	@Test
	void statusFollowsTheDeliverySequence() {
		Order order = new Order(UUID.randomUUID(), UUID.randomUUID());

		assertThrows(InvalidOrderStatusTransitionException.class, () -> order.changeStatus(OrderStatus.ENTREGUE));
		assertEquals(OrderStatus.RECEBIDO, order.getStatus());

		order.changeStatus(OrderStatus.EM_PREPARO);
		order.changeStatus(OrderStatus.SAIU_PARA_ENTREGA);
		order.changeStatus(OrderStatus.ENTREGUE);
		assertEquals(OrderStatus.ENTREGUE, order.getStatus());
		assertThrows(InvalidOrderStatusTransitionException.class, () -> order.changeStatus(OrderStatus.CANCELADO));
	}

	@Test
	void repeatedProductIsStoredAsOneItemWithSummedQuantity() {
		Order order = new Order(UUID.randomUUID(), UUID.randomUUID());
		UUID productId = UUID.randomUUID();

		order.addItem(productId, new BigDecimal("12.50"), 2);
		order.addItem(productId, new BigDecimal("12.50"), 3);

		assertEquals(1, order.getItems().size());
		OrderItem item = order.getItems().iterator().next();
		assertEquals(productId, item.getId().getProductId());
		assertEquals(5, item.getQuantity());
		assertEquals(new BigDecimal("12.50"), item.getUnitPrice());
	}
}
