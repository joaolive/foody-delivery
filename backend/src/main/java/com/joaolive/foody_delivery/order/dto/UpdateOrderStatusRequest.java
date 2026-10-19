package com.joaolive.foody_delivery.order.dto;

import com.joaolive.foody_delivery.order.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateOrderStatusRequest(@NotNull OrderStatus status) {}
