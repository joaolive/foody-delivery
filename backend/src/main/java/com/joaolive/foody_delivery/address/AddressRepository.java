package com.joaolive.foody_delivery.address;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepository extends JpaRepository<Address, UUID> {
	List<Address> findByUserIdOrderByCreatedAtDesc(UUID userId);

	Optional<Address> findByIdAndUserId(UUID id, UUID userId);
}
