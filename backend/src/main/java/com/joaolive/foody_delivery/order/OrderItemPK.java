package com.joaolive.foody_delivery.order;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.UUID;
import lombok.EqualsAndHashCode;
import lombok.Getter;

@Getter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Embeddable
public class OrderItemPK implements Serializable {
	@Column(name = "order_id")
	@EqualsAndHashCode.Include
	private UUID orderId;

	@Column(name = "product_id")
	@EqualsAndHashCode.Include
	private UUID productId;

	protected OrderItemPK() {
	}

	public OrderItemPK(UUID orderId, UUID productId) {
		this.orderId = orderId;
		this.productId = productId;
	}
}
