import React, {
  useEffect,
  useState,
} from "react";

import { supabase } from "../lib/supabase";

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

 async function carregarDados() {
  const {
    data: usuarioAuth,
    error: erroUsuario,
  } = await supabase.auth.getUser();

  if (
    erroUsuario ||
    !usuarioAuth?.user
  ) {
    setSolicitacoes([]);
    setConversas([]);
    return;
  }

  const usuarioId =
    usuarioAuth.user.id;

  const {
    data: solicitacoesBanco,
    error: erroSolicitacoes,
  } = await supabase
    .from("solicitacoes_chat")
    .select("*")
    .eq("destinatario_id", usuarioId)
    .eq("status", "pendente")
    .order("criado_em", {
      ascending: false,
    });

  if (erroSolicitacoes) {
    console.error(
      "Erro ao carregar solicitações:",
      erroSolicitacoes
    );
  }

  const solicitacoesFormatadas =
    (solicitacoesBanco || []).map(
      (item) => ({
        ...item,

        solicitanteId:
          item.solicitante_id,

        destinatarioId:
          item.destinatario_id,

        publicacaoId:
          item.desabafo_id,

        nomeSolicitante:
          item.nome_solicitante ||
          item.nomeSolicitante ||
          item.nome ||
          "Usuário",

        fotoSolicitante:
          item.foto_solicitante ||
          item.fotoSolicitante ||
          item.foto ||
          "",

        textoDesabafo:
          "A pessoa deseja conversar com você.",

        data:
          item.criado_em
            ? new Date(
                item.criado_em
              ).toLocaleString("pt-BR")
            : "Agora",

        urgencia:
          "normal",

        mediaAvaliacoes:
          item.media_avaliacoes ??
          item.mediaAvaliacoes ??
          item.avaliacao ??
          "Novo",

        quantidadeAvaliacoes:
          item.quantidade_avaliacoes ??
          item.quantidadeAvaliacoes ??
          item.total_avaliacoes ??
          0,

        seloApoiador:
          item.selo_apoiador ??
          item.seloApoiador ??
          false,

        seloPsicologo:
          item.selo_psicologo ??
          item.seloPsicologo ??
          false,
      })
    );

  setSolicitacoes(
    solicitacoesFormatadas
  );

  const {
    data: conversasBanco,
    error: erroConversas,
  } = await supabase
    .from("conversas")
    .select("*")
    .or(
      `solicitante_id.eq.${usuarioId},destinatario_id.eq.${usuarioId}`
    )
    .in("status", [
      "ativa",
      "aceita",
    ])
    .order("iniciada_em", {
      ascending: false,
    });

  if (erroConversas) {
    console.error(
      "Erro ao carregar conversas:",
      erroConversas
    );
  }

  const conversasFormatadas =
    (conversasBanco || []).map(
      (item) => ({
        ...item,

        usuarioAId:
          item.solicitante_id,

        usuarioBId:
          item.destinatario_id,

        solicitacaoId:
          item.solicitacao_id,

        nome:
          "Usuário",

        foto:
          "",

        mediaAvaliacoes:
          "Novo",

        quantidadeAvaliacoes:
          0,

        ultimaMensagem:
          "Conversa privada",

        hora:
          item.iniciada_em
            ? new Date(
                item.iniciada_em
              ).toLocaleString("pt-BR")
            : "Agora",

        status:
          item.status,
      })
    );

  setConversas(
    conversasFormatadas
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

 async function aceitarSolicitacao(
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

  const {
    data: usuarioAuth,
    error: erroUsuario,
  } = await supabase.auth.getUser();

  if (
    erroUsuario ||
    !usuarioAuth?.user
  ) {
    alert("Faça login novamente.");
    return;
  }

  const meuUsuarioId =
    usuarioAuth.user.id;

  const {
    error: erroAtualizacao,
  } = await supabase
    .from("solicitacoes_chat")
    .update({
      status: "aceita",
      atualizado_em:
        new Date().toISOString(),
    })
    .eq("id", solicitacao.id)
    .eq(
      "destinatario_id",
      meuUsuarioId
    );

  if (erroAtualizacao) {
    console.error(
      erroAtualizacao
    );

    alert(
      "Não foi possível aceitar a solicitação."
    );

    return;
  }

  const {
    data: conversaExistente,
    error: erroBusca,
  } = await supabase
    .from("conversas")
    .select("*")
    .eq(
      "solicitacao_id",
      solicitacao.id
    )
    .maybeSingle();

  if (erroBusca) {
    console.error(erroBusca);
  }

  let conversa =
    conversaExistente;

  if (!conversa) {
    const {
      data: novaConversa,
      error: erroConversa,
    } = await supabase
      .from("conversas")
      .insert({
        solicitante_id:
          solicitacao.solicitante_id ||
          solicitacao.solicitanteId,

        destinatario_id:
          solicitacao.destinatario_id ||
          solicitacao.destinatarioId,

        solicitacao_id:
          solicitacao.id,

        status:
          "ativa",

        iniciada_em:
          new Date().toISOString(),
      })
      .select()
      .single();

    if (erroConversa) {
      console.error(
        erroConversa
      );

      alert(
        "Solicitação aceita, mas não foi possível abrir a conversa."
      );

      return;
    }

    conversa =
      novaConversa;
  }

  localStorage.setItem(
    "pulsanConversaAtual",
    JSON.stringify(conversa)
  );

  localStorage.setItem(
    "pulsanPapelConversa",
    "ajudante"
  );

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
    "pulsanDesabafoConversa",
    solicitacao.textoDesabafo ||
      ""
  );

  await carregarDados();

  irPara("conversa");
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
     String(
  conversa.solicitante_id ||
  conversa.usuarioAId
) === String(meuId)
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