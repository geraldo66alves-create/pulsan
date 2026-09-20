import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function Avaliacao({ irPara }) {
  // =====================================================
  // CONVERSA ATUAL
  // =====================================================

  let solicitacao = {};
  let conversa = {};

  try {
    solicitacao =
      JSON.parse(
        localStorage.getItem(
          "pulsanSolicitacaoAtual"
        ) || "{}"
      ) || {};

    conversa =
      JSON.parse(
        localStorage.getItem(
          "pulsanConversaAtual"
        ) || "{}"
      ) || {};
  } catch (erro) {
    console.log(
      "Erro ao carregar dados da conversa:",
      erro
    );
  }

  // =====================================================
  // USUÁRIO ATUAL — SUPABASE COMO FONTE DE VERDADE
  // =====================================================

  const [usuarioId, setUsuarioId] = useState("");
  const [nomeUsuario, setNomeUsuario] = useState("Usuário");
  const [carregandoUsuario, setCarregandoUsuario] = useState(true);
  const [estrelas, setEstrelas] = useState(0);
  const [enviado, setEnviado] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [hover, setHover] = useState(0);

  useEffect(() => {
    let ativo = true;

    async function carregarUsuario() {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (error || !data?.user) {
          throw error || new Error("Usuário não autenticado.");
        }

        if (!ativo) return;

        setUsuarioId(data.user.id);

        const { data: perfil } = await supabase
          .from("perfis")
          .select("nome")
          .eq("id", data.user.id)
          .maybeSingle();

        setNomeUsuario(
          perfil?.nome ||
          data.user.user_metadata?.nome ||
          "Usuário"
        );
      } catch (erro) {
        console.error("Erro ao identificar usuário:", erro);
        if (ativo) {
          setUsuarioId("");
          setNomeUsuario("Usuário");
        }
      } finally {
        if (ativo) setCarregandoUsuario(false);
      }
    }

    carregarUsuario();

    return () => {
      ativo = false;
    };
  }, []);

  // =====================================================
  // IDENTIFICAR QUEM AJUDOU
  // =====================================================

  const ajudanteId =
    solicitacao.ajudanteId ||
    solicitacao.apoiadorId ||
    solicitacao.helperId ||
    solicitacao.avaliadoId ||
    conversa.ajudanteId ||
    conversa.apoiadorId ||
    conversa.avaliadoId ||
    localStorage.getItem("pulsanAjudanteId") ||
    "";

  const ajudanteNome =
    solicitacao.ajudanteNome ||
    solicitacao.apoiadorNome ||
    conversa.ajudanteNome ||
    conversa.apoiadorNome ||
    localStorage.getItem("pulsanNomeOutraPessoa") ||
    "Apoiador";

  const ajudanteFoto =
    solicitacao.ajudanteFoto ||
    solicitacao.apoiadorFoto ||
    conversa.ajudanteFoto ||
    conversa.apoiadorFoto ||
    localStorage.getItem("pulsanFotoOutraPessoa") ||
    "";

  // =====================================================
  // TEXTO DA ESTRELA
  // =====================================================

  function textoAvaliacao() {
    if (estrelas === 1) {
      return "Muito ruim";
    }

    if (estrelas === 2) {
      return "Ruim";
    }

    if (estrelas === 3) {
      return "Regular";
    }

    if (estrelas === 4) {
      return "Boa";
    }

    if (estrelas === 5) {
      return "Excelente";
    }

    return "Escolha uma avaliação";
  }

  // =====================================================
  // REGISTRAR AVALIAÇÃO NO SUPABASE
  // =====================================================

  async function enviarAvaliacao() {
    if (estrelas < 1) {
      alert("Escolha de 1 a 5 estrelas para continuar.");
      return;
    }

    if (carregandoUsuario) {
      return;
    }

    if (!usuarioId) {
      alert("Sua sessão não foi identificada. Entre novamente no Pulsan para avaliar.");
      return;
    }

    const conversaId =
      conversa.id ||
      solicitacao.conversaId ||
      solicitacao.id ||
      localStorage.getItem("pulsanConversaId") ||
      "";

    if (!conversaId || conversaId === "conversa") {
      alert("Não foi possível identificar a conversa que será avaliada.");
      return;
    }

    if (!ajudanteId || ajudanteId === "ajudante") {
      alert("Não foi possível identificar a pessoa que recebeu a avaliação.");
      return;
    }

    try {
      // A avaliação precisa ser conferida no banco, não apenas no navegador.
      const { data: existente, error: erroBusca } = await supabase
        .from("avaliacoes")
        .select("id")
        .eq("conversa_id", conversaId)
        .eq("avaliador_id", usuarioId)
        .maybeSingle();

      if (erroBusca) {
        console.error("Erro ao verificar avaliação existente:", erroBusca);
        throw erroBusca;
      }

      if (existente) {
        alert("Você já avaliou esta conversa.");
        setEnviado(true);
        return;
      }

      const { error: erroInsercao } = await supabase
        .from("avaliacoes")
        .insert({
          conversa_id: conversaId,
          avaliador_id: usuarioId,
          avaliado_id: ajudanteId,
          estrelas,
          comentario: mensagem.trim() || null,
          criada_em: new Date().toISOString(),
        });

      if (erroInsercao) {
        // Se houver uma restrição UNIQUE no banco, uma segunda tentativa
        // também será impedida no servidor.
        if (String(erroInsercao.code) === "23505") {
          alert("Você já avaliou esta conversa.");
          setEnviado(true);
          return;
        }

        console.error("Erro ao salvar avaliação:", erroInsercao);
        throw erroInsercao;
      }

      // A finalização da conversa também fica no banco.
      const { error: erroConversa } = await supabase
        .from("conversas")
        .update({
          status: "finalizada",
          avaliacao_feita: true,
          avaliacao: estrelas,
          avaliado_em: new Date().toISOString(),
        })
        .eq("id", conversaId);

      if (erroConversa) {
        // A avaliação já foi salva. Não desfazemos a avaliação por uma
        // falha secundária na atualização da conversa.
        console.warn("Avaliação salva, mas a conversa não foi atualizada:", erroConversa);
      }

      // Não usamos mais localStorage como banco de avaliações, pontos ou selo.
      // Esses dados devem ser calculados a partir das avaliações persistidas.
      localStorage.setItem(
        "pulsanAvaliacaoFeita-" + conversaId,
        "true"
      );

      setEnviado(true);
    } catch (erro) {
      console.error("Erro ao enviar avaliação:", erro);
      alert(
        `Não foi possível enviar a avaliação.\\n\\n${
          erro?.message || "Verifique sua conexão e tente novamente."
        }`
      );
    }
  }

  // =====================================================
  // VOLTAR
  // =====================================================

  function voltar() {
    irPara(
      "solicitacoes"
    );
  }

  // =====================================================
  // TELA DE SUCESSO
  // =====================================================

  if (enviado) {
    return (
      <div
        style={{
          minHeight:
            "100vh",
          background:
            "var(--pulsan-fundo, #fffdf9)",
          display:
            "flex",
          alignItems:
            "center",
          justifyContent:
            "center",
          padding:
            "20px",
          boxSizing:
            "border-box",
        }}
      >
        <div
          style={{
            width:
              "100%",
            maxWidth:
              "500px",
            background:
              "var(--pulsan-card, #ffffff)",
            borderRadius:
              "28px",
            padding:
              "35px 25px",
            textAlign:
              "center",
            boxShadow:
              "0 8px 30px rgba(0,0,0,0.08)",
            border:
              "1px solid var(--pulsan-borda, #e5e5e5)",
          }}
        >

          <div
            style={{
              fontSize:
                "60px",
              marginBottom:
                "15px",
            }}
          >
            💚
          </div>

          <h1
            style={{
              margin:
                "0 0 10px",
              color:
                "var(--pulsan-texto, #173b38)",
              fontSize:
                "25px",
            }}
          >
            Avaliação enviada!
          </h1>

          <p
            style={{
              color:
                "#777",
              lineHeight:
                "1.6",
              marginBottom:
                "20px",
            }}
          >
            Obrigado por contribuir
            com uma rede de apoio
            mais acolhedora.
          </p>

          <div
            style={{
              background:
                "#f3faf7",
              borderRadius:
                "18px",
              padding:
                "15px",
              marginBottom:
                "20px",
            }}
          >
            <div
              style={{
                fontSize:
                  "28px",
                marginBottom:
                  "5px",
              }}
            >
              {"⭐".repeat(
                estrelas
              )}
            </div>

            <strong
              style={{
                color:
                  "#168f92",
              }}
            >
              {textoAvaliacao()}
            </strong>
          </div>

          <button
            type="button"
            onClick={
              voltar
            }
            style={{
              width:
                "100%",
              border:
                "none",
              borderRadius:
                "16px",
              padding:
                "13px",
              background:
                "#20adb0",
              color:
                "#ffffff",
              fontWeight:
                "700",
              cursor:
                "pointer",
              fontSize:
                "14px",
            }}
          >
            Voltar para Conversas
          </button>

        </div>
      </div>
    );
  }

  // =====================================================
  // TELA PRINCIPAL
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
        padding:
          "25px 15px 100px",
        boxSizing:
          "border-box",
        fontFamily:
          "Arial, Helvetica, sans-serif",
      }}
    >

      {/* ================================================
          VOLTAR
      ================================================= */}

      <div
        style={{
          maxWidth:
            "600px",
          margin:
            "0 auto 15px",
        }}
      >
        <button
          type="button"
          onClick={
            voltar
          }
          style={{
            border:
              "none",
            background:
              "transparent",
            fontSize:
              "25px",
            cursor:
              "pointer",
            color:
              "var(--pulsan-texto, #173b38)",
          }}
        >
          ←
        </button>
      </div>

      {/* ================================================
          CARD
      ================================================= */}

      <div
        style={{
          width:
            "100%",
          maxWidth:
            "600px",
          margin:
            "0 auto",
          background:
            "var(--pulsan-card, #ffffff)",
          borderRadius:
            "28px",
          padding:
            "30px 22px",
          boxSizing:
            "border-box",
          boxShadow:
            "0 8px 30px rgba(0,0,0,0.07)",
          border:
            "1px solid var(--pulsan-borda, #e5e5e5)",
          textAlign:
            "center",
        }}
      >

        {/* FOTO */}

        <div
          style={{
            width:
              "75px",
            height:
              "75px",
            borderRadius:
              "50%",
            background:
              "#e5f2ef",
            margin:
              "0 auto 12px",
            display:
              "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            overflow:
              "hidden",
            fontSize:
              "32px",
          }}
        >
          {ajudanteFoto ? (
            <img
              src={
                ajudanteFoto
              }
              alt=""
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

        {/* NOME */}

        <h1
          style={{
            margin:
              "0 0 5px",
            fontSize:
              "23px",
          }}
        >
          Avalie {ajudanteNome}
        </h1>

        <p
          style={{
            color:
              "#777",
            fontSize:
              "14px",
            lineHeight:
              "1.5",
          }}
        >
          Como foi sua experiência
          com essa pessoa?
        </p>

        {/* =============================================
            ESTRELAS
        ============================================== */}

        <div
          style={{
            display:
              "flex",
            justifyContent:
              "center",
            gap:
              "5px",
            margin:
              "25px 0 10px",
          }}
        >
          {[1, 2, 3, 4, 5].map(
            (numero) => (
              <button
                key={
                  numero
                }
                type="button"
                onClick={() =>
                  setEstrelas(
                    numero
                  )
                }
                onMouseEnter={() =>
                  setHover(
                    numero
                  )
                }
                onMouseLeave={() =>
                  setHover(
                    0
                  )
                }
                aria-label={
                  numero +
                  " estrelas"
                }
                style={{
                  border:
                    "none",
                  background:
                    "transparent",
                  cursor:
                    "pointer",
                  fontSize:
                    "43px",
                  padding:
                    "2px",
                  transform:
                    numero ===
                      (hover ||
                        estrelas)
                      ? "scale(1.12)"
                      : "scale(1)",
                  transition:
                    "0.15s",
                  filter:
                    numero <=
                    (hover ||
                      estrelas)
                      ? "none"
                      : "grayscale(1)",
                  opacity:
                    numero <=
                    (hover ||
                      estrelas)
                      ? 1
                      : 0.35,
                }}
              >
                ⭐
              </button>
            )
          )}
        </div>

        {/* TEXTO */}

        <strong
          style={{
            display:
              "block",
            color:
              estrelas
                ? "#168f92"
                : "#999",
            marginBottom:
              "25px",
          }}
        >
          {textoAvaliacao()}
        </strong>

        {/* =============================================
            COMENTÁRIO
        ============================================== */}

        <textarea
          value={
            mensagem
          }
          onChange={(e) =>
            setMensagem(
              e.target.value
            )
          }
          placeholder="Quer deixar um comentário? (opcional)"
          maxLength={500}
          rows={4}
          style={{
            width:
              "100%",
            boxSizing:
              "border-box",
            resize:
              "vertical",
            border:
              "1px solid var(--pulsan-borda, #dfe7e4)",
            borderRadius:
              "17px",
            padding:
              "13px",
            outline:
              "none",
            background:
              "var(--pulsan-card-secundario, #f8faf9)",
            color:
              "var(--pulsan-texto, #173b38)",
            fontFamily:
              "Arial, Helvetica, sans-serif",
            fontSize:
              "14px",
            marginBottom:
              "5px",
          }}
        />

        <div
          style={{
            textAlign:
              "right",
            fontSize:
              "10px",
            color:
              "#aaa",
            marginBottom:
              "20px",
          }}
        >
          {mensagem.length}/500
        </div>

        {/* =============================================
            BOTÃO
        ============================================== */}

        <button
          type="button"
          onClick={
            enviarAvaliacao
          }
          disabled={
            estrelas === 0 || carregandoUsuario
          }
          style={{
            width:
              "100%",
            border:
              "none",
            borderRadius:
              "17px",
            padding:
              "14px",
            background:
              estrelas > 0 && !carregandoUsuario
                ? "#20adb0"
                : "#d9e6e4",
            color:
              "#ffffff",
            fontWeight:
              "700",
            fontSize:
              "15px",
            cursor:
              estrelas > 0 && !carregandoUsuario
                ? "pointer"
                : "not-allowed",
            boxShadow:
              estrelas > 0
                ? "0 6px 18px rgba(32,173,176,0.25)"
                : "none",
          }}
        >
          {carregandoUsuario ? "⏳ Identificando sua sessão..." : "⭐ Enviar avaliação"}
        </button>

      </div>

      {/* ================================================
          INFORMAÇÃO
      ================================================= */}

      <div
        style={{
          maxWidth:
            "600px",
          margin:
            "15px auto 0",
          background:
            "var(--pulsan-card, #ffffff)",
          borderRadius:
            "18px",
          padding:
            "15px",
          border:
            "1px solid var(--pulsan-borda, #e5e5e5)",
          fontSize:
            "12px",
          lineHeight:
            "1.5",
          color:
            "#777",
          textAlign:
            "center",
          boxSizing:
            "border-box",
        }}
      >
        💚 Sua avaliação ajuda o Pulsan
        a reconhecer quem contribui
        para a rede de apoio.
      </div>

    </div>
  );
}

export default Avaliacao;