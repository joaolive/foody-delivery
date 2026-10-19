package com.joaolive.foody_delivery.address.dto;

import com.joaolive.foody_delivery.address.Address;
import java.util.UUID;

public record AddressResponse(UUID id, String address) {
	public static AddressResponse fromEntity(Address entity) {
		return new AddressResponse(entity.getId(), entity.getAddress());
	}
}
