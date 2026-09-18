import React, { useEffect, useState } from "react";
import "./tema.css";

import Inicio from "./pages/Inicio";
import Login from "./pages/Login";
import PainelAdmin from "./pages/PainelAdmin";
import GestaoPsicologos from "./pages/GestaoPsicologos";
import Alertas from "./pages/Alertas";
import Cadastro from "./pages/Cadastro";
import Ambiente from "./pages/Ambiente";
import Desabafar from "./pages/Desabafar";
import Reflexao from "./pages/Reflexao";
import Conversas from "./pages/Conversa";
import Solicitacoes from "./pages/Solicitacoes";
import SolicitarAjuda from "./pages/SolicitarAjuda";
import Avaliacao from "./pages/Avaliacao";
import Perfil from "./pages/Perfil";
import Acessibilidade from "./pages/Acessibilidade";
import AcessibilidadeInicial from "./pages/AcessibilidadeInicial";
import Premios from "./pages/Premios";
import RecuperarSenha from "./pages/RecuperarSenha";
import RedefinirSenha from "./pages/RedefinirSenha";


/* =====================================================
   TEMA GLOBAL PULSAN — CONTRASTE DOS CARDS
   O modo é alterado pelo Perfil e controlado pelo App.
===================================================== */
const estiloTemaGlobal = `
  :root {
    --pulsan-bg: #EAF3FF;
    --pulsan-card: #FFFFFF;
    --pulsan-card-secundario: #F7FAFF;
    --pulsan-texto: #0F2D5B;
    --pulsan-texto-secundario: #5F7695;
    --pulsan-borda: #A8C7FF;
    --pulsan-primaria: #3A7DFF;
  }

  html[data-theme="escuro"] {
    --pulsan-bg: #081B35;
    --pulsan-card: #0F2D5B;
    --pulsan-card-secundario: #15365F;
    --pulsan-texto: #FFFFFF;
    --pulsan-texto-secundario: #C2D2E8;
    --pulsan-borda: #416DA4;
    --pulsan-primaria: #6EA0FF;
  }

  html[data-theme="escuro"] body {
    background: #081B35 !important;
    color: #FFFFFF;
  }

  /* Cards e superfícies que usam as variáveis do Pulsan */
  html[data-theme="escuro"] .pulsan-app [style*="background: white"],
  html[data-theme="escuro"] .pulsan-app [style*="background: #fff"],
  html[data-theme="escuro"] .pulsan-app [style*="background:#fff"],
  html[data-theme="escuro"] .pulsan-app [style*="background: rgb(255, 255, 255)"] {
    background: #0F2D5B !important;
    color: #FFFFFF !important;
  }

  /* Aumenta a separação visual dos cards no escuro */
  html[data-theme="escuro"] .pulsan-app .ambiente-card,
  html[data-theme="escuro"] .pulsan-app .ambiente-post,
  html[data-theme="escuro"] .pulsan-app .ambiente-hero-card {
    background: #0F2D5B !important;
    border-color: #416DA4 !important;
    box-shadow: 0 8px 24px rgba(0,0,0,.28) !important;
  }

  html[data-theme="escuro"] .pulsan-app .ambiente-card-soft {
    background: #15365F !important;
  }

  html[data-theme="escuro"] .pulsan-app input,
  html[data-theme="escuro"] .pulsan-app textarea,
  html[data-theme="escuro"] .pulsan-app select {
    background: #15365F !important;
    color: #FFFFFF !important;
    border-color: #416DA4 !important;
  }

  html[data-theme="escuro"] .pulsan-app input::placeholder,
  html[data-theme="escuro"] .pulsan-app textarea::placeholder {
    color: #B8C9DF !important;
  }

  html[data-theme="escuro"] .pulsan-app button {
    color: inherit;
  }

  html[data-theme="escuro"] .pulsan-app .pulsan-menu-inferior {
    background: #0F2D5B !important;
    border-top-color: #416DA4 !important;
    box-shadow: 0 -8px 25px rgba(0,0,0,.32) !important;
  }

  /* =====================================================
     ACESSIBILIDADE GLOBAL — PULSAN
     As opções abaixo funcionam em TODAS as páginas que
     ficam dentro de .pulsan-app.
  ===================================================== */

  /* ALTO CONTRASTE */
  html[data-contraste="alto"] .pulsan-app {
    --pulsan-bg: #000000 !important;
    --pulsan-card: #111111 !important;
    --pulsan-card-secundario: #1A1A1A !important;
    --pulsan-texto: #FFFFFF !important;
    --pulsan-texto-secundario: #FFFFFF !important;
    --pulsan-borda: #FFFFFF !important;
    --pulsan-primaria: #FFFF00 !important;
  }

  html[data-contraste="alto"] .pulsan-app,
  html[data-contraste="alto"] .pulsan-app * {
    border-color: #FFFFFF !important;
  }

  html[data-contraste="alto"] .pulsan-app {
    background: #000000 !important;
    color: #FFFFFF !important;
  }

  html[data-contraste="alto"] .pulsan-app button,
  html[data-contraste="alto"] .pulsan-app a {
    color: #FFFF00 !important;
  }

  html[data-contraste="alto"] .pulsan-app input,
  html[data-contraste="alto"] .pulsan-app textarea,
  html[data-contraste="alto"] .pulsan-app select {
    background: #000000 !important;
    color: #FFFFFF !important;
    border: 2px solid #FFFFFF !important;
  }

  html[data-contraste="alto"] .pulsan-app input::placeholder,
  html[data-contraste="alto"] .pulsan-app textarea::placeholder {
    color: #FFFFFF !important;
    opacity: 1 !important;
  }

  html[data-contraste="alto"] .pulsan-app [style*="background"],
  html[data-contraste="alto"] .pulsan-app [style*="backgroundColor"] {
    color: #FFFFFF !important;
  }

  /* TEXTO MAIOR */
  html[data-texto-grande="true"] .pulsan-app {
    font-size: 18px;
  }

  html[data-texto-grande="true"] .pulsan-app p,
  html[data-texto-grande="true"] .pulsan-app span,
  html[data-texto-grande="true"] .pulsan-app label,
  html[data-texto-grande="true"] .pulsan-app li,
  html[data-texto-grande="true"] .pulsan-app input,
  html[data-texto-grande="true"] .pulsan-app textarea,
  html[data-texto-grande="true"] .pulsan-app select,
  html[data-texto-grande="true"] .pulsan-app button {
    font-size: 1.08em !important;
  }

  html[data-texto-grande="true"] .pulsan-app h1 {
    font-size: clamp(2rem, 5vw, 3.4rem) !important;
  }

  html[data-texto-grande="true"] .pulsan-app h2 {
    font-size: clamp(1.65rem, 4vw, 2.5rem) !important;
  }

  html[data-texto-grande="true"] .pulsan-app h3 {
    font-size: clamp(1.35rem, 3vw, 2rem) !important;
  }

  /* BOTÕES E ÁREAS DE TOQUE MAIORES */
  html[data-botoes-grandes="true"] .pulsan-app button,
  html[data-botoes-grandes="true"] .pulsan-app a[role="button"],
  html[data-botoes-grandes="true"] .pulsan-app input[type="button"],
  html[data-botoes-grandes="true"] .pulsan-app input[type="submit"] {
    min-height: 52px !important;
    min-width: 48px;
    padding: 12px 18px !important;
  }

  html[data-botoes-grandes="true"] .pulsan-app input,
  html[data-botoes-grandes="true"] .pulsan-app textarea,
  html[data-botoes-grandes="true"] .pulsan-app select {
    min-height: 52px !important;
  }

  /* REDUZIR ANIMAÇÕES */
  html[data-reduzir-animacoes="true"] .pulsan-app *,
  html[data-reduzir-animacoes="true"] .pulsan-app *::before,
  html[data-reduzir-animacoes="true"] .pulsan-app *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }

  /* FOCO VISÍVEL PARA TECLADO */
  .pulsan-app button:focus-visible,
  .pulsan-app a:focus-visible,
  .pulsan-app input:focus-visible,
  .pulsan-app textarea:focus-visible,
  .pulsan-app select:focus-visible {
    outline: 3px solid #3A7DFF !important;
    outline-offset: 3px !important;
  }

  html[data-contraste="alto"] .pulsan-app button:focus-visible,
  html[data-contraste="alto"] .pulsan-app a:focus-visible,
  html[data-contraste="alto"] .pulsan-app input:focus-visible,
  html[data-contraste="alto"] .pulsan-app textarea:focus-visible,
  html[data-contraste="alto"] .pulsan-app select:focus-visible {
    outline-color: #FFFF00 !important;
  }

  /* DALTONISMO
     A opção é aplicada como filtro global sem alterar
     permanentemente as cores originais do Pulsan. */
  html[data-daltonismo="protanopia"] .pulsan-app {
    filter: url("#pulsan-protanopia");
  }

  html[data-daltonismo="deuteranopia"] .pulsan-app {
    filter: url("#pulsan-deuteranopia");
  }

  html[data-daltonismo="tritanopia"] .pulsan-app {
    filter: url("#pulsan-tritanopia");
  }

  /* Evita que o filtro seja aplicado ao próprio SVG de acessibilidade. */
  #pulsan-filtros-acessibilidade {
    position: absolute;
    width: 0;
    height: 0;
    overflow: hidden;
  }
`;

