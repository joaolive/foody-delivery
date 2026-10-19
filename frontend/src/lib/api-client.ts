import { loadSession } from "@/features/auth/lib/auth-storage";

export const UNAUTHORIZED_EVENT = "foody:unauthorized";

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
  authenticated = true,
): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body) headers.set("Content-Type", "application/json");
  const session = authenticated ? loadSession() : null;
  if (session) headers.set("Authorization", `Bearer ${session.accessToken}`);

  const baseUrl = (import.meta.env.VITE_API_BASE_URL ?? "/api").replace(
    /\/$/,
    "",
  );
  const response = await fetch(`${baseUrl}${path}`, { ...init, headers });

  if (!response.ok) {
    if (authenticated && response.status === 401) {
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }
    let message = "Request failed";
    try {
      const problem = (await response.json()) as { detail?: string };
      message = problem.detail ?? message;
    } catch {
      // Some errors do not have a JSON body.
    }
    throw new ApiError(response.status, message);
  }

  return (await response.json()) as T;
}
