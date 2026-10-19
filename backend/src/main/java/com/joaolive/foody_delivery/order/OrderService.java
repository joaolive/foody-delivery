package com.joaolive.foody_delivery.order;

import com.joaolive.foody_delivery.address.SavedAddress;
import com.joaolive.foody_delivery.address.SavedAddressRepository;
import com.joaolive.foody_delivery.common.ResourceNotFoundException;
import com.joaolive.foody_delivery.order.dto.CreateOrderItemRequest;
import com.joaolive.foody_delivery.order.dto.CreateOrderRequest;
import com.joaolive.foody_delivery.order.dto.OrderResponse;
import com.joaolive.foody_delivery.product.Product;
import com.joaolive.foody_delivery.product.ProductRepository;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {
	private final OrderRepository orderRepository;
	private final ProductRepository productRepository;
	private final SavedAddressRepository addressRepository;

	public OrderService(OrderRepository orderRepository, ProductRepository productRepository,
			SavedAddressRepository addressRepository) {
		this.orderRepository = orderRepository;
		this.productRepository = productRepository;
		this.addressRepository = addressRepository;
	}

	@Transactional
	public OrderResponse createOrder(CreateOrderRequest request, UUID clientId) {
		SavedAddress address = addressRepository.findByIdAndUserId(request.addressId(), clientId)
				.orElseThrow(() -> new ResourceNotFoundException("Address not found: " + request.addressId()));
		Order order = new Order(clientId, address.getAddress());
		for (CreateOrderItemRequest item : request.items()) {
			Product product = productRepository.findById(item.productId())
					.orElseThrow(() -> new ResourceNotFoundException("Product not found: " + item.productId()));
			order.addItem(product.getId(), product.getPrice(), item.quantity());
		}
		return OrderResponse.fromEntity(orderRepository.saveAndFlush(order));
	}

	@Transactional(readOnly = true)
	public Page<OrderResponse> findOrdersForUser(UUID userId, Pageable pageable) {
		return orderRepository.findByClientId(userId, pageable).map(OrderResponse::fromEntity);
	}

	@Transactional(readOnly = true)
	public Page<OrderResponse> findAllOrders(UUID clientId, Pageable pageable) {
		return orderRepository.findAllOrders(clientId, pageable).map(OrderResponse::fromEntity);
	}

	@Transactional(readOnly = true)
	public OrderResponse findOrderById(UUID orderId, UUID userId, boolean canViewAllOrders) {
		Order order = orderRepository.findById(orderId)
				.orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));
		if (!canViewAllOrders && !order.getClientId().equals(userId)) {
			throw new ResourceNotFoundException("Order not found: " + orderId);
		}
		return OrderResponse.fromEntity(order);
	}

	@Transactional
	public OrderResponse updateOrderStatus(UUID orderId, OrderStatus status) {
		Order order = orderRepository.findById(orderId)
				.orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));
		order.changeStatus(status);
		return OrderResponse.fromEntity(orderRepository.saveAndFlush(order));
	}

	@Transactional
	public OrderResponse cancelOwnOrder(UUID orderId, UUID clientId) {
		Order order = orderRepository.findById(orderId)
				.orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));
		if (!order.getClientId().equals(clientId)) {
			throw new ResourceNotFoundException("Order not found: " + orderId);
		}
		if (order.getStatus() != OrderStatus.RECEIVED && order.getStatus() != OrderStatus.PREPARING) {
			throw new InvalidOrderStatusTransitionException(order.getStatus(), OrderStatus.CANCELED);
		}
		order.changeStatus(OrderStatus.CANCELED);
		return OrderResponse.fromEntity(orderRepository.saveAndFlush(order));
	}
}
