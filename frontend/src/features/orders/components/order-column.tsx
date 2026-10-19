import { Badge } from "@/components/ui/badge";
import { AdminOrderCard } from "@/features/orders/components/admin-order-card";
import {
  orderStatusDotClasses,
  orderStatusLabels,
} from "@/features/orders/lib/order-status";
import type { Order, OrderStatus } from "@/features/orders/types/order";

type OrderColumnProps = {
  status: OrderStatus;
  orders: Order[];
  pendingId: string | null;
  actionErrors: Record<string, string>;
  onStatusChange: (order: Order, status: OrderStatus) => void;
};

export function OrderColumn({
  status,
  orders,
  pendingId,
  actionErrors,
  onStatusChange,
}: OrderColumnProps) {
  const headingId = `order-column-${status.toLowerCase()}`;

  return (
    <section
      aria-labelledby={headingId}
      className="overflow-hidden rounded-xl border bg-card shadow-sm"
    >
      <div className="flex items-center gap-2 border-b bg-muted/30 px-4 py-4">
        <span
          aria-hidden="true"
          className={`size-2.5 rounded-full ${orderStatusDotClasses[status]}`}
        />
        <h2 id={headingId} className="text-sm font-semibold">
          {orderStatusLabels[status]}
        </h2>
        <Badge variant="secondary" className="ml-1 tabular-nums">
          {orders.length}
        </Badge>
      </div>
      {orders.length === 0 ? (
        <p className="px-4 py-6 text-center text-sm text-muted-foreground">
          Nenhum pedido carregado
        </p>
      ) : (
        <ol className="space-y-3 p-3">
          {orders.map((order) => (
            <li key={order.id}>
              <AdminOrderCard
                order={order}
                pending={pendingId === order.id}
                actionsDisabled={pendingId !== null}
                error={actionErrors[order.id]}
                onStatusChange={onStatusChange}
              />
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
