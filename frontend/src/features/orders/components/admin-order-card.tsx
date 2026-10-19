import { ChevronDown } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import {
  orderItemCount,
  orderTotal,
} from "@/features/orders/lib/order-summary";
import {
  nextOrderStatuses,
  orderStatusLabels,
} from "@/features/orders/lib/order-status";
import type { Order, OrderStatus } from "@/features/orders/types/order";
import { formatCurrency, formatDate } from "@/lib/format";

type AdminOrderCardProps = {
  order: Order;
  pending: boolean;
  actionsDisabled: boolean;
  error?: string;
  onStatusChange: (order: Order, status: OrderStatus) => void;
};

export function AdminOrderCard({
  order,
  pending,
  actionsDisabled,
  error,
  onStatusChange,
}: AdminOrderCardProps) {
  const transitions = nextOrderStatuses[order.status];
  const itemCount = orderItemCount(order);

  return (
    <Card size="sm" className="gap-3 bg-card">
      <CardHeader className="gap-3">
        <div className="space-y-1">
          <p className="text-xs font-semibold tracking-wider text-muted-foreground">
            PEDIDO
          </p>
          <CardTitle>
            <h3 className="text-base font-semibold" title={order.id}>
              #{order.id.slice(0, 8).toUpperCase()}
            </h3>
          </CardTitle>
        </div>
        <CardDescription className="text-xs">
          Criado em {formatDate(order.createdAt)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">
            Entrega em
          </p>
          <p className="leading-relaxed break-words">{order.address}</p>
        </div>
        <div className="flex items-end justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Cliente #{order.clientId.slice(0, 8).toUpperCase()}
            <br />
            {itemCount} {itemCount === 1 ? "item" : "itens"}
          </p>
          <p className="font-semibold">{formatCurrency(orderTotal(order))}</p>
        </div>
        {error && (
          <p role="alert" className="text-xs text-destructive">
            {error}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex-wrap justify-between gap-3 bg-transparent">
        <OrderStatusBadge status={order.status} />
        {transitions.length > 0 ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              type="button"
              disabled={actionsDisabled}
              aria-label={`Alterar status do pedido ${order.id}`}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              {pending ? "Atualizando..." : "Alterar status"}
              <ChevronDown aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-48">
              <DropdownMenuLabel>Novo status</DropdownMenuLabel>
              {transitions.map((status) => (
                <DropdownMenuItem
                  key={status}
                  variant={status === "CANCELED" ? "destructive" : "default"}
                  onClick={() => onStatusChange(order, status)}
                >
                  {orderStatusLabels[status]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <span className="text-xs text-muted-foreground">Status final</span>
        )}
      </CardFooter>
    </Card>
  );
}
