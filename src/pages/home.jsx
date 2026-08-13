import { useEffect, useState } from "react";
import "../styles/home.css";
import { fetchPosts } from "../services/posts";
import logo from "../assets/icon3.png";


export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function carregarPosts() {
      try {
        const data = await fetchPosts();
        setPosts(data);
      } catch (err) {
        console.error("Erro ao carregar posts:", err);
        setError("Não foi possível carregar os posts.");
      } finally {
        setLoading(false);
      }
    }

    carregarPosts();
  }, []);

  const postsFiltrados = posts.filter((p) =>
    p.titulo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <header className="home-header">
        <div className="header-logo">
          <img src={logo} alt="Logo" />
        </div>

        <h1>Postagens</h1>

        <div className="header-user">
          <div className="user-icon">👤</div>
        </div>
      </header>

      <main className="home-content">
        <div className="search-bar">
          <div className="search-input-wrapper">
            <input
              type="text"
              placeholder="Buscar postagens..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>
          <button className="filter-button" aria-label="Filtrar">
            ☰
          </button>
        </div>

        {loading && <p>Carregando posts...</p>}
        {error && <p>{error}</p>}

        {!loading && !error && (
          <div className="posts-grid">
            {postsFiltrados.map((post) => (
              <article key={post.id} className="post-card">
                <h2>{post.titulo}</h2>

                <p className="post-content">{post.conteudo}</p>

                <div className="post-info">
                  <strong>{post.autor}</strong>
                  <span>
                    {post.data
                      ? new Date(post.data).toLocaleDateString("pt-BR")
                      : ""}
                  </span>
                </div>
              </article>
            ))}

            {postsFiltrados.length === 0 && (
              <p>Nenhum post encontrado.</p>
            )}
          </div>
        )}
      </main>
    </>
  );
}