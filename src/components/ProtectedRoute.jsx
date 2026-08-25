import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, showNotification } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    showNotification("Faça login para acessar.", "warning");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    showNotification("Você não tem permissão para acessar esta página.", "error");
    return <Navigate to="/home" replace />;
  }

  return children;
}