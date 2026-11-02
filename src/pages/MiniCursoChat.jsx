import React, { useMemo, useState } from "react";

/*
  ============================================================
  MINI CURSO PULSAN — COMO ACOLHER E AJUDAR
  ============================================================

  Vídeos esperados em public/videos/mini-curso/:
    etapa-1.mp4
    etapa-2.mp4
    etapa-3.mp4
    etapa-4.mp4
    etapa-5.mp4
    etapa-6.mp4
    etapa-7.mp4

  O componente funciona mesmo sem os vídeos.
  Quando os arquivos forem colocados nos caminhos acima,
  eles aparecerão automaticamente.
*/

const ETAPAS = [
  {
    id: 1,
    titulo: "Perceber",
    subtitulo: "Nem todo pedido de ajuda é feito em voz alta.",
    video: "/videos/mini-curso/etapa-1.mp4",
    abertura:
      "Antes de ajudar alguém, precisamos aprender a perceber quando uma pessoa pode estar passando por um momento difícil.",
    mensagem:
      "Perceber não significa diagnosticar o que alguém está sentindo. Significa notar mudanças, demonstrar cuidado e mostrar que aquela pessoa não está invisível.",
    situacao:
      "Uma pessoa que normalmente conversa bastante está mais quieta nos últimos dias. Quando alguém pergunta se está tudo bem, ela responde apenas: \"Estou normal.\" O que você faria?",
    opcoes: [
      {
        texto: "Deixaria passar. Se ela quiser conversar, vai procurar alguém.",
        correta: false,
        explicacao:
          "Nem sempre quem precisa de ajuda consegue dar o primeiro passo. Demonstrar disponibilidade pode fazer diferença.",
      },
      {
        texto: "Perguntaria com cuidado se está tudo bem e mostraria que estou disponível para ouvir.",
        correta: true,
        explicacao:
          "Perfeito. Você não está obrigando a pessoa a falar. Está apenas mostrando que percebeu e que existe alguém disponível.",
      },
      {
        texto: "Perguntaria imediatamente o que aconteceu e insistiria até ela responder.",
        correta: false,
        explicacao:
          "Demonstrar preocupação é importante, mas pressionar pode fazer a pessoa se fechar ainda mais.",
      },
    ],
  },
  {
    id: 2,
    titulo: "Aproximar",
    subtitulo: "Como chegar sem invadir.",
    video: "/videos/mini-curso/etapa-2.mp4",
    abertura:
      "Agora que você percebeu que alguém pode não estar bem, vem uma pergunta importante: como chegar perto sem transformar cuidado em pressão?",
    mensagem:
      "Uma abordagem acolhedora deixa espaço para a pessoa escolher se quer conversar. Você demonstra preocupação sem exigir uma explicação.",
    situacao:
      "Você percebe que alguém está diferente. Qual destas abordagens demonstra mais cuidado?",
    opcoes: [
      {
        texto: "\"O que aconteceu? Você precisa me contar agora.\"",
        correta: false,
        explicacao:
          "A intenção pode ser boa, mas a frase coloca pressão e tira da pessoa o direito de escolher quando falar.",
      },
      {
        texto: "\"Percebi que você parece um pouco diferente. Está tudo bem? Se quiser conversar, estou aqui.\"",
        correta: true,
        explicacao:
          "Essa abordagem demonstra atenção, mas respeita o espaço da pessoa.",
      },
      {
        texto: "\"Você está estranho ultimamente. Tem alguma coisa errada com você?\"",
        correta: false,
        explicacao:
          "A frase pode soar como julgamento. O ideal é demonstrar cuidado sem rotular a pessoa.",
      },
    ],
  },
  {
    id: 3,
    titulo: "Escutar",
    subtitulo: "Ouvir é mais do que esperar sua vez de falar.",
    video: "/videos/mini-curso/etapa-3.mp4",
    abertura:
      "Quando alguém começa a desabafar, talvez você já queira responder, aconselhar ou contar uma experiência parecida. Mas existe algo que vem antes: escutar.",
    mensagem:
      "Escutar de verdade é prestar atenção, não interromper, não transformar a conversa em uma competição e tentar compreender o que a pessoa está vivendo.",
    situacao:
      "A pessoa diz: \"Eu estou cansado de fingir que está tudo bem.\" Qual resposta demonstra mais disponibilidade para ouvir?",
    opcoes: [
      {
        texto: "\"Eu sei como é. Comigo aconteceu algo muito pior.\"",
        correta: false,
        explicacao:
          "Comparar sofrimentos pode fazer a pessoa sentir que sua experiência foi diminuída.",
      },
      {
        texto: "\"Você precisa pensar positivo. Isso vai passar.\"",
        correta: false,
        explicacao:
          "A frase tenta resolver rapidamente algo que ainda precisa ser compreendido.",
      },
      {
        texto: "\"Imagino que esteja sendo difícil. Se quiser, pode me contar o que está acontecendo.\"",
        correta: true,
        explicacao:
          "Essa resposta reconhece o sentimento e deixa a pessoa livre para continuar.",
      },
    ],
  },
  {
    id: 4,
    titulo: "Acolher",
    subtitulo: "Você não precisa resolver para fazer diferença.",
    video: "/videos/mini-curso/etapa-4.mp4",
    abertura:
      "Acolher não significa ter a resposta perfeita. Muitas vezes, significa fazer alguém perceber que seus sentimentos não foram ignorados.",
    mensagem:
      "Antes de oferecer soluções, procure compreender. Evite diminuir sentimentos, julgar ou dizer que a pessoa deveria simplesmente esquecer o problema.",
    situacao:
      "Alguém diz: \"Eu estou muito sobrecarregado e não sei mais o que fazer.\" Qual resposta é mais acolhedora?",
    opcoes: [
      {
        texto: "\"Todo mundo passa por isso. Você precisa ser forte.\"",
        correta: false,
        explicacao:
          "A frase pode fazer a pessoa sentir que não deveria estar sofrendo.",
      },
      {
        texto: "\"Entendo que isso esteja pesado para você. Quer me contar um pouco mais?\"",
        correta: true,
        explicacao:
          "Você reconhece o que a pessoa está sentindo e abre espaço para ela falar.",
      },
      {
        texto: "\"Se fosse comigo, eu faria exatamente isso...\"",
        correta: false,
        explicacao:
          "A experiência de cada pessoa é diferente. O primeiro passo é compreender, não substituir a história dela pela sua.",
      },
    ],
  },
  {
    id: 5,
    titulo: "Respeitar",
    subtitulo: "Confiança também é saber guardar.",
    video: "/videos/mini-curso/etapa-5.mp4",
    abertura:
      "Quando alguém compartilha algo pessoal, ela está confiando em você. Essa confiança precisa ser tratada com responsabilidade.",
    mensagem:
      "Não compartilhe histórias, prints ou informações pessoais. Também respeite quando alguém não quiser continuar uma conversa.",
    situacao:
      "Depois de uma conversa no PULSAN, um amigo pergunta o que a outra pessoa contou. O que você faria?",
    opcoes: [
      {
        texto: "Contaria porque meu amigo é de confiança.",
        correta: false,
        explicacao:
          "A informação foi confiada a você, não ao seu amigo. Privacidade continua sendo importante.",
      },
      {
        texto: "Contaria apenas uma parte.",
        correta: false,
        explicacao:
          "Compartilhar apenas uma parte ainda quebra a confiança da pessoa.",
      },
      {
        texto: "Preservaria a conversa e não compartilharia o que foi confiado.",
        correta: true,
        explicacao:
          "Exatamente. Acolhimento também significa proteger a privacidade.",
      },
    ],
  },
  {
    id: 6,
    titulo: "Reconhecer seus limites",
    subtitulo: "Ajudar não significa carregar tudo sozinho.",
    video: "/videos/mini-curso/etapa-6.mp4",
    abertura:
      "Existe uma coisa importante que você precisa lembrar: você não precisa resolver a vida de alguém para ajudar.",
    mensagem:
      "Seu papel é ouvir, acolher e reconhecer quando uma situação ultrapassa aquilo que você consegue oferecer. Em situações graves, é importante buscar o apoio adequado.",
    situacao:
      "Durante uma conversa, você percebe que a situação é muito mais séria do que imaginava. O que fazer?",
    opcoes: [
      {
        texto: "Tentar resolver tudo sozinho para não abandonar a pessoa.",
        correta: false,
        explicacao:
          "Você não precisa assumir sozinho uma situação que exige apoio adequado.",
      },
      {
        texto: "Continuar ouvindo com cuidado, reconhecer seus limites e incentivar a busca pelo apoio adequado quando necessário.",
        correta: true,
        explicacao:
          "Essa é uma postura responsável. Acolher também é saber quando procurar ajuda.",
      },
      {
        texto: "Encerrar a conversa imediatamente sem explicar nada.",
        correta: false,
        explicacao:
          "Reconhecer limites não significa abandonar a pessoa. É possível estabelecer limites com respeito.",
      },
    ],
  },
  {
    id: 7,
    titulo: "Desafio final",
    subtitulo: "Agora vamos descobrir se você está preparado.",
    video: "/videos/mini-curso/etapa-7.mp4",
    abertura:
      "Agora você conhece os principais princípios. Mas conhecer é diferente de saber aplicar. Vamos testar suas decisões.",
    mensagem:
      "Pense como se a pessoa estivesse realmente na sua frente. Não procure apenas a resposta que parece bonita. Pense no que realmente seria acolhedor e responsável.",
    situacao:
      "Uma pessoa diz: \"Não quero incomodar ninguém com os meus problemas.\" Qual resposta você considera mais acolhedora?",
    opcoes: [
      {
        texto: "\"Você está incomodando mesmo, mas pode falar.\"",
        correta: false,
        explicacao:
          "Essa resposta pode reforçar o medo da pessoa de incomodar.",
      },
      {
        texto: "\"Você não precisa passar por isso sozinho. Se quiser falar, eu estou aqui para ouvir.\"",
        correta: true,
        explicacao:
          "Você demonstra disponibilidade sem obrigar a pessoa a falar.",
      },
      {
        texto: "\"Todo mundo tem problemas, então tente esquecer isso.\"",
        correta: false,
        explicacao:
          "Comparar problemas pode diminuir o sentimento da pessoa.",
      },
    ],
  },
];

