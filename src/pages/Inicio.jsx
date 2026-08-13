import React from "react";

function Inicio({ irPara }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#fffdf9",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        boxSizing: "border-box",
        padding: "30px",
        fontFamily:
          "Arial, Helvetica, sans-serif",
      }}
    >
      {/* ==============================
          LOGO
      ============================== */}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "15px",
        }}
      >
        <img
          src="/logo.png"
          alt="Logo Pulsan"
          style={{
            width: "95px",
            height: "95px",
            objectFit: "contain",
          }}
        />

        <div
          style={{
            marginTop: "6px",
            fontSize: "23px",
            fontWeight: "800",
            letterSpacing: "6px",
            color: "#173b38",
          }}
        >
          PULSAN
        </div>
      </div>

      {/* ==============================
          FRASE PRINCIPAL
      ============================== */}

      <section
        style={{
          textAlign: "center",
          maxWidth: "850px",
          marginTop: "30px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "52px",
            lineHeight: "1.08",
            fontWeight: "800",
            color: "#172c35",
          }}
        >
          Você não precisa
          <br />
          passar por tudo
          <br />
          <span
            style={{
              color: "#20adb0",
            }}
          >
            sozinho.
          </span>
        </h1>

        <p
          style={{
            marginTop: "22px",
            fontSize: "18px",
            lineHeight: "1.5",
            color: "#777",
          }}
        >
          Um espaço seguro para falar,
          ouvir e acolher.
        </p>
      </section>

      {/* ==============================
          BOTÕES DE ACESSO
      ============================== */}

      <section
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          maxWidth: "380px",
          marginTop: "30px",
          gap: "12px",
        }}
      >
        {/* ENTRAR */}

        <button
          type="button"
          onClick={() => irPara("login")}
          style={{
            width: "100%",
            border: "none",
            background: "#20adb0",
            color: "#ffffff",
            padding: "15px 30px",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          Entrar
        </button>

        {/* CRIAR CONTA */}

        <button
          type="button"
          onClick={() => irPara("cadastro")}
          style={{
            width: "100%",
            border:
              "2px solid #20adb0",
            background: "#ffffff",
            color: "#168f92",
            padding: "13px 30px",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          Criar minha conta
        </button>
      </section>

      {/* ==============================
          BENEFÍCIOS
      ============================== */}

      <section
        style={{
          width: "100%",
          maxWidth: "1000px",
          marginTop: "55px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            color: "#173b38",
            fontSize: "27px",
            marginBottom: "25px",
          }}
        >
          Por que usar o Pulsan?
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3, 1fr)",
            gap: "18px",
          }}
        >
          {/* ACOLHIMENTO */}

          <div
            style={{
              background: "#ffffff",
              border:
                "1px solid #e5e5e5",
              borderRadius: "18px",
              padding: "25px 18px",
              textAlign: "center",
              boxShadow:
                "0 5px 18px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                fontSize: "32px",
                marginBottom: "12px",
              }}
            >
              💚
            </div>

            <h3
              style={{
                color: "#173b38",
                margin:
                  "0 0 10px",
                fontSize: "19px",
              }}
            >
              Acolhimento
            </h3>

            <p
              style={{
                color: "#777",
                fontSize: "14px",
                lineHeight: "1.5",
                margin: 0,
              }}
            >
              Um espaço para ser
              ouvido, compartilhar
              e encontrar apoio.
            </p>
          </div>

          {/* COMUNIDADE */}

          <div
            style={{
              background: "#ffffff",
              border:
                "1px solid #e5e5e5",
              borderRadius: "18px",
              padding: "25px 18px",
              textAlign: "center",
              boxShadow:
                "0 5px 18px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                fontSize: "32px",
                marginBottom: "12px",
              }}
            >
              🤝
            </div>

            <h3
              style={{
                color: "#173b38",
                margin:
                  "0 0 10px",
                fontSize: "19px",
              }}
            >
              Comunidade
            </h3>

            <p
              style={{
                color: "#777",
                fontSize: "14px",
                lineHeight: "1.5",
                margin: 0,
              }}
            >
              Pessoas ajudando
              pessoas através da
              escuta e da empatia.
            </p>
          </div>

          {/* ESPAÇO SEGURO */}

          <div
            style={{
              background: "#ffffff",
              border:
                "1px solid #e5e5e5",
              borderRadius: "18px",
              padding: "25px 18px",
              textAlign: "center",
              boxShadow:
                "0 5px 18px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                fontSize: "32px",
                marginBottom: "12px",
              }}
            >
              🌱
            </div>

            <h3
              style={{
                color: "#173b38",
                margin:
                  "0 0 10px",
                fontSize: "19px",
              }}
            >
              Espaço seguro
            </h3>

            <p
              style={{
                color: "#777",
                fontSize: "14px",
                lineHeight: "1.5",
                margin: 0,
              }}
            >
              Um ambiente criado
              para conversar de
              maneira simples e
              respeitosa.
            </p>
          </div>
        </div>
      </section>

      {/* ==============================
          PRIVACIDADE
      ============================== */}

      <div
        style={{
          marginTop: "35px",
          marginBottom: "20px",
          fontSize: "14px",
          color: "#888",
          textAlign: "center",
        }}
      >
        🔒 Sua privacidade é
        importante para nós.
      </div>
    </div>
  );
}

export default Inicio;