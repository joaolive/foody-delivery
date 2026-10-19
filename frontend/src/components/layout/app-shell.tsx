import type { ReactNode } from "react";
import { Link, NavLink } from "react-router";

import { ThemeToggle } from "@/components/common/theme-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { homePath } from "@/features/auth/lib/routes";
import { cn } from "@/lib/utils";

export function AppShell({
  children,
  wide = false,
}: {
  children: ReactNode;
  wide?: boolean;
}) {
  const { session, signOut } = useAuth();
  if (!session) return null;

  const navigation =
    session.user.role === "ADMIN"
      ? [
          { path: "/admin/orders", label: "Pedidos" },
          { path: "/products", label: "Produtos" },
        ]
      : [
          { path: "/orders", label: "Meus pedidos" },
          { path: "/orders/new", label: "Novo pedido" },
          { path: "/products", label: "Produtos" },
        ];

  return (
    <div className="min-h-svh bg-background">
      <header className="border-b bg-card">
        <div
          className={cn(
            "mx-auto flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 sm:px-6",
            wide ? "max-w-none" : "max-w-6xl",
          )}
        >
          <Link
            to={homePath(session.user.role)}
            className="text-sm font-bold tracking-tight text-primary"
          >
            Foody Delivery
          </Link>
          <nav
            aria-label="Navegação principal"
            className="order-3 flex w-full items-center gap-1 overflow-x-auto border-t pt-3 lg:order-none lg:ml-2 lg:w-auto lg:border-0 lg:pt-0"
          >
            {navigation.map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                end
                className={({ isActive }) =>
                  cn(
                    "inline-flex h-9 shrink-0 items-center justify-center rounded-lg px-3 text-sm font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground xl:inline">
              {session.user.name}
            </span>
            <ThemeToggle />
            <Button type="button" variant="outline" onClick={signOut}>
              Sair
            </Button>
          </div>
        </div>
      </header>
      <main
        className={cn(
          "mx-auto px-4 py-8 sm:px-6 sm:py-10",
          wide ? "max-w-none" : "max-w-6xl",
        )}
      >
        {children}
      </main>
    </div>
  );
}
