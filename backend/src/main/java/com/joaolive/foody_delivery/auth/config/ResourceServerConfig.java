package com.joaolive.foody_delivery.auth.config;

import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.util.StringUtils;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class ResourceServerConfig {

  @Value("${cors.origins:}")
  private String corsOrigins;

  @Bean
  @Order(3)
  SecurityFilterChain rsSecurityFilterChain(
      HttpSecurity http,
      JwtAuthenticationConverter jwtAuthenticationConverter,
      CorsConfigurationSource corsConfigurationSource)
      throws Exception {

    http.csrf(csrf -> csrf.disable());
    http.sessionManagement(
        session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
    http.authorizeHttpRequests(
        authorize ->
            authorize
                .requestMatchers(HttpMethod.POST, "/api/auth/register", "/api/auth/login")
                .permitAll()
                .anyRequest()
                .authenticated());
    http.oauth2ResourceServer(
        oauth2ResourceServer ->
            oauth2ResourceServer.jwt(
                jwt -> jwt.jwtAuthenticationConverter(jwtAuthenticationConverter)));
    http.cors(cors -> cors.configurationSource(corsConfigurationSource));
    return http.build();
  }

  @Bean
  JwtAuthenticationConverter jwtAuthenticationConverter() {
    JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter =
        new JwtGrantedAuthoritiesConverter();
    grantedAuthoritiesConverter.setAuthoritiesClaimName("authorities");
    grantedAuthoritiesConverter.setAuthorityPrefix("");

    JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
    jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
    return jwtAuthenticationConverter;
  }

  @Bean
  CorsConfigurationSource corsConfigurationSource() {
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    List<String> origins =
        Arrays.stream(corsOrigins.split(","))
            .map(String::trim)
            .filter(StringUtils::hasText)
            .toList();
    if (origins.isEmpty()) {
      return source;
    }

    CorsConfiguration corsConfig = new CorsConfiguration();
    corsConfig.setAllowedOrigins(origins);
    corsConfig.setAllowedMethods(Arrays.asList("POST", "GET", "PUT", "DELETE", "PATCH", "OPTIONS"));
    corsConfig.setAllowCredentials(false);
    corsConfig.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));

    source.registerCorsConfiguration("/**", corsConfig);
    return source;
  }
}
