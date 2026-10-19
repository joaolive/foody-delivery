import { Badge } from "@/components/ui/badge";
import {
  orderStatusClasses,
  orderStatusLabels,
} from "@/features/orders/lib/order-status";
import type { OrderStatus } from "@/features/orders/types/order";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant="outline" className={orderStatusClasses[status]}>
      {orderStatusLabels[status]}
    </Badge>
  );
}
