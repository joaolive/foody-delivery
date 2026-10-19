package com.joaolive.foody_delivery.auth;

import java.util.UUID;
import org.springframework.security.core.userdetails.UserDetails;

public interface AuthenticatedUser extends UserDetails {
	UUID getId();
}
