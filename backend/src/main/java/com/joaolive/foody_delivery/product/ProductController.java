package com.joaolive.foody_delivery.product;

import com.joaolive.foody_delivery.product.dto.ProductDTO;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/product")
public class ProductController {
	private final ProductService service;

	public ProductController(ProductService service) {
		this.service = service;
	}

	@GetMapping(value = "/{id}")
	public ResponseEntity<ProductDTO> findById(@PathVariable UUID id) {
		ProductDTO result = service.findById(id);
		return ResponseEntity.ok(result);
	}

	@GetMapping
	public ResponseEntity<Page<ProductDTO>> findAll(Pageable pageable,
			@RequestParam(value = "name", defaultValue = "") String name) {
		Page<ProductDTO> list = service.findAll(pageable, name);
		return ResponseEntity.ok(list);
	}
}
