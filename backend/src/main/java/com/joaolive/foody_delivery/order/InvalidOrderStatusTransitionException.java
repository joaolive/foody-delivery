package com.joaolive.foody_delivery.order;

public class InvalidOrderStatusTransitionException extends RuntimeException {
	public InvalidOrderStatusTransitionException(OrderStatus current, OrderStatus next) {
		super("Cannot change order status from " + current + " to " + next);
	}
}
