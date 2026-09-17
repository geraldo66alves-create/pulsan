import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

function Conversa({ irPara }) {
  let conversaAtual = {};
  try {
    conversaAtual =
      JSON.parse(
        localStorage.getItem("pulsanConversaAtual") || "{}"
      ) || {};
  } catch {
    conversaAtual = {};
  }

  const conversaId =
    conversaAtual.id ||
    conversaAtual.solicitacaoId ||
    localStorage.getItem("pulsanIdDesabafoConversa") ||
    "conversa";

  const chaveMensagens = `pulsanMensagensConversa:${conversaId}`;
  const chaveFinalizada = `pulsanConversaFinalizada:${conversaId}`;

  const [mensagem, setMensagem] = useState("");

  const [conversaFinalizada, setConversaFinalizada] = useState(
    localStorage.getItem(chaveFinalizada) === "true"
  );

  const [mensagens, setMensagens] = useState(() => {
    try {
      const salvas = JSON.parse(
        localStorage.getItem(chaveMensagens) || "[]"
      );

      return Array.isArray(salvas) ? salvas : [];
    } catch {
      return [];
    }
  });

  const fimMensagensRef = useRef(null);
  const textareaRef = useRef(null);

  // =====================================================
  // USUÁRIO LOGADO
  // =====================================================

  let usuario = {};

  try {
    usuario =
      JSON.parse(localStorage.getItem("usuarioLogado") || "{}") || {};
  } catch {
    usuario = {};
  }

  // =====================================================
  // PAPEL NA CONVERSA
  // =====================================================

  const souAjudante =
    localStorage.getItem("pulsanPapelConversa") === "ajudante";

  // =====================================================
  // DADOS DA OUTRA PESSOA
  // =====================================================

  const nomeSolicitante =
    localStorage.getItem("pulsanNomeOutraPessoa") || "Apoiador";

  const fotoSolicitante =
    localStorage.getItem("pulsanFotoOutraPessoa") || "";

  const mediaSolicitante =
    localStorage.getItem("pulsanMediaOutraPessoa") || "0";

  const quantidadeAvaliacoes =
    localStorage.getItem("pulsanAvaliacoesOutraPessoa") || "0";

  const seloApoiador =
    localStorage.getItem("pulsanSeloApoiadorOutraPessoa") === "true";

  const seloPsicologo =
    localStorage.getItem("pulsanSeloPsicologoOutraPessoa") === "true";

  // =====================================================
  // DESABAFO
  // =====================================================

  const desabafoRelacionado =
    localStorage.getItem("pulsanDesabafoConversa") || "";

  const idDesabafo =
    localStorage.getItem("pulsanIdDesabafoConversa") || "";

  // =====================================================
  // SALVAR MENSAGENS
  // =====================================================

  useEffect(() => {
    let ativo = true;

    async function carregarMensagens() {
      if (!conversaAtual.id || conversaAtual.id === "conversa") return;

      try {
        const { data, error } = await supabase
          .from("mensagens_conversa")
          .select("*")
          .eq("conversa_id", conversaAtual.id)
          .order("criada_em", { ascending: true });

        if (!ativo) return;

        if (!error && Array.isArray(data)) {
          setMensagens(
            data.map((item) => ({
              id: item.id,
              autor:
                String(item.remetente_id || "") ===
                String(usuario.id || usuario.email || "")
                  ? "eu"
                  : "outra",
              usuarioId: item.remetente_id || "",
              texto: item.mensagem || "",
              hora: item.criada_em
                ? new Date(item.criada_em).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : new Date().toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }),
            }))
          );
        } else {
          console.warn("Não foi possível carregar as mensagens do banco. Mantendo mensagens locais.", error);
        }
      } catch (error) {
        console.error("Erro ao carregar mensagens da conversa:", error);
      }
    }

    carregarMensagens();

    return () => {
      ativo = false;
    };
  }, [conversaId]);

  // =====================================================
  // SCROLL AUTOMÁTICO
  // =====================================================

  useEffect(() => {
    setTimeout(() => {
      fimMensagensRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 50);
  }, [mensagens]);

  // =====================================================
  // FOCO NA CAIXA DE TEXTO
  // =====================================================

  useEffect(() => {
    if (!conversaFinalizada) {
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 300);
    }
  }, [conversaFinalizada]);

  // =====================================================
  // PROTEÇÃO DE IDENTIDADE
  // =====================================================

  function verificarMensagem(texto) {
    const textoNormalizado = texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    const termosProibidos = [
      "qual seu nome",
      "qual e seu nome",
      "como voce se chama",
      "seu nome",
      "me diga seu nome",
      "fala seu nome",

      "qual sua escola",
      "qual e sua escola",
      "onde voce estuda",
      "onde estuda",
      "qual colegio",

      "qual sua turma",
      "qual e sua turma",
      "qual sala voce",

      "qual sua cidade",
      "onde voce mora",
      "onde mora",

      "qual seu telefone",
      "qual e seu telefone",
      "seu telefone",
      "seu numero",

      "me passa seu instagram",
      "passa seu instagram",
      "seu instagram",
      "seu whatsapp",
      "seu whats",
      "seu facebook",

      "qual seu email",
      "qual e seu email",
      "seu email",
      "seu e-mail",

      "manda sua foto",
      "me manda uma foto",
      "manda foto",
      "me passa seu contato",
      "passa seu contato",
    ];

    return termosProibidos.some((termo) =>
      textoNormalizado.includes(termo)
    );
  }

  // =====================================================
  // ENVIAR MENSAGEM
  // =====================================================

  function enviarMensagem(e) {
    if (e) {
      e.preventDefault();
    }

    if (conversaFinalizada) return;

    const texto = mensagem.trim();

    if (!texto) return;

    // Protege a identidade de quem publicou o desabafo
    if (!souAjudante && verificarMensagem(texto)) {
      alert(
        "🔒 Mensagem bloqueada.\n\n" +
          "Para proteger o anonimato, não é permitido solicitar nome, escola, turma, telefone, endereço ou redes sociais."
      );

      return;
    }

    async function salvarMensagem() {
      const { data: authData } = await supabase.auth.getUser();
      const remetenteId = authData?.user?.id;
      if (!remetenteId || !conversaAtual.id || conversaAtual.id === "conversa") {
        alert("Não foi possível identificar a conversa.");
        return;
      }
      const { data, error } = await supabase.from("mensagens_conversa").insert({
        conversa_id: conversaAtual.id,
        remetente_id: remetenteId,
        mensagem: texto,
      }).select().single();
      if (error) {
        console.error(error);
        alert("Não foi possível enviar a mensagem.");
        return;
      }
      const novaMensagem = {
        id: data.id,
        autor: "eu",
        usuarioId: remetenteId,
        texto: data.mensagem,
        hora: new Date(data.criada_em).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
      };
      setMensagens((anteriores) => [...anteriores, novaMensagem]);
      setMensagem("");
    }
    salvarMensagem();

    setTimeout(() => {
      textareaRef.current?.focus();
    }, 50);
  }

  // =====================================================
  // ENTER
  // =====================================================

  function controlarTecla(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      enviarMensagem(e);
    }
  }

  // =====================================================
  // FINALIZAR CONVERSA
  // =====================================================

  function finalizarConversa() {
    if (conversaFinalizada) return;

    const confirmar = window.confirm(
      "Deseja finalizar esta conversa?\n\n" +
        "Depois de finalizada, não será possível enviar novas mensagens."
    );

    if (!confirmar) return;

    localStorage.setItem(
      chaveFinalizada,
      "true"
    );

    localStorage.setItem(
      "pulsanConversaFinalizadaEm",
      new Date().toISOString()
    );

    const conversas = JSON.parse(
      localStorage.getItem("pulsanConversas") || "[]"
    );

    localStorage.setItem(
      "pulsanConversas",
      JSON.stringify(
        conversas.map((item) =>
          item.id === conversaId
            ? {
                ...item,
                status: "finalizada",
                finalizadaEm: new Date().toISOString(),
                mensagens,
              }
            : item
        )
      )
    );

    /*
      SOMENTE QUEM AJUDOU GANHA PONTOS.
    */

    if (souAjudante) {
      const pontosAtuais = Number(
        localStorage.getItem("pulsanPontos") || "0"
      );

      localStorage.setItem(
        "pulsanPontos",
        String(pontosAtuais + 10)
      );

      localStorage.setItem(
        "pulsanUltimosPontos",
        "10"
      );
    }

    setConversaFinalizada(true);
  }

  // =====================================================
  // VOLTAR
  // =====================================================

  function voltar() {
    irPara("solicitacoes");
  }

  // =====================================================
  // AVALIAÇÃO
  // =====================================================

  function avaliar() {
    /*
      A avaliação é feita sobre quem ajudou.
    */

    localStorage.setItem(
      "pulsanAvaliacaoConversaPendente",
      "true"
    );

    irPara("avaliacao");
  }

  // =====================================================
  // IDENTIFICAR REMETENTE
  // =====================================================

  function identificarMensagem(item) {
    const minhaMensagem = item.autor === "eu";

    // QUEM SOLICITOU O CHAT
    if (souAjudante) {
      if (minhaMensagem) {
        return {
          nome: "Você",
          foto: usuario.foto || "",
          avaliacao: "",
          quantidade: "",
          anonimo: false,
        };
      }

      return {
        nome: "Usuário anônimo",
        foto: "",
        avaliacao: "",
        quantidade: "",
        anonimo: true,
      };
    }

    // AUTOR DO DESABAFO
    if (minhaMensagem) {
      return {
        nome: "Você",
        foto: "",
        avaliacao: "",
        quantidade: "",
        anonimo: true,
      };
    }

    return {
      nome: nomeSolicitante,
      foto: fotoSolicitante,
      avaliacao: mediaSolicitante,
      quantidade: quantidadeAvaliacoes,
      anonimo: false,
    };
  }

  // =====================================================
  // PESSOA DO CABEÇALHO
  // =====================================================

  const nomePessoaExibida = souAjudante
    ? "Usuário anônimo"
    : nomeSolicitante;

  const fotoPessoaExibida = souAjudante
    ? ""
    : fotoSolicitante;

  // =====================================================
  // INTERFACE
  // =====================================================

  if (!conversaAtual.id || conversaAtual.id === "conversa") {
    return (
      <div className="pulsan-conversa-page">
        <header className="pulsan-conversa-header">
          <button
            type="button"
            className="pulsan-voltar-btn"
            onClick={voltar}
            aria-label="Voltar"
          >
            ←
          </button>
          <div>
            <strong>Conversa</strong>
            <div>Não foi possível identificar esta conversa.</div>
          </div>
        </header>
        <main className="pulsan-conversa-conteudo" style={{ padding: "30px 20px" }}>
          <section className="pulsan-desabafo-relacionado">
            <strong>Conversa não encontrada</strong>
            <p>Volte para Conversas e abra novamente a conversa aceita.</p>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="pulsan-conversa-page">

      {/* =================================================
          CABEÇALHO
      ================================================= */}

      <header className="pulsan-conversa-header">

        <button
          type="button"
          className="pulsan-voltar-btn"
          onClick={voltar}
          aria-label="Voltar"
        >
          ←
        </button>

        <div className="pulsan-avatar">

          {fotoPessoaExibida ? (
            <img
              src={fotoPessoaExibida}
              alt="Foto do usuário"
            />
          ) : (
            <span>🔒</span>
          )}

        </div>

        <div className="pulsan-dados-pessoa">

          <strong>
            {nomePessoaExibida}
          </strong>

          {!souAjudante && (
            <>
              <div className="pulsan-selos">

                {seloApoiador && (
                  <span className="pulsan-selo apoiador">
                    🏅 Apoiador
                  </span>
                )}

                {seloPsicologo && (
                  <span className="pulsan-selo psicologo">
                    🧠 Psicólogo
                  </span>
                )}

              </div>

              <span className="pulsan-avaliacao-pessoa">
                ⭐ {mediaSolicitante} •{" "}
                {quantidadeAvaliacoes} avaliações
              </span>
            </>
          )}

          {souAjudante && (
            <span className="pulsan-anonimo-info">
              🔒 Identidade protegida
            </span>
          )}

        </div>

        <div
          className={
            conversaFinalizada
              ? "pulsan-status finalizada"
              : "pulsan-status"
          }
        >
          {conversaFinalizada
            ? "Finalizada"
            : "● Online"}
        </div>

      </header>

      {/* =================================================
          CONTEÚDO
      ================================================= */}

      <div className="pulsan-conversa-conteudo">

        {/* DESABAFO */}

        {desabafoRelacionado && (
          <section className="pulsan-desabafo-relacionado">

            <div className="pulsan-desabafo-titulo">
              💭 DESABAFO QUE ORIGINOU O CHAT
            </div>

            {idDesabafo && (
              <div className="pulsan-desabafo-id">
                Desabafo #{idDesabafo}
              </div>
            )}

            <div className="pulsan-desabafo-texto">
              {desabafoRelacionado}
            </div>

            <div className="pulsan-protecao-desabafo">
              🔒 A identidade de quem publicou este
              desabafo permanece protegida.
            </div>

          </section>
        )}

        {/* CHAT */}

        <main className="pulsan-chat">

          <div className="pulsan-privacidade">

            <strong>
              🔒 Conversa privada e protegida
            </strong>

            <small>
              A identidade de quem publicou o desabafo
              permanece protegida.
            </small>

          </div>

          <div className="pulsan-dia">
            <span>Hoje</span>
          </div>

          <div className="pulsan-lista-mensagens">

            {mensagens.length === 0 && (
              <div className="pulsan-chat-vazio">

                <div className="pulsan-chat-icone">
                  💬
                </div>

                <strong>
                  A conversa começou
                </strong>

                <span>
                  {souAjudante
                    ? "Envie uma mensagem acolhedora para iniciar a conversa."
                    : "Conte o que você está sentindo. Você pode falar no seu tempo."}
                </span>

              </div>
            )}

            {mensagens.map((item) => {

              const minhaMensagem =
                item.autor === "eu";

              const pessoa =
                identificarMensagem(item);

              return (
                <div
                  key={item.id}
                  className={
                    minhaMensagem
                      ? "pulsan-mensagem-container minha"
                      : "pulsan-mensagem-container outra"
                  }
                >

                  <div className="pulsan-remetente">

                    <div className="pulsan-mini-avatar">

                      {pessoa.foto ? (
                        <img
                          src={pessoa.foto}
                          alt="Foto"
                        />
                      ) : (
                        <span>
                          {pessoa.anonimo
                            ? "🔒"
                            : "👤"}
                        </span>
                      )}

                    </div>

                    <div className="pulsan-remetente-info">

                      <strong>
                        {pessoa.nome}
                      </strong>

                      {pessoa.anonimo ? (

                        <span className="pulsan-remetente-anonimo">
                          Identidade protegida
                        </span>

                      ) : (

                        pessoa.avaliacao && (
                          <span className="pulsan-remetente-avaliacao">
                            ⭐ {pessoa.avaliacao} •{" "}
                            {pessoa.quantidade} avaliações
                          </span>
                        )

                      )}

                    </div>

                  </div>

                  <div
                    className={
                      minhaMensagem
                        ? "pulsan-mensagem minha"
                        : "pulsan-mensagem outra"
                    }
                  >

                    <div className="pulsan-texto-mensagem">
                      {item.texto}
                    </div>

                    <div className="pulsan-hora">
                      {item.hora}
                    </div>

                  </div>

                </div>
              );
            })}

            <div ref={fimMensagensRef} />

          </div>

        </main>

      </div>

      {/* =================================================
          ÁREA DE MENSAGEM
      ================================================= */}

      {!conversaFinalizada && (

        <div className="pulsan-area-envio">

          <form
            onSubmit={enviarMensagem}
            className="pulsan-form-envio"
          >

            <div className="pulsan-input-container">

              <textarea
                ref={textareaRef}
                value={mensagem}
                onChange={(e) =>
                  setMensagem(e.target.value)
                }
                onKeyDown={controlarTecla}
                placeholder={
                  souAjudante
                    ? "Escreva uma mensagem acolhedora..."
                    : "Digite sua mensagem..."
                }
                maxLength={1000}
                rows={1}
                autoComplete="off"
              />

              <span>
                {mensagem.length}/1000
              </span>

            </div>

            <button
              type="submit"
              disabled={!mensagem.trim()}
              className="pulsan-btn-enviar"
              aria-label="Enviar mensagem"
            >
              ➤
            </button>

          </form>

          <button
            type="button"
            onClick={finalizarConversa}
            className="pulsan-btn-finalizar"
          >
            ✓ Finalizar conversa
          </button>

        </div>

      )}

      {/* =================================================
          CONVERSA FINALIZADA
      ================================================= */}

      {conversaFinalizada && (

        <div className="pulsan-conversa-finalizada">

          <div className="pulsan-finalizada-texto">

            <strong>
              💚 Conversa finalizada
            </strong>

            <span>
              Obrigado por fazer parte deste momento.
            </span>

          </div>

          {/* SOMENTE QUEM FOI AJUDADO AVALIA */}
          {!souAjudante && (
            <button
              type="button"
              onClick={avaliar}
              className="pulsan-btn-avaliar"
            >
              ⭐ Avaliar quem ajudou
            </button>
          )}

          {souAjudante && (
            <div className="pulsan-pontos-ganhos">
              🏆 Você ganhou <strong>10 pontos</strong> por ajudar.
            </div>
          )}

        </div>

      )}

      {/* =================================================
          CSS
      ================================================= */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        html,
        body,
        #root {
          margin: 0;
          padding: 0;
          width: 100%;
          min-height: 100%;
        }

        body {
          overflow-x: hidden;
        }

        /* ===============================================
           PÁGINA
        =============================================== */

        .pulsan-conversa-page {
          position: relative;
          min-height: 100vh;
          width: 100%;
          background: #fffdf9;
          color: #184440;
          font-family: Arial, Helvetica, sans-serif;
          overflow-x: hidden;
        }

        /* ===============================================
           CABEÇALHO
        =============================================== */

        .pulsan-conversa-header {
          position: sticky;
          top: 0;
          z-index: 1000;

          width: 100%;
          min-height: 70px;

          padding: 10px 18px;

          display: flex;
          align-items: center;

          gap: 12px;

          background: #f8e9df;
          border-bottom: 1px solid #e5ddd7;
        }

        .pulsan-voltar-btn {
          width: 42px;
          height: 42px;

          flex: 0 0 42px;

          border: none;
          border-radius: 12px;

          background: #ffffff;

          color: #173b38;

          font-size: 25px;

          display: flex;
          align-items: center;
          justify-content: center;

          cursor: pointer;
        }

        .pulsan-avatar {
          width: 46px;
          height: 46px;

          flex: 0 0 46px;

          border-radius: 50%;

          background: #e5f1ed;

          display: flex;
          align-items: center;
          justify-content: center;

          overflow: hidden;

          font-size: 18px;
        }

        .pulsan-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .pulsan-dados-pessoa {
          flex: 1;
          min-width: 0;
        }

        .pulsan-dados-pessoa strong {
          display: block;

          font-size: 15px;

          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .pulsan-selos {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;

          margin-top: 3px;
        }

        .pulsan-selo {
          padding: 3px 7px;

          border-radius: 10px;

          font-size: 9px;
          font-weight: 700;
        }

        .pulsan-selo.apoiador {
          background: #fff4cc;
          color: #92700b;
        }

        .pulsan-selo.psicologo {
          background: #e7f2ff;
          color: #27628f;
        }

        .pulsan-avaliacao-pessoa {
          display: block;

          margin-top: 3px;

          color: #777;

          font-size: 10px;
        }

        .pulsan-anonimo-info {
          display: block;

          margin-top: 3px;

          color: #168f92;

          font-size: 10px;
        }

        .pulsan-status {
          flex-shrink: 0;

          padding: 7px 10px;

          border-radius: 15px;

          background: #ffffff;

          color: #168f92;

          font-size: 10px;
          font-weight: 700;
        }

        .pulsan-status.finalizada {
          color: #777;
          background: #eeeeee;
        }

        /* ===============================================
           CONTEÚDO
        =============================================== */

        .pulsan-conversa-conteudo {
          width: 100%;

          padding-bottom: 180px;
        }

        /* ===============================================
           DESABAFO
        =============================================== */

        .pulsan-desabafo-relacionado {
          width: min(900px, calc(100% - 30px));

          margin: 14px auto 0;

          padding: 16px;

          background: #f4faf8;

          border: 1px solid #dcece5;

          border-radius: 18px;
        }

        .pulsan-desabafo-titulo {
          color: #168f92;

          font-size: 11px;
          font-weight: 800;
        }

        .pulsan-desabafo-id {
          margin-top: 5px;

          color: #888;

          font-size: 10px;
        }

        .pulsan-desabafo-texto {
          margin-top: 8px;

          color: #40514b;

          font-size: 13px;
          line-height: 1.5;
        }

        .pulsan-protecao-desabafo {
          margin-top: 10px;
          padding-top: 9px;

          border-top: 1px solid #dcece5;

          color: #55736d;

          font-size: 10px;
        }

        /* ===============================================
           CHAT
        =============================================== */

        .pulsan-chat {
          width: min(900px, 100%);

          margin: 0 auto;

          padding: 18px 25px 30px;
        }

        .pulsan-privacidade {
          width: 100%;

          padding: 12px;

          margin-bottom: 18px;

          text-align: center;

          background: #f2faf7;

          border: 1px solid #dcece5;

          border-radius: 14px;

          color: #667b75;

          font-size: 11px;

          line-height: 1.5;
        }

        .pulsan-privacidade strong {
          display: block;

          margin-bottom: 3px;

          color: #42645d;
        }

        .pulsan-privacidade small {
          font-size: 9px;
        }

        .pulsan-dia {
          text-align: center;

          margin: 15px 0 20px;
        }

        .pulsan-dia span {
          display: inline-block;

          padding: 5px 11px;

          background: #eeeeee;

          color: #888;

          border-radius: 15px;

          font-size: 10px;
        }

        .pulsan-lista-mensagens {
          display: flex;
          flex-direction: column;

          gap: 17px;
        }

        /* ===============================================
           MENSAGENS
        =============================================== */

        .pulsan-mensagem-container {
          display: flex;
          flex-direction: column;

          width: fit-content;

          max-width: 72%;
        }

        .pulsan-mensagem-container.minha {
          align-self: flex-end;
          align-items: flex-end;
        }

        .pulsan-mensagem-container.outra {
          align-self: flex-start;
          align-items: flex-start;
        }

        /* ===============================================
           REMETENTE
        =============================================== */

        .pulsan-remetente {
          display: flex;
          align-items: center;

          gap: 7px;

          margin-bottom: 5px;

          padding: 0 4px;
        }

        .pulsan-mensagem-container.minha
        .pulsan-remetente {
          flex-direction: row-reverse;
        }

        .pulsan-mini-avatar {
          width: 30px;
          height: 30px;

          flex: 0 0 30px;

          border-radius: 50%;

          background: #e5f1ed;

          overflow: hidden;

          display: flex;
          align-items: center;
          justify-content: center;

          font-size: 13px;
        }

        .pulsan-mini-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .pulsan-remetente-info {
          display: flex;
          flex-direction: column;
        }

        .pulsan-remetente-info strong {
          color: #173b38;

          font-size: 11px;
        }

        .pulsan-remetente-anonimo {
          color: #168f92;

          font-size: 9px;
        }

        .pulsan-remetente-avaliacao {
          color: #777;

          font-size: 9px;
        }

        /* ===============================================
           BALÕES
        =============================================== */

        .pulsan-mensagem {
          min-width: 55px;

          padding: 10px 13px;

          overflow-wrap: anywhere;
          word-break: break-word;

          box-shadow: 0 1px 2px rgba(0,0,0,.04);
        }

        .pulsan-mensagem.minha {
          background: #20adb0;

          color: #ffffff;

          border-radius: 18px 18px 4px 18px;
        }

        .pulsan-mensagem.outra {
          background: #ffffff;

          color: #333333;

          border: 1px solid #e5e5e5;

          border-radius: 18px 18px 18px 4px;
        }

        .pulsan-texto-mensagem {
          font-size: 14px;

          line-height: 1.5;

          white-space: pre-wrap;
        }

        .pulsan-hora {
          margin-top: 4px;

          text-align: right;

          font-size: 9px;

          opacity: .65;
        }

        /* ===============================================
           CHAT VAZIO
        =============================================== */

        .pulsan-chat-vazio {
          min-height: 330px;

          display: flex;
          flex-direction: column;

          align-items: center;
          justify-content: center;

          text-align: center;

          color: #999;

          padding: 30px 20px;
        }

        .pulsan-chat-icone {
          font-size: 42px;

          margin-bottom: 10px;
        }

        .pulsan-chat-vazio strong {
          color: #555;

          font-size: 14px;

          margin-bottom: 5px;
        }

        .pulsan-chat-vazio span {
          max-width: 350px;

          font-size: 11px;

          line-height: 1.5;
        }

        /* ===============================================
           ÁREA DE ENVIO
           
           IMPORTANTE:
           fica acima da navegação inferior.
        =============================================== */

        .pulsan-area-envio {
          position: fixed;

          left: 0;
          right: 0;

          bottom: 76px;

          z-index: 99999;

          width: 100%;

          padding: 10px 15px 8px;

          background: rgba(255,255,255,.98);

          border-top: 1px solid #dddddd;

          box-shadow: 0 -4px 15px rgba(0,0,0,.06);

          backdrop-filter: blur(8px);
        }

        .pulsan-form-envio {
          width: min(900px, 100%);

          margin: 0 auto;

          display: flex;
          align-items: flex-end;

          gap: 8px;
        }

        .pulsan-input-container {
          flex: 1;

          min-width: 0;

          background: #f3f6f5;

          border: 1px solid #dce5e2;

          border-radius: 20px;

          padding: 7px 12px 5px;
        }

        .pulsan-input-container textarea {
          display: block;

          width: 100%;

          min-height: 38px;
          max-height: 100px;

          margin: 0;
          padding: 4px 0;

          border: none;
          outline: none;

          resize: none;

          background: transparent;

          color: #263b38;

          font-family: Arial, Helvetica, sans-serif;

          font-size: 14px;

          line-height: 1.4;

          cursor: text;

          pointer-events: auto;
        }

        .pulsan-input-container textarea::placeholder {
          color: #9aa7a4;
        }

        .pulsan-input-container span {
          display: block;

          height: 10px;

          text-align: right;

          color: #9ca7a4;

          font-size: 8px;
        }

        .pulsan-btn-enviar {
          width: 46px;
          height: 46px;

          flex: 0 0 46px;

          border: none;

          border-radius: 50%;

          background: #20adb0;

          color: #ffffff;

          font-size: 19px;

          display: flex;
          align-items: center;
          justify-content: center;

          cursor: pointer;

          transition: .2s;
        }

        .pulsan-btn-enviar:hover {
          transform: scale(1.04);
        }

        .pulsan-btn-enviar:disabled {
          background: #cfe2df;

          cursor: not-allowed;

          transform: none;
        }

        .pulsan-btn-finalizar {
          display: block;

          margin: 5px auto 0;

          padding: 3px 10px;

          border: none;

          background: transparent;

          color: #b65b57;

          font-size: 10px;

          cursor: pointer;
        }

        /* ===============================================
           FINALIZADA
        =============================================== */

        .pulsan-conversa-finalizada {
          position: fixed;

          left: 0;
          right: 0;

          bottom: 76px;

          z-index: 99999;

          width: 100%;

          padding: 12px 15px;

          background: rgba(255,255,255,.98);

          border-top: 1px solid #dddddd;

          box-shadow: 0 -4px 15px rgba(0,0,0,.06);

          text-align: center;
        }

        .pulsan-finalizada-texto strong {
          display: block;

          color: #315c52;

          font-size: 13px;

          margin-bottom: 4px;
        }

        .pulsan-finalizada-texto span {
          display: block;

          color: #777;

          font-size: 10px;

          margin-bottom: 8px;
        }

        .pulsan-btn-avaliar {
          border: none;

          border-radius: 14px;

          padding: 9px 18px;

          background: #20adb0;

          color: #ffffff;

          font-size: 11px;

          font-weight: 700;

          cursor: pointer;
        }

        .pulsan-pontos-ganhos {
          color: #168f92;

          font-size: 11px;

          margin-top: 5px;
        }

        /* ===============================================
           CELULAR
        =============================================== */

        @media (max-width: 600px) {

          .pulsan-conversa-header {
            min-height: 64px;

            padding: 8px 9px;

            gap: 7px;
          }

          .pulsan-voltar-btn {
            width: 38px;
            height: 38px;

            flex-basis: 38px;

            font-size: 22px;
          }

          .pulsan-avatar {
            width: 40px;
            height: 40px;

            flex-basis: 40px;
          }

          .pulsan-dados-pessoa strong {
            font-size: 13px;
          }

          .pulsan-status {
            padding: 6px 8px;

            font-size: 9px;
          }

          .pulsan-chat {
            padding: 12px 9px 25px;
          }

          .pulsan-desabafo-relacionado {
            width: calc(100% - 18px);

            margin-top: 8px;

            padding: 12px;
          }

          .pulsan-mensagem-container {
            max-width: 88%;
          }

          .pulsan-texto-mensagem {
            font-size: 14px;
          }

          .pulsan-area-envio {
            bottom: 68px;

            padding: 8px 8px 6px;
          }

          .pulsan-form-envio {
            gap: 6px;
          }

          .pulsan-input-container {
            border-radius: 18px;

            padding: 6px 10px 4px;
          }

          .pulsan-input-container textarea {
            min-height: 36px;

            font-size: 14px;
          }

          .pulsan-btn-enviar {
            width: 44px;
            height: 44px;

            flex-basis: 44px;
          }

          .pulsan-btn-finalizar {
            margin-top: 3px;

            font-size: 9px;
          }

          .pulsan-conversa-finalizada {
            bottom: 68px;
          }

          .pulsan-conversa-conteudo {
            padding-bottom: 155px;
          }
        }

      `}</style>
    </div>
  );
}

export default Conversa;