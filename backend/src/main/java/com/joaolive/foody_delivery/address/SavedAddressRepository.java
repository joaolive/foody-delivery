package com.joaolive.foody_delivery.address;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SavedAddressRepository extends JpaRepository<SavedAddress, UUID> {
	List<SavedAddress> findByUserIdOrderByCreatedAtDesc(UUID userId);

	Optional<SavedAddress> findByIdAndUserId(UUID id, UUID userId);
}
