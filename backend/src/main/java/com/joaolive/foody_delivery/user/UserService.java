package com.joaolive.foody_delivery.user;

import com.joaolive.foody_delivery.user.dto.UserDTO;
import com.joaolive.foody_delivery.user.dto.UserInsertDTO;
import java.util.Locale;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserService {
	private final UserRepository repository;
	private final PasswordEncoder passwordEncoder;
	private final ModelMapper modelMapper;

	public UserService(UserRepository repository, PasswordEncoder passwordEncoder, ModelMapper modelMapper) {
		this.repository = repository;
		this.passwordEncoder = passwordEncoder;
		this.modelMapper = modelMapper;
	}

	@Transactional
	public UserDTO insert(UserInsertDTO dto) {
		String email = dto.email().strip().toLowerCase(Locale.ROOT);
		if (repository.existsByEmailIgnoreCase(email)) {
			throw new EmailAlreadyExistsException("Email already registered");
		}
		String password = passwordEncoder.encode(dto.password());
		User entity = new User(dto.name(), email, password);
		entity = repository.save(entity);
		return modelMapper.map(entity, UserDTO.class);
	}

}
