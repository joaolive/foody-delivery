package com.joaolive.foody_delivery.address;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import lombok.EqualsAndHashCode;
import lombok.Getter;

@Getter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "tb_address")
public class SavedAddress {
	@Id
	@EqualsAndHashCode.Include
	private UUID id;

	@Column(name = "user_id", nullable = false)
	private UUID userId;

	@Column(nullable = false, length = 255)
	private String address;

	@Column(name = "created_at", nullable = false)
	private Instant createdAt;

	protected SavedAddress() {
	}

	public SavedAddress(UUID userId, String address) {
		this.id = UUID.randomUUID();
		this.userId = userId;
		this.address = address;
	}

	@PrePersist
	private void prePersist() {
		createdAt = Instant.now();
	}
}
