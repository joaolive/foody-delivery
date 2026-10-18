package com.joaolive.foody_delivery.user;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "tb_user")
public class User {
  @Id private UUID id;
  private String name;
  private String email;
  private String password;
  private Role role;
  private Instant createdAt;

  @PrePersist
  public void prePersist() {
    createdAt = Instant.now();
  }
}
