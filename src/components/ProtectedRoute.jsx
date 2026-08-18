import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, showNotification } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    showNotification("Acesso restrito a professores. Faça login para acessar.", "warning");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
