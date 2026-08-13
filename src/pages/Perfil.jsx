import React, { useState } from "react";

function Perfil({ irPara }) {
  // =====================================
  // DADOS DO USUÁRIO
  // =====================================

  const nome =
    localStorage.getItem("pulsanNome") ||
    "Usuário Pulsan";

  const foto =
    localStorage.getItem("pulsanFoto") || "";

  // =====================================
  // AVALIAÇÕES
  // =====================================

  const avaliacoesSalvas =
    JSON.parse(
      localStorage.getItem("pulsanAvaliacoes") || "[]"
    );

  const quantidadeAvaliacoes =
    avaliacoesSalvas.length;

  const media =
    quantidadeAvaliacoes > 0
      ? (
          avaliacoesSalvas.reduce(
            (total, avaliacao) =>
              total +
              Number(avaliacao.nota || 0),
            0
          ) / quantidadeAvaliacoes
        ).toFixed(1)
      : "—";

  // =====================================
  // SELO DE APOIADOR
  // =====================================

  const possuiSeloApoiador =
    quantidadeAvaliacoes >= 10 &&
    Number(media) >= 4.5;

  // =====================================
  // PSICÓLOGO PARCEIRO
  // =====================================

  const possuiSeloPsicologo =
    localStorage.getItem(
      "pulsanPsicologoParceiro"
    ) === "true";

  // =====================================
  // QUANTIDADE DE AJUDAS
  // =====================================

  const quantidadeAjudas =
    Number(
      localStorage.getItem("pulsanAjudas") || 0
    );

  // =====================================
  // PONTOS
  // =====================================

  const pontos =
    Number(
      localStorage.getItem("pulsanPontos") || 0
    );

  // =====================================
  // EDITAR NOME
  // =====================================

  const [editando, setEditando] =
    useState(false);

  const [novoNome, setNovoNome] =
    useState(nome);

  function salvarNome() {
    const nomeLimpo = novoNome.trim();

    if (!nomeLimpo) {
      alert("Digite um nome.");
      return;
    }

    localStorage.setItem(
      "pulsanNome",
      nomeLimpo
    );

    setEditando(false);

    alert(
      "Nome atualizado com sucesso! 💚"
    );
  }

  // =====================================
  // SAIR
  // =====================================

  function sair() {
    const confirmar =
      window.confirm(
        "Deseja realmente sair da sua conta?"
      );

    if (!confirmar) {
      return;
    }

    irPara("inicio");
  }

  // =====================================
  // ESTRELAS
  // =====================================

  function mostrarEstrelas() {
    if (quantidadeAvaliacoes === 0) {
      return "☆☆☆☆☆";
    }

    const estrelasCheias =
      Math.round(Number(media));

    return (
      "★".repeat(estrelasCheias) +
      "☆".repeat(5 - estrelasCheias)
    );
  }

  // =====================================
  // PERFIL
  // =====================================

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
          background:
            "linear-gradient(135deg, #f6d7c8, #f9e6dc)",
          padding: "20px 35px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom:
            "1px solid #eadbd4",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
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
                fontSize: "22px",
                letterSpacing: "4px",
              }}
            >
              PULSAN
            </strong>

            <span
              style={{
                color: "#666",
                fontSize: "14px",
              }}
            >
              Meu perfil
            </span>
          </div>
        </div>
      </header>

      {/* =====================================
          CONTEÚDO
      ===================================== */}

      <main
        style={{
          maxWidth: "900px",
          margin: "40px auto",
          padding: "0 25px",
        }}
      >
        {/* =====================================
            PERFIL PRINCIPAL
        ===================================== */}

        <section
          style={{
            background: "#ffffff",
            borderRadius: "22px",
            padding: "35px",
            boxShadow:
              "0 8px 25px rgba(0,0,0,0.05)",
            border:
              "1px solid #eeeeee",
            textAlign: "center",
          }}
        >
          {/* FOTO */}

          <div
            style={{
              width: "110px",
              height: "110px",
              borderRadius: "50%",
              margin: "0 auto 20px",
              overflow: "hidden",
              background: "#e7f5f3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "48px",
            }}
          >
            {foto ? (
              <img
                src={foto}
                alt={`Foto de ${nome}`}
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

          {/* NOME */}

          {!editando ? (
            <>
              <h1
                style={{
                  margin: "0",
                  fontSize: "30px",
                  color: "#173b38",
                }}
              >
                {nome}
              </h1>

              {/* SELO PSICÓLOGO */}

              {possuiSeloPsicologo && (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "7px",
                    marginTop: "10px",
                    marginRight: "6px",
                    padding: "8px 14px",
                    borderRadius: "20px",
                    background: "#eaf4ff",
                    border:
                      "1px solid #b9d8f5",
                    color: "#27628f",
                    fontSize: "13px",
                    fontWeight: "700",
                  }}
                >
                  🧠 Psicólogo Parceiro
                </div>
              )}

              {/* SELO APOIADOR */}

              {possuiSeloApoiador && (
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "7px",
                    marginTop: "10px",
                    padding: "8px 14px",
                    borderRadius: "20px",
                    background: "#fff8df",
                    border:
                      "1px solid #f0d98a",
                    color: "#9a7410",
                    fontSize: "13px",
                    fontWeight: "700",
                  }}
                >
                  🏅 Apoiador de Confiança
                </div>
              )}

              <div>
                <button
                  type="button"
                  onClick={() =>
                    setEditando(true)
                  }
                  style={{
                    display: "block",
                    margin:
                      "12px auto 0",
                    border: "none",
                    background:
                      "transparent",
                    color: "#15999c",
                    fontWeight: "700",
                    cursor: "pointer",
                    fontSize: "15px",
                  }}
                >
                  ✏️ Editar nome
                </button>
              </div>
            </>
          ) : (
            <div
              style={{
                maxWidth: "400px",
                margin: "0 auto",
              }}
            >
              <input
                value={novoNome}
                onChange={(e) =>
                  setNovoNome(e.target.value)
                }
                placeholder="Seu nome"
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: "10px",
                  border:
                    "1px solid #ccc",
                  boxSizing:
                    "border-box",
                  fontSize: "16px",
                }}
              />

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "12px",
                  justifyContent:
                    "center",
                }}
              >
                <button
                  type="button"
                  onClick={salvarNome}
                  style={{
                    background:
                      "#20adb0",
                    color: "#fff",
                    border: "none",
                    padding:
                      "11px 20px",
                    borderRadius: "10px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  Salvar
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setNovoNome(nome);
                    setEditando(false);
                  }}
                  style={{
                    background: "#eee",
                    color: "#555",
                    border: "none",
                    padding:
                      "11px 20px",
                    borderRadius: "10px",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </section>

        {/* =====================================
            ESTATÍSTICAS
        ===================================== */}

        <section
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(190px, 1fr))",
            gap: "18px",
            marginTop: "25px",
          }}
        >
          {/* MÉDIA */}

          <div
            style={{
              background: "#fff",
              border:
                "1px solid #e7e7e7",
              borderRadius: "18px",
              padding: "25px 15px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "30px" }}>
              ⭐
            </div>

            <strong
              style={{
                display: "block",
                fontSize: "28px",
                marginTop: "8px",
              }}
            >
              {media}
            </strong>

            <div
              style={{
                color: "#f1b62b",
                fontSize: "22px",
                marginTop: "5px",
              }}
            >
              {mostrarEstrelas()}
            </div>

            <p
              style={{
                color: "#777",
                margin: "8px 0 0",
                fontSize: "14px",
              }}
            >
              Média das avaliações
            </p>
          </div>

          {/* AVALIAÇÕES */}

          <div
            style={{
              background: "#fff",
              border:
                "1px solid #e7e7e7",
              borderRadius: "18px",
              padding: "25px 15px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "30px" }}>
              💬
            </div>

            <strong
              style={{
                display: "block",
                fontSize: "28px",
                marginTop: "8px",
              }}
            >
              {quantidadeAvaliacoes}
            </strong>

            <p
              style={{
                color: "#777",
                margin: "8px 0 0",
                fontSize: "14px",
              }}
            >
              Avaliações recebidas
            </p>
          </div>

          {/* AJUDAS */}

          <div
            style={{
              background: "#fff",
              border:
                "1px solid #e7e7e7",
              borderRadius: "18px",
              padding: "25px 15px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "30px" }}>
              💚
            </div>

            <strong
              style={{
                display: "block",
                fontSize: "28px",
                marginTop: "8px",
              }}
            >
              {quantidadeAjudas}
            </strong>

            <p
              style={{
                color: "#777",
                margin: "8px 0 0",
                fontSize: "14px",
              }}
            >
              Pessoas ajudadas
            </p>
          </div>

          {/* PONTOS */}

          <div
            style={{
              background:
                "linear-gradient(135deg, #fff8e6, #fffdf7)",
              border:
                "1px solid #f1dfad",
              borderRadius: "18px",
              padding: "25px 15px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "30px" }}>
              🏆
            </div>

            <strong
              style={{
                display: "block",
                fontSize: "28px",
                marginTop: "8px",
                color: "#b48619",
              }}
            >
              {pontos}
            </strong>

            <p
              style={{
                color: "#777",
                margin: "8px 0 0",
                fontSize: "14px",
              }}
            >
              Pontos acumulados
            </p>
          </div>
        </section>

        {/* =====================================
            PRÊMIOS
        ===================================== */}

        <section
          style={{
            marginTop: "25px",
            background:
              "linear-gradient(135deg, #20adb0, #168f92)",
            borderRadius: "20px",
            padding: "28px",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent:
              "space-between",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "30px",
                marginBottom: "5px",
              }}
            >
              🎁
            </div>

            <h2
              style={{
                margin: "0 0 7px",
                fontSize: "22px",
              }}
            >
              Troque seus pontos
            </h2>

            <p
              style={{
                margin: 0,
                opacity: 0.9,
                lineHeight: "1.5",
              }}
            >
              Acumule pontos ajudando pessoas
              e troque por benefícios e prêmios.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              irPara("premios")
            }
            style={{
              border: "none",
              background: "#ffffff",
              color: "#168f92",
              padding: "13px 23px",
              borderRadius: "12px",
              fontWeight: "700",
              fontSize: "15px",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            🎁 Ver prêmios
          </button>
        </section>

        {/* =====================================
            COMO GANHAR PONTOS
        ===================================== */}

        <section
          style={{
            marginTop: "25px",
            background: "#fffaf0",
            border:
              "1px solid #f1dfad",
            borderRadius: "18px",
            padding: "25px",
          }}
        >
          <h2
            style={{
              margin: "0 0 12px",
              fontSize: "21px",
            }}
          >
            🏆 Como ganhar pontos?
          </h2>

          <p
            style={{
              color: "#666",
              lineHeight: "1.6",
              margin: 0,
            }}
          >
            Ao oferecer apoio para alguém,
            você poderá receber uma avaliação
            ao finalizar a conversa. As avaliações
            ajudam a construir sua reputação e
            também podem gerar pontos para trocar
            por prêmios.
          </p>
        </section>

        {/* =====================================
            REPUTAÇÃO
        ===================================== */}

        <section
          style={{
            background: "#f0faf8",
            borderRadius: "18px",
            padding: "25px",
            marginTop: "25px",
            border:
              "1px solid #d9efeb",
          }}
        >
          <h2
            style={{
              margin: "0 0 10px",
              fontSize: "21px",
            }}
          >
            ⭐ Sua reputação no Pulsan
          </h2>

          <p
            style={{
              color: "#666",
              lineHeight: "1.6",
              margin: 0,
            }}
          >
            Sua média é calculada a partir
            das avaliações recebidas das
            pessoas que você ajudou. Quanto
            mais conversas você realizar com
            respeito, empatia e acolhimento,
            mais sua reputação poderá crescer.
          </p>

          {/* STATUS DO SELO */}

          <div
            style={{
              marginTop: "18px",
              padding: "15px",
              background: "#ffffff",
              borderRadius: "14px",
              border:
                "1px solid #dceeea",
            }}
          >
            {possuiSeloApoiador ? (
              <>
                <strong
                  style={{
                    color: "#9a7410",
                    display: "block",
                    marginBottom: "5px",
                  }}
                >
                  🏅 Você possui o selo
                  Apoiador de Confiança
                </strong>

                <span
                  style={{
                    color: "#777",
                    fontSize: "13px",
                  }}
                >
                  Sua reputação atingiu os
                  requisitos mínimos.
                </span>
              </>
            ) : (
              <>
                <strong
                  style={{
                    color: "#173b38",
                    display: "block",
                    marginBottom: "5px",
                  }}
                >
                  🏅 Como conquistar o selo
                </strong>

                <span
                  style={{
                    color: "#777",
                    fontSize: "13px",
                    lineHeight: "1.5",
                  }}
                >
                  Tenha pelo menos 10 avaliações
                  e mantenha uma média de 4,5
                  ou mais.
                </span>
              </>
            )}
          </div>
        </section>

        {/* =====================================
            PRIVACIDADE
        ===================================== */}

        <section
          style={{
            marginTop: "25px",
            padding: "22px",
            background: "#fff",
            borderRadius: "18px",
            border:
              "1px solid #eeeeee",
          }}
        >
          <h3
            style={{
              margin: "0 0 8px",
            }}
          >
            🔒 Privacidade
          </h3>

          <p
            style={{
              margin: 0,
              color: "#777",
              lineHeight: "1.5",
            }}
          >
            A identidade das pessoas que
            pedem ajuda permanece protegida.
            Apenas quem oferece ajuda tem
            seu perfil identificado na conversa.
          </p>
        </section>

        {/* =====================================
            SAIR
        ===================================== */}

        <button
          type="button"
          onClick={sair}
          style={{
            display: "block",
            margin: "30px auto 0",
            padding: "13px 35px",
            borderRadius: "12px",
            border:
              "1px solid #e0aaaa",
            background: "#fff5f5",
            color: "#b64a4a",
            fontWeight: "700",
            cursor: "pointer",
            fontSize: "15px",
          }}
        >
          🚪 Sair da conta
        </button>
      </main>

      {/* =====================================
          NAVEGAÇÃO
          CONVERSAS → AJUDAR → PERFIL
      ===================================== */}

      <nav
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "75px",
          background: "#ffffff",
          borderTop:
            "1px solid #e8e8e8",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "90px",
          boxShadow:
            "0 -4px 15px rgba(0,0,0,0.04)",
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
            background: "transparent",
            cursor: "pointer",
            color: "#777",
            fontSize: "14px",
          }}
        >
          <div
            style={{
              fontSize: "25px",
            }}
          >
            💬
          </div>

          Conversas
        </button>

        {/* AJUDAR */}

        <button
          type="button"
          onClick={() =>
            irPara("ajudar")
          }
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "#777",
            fontSize: "14px",
          }}
        >
          <div
            style={{
              fontSize: "25px",
            }}
          >
            💚
          </div>

          Ajudar
        </button>

        {/* PERFIL */}

        <button
          type="button"
          style={{
            border: "none",
            background: "transparent",
            cursor: "default",
            color: "#20adb0",
            fontSize: "14px",
            fontWeight: "700",
          }}
        >
          <div
            style={{
              fontSize: "25px",
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

export default Perfil;