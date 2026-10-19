package com.joaolive.foody_delivery.auth.dto;

import com.joaolive.foody_delivery.user.dto.UserResponse;
import java.time.Instant;

public record LoginResponse(String accessToken, Instant expiresAt, UserResponse user) {}
