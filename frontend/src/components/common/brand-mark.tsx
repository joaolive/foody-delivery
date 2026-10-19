import { UtensilsCrossed } from "lucide-react";

import { cn } from "@/lib/utils";

export function BrandMark({
  className,
  inverse = false,
}: {
  className?: string;
  inverse?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        className={cn(
          "flex size-9 items-center justify-center rounded-xl shadow-sm",
          inverse
            ? "bg-primary-foreground text-primary"
            : "bg-primary text-primary-foreground",
        )}
      >
        <UtensilsCrossed aria-hidden="true" className="size-4.5" />
      </span>
      <span
        className={cn(
          "text-base font-extrabold tracking-tight",
          inverse ? "text-primary-foreground" : "text-foreground",
        )}
      >
        Foody{" "}
        <span
          className={inverse ? "text-primary-foreground/80" : "text-primary"}
        >
          Delivery
        </span>
      </span>
    </span>
  );
}
