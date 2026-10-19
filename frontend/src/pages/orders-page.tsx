import { CircleCheck, ShoppingBag } from "lucide-react";
import { Link, useLocation } from "react-router";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/common/page-header";
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
        <PageHeader
          eyebrow="Suas entregas"
          title="Meus pedidos"
          description="Acompanhe o status e os detalhes das suas entregas."
          action={
            <Link to="/orders/new" className={buttonVariants({ size: "lg" })}>
              Novo pedido
            </Link>
          }
        />

        {created && (
          <p
            role="status"
            className="flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-800 dark:text-emerald-300"
          >
            <CircleCheck aria-hidden="true" className="size-4 shrink-0" />
            Pedido criado com sucesso.
          </p>
        )}

        {orders.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Exibindo {orders.length} de {totalElements} pedidos
          </p>
        )}

        {orders.length > 0 && (
          <ol className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {orders.map((order) => (
              <li key={order.id}>
                <OrderCard order={order} />
              </li>
            ))}
          </ol>
        )}

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
          <Card className="mx-auto max-w-lg rounded-2xl shadow-sm ring-border/90">
            <CardContent className="flex flex-col items-center gap-4 px-6 py-12 text-center">
              <span className="flex size-14 items-center justify-center rounded-2xl bg-secondary text-primary">
                <ShoppingBag aria-hidden="true" className="size-6" />
              </span>
              <div className="space-y-2">
                <h2 className="text-xl font-bold tracking-tight">
                  Seu primeiro pedido começa aqui
                </h2>
                <p className="text-sm leading-6 text-muted-foreground">
                  Escolha seus produtos e acompanhe cada etapa da entrega.
                </p>
              </div>
              <Link to="/orders/new" className={buttonVariants({ size: "lg" })}>
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
