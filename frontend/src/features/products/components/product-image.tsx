import {
  PRODUCT_IMAGE_FALLBACK,
  resolveProductImageUrl,
} from "@/features/products/lib/product-image";

export function ProductImage({
  name,
  imageUrl,
  className,
  alt,
  loading = "lazy",
}: {
  name: string;
  imageUrl: string | null | undefined;
  className?: string;
  alt?: string;
  loading?: "eager" | "lazy";
}) {
  return (
    <img
      src={resolveProductImageUrl(imageUrl)}
      alt={alt ?? `Foto de ${name}`}
      className={className}
      loading={loading}
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
  );
}
