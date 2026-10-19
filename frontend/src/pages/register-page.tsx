import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router";

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
import { register } from "@/features/auth/services/auth-service";
import { ApiError } from "@/lib/api-client";

export function RegisterPage() {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
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
      await register({ name, email, password });
      navigate("/login?registered=1", { replace: true });
    } catch (caught) {
      setError(
        caught instanceof ApiError && caught.status === 409
          ? "Este e-mail já está cadastrado."
          : "Não foi possível criar a conta. Confira os dados e tente novamente.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Criar conta"
      description="Preencha seus dados para começar a pedir."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && <FieldError>{error}</FieldError>}
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="register-name">Nome</FieldLabel>
            <Input
              id="register-name"
              autoComplete="name"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="register-email">E-mail</FieldLabel>
            <Input
              id="register-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="register-password">Senha</FieldLabel>
            <Input
              id="register-password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              maxLength={32}
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Entre 8 e 32 caracteres.
            </p>
          </Field>
        </FieldGroup>
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={submitting}
        >
          {submitting ? "Criando conta..." : "Criar conta"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <Link
            to="/login"
            className="font-medium text-foreground underline underline-offset-4"
          >
            Entrar
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
