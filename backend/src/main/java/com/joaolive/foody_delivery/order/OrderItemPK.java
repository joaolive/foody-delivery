package com.joaolive.foody_delivery.order;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Embeddable
public class OrderItemPK implements Serializable {
	@Column(name = "order_id")
	@EqualsAndHashCode.Include
	private UUID orderId;

	@Column(name = "product_id")
	@EqualsAndHashCode.Include
	private UUID productId;

	public OrderItemPK(UUID orderId, UUID productId) {
		this.orderId = orderId;
		this.productId = productId;
	}
}
