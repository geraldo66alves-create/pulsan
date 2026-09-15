import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function Ambiente({ irPara }) {
  const [desabafos, setDesabafos] = useState([]);
  const [carregandoDesabafos, setCarregandoDesabafos] =
    useState(true);

  const [comentariosAbertos, setComentariosAbertos] =
    useState(null);

  const [comentario, setComentario] = useState("");
  const [enviandoComentario, setEnviandoComentario] =
    useState(false);

  // =====================================================
  // USUÁRIO
  // =====================================================

  const [usuario, setUsuario] = useState({});

  useEffect(() => {
    async function carregarUsuario() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUsuario(user);
      } else {
        try {
          const usuarioLocal = JSON.parse(
            localStorage.getItem("usuarioLogado") ||
              localStorage.getItem("pulsanUsuarioAtual") ||
              "{}"
          );

          setUsuario(usuarioLocal || {});
        } catch (erro) {
          setUsuario({});
        }
      }
    }

    carregarUsuario();
  }, []);

  const usuarioId =
    usuario.id ||
    usuario.email ||
    "usuario";

  const nomeUsuario =
    usuario.nome ||
    usuario.name ||
    usuario.user_metadata?.nome ||
    "Usuário";

  function usuarioAuthId() {
    return usuario.id || null;
  }

  // =====================================================
  // CARREGAR DESABAFOS E COMENTÁRIOS
  // =====================================================

  useEffect(() => {
    carregarDesabafos();
  }, []);

  async function carregarDesabafos() {
    setCarregandoDesabafos(true);

    const { data, error } = await supabase
      .from("posts_ambiente")
      .select("*")
      .eq("ativo", true)
      .order("criado_em", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Erro ao carregar desabafos:",
        error
      );

      setCarregandoDesabafos(false);
      return;
    }

    const postsComComentarios = await Promise.all(
      (data || []).map(async (post) => {
        const {
          data: comentariosBanco,
          error: erroComentarios,
        } = await supabase
          .from("comentarios_ambiente")
          .select("*")
          .eq("post_id", post.id)
          .eq("ativo", true)
          .order("criado_em", {
            ascending: true,
          });

        if (erroComentarios) {
          console.error(
            "Erro ao carregar comentários:",
            erroComentarios
          );
        }

        return {
          ...post,

          usuarioId: post.usuario_id,

          nomeUsuario:
            post.nome_usuario ||
            "Usuário anônimo",

          fotoUsuario:
            post.foto_usuario || "",

          texto: post.texto,

          apoiadores: Array.isArray(post.apoiadores)
            ? post.apoiadores
            : [],

          comentarios: (comentariosBanco || []).map(
            (comentarioBanco) => ({
              id: comentarioBanco.id,
              usuarioId:
                comentarioBanco.usuario_id,
              nome: "Anônimo",
              texto: comentarioBanco.texto,
              data: comentarioBanco.criado_em,
            })
          ),
        };
      })
    );

    setDesabafos(postsComComentarios);
    setCarregandoDesabafos(false);
  }

  // =====================================================
  // SEQUÊNCIA DE APOIO
  // =====================================================

  function registrarApoioDiario() {
    const hoje = new Date()
      .toISOString()
      .split("T")[0];

    let salvo = {};

    try {
      salvo = JSON.parse(
        localStorage.getItem(
          "pulsanSequenciaApoio"
        ) || "{}"
      );
    } catch (erro) {
      salvo = {};
    }

    if (salvo.ultimoDia === hoje) {
      return;
    }

    const ontem = new Date();
    ontem.setDate(ontem.getDate() - 1);

    const dataOntem = ontem
      .toISOString()
      .split("T")[0];

    const sequencia =
      salvo.ultimoDia === dataOntem
        ? (salvo.sequencia || 0) + 1
        : 1;

    localStorage.setItem(
      "pulsanSequenciaApoio",
      JSON.stringify({
        sequencia,
        ultimoDia: hoje,
      })
    );
  }

  function obterSequenciaApoio() {
    try {
      const dados = JSON.parse(
        localStorage.getItem(
          "pulsanSequenciaApoio"
        ) || "{}"
      );

      return Number(dados.sequencia) || 0;
    } catch (erro) {
      return 0;
    }
  }

  // =====================================================
  // APOIAR
  // =====================================================

  async function apoiar(id) {
    registrarApoioDiario();

    const post = desabafos.find(
      (item) => item.id === id
    );

    if (!post) {
      return;
    }

    const apoiadores = Array.isArray(
      post.apoiadores
    )
      ? post.apoiadores
      : [];

    const identificadorUsuario = String(
      usuarioId
    );

    const jaApoiou = apoiadores.includes(
      identificadorUsuario
    );

    const novosApoiadores = jaApoiou
      ? apoiadores.filter(
          (idApoiador) =>
            idApoiador !== identificadorUsuario
        )
      : [
          ...apoiadores,
          identificadorUsuario,
        ];

    const { error } = await supabase
      .from("posts_ambiente")
      .update({
        apoiadores: novosApoiadores,
      })
      .eq("id", id);

    if (error) {
      console.error(
        "Erro ao registrar apoio:",
        error
      );

      alert(
        "Não foi possível registrar o apoio."
      );

      return;
    }

    setDesabafos((listaAtual) =>
      listaAtual.map((item) =>
        item.id === id
          ? {
              ...item,
              apoiadores: novosApoiadores,
            }
          : item
      )
    );
  }

  // =====================================================
  // COMENTAR
  // =====================================================

  async function enviarComentario(id) {
    if (!comentario.trim()) {
      return;
    }

    const idUsuario = usuarioAuthId();

    if (!idUsuario) {
      alert(
        "Entre na sua conta para comentar."
      );

      return;
    }

    setEnviandoComentario(true);

    const textoComentario =
      comentario.trim();

    const { data, error } = await supabase
      .from("comentarios_ambiente")
      .insert({
        post_id: id,
        usuario_id: idUsuario,
        texto: textoComentario,
      })
      .select()
      .single();

    if (error) {
      console.error(
        "Erro ao enviar comentário:",
        error
      );

      alert(
        "Não foi possível enviar o comentário."
      );

      setEnviandoComentario(false);
      return;
    }

    setDesabafos((listaAtual) =>
      listaAtual.map((item) =>
        item.id === id
          ? {
              ...item,
              comentarios: [
                ...(Array.isArray(
                  item.comentarios
                )
                  ? item.comentarios
                  : []),
                {
                  id: data.id,
                  usuarioId:
                    data.usuario_id,
                  nome: "Anônimo",
                  texto: data.texto,
                  data: data.criado_em,
                },
              ],
            }
          : item
      )
    );

    setComentario("");
    setEnviandoComentario(false);
  }

  // =====================================================
  // SOLICITAR CHAT
  // =====================================================

  async function solicitarChat(desabafo) {
    try {
      const { data: { user }, error: erroUsuario } =
        await supabase.auth.getUser();

      if (erroUsuario || !user) {
        alert("Faça login para solicitar uma conversa.");
        return;
      }

      const destinatarioId =
        desabafo.usuario_id ||
        desabafo.usuarioId ||
        desabafo.autor_id ||
        desabafo.destinatario_id;

      if (!destinatarioId) {
        alert("Não foi possível identificar a pessoa deste desabafo.");
        return;
      }

      if (String(user.id) === String(destinatarioId)) {
        alert("Você não pode solicitar conversa consigo mesmo.");
        return;
      }

      const { data: existente, error: erroBusca } = await supabase
        .from("solicitacoes_chat")
        .select("id, status")
        .eq("solicitante_id", user.id)
        .eq("destinatario_id", destinatarioId)
        .in("status", ["pendente", "aceita"])
        .maybeSingle();

      if (erroBusca) {
        console.error("Erro ao verificar solicitação:", erroBusca);
        alert("Não foi possível verificar a solicitação.");
        return;
      }

      if (existente) {
        alert(
          existente.status === "aceita"
            ? "Você já possui uma conversa com essa pessoa."
            : "Você já enviou uma solicitação para essa pessoa."
        );
        return;
      }

      const { error: erroInsercao } = await supabase
        .from("solicitacoes_chat")
        .insert({
          solicitante_id: user.id,
          destinatario_id: destinatarioId,
          desabafo_id: desabafo.id,
          mensagem: "Gostaria de conversar em particular com você.",
          status: "pendente",
        });

      if (erroInsercao) {
        console.error("Erro ao criar solicitação:", erroInsercao);
        alert("Não foi possível enviar a solicitação. Tente novamente.");
        return;
      }

      alert("Solicitação de chat enviada!");
    } catch (erro) {
      console.error("Erro ao solicitar conversa:", erro);
      alert("Ocorreu um erro ao solicitar a conversa.");
    }
  }

  // =====================================================
  // DENUNCIAR
  // =====================================================

  function denunciar(item) {
    const motivo = window.prompt(
      "Digite o motivo da denúncia:"
    );

    if (!motivo) {
      return;
    }

    let denuncias = [];

    try {
      denuncias = JSON.parse(
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

      publicacaoId: item.id,

      motivo,

      usuarioId,

      data: new Date().toISOString(),
    });

    localStorage.setItem(
      "pulsanDenuncias",
      JSON.stringify(denuncias)
    );

    alert(
      "Denúncia enviada. Obrigado por ajudar a manter o Pulsan seguro."
    );
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
            margin: "5px 0 0",
            color:
              "var(--pulsan-texto-secundario, #777)",
          }}
        >
          Um espaço para ouvir e ser ouvido.
        </p>
      </div>

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
            background:
              "var(--pulsan-card, #eaf3ff)",
            border:
              "1px solid var(--pulsan-borda, #a8c7ff)",
            borderRadius: "18px",
            padding: "15px",
            marginBottom: "18px",
            color:
              "var(--pulsan-texto, #1e293b)",
          }}
        >
          <strong>
            💙 Sequência de apoio
          </strong>

          <p
            style={{
              margin: "6px 0 0",
              color:
                "var(--pulsan-texto-secundario, #64748b)",
            }}
          >
            Você está há{" "}
            <strong
              style={{
                color:
                  "var(--pulsan-primaria-forte, #3a7dff)",
              }}
            >
              {obterSequenciaApoio()} dias
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

        {carregandoDesabafos && (
          <div
            style={{
              textAlign: "center",
              padding: "30px",
            }}
          >
            Carregando desabafos...
          </div>
        )}

        {!carregandoDesabafos &&
          desabafos.length === 0 && (
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

        {desabafos.map((item, index) => {
          const apoiadores = Array.isArray(
            item.apoiadores
          )
            ? item.apoiadores
            : [];

          const comentarios = Array.isArray(
            item.comentarios
          )
            ? item.comentarios
            : [];

          const jaApoiou = apoiadores.includes(
            String(usuarioId)
          );

          const dono =
            String(
              item.usuarioId ||
                item.autorId ||
                item.donoId ||
                ""
            ) === String(usuarioId);

          return (
            <div
              key={item.id || index}
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
                      src={item.fotoUsuario}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
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
                    background: "transparent",
                    fontSize: "20px",
                    cursor: "pointer",
                  }}
                >
                  ⋮
                </button>
              </div>

              <div
                style={{
                  display: "inline-block",
                  marginTop: "15px",
                  background: "#eef7f5",
                  color: "#168f92",
                  borderRadius: "12px",
                  padding: "6px 10px",
                  fontSize: "11px",
                  fontWeight: "700",
                }}
              >
                {item.prioridade === "urgente" ||
                item.urgencia === "grave"
                  ? "🔴 Precisa de atenção"
                  : item.prioridade === "importante" ||
                    item.urgencia === "intermediario"
                  ? "🟡 Precisa de apoio"
                  : "🟢 Aberto para conversa"}
              </div>

              <p
                style={{
                  fontSize: "17px",
                  lineHeight: "1.6",
                  fontFamily: "Georgia, serif",
                  color:
                    "var(--pulsan-texto, #40514b)",
                }}
              >
                {item.texto}
              </p>

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
                    borderRadius: "14px",
                    padding: "10px 14px",
                    background: jaApoiou
                      ? "#d9f3ef"
                      : "#f1f5f4",
                    color: jaApoiou
                      ? "#159497"
                      : "#60716f",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  {jaApoiou
                    ? "💚 Apoiando"
                    : "🤍 Apoiar"}

                  {apoiadores.length > 0 &&
                    ` ${apoiadores.length}`}
                </button>

                <button
                  onClick={() =>
                    setComentariosAbertos(
                      comentariosAbertos === item.id
                        ? null
                        : item.id
                    )
                  }
                  style={{
                    border: "none",
                    borderRadius: "14px",
                    padding: "10px 14px",
                    background: "#f1f5f4",
                    color: "#60716f",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  💬 Comentar

                  {comentarios.length > 0 &&
                    ` ${comentarios.length}`}
                </button>

                {!dono && (
                  <button
                    onClick={() =>
                      solicitarChat(item)
                    }
                    style={{
                      border: "none",
                      borderRadius: "14px",
                      padding: "10px 14px",
                      background: "#20adb0",
                      color: "#ffffff",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}
                  >
                    💬 Solicitar chat
                  </button>
                )}
              </div>

              {comentariosAbertos === item.id && (
                <div
                  style={{
                    marginTop: "15px",
                    paddingTop: "15px",
                    borderTop:
                      "1px solid #eeeeee",
                  }}
                >
                  {comentarios.map((coment) => (
                    <div
                      key={coment.id}
                      style={{
                        background:
                          "var(--pulsan-card, #f5f8f7)",
                        color:
                          "var(--pulsan-texto, #173b38)",
                        borderRadius: "14px",
                        padding: "10px",
                        marginBottom: "8px",
                      }}
                    >
                      <strong
                        style={{
                          fontSize: "12px",
                        }}
                      >
                        {coment.nome || "Usuário"}
                      </strong>

                      <div
                        style={{
                          marginTop: "4px",
                          color:
                            "var(--pulsan-texto, #173b38)",
                          fontSize: "14px",
                        }}
                      >
                        {coment.texto}
                      </div>
                    </div>
                  ))}

                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                    }}
                  >
                    <input
                      value={comentario}
                      onChange={(e) =>
                        setComentario(e.target.value)
                      }
                      placeholder="Escreva um comentário..."
                      disabled={enviandoComentario}
                      style={{
                        flex: 1,
                        border:
                          "1px solid #dce5e3",
                        borderRadius: "14px",
                        padding: "11px",
                        outline: "none",
                      }}
                    />

                    <button
                      onClick={() =>
                        enviarComentario(item.id)
                      }
                      disabled={enviandoComentario}
                      style={{
                        border: "none",
                        borderRadius: "14px",
                        padding: "0 15px",
                        background: "#20adb0",
                        color: "white",
                        fontWeight: "700",
                        cursor: "pointer",
                      }}
                    >
                      {enviandoComentario
                        ? "Enviando..."
                        : "Enviar"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

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