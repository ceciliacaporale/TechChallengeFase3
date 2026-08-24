import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Toast from "./components/Toast";

import Home from "./pages/home";
import Login from "./pages/Login";
import PostDetail from "./pages/PostDetail";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import Admin from "./pages/Admin";
import CreateUser from "./pages/CreateUser";
import Gerenciar from "./pages/Gerencia";
import EditUser from "./pages/EditUser";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toast />
        <Routes>
          {/* Rota inicial retrô/redirecionamento */}
          <Route path="/" element={<Navigate to="/home" replace />} />

          {/* Rota de Autenticação */}
          <Route path="/login" element={<Login />} />

          {/* Rotas Públicas */}
          <Route path="/home" element={<Home />} />
          <Route path="/post/:id" element={<PostDetail />} />

          {/* Rotas Protegidas (Exclusivas para Docentes Autenticados) */}
          <Route
            path="/criar"
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            }
          />

          <Route
            path="/editar/:id"
            element={
              <ProtectedRoute>
                <EditPost />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            }
          
          />
           <Route
            path="/gerencia"
            element={
              <ProtectedRoute>
                <Gerenciar />
              </ProtectedRoute>
            }
            
          />

          <Route
            path="/editaruser/:id"
            element={
              <ProtectedRoute>
                <EditUser />
              </ProtectedRoute>
            }
          />
            
           <Route
            path="/users"
            element={
              <ProtectedRoute>
                <CreateUser />
              </ProtectedRoute>
            }
            
          />

          {/* Rota Fallback 404 */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;