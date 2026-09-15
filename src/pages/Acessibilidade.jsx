import React, { useState } from "react";

function Acessibilidade({
  irPara,
  acessibilidade,
  alterarAcessibilidade,
}) {
  const [ouvindo, setOuvindo] = useState(false);

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

      if (comando.includes("ler página")) {
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
      } else {
        lerTexto(
          "Comando não reconhecido. Diga ler página, voltar, abrir ambiente, abrir reflexão ou abrir perfil."
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

  function alternarVoz() {
    const novoValor = !acessibilidade.voz;

    alterarAcessibilidade("voz", novoValor);

    if (!novoValor && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  function voltar() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    irPara("perfil");
  }

  return (
    <main
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
            Use a voz para ouvir o conteúdo da tela ou
            navegar pela plataforma.
          </p>

          <div style={{ display: "grid", gap: "12px" }}>
            <button
              type="button"
              onClick={alternarVoz}
              aria-pressed={acessibilidade.voz}
              style={estiloBotao}
            >
              {acessibilidade.voz ? "✓ " : ""}
              Ativar leitura e comando por voz
            </button>

            <button
              type="button"
              onClick={() => lerTexto(document.body.innerText)}
              style={estiloBotao}
            >
              🔊 Ler página atual
            </button>

            <button
              type="button"
              onClick={iniciarComandoPorVoz}
              style={estiloBotao}
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
            Escolha o modo de cores que melhor atende
            à sua necessidade visual.
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
            onChange={(evento) =>
              alterarAcessibilidade(
                "daltonismo",
                evento.target.value
              )
            }
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
            <option value="acromatopsia">
              Escala de cinza
            </option>
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
            Ative esta opção para exibir vídeos de apoio
            em Libras dentro da plataforma.
          </p>

          <button
            type="button"
            onClick={() =>
              alterarAcessibilidade(
                "libras",
                !acessibilidade.libras
              )
            }
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
                O espaço para vídeos em Libras está ativado.
                Os vídeos serão adicionados conforme forem
                produzidos.
              </p>

              <video
                src="/libras/apresentacao.mp4"
                controls
                playsInline
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
          onClick={() => {
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
          }}
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