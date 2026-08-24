
import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import ConfirmModal from "../components/ConfirmModal";
import SearchBar from "../components/SearchBar";
import { fetchUsers, deleteUser } from "../services/users";
import { useAuth } from "../context/AuthContext";

export default function Gerenciar() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterQuery, setFilterQuery] = useState("");

  const [userToDelete, setUserToDelete] = useState(null);

  const { user, showNotification } = useAuth();

  const carregarUsuarios = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await fetchUsers();

      // Caso a API retorne os usuários dentro de uma propriedade
      // como "users" ou "data"
      const usuarios = Array.isArray(data)
        ? data
        : data.users || data.data || [];

      setUsers(usuarios);
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);

      setError(
        "Não foi possível carregar os usuários no painel administrativo."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarUsuarios();
  }, [carregarUsuarios]);

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await deleteUser(userToDelete.id);

      showNotification(
        `Usuário "${userToDelete.nome}" excluído com sucesso.`,
        "success"
      );

      setUsers((prev) =>
        prev.filter(
          (u) => String(u.id) !== String(userToDelete.id)
        )
      );
    } catch (err) {
      console.error("Erro ao excluir usuário:", err);

      showNotification(
        "Erro ao excluir o usuário.",
        "error"
      );
    } finally {
      setUserToDelete(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const nome = u.nome?.toLowerCase() || "";
    const email = u.email?.toLowerCase() || "";
    const role = u.role?.toLowerCase() || "";

    const busca = filterQuery.toLowerCase();

    return (
      nome.includes(busca) ||
      email.includes(busca) ||
      role.includes(busca)
    );
  });

  const formatDate = (val) => {
    if (!val) return "N/A";

    const d = new Date(val);

    if (Number.isNaN(d.getTime())) {
      return val;
    }

    return d.toLocaleDateString("pt-BR");
  };

  return (
    <>
      <Header />

      <main className="admin-container">

        <header className="admin-header-panel">
          <div>
            <h2>👥 Gerenciar Usuários</h2>

            <p>
              Gerencie os usuários cadastrados no sistema,
              edite informações ou cadastre novos usuários.
            </p>
          </div>

          <Link
            to="/users"
            className="btn-create-post-cta"
          >
            ➕ Novo Usuário
          </Link>
        </header>

        {/* Estatísticas */}
        <section className="admin-stats-grid">

          <div className="stat-card">
            <span className="stat-number">
              {users.length}
            </span>

            <span className="stat-label">
              Total de Usuários
            </span>
          </div>

          <div className="stat-card">
            <span className="stat-number">
              {
                users.filter(
                  (u) => u.role === "aluno"
                ).length
              }
            </span>

            <span className="stat-label">
              Alunos
            </span>
          </div>

          <div className="stat-card">
            <span className="stat-number">
              {
                users.filter(
                  (u) => u.role === "docente"
                ).length
              }
            </span>

            <span className="stat-label">
              Docentes
            </span>
          </div>

          <div className="stat-card stat-user">
            <span className="stat-number">
              👤
            </span>

            <span className="stat-label">
              {user?.nome || "Administrador"}
            </span>
          </div>

        </section>

        {/* Tabela */}
        <section className="admin-table-section">

          <div className="table-toolbar">

            <SearchBar
              value={filterQuery}
              onChange={setFilterQuery}
              onClear={() => setFilterQuery("")}
            />

            <span className="toolbar-count">
              Exibindo {filteredUsers.length} de{" "}
              {users.length} usuários
            </span>

          </div>

          {/* Loading */}
          {loading && (
            <div className="state-message loading-state">
              <div className="spinner"></div>

              <p>
                Carregando usuários...
              </p>
            </div>
          )}

          {/* Erro */}
          {error && (
            <div className="state-message error-state">

              <p>
                ⚠️ {error}
              </p>

              <button
                onClick={carregarUsuarios}
                className="btn-retry"
              >
                Recarregar
              </button>

            </div>
          )}

          {/* Conteúdo */}
          {!loading && !error && (
            <>
              {filteredUsers.length > 0 ? (

                <div className="table-responsive">

                  <table className="admin-table">

                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>E-mail</th>
                        <th>Perfil</th>
                        <th>Data de Cadastro</th>
                        <th className="th-actions">
                          Ações
                        </th>
                      </tr>
                    </thead>

                    <tbody>

                      {filteredUsers.map((u) => (

                        <tr key={u.id}>

                          <td>
                            {u.nome}
                          </td>

                          <td>
                            {u.email}
                          </td>

                          <td>
                            <span
                              className={`badge-role ${u.role}`}
                            >
                              {u.role}
                            </span>
                          </td>

                          <td>
                            {formatDate(u.createdAt)}
                          </td>

                          <td className="td-actions">

                            <div className="actions-wrapper">

                              <Link
                                to={`/editaruser/${u.id}`}
                                className="btn-action edit"
                                title="Editar usuário"
                              >
                                Editar
                              </Link>

                              <button
                                onClick={() =>
                                  setUserToDelete(u)
                                }
                                className="btn-action delete"
                                title="Excluir usuário"
                              >
                                Excluir
                              </button>

                            </div>

                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              ) : (

                <div className="state-message empty-state">

                  <p>
                    {filterQuery
                      ? "Nenhum usuário encontrado para essa busca."
                      : "Nenhum usuário cadastrado."}
                  </p>

                </div>

              )}
            </>
          )}

        </section>

      </main>

      <ConfirmModal
        isOpen={!!userToDelete}
        title="Confirmar Exclusão de Usuário"
        message={`Você está prestes a excluir permanentemente o usuário "${userToDelete?.nome}". Deseja continuar?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setUserToDelete(null)}
      />

    </>
  );
}

