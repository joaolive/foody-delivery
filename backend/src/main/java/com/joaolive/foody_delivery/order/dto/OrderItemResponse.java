package com.joaolive.foody_delivery.order.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record OrderItemResponse(UUID productId, BigDecimal unitPrice, Integer quantity) {}
