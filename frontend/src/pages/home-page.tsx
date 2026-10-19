import { AppShell } from "@/components/layout/app-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/features/auth/hooks/use-auth";

export function HomePage() {
  const { session } = useAuth();
  if (!session) return null;

  return (
    <AppShell>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Olá, {session.user.name}</CardTitle>
          <CardDescription>Área administrativa</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Sua sessão está ativa. O quadro de pedidos entra na próxima etapa.
        </CardContent>
      </Card>
    </AppShell>
  );
}
