import React, { useState } from "react";

function Premios({ irPara }) {

  // =====================================
  // PONTOS DO USUÁRIO
  // =====================================

  const [pontos, setPontos] = useState(
    Number(
      localStorage.getItem("pulsanPontos") || 0
    )
  );


  // =====================================
  // HISTÓRICO DE RESGATES
  // =====================================

  const [resgates, setResgates] = useState(
    JSON.parse(
      localStorage.getItem(
        "pulsanResgates"
      ) || "[]"
    )
  );


  // =====================================
  // PRÊMIOS
  // =====================================

  // Os prêmios ainda não foram definidos.
  // A área permanece preparada para receber recompensas
  // quando os benefícios e parceiros do Pulsan forem definidos.
  const premiosDisponiveis = false;




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

      {/* =====================================
          CABEÇALHO
      ===================================== */}

      <header
        style={{
          background: "#f7d9cf",
          padding: "18px 35px",
          display: "flex",
          alignItems: "center",
          justifyContent:
            "space-between",
          borderBottom:
            "1px solid #ead8d2",
        }}
      >

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
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

          <strong
            style={{
              fontSize: "21px",
              letterSpacing: "4px",
            }}
          >
            PULSAN
          </strong>

        </div>


        <button
          type="button"
          onClick={() =>
            irPara("perfil")
          }
          style={{
            border: "none",
            background: "#ffffff",
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            cursor: "pointer",
            fontSize: "20px",
          }}
        >
          👤
        </button>

      </header>


      {/* =====================================
          CONTEÚDO
      ===================================== */}

      <main
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "40px 25px",
        }}
      >

        {/* ===================================
            TÍTULO
        =================================== */}

        <section
          style={{
            textAlign: "center",
            marginBottom: "30px",
          }}
        >

          <div
            style={{
              fontSize: "45px",
              marginBottom: "10px",
            }}
          >
            🎁
          </div>

          <h1
            style={{
              margin: "0",
              fontSize: "32px",
            }}
          >
            Prêmios
          </h1>

          <p
            style={{
              color: "#777",
              fontSize: "16px",
              lineHeight: "1.5",
            }}
          >
            Use seus pontos para trocar
            por benefícios e recompensas.
          </p>

        </section>


        {/* ===================================
            SALDO
        =================================== */}

        <section
          style={{
            background:
              "linear-gradient(135deg, #20adb0, #168f92)",
            borderRadius: "22px",
            padding: "30px",
            color: "#ffffff",
            textAlign: "center",
            marginBottom: "30px",
            boxShadow:
              "0 8px 25px rgba(32,173,176,0.20)",
          }}
        >

          <div
            style={{
              fontSize: "30px",
            }}
          >
            🏆
          </div>

          <p
            style={{
              margin:
                "8px 0 4px",
              opacity: 0.9,
            }}
          >
            Seus pontos
          </p>

          <strong
            style={{
              fontSize: "42px",
            }}
          >
            {pontos}
          </strong>

          <p
            style={{
              margin:
                "8px 0 0",
              opacity: 0.9,
            }}
          >
            pontos disponíveis
          </p>

        </section>


        {/* ===================================
            PRÊMIOS
        =================================== */}

        <section>
          <h2
            style={{
              fontSize: "23px",
              marginBottom: "18px",
            }}
          >
            🎁 Recompensas
          </h2>

          <div
            style={{
              background: "#ffffff",
              border: "1px solid #e5e5e5",
              borderRadius: "20px",
              padding: "35px 25px",
              textAlign: "center",
              boxShadow: "0 5px 18px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                width: "70px",
                height: "70px",
                margin: "0 auto 16px",
                borderRadius: "20px",
                background: "#f0faf8",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "36px",
              }}
              aria-hidden="true"
            >
              🎁
            </div>

            <h3
              style={{
                margin: "0 0 10px",
                fontSize: "20px",
                color: "#173b38",
              }}
            >
              Nenhum prêmio disponível no momento
            </h3>

            <p
              style={{
                margin: "0 auto",
                maxWidth: "560px",
                color: "#777",
                fontSize: "14px",
                lineHeight: "1.6",
              }}
            >
              Estamos definindo quais benefícios e recompensas poderão ser
              oferecidos no Pulsan. Quando os prêmios forem definidos,
              esta área será atualizada.
            </p>

            <div
              style={{
                marginTop: "18px",
                display: "inline-block",
                padding: "9px 14px",
                borderRadius: "999px",
                background: "#fff8e6",
                color: "#8a6a16",
                fontSize: "12px",
                fontWeight: "700",
              }}
            >
              Em breve
            </div>
          </div>
        </section>


        {/* ===================================
            HISTÓRICO
        =================================== */}

        <section
          style={{
            marginTop:
              "35px",
          }}
        >

          <h2
            style={{
              fontSize:
                "23px",
              marginBottom:
                "18px",
            }}
          >
            📋 Meus resgates
          </h2>


          {resgates.length === 0 ? (

            <div
              style={{
                background:
                  "#ffffff",
                border:
                  "1px solid #e5e5e5",
                borderRadius:
                  "18px",
                padding:
                  "30px",
                textAlign:
                  "center",
                color:
                  "#777",
              }}
            >

              <div
                style={{
                  fontSize:
                    "35px",
                  marginBottom:
                    "10px",
                }}
              >
                🎁
              </div>

              <strong>
                Nenhum prêmio resgatado
              </strong>

              <p
                style={{
                  margin:
                    "8px 0 0",
                }}
              >
                Seus prêmios resgatados
                aparecerão aqui.
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
                  "12px",
              }}
            >

              {resgates.map(
                (resgate) => (

                  <div
                    key={
                      resgate.id
                    }
                    style={{
                      background:
                        "#ffffff",
                      border:
                        "1px solid #e5e5e5",
                      borderRadius:
                        "16px",
                      padding:
                        "18px",
                      display:
                        "flex",
                      alignItems:
                        "center",
                      justifyContent:
                        "space-between",
                      gap:
                        "15px",
                      flexWrap:
                        "wrap",
                    }}
                  >

                    <div
                      style={{
                        display:
                          "flex",
                        alignItems:
                          "center",
                        gap:
                          "14px",
                      }}
                    >

                      <div
                        style={{
                          width:
                            "48px",
                          height:
                            "48px",
                          borderRadius:
                            "13px",
                          background:
                            "#fff8e6",
                          display:
                            "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          fontSize:
                            "25px",
                        }}
                      >
                        {
                          resgate.premioIcone
                        }
                      </div>


                      <div>

                        <strong>
                          {
                            resgate.premioNome
                          }
                        </strong>

                        <p
                          style={{
                            margin:
                              "5px 0 0",
                            color:
                              "#888",
                            fontSize:
                              "13px",
                          }}
                        >
                          Resgatado em{" "}
                          {
                            resgate.data
                          }
                        </p>

                      </div>

                    </div>


                    <div
                      style={{
                        textAlign:
                          "right",
                      }}
                    >

                      <strong
                        style={{
                          color:
                            "#b48619",
                        }}
                      >
                        -{" "}
                        {
                          resgate.pontosUtilizados
                        }{" "}
                        pontos
                      </strong>

                      <span
                        style={{
                          display:
                            "block",
                          marginTop:
                            "5px",
                          fontSize:
                            "12px",
                          color:
                            "#20adb0",
                          fontWeight:
                            "700",
                        }}
                      >
                        ✓{" "}
                        {
                          resgate.status
                        }
                      </span>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </section>


        {/* ===================================
            COMO GANHAR
        =================================== */}

        <section
          style={{
            marginTop:
              "30px",
            background:
              "#f0faf8",
            border:
              "1px solid #dceeea",
            borderRadius:
              "18px",
            padding:
              "25px",
          }}
        >

          <h2
            style={{
              margin:
                "0 0 12px",
              fontSize:
                "21px",
            }}
          >
            💚 Como ganhar mais pontos?
          </h2>

          <p
            style={{
              margin: 0,
              color:
                "#666",
              lineHeight:
                "1.6",
            }}
          >
            Continue oferecendo
            apoio, ouvindo outras
            pessoas e construindo
            uma comunidade mais
            acolhedora. As avaliações
            recebidas após suas
            conversas podem gerar
            novos pontos.
          </p>

        </section>


        {/* ===================================
            VOLTAR
        =================================== */}

        <button
          type="button"
          onClick={() =>
            irPara("perfil")
          }
          style={{
            display:
              "block",
            margin:
              "30px auto 0",
            border:
              "none",
            background:
              "transparent",
            color:
              "#168f92",
            fontWeight:
              "700",
            fontSize:
              "15px",
            cursor:
              "pointer",
          }}
        >
          ← Voltar para o perfil
        </button>

      </main>


      {/* =====================================
          NAVEGAÇÃO
      ===================================== */}

      <nav
        style={{
          position:
            "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height:
            "75px",
          background:
            "#ffffff",
          borderTop:
            "1px solid #e8e8e8",
          display:
            "flex",
          justifyContent:
            "center",
          alignItems:
            "center",
          gap:
            "90px",
          boxShadow:
            "0 -4px 15px rgba(0,0,0,0.04)",
        }}
      >

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
            color:
              "#777",
            fontSize:
              "14px",
          }}
        >

          <div
            style={{
              fontSize:
                "25px",
            }}
          >
            💬
          </div>

          Conversas

        </button>


        <button
          type="button"
          onClick={() =>
            irPara(
              "ajudar"
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
              "#777",
            fontSize:
              "14px",
          }}
        >

          <div
            style={{
              fontSize:
                "25px",
            }}
          >
            💚
          </div>

          Ajudar

        </button>


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
            cursor:
              "pointer",
            color:
              "#20adb0",
            fontSize:
              "14px",
            fontWeight:
              "700",
          }}
        >

          <div
            style={{
              fontSize:
                "25px",
            }}
          >
            👤
          </div>

          Perfil

        </button>

      </nav>

    </div>
  );
}

export default Premios;