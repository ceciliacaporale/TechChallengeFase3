import { useEffect, useState, useCallback } from "react";
import Header from "../components/Header";
import PostCard from "../components/PostCard";
import SearchBar from "../components/SearchBar";
import ConfirmModal from "../components/ConfirmModal";
import { fetchPosts, deletePost } from "../services/posts";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "../styles/home.css";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [postToDelete, setPostToDelete] = useState(null);
  const { isAuthenticated, showNotification } = useAuth();

  const carregarPosts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchPosts({ search });
      setPosts(data);
    } catch (err) {
      console.error("Erro ao carregar posts:", err);
      setError("Não foi possível carregar as postagens. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      carregarPosts();
    }, 250);

    return () => clearTimeout(timer);
  }, [carregarPosts]);

  const handleDeletePrompt = (post) => {
    setPostToDelete(post);
  };

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

  return (
    <>
      <Header />

      <main className="home-content">
        <section className="home-banner">
          <div className="banner-info">
            <h2>Artigos & Conteúdos Educacionais</h2>
            <p>
              Explore publicações desenvolvidas por nossos professores e
              pesquisadores. Aprenda sobre tecnologia, programação e inovação.
            </p>
          </div>
          {isAuthenticated && (
            <div className="banner-actions">
              <Link to="/criar" className="btn-cta-create">
                Criar Novo Artigo
              </Link>
            </div>
          )}
        </section>

        <section className="search-section">
          <SearchBar
            value={search}
            onChange={setSearch}
            onClear={() => setSearch("")}
          />
        </section>

        {loading && (
          <div className="state-message loading-state">
            <div className="spinner"></div>
            <p>Carregando postagens...</p>
          </div>
        )}

        {error && (
          <div className="state-message error-state">
            <p>⚠️ {error}</p>
            <button onClick={carregarPosts} className="btn-retry">
              Tentar Novamente
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            {posts.length > 0 ? (
              <div className="posts-grid">
                {posts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onDelete={handleDeletePrompt}
                  />
                ))}
              </div>
            ) : (
              <div className="state-message empty-state">
                <h3>Nenhuma postagem encontrada</h3>
                <p>
                  {search
                    ? `Não foram encontradas postagens com o termo "${search}".`
                    : "Ainda não existem postagens cadastradas no blog."}
                </p>
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="btn-clear-search"
                  >
                    Limpar filtro de busca
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </main>

      <ConfirmModal
        isOpen={!!postToDelete}
        title="Confirmar Exclusão"
        message={`Deseja realmente excluir a postagem "${postToDelete?.titulo}"? Esta ação não pode ser desfeita.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPostToDelete(null)}
      />
    </>
  );
}