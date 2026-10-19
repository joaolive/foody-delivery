package com.joaolive.foody_delivery.auth;

public class InvalidCredentialsException extends RuntimeException {
	public InvalidCredentialsException() {
		super("Invalid email or password");
	}
}
