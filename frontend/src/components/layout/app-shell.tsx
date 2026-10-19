import type { ReactNode } from "react";
import { Link, NavLink } from "react-router";

import { BrandMark } from "@/components/common/brand-mark";
import { UserMenu } from "@/components/common/user-menu";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { homePath } from "@/features/auth/lib/routes";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: ReactNode }) {
  const { session, signOut } = useAuth();
  if (!session) return null;

  const navigation =
    session.user.role === "ADMIN"
      ? [{ path: "/admin/orders", label: "Pedidos" }]
      : [
          { path: "/orders", label: "Meus pedidos" },
          { path: "/orders/new", label: "Novo pedido" },
        ];

  return (
    <div className="min-h-svh bg-background">
      <header className="border-b bg-card/95 shadow-[0_1px_0_0_var(--border)] backdrop-blur-sm">
        <div className="mx-auto flex max-w-[90rem] flex-wrap items-center gap-x-5 gap-y-3 px-4 py-3 sm:px-6">
          <Link
            to={homePath(session.user.role)}
            aria-label="Foody Delivery — início"
            className="rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <BrandMark />
          </Link>
          <nav
            aria-label="Navegação principal"
            className="order-3 flex w-full items-center gap-1 overflow-x-auto border-t pt-3 lg:order-none lg:ml-3 lg:w-auto lg:border-0 lg:pt-0"
          >
            {navigation.map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                end
                className={({ isActive }) =>
                  cn(
                    "inline-flex h-9 shrink-0 items-center justify-center rounded-lg px-3 text-sm font-semibold whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive
                      ? "bg-secondary text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto">
            <UserMenu user={session.user} onSignOut={signOut} />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[90rem] px-4 py-9 sm:px-6 sm:py-12">
        {children}
      </main>
    </div>
  );
}
