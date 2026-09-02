import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useRef } from "react";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, showNotification } = useAuth();
  const location = useLocation();

  const notificou = useRef(false);

  const userRole = user?.role?.toLowerCase();

  const temPermissao =
    !allowedRoles ||
    allowedRoles.some(
      (role) => role.toLowerCase() === userRole
    );

  useEffect(() => {
    if (notificou.current) return;

    if (!isAuthenticated) {
      notificou.current = true;

      showNotification(
        "Faça login para acessar.",
        "warning"
      );
    } else if (!temPermissao) {
      notificou.current = true;

      showNotification(
        "Você não tem permissão para acessar esta página.",
        "error"
      );
    }
  }, [isAuthenticated, temPermissao, showNotification]);

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  if (!temPermissao) {
    return <Navigate to="/home" replace />;
  }

  return children;
}