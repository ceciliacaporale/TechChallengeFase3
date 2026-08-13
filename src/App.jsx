import { useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import Home from "./pages/home";
import "./App.css";

import logo from "./assets/icon3.png";
import card from "./assets/card.png";

function Login() {
  const navigate = useNavigate();

  function acessar() {
    navigate("/home");
  }

  return (
    <div className="container">

      <header className="header">
        <img
          src={logo}
          alt="logo"
          className="logoTop"
        />

        <h1>Blog Educacional</h1>
      </header>


      <main className="content">

        <div className="logoCard">
          <img
            src={card}
            alt="Logo"
          />
        </div>


        <div className="login">

          <input
            type="text"
            placeholder="Usuário"
          />

          <input
            type="password"
            placeholder="Senha"
          />

          <button onClick={acessar}>
            Acessar
          </button>

        </div>

      </main>

    </div>
  );
}


function App() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/home"
          element={<Home />}
        />

      </Routes>

    </BrowserRouter>
  );
}


export default App;