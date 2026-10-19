package com.joaolive.foody_delivery.order;

import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrderRepository extends JpaRepository<Order, UUID> {
	Page<Order> findByClientId(UUID clientId, Pageable pageable);

	@Query("SELECT o FROM Order o WHERE (:clientId IS NULL OR o.clientId = :clientId)")
	Page<Order> findAllOrders(@Param("clientId") UUID clientId, Pageable pageable);
}
