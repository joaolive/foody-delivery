import { UtensilsCrossed } from "lucide-react";

import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <UtensilsCrossed aria-hidden="true" className="size-4.5" />
      </span>
      <span className="text-base font-extrabold tracking-tight text-foreground">
        Foody <span className="text-primary">Delivery</span>
      </span>
    </span>
  );
}
