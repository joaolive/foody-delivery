package com.joaolive.foody_delivery.order.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record CreateOrderRequest(@NotBlank @Size(max = 255) String address,
		@NotEmpty List<@NotNull @Valid CreateOrderItemRequest> items) {}
