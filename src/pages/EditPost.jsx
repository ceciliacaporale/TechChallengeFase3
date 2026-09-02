import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { fetchPostById, updatePost } from "../services/posts";
import { useAuth } from "../context/AuthContext";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useAuth();

  const [titulo, setTitulo] = useState("");
  const [autor, setAutor] = useState("");
  const [conteudo, setConteudo] = useState("");

  const [loading, setLoading] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  const [ativo, setAtivo] = useState(true);

  useEffect(() => {
    async function carregarPost() {
      setLoading(true);
      setErro("");

      try {
        const post = await fetchPostById(id);

        setTitulo(post.titulo);
        setAutor(post.autor);
        setConteudo(post.conteudo);

        // Recupera o status salvo no navegador
        const ativoSalvo = localStorage.getItem(`post_ativo_${id}`);

        // Se não existir, considera ativo
        setAtivo(ativoSalvo !== "false");

      } catch (err) {
        console.error("Erro ao carregar post:", err);

        setErro(
          "Não foi possível carregar as informações do post para edição."
        );
      } finally {
        setLoading(false);
      }
    }

    carregarPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titulo.trim() || !conteudo.trim() || !autor.trim()) {
      setErro(
        "Por favor, preencha todos os campos obrigatórios."
      );
      return;
    }

    setSalvando(true);
    setErro("");

    try {
      await updatePost(id, {
        titulo: titulo.trim(),
        autor: autor.trim(),
        conteudo: conteudo.trim(),
      });

      // Salva o status ativo/inativo no navegador
      localStorage.setItem(
        `post_ativo_${id}`,
        JSON.stringify(ativo)
      );

      showNotification(
        `Post "${titulo}" atualizado com sucesso!`,
        "success"
      );

      navigate("/");
    } catch (err) {
      console.error("Erro ao atualizar post:", err);

      setErro(
        "Erro ao salvar as alterações do post. Tente novamente."
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
            <h2>Editar Postagem</h2>

            <p>
              Altere os campos abaixo e clique em salvar
              para atualizar o artigo.
            </p>
          </div>

          {loading && (
            <div className="state-message loading-state">
              <div className="spinner"></div>

              <p>
                Carregando dados da postagem...
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
                <label htmlFor="titulo">
                  Título da Postagem *
                </label>

                <input
                  id="titulo"
                  type="text"
                  value={titulo}
                  onChange={(e) =>
                    setTitulo(e.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="autor">
                  Autor(a) / Docente *
                </label>

                <input
                  id="autor"
                  type="text"
                  value={autor}
                  onChange={(e) =>
                    setAutor(e.target.value)
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="conteudo">
                  Conteúdo da Postagem *
                </label>

                <textarea
                  id="conteudo"
                  rows="10"
                  value={conteudo}
                  onChange={(e) =>
                    setConteudo(e.target.value)
                  }
                  required
                ></textarea>

                <span className="char-count">
                  {conteudo.length} caracteres digitados
                </span>
              </div>

              {/* ATIVO / INATIVO */}
              <div className="form-group checkbox-group">
                <label htmlFor="ativo">

                  <input
                    id="ativo"
                    type="checkbox"
                    checked={ativo}
                    onChange={(e) =>
                      setAtivo(e.target.checked)
                    }
                  />

                  <span>
                    Postagem ativa
                  </span>

                </label>
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