if (typeof document !== "undefined" && !document.getElementById("pulsan-tema-global")) {
  const styleTema = document.createElement("style");
  styleTema.id = "pulsan-tema-global";
  styleTema.textContent = estiloTemaGlobal;
  document.head.appendChild(styleTema);
}

/* Filtros de daltonismo usados pela acessibilidade global. */
if (typeof document !== "undefined" && !document.getElementById("pulsan-filtros-acessibilidade")) {
  const svgFiltros = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgFiltros.id = "pulsan-filtros-acessibilidade";
  svgFiltros.setAttribute("aria-hidden", "true");
  svgFiltros.innerHTML = `
    <filter id="pulsan-protanopia">
      <feColorMatrix type="matrix"
        values="
          0.567 0.433 0     0 0
          0.558 0.442 0     0 0
          0     0.242 0.758 0 0
          0     0     0     1 0" />
    </filter>

    <filter id="pulsan-deuteranopia">
      <feColorMatrix type="matrix"
        values="
          0.625 0.375 0     0 0
          0.700 0.300 0     0 0
          0     0.300 0.700 0 0
          0     0     0     1 0" />
    </filter>

    <filter id="pulsan-tritanopia">
      <feColorMatrix type="matrix"
        values="
          0.950 0.050 0     0 0
          0     0.433 0.567 0 0
          0     0.475 0.525 0 0
          0     0     0     1 0" />
    </filter>
  `;
  document.body.appendChild(svgFiltros);
}

