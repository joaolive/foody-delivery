package com.joaolive.foody_delivery.user;

import com.joaolive.foody_delivery.common.ResourceNotFoundException;
import com.joaolive.foody_delivery.user.dto.CreateUserRequest;
import com.joaolive.foody_delivery.user.dto.UserResponse;
import java.util.Locale;
import java.util.UUID;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
	private final UserRepository repository;
	private final PasswordEncoder passwordEncoder;

	public UserService(UserRepository repository, PasswordEncoder passwordEncoder) {
		this.repository = repository;
		this.passwordEncoder = passwordEncoder;
	}

	@Transactional
	public UserResponse createUser(CreateUserRequest request) {
		String email = request.email().strip().toLowerCase(Locale.ROOT);
		if (repository.existsByEmailIgnoreCase(email)) {
			throw new EmailAlreadyExistsException("Email already registered");
		}
		String password = passwordEncoder.encode(request.password());
		User entity = new User(request.name(), email, password);
		entity = repository.save(entity);
		return new UserResponse(entity.getId(), entity.getName(), entity.getEmail(), entity.getRole());
	}

	@Transactional(readOnly = true)
	public String findNameById(UUID userId) {
		return repository.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId)).getName();
	}
}
