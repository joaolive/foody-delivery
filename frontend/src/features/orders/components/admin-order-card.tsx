import { ChevronDown } from "lucide-react";
import { Link } from "react-router";

import { buttonVariants } from "@/components/ui/button-variants";
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
  nextOrderStatuses,
  orderStatusLabels,
} from "@/features/orders/lib/order-status";
import type {
  Order,
  OrderStatus,
  OrderSummary,
} from "@/features/orders/types/order";
import { formatDate } from "@/lib/format";

type AdminOrderCardProps = {
  order: OrderSummary;
  pending: boolean;
  actionsDisabled: boolean;
  linkTitle?: boolean;
  clientName?: Order["clientName"];
  error?: string;
  onStatusChange: (order: OrderSummary, status: OrderStatus) => void;
};

export function AdminOrderCard({
  order,
  pending,
  actionsDisabled,
  linkTitle = true,
  clientName,
  error,
  onStatusChange,
}: AdminOrderCardProps) {
  const transitions = nextOrderStatuses[order.status];

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
        {linkTitle && (
          <Link
            to={`/admin/orders/${order.id}`}
            className="text-xs font-medium text-primary underline underline-offset-2"
          >
            Ver detalhes
          </Link>
        )}
      </CardHeader>
      {(clientName || error) && (
        <CardContent className="space-y-3 text-sm">
          {clientName && (
            <p className="text-xs text-muted-foreground">
              Cliente {clientName}
            </p>
          )}
          {error && (
            <p role="alert" className="text-xs text-destructive">
              {error}
            </p>
          )}
        </CardContent>
      )}
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
                    variant={status === "CANCELADO" ? "destructive" : "default"}
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
