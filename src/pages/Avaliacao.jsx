import React, { useState } from "react";

function Avaliacao({ irPara }) {
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState("");

  // ==========================================
  // CALCULAR PONTOS DA AVALIAÇÃO
  // ==========================================

  function calcularPontos(notaRecebida) {
    const pontosPorNota = {
      1: 5,
      2: 10,
      3: 20,
      4: 35,
      5: 50,
    };

    return pontosPorNota[notaRecebida] || 0;
  }


  // ==========================================
  // ENVIAR AVALIAÇÃO
  // ==========================================

  function enviarAvaliacao(e) {
    e.preventDefault();

    // ========================================
    // VERIFICAR NOTA
    // ========================================

    if (nota === 0) {
      alert("Escolha uma nota antes de enviar.");
      return;
    }


    // ========================================
    // BUSCAR AVALIAÇÕES EXISTENTES
    // ========================================

    const avaliacoesExistentes =
      JSON.parse(
        localStorage.getItem(
          "pulsanAvaliacoes"
        ) || "[]"
      );


    // ========================================
    // CALCULAR PONTOS
    // ========================================

    const pontosGanhos =
      calcularPontos(nota);


    // ========================================
    // BUSCAR PONTOS ATUAIS
    // ========================================

    const pontosAtuais =
      Number(
        localStorage.getItem(
          "pulsanPontos"
        ) || 0
      );


    // ========================================
    // NOVO TOTAL DE PONTOS
    // ========================================

    const novoTotalPontos =
      pontosAtuais + pontosGanhos;


    // ========================================
    // CRIAR NOVA AVALIAÇÃO
    // ========================================

    const novaAvaliacao = {
      id: Date.now(),
      nota: Number(nota),
      comentario: comentario.trim(),
      pontosGanhos: pontosGanhos,
      data: new Date().toLocaleDateString(
        "pt-BR"
      ),
    };


    // ========================================
    // ADICIONAR AVALIAÇÃO
    // ========================================

    const novasAvaliacoes = [
      ...avaliacoesExistentes,
      novaAvaliacao,
    ];


    // ========================================
    // SALVAR AVALIAÇÕES
    // ========================================

    localStorage.setItem(
      "pulsanAvaliacoes",
      JSON.stringify(
        novasAvaliacoes
      )
    );


    // ========================================
    // SALVAR PONTOS
    // ========================================

    localStorage.setItem(
      "pulsanPontos",
      String(novoTotalPontos)
    );


    // ========================================
    // CONTABILIZAR AJUDA
    // ========================================

    const ajudasAtuais =
      Number(
        localStorage.getItem(
          "pulsanAjudas"
        ) || 0
      );


    localStorage.setItem(
      "pulsanAjudas",
      String(ajudasAtuais + 1)
    );


    // ========================================
    // MARCAR CONVERSA COMO FINALIZADA
    // ========================================

    localStorage.setItem(
      "pulsanConversaFinalizada",
      "true"
    );


    // ========================================
    // AVISO
    // ========================================

    alert(
      `Avaliação enviada com sucesso! 💚\n\n` +
      `Você recebeu +${pontosGanhos} pontos! 🏆\n\n` +
      `Total de pontos: ${novoTotalPontos}`
    );


    // ========================================
    // LIMPAR CAMPOS
    // ========================================

    setNota(0);
    setComentario("");


    // ========================================
    // IR PARA O PERFIL
    // ========================================

    irPara("perfil");
  }


  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fffdf9",
        fontFamily:
          "Arial, Helvetica, sans-serif",
        color: "#173b38",
        paddingBottom: "40px",
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
          gap: "15px",
          borderBottom:
            "1px solid #ead8d2",
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

      </header>


      {/* ==========================================
          CONTEÚDO
      ========================================== */}

      <main
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          padding: "45px 25px",
        }}
      >

        <section
          style={{
            background: "#ffffff",
            borderRadius: "22px",
            padding: "35px",
            boxShadow:
              "0 5px 20px rgba(0,0,0,0.05)",
            border:
              "1px solid #e5e5e5",
          }}
        >

          {/* ÍCONE */}

          <div
            style={{
              textAlign: "center",
              fontSize: "42px",
              marginBottom: "15px",
            }}
          >
            💚
          </div>


          {/* TÍTULO */}

          <h1
            style={{
              textAlign: "center",
              margin: "0",
              fontSize: "30px",
              color: "#173b38",
            }}
          >
            Como foi sua experiência?
          </h1>


          <p
            style={{
              textAlign: "center",
              color: "#777",
              lineHeight: "1.5",
              marginBottom: "35px",
            }}
          >
            Sua avaliação ajuda o Pulsan
            a se tornar um espaço cada vez
            melhor e mais acolhedor.
          </p>


          {/* ========================================
              ESTRELAS
          ======================================== */}

          <div
            style={{
              textAlign: "center",
              marginBottom: "30px",
            }}
          >

            <h2
              style={{
                fontSize: "19px",
                marginBottom: "15px",
              }}
            >
              Avalie quem ajudou você
            </h2>


            <div
              style={{
                display: "flex",
                justifyContent:
                  "center",
                gap: "8px",
              }}
            >

              {[1, 2, 3, 4, 5].map(
                (estrela) => (

                  <button
                    key={estrela}
                    type="button"
                    onClick={() =>
                      setNota(estrela)
                    }
                    aria-label={`Dar ${estrela} estrelas`}
                    style={{
                      border: "none",
                      background:
                        "transparent",
                      cursor: "pointer",
                      fontSize: "40px",
                      color:
                        estrela <= nota
                          ? "#f2bd3d"
                          : "#d8d8d8",
                      padding: "3px",
                    }}
                  >
                    ★
                  </button>

                )
              )}

            </div>


            <p
              style={{
                color: "#777",
                marginTop: "8px",
              }}
            >

              {nota === 0 &&
                "Escolha uma nota"}

              {nota === 1 &&
                "Muito ruim — +5 pontos"}

              {nota === 2 &&
                "Ruim — +10 pontos"}

              {nota === 3 &&
                "Regular — +20 pontos"}

              {nota === 4 &&
                "Boa — +35 pontos"}

              {nota === 5 &&
                "Excelente 💚 — +50 pontos"}

            </p>

          </div>


          {/* ========================================
              COMENTÁRIO
          ======================================== */}

          <form
            onSubmit={enviarAvaliacao}
          >

            <label
              htmlFor="comentario"
              style={{
                display: "block",
                fontWeight: "700",
                marginBottom: "10px",
              }}
            >
              Quer contar um pouco mais?
            </label>


            <textarea
              id="comentario"
              value={comentario}
              onChange={(e) =>
                setComentario(
                  e.target.value
                )
              }
              placeholder="Conte como foi sua experiência com a pessoa que ajudou você..."
              maxLength={500}
              rows={5}
              style={{
                width: "100%",
                boxSizing:
                  "border-box",
                border:
                  "1px solid #ddd",
                borderRadius: "14px",
                padding: "15px",
                resize: "vertical",
                fontFamily:
                  "inherit",
                fontSize: "15px",
                outline: "none",
              }}
            />


            {/* CONTADOR */}

            <div
              style={{
                textAlign: "right",
                color: "#999",
                fontSize: "12px",
                marginTop: "5px",
              }}
            >
              {comentario.length}/500
            </div>


            {/* BOTÃO */}

            <button
              type="submit"
              style={{
                width: "100%",
                border: "none",
                background: "#20adb0",
                color: "#ffffff",
                padding: "15px",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "700",
                cursor: "pointer",
                marginTop: "20px",
              }}
            >
              Enviar avaliação
            </button>

          </form>


          {/* ========================================
              INFORMAÇÃO SOBRE PONTOS
          ======================================== */}

          <div
            style={{
              marginTop: "25px",
              padding: "18px",
              background: "#fff8e6",
              border:
                "1px solid #f1dfad",
              borderRadius: "14px",
              textAlign: "center",
            }}
          >

            <strong
              style={{
                display: "block",
                color: "#9a7415",
                marginBottom: "6px",
              }}
            >
              🏆 Ganhe pontos ajudando
            </strong>

            <span
              style={{
                color: "#777",
                fontSize: "13px",
                lineHeight: "1.5",
              }}
            >
              Sua avaliação gera pontos para
              quem ofereceu apoio. Quanto melhor
              a experiência, maior a recompensa.
            </span>

          </div>


          {/* ========================================
              PRIVACIDADE
          ======================================== */}

          <div
            style={{
              textAlign: "center",
              color: "#888",
              fontSize: "13px",
              marginTop: "25px",
            }}
          >
            🔒 Sua avaliação pode ser enviada
            de forma anônima.
          </div>


          {/* ========================================
              VOLTAR
          ======================================== */}

          <button
            type="button"
            onClick={() =>
              irPara("perfil")
            }
            style={{
              width: "100%",
              border: "none",
              background:
                "transparent",
              color: "#168f92",
              fontWeight: "700",
              cursor: "pointer",
              marginTop: "20px",
            }}
          >
            ← Voltar para o perfil
          </button>

        </section>

      </main>

    </div>
  );
}

export default Avaliacao;