package com.joaolive.foody_delivery.address.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateAddressRequest(@NotBlank @Size(max = 255) String address) {}
