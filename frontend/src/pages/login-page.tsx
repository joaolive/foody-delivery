import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AuthShell } from "@/features/auth/components/auth-shell";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { homePath } from "@/features/auth/lib/routes";
import { login } from "@/features/auth/services/auth-service";
import { ApiError } from "@/lib/api-client";

export function LoginPage() {
  const { session, signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (session) return <Navigate to={homePath(session.user.role)} replace />;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const nextSession = await login({ email, password });
      signIn(nextSession);
      navigate(homePath(nextSession.user.role), { replace: true });
    } catch (caught) {
      setError(
        caught instanceof ApiError && caught.status === 401
          ? "E-mail ou senha inválidos."
          : "Não foi possível entrar. Tente novamente.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Entrar"
      description="Acesse seus pedidos com seu e-mail e senha."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {searchParams.has("registered") && (
          <p role="status" className="rounded-lg bg-muted px-3 py-2 text-sm">
            Conta criada. Entre com seus dados.
          </p>
        )}
        {error && <FieldError>{error}</FieldError>}
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="login-email">E-mail</FieldLabel>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="login-password">Senha</FieldLabel>
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Field>
        </FieldGroup>
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={submitting}
        >
          {submitting ? "Entrando..." : "Entrar"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Ainda não tem uma conta?{" "}
          <Link
            to="/register"
            className="font-medium text-foreground underline underline-offset-4"
          >
            Cadastre-se
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
