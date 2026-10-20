import { useEffect, useState } from "react";
import { ArrowLeft, MapPin, RefreshCw } from "lucide-react";
import { Link, useParams } from "react-router";

import { PageHeader } from "@/components/common/page-header";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { AdminOrderCard } from "@/features/orders/components/admin-order-card";
import { OrderCard } from "@/features/orders/components/order-card";
import { orderStatusLabels } from "@/features/orders/lib/order-status";
import {
  cancelOwnOrder,
  fetchOrderById,
  updateOrderStatus,
} from "@/features/orders/services/order-service";
import {
  orderItemCount,
  orderTotal,
} from "@/features/orders/lib/order-summary";
import type { OrderStatus, OrderSummary } from "@/features/orders/types/order";
import { ProductImage } from "@/features/products/components/product-image";
import { fetchProductById } from "@/features/products/services/product-service";
import type { Product } from "@/features/products/types/product";
import { useResource } from "@/hooks/use-resource";
import { ApiError } from "@/lib/api-client";
import { formatCurrency, formatDate } from "@/lib/format";

export function OrderDetailPage() {
  const { id } = useParams();
  const { session } = useAuth();
  const {
    data: order,
    loading,
    error,
    retry,
    replace,
  } = useResource(id, fetchOrderById);
  const [productsById, setProductsById] = useState<Record<string, Product>>({});
  const [pending, setPending] = useState(false);
  const [actionError, setActionError] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const isAdmin = session?.user.role === "ADMIN";
  const backPath = isAdmin ? "/admin/orders" : "/orders";

  useEffect(() => {
    if (!order) return;
    const controller = new AbortController();
    Promise.allSettled(
      order.items.map((item) =>
        fetchProductById(item.productId, controller.signal),
      ),
    ).then((results) => {
      if (controller.signal.aborted) return;
      setProductsById(
        Object.fromEntries(
          results.flatMap((result) =>
            result.status === "fulfilled"
              ? [[result.value.id, result.value] as const]
              : [],
          ),
        ),
      );
    });
    return () => controller.abort();
  }, [order]);

  async function changeStatus(currentOrder: OrderSummary, status: OrderStatus) {
    if (pending) return;
    setPending(true);
    setActionError("");
    try {
      const updated = await updateOrderStatus(currentOrder.id, status);
      replace(updated);
      setAnnouncement(
        `Pedido atualizado para ${orderStatusLabels[updated.status]}.`,
      );
    } catch (caught) {
      setActionError(
        caught instanceof ApiError && caught.status === 409
          ? "O status mudou. Clique em Atualizar para ver a versão mais recente."
          : "Não foi possível atualizar o status. Tente novamente.",
      );
    } finally {
      setPending(false);
    }
  }

  async function cancelOrder(currentOrder: OrderSummary) {
    if (pending) return;
    setPending(true);
    setActionError("");
    try {
      const updated = await cancelOwnOrder(currentOrder.id);
      replace(updated);
      setAnnouncement("Pedido cancelado.");
    } catch (caught) {
      setActionError(
        caught instanceof ApiError && caught.status === 409
          ? "Este pedido não pode mais ser cancelado. Clique em Atualizar para ver o status atual."
          : "Não foi possível cancelar o pedido. Tente novamente.",
      );
    } finally {
      setPending(false);
    }
  }

  function refreshOrder() {
    setActionError("");
    setAnnouncement("");
    retry();
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-6xl space-y-7">
        <p role="status" className="sr-only">
          {announcement}
        </p>
        <Link
          to={backPath}
          className="inline-flex items-center gap-2 rounded-md text-sm text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          {isAdmin ? "Voltar para o quadro" : "Voltar para meus pedidos"}
        </Link>

        {loading && (
          <p role="status" className="text-sm text-muted-foreground">
            Carregando pedido...
          </p>
        )}

        {!loading && error !== null && (
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="space-y-4 py-6">
              <p role="alert" className="font-medium">
                {error === 404 || error === 400
                  ? "Pedido não encontrado."
                  : "Não foi possível carregar o pedido."}
              </p>
              {error !== 404 && error !== 400 && (
                <Button variant="outline" onClick={retry}>
                  Tentar novamente
                </Button>
              )}
            </CardContent>
          </Card>
        )}

        {order && (
          <>
            <PageHeader
              eyebrow={isAdmin ? "Administração" : "Suas entregas"}
              title={`Pedido #${order.id.slice(0, 8).toUpperCase()}`}
              description={`Criado em ${formatDate(order.createdAt)}`}
              action={
                <Button
                  variant="outline"
                  onClick={refreshOrder}
                  disabled={loading || pending}
                >
                  <RefreshCw aria-hidden="true" />
                  Atualizar
                </Button>
              }
            />
            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
              <Card className="rounded-2xl shadow-sm ring-border/90">
                <CardHeader>
                  <CardTitle>
                    <h2 className="text-lg font-bold tracking-tight">
                      Itens do pedido
                    </h2>
                  </CardTitle>
                  <CardDescription>
                    {orderItemCount(order)}{" "}
                    {orderItemCount(order) === 1 ? "item" : "itens"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="divide-y">
                    {order.items.map((item) => {
                      const product = productsById[item.productId];
                      const name =
                        product?.name ??
                        `Produto #${item.productId.slice(0, 8).toUpperCase()}`;
                      return (
                        <li
                          key={item.productId}
                          className="flex flex-wrap items-center gap-4 py-4 first:pt-0"
                        >
                          <ProductImage
                            name={name}
                            imageUrl={product?.imageUrl}
                            alt=""
                            className="size-16 shrink-0 rounded-lg bg-muted object-cover"
                          />
                          <div className="min-w-0 flex-1 space-y-1">
                            <p className="font-semibold text-foreground">
                              {name}
                            </p>
                            <p className="text-xs text-muted-foreground tabular-nums">
                              {item.quantity} × {formatCurrency(item.unitPrice)}
                            </p>
                          </div>
                          <p className="font-semibold tabular-nums">
                            {formatCurrency(item.quantity * item.unitPrice)}
                          </p>
                        </li>
                      );
                    })}
                  </ol>
                  <div className="flex items-center justify-between gap-4 border-t pt-4">
                    <span className="font-semibold">Total</span>
                    <strong className="text-xl text-primary tabular-nums">
                      {formatCurrency(orderTotal(order))}
                    </strong>
                  </div>
                  <div className="flex items-start gap-3 border-t pt-4">
                    <MapPin
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-primary"
                    />
                    <div>
                      <p className="text-sm font-semibold">
                        Endereço de entrega
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.address}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <aside aria-label="Resumo e ações do pedido">
                {isAdmin ? (
                  <AdminOrderCard
                    order={order}
                    clientName={order.clientName}
                    pending={pending}
                    actionsDisabled={pending}
                    linkTitle={false}
                    error={actionError}
                    onStatusChange={changeStatus}
                  />
                ) : (
                  <OrderCard
                    order={order}
                    pending={pending}
                    actionsDisabled={pending}
                    linkTitle={false}
                    error={actionError}
                    onCancel={cancelOrder}
                  />
                )}
              </aside>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
