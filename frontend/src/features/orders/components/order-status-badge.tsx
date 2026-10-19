import { Badge } from "@/components/ui/badge";
import {
  orderStatusClasses,
  orderStatusDotClasses,
  orderStatusLabels,
} from "@/features/orders/lib/order-status";
import type { OrderStatus } from "@/features/orders/types/order";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge
      variant="outline"
      className={`h-6 gap-1.5 px-2.5 font-semibold ${orderStatusClasses[status]}`}
    >
      <span
        aria-hidden="true"
        className={`size-1.5 rounded-full ${orderStatusDotClasses[status]}`}
      />
      {orderStatusLabels[status]}
    </Badge>
  );
}
