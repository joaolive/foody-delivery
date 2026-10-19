import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import { AuthProvider } from "@/features/auth/components/auth-provider";
import { ProtectedRoute } from "@/features/auth/components/protected-route";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { HomePage } from "@/pages/home-page";
import { LoginPage } from "@/pages/login-page";
import { RegisterPage } from "@/pages/register-page";

function RootRedirect() {
  const { session } = useAuth();
  return (
    <Navigate
      to={
        session?.user.role === "ADMIN"
          ? "/admin/orders"
          : session
            ? "/orders"
            : "/login"
      }
      replace
    />
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/orders"
            element={
              <ProtectedRoute role="CLIENT">
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute role="ADMIN">
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<RootRedirect />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
