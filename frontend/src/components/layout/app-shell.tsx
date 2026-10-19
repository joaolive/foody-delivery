import type { ReactNode } from "react";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { homePath } from "@/features/auth/lib/routes";

export function AppShell({ children }: { children: ReactNode }) {
  const { session, signOut } = useAuth();
  if (!session) return null;

  return (
    <div className="min-h-svh bg-background">
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link
            to={homePath(session.user.role)}
            className="text-sm font-semibold tracking-tight"
          >
            Foody Delivery
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {session.user.name}
            </span>
            <Button variant="outline" onClick={signOut}>
              Sair
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
    </div>
  );
}
