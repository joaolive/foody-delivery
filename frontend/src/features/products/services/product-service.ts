import type { Product } from "@/features/products/types/product";
import { apiRequest } from "@/lib/api-client";
import type { PageResult } from "@/lib/pagination";

export function fetchProducts(page: number, signal: AbortSignal) {
  return apiRequest<PageResult<Product>>(
    `/product?page=${page}&size=20&sort=name,asc`,
    { signal },
  );
}

export function fetchProductById(productId: string, signal: AbortSignal) {
  return apiRequest<Product>(`/product/${productId}`, { signal });
}
