import type { OrderStatus } from "@/features/orders/types/order";

export const orderStatuses: OrderStatus[] = [
  "RECEBIDO",
  "EM_PREPARO",
  "SAIU_PARA_ENTREGA",
  "ENTREGUE",
  "CANCELADO",
];

export const orderStatusLabels: Record<OrderStatus, string> = {
  RECEBIDO: "Recebido",
  EM_PREPARO: "Em preparo",
  SAIU_PARA_ENTREGA: "Saiu para entrega",
  ENTREGUE: "Entregue",
  CANCELADO: "Cancelado",
};

export const orderStatusClasses: Record<OrderStatus, string> = {
  RECEBIDO: "border-sky-500/30 bg-sky-500/10 text-sky-800 dark:text-sky-300",
  EM_PREPARO:
    "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300",
  SAIU_PARA_ENTREGA:
    "border-violet-500/30 bg-violet-500/10 text-violet-800 dark:text-violet-300",
  ENTREGUE:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300",
  CANCELADO: "border-border bg-muted text-muted-foreground",
};

export const orderStatusDotClasses: Record<OrderStatus, string> = {
  RECEBIDO: "bg-sky-500",
  EM_PREPARO: "bg-amber-500",
  SAIU_PARA_ENTREGA: "bg-violet-500",
  ENTREGUE: "bg-emerald-500",
  CANCELADO: "bg-muted-foreground",
};

export const nextOrderStatuses: Record<OrderStatus, OrderStatus[]> = {
  RECEBIDO: ["EM_PREPARO", "CANCELADO"],
  EM_PREPARO: ["SAIU_PARA_ENTREGA", "CANCELADO"],
  SAIU_PARA_ENTREGA: ["ENTREGUE", "CANCELADO"],
  ENTREGUE: [],
  CANCELADO: [],
};
