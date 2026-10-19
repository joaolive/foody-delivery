package com.joaolive.foody_delivery.auth.config;

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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.Resource;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
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
	JwtEncoder jwtEncoder(JWKSource<SecurityContext> jwkSource) {
		return new NimbusJwtEncoder(jwkSource);
	}

	@Bean
	JwtDecoder jwtDecoder(RSAPublicKey publicKey) {
		return NimbusJwtDecoder.withPublicKey(publicKey).build();
	}

	@Bean
	RSAPublicKey publicKey() throws IOException, GeneralSecurityException {
		return (RSAPublicKey) KeyFactory.getInstance("RSA").generatePublic(new X509EncodedKeySpec(
				decodePem(publicKeyResource, "-----BEGIN PUBLIC KEY-----", "-----END PUBLIC KEY-----")));
	}

	@Bean
	JWKSource<SecurityContext> jwkSource(RSAPublicKey publicKey) throws IOException, GeneralSecurityException {
		RSAPrivateKey privateKey = (RSAPrivateKey) KeyFactory.getInstance("RSA")
				.generatePrivate(new PKCS8EncodedKeySpec(
						decodePem(privateKeyResource, "-----BEGIN PRIVATE KEY-----", "-----END PRIVATE KEY-----")));
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