// =====================================================
// MENU INFERIOR
// =====================================================

function MenuInferior({ pagina, irPara }) {
  const paginasComMenu = [
    "ambiente",
    "desabafar",
    "reflexao",
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
      className="pulsan-menu-inferior"
      aria-label="Menu principal"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        minHeight: "76px",
        background: "var(--pulsan-card, rgba(255,255,255,0.97))",
        borderTop: "1px solid var(--pulsan-borda, #e5e5e5)",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        alignItems: "center",
        boxShadow: "0 -5px 18px rgba(0,0,0,0.05)",
        zIndex: 9999,
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        padding: "5px 8px",
        boxSizing: "border-box",
      }}
    >
      <button
        type="button"
        onClick={() => irPara("ambiente")}
        aria-label="Início"
        aria-current={pagina === "ambiente" ? "page" : undefined}
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          color:
            pagina === "ambiente"
              ? "var(--pulsan-primaria, #20adb0)"
              : "var(--pulsan-texto-secundario, #777)",
          fontSize: "11px",
          fontWeight: pagina === "ambiente" ? "700" : "600",
          padding: "6px",
          minWidth: 0,
        }}
      >
        <div style={{ fontSize: "22px", marginBottom: "3px" }}>
          🏠
        </div>

        <span>Início</span>
      </button>

      <button
        type="button"
        onClick={() => irPara("solicitacoes")}
        aria-label="Conversas"
        aria-current={
          pagina === "solicitacoes" || pagina === "conversa"
            ? "page"
            : undefined
        }
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          color:
            pagina === "solicitacoes" || pagina === "conversa"
              ? "var(--pulsan-primaria, #20adb0)"
              : "var(--pulsan-texto-secundario, #777)",
          fontSize: "11px",
          fontWeight:
            pagina === "solicitacoes" || pagina === "conversa"
              ? "700"
              : "600",
          padding: "6px",
          minWidth: 0,
        }}
      >
        <div style={{ fontSize: "22px", marginBottom: "3px" }}>
          💬
        </div>

        <span>Conversas</span>
      </button>

      <button
        type="button"
        onClick={() => irPara("reflexao")}
        aria-label="Reflexão"
        aria-current={pagina === "reflexao" ? "page" : undefined}
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          color:
            pagina === "reflexao"
              ? "var(--pulsan-primaria, #20adb0)"
              : "var(--pulsan-texto-secundario, #777)",
          fontSize: "11px",
          fontWeight: pagina === "reflexao" ? "700" : "600",
          padding: "6px",
          minWidth: 0,
        }}
      >
        <div style={{ fontSize: "22px", marginBottom: "3px" }}>
          🧠
        </div>

        <span>Reflexão</span>
      </button>

      <button
        type="button"
        onClick={() => irPara("perfil")}
        aria-label="Perfil"
        aria-current={pagina === "perfil" ? "page" : undefined}
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          color:
            pagina === "perfil"
              ? "var(--pulsan-primaria, #20adb0)"
              : "var(--pulsan-texto-secundario, #777)",
          fontSize: "11px",
          fontWeight: pagina === "perfil" ? "700" : "600",
          padding: "6px",
          minWidth: 0,
        }}
      >
        <div style={{ fontSize: "22px", marginBottom: "3px" }}>
          👤
        </div>

        <span>Perfil</span>
      </button>
    </nav>
  );
}


