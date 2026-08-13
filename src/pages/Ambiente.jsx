import React, { useState } from "react";

function Ambiente({ irPara }) {
  // =====================================================
  // ESTADOS
  // =====================================================

  const [publicacoes, setPublicacoes] = useState([
    {
      id: 1,
      texto:
        "e se o único jeito de não se sentir mal, for parar de sentir qualquer coisa pra sempre? ",
      data: "Hoje",
      comentarios: [
        {
          id: 1,
          texto:
            "Você não precisa passar por tudo isso sozinho. 💚",
        },
        {
          id: 2,
          texto:
            "Espero que as coisas fiquem melhores para você.",
        },
      ],
      apoios: 98,
    },

    {
      id: 2,
      texto:
        "Estou passando por uma fase complicada e tenho medo de decepcionar as pessoas que gostam de mim.",
      data: "Hoje",
      comentarios: [
        {
          id: 1,
          texto:
            "Você também precisa se permitir descansar.",
        },
      ],
      apoios: 64,
    },

    {
      id: 3,
      texto:
        "Às vezes eu só queria ter alguém para conversar sem precisar fingir que está tudo bem.",
      data: "Ontem",
      comentarios: [
        {
          id: 1,
          texto:
            "Aqui você pode falar sem medo de ser julgado. 💚",
        },
      ],
      apoios: 73,
    },
  ]);

  const [apoiosDados, setApoiosDados] = useState({});

  const [comentariosAbertos, setComentariosAbertos] =
    useState({});

  const [novoComentario, setNovoComentario] =
    useState({});

  const [solicitacoes, setSolicitacoes] =
    useState({});


  // =====================================================
  // APOIAR
  // =====================================================

  function apoiar(publicacaoId) {
    const jaApoiou =
      apoiosDados[publicacaoId];

    setApoiosDados((anteriores) => ({
      ...anteriores,
      [publicacaoId]: !jaApoiou,
    }));

    setPublicacoes((anteriores) =>
      anteriores.map((publicacao) => {
        if (
          publicacao.id !==
          publicacaoId
        ) {
          return publicacao;
        }

        return {
          ...publicacao,
          apoios: jaApoiou
            ? Math.max(
                0,
                publicacao.apoios - 1
              )
            : publicacao.apoios + 1,
        };
      })
    );
  }


  // =====================================================
  // ABRIR / FECHAR COMENTÁRIOS
  // =====================================================

  function abrirComentarios(publicacaoId) {
    setComentariosAbertos(
      (anteriores) => ({
        ...anteriores,
        [publicacaoId]:
          !anteriores[publicacaoId],
      })
    );
  }


  // =====================================================
  // ALTERAR COMENTÁRIO
  // =====================================================

  function alterarComentario(
    publicacaoId,
    valor
  ) {
    setNovoComentario(
      (anteriores) => ({
        ...anteriores,
        [publicacaoId]: valor,
      })
    );
  }


  // =====================================================
  // ADICIONAR COMENTÁRIO
  // =====================================================

  function adicionarComentario(
    publicacaoId
  ) {
    const texto =
      novoComentario[
        publicacaoId
      ];

    if (!texto || !texto.trim()) {
      return;
    }

    const comentario = {
      id: Date.now(),
      texto: texto.trim(),
    };

    setPublicacoes((anteriores) =>
      anteriores.map((publicacao) => {
        if (
          publicacao.id !==
          publicacaoId
        ) {
          return publicacao;
        }

        return {
          ...publicacao,

          comentarios: [
            ...publicacao.comentarios,
            comentario,
          ],
        };
      })
    );

    setNovoComentario(
      (anteriores) => ({
        ...anteriores,
        [publicacaoId]: "",
      })
    );
  }


  // =====================================================
  // SOLICITAR CHAT
  // =====================================================

  function solicitarChat(publicacao) {
    const nome =
      localStorage.getItem(
        "pulsanNome"
      ) || "Usuário";

    const foto =
      localStorage.getItem(
        "pulsanFoto"
      ) || "";

    const confirmar =
      window.confirm(
        "Ao solicitar o chat, a pessoa que publicou este desabafo verá seu nome e sua foto antes de decidir se aceita a conversa.\n\n" +
          "A pessoa que publicou continuará anônima para você.\n\n" +
          "Deseja enviar a solicitação?"
      );

    if (!confirmar) {
      return;
    }

    const solicitacao = {
      id: Date.now(),

      publicacaoId:
        publicacao.id,

      nomeSolicitante:
        nome,

      fotoSolicitante:
        foto,

      textoDesabafo:
        publicacao.texto,

      status:
        "pendente",

      data:
        new Date().toLocaleString(
          "pt-BR"
        ),
    };

    setSolicitacoes(
      (anteriores) => ({
        ...anteriores,

        [publicacao.id]:
          solicitacao,
      })
    );


    // =================================================
    // SALVAR NO LOCALSTORAGE
    // =================================================

    const salvas =
      JSON.parse(
        localStorage.getItem(
          "pulsanSolicitacoesChat"
        ) || "[]"
      );

    const jaExiste =
      salvas.some(
        (item) =>
          item.publicacaoId ===
            publicacao.id &&
          item.nomeSolicitante ===
            nome &&
          item.status ===
            "pendente"
      );

    if (!jaExiste) {
      salvas.unshift(
        solicitacao
      );

      localStorage.setItem(
        "pulsanSolicitacoesChat",
        JSON.stringify(salvas)
      );
    }

    alert(
      "Solicitação enviada! 💚\n\n" +
        "A pessoa poderá ver suas informações e decidir se aceita a conversa."
    );
  }


  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main
      style={{
        minHeight: "100vh",

        background:
          "linear-gradient(180deg, #f6f3f1 0%, #edf5f1 50%, #f8f3f5 100%)",

        color: "#173b38",

        fontFamily:
          "Arial, Helvetica, sans-serif",

        paddingBottom:
          "150px",

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

          top: 0,

          zIndex: 100,

          background:
            "rgba(250,247,244,0.95)",

          backdropFilter:
            "blur(12px)",

          borderBottom:
            "1px solid rgba(220,215,211,0.7)",

          padding:
            "12px 18px",

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "space-between",

          boxSizing:
            "border-box",
        }}
      >

        {/* LOGO */}

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

                color:
                  "#173b38",
              }}
            >
              PULSAN
            </strong>

            <span
              style={{
                fontSize:
                  "10px",

                color:
                  "#888",
              }}
            >
              um espaço para acolher
            </span>

          </div>

        </div>


        {/* PERFIL */}

        <button
          type="button"
          onClick={() =>
            irPara("perfil")
          }
          style={{
            width:
              "42px",

            height:
              "42px",

            borderRadius:
              "50%",

            border:
              "1px solid #ddd6d2",

            background:
              "#fff",

            cursor:
              "pointer",

            fontSize:
              "18px",

            boxShadow:
              "0 3px 10px rgba(0,0,0,0.05)",
          }}
        >
          👤
        </button>

      </header>


      {/* =================================================
          CONTEÚDO
      ================================================= */}

      <section
        style={{
          width:
            "100%",

          maxWidth:
            "680px",

          margin:
            "0 auto",

          padding:
            "24px 15px",

          boxSizing:
            "border-box",
        }}
      >

        {/* =================================================
            TÍTULO
        ================================================= */}

        <div
          style={{
            marginBottom:
              "20px",

            padding:
              "0 5px",
          }}
        >

          <h1
            style={{
              margin:
                "0 0 6px",

              fontSize:
                "29px",

              lineHeight:
                "1.15",

              fontWeight:
                "800",

              color:
                "#173b38",
            }}
          >
            Desabafos 💚
          </h1>

          <p
            style={{
              margin:
                0,

              color:
                "#818b88",

              fontSize:
                "14px",

              lineHeight:
                "1.5",
            }}
          >
            Um espaço para falar,
            ouvir e acolher.
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
              "10px",

            background:
              "rgba(255,255,255,0.68)",

            border:
              "1px solid rgba(220,230,226,0.8)",

            borderRadius:
              "16px",

            padding:
              "12px 14px",

            marginBottom:
              "22px",

            boxShadow:
              "0 5px 20px rgba(0,0,0,0.03)",
          }}
        >

          <span
            style={{
              fontSize:
                "20px",
            }}
          >
            🔒
          </span>

          <div>

            <strong
              style={{
                display:
                  "block",

                fontSize:
                  "12px",

                color:
                  "#365650",
              }}
            >
              Seu desabafo é anônimo
            </strong>

            <span
              style={{
                fontSize:
                  "11px",

                color:
                  "#8a9390",
              }}
            >
              Compartilhe o que sente
              sem precisar se identificar.
            </span>

          </div>

        </div>


        {/* =================================================
            FEED
        ================================================= */}

        <section
          style={{
            display:
              "flex",

            flexDirection:
              "column",

            gap:
              "24px",
          }}
        >

          {publicacoes.map(
            (
              publicacao,
              index
            ) => (

              <article
                key={
                  publicacao.id
                }
                style={{
                  width:
                    "100%",

                  borderRadius:
                    "28px",

                  padding:
                    "20px",

                  boxSizing:
                    "border-box",

                  background:
                    index % 3 ===
                    0
                      ? "linear-gradient(145deg, #fffaf7, #f3e9e4)"
                      : index % 3 ===
                        1
                      ? "linear-gradient(145deg, #f8fcfa, #e6f2ed)"
                      : "linear-gradient(145deg, #fcf8fd, #eee8f3)",

                  border:
                    "1px solid rgba(220,212,208,0.75)",

                  boxShadow:
                    "0 12px 35px rgba(58,48,43,0.09)",

                  overflow:
                    "hidden",
                }}
              >

                {/* =======================================
                    USUÁRIO ANÔNIMO
                ======================================= */}

                <div
                  style={{
                    display:
                      "flex",

                    alignItems:
                      "center",

                    justifyContent:
                      "space-between",

                    marginBottom:
                      "14px",
                  }}
                >

                  <div
                    style={{
                      display:
                        "flex",

                      alignItems:
                        "center",

                      gap:
                        "10px",
                    }}
                  >

                    <div
                      style={{
                        width:
                          "44px",

                        height:
                          "44px",

                        borderRadius:
                          "50%",

                        background:
                          "rgba(255,255,255,0.75)",

                        display:
                          "flex",

                        alignItems:
                          "center",

                        justifyContent:
                          "center",

                        fontSize:
                          "20px",

                        border:
                          "1px solid rgba(220,220,220,0.6)",
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
                            "14px",

                          color:
                            "#314541",
                        }}
                      >
                        Anônimo
                      </strong>

                      <span
                        style={{
                          display:
                            "block",

                          marginTop:
                            "3px",

                          fontSize:
                            "10px",

                          color:
                            "#969e9b",
                        }}
                      >
                        identidade protegida
                      </span>

                    </div>

                  </div>

                  <span
                    style={{
                      color:
                        "#9ca4a1",

                      fontSize:
                        "16px",
                    }}
                  >
                    •••
                  </span>

                </div>


                {/* =======================================
                    TEXTO DO DESABAFO
                ======================================= */}

                <div
                  style={{
                    padding:
                      "15px 5px 20px",
                  }}
                >

                  <p
                    style={{
                      margin:
                        0,

                      fontFamily:
                        "Georgia, 'Times New Roman', serif",

                      fontSize:
                        "clamp(20px, 4vw, 28px)",

                      lineHeight:
                        "1.42",

                      fontWeight:
                        "600",

                      color:
                        "#30403e",

                      letterSpacing:
                        "0.05px",
                    }}
                  >
                    “{publicacao.texto}”
                  </p>

                </div>


                {/* =======================================
                    FRASE
                ======================================= */}

                <div
                  style={{
                    textAlign:
                      "center",

                    marginBottom:
                      "12px",
                  }}
                >

                  <span
                    style={{
                      fontSize:
                        "10px",

                      color:
                        "#8b9793",
                    }}
                  >
                    💚 Você não precisa
                    passar por tudo sozinho.
                  </span>

                </div>


                {/* =======================================
                    CONTADORES
                ======================================= */}

                <div
                  style={{
                    display:
                      "flex",

                    alignItems:
                      "center",

                    gap:
                      "10px",

                    fontSize:
                      "11px",

                    color:
                      "#8b918f",

                    marginBottom:
                      "9px",
                  }}
                >

                  <span>
                    {publicacao.apoios} apoios
                  </span>

                  <span>
                    •
                  </span>

                  <span>
                    {
                      publicacao
                        .comentarios
                        .length
                    }{" "}
                    comentários
                  </span>

                </div>


                {/* =======================================
                    BOTÕES
                ======================================= */}

                <div
                  style={{
                    display:
                      "grid",

                    gridTemplateColumns:
                      "1fr 1fr 1.25fr",

                    gap:
                      "7px",

                    borderTop:
                      "1px solid rgba(220,215,211,0.75)",

                    paddingTop:
                      "11px",
                  }}
                >

                  {/* APOIAR */}

                  <button
                    type="button"
                    onClick={() =>
                      apoiar(
                        publicacao.id
                      )
                    }
                    style={{
                      border:
                        "none",

                      background:
                        "transparent",

                      cursor:
                        "pointer",

                      color:
                        apoiosDados[
                          publicacao.id
                        ]
                          ? "#20adb0"
                          : "#657571",

                      fontSize:
                        "11px",

                      fontWeight:
                        "700",

                      padding:
                        "5px",
                    }}
                  >

                    <div
                      style={{
                        fontSize:
                          "25px",

                        lineHeight:
                          "1",
                      }}
                    >
                      {apoiosDados[
                        publicacao.id
                      ]
                        ? "💚"
                        : "❤️"}
                    </div>

                    <div
                      style={{
                        marginTop:
                          "5px",
                      }}
                    >
                      {apoiosDados[
                        publicacao.id
                      ]
                        ? "Apoiado"
                        : "Apoiar"}
                    </div>

                  </button>


                  {/* COMENTAR */}

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
                        "transparent",

                      cursor:
                        "pointer",

                      color:
                        "#657571",

                      fontSize:
                        "11px",

                      fontWeight:
                        "700",

                      padding:
                        "5px",
                    }}
                  >

                    <div
                      style={{
                        fontSize:
                          "25px",

                        lineHeight:
                          "1",
                      }}
                    >
                      💬
                    </div>

                    <div
                      style={{
                        marginTop:
                          "5px",
                      }}
                    >
                      Comentar
                    </div>

                  </button>


                  {/* SOLICITAR CHAT */}

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
                        "12px",

                      cursor:
                        "pointer",

                      fontSize:
                        "11px",

                      fontWeight:
                        "700",

                      padding:
                        "8px 5px",

                      boxShadow:
                        "0 5px 12px rgba(32,173,176,0.2)",
                    }}
                  >

                    <div
                      style={{
                        fontSize:
                          "18px",
                      }}
                    >
                      🤝
                    </div>

                    Solicitar chat

                  </button>

                </div>


                {/* =======================================
                    COMENTÁRIOS
                ======================================= */}

                {comentariosAbertos[
                  publicacao.id
                ] && (

                  <div
                    style={{
                      marginTop:
                        "17px",

                      paddingTop:
                        "17px",

                      borderTop:
                        "1px solid rgba(220,215,211,0.75)",
                    }}
                  >

                    <h3
                      style={{
                        margin:
                          "0 0 14px",

                        fontSize:
                          "17px",

                        color:
                          "#304a45",
                      }}
                    >
                      💬 Todos os comentários
                    </h3>


                    {publicacao
                      .comentarios
                      .length ===
                      0 ? (

                      <div
                        style={{
                          padding:
                            "15px",

                          textAlign:
                            "center",

                          color:
                            "#888",

                          fontSize:
                            "13px",
                        }}
                      >
                        Ainda não há
                        comentários.
                        <br />
                        Seja a primeira pessoa
                        a deixar uma palavra
                        de apoio. 💚
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

                        {publicacao
                          .comentarios
                          .map(
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
                                    "9px",

                                  padding:
                                    "10px",

                                  background:
                                    "rgba(255,255,255,0.58)",

                                  borderRadius:
                                    "13px",
                                }}
                              >

                                <div
                                  style={{
                                    width:
                                      "35px",

                                    height:
                                      "35px",

                                    flexShrink:
                                      0,

                                    borderRadius:
                                      "50%",

                                    background:
                                      "#e7f2ef",

                                    display:
                                      "flex",

                                    alignItems:
                                      "center",

                                    justifyContent:
                                      "center",
                                  }}
                                >
                                  👤
                                </div>

                                <div>

                                  <strong
                                    style={{
                                      display:
                                        "block",

                                      fontSize:
                                        "11px",

                                      color:
                                        "#3e5651",
                                    }}
                                  >
                                    Anônimo
                                  </strong>

                                  <p
                                    style={{
                                      margin:
                                        "4px 0 0",

                                      fontSize:
                                        "13px",

                                      lineHeight:
                                        "1.45",

                                      color:
                                        "#596460",
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

                      </div>

                    )}


                    {/* CAMPO DE COMENTÁRIO */}

                    <div
                      style={{
                        display:
                          "flex",

                        gap:
                          "7px",

                        marginTop:
                          "14px",
                      }}
                    >

                      <input
                        type="text"
                        value={
                          novoComentario[
                            publicacao.id
                          ] || ""
                        }
                        onChange={(e) =>
                          alterarComentario(
                            publicacao.id,
                            e.target.value
                          )
                        }
                        onKeyDown={(e) => {
                          if (
                            e.key ===
                            "Enter"
                          ) {
                            adicionarComentario(
                              publicacao.id
                            );
                          }
                        }}
                        placeholder="Escreva uma palavra de apoio..."
                        style={{
                          flex:
                            1,

                          minWidth:
                            0,

                          border:
                            "1px solid #dcdedc",

                          borderRadius:
                            "12px",

                          padding:
                            "11px 12px",

                          fontSize:
                            "12px",

                          outline:
                            "none",

                          background:
                            "#ffffff",
                        }}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          adicionarComentario(
                            publicacao.id
                          )
                        }
                        style={{
                          width:
                            "43px",

                          border:
                            "none",

                          borderRadius:
                            "12px",

                          background:
                            "#20adb0",

                          color:
                            "#ffffff",

                          cursor:
                            "pointer",

                          fontSize:
                            "17px",
                        }}
                      >
                        ➤
                      </button>

                    </div>

                    <small
                      style={{
                        display:
                          "block",

                        marginTop:
                          "8px",

                        color:
                          "#999",

                        fontSize:
                          "9px",
                      }}
                    >
                      🔒 Seu comentário também
                      será anônimo.
                    </small>

                  </div>

                )}

              </article>

            )
          )}

        </section>


        {/* =================================================
            PRIVACIDADE
        ================================================= */}

        <div
          style={{
            marginTop:
              "24px",

            padding:
              "16px",

            borderRadius:
              "17px",

            background:
              "rgba(240,250,248,0.78)",

            border:
              "1px solid #dceeea",
          }}
        >

          <strong
            style={{
              fontSize:
                "13px",
            }}
          >
            🔒 Sua privacidade é importante
          </strong>

          <p
            style={{
              margin:
                "7px 0 0",

              color:
                "#777",

              fontSize:
                "11px",

              lineHeight:
                "1.5",
            }}
          >
            Quem publica um desabafo
            permanece anônimo. Ao solicitar
            uma conversa, somente a pessoa
            que receberá a solicitação verá
            seu nome e sua foto antes de
            decidir se aceita.
          </p>

        </div>

      </section>


      {/* =================================================
          BOTÃO FLUTUANTE — DESABAFAR
      ================================================= */}

      <button
        type="button"
        onClick={() =>
          irPara("desabafar")
        }
        aria-label="Desabafar"
        style={{
          position:
            "fixed",

          right:
            "22px",

          bottom:
            "94px",

          width:
            "132px",

          height:
            "132px",

          borderRadius:
            "50%",

          border:
            "none",

          background:
            "linear-gradient(145deg, #7ab968, #4e984e)",

          color:
            "#ffffff",

          cursor:
            "pointer",

          display:
            "flex",

          flexDirection:
            "column",

          alignItems:
            "center",

          justifyContent:
            "center",

          gap:
            "4px",

          boxShadow:
            "0 12px 30px rgba(45,90,48,0.35)",

          zIndex:
            500,

          transition:
            "transform 0.2s ease",
        }}

        onMouseEnter={(e) => {
          e.currentTarget.style.transform =
            "scale(1.05)";
        }}

        onMouseLeave={(e) => {
          e.currentTarget.style.transform =
            "scale(1)";
        }}
      >

        {/* =================================================
            PENA
        ================================================= */}

        <svg
          width="46"
          height="46"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >

          <path
            d="
              M51 8
              C36 9 22 17 15 30
              C10 39 13 48 19 53
              C25 58 34 57 41 49
              C50 39 53 24 51 8Z
            "
            fill="white"
          />

          <path
            d="
              M15 54
              C23 42 32 31 47 17
            "
            stroke="#5A9E59"
            strokeWidth="3"
            strokeLinecap="round"
          />

          <path
            d="
              M25 41
              L17 37
            "
            stroke="#5A9E59"
            strokeWidth="2"
            strokeLinecap="round"
          />

          <path
            d="
              M31 34
              L23 28
            "
            stroke="#5A9E59"
            strokeWidth="2"
            strokeLinecap="round"
          />

          <path
            d="
              M37 27
              L31 20
            "
            stroke="#5A9E59"
            strokeWidth="2"
            strokeLinecap="round"
          />

        </svg>


        {/* TEXTO */}

        <span
          style={{
            fontSize:
              "16px",

            fontWeight:
              "700",

            letterSpacing:
              "0.1px",
          }}
        >
          Desabafar
        </span>

      </button>

    </main>
  );
}

export default Ambiente;