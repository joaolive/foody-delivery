import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import type { OrderSummary } from "@/features/orders/types/order";
import { formatDate } from "@/lib/format";

type OrderCardProps = {
  order: OrderSummary;
  pending: boolean;
  actionsDisabled: boolean;
  linkTitle?: boolean;
  error?: string;
  onCancel: (order: OrderSummary) => void;
};

export function OrderCard({
  order,
  pending,
  actionsDisabled,
  linkTitle = true,
  error,
  onCancel,
}: OrderCardProps) {
  const [confirming, setConfirming] = useState(false);
  const canCancel =
    order.status === "RECEBIDO" || order.status === "EM_PREPARO";

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
                {linkTitle ? (
                  <Link
                    to={`/orders/${order.id}`}
                    className="rounded-md hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    #{order.id.slice(0, 8).toUpperCase()}
                  </Link>
                ) : (
                  <>#{order.id.slice(0, 8).toUpperCase()}</>
                )}
              </h2>
            </CardTitle>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
        <CardDescription className="flex items-center gap-2 text-xs">
          <CalendarDays aria-hidden="true" className="size-4" />
          {formatDate(order.createdAt)}
        </CardDescription>
        {linkTitle && (
          <Link
            to={`/orders/${order.id}`}
            className="text-sm font-medium text-primary underline underline-offset-2"
          >
            Ver detalhes
          </Link>
        )}
      </CardHeader>
      {canCancel && (
        <CardContent className="mt-auto space-y-3 border-t pt-4 text-sm">
          {confirming ? (
            <>
              <p className="text-sm font-medium">
                Deseja cancelar este pedido?
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="destructive"
                  disabled={actionsDisabled}
                  onClick={() => onCancel(order)}
                >
                  {pending ? "Cancelando..." : "Confirmar cancelamento"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={actionsDisabled}
                  onClick={() => setConfirming(false)}
                >
                  Voltar
                </Button>
              </div>
            </>
          ) : (
            <Button
              type="button"
              variant="outline"
              disabled={actionsDisabled}
              onClick={() => setConfirming(true)}
            >
              Cancelar pedido
            </Button>
          )}
          {error && (
            <p role="alert" className="text-xs text-destructive">
              {error}
            </p>
          )}
        </CardContent>
      )}
    </Card>
  );
}
