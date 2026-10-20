package com.joaolive.foody_delivery.order;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.EqualsAndHashCode;
import lombok.Getter;

@Getter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@Entity
@Table(name = "tb_order")
public class Order {
	@Id
	@EqualsAndHashCode.Include
	private UUID id;
	@Column(name = "client_id")
	private UUID clientId;

	@Column(name = "address_id", nullable = false)
	private UUID addressId;

	@Enumerated(EnumType.STRING)
	private OrderStatus status;
	@Version
	@Column(nullable = false)
	private long version;

	@Column(name = "created_at")
	private Instant createdAt;

	@Column(name = "updated_at")
	private Instant updatedAt;

	@Getter(AccessLevel.NONE)
	@OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
	@JoinColumn(name = "order_id", referencedColumnName = "id", insertable = false, updatable = false)
	private Set<OrderItem> items = new HashSet<>();

	protected Order() {
	}

	public Order(UUID clientId, UUID addressId) {
		this.id = UUID.randomUUID();
		this.clientId = clientId;
		this.addressId = addressId;
		this.status = OrderStatus.RECEBIDO;
	}

	public Set<OrderItem> getItems() {
		return Set.copyOf(items);
	}

	public void addItem(UUID productId, BigDecimal unitPrice, int quantity) {
		OrderItem item = new OrderItem(new OrderItemPK(id, productId), unitPrice, quantity);
		for (OrderItem existing : items) {
			if (existing.equals(item)) {
				existing.increaseQuantity(quantity);
				return;
			}
		}
		items.add(item);
	}

	public boolean removeItem(UUID productId) {
		return items.removeIf(item -> item.getId().getProductId().equals(productId));
	}

	public void changeStatus(OrderStatus status) {
		if (this.status == status) {
			return;
		}
		boolean allowed = switch (this.status) {
			case RECEBIDO -> status == OrderStatus.EM_PREPARO || status == OrderStatus.CANCELADO;
			case EM_PREPARO -> status == OrderStatus.SAIU_PARA_ENTREGA || status == OrderStatus.CANCELADO;
			case SAIU_PARA_ENTREGA -> status == OrderStatus.ENTREGUE || status == OrderStatus.CANCELADO;
			case ENTREGUE, CANCELADO -> false;
		};
		if (!allowed) {
			throw new InvalidOrderStatusTransitionException(this.status, status);
		}
		this.status = status;
		updatedAt = Instant.now();
	}

	@PrePersist
	private void prePersist() {
		createdAt = Instant.now();
	}

	@PreUpdate
	private void preUpdate() {
		updatedAt = Instant.now();
	}
}
