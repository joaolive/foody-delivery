import { API_BASE_URL } from "@/lib/api-client";

export const PRODUCT_IMAGE_FALLBACK =
  "/images/products/product-placeholder.svg";

export function resolveProductImageUrl(imageUrl: string) {
  if (/^https?:\/\//i.test(imageUrl)) return imageUrl;
  return `${API_BASE_URL}/${imageUrl.replace(/^\/+/, "")}`;
}
