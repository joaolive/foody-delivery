package com.joaolive.foody_delivery.product;

import com.joaolive.foody_delivery.common.ResourceNotFoundException;
import com.joaolive.foody_delivery.product.dto.ProductResponse;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {
	private final ProductRepository repository;

	public ProductService(ProductRepository repository) {
		this.repository = repository;
	}

	@Transactional(readOnly = true)
	public ProductResponse findById(UUID id) {
		Product entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
		return new ProductResponse(entity.getId(), entity.getName(), entity.getPrice());
	}

	@Transactional(readOnly = true)
	public Page<ProductResponse> findAll(Pageable pageable, String name) {
		Page<Product> products = repository.findByNameContainingIgnoreCase(name.strip(), pageable);
		return products.map(product -> new ProductResponse(product.getId(), product.getName(), product.getPrice()));
	}
}
