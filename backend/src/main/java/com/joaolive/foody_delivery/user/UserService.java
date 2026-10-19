package com.joaolive.foody_delivery.user;

import org.springframework.stereotype.Service;

@Service
public class UserService {
	private final UserRepository repository;

	public UserService(UserRepository repository) {
		this.repository = repository;
	}
}
