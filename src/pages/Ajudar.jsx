import React, { useState } from "react";

function Ajudar({ irPara }) {

  // ==========================================
  // BUSCAR DESABAFOS
  // ==========================================

  const publicacoesSalvas =
    JSON.parse(
      localStorage.getItem("pulsanPublicacoes") || "[]"
    );

  const [publicacoes, setPublicacoes] =
    useState(publicacoesSalvas);


  // ==========================================
  // DADOS DO USUÁRIO QUE ESTÁ AJUDANDO
  // ==========================================

  const nomeUsuario =
    localStorage.getItem("pulsanNome") ||
    "Você";

  const fotoUsuario =
    localStorage.getItem("pulsanFoto") ||
    "";


  // ==========================================
  // COMENTÁRIO ABERTO
  // ==========================================

  const [comentandoId, setComentandoId] =
    useState(null);

  const [comentario, setComentario] =
    useState("");


  // ==========================================
  // APOIAR
  // ==========================================

  function apoiar(publicacaoId) {

    const publicacoesAtualizadas =
      publicacoes.map((publicacao) => {

        if (publicacao.id !== publicacaoId) {
          return publicacao;
        }

        const apoiado =
          publicacao.apoiado || false;

        const apoios =
          Number(publicacao.apoios || 0);

        return {
          ...publicacao,
          apoiado: !apoiado,
          apoios: apoiado
            ? Math.max(0, apoios - 1)
            : apoios + 1,
        };
      });


    setPublicacoes(publicacoesAtualizadas);


    localStorage.setItem(
      "pulsanPublicacoes",
      JSON.stringify(publicacoesAtualizadas)
    );
  }


  // ==========================================
  // ABRIR COMENTÁRIOS
  // ==========================================

  function abrirComentarios(publicacaoId) {

    setComentario("");

    setComentandoId(
      comentandoId === publicacaoId
        ? null
        : publicacaoId
    );
  }


  // ==========================================
  // ENVIAR COMENTÁRIO
  // ==========================================

  function enviarComentario(
    e,
    publicacaoId
  ) {

    e.preventDefault();

    const texto =
      comentario.trim();

    if (!texto) {
      return;
    }


    const publicacoesAtualizadas =
      publicacoes.map((publicacao) => {

        if (
          publicacao.id !==
          publicacaoId
        ) {
          return publicacao;
        }


        const comentarios =
          publicacao.comentarios || [];


        return {
          ...publicacao,

          comentarios: [
            ...comentarios,

            {
              id: Date.now(),
              texto: texto,
              nome: "Anônimo",
              data: "Agora",
            },
          ],
        };
      });


    setPublicacoes(
      publicacoesAtualizadas
    );


    localStorage.setItem(
      "pulsanPublicacoes",
      JSON.stringify(
        publicacoesAtualizadas
      )
    );


    setComentario("");
  }


  // ==========================================
  // SOLICITAR CHAT PRIVADO
  // ==========================================

  function solicitarChat(publicacao) {

    const confirmar =
      window.confirm(
        "Deseja solicitar uma conversa privada com esta pessoa?\n\n" +
        "Sua identidade será apresentada caso a pessoa aceite a conversa."
      );


    if (!confirmar) {
      return;
    }


    // ========================================
    // DADOS DO AJUDANTE
    // ========================================

    localStorage.setItem(
      "pulsanPapelConversa",
      "ajudante"
    );


    localStorage.setItem(
      "pulsanAjudanteNome",
      nomeUsuario
    );


    localStorage.setItem(
      "pulsanAjudanteFoto",
      fotoUsuario
    );


    // ========================================
    // PUBLICAÇÃO SELECIONADA
    // ========================================

    localStorage.setItem(
      "pulsanPublicacaoSelecionada",
      JSON.stringify(publicacao)
    );


    // ========================================
    // NOVA SOLICITAÇÃO
    // ========================================

    localStorage.setItem(
      "pulsanNovaSolicitacao",
      "true"
    );


    // ========================================
    // TIPO DA SOLICITAÇÃO
    // ========================================

    localStorage.setItem(
      "pulsanTipoSolicitacao",
      "chat-publicacao"
    );


    alert(
      "Solicitação enviada! 💚\n\n" +
      "Agora aguarde a pessoa aceitar a conversa."
    );


    irPara("solicitacoes");
  }


  // ==========================================
  // VOLTAR PARA AMBIENTE
  // ==========================================

  function voltarAmbiente() {
    irPara("ambiente");
  }


  // ==========================================
  // TELA
  // ==========================================

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#fffdf9",
        fontFamily:
          "Arial, Helvetica, sans-serif",
        color: "#173b38",
        paddingBottom: "100px",
      }}
    >


      {/* ==========================================
          CABEÇALHO
      ========================================== */}

      <header
        style={{
          background: "#f7d9cf",
          padding: "18px 35px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom:
            "1px solid #ead8d2",
        }}
      >

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >

          <img
            src="/logo.png"
            alt="Logo Pulsan"
            style={{
              width: "48px",
              height: "48px",
              objectFit: "contain",
            }}
          />


          <div>

            <strong
              style={{
                display: "block",
                fontSize: "21px",
                fontWeight: "800",
                letterSpacing: "4px",
              }}
            >
              PULSAN
            </strong>

            <span
              style={{
                color: "#777",
                fontSize: "13px",
              }}
            >
              Histórias da comunidade
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
            width: "44px",
            height: "44px",
            border: "none",
            borderRadius: "50%",
            background: "#ffffff",
            cursor: "pointer",
            fontSize: "20px",
            overflow: "hidden",
            padding: 0,
          }}
        >

          {fotoUsuario ? (

            <img
              src={fotoUsuario}
              alt="Perfil"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />

          ) : (

            "👤"

          )}

        </button>

      </header>


      {/* ==========================================
          TÍTULO
      ========================================== */}

      <section
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding:
            "40px 25px 20px",
        }}
      >

        <h1
          style={{
            margin: 0,
            fontSize: "34px",
          }}
        >
          Histórias da comunidade 💚
        </h1>


        <p
          style={{
            color: "#777",
            fontSize: "16px",
            lineHeight: "1.5",
            marginTop: "10px",
          }}
        >
          Leia, apoie, converse e esteja
          presente para quem precisa.
        </p>

      </section>


      {/* ==========================================
          AVISO
      ========================================== */}

      <section
        style={{
          maxWidth: "900px",
          margin:
            "0 auto 25px",
          padding:
            "20px 25px",
          background: "#f0faf8",
          border:
            "1px solid #dceeea",
          borderRadius: "18px",
          boxSizing: "border-box",
        }}
      >

        <strong
          style={{
            display: "block",
            marginBottom: "7px",
          }}
        >
          🔒 Respeito e privacidade
        </strong>


        <p
          style={{
            margin: 0,
            color: "#777",
            fontSize: "14px",
            lineHeight: "1.5",
          }}
        >
          Os desabafos são publicados
          anonimamente. Você pode apoiar,
          comentar ou solicitar uma conversa
          privada.
        </p>

      </section>


      {/* ==========================================
          HISTÓRIAS
      ========================================== */}

      <main
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "0 25px",
        }}
      >

        <h2
          style={{
            fontSize: "23px",
            marginBottom: "18px",
          }}
        >
          💭 Desabafos recentes
        </h2>


        {/* ========================================
            SEM PUBLICAÇÕES
        ======================================== */}

        {publicacoes.length === 0 ? (

          <section
            style={{
              background: "#ffffff",
              border:
                "1px solid #e5e5e5",
              borderRadius: "20px",
              padding:
                "45px 25px",
              textAlign: "center",
              boxShadow:
                "0 5px 18px rgba(0,0,0,0.04)",
            }}
          >

            <div
              style={{
                fontSize: "45px",
                marginBottom: "15px",
              }}
            >
              💚
            </div>


            <strong
              style={{
                display: "block",
                fontSize: "19px",
              }}
            >
              Ainda não há desabafos
            </strong>


            <p
              style={{
                color: "#777",
                lineHeight: "1.5",
                maxWidth: "500px",
                margin:
                  "10px auto 0",
              }}
            >
              Quando alguém compartilhar
              o que está sentindo, você
              poderá apoiar e oferecer
              acolhimento.
            </p>

          </section>

        ) : (


          /* ======================================
             PUBLICAÇÕES
          ====================================== */

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
            }}
          >

            {publicacoes.map(
              (publicacao) => {

                const comentarios =
                  publicacao.comentarios ||
                  [];


                return (

                  <article
                    key={publicacao.id}
                    style={{
                      background:
                        "#ffffff",
                      border:
                        "1px solid #e5e5e5",
                      borderRadius:
                        "20px",
                      padding: "24px",
                      boxShadow:
                        "0 5px 18px rgba(0,0,0,0.04)",
                    }}
                  >


                    {/* =================================
                        IDENTIDADE
                    ================================= */}

                    <div
                      style={{
                        display: "flex",
                        alignItems:
                          "center",
                        gap: "12px",
                        marginBottom:
                          "15px",
                      }}
                    >

                      <div
                        style={{
                          width: "45px",
                          height: "45px",
                          borderRadius:
                            "50%",
                          background:
                            "#eef5f3",
                          display: "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          fontSize: "21px",
                        }}
                      >
                        👤
                      </div>


                      <div>

                        <strong>
                          Anônimo
                        </strong>

                        <span
                          style={{
                            display:
                              "block",
                            fontSize:
                              "12px",
                            color:
                              "#999",
                            marginTop:
                              "3px",
                          }}
                        >
                          {publicacao.hora ||
                            "Agora"}
                        </span>

                      </div>

                    </div>


                    {/* =================================
                        TEXTO DO DESABAFO
                    ================================= */}

                    <p
                      style={{
                        margin: 0,
                        fontSize:
                          "16px",
                        color: "#444",
                        lineHeight:
                          "1.6",
                        whiteSpace:
                          "pre-wrap",
                      }}
                    >
                      {publicacao.texto}
                    </p>


                    {/* =================================
                        AÇÕES
                    ================================= */}

                    <div
                      style={{
                        marginTop:
                          "20px",
                        paddingTop:
                          "15px",
                        borderTop:
                          "1px solid #eeeeee",
                        display:
                          "grid",
                        gridTemplateColumns:
                          "1fr 1fr 1fr",
                        gap: "8px",
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
                          border: "none",
                          background:
                            publicacao.apoiado
                              ? "#e6f8f3"
                              : "#f7f7f7",
                          color:
                            publicacao.apoiado
                              ? "#168f92"
                              : "#666",
                          borderRadius:
                            "10px",
                          padding:
                            "11px 5px",
                          cursor:
                            "pointer",
                          fontWeight:
                            "700",
                        }}
                      >

                        {publicacao.apoiado
                          ? "💚 Apoiado"
                          : "♡ Apoiar"}

                        <span
                          style={{
                            display:
                              "block",
                            fontSize:
                              "11px",
                            marginTop:
                              "3px",
                            fontWeight:
                              "400",
                          }}
                        >
                          {publicacao.apoios ||
                            0}{" "}
                          apoio(s)
                        </span>

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
                          border: "none",
                          background:
                            "#f7f7f7",
                          color:
                            "#666",
                          borderRadius:
                            "10px",
                          padding:
                            "11px 5px",
                          cursor:
                            "pointer",
                          fontWeight:
                            "700",
                        }}
                      >

                        💬 Comentar

                        <span
                          style={{
                            display:
                              "block",
                            fontSize:
                              "11px",
                            marginTop:
                              "3px",
                            fontWeight:
                              "400",
                          }}
                        >
                          {comentarios.length}{" "}
                          comentário(s)
                        </span>

                      </button>


                      {/* CHAT */}

                      <button
                        type="button"
                        onClick={() =>
                          solicitarChat(
                            publicacao
                          )
                        }
                        style={{
                          border: "none",
                          background:
                            "#20adb0",
                          color:
                            "#ffffff",
                          borderRadius:
                            "10px",
                          padding:
                            "11px 5px",
                          cursor:
                            "pointer",
                          fontWeight:
                            "700",
                        }}
                      >

                        💌 Chat privado

                        <span
                          style={{
                            display:
                              "block",
                            fontSize:
                              "11px",
                            marginTop:
                              "3px",
                            fontWeight:
                              "400",
                            opacity: 0.9,
                          }}
                        >
                          Solicitar conversa
                        </span>

                      </button>

                    </div>


                    {/* =================================
                        COMENTÁRIOS
                    ================================= */}

                    {comentandoId ===
                      publicacao.id && (

                      <section
                        style={{
                          marginTop:
                            "18px",
                          paddingTop:
                            "18px",
                          borderTop:
                            "1px solid #eeeeee",
                        }}
                      >

                        <h3
                          style={{
                            fontSize:
                              "17px",
                            margin:
                              "0 0 15px",
                          }}
                        >
                          💬 Comentários
                        </h3>


                        {/* COMENTÁRIOS EXISTENTES */}

                        {comentarios.length ===
                        0 ? (

                          <p
                            style={{
                              color:
                                "#999",
                              fontSize:
                                "14px",
                              marginBottom:
                                "15px",
                            }}
                          >
                            Ainda não há
                            comentários.
                            Seja a primeira
                            pessoa a
                            acolher. 💚
                          </p>

                        ) : (

                          <div
                            style={{
                              display:
                                "flex",
                              flexDirection:
                                "column",
                              gap: "10px",
                              marginBottom:
                                "15px",
                            }}
                          >

                            {comentarios.map(
                              (item) => (

                                <div
                                  key={
                                    item.id
                                  }
                                  style={{
                                    background:
                                      "#f7faf9",
                                    borderRadius:
                                      "12px",
                                    padding:
                                      "12px",
                                  }}
                                >

                                  <strong
                                    style={{
                                      fontSize:
                                        "13px",
                                    }}
                                  >
                                    👤{" "}
                                    Anônimo
                                  </strong>


                                  <p
                                    style={{
                                      margin:
                                        "6px 0 0",
                                      color:
                                        "#555",
                                      fontSize:
                                        "14px",
                                      lineHeight:
                                        "1.5",
                                    }}
                                  >
                                    {
                                      item.texto
                                    }
                                  </p>

                                </div>

                              )
                            )}

                          </div>

                        )}


                        {/* NOVO COMENTÁRIO */}

                        <form
                          onSubmit={(e) =>
                            enviarComentario(
                              e,
                              publicacao.id
                            )
                          }
                          style={{
                            display:
                              "flex",
                            gap: "8px",
                          }}
                        >

                          <input
                            type="text"
                            value={
                              comentario
                            }
                            onChange={(e) =>
                              setComentario(
                                e.target
                                  .value
                              )
                            }
                            placeholder="Escreva um comentário de apoio..."
                            maxLength={300}
                            style={{
                              flex: 1,
                              border:
                                "1px solid #ddd",
                              borderRadius:
                                "10px",
                              padding:
                                "12px",
                              outline:
                                "none",
                              fontFamily:
                                "inherit",
                              boxSizing:
                                "border-box",
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
                                "0 16px",
                              cursor:
                                "pointer",
                              fontWeight:
                                "700",
                            }}
                          >
                            ➤
                          </button>

                        </form>


                        <div
                          style={{
                            marginTop:
                              "7px",
                            color:
                              "#999",
                            fontSize:
                              "11px",
                          }}
                        >
                          🔒 Seu comentário
                          será publicado
                          anonimamente.
                        </div>

                      </section>

                    )}

                  </article>

                );
              }
            )}

          </div>

        )}

      </main>


      {/* ==========================================
          BARRA INFERIOR
      ========================================== */}

      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "78px",
          background:
            "#ffffff",
          borderTop:
            "1px solid #e5e5e5",
          display: "flex",
          justifyContent:
            "center",
          alignItems: "center",
          gap: "90px",
          boxShadow:
            "0 -5px 18px rgba(0,0,0,0.05)",
          zIndex: 100,
        }}
      >

        {/* CONVERSAS */}

        <button
          type="button"
          onClick={() =>
            irPara("solicitacoes")
          }
          style={{
            border: "none",
            background:
              "transparent",
            cursor: "pointer",
            color: "#777",
            fontSize: "13px",
            fontWeight: "600",
          }}
        >

          <div
            style={{
              fontSize: "25px",
              marginBottom: "3px",
            }}
          >
            💬
          </div>

          <span>
            Conversas
          </span>

        </button>


        {/* AJUDAR */}

        <button
          type="button"
          className="active"
          style={{
            border: "none",
            background:
              "transparent",
            cursor:
              "default",
            color: "#20adb0",
            fontSize: "13px",
            fontWeight: "700",
          }}
        >

          <div
            style={{
              fontSize: "25px",
              marginBottom: "3px",
            }}
          >
            💚
          </div>

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
            border: "none",
            background:
              "transparent",
            cursor:
              "pointer",
            color: "#777",
            fontSize: "13px",
            fontWeight: "600",
          }}
        >

          <div
            style={{
              fontSize: "25px",
              marginBottom: "3px",
            }}
          >
            👤
          </div>

          <span>
            Perfil
          </span>

        </button>

      </nav>

    </div>
  );
}

export default Ajudar;