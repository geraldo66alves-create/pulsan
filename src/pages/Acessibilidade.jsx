import React, { useEffect, useRef, useState } from "react";

function Acessibilidade({
  irPara,
  acessibilidade,
  alterarAcessibilidade,
}) {
  const [ouvindo, setOuvindo] = useState(false);
  const [toquesVoz, setToquesVoz] = useState(0);
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

    const reconhecimento = new Reconhecimento();

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
      } else if (comando.includes("abrir ambiente")) {
        irPara("ambiente");
      } else if (
        comando.includes("abrir reflexão") ||
        comando.includes("abrir reflexao")
      ) {
        irPara("reflexao");
      } else if (comando.includes("abrir perfil")) {
        irPara("perfil");
      } else if (comando.includes("alto contraste")) {
        alterarAcessibilidade(
          "altoContraste",
          !acessibilidade.altoContraste
        );
      } else if (
        comando.includes("texto maior") ||
        comando.includes("aumentar texto")
      ) {
        alterarAcessibilidade(
          "textoMaior",
          !acessibilidade.textoMaior
        );
      } else if (comando.includes("botões maiores") || comando.includes("botoes maiores")) {
        alterarAcessibilidade(
          "botoesMaiores",
          !acessibilidade.botoesMaiores
        );
      } else if (
        comando.includes("reduzir animações") ||
        comando.includes("reduzir animacoes")
      ) {
        alterarAcessibilidade(
          "reduzirAnimacoes",
          !acessibilidade.reduzirAnimacoes
        );
      } else {
        lerTexto(
          "Comando não reconhecido. Diga ler página, voltar, abrir ambiente, abrir reflexão, abrir perfil, alto contraste, texto maior, botões maiores ou reduzir animações."
        );
      }
    };

    reconhecimento.onerror = () => {
      setOuvindo(false);
      alert("Não foi possível reconhecer o comando.");
    };

    reconhecimento.onend = () => {
      setOuvindo(false);
    };

    reconhecimento.start();
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
    };
  }, []);

  function alternarVoz() {
    const novoValor = !Boolean(acessibilidade?.voz);

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
    if (acessibilidade?.voz) return;

    const handleTouch = () => {
      registrarToqueNaTela();
    };

    window.addEventListener("touchend", handleTouch, { passive: true });

    return () => {
      window.removeEventListener("touchend", handleTouch);
    };
  }, [acessibilidade?.voz]);

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
      !acessibilidade.libras
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
    acessibilidade.altoContraste,
    acessibilidade.textoMaior,
    acessibilidade.botoesMaiores,
    acessibilidade.reduzirAnimacoes,
    acessibilidade.voz,
    acessibilidade.daltonismo !== "normal",
    acessibilidade.libras,
  ].filter(Boolean).length;

  return (
    <main
      className="pulsan-pagina-acessibilidade"
      style={{
        minHeight: "100vh",
        background: "var(--pulsan-bg, #fffdf9)",
        color: "var(--pulsan-texto, #172c35)",
        padding: "24px 18px 100px",
      }}
    >
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
                  !acessibilidade.altoContraste
                )
              }
              aria-pressed={acessibilidade.altoContraste}
              style={estiloBotao}
            >
              {acessibilidade.altoContraste ? "✓ " : ""}
              Alto contraste
            </button>

            <button
              type="button"
              onClick={() =>
                alterarAcessibilidade(
                  "textoMaior",
                  !acessibilidade.textoMaior
                )
              }
              aria-pressed={acessibilidade.textoMaior}
              style={estiloBotao}
            >
              {acessibilidade.textoMaior ? "✓ " : ""}
              Texto maior
            </button>

            <button
              type="button"
              onClick={() =>
                alterarAcessibilidade(
                  "botoesMaiores",
                  !acessibilidade.botoesMaiores
                )
              }
              aria-pressed={acessibilidade.botoesMaiores}
              style={estiloBotao}
            >
              {acessibilidade.botoesMaiores ? "✓ " : ""}
              Botões maiores
            </button>

            <button
              type="button"
              onClick={() =>
                alterarAcessibilidade(
                  "reduzirAnimacoes",
                  !acessibilidade.reduzirAnimacoes
                )
              }
              aria-pressed={acessibilidade.reduzirAnimacoes}
              style={estiloBotao}
            >
              {acessibilidade.reduzirAnimacoes ? "✓ " : ""}
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
              aria-pressed={acessibilidade.voz}
              style={estiloBotao}
            >
              {acessibilidade.voz ? "✓ " : ""}
              {acessibilidade.voz
                ? "Leitura e comando por voz ativados"
                : "Ativar leitura e comando por voz"}
            </button>

            {acessibilidade?.voz && (
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
              disabled={!acessibilidade?.voz}
              style={{
                ...estiloBotao,
                opacity: acessibilidade?.voz ? 1 : 0.55,
                cursor: acessibilidade?.voz ? "pointer" : "not-allowed",
              }}
            >
              🔊 Ler página atual
            </button>

            <button
              type="button"
              onClick={iniciarComandoPorVoz}
              disabled={!acessibilidade?.voz}
              style={{
                ...estiloBotao,
                opacity: acessibilidade?.voz ? 1 : 0.55,
                cursor: acessibilidade?.voz ? "pointer" : "not-allowed",
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
            value={acessibilidade.daltonismo || "normal"}
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
            aria-pressed={acessibilidade.libras}
            style={estiloBotao}
          >
            {acessibilidade.libras ? "✓ " : ""}
            Ativar modo Libras
          </button>

          {acessibilidade.libras && (
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