package com.joaolive.foody_delivery.address;

import com.joaolive.foody_delivery.address.dto.AddressResponse;
import com.joaolive.foody_delivery.address.dto.CreateAddressRequest;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SavedAddressService {
	private final SavedAddressRepository repository;

	public SavedAddressService(SavedAddressRepository repository) {
		this.repository = repository;
	}

	@Transactional(readOnly = true)
	public List<AddressResponse> findForUser(UUID userId) {
		return repository.findByUserIdOrderByCreatedAtDesc(userId).stream().map(AddressResponse::fromEntity).toList();
	}

	@Transactional
	public AddressResponse create(CreateAddressRequest request, UUID userId) {
		SavedAddress saved = repository.save(new SavedAddress(userId, request.address().strip()));
		return AddressResponse.fromEntity(saved);
	}
}
