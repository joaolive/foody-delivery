import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import {
  orderItemCount,
  orderTotal,
} from "@/features/orders/lib/order-summary";
import type { Order } from "@/features/orders/types/order";
import { formatCurrency, formatDate } from "@/lib/format";

export function OrderCard({ order }: { order: Order }) {
  const itemCount = orderItemCount(order);
  const total = orderTotal(order);

  return (
    <Card>
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>
              <h2 className="text-base font-semibold" title={order.id}>
                Pedido #{order.id.slice(0, 8).toUpperCase()}
              </h2>
            </CardTitle>
            <CardDescription>{formatDate(order.createdAt)}</CardDescription>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
      </CardHeader>
      <CardContent className="flex flex-wrap items-end justify-between gap-4 text-sm">
        <div className="space-y-2">
          <p className="font-medium">Entrega em</p>
          <p className="max-w-xl text-muted-foreground">{order.address}</p>
        </div>
        <div className="text-right">
          <p className="text-muted-foreground">
            {itemCount} {itemCount === 1 ? "item" : "itens"}
          </p>
          <p className="font-semibold">{formatCurrency(total)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
