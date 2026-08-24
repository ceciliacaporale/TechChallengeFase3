import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem(
      "tech_challenge_user"
    );

    if (!savedUser) {
      return null;
    }

    try {
      return JSON.parse(savedUser);
    } catch (error) {
      console.error(
        "Erro ao carregar usuário:",
        error
      );

      return null;
    }
  });

  const [notification, setNotification] =
    useState(null);

  const showNotification = (
    message,
    type = "info"
  ) => {
    setNotification({
      message,
      type,
    });

    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const login = async (usuario, senha) => {
    try {
      const response = await fetch(
        `${API_URL}/login`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email: usuario,
            senha: senha,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            data.message ||
            "Usuário ou senha inválidos."
        );
      }

      if (!data.token) {
        throw new Error(
          "O servidor não retornou o token."
        );
      }

      /*
       * Salva o JWT real.
       */
      localStorage.setItem(
        "tech_challenge_token",
        data.token
      );

      /*
       * Usuário retornado pelo backend.
       */
      const loggedUser = data.user || data.usuario;

      if (loggedUser) {
        setUser(loggedUser);

        localStorage.setItem(
          "tech_challenge_user",
          JSON.stringify(loggedUser)
        );
      }

      showNotification(
        `Bem-vindo(a), ${
          loggedUser?.nome || usuario
        }!`,
        "success"
      );

      return true;

    } catch (error) {
      console.error(
        "Erro ao realizar login:",
        error
      );

      /*
       * Remove token antigo caso exista.
       */
      localStorage.removeItem(
        "tech_challenge_token"
      );

      showNotification(
        error.message ||
          "Não foi possível realizar o login.",
        "error"
      );

      return false;
    }
  };

  const logout = () => {
    setUser(null);

    localStorage.removeItem(
      "tech_challenge_user"
    );

    localStorage.removeItem(
      "tech_challenge_token"
    );

    showNotification(
      "Você encerrou sua sessão com sucesso.",
      "info"
    );
  };

  return (
    <AuthContext.Provider
      value={{
        user,

        isAuthenticated: !!user,

        isTeacher:
          user?.isTeacher ??
          user?.cargo === "Docente" ??
          false,

        login,

        logout,

        notification,

        showNotification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth deve ser usado dentro de um AuthProvider"
    );
  }

  return context;
}