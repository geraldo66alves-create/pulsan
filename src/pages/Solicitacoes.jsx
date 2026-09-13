import React, {
  useEffect,
  useState,
} from "react";

import "../tema.css";

function Solicitacoes({ irPara }) {

  // =====================================================
  // ABA
  // =====================================================

  const [aba, setAba] =
    useState("solicitacoes");

  // =====================================================
  // USUÁRIO ATUAL
  // =====================================================

  const nomeUsuario =
    localStorage.getItem(
      "pulsanNome"
    ) || "Você";

  const fotoUsuario =
    localStorage.getItem(
      "pulsanFoto"
    ) || "";

  const usuarioLogado =
    JSON.parse(
      localStorage.getItem(
        "usuarioLogado"
      ) || "null"
    ) || {};

  const meuId =
    usuarioLogado.id ||
    usuarioLogado.email ||
    localStorage.getItem(
      "pulsanEmail"
    ) ||
    nomeUsuario;

  // =====================================================
  // ESTADOS
  // =====================================================

  const [
    solicitacoes,
    setSolicitacoes,
  ] = useState([]);

  const [
    conversas,
    setConversas,
  ] = useState([]);

  // =====================================================
  // CARREGAR DADOS
  // =====================================================

  function carregarDados() {

    const todasSolicitacoes =
      JSON.parse(
        localStorage.getItem(
          "pulsanSolicitacoesChat"
        ) || "[]"
      );

    // ===================================================
    // SOLICITAÇÕES PENDENTES
    // ===================================================

    const pendentes =
      todasSolicitacoes.filter(
        (item) => {

          if (
            item.status !==
            "pendente"
          ) {
            return false;
          }

          /*
           * Se a solicitação possui destinatário,
           * mostramos somente para ele.
           *
           * Solicitações antigas sem destinatarioId
           * continuam aparecendo para permitir o teste
           * do protótipo.
           */

          if (
            item.destinatarioId
          ) {
            return (
              String(
                item.destinatarioId
              ) ===
              String(meuId)
            );
          }

          return true;
        }
      );

    setSolicitacoes(
      pendentes
    );

    // ===================================================
    // CONVERSAS
    // ===================================================

    const conversasSalvas =
      JSON.parse(
        localStorage.getItem(
          "pulsanConversas"
        ) || "[]"
      );

    const minhasConversas =
      conversasSalvas.filter(
        (conversa) => {

          if (
            conversa.usuarioAId ||
            conversa.usuarioBId
          ) {

            return (
              String(
                conversa.usuarioAId
              ) === String(meuId) ||
              String(
                conversa.usuarioBId
              ) === String(meuId)
            );
          }

          return true;
        }
      );

    setConversas(
      minhasConversas
    );
  }

  // =====================================================
  // ATUALIZAÇÃO
  // =====================================================

  useEffect(() => {

    carregarDados();

    function atualizar() {
      carregarDados();
    }

    window.addEventListener(
      "storage",
      atualizar
    );

    window.addEventListener(
      "focus",
      atualizar
    );

    const intervalo =
      setInterval(
        atualizar,
        2000
      );

    return () => {

      window.removeEventListener(
        "storage",
        atualizar
      );

      window.removeEventListener(
        "focus",
        atualizar
      );

      clearInterval(
        intervalo
      );
    };

  }, [meuId]);

  // =====================================================
  // ACEITAR
  // =====================================================

  function aceitarSolicitacao(
    solicitacao
  ) {

    const confirmar =
      window.confirm(
        `Deseja aceitar a solicitação de ${
          solicitacao.nomeSolicitante ||
          "esta pessoa"
        }?\n\nO chat privado será aberto.`
      );

    if (!confirmar) {
      return;
    }

    // ===================================================
    // TODAS AS SOLICITAÇÕES
    // ===================================================

    const todas =
      JSON.parse(
        localStorage.getItem(
          "pulsanSolicitacoesChat"
        ) || "[]"
      );

    const atualizadas =
      todas.map(
        (item) => {

          if (
            item.id ===
            solicitacao.id
          ) {

            return {
              ...item,

              status:
                "aceita",

              aceitaEm:
                new Date().toISOString(),
            };
          }

          return item;
        }
      );

    localStorage.setItem(
      "pulsanSolicitacoesChat",
      JSON.stringify(
        atualizadas
      )
    );

    // ===================================================
    // CRIAR CONVERSA
    // ===================================================

    const conversasAtuais =
      JSON.parse(
        localStorage.getItem(
          "pulsanConversas"
        ) || "[]"
      );

    const conversaExistente =
      conversasAtuais.find(
        (item) =>
          item.solicitacaoId ===
          solicitacao.id
      );

    let conversa;

    if (
      conversaExistente
    ) {

      conversa =
        conversaExistente;

    } else {

      conversa = {

        id:
          "conversa-" +
          Date.now(),

        solicitacaoId:
          solicitacao.id,

        publicacaoId:
          solicitacao.publicacaoId,

        textoDesabafo:
          solicitacao.textoDesabafo ||
          solicitacao.texto ||
          "",

        usuarioAId:
          solicitacao.solicitanteId,

        usuarioBId:
          solicitacao.destinatarioId ||
          meuId,

        nome:
          solicitacao.nomeSolicitante ||
          "Usuário",

        foto:
          solicitacao.fotoSolicitante ||
          "",

        mediaAvaliacoes:
          solicitacao.mediaAvaliacoes ||
          "Novo",

        quantidadeAvaliacoes:
          solicitacao.quantidadeAvaliacoes ||
          0,

        seloApoiador:
          solicitacao.seloApoiador ===
          true,

        seloPsicologo:
          solicitacao.seloPsicologo ===
          true,

        categoria:
          solicitacao.categoria ||
          "Conversa privada",

        ultimaMensagem:
          "Conversa iniciada.",

        hora:
          "Agora",

        mensagens: [],

        status:
          "ativa",

        criadaEm:
          new Date().toISOString(),
      };

      conversasAtuais.unshift(
        conversa
      );

      localStorage.setItem(
        "pulsanConversas",
        JSON.stringify(
          conversasAtuais
        )
      );
    }

    // ===================================================
    // SALVAR CONVERSA ATUAL
    // ===================================================

    localStorage.setItem(
      "pulsanConversaAtual",
      JSON.stringify(
        conversa
      )
    );

    // ===================================================
    // DADOS DA OUTRA PESSOA
    // ===================================================

    localStorage.setItem(
      "pulsanNomeOutraPessoa",
      solicitacao.nomeSolicitante ||
        "Usuário"
    );

    localStorage.setItem(
      "pulsanFotoOutraPessoa",
      solicitacao.fotoSolicitante ||
        ""
    );

    localStorage.setItem(
      "pulsanMediaOutraPessoa",
      solicitacao.mediaAvaliacoes ||
        "Novo"
    );

    localStorage.setItem(
      "pulsanAvaliacoesOutraPessoa",
      String(
        solicitacao.quantidadeAvaliacoes ||
        0
      )
    );

    localStorage.setItem(
      "pulsanPapelConversa",
      "ajudante"
    );

    localStorage.setItem(
      "pulsanDesabafoConversa",
      solicitacao.textoDesabafo ||
        solicitacao.texto ||
        ""
    );

    localStorage.setItem(
      "pulsanIdDesabafoConversa",
      String(solicitacao.publicacaoId || "")
    );

    localStorage.setItem(
      "pulsanSeloApoiadorOutraPessoa",
      String(solicitacao.seloApoiador === true)
    );

    localStorage.setItem(
      "pulsanSeloPsicologoOutraPessoa",
      String(solicitacao.seloPsicologo === true)
    );

    // ===================================================
    // ATUALIZAR TELA
    // ===================================================

    carregarDados();

    // ===================================================
    // ABRIR CHAT
    // ===================================================

    irPara(
      "conversa"
    );
  }

  // =====================================================
  // REJEITAR
  // =====================================================

  function rejeitarSolicitacao(
    solicitacao
  ) {

    const confirmar =
      window.confirm(
        "Deseja rejeitar esta solicitação?"
      );

    if (!confirmar) {
      return;
    }

    const todas =
      JSON.parse(
        localStorage.getItem(
          "pulsanSolicitacoesChat"
        ) || "[]"
      );

    const atualizadas =
      todas.map(
        (item) => {

          if (
            item.id ===
            solicitacao.id
          ) {

            return {
              ...item,

              status:
                "recusada",

              recusadaEm:
                new Date().toISOString(),
            };
          }

          return item;
        }
      );

    localStorage.setItem(
      "pulsanSolicitacoesChat",
      JSON.stringify(
        atualizadas
      )
    );

    carregarDados();
  }

  // =====================================================
  // ABRIR CONVERSA
  // =====================================================

  function abrirConversa(
    conversa
  ) {

    localStorage.setItem(
      "pulsanConversaAtual",
      JSON.stringify(
        conversa
      )
    );

    localStorage.setItem(
      "pulsanNomeOutraPessoa",
      conversa.nome ||
        "Usuário"
    );

    localStorage.setItem(
      "pulsanFotoOutraPessoa",
      conversa.foto ||
        ""
    );

    localStorage.setItem(
      "pulsanMediaOutraPessoa",
      conversa.mediaAvaliacoes ||
        "Novo"
    );

    localStorage.setItem(
      "pulsanAvaliacoesOutraPessoa",
      String(
        conversa.quantidadeAvaliacoes ||
        0
      )
    );

    localStorage.setItem(
      "pulsanPapelConversa",
      String(conversa.usuarioAId) === String(meuId)
        ? "ajudado"
        : "ajudante"
    );

    localStorage.setItem(
      "pulsanDesabafoConversa",
      conversa.textoDesabafo ||
        conversa.texto ||
        ""
    );

    localStorage.setItem(
      "pulsanIdDesabafoConversa",
      String(conversa.publicacaoId || "")
    );

    localStorage.setItem(
      "pulsanSeloApoiadorOutraPessoa",
      String(conversa.seloApoiador === true)
    );

    localStorage.setItem(
      "pulsanSeloPsicologoOutraPessoa",
      String(conversa.seloPsicologo === true)
    );

    irPara(
      "conversa"
    );
  }

  // =====================================================
  // AVALIAÇÃO
  // =====================================================

  function estrelas(
    valor
  ) {

    const nota =
      Number(valor) || 0;

    let resultado = "";

    for (
      let i = 1;
      i <= 5;
      i++
    ) {

      resultado +=
        i <= Math.round(nota)
          ? "★"
          : "☆";
    }

    return resultado;
  }

  // =====================================================
  // URGÊNCIA
  // =====================================================

  function obterUrgencia(
    urgencia
  ) {

    if (
      urgencia ===
      "urgente"
    ) {

      return {
        cor: "#c62828",
        fundo: "#fff0f0",
        texto: "Urgente",
        icone: "🔴",
      };
    }

    if (
      urgencia ===
      "importante"
    ) {

      return {
        cor: "#a87500",
        fundo: "#fff8df",
        texto:
          "Precisa de atenção",
        icone: "🟡",
      };
    }

    return {
      cor: "#29804d",
      fundo: "#effaf2",
      texto:
        "Pode conversar",
      icone: "🟢",
    };
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (

    <div
      style={{
        minHeight:
          "100vh",

        background:
          "var(--pulsan-fundo, #fffdf9)",

        color:
          "var(--pulsan-texto, #173b38)",

        fontFamily:
          "Arial, Helvetica, sans-serif",

        paddingBottom:
          "100px",
      }}
    >

      {/* =================================================
          CABEÇALHO
      ================================================= */}

      <header
        style={{
          background:
            "linear-gradient(135deg, #f6d7c8, #f9e6dc)",

          padding:
            "18px 35px",

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "space-between",

          borderBottom:
            "1px solid #eadbd4",
        }}
      >

        <div
          style={{
            display:
              "flex",

            alignItems:
              "center",

            gap:
              "14px",
          }}
        >

          <img
            src="/logo.png"
            alt="Logo Pulsan"
            style={{
              width:
                "48px",

              height:
                "48px",

              objectFit:
                "contain",
            }}
          />

          <div>

            <strong
              style={{
                display:
                  "block",

                fontSize:
                  "21px",

                letterSpacing:
                  "4px",
              }}
            >
              PULSAN
            </strong>

            <span
              style={{
                fontSize:
                  "13px",

                color:
                  "var(--pulsan-texto-secundario, #777)",
              }}
            >
              Conversas
            </span>

          </div>

        </div>

        <button
          type="button"
          onClick={() =>
            irPara("perfil")
          }
          style={{
            width:
              "44px",

            height:
              "44px",

            border:
              "none",

            borderRadius:
              "50%",

            overflow:
              "hidden",

            background:
              "var(--pulsan-card, #fff)",

            cursor:
              "pointer",

            padding: 0,

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            fontSize:
              "20px",
          }}
        >

          {fotoUsuario ? (

            <img
              src={fotoUsuario}
              alt="Perfil"
              style={{
                width:
                  "100%",

                height:
                  "100%",

                objectFit:
                  "cover",
              }}
            />

          ) : (
            "👤"
          )}

        </button>

      </header>

      {/* =================================================
          CONTEÚDO
      ================================================= */}

      <main
        style={{
          maxWidth:
            "900px",

          margin:
            "0 auto",

          padding:
            "35px 25px",
        }}
      >

        <h1
          style={{
            margin:
              "0 0 8px",

            fontSize:
              "30px",
          }}
        >
          Conversas 💬
        </h1>

        <p
          style={{
            margin:
              "0 0 25px",

            color:
              "var(--pulsan-texto-secundario, #777)",

            lineHeight:
              "1.5",
          }}
        >
          Aqui você pode decidir com quem
          deseja conversar de forma privada.
        </p>

        {/* =================================================
            ABAS
        ================================================= */}

        <div
          style={{
            background:
              "var(--pulsan-card, #fff)",

            border:
              "1px solid var(--pulsan-borda, #e5e5e5)",

            borderRadius:
              "16px",

            padding:
              "6px",

            display:
              "grid",

            gridTemplateColumns:
              "1fr 1fr",

            gap:
              "6px",

            marginBottom:
              "25px",
          }}
        >

          <button
            type="button"
            onClick={() =>
              setAba(
                "solicitacoes"
              )
            }
            style={{
              border:
                "none",

              borderRadius:
                "12px",

              padding:
                "13px",

              background:
                aba ===
                "solicitacoes"
                  ? "var(--pulsan-primaria, #20adb0)"
                  : "transparent",

              color:
                aba ===
                "solicitacoes"
                  ? "#fff"
                  : "var(--pulsan-texto-secundario, #777)",

              fontWeight:
                "700",

              cursor:
                "pointer",
            }}
          >
            📩 Solicitações

            {solicitacoes.length >
              0 && (

              <span
                style={{
                  marginLeft:
                    "7px",

                  background:
                    "#fff",

                  color:
                    "#20adb0",

                  borderRadius:
                    "20px",

                  padding:
                    "2px 7px",

                  fontSize:
                    "11px",
                }}
              >
                {solicitacoes.length}
              </span>

            )}

          </button>

          <button
            type="button"
            onClick={() =>
              setAba(
                "recentes"
              )
            }
            style={{
              border:
                "none",

              borderRadius:
                "12px",

              padding:
                "13px",

              background:
                aba ===
                "recentes"
                  ? "var(--pulsan-primaria, #20adb0)"
                  : "transparent",

              color:
                aba ===
                "recentes"
                  ? "#fff"
                  : "var(--pulsan-texto-secundario, #777)",

              fontWeight:
                "700",

              cursor:
                "pointer",
            }}
          >
            💬 Recentes

            {conversas.length >
              0 && (

              <span
                style={{
                  marginLeft:
                    "7px",

                  background:
                    "#fff",

                  color:
                    "#20adb0",

                  borderRadius:
                    "20px",

                  padding:
                    "2px 7px",

                  fontSize:
                    "11px",
                }}
              >
                {conversas.length}
              </span>

            )}

          </button>

        </div>

        {/* =================================================
            SOLICITAÇÕES
        ================================================= */}

        {aba ===
          "solicitacoes" && (

          <section>

            <div
              style={{
                display:
                  "flex",

                justifyContent:
                  "space-between",

                alignItems:
                  "center",

                marginBottom:
                  "15px",
              }}
            >

              <h2
                style={{
                  margin: 0,

                  fontSize:
                    "21px",
                }}
              >
                📩 Solicitações de conversa
              </h2>

              <span
                style={{
                  fontSize:
                    "12px",

                  color:
                    "var(--pulsan-texto-secundario, #777)",
                }}
              >
                {solicitacoes.length}
                {" pendentes"}
              </span>

            </div>

            {solicitacoes.length ===
            0 ? (

              <div
                style={{
                  background:
                    "var(--pulsan-card, #fff)",

                  border:
                    "1px solid var(--pulsan-borda, #e5e5e5)",

                  borderRadius:
                    "22px",

                  padding:
                    "45px 25px",

                  textAlign:
                    "center",
                }}
              >

                <div
                  style={{
                    fontSize:
                      "45px",

                    marginBottom:
                      "15px",
                  }}
                >
                  💚
                </div>

                <h3
                  style={{
                    margin:
                      "0 0 8px",
                  }}
                >
                  Nenhuma solicitação
                </h3>

                <p
                  style={{
                    color:
                      "var(--pulsan-texto-secundario, #777)",

                    margin:
                      0,
                  }}
                >
                  Quando alguém solicitar
                  uma conversa com você,
                  aparecerá aqui.
                </p>

              </div>

            ) : (

              <div
                style={{
                  display:
                    "flex",

                  flexDirection:
                    "column",

                  gap:
                    "16px",
                }}
              >

                {solicitacoes.map(
                  (solicitacao) => {

                    const urgencia =
                      obterUrgencia(
                        solicitacao.urgencia
                      );

                    const nota =
                      solicitacao.mediaAvaliacoes ||
                      "Novo";

                    const quantidade =
                      solicitacao.quantidadeAvaliacoes ||
                      0;

                    return (

                      <article
                        key={
                          solicitacao.id
                        }
                        style={{
                          background:
                            "var(--pulsan-card, #fff)",

                          border:
                            "1px solid var(--pulsan-borda, #e5e5e5)",

                          borderRadius:
                            "24px",

                          padding:
                            "22px",

                          boxShadow:
                            "0 6px 20px rgba(0,0,0,0.05)",
                        }}
                      >

                        {/* PERFIL */}

                        <div
                          style={{
                            display:
                              "flex",

                            alignItems:
                              "center",

                            gap:
                              "14px",
                          }}
                        >

                          <div
                            style={{
                              width:
                                "65px",

                              height:
                                "65px",

                              borderRadius:
                                "50%",

                              overflow:
                                "hidden",

                              background:
                                "#e8f5f3",

                              display:
                                "flex",

                              alignItems:
                                "center",

                              justifyContent:
                                "center",

                              flexShrink:
                                0,

                              fontSize:
                                "28px",
                            }}
                          >

                            {solicitacao.fotoSolicitante ? (

                              <img
                                src={
                                  solicitacao.fotoSolicitante
                                }
                                alt="Foto do solicitante"
                                style={{
                                  width:
                                    "100%",

                                  height:
                                    "100%",

                                  objectFit:
                                    "cover",
                                }}
                              />

                            ) : (
                              "👤"
                            )}

                          </div>

                          <div
                            style={{
                              flex:
                                1,
                            }}
                          >

                            <strong
                              style={{
                                display:
                                  "block",

                                fontSize:
                                  "18px",
                              }}
                            >
                              {solicitacao.nomeSolicitante ||
                                "Usuário"}
                            </strong>

                            <div
                              style={{
                                marginTop:
                                  "6px",

                                color:
                                  "#e7ad32",

                                fontSize:
                                  "14px",
                              }}
                            >
                              {nota !==
                              "Novo"
                                ? estrelas(
                                    nota
                                  )
                                : "☆☆☆☆☆"}

                              <span
                                style={{
                                  marginLeft:
                                    "7px",

                                  color:
                                    "var(--pulsan-texto, #173b38)",
                                }}
                              >
                                {nota}
                              </span>
                            </div>

                            <span
                              style={{
                                display:
                                  "block",

                                marginTop:
                                  "3px",

                                color:
                                  "var(--pulsan-texto-secundario, #777)",

                                fontSize:
                                  "12px",
                              }}
                            >
                              {quantidade}
                              {" avaliações"}
                            </span>

                          </div>

                          <span
                            style={{
                              background:
                                urgencia.fundo,

                              color:
                                urgencia.cor,

                              borderRadius:
                                "20px",

                              padding:
                                "6px 9px",

                              fontSize:
                                "11px",

                              fontWeight:
                                "700",
                            }}
                          >
                            {urgencia.icone}
                            {" "}
                            {urgencia.texto}
                          </span>

                        </div>

                        {/* SELOS */}

                        <div
                          style={{
                            display:
                              "flex",

                            gap:
                              "7px",

                            flexWrap:
                              "wrap",

                            marginTop:
                              "14px",
                          }}
                        >

                          {solicitacao.seloApoiador && (

                            <span
                              style={{
                                background:
                                  "#fff4d6",

                                color:
                                  "#8a6900",

                                borderRadius:
                                  "10px",

                                padding:
                                  "6px 9px",

                                fontSize:
                                  "11px",

                                fontWeight:
                                  "700",
                              }}
                            >
                              🏅 Apoiador
                            </span>

                          )}

                          {solicitacao.seloPsicologo && (

                            <span
                              style={{
                                background:
                                  "#e8f2ff",

                                color:
                                  "#27628f",

                                borderRadius:
                                  "10px",

                                padding:
                                  "6px 9px",

                                fontSize:
                                  "11px",

                                fontWeight:
                                  "700",
                              }}
                            >
                              🧠 Psicólogo Parceiro
                            </span>

                          )}

                        </div>

                        {/* DESABAFO */}

                        <div
                          style={{
                            background:
                              "var(--pulsan-card-secundario, #f7faf9)",

                            borderRadius:
                              "17px",

                            padding:
                              "15px",

                            marginTop:
                              "16px",
                          }}
                        >

                          <span
                            style={{
                              display:
                                "block",

                              fontSize:
                                "10px",

                              fontWeight:
                                "800",

                              letterSpacing:
                                "1px",

                              color:
                                "#20adb0",

                              marginBottom:
                                "7px",
                            }}
                          >
                            DESABAFO
                          </span>

                          <p
                            style={{
                              margin:
                                0,

                              fontFamily:
                                "Georgia, serif",

                              fontSize:
                                "15px",

                              lineHeight:
                                "1.55",

                              color:
                                "var(--pulsan-texto, #40514b)",
                            }}
                          >
                            “
                            {solicitacao.textoDesabafo ||
                              solicitacao.motivo ||
                              "A pessoa deseja conversar com você."}
                            ”
                          </p>

                        </div>

                        {/* DATA */}

                        <div
                          style={{
                            marginTop:
                              "12px",

                            color:
                              "var(--pulsan-texto-secundario, #888)",

                            fontSize:
                              "11px",
                          }}
                        >
                          🕐{" "}
                          {solicitacao.data ||
                            "Agora"}
                        </div>

                        {/* BOTÕES */}

                        <div
                          style={{
                            display:
                              "grid",

                            gridTemplateColumns:
                              "1fr 1fr",

                            gap:
                              "10px",

                            marginTop:
                              "17px",
                          }}
                        >

                          <button
                            type="button"
                            onClick={() =>
                              aceitarSolicitacao(
                                solicitacao
                              )
                            }
                            style={{
                              border:
                                "none",

                              borderRadius:
                                "15px",

                              padding:
                                "14px",

                              background:
                                "var(--pulsan-primaria, #20adb0)",

                              color:
                                "#fff",

                              fontWeight:
                                "700",

                              cursor:
                                "pointer",

                              fontSize:
                                "13px",
                            }}
                          >
                            ✓ Aceitar
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              rejeitarSolicitacao(
                                solicitacao
                              )
                            }
                            style={{
                              border:
                                "1px solid #e0d2d0",

                              borderRadius:
                                "15px",

                              padding:
                                "14px",

                              background:
                                "#fff8f7",

                              color:
                                "#a34f4a",

                              fontWeight:
                                "700",

                              cursor:
                                "pointer",

                              fontSize:
                                "13px",
                            }}
                          >
                            ✕ Rejeitar
                          </button>

                        </div>

                      </article>

                    );
                  }
                )}

              </div>

            )}

          </section>

        )}

        {/* =================================================
            CONVERSAS RECENTES
        ================================================= */}

        {aba ===
          "recentes" && (

          <section>

            <h2
              style={{
                margin:
                  "0 0 15px",

                fontSize:
                  "21px",
              }}
            >
              💬 Conversas recentes
            </h2>

            {conversas.length ===
            0 ? (

              <div
                style={{
                  background:
                    "var(--pulsan-card, #fff)",

                  border:
                    "1px solid var(--pulsan-borda, #e5e5e5)",

                  borderRadius:
                    "22px",

                  padding:
                    "45px 25px",

                  textAlign:
                    "center",
                }}
              >

                <div
                  style={{
                    fontSize:
                      "42px",

                    marginBottom:
                      "12px",
                  }}
                >
                  💬
                </div>

                <h3
                  style={{
                    margin:
                      "0 0 8px",
                  }}
                >
                  Nenhuma conversa ainda
                </h3>

                <p
                  style={{
                    margin:
                      0,

                    color:
                      "var(--pulsan-texto-secundario, #777)",
                  }}
                >
                  Depois que uma solicitação
                  for aceita, a conversa aparecerá
                  aqui.
                </p>

              </div>

            ) : (

              <div
                style={{
                  display:
                    "flex",

                  flexDirection:
                    "column",

                  gap:
                    "12px",
                }}
              >

                {conversas.map(
                  (conversa) => (

                    <button
                      key={
                        conversa.id
                      }
                      type="button"
                      onClick={() =>
                        abrirConversa(
                          conversa
                        )
                      }
                      style={{
                        width:
                          "100%",

                        border:
                          "1px solid var(--pulsan-borda, #e5e5e5)",

                        background:
                          "var(--pulsan-card, #fff)",

                        borderRadius:
                          "20px",

                        padding:
                          "16px",

                        display:
                          "flex",

                        alignItems:
                          "center",

                        gap:
                          "13px",

                        textAlign:
                          "left",

                        cursor:
                          "pointer",
                      }}
                    >

                      <div
                        style={{
                          width:
                            "55px",

                          height:
                            "55px",

                          borderRadius:
                            "50%",

                          overflow:
                            "hidden",

                          background:
                            "#e8f5f3",

                          display:
                            "flex",

                          alignItems:
                            "center",

                          justifyContent:
                            "center",

                          fontSize:
                            "23px",

                          flexShrink:
                            0,
                        }}
                      >

                        {conversa.foto ? (

                          <img
                            src={
                              conversa.foto
                            }
                            alt="Foto"
                            style={{
                              width:
                                "100%",

                              height:
                                "100%",

                              objectFit:
                                "cover",
                            }}
                          />

                        ) : (
                          "👤"
                        )}

                      </div>

                      <div
                        style={{
                          flex:
                            1,

                          minWidth:
                            0,
                        }}
                      >

                        <strong
                          style={{
                            display:
                              "block",

                            fontSize:
                              "16px",
                          }}
                        >
                          {conversa.nome ||
                            "Usuário"}
                        </strong>

                        <div
                          style={{
                            marginTop:
                              "4px",

                            color:
                              "#e7ad32",

                            fontSize:
                              "12px",
                          }}
                        >
                          ⭐{" "}
                          {conversa.mediaAvaliacoes ||
                            "Novo"}
                          {" • "}
                          {conversa.quantidadeAvaliacoes ||
                            0}
                          {" avaliações"}
                        </div>

                        <span
                          style={{
                            display:
                              "block",

                            marginTop:
                              "5px",

                            color:
                              "var(--pulsan-texto-secundario, #777)",

                            fontSize:
                              "12px",

                            whiteSpace:
                              "nowrap",

                            overflow:
                              "hidden",

                            textOverflow:
                              "ellipsis",
                          }}
                        >
                          {conversa.ultimaMensagem ||
                            "Conversa privada"}
                        </span>

                      </div>

                      <span
                        style={{
                          color:
                            "var(--pulsan-primaria, #20adb0)",

                          fontSize:
                            "22px",
                        }}
                      >
                        →
                      </span>

                    </button>

                  )
                )}

              </div>

            )}

          </section>

        )}

      </main>

      {/* =================================================
          MENU
      ================================================= */}

      <nav
        style={{
          position:
            "fixed",

          bottom:
            0,

          left:
            0,

          right:
            0,

          height:
            "75px",

          background:
            "var(--pulsan-card, #fff)",

          borderTop:
            "1px solid var(--pulsan-borda, #e5e5e5)",

          display:
            "flex",

          justifyContent:
            "center",

          alignItems:
            "center",

          gap:
            "90px",

          boxShadow:
            "0 -4px 15px rgba(0,0,0,0.05)",

          zIndex:
            999,
        }}
      >

        <button
          type="button"
          style={{
            border:
              "none",

            background:
              "transparent",

            color:
              "var(--pulsan-primaria, #20adb0)",

            fontWeight:
              "700",

            fontSize:
              "13px",

            cursor:
              "default",
          }}
        >
          <div
            style={{
              fontSize:
                "24px",
            }}
          >
            💬
          </div>

          Conversas
        </button>

        <button
          type="button"
          onClick={() =>
            irPara(
              "ambiente"
            )
          }
          style={{
            border:
              "none",

            background:
              "transparent",

            color:
              "var(--pulsan-texto-secundario, #777)",

            fontSize:
              "13px",

            cursor:
              "pointer",
          }}
        >
          <div
            style={{
              fontSize:
                "24px",
            }}
          >
            🏠
          </div>

          Início
        </button>

        <button
          type="button"
          onClick={() =>
            irPara(
              "perfil"
            )
          }
          style={{
            border:
              "none",

            background:
              "transparent",

            color:
              "var(--pulsan-texto-secundario, #777)",

            fontSize:
              "13px",

            cursor:
              "pointer",
          }}
        >
          <div
            style={{
              fontSize:
                "24px",
            }}
          >
            👤
          </div>

          Perfil
        </button>

      </nav>

    </div>
  );
}

export default Solicitacoes;