import type {
  AuthSession,
  AuthUser,
  LoginCredentials,
  RegisterData,
} from "@/features/auth/types/auth";
import { apiRequest } from "@/lib/api-client";

export function login(credentials: LoginCredentials) {
  return apiRequest<AuthSession>(
    "/auth/login",
    { method: "POST", body: JSON.stringify(credentials) },
    false,
  );
}

export function register(data: RegisterData) {
  return apiRequest<AuthUser>(
    "/user",
    { method: "POST", body: JSON.stringify(data) },
    false,
  );
}
