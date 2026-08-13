import React, { useState } from "react";

function Desabafo({ irPara }) {
  const [texto, setTexto] = useState("");

  const limite = 1000;


  // =====================================================
  // PUBLICAR DESABAFO
  // =====================================================

  function publicar(e) {
    e.preventDefault();

    const textoLimpo = texto.trim();

    if (!textoLimpo) {
      alert(
        "Escreva algo antes de publicar."
      );
      return;
    }


    // ===================================================
    // PEGAR PUBLICAÇÕES EXISTENTES
    // ===================================================

    const publicacoesSalvas =
      JSON.parse(
        localStorage.getItem(
          "pulsanPublicacoes"
        ) || "[]"
      );


    // ===================================================
    // CRIAR NOVO DESABAFO
    //
    // IMPORTANTE:
    // Não salvamos nome, foto ou e-mail.
    // A publicação é somente anônima.
    // ===================================================

    const novaPublicacao = {
      id: Date.now(),

      texto:
        textoLimpo,

      autor:
        "Anônimo",

      anonimato:
        true,

      apoios:
        0,

      apoiado:
        false,

      comentarios:
        [],

      data:
        new Date().toLocaleDateString(
          "pt-BR"
        ),

      hora:
        new Date().toLocaleTimeString(
          "pt-BR",
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        ),
    };


    // ===================================================
    // COLOCAR A PUBLICAÇÃO MAIS NOVA NO INÍCIO
    // ===================================================

    const novasPublicacoes = [
      novaPublicacao,
      ...publicacoesSalvas,
    ];


    // ===================================================
    // SALVAR
    // ===================================================

    localStorage.setItem(
      "pulsanPublicacoes",
      JSON.stringify(
        novasPublicacoes
      )
    );


    // ===================================================
    // LIMPAR CAMPO
    // ===================================================

    setTexto("");


    // ===================================================
    // AVISO
    // ===================================================

    alert(
      "Seu desabafo foi publicado anonimamente. 💚"
    );


    // ===================================================
    // VOLTAR PARA O INÍCIO
    // ===================================================

    irPara("ambiente");
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
                texto.trim()
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
            💚 Publicar anonimamente
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