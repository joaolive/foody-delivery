package com.joaolive.foody_delivery.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserInsertDTO(@NotBlank String name, @NotBlank @Email String email,
		@NotBlank @Size(min = 8, max = 32) String password) {}
