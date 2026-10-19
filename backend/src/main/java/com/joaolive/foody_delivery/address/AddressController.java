package com.joaolive.foody_delivery.address;

import com.joaolive.foody_delivery.address.dto.AddressResponse;
import com.joaolive.foody_delivery.address.dto.CreateAddressRequest;
import com.joaolive.foody_delivery.auth.web.CurrentUser;
import com.joaolive.foody_delivery.auth.web.UserContext;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/addresses")
public class AddressController {
	private final AddressService service;

	public AddressController(AddressService service) {
		this.service = service;
	}

	@PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
	@GetMapping
	public List<AddressResponse> findForUser(@CurrentUser UserContext user) {
		return service.findForUser(user.id());
	}

	@PreAuthorize("hasAnyRole('ADMIN', 'CLIENT')")
	@PostMapping
	public ResponseEntity<AddressResponse> create(@Valid @RequestBody CreateAddressRequest request,
			@CurrentUser UserContext user) {
		return ResponseEntity.status(HttpStatus.CREATED).body(service.create(request, user.id()));
	}
}