// =====================================================
// COMANDO DE VOZ GLOBAL
// =====================================================

function ComandoVozGlobal({ irPara, tema, alterarTema, acessibilidade, alterarAcessibilidade }) {
  const [ouvindo, setOuvindo] = useState(false);
  const reconhecimentoRef = React.useRef(null);
  const toquesRef = React.useRef([]);

  function falar(texto) {
    if (!acessibilidade.voz || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const fala = new SpeechSynthesisUtterance(texto);
    fala.lang = "pt-BR";
    fala.rate = 0.95;
    window.speechSynthesis.speak(fala);
  }

  function executarComando(frase) {
    const texto = frase.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const comandos = [
      { termos: ["inicio", "tela inicial", "pagina inicial"], pagina: "ambiente", resposta: "Abrindo o início." },
      { termos: ["perfil", "meu perfil"], pagina: "perfil", resposta: "Abrindo seu perfil." },
      { termos: ["acessibilidade"], pagina: "acessibilidade", resposta: "Abrindo acessibilidade." },
      { termos: ["reflexao"], pagina: "reflexao", resposta: "Abrindo reflexão." },
      { termos: ["conversas", "mensagens"], pagina: "solicitacoes", resposta: "Abrindo conversas." },
      { termos: ["desabafar"], pagina: "desabafar", resposta: "Abrindo desabafar." },
    ];
    const destino = comandos.find((c) => c.termos.some((t) => texto.includes(t)));
    if (destino) { irPara(destino.pagina); falar(destino.resposta); return; }
    if (texto.includes("modo escuro") || texto.includes("modo noturno")) { alterarTema("escuro"); falar("Modo escuro ativado."); return; }
    if (texto.includes("modo claro")) { alterarTema("claro"); falar("Modo claro ativado."); return; }
    if (texto.includes("alto contraste")) { alterarAcessibilidade("altoContraste", true); falar("Alto contraste ativado."); return; }
    if (texto.includes("texto maior") || texto.includes("aumentar texto")) { alterarAcessibilidade("textoMaior", true); falar("Texto maior ativado."); return; }
    if (texto.includes("botoes maiores")) { alterarAcessibilidade("botoesMaiores", true); falar("Botões maiores ativados."); return; }
    if (texto.includes("reduzir animacoes")) { alterarAcessibilidade("reduzirAnimacoes", true); falar("Redução de animações ativada."); return; }
    if (texto.includes("ler pagina") || texto.includes("ler tela")) { falar(document.querySelector("main")?.innerText || document.body.innerText); return; }
    if (texto.includes("parar leitura") || texto.includes("silencio")) { window.speechSynthesis.cancel(); return; }
    falar("Não reconheci esse comando.");
  }

  function iniciar() {
    const Reconhecimento = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Reconhecimento || ouvindo) return;
    const rec = new Reconhecimento();
    rec.lang = "pt-BR";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onstart = () => setOuvindo(true);
    rec.onresult = (e) => executarComando(e.results[0][0].transcript);
    rec.onend = () => setOuvindo(false);
    rec.onerror = () => setOuvindo(false);
    reconhecimentoRef.current = rec;
    rec.start();
  }

  useEffect(() => {
    if (!acessibilidade.voz) return;
    function detectarTresToques() {
      const agora = Date.now();
      toquesRef.current = [...toquesRef.current.filter((t) => agora - t < 700), agora];
      if (toquesRef.current.length >= 3) {
        toquesRef.current = [];
        iniciar();
      }
    }
    document.addEventListener("click", detectarTresToques);
    return () => document.removeEventListener("click", detectarTresToques);
  }, [acessibilidade.voz, ouvindo]);

  useEffect(() => () => reconhecimentoRef.current?.stop(), []);
  return null;
}

