import { Routes, Route, Navigate } from "react-router-dom";
import {
  ProtectedRoute,
  PublicOnlyRoute,
} from "./components/auth/ProtectedRoute";
import { AppLayout } from "./Layout/AppLayout";
import {Toaster} from "sonner";
import { Login } from "./pages/LoginPage";
import { Register } from "./pages/RegisterPage";
import { Dashboard } from "./pages/DashboardPage";
import { Transactions } from "./pages/Transactions";
import { useAuthStore } from "./lib/store/authStore";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { CategoriesPage } from "./pages/CategoriesPage";
import { ProfilePage } from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
export default function App() {

  const fetchCurrentUser = useAuthStore((state) => state.fetchCurrentUser);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/profile" element={<ProfilePage />} />

            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>

      <Toaster position="top-right" />
    </>
  );
}
