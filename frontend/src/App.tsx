import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import { AuthProvider } from "@/features/auth/components/auth-provider";
import { ProtectedRoute } from "@/features/auth/components/protected-route";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { AdminOrdersPage } from "@/pages/admin-orders-page";
import { LoginPage } from "@/pages/login-page";
import { NewOrderPage } from "@/pages/new-order-page";
import { OrdersPage } from "@/pages/orders-page";
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
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/new"
            element={
              <ProtectedRoute role="CLIENT">
                <NewOrderPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminOrdersPage />
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
