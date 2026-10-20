package com.joaolive.foody_delivery.user;

public class EmailAlreadyExistsException extends RuntimeException {
	public EmailAlreadyExistsException() {
		super("Email already registered");
	}
}
