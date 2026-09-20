import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001";

function GestaoPsicologos({ irPara, tema, alterarTema }) {
  const [psicologos, setPsicologos] = useState([]);
  const [filtro, setFiltro] = useState("pendente");
  const [carregando, setCarregando] = useState(true);
  const [processandoId, setProcessandoId] = useState(null);

  // =====================================================
  // CARREGAR PSICÓLOGOS
  // =====================================================

  useEffect(() => {
    carregarPsicologos();
  }, []);

  async function obterHeadersAutenticacao() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) throw error;

    if (!session?.access_token) {
      throw new Error("Sessão do administrador não encontrada.");
    }

    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    };
  }

  async function carregarPsicologos() {
    try {
      setCarregando(true);

      const headers = await obterHeadersAutenticacao();

      const resposta = await fetch(`${API_URL}/api/psicologos`, {
        method: "GET",
        headers,
      });

      const data = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            "Não foi possível carregar os psicólogos."
        );
      }

      const lista = Array.isArray(data)
        ? data
        : Array.isArray(data?.psicologos)
        ? data.psicologos
        : [];

      setPsicologos(
        lista.map((psicologo) => ({
          ...psicologo,
          verificacao_psicologo:
            psicologo.verificacao_psicologo ||
            (psicologo.verificado === true ? "aprovado" : "pendente"),
          psicologo_parceiro:
            psicologo.psicologo_parceiro ??
            psicologo.verificado === true,
        }))
      );
    } catch (erro) {
      console.error("Erro ao carregar psicólogos:", erro);
      setPsicologos([]);
      alert(
        "Não foi possível carregar os psicólogos. Verifique a sessão e o servidor do Pulsan."
      );
    } finally {
      setCarregando(false);
    }
  }

  // =====================================================
  // ALTERAR STATUS DO PSICÓLOGO
  // =====================================================

  async function alterarVerificacao(id, status) {
    const confirmar = window.confirm(
      status === "aprovado"
        ? "Deseja realmente aprovar este psicólogo como Psicólogo Parceiro Pulsan?"
        : "Deseja realmente recusar a solicitação deste psicólogo?"
    );

    if (!confirmar) return;

    try {
      setProcessandoId(id);

      const headers = await obterHeadersAutenticacao();

      const resposta = await fetch(
        `${API_URL}/api/psicologos/${encodeURIComponent(id)}/verificacao`,
        {
          method: "PATCH",
          headers,
          body: JSON.stringify({
            verificado: status === "aprovado",
            ativo: status === "aprovado",
            disponivel: status === "aprovado",
          }),
        }
      );

      const data = await resposta.json().catch(() => ({}));

      if (!resposta.ok) {
        throw new Error(
          data?.error ||
            data?.message ||
            "Não foi possível atualizar a verificação."
        );
      }

      await carregarPsicologos();

      if (status === "aprovado") {
        alert(
          "Psicólogo aprovado com sucesso! 🧠✅\n\nAgora ele é um Psicólogo Parceiro Pulsan."
        );
      } else {
        alert("Solicitação recusada.");
      }
    } catch (erro) {
      console.error("Erro ao alterar verificação:", erro);
      alert(
        erro?.message ||
          "Não foi possível atualizar a solicitação do psicólogo."
      );
    } finally {
      setProcessandoId(null);
    }
  }

  function aprovarPsicologo(id) {
    return alterarVerificacao(id, "aprovado");
  }

  function recusarPsicologo(id) {
    return alterarVerificacao(id, "recusado");
  }

  // =====================================================
  // QUANTIDADES DOS STATUS
  // =====================================================

  const quantidadePendentes = psicologos.filter(
    (psicologo) =>
      psicologo.verificacao_psicologo === "pendente"
  ).length;

  const quantidadeAprovados = psicologos.filter(
    (psicologo) =>
      psicologo.verificacao_psicologo === "aprovado"
  ).length;

  const quantidadeRecusados = psicologos.filter(
    (psicologo) =>
      psicologo.verificacao_psicologo === "recusado"
  ).length;

  // =====================================================
  // FILTRO
  // =====================================================

  const psicologosFiltrados = psicologos.filter((psicologo) => {
    if (filtro === "todos") return true;

    return (
      psicologo.verificacao_psicologo === filtro
    );
  });

 

  // =====================================================
  // CONFIGURAÇÃO DOS STATUS
  // =====================================================

  function configurarStatus(status) {
    if (status === "aprovado") {
      return {
        texto: "Aprovado",
        emoji: "✅",
        fundo: "#e9f8ef",
        cor: "#18794e",
      };
    }

    if (status === "recusado") {
      return {
        texto: "Recusado",
        emoji: "❌",
        fundo: "#fff0f0",
        cor: "#c62828",
      };
    }

    return {
      texto: "Pendente",
      emoji: "🟡",
      fundo: "#fff9df",
      cor: "#9a7800",
    };
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          tema === "dark"
            ? "#101817"
            : "#f5f8f7",
        paddingBottom: "40px",
      }}
    >
      {/* =================================================
          CABEÇALHO
      ================================================= */}

      <header
        style={{
          padding: "24px 20px 18px",
          background:
            tema === "dark"
              ? "#182321"
              : "#ffffff",
          borderBottom:
            tema === "dark"
              ? "1px solid #2c3b38"
              : "1px solid #e5ece9",
          position: "sticky",
          top: 0,
          zIndex: 20,
        }}
      >
        <button
          type="button"
          onClick={() => irPara("ambiente")}
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            fontSize: "15px",
            marginBottom: "14px",
            padding: 0,
            color:
              tema === "dark"
                ? "#b8d8d0"
                : "#38635b",
            fontWeight: "700",
          }}
        >
          ← Voltar
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                tema === "dark"
                  ? "#243b35"
                  : "#eaf5f1",
              fontSize: "25px",
            }}
          >
            🛡️
          </div>

          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "23px",
                color:
                  tema === "dark"
                    ? "#ffffff"
                    : "#173b38",
              }}
            >
              Equipe Pulsan
            </h1>

            <p
              style={{
                margin: "4px 0 0",
                fontSize: "13px",
                color:
                  tema === "dark"
                    ? "#a9bbb7"
                    : "#6c7c78",
              }}
            >
              Gestão de Psicólogos Parceiros
            </p>
          </div>
        </div>
      </header>

      {/* =================================================
          CONTEÚDO
      ================================================= */}

      <section
        style={{
          maxWidth: "900px",
          margin: "0 auto",
          padding: "22px 16px",
        }}
      >
        {/* =================================================
            RESUMO
        ================================================= */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(3, minmax(0, 1fr))",
            gap: "10px",
            marginBottom: "22px",
          }}
        >
          <div
            style={{
              background:
                tema === "dark"
                  ? "#24251d"
                  : "#fff9df",
              borderRadius: "16px",
              padding: "15px",
              border:
                tema === "dark"
                  ? "1px solid #4b4930"
                  : "1px solid #eee0a8",
            }}
          >
            <div style={{ fontSize: "22px" }}>🟡</div>

            <strong
              style={{
                display: "block",
                fontSize: "23px",
                marginTop: "5px",
              }}
            >
              {quantidadePendentes}
            </strong>

            <span
              style={{
                fontSize: "12px",
                color:
                  tema === "dark"
                    ? "#b8c3c0"
                    : "#6b6b6b",
              }}
            >
              Pendentes
            </span>
          </div>

          <div
            style={{
              background:
                tema === "dark"
                  ? "#182a23"
                  : "#e9f8ef",
              borderRadius: "16px",
              padding: "15px",
              border:
                tema === "dark"
                  ? "1px solid #315044"
                  : "1px solid #c9ead7",
            }}
          >
            <div style={{ fontSize: "22px" }}>✅</div>

            <strong
              style={{
                display: "block",
                fontSize: "23px",
                marginTop: "5px",
              }}
            >
              {quantidadeAprovados}
            </strong>

            <span
              style={{
                fontSize: "12px",
                color:
                  tema === "dark"
                    ? "#b8c3c0"
                    : "#6b6b6b",
              }}
            >
              Aprovados
            </span>
          </div>

          <div
            style={{
              background:
                tema === "dark"
                  ? "#291e1e"
                  : "#fff0f0",
              borderRadius: "16px",
              padding: "15px",
              border:
                tema === "dark"
                  ? "1px solid #4d3030"
                  : "1px solid #f0cccc",
            }}
          >
            <div style={{ fontSize: "22px" }}>❌</div>

            <strong
              style={{
                display: "block",
                fontSize: "23px",
                marginTop: "5px",
              }}
            >
              {quantidadeRecusados}
            </strong>

            <span
              style={{
                fontSize: "12px",
                color:
                  tema === "dark"
                    ? "#b8c3c0"
                    : "#6b6b6b",
              }}
            >
              Recusados
            </span>
          </div>
        </div>

        {/* =================================================
            FILTROS
        ================================================= */}

        <div
          style={{
            display: "flex",
            gap: "8px",
            flexWrap: "wrap",
            marginBottom: "18px",
          }}
        >
          {[
            ["pendente", "🟡 Pendentes"],
            ["aprovado", "✅ Aprovados"],
            ["recusado", "❌ Recusados"],
            ["todos", "📋 Todos"],
          ].map(([valor, texto]) => (
            <button
              key={valor}
              type="button"
              onClick={() => setFiltro(valor)}
              style={{
                border:
                  filtro === valor
                    ? "2px solid #38635b"
                    : tema === "dark"
                    ? "1px solid #40514d"
                    : "1px solid #d7e1de",
                background:
                  filtro === valor
                    ? tema === "dark"
                      ? "#243b35"
                      : "#eaf5f1"
                    : tema === "dark"
                    ? "#182321"
                    : "#ffffff",
                color:
                  tema === "dark"
                    ? "#ffffff"
                    : "#29453f",
                borderRadius: "999px",
                padding: "9px 14px",
                cursor: "pointer",
                fontWeight: "700",
                fontSize: "13px",
              }}
            >
              {texto}
            </button>
          ))}
        </div>

        {/* =================================================
            LISTA
        ================================================= */}

        {carregando ? (
          <div
            style={{
              background:
                tema === "dark"
                  ? "#182321"
                  : "#ffffff",
              borderRadius: "18px",
              padding: "35px 20px",
              textAlign: "center",
              border:
                tema === "dark"
                  ? "1px solid #2c3b38"
                  : "1px solid #e5ece9",
            }}
          >
            <div style={{ fontSize: "36px" }}>🧠</div>
            <h2
              style={{
                margin: "10px 0 6px",
                color:
                  tema === "dark"
                    ? "#ffffff"
                    : "#173b38",
                fontSize: "20px",
              }}
            >
              Carregando psicólogos...
            </h2>
            <p
              style={{
                margin: 0,
                color:
                  tema === "dark"
                    ? "#a9bbb7"
                    : "#687773",
                fontSize: "14px",
              }}
            >
              Buscando as solicitações no sistema Pulsan.
            </p>
          </div>
        ) : psicologosFiltrados.length === 0 ? (
          <div
            style={{
              background:
                tema === "dark"
                  ? "#182321"
                  : "#ffffff",
              borderRadius: "18px",
              padding: "35px 20px",
              textAlign: "center",
              border:
                tema === "dark"
                  ? "1px solid #2c3b38"
                  : "1px solid #e5ece9",
            }}
          >
            <div style={{ fontSize: "40px" }}>
              🧠
            </div>

            <h2
              style={{
                margin: "10px 0 6px",
                color:
                  tema === "dark"
                    ? "#ffffff"
                    : "#173b38",
                fontSize: "20px",
              }}
            >
              Nenhum psicólogo encontrado
            </h2>

            <p
              style={{
                margin: 0,
                color:
                  tema === "dark"
                    ? "#a9bbb7"
                    : "#687773",
                fontSize: "14px",
              }}
            >
              Não há solicitações nesta categoria.
            </p>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            {psicologosFiltrados.map((psicologo) => {
              const status = configurarStatus(
                psicologo.verificacao_psicologo
              );

              return (
                <article
                  key={psicologo.id}
                  style={{
                    background:
                      tema === "dark"
                        ? "#182321"
                        : "#ffffff",
                    borderRadius: "20px",
                    padding: "18px",
                    border:
                      tema === "dark"
                        ? "1px solid #2c3b38"
                        : "1px solid #e2ebe8",
                    boxShadow:
                      "0 4px 16px rgba(0,0,0,0.04)",
                  }}
                >
                  {/* DADOS PRINCIPAIS */}

                  <div
                    style={{
                      display: "flex",
                      gap: "14px",
                      alignItems: "flex-start",
                    }}
                  >
                    {psicologo.foto_url ? (
                      <img
                        src={psicologo.foto_url}
                        alt={`Foto de ${psicologo.nome}`}
                        style={{
                          width: "65px",
                          height: "65px",
                          borderRadius: "18px",
                          objectFit: "cover",
                          flexShrink: 0,
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "65px",
                          height: "65px",
                          borderRadius: "18px",
                          background:
                            tema === "dark"
                              ? "#243b35"
                              : "#eaf5f1",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "30px",
                          flexShrink: 0,
                        }}
                      >
                        🧠
                      </div>
                    )}

                    <div
                      style={{
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          flexWrap: "wrap",
                        }}
                      >
                        <h2
                          style={{
                            margin: 0,
                            fontSize: "18px",
                            color:
                              tema === "dark"
                                ? "#ffffff"
                                : "#173b38",
                          }}
                        >
                          {psicologo.nome}
                        </h2>

                        <span
                          style={{
                            background: status.fundo,
                            color: status.cor,
                            padding: "5px 9px",
                            borderRadius: "999px",
                            fontSize: "11px",
                            fontWeight: "800",
                          }}
                        >
                          {status.emoji} {status.texto}
                        </span>
                      </div>

                      <p
                        style={{
                          margin: "7px 0 0",
                          color:
                            tema === "dark"
                              ? "#b8c7c3"
                              : "#667571",
                          fontSize: "13px",
                          wordBreak: "break-word",
                        }}
                      >
                        📧 {psicologo.email}
                      </p>
                    </div>
                  </div>

                  {/* DADOS PROFISSIONAIS */}

                  <div
                    style={{
                      marginTop: "17px",
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(2, minmax(0, 1fr))",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        padding: "12px",
                        borderRadius: "12px",
                        background:
                          tema === "dark"
                            ? "#202e2b"
                            : "#f6f9f8",
                      }}
                    >
                      <small
                        style={{
                          display: "block",
                          color:
                            tema === "dark"
                              ? "#8fa49f"
                              : "#7a8885",
                          fontSize: "11px",
                          marginBottom: "4px",
                        }}
                      >
                        CRP
                      </small>

                      <strong
                        style={{
                          color:
                            tema === "dark"
                              ? "#ffffff"
                              : "#29453f",
                          fontSize: "14px",
                        }}
                      >
                        {psicologo.crp ||
                          "Não informado"}
                      </strong>
                    </div>

                    <div
                      style={{
                        padding: "12px",
                        borderRadius: "12px",
                        background:
                          tema === "dark"
                            ? "#202e2b"
                            : "#f6f9f8",
                      }}
                    >
                      <small
                        style={{
                          display: "block",
                          color:
                            tema === "dark"
                              ? "#8fa49f"
                              : "#7a8885",
                          fontSize: "11px",
                          marginBottom: "4px",
                        }}
                      >
                        Documento
                      </small>

                      <strong
                        style={{
                          color:
                            tema === "dark"
                              ? "#ffffff"
                              : "#29453f",
                          fontSize: "14px",
                          wordBreak: "break-word",
                        }}
                      >
                        {psicologo.nome_documento ||
                          "Documento enviado"}
                      </strong>
                    </div>
                  </div>

                  {/* DOCUMENTO */}

                  {psicologo.documento && (
                    <div
                      style={{
                        marginTop: "12px",
                        padding: "12px",
                        borderRadius: "12px",
                        background:
                          tema === "dark"
                            ? "#202e2b"
                            : "#f6f9f8",
                      }}
                    >
                      <small
                        style={{
                          display: "block",
                          marginBottom: "7px",
                          color:
                            tema === "dark"
                              ? "#8fa49f"
                              : "#7a8885",
                          fontSize: "11px",
                        }}
                      >
                        Documento profissional
                      </small>

                      <a
                        href={psicologo.documento}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color:
                            tema === "dark"
                              ? "#8fd3c2"
                              : "#28675a",
                          fontWeight: "700",
                          fontSize: "13px",
                        }}
                      >
                        📄 Abrir documento enviado
                      </a>
                    </div>
                  )}

                  {/* AÇÕES */}

                  {psicologo.verificacao_psicologo ===
                    "pendente" && (
                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginTop: "17px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          aprovarPsicologo(
                            psicologo.id
                          )
                        }
                        disabled={processandoId === psicologo.id}
                        style={{
                          opacity:
                            processandoId === psicologo.id ? 0.65 : 1,
                          flex: 1,
                          border: "none",
                          borderRadius: "12px",
                          padding: "13px",
                          background: "#2e7d5b",
                          color: "#ffffff",
                          cursor: "pointer",
                          fontWeight: "800",
                        }}
                      >
                        {processandoId === psicologo.id
                          ? "⏳ Processando..."
                          : "✅ Aprovar"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          recusarPsicologo(
                            psicologo.id
                          )
                        }
                        disabled={processandoId === psicologo.id}
                        style={{
                          opacity:
                            processandoId === psicologo.id ? 0.65 : 1,
                          flex: 1,
                          border: "1px solid #d9a2a2",
                          borderRadius: "12px",
                          padding: "13px",
                          background:
                            tema === "dark"
                              ? "#321f1f"
                              : "#fff5f5",
                          color: "#b52a2a",
                          cursor: "pointer",
                          fontWeight: "800",
                        }}
                      >
                        {processandoId === psicologo.id
                          ? "⏳ Processando..."
                          : "❌ Recusar"}
                      </button>
                    </div>
                  )}

                  {psicologo.verificacao_psicologo ===
                    "aprovado" && (
                    <div
                      style={{
                        marginTop: "16px",
                        padding: "12px",
                        borderRadius: "12px",
                        background:
                          tema === "dark"
                            ? "#182f26"
                            : "#e9f8ef",
                        color:
                          tema === "dark"
                            ? "#a7dfc2"
                            : "#18794e",
                        fontSize: "13px",
                        fontWeight: "700",
                      }}
                    >
                      🧠 Psicólogo Parceiro Pulsan
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default GestaoPsicologos;