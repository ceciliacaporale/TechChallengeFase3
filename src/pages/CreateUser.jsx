import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { createUser } from "../services/users";
import { useAuth } from "../context/AuthContext";

export default function CreateUser() {
  const { user, showNotification } = useAuth();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState(user?.email || "");
  const [senha, setSenha] = useState("");
  const [role, setRole] = useState(user?.role || "aluno");

  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome.trim() || !email.trim() || !senha.trim() || !role) {
      setErro("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setSalvando(true);
    setErro("");

    try {
      const novoUsuario = await createUser({
        nome: nome.trim(),
        email: email.trim(),
        senha,
        role,
      });

      showNotification(
        `Usuário "${novoUsuario.nome}" criado com sucesso!`,
        "success"
      );

      navigate(-1);
    } catch (err) {
      console.error("Erro ao criar usuário:", err);

      setErro(
        err?.response?.data?.message ||
          "Não foi possível criar o usuário. Tente novamente."
      );
    } finally {
      setSalvando(false);
    }
  };

  return (
    <>
      <Header />

      <main className="form-page-container">
        <div className="form-card">
          <div className="form-header">
            <h2>Novo Usuário</h2>
            <p>
              Preencha os campos abaixo para criar uma nova conta de acesso.
            </p>
          </div>

          {erro && (
            <div className="form-alert error">
              ⚠️ {erro}
            </div>
          )}

          <form onSubmit={handleSubmit} className="editor-form">
            <div className="form-group">
              <label htmlFor="nome">Nome *</label>

              <input
                id="nome"
                type="text"
                placeholder="Ex: João da Silva"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">E-mail *</label>

              <input
                id="email"
                type="email"
                placeholder="Ex: joao@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="senha">Senha *</label>

              <input
                id="senha"
                type="password"
                placeholder="Digite uma senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Tipo de usuário *</label>

              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              >
                <option value="aluno">Aluno</option>
                <option value="docente">Docente</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate("/gerenciar")}
                disabled={salvando}
              >
                Cancelar
              </button>

              <button
                type="submit"
                className="btn-submit"
                disabled={salvando}
              >
                {salvando ? "Criando..." : "Criar Usuário"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
