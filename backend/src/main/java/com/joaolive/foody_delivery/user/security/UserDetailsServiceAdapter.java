package com.joaolive.foody_delivery.user.security;

import com.joaolive.foody_delivery.user.User;
import com.joaolive.foody_delivery.user.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceAdapter implements UserDetailsService {

	private final UserRepository userRepository;

	public UserDetailsServiceAdapter(UserRepository userRepository) {
		this.userRepository = userRepository;
	}

	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		User user = userRepository.findByEmailIgnoreCase(email)
				.orElseThrow(() -> new UsernameNotFoundException("User not found"));
		return new UserDetailsAdapter(user);
	}
}
