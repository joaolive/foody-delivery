package com.joaolive.foody_delivery.auth.config;

import com.joaolive.foody_delivery.auth.grant.PasswordGrantAuthenticationConverter;
import com.joaolive.foody_delivery.auth.grant.PasswordGrantAuthenticationProvider;
import java.time.Duration;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.oauth2.server.authorization.OAuth2AuthorizationServerConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.security.oauth2.core.OAuth2Token;
import org.springframework.security.oauth2.server.authorization.InMemoryOAuth2AuthorizationConsentService;
import org.springframework.security.oauth2.server.authorization.InMemoryOAuth2AuthorizationService;
import org.springframework.security.oauth2.server.authorization.OAuth2AuthorizationConsentService;
import org.springframework.security.oauth2.server.authorization.OAuth2AuthorizationService;
import org.springframework.security.oauth2.server.authorization.client.InMemoryRegisteredClientRepository;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClient;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClientRepository;
import org.springframework.security.oauth2.server.authorization.settings.AuthorizationServerSettings;
import org.springframework.security.oauth2.server.authorization.settings.ClientSettings;
import org.springframework.security.oauth2.server.authorization.settings.OAuth2TokenFormat;
import org.springframework.security.oauth2.server.authorization.settings.TokenSettings;
import org.springframework.security.oauth2.server.authorization.token.OAuth2TokenGenerator;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class AuthorizationServerConfig {

	@Value("${security.client-id}")
	private String clientId;

	@Value("${security.client-secret}")
	private String clientSecret;

	@Value("${security.jwt.duration:900}")
	private Integer jwtDurationSeconds;

	private final UserDetailsService userDetailsService;

	private final PasswordEncoder passwordEncoder;

	public AuthorizationServerConfig(UserDetailsService userDetailsService, PasswordEncoder passwordEncoder) {
		this.userDetailsService = userDetailsService;
		this.passwordEncoder = passwordEncoder;
	}

	@Bean
	@Order(1)
	SecurityFilterChain asSecurityFilterChain(HttpSecurity http, OAuth2AuthorizationService authorizationService,
			OAuth2TokenGenerator<? extends OAuth2Token> tokenGenerator) throws Exception {
		OAuth2AuthorizationServerConfigurer authorizationServerConfigurer = new OAuth2AuthorizationServerConfigurer();

		http.securityMatcher(authorizationServerConfigurer.getEndpointsMatcher());
		http.with(authorizationServerConfigurer,
				authorizationServer -> authorizationServer.tokenEndpoint(tokenEndpoint -> tokenEndpoint
						.accessTokenRequestConverter(new PasswordGrantAuthenticationConverter())
						.authenticationProvider(new PasswordGrantAuthenticationProvider(authorizationService,
								tokenGenerator, userDetailsService, passwordEncoder))));
		http.authorizeHttpRequests(
				authorize -> authorize.requestMatchers("/oauth2/jwks", "/.well-known/oauth-authorization-server")
						.permitAll().anyRequest().authenticated());

		return http.build();
	}

	@Bean
	OAuth2AuthorizationService authorizationService() {
		return new InMemoryOAuth2AuthorizationService();
	}

	@Bean
	OAuth2AuthorizationConsentService oAuth2AuthorizationConsentService() {
		return new InMemoryOAuth2AuthorizationConsentService();
	}

	@Bean
	RegisteredClientRepository registeredClientRepository() {
		// @formatter:off
		RegisteredClient registeredClient =
			RegisteredClient.withId(clientId)
				.clientId(clientId)
				.clientSecret(passwordEncoder.encode(clientSecret))
				.clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
				.scope("read")
				.scope("write")
				.authorizationGrantType(new AuthorizationGrantType("password"))
				.tokenSettings(tokenSettings())
				.clientSettings(clientSettings())
				.build();
		// @formatter:on

		return new InMemoryRegisteredClientRepository(registeredClient);
	}

	@Bean
	TokenSettings tokenSettings() {
		if (jwtDurationSeconds == null || jwtDurationSeconds <= 0) {
			throw new IllegalArgumentException("security.jwt.duration must be positive");
		}
		// @formatter:off
		return TokenSettings.builder()
			.accessTokenFormat(OAuth2TokenFormat.SELF_CONTAINED)
			.accessTokenTimeToLive(Duration.ofSeconds(jwtDurationSeconds))
			.build();
		// @formatter:on
	}

	@Bean
	ClientSettings clientSettings() {
		return ClientSettings.builder().build();
	}

	@Bean
	AuthorizationServerSettings authorizationServerSettings() {
		return AuthorizationServerSettings.builder().build();
	}
}
