import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/features/auth/hooks/use-auth";

export function HomePage() {
  const { session, signOut } = useAuth();
  if (!session) return null;

  return (
    <main className="mx-auto flex min-h-svh max-w-4xl flex-col gap-8 px-6 py-12">
      <header className="flex items-center justify-between gap-4">
        <span className="text-sm font-semibold">Foody Delivery</span>
        <Button variant="outline" onClick={signOut}>
          Sair
        </Button>
      </header>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Olá, {session.user.name}</CardTitle>
          <CardDescription>
            {session.user.role === "ADMIN"
              ? "Área administrativa"
              : "Meus pedidos"}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Sua sessão está ativa. Os pedidos entram na próxima etapa.
        </CardContent>
      </Card>
    </main>
  );
}
