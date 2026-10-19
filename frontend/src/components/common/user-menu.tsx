import { LogOut, Moon, Sun } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AuthUser } from "@/features/auth/types/auth";
import { useTheme } from "@/hooks/use-theme";

export function UserMenu({
  user,
  onSignOut,
}: {
  user: AuthUser;
  onSignOut: () => void;
}) {
  const { isDark, toggleTheme } = useTheme();
  const initial = user.name.trim().charAt(0).toLocaleUpperCase("pt-BR") || "?";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        type="button"
        aria-label={`Abrir menu da conta de ${user.name}`}
        className="flex size-10 items-center justify-center rounded-full bg-secondary text-sm font-bold text-primary ring-1 ring-border transition-colors outline-none hover:bg-accent focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <span aria-hidden="true">{initial}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-56 p-1.5">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="space-y-0.5 px-2.5 py-2">
            <span className="block max-w-56 truncate text-sm font-semibold text-foreground">
              {user.name}
            </span>
            <span className="block max-w-56 truncate text-xs font-normal text-muted-foreground">
              {user.email}
            </span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={toggleTheme}
            className="gap-2.5 px-2.5 py-2"
          >
            {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
            {isDark ? "Tema claro" : "Tema escuro"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={onSignOut}
            className="gap-2.5 px-2.5 py-2"
          >
            <LogOut aria-hidden="true" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
