package com.joaolive.foody_delivery.order;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.joaolive.foody_delivery.address.Address;
import com.joaolive.foody_delivery.address.AddressRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.OptimisticLockException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class OrderConcurrencyIntegrationTests {
	@Autowired
	private EntityManagerFactory entityManagerFactory;

	@Autowired
	private AddressRepository addressRepository;

	@Test
	void aStaleStatusUpdateCannotOverwriteTheFirstUpdate() {
		Address address = addressRepository.findAll().getFirst();
		Order order = new Order(address.getUserId(), address.getId());
		EntityManager setup = entityManagerFactory.createEntityManager();
		try {
			setup.getTransaction().begin();
			setup.persist(order);
			setup.getTransaction().commit();
		} finally {
			setup.close();
		}

		EntityManager first = entityManagerFactory.createEntityManager();
		EntityManager stale = entityManagerFactory.createEntityManager();
		try {
			first.getTransaction().begin();
			stale.getTransaction().begin();
			Order firstCopy = first.find(Order.class, order.getId());
			Order staleCopy = stale.find(Order.class, order.getId());
			firstCopy.changeStatus(OrderStatus.EM_PREPARO);
			staleCopy.changeStatus(OrderStatus.CANCELADO);

			first.getTransaction().commit();
			assertThrows(OptimisticLockException.class, stale::flush);
			stale.getTransaction().rollback();
		} finally {
			first.close();
			stale.close();
		}

		EntityManager check = entityManagerFactory.createEntityManager();
		try {
			assertEquals(OrderStatus.EM_PREPARO, check.find(Order.class, order.getId()).getStatus());
		} finally {
			check.close();
		}
	}
}
