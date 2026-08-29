import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/icon3.png";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const from =
    location.state?.from?.pathname || "/admin";

  const stateMessage =
    location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!usuario.trim() || !senha.trim()) {
      setErrorMsg(
        "Preencha todos os campos para acessar."
      );

      return;
    }

    setErrorMsg("");

    const ok = await login(
      usuario.trim(),
      senha
    );

    if (ok) {
      navigate(from, {
        replace: true,
      });
    } else {
      setErrorMsg(
        "Credenciais inválidas."
      );
    }
  };

  return (
    <div className="container">
      <header className="header">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <img
            src={logo}
            alt="Logo Blog Educacional"
            className="logoTop"
          />

          <h1>Blog Educacional</h1>
        </div>

        <Link
          to="/home"
          className="btn-back-home"
        >
          ← Voltar para o Blog
        </Link>
      </header>

      <main className="content">
        <div className="login-box">

          <div className="login-header">
            <h2>Portal do Docente</h2>

            <p>
              Faça login com suas credenciais
              para gerenciar a plataforma.
            </p>
          </div>

          {stateMessage && (
            <div className="login-alert warning">
              ⚠️ {stateMessage}
            </div>
          )}

          {errorMsg && (
            <div className="login-alert error">
              ❌ {errorMsg}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="login-form"
          >

            <div className="form-group">
              <label htmlFor="usuario">
                Usuário ou E-mail
              </label>

              <input
                id="usuario"
                type="text"
                placeholder="ex: professor@fiap.com.br"
                value={usuario}
                onChange={(e) => {
                  setUsuario(e.target.value);
                  setErrorMsg("");
                }}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="senha">
                Senha de Acesso
              </label>

              <input
                id="senha"
                type="password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => {
                  setSenha(e.target.value);
                  setErrorMsg("");
                }}
                required
              />
            </div>

            <button
              type="submit"
              className="btn-access"
            >
              Entrar no Painel
            </button>

          </form>

          {/* 
            Removi o login rápido mockado porque
            agora estamos usando autenticação real.
          */}

        </div>
      </main>
    </div>
  );
}