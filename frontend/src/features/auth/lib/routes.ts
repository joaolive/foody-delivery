import type { UserRole } from "@/features/auth/types/auth";

export function homePath(role: UserRole) {
  return role === "ADMIN" ? "/admin/orders" : "/orders";
}
