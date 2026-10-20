package com.joaolive.foody_delivery.auth.web;

public class InvalidUserIdentityException extends RuntimeException {
	public InvalidUserIdentityException() {
		super("Invalid or missing user identity in request context");
	}
}
