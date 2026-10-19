package com.joaolive.foody_delivery.auth.web;

import java.util.Set;
import java.util.UUID;

public record UserContext(UUID id, String username, Set<String> authorities) {
	public UserContext {
		authorities = Set.copyOf(authorities);
	}

	public boolean hasRole(String roleName) {
		return authorities.contains("ROLE_" + roleName);
	}
}
