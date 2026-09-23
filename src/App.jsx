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
// INSTALAÇÃO DO PULSAN — PWA
// =====================================================

function InstalacaoPulsan() {
  const [eventoInstalacao, setEventoInstalacao] = useState(null);
  const [instalado, setInstalado] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const verificarInstalado = () => {
      const modoStandalone =
        window.matchMedia?.("(display-mode: standalone)")?.matches ||
        window.navigator.standalone === true;

      setInstalado(Boolean(modoStandalone));
    };

    verificarInstalado();

    const capturarInstalacao = (evento) => {
      evento.preventDefault();
      setEventoInstalacao(evento);
    };

    const quandoInstalado = () => {
      setInstalado(true);
      setEventoInstalacao(null);
    };

    window.addEventListener("beforeinstallprompt", capturarInstalacao);
    window.addEventListener("appinstalled", quandoInstalado);

    const mediaQuery = window.matchMedia?.("(display-mode: standalone)");
    mediaQuery?.addEventListener?.("change", verificarInstalado);

    return () => {
      window.removeEventListener("beforeinstallprompt", capturarInstalacao);
      window.removeEventListener("appinstalled", quandoInstalado);
      mediaQuery?.removeEventListener?.("change", verificarInstalado);
    };
  }, []);

  async function instalarPulsan() {
    if (!eventoInstalacao) return;

    try {
      await eventoInstalacao.prompt();
      const escolha = await eventoInstalacao.userChoice;

      if (escolha?.outcome === "accepted") {
        setInstalado(true);
      }
    } catch (erro) {
      console.error("Erro ao instalar o Pulsan:", erro);
    } finally {
      setEventoInstalacao(null);
    }
  }

  if (instalado || !eventoInstalacao) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: "fixed",
        right: "16px",
        bottom: "92px",
        zIndex: 10050,
        display: "flex",
        alignItems: "center",
        gap: "8px",
        maxWidth: "calc(100vw - 32px)",
        padding: "8px 10px 8px 12px",
        borderRadius: "18px",
        background: "var(--pulsan-card, #FFFFFF)",
        border: "1px solid var(--pulsan-borda, #A8C7FF)",
        boxShadow: "0 10px 30px rgba(15,45,91,.18)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div
        style={{
          width: "34px",
          height: "34px",
          flex: "0 0 34px",
          borderRadius: "10px",
          display: "grid",
          placeItems: "center",
          background: "#EAF3FF",
          overflow: "hidden",
        }}
      >
        <img
          src="/pulsan-icon-192.png"
          alt=""
          aria-hidden="true"
          style={{
            width: "27px",
            height: "27px",
            objectFit: "contain",
          }}
        />
      </div>

      <div
        style={{
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          gap: "1px",
        }}
      >
        <strong
          style={{
            color: "var(--pulsan-texto, #0F2D5B)",
            fontSize: "13px",
            lineHeight: 1.2,
            whiteSpace: "nowrap",
          }}
        >
          Instalar Pulsan
        </strong>

        <span
          style={{
            color: "var(--pulsan-texto-secundario, #5F7695)",
            fontSize: "11px",
            lineHeight: 1.25,
          }}
        >
          Tenha o Pulsan na sua tela inicial.
        </span>
      </div>

      <button
        type="button"
        onClick={instalarPulsan}
        aria-label="Instalar Pulsan"
        style={{
          border: "none",
          borderRadius: "12px",
          padding: "9px 12px",
          background: "linear-gradient(135deg, #3A7DFF, #0F2D5B)",
          color: "#FFFFFF",
          fontSize: "12px",
          fontWeight: 800,
          cursor: "pointer",
          whiteSpace: "nowrap",
          boxShadow: "0 5px 14px rgba(58,125,255,.25)",
        }}
      >
        Instalar
      </button>
    </div>
  );
}

// =====================================================
// SESSÃO DA CONTA — PERSISTÊNCIA CONFORME O MODO DE USO
// =====================================================
// No navegador: a conta fica apenas durante a sessão da aba/janela.
// No Pulsan instalado: a conta permanece no dispositivo até o usuário
// escolher "Sair da conta".
const CHAVES_SESSAO_PULSAN = [
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
  "pulsanAcessoAdmin",
  "pulsanAreaAcesso",
];

function pulsAnEstaInstalado() {
  if (typeof window === "undefined") return false;

  return Boolean(
    window.matchMedia?.("(display-mode: standalone)")?.matches ||
    window.navigator.standalone === true ||
    document.referrer.startsWith("android-app://")
  );
}

