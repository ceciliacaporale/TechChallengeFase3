import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const MOCK_TEACHER = {
  id: "prof_1",
  nome: "Prof. Dr. Silva",
  email: "professor@fiap.com.br",
  cargo: "Docente",
  isTeacher: true,
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("tech_challenge_user");
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error("Erro ao carregar usuário do localStorage:", e);
      }
    }
    return null;
  });

  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const login = (usuario, senha) => {
    if (usuario && senha) {
      const loggedUser = {
        ...MOCK_TEACHER,
        nome: usuario.length > 3 ? usuario : "Prof. Dr. Silva",
      };
      setUser(loggedUser);
      localStorage.setItem("tech_challenge_user", JSON.stringify(loggedUser));
      showNotification(`Bem-vindo(a), ${loggedUser.nome}!`, "success");
      return true;
    }
    showNotification("Informe usuário e senha válidos.", "error");
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("tech_challenge_user");
    showNotification("Você encerrou sua sessão com sucesso.", "info");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isTeacher: user?.isTeacher ?? false,
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
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
