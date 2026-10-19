import { useState } from "react";
import { RefreshCw } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { OrderColumn } from "@/features/orders/components/order-column";
import {
  orderStatuses,
  orderStatusLabels,
} from "@/features/orders/lib/order-status";
import {
  fetchAllOrders,
  updateOrderStatus,
} from "@/features/orders/services/order-service";
import type { Order, OrderStatus } from "@/features/orders/types/order";
import { usePaginatedList } from "@/hooks/use-paginated-list";
import { ApiError } from "@/lib/api-client";

export function AdminOrdersPage() {
  const {
    items: loadedOrders,
    hasMore,
    totalElements,
    loading,
    error,
    loadMore,
    retry,
    reload,
  } = usePaginatedList(fetchAllOrders);
  const [changedOrders, setChangedOrders] = useState<Record<string, Order>>({});
  const [actionErrors, setActionErrors] = useState<Record<string, string>>({});
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const orders = loadedOrders.map((order) => changedOrders[order.id] ?? order);

  async function changeStatus(order: Order, status: OrderStatus) {
    if (pendingId) return;
    setPendingId(order.id);
    setActionErrors((current) => ({ ...current, [order.id]: "" }));
    try {
      const updated = await updateOrderStatus(order.id, status);
      setChangedOrders((current) => ({ ...current, [order.id]: updated }));
      setAnnouncement(
        `Pedido ${order.id.slice(0, 8).toUpperCase()} atualizado para ${orderStatusLabels[updated.status]}.`,
      );
    } catch (caught) {
      setActionErrors((current) => ({
        ...current,
        [order.id]:
          caught instanceof ApiError && caught.status === 409
            ? "O status mudou. Atualize o quadro para ver a versão mais recente."
            : "Não foi possível atualizar o status. Tente novamente.",
      }));
    } finally {
      setPendingId(null);
    }
  }

  function refreshOrders() {
    setChangedOrders({});
    setActionErrors({});
    setAnnouncement("");
    reload();
  }

  return (
    <AppShell wide>
      <div className="space-y-7">
        <p role="status" className="sr-only">
          {announcement}
        </p>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Administração
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">Pedidos</h1>
            <p className="text-sm text-muted-foreground">
              Acompanhe as entregas e atualize o status de cada pedido.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={refreshOrders}
            disabled={loading || pendingId !== null}
          >
            <RefreshCw aria-hidden="true" />
            Atualizar
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-y py-4 text-sm">
          <strong>
            {orders.length} de {totalElements} pedidos carregados
          </strong>
          <span className="text-muted-foreground">Agrupados por status</span>
        </div>

        <div
          role="region"
          aria-label="Quadro de pedidos por status"
          tabIndex={0}
          className="-mx-4 overflow-x-auto px-4 pb-3 outline-none focus-visible:ring-2 focus-visible:ring-ring sm:-mx-6 sm:px-6"
        >
          <div className="grid min-w-[90rem] grid-cols-5 items-start gap-4">
            {orderStatuses.map((status) => (
              <OrderColumn
                key={status}
                status={status}
                orders={orders.filter((order) => order.status === status)}
                pendingId={pendingId}
                actionErrors={actionErrors}
                onStatusChange={changeStatus}
              />
            ))}
          </div>
        </div>

        {loading && (
          <p role="status" className="text-sm text-muted-foreground">
            Carregando pedidos...
          </p>
        )}
        {error && (
          <div
            role="alert"
            className="flex flex-wrap items-center gap-3 text-sm"
          >
            <span>Não foi possível carregar os pedidos.</span>
            <Button variant="outline" onClick={retry}>
              Tentar novamente
            </Button>
          </div>
        )}
        {hasMore && !error && (
          <div className="flex justify-center">
            <Button variant="outline" onClick={loadMore} disabled={loading}>
              {loading ? "Carregando..." : "Carregar mais"}
            </Button>
          </div>
        )}
      </div>
    </AppShell>
  );
}
