import { createContext } from "react";

import type { AuthSession } from "@/features/auth/types/auth";

export type AuthContextValue = {
  session: AuthSession | null;
  signIn: (session: AuthSession) => void;
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
