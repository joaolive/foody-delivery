import type { CreateOrderData, Order } from "@/features/orders/types/order";
import { apiRequest } from "@/lib/api-client";
import type { PageResult } from "@/lib/pagination";

export function fetchMyOrders(page: number, signal: AbortSignal) {
  return apiRequest<PageResult<Order>>(`/orders/mine?page=${page}&size=20`, {
    signal,
  });
}

export function createOrder(data: CreateOrderData) {
  return apiRequest<Order>("/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
