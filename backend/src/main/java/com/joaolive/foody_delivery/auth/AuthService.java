package com.joaolive.foody_delivery.auth;

import com.joaolive.foody_delivery.auth.dto.LoginRequest;
import com.joaolive.foody_delivery.auth.dto.LoginResponse;
import com.joaolive.foody_delivery.user.User;
import com.joaolive.foody_delivery.user.UserRepository;
import com.joaolive.foody_delivery.user.dto.UserResponse;
import java.time.Instant;
import java.util.List;
import java.util.Locale;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.SignatureAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.security.oauth2.server.authorization.settings.TokenSettings;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	private final JwtEncoder jwtEncoder;
	private final TokenSettings tokenSettings;

	public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtEncoder jwtEncoder,
			TokenSettings tokenSettings) {
		this.userRepository = userRepository;
		this.passwordEncoder = passwordEncoder;
		this.jwtEncoder = jwtEncoder;
		this.tokenSettings = tokenSettings;
	}

	@Transactional(readOnly = true)
	public LoginResponse login(LoginRequest request) {
		String email = request.email().strip().toLowerCase(Locale.ROOT);
		User user = userRepository.findByEmailIgnoreCase(email).orElseThrow(InvalidCredentialsException::new);
		if (!passwordEncoder.matches(request.password(), user.getPassword())) {
			throw new InvalidCredentialsException();
		}

		Instant issuedAt = Instant.now();
		Instant expiresAt = issuedAt.plus(tokenSettings.getAccessTokenTimeToLive());
		String userId = user.getId().toString();
		JwtClaimsSet claims = JwtClaimsSet.builder().subject(userId).issuedAt(issuedAt).expiresAt(expiresAt)
				.claim("authorities", List.of("ROLE_" + user.getRole().name())).claim("username", user.getEmail())
				.claim("user_id", userId).build();
		String accessToken = jwtEncoder
				.encode(JwtEncoderParameters.from(JwsHeader.with(SignatureAlgorithm.RS256).build(), claims))
				.getTokenValue();
		return new LoginResponse(accessToken, expiresAt,
				new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getRole()));
	}
}
