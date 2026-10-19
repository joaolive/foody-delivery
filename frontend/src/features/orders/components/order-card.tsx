import { CalendarDays, MapPin } from "lucide-react";

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
    <Card className="h-full rounded-2xl shadow-sm ring-border/90">
      <CardHeader className="gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <p className="text-xs font-bold tracking-[0.14em] text-muted-foreground uppercase">
              Pedido
            </p>
            <CardTitle>
              <h2 className="text-lg font-bold tracking-tight" title={order.id}>
                #{order.id.slice(0, 8).toUpperCase()}
              </h2>
            </CardTitle>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
        <CardDescription className="flex items-center gap-2 text-xs">
          <CalendarDays aria-hidden="true" className="size-4" />
          {formatDate(order.createdAt)}
        </CardDescription>
      </CardHeader>
      <CardContent className="mt-auto space-y-4 text-sm">
        <div className="flex items-start gap-3 rounded-xl bg-muted/50 p-3.5">
          <MapPin
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-primary"
          />
          <div className="min-w-0 space-y-1">
            <p className="text-xs font-semibold text-muted-foreground">
              Entrega em
            </p>
            <p className="leading-relaxed break-words">{order.address}</p>
          </div>
        </div>
        <div className="flex items-end justify-between gap-4 border-t pt-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Itens</p>
            <p className="font-semibold tabular-nums">{itemCount}</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-base font-bold text-primary tabular-nums">
              {formatCurrency(total)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
