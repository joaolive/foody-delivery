package com.joaolive.foody_delivery.user.dto;

import java.util.UUID;

import com.joaolive.foody_delivery.user.Role;

public record UserDTO(UUID id, String name, String email, Role role) {}