let sessaoNavegadorInicializada = false;

function normalizarSessaoPulsan() {
  if (typeof window === "undefined") return;

  const instalado = pulsAnEstaInstalado();

  try {
    if (instalado) {
      // No aplicativo instalado, a sessão permanente fica no localStorage.
      // Se houver uma sessão temporária, ela é promovida para a persistente.
      CHAVES_SESSAO_PULSAN.forEach((chave) => {
        const valorSessao = window.sessionStorage.getItem(chave);

        if (valorSessao !== null) {
          window.localStorage.setItem(chave, valorSessao);
          window.sessionStorage.removeItem(chave);
        }
      });

      return;
    }

    // A primeira carga do Pulsan no navegador limpa qualquer sessão
    // persistida de uma visita anterior.
    if (!sessaoNavegadorInicializada) {
      CHAVES_SESSAO_PULSAN.forEach((chave) => {
        window.localStorage.removeItem(chave);
      });

      sessaoNavegadorInicializada = true;
    }
  } catch (erro) {
    console.error("Erro ao ajustar a sessão do Pulsan:", erro);
  }
}

normalizarSessaoPulsan();

// =====================================================
// APP
// =====================================================

function App() {
  // =====================================================
  // IDENTIFICAÇÃO E BLOQUEIO DA CONTA ADMINISTRATIVA
  // =====================================================
  function usuarioEhAdministradorInicial() {
    if (typeof window === "undefined") return false;

    // Mantém a sessão coerente com o local de uso:
    // navegador = sessionStorage | aplicativo instalado = localStorage.
    normalizarSessaoPulsan();

    const armazenamento = pulsAnEstaInstalado()
      ? window.localStorage
      : window.sessionStorage;

    // Chave criada no login administrativo.
    if (armazenamento.getItem("pulsanAcessoAdmin") === "true") {
      return true;
    }

    // Chave de área de acesso definida pelo Login.
    // "administrativo" significa que esta conta NÃO deve entrar
    // na experiência normal do usuário.
    if (armazenamento.getItem("pulsanAreaAcesso") === "administrativo") {
      return true;
    }

    // Compatibilidade com a identificação antiga da equipe Pulsan.
    if (armazenamento.getItem("pulsanEquipePulsan") === "true") {
      return true;
    }

    const tipoSalvo = (
      armazenamento.getItem("pulsanTipo") || ""
    ).toLowerCase().trim();

    if (["admin", "administrador", "equipe_pulsan"].includes(tipoSalvo)) {
      return true;
    }

    // Confere também os dados do usuário salvo pelo Login.
    for (const chave of ["usuarioLogado", "pulsanUsuarioAtual"]) {
      try {
        const dado = armazenamento.getItem(chave);
        if (!dado) continue;

        const usuario = JSON.parse(dado);
        const tipo =
          usuario?.tipo_usuario ||
          usuario?.tipo ||
          usuario?.user_metadata?.tipo_usuario ||
          usuario?.user_metadata?.tipo ||
          "";

        if (
          ["admin", "administrador", "equipe_pulsan"].includes(
            String(tipo).toLowerCase().trim()
          )
        ) {
          return true;
        }
      } catch {
        // Mantém a verificação pelas outras chaves.
      }
    }

    return false;
  }

  // A conta administrativa começa DIRETAMENTE no painel.
  const [pagina, setPagina] = useState(() =>
    usuarioEhAdministradorInicial() ? "painel-admin" : "inicio"
  );

  function usuarioEstaLogado() {
    if (typeof window === "undefined") return false;

    normalizarSessaoPulsan();

    if (!pulsAnEstaInstalado()) {
      // O Login atual grava as chaves em localStorage.
      // Assim que a autenticação é concluída, transferimos essas chaves
      // para sessionStorage, mantendo a conta somente nesta sessão.
      const possuiLoginLocal =
        window.localStorage.getItem("usuarioLogado") ||
        window.localStorage.getItem("pulsanUsuarioAtual");

      if (possuiLoginLocal) {
        CHAVES_SESSAO_PULSAN.forEach((chave) => {
          const valor = window.localStorage.getItem(chave);

          if (valor !== null) {
            window.sessionStorage.setItem(chave, valor);
            window.localStorage.removeItem(chave);
          }
        });
      }
    }

    const armazenamento = pulsAnEstaInstalado()
      ? window.localStorage
      : window.sessionStorage;

    return Boolean(
      armazenamento.getItem("usuarioLogado") ||
      armazenamento.getItem("pulsanUsuarioAtual")
    );
  }

  function sairDaConta() {
    // O logout é explícito: limpa a sessão tanto do navegador
    // quanto do aplicativo instalado.
    CHAVES_SESSAO_PULSAN.forEach((chave) => {
      try {
        window.localStorage.removeItem(chave);
        window.sessionStorage.removeItem(chave);
      } catch {
        // Ignora falhas de armazenamento para concluir o logout.
      }
    });

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

  // =====================================================
  // VLIBRAS — ACESSIBILIDADE DIGITAL EM LIBRAS
  // =====================================================
  // O VLibras é carregado apenas quando a opção Libras está
  // ativada. O script oficial cria o avatar 3D e realiza a
  // tradução automática do conteúdo em Português para Libras.
  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return;
    }

    const atualizarBotaoVLibras = () => {
      const botao = window.VLibrasWidget?.initBtn;

      if (!botao) return;

      botao.style.display = acessibilidade.libras ? "block" : "none";
      botao.setAttribute(
        "aria-hidden",
        acessibilidade.libras ? "false" : "true"
      );
    };

    // O VLibras deve ser carregado uma única vez durante a sessão.
    if (window.__PULSAN_VLIBRAS_CARREGADO__) {
      atualizarBotaoVLibras();
      return;
    }

    if (!acessibilidade.libras) {
      return;
    }

    window.__PULSAN_VLIBRAS_CARREGADO__ = true;

    const inicializarVLibras = () => {
      try {
        if (window.VLibras?.Widget && !window.__PULSAN_VLIBRAS_WIDGET__) {
          window.__PULSAN_VLIBRAS_WIDGET__ = new window.VLibras.Widget({
            rootPath: "https://vlibras.gov.br/app",
            avatar: "random",
            position: "R",
          });
        }

        // O botão pode aparecer alguns instantes depois da criação do widget.
        let tentativas = 0;
        const sincronizar = () => {
          atualizarBotaoVLibras();
          tentativas += 1;

          if (!window.VLibrasWidget?.initBtn && tentativas < 30) {
            window.setTimeout(sincronizar, 300);
          }
        };

        sincronizar();
      } catch (erro) {
        console.error("Erro ao inicializar o VLibras:", erro);
        window.__PULSAN_VLIBRAS_CARREGADO__ = false;
      }
    };

    const scriptExistente = document.querySelector(
      'script[data-pulsan-vlibras="true"]'
    );

    if (scriptExistente) {
      if (window.VLibras?.Widget) {
        inicializarVLibras();
      } else {
        scriptExistente.addEventListener("load", inicializarVLibras, {
          once: true,
        });
      }
      return;
    }

    const script = document.createElement("script");
    script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
    script.async = true;
    script.dataset.pulsanVlibras = "true";
    script.onload = inicializarVLibras;
    script.onerror = () => {
      console.error("Não foi possível carregar o VLibras.");
      window.__PULSAN_VLIBRAS_CARREGADO__ = false;
    };

    document.body.appendChild(script);

    return () => {
      // O widget oficial permanece disponível para evitar recriações
      // desnecessárias ao navegar entre as telas do Pulsan.
    };
  }, [acessibilidade.libras]);

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
    return usuarioEhAdministradorInicial();
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
    const administrador = usuarioEhEquipePulsan();

    // A conta administrativa NÃO possui acesso ao ambiente normal.
    // Qualquer tentativa de abrir outra página volta para o painel.
    if (administrador && pagina !== "painel-admin") {
      setPagina("painel-admin");
      return;
    }

    // Uma conta comum nunca pode abrir o painel administrativo.
    if (!administrador && pagina === "painel-admin") {
      setPagina("inicio");
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

    // A conta administrativa só pode navegar dentro do Painel Administrativo.
    if (usuarioEhEquipePulsan()) {
      if (novaPagina !== "painel-admin") {
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

    // Uma conta comum não pode acessar o Painel Administrativo.
    if (
      novaPagina === "painel-admin" &&
      !usuarioEhEquipePulsan()
    ) {
      setPagina("inicio");
      return;
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
  // BLOQUEIO FINAL DA CONTA ADMINISTRATIVA
  // =====================================================
  // Mesmo que alguma navegação altere o estado momentaneamente,
  // a conta administrativa só renderiza o PainelAdmin.
  if (usuarioEhEquipePulsan()) {
    return (
      <PainelAdmin
        irPara={irPara}
        tema={tema}
        alterarTema={alterarTema}
        acessibilidade={acessibilidade}
        alterarAcessibilidade={alterarAcessibilidade}
      />
    );
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

      <InstalacaoPulsan />

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