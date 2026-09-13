import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
function Ambiente({ irPara }) {useEffect(() => {
  async function testarSupabase() {
    const { data, error } = await supabase
      .from("perfis")
      .select("*")
      .limit(1);

    console.log("Teste Supabase:", { data, error });
  }

  testarSupabase();
}, []);
  const [desabafos, setDesabafos] = useState(() => {
    try {
      const dados = localStorage.getItem("pulsanPublicacoes");

      if (!dados) {
        return [];
      }

      const lista = JSON.parse(dados);

      return Array.isArray(lista) ? lista : [];
    } catch (erro) {
      console.log("Erro ao carregar desabafos:", erro);
      return [];
    }
  });

  const [comentariosAbertos, setComentariosAbertos] =
    useState(null);

  const [comentario, setComentario] =
    useState("");

  // =====================================================
  // USUÁRIO
  // =====================================================

  let usuario = {};

  try {
    usuario =
      JSON.parse(
        localStorage.getItem("usuarioLogado") ||
        localStorage.getItem("pulsanUsuarioAtual") ||
        "{}"
      ) || {};
  } catch (erro) {
    usuario = {};
  }

  const usuarioId =
    usuario.id ||
    usuario.email ||
    "usuario";

  const nomeUsuario =
    usuario.nome ||
    usuario.name ||
    "Usuário";

  // =====================================================
  // SEQUÊNCIA DE APOIO
  // =====================================================

  function registrarApoioDiario() {
    const hoje = new Date().toISOString().split("T")[0];
    const salvo = JSON.parse(
      localStorage.getItem("pulsanSequenciaApoio") || "{}"
    );

    if (salvo.ultimoDia === hoje) {
      return;
    }

    const ontem = new Date();
    ontem.setDate(ontem.getDate() - 1);
    const dataOntem = ontem.toISOString().split("T")[0];

    const sequencia =
      salvo.ultimoDia === dataOntem
        ? (salvo.sequencia || 0) + 1
        : 1;

    localStorage.setItem(
      "pulsanSequenciaApoio",
      JSON.stringify({ sequencia, ultimoDia: hoje })
    );
  }

  // =====================================================
  // SALVAR DESABAFOS
  // =====================================================

  function salvar(lista) {
    setDesabafos(lista);

    localStorage.setItem(
      "pulsanPublicacoes",
      JSON.stringify(lista)
    );
  }

  // =====================================================
  // APOIAR
  // =====================================================

  function apoiar(id) {
    registrarApoioDiario();
    const lista = desabafos.map((item) => {
      if (item.id !== id) {
        return item;
      }

      const apoiadores =
        Array.isArray(item.apoiadores)
          ? item.apoiadores
          : [];

      const jaApoiou =
        apoiadores.includes(usuarioId);

      return {
        ...item,

        apoiadores: jaApoiou
          ? apoiadores.filter(
              (idApoiador) =>
                idApoiador !== usuarioId
            )
          : [
              ...apoiadores,
              usuarioId,
            ],
      };
    });

    salvar(lista);
    // SEQUÊNCIA DIÁRIA DE APOIO
const hoje = new Date().toISOString().split("T")[0];

const sequenciaSalva = JSON.parse(
  localStorage.getItem("pulsanSequenciaApoio") || "{}"
);

if (sequenciaSalva.ultimoDia !== hoje) {
  const ontem = new Date();
  ontem.setDate(ontem.getDate() - 1);

  const dataOntem = ontem.toISOString().split("T")[0];

  const novaSequencia =
    sequenciaSalva.ultimoDia === dataOntem
      ? (sequenciaSalva.sequencia || 0) + 1
      : 1;

  localStorage.setItem(
    "pulsanSequenciaApoio",
    JSON.stringify({
      sequencia: novaSequencia,
      ultimoDia: hoje,
    })
  );
}
  }

  // =====================================================
  // COMENTAR
  // =====================================================

  function enviarComentario(id) {
    if (!comentario.trim()) {
      return;
    }

    const lista = desabafos.map((item) => {
      if (item.id !== id) {
        return item;
      }

      const comentarios =
        Array.isArray(item.comentarios)
          ? item.comentarios
          : [];

      return {
        ...item,

        comentarios: [
          ...comentarios,

          {
            id: `comentario-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,

            usuarioId: String(usuarioId),

            nome: "Anônimo",

            texto: comentario.trim(),

            data: new Date().toISOString(),
          },
        ],
      };
    });

    salvar(lista);

    setComentario("");
  }

  // =====================================================
  // SOLICITAR CHAT
  // =====================================================

  function solicitarChat(item) {
    const donoId =
      item.usuarioId ||
      item.autorId ||
      item.donoId ||
      "";

    // Não solicitar chat do próprio desabafo
    if (
      String(donoId) ===
      String(usuarioId)
    ) {
      alert(
        "Esse desabafo pertence a você."
      );

      return;
    }

    const confirmar =
      window.confirm(
        "Deseja solicitar um chat privado com esta pessoa?"
      );

    if (!confirmar) {
      return;
    }

    let solicitacoes = [];

    try {
      solicitacoes =
        JSON.parse(
          localStorage.getItem(
            "pulsanSolicitacoesChat"
          ) || "[]"
        );

      if (!Array.isArray(solicitacoes)) {
        solicitacoes = [];
      }
    } catch (erro) {
      solicitacoes = [];
    }

    // Verificar solicitação repetida
    const existente =
      solicitacoes.find(
        (solicitacao) =>
          solicitacao.publicacaoId ===
            item.id &&
          String(
            solicitacao.solicitanteId
          ) ===
            String(usuarioId) &&
          solicitacao.status ===
            "pendente"
      );

    if (existente) {
      alert(
        "Você já solicitou esse chat."
      );

      return;
    }

    const mediaAvaliacoes =
      usuario.mediaAvaliacoes ??
      usuario.avaliacao ??
      usuario.nota ??
      "Novo";

    const quantidadeAvaliacoes =
      usuario.quantidadeAvaliacoes ??
      usuario.totalAvaliacoes ??
      0;

    const novaSolicitacao = {
      id:
        "solicitacao-" +
        Date.now(),

      publicacaoId:
        item.id,

      solicitanteId:
        String(usuarioId),

      // Campos principais usados pela tela de Solicitações
      nomeSolicitante:
        nomeUsuario,

      fotoSolicitante:
        usuario.foto ||
        localStorage.getItem("pulsanFoto") ||
        "",

      mediaAvaliacoes,

      quantidadeAvaliacoes,

      seloApoiador:
        usuario.seloApoiador === true,

      seloPsicologo:
        usuario.seloPsicologo === true,

      // Mantidos para compatibilidade com versões anteriores
      solicitanteNome:
        nomeUsuario,

      solicitanteFoto:
        usuario.foto ||
        localStorage.getItem("pulsanFoto") ||
        "",

      destinatarioId:
        String(donoId),

      destinatarioNome:
        item.nomeUsuario ||
        "Usuário",

      destinatarioFoto:
        item.fotoUsuario ||
        "",

      // Desabafo completo que originou a solicitação
      textoDesabafo:
        item.texto || "",

      texto:
        item.texto || "",

      categoria:
        item.categoria ||
        item.sentimento ||
        "Conversa privada",

      urgencia:
        item.urgencia ||
        item.prioridade ||
        "normal",

      status:
        "pendente",

      data:
        new Date().toISOString(),
    };

    solicitacoes.push(
      novaSolicitacao
    );

    localStorage.setItem(
      "pulsanSolicitacoesChat",
      JSON.stringify(
        solicitacoes
      )
    );

    alert(
      "Solicitação enviada com sucesso! 💚"
    );
  }

  // =====================================================
  // DENUNCIAR
  // =====================================================

  function denunciar(item) {
    const motivo =
      window.prompt(
        "Digite o motivo da denúncia:"
      );

    if (!motivo) {
      return;
    }

    let denuncias = [];

    try {
      denuncias =
        JSON.parse(
          localStorage.getItem(
            "pulsanDenuncias"
          ) || "[]"
        );

      if (!Array.isArray(denuncias)) {
        denuncias = [];
      }
    } catch (erro) {
      denuncias = [];
    }

    denuncias.push({
      id: Date.now(),

      publicacaoId:
        item.id,

      motivo: motivo,

      usuarioId:
        usuarioId,

      data:
        new Date().toISOString(),
    });

    localStorage.setItem(
      "pulsanDenuncias",
      JSON.stringify(
        denuncias
      )
    );

    alert(
      "Denúncia enviada. Obrigado por ajudar a manter o Pulsan seguro."
    );
  }

  function obterSequenciaApoio() {
    try {
      const dados = JSON.parse(
        localStorage.getItem("pulsanSequenciaApoio") || "{}"
      );
      return Number(dados.sequencia) || 0;
    } catch (erro) {
      return 0;
    }
  }

  // =====================================================
  // TELA
  // =====================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "var(--pulsan-fundo, #f5f9f8)",
        paddingBottom: "110px",
      }}
    >

      {/* =================================================
          CABEÇALHO
      ================================================= */}

      <div
        style={{
          background:
            "var(--pulsan-card, #ffffff)",
          padding: "20px",
          borderBottom:
            "1px solid var(--pulsan-borda, #e5e5e5)",
        }}
      >
        <h1
          style={{
            margin: 0,
            color:
              "var(--pulsan-texto, #173b38)",
          }}
        >
          Pulsan
        </h1>

        <p
          style={{
            margin:
              "5px 0 0",
            color:
              "var(--pulsan-texto-secundario, #777)",
          }}
        >
          Um espaço para ouvir e ser ouvido.
        </p>
      </div>

      {/* =================================================
          CONTEÚDO
      ================================================= */}

      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          padding: "20px 15px",
        }}
      >

        <h2
          style={{
            color:
              "var(--pulsan-texto, #173b38)",
          }}
        >
          Desabafos
        </h2>
        <div
  style={{
    background: "var(--pulsan-card, #eaf3ff)",
    border: "1px solid var(--pulsan-borda, #a8c7ff)",
    borderRadius: "18px",
    padding: "15px",
    marginBottom: "18px",
    color: "var(--pulsan-texto, #1e293b)",
  }}
>
  <strong>
    💙 Sequência de apoio
  </strong>

  <p
    style={{
      margin: "6px 0 0",
      color: "var(--pulsan-texto-secundario, #64748b)",
    }}
  >
    Você está há{" "}
    <strong
      style={{
        color: "var(--pulsan-primaria-forte, #3a7dff)",
      }}
    >
      {obterSequenciaApoio()}{" "}
      dias
    </strong>{" "}
    espalhando apoio.
  </p>
</div>

        <p
          style={{
            color:
              "var(--pulsan-texto-secundario, #777)",
          }}
        >
          Aqui você pode apoiar alguém,
          comentar ou solicitar uma
          conversa privada.
        </p>

        {/* =================================================
            CASO NÃO TENHA DESABAFOS
        ================================================= */}

        {desabafos.length === 0 && (
          <div
            style={{
              background:
                "var(--pulsan-card, #ffffff)",
              borderRadius: "24px",
              padding: "40px 20px",
              textAlign: "center",
              border:
                "1px solid var(--pulsan-borda, #e5e5e5)",
            }}
          >
            <div
              style={{
                fontSize: "45px",
              }}
            >
              💚
            </div>

            <h3>
              Ainda não existem desabafos.
            </h3>

            <p>
              Quando alguém publicar,
              aparecerá aqui.
            </p>
          </div>
        )}

        {/* =================================================
            DESABAFOS
        ================================================= */}

        {desabafos.map((item, index) => {

          const apoiadores =
            Array.isArray(item.apoiadores)
              ? item.apoiadores
              : [];

          const comentarios =
            Array.isArray(item.comentarios)
              ? item.comentarios
              : [];

          const jaApoiou =
            apoiadores.includes(
              usuarioId
            );

          const dono =
            String(
              item.usuarioId ||
              item.autorId ||
              item.donoId ||
              ""
            ) ===
            String(usuarioId);

          return (
            <div
              key={
                item.id ||
                index
              }
              style={{
                background:
                  "var(--pulsan-card, #ffffff)",
                borderRadius: "25px",
                padding: "20px",
                marginBottom: "18px",
                border:
                  "1px solid var(--pulsan-borda, #e5e5e5)",
                boxShadow:
                  "0 5px 20px rgba(0,0,0,0.05)",
              }}
            >

              {/* USUÁRIO */}

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                }}
              >

                <div
                  style={{
                    width: "45px",
                    height: "45px",
                    borderRadius: "50%",
                    background: "#e4f4f2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  {item.fotoUsuario ? (
                    <img
                      src={
                        item.fotoUsuario
                      }
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
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
                    flex: 1,
                  }}
                >
                  <strong>
                    {item.nomeUsuario ||
                      "Usuário anônimo"}
                  </strong>

                  <div
                    style={{
                      fontSize: "11px",
                      color: "#888",
                    }}
                  >
                    Compartilhou no Pulsan
                  </div>
                </div>

                <button
                  onClick={() =>
                    denunciar(item)
                  }
                  style={{
                    border: "none",
                    background:
                      "transparent",
                    fontSize: "20px",
                    cursor: "pointer",
                  }}
                >
                  ⋮
                </button>

              </div>

              {/* PRIORIDADE */}

              <div
                style={{
                  display:
                    "inline-block",
                  marginTop: "15px",
                  background:
                    "#eef7f5",
                  color:
                    "#168f92",
                  borderRadius:
                    "12px",
                  padding:
                    "6px 10px",
                  fontSize:
                    "11px",
                  fontWeight:
                    "700",
                }}
              >
                {item.prioridade ===
                  "urgente" ||
                item.urgencia ===
                  "grave"
                  ? "🔴 Precisa de atenção"
                  : item.prioridade ===
                      "importante" ||
                    item.urgencia ===
                      "intermediario"
                  ? "🟡 Precisa de apoio"
                  : "🟢 Aberto para conversa"}
              </div>

              {/* TEXTO */}

              <p
                style={{
                  fontSize: "17px",
                  lineHeight: "1.6",
                  fontFamily:
                    "Georgia, serif",
                  color:
                    "var(--pulsan-texto, #40514b)",
                }}
              >
                {item.texto}
              </p>

              {/* BOTÕES */}

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "8px",
                }}
              >

                <button
                  onClick={() =>
                    apoiar(item.id)
                  }
                  style={{
                    border: "none",
                    borderRadius:
                      "14px",
                    padding:
                      "10px 14px",
                    background:
                      jaApoiou
                        ? "#d9f3ef"
                        : "#f1f5f4",
                    color:
                      jaApoiou
                        ? "#159497"
                        : "#60716f",
                    fontWeight:
                      "700",
                    cursor:
                      "pointer",
                  }}
                >
                  {jaApoiou
                    ? "💚 Apoiando"
                    : "🤍 Apoiar"}

                  {apoiadores.length >
                    0 &&
                    ` ${apoiadores.length}`}
                </button>

                <button
                  onClick={() =>
                    setComentariosAbertos(
                      comentariosAbertos ===
                        item.id
                        ? null
                        : item.id
                    )
                  }
                  style={{
                    border: "none",
                    borderRadius:
                      "14px",
                    padding:
                      "10px 14px",
                    background:
                      "#f1f5f4",
                    color:
                      "#60716f",
                    fontWeight:
                      "700",
                    cursor:
                      "pointer",
                  }}
                >
                  💬 Comentar
                  {comentarios.length >
                    0 &&
                    ` ${comentarios.length}`}
                </button>

                {!dono && (
                  <button
                    onClick={() =>
                      solicitarChat(
                        item
                      )
                    }
                    style={{
                      border: "none",
                      borderRadius:
                        "14px",
                      padding:
                        "10px 14px",
                      background:
                        "#20adb0",
                      color:
                        "#ffffff",
                      fontWeight:
                        "700",
                      cursor:
                        "pointer",
                    }}
                  >
                    💬 Solicitar chat
                  </button>
                )}

              </div>

              {/* =================================================
                  COMENTÁRIOS
              ================================================= */}

              {comentariosAbertos ===
                item.id && (
                <div
                  style={{
                    marginTop:
                      "15px",
                    paddingTop:
                      "15px",
                    borderTop:
                      "1px solid #eeeeee",
                  }}
                >

                  {comentarios.map(
                    (coment) => (
                      <div
                        key={
                          coment.id
                        }
                        style={{
                          background:
                            "var(--pulsan-card, #f5f8f7)",
                          color:
                            "var(--pulsan-texto, #173b38)",
                          borderRadius:
                            "14px",
                          padding:
                            "10px",
                          marginBottom:
                            "8px",
                        }}
                      >
                        <strong
                          style={{
                            fontSize:
                              "12px",
                          }}
                        >
                          {coment.nome ||
                            "Usuário"}
                        </strong>

                        <div
                          style={{
                            marginTop:
                              "4px",
                            color:
                              "var(--pulsan-texto, #173b38)",
                            fontSize:
                              "14px",
                          }}
                        >
                          {
                            coment.texto
                          }
                        </div>
                      </div>
                    )
                  )}

                  <div
                    style={{
                      display:
                        "flex",
                      gap: "8px",
                    }}
                  >
                    <input
                      value={
                        comentario
                      }
                      onChange={(
                        e
                      ) =>
                        setComentario(
                          e.target.value
                        )
                      }
                      placeholder="Escreva um comentário..."
                      style={{
                        flex: 1,
                        border:
                          "1px solid #dce5e3",
                        borderRadius:
                          "14px",
                        padding:
                          "11px",
                        outline:
                          "none",
                      }}
                    />

                    <button
                      onClick={() =>
                        enviarComentario(
                          item.id
                        )
                      }
                      style={{
                        border:
                          "none",
                        borderRadius:
                          "14px",
                        padding:
                          "0 15px",
                        background:
                          "#20adb0",
                        color:
                          "white",
                        fontWeight:
                          "700",
                        cursor:
                          "pointer",
                      }}
                    >
                      Enviar
                    </button>
                  </div>

                </div>
              )}

            </div>
          );
        })}

      </div>

      {/* =================================================
          BOTÃO DESABAFAR
      ================================================= */}

      <button
        onClick={() =>
          irPara("desabafar")
        }
        style={{
          position: "fixed",
          right: "20px",
          bottom: "90px",
          width: "62px",
          height: "62px",
          borderRadius: "50%",
          border: "none",
          background: "#20adb0",
          color: "white",
          fontSize: "26px",
          cursor: "pointer",
          boxShadow:
            "0 8px 25px rgba(0,0,0,0.2)",
          zIndex: 100,
        }}
      >
        ✎
      </button>

    </div>
  );
}

export default Ambiente;