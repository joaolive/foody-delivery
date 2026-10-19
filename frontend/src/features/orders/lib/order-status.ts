import type { OrderStatus } from "@/features/orders/types/order";

export const orderStatusLabels: Record<OrderStatus, string> = {
  RECEIVED: "Recebido",
  PREPARING: "Em preparo",
  OUT_FOR_DELIVERY: "Saiu para entrega",
  DELIVERED: "Entregue",
  CANCELED: "Cancelado",
};

export const orderStatusClasses: Record<OrderStatus, string> = {
  RECEIVED: "border-sky-500/30 bg-sky-500/10 text-sky-800 dark:text-sky-300",
  PREPARING:
    "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300",
  OUT_FOR_DELIVERY:
    "border-violet-500/30 bg-violet-500/10 text-violet-800 dark:text-violet-300",
  DELIVERED:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300",
  CANCELED: "border-border bg-muted text-muted-foreground",
};
