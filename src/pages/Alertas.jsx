import React, { useEffect, useState } from "react";

function Alertas({ irPara }) {
  // =====================================================
  // ALERTAS REAIS
  // =====================================================

  const [alertas, setAlertas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [alertaSelecionado, setAlertaSelecionado] = useState(null);

  // =====================================================
  // BUSCAR ALERTAS DO SERVIDOR
  // =====================================================

  async function carregarAlertas() {
    try {
      setErro("");

      const tipo =
        localStorage.getItem("pulsanTipo") || "equipe_pulsan";

      const psicologoId =
        localStorage.getItem("pulsanUsuarioAtual") || "";

      let url = `http://localhost:3001/api/alertas?tipo=${encodeURIComponent(
        tipo
      )}`;

      if (tipo === "psicologo" && psicologoId) {
        url += `&psicologoId=${encodeURIComponent(psicologoId)}`;
      }

      const resposta = await fetch(url);

      if (!resposta.ok) {
        throw new Error("Não foi possível carregar os alertas.");
      }

      const dados = await resposta.json();

      const lista = Array.isArray(dados)
        ? dados
        : Array.isArray(dados.alertas)
        ? dados.alertas
        : [];

      const alertasFormatados = lista
        .map((alerta) => {
          const tipoAlerta =
            alerta.classificacao ||
            alerta.prioridade ||
            alerta.tipo ||
            "intermediario";

          let tipoNormalizado = String(tipoAlerta)
            .toLowerCase()
            .trim();

          if (
            tipoNormalizado === "critica" ||
            tipoNormalizado === "crítica"
          ) {
            tipoNormalizado = "urgente";
          }

          if (tipoNormalizado === "alta") {
            tipoNormalizado = "grave";
          }

          if (tipoNormalizado === "media" ||
              tipoNormalizado === "média") {
            tipoNormalizado = "intermediario";
          }

          if (
            !["urgente", "grave", "intermediario"].includes(
              tipoNormalizado
            )
          ) {
            return null;
          }

          const texto =
            alerta.texto ||
            alerta.descricao ||
            alerta.mensagem ||
            alerta.motivo ||
            "Situação identificada pela IA.";

          const motivo =
            alerta.motivo ||
            alerta.descricao ||
            alerta.resumo ||
            "Foi identificada uma situação que precisa de atenção.";

          const categoria =
            alerta.tipo_situacao ||
            alerta.categoria ||
            alerta.tipo ||
            "outro";

          const ambiente =
            alerta.ambiente === "escolar"
              ? "Escolar"
              : alerta.ambiente === "empresa"
              ? "Empresa"
              : "Plataforma";

          return {
            ...alerta,

            id:
              alerta.id ||
              alerta.alerta_id ||
              Math.random(),

            tipo: tipoNormalizado,

            titulo:
              alerta.titulo ||
              tituloPorTipo(tipoNormalizado),

            descricao: motivo,

            texto,

            categoria: formatarCategoria(categoria),

            ambiente,

            visualizado:
              alerta.visualizado === true ||
              alerta.visualizado === "true",

            resolvido:
              alerta.resolvido === true ||
              alerta.resolvido === "true",
          };
        })
        .filter(Boolean);

      // =====================================================
      // ORDEM DE PRIORIDADE
      // =====================================================

      const ordem = {
        urgente: 3,
        grave: 2,
        intermediario: 1,
      };

      alertasFormatados.sort((a, b) => {
        const prioridadeA = ordem[a.tipo] || 0;
        const prioridadeB = ordem[b.tipo] || 0;

        if (prioridadeB !== prioridadeA) {
          return prioridadeB - prioridadeA;
        }

        return Number(a.visualizado) - Number(b.visualizado);
      });

      setAlertas(alertasFormatados);
    } catch (error) {
      console.error("Erro ao carregar alertas:", error);

      setErro(
        "Não foi possível carregar os alertas no momento."
      );
    } finally {
      setCarregando(false);
    }
  }

  // =====================================================
  // CARREGAMENTO INICIAL
  // =====================================================

  useEffect(() => {
    carregarAlertas();

    // Atualiza automaticamente a cada 15 segundos
    const intervalo = setInterval(() => {
      carregarAlertas();
    }, 15000);

    return () => clearInterval(intervalo);
  }, []);

  // =====================================================
  // MARCAR COMO VISUALIZADO
  // =====================================================

  async function marcarComoVisualizado(alerta) {
    try {
      const tipo =
        localStorage.getItem("pulsanTipo") || "equipe_pulsan";

      // Abre primeiro o alerta
      setAlertaSelecionado(alerta);

      // Se já estiver visualizado, não precisa fazer nada
      if (alerta.visualizado) {
        return;
      }

      const resposta = await fetch(
        `http://localhost:3001/api/alertas/${alerta.id}/visualizado`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tipo,
          }),
        }
      );

      if (!resposta.ok) {
        throw new Error(
          "Não foi possível marcar o alerta como visualizado."
        );
      }

      // Atualiza somente o alerta localmente
      setAlertas((alertasAtuais) =>
        alertasAtuais.map((item) =>
          item.id === alerta.id
            ? {
                ...item,
                visualizado: true,
              }
            : item
        )
      );

      setAlertaSelecionado((item) =>
        item
          ? {
              ...item,
              visualizado: true,
            }
          : item
      );
    } catch (error) {
      console.error(
        "Erro ao marcar alerta como visualizado:",
        error
      );
    }
  }

  // =====================================================
  // CONTADORES
  // =====================================================

  const quantidadeUrgente = alertas.filter(
    (alerta) => alerta.tipo === "urgente"
  ).length;

  const quantidadeGrave = alertas.filter(
    (alerta) => alerta.tipo === "grave"
  ).length;

  const quantidadeIntermediario = alertas.filter(
    (alerta) => alerta.tipo === "intermediario"
  ).length;

  const quantidadeTotal = alertas.filter(
    (alerta) => !alerta.visualizado
  ).length;

  // =====================================================
  // CONFIGURAÇÃO VISUAL
  // =====================================================

  function configuracaoTipo(tipo) {
    if (tipo === "urgente") {
      return {
        cor: "#d92d20",
        fundo: "#fff0ee",
        bolinha: "🔴",
        nome: "Urgente",
        prioridade: "Crítica",
      };
    }

    if (tipo === "grave") {
      return {
        cor: "#e66a00",
        fundo: "#fff5e8",
        bolinha: "🟠",
        nome: "Grave",
        prioridade: "Alta",
      };
    }

    return {
      cor: "#c99500",
      fundo: "#fff9df",
      bolinha: "🟡",
      nome: "Intermediário",
      prioridade: "Média",
    };
  }

  // =====================================================
  // TÍTULO POR TIPO
  // =====================================================

  function tituloPorTipo(tipo) {
    if (tipo === "urgente") {
      return "Possível situação de risco";
    }

    if (tipo === "grave") {
      return "Situação grave identificada";
    }

    return "Situação que precisa de atenção";
  }

  // =====================================================
  // FORMATAR CATEGORIA
  // =====================================================

  function formatarCategoria(categoria) {
    const categorias = {
      sofrimento_emocional: "Sofrimento emocional",
      bullying: "Bullying",
      cyberbullying: "Cyberbullying",
      assedio: "Assédio",
      ameaça: "Ameaça",
      ameaca: "Ameaça",
      violencia: "Violência",
      discriminacao: "Discriminação",
      perseguicao: "Perseguição",
      automutilacao: "Automutilação",
      risco_suicida: "Risco suicida",
      risco_a_outra_pessoa: "Risco a outra pessoa",
      conflito: "Conflito",
      outro: "Outro",
    };

    return (
      categorias[String(categoria).toLowerCase()] ||
      categoria ||
      "Outro"
    );
  }

  // =====================================================
  // TELA
  // =====================================================

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "var(--pulsan-fundo, #f5f9f8)",
        paddingBottom: "40px",
      }}
    >
      {/* =================================================
          CABEÇALHO
      ================================================= */}

      <div
        style={{
          background:
            "var(--pulsan-card, #ffffff)",
          padding: "20px",
          borderBottom:
            "1px solid var(--pulsan-borda, #e5e5e5)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "15px",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                color:
                  "var(--pulsan-texto, #173b38)",
              }}
            >
              🔔 Alertas
            </h1>

            <p
              style={{
                margin: "6px 0 0",
                color:
                  "var(--pulsan-texto-secundario, #777)",
                fontSize: "14px",
              }}
            >
              Situações que precisam de atenção.
            </p>
          </div>

          {quantidadeTotal > 0 && (
            <div
              style={{
                minWidth: "34px",
                height: "34px",
                borderRadius: "50%",
                background: "#d92d20",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "800",
                fontSize: "13px",
              }}
            >
              {quantidadeTotal}
            </div>
          )}
        </div>
      </div>

      {/* =================================================
          CONTEÚDO
      ================================================= */}

      <div
        style={{
          maxWidth: "700px",
          margin: "0 auto",
          padding: "20px 15px",
        }}
      >
        {/* =================================================
            RESUMO DOS TIPOS
        ================================================= */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3, 1fr)",
            gap: "10px",
            marginBottom: "20px",
          }}
        >
          {/* URGENTES */}

          <div
            style={{
              background: "#fff0ee",
              borderRadius: "18px",
              padding: "14px 10px",
              textAlign: "center",
              border: "1px solid #f3d0cb",
            }}
          >
            <div style={{ fontSize: "20px" }}>
              🔴
            </div>

            <strong
              style={{
                display: "block",
                marginTop: "4px",
                color: "#d92d20",
                fontSize: "13px",
              }}
            >
              Urgentes
            </strong>

            <div
              style={{
                fontSize: "20px",
                fontWeight: "800",
                color: "#d92d20",
                marginTop: "3px",
              }}
            >
              {quantidadeUrgente}
            </div>
          </div>

          {/* GRAVES */}

          <div
            style={{
              background: "#fff5e8",
              borderRadius: "18px",
              padding: "14px 10px",
              textAlign: "center",
              border: "1px solid #f2d8b5",
            }}
          >
            <div style={{ fontSize: "20px" }}>
              🟠
            </div>

            <strong
              style={{
                display: "block",
                marginTop: "4px",
                color: "#e66a00",
                fontSize: "13px",
              }}
            >
              Graves
            </strong>

            <div
              style={{
                fontSize: "20px",
                fontWeight: "800",
                color: "#e66a00",
                marginTop: "3px",
              }}
            >
              {quantidadeGrave}
            </div>
          </div>

          {/* INTERMEDIÁRIOS */}

          <div
            style={{
              background: "#fff9df",
              borderRadius: "18px",
              padding: "14px 10px",
              textAlign: "center",
              border: "1px solid #eee0a9",
            }}
          >
            <div style={{ fontSize: "20px" }}>
              🟡
            </div>

            <strong
              style={{
                display: "block",
                marginTop: "4px",
                color: "#c99500",
                fontSize: "13px",
              }}
            >
              Intermediários
            </strong>

            <div
              style={{
                fontSize: "20px",
                fontWeight: "800",
                color: "#c99500",
                marginTop: "3px",
              }}
            >
              {quantidadeIntermediario}
            </div>
          </div>
        </div>

        {/* =================================================
            TÍTULO
        ================================================= */}

        <h2
          style={{
            color:
              "var(--pulsan-texto, #173b38)",
            fontSize: "20px",
            marginBottom: "14px",
          }}
        >
          Alertas recentes
        </h2>

        {/* =================================================
            CARREGANDO
        ================================================= */}

        {carregando ? (
          <div
            style={{
              background:
                "var(--pulsan-card, #ffffff)",
              borderRadius: "22px",
              padding: "40px 20px",
              textAlign: "center",
              border:
                "1px solid var(--pulsan-borda, #e5e5e5)",
            }}
          >
            <div
              style={{
                fontSize: "35px",
                marginBottom: "10px",
              }}
            >
              🔄
            </div>

            <h3>Carregando alertas...</h3>

            <p
              style={{
                color:
                  "var(--pulsan-texto-secundario, #777)",
              }}
            >
              Buscando situações identificadas pela IA.
            </p>
          </div>
        ) : erro ? (
          <div
            style={{
              background:
                "var(--pulsan-card, #ffffff)",
              borderRadius: "22px",
              padding: "30px 20px",
              textAlign: "center",
              border:
                "1px solid var(--pulsan-borda, #e5e5e5)",
            }}
          >
            <div style={{ fontSize: "40px" }}>
              ⚠️
            </div>

            <h3>Não foi possível carregar</h3>

            <p
              style={{
                color:
                  "var(--pulsan-texto-secundario, #777)",
              }}
            >
              {erro}
            </p>

            <button
              type="button"
              onClick={carregarAlertas}
              style={{
                border: "none",
                borderRadius: "14px",
                padding: "11px 18px",
                background: "#20adb0",
                color: "#ffffff",
                fontWeight: "700",
                cursor: "pointer",
              }}
            >
              🔄 Tentar novamente
            </button>
          </div>
        ) : alertas.length === 0 ? (
          <div
            style={{
              background:
                "var(--pulsan-card, #ffffff)",
              borderRadius: "22px",
              padding: "40px 20px",
              textAlign: "center",
              border:
                "1px solid var(--pulsan-borda, #e5e5e5)",
            }}
          >
            <div style={{ fontSize: "42px" }}>
              ✅
            </div>

            <h3>Nenhum alerta</h3>

            <p
              style={{
                color:
                  "var(--pulsan-texto-secundario, #777)",
              }}
            >
              Não existem situações aguardando atenção.
            </p>
          </div>
        ) : (
          alertas.map((alerta) => {
            const config =
              configuracaoTipo(alerta.tipo);

            return (
              <div
                key={alerta.id}
                style={{
                  background:
                    "var(--pulsan-card, #ffffff)",
                  borderRadius: "22px",
                  padding: "18px",
                  marginBottom: "14px",
                  border:
                    alerta.visualizado
                      ? "1px solid var(--pulsan-borda, #e5e5e5)"
                      : `2px solid ${config.cor}`,
                  boxShadow:
                    "0 5px 18px rgba(0,0,0,0.05)",
                  opacity:
                    alerta.visualizado
                      ? 0.82
                      : 1,
                }}
              >
                {/* TOPO */}

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "22px",
                    }}
                  >
                    {config.bolinha}
                  </div>

                  <div style={{ flex: 1 }}>
                    <strong
                      style={{
                        color: config.cor,
                        fontSize: "14px",
                      }}
                    >
                      {config.nome}
                    </strong>

                    {!alerta.visualizado && (
                      <span
                        style={{
                          marginLeft: "8px",
                          fontSize: "10px",
                          background: config.cor,
                          color: "#ffffff",
                          padding: "4px 7px",
                          borderRadius: "8px",
                          fontWeight: "700",
                        }}
                      >
                        NOVO
                      </span>
                    )}
                  </div>
                </div>

                {/* TÍTULO */}

                <h3
                  style={{
                    margin:
                      "12px 0 7px",
                    color:
                      "var(--pulsan-texto, #173b38)",
                  }}
                >
                  {alerta.titulo}
                </h3>

                {/* DESCRIÇÃO */}

                <p
                  style={{
                    margin: 0,
                    lineHeight: "1.5",
                    color:
                      "var(--pulsan-texto-secundario, #666)",
                  }}
                >
                  {alerta.descricao}
                </p>

                {/* INFORMAÇÕES */}

                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "7px",
                    marginTop: "14px",
                  }}
                >
                  <span
                    style={{
                      background: config.fundo,
                      color: config.cor,
                      padding: "6px 9px",
                      borderRadius: "9px",
                      fontSize: "11px",
                      fontWeight: "700",
                    }}
                  >
                    Prioridade: {config.prioridade}
                  </span>

                  <span
                    style={{
                      background: "#f1f5f4",
                      color: "#60716f",
                      padding: "6px 9px",
                      borderRadius: "9px",
                      fontSize: "11px",
                      fontWeight: "700",
                    }}
                  >
                    {alerta.categoria}
                  </span>

                  <span
                    style={{
                      background: "#f1f5f4",
                      color: "#60716f",
                      padding: "6px 9px",
                      borderRadius: "9px",
                      fontSize: "11px",
                      fontWeight: "700",
                    }}
                  >
                    {alerta.ambiente}
                  </span>

                  <span
                    style={{
                      background: alerta.resolvido
                        ? "#e8f7ee"
                        : "#f1f5f4",
                      color: alerta.resolvido
                        ? "#228b50"
                        : "#60716f",
                      padding: "6px 9px",
                      borderRadius: "9px",
                      fontSize: "11px",
                      fontWeight: "700",
                    }}
                  >
                    {alerta.resolvido
                      ? "Resolvido"
                      : "Pendente"}
                  </span>
                </div>

                {/* BOTÃO */}

                <button
                  type="button"
                  onClick={() =>
                    marcarComoVisualizado(alerta)
                  }
                  style={{
                    width: "100%",
                    marginTop: "15px",
                    border: "none",
                    borderRadius: "14px",
                    padding: "11px",
                    background: config.cor,
                    color: "#ffffff",
                    fontWeight: "700",
                    cursor: "pointer",
                  }}
                >
                  👁️ Ver alerta
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* =================================================
          MODAL DO ALERTA
      ================================================= */}

      {alertaSelecionado && (
        <div
          onClick={() =>
            setAlertaSelecionado(null)
          }
          style={{
            position: "fixed",
            inset: 0,
            background:
              "rgba(0,0,0,0.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            zIndex: 9999,
          }}
        >
          <div
            onClick={(event) =>
              event.stopPropagation()
            }
            style={{
              width: "100%",
              maxWidth: "600px",
              maxHeight: "85vh",
              overflowY: "auto",
              background:
                "var(--pulsan-card, #ffffff)",
              borderRadius: "24px",
              padding: "22px",
              boxShadow:
                "0 20px 60px rgba(0,0,0,0.25)",
            }}
          >
            {(() => {
              const config =
                configuracaoTipo(
                  alertaSelecionado.tipo
                );

              return (
                <>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent:
                        "space-between",
                      gap: "15px",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          color: config.cor,
                          fontWeight: "800",
                          fontSize: "14px",
                        }}
                      >
                        {config.bolinha}{" "}
                        {config.nome}
                      </div>

                      <h2
                        style={{
                          margin:
                            "8px 0 0",
                          color:
                            "var(--pulsan-texto, #173b38)",
                        }}
                      >
                        {alertaSelecionado.titulo}
                      </h2>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setAlertaSelecionado(null)
                      }
                      style={{
                        border: "none",
                        background:
                          "#f1f5f4",
                        width: "38px",
                        height: "38px",
                        borderRadius: "50%",
                        cursor: "pointer",
                        fontSize: "18px",
                      }}
                    >
                      ✕
                    </button>
                  </div>

                  {/* INFORMAÇÕES */}

                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                      marginTop: "18px",
                    }}
                  >
                    <span
                      style={{
                        background:
                          config.fundo,
                        color: config.cor,
                        padding: "7px 10px",
                        borderRadius: "9px",
                        fontSize: "11px",
                        fontWeight: "700",
                      }}
                    >
                      Prioridade:{" "}
                      {config.prioridade}
                    </span>

                    <span
                      style={{
                        background:
                          "#f1f5f4",
                        color: "#60716f",
                        padding: "7px 10px",
                        borderRadius: "9px",
                        fontSize: "11px",
                        fontWeight: "700",
                      }}
                    >
                      {alertaSelecionado.categoria}
                    </span>

                    <span
                      style={{
                        background:
                          "#f1f5f4",
                        color: "#60716f",
                        padding: "7px 10px",
                        borderRadius: "9px",
                        fontSize: "11px",
                        fontWeight: "700",
                      }}
                    >
                      {alertaSelecionado.ambiente}
                    </span>

                    <span
                      style={{
                        background:
                          alertaSelecionado.resolvido
                            ? "#e8f7ee"
                            : "#f1f5f4",
                        color:
                          alertaSelecionado.resolvido
                            ? "#228b50"
                            : "#60716f",
                        padding: "7px 10px",
                        borderRadius: "9px",
                        fontSize: "11px",
                        fontWeight: "700",
                      }}
                    >
                      {alertaSelecionado.resolvido
                        ? "Resolvido"
                        : "Pendente"}
                    </span>
                  </div>

                  {/* MOTIVO */}

                  <div
                    style={{
                      marginTop: "22px",
                    }}
                  >
                    <strong
                      style={{
                        color:
                          "var(--pulsan-texto, #173b38)",
                      }}
                    >
                      Motivo do alerta
                    </strong>

                    <p
                      style={{
                        marginTop: "8px",
                        lineHeight: "1.6",
                        color:
                          "var(--pulsan-texto-secundario, #666)",
                      }}
                    >
                      {alertaSelecionado.descricao}
                    </p>
                  </div>

                  {/* TEXTO REAL */}

                  <div
                    style={{
                      marginTop: "22px",
                      padding: "16px",
                      background: "#f7faf9",
                      borderRadius: "16px",
                      border:
                        "1px solid #e5eeee",
                    }}
                  >
                    <strong
                      style={{
                        color:
                          "var(--pulsan-texto, #173b38)",
                      }}
                    >
                      Conteúdo da situação
                    </strong>

                    <p
                      style={{
                        margin:
                          "10px 0 0",
                        lineHeight: "1.6",
                        color:
                          "var(--pulsan-texto-secundario, #666)",
                        whiteSpace:
                          "pre-wrap",
                      }}
                    >
                      {alertaSelecionado.texto ||
                        "Conteúdo não disponível."}
                    </p>
                  </div>

                  {/* STATUS */}

                  <div
                    style={{
                      marginTop: "20px",
                      padding: "14px",
                      background:
                        config.fundo,
                      borderRadius: "14px",
                      color: config.cor,
                      fontSize: "13px",
                      fontWeight: "700",
                    }}
                  >
                    Status:{" "}
                    {alertaSelecionado.resolvido
                      ? "Esta situação foi resolvida."
                      : "Esta situação ainda precisa de atenção."}
                  </div>

                  {/* FECHAR */}

                  <button
                    type="button"
                    onClick={() =>
                      setAlertaSelecionado(null)
                    }
                    style={{
                      width: "100%",
                      marginTop: "20px",
                      border: "none",
                      borderRadius: "14px",
                      padding: "12px",
                      background: "#20adb0",
                      color: "#ffffff",
                      fontWeight: "700",
                      cursor: "pointer",
                    }}
                  >
                    Fechar
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* =================================================
          VOLTAR
      ================================================= */}

      <button
        type="button"
       onClick={() => irPara("painel-admin")}
        style={{
          position: "fixed",
          right: "20px",
          bottom: "25px",
          border: "none",
          borderRadius: "14px",
          padding: "11px 16px",
          background: "#20adb0",
          color: "#ffffff",
          fontWeight: "700",
          cursor: "pointer",
          boxShadow:
            "0 6px 20px rgba(0,0,0,0.15)",
        }}
      >
        ← Voltar
      </button>
    </div>
  );
}

export default Alertas;