import type { Order } from "@/features/orders/types/order";

export function orderItemCount(order: Order) {
  return order.items.reduce((count, item) => count + item.quantity, 0);
}

export function orderTotal(order: Order) {
  return order.items.reduce(
    (amount, item) => amount + item.unitPrice * item.quantity,
    0,
  );
}