const TOTAL_ETAPAS = ETAPAS.length;

export default function MiniCursoChat({
  irPara,
  tema = "claro",
  acessibilidade = {},
  alterarAcessibilidade,
}) {
  const usuarioMiniCurso = (() => {
    for (const chave of ["usuarioLogado", "pulsanUsuarioAtual"]) {
      try {
        const usuario = JSON.parse(localStorage.getItem(chave) || "{}");
        if (usuario?.id || usuario?.email) return String(usuario.id || usuario.email);
      } catch { /* usa a próxima chave */ }
    }
    return "visitante-local";
  })();
  const chaveMiniCurso = (nome) => `pulsanMiniCursoChat_${usuarioMiniCurso}_${nome}`;

  const [etapaAtual, setEtapaAtual] = useState(() => {
    const salvo = Number(
      localStorage.getItem(chaveMiniCurso("Etapa")) || localStorage.getItem("pulsanMiniCursoChatEtapa") || 1
    );

    return Math.min(Math.max(salvo, 1), TOTAL_ETAPAS);
  });

  const [respostaSelecionada, setRespostaSelecionada] = useState(null);
  const [respostaConfirmada, setRespostaConfirmada] = useState(false);
  const [acertos, setAcertos] = useState(() =>
    Number(localStorage.getItem(chaveMiniCurso("Acertos")) || localStorage.getItem("pulsanMiniCursoChatAcertos") || 0)
  );
  const [concluido, setConcluido] = useState(
    localStorage.getItem(chaveMiniCurso("Concluido")) === "true" || localStorage.getItem("pulsanMiniCursoChatConcluido") === "true"
  );

  const etapa = ETAPAS[etapaAtual - 1];

  const progresso = useMemo(
    () => Math.round((etapaAtual / TOTAL_ETAPAS) * 100),
    [etapaAtual]
  );

  function responder(index) {
    if (respostaConfirmada) return;

    setRespostaSelecionada(index);
  }

  function confirmarResposta() {
    if (respostaSelecionada === null) return;

    const correta = etapa.opcoes[respostaSelecionada].correta;

    setRespostaConfirmada(true);

    if (correta) {
      const novoTotal = acertos + 1;
      setAcertos(novoTotal);
      localStorage.setItem(
        chaveMiniCurso("Acertos"),
        String(novoTotal)
      );
    }
  }

  function proximaEtapa() {
    if (!respostaConfirmada) return;

    if (etapaAtual < TOTAL_ETAPAS) {
      const proxima = etapaAtual + 1;

      setEtapaAtual(proxima);
      localStorage.setItem(
        chaveMiniCurso("Etapa"),
        String(proxima)
      );

      setRespostaSelecionada(null);
      setRespostaConfirmada(false);

      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    localStorage.setItem(chaveMiniCurso("Concluido"), "true");
    localStorage.setItem(
      chaveMiniCurso("ConcluidoEm"),
      new Date().toISOString()
    );

    setConcluido(true);
  }

  function reiniciarCurso() {
    ["Concluido", "ConcluidoEm", "Etapa", "Acertos"].forEach((nome) =>
      localStorage.removeItem(chaveMiniCurso(nome))
    );

    setEtapaAtual(1);
    setRespostaSelecionada(null);
    setRespostaConfirmada(false);
    setAcertos(0);
    setConcluido(false);

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const cores = {
    fundo: tema === "escuro" ? "#081B35" : "#EAF3FF",
    card: tema === "escuro" ? "#0F2D5B" : "#FFFFFF",
    card2: tema === "escuro" ? "#15365F" : "#F7FAFF",
    texto: tema === "escuro" ? "#FFFFFF" : "#0F2D5B",
    secundario: tema === "escuro" ? "#C2D2E8" : "#5F7695",
    borda: tema === "escuro" ? "#416DA4" : "#A8C7FF",
    primaria: tema === "escuro" ? "#6EA0FF" : "#3A7DFF",
  };

  if (concluido) {
    return (
      <main
        className="pulsan-mini-curso"
        style={{
          minHeight: "100vh",
          background: cores.fundo,
          color: cores.texto,
          padding: "28px 18px 110px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: "min(760px, 100%)",
            margin: "0 auto",
          }}
        >
          <button
            type="button"
            onClick={() => irPara("ambiente")}
            style={botaoVoltar(cores)}
          >
            ← Voltar
          </button>

          <section
            style={{
              marginTop: 28,
              background: cores.card,
              border: `1px solid ${cores.borda}`,
              borderRadius: 28,
              padding: "clamp(28px, 6vw, 54px)",
              textAlign: "center",
              boxShadow: "0 18px 50px rgba(15,45,91,.12)",
            }}
          >
            <div style={{ fontSize: 64, marginBottom: 12 }}>🌱</div>

            <div
              style={{
                display: "inline-flex",
                padding: "7px 13px",
                borderRadius: 999,
                background: tema === "escuro" ? "#15365F" : "#EAF3FF",
                color: cores.primaria,
                fontSize: 12,
                fontWeight: 800,
                marginBottom: 14,
              }}
            >
              MINI CURSO CONCLUÍDO
            </div>

            <h1
              style={{
                margin: "0 0 14px",
                fontSize: "clamp(28px, 6vw, 44px)",
                lineHeight: 1.08,
              }}
            >
              Você está preparado para acolher.
            </h1>

            <p
              style={{
                margin: "0 auto 24px",
                maxWidth: 600,
                color: cores.secundario,
                lineHeight: 1.7,
                fontSize: 16,
              }}
            >
              Você aprendeu a perceber, se aproximar, escutar, acolher,
              respeitar limites e reconhecer quando é necessário buscar apoio
              adequado.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 12,
                margin: "24px auto",
                maxWidth: 430,
              }}
            >
              <div style={resultadoCard(cores)}>
                <strong>{TOTAL_ETAPAS}</strong>
                <span>etapas</span>
              </div>

              <div style={resultadoCard(cores)}>
                <strong>{acertos}</strong>
                <span>respostas certas</span>
              </div>
            </div>

            <p
              style={{
                color: cores.secundario,
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              O acolhimento não exige respostas perfeitas. Exige presença,
              respeito e responsabilidade.
            </p>

            <button
              type="button"
              onClick={() => irPara("ambiente")}
              style={{
                width: "100%",
                border: 0,
                borderRadius: 16,
                padding: "15px 20px",
                background: cores.primaria,
                color: "#FFFFFF",
                fontWeight: 800,
                fontSize: 15,
                cursor: "pointer",
                marginTop: 12,
              }}
            >
              💙 Voltar para o PULSAN
            </button>

            <button
              type="button"
              onClick={reiniciarCurso}
              style={{
                width: "100%",
                border: `1px solid ${cores.borda}`,
                borderRadius: 16,
                padding: "13px 20px",
                background: "transparent",
                color: cores.texto,
                fontWeight: 700,
                fontSize: 14,
                cursor: "pointer",
                marginTop: 10,
              }}
            >
              Refazer mini curso
            </button>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main
      className="pulsan-mini-curso"
      style={{
        minHeight: "100vh",
        background: cores.fundo,
        color: cores.texto,
        padding: "22px 18px 110px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "min(900px, 100%)",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 18,
          }}
        >
          <button
            type="button"
            onClick={() => irPara("ambiente")}
            style={botaoVoltar(cores)}
          >
            ← Voltar
          </button>

          <span
            style={{
              fontSize: 13,
              color: cores.secundario,
              fontWeight: 700,
            }}
          >
            Etapa {etapaAtual} de {TOTAL_ETAPAS}
          </span>
        </div>

        <header
          style={{
            background: cores.card,
            border: `1px solid ${cores.borda}`,
            borderRadius: 24,
            padding: "20px 22px",
            marginBottom: 16,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: 9,
            }}
          >
            <strong
              style={{
                color: cores.texto,
                fontSize: 14,
              }}
            >
              Seu progresso
            </strong>

            <strong
              style={{
                color: cores.primaria,
                fontSize: 14,
              }}
            >
              {progresso}%
            </strong>
          </div>

          <div
            style={{
              height: 8,
              borderRadius: 999,
              background: cores.card2,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progresso}%`,
                height: "100%",
                background: cores.primaria,
                borderRadius: 999,
                transition: "width .25s ease",
              }}
            />
          </div>
        </header>

        <section
          style={{
            background: cores.card,
            border: `1px solid ${cores.borda}`,
            borderRadius: 28,
            overflow: "hidden",
            boxShadow: "0 16px 44px rgba(15,45,91,.10)",
          }}
        >
          <div
            style={{
              padding: "clamp(22px, 5vw, 42px)",
              background:
                tema === "escuro"
                  ? "linear-gradient(135deg,#0F2D5B,#15365F)"
                  : "linear-gradient(135deg,#FFFFFF,#EAF3FF)",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                padding: "7px 12px",
                borderRadius: 999,
                background: tema === "escuro" ? "#15365F" : "#EAF3FF",
                color: cores.primaria,
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: ".04em",
              }}
            >
              ETAPA {String(etapa.id).padStart(2, "0")}
            </div>

            <h1
              style={{
                margin: "14px 0 5px",
                fontSize: "clamp(28px, 6vw, 46px)",
                lineHeight: 1.05,
              }}
            >
              {etapa.titulo}
            </h1>

            <p
              style={{
                margin: 0,
                color: cores.secundario,
                fontSize: 16,
                lineHeight: 1.5,
              }}
            >
              {etapa.subtitulo}
            </p>
          </div>

          <div style={{ padding: "clamp(18px, 4vw, 34px)" }}>
            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "16 / 9",
                borderRadius: 22,
                overflow: "hidden",
                background: "#081B35",
                marginBottom: 24,
              }}
            >
              <video
                key={etapa.video}
                controls
                playsInline
                preload="metadata"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                  const fallback =
                    event.currentTarget.parentElement?.querySelector(
                      "[data-video-fallback]"
                    );
                  if (fallback) fallback.style.display = "flex";
                }}
              >
                <source src={etapa.video} type="video/mp4" />
              </video>

              <div
                data-video-fallback
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "none",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  padding: 24,
                  textAlign: "center",
                  color: "#FFFFFF",
                  background:
                    "linear-gradient(135deg,#0F2D5B,#3A7DFF)",
                }}
              >
                <div style={{ fontSize: 44, marginBottom: 10 }}>🎥</div>
                <strong style={{ fontSize: 17 }}>
                  Vídeo da apresentadora
                </strong>
                <span
                  style={{
                    marginTop: 7,
                    maxWidth: 420,
                    fontSize: 13,
                    opacity: .85,
                    lineHeight: 1.5,
                  }}
                >
                  O espaço já está preparado. Adicione o vídeo da IA em:
                  <br />
                  <b>{etapa.video}</b>
                </span>
              </div>
            </div>

            <div
              style={{
                background: cores.card2,
                border: `1px solid ${cores.borda}`,
                borderRadius: 20,
                padding: 20,
                marginBottom: 24,
              }}
            >
              <div
                style={{
                  color: cores.primaria,
                  fontSize: 12,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                O que você precisa entender
              </div>

              <p
                style={{
                  margin: "0 0 10px",
                  fontWeight: 700,
                  lineHeight: 1.55,
                }}
              >
                {etapa.abertura}
              </p>

              <p
                style={{
                  margin: 0,
                  color: cores.secundario,
                  lineHeight: 1.65,
                  fontSize: 14,
                }}
              >
                {etapa.mensagem}
              </p>
            </div>

            <div>
              <div
                style={{
                  color: cores.primaria,
                  fontSize: 12,
                  fontWeight: 900,
                  textTransform: "uppercase",
                  marginBottom: 7,
                }}
              >
                Situação prática
              </div>

              <h2
                style={{
                  margin: "0 0 18px",
                  fontSize: "clamp(20px, 4vw, 27px)",
                  lineHeight: 1.25,
                }}
              >
                {etapa.situacao}
              </h2>

              <div style={{ display: "grid", gap: 10 }}>
                {etapa.opcoes.map((opcao, index) => {
                  const selecionada = respostaSelecionada === index;
                  const mostrarCorreta =
                    respostaConfirmada && opcao.correta;
                  const mostrarErrada =
                    respostaConfirmada &&
                    selecionada &&
                    !opcao.correta;

                  return (
                    <button
                      key={opcao.texto}
                      type="button"
                      onClick={() => responder(index)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        border: `2px solid ${
                          mostrarCorreta
                            ? "#2E9D68"
                            : mostrarErrada
                            ? "#D9534F"
                            : selecionada
                            ? cores.primaria
                            : cores.borda
                        }`,
                        borderRadius: 16,
                        padding: "15px 16px",
                        background:
                          mostrarCorreta
                            ? tema === "escuro"
                              ? "#173F35"
                              : "#EAF8F1"
                            : mostrarErrada
                            ? tema === "escuro"
                              ? "#4A2424"
                              : "#FFF0F0"
                            : selecionada
                            ? tema === "escuro"
                              ? "#15365F"
                              : "#EAF3FF"
                            : cores.card,
                        color: cores.texto,
                        cursor: respostaConfirmada
                          ? "default"
                          : "pointer",
                        fontSize: 14,
                        fontWeight: selecionada ? 800 : 650,
                        lineHeight: 1.45,
                      }}
                    >
                      <span
                        style={{
                          display: "inline-flex",
                          width: 28,
                          height: 28,
                          borderRadius: "50%",
                          alignItems: "center",
                          justifyContent: "center",
                          marginRight: 10,
                          background: selecionada
                            ? cores.primaria
                            : cores.card2,
                          color: selecionada
                            ? "#FFFFFF"
                            : cores.secundario,
                          fontWeight: 900,
                          verticalAlign: "middle",
                        }}
                      >
                        {String.fromCharCode(65 + index)}
                      </span>
                      {opcao.texto}
                    </button>
                  );
                })}
              </div>

              {respostaConfirmada && respostaSelecionada !== null && (
                <div
                  style={{
                    marginTop: 16,
                    borderRadius: 18,
                    padding: 18,
                    background: etapa.opcoes[respostaSelecionada].correta
                      ? tema === "escuro"
                        ? "#173F35"
                        : "#EAF8F1"
                      : tema === "escuro"
                      ? "#4A2424"
                      : "#FFF0F0",
                    border: `1px solid ${
                      etapa.opcoes[respostaSelecionada].correta
                        ? "#2E9D68"
                        : "#D9534F"
                    }`,
                  }}
                >
                  <strong style={{ display: "block", marginBottom: 6 }}>
                    {etapa.opcoes[respostaSelecionada].correta
                      ? "✓ Você entendeu!"
                      : "Vamos refletir sobre essa escolha."}
                  </strong>

                  <span
                    style={{
                      color: cores.texto,
                      fontSize: 14,
                      lineHeight: 1.6,
                    }}
                  >
                    {etapa.opcoes[respostaSelecionada].explicacao}
                  </span>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  flexWrap: "wrap",
                  marginTop: 20,
                }}
              >
                {!respostaConfirmada ? (
                  <button
                    type="button"
                    disabled={respostaSelecionada === null}
                    onClick={confirmarResposta}
                    style={{
                      flex: "1 1 220px",
                      border: 0,
                      borderRadius: 16,
                      padding: "15px 20px",
                      background:
                        respostaSelecionada === null
                          ? cores.borda
                          : cores.primaria,
                      color: "#FFFFFF",
                      fontWeight: 900,
                      cursor:
                        respostaSelecionada === null
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    Confirmar resposta
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={proximaEtapa}
                    style={{
                      flex: "1 1 220px",
                      border: 0,
                      borderRadius: 16,
                      padding: "15px 20px",
                      background: cores.primaria,
                      color: "#FFFFFF",
                      fontWeight: 900,
                      cursor: "pointer",
                    }}
                  >
                    {etapaAtual === TOTAL_ETAPAS
                      ? "Concluir mini curso"
                      : "Próxima etapa →"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function botaoVoltar(cores) {
  return {
    border: `1px solid ${cores.borda}`,
    background: cores.card,
    color: cores.texto,
    borderRadius: 12,
    padding: "9px 13px",
    fontWeight: 800,
    fontSize: 13,
    cursor: "pointer",
  };
}

function resultadoCard(cores) {
  return {
    background: cores.card2,
    border: `1px solid ${cores.borda}`,
    borderRadius: 16,
    padding: "14px 10px",
    display: "flex",
    flexDirection: "column",
    gap: 3,
  };
}
