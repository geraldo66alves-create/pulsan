import React, { useEffect, useRef, useState } from "react";

function Acessibilidade({
  irPara,
  acessibilidade,
  alterarAcessibilidade,
}) {
  const [ouvindo, setOuvindo] = useState(false);
  const [toquesVoz, setToquesVoz] = useState(0);
  const reconhecimentoRef = useRef(null);

  const configuracao = {
    altoContraste: false,
    textoMaior: false,
    botoesMaiores: false,
    reduzirAnimacoes: false,
    voz: false,
    daltonismo: "normal",
    libras: false,
    ...(acessibilidade || {}),
  };
  const ultimoToqueRef = useRef(0);
  const timerToquesRef = useRef(null);

  function lerTexto(texto) {
    if (!("speechSynthesis" in window)) {
      alert("Seu navegador não oferece leitura por voz.");
      return;
    }

    window.speechSynthesis.cancel();

    const fala = new SpeechSynthesisUtterance(texto);
    fala.lang = "pt-BR";
    fala.rate = 0.9;
    fala.pitch = 1;

    window.speechSynthesis.speak(fala);
  }

  function iniciarComandoPorVoz() {
    const Reconhecimento =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!Reconhecimento) {
      alert("Seu navegador não oferece comando por voz.");
      return;
    }

    if (reconhecimentoRef.current) {
      try {
        reconhecimentoRef.current.abort();
      } catch {
        // Alguns navegadores podem lançar erro se o reconhecimento já terminou.
      }
    }

    const reconhecimento = new Reconhecimento();
    reconhecimentoRef.current = reconhecimento;

    reconhecimento.lang = "pt-BR";
    reconhecimento.continuous = false;
    reconhecimento.interimResults = false;

    setOuvindo(true);

    reconhecimento.onresult = (evento) => {
      const comando = evento.results[0][0].transcript
        .toLowerCase()
        .trim();

      setOuvindo(false);

      if (comando.includes("ler página") || comando.includes("ler pagina")) {
        lerTexto(document.body.innerText);
      } else if (comando.includes("voltar")) {
        irPara("perfil");
      } else if (
        comando.includes("abrir início") ||
        comando.includes("abrir inicio") ||
        comando === "início" ||
        comando === "inicio"
      ) {
        irPara("inicio");
      } else if (
        comando.includes("abrir ambiente") ||
        comando.includes("abrir desabafar")
      ) {
        irPara("ambiente");
      } else if (
        comando.includes("abrir conversas") ||
        comando.includes("abrir conversa") ||
        comando.includes("abrir solicitações") ||
        comando.includes("abrir solicitacoes")
      ) {
        irPara("solicitacoes");
      } else if (
        comando.includes("abrir reflexão") ||
        comando.includes("abrir reflexao")
      ) {
        irPara("reflexao");
      } else if (comando.includes("abrir perfil")) {
        irPara("perfil");
      } else if (comando.includes("abrir ajudar") || comando.includes("abrir ajuda")) {
        irPara("ajudar");
      } else if (comando.includes("alto contraste")) {
        alterarAcessibilidade(
          "altoContraste",
          !configuracao.altoContraste
        );
      } else if (
        comando.includes("texto maior") ||
        comando.includes("aumentar texto")
      ) {
        alterarAcessibilidade(
          "textoMaior",
          !configuracao.textoMaior
        );
      } else if (comando.includes("botões maiores") || comando.includes("botoes maiores")) {
        alterarAcessibilidade(
          "botoesMaiores",
          !configuracao.botoesMaiores
        );
      } else if (
        comando.includes("reduzir animações") ||
        comando.includes("reduzir animacoes")
      ) {
        alterarAcessibilidade(
          "reduzirAnimacoes",
          !configuracao.reduzirAnimacoes
        );
      } else {
        lerTexto(
          "Comando não reconhecido. Você pode dizer: ler página, voltar, abrir início, abrir ambiente, abrir conversas, abrir reflexão, abrir perfil, abrir ajuda, alto contraste, texto maior, botões maiores ou reduzir animações."
        );
      }
    };

    reconhecimento.onerror = () => {
      setOuvindo(false);
      alert("Não foi possível reconhecer o comando.");
    };

    reconhecimento.onend = () => {
      setOuvindo(false);
      if (reconhecimentoRef.current === reconhecimento) {
        reconhecimentoRef.current = null;
      }
    };

    try {
      reconhecimento.start();
    } catch {
      setOuvindo(false);
      reconhecimentoRef.current = null;
      alert("Não foi possível iniciar o comando por voz. Tente novamente.");
    }
  }

  function falarComoAtivarPorTresToques() {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const fala = new SpeechSynthesisUtterance(
      "Para ativar o controle por voz, toque três vezes rapidamente na tela. " +
      "Depois, ative a opção Leitura e comando por voz. " +
      "Quando estiver ativa, toque em Comando por voz, aguarde a mensagem Ouvindo comando e diga o que deseja fazer."
    );
    fala.lang = "pt-BR";
    fala.rate = 0.9;
    fala.pitch = 1;

    window.speechSynthesis.speak(fala);
  }

  function registrarToqueNaTela() {
    const agora = Date.now();

    if (agora - ultimoToqueRef.current > 700) {
      setToquesVoz(1);
    } else {
      setToquesVoz((quantidade) => quantidade + 1);
    }

    ultimoToqueRef.current = agora;

    if (timerToquesRef.current) {
      clearTimeout(timerToquesRef.current);
    }

    timerToquesRef.current = setTimeout(() => {
      setToquesVoz(0);
    }, 850);
  }

  useEffect(() => {
    if (toquesVoz < 3) return;

    setToquesVoz(0);
    falarComoAtivarPorTresToques();

    if (timerToquesRef.current) {
      clearTimeout(timerToquesRef.current);
    }
  }, [toquesVoz]);

  useEffect(() => {
    return () => {
      if (timerToquesRef.current) {
        clearTimeout(timerToquesRef.current);
      }

      if (reconhecimentoRef.current) {
        try {
          reconhecimentoRef.current.abort();
        } catch {
          // Reconhecimento já encerrado.
        }
        reconhecimentoRef.current = null;
      }

      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  function alternarVoz() {
    const novoValor = !Boolean(configuracao.voz);

    alterarAcessibilidade("voz", novoValor);

    if (!novoValor) {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setOuvindo(false);
      return;
    }

    // Dá um retorno imediato para confirmar que o recurso foi ativado.
    // A leitura é feita após o clique, evitando bloqueios do navegador
    // causados por uma chamada de voz fora da interação do usuário.
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();

      const fala = new SpeechSynthesisUtterance(
        "Leitura e comando por voz ativados. " +
        "Esse recurso permite ouvir o conteúdo da tela e navegar pelo Pulsan usando a sua voz. " +
        "Tocando três vezes seguidas na tela, ativa o comando por voz. " +
        "Para acionar o comando por voz, toque no botão Comando por voz e aguarde a mensagem Ouvindo comando. " +
        "Depois diga o que deseja fazer, por exemplo: ler página, abrir ambiente, abrir reflexão ou abrir perfil. " +
        "Você também pode dizer alto contraste, texto maior, botões maiores ou reduzir animações. " +
        "Sempre que o modo voz for ativado, estas instruções serão apresentadas."
      );
      fala.lang = "pt-BR";
      fala.rate = 0.9;
      fala.pitch = 1;

      window.speechSynthesis.speak(fala);
    }
  }

  useEffect(() => {
    if (configuracao.voz) return;

    const handleTouch = () => {
      registrarToqueNaTela();
    };

    window.addEventListener("touchend", handleTouch, { passive: true });

    return () => {
      window.removeEventListener("touchend", handleTouch);
    };
  }, [configuracao.voz]);

  function voltar() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    irPara("perfil");
  }

  function alternarDaltonismo(evento) {
    alterarAcessibilidade("daltonismo", evento.target.value);
  }

  function alternarLibras() {
    alterarAcessibilidade(
      "libras",
      !configuracao.libras
    );
  }

  function restaurarPadrao() {
    const padrao = {
      altoContraste: false,
      textoMaior: false,
      botoesMaiores: false,
      reduzirAnimacoes: false,
      voz: false,
      daltonismo: "normal",
      libras: false,
    };

    Object.entries(padrao).forEach(
      ([chave, valor]) => {
        alterarAcessibilidade(chave, valor);
      }
    );

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  const totalAtivos = [
    configuracao.altoContraste,
    configuracao.textoMaior,
    configuracao.botoesMaiores,
    configuracao.reduzirAnimacoes,
    configuracao.voz,
    configuracao.daltonismo !== "normal",
    configuracao.libras,
  ].filter(Boolean).length;


  const estilosAltoContraste = `
    .pulsan-pagina-acessibilidade {
      transition: background-color .2s ease, color .2s ease;
    }

    .pulsan-pagina-acessibilidade.pulsan-acessibilidade-alto-contraste {
      --pulsan-bg: #05070a !important;
      --pulsan-card: #11161c !important;
      --pulsan-texto: #ffffff !important;
      --pulsan-texto-secundario: #e7edf3 !important;
      --pulsan-primaria: #5ecbff !important;
      --pulsan-borda: #d7e3ec !important;
      background: #05070a !important;
      color: #ffffff !important;
    }

    .pulsan-pagina-acessibilidade.pulsan-acessibilidade-alto-contraste section {
      background: #11161c !important;
      border: 2px solid #d7e3ec !important;
      box-shadow: 0 0 0 1px #000000, 0 10px 28px rgba(0,0,0,.55);
    }

    .pulsan-pagina-acessibilidade.pulsan-acessibilidade-alto-contraste h1,
    .pulsan-pagina-acessibilidade.pulsan-acessibilidade-alto-contraste h2,
    .pulsan-pagina-acessibilidade.pulsan-acessibilidade-alto-contraste label,
    .pulsan-pagina-acessibilidade.pulsan-acessibilidade-alto-contraste strong,
    .pulsan-pagina-acessibilidade.pulsan-acessibilidade-alto-contraste p,
    .pulsan-pagina-acessibilidade.pulsan-acessibilidade-alto-contraste span,
    .pulsan-pagina-acessibilidade.pulsan-acessibilidade-alto-contraste button,
    .pulsan-pagina-acessibilidade.pulsan-acessibilidade-alto-contraste select,
    .pulsan-pagina-acessibilidade.pulsan-acessibilidade-alto-contraste option {
      color: #ffffff !important;
    }

    .pulsan-pagina-acessibilidade.pulsan-acessibilidade-alto-contraste button {
      background: #171e26 !important;
      border: 2px solid #d7e3ec !important;
      min-height: 52px;
    }

    .pulsan-pagina-acessibilidade.pulsan-acessibilidade-alto-contraste button:hover:not(:disabled),
    .pulsan-pagina-acessibilidade.pulsan-acessibilidade-alto-contraste button[aria-pressed="true"] {
      background: #5ecbff !important;
      color: #031018 !important;
      border-color: #ffffff !important;
      box-shadow: 0 0 0 3px #000000, 0 0 0 5px #5ecbff !important;
    }

    .pulsan-pagina-acessibilidade.pulsan-acessibilidade-alto-contraste button:focus-visible,
    .pulsan-pagina-acessibilidade.pulsan-acessibilidade-alto-contraste select:focus-visible {
      outline: 4px solid #ffd84d !important;
      outline-offset: 3px !important;
    }

    .pulsan-pagina-acessibilidade.pulsan-acessibilidade-alto-contraste select {
      background: #05070a !important;
      color: #ffffff !important;
      border: 2px solid #d7e3ec !important;
    }

    .pulsan-pagina-acessibilidade.pulsan-acessibilidade-alto-contraste [role="note"],
    .pulsan-pagina-acessibilidade.pulsan-acessibilidade-alto-contraste [aria-live="polite"] {
      background: #171e26 !important;
      color: #ffffff !important;
      border: 1px solid #d7e3ec !important;
    }

    .pulsan-pagina-acessibilidade.pulsan-acessibilidade-alto-contraste video {
      border: 2px solid #ffffff !important;
      background: #000000 !important;
    }

    .pulsan-pagina-acessibilidade.pulsan-acessibilidade-alto-contraste button:disabled {
      background: #303840 !important;
      color: #b8c2cb !important;
      border-color: #7e8a94 !important;
      opacity: 1 !important;
    }

    @media (prefers-reduced-motion: reduce) {
      .pulsan-pagina-acessibilidade {
        transition: none !important;
      }
    }
  `;

  return (
    <main
      className={`pulsan-pagina-acessibilidade ${configuracao.altoContraste ? "pulsan-acessibilidade-alto-contraste" : ""}`}
      style={{
        minHeight: "100vh",
        background: "var(--pulsan-bg, #fffdf9)",
        color: "var(--pulsan-texto, #172c35)",
        padding: "24px 18px 100px",
      }}
    >
      <style>{estilosAltoContraste}</style>

      <div
        style={{
          maxWidth: "760px",
          margin: "0 auto",
        }}
      >
        <button
          type="button"
          onClick={voltar}
          style={{
            border: "none",
            background: "transparent",
            color: "var(--pulsan-primaria, #20adb0)",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: "700",
            marginBottom: "20px",
          }}
        >
          ← Voltar para o perfil
        </button>

        <header style={{ marginBottom: "26px" }}>
          <div style={{ fontSize: "42px", marginBottom: "8px" }}>
            ♿
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              color: "var(--pulsan-texto, #172c35)",
            }}
          >
            Acessibilidade
          </h1>

          <p
            style={{
              color: "var(--pulsan-texto-secundario, #687780)",
              lineHeight: 1.6,
            }}
          >
            Personalize o Pulsan para utilizar a plataforma
            com mais conforto, autonomia e segurança.
          </p>

          <div
            aria-live="polite"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              marginTop: "10px",
              padding: "9px 13px",
              borderRadius: "999px",
              background: totalAtivos
                ? "rgba(58,125,255,.10)"
                : "var(--pulsan-card, #fff)",
              border: "1px solid var(--pulsan-borda, #A8C7FF)",
              color: "var(--pulsan-texto, #0F2D5B)",
              fontSize: "13px",
              fontWeight: "700",
            }}
          >
            {totalAtivos
              ? `${totalAtivos} recurso${totalAtivos > 1 ? "s" : ""} ativo${totalAtivos > 1 ? "s" : ""} em toda a plataforma`
              : "Nenhum recurso adicional ativo"}
          </div>
        </header>

        <section
          style={{
            background: "var(--pulsan-card, #ffffff)",
            border: "1px solid var(--pulsan-borda, #e5e5e5)",
            borderRadius: "18px",
            padding: "20px",
            marginBottom: "18px",
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            Aparência e navegação
          </h2>

          <p style={textoDescricao}>
            Estas opções são aplicadas globalmente às telas do Pulsan
            enquanto estiverem ativadas.
          </p>

          <div
            style={{
              display: "grid",
              gap: "12px",
            }}
          >
            <button
              type="button"
              onClick={() =>
                alterarAcessibilidade(
                  "altoContraste",
                  !configuracao.altoContraste
                )
              }
              aria-pressed={configuracao.altoContraste}
              style={estiloBotao}
            >
              <span
                aria-hidden="true"
                style={{
                  display: "inline-flex",
                  width: "24px",
                  height: "24px",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "10px",
                  borderRadius: "6px",
                  background: configuracao.altoContraste ? "#5ecbff" : "transparent",
                  color: configuracao.altoContraste ? "#031018" : "currentColor",
                  border: "2px solid currentColor",
                  fontWeight: "900",
                }}
              >
                {configuracao.altoContraste ? "✓" : ""}
              </span>
              Alto contraste
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: "12px",
                  fontWeight: "800",
                  opacity: .9,
                }}
              >
                {configuracao.altoContraste ? "ATIVADO" : "DESATIVADO"}
              </span>
            </button>

            <button
              type="button"
              onClick={() =>
                alterarAcessibilidade(
                  "textoMaior",
                  !configuracao.textoMaior
                )
              }
              aria-pressed={configuracao.textoMaior}
              style={estiloBotao}
            >
              {configuracao.textoMaior ? "✓ " : ""}
              Texto maior
            </button>

            <button
              type="button"
              onClick={() =>
                alterarAcessibilidade(
                  "botoesMaiores",
                  !configuracao.botoesMaiores
                )
              }
              aria-pressed={configuracao.botoesMaiores}
              style={estiloBotao}
            >
              {configuracao.botoesMaiores ? "✓ " : ""}
              Botões maiores
            </button>

            <button
              type="button"
              onClick={() =>
                alterarAcessibilidade(
                  "reduzirAnimacoes",
                  !configuracao.reduzirAnimacoes
                )
              }
              aria-pressed={configuracao.reduzirAnimacoes}
              style={estiloBotao}
            >
              {configuracao.reduzirAnimacoes ? "✓ " : ""}
              Reduzir animações
            </button>
          </div>
        </section>

        <section
          style={{
            background: "var(--pulsan-card, #ffffff)",
            border: "1px solid var(--pulsan-borda, #e5e5e5)",
            borderRadius: "18px",
            padding: "20px",
            marginBottom: "18px",
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            Leitura e comando por voz
          </h2>

          <p style={textoDescricao}>
            Use a voz para ouvir o conteúdo da tela ou navegar
            pela plataforma. A leitura continua disponível nas
            demais páginas enquanto o recurso estiver ativo.
          </p>

          <div
            role="note"
            style={{
              marginBottom: "14px",
              padding: "11px 13px",
              borderRadius: "12px",
              background: "rgba(58,125,255,.08)",
              color: "var(--pulsan-texto-secundario, #687780)",
              fontSize: "12px",
              lineHeight: 1.5,
            }}
          >
            💡 Dica: toque 3 vezes rapidamente na tela para ouvir a instrução
            de como ativar o controle por voz.
          </div>

          <div style={{ display: "grid", gap: "12px" }}>
            <button
              type="button"
              onClick={alternarVoz}
              aria-pressed={configuracao.voz}
              aria-label={
                configuracao.voz
                  ? "Desativar leitura e comando por voz"
                  : "Ativar leitura e comando por voz"
              }
              style={estiloBotao}
            >
              {configuracao.voz ? "✓ " : ""}
              {configuracao.voz
                ? "Leitura e comando por voz ativados"
                : "Ativar leitura e comando por voz"}
            </button>

            {configuracao.voz && (
              <div
                aria-live="polite"
                style={{
                  padding: "10px 12px",
                  borderRadius: "10px",
                  background: "rgba(58,125,255,.08)",
                  color: "var(--pulsan-texto-secundario, #687780)",
                  fontSize: "12px",
                  lineHeight: 1.5,
                }}
              >
                ✓ Recurso ativo. Use “Ler página atual” ou “Comando por voz”.
              </div>
            )}

            <button
              type="button"
              onClick={() => lerTexto(document.body.innerText)}
              disabled={!configuracao.voz}
              aria-label="Ler página atual"
              style={{
                ...estiloBotao,
                opacity: configuracao.voz ? 1 : 0.55,
                cursor: configuracao.voz ? "pointer" : "not-allowed",
              }}
            >
              🔊 Ler página atual
            </button>

            <button
              type="button"
              onClick={iniciarComandoPorVoz}
              disabled={!configuracao.voz}
              aria-label={ouvindo ? "Ouvindo comando por voz" : "Iniciar comando por voz"}
              style={{
                ...estiloBotao,
                opacity: configuracao.voz ? 1 : 0.55,
                cursor: configuracao.voz ? "pointer" : "not-allowed",
              }}
            >
              🎙️
              {ouvindo
                ? " Ouvindo comando..."
                : " Comando por voz"}
            </button>
          </div>
        </section>

        <section
          style={{
            background: "var(--pulsan-card, #ffffff)",
            border: "1px solid var(--pulsan-borda, #e5e5e5)",
            borderRadius: "18px",
            padding: "20px",
            marginBottom: "18px",
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            Modo para daltonismo
          </h2>

          <p style={textoDescricao}>
            Escolha o modo de cores que melhor atende à sua
            necessidade visual. A configuração é aplicada
            globalmente ao Pulsan.
          </p>

          <label
            htmlFor="modo-daltonismo"
            style={{
              display: "block",
              fontWeight: "700",
              marginBottom: "8px",
            }}
          >
            Tipo de visualização
          </label>

          <select
            id="modo-daltonismo"
            value={configuracao.daltonismo || "normal"}
            onChange={alternarDaltonismo}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "12px",
              border: "1px solid var(--pulsan-borda, #d8d8d8)",
              background: "var(--pulsan-bg, #ffffff)",
              color: "var(--pulsan-texto, #172c35)",
            }}
          >
            <option value="normal">Cores normais</option>
            <option value="protanopia">Protanopia</option>
            <option value="deuteranopia">Deuteranopia</option>
            <option value="tritanopia">Tritanopia</option>
            <option value="acromatopsia">Escala de cinza</option>
          </select>
        </section>

        <section
          style={{
            background: "var(--pulsan-card, #ffffff)",
            border: "1px solid var(--pulsan-borda, #e5e5e5)",
            borderRadius: "18px",
            padding: "20px",
            marginBottom: "18px",
          }}
        >
          <h2 style={{ marginTop: 0 }}>
            Modo Libras
          </h2>

          <p style={textoDescricao}>
            Ative esta opção para exibir vídeos de apoio em Libras
            dentro da plataforma.
          </p>

          <button
            type="button"
            onClick={alternarLibras}
            aria-pressed={configuracao.libras}
            style={estiloBotao}
          >
            {configuracao.libras ? "✓ " : ""}
            Ativar modo Libras
          </button>

          {configuracao.libras && (
            <div
              style={{
                marginTop: "18px",
                padding: "14px",
                borderRadius: "14px",
                background: "var(--pulsan-bg, #f5f8ff)",
              }}
            >
              <p style={textoDescricao}>
                O modo Libras está ativo globalmente. Quando
                existirem vídeos de apoio correspondentes ao
                conteúdo, eles poderão ser exibidos.
              </p>

              <video
                src="/libras/apresentacao.mp4"
                controls
                playsInline
                aria-label="Vídeo de apresentação em Libras"
                style={{
                  width: "100%",
                  maxWidth: "360px",
                  borderRadius: "14px",
                }}
                onError={(evento) => {
                  evento.currentTarget.style.display = "none";
                }}
              />
            </div>
          )}
        </section>

        <button
          type="button"
          onClick={restaurarPadrao}
          style={{
            ...estiloBotao,
            background: "transparent",
            color: "var(--pulsan-primaria, #20adb0)",
          }}
        >
          Restaurar configurações padrão
        </button>
      </div>
    </main>
  );
}


const estiloBotao = {
  width: "100%",
  minHeight: "48px",
  padding: "12px 16px",
  borderRadius: "12px",
  border: "1px solid var(--pulsan-borda, #d8d8d8)",
  background: "var(--pulsan-card, #ffffff)",
  color: "var(--pulsan-texto, #172c35)",
  cursor: "pointer",
  textAlign: "left",
  fontWeight: "600",
};

const textoDescricao = {
  color: "var(--pulsan-texto-secundario, #687780)",
  lineHeight: 1.6,
};

export default Acessibilidade;