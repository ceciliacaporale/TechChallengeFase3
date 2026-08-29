import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import ConfirmModal from "../components/ConfirmModal";
import { fetchPosts, deletePost } from "../services/posts";
import { useAuth } from "../context/AuthContext";

export default function Admin() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterQuery, setFilterQuery] = useState("");

  const [postToDelete, setPostToDelete] = useState(null);
  const { user, showNotification } = useAuth();

  const carregarPosts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchPosts();
      setPosts(data);
    } catch (err) {
      console.error("Erro ao carregar posts:", err);
      setError("Não foi possível carregar as postagens no painel administrativo.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarPosts();
  }, [carregarPosts]);

  const handleConfirmDelete = async () => {
    if (!postToDelete) return;
    try {
      await deletePost(postToDelete.id);
      showNotification(`Post "${postToDelete.titulo}" excluído com sucesso.`, "success");
      setPosts((prev) => prev.filter((p) => String(p.id) !== String(postToDelete.id)));
    } catch (err) {
      console.error("Erro ao excluir post:", err);
      showNotification("Erro ao excluir o post.", "error");
    } finally {
      setPostToDelete(null);
    }
  };

  const filteredPosts = posts.filter(
    (p) =>
      p.titulo.toLowerCase().includes(filterQuery.toLowerCase()) ||
      p.autor.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const formatDate = (val) => {
    if (!val) return "N/A";
    const d = new Date(val);
    if (Number.isNaN(d.getTime())) return val;
    return d.toLocaleDateString("pt-BR");
  };

  return (
    <>
      <Header />

      <main className="admin-container">
        <header className="admin-header-panel">
          <div>
            <h2>⚙️ Painel de Administração de Postagens</h2>
            <p>Gerencie as postagens do blog, edite textos ou adicione novas matérias.</p>
          </div>
          <Link to="/criar" className="btn-create-post-cta">
            ➕ Nova Postagem
          </Link>
        </header>

        {/* Card estatísticas */}
        <section className="admin-stats-grid">
          <div className="stat-card">
            <span className="stat-number">{posts.length}</span>
            <span className="stat-label">Total de Postagens</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {new Set(posts.map((p) => p.autor)).size}
            </span>
            <span className="stat-label">Autores Ativos</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {posts.reduce((acc, p) => acc + (p.comentarios?.length || 0), 0)}
            </span>
            <span className="stat-label">Total de Comentários</span>
          </div>
          <div className="stat-card stat-user">
            <span className="stat-number">🎓</span>
            <span className="stat-label">{user?.nome || "Docente"}</span>
          </div>
        </section>

        {/* Tabela de Gerenciamento */}
        <section className="admin-table-section">
          <div className="table-toolbar">
            <div className="toolbar-search">
              <input
                type="text"
                placeholder="Filtrar por título ou autor..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
              />
            </div>
            <span className="toolbar-count">
              Exibindo {filteredPosts.length} de {posts.length} artigos
            </span>
          </div>

          {loading && (
            <div className="state-message loading-state">
              <div className="spinner"></div>
              <p>Carregando painel de gerenciamento...</p>
            </div>
          )}

          {error && (
            <div className="state-message error-state">
              <p>⚠️ {error}</p>
              <button onClick={carregarPosts} className="btn-retry">
                Recarregar
              </button>
            </div>
          )}

          {!loading && !error && (
            <>
              {filteredPosts.length > 0 ? (
                <div className="table-responsive">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Título</th>
                        <th>Autor(a)</th>
                        <th>Data de Criação</th>
                        <th>Comentários</th>
                        <th className="th-actions">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPosts.map((post) => (
                        <tr key={post.id}>
                          <td className="td-title">
                            <Link to={`/post/${post.id}`} title="Ver postagem">
                              {post.titulo}
                            </Link>
                          </td>
                          <td className="td-author">{post.autor}</td>
                          <td className="td-date">{formatDate(post.data)}</td>
                          <td className="td-comments">
                            <span className="badge-comments">
                              💬 {post.comentarios?.length || 0}
                            </span>
                          </td>
                          <td className="td-actions">
                            <div className="actions-wrapper">
                              <Link
                                to={`/post/${post.id}`}
                                className="btn-action view"
                                title="Visualizar"
                              >
                                Ver
                              </Link>
                              <Link
                                to={`/editar/${post.id}`}
                                className="btn-action edit"
                                title="Editar"
                              >
                                Editar
                              </Link>
                              <button
                                onClick={() => setPostToDelete(post)}
                                className="btn-action delete"
                                title="Excluir"
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
                  <p>Nenhuma postagem encontrada para exibição.</p>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      <ConfirmModal
        isOpen={!!postToDelete}
        title="Confirmar Exclusão de Postagem"
        message={`Você está prestes a excluir permanentemente o artigo "${postToDelete?.titulo}". Deseja continuar?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPostToDelete(null)}
      />
    </>
  );
}
