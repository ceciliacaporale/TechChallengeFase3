import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/icon3.png";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  // Role do usuário
  const role = user?.role?.toLowerCase();

  const isAdmin = role === "admin";
  const isDocente = role === "docente";

  return (
    <header className="home-header">
      <Link
        to="/home"
        className="header-logo"
        title="Ir para a Home"
      >
        <img
          src={logo}
          alt="Logo Blog Educacional"
        />
      </Link>

      <div className="header-title-container">
        <h1>Blog Educacional</h1>
      </div>

      <nav className="header-nav">

        {/* Todos os usuários */}
        <Link
          to="/home"
          className={`nav-link ${
            isActive("/home") ? "active" : ""
          }`}
        >
          Postagens
        </Link>

        {/* Docente e Admin */}
        {(isDocente || isAdmin) && (
          <Link
            to="/criar"
            className={`nav-link ${
              isActive("/criar") ? "active" : ""
            }`}
          >
            + Nova Postagem
          </Link>
        )}

        {/* Docente e Admin */}
        {(isDocente || isAdmin) && (
          <Link
            to="/admin"
            className={`nav-link ${
              isActive("/admin") ? "active" : ""
            }`}
          >
            Administração
          </Link>
        )}

        {/* Somente Admin */}
        {isAdmin && (
          <Link
            to="/gerencia"
            className={`nav-link ${
              isActive("/gerencia") ? "active" : ""
            }`}
          >
            Gerenciar usuário
          </Link>
        )}
      </nav>

      <div className="header-user">
        {isAuthenticated ? (
          <div className="user-profile">
            <span
              className="user-name"
              title={user.email}
            >
              👤 {user.nome}
            </span>

            <button
              onClick={handleLogout}
              className="btn-logout"
              title="Encerrar sessão"
            >
              Sair
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="btn-login-header"
          >
            Área Docente
          </Link>
        )}
      </div>
    </header>
  );
}