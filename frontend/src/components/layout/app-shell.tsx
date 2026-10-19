import type { ReactNode } from "react";
import { Menu } from "lucide-react";
import { Link, NavLink, useLocation, useNavigate } from "react-router";

import { BrandMark } from "@/components/common/brand-mark";
import { UserMenu } from "@/components/common/user-menu";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { homePath } from "@/features/auth/lib/routes";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: ReactNode }) {
  const { session, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
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
        <div className="mx-auto flex max-w-[90rem] items-center gap-3 px-4 py-3 sm:gap-5 sm:px-6">
          <Link
            to={homePath(session.user.role)}
            aria-label="Foody Delivery — início"
            className="rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <BrandMark />
          </Link>
          <nav
            aria-label="Navegação principal"
            className="ml-3 hidden items-center gap-1 lg:flex"
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
          <div className="ml-auto flex items-center gap-2">
            <nav aria-label="Navegação principal" className="lg:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger
                  type="button"
                  aria-label="Abrir navegação principal"
                  className={buttonVariants({
                    variant: "outline",
                    size: "icon-lg",
                  })}
                >
                  <Menu aria-hidden="true" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-44 p-1.5">
                  <DropdownMenuGroup>
                    {navigation.map(({ path, label }) => (
                      <DropdownMenuItem
                        key={path}
                        aria-current={
                          location.pathname === path ? "page" : undefined
                        }
                        className={cn(
                          "px-2.5 py-2 font-medium",
                          location.pathname === path &&
                            "bg-secondary text-primary",
                        )}
                        onClick={() => navigate(path)}
                      >
                        {label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </nav>
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
