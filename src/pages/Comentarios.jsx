import React, { useEffect, useState } from "react";

function Conversa({ irPara }) {
  // =====================================================
  // IDENTIFICADOR DA CONVERSA
  // =====================================================

  const solicitacaoSalva =
    JSON.parse(
      localStorage.getItem(
        "pulsanSolicitacaoAtual"
      ) || "null"
    );

  const conversaId =
    solicitacaoSalva?.conversaId ||
    solicitacaoSalva?.id ||
    localStorage.getItem(
      "pulsanConversaAtual"
    ) ||
    "conversa-principal";


  // =====================================================
  // DADOS DO USUÁRIO LOGADO
  // =====================================================

  const meuNome =
    localStorage.getItem(
      "pulsanNome"
    ) || "Você";

  const minhaFoto =
    localStorage.getItem(
      "pulsanFoto"
    ) || "";

  const meuTipo =
    localStorage.getItem(
      "pulsanTipo"
    ) || "";


  // =====================================================
  // PAPEL NA CONVERSA
  //
  // "ajudante" = pessoa que solicitou ajudar
  // "anonimo" = pessoa que publicou o desabafo
  // =====================================================

  const papel =
    localStorage.getItem(
      "pulsanPapelConversa"
    ) || "anonimo";


  // =====================================================
  // DADOS DE QUEM ESTÁ AJUDANDO
  // =====================================================

  const nomeAjudante =
    solicitacaoSalva?.nomeSolicitante ||
    localStorage.getItem(
      "pulsanAjudanteNome"
    ) ||
    "Ajudante";

  const fotoAjudante =
    solicitacaoSalva?.fotoSolicitante ||
    localStorage.getItem(
      "pulsanAjudanteFoto"
    ) ||
    "";

  const seloAjudante =
    solicitacaoSalva?.seloSolicitante ||
    localStorage.getItem(
      "pulsanAjudanteSelo"
    ) ||
    "";

  const tipoAjudante =
    solicitacaoSalva?.tipoSolicitante ||
    localStorage.getItem(
      "pulsanAjudanteTipo"
    ) ||
    "";


  // =====================================================
  // ESTADOS
  // =====================================================

  const [mensagem, setMensagem] =
    useState("");

  const [mensagens, setMensagens] =
    useState([]);

  const [carregando, setCarregando] =
    useState(true);


  // =====================================================
  // CARREGAR HISTÓRICO
  //
  // As mensagens ficam salvas no navegador.
  // =====================================================

  useEffect(() => {
    const chave =
      `pulsanMensagens_${conversaId}`;

    const mensagensSalvas =
      JSON.parse(
        localStorage.getItem(
          chave
        ) || "[]"
      );

    setMensagens(
      mensagensSalvas
    );

    setCarregando(false);
  }, [conversaId]);


  // =====================================================
  // SALVAR MENSAGENS
  // =====================================================

  useEffect(() => {
    if (carregando) {
      return;
    }

    const chave =
      `pulsanMensagens_${conversaId}`;

    localStorage.setItem(
      chave,
      JSON.stringify(
        mensagens
      )
    );
  }, [
    mensagens,
    conversaId,
    carregando,
  ]);


  // =====================================================
  // INFORMAÇÕES DO OUTRO LADO
  //
  // REGRA:
  //
  // Se eu sou o ajudante:
  //   a outra pessoa aparece como ANÔNIMA.
  //
  // Se eu sou quem publicou:
  //   aparece a identidade de quem
  //   solicitou ajudar.
  // =====================================================

  const souAjudante =
    papel === "ajudante";


  let nomeDaOutraPessoa =
    "Anônimo";

  let fotoDaOutraPessoa =
    "";

  let seloDaOutraPessoa =
    "";

  let tipoDaOutraPessoa =
    "";


  if (souAjudante) {
    // Quem publicou permanece anônimo.

    nomeDaOutraPessoa =
      "Anônimo";

    fotoDaOutraPessoa =
      "";

    seloDaOutraPessoa =
      "";

    tipoDaOutraPessoa =
      "";
  } else {
    // Quem publicou consegue ver
    // a identidade do ajudante.

    nomeDaOutraPessoa =
      nomeAjudante;

    fotoDaOutraPessoa =
      fotoAjudante;

    seloDaOutraPessoa =
      seloAjudante;

    tipoDaOutraPessoa =
      tipoAjudante;
  }


  // =====================================================
  // ENVIAR MENSAGEM
  // =====================================================

  function enviarMensagem(e) {
    e.preventDefault();

    const texto =
      mensagem.trim();

    if (!texto) {
      return;
    }


    const novaMensagem = {
      id: Date.now(),

      autor:
        "eu",

      texto:
        texto,

      hora:
        new Date().toLocaleTimeString(
          "pt-BR",
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        ),

      data:
        new Date().toLocaleDateString(
          "pt-BR"
        ),
    };


    setMensagens(
      (anteriores) => [
        ...anteriores,
        novaMensagem,
      ]
    );


    setMensagem("");
  }


  // =====================================================
  // ENTER PARA ENVIAR
  //
  // SHIFT + ENTER = NOVA LINHA
  // =====================================================

  function controlarEnter(e) {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();

      enviarMensagem(e);
    }
  }


  // =====================================================
  // ENCERRAR CONVERSA
  // =====================================================

  function encerrarConversa() {
    const confirmar =
      window.confirm(
        "Deseja encerrar esta conversa?\n\n" +
          "O histórico continuará salvo."
      );

    if (!confirmar) {
      return;
    }


    // Guarda o ID para a avaliação.

    localStorage.setItem(
      "pulsanConversaAvaliar",
      conversaId
    );


    // Guarda quem deve ser avaliado.

    localStorage.setItem(
      "pulsanPessoaAvaliar",
      JSON.stringify({
        nome:
          nomeDaOutraPessoa,

        foto:
          fotoDaOutraPessoa,

        selo:
          seloDaOutraPessoa,

        tipo:
          tipoDaOutraPessoa,
      })
    );


    irPara(
      "avaliacao"
    );
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
  // RENDER
  // =====================================================

  return (
    <main
      style={{
        minHeight:
          "100vh",

        height:
          "100vh",

        background:
          "#f7f5f2",

        display:
          "flex",

        flexDirection:
          "column",

        fontFamily:
          "Arial, Helvetica, sans-serif",

        color:
          "#173b38",

        boxSizing:
          "border-box",
      }}
    >

      {/* =================================================
          CABEÇALHO
      ================================================= */}

      <header
        style={{
          flexShrink:
            0,

          height:
            "70px",

          background:
            "#ffffff",

          borderBottom:
            "1px solid #e6e6e6",

          display:
            "flex",

          alignItems:
            "center",

          padding:
            "0 16px",

          gap:
            "12px",

          boxSizing:
            "border-box",

          boxShadow:
            "0 2px 10px rgba(0,0,0,0.04)",
        }}
      >

        {/* VOLTAR */}

        <button
          type="button"
          onClick={voltar}
          style={{
            width:
              "40px",

            height:
              "40px",

            border:
              "none",

            borderRadius:
              "50%",

            background:
              "#f3f5f4",

            color:
              "#36504a",

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


        {/* FOTO */}

        <div
          style={{
            width:
              "43px",

            height:
              "43px",

            borderRadius:
              "50%",

            overflow:
              "hidden",

            background:
              "#eaf3f0",

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            flexShrink:
              0,

            border:
              "1px solid #dce9e5",
          }}
        >

          {fotoDaOutraPessoa ? (

            <img
              src={
                fotoDaOutraPessoa
              }
              alt={
                nomeDaOutraPessoa
              }
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

            <span
              style={{
                fontSize:
                  "19px",
              }}
            >
              🔒
            </span>

          )}

        </div>


        {/* NOME */}

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

              overflow:
                "hidden",

              textOverflow:
                "ellipsis",

              whiteSpace:
                "nowrap",
            }}
          >
            {nomeDaOutraPessoa}
          </strong>


          <div
            style={{
              display:
                "flex",

              alignItems:
                "center",

              gap:
                "6px",

              marginTop:
                "3px",

              flexWrap:
                "wrap",
            }}
          >

            <span
              style={{
                color:
                  "#8a9390",

                fontSize:
                  "10px",
              }}
            >
              Conversa privada
            </span>


            {seloDaOutraPessoa && (

              <span
                style={{
                  fontSize:
                    "9px",

                  color:
                    "#a17b21",

                  background:
                    "#fff5d9",

                  padding:
                    "3px 6px",

                  borderRadius:
                    "8px",

                  fontWeight:
                    "700",
                }}
              >
                ⭐ {seloDaOutraPessoa}
              </span>

            )}

          </div>

        </div>


        {/* SEGURANÇA */}

        <div
          style={{
            width:
              "38px",

            height:
              "38px",

            borderRadius:
              "50%",

            background:
              "#edf8f5",

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            fontSize:
              "17px",
          }}
        >
          🔒
        </div>

      </header>


      {/* =================================================
          AVISO
      ================================================= */}

      <div
        style={{
          flexShrink:
            0,

          margin:
            "10px 12px 5px",

          padding:
            "11px 13px",

          borderRadius:
            "13px",

          background:
            "#edf8f5",

          border:
            "1px solid #d9eee8",

          display:
            "flex",

          alignItems:
            "center",

          gap:
            "10px",
        }}
      >

        <span
          style={{
            fontSize:
              "18px",
          }}
        >
          💚
        </span>


        <div>

          <strong
            style={{
              display:
                "block",

              fontSize:
                "11px",

              color:
                "#31564e",
            }}
          >
            Esta conversa é privada
          </strong>


          <span
            style={{
              display:
                "block",

              fontSize:
                "10px",

              color:
                "#788681",

              marginTop:
                "2px",
            }}
          >
            Seja acolhedor e respeite
            os limites da outra pessoa.
          </span>

        </div>

      </div>


      {/* =================================================
          ÁREA DAS MENSAGENS
      ================================================= */}

      <section
        style={{
          flex:
            1,

          overflowY:
            "auto",

          padding:
            "15px 13px 20px",

          display:
            "flex",

          flexDirection:
            "column",

          gap:
            "10px",

          boxSizing:
            "border-box",
        }}
      >

        {/* SEM MENSAGENS */}

        {!carregando &&
          mensagens.length ===
            0 && (

            <div
              style={{
                margin:
                  "auto",

                textAlign:
                  "center",

                maxWidth:
                  "270px",

                color:
                  "#8a9390",
              }}
            >

              <div
                style={{
                  fontSize:
                    "38px",

                  marginBottom:
                    "10px",
                }}
              >
                💚
              </div>


              <strong
                style={{
                  display:
                    "block",

                  color:
                    "#536660",

                  fontSize:
                    "15px",
                }}
              >
                Comece a conversa
              </strong>


              <p
                style={{
                  fontSize:
                    "12px",

                  lineHeight:
                    "1.5",

                  margin:
                    "7px 0 0",
                }}
              >
                Escreva uma mensagem
                acolhedora. Você pode
                conversar no seu próprio
                tempo.
              </p>

            </div>

          )}


        {/* MENSAGENS */}

        {mensagens.map(
          (item) => {

            const minha =
              item.autor ===
              "eu";


            return (

              <div
                key={
                  item.id
                }
                style={{
                  display:
                    "flex",

                  justifyContent:
                    minha
                      ? "flex-end"
                      : "flex-start",

                  width:
                    "100%",
                }}
              >

                <div
                  style={{
                    maxWidth:
                      "78%",

                    padding:
                      "11px 13px",

                    borderRadius:
                      minha
                        ? "17px 17px 4px 17px"
                        : "17px 17px 17px 4px",

                    background:
                      minha
                        ? "#20adb0"
                        : "#ffffff",

                    color:
                      minha
                        ? "#ffffff"
                        : "#40514c",

                    boxShadow:
                      "0 3px 10px rgba(0,0,0,0.05)",
                  }}
                >

                  <p
                    style={{
                      margin:
                        0,

                      fontSize:
                        "14px",

                      lineHeight:
                        "1.5",

                      whiteSpace:
                        "pre-wrap",

                      wordBreak:
                        "break-word",
                    }}
                  >
                    {item.texto}
                  </p>


                  <div
                    style={{
                      marginTop:
                        "5px",

                      display:
                        "flex",

                      justifyContent:
                        "flex-end",

                      fontSize:
                        "9px",

                      opacity:
                        0.65,
                    }}
                  >
                    {item.hora}
                  </div>

                </div>

              </div>

            );
          }
        )}

      </section>


      {/* =================================================
          CAMPO DE MENSAGEM
      ================================================= */}

      <form
        onSubmit={
          enviarMensagem
        }
        style={{
          flexShrink:
            0,

          background:
            "#ffffff",

          borderTop:
            "1px solid #e5e5e5",

          padding:
            "9px 10px",

          display:
            "flex",

          alignItems:
            "flex-end",

          gap:
            "8px",

          boxSizing:
            "border-box",
        }}
      >

        <div
          style={{
            flex:
              1,

            position:
              "relative",
          }}
        >

          <textarea
            value={
              mensagem
            }
            onChange={(e) =>
              setMensagem(
                e.target.value
              )
            }
            onKeyDown={
              controlarEnter
            }
            placeholder="Escreva uma mensagem acolhedora..."
            maxLength={
              500
            }
            rows={
              1
            }
            style={{
              width:
                "100%",

              minHeight:
                "43px",

              maxHeight:
                "110px",

              resize:
                "none",

              boxSizing:
                "border-box",

              border:
                "1px solid #dfe4e2",

              borderRadius:
                "20px",

              padding:
                "12px 42px 12px 14px",

              outline:
                "none",

              fontFamily:
                "Arial, Helvetica, sans-serif",

              fontSize:
                "13px",

              background:
                "#f8faf9",

              color:
                "#354944",
            }}
          />


          <span
            style={{
              position:
                "absolute",

              right:
                "12px",

              bottom:
                "5px",

              fontSize:
                "8px",

              color:
                "#9aa19f",
            }}
          >
            {mensagem.length}/500
          </span>

        </div>


        {/* ENVIAR */}

        <button
          type="submit"
          aria-label="Enviar mensagem"
          disabled={
            !mensagem.trim()
          }
          style={{
            width:
              "45px",

            height:
              "45px",

            flexShrink:
              0,

            border:
              "none",

            borderRadius:
              "50%",

            background:
              mensagem.trim()
                ? "#20adb0"
                : "#d7dfdc",

            color:
              "#ffffff",

            cursor:
              mensagem.trim()
                ? "pointer"
                : "default",

            fontSize:
              "18px",

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",
          }}
        >
          ➤
        </button>

      </form>


      {/* =================================================
          RODAPÉ
      ================================================= */}

      <footer
        style={{
          flexShrink:
            0,

          background:
            "#ffffff",

          padding:
            "8px 15px 10px",

          textAlign:
            "center",

          borderTop:
            "1px solid #f0f0f0",
        }}
      >

        <div
          style={{
            color:
              "#999",

            fontSize:
              "9px",

            marginBottom:
              "5px",
          }}
        >
          🔒 Sua conversa é privada.
          O histórico fica salvo.
        </div>


        <button
          type="button"
          onClick={
            encerrarConversa
          }
          style={{
            border:
              "none",

            background:
              "transparent",

            color:
              "#168f92",

            fontSize:
              "11px",

            fontWeight:
              "700",

            cursor:
              "pointer",

            padding:
              "4px 8px",
          }}
        >
          Encerrar conversa
        </button>

      </footer>

    </main>
  );
}

export default Conversa;