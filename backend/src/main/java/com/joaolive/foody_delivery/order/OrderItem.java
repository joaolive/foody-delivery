package com.joaolive.foody_delivery.order;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import lombok.AccessLevel;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "tb_order_item")
public class OrderItem {
	@EmbeddedId
	@EqualsAndHashCode.Include
	private OrderItemPK id;
	@Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
	private BigDecimal unitPrice;
	@Column(nullable = false)
	private Integer quantity;

	OrderItem(OrderItemPK id, BigDecimal unitPrice, int quantity) {
		this.id = id;
		this.unitPrice = unitPrice;
		this.quantity = quantity;
	}

	void increaseQuantity(int amount) {
		quantity = Math.addExact(quantity, amount);
	}
}
