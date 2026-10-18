package com.joaolive.foody_delivery.auth.grant;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.Set;
import org.springframework.lang.Nullable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2ErrorCodes;
import org.springframework.security.oauth2.core.endpoint.OAuth2ParameterNames;
import org.springframework.security.oauth2.server.authorization.authentication.OAuth2ClientAuthenticationToken;
import org.springframework.security.web.authentication.AuthenticationConverter;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;

public class PasswordGrantAuthenticationConverter implements AuthenticationConverter {
  private static final String USERNAME_PARAMETER = "username";
  private static final String PASSWORD_PARAMETER = "password";

  @Nullable
  @Override
  public Authentication convert(HttpServletRequest request) {

    MultiValueMap<String, String> parameters = getParameters(request);
    List<String> grantTypes = parameters.get(OAuth2ParameterNames.GRANT_TYPE);
    if (grantTypes == null || !grantTypes.contains("password")) {
      return null;
    }
    if (grantTypes.size() != 1) {
      throw new OAuth2AuthenticationException(OAuth2ErrorCodes.INVALID_REQUEST);
    }

    // scope (OPTIONAL)
    List<String> scopeValues = parameters.get(OAuth2ParameterNames.SCOPE);
    if (scopeValues != null && scopeValues.size() != 1) {
      throw new OAuth2AuthenticationException(OAuth2ErrorCodes.INVALID_REQUEST);
    }
    String scope = parameters.getFirst(OAuth2ParameterNames.SCOPE);

    // username (REQUIRED)
    String username = parameters.getFirst(USERNAME_PARAMETER);
    if (!StringUtils.hasText(username) || parameters.get(USERNAME_PARAMETER).size() != 1) {
      throw new OAuth2AuthenticationException(OAuth2ErrorCodes.INVALID_REQUEST);
    }

    // password (REQUIRED)
    String password = parameters.getFirst(PASSWORD_PARAMETER);
    if (!StringUtils.hasText(password) || parameters.get(PASSWORD_PARAMETER).size() != 1) {
      throw new OAuth2AuthenticationException(OAuth2ErrorCodes.INVALID_REQUEST);
    }

    Set<String> requestedScopes =
        StringUtils.hasText(scope)
            ? Set.copyOf(Arrays.asList(StringUtils.tokenizeToStringArray(scope, " ")))
            : Set.of();

    Authentication clientPrincipal = SecurityContextHolder.getContext().getAuthentication();
    if (!(clientPrincipal instanceof OAuth2ClientAuthenticationToken)) {
      throw new OAuth2AuthenticationException(OAuth2ErrorCodes.INVALID_CLIENT);
    }
    return new PasswordGrantAuthenticationToken(
        clientPrincipal, username, password, requestedScopes);
  }

  private static MultiValueMap<String, String> getParameters(HttpServletRequest request) {

    Map<String, String[]> parameterMap = request.getParameterMap();
    MultiValueMap<String, String> parameters = new LinkedMultiValueMap<>(parameterMap.size());
    parameterMap.forEach(
        (key, values) -> {
          if (values.length > 0) {
            for (String value : values) {
              parameters.add(key, value);
            }
          }
        });
    return parameters;
  }
}
