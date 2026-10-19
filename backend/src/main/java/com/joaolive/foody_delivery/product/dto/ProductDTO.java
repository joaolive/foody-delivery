package com.joaolive.foody_delivery.product.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record ProductDTO(UUID id, String name, BigDecimal price) {}
