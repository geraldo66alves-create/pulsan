import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function Perfil({
  irPara,
  tema = "claro",
  alterarTema,
  acessibilidade = {},
  alterarAcessibilidade,
  sairDaConta,
}) {

  // =====================================
  // TEMA GLOBAL
  // O tema agora é controlado pelo App.jsx.
  // =====================================

  const escuro = tema === "escuro";


  // =====================================
  // ACESSIBILIDADE
  // =====================================

  const altoContraste = acessibilidade?.altoContraste ?? false;
  const textoGrande = acessibilidade?.textoMaior ?? false;
  const botoesGrandes = acessibilidade?.botoesMaiores ?? false;
  const reduzirAnimacoes = acessibilidade?.reduzirAnimacoes ?? false;

  const [acessibilidadeAberta, setAcessibilidadeAberta] =
    useState(false);

  const [leituraVoz, setLeituraVoz] =
    useState(
      localStorage.getItem("pulsanLeituraVoz") === "true"
    );

  const [falando, setFalando] =
    useState(false);


  function falarTexto(texto) {
    if (!("speechSynthesis" in window)) {
      alert(
        "A leitura em voz alta não está disponível neste navegador."
      );
      return;
    }

    window.speechSynthesis.cancel();

    if (!texto || !texto.trim()) {
      return;
    }

    const fala =
      new SpeechSynthesisUtterance(texto);

    fala.lang = "pt-BR";
    fala.rate = 0.95;
    fala.pitch = 1;

    fala.onstart = () => setFalando(true);
    fala.onend = () => setFalando(false);
    fala.onerror = () => setFalando(false);

    window.speechSynthesis.speak(fala);
  }


  function pararLeitura() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setFalando(false);
  }


  function iniciarTutorialAcessibilidade() {
    if (!("speechSynthesis" in window)) {
      return;
    }

    window.speechSynthesis.cancel();

    const texto = `
      Bem-vindo ao modo acessível do Pulsan.

      Um toque em um elemento seleciona e informa o que está na tela.

      Dois toques ativam ou abrem o elemento selecionado.

      Deslize para a direita para ir para o próximo elemento.

      Deslize para a esquerda para voltar ao elemento anterior.

      Você pode interromper a leitura a qualquer momento.

      O Pulsan também funciona com os recursos de acessibilidade do seu celular,
      como TalkBack e VoiceOver.
    `;

    const fala =
      new SpeechSynthesisUtterance(texto);

    fala.lang = "pt-BR";
    fala.rate = 0.9;
    fala.pitch = 1;

    fala.onstart = () => {
      setFalando(true);
    };

    fala.onend = () => {
      setFalando(false);
    };

    fala.onerror = () => {
      setFalando(false);
    };

    window.speechSynthesis.speak(fala);
  }


  function alternarLeituraVoz() {
    const novoValor =
      !leituraVoz;

    localStorage.setItem(
      "pulsanLeituraVoz",
      String(novoValor)
    );

    setLeituraVoz(
      novoValor
    );

    if (!novoValor) {
      pararLeitura();
      return;
    }

    const tutorialJaVisto =
      localStorage.getItem(
        "pulsanTutorialAcessibilidade"
      ) === "true";

    if (!tutorialJaVisto) {
      localStorage.setItem(
        "pulsanTutorialAcessibilidade",
        "true"
      );

      iniciarTutorialAcessibilidade();
    }
  }


  function alternarTema() {
    const novoTema =
      escuro
        ? "claro"
        : "escuro";

    if (typeof alterarTema === "function") {
      alterarTema(novoTema);
    }
  }


  // =====================================
  // CORES DO TEMA
  // =====================================

  const cores = {
    fundo: escuro
      ? "#111918"
      : "#fffdf9",

    card: escuro
      ? "#1b2422"
      : "#ffffff",

    cardSuave: escuro
      ? "#202c29"
      : "#f0faf8",

    texto: escuro
      ? "#f1f5f3"
      : "#173b38",

    textoSuave: escuro
      ? "#aebbb7"
      : "#666",

    borda: escuro
      ? "#2d3a37"
      : "#eeeeee",

    destaque:
      "#20adb0",

    destaqueSuave: escuro ? "#254846" : "#e3f7f4",
    primaria: "#20adb0",
  };


  // =====================================
  // DADOS DO USUÁRIO
  // =====================================

  const [nome, setNome] = useState(
    localStorage.getItem("pulsanNome") || "Usuário Pulsan"
  );


  const [foto, setFoto] = useState(
    localStorage.getItem("pulsanFoto") || ""
  );

  useEffect(() => {
    async function carregarPerfil() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("perfis")
        .select("nome, foto")
        .eq("id", user.id)
        .maybeSingle();
      if (data?.nome) {
        setNome(data.nome);
        setNovoNome(data.nome);
        localStorage.setItem("pulsanNome", data.nome);
      }
      if (data?.foto) {
        setFoto(data.foto);
        localStorage.setItem("pulsanFoto", data.foto);
      }
    }
    carregarPerfil();
  }, []);


  // =====================================
  // AVALIAÇÕES
  // =====================================

  const avaliacoesSalvas =
    JSON.parse(
      localStorage.getItem(
        "pulsanAvaliacoes"
      ) ||
      "[]"
    );


  const quantidadeAvaliacoes =
    avaliacoesSalvas.length;


  const media =
    quantidadeAvaliacoes > 0
      ? (
          avaliacoesSalvas.reduce(
            (total, avaliacao) =>
              total +
              Number(
                avaliacao.nota || 0
              ),
            0
          ) /
          quantidadeAvaliacoes
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
      localStorage.getItem(
        "pulsanAjudas"
      ) ||
      0
    );


  // =====================================
  // PONTOS
  // =====================================

  const pontos =
    Number(
      localStorage.getItem(
        "pulsanPontos"
      ) ||
      0
    );


  // =====================================
  // EDITAR NOME
  // =====================================

  const [editando, setEditando] =
    useState(false);


  const [novoNome, setNovoNome] =
    useState(nome);


  async function salvarNome() {

    const nomeLimpo =
      novoNome.trim();


    if (!nomeLimpo) {
      alert(
        "Digite um nome."
      );

      return;
    }


    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Usuário não autenticado.");
      return;
    }

    const { error } = await supabase
      .from("perfis")
      .update({ nome: nomeLimpo })
      .eq("id", user.id);

    if (error) {
      alert("Não foi possível salvar o nome: " + error.message);
      return;
    }

    localStorage.setItem("pulsanNome", nomeLimpo);
    setNome(nomeLimpo);


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


    if (typeof sairDaConta === "function") {
      sairDaConta();
    } else {
      irPara("inicio");
    }
  }


  // =====================================
  // ESTRELAS
  // =====================================

  function mostrarEstrelas() {

    if (
      quantidadeAvaliacoes === 0
    ) {
      return "☆☆☆☆☆";
    }


    const estrelasCheias =
      Math.round(
        Number(media)
      );


    return (
      "★".repeat(
        estrelasCheias
      ) +
      "☆".repeat(
        5 -
          estrelasCheias
      )
    );
  }


  // =====================================
  // PERFIL
  // =====================================

  return (

    <div
      style={{
        minHeight:
          "100vh",

        background:
          cores.fundo,

        fontFamily:
          "Arial, Helvetica, sans-serif",

        fontSize:
          textoGrande
            ? "18px"
            : "16px",

        color:
          cores.texto,

        paddingBottom:
          "100px",

        transition:
          "background 0.3s ease, color 0.3s ease",
      }}
    >

      {/* =====================================
          CABEÇALHO
      ===================================== */}

      <header
        style={{
          background:
            escuro
              ? "linear-gradient(135deg, #263735, #1d2927)"
              : "linear-gradient(135deg, #f6d7c8, #f9e6dc)",

          padding:
            "20px 25px",

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "space-between",

          borderBottom:
            `1px solid ${cores.borda}`,

          transition:
            "background 0.3s ease",
        }}
      >

        <div
          style={{
            display:
              "flex",

            alignItems:
              "center",

            gap:
              "15px",
          }}
        >

          <img
            src="/logo.png"
            alt="Logo Pulsan"
            style={{
              width:
                "48px",

              height:
                "48px",

              objectFit:
                "contain",
            }}
          />


          <div>

            <strong
              style={{
                display:
                  "block",

                fontSize:
                  "22px",

                letterSpacing:
                  "4px",
              }}
            >
              PULSAN
            </strong>


            <span
              style={{
                color:
                  escuro
                    ? "#b9c5c1"
                    : "#666",

                fontSize:
                  "14px",
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
          maxWidth:
            "900px",

          margin:
            "40px auto",

          padding:
            "0 18px",
        }}
      >


        {/* =====================================
            PERFIL PRINCIPAL
        ===================================== */}

        <section
          style={{
            background:
              cores.card,

            borderRadius:
              "22px",

            padding:
              "35px",

            boxShadow:
              escuro
                ? "0 8px 25px rgba(0,0,0,0.22)"
                : "0 8px 25px rgba(0,0,0,0.05)",

            border:
              `1px solid ${cores.borda}`,

            textAlign:
              "center",
          }}
        >

          {/* FOTO */}

          <div
            style={{
              width:
                "110px",

              height:
                "110px",

              borderRadius:
                "50%",

              margin:
                "0 auto 20px",

              overflow:
                "hidden",

              background:
                escuro
                  ? "#293735"
                  : "#e7f5f3",

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              fontSize:
                "48px",
            }}
          >

            {foto ? (

              <img
                src={foto}
                alt={`Foto de ${nome}`}
                style={{
                  width:
                    "100%",

                  height:
                    "100%",

                  objectFit:
                    "cover",
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
                  margin:
                    "0",

                  fontSize:
                    "30px",

                  color:
                    cores.texto,
                }}
              >
                {nome}
              </h1>


              {/* SELO PSICÓLOGO */}

              {possuiSeloPsicologo && (

                <div
                  style={{
                    display:
                      "inline-flex",

                    alignItems:
                      "center",

                    gap:
                      "7px",

                    marginTop:
                      "10px",

                    marginRight:
                      "6px",

                    padding:
                      "8px 14px",

                    borderRadius:
                      "20px",

                    background:
                      escuro
                        ? "#263b4a"
                        : "#eaf4ff",

                    border:
                      "1px solid #b9d8f5",

                    color:
                      "#27628f",

                    fontSize:
                      "13px",

                    fontWeight:
                      "700",
                  }}
                >
                  🧠 Psicólogo Parceiro
                </div>

              )}


              {/* SELO APOIADOR */}

              {possuiSeloApoiador && (

                <div
                  style={{
                    display:
                      "inline-flex",

                    alignItems:
                      "center",

                    gap:
                      "7px",

                    marginTop:
                      "10px",

                    padding:
                      "8px 14px",

                    borderRadius:
                      "20px",

                    background:
                      escuro
                        ? "#3a3422"
                        : "#fff8df",

                    border:
                      "1px solid #f0d98a",

                    color:
                      "#9a7410",

                    fontSize:
                      "13px",

                    fontWeight:
                      "700",
                  }}
                >
                  🏅 Apoiador de Confiança
                </div>

              )}


              <div>

                <button
                  type="button"
                  onClick={() =>
                    setEditando(
                      true
                    )
                  }
                  style={{
                    display:
                      "block",

                    margin:
                      "12px auto 0",

                    border:
                      "none",

                    background:
                      "transparent",

                    color:
                      "#15999c",

                    fontWeight:
                      "700",

                    cursor:
                      "pointer",

                    fontSize:
                      "15px",
                  }}
                >
                  ✏️ Editar nome
                </button>

              </div>

            </>

          ) : (

            <div
              style={{
                maxWidth:
                  "400px",

                margin:
                  "0 auto",
              }}
            >

              <input
                value={
                  novoNome
                }
                onChange={(e) =>
                  setNovoNome(
                    e.target.value
                  )
                }
                placeholder="Seu nome"
                style={{
                  width:
                    "100%",

                  padding:
                    "13px",

                  borderRadius:
                    "10px",

                  border:
                    `1px solid ${cores.borda}`,

                  background:
                    cores.card,

                  color:
                    cores.texto,

                  boxSizing:
                    "border-box",

                  fontSize:
                    "16px",
                }}
              />


              <div
                style={{
                  display:
                    "flex",

                  gap:
                    "10px",

                  marginTop:
                    "12px",

                  justifyContent:
                    "center",
                }}
              >

                <button
                  type="button"
                  onClick={
                    salvarNome
                  }
                  style={{
                    background:
                      "#20adb0",

                    color:
                      "#fff",

                    border:
                      "none",

                    padding:
                      "11px 20px",

                    borderRadius:
                      "10px",

                    fontWeight:
                      "700",

                    cursor:
                      "pointer",
                  }}
                >
                  Salvar
                </button>


                <button
                  type="button"
                  onClick={() => {

                    setNovoNome(
                      nome
                    );

                    setEditando(
                      false
                    );

                  }}
                  style={{
                    background:
                      escuro
                        ? "#303b38"
                        : "#eee",

                    color:
                      cores.texto,

                    border:
                      "none",

                    padding:
                      "11px 20px",

                    borderRadius:
                      "10px",

                    fontWeight:
                      "700",

                    cursor:
                      "pointer",
                  }}
                >
                  Cancelar
                </button>

              </div>

            </div>

          )}

        </section>


        {/* =====================================
            APARÊNCIA
        ===================================== */}

        <section
          style={{
            marginTop:
              "25px",

            background:
              cores.card,

            borderRadius:
              "20px",

            padding:
              "20px",

            border:
              `1px solid ${cores.borda}`,

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "space-between",

            gap:
              "15px",

            flexWrap:
              "wrap",
          }}
        >

          <div
            style={{
              display:
                "flex",

              alignItems:
                "center",

              gap:
                "13px",
            }}
          >

            <div
              style={{
                width:
                  "45px",

                height:
                  "45px",

                borderRadius:
                  "13px",

                background:
                  escuro
                    ? "#293735"
                    : "#edf7f4",

                display:
                  "flex",

                alignItems:
                  "center",

                justifyContent:
                  "center",

                fontSize:
                  "22px",
              }}
            >
              {escuro
                ? "🌙"
                : "☀️"}
            </div>


            <div>

              <strong
                style={{
                  display:
                    "block",

                  fontSize:
                    "15px",
                }}
              >
                Aparência
              </strong>


              <span
                style={{
                  color:
                    cores.textoSuave,

                  fontSize:
                    "12px",
                }}
              >
                Escolha o modo de exibição
              </span>

            </div>

          </div>


          <button
            type="button"
            onClick={
              alternarTema
            }
            style={{
              border:
                "none",

              borderRadius:
                "13px",

              padding:
                "11px 16px",

              background:
                escuro
                  ? "#20adb0"
                  : "#eaf4f1",

              color:
                escuro
                  ? "#fff"
                  : "#26706b",

              cursor:
                "pointer",

              fontWeight:
                "700",

              fontSize:
                "12px",
            }}
          >
            {escuro
              ? "☀️ Modo claro"
              : "🌙 Modo escuro"}
          </button>

        </section>

        <button
          type="button"
          onClick={() => irPara("acessibilidade")}
          style={{
            width: "100%",
            marginTop: "25px",
            padding: botoesGrandes ? "16px 20px" : "13px 18px",
            borderRadius: "16px",
            border: `1px solid ${cores.borda}`,
            background: cores.card,
            color: cores.texto,
            cursor: "pointer",
            fontWeight: "700",
            fontSize: textoGrande ? "17px" : "15px",
            textAlign: "left",
          }}
          aria-label="Abrir página de acessibilidade"
        >
          ♿ Acessibilidade
          <span style={{ float: "right", color: cores.destaque }}>›</span>
        </button>

        {/* =====================================
            ACESSIBILIDADE
        ===================================== */}

        <section
          style={{
            marginTop:
              "25px",

            background:
              cores.card,

            borderRadius:
              "20px",

            padding:
              "22px",

            border:
              `1px solid ${cores.borda}`,

            boxShadow:
              escuro
                ? "0 8px 25px rgba(0,0,0,0.22)"
                : "0 8px 25px rgba(0,0,0,0.05)",
          }}
        >

          <button
            type="button"
            onClick={() =>
              setAcessibilidadeAberta(
                !acessibilidadeAberta
              )
            }
            aria-expanded={
              acessibilidadeAberta
            }
            aria-controls="painel-acessibilidade"
            style={{
              width:
                "100%",

              border:
                "none",

              background:
                "transparent",

              color:
                cores.texto,

              cursor:
                "pointer",

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "space-between",

              gap:
                "15px",

              padding:
                0,

              textAlign:
                "left",
            }}
          >

            <div
              style={{
                display:
                  "flex",

                alignItems:
                  "center",

                gap:
                  "13px",
              }}
            >

              <div
                aria-hidden="true"
                style={{
                  width:
                    "48px",

                  height:
                    "48px",

                  borderRadius:
                    "14px",

                  background:
                    escuro
                      ? "#2a1c3b"
                      : "#e3f7f9",

                  display:
                    "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  fontSize:
                    "24px",
                }}
              >
                ♿
              </div>


              <div>

                <strong
                  style={{
                    display:
                      "block",

                    fontSize:
                      "18px",
                  }}
                >
                  Acessibilidade
                </strong>


                <span
                  style={{
                    display:
                      "block",

                    color:
                      cores.textoSuave,

                    fontSize:
                      "13px",

                    marginTop:
                      "4px",
                  }}
                >
                  Personalize o Pulsan para ficar mais confortável.
                </span>

              </div>

            </div>


            <span
              aria-hidden="true"
              style={{
                color:
                  cores.destaque,

                fontSize:
                  "20px",
              }}
            >
              {acessibilidadeAberta
                ? "⌃"
                : "⌄"}
            </span>

          </button>


          {acessibilidadeAberta && (

            <div
              id="painel-acessibilidade"
              style={{
                marginTop:
                  "20px",

                display:
                  "grid",

                gap:
                  "10px",
              }}
            >

              {[
                {
                  icone: "👁️",
                  titulo: "Alto contraste",
                  descricao:
                    "Aumenta a diferença entre fundo, texto e elementos.",
                  valor:
                    altoContraste,
                  acao: () =>
                    alterarAcessibilidade(
                      "pulsanAltoContraste",
                      !altoContraste,
                      setAltoContraste
                    ),
                },

                {
                  icone: "🔤",
                  titulo: "Texto maior",
                  descricao:
                    "Aumenta o tamanho dos textos da plataforma.",
                  valor:
                    textoGrande,
                  acao: () =>
                    alterarAcessibilidade(
                      "pulsanTextoGrande",
                      !textoGrande,
                      setTextoGrande
                    ),
                },

                {
                  icone: "🖱️",
                  titulo: "Botões maiores",
                  descricao:
                    "Aumenta a área de toque dos botões.",
                  valor:
                    botoesGrandes,
                  acao: () =>
                    alterarAcessibilidade(
                      "pulsanBotoesGrandes",
                      !botoesGrandes,
                      setBotoesGrandes
                    ),
                },

                {
                  icone: "✨",
                  titulo: "Reduzir animações",
                  descricao:
                    "Diminui transições e movimentos da interface.",
                  valor:
                    reduzirAnimacoes,
                  acao: () =>
                    alterarAcessibilidade(
                      "pulsanReduzirAnimacoes",
                      !reduzirAnimacoes,
                      setReduzirAnimacoes
                    ),
                },

                {
                  icone: "🔊",
                  titulo: "Leitura em voz alta",
                  descricao:
                    "Permite ouvir conteúdos do Pulsan em português.",
                  valor: leituraVoz,
                  acao: alternarLeituraVoz,
                },

              ].map((item) => (

                <button
                  key={item.titulo}
                  type="button"
                  onClick={item.acao}
                  aria-pressed={item.valor}
                  style={{
                    width:
                      "100%",

                    border:
                      `1px solid ${cores.borda}`,

                    background:
                      item.valor
                        ? cores.destaqueSuave
                        : cores.cardSuave,

                    color:
                      cores.texto,

                    borderRadius:
                      "15px",

                    padding:
                      "14px",

                    cursor:
                      "pointer",

                    display:
                      "flex",

                    alignItems:
                      "center",

                    justifyContent:
                      "space-between",

                    gap:
                      "12px",

                    textAlign:
                      "left",

                    minHeight:
                      botoesGrandes
                        ? "76px"
                        : "68px",
                  }}
                >

                  <span
                    style={{
                      display:
                        "flex",

                      alignItems:
                        "center",

                      gap:
                        "12px",

                      flex:
                        1,
                    }}
                  >

                    <span
                      aria-hidden="true"
                      style={{
                        fontSize:
                          "22px",

                        width:
                          "30px",

                        textAlign:
                          "center",
                      }}
                    >
                      {item.icone}
                    </span>


                    <span>

                      <strong
                        style={{
                          display:
                            "block",

                          fontSize:
                            textoGrande
                              ? "17px"
                              : "15px",
                        }}
                      >
                        {item.titulo}
                      </strong>


                      <span
                        style={{
                          display:
                            "block",

                          color:
                            cores.textoSuave,

                          fontSize:
                            textoGrande
                              ? "14px"
                              : "12px",

                          lineHeight:
                            "1.4",

                          marginTop:
                            "3px",
                        }}
                      >
                        {item.descricao}
                      </span>

                    </span>

                  </span>


                  <span
                    aria-hidden="true"
                    style={{
                      minWidth:
                        "45px",

                      height:
                        "26px",

                      borderRadius:
                        "20px",

                      background:
                        item.valor
                          ? cores.destaque
                          : escuro
                            ? "#3a3442"
                            : "#d8e1e2",

                      position:
                        "relative",
                    }}
                  >

                    <span
                      style={{
                        position:
                          "absolute",

                        top:
                          "3px",

                        left:
                          item.valor
                            ? "22px"
                            : "3px",

                        width:
                          "20px",

                        height:
                          "20px",

                        borderRadius:
                          "50%",

                        background:
                          "#fff",

                        boxShadow:
                          "0 1px 4px rgba(0,0,0,0.2)",
                      }}
                    />

                  </span>

                </button>

              ))}


              <div
                role="note"
                style={{
                  marginTop:
                    "5px",

                  padding:
                    "13px",

                  borderRadius:
                    "13px",

                  background:
                    escuro
                      ? "#21182d"
                      : "#eef8fa",

                  color:
                    cores.textoSuave,

                  fontSize:
                    textoGrande
                      ? "14px"
                      : "12px",

                  lineHeight:
                    "1.5",
                }}
              >
                ♿ Suas preferências ficam salvas neste dispositivo.
              </div>

            </div>

          )}

        </section>


        {leituraVoz && (
          <section
            aria-label="Leitura em voz alta"
            style={{
              marginTop: "15px",
              background: cores.card,
              borderRadius: "18px",
              padding: "16px 18px",
              border: `1px solid ${cores.borda}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <strong
                style={{
                  display: "block",
                  color: cores.texto,
                  fontSize: textoGrande ? "16px" : "14px",
                }}
              >
                🔊 Leitura em voz alta ativada
              </strong>

              <span
                style={{
                  display: "block",
                  color: cores.textoSuave,
                  fontSize: textoGrande ? "14px" : "12px",
                  marginTop: "3px",
                }}
              >
                Toque em ouvir para escutar uma apresentação do seu perfil.
              </span>
            </div>

            <div
              style={{
                display: "flex",
                gap: "8px",
                alignItems: "center",
              }}
            >
              <button
                type="button"
                onClick={() =>
                  falando
                    ? pararLeitura()
                    : falarTexto(
                        "Olá! Esta é a leitura em voz alta do Pulsan. Você está no seu perfil."
                      )
                }
                aria-label={
                  falando
                    ? "Parar leitura"
                    : "Ouvir apresentação do perfil"
                }
                style={{
                  border: "none",
                  borderRadius: "12px",
                  padding: botoesGrandes
                    ? "13px 18px"
                    : "10px 15px",
                  background: cores.primaria,
                  color: "#ffffff",
                  cursor: "pointer",
                  fontWeight: "700",
                }}
              >
                {falando ? "⏹️ Parar" : "🔊 Ouvir"}
              </button>

              <button
                type="button"
                onClick={iniciarTutorialAcessibilidade}
                aria-label="Ouvir novamente o tutorial de acessibilidade"
                style={{
                  border: `1px solid ${cores.borda}`,
                  borderRadius: "12px",
                  padding: botoesGrandes
                    ? "13px 16px"
                    : "10px 13px",
                  background: cores.cardSuave,
                  color: cores.texto,
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                📖 Tutorial
              </button>

              <button
                type="button"
                onClick={() => {
                  pararLeitura();
                  localStorage.setItem(
                    "pulsanLeituraVoz",
                    "false"
                  );
                  setLeituraVoz(false);
                }}
                aria-label="Desativar leitura em voz alta"
                style={{
                  border: `1px solid ${cores.borda}`,
                  borderRadius: "12px",
                  padding: botoesGrandes
                    ? "13px 16px"
                    : "10px 13px",
                  background: cores.cardSuave,
                  color: cores.texto,
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Desativar
              </button>
            </div>
          </section>
        )}

        {/* =====================================
            ESTATÍSTICAS
        ===================================== */}

        <section
          style={{
            display:
              "grid",

            gridTemplateColumns:
              "repeat(auto-fit, minmax(190px, 1fr))",

            gap:
              "18px",

            marginTop:
              "25px",
          }}
        >

          {/* MÉDIA */}

          <div
            style={{
              background:
                cores.card,

              border:
                `1px solid ${cores.borda}`,

              borderRadius:
                "18px",

              padding:
                "25px 15px",

              textAlign:
                "center",
            }}
          >

            <div
              style={{
                fontSize:
                  "30px",
              }}
            >
              ⭐
            </div>


            <strong
              style={{
                display:
                  "block",

                fontSize:
                  "28px",

                marginTop:
                  "8px",
              }}
            >
              {media}
            </strong>


            <div
              style={{
                color:
                  "#f1b62b",

                fontSize:
                  "22px",

                marginTop:
                  "5px",
              }}
            >
              {mostrarEstrelas()}
            </div>


            <p
              style={{
                color:
                  cores.textoSuave,

                margin:
                  "8px 0 0",

                fontSize:
                  "14px",
              }}
            >
              Média das avaliações
            </p>

          </div>


          {/* AVALIAÇÕES */}

          <div
            style={{
              background:
                cores.card,

              border:
                `1px solid ${cores.borda}`,

              borderRadius:
                "18px",

              padding:
                "25px 15px",

              textAlign:
                "center",
            }}
          >

            <div
              style={{
                fontSize:
                  "30px",
              }}
            >
              💬
            </div>


            <strong
              style={{
                display:
                  "block",

                fontSize:
                  "28px",

                marginTop:
                  "8px",
              }}
            >
              {
                quantidadeAvaliacoes
              }
            </strong>


            <p
              style={{
                color:
                  cores.textoSuave,

                margin:
                  "8px 0 0",

                fontSize:
                  "14px",
              }}
            >
              Avaliações recebidas
            </p>

          </div>


          {/* AJUDAS */}

          <div
            style={{
              background:
                cores.card,

              border:
                `1px solid ${cores.borda}`,

              borderRadius:
                "18px",

              padding:
                "25px 15px",

              textAlign:
                "center",
            }}
          >

            <div
              style={{
                fontSize:
                  "30px",
              }}
            >
              💚
            </div>


            <strong
              style={{
                display:
                  "block",

                fontSize:
                  "28px",

                marginTop:
                  "8px",
              }}
            >
              {
                quantidadeAjudas
              }
            </strong>


            <p
              style={{
                color:
                  cores.textoSuave,

                margin:
                  "8px 0 0",

                fontSize:
                  "14px",
              }}
            >
              Pessoas ajudadas
            </p>

          </div>


          {/* PONTOS */}

          <div
            style={{
              background:
                escuro
                  ? "linear-gradient(135deg, #3a3422, #29251a)"
                  : "linear-gradient(135deg, #fff8e6, #fffdf7)",

              border:
                "1px solid #f1dfad",

              borderRadius:
                "18px",

              padding:
                "25px 15px",

              textAlign:
                "center",
            }}
          >

            <div
              style={{
                fontSize:
                  "30px",
              }}
            >
              🏆
            </div>


            <strong
              style={{
                display:
                  "block",

                fontSize:
                  "28px",

                marginTop:
                  "8px",

                color:
                  "#b48619",
              }}
            >
              {pontos}
            </strong>


            <p
              style={{
                color:
                  cores.textoSuave,

                margin:
                  "8px 0 0",

                fontSize:
                  "14px",
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
            marginTop:
              "25px",

            background:
              "linear-gradient(135deg, #20adb0, #168f92)",

            borderRadius:
              "20px",

            padding:
              "28px",

            color:
              "#fff",

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "space-between",

            gap:
              "20px",

            flexWrap:
              "wrap",
          }}
        >

          <div>

            <div
              style={{
                fontSize:
                  "30px",

                marginBottom:
                  "5px",
              }}
            >
              🎁
            </div>


            <h2
              style={{
                margin:
                  "0 0 7px",

                fontSize:
                  "22px",
              }}
            >
              Troque seus pontos
            </h2>


            <p
              style={{
                margin:
                  0,

                opacity:
                  0.9,

                lineHeight:
                  "1.5",
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
              border:
                "none",

              background:
                "#ffffff",

              color:
                "#168f92",

              padding:
                "13px 23px",

              borderRadius:
                "12px",

              fontWeight:
                "700",

              fontSize:
                "15px",

              cursor:
                "pointer",

              whiteSpace:
                "nowrap",
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
            marginTop:
              "25px",

            background:
              escuro
                ? "#29261d"
                : "#fffaf0",

            border:
              "1px solid #f1dfad",

            borderRadius:
              "18px",

            padding:
              "25px",
          }}
        >

          <h2
            style={{
              margin:
                "0 0 12px",

              fontSize:
                "21px",
            }}
          >
            🏆 Como ganhar pontos?
          </h2>


          <p
            style={{
              color:
                cores.textoSuave,

              lineHeight:
                "1.6",

              margin:
                0,
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
            background:
              escuro
                ? "#1c302d"
                : "#f0faf8",

            borderRadius:
              "18px",

            padding:
              "25px",

            marginTop:
              "25px",

            border:
              escuro
                ? "1px solid #294c47"
                : "1px solid #d9efeb",
          }}
        >

          <h2
            style={{
              margin:
                "0 0 10px",

              fontSize:
                "21px",
            }}
          >
            ⭐ Sua reputação no Pulsan
          </h2>


          <p
            style={{
              color:
                cores.textoSuave,

              lineHeight:
                "1.6",

              margin:
                0,
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
              marginTop:
                "18px",

              padding:
                "15px",

              background:
                cores.card,

              borderRadius:
                "14px",

              border:
                `1px solid ${cores.borda}`,
            }}
          >

            {possuiSeloApoiador ? (

              <>

                <strong
                  style={{
                    color:
                      "#9a7410",

                    display:
                      "block",

                    marginBottom:
                      "5px",
                  }}
                >
                  🏅 Você possui o selo
                  Apoiador de Confiança
                </strong>


                <span
                  style={{
                    color:
                      cores.textoSuave,

                    fontSize:
                      "13px",
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
                    color:
                      cores.texto,

                    display:
                      "block",

                    marginBottom:
                      "5px",
                  }}
                >
                  🏅 Como conquistar o selo
                </strong>


                <span
                  style={{
                    color:
                      cores.textoSuave,

                    fontSize:
                      "13px",

                    lineHeight:
                      "1.5",
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
            marginTop:
              "25px",

            padding:
              "22px",

            background:
              cores.card,

            borderRadius:
              "18px",

            border:
              `1px solid ${cores.borda}`,
          }}
        >

          <h3
            style={{
              margin:
                "0 0 8px",
            }}
          >
            🔒 Privacidade
          </h3>


          <p
            style={{
              margin:
                0,

              color:
                cores.textoSuave,

              lineHeight:
                "1.5",
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
            display:
              "block",

            margin:
              "30px auto 0",

            padding:
              "13px 35px",

            borderRadius:
              "12px",

            border:
              "1px solid #e0aaaa",

            background:
              escuro
                ? "#382525"
                : "#fff5f5",

            color:
              "#b64a4a",

            fontWeight:
              "700",

            cursor:
              "pointer",

            fontSize:
              "15px",
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
          position:
            "fixed",

          bottom:
            0,

          left:
            0,

          right:
            0,

          height:
            "75px",

          background:
            escuro
              ? "#18211f"
              : "#ffffff",

          borderTop:
            `1px solid ${cores.borda}`,

          display:
            "flex",

          justifyContent:
            "center",

          alignItems:
            "center",

          gap:
            "clamp(30px, 12vw, 90px)",

          boxShadow:
            escuro
              ? "0 -4px 15px rgba(0,0,0,0.2)"
              : "0 -4px 15px rgba(0,0,0,0.04)",

          zIndex:
            9999,
        }}
      >

        {/* CONVERSAS */}

        <button
          type="button"
          onClick={() =>
            irPara("solicitacoes")
          }
          style={{
            border:
              "none",

            background:
              "transparent",

            cursor:
              "pointer",

            color:
              escuro
                ? "#aebbb7"
                : "#777",

            fontSize:
              "14px",
          }}
        >

          <div
            style={{
              fontSize:
                "25px",
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
            border:
              "none",

            background:
              "transparent",

            cursor:
              "pointer",

            color:
              escuro
                ? "#aebbb7"
                : "#777",

            fontSize:
              "14px",
          }}
        >

          <div
            style={{
              fontSize:
                "25px",
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
            border:
              "none",

            background:
              "transparent",

            cursor:
              "default",

            color:
              "#20adb0",

            fontSize:
              "14px",

            fontWeight:
              "700",
          }}
        >

          <div
            style={{
              fontSize:
                "25px",
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