export type UserRole = "ADMIN" | "CLIENT";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type AuthSession = {
  accessToken: string;
  expiresAt: string;
  user: AuthUser;
};

export type LoginCredentials = {
  email: string;
  password: string;
};

export type RegisterData = LoginCredentials & {
  name: string;
};
