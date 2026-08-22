import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../lib/store/authStore";

export const ProtectedRoute = ({ allowedRoles }) => {
  const { token, user, isLoading } = useAuthStore();
  const storedToken = localStorage.getItem("token");

  if (isLoading) {
    return null; 
  }

  if (!token && !storedToken) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export const PublicOnlyRoute = () => {
  const { token, isLoading } = useAuthStore();
  const storedToken = localStorage.getItem("token");

  if (isLoading) {
    return null;
  }

  if (token || storedToken) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};