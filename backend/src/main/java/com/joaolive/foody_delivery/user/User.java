package com.joaolive.foody_delivery.user;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
@Table(name = "tb_user")
public class User {
	@Id
	@EqualsAndHashCode.Include
	private UUID id;
	private String name;
	private String email;
	private String password;
	@Enumerated(EnumType.STRING)
	private Role role;
	private Instant createdAt;

	protected User() {
	}

	public User(String name, String email, String password, Role role) {
		id = UUID.randomUUID();
		this.name = name;
		this.email = email;
		this.password = password;
		this.role = role;
	}

	@PrePersist
	public void prePersist() {
		createdAt = Instant.now();
	}
}
