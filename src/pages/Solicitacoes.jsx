import React, { useState } from "react";

function Solicitacoes({ irPara }) {
  // =====================================================
  // USUÁRIO LOGADO
  // =====================================================

  const nomeUsuario =
    localStorage.getItem("pulsanNome") ||
    "Você";

  const fotoUsuario =
    localStorage.getItem("pulsanFoto") ||
    "";


  // =====================================================
  // SOLICITAÇÕES RECEBIDAS
  // =====================================================

  const [solicitacoes, setSolicitacoes] =
    useState(() => {
      const salvas =
        JSON.parse(
          localStorage.getItem(
            "pulsanSolicitacoesChat"
          ) || "[]"
        );

      return salvas.filter(
        (item) =>
          item.status === "pendente"
      );
    });


  // =====================================================
  // MENSAGENS / CONVERSAS RECENTES
  // =====================================================

  const [conversas, setConversas] =
    useState(() => {
      return JSON.parse(
        localStorage.getItem(
          "pulsanConversas"
        ) || "[]"
      );
    });


  // =====================================================
  // ATUALIZAR DADOS
  // =====================================================

  function atualizarDados() {
    const novasSolicitacoes =
      JSON.parse(
        localStorage.getItem(
          "pulsanSolicitacoesChat"
        ) || "[]"
      );

    setSolicitacoes(
      novasSolicitacoes.filter(
        (item) =>
          item.status === "pendente"
      )
    );


    const novasConversas =
      JSON.parse(
        localStorage.getItem(
          "pulsanConversas"
        ) || "[]"
      );

    setConversas(
      novasConversas
    );
  }


  // =====================================================
  // ACEITAR SOLICITAÇÃO
  // =====================================================

  function aceitarSolicitacao(
    solicitacao
  ) {
    const confirmar =
      window.confirm(
        "Deseja aceitar esta solicitação de conversa?\n\n" +
        "A pessoa que está oferecendo ajuda verá seu nome, foto e selo.\n\n" +
        "Você continuará anônimo para ela."
      );

    if (!confirmar) {
      return;
    }


    // =================================================
    // DEFINIR PAPEL
    //
    // Quem recebe a solicitação é quem publicou
    // o desabafo.
    //
    // Portanto:
    // ajudado = anônimo
    // =================================================

    localStorage.setItem(
      "pulsanPapelConversa",
      "ajudado"
    );


    // =================================================
    // DADOS DO AJUDANTE
    // =================================================

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
      "pulsanTipoOutraPessoa",
      solicitacao.tipoSolicitante ||
        ""
    );

    localStorage.setItem(
      "pulsanSeloOutraPessoa",
      solicitacao.seloSolicitante ||
        ""
    );


    // =================================================
    // O USUÁRIO QUE PUBLICOU CONTINUA ANÔNIMO
    // =================================================

    localStorage.setItem(
      "pulsanNomeUsuarioConversa",
      "Anônimo"
    );

    localStorage.setItem(
      "pulsanFotoUsuarioConversa",
      ""
    );


    // =================================================
    // ID DA CONVERSA
    // =================================================

    const conversaId =
      `conversa_${solicitacao.id}`;


    localStorage.setItem(
      "pulsanConversaAtual",
      conversaId
    );


    // =================================================
    // GUARDAR SOLICITAÇÃO ATUAL
    // =================================================

    const solicitacaoAtual = {
      ...solicitacao,

      conversaId:
        conversaId,
    };


    localStorage.setItem(
      "pulsanSolicitacaoAtual",
      JSON.stringify(
        solicitacaoAtual
      )
    );


    // =================================================
    // ATUALIZAR STATUS DA SOLICITAÇÃO
    // =================================================

    const todasSolicitacoes =
      JSON.parse(
        localStorage.getItem(
          "pulsanSolicitacoesChat"
        ) || "[]"
      );


    const solicitacoesAtualizadas =
      todasSolicitacoes.map(
        (item) => {

          if (
            item.id !==
            solicitacao.id
          ) {
            return item;
          }

          return {
            ...item,

            status:
              "aceita",

            conversaId:
              conversaId,

            aceitaEm:
              new Date().toLocaleString(
                "pt-BR"
              ),
          };
        }
      );


    localStorage.setItem(
      "pulsanSolicitacoesChat",
      JSON.stringify(
        solicitacoesAtualizadas
      )
    );


    // =================================================
    // CRIAR CONVERSA
    // =================================================

    const conversasSalvas =
      JSON.parse(
        localStorage.getItem(
          "pulsanConversas"
        ) || "[]"
      );


    const conversaExistente =
      conversasSalvas.find(
        (item) =>
          item.id ===
          solicitacao.id
      );


    const novaConversa =
      conversaExistente || {
        id:
          solicitacao.id,

        conversaId:
          conversaId,

        nome:
          solicitacao.nomeSolicitante ||
          "Usuário",

        foto:
          solicitacao.fotoSolicitante ||
          "",

        tipo:
          solicitacao.tipoSolicitante ||
          "",

        selo:
          solicitacao.seloSolicitante ||
          "",

        ultimaMensagem:
          "Conversa iniciada. 💚",

        hora:
          "Agora",

        papel:
          "ajudado",

        publicacaoId:
          solicitacao.publicacaoId,

        anonimato:
          true,
      };


    const conversasAtualizadas = [
      novaConversa,

      ...conversasSalvas.filter(
        (item) =>
          item.id !==
          novaConversa.id
      ),
    ];


    localStorage.setItem(
      "pulsanConversas",
      JSON.stringify(
        conversasAtualizadas
      )
    );


    // =================================================
    // ATUALIZAR TELA
    // =================================================

    setSolicitacoes(
      solicitacoesAtualizadas.filter(
        (item) =>
          item.status ===
          "pendente"
      )
    );


    setConversas(
      conversasAtualizadas
    );


    // =================================================
    // IR PARA O CHAT
    // =================================================

    irPara(
      "conversa"
    );
  }


  // =====================================================
  // RECUSAR SOLICITAÇÃO
  // =====================================================

  function recusarSolicitacao(
    solicitacao
  ) {
    const confirmar =
      window.confirm(
        "Deseja recusar esta solicitação?"
      );

    if (!confirmar) {
      return;
    }


    const todasSolicitacoes =
      JSON.parse(
        localStorage.getItem(
          "pulsanSolicitacoesChat"
        ) || "[]"
      );


    const atualizadas =
      todasSolicitacoes.map(
        (item) => {

          if (
            item.id !==
            solicitacao.id
          ) {
            return item;
          }

          return {
            ...item,

            status:
              "recusada",

            recusadaEm:
              new Date().toLocaleString(
                "pt-BR"
              ),
          };
        }
      );


    localStorage.setItem(
      "pulsanSolicitacoesChat",
      JSON.stringify(
        atualizadas
      )
    );


    setSolicitacoes(
      atualizadas.filter(
        (item) =>
          item.status ===
          "pendente"
      )
    );
  }


  // =====================================================
  // ABRIR CONVERSA
  // =====================================================

  function abrirConversa(
    conversa
  ) {
    const conversaId =
      conversa.conversaId ||
      `conversa_${conversa.id}`;


    // =================================================
    // PAPEL
    // =================================================

    localStorage.setItem(
      "pulsanPapelConversa",
      conversa.papel ||
        "ajudado"
    );


    // =================================================
    // OUTRA PESSOA
    // =================================================

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
      "pulsanTipoOutraPessoa",
      conversa.tipo ||
        ""
    );

    localStorage.setItem(
      "pulsanSeloOutraPessoa",
      conversa.selo ||
        ""
    );


    // =================================================
    // CONVERSA ATUAL
    // =================================================

    localStorage.setItem(
      "pulsanConversaAtual",
      conversaId
    );


    // =================================================
    // ABRIR CHAT
    // =================================================

    irPara(
      "conversa"
    );
  }


  // =====================================================
  // VOLTAR AO AMBIENTE
  // =====================================================

  function voltarInicio() {
    irPara(
      "ambiente"
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
          "linear-gradient(180deg, #fffdf9 0%, #f2faf7 100%)",

        color:
          "#173b38",

        fontFamily:
          "Arial, Helvetica, sans-serif",

        paddingBottom:
          "95px",

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
            "rgba(255,255,255,0.97)",

          backdropFilter:
            "blur(10px)",

          borderBottom:
            "1px solid #e6e6e6",

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

        {/* VOLTAR */}

        <button
          type="button"
          onClick={
            voltarInicio
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

            fontSize:
              "23px",

            cursor:
              "pointer",

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

                textAlign:
                  "center",

                fontSize:
                  "9px",

                color:
                  "#999",
              }}
            >
              Conversas
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

            overflow:
              "hidden",

            background:
              "#eef5f2",

            padding:
              0,

            cursor:
              "pointer",
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
          CONTEÚDO
      ================================================= */}

      <section
        style={{
          width:
            "100%",

          maxWidth:
            "850px",

          margin:
            "0 auto",

          padding:
            "28px 18px",

          boxSizing:
            "border-box",
        }}
      >

        {/* TÍTULO */}

        <div
          style={{
            marginBottom:
              "25px",
          }}
        >

          <h1
            style={{
              margin:
                0,

              fontSize:
                "30px",

              lineHeight:
                "1.15",

              fontWeight:
                "800",
            }}
          >
            Conversas 💬
          </h1>


          <p
            style={{
              margin:
                "8px 0 0",

              color:
                "#777",

              fontSize:
                "13px",

              lineHeight:
                "1.5",
            }}
          >
            Veja suas solicitações
            recebidas e continue suas
            conversas recentes.
          </p>

        </div>


        {/* =================================================
            SOLICITAÇÕES RECEBIDAS
        ================================================= */}

        <section
          style={{
            marginBottom:
              "32px",
          }}
        >

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

            <h2
              style={{
                margin:
                  0,

                fontSize:
                  "20px",
              }}
            >
              📩 Solicitações recebidas
            </h2>


            {solicitacoes.length >
              0 && (

              <span
                style={{
                  background:
                    "#20adb0",

                  color:
                    "#ffffff",

                  borderRadius:
                    "20px",

                  padding:
                    "5px 9px",

                  fontSize:
                    "10px",

                  fontWeight:
                    "800",
                }}
              >
                {
                  solicitacoes.length
                }
              </span>

            )}

          </div>


          {solicitacoes.length ===
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
                  "28px 20px",

                textAlign:
                  "center",

                boxShadow:
                  "0 4px 15px rgba(0,0,0,0.03)",
              }}
            >

              <div
                style={{
                  fontSize:
                    "34px",

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

                  marginBottom:
                    "5px",
                }}
              >
                Nenhuma solicitação recebida
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
                Quando alguém quiser
                oferecer ajuda, a
                solicitação aparecerá aqui.
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
                  "14px",
              }}
            >

              {solicitacoes.map(
                (
                  solicitacao
                ) => (

                  <article
                    key={
                      solicitacao.id
                    }
                    style={{
                      background:
                        "#ffffff",

                      border:
                        "1px solid #e3e7e5",

                      borderRadius:
                        "20px",

                      padding:
                        "17px",

                      boxShadow:
                        "0 5px 18px rgba(0,0,0,0.04)",
                    }}
                  >

                    {/* AJUDANTE */}

                    <div
                      style={{
                        display:
                          "flex",

                        alignItems:
                          "center",

                        gap:
                          "11px",

                        marginBottom:
                          "14px",
                      }}
                    >

                      <div
                        style={{
                          width:
                            "52px",

                          height:
                            "52px",

                          borderRadius:
                            "50%",

                          overflow:
                            "hidden",

                          flexShrink:
                            0,

                          background:
                            "#eaf5f2",

                          display:
                            "flex",

                          alignItems:
                            "center",

                          justifyContent:
                            "center",

                          fontSize:
                            "22px",
                        }}
                      >

                        {solicitacao.fotoSolicitante ? (

                          <img
                            src={
                              solicitacao.fotoSolicitante
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
                              "15px",
                          }}
                        >
                          {
                            solicitacao.nomeSolicitante ||
                            "Usuário"
                          }
                        </strong>


                        <span
                          style={{
                            display:
                              "block",

                            marginTop:
                              "3px",

                            color:
                              "#777",

                            fontSize:
                              "10px",
                          }}
                        >
                          Está oferecendo ajuda
                        </span>


                        <div
                          style={{
                            display:
                              "flex",

                            gap:
                              "5px",

                            flexWrap:
                              "wrap",

                            marginTop:
                              "6px",
                          }}
                        >

                          {solicitacao.seloSolicitante && (

                            <span
                              style={{
                                background:
                                  "#fff4d7",

                                color:
                                  "#8b6c00",

                                borderRadius:
                                  "8px",

                                padding:
                                  "4px 7px",

                                fontSize:
                                  "9px",

                                fontWeight:
                                  "700",
                              }}
                            >
                              ⭐{" "}
                              {
                                solicitacao.seloSolicitante
                              }
                            </span>

                          )}


                          {solicitacao.tipoSolicitante && (

                            <span
                              style={{
                                background:
                                  "#edf5ff",

                                color:
                                  "#416a8b",

                                borderRadius:
                                  "8px",

                                padding:
                                  "4px 7px",

                                fontSize:
                                  "9px",

                                fontWeight:
                                  "700",
                              }}
                            >
                              {
                                solicitacao.tipoSolicitante
                              }
                            </span>

                          )}

                        </div>

                      </div>

                    </div>


                    {/* DESABAFO */}

                    <div
                      style={{
                        background:
                          "#f7faf9",

                        borderRadius:
                          "14px",

                        padding:
                          "14px",

                        marginBottom:
                          "13px",
                      }}
                    >

                      <span
                        style={{
                          display:
                            "block",

                          color:
                            "#20adb0",

                          fontSize:
                            "9px",

                          fontWeight:
                            "800",

                          letterSpacing:
                            "1px",

                          marginBottom:
                            "6px",
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
                            "1.5",

                          color:
                            "#40514b",
                        }}
                      >
                        “
                        {
                          solicitacao.textoDesabafo ||
                          "A pessoa quer conversar com você."
                        }
                        ”
                      </p>

                    </div>


                    <span
                      style={{
                        display:
                          "block",

                        color:
                          "#999",

                        fontSize:
                          "9px",

                        marginBottom:
                          "12px",
                      }}
                    >
                      🕐{" "}
                      {
                        solicitacao.data ||
                        "Agora"
                      }
                    </span>


                    {/* ACEITAR */}

                    <button
                      type="button"
                      onClick={() =>
                        aceitarSolicitacao(
                          solicitacao
                        )
                      }
                      style={{
                        width:
                          "100%",

                        border:
                          "none",

                        borderRadius:
                          "11px",

                        padding:
                          "13px",

                        background:
                          "#20adb0",

                        color:
                          "#ffffff",

                        fontWeight:
                          "800",

                        fontSize:
                          "13px",

                        cursor:
                          "pointer",
                      }}
                    >
                      💚 Aceitar e conversar
                    </button>


                    {/* RECUSAR */}

                    <button
                      type="button"
                      onClick={() =>
                        recusarSolicitacao(
                          solicitacao
                        )
                      }
                      style={{
                        width:
                          "100%",

                        border:
                          "none",

                        background:
                          "transparent",

                        color:
                          "#a05b56",

                        padding:
                          "9px",

                        marginTop:
                          "4px",

                        fontSize:
                          "11px",

                        fontWeight:
                          "700",

                        cursor:
                          "pointer",
                      }}
                    >
                      Recusar
                    </button>

                  </article>

                )
              )}

            </div>

          )}

        </section>


        {/* =================================================
            SEPARADOR
        ================================================= */}

        <div
          style={{
            height:
              "1px",

            background:
              "#e5e5e5",

            margin:
              "0 0 30px",
          }}
        />


        {/* =================================================
            MENSAGENS RECENTES
        ================================================= */}

        <section>

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

            <h2
              style={{
                margin:
                  0,

                fontSize:
                  "20px",
              }}
            >
              💬 Mensagens recentes
            </h2>


            <button
              type="button"
              onClick={
                atualizarDados
              }
              style={{
                border:
                  "none",

                background:
                  "transparent",

                color:
                  "#20adb0",

                fontSize:
                  "10px",

                fontWeight:
                  "700",

                cursor:
                  "pointer",
              }}
            >
              Atualizar
            </button>

          </div>


          {conversas.length ===
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
                  "30px 20px",

                textAlign:
                  "center",
              }}
            >

              <div
                style={{
                  fontSize:
                    "34px",

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

                  marginBottom:
                    "5px",
                }}
              >
                Nenhuma conversa ainda
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
                Quando uma solicitação
                for aceita, a conversa
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
                  "10px",
              }}
            >

              {conversas.map(
                (
                  conversa
                ) => (

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
                        "1px solid #e4e7e6",

                      background:
                        "#ffffff",

                      borderRadius:
                        "17px",

                      padding:
                        "13px",

                      display:
                        "flex",

                      alignItems:
                        "center",

                      gap:
                        "11px",

                      textAlign:
                        "left",

                      cursor:
                        "pointer",

                      boxShadow:
                        "0 4px 13px rgba(0,0,0,0.03)",
                    }}
                  >

                    {/* FOTO */}

                    <div
                      style={{
                        width:
                          "49px",

                        height:
                          "49px",

                        borderRadius:
                          "50%",

                        overflow:
                          "hidden",

                        flexShrink:
                          0,

                        background:
                          "#eaf5f2",

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


                    {/* INFORMAÇÕES */}

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
                            "14px",

                          marginBottom:
                            "4px",
                        }}
                      >
                        {
                          conversa.nome ||
                          "Usuário"
                        }
                      </strong>


                      <span
                        style={{
                          display:
                            "block",

                          color:
                            "#20adb0",

                          fontSize:
                            "9px",

                          fontWeight:
                            "700",

                          marginBottom:
                            "4px",
                        }}
                      >
                        {
                          conversa.categoria ||
                          "Conversa privada"
                        }
                      </span>


                      <span
                        style={{
                          display:
                            "block",

                          color:
                            "#888",

                          fontSize:
                            "11px",

                          whiteSpace:
                            "nowrap",

                          overflow:
                            "hidden",

                          textOverflow:
                            "ellipsis",
                        }}
                      >
                        {
                          conversa.ultimaMensagem ||
                          "Conversa iniciada. 💚"
                        }
                      </span>

                    </div>


                    {/* HORÁRIO */}

                    <div
                      style={{
                        alignSelf:
                          "flex-start",

                        color:
                          "#999",

                        fontSize:
                          "9px",

                        whiteSpace:
                          "nowrap",
                      }}
                    >
                      {
                        conversa.hora ||
                        "Agora"
                      }
                    </div>


                    <span
                      style={{
                        color:
                          "#20adb0",

                        fontSize:
                          "20px",
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

      </section>


      {/* =================================================
          MENU INFERIOR
      ================================================= */}

      <nav
        style={{
          position:
            "fixed",

          left:
            0,

          right:
            0,

          bottom:
            0,

          height:
            "70px",

          background:
            "#ffffff",

          borderTop:
            "1px solid #e6e6e6",

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "space-around",

          zIndex:
            200,

          boxShadow:
            "0 -4px 15px rgba(0,0,0,0.04)",
        }}
      >

        {/* INÍCIO */}

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
              "#777",

            cursor:
              "pointer",

            fontSize:
              "10px",
          }}
        >
          <div
            style={{
              fontSize:
                "21px",
            }}
          >
            🏠
          </div>

          Início
        </button>


        {/* CONVERSAS */}

        <button
          type="button"
          style={{
            border:
              "none",

            background:
              "transparent",

            color:
              "#20adb0",

            fontWeight:
              "800",

            cursor:
              "default",

            fontSize:
              "10px",
          }}
        >
          <div
            style={{
              fontSize:
                "21px",
            }}
          >
            💬
          </div>

          Conversas
        </button>


        {/* AJUDAR - DECORATIVO */}

        <button
          type="button"
          disabled
          style={{
            border:
              "none",

            background:
              "transparent",

            color:
              "#aaa",

            cursor:
              "default",

            fontSize:
              "10px",

            opacity:
              0.7,
          }}
        >
          <div
            style={{
              fontSize:
                "21px",
            }}
          >
            💚
          </div>

          Ajudar
        </button>


        {/* PERFIL */}

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
              "#777",

            cursor:
              "pointer",

            fontSize:
              "10px",
          }}
        >
          <div
            style={{
              fontSize:
                "21px",
            }}
          >
            👤
          </div>

          Perfil
        </button>

      </nav>

    </main>
  );
}

export default Solicitacoes;