import { useState } from "react";
import { RefreshCw } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/common/page-header";
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
import type { OrderStatus, OrderSummary } from "@/features/orders/types/order";
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
  const [changedOrders, setChangedOrders] = useState<
    Record<string, OrderSummary>
  >({});
  const [actionErrors, setActionErrors] = useState<Record<string, string>>({});
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const orders = loadedOrders.map((order) => changedOrders[order.id] ?? order);

  async function changeStatus(order: OrderSummary, status: OrderStatus) {
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
    <AppShell>
      <div className="space-y-7">
        <p role="status" className="sr-only">
          {announcement}
        </p>
        <PageHeader
          eyebrow="Administração"
          title="Pedidos"
          description="Acompanhe as entregas e atualize o status de cada pedido."
          action={
            <Button
              variant="outline"
              onClick={refreshOrders}
              disabled={loading || pendingId !== null}
            >
              <RefreshCw aria-hidden="true" />
              Atualizar
            </Button>
          }
        />

        <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
          <p className="flex items-baseline gap-1.5">
            <strong className="text-xl font-bold tabular-nums">
              {orders.length}
            </strong>
            <span className="text-sm text-muted-foreground">
              de {totalElements} pedidos carregados
            </span>
          </p>
          <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Agrupados por status
          </span>
        </div>

        <div role="region" aria-label="Quadro de pedidos por status">
          <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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
