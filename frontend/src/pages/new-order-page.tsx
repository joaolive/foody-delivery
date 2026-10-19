import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { Minus, Plus } from "lucide-react";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { createOrder } from "@/features/orders/services/order-service";
import { ProductCard } from "@/features/products/components/product-card";
import { fetchProducts } from "@/features/products/services/product-service";
import { usePaginatedList } from "@/hooks/use-paginated-list";
import { ApiError } from "@/lib/api-client";
import { formatCurrency } from "@/lib/format";

export function NewOrderPage() {
  const navigate = useNavigate();
  const {
    items: products,
    hasMore,
    loading,
    error: loadError,
    loadMore,
    retry,
  } = usePaginatedList(fetchProducts);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [address, setAddress] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const selectedProducts = products.filter(
    (product) => (quantities[product.id] ?? 0) > 0,
  );
  const itemCount = selectedProducts.reduce(
    (count, product) => count + quantities[product.id],
    0,
  );
  const total = selectedProducts.reduce(
    (amount, product) => amount + product.price * quantities[product.id],
    0,
  );

  function changeQuantity(productId: string, change: number) {
    setQuantities((current) => ({
      ...current,
      [productId]: Math.max(0, (current[productId] ?? 0) + change),
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");
    if (selectedProducts.length === 0) {
      setSubmitError("Selecione pelo menos um produto.");
      return;
    }
    if (!address.trim()) {
      setSubmitError("Informe o endereço de entrega.");
      return;
    }

    setSubmitting(true);
    try {
      await createOrder({
        address: address.trim(),
        items: selectedProducts.map((product) => ({
          productId: product.id,
          quantity: quantities[product.id],
        })),
      });
      navigate("/orders", { replace: true, state: { created: true } });
    } catch (caught) {
      setSubmitError(
        caught instanceof ApiError && caught.status === 404
          ? "Um produto não está mais disponível. Atualize a página e tente novamente."
          : "Não foi possível criar o pedido. Confira os dados e tente novamente.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="space-y-5">
          <Link
            to="/orders"
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Voltar para meus pedidos
          </Link>
          <PageHeader
            eyebrow="Faça seu pedido"
            title="Novo pedido"
            description="Escolha os produtos e informe onde deseja receber a entrega."
          />
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]"
        >
          <section aria-labelledby="products-heading" className="space-y-5">
            <h2 id="products-heading" className="text-lg font-semibold">
              Produtos
            </h2>
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => {
                const quantity = quantities[product.id] ?? 0;
                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    selected={quantity > 0}
                  >
                    <div className="flex w-full items-center justify-between gap-3">
                      <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                        Quantidade
                      </span>
                      <div className="flex items-center gap-1.5">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          aria-label={`Diminuir quantidade de ${product.name}`}
                          disabled={quantity === 0 || submitting}
                          onClick={() => changeQuantity(product.id, -1)}
                        >
                          <Minus aria-hidden="true" />
                        </Button>
                        <span
                          aria-live="polite"
                          className="min-w-7 text-center text-sm font-semibold tabular-nums"
                        >
                          {quantity}
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          aria-label={`Aumentar quantidade de ${product.name}`}
                          disabled={submitting}
                          onClick={() => changeQuantity(product.id, 1)}
                        >
                          <Plus aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                  </ProductCard>
                );
              })}
            </div>

            {loading && (
              <p role="status" className="text-sm text-muted-foreground">
                Carregando produtos...
              </p>
            )}
            {loadError && (
              <div
                role="alert"
                className="flex flex-wrap items-center gap-3 text-sm"
              >
                <span>Não foi possível carregar os produtos.</span>
                <Button type="button" variant="outline" onClick={retry}>
                  Tentar novamente
                </Button>
              </div>
            )}
            {!loading && !loadError && products.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Nenhum produto disponível no momento.
              </p>
            )}
            {hasMore && !loadError && (
              <Button
                type="button"
                variant="outline"
                onClick={loadMore}
                disabled={loading}
              >
                {loading ? "Carregando..." : "Carregar mais produtos"}
              </Button>
            )}
          </section>

          <Card className="shadow-sm lg:sticky lg:top-6">
            <CardHeader>
              <CardTitle>
                <h2 className="text-lg font-semibold">Resumo do pedido</h2>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="rounded-xl bg-secondary/70 p-4">
                <p className="text-xs font-semibold tracking-wide text-secondary-foreground uppercase">
                  Total do pedido
                </p>
                <p className="mt-1 text-2xl font-bold text-primary tabular-nums">
                  {formatCurrency(total)}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {itemCount}{" "}
                  {itemCount === 1 ? "item selecionado" : "itens selecionados"}
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="delivery-address">
                  Endereço de entrega
                </FieldLabel>
                <Textarea
                  id="delivery-address"
                  name="address"
                  autoComplete="street-address"
                  placeholder="Rua, número, bairro e complemento"
                  maxLength={255}
                  required
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                />
              </Field>
              {submitError && <FieldError>{submitError}</FieldError>}
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={submitting || products.length === 0}
              >
                {submitting ? "Criando pedido..." : "Confirmar pedido"}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </AppShell>
  );
}
