import React, { useState } from "react";

function Desabafar({ irPara }) {
  const [texto, setTexto] = useState("");
  const [analisando, setAnalisando] = useState(false);

  // =====================================
  // AMBIENTE
  // =====================================
  // escola = análise contextual + filtro ofensivo
  // empresa = somente filtro ofensivo

  const ambiente =
    localStorage.getItem("pulsanAmbiente") || "escola";


  // =====================================
  // FILTRO BÁSICO DE PALAVRAS OFENSIVAS
  // =====================================
  // Este filtro é uma primeira barreira.
  // Depois teremos também a análise de
  // moderação no servidor.

  const palavrasOfensivas = [
    "idiota",
    "imbecil",
    "burro",
    "burra",
    "otário",
    "otaria",
    "otário",
    "retardado",
    "retardada",
  ];


  function possuiPalavraOfensiva(conteudo) {
    const textoNormalizado =
      conteudo
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    return palavrasOfensivas.some(
      (palavra) =>
        textoNormalizado.includes(
          palavra
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
        )
    );
  }


  // =====================================
  // PUBLICAR DESABAFO
  // =====================================

  async function publicarDesabafo(e) {
    e.preventDefault();

    const conteudo = texto.trim();

    if (!conteudo) {
      alert("Escreva algo antes de publicar.");
      return;
    }


    // ===================================
    // FILTRO DE PALAVRAS OFENSIVAS
    // ===================================

    if (possuiPalavraOfensiva(conteudo)) {
      alert(
        "Seu desabafo contém linguagem inadequada.\n\n" +
        "Revise o texto antes de publicar. 💚"
      );

      return;
    }


    // ===================================
    // COMEÇA ANÁLISE
    // ===================================

    setAnalisando(true);


    try {

      let classificacao = "normal";
      let alerta = false;


      // =================================
      // ESCOLA
      // =================================
      // Na escola fazemos análise
      // contextual pela IA.

      if (ambiente === "escola") {

        try {

          const resposta =
            await fetch(
              "/api/analisar-desabafo",
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body: JSON.stringify({
                  texto: conteudo,
                  ambiente: "escola",
                }),
              }
            );


          if (resposta.ok) {

            const resultado =
              await resposta.json();


            if (
              resultado.classificacao ===
              "grave"
            ) {

              classificacao =
                "grave";

              alerta = true;

            } else if (
              resultado.classificacao ===
              "intermediario"
            ) {

              classificacao =
                "intermediario";

              alerta = true;

            } else {

              classificacao =
                "normal";

              alerta = false;
            }
          }

        } catch (erro) {

          console.error(
            "Erro na análise da IA:",
            erro
          );

          /*
           * Se a IA estiver indisponível,
           * não vamos inventar uma classificação.
           *
           * O desabafo segue como normal
           * até a integração do servidor
           * estar funcionando.
           */

          classificacao = "normal";
          alerta = false;
        }
      }


      // =================================
      // EMPRESA
      // =================================
      // Empresa NÃO possui análise
      // contextual nem alertas.

      if (ambiente === "empresa") {

        classificacao = "normal";
        alerta = false;
      }


      // =================================
      // BUSCAR PUBLICAÇÕES
      // =================================

      const publicacoes =
        JSON.parse(
          localStorage.getItem(
            "pulsanPublicacoes"
          )
        ) || [];


      // =================================
      // NOVA PUBLICAÇÃO
      // =================================

      const novaPublicacao = {

        id: Date.now(),

        texto: conteudo,

        autor: "Anônimo",

        hora: "Agora",

        ambiente: ambiente,

        classificacao:
          classificacao,

        alerta:
          alerta,

        apoios: 0,

        apoiado: false,

        comentarios: [],
      };


      // =================================
      // SALVAR
      // =================================

      localStorage.setItem(
        "pulsanPublicacoes",

        JSON.stringify([
          novaPublicacao,
          ...publicacoes,
        ])
      );


      // =================================
      // ALERTA LOCAL
      // =================================
      // Apenas escola.
      //
      // Normal = não faz nada.
      // Intermediário = alerta.
      // Grave = alerta prioritário.

      if (
        ambiente === "escola" &&
        classificacao ===
          "intermediario"
      ) {

        localStorage.setItem(
          "pulsanNovoAlerta",
          "true"
        );

        localStorage.setItem(
          "pulsanTipoAlerta",
          "intermediario"
        );

        localStorage.setItem(
          "pulsanAlertaPublicacao",
          JSON.stringify(
            novaPublicacao
          )
        );
      }


      if (
        ambiente === "escola" &&
        classificacao ===
          "grave"
      ) {

        localStorage.setItem(
          "pulsanNovoAlerta",
          "true"
        );

        localStorage.setItem(
          "pulsanTipoAlerta",
          "grave"
        );

        localStorage.setItem(
          "pulsanAlertaPublicacao",
          JSON.stringify(
            novaPublicacao
          )
        );
      }


      // =================================
      // LIMPAR
      // =================================

      setTexto("");


      // =================================
      // MENSAGEM PARA O USUÁRIO
      // =================================

      if (
        ambiente === "escola" &&
        classificacao ===
          "grave"
      ) {

        alert(
          "Seu desabafo foi publicado. 💚\n\n" +
          "Nossa equipe poderá acompanhar a situação."
        );

      } else if (
        ambiente === "escola" &&
        classificacao ===
          "intermediario"
      ) {

        alert(
          "Seu desabafo foi publicado. 💚\n\n" +
          "Ele poderá receber atenção adicional."
        );

      } else {

        alert(
          "Seu desabafo foi publicado anonimamente. 💚"
        );
      }


      // =================================
      // VOLTAR
      // =================================

      irPara("ambiente");

    } finally {

      setAnalisando(false);
    }
  }


  return (

    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#fffdf9",
        fontFamily:
          "Arial, Helvetica, sans-serif",
        paddingBottom: "100px",
        boxSizing: "border-box",
      }}
    >

      {/* =====================================
          CABEÇALHO
      ===================================== */}

      <header
        style={{
          width: "100%",
          background: "#f7dcd0",
          padding: "18px 35px",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          gap: "15px",
        }}
      >

        <button
          type="button"
          onClick={() =>
            irPara("ambiente")
          }
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            border: "none",
            background: "#ffffff",
            fontSize: "22px",
            cursor: "pointer",
          }}
        >
          ←
        </button>


        <div>

          <strong
            style={{
              fontSize: "22px",
              color: "#173b38",
            }}
          >
            PULSAN
          </strong>


          <div
            style={{
              fontSize: "14px",
              color: "#777",
              marginTop: "3px",
            }}
          >
            Um espaço seguro para falar
          </div>

        </div>

      </header>


      {/* =====================================
          CONTEÚDO
      ===================================== */}

      <main
        style={{
          width: "100%",
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "45px 30px",
          boxSizing: "border-box",
        }}
      >

        <h1
          style={{
            fontSize: "34px",
            color: "#172c35",
            margin:
              "0 0 10px",
          }}
        >
          O que está sendo compartilhado
        </h1>


        <p
          style={{
            fontSize: "17px",
            color: "#777",
            marginBottom: "30px",
          }}
        >
          Conte o que está acontecendo.
          Você não precisa se identificar.
        </p>


        {/* =====================================
            IDENTIDADE
        ===================================== */}

        <div
          style={{
            display:
              "inline-flex",
            alignItems:
              "center",
            gap: "8px",
            background:
              "#eef4f3",
            padding:
              "10px 18px",
            borderRadius:
              "12px",
            color:
              "#173b38",
            fontWeight:
              "700",
            marginBottom:
              "15px",
          }}
        >
          👤 ANÔNIMO
        </div>


        {/* =====================================
            FORMULÁRIO
        ===================================== */}

        <form
          onSubmit={publicarDesabafo}
        >

          <div
            style={{
              background:
                "#ffffff",
              border:
                "1px solid #e5e5e5",
              borderRadius:
                "18px",
              overflow:
                "hidden",
              boxShadow:
                "0 5px 20px rgba(0,0,0,0.04)",
            }}
          >

            <textarea
              value={texto}
              onChange={(e) =>
                setTexto(
                  e.target.value
                )
              }
              placeholder="Fale sobre o que está acontecendo. Você pode desabafar, pedir apoio ou contar como está se sentindo..."
              maxLength={1000}
              disabled={analisando}
              style={{
                width: "100%",
                minHeight: "300px",
                border: "none",
                outline: "none",
                resize: "vertical",
                padding: "25px",
                boxSizing:
                  "border-box",
                fontSize: "17px",
                fontFamily:
                  "Arial, Helvetica, sans-serif",
                color: "#333",
                opacity:
                  analisando
                    ? 0.6
                    : 1,
              }}
            />


            <div
              style={{
                padding:
                  "12px 20px",
                textAlign:
                  "right",
                color: "#888",
                fontSize:
                  "13px",
                borderTop:
                  "1px solid #eeeeee",
              }}
            >
              {texto.length}/1000
            </div>

          </div>


          {/* =====================================
              AVISO
          ===================================== */}

          <div
            style={{
              marginTop: "18px",
              color: "#777",
              fontSize: "14px",
            }}
          >
            🔒 Sua identidade permanece
            anônima.
          </div>


          {/* =====================================
              INFORMAÇÃO DO AMBIENTE
          ===================================== */}

          {ambiente ===
            "escola" ? (

            <div
              style={{
                marginTop:
                  "12px",
                padding:
                  "12px 15px",
                background:
                  "#f0faf8",
                border:
                  "1px solid #dceeea",
                borderRadius:
                  "10px",
                color:
                  "#168f92",
                fontSize:
                  "13px",
              }}
            >
              🏫 Este ambiente utiliza
              moderação de linguagem e
              análise contextual para
              ajudar a identificar situações
              que podem precisar de atenção.
            </div>

          ) : (

            <div
              style={{
                marginTop:
                  "12px",
                padding:
                  "12px 15px",
                background:
                  "#f5f5f5",
                border:
                  "1px solid #e5e5e5",
                borderRadius:
                  "10px",
                color:
                  "#666",
                fontSize:
                  "13px",
              }}
            >
              🏢 Este ambiente utiliza
              moderação de linguagem para
              manter as conversas respeitosas.
            </div>

          )}


          {/* =====================================
              PUBLICAR
          ===================================== */}

          <button
            type="submit"
            disabled={analisando}
            style={{
              marginTop:
                "18px",
              border:
                "none",
              background:
                analisando
                  ? "#9ad7d8"
                  : "#20adb0",
              color:
                "#ffffff",
              padding:
                "15px 28px",
              borderRadius:
                "12px",
              fontSize:
                "16px",
              fontWeight:
                "700",
              cursor:
                analisando
                  ? "wait"
                  : "pointer",
            }}
          >

            {analisando
              ? "🤖 Analisando..."
              : "💬 Publicar anonimamente"}

          </button>

        </form>

      </main>


      {/* =====================================
          BARRA INFERIOR
      ===================================== */}

      <nav
        style={{
          position:
            "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "82px",
          background:
            "#ffffff",
          borderTop:
            "1px solid #e5e5e5",
          display:
            "flex",
          justifyContent:
            "space-around",
          alignItems:
            "center",
          zIndex: 1000,
          boxShadow:
            "0 -3px 15px rgba(0,0,0,0.04)",
        }}
      >

        {/* CONVERSAS */}

        <button
          type="button"
          onClick={() =>
            irPara(
              "solicitacoes"
            )
          }
          style={{
            border:
              "none",
            background:
              "transparent",
            cursor:
              "pointer",
            display:
              "flex",
            flexDirection:
              "column",
            alignItems:
              "center",
            gap: "5px",
            color:
              "#777",
            fontSize:
              "13px",
            fontWeight:
              "600",
          }}
        >

          <span
            style={{
              fontSize:
                "25px",
            }}
          >
            💬
          </span>

          <span>
            Conversas
          </span>

        </button>


        {/* AJUDAR */}

        <button
          type="button"
          onClick={() =>
            irPara("ajudar")
          }
          style={{
            border:
              "none",
            background:
              "transparent",
            cursor:
              "pointer",
            display:
              "flex",
            flexDirection:
              "column",
            alignItems:
              "center",
            gap: "5px",
            color:
              "#20adb0",
            fontSize:
              "13px",
            fontWeight:
              "600",
          }}
        >

          <span
            style={{
              fontSize:
                "25px",
            }}
          >
            💚
          </span>

          <span>
            Ajudar
          </span>

        </button>


        {/* PERFIL */}

        <button
          type="button"
          onClick={() =>
            irPara("perfil")
          }
          style={{
            border:
              "none",
            background:
              "transparent",
            cursor:
              "pointer",
            display:
              "flex",
            flexDirection:
              "column",
            alignItems:
              "center",
            gap:
              "5px",
            color:
              "#777",
            fontSize:
              "13px",
            fontWeight:
              "600",
          }}
        >

          <span
            style={{
              fontSize:
                "25px",
            }}
          >
            👤
          </span>

          <span>
            Perfil
          </span>

        </button>

      </nav>

    </div>
  );
}

export default Desabafar;