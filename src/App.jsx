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
import Conversa from "./pages/Conversa";
import Solicitacoes from "./pages/Solicitacoes";
import SolicitarAjuda from "./pages/SolicitarAjuda";
import Avaliacao from "./pages/Avaliacao";
import Perfil from "./pages/Perfil";
import Acessibilidade from "./pages/Acessibilidade";
import Premios from "./pages/Premios";
import RecuperarSenha from "./pages/RecuperarSenha";
import RedefinirSenha from "./pages/RedefinirSenha";

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
      <Solicitacoes
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
        className={`pulsan-app ${acessibilidade.altoContraste ? "acessibilidade-alto-contraste" : ""} ${acessibilidade.textoMaior ? "acessibilidade-texto-maior" : ""} ${acessibilidade.botoesMaiores ? "acessibilidade-botoes-maiores" : ""} ${acessibilidade.reduzirAnimacoes ? "acessibilidade-reduzir-animacoes" : ""}`}
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