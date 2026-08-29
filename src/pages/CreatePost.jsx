import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { createPost } from "../services/posts";
import { useAuth } from "../context/AuthContext";

export default function CreatePost() {
  const { user, showNotification } = useAuth();
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState(user?.nome || "Prof. Dr. Eduardo Silva");
  const [conteudo, setConteudo] = useState("");

  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titulo.trim() || !conteudo.trim() || !autor.trim()) {
      setErro("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setSalvando(true);
    setErro("");

    try {
      const novoPost = await createPost({
        titulo: titulo.trim(),
        autor: autor.trim(),
        conteudo: conteudo.trim(),
      });

      showNotification(`Post "${novoPost.titulo}" publicado com sucesso!`, "success");
      navigate(`/post/${novoPost.id}`);
    } catch (err) {
      console.error("Erro ao criar post:", err);
      setErro("Não foi possível criar a postagem. Tente novamente.");
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
            <h2> Nova Postagem</h2>
            <p>Preencha os campos abaixo para publicar um novo artigo no blog.</p>
          </div>

          {erro && <div className="form-alert error">⚠️ {erro}</div>}

          <form onSubmit={handleSubmit} className="editor-form">
            <div className="form-group">
              <label htmlFor="titulo">Título da Postagem *</label>
              <input
                id="titulo"
                type="text"
                placeholder="Ex: Introdução à Programação Funcional em JavaScript"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="autor">Autor(a) / Docente *</label>
              <input
                id="autor"
                type="text"
                placeholder="Ex: Prof. Dr. Silva"
                value={autor}
                onChange={(e) => setAutor(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="conteudo">Conteúdo da Postagem *</label>
              <textarea
                id="conteudo"
                rows="10"
                placeholder="Escreva o texto completo do seu artigo..."
                value={conteudo}
                onChange={(e) => setConteudo(e.target.value)}
                required
              ></textarea>
              <span className="char-count">
                {conteudo.length} caracteres digitados
              </span>
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate(-1)}
                disabled={salvando}
              >
                Cancelar
              </button>
              <button type="submit" className="btn-submit" disabled={salvando}>
                {salvando ? "Publicando..." : "Publicar Postagem"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
