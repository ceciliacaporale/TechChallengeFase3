import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { updateUser } from "../services/users";
import { useAuth } from "../context/AuthContext";

export default function ChangePassword() {
  const navigate = useNavigate();
  const { user, showNotification } = useAuth();

  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setErro("");

    if (!senha || !confirmarSenha) {
      setErro("Preencha os dois campos.");
      return;
    }

    if (senha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    try {
      setSalvando(true);

      await updateUser(user.id, {
        senha: senha,
      });

      showNotification(
        "Senha alterada com sucesso!",
        "success"
      );

      navigate(-1);
    } catch (err) {
      console.error(err);

      setErro(
        err?.message || "Erro ao alterar a senha."
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
            <h1>Bem - Vindo (a)  {user.nome}</h1>
            <h3>{user.role}</h3><br></br>
            <h2 >Alterar Senha</h2>

            <p style={{ color: "red"}}>
              Realize a troca da sua senha, por segurança.
            </p>
          </div>

          {erro && (
            <div className="form-alert error">
              {erro}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="editor-form"
          >
            <div className="form-group">
              <label htmlFor="senha">
                Nova senha *
              </label>

              <input
                id="senha"
                type="password"
                placeholder="Digite sua nova senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                minLength={6}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmarSenha">
                Confirmar nova senha *
              </label>

              <input
                id="confirmarSenha"
                type="password"
                placeholder="Digite a senha novamente"
                value={confirmarSenha}
                onChange={(e) =>
                  setConfirmarSenha(e.target.value)
                }
                minLength={6}
                required
              />
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
                  : "Alterar Senha"}
              </button>
            </div>
          </form>

        </div>
      </main>
    </>
  );
}