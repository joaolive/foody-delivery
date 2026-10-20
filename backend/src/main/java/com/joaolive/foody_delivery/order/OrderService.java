package com.joaolive.foody_delivery.order;

import com.joaolive.foody_delivery.address.Address;
import com.joaolive.foody_delivery.address.AddressRepository;
import com.joaolive.foody_delivery.common.ResourceNotFoundException;
import com.joaolive.foody_delivery.order.dto.CreateOrderItemRequest;
import com.joaolive.foody_delivery.order.dto.CreateOrderRequest;
import com.joaolive.foody_delivery.order.dto.OrderResponse;
import com.joaolive.foody_delivery.order.dto.OrderSummaryResponse;
import com.joaolive.foody_delivery.product.Product;
import com.joaolive.foody_delivery.product.ProductRepository;
import com.joaolive.foody_delivery.user.UserService;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {
	private final OrderRepository orderRepository;
	private final ProductRepository productRepository;
	private final AddressRepository addressRepository;
	private final UserService userService;

	public OrderService(OrderRepository orderRepository, ProductRepository productRepository,
			AddressRepository addressRepository, UserService userService) {
		this.orderRepository = orderRepository;
		this.productRepository = productRepository;
		this.addressRepository = addressRepository;
		this.userService = userService;
	}

	@Transactional
	public OrderResponse createOrder(CreateOrderRequest request, UUID clientId) {
		Address address = addressRepository.findByIdAndUserId(request.addressId(), clientId)
				.orElseThrow(() -> new ResourceNotFoundException("Address not found: " + request.addressId()));
		Order order = new Order(clientId, address.getId());
		for (CreateOrderItemRequest item : request.items()) {
			Product product = productRepository.findById(item.productId())
					.orElseThrow(() -> new ResourceNotFoundException("Product not found: " + item.productId()));
			order.addItem(product.getId(), product.getPrice(), item.quantity());
		}
		return OrderResponse.fromEntity(orderRepository.saveAndFlush(order), address.getAddress(),
				userService.findNameById(clientId));
	}

	@Transactional(readOnly = true)
	public Page<OrderSummaryResponse> findOrdersForUser(UUID userId, Pageable pageable) {
		return orderRepository.findByClientId(userId, pageable).map(OrderSummaryResponse::fromEntity);
	}

	@Transactional(readOnly = true)
	public Page<OrderSummaryResponse> findAllOrders(UUID clientId, Pageable pageable) {
		return orderRepository.findAllOrders(clientId, pageable).map(OrderSummaryResponse::fromEntity);
	}

	@Transactional(readOnly = true)
	public OrderResponse findOrderById(UUID orderId, UUID userId, boolean canViewAllOrders) {
		Order order = requireOrder(orderId);
		if (!canViewAllOrders && !order.getClientId().equals(userId)) {
			throw new ResourceNotFoundException("Order not found: " + orderId);
		}
		return toResponse(order);
	}

	@Transactional
	public OrderResponse updateOrderStatus(UUID orderId, OrderStatus status) {
		Order order = requireOrder(orderId);
		order.changeStatus(status);
		return toResponse(orderRepository.saveAndFlush(order));
	}

	@Transactional
	public OrderResponse cancelOwnOrder(UUID orderId, UUID clientId) {
		Order order = requireOrder(orderId);
		if (!order.getClientId().equals(clientId)) {
			throw new ResourceNotFoundException("Order not found: " + orderId);
		}
		if (order.getStatus() != OrderStatus.RECEBIDO && order.getStatus() != OrderStatus.EM_PREPARO) {
			throw new InvalidOrderStatusTransitionException(order.getStatus(), OrderStatus.CANCELADO);
		}
		order.changeStatus(OrderStatus.CANCELADO);
		return toResponse(orderRepository.saveAndFlush(order));
	}

	private OrderResponse toResponse(Order order) {
		Address address = addressRepository.findById(order.getAddressId())
				.orElseThrow(() -> new ResourceNotFoundException("Address not found: " + order.getAddressId()));
		return OrderResponse.fromEntity(order, address.getAddress(), userService.findNameById(order.getClientId()));
	}

	private Order requireOrder(UUID orderId) {
		return orderRepository.findById(orderId)
				.orElseThrow(() -> new ResourceNotFoundException("Order not found: " + orderId));
	}
}
