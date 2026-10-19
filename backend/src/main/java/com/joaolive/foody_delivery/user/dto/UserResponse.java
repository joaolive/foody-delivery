package com.joaolive.foody_delivery.user.dto;

import com.joaolive.foody_delivery.user.Role;
import java.util.UUID;

public record UserResponse(UUID id, String name, String email, Role role) {}
