import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function PostCard({ post, onDelete }) {
  const {user, isAuthenticated } = useAuth();
  
  const role = user?.role?.toLowerCase();

  const isAdmin = role === "admin";
  const isDocente = role === "docente";

  if (!post) {
    return <article className="post-card post-card--empty" aria-hidden="true" />;
  }

  const previewText =
    post.conteudo.length > 140
      ? `${post.conteudo.substring(0, 140)}...`
      : post.conteudo;

  const commentsCount = Array.isArray(post.comentarios)
    ? post.comentarios.length
    : 0;

  return (
    <article className="post-card">
      <div className="post-card-header">
        <h2 className="post-card__titulo">{post.titulo}</h2>
      </div>

      <p className="post-card__conteudo">{previewText}</p>

      <div className="post-card-meta">
        <div className="post-info">
          <span className="post-card__autor">✍️ {post.autor}</span>
          <span className="post-card__data">📅 {formatDate(post.data)}</span>
        </div>
        {commentsCount > 0 && (
          <span className="post-card__comments">💬 {commentsCount} coment.</span>
        )}
      </div>

      <div className="post-card-actions">
        <Link to={`/post/${post.id}`} className="btn-read-more">
          Ler Post Completo →
        </Link>

        {isAuthenticated && (isDocente || isAdmin) &&  (
          <div className="admin-quick-actions">
            <Link
              to={`/editar/${post.id}`}
              className="btn-quick-edit"
              title="Editar post"
            >
              ✏️
            </Link>
            {isAuthenticated && (isDocente || isAdmin) && onDelete && (
              <button
                onClick={() => onDelete(post)}
                className="btn-quick-delete"
                title="Excluir post"
              >
                🗑️
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
