import { Link } from "react-router";

import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/common/page-header";
import { Button, buttonVariants } from "@/components/ui/button";
import { ProductCard } from "@/features/products/components/product-card";
import { fetchProducts } from "@/features/products/services/product-service";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { usePaginatedList } from "@/hooks/use-paginated-list";

export function ProductsPage() {
  const { session } = useAuth();
  const {
    items: products,
    hasMore,
    totalElements,
    loading,
    error,
    loadMore,
    retry,
  } = usePaginatedList(fetchProducts);

  return (
    <AppShell>
      <div className="space-y-8">
        <PageHeader
          eyebrow="Cardápio"
          title="Produtos"
          description="Conheça os produtos disponíveis para entrega."
          action={
            session?.user.role === "CLIENT" ? (
              <Link to="/orders/new" className={buttonVariants({ size: "lg" })}>
                Novo pedido
              </Link>
            ) : undefined
          }
        />

        {products.length > 0 && (
          <p className="text-sm text-muted-foreground">
            Exibindo {products.length} de {totalElements} produtos
          </p>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {loading && (
          <p role="status" className="text-sm text-muted-foreground">
            Carregando produtos...
          </p>
        )}

        {error && (
          <div
            role="alert"
            className="flex flex-wrap items-center gap-3 text-sm"
          >
            <span>Não foi possível carregar os produtos.</span>
            <Button variant="outline" onClick={retry}>
              Tentar novamente
            </Button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nenhum produto disponível no momento.
          </p>
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
