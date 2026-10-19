import type {
  CreateOrderData,
  Order,
  OrderStatus,
} from "@/features/orders/types/order";
import { apiRequest } from "@/lib/api-client";
import type { PageResult } from "@/lib/pagination";

export function fetchMyOrders(page: number, signal: AbortSignal) {
  return apiRequest<PageResult<Order>>(`/orders/mine?page=${page}&size=20`, {
    signal,
  });
}

export function fetchAllOrders(page: number, signal: AbortSignal) {
  return apiRequest<PageResult<Order>>(`/orders?page=${page}&size=20`, {
    signal,
  });
}

export function fetchOrderById(orderId: string, signal: AbortSignal) {
  return apiRequest<Order>(`/orders/${orderId}`, { signal });
}

export function createOrder(data: CreateOrderData) {
  return apiRequest<Order>("/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateOrderStatus(orderId: string, status: OrderStatus) {
  return apiRequest<Order>(`/orders/${orderId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function cancelOwnOrder(orderId: string) {
  return apiRequest<Order>(`/orders/${orderId}/cancel`, { method: "PATCH" });
}
