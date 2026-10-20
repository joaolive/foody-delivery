package com.joaolive.foody_delivery.order;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.joaolive.foody_delivery.order.dto.OrderSummaryResponse;
import jakarta.persistence.EntityManagerFactory;
import org.hibernate.SessionFactory;
import org.hibernate.stat.Statistics;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class OrderListQueryIntegrationTests {
	@Autowired
	private OrderService orderService;

	@Autowired
	private EntityManagerFactory entityManagerFactory;

	@Test
	void paginatedOrdersDoNotLoadItemsOrAddresses() {
		Statistics statistics = entityManagerFactory.unwrap(SessionFactory.class).getStatistics();
		boolean wasEnabled = statistics.isStatisticsEnabled();
		statistics.setStatisticsEnabled(true);
		try {
			statistics.clear();
			Page<OrderSummaryResponse> page = orderService.findAllOrders(null, PageRequest.of(0, 10));
			assertEquals(10, page.getNumberOfElements());
			assertTrue(statistics.getPrepareStatementCount() <= 2, "A page should only query orders and their count");
		} finally {
			statistics.setStatisticsEnabled(wasEnabled);
		}
	}
}
