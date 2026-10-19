import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <Card className="h-full justify-between">
      <CardHeader className="gap-2">
        <CardTitle>
          <h3 className="text-base font-semibold">{product.name}</h3>
        </CardTitle>
        <CardDescription className="font-medium text-foreground">
          {formatCurrency(product.price)}
        </CardDescription>
      </CardHeader>
      {children && <CardContent>{children}</CardContent>}
    </Card>
  );
}
