package com.joaolive.foody_delivery.auth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@Profile("test")
public class H2ConsoleSecurityConfig {

	@Bean
	@Order(2)
	SecurityFilterChain h2ConsoleSecurityFilterChain(HttpSecurity http) throws Exception {
		http.securityMatcher("/h2-console", "/h2-console/**");
		http.authorizeHttpRequests(authorize -> authorize.anyRequest().permitAll());
		http.csrf(csrf -> csrf.disable());
		http.headers(headers -> headers.frameOptions(frameOptions -> frameOptions.sameOrigin()));
		return http.build();
	}
}
