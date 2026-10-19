import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";

import { useAuth } from "@/features/auth/hooks/use-auth";
import { homePath } from "@/features/auth/lib/routes";
import type { UserRole } from "@/features/auth/types/auth";

export function ProtectedRoute({
  children,
  role,
}: {
  children: ReactNode;
  role?: UserRole;
}) {
  const { session } = useAuth();
  const location = useLocation();

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (role && session.user.role !== role) {
    return <Navigate to={homePath(session.user.role)} replace />;
  }
  return children;
}
