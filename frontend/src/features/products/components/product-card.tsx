import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PRODUCT_IMAGE_FALLBACK,
  resolveProductImageUrl,
} from "@/features/products/lib/product-image";
import type { Product } from "@/features/products/types/product";
import { formatCurrency } from "@/lib/format";

export function ProductCard({
  product,
  children,
}: {
  product: Product;
  children?: ReactNode;
}) {
  return (
    <Card className="h-full">
      <img
        src={resolveProductImageUrl(product.imageUrl)}
        alt={`Foto de ${product.name}`}
        className="aspect-[4/3] w-full bg-muted object-cover"
        loading="lazy"
        decoding="async"
        onError={(event) => {
          const fallback = resolveProductImageUrl(PRODUCT_IMAGE_FALLBACK);
          if (
            event.currentTarget.src !==
            new URL(fallback, window.location.href).href
          ) {
            event.currentTarget.src = fallback;
          }
        }}
      />
      <CardHeader className="gap-2">
        <CardTitle>
          <h3 className="text-base font-semibold">{product.name}</h3>
        </CardTitle>
        <CardDescription className="font-medium text-foreground">
          {formatCurrency(product.price)}
        </CardDescription>
      </CardHeader>
      {children && <CardContent className="mt-auto">{children}</CardContent>}
    </Card>
  );
}
