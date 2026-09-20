import React, { useState } from "react";
import { supabase } from "../lib/supabase";

function Desabafo({ irPara }) {
  const [texto, setTexto] = useState("");
  const [analisandoIA, setAnalisandoIA] = useState(false);

  const limite = 1000;

  // =====================================================
  // PUBLICAR DESABAFO
  // =====================================================

  async function publicar(e) {
    e.preventDefault();

    if (analisandoIA) return;

    const textoLimpo = texto.trim();

    if (!textoLimpo) {
      alert("Escreva algo antes de publicar.");
      return;
    }

    setAnalisandoIA(true);

    try {
      // ===================================================
      // USUÁRIO AUTENTICADO
      // ===================================================

      const { data: sessao, error: erroSessao } =
        await supabase.auth.getUser();

      if (erroSessao || !sessao?.user) {
        alert("Sua sessão não foi encontrada. Faça login novamente.");
        return;
      }

      const usuarioId = sessao.user.id;

      // ===================================================
      // ANÁLISE DE SEGURANÇA PELA IA DO PULSAN
      // ===================================================

      const API_URL =
        import.meta.env.VITE_API_URL ||
        "http://localhost:3001";

      const respostaIA = await fetch(
        `${API_URL}/api/analisar-desabafo`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            texto: textoLimpo,
            ambiente: "geral",
          }),
        }
      );

      if (!respostaIA.ok) {
        throw new Error(
          "Não foi possível analisar o desabafo."
        );
      }

      const analiseIA = await respostaIA.json();

      // ===================================================
      // MODERAÇÃO
      // ===================================================

      if (analiseIA?.publicarPermitido === false) {
        alert(
          analiseIA.motivoModeracao ||
            "Seu texto contém linguagem ofensiva ou inadequada. Revise a mensagem e tente novamente."
        );
        return;
      }

      // ===================================================
      // CLASSIFICAÇÃO DA IA
      // ===================================================

      let classificacao =
        analiseIA?.classificacao || "normal";

      if (
        !["normal", "intermediario", "grave", "urgente"].includes(
          classificacao
        )
      ) {
        classificacao = "normal";
      }

      const alerta = Boolean(
        analiseIA?.alerta ||
          classificacao === "intermediario" ||
          classificacao === "grave" ||
          classificacao === "urgente"
      );

      // ===================================================
      // SALVAR DIRETAMENTE NO SUPABASE
      // ===================================================
      // Não usamos localStorage para armazenar a publicação.
      // O conteúdo fica no banco e pode ser carregado pelo
      // Ambiente.jsx para todos os fluxos da plataforma.

      const { data: publicacaoBanco, error: erroBanco } =
        await supabase
          .from("posts_ambiente")
          .insert({
            usuario_id: usuarioId,
            texto: textoLimpo,
            ambiente: "geral",
            classificacao,
            alerta,
            nome_usuario: "Anônimo",
            prioridade:
              analiseIA?.prioridadeAlerta ||
              classificacao,
            categoria:
              analiseIA?.tipoSituacao ||
              "geral",
            sentimento:
              analiseIA?.sentimento || null,
            urgencia: classificacao,
            moderado: true,
            moderacao_motivo:
              analiseIA?.motivoModeracao || null,
          })
          .select()
          .single();

      if (erroBanco) {
        console.error(
          "❌ Pulsan: erro ao salvar desabafo no Supabase.",
          erroBanco
        );

        throw new Error(
          "Não foi possível salvar o desabafo."
        );
      }

      // ===================================================
      // LIMPAR
      // ===================================================

      setTexto("");

      // ===================================================
      // AVISO AO USUÁRIO
      // ===================================================

      if (classificacao === "urgente") {
        alert(
          "Seu desabafo foi publicado anonimamente. 💚\n\n" +
            "A situação poderá receber atenção da equipe responsável."
        );
      } else if (classificacao === "grave") {
        alert(
          "Seu desabafo foi publicado anonimamente. 💚\n\n" +
            "A situação poderá receber atenção adicional."
        );
      } else if (classificacao === "intermediario") {
        alert(
          "Seu desabafo foi publicado anonimamente. 💚\n\n" +
            "Seu relato poderá receber atenção adicional."
        );
      } else {
        alert(
          "Seu desabafo foi publicado anonimamente. 💚"
        );
      }

      console.log(
        "✅ Pulsan: desabafo salvo no Supabase.",
        publicacaoBanco?.id
      );

      irPara("ambiente");
    } catch (erro) {
      console.error(
        "❌ Pulsan: erro ao publicar desabafo.",
        erro
      );

      alert(
        "Não foi possível publicar seu desabafo agora. Tente novamente."
      );
    } finally {
      setAnalisandoIA(false);
    }
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main
      style={{
        minHeight:
          "100vh",

        background:
          "linear-gradient(180deg, #fffdf9 0%, #f3faf7 100%)",

        color:
          "#173b38",

        fontFamily:
          "Arial, Helvetica, sans-serif",

        paddingBottom:
          "100px",

        boxSizing:
          "border-box",
      }}
    >

      {/* =================================================
          CABEÇALHO
      ================================================= */}

      <header
        style={{
          position:
            "sticky",

          top:
            0,

          zIndex:
            100,

          height:
            "68px",

          background:
            "rgba(255,255,255,0.96)",

          backdropFilter:
            "blur(10px)",

          borderBottom:
            "1px solid #e8e8e8",

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "space-between",

          padding:
            "0 18px",

          boxSizing:
            "border-box",
        }}
      >

        {/* VOLTAR */}

        <button
          type="button"
          onClick={() =>
            irPara("ambiente")
          }
          style={{
            width:
              "42px",

            height:
              "42px",

            border:
              "none",

            borderRadius:
              "50%",

            background:
              "#f1f5f3",

            color:
              "#36534c",

            cursor:
              "pointer",

            fontSize:
              "23px",

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",
          }}
        >
          ←
        </button>


        {/* LOGO */}

        <div
          style={{
            display:
              "flex",

            alignItems:
              "center",

            gap:
              "8px",
          }}
        >

          <img
            src="/logo.png"
            alt="Logo Pulsan"
            style={{
              width:
                "40px",

              height:
                "40px",

              objectFit:
                "contain",
            }}
          />

          <strong
            style={{
              fontSize:
                "18px",

              letterSpacing:
                "4px",

              color:
                "#173b38",
            }}
          >
            PULSAN
          </strong>

        </div>


        {/* SEGURANÇA */}

        <div
          style={{
            width:
              "42px",

            height:
              "42px",

            borderRadius:
              "50%",

            background:
              "#eef8f5",

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            fontSize:
              "18px",
          }}
        >
          🔒
        </div>

      </header>


      {/* =================================================
          CONTEÚDO
      ================================================= */}

      <section
        style={{
          width:
            "100%",

          maxWidth:
            "700px",

          margin:
            "0 auto",

          padding:
            "30px 18px",

          boxSizing:
            "border-box",
        }}
      >

        {/* =================================================
            INTRODUÇÃO
        ================================================= */}

        <div
          style={{
            textAlign:
              "center",

            marginBottom:
              "24px",
          }}
        >

          <div
            style={{
              width:
                "62px",

              height:
                "62px",

              borderRadius:
                "50%",

              margin:
                "0 auto 13px",

              background:
                "#e9f6f1",

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              fontSize:
                "29px",
            }}
          >
            💬
          </div>


          <span
            style={{
              display:
                "inline-block",

              color:
                "#20adb0",

              fontSize:
                "10px",

              fontWeight:
                "800",

              letterSpacing:
                "2px",

              marginBottom:
                "8px",
            }}
          >
            ESPAÇO SEGURO
          </span>


          <h1
            style={{
              margin:
                0,

              fontSize:
                "32px",

              lineHeight:
                "1.15",

              fontWeight:
                "800",

              color:
                "#173b38",
            }}
          >
            Quer desabafar?
          </h1>


          <p
            style={{
              maxWidth:
                "540px",

              margin:
                "12px auto 0",

              color:
                "#777",

              fontSize:
                "14px",

              lineHeight:
                "1.6",
            }}
          >
            Coloque para fora o que
            está sentindo. Você pode
            falar sem medo e sem
            precisar se identificar.
          </p>

        </div>


        {/* =================================================
            AVISO DE ANONIMATO
        ================================================= */}

        <div
          style={{
            display:
              "flex",

            alignItems:
              "center",

            gap:
              "12px",

            padding:
              "15px",

            marginBottom:
              "20px",

            background:
              "#eef8f5",

            border:
              "1px solid #d9eee8",

            borderRadius:
              "17px",

            boxSizing:
              "border-box",
          }}
        >

          <div
            style={{
              width:
                "40px",

              height:
                "40px",

              flexShrink:
                0,

              borderRadius:
                "50%",

              background:
                "#ffffff",

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              fontSize:
                "18px",
            }}
          >
            🔒
          </div>


          <div>

            <strong
              style={{
                display:
                  "block",

                fontSize:
                  "13px",

                color:
                  "#31574f",
              }}
            >
              Seu desabafo é anônimo
            </strong>


            <p
              style={{
                margin:
                  "4px 0 0",

                color:
                  "#7d8985",

                fontSize:
                  "11px",

                lineHeight:
                  "1.4",
              }}
            >
              Seu nome, foto e outras
              informações pessoais não
              serão exibidos na publicação.
            </p>

          </div>

        </div>


        {/* =================================================
            FORMULÁRIO
        ================================================= */}

        <form
          onSubmit={
            publicar
          }
          style={{
            background:
              "#ffffff",

            border:
              "1px solid #e5e7e6",

            borderRadius:
              "22px",

            padding:
              "20px",

            boxShadow:
              "0 8px 30px rgba(0,0,0,0.05)",

            boxSizing:
              "border-box",
          }}
        >

          {/* CABEÇALHO DO FORMULÁRIO */}

          <div
            style={{
              display:
                "flex",

              alignItems:
                "flex-start",

              justifyContent:
                "space-between",

              gap:
                "15px",

              marginBottom:
                "14px",
            }}
          >

            <div>

              <label
                htmlFor="desabafo"
                style={{
                  display:
                    "block",

                  fontSize:
                    "17px",

                  fontWeight:
                    "800",

                  color:
                    "#304640",

                  marginBottom:
                    "5px",
                }}
              >
                O que você está sentindo?
              </label>


              <span
                style={{
                  display:
                    "block",

                  color:
                    "#999",

                  fontSize:
                    "11px",
                }}
              >
                Você pode escrever livremente.
              </span>

            </div>


            <span
              style={{
                flexShrink:
                  0,

                padding:
                  "6px 9px",

                borderRadius:
                  "9px",

                background:
                  "#f1f7f5",

                color:
                  "#52766c",

                fontSize:
                  "9px",

                fontWeight:
                  "800",

                letterSpacing:
                  "0.5px",
              }}
            >
              ANÔNIMO
            </span>

          </div>


          {/* =================================================
              TEXTAREA
          ================================================= */}

          <textarea
            id="desabafo"
            value={
              texto
            }
            onChange={(e) =>
              setTexto(
                e.target.value
              )
            }
            placeholder="Escreva aqui o que está acontecendo, como você está se sentindo ou simplesmente coloque para fora aquilo que está guardado..."
            maxLength={
              limite
            }
            rows={
              10
            }
            style={{
              width:
                "100%",

              minHeight:
                "230px",

              resize:
                "vertical",

              boxSizing:
                "border-box",

              border:
                "1px solid #dfe5e2",

              borderRadius:
                "16px",

              background:
                "#fbfcfb",

              padding:
                "16px",

              outline:
                "none",

              fontFamily:
                "Georgia, 'Times New Roman', serif",

              fontSize:
                "17px",

              lineHeight:
                "1.6",

              color:
                "#344540",
            }}
          />


          {/* =================================================
              INFORMAÇÕES
          ================================================= */}

          <div
            style={{
              display:
                "flex",

              justifyContent:
                "space-between",

              alignItems:
                "center",

              marginTop:
                "9px",

              marginBottom:
                "15px",

              fontSize:
                "10px",

              color:
                "#999",
            }}
          >

            <span>
              🔒 Identidade protegida
            </span>


            <span
              style={{
                fontWeight:
                  "700",

                color:
                  texto.length >=
                  limite
                    ? "#d06a6a"
                    : "#8b9994",
              }}
            >
              {texto.length}/{limite}
            </span>

          </div>


          {/* =================================================
              BOTÃO PUBLICAR
          ================================================= */}

          <button
            type="submit"
            style={{
              width:
                "100%",

              border:
                "none",

              borderRadius:
                "14px",

              padding:
                "14px",

              background:
                texto.trim()
                  ? "linear-gradient(135deg, #20adb0, #168f92)"
                  : "#cddbd8",

              color:
                "#ffffff",

              fontSize:
                "14px",

              fontWeight:
                "800",

              cursor:
                texto.trim() &&
                !analisandoIA
                  ? "pointer"
                  : "default",

              boxShadow:
                texto.trim()
                  ? "0 7px 18px rgba(32,173,176,0.22)"
                  : "none",

              transition:
                "0.2s ease",
            }}
          >
            {analisandoIA
              ? "🤖 Verificando com segurança..."
              : "💚 Publicar anonimamente"}
          </button>

        </form>


        {/* =================================================
            FRASE DE ACOLHIMENTO
        ================================================= */}

        <div
          style={{
            display:
              "flex",

            alignItems:
              "center",

            gap:
              "13px",

            marginTop:
              "20px",

            padding:
              "16px",

            background:
              "rgba(255,255,255,0.68)",

            border:
              "1px solid #e9e9e9",

            borderRadius:
              "18px",

            boxSizing:
              "border-box",
          }}
        >

          <div
            style={{
              width:
                "43px",

              height:
                "43px",

              flexShrink:
                0,

              borderRadius:
                "50%",

              background:
                "#fff1eb",

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              fontSize:
                "21px",
            }}
          >
            🫶
          </div>


          <div>

            <strong
              style={{
                display:
                  "block",

                fontSize:
                  "13px",

                color:
                  "#43534e",

                marginBottom:
                  "4px",
              }}
            >
              Você não precisa passar
              por tudo sozinho.
            </strong>


            <p
              style={{
                margin:
                  0,

                color:
                  "#888",

                fontSize:
                  "11px",

                lineHeight:
                  "1.5",
              }}
            >
              Às vezes, falar sobre o
              que sentimos é o primeiro
              passo para buscar apoio.
            </p>

          </div>

        </div>


        {/* =================================================
            VOLTAR
        ================================================= */}

        <button
          type="button"
          onClick={() =>
            irPara("ambiente")
          }
          style={{
            display:
              "block",

            margin:
              "20px auto 0",

            border:
              "none",

            background:
              "transparent",

            color:
              "#168f92",

            fontSize:
              "12px",

            fontWeight:
              "700",

            cursor:
              "pointer",

            padding:
              "10px 15px",
          }}
        >
          ← Voltar para o ambiente
        </button>

      </section>

    </main>
  );
}

export default Desabafo;