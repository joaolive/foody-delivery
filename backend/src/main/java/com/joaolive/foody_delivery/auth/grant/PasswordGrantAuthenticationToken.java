package com.joaolive.foody_delivery.auth.grant;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.CredentialsContainer;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.server.authorization.authentication.OAuth2AuthorizationGrantAuthenticationToken;

public class PasswordGrantAuthenticationToken extends OAuth2AuthorizationGrantAuthenticationToken
    implements CredentialsContainer {

  private static final long serialVersionUID = 1L;

  private final String username;
  private String password;
  private final Set<String> scopes;

  public PasswordGrantAuthenticationToken(
      Authentication clientPrincipal, String username, String password, Set<String> scopes) {

    super(new AuthorizationGrantType("password"), clientPrincipal, Collections.emptyMap());

    this.username = username;
    this.password = password;
    this.scopes = Collections.unmodifiableSet(new HashSet<>(scopes));
  }

  public String getUsername() {
    return this.username;
  }

  public String getPassword() {
    return this.password;
  }

  public Set<String> getScopes() {
    return this.scopes;
  }

  @Override
  public void eraseCredentials() {
    this.password = null;
  }
}
