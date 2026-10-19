package com.joaolive.foody_delivery.auth.config;

import com.joaolive.foody_delivery.auth.AuthenticatedUser;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jose.jwk.source.JWKSource;
import com.nimbusds.jose.proc.SecurityContext;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.KeyFactory;
import java.security.MessageDigest;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.security.config.annotation.web.configuration.OAuth2AuthorizationServerConfiguration;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2ErrorCodes;
import org.springframework.security.oauth2.core.OAuth2Token;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.oauth2.server.authorization.OAuth2TokenType;
import org.springframework.security.oauth2.server.authorization.token.DelegatingOAuth2TokenGenerator;
import org.springframework.security.oauth2.server.authorization.token.JwtEncodingContext;
import org.springframework.security.oauth2.server.authorization.token.JwtGenerator;
import org.springframework.security.oauth2.server.authorization.token.OAuth2AccessTokenGenerator;
import org.springframework.security.oauth2.server.authorization.token.OAuth2TokenCustomizer;
import org.springframework.security.oauth2.server.authorization.token.OAuth2TokenGenerator;
import org.springframework.util.StringUtils;

@Configuration
public class JwtConfig {

	@Value("${security.rsa.private-key:classpath:private.pem}")
	private Resource privateKeyResource;

	@Value("${security.rsa.public-key:classpath:public.pem}")
	private Resource publicKeyResource;

	@Value("${security.rsa.key-id:}")
	private String rsaKeyId;

	@Bean
	OAuth2TokenGenerator<? extends OAuth2Token> tokenGenerator(JwtEncoder jwtEncoder,
			OAuth2TokenCustomizer<JwtEncodingContext> tokenCustomizer) {
		JwtGenerator jwtGenerator = new JwtGenerator(jwtEncoder);
		jwtGenerator.setJwtCustomizer(tokenCustomizer);
		OAuth2AccessTokenGenerator accessTokenGenerator = new OAuth2AccessTokenGenerator();
		return new DelegatingOAuth2TokenGenerator(jwtGenerator, accessTokenGenerator);
	}

	@Bean
	JwtEncoder jwtEncoder(JWKSource<SecurityContext> jwkSource) {
		return new NimbusJwtEncoder(jwkSource);
	}

	@Bean
	OAuth2TokenCustomizer<JwtEncodingContext> tokenCustomizer() {
		return context -> {
			if (!OAuth2TokenType.ACCESS_TOKEN.equals(context.getTokenType())) {
				return;
			}
			if (!(context.getPrincipal().getPrincipal() instanceof AuthenticatedUser user)) {
				throw new OAuth2AuthenticationException(OAuth2ErrorCodes.SERVER_ERROR);
			}
			List<String> authorities = user.getAuthorities().stream().map(authority -> authority.getAuthority())
					.toList();
			context.getClaims().subject(user.getId().toString()).claim("authorities", authorities)
					.claim("username", user.getUsername()).claim("user_id", user.getId().toString());
		};
	}

	@Bean
	JwtDecoder jwtDecoder(JWKSource<SecurityContext> jwkSource) {
		return OAuth2AuthorizationServerConfiguration.jwtDecoder(jwkSource);
	}

	@Bean
	JWKSource<SecurityContext> jwkSource() throws IOException, GeneralSecurityException {
		RSAPrivateKey privateKey = (RSAPrivateKey) KeyFactory.getInstance("RSA")
				.generatePrivate(new PKCS8EncodedKeySpec(
						decodePem(privateKeyResource, "-----BEGIN PRIVATE KEY-----", "-----END PRIVATE KEY-----")));
		RSAPublicKey publicKey = (RSAPublicKey) KeyFactory.getInstance("RSA").generatePublic(new X509EncodedKeySpec(
				decodePem(publicKeyResource, "-----BEGIN PUBLIC KEY-----", "-----END PUBLIC KEY-----")));
		if (!privateKey.getModulus().equals(publicKey.getModulus())) {
			throw new IllegalArgumentException("The RSA private and public keys do not match");
		}
		String keyId = StringUtils.hasText(rsaKeyId)
				? rsaKeyId
				: Base64.getUrlEncoder().withoutPadding()
						.encodeToString(MessageDigest.getInstance("SHA-256").digest(publicKey.getEncoded()));
		RSAKey rsaKey = new RSAKey.Builder(publicKey).privateKey(privateKey).keyID(keyId).build();
		JWKSet jwkSet = new JWKSet(rsaKey);
		return (jwkSelector, securityContext) -> jwkSelector.select(jwkSet);
	}

	private static byte[] decodePem(Resource resource, String begin, String end) throws IOException {
		String pem;
		try (var input = resource.getInputStream()) {
			pem = new String(input.readAllBytes(), StandardCharsets.US_ASCII);
		}
		if (!pem.contains(begin) || !pem.contains(end)) {
			throw new IllegalArgumentException("Invalid PEM format in " + resource.getDescription());
		}
		String encoded = pem.replace(begin, "").replace(end, "").replaceAll("\\s", "");
		return Base64.getDecoder().decode(encoded);
	}
}
