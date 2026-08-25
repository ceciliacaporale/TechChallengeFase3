import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import ConfirmModal from "../components/ConfirmModal";
import { fetchPostById, addComment, deletePost } from "../services/posts";
import { useAuth } from "../context/AuthContext";

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, showNotification } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [nomeComentario, setNomeComentario] = useState("");
  const [textoComentario, setTextoComentario] = useState("");
  const [enviandoComentario, setEnviandoComentario] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

 const role = user?.role?.toLowerCase();

  const isAdmin = role === "admin";
  const isDocente = role === "docente";

  useEffect(() => {
    async function carregarPost() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchPostById(id);
        setPost(data);
      } catch (err) {
        console.error("Erro ao carregar post:", err);
        setError("Postagem não encontrada ou indisponível.");
      } finally {
        setLoading(false);
      }
    }

    carregarPost();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!textoComentario.trim()) {
      showNotification("Por favor, digite uma mensagem para o comentário.", "warning");
      return;
    }

    setEnviandoComentario(true);
    try {
      const autorFinal = nomeComentario.trim()
        ? nomeComentario
        : user
          ? user.nome
          : "Estudante Visitante";

      const novoComentario = await addComment(id, {
        autor: autorFinal,
        texto: textoComentario,
      });

      setPost((prev) => ({
        ...prev,
        comentarios: [...(prev.comentarios || []), novoComentario],
      }));

      setTextoComentario("");
      if (!user) setNomeComentario("");
      showNotification("Comentario publicado com sucesso!", "success");
    } catch (err) {
      console.error("Erro ao adicionar comentário:", err);
      showNotification("Erro ao publicar comentário. Tente novamente.", "error");
    } finally {
      setEnviandoComentario(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deletePost(id);
      showNotification("Postagem excluída com sucesso.", "success");
      navigate("/home");
    } catch (err) {
      console.error("Erro ao excluir:", err);
      showNotification("Erro ao excluir postagem.", "error");
    } finally {
      setIsDeleteModalOpen(false);
    }
  };

  const formatDate = (val) => {
    if (!val) return "";
    const d = new Date(val);
    if (Number.isNaN(d.getTime())) return val;
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Header />

      <main className="detail-container">
        <div className="detail-nav-actions">
          <button onClick={() => navigate(-1)} className="btn-back">
            ← Voltar para lista
          </button>

          { isAuthenticated && (isDocente || isAdmin) && post && (
            <div className="detail-teacher-actions">
              <Link to={`/editar/${post.id}`} className="btn-edit-post">
                Editar Postagem
              </Link>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="btn-delete-post"
              >
                Excluir
              </button>
            </div>
          )}
        </div>

        {loading && (
          <div className="state-message loading-state">
            <div className="spinner"></div>
            <p>Carregando conteúdo do post...</p>
          </div>
        )}

        {error && (
          <div className="state-message error-state">
            <h3>⚠️ Ops!</h3>
            <p>{error}</p>
            <button onClick={() => navigate("/home")} className="btn-retry">
              Ir para a Página Inicial
            </button>
          </div>
        )}

        {!loading && !error && post && (
          <article className="post-detail-card">
            <header className="detail-header">
              <h1 className="detail-title">{post.titulo}</h1>

              <div className="detail-meta">
                <div className="meta-author">
                  <span className="meta-avatar">✍️</span>
                  <div>
                    <strong>{post.autor}</strong>
                    <span className="author-role">Autor / Docente</span>
                  </div>
                </div>

                <div className="meta-date">
                  <span>📅 Publicado em {formatDate(post.data)}</span>
                </div>
              </div>
            </header>

            <div className="detail-body">
              {post.conteudo.split("\n\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>

            <section className="comments-section">
              <h2>Comentários ({post.comentarios?.length || 0})</h2>

              {/* Lista de Comentários */}
              <div className="comments-list">
                {post.comentarios && post.comentarios.length > 0 ? (
                  post.comentarios.map((c) => (
                    <div key={c.id} className="comment-item">
                      <div className="comment-header">
                        <strong>👤 {c.autor}</strong>
                        <span className="comment-date">{formatDate(c.data)}</span>
                      </div>
                      <p className="comment-text">{c.texto}</p>
                    </div>
                  ))
                ) : (
                  <p className="no-comments">
                    Nenhum comentário ainda. Seja o primeiro a comentar!
                  </p>
                )}
              </div>

              {/* Form de Comentários */}
              <form onSubmit={handleAddComment} className="comment-form">
                <h3>Deixe seu comentário</h3>

                {!user && (
                  <div className="form-group">
                    <label htmlFor="comment-author">Seu Nome</label>
                    <input
                      id="comment-author"
                      type="text"
                      placeholder="Ex: Maria Souza"
                      value={nomeComentario}
                      onChange={(e) => setNomeComentario(e.target.value)}
                    />
                  </div>
                )}

                <div className="form-group">
                  <label htmlFor="comment-text">Mensagem</label>
                  <textarea
                    id="comment-text"
                    rows="3"
                    placeholder="Escreva seu comentário aqui..."
                    value={textoComentario}
                    onChange={(e) => setTextoComentario(e.target.value)}
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn-submit-comment"
                  disabled={enviandoComentario}
                >
                  {enviandoComentario ? "Enviando..." : "💬 Publicar Comentário"}
                </button>
              </form>
            </section>
          </article>
        )}
      </main>

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Excluir Postagem"
        message={`Tem certeza que deseja excluir "${post?.titulo}"? Esta ação removerá a postagem permanentemente.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </>
  );
}
