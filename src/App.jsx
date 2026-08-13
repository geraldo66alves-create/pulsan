import React, { useState } from "react";

import Inicio from "./pages/Inicio";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Ambiente from "./pages/Ambiente";
import Desabafar from "./pages/Desabafar";
import Ajudar from "./pages/Ajudar";
import Conversa from "./pages/Conversa";
import Solicitacoes from "./pages/Solicitacoes";
import SolicitarAjuda from "./pages/SolicitarAjuda";
import Avaliacao from "./pages/Avaliacao";
import Perfil from "./pages/Perfil";
import Premios from "./pages/Premios";


// =====================================================
// MENU INFERIOR
// =====================================================

function MenuInferior({ pagina, irPara }) {
  const paginasComMenu = [
    "ambiente",
    "desabafar",
    "ajudar",
    "solicitacoes",
    "conversa",
    "solicitar-ajuda",
    "avaliacao",
    "perfil",
    "premios",
  ];

  if (!paginasComMenu.includes(pagina)) {
    return null;
  }

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "76px",
        background: "rgba(255,255,255,0.97)",
        borderTop: "1px solid #e5e5e5",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        alignItems: "center",
        boxShadow: "0 -5px 18px rgba(0,0,0,0.05)",
        zIndex: 9999,
        backdropFilter: "blur(10px)",
      }}
    >

      {/* ==========================================
          INÍCIO
      ========================================== */}

      <button
        type="button"
        onClick={() => irPara("ambiente")}
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          color:
            pagina === "ambiente"
              ? "#20adb0"
              : "#777",
          fontSize: "11px",
          fontWeight:
            pagina === "ambiente"
              ? "700"
              : "600",
          padding: "6px",
        }}
      >
        <div
          style={{
            fontSize: "22px",
            marginBottom: "3px",
          }}
        >
          🏠
        </div>

        <span>
          Início
        </span>
      </button>


      {/* ==========================================
          CONVERSAS
      ========================================== */}

      <button
        type="button"
        onClick={() =>
          irPara("solicitacoes")
        }
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          color:
            pagina === "solicitacoes" ||
            pagina === "conversa"
              ? "#20adb0"
              : "#777",
          fontSize: "11px",
          fontWeight:
            pagina === "solicitacoes" ||
            pagina === "conversa"
              ? "700"
              : "600",
          padding: "6px",
        }}
      >
        <div
          style={{
            fontSize: "22px",
            marginBottom: "3px",
          }}
        >
          💬
        </div>

        <span>
          Conversas
        </span>
      </button>


      {/* ==========================================
          AJUDAR
          SOMENTE DECORAÇÃO
      ========================================== */}

      <button
        type="button"
        style={{
          border: "none",
          background: "transparent",
          cursor: "default",
          color: "#4d7f70",
          fontSize: "11px",
          fontWeight: "600",
          padding: "6px",
        }}
      >
        <div
          style={{
            fontSize: "22px",
            marginBottom: "3px",
          }}
        >
          💚
        </div>

        <span>
          Ajudar
        </span>
      </button>


      {/* ==========================================
          PERFIL
      ========================================== */}

      <button
        type="button"
        onClick={() =>
          irPara("perfil")
        }
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          color:
            pagina === "perfil"
              ? "#20adb0"
              : "#777",
          fontSize: "11px",
          fontWeight:
            pagina === "perfil"
              ? "700"
              : "600",
          padding: "6px",
        }}
      >
        <div
          style={{
            fontSize: "22px",
            marginBottom: "3px",
          }}
        >
          👤
        </div>

        <span>
          Perfil
        </span>
      </button>

    </nav>
  );
}


// =====================================================
// APP
// =====================================================

function App() {
  const [pagina, setPagina] =
    useState("inicio");


  // =====================================================
  // NAVEGAÇÃO
  // =====================================================

  function irPara(novaPagina) {
    setPagina(novaPagina);

    // Sempre volta para o topo
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }


  // =====================================================
  // TELA INICIAL
  // =====================================================

  if (pagina === "inicio") {
    return (
      <Inicio
        irPara={irPara}
      />
    );
  }


  // =====================================================
  // LOGIN
  // =====================================================

  if (pagina === "login") {
    return (
      <Login
        irPara={irPara}
      />
    );
  }


  // =====================================================
  // CADASTRO
  // =====================================================

  if (pagina === "cadastro") {
    return (
      <Cadastro
        irPara={irPara}
      />
    );
  }


  // =====================================================
  // PÁGINAS INTERNAS
  // =====================================================

  let conteudo = null;


  if (pagina === "ambiente") {
    conteudo = (
      <Ambiente
        irPara={irPara}
      />
    );
  }


  if (pagina === "desabafar") {
    conteudo = (
      <Desabafar
        irPara={irPara}
      />
    );
  }


  if (pagina === "ajudar") {
    conteudo = (
      <Ajudar
        irPara={irPara}
      />
    );
  }


  if (pagina === "solicitacoes") {
    conteudo = (
      <Solicitacoes
        irPara={irPara}
      />
    );
  }


  if (pagina === "conversa") {
    conteudo = (
      <Conversa
        irPara={irPara}
      />
    );
  }


  if (pagina === "solicitar-ajuda") {
    conteudo = (
      <SolicitarAjuda
        irPara={irPara}
      />
    );
  }


  if (pagina === "avaliacao") {
    conteudo = (
      <Avaliacao
        irPara={irPara}
      />
    );
  }


  if (pagina === "perfil") {
    conteudo = (
      <Perfil
        irPara={irPara}
      />
    );
  }


  if (pagina === "premios") {
    conteudo = (
      <Premios
        irPara={irPara}
      />
    );
  }


  // =====================================================
  // CASO NÃO ENCONTRE
  // =====================================================

  if (!conteudo) {
    conteudo = (
      <Ambiente
        irPara={irPara}
      />
    );
  }


  // =====================================================
  // PÁGINA + MENU
  // =====================================================

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          paddingBottom: "76px",
          boxSizing: "border-box",
        }}
      >
        {conteudo}
      </div>

      <MenuInferior
        pagina={pagina}
        irPara={irPara}
      />
    </>
  );
}


export default App;