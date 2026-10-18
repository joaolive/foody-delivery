package com.joaolive.foody_delivery.auth.web;

public class InvalidUserIdentityException extends RuntimeException {
  public InvalidUserIdentityException(String message) {
    super(message);
  }
}
