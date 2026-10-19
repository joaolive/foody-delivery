import { useCallback, useEffect, useState, type ReactNode } from "react";

import { AuthContext } from "@/features/auth/lib/auth-context";
import {
  clearSession,
  loadSession,
  saveSession,
} from "@/features/auth/lib/auth-storage";
import type { AuthSession } from "@/features/auth/types/auth";
import { UNAUTHORIZED_EVENT } from "@/lib/api-client";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(loadSession);

  const signIn = useCallback((nextSession: AuthSession) => {
    saveSession(nextSession);
    setSession(nextSession);
  }, []);

  const signOut = useCallback(() => {
    clearSession();
    setSession(null);
  }, []);

  useEffect(() => {
    window.addEventListener(UNAUTHORIZED_EVENT, signOut);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, signOut);
  }, [signOut]);

  useEffect(() => {
    if (!session) return;
    const remaining = Date.parse(session.expiresAt) - Date.now();
    const timeout = window.setTimeout(signOut, Math.max(remaining, 0));
    return () => window.clearTimeout(timeout);
  }, [session, signOut]);

  return (
    <AuthContext.Provider value={{ session, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
