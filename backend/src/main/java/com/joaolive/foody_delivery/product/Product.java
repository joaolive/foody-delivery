package com.joaolive.foody_delivery.product;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.util.UUID;
import lombok.EqualsAndHashCode;
import lombok.Getter;

@Getter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "tb_product")
public class Product {
	@Id
	@EqualsAndHashCode.Include
	private UUID id;
	@Column(nullable = false)
	private String name;
	@Column(nullable = false, precision = 10, scale = 2)
	private BigDecimal price;

	protected Product() {
	}

	public Product(String name, BigDecimal price) {
		this.id = UUID.randomUUID();
		this.name = name;
		this.price = price;
	}

	public void changePrice(BigDecimal price) {
		this.price = price;
	}
}
