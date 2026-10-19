package com.joaolive.foody_delivery.address;

import com.joaolive.foody_delivery.address.dto.AddressResponse;
import com.joaolive.foody_delivery.address.dto.CreateAddressRequest;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AddressService {
	private final AddressRepository repository;

	public AddressService(AddressRepository repository) {
		this.repository = repository;
	}

	@Transactional(readOnly = true)
	public List<AddressResponse> findForUser(UUID userId) {
		return repository.findByUserIdOrderByCreatedAtDesc(userId).stream().map(AddressResponse::fromEntity).toList();
	}

	@Transactional
	public AddressResponse create(CreateAddressRequest request, UUID userId) {
		Address address = repository.save(new Address(userId, request.address().strip()));
		return AddressResponse.fromEntity(address);
	}
}
