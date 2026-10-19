import { Link, useLocation } from "react-router";

import { AppShell } from "@/components/layout/app-shell";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OrderCard } from "@/features/orders/components/order-card";
import { fetchMyOrders } from "@/features/orders/services/order-service";
import { usePaginatedList } from "@/hooks/use-paginated-list";

export function OrdersPage() {
  const location = useLocation();
  const created = (location.state as { created?: boolean } | null)?.created;
  const {
    items: orders,
    hasMore,
    totalElements,
    loading,
    error,
    loadMore,
    retry,
  } = usePaginatedList(fetchMyOrders);

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Seus pedidos
            </p>
            <h1 className="text-3xl font-semibold tracking-tight">
              Meus pedidos
            </h1>
            <p className="text-sm text-muted-foreground">
              Acompanhe o status e os detalhes das suas entregas.
            </p>
          </div>
          <Link to="/orders/new" className={buttonVariants({ size: "lg" })}>
            Novo pedido
          </Link>
        </div>

        {created && (
          <p
            role="status"
            className="rounded-lg border bg-muted/50 px-4 py-3 text-sm"
          >
            Pedido criado com sucesso.
          </p>
        )}

        {orders.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Exibindo {orders.length} de {totalElements} pedidos
          </p>
        )}

        <div className="space-y-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
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

        {!loading && !error && orders.length === 0 && (
          <Card>
            <CardContent className="space-y-3 py-8 text-center">
              <h2 className="text-lg font-semibold">Nenhum pedido ainda</h2>
              <p className="text-sm text-muted-foreground">
                Escolha seus produtos e faça seu primeiro pedido.
              </p>
              <Link
                to="/orders/new"
                className={buttonVariants({ variant: "outline" })}
              >
                Fazer pedido
              </Link>
            </CardContent>
          </Card>
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
