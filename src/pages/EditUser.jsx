import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { fetchUserById, updateUser } from "../services/users";
import { useAuth } from "../context/AuthContext";

export default function EditUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useAuth();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [role, setRole] = useState("aluno");

  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarUsuario() {
      setLoading(true);
      setErro("");

      try {
        const usuario = await fetchUserById(id);

        setNome(usuario.nome || "");
        setEmail(usuario.email || "");
        setRole(usuario.role || "aluno");
      } catch (err) {
        console.error("Erro ao carregar usuário:", err);

        setErro(
          err?.message ||
            "Não foi possível carregar as informações do usuário."
        );
      } finally {
        setLoading(false);
      }
    }

    carregarUsuario();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome.trim() || !email.trim() || !role) {
      setErro("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setSalvando(true);
    setErro("");

    try {
      console.log("Atualizando usuário:", id);

      await updateUser(id, {
        nome: nome.trim(),
        email: email.trim(),
        senha: senha.trim(),
        role,
      });

      console.log("Usuário atualizado com sucesso!");

      showNotification(
        `Usuário "${nome}" atualizado com sucesso!`,
        "success"
      );

      navigate("/gerencia");
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);

      setErro(
        err?.message ||
          "Erro ao salvar as alterações do usuário. Tente novamente."
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
            <h2>✏️ Editar Usuário</h2>

            <p>
              Altere os campos abaixo e clique em salvar para
              atualizar os dados do usuário.
            </p>
          </div>

          {loading && (
            <div className="state-message loading-state">
              <div className="spinner"></div>

              <p>
                Carregando dados do usuário...
              </p>
            </div>
          )}

          {erro && (
            <div className="form-alert error">
              ⚠️ {erro}
            </div>
          )}

          {!loading && (
            <form
              onSubmit={handleSubmit}
              className="editor-form"
            >

              <div className="form-group">
                <label htmlFor="nome">
                  Nome *
                </label>

                <input
                  id="nome"
                  type="text"
                  placeholder="Ex: Alana Silva"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  E-mail *
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="Ex: alana@fiap.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="senha">
                  Nova Senha
                </label>

                <input
                  id="senha"
                  type="password"
                  placeholder="Deixe vazio para manter a senha atual"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  minLength={6}
                />

                <span className="char-count">
                  Deixe vazio caso não queira alterar a senha.
                </span>
              </div>

              <div className="form-group">
                <label htmlFor="role">
                  Tipo de Usuário *
                </label>

                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="aluno">
                    Aluno
                  </option>

                  <option value="docente">
                    Docente
                  </option>

                  <option value="admin">
                    Administrador
                  </option>
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
                  {salvando
                    ? "Salvando..."
                    : "Salvar Alterações"}
                </button>

              </div>

            </form>
          )}

        </div>
      </main>
    </>
  );
}