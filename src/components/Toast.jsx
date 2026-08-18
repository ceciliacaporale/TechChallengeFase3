import { useAuth } from "../context/AuthContext";

export default function Toast() {
  const { notification } = useAuth();

  if (!notification) return null;

  const { message, type } = notification;

  return (
    <div className={`toast-notification toast-${type}`}>
      <span className="toast-icon">
        {type === "success" && "✅"}
        {type === "error" && "❌"}
        {type === "warning" && "⚠️"}
        {type === "info" && "ℹ️"}
      </span>
      <span className="toast-message">{message}</span>
    </div>
  );
}
