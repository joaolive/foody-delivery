package com.joaolive.foody_delivery.auth.grant;

import com.joaolive.foody_delivery.auth.AuthenticatedUser;
import java.security.Principal;
import java.util.Set;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClaimAccessor;
import org.springframework.security.oauth2.core.OAuth2AccessToken;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.OAuth2ErrorCodes;
import org.springframework.security.oauth2.core.OAuth2Token;
import org.springframework.security.oauth2.server.authorization.OAuth2Authorization;
import org.springframework.security.oauth2.server.authorization.OAuth2AuthorizationService;
import org.springframework.security.oauth2.server.authorization.OAuth2TokenType;
import org.springframework.security.oauth2.server.authorization.authentication.OAuth2AccessTokenAuthenticationToken;
import org.springframework.security.oauth2.server.authorization.authentication.OAuth2ClientAuthenticationToken;
import org.springframework.security.oauth2.server.authorization.client.RegisteredClient;
import org.springframework.security.oauth2.server.authorization.context.AuthorizationServerContextHolder;
import org.springframework.security.oauth2.server.authorization.token.DefaultOAuth2TokenContext;
import org.springframework.security.oauth2.server.authorization.token.OAuth2TokenContext;
import org.springframework.security.oauth2.server.authorization.token.OAuth2TokenGenerator;
import org.springframework.util.Assert;

public class PasswordGrantAuthenticationProvider implements AuthenticationProvider {

	private static final String ERROR_URI = "https://datatracker.ietf.org/doc/html/rfc6749#section-5.2";
	private static final AuthorizationGrantType PASSWORD_GRANT = new AuthorizationGrantType("password");
	private static final Set<String> DEFAULT_SCOPES = Set.of("read");

	private final OAuth2AuthorizationService authorizationService;
	private final UserDetailsService userDetailsService;
	private final OAuth2TokenGenerator<? extends OAuth2Token> tokenGenerator;
	private final PasswordEncoder passwordEncoder;

	public PasswordGrantAuthenticationProvider(OAuth2AuthorizationService authorizationService,
			OAuth2TokenGenerator<? extends OAuth2Token> tokenGenerator, UserDetailsService userDetailsService,
			PasswordEncoder passwordEncoder) {
		Assert.notNull(authorizationService, "authorizationService cannot be null");
		Assert.notNull(tokenGenerator, "tokenGenerator cannot be null");
		Assert.notNull(userDetailsService, "userDetailsService cannot be null");
		Assert.notNull(passwordEncoder, "passwordEncoder cannot be null");
		this.authorizationService = authorizationService;
		this.tokenGenerator = tokenGenerator;
		this.userDetailsService = userDetailsService;
		this.passwordEncoder = passwordEncoder;
	}

	@Override
	public Authentication authenticate(Authentication authentication) throws AuthenticationException {
		PasswordGrantAuthenticationToken passwordGrant = (PasswordGrantAuthenticationToken) authentication;
		try {
			OAuth2ClientAuthenticationToken clientPrincipal = getAuthenticatedClient(passwordGrant);
			RegisteredClient registeredClient = clientPrincipal.getRegisteredClient();
			if (!registeredClient.getAuthorizationGrantTypes().contains(PASSWORD_GRANT)) {
				throw new OAuth2AuthenticationException(OAuth2ErrorCodes.UNAUTHORIZED_CLIENT);
			}

			Set<String> authorizedScopes = passwordGrant.getScopes().isEmpty()
					? DEFAULT_SCOPES
					: passwordGrant.getScopes();
			if (!registeredClient.getScopes().containsAll(authorizedScopes)) {
				throw new OAuth2AuthenticationException(OAuth2ErrorCodes.INVALID_SCOPE);
			}

			UserDetails details;
			try {
				details = userDetailsService.loadUserByUsername(passwordGrant.getUsername());
			} catch (UsernameNotFoundException ex) {
				throw invalidCredentials();
			}
			if (!passwordEncoder.matches(passwordGrant.getPassword(), details.getPassword()) || !details.isEnabled()
					|| !details.isAccountNonLocked() || !details.isAccountNonExpired()
					|| !details.isCredentialsNonExpired()) {
				throw invalidCredentials();
			}
			if (!(details instanceof AuthenticatedUser user)) {
				throw new OAuth2AuthenticationException(OAuth2ErrorCodes.SERVER_ERROR);
			}

			Authentication userPrincipal = UsernamePasswordAuthenticationToken.authenticated(user, null,
					user.getAuthorities());
			DefaultOAuth2TokenContext.Builder tokenContextBuilder = DefaultOAuth2TokenContext.builder()
					.registeredClient(registeredClient).principal(userPrincipal)
					.authorizationServerContext(AuthorizationServerContextHolder.getContext())
					.authorizedScopes(authorizedScopes).authorizationGrantType(PASSWORD_GRANT)
					.authorizationGrant(passwordGrant);

			OAuth2Authorization.Builder authorizationBuilder = OAuth2Authorization
					.withRegisteredClient(registeredClient).attribute(Principal.class.getName(), userPrincipal)
					.principalName(user.getUsername()).authorizationGrantType(PASSWORD_GRANT)
					.authorizedScopes(authorizedScopes);

			OAuth2TokenContext tokenContext = tokenContextBuilder.tokenType(OAuth2TokenType.ACCESS_TOKEN).build();
			OAuth2Token generatedAccessToken = tokenGenerator.generate(tokenContext);
			if (generatedAccessToken == null) {
				throw new OAuth2AuthenticationException(new OAuth2Error(OAuth2ErrorCodes.SERVER_ERROR,
						"The token generator failed to generate the access token.", ERROR_URI));
			}

			OAuth2AccessToken accessToken = new OAuth2AccessToken(OAuth2AccessToken.TokenType.BEARER,
					generatedAccessToken.getTokenValue(), generatedAccessToken.getIssuedAt(),
					generatedAccessToken.getExpiresAt(), authorizedScopes);
			if (generatedAccessToken instanceof ClaimAccessor claims) {
				authorizationBuilder.token(accessToken,
						metadata -> metadata.put(OAuth2Authorization.Token.CLAIMS_METADATA_NAME, claims.getClaims()));
			} else {
				authorizationBuilder.accessToken(accessToken);
			}

			authorizationService.save(authorizationBuilder.build());
			return new OAuth2AccessTokenAuthenticationToken(registeredClient, clientPrincipal, accessToken);
		} finally {
			passwordGrant.eraseCredentials();
		}
	}

	@Override
	public boolean supports(Class<?> authentication) {
		return PasswordGrantAuthenticationToken.class.isAssignableFrom(authentication);
	}

	private static OAuth2ClientAuthenticationToken getAuthenticatedClient(Authentication authentication) {
		if (authentication.getPrincipal() instanceof OAuth2ClientAuthenticationToken clientPrincipal
				&& clientPrincipal.isAuthenticated() && clientPrincipal.getRegisteredClient() != null) {
			return clientPrincipal;
		}
		throw new OAuth2AuthenticationException(OAuth2ErrorCodes.INVALID_CLIENT);
	}

	private static OAuth2AuthenticationException invalidCredentials() {
		return new OAuth2AuthenticationException(
				new OAuth2Error(OAuth2ErrorCodes.INVALID_GRANT, "Invalid credentials", ERROR_URI));
	}
}
