import React, { useEffect, useState } from "react";

function Conversa({ irPara }) {
  const [mensagem, setMensagem] = useState("");

  // ==========================================
  // USUÁRIO ATUAL
  // ==========================================

  const nomeUsuario =
    localStorage.getItem("pulsanNome") || "Você";

  const fotoUsuario =
    localStorage.getItem("pulsanFoto") || "";

  const papelConversa =
    localStorage.getItem("pulsanPapelConversa") ||
    "recebedor";

  const souAjudante =
    papelConversa === "ajudante";

  // ==========================================
  // DADOS DA PESSOA DA CONVERSA
  // ==========================================

  const nomeOutraPessoa =
    localStorage.getItem(
      "pulsanNomeOutraPessoa"
    ) || "Anônimo";

  const fotoOutraPessoa =
    localStorage.getItem(
      "pulsanFotoOutraPessoa"
    ) || "";

  const mediaOutraPessoa =
    localStorage.getItem(
      "pulsanMediaOutraPessoa"
    ) || "";

  const quantidadeAvaliacoes =
    localStorage.getItem(
      "pulsanAvaliacoesOutraPessoa"
    ) || "0";

  const seloApoiador =
    localStorage.getItem(
      "pulsanSeloApoiadorOutraPessoa"
    ) === "true";

  const seloPsicologo =
    localStorage.getItem(
      "pulsanSeloPsicologoOutraPessoa"
    ) === "true";

  // ==========================================
  // NOME/FOTO QUE DEVEM APARECER
  // ==========================================

  const nomeExibido =
    souAjudante
      ? "Anônimo"
      : nomeOutraPessoa;

  const fotoExibida =
    souAjudante
      ? ""
      : fotoOutraPessoa;

  // ==========================================
  // MENSAGENS
  // ==========================================

  const [mensagens, setMensagens] = useState(
    () => {
      const salvas =
        JSON.parse(
          localStorage.getItem(
            "pulsanMensagensConversa"
          ) || "[]"
        );

      return salvas;
    }
  );

  // ==========================================
  // SALVAR MENSAGENS
  // ==========================================

  useEffect(() => {
    localStorage.setItem(
      "pulsanMensagensConversa",
      JSON.stringify(mensagens)
    );
  }, [mensagens]);

  // ==========================================
  // ENVIAR MENSAGEM
  // ==========================================

  function enviarMensagem(e) {
    e.preventDefault();

    const texto = mensagem.trim();

    if (!texto) {
      return;
    }

    const novaMensagem = {
      id: Date.now(),
      autor: "eu",
      texto: texto,
      hora: new Date().toLocaleTimeString(
        "pt-BR",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      ),
    };

    setMensagens((anteriores) => [
      ...anteriores,
      novaMensagem,
    ]);

    setMensagem("");
  }

  // ==========================================
  // FINALIZAR CONVERSA
  // ==========================================

  function finalizarConversa() {
    const confirmar = window.confirm(
      "Deseja finalizar esta conversa?\n\n" +
        "Depois de finalizada, vocês não poderão continuar enviando mensagens."
    );

    if (!confirmar) {
      return;
    }

    localStorage.setItem(
      "pulsanConversaFinalizada",
      "true"
    );

    // Quem pediu ajuda avalia quem ajudou
    if (!souAjudante) {
      irPara("avaliacao");
      return;
    }

    alert(
      "Conversa finalizada. 💚\n\n" +
        "Obrigado por oferecer apoio."
    );

    irPara("solicitacoes");
  }

  // ==========================================
  // VOLTAR
  // ==========================================

  function voltarParaConversas() {
    irPara("solicitacoes");
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
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* =====================================
          CABEÇALHO DO CHAT
      ===================================== */}

      <header
        style={{
          background: "#f8e9df",
          borderBottom:
            "1px solid #e5ddd7",
          padding: "12px 20px",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        {/* VOLTAR */}

        <button
          type="button"
          onClick={voltarParaConversas}
          style={{
            width: "42px",
            height: "42px",
            border: "none",
            borderRadius: "12px",
            background: "#ffffff",
            fontSize: "23px",
            color: "#173b38",
            cursor: "pointer",
          }}
        >
          ←
        </button>

        {/* FOTO */}

        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: "#e5f1ed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            flexShrink: 0,
            fontSize: "22px",
          }}
        >
          {fotoExibida ? (
            <img
              src={fotoExibida}
              alt="Foto"
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

        {/* DADOS */}

        <div
          style={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <strong
            style={{
              display: "block",
              fontSize: "17px",
              color: "#173b38",
            }}
          >
            {nomeExibido}
          </strong>

          {!souAjudante && (
            <div
              style={{
                display: "flex",
                gap: "6px",
                flexWrap: "wrap",
                marginTop: "4px",
              }}
            >
              {seloApoiador && (
                <span
                  style={{
                    background: "#fff4cc",
                    color: "#92700b",
                    padding: "3px 7px",
                    borderRadius: "10px",
                    fontSize: "10px",
                    fontWeight: "700",
                  }}
                >
                  🏅 Apoiador
                </span>
              )}

              {seloPsicologo && (
                <span
                  style={{
                    background: "#e7f2ff",
                    color: "#27628f",
                    padding: "3px 7px",
                    borderRadius: "10px",
                    fontSize: "10px",
                    fontWeight: "700",
                  }}
                >
                  🧠 Psicólogo Parceiro
                </span>
              )}
            </div>
          )}

          {!souAjudante &&
            mediaOutraPessoa && (
              <span
                style={{
                  display: "block",
                  marginTop: "3px",
                  color: "#777",
                  fontSize: "11px",
                }}
              >
                ⭐ {mediaOutraPessoa}
                {" • "}
                {quantidadeAvaliacoes} avaliações
              </span>
            )}
        </div>

        {/* STATUS */}

        <div
          style={{
            background: "#ffffff",
            borderRadius: "15px",
            padding: "7px 10px",
            fontSize: "11px",
            color: "#168f92",
            fontWeight: "700",
          }}
        >
          ● Online
        </div>
      </header>

      {/* =====================================
          ÁREA DO CHAT
      ===================================== */}

      <main
        style={{
          flex: 1,
          width: "100%",
          maxWidth: "850px",
          margin: "0 auto",
          boxSizing: "border-box",
          padding:
            "20px 15px 115px",
        }}
      >
        {/* PRIVACIDADE */}

        <div
          style={{
            background: "#f2faf7",
            border:
              "1px solid #dcece5",
            borderRadius: "14px",
            padding: "12px 15px",
            marginBottom: "20px",
            textAlign: "center",
            color: "#6c7d78",
            fontSize: "12px",
          }}
        >
          🔒 Esta conversa é privada e
          protegida.
        </div>

        {/* DATA */}

        <div
          style={{
            textAlign: "center",
            marginBottom: "20px",
          }}
        >
          <span
            style={{
              background: "#eeeeee",
              color: "#888",
              borderRadius: "12px",
              padding: "5px 10px",
              fontSize: "11px",
            }}
          >
            Hoje
          </span>
        </div>

        {/* MENSAGENS */}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {mensagens.length === 0 && (
            <div
              style={{
                textAlign: "center",
                marginTop: "100px",
                color: "#999",
                padding: "0 30px",
              }}
            >
              <div
                style={{
                  fontSize: "42px",
                  marginBottom: "12px",
                }}
              >
                💬
              </div>

              <strong
                style={{
                  display: "block",
                  color: "#173b38",
                  marginBottom: "6px",
                }}
              >
                A conversa começou
              </strong>

              <span
                style={{
                  fontSize: "13px",
                  lineHeight: "1.5",
                }}
              >
                {souAjudante
                  ? "Envie uma mensagem acolhedora para iniciar a conversa."
                  : "Conte o que você está sentindo. Você pode falar no seu tempo."}
              </span>
            </div>
          )}

          {mensagens.map((item) => {
            const minhaMensagem =
              item.autor === "eu";

            return (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent:
                    minhaMensagem
                      ? "flex-end"
                      : "flex-start",
                }}
              >
                <div
                  style={{
                    maxWidth: "78%",
                    minWidth: "70px",
                    padding:
                      "11px 14px",
                    background:
                      minhaMensagem
                        ? "#20adb0"
                        : "#ffffff",
                    color:
                      minhaMensagem
                        ? "#ffffff"
                        : "#333",
                    borderRadius:
                      minhaMensagem
                        ? "18px 18px 4px 18px"
                        : "18px 18px 18px 4px",
                    border:
                      minhaMensagem
                        ? "none"
                        : "1px solid #e5e5e5",
                    boxShadow:
                      "0 2px 7px rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "15px",
                      lineHeight: "1.5",
                      whiteSpace:
                        "pre-wrap",
                    }}
                  >
                    {item.texto}
                  </div>

                  <div
                    style={{
                      textAlign: "right",
                      marginTop: "4px",
                      fontSize: "10px",
                      opacity: 0.65,
                    }}
                  >
                    {item.hora}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* =====================================
          CAMPO DE MENSAGEM
      ===================================== */}

      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: "#ffffff",
          borderTop:
            "1px solid #e5e5e5",
          padding: "10px 15px",
          boxSizing: "border-box",
          zIndex: 20,
        }}
      >
        <form
          onSubmit={enviarMensagem}
          style={{
            width: "100%",
            maxWidth: "850px",
            margin: "0 auto",
            display: "flex",
            alignItems: "flex-end",
            gap: "8px",
          }}
        >
          <div
            style={{
              flex: 1,
              background: "#f4f6f5",
              borderRadius: "20px",
              padding:
                "7px 14px",
              boxSizing: "border-box",
            }}
          >
            <textarea
              value={mensagem}
              onChange={(e) =>
                setMensagem(
                  e.target.value
                )
              }
              onKeyDown={(e) => {
                if (
                  e.key === "Enter" &&
                  !e.shiftKey
                ) {
                  e.preventDefault();
                  enviarMensagem(e);
                }
              }}
              placeholder={
                souAjudante
                  ? "Escreva uma mensagem acolhedora..."
                  : "Digite sua mensagem..."
              }
              maxLength={1000}
              rows={1}
              style={{
                width: "100%",
                border: "none",
                outline: "none",
                resize: "none",
                background:
                  "transparent",
                fontFamily:
                  "Arial, Helvetica, sans-serif",
                fontSize: "14px",
                color: "#333",
                boxSizing:
                  "border-box",
              }}
            />

            <div
              style={{
                textAlign: "right",
                color: "#aaa",
                fontSize: "9px",
              }}
            >
              {mensagem.length}/1000
            </div>
          </div>

          <button
            type="submit"
            disabled={!mensagem.trim()}
            style={{
              width: "46px",
              height: "46px",
              border: "none",
              borderRadius: "50%",
              background:
                mensagem.trim()
                  ? "#20adb0"
                  : "#d8e8e6",
              color: "#ffffff",
              fontSize: "19px",
              cursor:
                mensagem.trim()
                  ? "pointer"
                  : "default",
              flexShrink: 0,
            }}
          >
            ➤
          </button>
        </form>

        {/* FINALIZAR */}

        <div
          style={{
            textAlign: "center",
            marginTop: "7px",
          }}
        >
          <button
            type="button"
            onClick={finalizarConversa}
            style={{
              border: "none",
              background:
                "transparent",
              color: "#b65b57",
              fontSize: "11px",
              cursor: "pointer",
            }}
          >
            Finalizar conversa
          </button>
        </div>
      </div>
    </div>
  );
}

export default Conversa;