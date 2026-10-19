import { ChevronDown, MapPin } from "lucide-react";
import { Link } from "react-router";

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
  DropdownMenuGroup,
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
  linkTitle?: boolean;
  error?: string;
  onStatusChange: (order: Order, status: OrderStatus) => void;
};

export function AdminOrderCard({
  order,
  pending,
  actionsDisabled,
  linkTitle = true,
  error,
  onStatusChange,
}: AdminOrderCardProps) {
  const transitions = nextOrderStatuses[order.status];
  const itemCount = orderItemCount(order);

  return (
    <Card
      size="sm"
      className="gap-3 rounded-xl bg-card shadow-sm ring-border/80"
    >
      <CardHeader className="gap-2">
        <div className="space-y-1">
          <p className="text-[0.7rem] font-bold tracking-[0.14em] text-muted-foreground uppercase">
            PEDIDO
          </p>
          <CardTitle>
            <h3 className="text-base font-bold tracking-tight" title={order.id}>
              {linkTitle ? (
                <Link
                  to={`/admin/orders/${order.id}`}
                  className="rounded-md hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  #{order.id.slice(0, 8).toUpperCase()}
                </Link>
              ) : (
                <>#{order.id.slice(0, 8).toUpperCase()}</>
              )}
            </h3>
          </CardTitle>
        </div>
        <CardDescription className="text-xs">
          Criado em {formatDate(order.createdAt)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex items-start gap-2 rounded-lg bg-muted/50 p-2.5">
          <MapPin
            aria-hidden="true"
            className="mt-0.5 size-3.5 shrink-0 text-primary"
          />
          <div className="min-w-0 space-y-1">
            <p className="text-xs font-medium text-muted-foreground">
              Entrega em
            </p>
            <p className="leading-relaxed break-words">{order.address}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Cliente #{order.clientId.slice(0, 8).toUpperCase()}
        </p>
        <div className="flex items-end justify-between gap-2 border-t pt-3">
          <p className="text-xs text-muted-foreground">
            {itemCount} {itemCount === 1 ? "item" : "itens"}
          </p>
          <p className="font-bold text-primary tabular-nums">
            {formatCurrency(orderTotal(order))}
          </p>
        </div>
        {error && (
          <p role="alert" className="text-xs text-destructive">
            {error}
          </p>
        )}
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-3 bg-muted/20">
        <div className="flex items-center justify-between gap-2">
          <OrderStatusBadge status={order.status} />
          {transitions.length === 0 && (
            <span className="text-xs text-muted-foreground">Status final</span>
          )}
        </div>
        {transitions.length > 0 ? (
          <DropdownMenu>
            <DropdownMenuTrigger
              type="button"
              disabled={actionsDisabled}
              aria-label={`Alterar status do pedido ${order.id}`}
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className: "w-full justify-between bg-card",
              })}
            >
              {pending ? "Atualizando..." : "Alterar status"}
              <ChevronDown aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-48">
              <DropdownMenuGroup>
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
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null}
      </CardFooter>
    </Card>
  );
}
