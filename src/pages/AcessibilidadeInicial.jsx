import React, { useState } from "react";

function AcessibilidadeInicial({
  irPara,
  tema = "claro",
  acessibilidade,
  alterarAcessibilidade,
}) {
  const [salvando, setSalvando] = useState(false);
  const [falandoTutorial, setFalandoTutorial] = useState(false);

  const escuro = tema === "escuro";

  // ============================================================
  // TUTORIAL AUTOMÁTICO DA LEITURA E COMANDO POR VOZ
  // Quando a pessoa seleciona "Leitura e comando por voz",
  // o Pulsan explica imediatamente como o recurso funciona.
  // ============================================================
  function falarTutorialVoz() {
    if (!("speechSynthesis" in window)) {
      alert(
        "A leitura por voz não está disponível neste navegador. " +
        "Você ainda pode utilizar os recursos de acessibilidade do seu dispositivo."
      );
      return;
    }

    window.speechSynthesis.cancel();

    const texto = `
      Olá! O Pulsan ativou a leitura e o comando por voz.

      Esse recurso permite que você ouça as informações da plataforma
      e também utilize sua voz para navegar pelo Pulsan.

      Para ouvir o conteúdo da tela, você poderá dizer:
      Ler página.

      Para navegar, poderá dizer comandos como:
      Abrir início.
      Abrir ambiente.
      Abrir conversas.
      Abrir perfil.
      Voltar.

      Quando o comando por voz estiver ouvindo, fale de forma clara
      e aguarde o Pulsan reconhecer o comando.

      A leitura por voz e os comandos podem ser utilizados enquanto
      você navega pela plataforma.

      Você também pode utilizar o TalkBack, no Android, ou o VoiceOver,
      no iPhone, junto com os recursos de acessibilidade do seu dispositivo.

      Se quiser interromper a explicação, você pode utilizar o controle
      de leitura do seu dispositivo ou desativar a opção de voz.

      A partir de agora, o Pulsan estará preparado para ajudar você
      a navegar de uma forma mais acessível.
    `;

    const fala = new SpeechSynthesisUtterance(texto);
    fala.lang = "pt-BR";
    fala.rate = 0.88;
    fala.pitch = 1;

    fala.onstart = () => setFalandoTutorial(true);
    fala.onend = () => setFalandoTutorial(false);
    fala.onerror = () => setFalandoTutorial(false);

    window.speechSynthesis.speak(fala);
  }

  function pararTutorialVoz() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setFalandoTutorial(false);
  }

  function alternarOpcao(opcaoId) {
    const ativo = Boolean(acessibilidade?.[opcaoId]);
    const novoValor = !ativo;

    alterarAcessibilidade(opcaoId, novoValor);

    // A explicação começa somente quando a opção é ativada.
    if (opcaoId === "voz" && novoValor) {
      // Pequeno intervalo para a interface atualizar visualmente
      // antes de iniciar a fala.
      setTimeout(() => {
        falarTutorialVoz();
      }, 120);
    }

    if (opcaoId === "voz" && !novoValor) {
      pararTutorialVoz();
    }
  }

  const opcoes = [
    {
      id: "altoContraste",
      icone: "◐",
      titulo: "Alto contraste",
      descricao: "Aumenta a diferença entre textos, fundos e elementos.",
    },
    {
      id: "textoMaior",
      icone: "A",
      titulo: "Texto maior",
      descricao: "Deixa textos e informações mais fáceis de visualizar.",
    },
    {
      id: "botoesMaiores",
      icone: "▣",
      titulo: "Botões maiores",
      descricao: "Aumenta os controles para facilitar o toque e a navegação.",
    },
    {
      id: "reduzirAnimacoes",
      icone: "〰",
      titulo: "Reduzir animações",
      descricao: "Diminui movimentos e transições da plataforma.",
    },
    {
      id: "voz",
      icone: "🔊",
      titulo: "Leitura e comando por voz",
      descricao:
        "Ativa em uma única função a leitura da página e os comandos para navegar pelo Pulsan.",
    },
  ];

  function entrarNoAmbiente() {
    setSalvando(true);

    // Marca que a apresentação inicial já foi concluída para esta conta.
    // O ID vem do usuário salvo no login/cadastro.
    try {
      const usuarioAtual = JSON.parse(
        localStorage.getItem("pulsanUsuarioAtual") || "null"
      );

      if (usuarioAtual?.id) {
        localStorage.setItem(
          `pulsanAcessibilidadeConfigurada_${usuarioAtual.id}`,
          "true"
        );
      }
    } catch (erro) {
      console.error("Erro ao salvar primeiro acesso:", erro);
    }

    // Mantém as configurações globais já escolhidas.
    setTimeout(() => {
      const tipo = localStorage.getItem("pulsanTipo");

      if (
        tipo === "admin" ||
        tipo === "administrador" ||
        tipo === "equipe_pulsan"
      ) {
        irPara("painel-admin");
      } else if (tipo === "colaborador") {
        irPara("empresa");
      } else {
        irPara("ambiente");
      }

      setSalvando(false);
    }, 120);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box",
        padding: "28px 18px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: escuro
          ? "linear-gradient(145deg, #081B35 0%, #0F2D5B 55%, #15365F 100%)"
          : "linear-gradient(145deg, #FFFFFF 0%, #EAF3FF 55%, #F5F9FF 100%)",
        color: escuro ? "#FFFFFF" : "#0F2D5B",
        fontFamily:
          "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "760px",
          background: escuro ? "rgba(15,45,91,.94)" : "rgba(255,255,255,.96)",
          border: `1px solid ${escuro ? "#416DA4" : "#A8C7FF"}`,
          borderRadius: "30px",
          padding: "clamp(24px, 5vw, 46px)",
          boxSizing: "border-box",
          boxShadow: escuro
            ? "0 24px 70px rgba(0,0,0,.30)"
            : "0 24px 70px rgba(58,125,255,.13)",
          backdropFilter: "blur(14px)",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              margin: "0 auto 18px",
              borderRadius: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #EAF3FF, #A8C7FF)",
              color: "#0F2D5B",
              fontSize: "34px",
              boxShadow: "0 12px 30px rgba(58,125,255,.18)",
            }}
            aria-hidden="true"
          >
            ♿
          </div>

          <div
            style={{
              color: escuro ? "#A8C7FF" : "#3A7DFF",
              fontSize: "12px",
              fontWeight: "800",
              letterSpacing: "2px",
              textTransform: "uppercase",
              marginBottom: "10px",
            }}
          >
            Seu primeiro acesso
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(25px, 4vw, 34px)",
              lineHeight: 1.15,
              letterSpacing: "-.5px",
            }}
          >
            Quer deixar o Pulsan mais confortável para você?
          </h1>

          <p
            style={{
              maxWidth: "590px",
              margin: "14px auto 0",
              color: escuro ? "#C2D2E8" : "#5F7695",
              fontSize: "15px",
              lineHeight: 1.65,
            }}
          >
            Antes de começar, você pode escolher recursos de acessibilidade
            que combinam com suas necessidades. Essa escolha é opcional e
            poderá ser alterada depois no seu perfil.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "12px",
            marginTop: "30px",
          }}
        >
          {opcoes.map((opcao) => {
            const ativo = Boolean(acessibilidade?.[opcao.id]);

            return (
              <button
                key={opcao.id}
                type="button"
                onClick={() => alternarOpcao(opcao.id)}
                aria-pressed={ativo}
                style={{
                  textAlign: "left",
                  border: `1.5px solid ${
                    ativo
                      ? "#3A7DFF"
                      : escuro
                      ? "#416DA4"
                      : "#D7E5FA"
                  }`,
                  borderRadius: "20px",
                  padding: "17px",
                  background: ativo
                    ? escuro
                      ? "rgba(58,125,255,.22)"
                      : "#EAF3FF"
                    : escuro
                    ? "#15365F"
                    : "#F9FBFF",
                  color: escuro ? "#FFFFFF" : "#0F2D5B",
                  cursor: "pointer",
                  transition: "transform .18s ease, border-color .18s ease",
                  boxShadow: ativo
                    ? "0 8px 24px rgba(58,125,255,.12)"
                    : "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                  }}
                >
                  <span
                    style={{
                      width: "42px",
                      height: "42px",
                      flexShrink: 0,
                      borderRadius: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: ativo
                        ? "#3A7DFF"
                        : escuro
                        ? "#0F2D5B"
                        : "#EAF3FF",
                      color: ativo ? "#FFFFFF" : "#3A7DFF",
                      fontSize: opcao.id === "textoMaior" ? "21px" : "20px",
                      fontWeight: "800",
                    }}
                    aria-hidden="true"
                  >
                    {opcao.icone}
                  </span>

                  <span style={{ flex: 1 }}>
                    <strong
                      style={{
                        display: "block",
                        fontSize: "15px",
                        marginBottom: "4px",
                      }}
                    >
                      {opcao.titulo}
                    </strong>

                    <span
                      style={{
                        display: "block",
                        color: escuro ? "#C2D2E8" : "#5F7695",
                        fontSize: "12px",
                        lineHeight: 1.45,
                      }}
                    >
                      {opcao.descricao}
                    </span>
                  </span>

                  <span
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      border: `2px solid ${
                        ativo ? "#3A7DFF" : escuro ? "#7194BF" : "#A8C7FF"
                      }`,
                      background: ativo ? "#3A7DFF" : "transparent",
                      color: "#FFFFFF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: "900",
                      flexShrink: 0,
                    }}
                    aria-hidden="true"
                  >
                    {ativo ? "✓" : ""}
                  </span>
                </div>

                {opcao.id === "voz" && ativo && (
                  <div
                    role="status"
                    aria-live="polite"
                    style={{
                      marginTop: "12px",
                      padding: "10px 12px",
                      borderRadius: "12px",
                      background: escuro
                        ? "rgba(168,199,255,.10)"
                        : "#FFFFFF",
                      border: `1px solid ${
                        escuro ? "rgba(168,199,255,.22)" : "#CFE0FA"
                      }`,
                      color: escuro ? "#DCE9FA" : "#496887",
                      fontSize: "11px",
                      lineHeight: 1.5,
                    }}
                  >
                    {falandoTutorial
                      ? "🔊 O Pulsan está explicando como utilizar o recurso de voz..."
                      : "✓ Recurso ativado. A explicação inicial foi concluída."}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {falandoTutorial && (
          <button
            type="button"
            onClick={pararTutorialVoz}
            style={{
              width: "100%",
              marginTop: "14px",
              border: `1px solid ${escuro ? "#416DA4" : "#D7E5FA"}`,
              borderRadius: "14px",
              padding: "11px 16px",
              background: escuro ? "rgba(15,45,91,.72)" : "#F9FBFF",
              color: escuro ? "#DCE9FA" : "#496887",
              fontSize: "12px",
              fontWeight: "800",
              cursor: "pointer",
            }}
          >
            ⏹ Parar explicação por voz
          </button>
        )}

        <div
          style={{
            marginTop: "24px",
            padding: "14px 16px",
            borderRadius: "16px",
            background: escuro ? "rgba(168,199,255,.08)" : "#F5F9FF",
            color: escuro ? "#C2D2E8" : "#5F7695",
            fontSize: "12px",
            lineHeight: 1.5,
            textAlign: "center",
          }}
        >
          💙 Você poderá mudar essas opções quando quiser em
          <strong style={{ color: escuro ? "#A8C7FF" : "#3A7DFF" }}>
            {" "}Perfil → Acessibilidade
          </strong>.
        </div>

        <button
          type="button"
          onClick={entrarNoAmbiente}
          disabled={salvando}
          style={{
            width: "100%",
            marginTop: "18px",
            border: "none",
            borderRadius: "17px",
            padding: "15px 20px",
            background: "linear-gradient(135deg, #3A7DFF, #5C92FF)",
            color: "#FFFFFF",
            fontSize: "15px",
            fontWeight: "800",
            cursor: salvando ? "wait" : "pointer",
            boxShadow: "0 12px 28px rgba(58,125,255,.22)",
          }}
        >
          {salvando ? "Entrando..." : "Salvar e entrar no Pulsan →"}
        </button>

        <button
          type="button"
          onClick={entrarNoAmbiente}
          disabled={salvando}
          style={{
            width: "100%",
            marginTop: "10px",
            border: "none",
            background: "transparent",
            color: escuro ? "#A8C7FF" : "#5F7695",
            padding: "10px",
            fontSize: "13px",
            fontWeight: "700",
            cursor: salvando ? "wait" : "pointer",
          }}
        >
          Continuar sem configurar
        </button>
      </section>
    </main>
  );
}

export default AcessibilidadeInicial;
