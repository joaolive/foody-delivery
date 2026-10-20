package com.joaolive.foody_delivery.product.dto;

import com.joaolive.foody_delivery.product.Product;
import java.math.BigDecimal;
import java.util.UUID;

public record ProductResponse(UUID id, String name, BigDecimal price, String imageUrl) {
	public static ProductResponse fromEntity(Product product) {
		return new ProductResponse(product.getId(), product.getName(), product.getPrice(), product.getImageUrl());
	}
}
