package com.joaolive.foody_delivery.auth.web;

import java.security.Principal;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import org.springframework.core.MethodParameter;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

public class CurrentUserArgumentResolver implements HandlerMethodArgumentResolver {
	@Override
	public boolean supportsParameter(MethodParameter parameter) {
		return parameter.getParameterAnnotation(CurrentUser.class) != null
				&& parameter.getParameterType().equals(UserContext.class);
	}

	@Override
	public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer,
			NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {
		Principal principal = webRequest.getUserPrincipal();
		if (principal instanceof Authentication authentication && authentication.getPrincipal() instanceof Jwt jwt) {
			String userId = jwt.getClaimAsString("user_id");
			String username = jwt.getClaimAsString("username");
			if (StringUtils.hasText(userId) && StringUtils.hasText(username)) {
				try {
					Set<String> authorities = authentication.getAuthorities().stream()
							.map(GrantedAuthority::getAuthority).collect(Collectors.toSet());
					return new UserContext(UUID.fromString(userId), username, authorities);
				} catch (IllegalArgumentException ex) {
					throw new InvalidUserIdentityException();
				}
			}
		}
		throw new InvalidUserIdentityException();
	}
}
