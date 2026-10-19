import type { AuthSession } from "@/features/auth/types/auth";

const SESSION_KEY = "foody-auth-session";

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function saveSession(session: AuthSession) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function loadSession(): AuthSession | null {
  const stored = sessionStorage.getItem(SESSION_KEY);
  if (!stored) return null;

  try {
    const session: unknown = JSON.parse(stored);
    if (
      typeof session !== "object" ||
      session === null ||
      !("accessToken" in session) ||
      typeof session.accessToken !== "string" ||
      !("expiresAt" in session) ||
      typeof session.expiresAt !== "string" ||
      !("user" in session) ||
      typeof session.user !== "object" ||
      session.user === null ||
      !("role" in session.user) ||
      (session.user.role !== "ADMIN" && session.user.role !== "CLIENT") ||
      Date.parse(session.expiresAt) <= Date.now()
    ) {
      clearSession();
      return null;
    }
    return session as AuthSession;
  } catch {
    clearSession();
    return null;
  }
}
