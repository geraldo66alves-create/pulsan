import React, { useState } from "react";

function Empresa({ irPara }) {
  // =====================================================
  // ESTADOS
  // =====================================================

  const [texto, setTexto] = useState("");

  const [publicacoes, setPublicacoes] =
    useState(() => {
      const salvas =
        JSON.parse(
          localStorage.getItem(
            "pulsanPublicacoes"
          ) || "[]"
        );

      return salvas.filter(
        (item) =>
          item.ambiente ===
            "empresa" ||
          item.tipoAmbiente ===
            "empresa"
      );
    });

  const [apoios, setApoios] =
    useState({});

  const [comentariosAbertos, setComentariosAbertos] =
    useState({});

  const [novoComentario, setNovoComentario] =
    useState({});

  const [solicitacoes, setSolicitacoes] =
    useState({});


  // =====================================================
  // DADOS DO USUÁRIO
  // =====================================================

  const nomeUsuario =
    localStorage.getItem(
      "pulsanNome"
    ) || "Usuário";

  const fotoUsuario =
    localStorage.getItem(
      "pulsanFoto"
    ) || "";

  const tipoUsuario =
    localStorage.getItem(
      "pulsanTipo"
    ) || "";

  const seloUsuario =
    localStorage.getItem(
      "pulsanSelo"
    ) || "";


  // =====================================================
  // PUBLICAR DESABAFO EMPRESA
  // =====================================================

  function publicar(e) {
    e.preventDefault();

    const textoLimpo =
      texto.trim();

    if (!textoLimpo) {
      alert(
        "Escreva algo antes de publicar."
      );
      return;
    }


    // =================================================
    // PEGAR TODAS AS PUBLICAÇÕES
    // =================================================

    const todasPublicacoes =
      JSON.parse(
        localStorage.getItem(
          "pulsanPublicacoes"
        ) || "[]"
      );


    // =================================================
    // NOVA PUBLICAÇÃO
    //
    // NÃO SALVAMOS:
    // nome
    // foto
    // e-mail
    //
    // A publicação continua anônima.
    // =================================================

    const novaPublicacao = {
      id: Date.now(),

      texto:
        textoLimpo,

      autor:
        "Anônimo",

      anonimato:
        true,

      ambiente:
        "empresa",

      tipoAmbiente:
        "empresa",

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


    // =================================================
    // SALVAR
    // =================================================

    const atualizadas = [
      novaPublicacao,
      ...todasPublicacoes,
    ];


    localStorage.setItem(
      "pulsanPublicacoes",
      JSON.stringify(
        atualizadas
      )
    );


    // Atualiza somente as publicações
    // do ambiente empresa.

    setPublicacoes(
      atualizadas.filter(
        (item) =>
          item.ambiente ===
            "empresa" ||
          item.tipoAmbiente ===
            "empresa"
      )
    );


    setTexto("");


    alert(
      "Sua publicação foi enviada anonimamente. 💚"
    );


    // Volta para o ambiente.

    irPara("ambiente");
  }


  // =====================================================
  // APOIAR
  // =====================================================

  function apoiar(publicacao) {
    const jaApoiou =
      apoios[
        publicacao.id
      ] || false;


    const todasPublicacoes =
      JSON.parse(
        localStorage.getItem(
          "pulsanPublicacoes"
        ) || "[]"
      );


    const atualizadas =
      todasPublicacoes.map(
        (item) => {

          if (
            item.id !==
            publicacao.id
          ) {
            return item;
          }


          const quantidade =
            Number(
              item.apoios || 0
            );


          return {
            ...item,

            apoios:
              jaApoiou
                ? Math.max(
                    0,
                    quantidade - 1
                  )
                : quantidade + 1,

            apoiado:
              !jaApoiou,
          };
        }
      );


    localStorage.setItem(
      "pulsanPublicacoes",
      JSON.stringify(
        atualizadas
      )
    );


    setPublicacoes(
      atualizadas.filter(
        (item) =>
          item.ambiente ===
            "empresa" ||
          item.tipoAmbiente ===
            "empresa"
      )
    );


    setApoios(
      (anteriores) => ({
        ...anteriores,

        [publicacao.id]:
          !jaApoiou,
      })
    );
  }


  // =====================================================
  // ABRIR COMENTÁRIOS
  // =====================================================

  function abrirComentarios(
    id
  ) {
    setComentariosAbertos(
      (anteriores) => ({
        ...anteriores,

        [id]:
          !anteriores[id],
      })
    );
  }


  // =====================================================
  // ALTERAR COMENTÁRIO
  // =====================================================

  function alterarComentario(
    id,
    valor
  ) {
    setNovoComentario(
      (anteriores) => ({
        ...anteriores,

        [id]:
          valor,
      })
    );
  }


  // =====================================================
  // ADICIONAR COMENTÁRIO
  // =====================================================

  function adicionarComentario(
    e,
    publicacao
  ) {
    e.preventDefault();

    const textoComentario =
      novoComentario[
        publicacao.id
      ];


    if (
      !textoComentario ||
      !textoComentario.trim()
    ) {
      return;
    }


    const todasPublicacoes =
      JSON.parse(
        localStorage.getItem(
          "pulsanPublicacoes"
        ) || "[]"
      );


    const novo = {
      id: Date.now(),

      texto:
        textoComentario.trim(),

      nome:
        "Anônimo",

      anonimato:
        true,

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


    const atualizadas =
      todasPublicacoes.map(
        (item) => {

          if (
            item.id !==
            publicacao.id
          ) {
            return item;
          }


          return {
            ...item,

            comentarios: [
              ...(item.comentarios ||
                []),

              novo,
            ],
          };
        }
      );


    localStorage.setItem(
      "pulsanPublicacoes",
      JSON.stringify(
        atualizadas
      )
    );


    setPublicacoes(
      atualizadas.filter(
        (item) =>
          item.ambiente ===
            "empresa" ||
          item.tipoAmbiente ===
            "empresa"
      )
    );


    setNovoComentario(
      (anteriores) => ({
        ...anteriores,

        [publicacao.id]:
          "",
      })
    );
  }


  // =====================================================
  // SOLICITAR CHAT
  // =====================================================

  function solicitarChat(
    publicacao
  ) {
    const confirmar =
      window.confirm(
        "Você está oferecendo ajuda para esta pessoa.\n\n" +
          "Antes de aceitar a conversa, a pessoa verá seu nome, sua foto e seus selos, caso tenha.\n\n" +
          "A pessoa que publicou este desabafo continuará anônima para você.\n\n" +
          "Deseja enviar a solicitação?"
      );


    if (!confirmar) {
      return;
    }


    // =================================================
    // IDENTIDADE DO AJUDANTE
    // =================================================

    const solicitacao = {
      id:
        Date.now(),

      publicacaoId:
        publicacao.id,

      ambiente:
        "empresa",

      nomeSolicitante:
        nomeUsuario,

      fotoSolicitante:
        fotoUsuario,

      tipoSolicitante:
        tipoUsuario,

      seloSolicitante:
        seloUsuario,

      textoDesabafo:
        publicacao.texto,

      status:
        "pendente",

      data:
        new Date().toLocaleString(
          "pt-BR"
        ),
    };


    // =================================================
    // SALVAR SOLICITAÇÕES
    // =================================================

    const salvas =
      JSON.parse(
        localStorage.getItem(
          "pulsanSolicitacoesChat"
        ) || "[]"
      );


    const atualizadas = [
      solicitacao,
      ...salvas,
    ];


    localStorage.setItem(
      "pulsanSolicitacoesChat",
      JSON.stringify(
        atualizadas
      )
    );


    // =================================================
    // SALVAR DADOS DA CONVERSA
    // =================================================

    localStorage.setItem(
      "pulsanAjudanteNome",
      nomeUsuario
    );

    localStorage.setItem(
      "pulsanAjudanteFoto",
      fotoUsuario
    );

    localStorage.setItem(
      "pulsanAjudanteTipo",
      tipoUsuario
    );

    localStorage.setItem(
      "pulsanAjudanteSelo",
      seloUsuario
    );


    localStorage.setItem(
      "pulsanPublicacaoSelecionada",
      JSON.stringify(
        publicacao
      )
    );


    localStorage.setItem(
      "pulsanNovaSolicitacao",
      "true"
    );


    localStorage.setItem(
      "pulsanTipoSolicitacao",
      "chat-publicacao"
    );


    setSolicitacoes(
      (anteriores) => ({
        ...anteriores,

        [publicacao.id]:
          solicitacao,
      })
    );


    alert(
      "Solicitação enviada! 💚\n\n" +
        "A pessoa verá seu nome, sua foto e seus selos antes de decidir se aceita."
    );


    irPara(
      "solicitacoes"
    );
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
          "linear-gradient(180deg, #fffdf9 0%, #f1f8f5 100%)",

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

          background:
            "rgba(255,255,255,0.96)",

          backdropFilter:
            "blur(10px)",

          borderBottom:
            "1px solid #e5e5e5",

          padding:
            "12px 18px",

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "space-between",
        }}
      >

        <div
          style={{
            display:
              "flex",

            alignItems:
              "center",

            gap:
              "9px",
          }}
        >

          <img
            src="/logo.png"
            alt="Logo Pulsan"
            style={{
              width:
                "42px",

              height:
                "42px",

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
                  "18px",

                letterSpacing:
                  "4px",
              }}
            >
              PULSAN
            </strong>


            <span
              style={{
                display:
                  "block",

                color:
                  "#999",

                fontSize:
                  "10px",
              }}
            >
              Ambiente Empresa
            </span>

          </div>

        </div>


        {/* PERFIL */}

        <button
          type="button"
          onClick={() =>
            irPara(
              "perfil"
            )
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
              "#eef5f2",

            cursor:
              "pointer",

            fontSize:
              "19px",

            overflow:
              "hidden",

            padding:
              0,
          }}
        >

          {fotoUsuario ? (

            <img
              src={
                fotoUsuario
              }
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
          INTRODUÇÃO
      ================================================= */}

      <section
        style={{
          maxWidth:
            "700px",

          margin:
            "0 auto",

          padding:
            "30px 18px 20px",

          textAlign:
            "center",
        }}
      >

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
          ESPAÇO CORPORATIVO
        </span>


        <h1
          style={{
            margin:
              0,

            fontSize:
              "31px",

            fontWeight:
              "800",

            color:
              "#173b38",
          }}
        >
          Ambiente Empresa
        </h1>


        <p
          style={{
            maxWidth:
              "560px",

            margin:
              "10px auto 0",

            color:
              "#777",

            fontSize:
              "14px",

            lineHeight:
              "1.6",
          }}
        >
          Um espaço seguro para
          colaboradores falarem,
          serem ouvidos e encontrarem
          apoio.
        </p>

      </section>


      {/* =================================================
          SEGURANÇA
      ================================================= */}

      <section
        style={{
          maxWidth:
            "700px",

          margin:
            "0 auto 20px",

          padding:
            "0 18px",

          boxSizing:
            "border-box",
        }}
      >

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

            background:
              "#eef8f5",

            border:
              "1px solid #d9eee8",

            borderRadius:
              "17px",
          }}
        >

          <div
            style={{
              width:
                "42px",

              height:
                "42px",

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
                "19px",
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
              }}
            >
              Privacidade e acolhimento
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
                  "1.5",
              }}
            >
              As publicações podem ser
              feitas anonimamente.
              Sua identidade permanece
              protegida.
            </p>

          </div>

        </div>

      </section>


      {/* =================================================
          AÇÕES
      ================================================= */}

      <section
        style={{
          maxWidth:
            "700px",

          margin:
            "0 auto",

          padding:
            "0 18px",

          display:
            "grid",

          gridTemplateColumns:
            "repeat(2, 1fr)",

          gap:
            "12px",

          boxSizing:
            "border-box",
        }}
      >

        {/* DESABAFAR */}

        <button
          type="button"
          onClick={() => {
            document
              .getElementById(
                "empresa-publicar"
              )
              ?.scrollIntoView({
                behavior:
                  "smooth",
              });
          }}
          style={{
            border:
              "1px solid #d9eae5",

            background:
              "#ffffff",

            borderRadius:
              "18px",

            padding:
              "18px",

            textAlign:
              "left",

            cursor:
              "pointer",

            boxShadow:
              "0 5px 18px rgba(0,0,0,0.04)",
          }}
        >

          <div
            style={{
              fontSize:
                "27px",

              marginBottom:
                "8px",
            }}
          >
            💬
          </div>


          <strong
            style={{
              display:
                "block",

              fontSize:
                "15px",

              color:
                "#173b38",
            }}
          >
            Desabafar
          </strong>


          <p
            style={{
              margin:
                "5px 0 0",

              color:
                "#888",

              fontSize:
                "11px",

              lineHeight:
                "1.4",
            }}
          >
            Compartilhe como você
            está se sentindo.
          </p>

        </button>


        {/* AJUDAR */}

        <button
          type="button"
          onClick={() =>
            irPara(
              "ajudar"
            )
          }
          style={{
            border:
              "1px solid #d9eae5",

            background:
              "#ffffff",

            borderRadius:
              "18px",

            padding:
              "18px",

            textAlign:
              "left",

            cursor:
              "pointer",

            boxShadow:
              "0 5px 18px rgba(0,0,0,0.04)",
          }}
        >

          <div
            style={{
              fontSize:
                "27px",

              marginBottom:
                "8px",
            }}
          >
            💚
          </div>


          <strong
            style={{
              display:
                "block",

              fontSize:
                "15px",

              color:
                "#173b38",
            }}
          >
            Ajudar alguém
          </strong>


          <p
            style={{
              margin:
                "5px 0 0",

              color:
                "#888",

              fontSize:
                "11px",

              lineHeight:
                "1.4",
            }}
          >
            Ofereça apoio para
            alguém que precisa.
          </p>

        </button>

      </section>


      {/* =================================================
          PUBLICAR
      ================================================= */}

      <section
        id="empresa-publicar"
        style={{
          maxWidth:
            "700px",

          margin:
            "25px auto 0",

          padding:
            "0 18px",

          boxSizing:
            "border-box",
        }}
      >

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
          }}
        >

          <div
            style={{
              display:
                "flex",

              alignItems:
                "flex-start",

              justifyContent:
                "space-between",

              gap:
                "10px",

              marginBottom:
                "13px",
            }}
          >

            <div>

              <span
                style={{
                  color:
                    "#20adb0",

                  fontSize:
                    "9px",

                  fontWeight:
                    "800",

                  letterSpacing:
                    "1.5px",
                }}
              >
                COMUNIDADE
              </span>


              <h2
                style={{
                  margin:
                    "5px 0 0",

                  fontSize:
                    "20px",
                }}
              >
                O que você quer compartilhar?
              </h2>


              <p
                style={{
                  margin:
                    "5px 0 0",

                  color:
                    "#888",

                  fontSize:
                    "11px",
                }}
              >
                Conte o que está
                acontecendo.
              </p>

            </div>


            <span
              style={{
                padding:
                  "6px 8px",

                borderRadius:
                  "8px",

                background:
                  "#eef7f4",

                color:
                  "#4e7168",

                fontSize:
                  "9px",

                fontWeight:
                  "800",
              }}
            >
              🔒 ANÔNIMO
            </span>

          </div>


          <textarea
            value={
              texto
            }
            onChange={(e) =>
              setTexto(
                e.target.value
              )
            }
            placeholder="Escreva sobre o que está sentindo, uma dificuldade no trabalho ou algo que gostaria de compartilhar..."
            maxLength={
              1000
            }
            rows={
              8
            }
            style={{
              width:
                "100%",

              minHeight:
                "190px",

              resize:
                "vertical",

              boxSizing:
                "border-box",

              border:
                "1px solid #dfe5e2",

              borderRadius:
                "15px",

              background:
                "#fbfcfb",

              padding:
                "15px",

              outline:
                "none",

              fontFamily:
                "Georgia, 'Times New Roman', serif",

              fontSize:
                "16px",

              lineHeight:
                "1.6",

              color:
                "#344540",
            }}
          />


          <div
            style={{
              display:
                "flex",

              justifyContent:
                "space-between",

              marginTop:
                "8px",

              marginBottom:
                "13px",

              color:
                "#999",

              fontSize:
                "10px",
            }}
          >

            <span>
              🔒 Sua identidade permanece protegida.
            </span>


            <span>
              {texto.length}/1000
            </span>

          </div>


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
                  ? "#20adb0"
                  : "#cddbd8",

              color:
                "#ffffff",

              cursor:
                texto.trim()
                  ? "pointer"
                  : "default",

              fontSize:
                "13px",

              fontWeight:
                "800",
            }}
          >
            💚 Publicar anonimamente
          </button>

        </form>

      </section>


      {/* =================================================
          INDICADORES
      ================================================= */}

      <section
        style={{
          maxWidth:
            "700px",

          margin:
            "22px auto",

          padding:
            "0 18px",

          display:
            "grid",

          gridTemplateColumns:
            "repeat(3, 1fr)",

          gap:
            "9px",

          boxSizing:
            "border-box",
        }}
      >

        <div
          style={{
            background:
              "#ffffff",

            borderRadius:
              "15px",

            padding:
              "13px 8px",

            textAlign:
              "center",

            border:
              "1px solid #e7e7e7",
          }}
        >
          <div>
            💚
          </div>

          <strong
            style={{
              display:
                "block",

              marginTop:
                "5px",

              fontSize:
                "11px",
            }}
          >
            Apoio
          </strong>

          <span
            style={{
              display:
                "block",

              color:
                "#999",

              fontSize:
                "9px",

              marginTop:
                "3px",
            }}
          >
            Ouvir e acolher
          </span>
        </div>


        <div
          style={{
            background:
              "#ffffff",

            borderRadius:
              "15px",

            padding:
              "13px 8px",

            textAlign:
              "center",

            border:
              "1px solid #e7e7e7",
          }}
        >
          <div>
            🔒
          </div>

          <strong
            style={{
              display:
                "block",

              marginTop:
                "5px",

              fontSize:
                "11px",
            }}
          >
            Anonimato
          </strong>

          <span
            style={{
              display:
                "block",

              color:
                "#999",

              fontSize:
                "9px",

              marginTop:
                "3px",
            }}
          >
            Identidade protegida
          </span>
        </div>


        <div
          style={{
            background:
              "#ffffff",

            borderRadius:
              "15px",

            padding:
              "13px 8px",

            textAlign:
              "center",

            border:
              "1px solid #e7e7e7",
          }}
        >
          <div>
            🤝
          </div>

          <strong
            style={{
              display:
                "block",

              marginTop:
                "5px",

              fontSize:
                "11px",
            }}
          >
            Comunidade
          </strong>

          <span
            style={{
              display:
                "block",

              color:
                "#999",

              fontSize:
                "9px",

              marginTop:
                "3px",
            }}
          >
            Pessoas ajudando
          </span>
        </div>

      </section>


      {/* =================================================
          PUBLICAÇÕES DA EMPRESA
      ================================================= */}

      <section
        style={{
          maxWidth:
            "700px",

          margin:
            "25px auto",

          padding:
            "0 18px",

          boxSizing:
            "border-box",
        }}
      >

        <h2
          style={{
            margin:
              "0 0 15px",

            fontSize:
              "20px",
          }}
        >
          💭 Desabafos da comunidade
        </h2>


        {publicacoes.length ===
        0 ? (

          <div
            style={{
              background:
                "#ffffff",

              border:
                "1px solid #e5e5e5",

              borderRadius:
                "20px",

              padding:
                "35px 20px",

              textAlign:
                "center",
            }}
          >

            <div
              style={{
                fontSize:
                  "40px",
              }}
            >
              🌱
            </div>


            <h3
              style={{
                margin:
                  "10px 0 5px",

                fontSize:
                  "16px",
              }}
            >
              Ainda não há publicações
            </h3>


            <p
              style={{
                margin:
                  0,

                color:
                  "#888",

                fontSize:
                  "12px",

                lineHeight:
                  "1.5",
              }}
            >
              Seja uma das primeiras
              pessoas a compartilhar
              algo com a comunidade.
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
                "18px",
            }}
          >

            {publicacoes.map(
              (publicacao) => {

                const comentarios =
                  publicacao.comentarios ||
                  [];


                const jaApoiou =
                  apoios[
                    publicacao.id
                  ] ||
                  false;


                return (

                  <article
                    key={
                      publicacao.id
                    }
                    style={{
                      background:
                        "#ffffff",

                      borderRadius:
                        "21px",

                      padding:
                        "19px",

                      border:
                        "1px solid #e5e5e5",

                      boxShadow:
                        "0 7px 22px rgba(0,0,0,0.04)",
                    }}
                  >

                    {/* USUÁRIO */}

                    <div
                      style={{
                        display:
                          "flex",

                        alignItems:
                          "center",

                        gap:
                          "10px",

                        marginBottom:
                          "13px",
                      }}
                    >

                      <div
                        style={{
                          width:
                            "42px",

                          height:
                            "42px",

                          borderRadius:
                            "50%",

                          background:
                            "#edf6f3",

                          display:
                            "flex",

                          alignItems:
                            "center",

                          justifyContent:
                            "center",
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
                          }}
                        >
                          Anônimo
                        </strong>


                        <span
                          style={{
                            color:
                              "#999",

                            fontSize:
                              "10px",
                          }}
                        >
                          {publicacao.data ||
                            "Agora"}
                        </span>

                      </div>

                    </div>


                    {/* TEXTO */}

                    <p
                      style={{
                        margin:
                          0,

                        fontFamily:
                          "Georgia, 'Times New Roman', serif",

                        fontSize:
                          "19px",

                        lineHeight:
                          "1.55",

                        color:
                          "#364641",

                        whiteSpace:
                          "pre-wrap",
                      }}
                    >
                      “{publicacao.texto}”
                    </p>


                    {/* AÇÕES */}

                    <div
                      style={{
                        display:
                          "grid",

                        gridTemplateColumns:
                          "1fr 1fr 1.2fr",

                        gap:
                          "7px",

                        marginTop:
                          "17px",

                        paddingTop:
                          "12px",

                        borderTop:
                          "1px solid #eeeeee",
                      }}
                    >

                      <button
                        type="button"
                        onClick={() =>
                          apoiar(
                            publicacao
                          )
                        }
                        style={{
                          border:
                            "none",

                          background:
                            jaApoiou
                              ? "#e7f8f3"
                              : "#f7f7f7",

                          color:
                            jaApoiou
                              ? "#168f92"
                              : "#666",

                          borderRadius:
                            "10px",

                          padding:
                            "10px 4px",

                          cursor:
                            "pointer",

                          fontWeight:
                            "700",

                          fontSize:
                            "11px",
                        }}
                      >
                        {jaApoiou
                          ? "💚 Apoiado"
                          : "❤️ Apoiar"}

                        <small
                          style={{
                            display:
                              "block",

                            marginTop:
                              "3px",

                            fontWeight:
                              "400",
                          }}
                        >
                          {publicacao.apoios ||
                            0}
                        </small>
                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          abrirComentarios(
                            publicacao.id
                          )
                        }
                        style={{
                          border:
                            "none",

                          background:
                            "#f7f7f7",

                          color:
                            "#666",

                          borderRadius:
                            "10px",

                          padding:
                            "10px 4px",

                          cursor:
                            "pointer",

                          fontWeight:
                            "700",

                          fontSize:
                            "11px",
                        }}
                      >
                        💬 Comentar

                        <small
                          style={{
                            display:
                              "block",

                            marginTop:
                              "3px",

                            fontWeight:
                              "400",
                          }}
                        >
                          {comentarios.length}
                        </small>
                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          solicitarChat(
                            publicacao
                          )
                        }
                        style={{
                          border:
                            "none",

                          background:
                            "#20adb0",

                          color:
                            "#ffffff",

                          borderRadius:
                            "10px",

                          padding:
                            "10px 4px",

                          cursor:
                            "pointer",

                          fontWeight:
                            "700",

                          fontSize:
                            "10px",
                        }}
                      >
                        🤝 Solicitar chat
                      </button>

                    </div>


                    {/* COMENTÁRIOS */}

                    {comentariosAbertos[
                      publicacao.id
                    ] && (

                      <section
                        style={{
                          marginTop:
                            "16px",

                          paddingTop:
                            "15px",

                          borderTop:
                            "1px solid #eeeeee",
                        }}
                      >

                        <h3
                          style={{
                            margin:
                              "0 0 12px",

                            fontSize:
                              "16px",
                          }}
                        >
                          💬 Comentários
                        </h3>


                        {comentarios.map(
                          (
                            comentario
                          ) => (

                            <div
                              key={
                                comentario.id
                              }
                              style={{
                                display:
                                  "flex",

                                gap:
                                  "8px",

                                padding:
                                  "9px",

                                marginBottom:
                                  "8px",

                                background:
                                  "#f7faf9",

                                borderRadius:
                                  "11px",
                              }}
                            >

                              <span>
                                👤
                              </span>

                              <div>

                                <strong
                                  style={{
                                    display:
                                      "block",

                                    fontSize:
                                      "11px",
                                  }}
                                >
                                  Anônimo
                                </strong>

                                <p
                                  style={{
                                    margin:
                                      "3px 0 0",

                                    fontSize:
                                      "12px",

                                    color:
                                      "#555",

                                    lineHeight:
                                      "1.45",
                                  }}
                                >
                                  {
                                    comentario.texto
                                  }
                                </p>

                              </div>

                            </div>

                          )
                        )}


                        {/* COMENTAR */}

                        <form
                          onSubmit={(e) =>
                            adicionarComentario(
                              e,
                              publicacao
                            )
                          }
                          style={{
                            display:
                              "flex",

                            gap:
                              "7px",

                            marginTop:
                              "10px",
                          }}
                        >

                          <input
                            type="text"
                            value={
                              novoComentario[
                                publicacao.id
                              ] ||
                              ""
                            }
                            onChange={(e) =>
                              alterarComentario(
                                publicacao.id,
                                e.target
                                  .value
                              )
                            }
                            placeholder="Escreva uma palavra de apoio..."
                            maxLength={
                              300
                            }
                            style={{
                              flex:
                                1,

                              minWidth:
                                0,

                              border:
                                "1px solid #ddd",

                              borderRadius:
                                "10px",

                              padding:
                                "10px",

                              outline:
                                "none",

                              fontSize:
                                "12px",
                            }}
                          />


                          <button
                            type="submit"
                            style={{
                              border:
                                "none",

                              background:
                                "#20adb0",

                              color:
                                "#ffffff",

                              borderRadius:
                                "10px",

                              padding:
                                "0 13px",

                              cursor:
                                "pointer",
                            }}
                          >
                            ➤
                          </button>

                        </form>

                      </section>

                    )}

                  </article>

                );
              }
            )}

          </div>

        )}

      </section>


      {/* =================================================
          IMPORTANTE:
          O MENU INFERIOR NÃO FICA AQUI.
          
          Ele é controlado pelo App.jsx.
          
          Fica:
          🏠 Início
          💬 Conversas
          💚 Ajudar
          👤 Perfil
      ================================================= */}

    </main>
  );
}

export default Empresa;