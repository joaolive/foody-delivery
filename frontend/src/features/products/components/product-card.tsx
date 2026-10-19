import type { ReactNode } from "react";

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductImage } from "@/features/products/components/product-image";
import type { Product } from "@/features/products/types/product";
import { formatCurrency } from "@/lib/format";

export function ProductCard({
  product,
  children,
  selected = false,
}: {
  product: Product;
  children?: ReactNode;
  selected?: boolean;
}) {
  return (
    <Card
      data-selected={selected || undefined}
      className="h-full rounded-2xl shadow-sm ring-border/90 transition-shadow duration-200 hover:shadow-md data-[selected=true]:ring-2 data-[selected=true]:ring-primary/70"
    >
      <ProductImage
        name={product.name}
        imageUrl={product.imageUrl}
        className="aspect-[4/3] w-full rounded-t-2xl bg-muted object-cover"
      />
      <CardHeader className="gap-2">
        <CardTitle>
          <h3 className="text-lg font-semibold tracking-tight">
            {product.name}
          </h3>
        </CardTitle>
        <CardDescription className="flex items-baseline gap-2">
          <strong className="text-lg font-bold text-primary tabular-nums">
            {formatCurrency(product.price)}
          </strong>
          <span className="text-xs">por unidade</span>
        </CardDescription>
      </CardHeader>
      {children && (
        <CardFooter className="mt-auto bg-muted/30">{children}</CardFooter>
      )}
    </Card>
  );
}
