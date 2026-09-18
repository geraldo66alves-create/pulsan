import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import "../tema.css";

export default function Conversa({ irPara, tema = "claro" }) {
  const [tela, setTela] = useState("lista");
  const [usuario, setUsuario] = useState(null);

  const [solicitacoes, setSolicitacoes] = useState([]);
  const [recentes, setRecentes] = useState([]);
  const [notificacoesSolicitacoes, setNotificacoesSolicitacoes] = useState(false);
  const [notificacoesRecentes, setNotificacoesRecentes] = useState(false);
  const [carregandoLista, setCarregandoLista] = useState(true);

  const [conversaAtual, setConversaAtual] = useState(null);
  const [mensagens, setMensagens] = useState([]);
  const [novaMensagem, setNovaMensagem] = useState("");
  const [carregandoMensagens, setCarregandoMensagens] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  const fimMensagensRef = useRef(null);
  const inputRef = useRef(null);

  const modoEscuro = tema === "escuro";

  /* =========================================================
     CARREGAR USUÁRIO
  ========================================================= */

  useEffect(() => {
    let ativo = true;

    async function carregarUsuario() {
      try {
        const salvo = localStorage.getItem("usuarioLogado");

        if (salvo) {
          try {
            const dados = JSON.parse(salvo);

            if (ativo) {
              setUsuario(dados);
            }
          } catch (erroLocal) {
            console.warn(
              "Não foi possível interpretar usuarioLogado:",
              erroLocal
            );
          }
        }

        const { data, error } = await supabase.auth.getUser();

        if (error) {
          console.warn("Usuário Supabase não encontrado:", error);
          return;
        }

        if (ativo && data?.user) {
          setUsuario((anterior) => ({
            ...(anterior || {}),
            id: data.user.id,
            email: data.user.email || anterior?.email || "",
          }));
        }
      } catch (erro) {
        console.error("Erro ao carregar usuário:", erro);
      }
    }

    carregarUsuario();

    return () => {
      ativo = false;
    };
  }, []);

  const usuarioId =
    usuario?.id ||
    usuario?.user?.id ||
    usuario?.user_id ||
    null;

  /* =========================================================
     CARREGAR SOLICITAÇÕES E CONVERSAS RECENTES
  ========================================================= */

  useEffect(() => {
    let ativo = true;

    async function carregarLista() {
      if (!usuarioId) {
        setCarregandoLista(false);
        return;
      }

      try {
        setCarregandoLista(true);
        setErro("");

        /* ---------------------------------------------
           SOLICITAÇÕES
        --------------------------------------------- */

        const {
          data: pedidos,
          error: erroPedidos,
        } = await supabase
          .from("solicitacoes_chat")
          .select("*")
          .eq("destinatario_id", usuarioId)
          .eq("status", "pendente")
          .order("criado_em", {
            ascending: false,
          });

        if (erroPedidos) {
          console.error(
            "Erro ao carregar solicitações:",
            erroPedidos
          );
        }

        const listaPedidos = pedidos || [];

        /* ---------------------------------------------
           DESABAFOS DE ORIGEM
        --------------------------------------------- */

        const idsDesabafos = listaPedidos
          .map((item) => item.desabafo_id)
          .filter(Boolean);

        const idsSolicitantes = listaPedidos
          .map((item) => item.solicitante_id)
          .filter(Boolean);

        let posts = [];
        let perfisSolicitantes = [];

        if (idsDesabafos.length > 0) {
          const {
            data: postsData,
            error: erroPosts,
          } = await supabase
            .from("posts_ambiente")
            .select(
              "id, texto, nome_usuario, foto_usuario, usuario_id"
            )
            .in("id", idsDesabafos);

          if (erroPosts) {
            console.warn(
              "Erro ao carregar desabafos:",
              erroPosts
            );
          }

          posts = postsData || [];
        }

        // A identidade exibida na solicitação é SEMPRE a de quem
        // ofereceu ajuda (solicitante_id). O desabafo é carregado
        // separadamente e pertence ao destinatário da solicitação.
        if (idsSolicitantes.length > 0) {
          const { data: perfisData, error: erroPerfis } = await supabase
            .from("perfis")
            .select("*")
            .in("id", [...new Set(idsSolicitantes)]);

          if (erroPerfis) {
            console.warn("Erro ao carregar perfis dos solicitantes:", erroPerfis);
          } else {
            perfisSolicitantes = perfisData || [];
          }
        }

        const vistasSolicitacoes = JSON.parse(
          localStorage.getItem("pulsanSolicitacoesVistas") || "[]"
        );

        const solicitacoesFormatadas = listaPedidos.map(
          (pedido) => {
            const post = posts.find(
              (item) => item.id === pedido.desabafo_id
            );

            const perfilSolicitante = perfisSolicitantes.find(
              (item) => String(item.id) === String(pedido.solicitante_id)
            );

            const psicologoAprovado =
              perfilSolicitante?.verificacao_psicologo === "aprovado" ||
              perfilSolicitante?.psicologo_parceiro === true;

            const seloExplicito =
              perfilSolicitante?.selo ||
              perfilSolicitante?.selo_nome ||
              perfilSolicitante?.badge ||
              perfilSolicitante?.badge_nome ||
              "";

            return {
              ...pedido,
              nome:
                perfilSolicitante?.nome ||
                pedido.nome_solicitante ||
                pedido.nome_usuario ||
                "Pessoa anônima",
              foto:
                perfilSolicitante?.foto_url ||
                perfilSolicitante?.foto ||
                pedido.foto_solicitante ||
                pedido.foto_usuario ||
                "",
              possuiSelo: Boolean(psicologoAprovado || seloExplicito),
              tipoSelo: psicologoAprovado
                ? "psicologo"
                : seloExplicito
                ? "confianca"
                : "",
              textoSelo: psicologoAprovado
                ? "Psicólogo parceiro"
                : seloExplicito || "Apoiador de confiança",
              desabafo:
                post?.texto ||
                "A pessoa deseja conversar com você.",
              foiVista: vistasSolicitacoes.includes(String(pedido.id)),
            };
          }
        );

        /* ---------------------------------------------
           CONVERSAS RECENTES
        --------------------------------------------- */

        const {
          data: conversas,
          error: erroConversas,
        } = await supabase
          .from("conversas")
          .select("*")
          .or(
            `solicitante_id.eq.${usuarioId},destinatario_id.eq.${usuarioId}`
          )
          .order("criada_em", {
            ascending: false,
          });

        if (erroConversas) {
          console.error(
            "Erro ao carregar conversas:",
            erroConversas
          );
        }

        const listaConversas = (conversas || []).filter(
          (conversa) => conversa.status !== "finalizada"
        );

        const idsConversas = listaConversas.map((item) => item.id).filter(Boolean);
        const idsOutrasPessoas = listaConversas
          .map((conversa) =>
            String(conversa.solicitante_id) === String(usuarioId)
              ? conversa.destinatario_id
              : conversa.solicitante_id
          )
          .filter(Boolean);

        let perfisOutrasPessoas = [];

        if (idsOutrasPessoas.length > 0) {
          const { data: perfisData, error: erroPerfisRecentes } = await supabase
            .from("perfis")
            .select("*")
            .in("id", [...new Set(idsOutrasPessoas)]);

          if (erroPerfisRecentes) {
            console.warn("Erro ao carregar perfis das conversas recentes:", erroPerfisRecentes);
          } else {
            perfisOutrasPessoas = perfisData || [];
          }
        }

        let mensagensRecentes = [];

        if (idsConversas.length > 0) {
          const { data: mensagensData, error: erroMensagens } = await supabase
            .from("mensagens_conversa")
            .select("id, conversa_id, remetente_id, mensagem, criada_em")
            .in("conversa_id", idsConversas)
            .order("criada_em", { ascending: false });

          if (erroMensagens) {
            console.warn("Não foi possível verificar novas mensagens:", erroMensagens);
          } else {
            mensagensRecentes = mensagensData || [];
          }
        }

        const vistasConversas = JSON.parse(
          localStorage.getItem("pulsanConversasVistas") || "{}"
        );

        const recentesFormatadas = listaConversas.map((conversa) => {
          const outraPessoaId =
            conversa.solicitante_id === usuarioId
              ? conversa.destinatario_id
              : conversa.solicitante_id;

          const ultimaMensagemReal = mensagensRecentes.find(
            (mensagem) => mensagem.conversa_id === conversa.id
          );

          const ultimaMensagemEm =
            ultimaMensagemReal?.criada_em ||
            conversa.ultima_mensagem_em ||
            conversa.ultimaMensagemEm ||
            conversa.atualizada_em ||
            conversa.criada_em ||
            null;

          const vistaEm = vistasConversas[String(conversa.id)] || null;

          const mensagemNova =
            Boolean(ultimaMensagemReal?.remetente_id) &&
            ultimaMensagemReal.remetente_id !== usuarioId &&
            Boolean(ultimaMensagemEm) &&
            (!vistaEm || new Date(ultimaMensagemEm).getTime() > Number(vistaEm));

          const perfilOutraPessoa = perfisOutrasPessoas.find(
            (item) => String(item.id) === String(outraPessoaId)
          );

          const outraPessoaPsicologo =
            perfilOutraPessoa?.verificacao_psicologo === "aprovado" ||
            perfilOutraPessoa?.psicologo_parceiro === true;

          const outraPessoaSelo =
            perfilOutraPessoa?.selo ||
            perfilOutraPessoa?.selo_nome ||
            perfilOutraPessoa?.badge ||
            perfilOutraPessoa?.badge_nome ||
            "";

          return {
            ...conversa,
            outraPessoaId,
            nome:
              perfilOutraPessoa?.nome ||
              conversa.nome_outra_pessoa ||
              conversa.nome_usuario ||
              "Pessoa anônima",
            foto:
              perfilOutraPessoa?.foto_url ||
              perfilOutraPessoa?.foto ||
              conversa.foto_outra_pessoa ||
              conversa.foto_usuario ||
              "",
            possuiSelo: Boolean(outraPessoaPsicologo || outraPessoaSelo),
            tipoSelo: outraPessoaPsicologo ? "psicologo" : outraPessoaSelo ? "confianca" : "",
            textoSelo: outraPessoaPsicologo ? "Psicólogo parceiro" : outraPessoaSelo || "Apoiador de confiança",
            preview:
              ultimaMensagemReal?.mensagem ||
              conversa.ultima_mensagem ||
              conversa.ultimaMensagem ||
              "Conversa em andamento.",
            ultimaMensagemEm,
            mensagemNova,
          };
        });

        const existemSolicitacoesNovas = solicitacoesFormatadas.some(
          (pedido) => !vistasSolicitacoes.includes(String(pedido.id))
        );

        const existemMensagensNovas = recentesFormatadas.some(
          (conversa) => conversa.mensagemNova
        );

        if (ativo) {
          setSolicitacoes(solicitacoesFormatadas);
          setRecentes(recentesFormatadas);
          setNotificacoesSolicitacoes(existemSolicitacoesNovas);
          setNotificacoesRecentes(existemMensagensNovas);
        }
      } catch (erro) {
        console.error(
          "Erro geral ao carregar conversas:",
          erro
        );

        if (ativo) {
          setErro(
            "Não foi possível carregar suas conversas."
          );
        }
      } finally {
        if (ativo) {
          setCarregandoLista(false);
        }
      }
    }

    carregarLista();

    /*
      Atualização periódica simples.
      Não usamos Realtime aqui para manter essa versão
      mais estável.
    */

    const intervalo = setInterval(
      carregarLista,
      5000
    );

    return () => {
      ativo = false;
      clearInterval(intervalo);
    };
  }, [usuarioId]);

  /* =========================================================
     CARREGAR MENSAGENS
  ========================================================= */

  useEffect(() => {
    let ativo = true;

    async function carregarMensagens() {
      if (!conversaAtual?.id) {
        setMensagens([]);
        return;
      }

      try {
        setCarregandoMensagens(true);
        setErro("");

        const {
          data,
          error,
        } = await supabase
          .from("mensagens_conversa")
          .select("*")
          .eq(
            "conversa_id",
            conversaAtual.id
          )
          .order("criada_em", {
            ascending: true,
          });

        if (error) {
          throw error;
        }

        if (ativo) {
          setMensagens(data || []);
        }
      } catch (erro) {
        console.error(
          "Erro ao carregar mensagens:",
          erro
        );

        if (ativo) {
          setErro(
            "Não foi possível carregar as mensagens."
          );
        }
      } finally {
        if (ativo) {
          setCarregandoMensagens(false);
        }
      }
    }

    carregarMensagens();

    return () => {
      ativo = false;
    };
  }, [conversaAtual?.id]);

  /* =========================================================
     SCROLL AUTOMÁTICO
  ========================================================= */

  useEffect(() => {
    fimMensagensRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [mensagens]);

  /* =========================================================
     ABRIR CONVERSA RECENTE
  ========================================================= */

  function abrirConversa(conversa) {
    const dados = {
      ...conversa,
      id: conversa.id,
    };

    const vistasConversas = JSON.parse(
      localStorage.getItem("pulsanConversasVistas") || "{}"
    );

    vistasConversas[String(conversa.id)] = Date.now();

    localStorage.setItem(
      "pulsanConversasVistas",
      JSON.stringify(vistasConversas)
    );

    setRecentes((anteriores) =>
      anteriores.map((item) =>
        item.id === conversa.id
          ? { ...item, mensagemNova: false }
          : item
      )
    );

    setNotificacoesRecentes(
      recentes.some(
        (item) => item.id !== conversa.id && item.mensagemNova
      )
    );

    setConversaAtual(dados);
    setTela("chat");
    setErro("");

    localStorage.setItem(
      "pulsanConversaAtual",
      JSON.stringify(dados)
    );

    localStorage.setItem(
      "pulsanNomeOutraPessoa",
      conversa.nome || "Pessoa anônima"
    );

    localStorage.setItem(
      "pulsanFotoOutraPessoa",
      conversa.foto || ""
    );

    if (conversa.desabafo_id) {
      localStorage.setItem(
        "pulsanIdDesabafoConversa",
        conversa.desabafo_id
      );
    }

    if (conversa.desabafo) {
      localStorage.setItem(
        "pulsanDesabafoConversa",
        conversa.desabafo
      );
    }
  }

  /* =========================================================
     ABRIR SOLICITAÇÃO
  ========================================================= */

  function abrirSolicitacao(pedido) {
    const vistas = JSON.parse(
      localStorage.getItem("pulsanSolicitacoesVistas") || "[]"
    );

    const id = String(pedido.id);

    if (!vistas.includes(id)) {
      vistas.push(id);
    }

    localStorage.setItem(
      "pulsanSolicitacoesVistas",
      JSON.stringify(vistas)
    );

    setSolicitacoes((anteriores) =>
      anteriores.map((item) =>
        item.id === pedido.id
          ? { ...item, foiVista: true }
          : item
      )
    );

    setNotificacoesSolicitacoes(
      solicitacoes.some(
        (item) => item.id !== pedido.id && !vistas.includes(String(item.id))
      )
    );

    localStorage.setItem(
      "pulsanSolicitacaoSelecionada",
      JSON.stringify(pedido)
    );

    if (typeof irPara === "function") {
      irPara("solicitacoes");
    }
  }

  /* =========================================================
     ACEITAR SOLICITAÇÃO

     Somente quem publicou o desabafo pode aceitar.
     Ao aceitar, a conversa é criada e entra em Recentes.
  ========================================================= */

  async function aceitarSolicitacao(pedido) {
    if (!usuarioId || !pedido?.id) return;

    if (!window.confirm(
      `Deseja aceitar a solicitação de ${pedido.nome || "Pessoa anônima"}?\n\n` +
      "A conversa será criada e aparecerá em Recentes."
    )) return;

    try {
      setErro("");

      if (!pedido.desabafo_id) {
        throw new Error("Esta solicitação não está vinculada a um desabafo.");
      }

      // Confirma que o usuário atual é realmente o autor do desabafo.
      const { data: post, error: erroPost } = await supabase
        .from("posts_ambiente")
        .select("id, usuario_id, texto")
        .eq("id", pedido.desabafo_id)
        .maybeSingle();

      if (erroPost) throw erroPost;
      if (!post) throw new Error("O desabafo relacionado não foi encontrado.");

      if (String(post.usuario_id) !== String(usuarioId)) {
        throw new Error("Somente quem publicou este desabafo pode aceitar a solicitação.");
      }

      const { data: solicitacaoAtual, error: erroSolicitacao } = await supabase
        .from("solicitacoes_chat")
        .select("id, solicitante_id, destinatario_id, desabafo_id, status")
        .eq("id", pedido.id)
        .eq("destinatario_id", usuarioId)
        .eq("status", "pendente")
        .maybeSingle();

      if (erroSolicitacao) throw erroSolicitacao;
      if (!solicitacaoAtual) throw new Error("Esta solicitação não está mais pendente.");

      const { data: aceita, error: erroAceitar } = await supabase
        .from("solicitacoes_chat")
        .update({ status: "aceita" })
        .eq("id", pedido.id)
        .eq("destinatario_id", usuarioId)
        .eq("status", "pendente")
        .select("*")
        .single();

      if (erroAceitar) throw erroAceitar;

      // Reaproveita uma conversa da mesma solicitação, se existir.
      let conversa;
      const { data: existente, error: erroBuscaConversa } = await supabase
        .from("conversas")
        .select("*")
        .eq("solicitacao_id", aceita.id)
        .maybeSingle();

      if (erroBuscaConversa) throw erroBuscaConversa;

      if (existente) {
        conversa = existente;
      } else {
        const { data: novaConversa, error: erroConversa } = await supabase
          .from("conversas")
          .insert({
            solicitante_id: aceita.solicitante_id,
            destinatario_id: aceita.destinatario_id,
            solicitacao_id: aceita.id,
            status: "ativa",
            iniciada_em: new Date().toISOString(),
          })
          .select("*")
          .single();

        if (erroConversa) throw erroConversa;
        conversa = novaConversa;
      }

      const dadosRecentes = {
        ...conversa,
        outraPessoaId: aceita.solicitante_id,
        nome: pedido.nome || "Pessoa anônima",
        foto: pedido.foto || "",
        possuiSelo: Boolean(pedido.possuiSelo),
        tipoSelo: pedido.tipoSelo || "",
        textoSelo: pedido.textoSelo || "",
        preview: "Conversa iniciada a partir do seu desabafo.",
        ultimaMensagemEm: conversa.iniciada_em || new Date().toISOString(),
        mensagemNova: false,
        desabafo_id: aceita.desabafo_id,
        desabafo: post.texto || pedido.desabafo || "",
      };

      // Contexto disponível caso a tela de chat seja aberta depois.
      localStorage.setItem("pulsanConversaAtual", JSON.stringify(dadosRecentes));
      localStorage.setItem("pulsanNomeOutraPessoa", dadosRecentes.nome);
      localStorage.setItem("pulsanFotoOutraPessoa", dadosRecentes.foto);
      localStorage.setItem("pulsanPapelConversa", "autor-desabafo");
      localStorage.setItem("pulsanIdDesabafoConversa", String(aceita.desabafo_id || ""));
      localStorage.setItem("pulsanDesabafoConversa", dadosRecentes.desabafo);

      setSolicitacoes((anteriores) => anteriores.filter((item) => item.id !== pedido.id));
      setNotificacoesSolicitacoes(
        solicitacoes.some(
          (item) => item.id !== pedido.id && !item.foiVista
        )
      );

      // A conversa aceita aparece imediatamente no topo de Recentes.
      setRecentes((anteriores) => [
        dadosRecentes,
        ...anteriores.filter((item) => String(item.id) !== String(conversa.id)),
      ]);

      setTela("lista");

      window.setTimeout(() => {
        document
          .querySelector(".pulsan-panel-recent")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 80);
    } catch (erro) {
      console.error("Erro ao aceitar solicitação:", erro);
      setErro(erro?.message || "Não foi possível aceitar esta solicitação.");
    }
  }

  /* =========================================================
     RECUSAR SOLICITAÇÃO
     Somente quem publicou o desabafo pode recusar.
  ========================================================= */

  async function recusarSolicitacao(pedido) {
    if (!usuarioId || !pedido?.id) return;

    if (!window.confirm(
      `Deseja recusar a solicitação de ${pedido.nome || "Pessoa anônima"}?`
    )) return;

    try {
      setErro("");

      if (!pedido.desabafo_id) {
        throw new Error("Esta solicitação não está vinculada a um desabafo.");
      }

      const { data: post, error: erroPost } = await supabase
        .from("posts_ambiente")
        .select("id, usuario_id")
        .eq("id", pedido.desabafo_id)
        .maybeSingle();

      if (erroPost) throw erroPost;
      if (!post || String(post.usuario_id) !== String(usuarioId)) {
        throw new Error("Somente quem publicou este desabafo pode recusar a solicitação.");
      }

      const { error } = await supabase
        .from("solicitacoes_chat")
        .update({ status: "recusada" })
        .eq("id", pedido.id)
        .eq("destinatario_id", usuarioId)
        .eq("status", "pendente");

      if (error) throw error;

      setSolicitacoes((anteriores) => anteriores.filter((item) => item.id !== pedido.id));
      setNotificacoesSolicitacoes(
        solicitacoes.some(
          (item) => item.id !== pedido.id && !item.foiVista
        )
      );
    } catch (erro) {
      console.error("Erro ao recusar solicitação:", erro);
      setErro(erro?.message || "Não foi possível recusar esta solicitação.");
    }
  }

  /* =========================================================
     ENVIAR MENSAGEM
  ========================================================= */

  async function enviarMensagem(event) {
    if (event) {
      event.preventDefault();
    }

    const texto = novaMensagem.trim();

    if (
      !texto ||
      !conversaAtual?.id ||
      !usuarioId ||
      enviando
    ) {
      return;
    }

    try {
      setEnviando(true);
      setErro("");

      const {
        data,
        error,
      } = await supabase
        .from("mensagens_conversa")
        .insert({
          conversa_id: conversaAtual.id,
          remetente_id: usuarioId,
          mensagem: texto,
        })
        .select("*")
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setMensagens((anteriores) => [
          ...anteriores,
          data,
        ]);
      }

      setNovaMensagem("");

      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } catch (erro) {
      console.error(
        "Erro ao enviar mensagem:",
        erro
      );

      setErro(
        "Não foi possível enviar a mensagem."
      );
    } finally {
      setEnviando(false);
    }
  }

  /* =========================================================
     VOLTAR
  ========================================================= */

  function voltarParaLista() {
    setTela("lista");
    setConversaAtual(null);
    setMensagens([]);
    setErro("");
  }

  /* =========================================================
     TELA DE LISTA
  ========================================================= */

  if (tela === "lista") {
    return (
      <div
        className={`pulsan-conversas ${
          modoEscuro ? "pulsan-dark" : ""
        }`}
      >
        <style>{CSS}</style>

        <main className="pulsan-conversas-container">

          {/* HERO */}

          <section className="pulsan-hero-conversas">
            <div className="pulsan-hero-glow" />

            <div className="pulsan-kicker">
              PULSAN • ESPAÇO SEGURO
            </div>

            <h1>
              Com quem você quer conversar?
            </h1>

            <p>
              Escolha uma solicitação ou continue
              uma conversa que já começou.
              Aqui, cada palavra pode ser um ponto
              de apoio.
            </p>

            <div
              className="pulsan-floating-icons"
              aria-hidden="true"
            >
              <span>🦋</span>
              <span>✦</span>
              <span>💙</span>
            </div>
          </section>

          {/* ERRO */}

          {erro && (
            <div className="pulsan-error">
              {erro}
            </div>
          )}

          {/* CARREGANDO */}

          {carregandoLista ? (
            <div className="pulsan-loading-card">
              <div className="pulsan-loader">
                💙
              </div>

              <strong>
                Preparando seu espaço seguro...
              </strong>

              <span>
                Estamos buscando suas conversas.
              </span>
            </div>
          ) : (
            <>
              {/* PAINÉIS PRINCIPAIS */}
              <div className="pulsan-conversas-grid">

                {/* SOLICITAÇÕES */}
                <section className="pulsan-section pulsan-panel pulsan-panel-request">
                  <div className="pulsan-section-title">
                    <div className="pulsan-title-with-icon">
                      <div className="pulsan-section-icon request-icon">💬</div>
                      <div>
                        <span className="pulsan-mini-label">AGORA</span>
                        <h2>Solicitações</h2>
                        <p>Pedidos de conversa que chegaram até você.</p>
                      </div>
                    </div>

                    <div className="pulsan-title-side">
                      {notificacoesSolicitacoes && (
                        <span className="pulsan-notification-dot" title="Novas solicitações" />
                      )}
                      <span className="pulsan-count">{solicitacoes.length}</span>
                    </div>
                  </div>

                  {solicitacoes.length === 0 ? (
                    <div className="pulsan-empty pulsan-panel-empty">
                      <div className="pulsan-empty-icon">🌱</div>
                      <strong>Nenhuma solicitação por enquanto</strong>
                      <span>
                        Quando alguém pedir para conversar com você,
                        o pedido aparecerá aqui.
                      </span>
                    </div>
                  ) : (
                    <div className="pulsan-list">
                      {solicitacoes.map((pedido) => (
                        <article
                          key={pedido.id}
                          className={`pulsan-conversation-card request ${
                            pedido.foiVista ? "is-viewed" : "is-unread"
                          }`}
                          onClick={() => abrirSolicitacao(pedido)}
                        >
                          {!pedido.foiVista && (
                            <span
                              className="pulsan-card-notification"
                              title="Nova solicitação"
                              aria-label="Nova solicitação"
                            />
                          )}

                          <Avatar foto={pedido.foto} nome={pedido.nome} />

                          <div className="pulsan-card-content">
                            <div className="pulsan-card-top">
                              <strong>{pedido.nome}</strong>
                              {pedido.possuiSelo && (
                                <span
                                  className="pulsan-profile-seal"
                                  title={pedido.textoSelo || "Selo Pulsan"}
                                  aria-label={pedido.textoSelo || "Selo Pulsan"}
                                >
                                  {pedido.tipoSelo === "psicologo" ? "🧠" : "🏅"}
                                </span>
                              )}
                              {!pedido.foiVista && (
                                <span className="pulsan-new-badge">NOVO</span>
                              )}
                            </div>

                            <span className="pulsan-origin">
                              💭 A partir de um desabafo
                            </span>

                            <div className="pulsan-request-desabafo">
                              <span>💭 SEU DESABAFO</span>
                              <p>{pedido.desabafo}</p>
                            </div>

                            <span className="pulsan-card-action">
                              Essa pessoa ofereceu ajuda a você
                            </span>

                            <div
                              className="pulsan-request-actions"
                              onClick={(event) => event.stopPropagation()}
                            >
                              <button
                                type="button"
                                className="pulsan-request-reject"
                                onClick={() => recusarSolicitacao(pedido)}
                              >
                                ✕ Recusar
                              </button>
                              <button
                                type="button"
                                className="pulsan-request-accept"
                                onClick={() => aceitarSolicitacao(pedido)}
                              >
                                ✓ Aceitar
                              </button>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </section>

                {/* RECENTES */}
                <section className="pulsan-section pulsan-panel pulsan-panel-recent">
                  <div className="pulsan-section-title">
                    <div className="pulsan-title-with-icon">
                      <div className="pulsan-section-icon recent-icon">🕊️</div>
                      <div>
                        <span className="pulsan-mini-label">CONTINUE</span>
                        <h2>Conversas recentes</h2>
                        <p>Retome um espaço onde uma conversa já começou.</p>
                      </div>
                    </div>

                    <div className="pulsan-title-side">
                      {notificacoesRecentes && (
                        <span className="pulsan-notification-dot" title="Novas mensagens" />
                      )}
                      <span className="pulsan-count">{recentes.length}</span>
                    </div>
                  </div>

                  {recentes.length === 0 ? (
                    <div className="pulsan-empty pulsan-panel-empty">
                      <div className="pulsan-empty-icon">💫</div>
                      <strong>Suas conversas aparecerão aqui</strong>
                      <span>
                        Depois que uma solicitação for aceita,
                        você poderá continuar a conversa por este espaço.
                      </span>
                    </div>
                  ) : (
                    <div className="pulsan-list">
                      {recentes.map((conversa) => (
                        <button
                          key={conversa.id}
                          type="button"
                          className={`pulsan-conversation-card ${
                            conversa.mensagemNova ? "is-unread" : "is-viewed"
                          }`}
                          onClick={() => abrirConversa(conversa)}
                        >
                          {conversa.mensagemNova && (
                            <span
                              className="pulsan-card-notification"
                              title="Nova mensagem"
                              aria-label="Nova mensagem"
                            />
                          )}

                          <Avatar foto={conversa.foto} nome={conversa.nome} />

                          <div className="pulsan-card-content">
                            <div className="pulsan-card-top">
                              <strong>{conversa.nome}</strong>
                              {conversa.possuiSelo && (
                                <span
                                  className="pulsan-profile-seal"
                                  title={conversa.textoSelo || "Selo Pulsan"}
                                  aria-label={conversa.textoSelo || "Selo Pulsan"}
                                >
                                  {conversa.tipoSelo === "psicologo" ? "🧠" : "🏅"}
                                </span>
                              )}
                              {conversa.mensagemNova ? (
                                <span className="pulsan-new-badge">NOVA</span>
                              ) : (
                                <span className="pulsan-private-badge">🔒 PRIVADA</span>
                              )}
                            </div>

                            <p>{conversa.preview}</p>

                            <span className="pulsan-card-action">
                              {conversa.mensagemNova
                                ? "Nova mensagem →"
                                : "Entrar na conversa →"}
                            </span>
                          </div>

                          <span className="pulsan-arrow">›</span>
                        </button>
                      ))}
                    </div>
                  )}
                </section>
              </div>

              {/* ESSÊNCIA */}

              <div className="pulsan-essence">
                <div className="pulsan-essence-icon">🦋</div>
                <div>
                  <strong>Um lugar para falar, ouvir e acolher.</strong>
                  <span>
                    No Pulsan, cada conversa respeita seu tempo,
                    sua privacidade e o direito de falar sem medo de julgamento.
                  </span>
                </div>
                <div className="pulsan-essence-symbols" aria-hidden="true">
                  <span>✦</span>
                  <span>☼</span>
                  <span>•</span>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    );
  }

  /* =========================================================
     TELA DA CONVERSA
  ========================================================= */

  return (
    <div
      className={`pulsan-chat-page ${
        modoEscuro ? "pulsan-dark" : ""
      }`}
    >
      <style>{CSS}</style>

      {/* HEADER */}

      <header className="pulsan-chat-header">

        <button
          type="button"
          className="pulsan-back"
          onClick={voltarParaLista}
          aria-label="Voltar"
        >
          ←
        </button>

        <Avatar
          foto={
            localStorage.getItem(
              "pulsanFotoOutraPessoa"
            ) || ""
          }
          nome={
            conversaAtual?.nome ||
            "Pessoa anônima"
          }
          pequeno
        />

        <div className="pulsan-chat-person">

          <strong>
            {conversaAtual?.nome ||
              localStorage.getItem(
                "pulsanNomeOutraPessoa"
              ) ||
              "Pessoa anônima"}
          </strong>

          <span>
            🔒 Conversa privada
          </span>

        </div>
      </header>

      {/* CONTEÚDO */}

      <main className="pulsan-chat-main">

        {/* SEGURANÇA */}

        <div className="pulsan-chat-security">

          <span>
            🛡️
          </span>

          <div>

            <strong>
              Um espaço de respeito e segurança
            </strong>

            <p>
              Evite compartilhar informações
              pessoais. Você pode conversar
              sem revelar sua identidade.
            </p>

          </div>
        </div>

        {/* DESABAFO DE ORIGEM */}

        {localStorage.getItem(
          "pulsanDesabafoConversa"
        ) && (
          <div className="pulsan-desabafo-origin">

            <span>
              💭 DESABAFO DE ORIGEM
            </span>

            <p>
              {localStorage.getItem(
                "pulsanDesabafoConversa"
              )}
            </p>

          </div>
        )}

        {/* ERRO */}

        {erro && (
          <div className="pulsan-error">
            {erro}
          </div>
        )}

        {/* MENSAGENS */}

        <div className="pulsan-messages">

          {carregandoMensagens ? (
            <div className="pulsan-chat-empty">

              <div>
                💙
              </div>

              <strong>
                Preparando a conversa...
              </strong>

            </div>
          ) : mensagens.length === 0 ? (
            <div className="pulsan-chat-empty">

              <div>
                🌱
              </div>

              <strong>
                Este é o começo da conversa
              </strong>

              <span>
                Uma mensagem simples pode ser
                o primeiro passo para alguém se
                sentir ouvido.
              </span>

            </div>
          ) : (
            mensagens.map(
              (item, index) => {

                const remetenteId =
                  item.remetente_id ||
                  item.remetenteId;

                const texto =
                  item.mensagem ||
                  item.texto ||
                  "";

                const minha =
                  remetenteId === usuarioId;

                return (
                  <div
                    key={
                      item.id ||
                      `${item.criada_em}-${index}`
                    }
                    className={`pulsan-message-row ${
                      minha
                        ? "mine"
                        : "other"
                    }`}
                  >

                    <div className="pulsan-message-bubble">

                      <span>
                        {texto}
                      </span>

                      {item.criada_em && (
                        <small>
                          {new Date(
                            item.criada_em
                          ).toLocaleTimeString(
                            "pt-BR",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </small>
                      )}

                    </div>

                  </div>
                );
              }
            )
          )}

          <div
            ref={fimMensagensRef}
          />

        </div>
      </main>

      {/* CAMPO DE MENSAGEM */}

      <form
        className="pulsan-composer"
        onSubmit={enviarMensagem}
      >

        <input
          ref={inputRef}
          type="text"
          value={novaMensagem}
          onChange={(event) =>
            setNovaMensagem(
              event.target.value
            )
          }
          placeholder="Escreva uma mensagem de apoio..."
          maxLength={2000}
          autoComplete="off"
        />

        <button
          type="submit"
          disabled={
            !novaMensagem.trim() ||
            enviando
          }
          aria-label="Enviar mensagem"
        >
          {enviando ? "…" : "➤"}
        </button>

      </form>
    </div>
  );
}

/* =========================================================
   AVATAR
========================================================= */

function Avatar({
  foto,
  nome,
  pequeno = false,
}) {
  const letra =
    (nome || "P")
      .trim()
      .charAt(0)
      .toUpperCase() || "P";

  return (
    <div
      className={`pulsan-avatar ${
        pequeno ? "small" : ""
      }`}
    >
      {foto ? (
        <img
          src={foto}
          alt=""
        />
      ) : (
        <span>
          {letra}
        </span>
      )}
    </div>
  );
}

/* =========================================================
   CSS PULSAN
========================================================= */

const CSS = `
.pulsan-conversas,
.pulsan-chat-page {
  --pulsan-blue: #3A7DFF;
  --pulsan-deep: #0F2D5B;
  --pulsan-light: #EAF3FF;
  --pulsan-soft: #A8C7FF;
  --pulsan-bg: #F7FAFF;
  --pulsan-white: #FFFFFF;
  --pulsan-text-soft: #647895;

  min-height: 100vh;

  background:
    radial-gradient(
      circle at 8% 4%,
      rgba(168,199,255,.35),
      transparent 25%
    ),
    radial-gradient(
      circle at 94% 14%,
      rgba(58,125,255,.10),
      transparent 24%
    ),
    var(--pulsan-bg);

  color: var(--pulsan-deep);
}

.pulsan-dark {
  --pulsan-bg: #09182d;
  --pulsan-white: #102744;
  --pulsan-text-soft: #a9bad2;

  color: #edf5ff;
}

/* DARK */

.pulsan-dark
.pulsan-hero-conversas,
.pulsan-dark
.pulsan-conversation-card,
.pulsan-dark
.pulsan-empty,
.pulsan-dark
.pulsan-loading-card {
  background: #102744;
  color: #edf5ff;
  border-color: rgba(168,199,255,.15);
}

.pulsan-dark
.pulsan-hero-conversas p,
.pulsan-dark
.pulsan-empty span,
.pulsan-dark
.pulsan-card-content p,
.pulsan-dark
.pulsan-section-title p {
  color: #a9bad2;
}

/* CONTAINER */

.pulsan-conversas-container {
  width: min(
    1240px,
    calc(100% - 48px)
  );

  margin: 0 auto;

  padding:
    28px
    0
    100px;
}

/* HERO */

.pulsan-hero-conversas {
  position: relative;

  overflow: hidden;

  padding: 42px 46px;

  min-height: 230px;

  border-radius: 34px;

  background:
    linear-gradient(
      135deg,
      #fff 0%,
      #eaf3ff 100%
    );

  border:
    1px solid
    rgba(58,125,255,.12);

  box-shadow:
    0 18px 50px
    rgba(15,45,91,.09);
}

.pulsan-hero-glow {
  position: absolute;

  width: 190px;
  height: 190px;

  right: -70px;
  top: -75px;

  border-radius: 50%;

  background:
    rgba(168,199,255,.34);
}

.pulsan-kicker,
.pulsan-mini-label {
  color: var(--pulsan-blue);

  font-size: 11px;

  font-weight: 900;

  letter-spacing: .12em;
}

.pulsan-hero-conversas h1 {
  position: relative;

  margin:
    7px
    0
    8px;

  font-size:
    clamp(
      30px,
      3.2vw,
      44px
    );

  line-height: 1.1;

  letter-spacing: -.03em;
}

.pulsan-hero-conversas p {
  position: relative;

  max-width: 680px;

  margin: 0;

  color: #617590;

  line-height: 1.6;
}

.pulsan-floating-icons {
  position: absolute;

  right: 28px;
  bottom: 24px;

  display: flex;

  gap: 8px;

  align-items: center;
}

.pulsan-floating-icons span {
  animation:
    pulsanFloat
    3.5s
    ease-in-out
    infinite;

  font-size: 24px;
}

.pulsan-floating-icons span:nth-child(2) {
  animation-delay: .6s;
}

.pulsan-floating-icons span:nth-child(3) {
  animation-delay: 1.1s;
}

@keyframes pulsanFloat {
  50% {
    transform:
      translateY(-7px)
      rotate(4deg);
  }
}

/* PAINÉIS PRINCIPAIS */

.pulsan-conversas-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 24px;
  margin-top: 26px;
  align-items: stretch;
}

.pulsan-panel {
  position: relative;
  margin-top: 0;
  min-height: 430px;
  padding: 25px;
  border: 1px solid rgba(58,125,255,.12);
  border-radius: 30px;
  background: rgba(255,255,255,.82);
  box-shadow: 0 18px 45px rgba(15,45,91,.07);
  overflow: hidden;
}

.pulsan-panel::before {
  content: "";
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  right: -70px;
  top: -70px;
  background: rgba(168,199,255,.18);
  pointer-events: none;
}

.pulsan-panel-request {
  background: linear-gradient(150deg, #ffffff 0%, #f1f7ff 100%);
}

.pulsan-panel-recent {
  background: linear-gradient(150deg, #ffffff 0%, #f7faff 100%);
}

.pulsan-dark .pulsan-panel {
  background: linear-gradient(150deg, #102744 0%, #0d203b 100%);
}

.pulsan-title-with-icon {
  display: flex;
  align-items: center;
  gap: 13px;
  min-width: 0;
}

.pulsan-section-icon {
  width: 52px;
  height: 52px;
  flex: 0 0 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 18px;
  background: #EAF3FF;
  font-size: 23px;
  box-shadow: inset 0 0 0 1px rgba(58,125,255,.08);
}

.pulsan-dark .pulsan-section-icon {
  background: rgba(58,125,255,.16);
}

.pulsan-section-title > div:first-child {
  min-width: 0;
}

.pulsan-section-title h2 {
  margin: 3px 0 2px;
  font-size: 21px;
  letter-spacing: -.02em;
}

.pulsan-section-title p {
  margin: 0;
  color: var(--pulsan-text-soft);
  font-size: 11px;
  line-height: 1.45;
}

.pulsan-title-side {
  display: flex;
  align-items: center;
  gap: 9px;
  flex-shrink: 0;
}

.pulsan-notification-dot,
.pulsan-card-notification {
  display: block;
  border-radius: 50%;
  background: #3A7DFF;
  box-shadow: 0 0 0 4px rgba(58,125,255,.12), 0 4px 12px rgba(58,125,255,.28);
}

.pulsan-notification-dot {
  width: 10px;
  height: 10px;
}

.pulsan-card-notification {
  position: absolute;
  left: 10px;
  top: 10px;
  width: 9px;
  height: 9px;
  z-index: 2;
}

.pulsan-conversation-card {
  position: relative;
}

.pulsan-conversation-card.is-unread {
  border-color: rgba(58,125,255,.28);
  box-shadow: 0 12px 30px rgba(58,125,255,.10);
}

.pulsan-conversation-card.is-unread .pulsan-card-content strong {
  color: var(--pulsan-deep);
}

.pulsan-panel-empty {
  min-height: 255px;
  margin-top: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pulsan-essence-symbols {
  margin-left: auto;
  display: flex;
  gap: 8px;
  align-items: center;
  color: var(--pulsan-blue);
  font-size: 16px;
  opacity: .7;
}

/* SECTION */

.pulsan-section {
  margin-top: 25px;
}

.pulsan-section-title {
  display: flex;

  justify-content:
    space-between;

  align-items: center;

  margin-bottom: 12px;
}

.pulsan-section-title h2 {
  margin:
    4px
    0
    0;

  font-size: 19px;
}

.pulsan-count {
  min-width: 30px;
  height: 30px;

  padding:
    0
    8px;

  border-radius: 999px;

  display: flex;

  justify-content: center;
  align-items: center;

  background:
    var(--pulsan-blue);

  color: white;

  font-size: 12px;

  font-weight: 900;
}

/* LISTA */

.pulsan-list {
  display: grid;

  gap: 12px;
}

/* CARD */

.pulsan-conversation-card {
  width: 100%;

  border:
    1px solid
    rgba(58,125,255,.12);

  background: #fff;

  border-radius: 22px;

  padding: 15px;

  display: flex;

  align-items: center;

  gap: 14px;

  text-align: left;

  cursor: pointer;

  color:
    var(--pulsan-deep);

  box-shadow:
    0 9px 26px
    rgba(15,45,91,.06);

  transition:
    transform .18s ease,
    box-shadow .18s ease,
    border-color .18s ease;
}

.pulsan-conversation-card:hover {
  transform:
    translateY(-2px);

  border-color:
    rgba(58,125,255,.30);

  box-shadow:
    0 15px 32px
    rgba(15,45,91,.10);
}

.pulsan-conversation-card.request {
  background:
    linear-gradient(
      135deg,
      #fff,
      #f5f9ff
    );
}

/* AVATAR */

.pulsan-avatar {
  width: 55px;
  height: 55px;

  flex:
    0 0
    55px;

  border-radius: 19px;

  overflow: hidden;

  display: flex;

  align-items: center;
  justify-content: center;

  background:
    linear-gradient(
      135deg,
      #eaf3ff,
      #a8c7ff
    );

  color:
    var(--pulsan-deep);

  font-size: 21px;

  font-weight: 900;
}

.pulsan-avatar.small {
  width: 43px;
  height: 43px;

  flex:
    0 0
    43px;

  border-radius: 15px;

  font-size: 17px;
}

.pulsan-avatar img {
  width: 100%;
  height: 100%;

  object-fit: cover;
}

/* CARD CONTENT */

.pulsan-card-content {
  min-width: 0;

  flex: 1;
}

.pulsan-card-top {
  display: flex;

  align-items: center;

  gap: 8px;

  min-width: 0;
}

.pulsan-card-top strong {
  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;
}

.pulsan-card-content p {
  margin:
    6px
    0;

  color: #697c96;

  font-size: 13px;

  line-height: 1.45;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;
}

.pulsan-origin {
  display: inline-block;

  margin-top: 5px;

  color:
    var(--pulsan-blue);

  font-size: 11px;

  font-weight: 800;
}

.pulsan-new-badge,
.pulsan-private-badge {
  flex-shrink: 0;

  padding:
    4px
    7px;

  border-radius: 999px;

  font-size: 9px;

  font-weight: 900;

  background:
    var(--pulsan-light);

  color:
    var(--pulsan-blue);
}

.pulsan-new-badge {
  background:
    var(--pulsan-blue);

  color: white;
}

.pulsan-profile-seal {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-left: 6px;
  border-radius: 999px;
  background: rgba(58, 125, 255, 0.12);
  border: 1px solid rgba(58, 125, 255, 0.22);
  font-size: 13px;
  vertical-align: middle;
  flex: 0 0 auto;
}

.pulsan-request-desabafo {
  margin-top: 12px;
  padding: 11px 12px;
  border-radius: 14px;
  background: rgba(234, 243, 255, 0.72);
  border: 1px solid rgba(168, 199, 255, 0.48);
}

.pulsan-request-desabafo > span {
  display: block;
  margin-bottom: 5px;
  color: var(--pulsan-blue);
  font-size: 9px;
  font-weight: 900;
  letter-spacing: .08em;
}

.pulsan-request-desabafo p {
  margin: 0;
  color: var(--pulsan-deep);
  font-size: 12px;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.pulsan-request-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.pulsan-request-actions button {
  border: 0;
  border-radius: 12px;
  padding: 9px 13px;
  font-size: 11px;
  font-weight: 900;
  cursor: pointer;
  transition: transform .18s ease, opacity .18s ease;
}

.pulsan-request-actions button:hover {
  transform: translateY(-1px);
}

.pulsan-request-reject {
  background: rgba(15, 45, 91, 0.08);
  color: var(--pulsan-deep);
}

.pulsan-request-accept {
  background: var(--pulsan-blue);
  color: #fff;
}

.pulsan-card-action {
  color:
    var(--pulsan-blue);

  font-size: 11px;

  font-weight: 900;
}

.pulsan-arrow {
  color:
    var(--pulsan-blue);

  font-size: 27px;
}

/* EMPTY */

.pulsan-empty,
.pulsan-loading-card {
  padding:
    27px
    18px;

  text-align: center;

  border:
    1px dashed
    rgba(58,125,255,.24);

  border-radius: 22px;

  background:
    rgba(255,255,255,.78);

  color:
    var(--pulsan-text-soft);
}

.pulsan-empty-icon,
.pulsan-loader {
  font-size: 30px;

  margin-bottom: 7px;
}

.pulsan-loader {
  animation:
    pulsanSpin
    2.5s
    ease-in-out
    infinite;
}

@keyframes pulsanSpin {
  50% {
    transform:
      scale(1.12)
      rotate(5deg);
  }
}

.pulsan-empty strong,
.pulsan-loading-card strong {
  display: block;

  margin-bottom: 5px;

  color:
    var(--pulsan-deep);
}

.pulsan-dark
.pulsan-empty strong,
.pulsan-dark
.pulsan-loading-card strong {
  color: #edf5ff;
}

.pulsan-empty span,
.pulsan-loading-card span {
  font-size: 13px;

  line-height: 1.5;
}

/* ESSÊNCIA */

.pulsan-essence {
  display: flex;

  align-items: center;

  gap: 13px;

  margin-top: 25px;

  padding:
    17px
    18px;

  border-radius: 19px;

  background:
    rgba(234,243,255,.82);

  color: #526b89;
}

.pulsan-dark
.pulsan-essence {
  background: #102744;
  color: #a9bad2;
}

.pulsan-essence-icon {
  width: 42px;
  height: 42px;

  flex:
    0 0
    42px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 15px;

  background: #fff;

  font-size: 21px;
}

.pulsan-essence strong {
  display: block;

  color:
    var(--pulsan-deep);

  font-size: 12px;

  margin-bottom: 3px;
}

.pulsan-dark
.pulsan-essence strong {
  color: #edf5ff;
}

.pulsan-essence span {
  font-size: 12px;

  line-height: 1.4;
}

/* ERRO */

.pulsan-error {
  margin-top: 14px;

  padding:
    12px
    14px;

  border-radius: 14px;

  background: #fff1f1;

  color: #a13b3b;

  font-size: 13px;
}

/* =========================================================
   CHAT
========================================================= */

.pulsan-chat-page {
  display: flex;

  flex-direction: column;
}

/* HEADER */

.pulsan-chat-header {
  position: sticky;

  top: 0;

  z-index: 10;

  min-height: 68px;

  display: flex;

  align-items: center;

  gap: 11px;

  padding:
    10px
    max(
      16px,
      calc(
        (100vw - 900px) / 2
      )
    );

  background:
    rgba(255,255,255,.91);

  border-bottom:
    1px solid
    rgba(58,125,255,.10);

  backdrop-filter:
    blur(15px);
}

.pulsan-dark
.pulsan-chat-header {
  background:
    rgba(9,24,45,.92);
}

.pulsan-back {
  border: 0;

  background: transparent;

  color:
    var(--pulsan-blue);

  font-size: 27px;

  cursor: pointer;

  padding:
    5px
    10px
    5px
    0;
}

.pulsan-chat-person {
  display: flex;

  flex-direction: column;

  min-width: 0;
}

.pulsan-chat-person strong {
  font-size: 15px;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;
}

.pulsan-chat-person span {
  margin-top: 2px;

  color:
    var(--pulsan-blue);

  font-size: 11px;

  font-weight: 800;
}

/* MAIN */

.pulsan-chat-main {
  width:
    min(
      900px,
      calc(100% - 28px)
    );

  margin: 0 auto;

  flex: 1;

  padding:
    18px
    0
    110px;
}

/* SEGURANÇA */

.pulsan-chat-security {
  display: flex;

  gap: 11px;

  padding:
    14px
    16px;

  border-radius: 18px;

  background:
    var(--pulsan-light);

  margin-bottom: 13px;
}

.pulsan-chat-security > span {
  font-size: 20px;
}

.pulsan-chat-security strong {
  display: block;

  font-size: 12px;
}

.pulsan-chat-security p {
  margin:
    3px
    0
    0;

  color: #607590;

  font-size: 11px;

  line-height: 1.45;
}

.pulsan-dark
.pulsan-chat-security p {
  color: #9eb2cc;
}

/* DESABAFO */

.pulsan-desabafo-origin {
  margin-bottom: 17px;

  padding: 15px;

  border-left:
    4px solid
    var(--pulsan-blue);

  border-radius: 14px;

  background:
    rgba(255,255,255,.80);
}

.pulsan-dark
.pulsan-desabafo-origin {
  background: #102744;
}

.pulsan-desabafo-origin span {
  color:
    var(--pulsan-blue);

  font-size: 10px;

  font-weight: 900;

  letter-spacing: .08em;
}

.pulsan-desabafo-origin p {
  margin:
    7px
    0
    0;

  color: #5d718d;

  font-size: 13px;

  line-height: 1.5;
}

.pulsan-dark
.pulsan-desabafo-origin p {
  color: #a9bad2;
}

/* MENSAGENS */

.pulsan-messages {
  display: flex;

  flex-direction: column;

  gap: 9px;
}

.pulsan-message-row {
  display: flex;
}

.pulsan-message-row.mine {
  justify-content: flex-end;
}

.pulsan-message-bubble {
  max-width:
    min(
      75%,
      560px
    );

  padding:
    11px
    14px;

  border-radius: 19px;

  background: #fff;

  border:
    1px solid
    rgba(58,125,255,.10);

  box-shadow:
    0 5px 15px
    rgba(15,45,91,.05);
}

.pulsan-message-row.mine
.pulsan-message-bubble {
  color: white;

  background:
    linear-gradient(
      135deg,
      #3a7dff,
      #326ee5
    );

  border: 0;

  border-bottom-right-radius: 6px;
}

.pulsan-message-row.other
.pulsan-message-bubble {
  border-bottom-left-radius: 6px;
}

.pulsan-message-bubble > span {
  display: block;

  font-size: 13px;

  line-height: 1.5;

  white-space: pre-wrap;

  word-break: break-word;
}

.pulsan-message-bubble small {
  display: block;

  margin-top: 5px;

  text-align: right;

  opacity: .65;

  font-size: 9px;
}

/* CHAT VAZIO */

.pulsan-chat-empty {
  min-height: 220px;

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  text-align: center;

  color:
    var(--pulsan-text-soft);
}

.pulsan-chat-empty > div {
  font-size: 35px;

  margin-bottom: 7px;
}

.pulsan-chat-empty strong {
  color:
    var(--pulsan-deep);

  font-size: 15px;
}

.pulsan-dark
.pulsan-chat-empty strong {
  color: #edf5ff;
}

.pulsan-chat-empty span {
  max-width: 380px;

  margin-top: 5px;

  font-size: 12px;

  line-height: 1.5;
}

/* COMPOSER */

.pulsan-composer {
  position: fixed;

  z-index: 20;

  left: 50%;

  bottom: 14px;

  transform:
    translateX(-50%);

  width:
    min(
      860px,
      calc(100% - 26px)
    );

  display: flex;

  gap: 8px;

  padding: 8px;

  border-radius: 21px;

  background:
    rgba(255,255,255,.94);

  border:
    1px solid
    rgba(58,125,255,.13);

  box-shadow:
    0 15px 40px
    rgba(15,45,91,.14);

  backdrop-filter:
    blur(15px);
}

.pulsan-dark
.pulsan-composer {
  background:
    rgba(16,39,68,.95);
}

.pulsan-composer input {
  flex: 1;

  min-width: 0;

  border: 0;

  outline: 0;

  background: transparent;

  padding:
    10px
    12px;

  color:
    var(--pulsan-deep);

  font-size: 13px;
}

.pulsan-dark
.pulsan-composer input {
  color: #edf5ff;
}

.pulsan-composer input::placeholder {
  color: #8b9bb0;
}

.pulsan-composer button {
  width: 43px;
  height: 43px;

  flex:
    0 0
    43px;

  border: 0;

  border-radius: 15px;

  background:
    var(--pulsan-blue);

  color: white;

  font-size: 19px;

  cursor: pointer;

  transition:
    transform .15s,
    opacity .15s;
}

.pulsan-composer button:hover:not(:disabled) {
  transform:
    scale(1.04);
}

.pulsan-composer button:disabled {
  opacity: .45;

  cursor: not-allowed;
}

/* =========================================================
   RESPONSIVO
========================================================= */

@media (min-width: 701px) and (max-width: 1050px) {
  .pulsan-conversas-container {
    width: min(960px, calc(100% - 32px));
    padding-top: 22px;
  }

  .pulsan-hero-conversas {
    padding: 34px;
    min-height: 210px;
  }

  .pulsan-conversas-grid {
    gap: 17px;
  }

  .pulsan-panel {
    min-height: 410px;
    padding: 20px;
    border-radius: 26px;
  }

  .pulsan-section-title h2 {
    font-size: 18px;
  }

  .pulsan-section-title p {
    font-size: 10px;
  }

  .pulsan-conversation-card {
    padding: 13px;
    gap: 10px;
  }

  .pulsan-avatar {
    width: 47px;
    height: 47px;
    flex-basis: 47px;
  }
}

@media (max-width: 700px) {

  .pulsan-conversas-container {

    width:
      min(
        calc(100% - 22px),
        900px
      );

    padding-top: 15px;
  }

  .pulsan-conversas-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    margin-top: 15px;
  }

  .pulsan-panel {
    min-height: 360px;
    padding: 13px;
    border-radius: 20px;
  }

  .pulsan-title-with-icon {
    gap: 8px;
    align-items: flex-start;
  }

  .pulsan-section-icon {
    width: 36px;
    height: 36px;
    flex-basis: 36px;
    border-radius: 12px;
    font-size: 16px;
  }

  .pulsan-section-title {
    align-items: flex-start;
    gap: 5px;
  }

  .pulsan-section-title h2 {
    font-size: 14px;
  }

  .pulsan-section-title p {
    display: none;
  }

  .pulsan-mini-label {
    font-size: 8px;
  }

  .pulsan-count {
    min-width: 23px;
    height: 23px;
    padding: 0 6px;
    font-size: 9px;
  }

  .pulsan-notification-dot {
    width: 8px;
    height: 8px;
  }

  .pulsan-panel-empty {
    min-height: 245px;
    margin-top: 10px;
    padding: 15px 9px;
  }

  .pulsan-panel-empty strong {
    font-size: 11px;
  }

  .pulsan-panel-empty span {
    font-size: 10px;
  }

  .pulsan-hero-conversas {
    padding:
      23px
      20px;

    border-radius: 24px;
  }

  .pulsan-hero-conversas h1 {
    font-size: 25px;

    padding-right: 35px;
  }

  .pulsan-floating-icons {
    right: 15px;

    bottom: 15px;
  }

  .pulsan-floating-icons span {
    font-size: 19px;
  }

  .pulsan-conversation-card {
    padding: 11px 9px 11px 12px;
    border-radius: 16px;
    gap: 8px;
    align-items: flex-start;
  }

  .pulsan-avatar {
    width: 34px;
    height: 34px;
    flex-basis: 34px;
    border-radius: 11px;
    font-size: 14px;
  }

  .pulsan-card-content p {
    max-width: 100%;
  }

  .pulsan-arrow {
    display: none;
  }

  .pulsan-private-badge {
    display: none;
  }

  .pulsan-new-badge {
    display: inline-flex;
    font-size: 7px;
    padding: 3px 5px;
  }

  .pulsan-card-notification {
    left: 5px;
    top: 5px;
    width: 7px;
    height: 7px;
  }

  .pulsan-card-content p {
    font-size: 10px;
    line-height: 1.35;
    white-space: normal;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .pulsan-origin {
    font-size: 8px;
  }

  .pulsan-card-action {
    font-size: 8px;
  }

  .pulsan-arrow {
    display: none;
  }

  .pulsan-essence {
    margin-top: 15px;
    padding: 13px;
  }

  .pulsan-essence-symbols {
    display: none;
  }

  .pulsan-chat-main {
    width:
      calc(100% - 20px);
  }

  .pulsan-message-bubble {
    max-width: 84%;
  }

  .pulsan-composer {
    bottom: 9px;

    width:
      calc(100% - 18px);
  }
}
`;