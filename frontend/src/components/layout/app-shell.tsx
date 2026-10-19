import type { ReactNode } from "react";
import { Link } from "react-router";

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

  return (
    <div className="min-h-svh bg-background">
      <header className="border-b">
        <div
          className={cn(
            "mx-auto flex items-center justify-between gap-4 px-4 py-4 sm:px-6",
            wide ? "max-w-none" : "max-w-6xl",
          )}
        >
          <Link
            to={homePath(session.user.role)}
            className="text-sm font-bold tracking-tight text-primary"
          >
            Foody Delivery
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/products"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Produtos
            </Link>
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {session.user.name}
            </span>
            <ThemeToggle />
            <Button variant="outline" onClick={signOut}>
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