// =====================================================
// APP
// =====================================================

function App() {
  const [pagina, setPagina] = useState("inicio");

  function usuarioEstaLogado() {
    return Boolean(
      localStorage.getItem("usuarioLogado") ||
      localStorage.getItem("pulsanUsuarioAtual")
    );
  }

  function sairDaConta() {
    [
      "usuarioLogado",
      "pulsanUsuarioAtual",
      "pulsanNome",
      "pulsanEmail",
      "pulsanFoto",
      "pulsanTipo",
      "pulsanCRP",
      "pulsanVerificacaoPsicologo",
      "pulsanPsicologoParceiro",
      "pulsanDocumentoProfissional",
      "pulsanNomeDocumento",
      "pulsanEquipePulsan",
    ].forEach((chave) => localStorage.removeItem(chave));

    setPagina("inicio");
  }

  // =====================================================
  // ACESSIBILIDADE GLOBAL
  // =====================================================

  const [acessibilidade, setAcessibilidade] = useState(() => {
    try {
      const configuracoesSalvas = localStorage.getItem(
        "pulsanAcessibilidade"
      );

      if (configuracoesSalvas) {
        return JSON.parse(configuracoesSalvas);
      }
    } catch (erro) {
      console.error(
        "Erro ao carregar acessibilidade:",
        erro
      );
    }

    return {
      altoContraste: false,
      textoMaior: false,
      botoesMaiores: false,
      reduzirAnimacoes: false,
      voz: false,
      daltonismo: "normal",
      libras: false,
    };
  });

  useEffect(() => {
    const html = document.documentElement;

    html.setAttribute(
      "data-contraste",
      acessibilidade.altoContraste ? "alto" : "normal"
    );

    html.setAttribute(
      "data-texto-grande",
      acessibilidade.textoMaior ? "true" : "false"
    );

    html.setAttribute(
      "data-botoes-grandes",
      acessibilidade.botoesMaiores ? "true" : "false"
    );

    html.setAttribute(
      "data-reduzir-animacoes",
      acessibilidade.reduzirAnimacoes ? "true" : "false"
    );

    html.setAttribute(
      "data-daltonismo",
      acessibilidade.daltonismo || "normal"
    );

    html.setAttribute(
      "data-libras",
      acessibilidade.libras ? "true" : "false"
    );

    localStorage.setItem(
      "pulsanAcessibilidade",
      JSON.stringify(acessibilidade)
    );
  }, [acessibilidade]);

  function alterarAcessibilidade(opcao, valor) {
    setAcessibilidade((anterior) => ({
      ...anterior,
      [opcao]: valor,
    }));
  }

  // =====================================================
  // VERIFICAR TIPO DE USUÁRIO
  // =====================================================

  function usuarioEhEquipePulsan() {
    const usuarioLogado =
      localStorage.getItem("usuarioLogado");

    const tipo = localStorage.getItem("pulsanTipo");

    if (!usuarioLogado) {
      return false;
    }

    return tipo === "equipe_pulsan";
  }

  // =====================================================
  // TEMA GLOBAL
  // =====================================================

  const [tema, setTema] = useState(() => {
    const temaSalvo =
      localStorage.getItem("pulsanTema");

    return temaSalvo === "escuro"
      ? "escuro"
      : "claro";
  });

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      tema
    );

    localStorage.setItem(
      "pulsanTema",
      tema
    );
  }, [tema]);

  // =====================================================
  // PROTEÇÃO DA EQUIPE PULSAN
  // =====================================================

  useEffect(() => {
    const equipePulsan =
      usuarioEhEquipePulsan();

    const paginasPermitidasEquipe = [
      "painel-admin",
      "alertas",
      "gestao-psicologos",
    ];

    if (
      equipePulsan &&
      pagina !== "inicio" &&
      !paginasPermitidasEquipe.includes(pagina)
    ) {
      setPagina("painel-admin");
    }
  }, [pagina]);

  // =====================================================
  // ALTERAR TEMA
  // =====================================================

  function alterarTema(novoTema) {
    if (
      novoTema !== "claro" &&
      novoTema !== "escuro"
    ) {
      return;
    }

    setTema(novoTema);
  }

  // =====================================================
  // NAVEGAÇÃO
  // =====================================================

  function irPara(novaPagina) {
    const paginasPublicas = ["inicio", "login", "cadastro"];

    if (
      !paginasPublicas.includes(novaPagina) &&
      !usuarioEstaLogado()
    ) {
      setPagina("login");
      return;
    }

    if (
      usuarioEhEquipePulsan() &&
      novaPagina !== "inicio"
    ) {
      const paginasPermitidasEquipe = [
        "painel-admin",
        "alertas",
        "gestao-psicologos",
      ];

      if (
        !paginasPermitidasEquipe.includes(novaPagina)
      ) {
        setPagina("painel-admin");

        window.scrollTo({
          top: 0,
          behavior: acessibilidade.reduzirAnimacoes
            ? "auto"
            : "smooth",
        });

        return;
      }
    }

    setPagina(novaPagina);

    window.scrollTo({
      top: 0,
      behavior: acessibilidade.reduzirAnimacoes
        ? "auto"
        : "smooth",
    });
  }

  // =====================================================
  // PRIMEIRO ACESSO — CONFIGURAÇÃO DE ACESSIBILIDADE
  // =====================================================

  if (pagina === "acessibilidade-inicial") {
    return (
      <div
        className={`pulsan-app tema-${tema} ${acessibilidade.altoContraste ? "acessibilidade-alto-contraste" : ""} ${acessibilidade.textoMaior ? "acessibilidade-texto-maior" : ""} ${acessibilidade.botoesMaiores ? "acessibilidade-botoes-maiores" : ""} ${acessibilidade.reduzirAnimacoes ? "acessibilidade-reduzir-animacoes" : ""} ${acessibilidade.daltonismo && acessibilidade.daltonismo !== "normal" ? `acessibilidade-${acessibilidade.daltonismo}` : ""} ${acessibilidade.libras ? "acessibilidade-libras" : ""}`}
        style={{
          minHeight: "100vh",
          width: "100%",
          background: "var(--pulsan-bg, #fff)",
          color: "var(--pulsan-texto, #0F2D5B)",
        }}
      >
        <AcessibilidadeInicial
          irPara={irPara}
          tema={tema}
          acessibilidade={acessibilidade}
          alterarAcessibilidade={alterarAcessibilidade}
        />
      </div>
    );
  }

  // =====================================================
  // TELA INICIAL
  // =====================================================

  if (pagina === "inicio") {
    return <Inicio irPara={irPara} />;
  }

  // =====================================================
  // LOGIN
  // =====================================================

  if (pagina === "login") {
    return <Login irPara={irPara} />;
  }

  // =====================================================
  // CADASTRO
  // =====================================================

  if (pagina === "cadastro") {
    return <Cadastro irPara={irPara} />;
  }

  // =====================================================
  // PÁGINAS INTERNAS
  // =====================================================

  let conteudo = null;

  if (pagina === "ambiente") {
    conteudo = (
      <Ambiente
        irPara={irPara}
        tema={tema}
        alterarTema={alterarTema}
        acessibilidade={acessibilidade}
        alterarAcessibilidade={alterarAcessibilidade}
      />
    );
  }

  if (pagina === "desabafar") {
    conteudo = (
      <Desabafar
        irPara={irPara}
        tema={tema}
        alterarTema={alterarTema}
        acessibilidade={acessibilidade}
        alterarAcessibilidade={alterarAcessibilidade}
      />
    );
  }

  if (pagina === "reflexao") {
    conteudo = (
      <Reflexao
        irPara={irPara}
        tema={tema}
        alterarTema={alterarTema}
        acessibilidade={acessibilidade}
        alterarAcessibilidade={alterarAcessibilidade}
      />
    );
  }

  if (pagina === "alertas") {
    conteudo = (
      <Alertas
        irPara={irPara}
        tema={tema}
        alterarTema={alterarTema}
        acessibilidade={acessibilidade}
        alterarAcessibilidade={alterarAcessibilidade}
      />
    );
  }

  if (pagina === "gestao-psicologos") {
    conteudo = (
      <GestaoPsicologos
        irPara={irPara}
        tema={tema}
        alterarTema={alterarTema}
        acessibilidade={acessibilidade}
        alterarAcessibilidade={alterarAcessibilidade}
      />
    );
  }

  if (pagina === "painel-admin") {
    conteudo = (
      <PainelAdmin
        irPara={irPara}
        tema={tema}
        alterarTema={alterarTema}
        acessibilidade={acessibilidade}
        alterarAcessibilidade={alterarAcessibilidade}
      />
    );
  }

 if (pagina === "solicitacoes") {
  conteudo = (
    <Conversas
      irPara={irPara}
      tema={tema}
      alterarTema={alterarTema}
      acessibilidade={acessibilidade}
      alterarAcessibilidade={alterarAcessibilidade}
    />
  );
}

  if (pagina === "conversa") {
    conteudo = (
      <Conversa
        irPara={irPara}
        tema={tema}
        alterarTema={alterarTema}
        acessibilidade={acessibilidade}
        alterarAcessibilidade={alterarAcessibilidade}
      />
    );
  }

  if (pagina === "solicitar-ajuda") {
    conteudo = (
      <SolicitarAjuda
        irPara={irPara}
        tema={tema}
        alterarTema={alterarTema}
        acessibilidade={acessibilidade}
        alterarAcessibilidade={alterarAcessibilidade}
      />
    );
  }

  if (pagina === "avaliacao") {
    conteudo = (
      <Avaliacao
        irPara={irPara}
        tema={tema}
        alterarTema={alterarTema}
        acessibilidade={acessibilidade}
        alterarAcessibilidade={alterarAcessibilidade}
      />
    );
  }

  if (pagina === "perfil") {
    conteudo = (
      <Perfil
        irPara={irPara}
        tema={tema}
        alterarTema={alterarTema}
        acessibilidade={acessibilidade}
        alterarAcessibilidade={alterarAcessibilidade}
        sairDaConta={sairDaConta}
      />
    );
  }

  if (pagina === "acessibilidade") {
    conteudo = (
      <Acessibilidade
        irPara={irPara}
        tema={tema}
        alterarTema={alterarTema}
        acessibilidade={acessibilidade}
        alterarAcessibilidade={alterarAcessibilidade}
      />
    );
  }

  if (pagina === "premios") {
    conteudo = (
      <Premios
        irPara={irPara}
        tema={tema}
        alterarTema={alterarTema}
        acessibilidade={acessibilidade}
        alterarAcessibilidade={alterarAcessibilidade}
      />
    );
  }

  if (pagina === "recuperar-senha") {
    conteudo = (
      <RecuperarSenha
        irPara={irPara}
        tema={tema}
        alterarTema={alterarTema}
        acessibilidade={acessibilidade}
        alterarAcessibilidade={alterarAcessibilidade}
      />
    );
  }

  if (pagina === "redefinir-senha") {
    conteudo = (
      <RedefinirSenha
        irPara={irPara}
        tema={tema}
        alterarTema={alterarTema}
        acessibilidade={acessibilidade}
        alterarAcessibilidade={alterarAcessibilidade}
      />
    );
  }

  if (!conteudo) {
    conteudo = (
      <Ambiente
        irPara={irPara}
        tema={tema}
        alterarTema={alterarTema}
        acessibilidade={acessibilidade}
        alterarAcessibilidade={alterarAcessibilidade}
      />
    );
  }

  // =====================================================
  // PÁGINA + MENU
  // =====================================================

  return (
    <>
      <div
        className={`pulsan-app tema-${tema} ${acessibilidade.altoContraste ? "acessibilidade-alto-contraste" : ""} ${acessibilidade.textoMaior ? "acessibilidade-texto-maior" : ""} ${acessibilidade.botoesMaiores ? "acessibilidade-botoes-maiores" : ""} ${acessibilidade.reduzirAnimacoes ? "acessibilidade-reduzir-animacoes" : ""} ${acessibilidade.daltonismo && acessibilidade.daltonismo !== "normal" ? `acessibilidade-${acessibilidade.daltonismo}` : ""} ${acessibilidade.libras ? "acessibilidade-libras" : ""}`}
        style={{
          minHeight: "100vh",
          width: "100%",
          paddingBottom: "76px",
          boxSizing: "border-box",
          overflowX: "hidden",
          background: "var(--pulsan-bg, #fffdf9)",
          color: "var(--pulsan-texto, #172c35)",
        }}
      >
        {conteudo}
      </div>

      <ComandoVozGlobal irPara={irPara} tema={tema} alterarTema={alterarTema} acessibilidade={acessibilidade} alterarAcessibilidade={alterarAcessibilidade} />

      {!usuarioEhEquipePulsan() && (
        <MenuInferior
          pagina={pagina}
          irPara={irPara}
        />
      )}
    </>
  );
}

export default App;