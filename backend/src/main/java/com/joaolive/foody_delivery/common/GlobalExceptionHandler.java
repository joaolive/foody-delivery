package com.joaolive.foody_delivery.common;

import com.joaolive.foody_delivery.auth.web.InvalidUserIdentityException;
import com.joaolive.foody_delivery.order.InvalidOrderStatusTransitionException;
import com.joaolive.foody_delivery.user.EmailAlreadyExistsException;
import java.net.URI;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@RestControllerAdvice
public class GlobalExceptionHandler {
	@ExceptionHandler(ResourceNotFoundException.class)
	public ProblemDetail handleResourceNotFound(ResourceNotFoundException ex) {
		ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.NOT_FOUND, ex.getMessage());
		problemDetail.setTitle("Resource Not Found");
		problemDetail.setProperty("timestamp", Instant.now());
		return problemDetail;
	}

	@ExceptionHandler(EmailAlreadyExistsException.class)
	public ProblemDetail handleEmailAlreadyExists(EmailAlreadyExistsException ex) {
		ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, ex.getMessage());
		problemDetail.setTitle("Email Already Registered");
		problemDetail.setProperty("timestamp", Instant.now());
		return problemDetail;
	}

	@ExceptionHandler(InvalidUserIdentityException.class)
	public ProblemDetail handleInvalidUserIdentity(InvalidUserIdentityException ex) {
		ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.UNAUTHORIZED, ex.getMessage());
		problemDetail.setTitle("Unauthorized");
		problemDetail.setProperty("timestamp", Instant.now());
		return problemDetail;
	}

	@ExceptionHandler(AccessDeniedException.class)
	public ProblemDetail handleAccessDenied(AccessDeniedException ex) {
		ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.FORBIDDEN, "Access denied");
		problemDetail.setTitle("Forbidden");
		problemDetail.setProperty("timestamp", Instant.now());
		return problemDetail;
	}

	@ExceptionHandler(InvalidOrderStatusTransitionException.class)
	public ProblemDetail handleInvalidOrderStatusTransition(InvalidOrderStatusTransitionException ex) {
		ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT, ex.getMessage());
		problemDetail.setTitle("Invalid Order Status Transition");
		problemDetail.setProperty("timestamp", Instant.now());
		return problemDetail;
	}

	@ExceptionHandler(HttpMessageNotReadableException.class)
	public ProblemDetail handleUnreadableMessage(HttpMessageNotReadableException ex) {
		ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST,
				"Invalid request payload");
		problemDetail.setTitle("Bad Request");
		problemDetail.setProperty("timestamp", Instant.now());
		return problemDetail;
	}

	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	public ProblemDetail handleInvalidParameter(MethodArgumentTypeMismatchException ex) {
		ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST,
				"Invalid value for parameter: " + ex.getName());
		problemDetail.setTitle("Bad Request");
		problemDetail.setProperty("timestamp", Instant.now());
		return problemDetail;
	}

	@ExceptionHandler(DataIntegrityViolationException.class)
	public ProblemDetail handleDataIntegrityViolation(DataIntegrityViolationException ex) {
		ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.CONFLICT,
				"A database conflict or constraint violation occurred.");
		problemDetail.setTitle("Resource Conflict");
		problemDetail.setType(URI.create("https://api.javanews.com/errors/conflict"));
		problemDetail.setProperty("timestamp", Instant.now());
		return problemDetail;
	}

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ProblemDetail handleValidationException(MethodArgumentNotValidException ex) {
		List<String> errors = ex.getBindingResult().getFieldErrors().stream()
				.map(error -> error.getField() + ": " + error.getDefaultMessage()).collect(Collectors.toList());
		ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST,
				"Invalid request payload");
		problemDetail.setTitle("Bad Request");
		problemDetail.setType(URI.create("https://api.javanews.com/errors/bad-request"));
		problemDetail.setProperty("invalid_fields", errors);
		problemDetail.setProperty("timestamp", Instant.now());
		return problemDetail;
	}

	@ExceptionHandler(Exception.class)
	public ProblemDetail handleUncaughtException(Exception ex) {
		ex.printStackTrace();
		ProblemDetail problemDetail = ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR,
				"An unexpected internal server error occurred.");
		problemDetail.setTitle("Internal Server Error");
		problemDetail.setType(URI.create("https://api.javanews.com/errors/internal-server-error"));
		problemDetail.setProperty("timestamp", Instant.now());
		return problemDetail;
	}
}
