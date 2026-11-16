
import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import "../tema.css";

/* =========================================================
   ÍCONES SVG — INTERFACE PULSAN
========================================================= */

function Icon({ name, size = 20, strokeWidth = 1.9, className = "" }) {
  const paths = {
    heart: <path d="M20.8 8.7c0 5.2-8.8 10.2-8.8 10.2S3.2 13.9 3.2 8.7A4.7 4.7 0 0 1 12 6.1a4.7 4.7 0 0 1 8.8 2.6Z" />,
    heartPulse: <><path d="M20.8 8.7c0 5.2-8.8 10.2-8.8 10.2S3.2 13.9 3.2 8.7A4.7 4.7 0 0 1 12 6.1a4.7 4.7 0 0 1 8.8 2.6Z"/><path d="M3 12h4l2-3 3 6 2-3h7"/></>,
    sparkles: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z"/><path d="m19 14 1 2.5 2.5 1-2.5 1L19 21l-1-2.5-2.5-1 2.5-1L19 14Z"/><path d="m5 2 1 2.5 2.5 1-2.5 1L5 9 4 6.5 1.5 5.5 4 4.5 5 2Z"/></>,
    message: <><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.4 9.4 0 0 1-4-.9L3 21l1.9-4.1A8 8 0 0 1 3 11.5 8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5Z"/></>,
    messages: <><path d="M21 11.5a8 8 0 0 1-8.5 8 9 9 0 0 1-3.8-.8L4 20l1.4-3.8A7.6 7.6 0 0 1 3 11.5a8 8 0 0 1 9-8 8 8 0 0 1 9 8Z"/><path d="M7 3.8A8 8 0 0 0 3 10"/></>,
    sprout: <><path d="M12 21v-9"/><path d="M12 13C7 13 4 10 4 5c5 0 8 3 8 8Z"/><path d="M12 16c0-5 3-8 8-8 0 5-3 8-8 8Z"/><path d="M5 21h14"/></>,
    brain: <><path d="M12 5a4 4 0 0 0-7.5 2A4 4 0 0 0 4 14a4 4 0 0 0 4 6h4V5Z"/><path d="M12 5a4 4 0 0 1 7.5 2A4 4 0 0 1 20 14a4 4 0 0 1-4 6h-4V5Z"/><path d="M8 9c2 0 3 1 3 3M16 9c-2 0-3 1-3 3M8 16c1-1 2-1 4 0m4 0c-1-1-2-1-4 0"/></>,
    badgeCheck: <><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/></>,
    lock: <><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 1 1 8 0v3"/></>,
    lockOpen: <><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 7.5-2"/></>,
    shieldCheck: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/></>,
    star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z"/>,
    send: <><path d="m22 2-7 20-4-9-9-4 20-7Z"/><path d="M22 2 11 13"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    x: <path d="m18 6-12 12M6 6l12 12"/>,
    arrowRight: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    arrowLeft: <><path d="M19 12H5"/><path d="m11 18-6-6 6-6"/></>,
    user: <><circle cx="12" cy="8" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></>,
    flag: <><path d="M4 22V5"/><path d="M4 5c6-4 10 4 16 0v11c-6 4-10-4-16 0"/></>,
    trash: <><path d="M3 6h18M8 6V4h8v2m3 0-1 15H6L5 6"/><path d="M10 11v6m4-6v6"/></>,
    cloud: <><path d="M7 18h10a4 4 0 0 0 .4-8 6 6 0 0 0-11.5 1.5A3.5 3.5 0 0 0 7 18Z"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    checkCircle: <><circle cx="12" cy="12" r="9"/><path d="m8 12 2.5 2.5L16 9"/></>
  };

  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name] || paths.sparkles}
    </svg>
  );
}

function ConversaPrincipal({ irPara, tema = "claro" }) {
  const [tela, setTela] = useState("lista");
  const [usuario, setUsuario] = useState(null);
  const [abaMobile, setAbaMobile] = useState("solicitacoes");

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
  const [finalizando, setFinalizando] = useState(false);
  const [erro, setErro] = useState("");

  const fimMensagensRef = useRef(null);
  const mensagensContainerRef = useRef(null);
  const inputRef = useRef(null);
  const canalListaRef = useRef(null);
  const canalMensagensRef = useRef(null);
  const [tecladoAberto, setTecladoAberto] = useState(false);
  const [alturaTeclado, setAlturaTeclado] = useState(0);

  const modoEscuro = tema === "escuro";

  /* CARREGAR USUÁRIO */

  useEffect(() => {
    let ativo = true;

    async function carregarUsuario() {
      try {
        const salvo = localStorage.getItem("usuarioLogado");

        if (salvo) {
          try {
            const dados = JSON.parse(salvo);
            if (ativo) setUsuario(dados);
          } catch (erroLocal) {
            console.warn("Não foi possível interpretar usuarioLogado:", erroLocal);
          }
        }

        const { data, error } = await supabase.auth.getUser();

        if (error) {
          console.warn("Usuário Supabase não encontrado:", error);
        }

        if (ativo && data?.user) {
          setUsuario((anterior) => ({
            ...(anterior || {}),
            id: data.user.id,
            email: data.user.email || anterior?.email || ""
          }));
        } else if (ativo && !data?.user) {
          setUsuario(null);
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

  /* CARREGAR SOLICITAÇÕES E CONVERSAS RECENTES */

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

        const {
          data: pedidos,
          error: erroPedidos
        } = await supabase
          .from("solicitacoes_chat")
          .select("*")
          .eq("destinatario_id", usuarioId)
          .eq("status", "pendente")
          .order("criado_em", { ascending: false });

        if (erroPedidos) {
          console.error("Erro ao carregar solicitações:", erroPedidos);
        }

        const listaPedidos = pedidos || [];
        const idsDesabafos = listaPedidos.map((item) => item.desabafo_post_id).filter(Boolean);
        const idsSolicitantes = listaPedidos.map((item) => item.solicitante_id).filter(Boolean);

        let posts = [];
        let perfisSolicitantes = [];
        let avaliacoesSolicitantes = [];

        if (idsDesabafos.length > 0) {
          const {
            data: postsData,
            error: erroPosts
          } = await supabase.rpc("pulsan_meus_posts_chat", {
            p_post_ids: idsDesabafos
          });

          if (erroPosts) {
            console.warn("Erro ao carregar desabafos:", erroPosts);
          }

          posts = postsData || [];
        }

        if (idsSolicitantes.length > 0) {
          const idsUnicos = [...new Set(idsSolicitantes)];

          const { data: perfisData, error: erroPerfis } = await supabase
            .rpc("obter_perfis_publicos_conversa", {
              p_ids: idsUnicos
            });

          if (erroPerfis) {
            console.warn("Erro ao carregar perfis públicos dos solicitantes:", erroPerfis);
          } else {
            perfisSolicitantes = perfisData || [];
          }

          const { data: avaliacoesData, error: erroAvaliacoes } = await supabase
            .rpc("obter_avaliacoes_publicas_conversa", {
              p_ids: idsUnicos
            });

          if (erroAvaliacoes) {
            console.warn("Erro ao carregar avaliações dos solicitantes:", erroAvaliacoes);
          } else {
            avaliacoesSolicitantes = avaliacoesData || [];
          }
        }

        const vistasSolicitacoes = JSON.parse(
          localStorage.getItem("pulsanSolicitacoesVistas") || "[]"
        );

        const solicitacoesFormatadas = listaPedidos.map((pedido) => {
          const post = posts.find((item) => item.id === pedido.desabafo_post_id);
          const perfilSolicitante = perfisSolicitantes.find(
            (item) => String(item.id) === String(pedido.solicitante_id)
          );

          const psicologoAprovado =
            perfilSolicitante?.verificacao_psicologo === "aprovado" ||
            perfilSolicitante?.psicologo_parceiro === true;

          const seloExplicito = perfilSolicitante?.selo || "";

          const avaliacaoSolicitante = avaliacoesSolicitantes.find(
            (item) => String(item.avaliado_id) === String(pedido.solicitante_id)
          );

          const mediaAvaliacoes = avaliacaoSolicitante?.media != null
            ? Number(avaliacaoSolicitante.media).toFixed(1)
            : "Novo";

          const quantidadeAvaliacoes = Number(avaliacaoSolicitante?.quantidade || 0);

          return {
            ...pedido,
            nome: perfilSolicitante?.nome || (psicologoAprovado ? "Psicólogo parceiro" : "Apoiador"),
            foto: perfilSolicitante?.foto_url || "",
            mediaAvaliacoes,
            quantidadeAvaliacoes,
            possuiSelo: Boolean(psicologoAprovado || seloExplicito),
            tipoSelo: psicologoAprovado ? "psicologo" : seloExplicito ? "confianca" : "",
            textoSelo: psicologoAprovado ? "Psicólogo parceiro" : seloExplicito || "Apoiador de confiança",
            identidadeRevelada: true,
            desabafo: post?.texto || "A pessoa deseja conversar com você.",
            foiVista: vistasSolicitacoes.includes(String(pedido.id))
          };
        });

        const {
          data: conversas,
          error: erroConversas
        } = await supabase
          .from("conversas")
          .select("*")
          .or(`solicitante_id.eq.${usuarioId},destinatario_id.eq.${usuarioId}`)
          .order("criada_em", { ascending: false });

        if (erroConversas) {
          console.error("Erro ao carregar conversas:", erroConversas);
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
        let avaliacoesOutrasPessoas = [];

        if (idsOutrasPessoas.length > 0) {
          const idsUnicosOutras = [...new Set(idsOutrasPessoas)];

          const { data: perfisData, error: erroPerfisRecentes } = await supabase
            .rpc("obter_perfis_publicos_conversa", {
              p_ids: idsUnicosOutras
            });

          if (erroPerfisRecentes) {
            console.warn("Erro ao carregar perfis públicos das conversas recentes:", erroPerfisRecentes);
          } else {
            perfisOutrasPessoas = perfisData || [];
          }

          const { data: avaliacoesData, error: erroAvaliacoesRecentes } = await supabase
            .rpc("obter_avaliacoes_publicas_conversa", {
              p_ids: idsUnicosOutras
            });

          if (erroAvaliacoesRecentes) {
            console.warn("Erro ao carregar avaliações das conversas recentes:", erroAvaliacoesRecentes);
          } else {
            avaliacoesOutrasPessoas = avaliacoesData || [];
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

          const outraPessoaSelo = perfilOutraPessoa?.selo || "";

          const avaliacaoOutraPessoa = avaliacoesOutrasPessoas.find(
            (item) => String(item.avaliado_id) === String(outraPessoaId)
          );

          const souAutorDoDesabafo =
            String(conversa.destinatario_id) === String(usuarioId);

          return {
            ...conversa,
            outraPessoaId,
            nome: souAutorDoDesabafo
              ? (outraPessoaPsicologo
                  ? "Psicólogo parceiro"
                  : (perfilOutraPessoa?.nome || "Pessoa anônima"))
              : "Anônimo",
            foto: souAutorDoDesabafo ? (perfilOutraPessoa?.foto_url || "") : "",
            mediaAvaliacoes: souAutorDoDesabafo && avaliacaoOutraPessoa?.media != null
              ? Number(avaliacaoOutraPessoa.media).toFixed(1)
              : "Novo",
            quantidadeAvaliacoes: souAutorDoDesabafo
              ? Number(avaliacaoOutraPessoa?.quantidade || 0)
              : 0,
            possuiSelo: souAutorDoDesabafo
              ? Boolean(outraPessoaPsicologo || outraPessoaSelo)
              : false,
            tipoSelo: souAutorDoDesabafo
              ? (outraPessoaPsicologo ? "psicologo" : outraPessoaSelo ? "confianca" : "")
              : "",
            textoSelo: souAutorDoDesabafo
              ? (outraPessoaPsicologo ? "Psicólogo parceiro" : outraPessoaSelo || "Apoiador de confiança")
              : "",
            preview:
              ultimaMensagemReal?.mensagem ||
              conversa.ultima_mensagem ||
              conversa.ultimaMensagem ||
              "Conversa em andamento.",
            ultimaMensagemEm,
            mensagemNova,
            desabafo_post_id: conversa.desabafo_post_id || null
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

          const abrirId = localStorage.getItem("pulsanAbrirConversaId");

          if (abrirId) {
            const conversaParaAbrir = recentesFormatadas.find(
              (item) => String(item.id) === String(abrirId)
            );

            if (conversaParaAbrir) {
              setConversaAtual(conversaParaAbrir);
              setTela("chat");
              setErro("");
              localStorage.setItem("pulsanConversaAtual", JSON.stringify(conversaParaAbrir));
              localStorage.removeItem("pulsanAbrirConversaId");
              localStorage.setItem(
                "pulsanIdDesabafoConversa",
                String(conversaParaAbrir.desabafo_post_id || "")
              );
            }
          }
        }
      } catch (erro) {
        console.error("Erro geral ao carregar conversas:", erro);
        if (ativo) setErro("Não foi possível carregar suas conversas.");
      } finally {
        if (ativo) setCarregandoLista(false);
      }
    }

    carregarLista();

    const canal = supabase
      .channel(`pulsan-lista-${usuarioId}`)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "solicitacoes_chat",
        filter: `destinatario_id=eq.${usuarioId}`
      }, () => carregarLista())
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "solicitacoes_chat",
        filter: `solicitante_id=eq.${usuarioId}`
      }, () => carregarLista())
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "conversas",
        filter: `solicitante_id=eq.${usuarioId}`
      }, () => carregarLista())
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "conversas",
        filter: `destinatario_id=eq.${usuarioId}`
      }, () => carregarLista())
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "mensagens_conversa"
      }, () => carregarLista())
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.info("Pulsan: tempo real das conversas conectado.");
        }
      });

    canalListaRef.current = canal;

    return () => {
      ativo = false;
      if (canalListaRef.current) {
        supabase.removeChannel(canalListaRef.current);
        canalListaRef.current = null;
      }
    };
  }, [usuarioId]);

  /* CARREGAR MENSAGENS */

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

        const { data, error } = await supabase
          .from("mensagens_conversa")
          .select("*")
          .eq("conversa_id", conversaAtual.id);

        if (error) throw error;

        if (ativo) {
          const ordenadas = [...(data || [])].sort((a, b) => {
            const aData = a?.criada_em || a?.criado_em || a?.created_at || 0;
            const bData = b?.criada_em || b?.criado_em || b?.created_at || 0;
            return new Date(aData).getTime() - new Date(bData).getTime();
          });
          setMensagens(ordenadas);
        }
      } catch (erro) {
        console.error("Erro ao carregar mensagens:", erro);
        if (ativo) setErro("Não foi possível carregar as mensagens.");
      } finally {
        if (ativo) setCarregandoMensagens(false);
      }
    }

    carregarMensagens();

    if (!conversaAtual?.id) {
      return () => {
        ativo = false;
      };
    }

    const idConversa = String(conversaAtual.id);

    const canal = supabase
      .channel(`pulsan-mensagens-${idConversa}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "mensagens_conversa",
        filter: `conversa_id=eq.${idConversa}`
      }, (payload) => {
        const nova = payload?.new;
        if (!nova?.id) return;

        setMensagens((anteriores) => {
          if (anteriores.some((item) => String(item.id) === String(nova.id))) {
            return anteriores;
          }
          return [...anteriores, nova].sort((a, b) => {
            const aData = a?.criada_em || a?.criado_em || a?.created_at || 0;
            const bData = b?.criada_em || b?.criado_em || b?.created_at || 0;
            return new Date(aData).getTime() - new Date(bData).getTime();
          });
        });
      })
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "mensagens_conversa",
        filter: `conversa_id=eq.${idConversa}`
      }, (payload) => {
        const atualizada = payload?.new;
        if (!atualizada?.id) return;

        setMensagens((anteriores) =>
          anteriores.map((item) =>
            String(item.id) === String(atualizada.id) ? atualizada : item
          )
        );
      })
      .on("postgres_changes", {
        event: "DELETE",
        schema: "public",
        table: "mensagens_conversa",
        filter: `conversa_id=eq.${idConversa}`
      }, (payload) => {
        const removida = payload?.old;
        if (!removida?.id) return;

        setMensagens((anteriores) =>
          anteriores.filter((item) => String(item.id) !== String(removida.id))
        );
      })
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "conversas",
        filter: `id=eq.${idConversa}`
      }, (payload) => {
        const conversaAtualizada = payload?.new;
        if (!conversaAtualizada?.id) return;

        if (String(conversaAtualizada.status || "").toLowerCase() === "finalizada") {
          setConversaAtual((anterior) =>
            anterior
              ? { ...anterior, ...conversaAtualizada, status: "finalizada" }
              : anterior
          );
          setRecentes((anteriores) =>
            anteriores.filter((item) => String(item.id) !== String(idConversa))
          );
          setErro("Esta conversa foi finalizada.");
        } else {
          setConversaAtual((anterior) =>
            anterior ? { ...anterior, ...conversaAtualizada } : anterior
          );
        }
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          console.info("Pulsan: tempo real do chat conectado.");
        }
      });

    canalMensagensRef.current = canal;

    return () => {
      ativo = false;
      if (canalMensagensRef.current) {
        supabase.removeChannel(canalMensagensRef.current);
        canalMensagensRef.current = null;
      }
    };
  }, [conversaAtual?.id]);

  /* TECLADO / VIEWPORT — MOBILE */

  useEffect(() => {
    if (typeof window === "undefined" || !window.visualViewport) {
      return undefined;
    }

    const viewport = window.visualViewport;

    const atualizarViewport = () => {
      const diferenca = Math.max(
        0,
        window.innerHeight - viewport.height - viewport.offsetTop
      );

      const aberto = diferenca > 90;
      setTecladoAberto(aberto);
      setAlturaTeclado(aberto ? diferenca : 0);

      if (aberto) {
        requestAnimationFrame(() => {
          const container = mensagensContainerRef.current;
          if (!container) return;
          container.scrollTo({
            top: container.scrollHeight,
            behavior: "smooth"
          });
        });
      }
    };

    viewport.addEventListener("resize", atualizarViewport);
    viewport.addEventListener("scroll", atualizarViewport);
    atualizarViewport();

    return () => {
      viewport.removeEventListener("resize", atualizarViewport);
      viewport.removeEventListener("scroll", atualizarViewport);
    };
  }, []);

  /* SCROLL AUTOMÁTICO */

  useEffect(() => {
    const container = mensagensContainerRef.current;
    if (!container) return;

    requestAnimationFrame(() => {
      const destino = Math.max(
        0,
        container.scrollHeight - container.clientHeight
      );

      container.scrollTo({
        top: destino,
        behavior: "smooth"
      });
    });
  }, [mensagens, tecladoAberto]);

  /* ABRIR CONVERSA RECENTE */

  function abrirConversa(conversa) {
    if (!conversa?.id) return;

    if (String(conversa.status || "").toLowerCase() === "finalizada") {
      setErro("Esta conversa já foi finalizada e não está mais disponível para novas mensagens.");
      setRecentes((anteriores) =>
        anteriores.filter((item) => String(item.id) !== String(conversa.id))
      );
      return;
    }

    const dados = { ...conversa, id: conversa.id };
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
        item.id === conversa.id ? { ...item, mensagemNova: false } : item
      )
    );

    setNotificacoesRecentes(
      recentes.some((item) => item.id !== conversa.id && item.mensagemNova)
    );

    setConversaAtual(dados);
    setTela("chat");
    setErro("");

    localStorage.setItem("pulsanConversaAtual", JSON.stringify(dados));
    localStorage.removeItem("pulsanNomeOutraPessoa");
    localStorage.removeItem("pulsanFotoOutraPessoa");

    if (conversa.desabafo_post_id) {
      localStorage.setItem("pulsanIdDesabafoConversa", conversa.desabafo_post_id);
    }

    if (conversa.desabafo) {
      localStorage.setItem("pulsanDesabafoConversa", conversa.desabafo);
    }
  }

  /* ABRIR SOLICITAÇÃO */

  function abrirSolicitacao(pedido) {
    const vistas = JSON.parse(
      localStorage.getItem("pulsanSolicitacoesVistas") || "[]"
    );

    const id = String(pedido.id);
    if (!vistas.includes(id)) vistas.push(id);

    localStorage.setItem("pulsanSolicitacoesVistas", JSON.stringify(vistas));

    setSolicitacoes((anteriores) =>
      anteriores.map((item) =>
        item.id === pedido.id ? { ...item, foiVista: true } : item
      )
    );

    setNotificacoesSolicitacoes(
      solicitacoes.some(
        (item) => item.id !== pedido.id && !vistas.includes(String(item.id))
      )
    );

    localStorage.setItem("pulsanSolicitacaoSelecionada", JSON.stringify(pedido));

    if (typeof irPara === "function") {
      irPara("solicitacoes");
    }
  }

  /* ACEITAR SOLICITAÇÃO */

  async function aceitarSolicitacao(pedido) {
    if (!usuarioId || !pedido?.id) return;

    if (!window.confirm(
      `Deseja aceitar a solicitação de ${pedido.nome || "Pessoa anônima"}?\n\nA conversa será criada e aparecerá em Recentes.`
    )) return;

    try {
      setErro("");

      if (!pedido.desabafo_post_id) {
        throw new Error("Esta solicitação não está vinculada a um desabafo.");
      }

      const { data: meusPosts, error: erroPost } = await supabase.rpc("pulsan_meus_posts_chat", {
        p_post_ids: [pedido.desabafo_post_id]
      });

      if (erroPost) throw erroPost;

      const post = (meusPosts || []).find(
        (item) => String(item.id) === String(pedido.desabafo_post_id)
      );

      if (!post) {
        throw new Error("Somente quem publicou este desabafo pode aceitar a solicitação.");
      }

      const { data: solicitacaoAtual, error: erroSolicitacao } = await supabase
        .from("solicitacoes_chat")
        .select("id, solicitante_id, destinatario_id, desabafo_post_id, status")
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
            desabafo_post_id: aceita.desabafo_post_id,
            status: "ativa",
            iniciada_em: new Date().toISOString()
          })
          .select("*")
          .single();

        if (erroConversa) throw erroConversa;
        conversa = novaConversa;
      }

      // Notifica quem solicitou. A solicitação só chega aqui após a
      // transição protegida de "pendente" para "aceita", evitando duplicidade.
      let erroAoNotificar = null;
      const { error: erroNotificacao } = await supabase
        .from("notificacoes")
        .insert({
          usuario_id: aceita.solicitante_id,
          titulo: "Pedido de conversa aceito!",
          mensagem: "Seu pedido de conversa foi aceito. A conversa já está disponível em Recentes no Pulsan.",
          lida: false,
          enviada: false,
          data_envio: null
        });

      if (erroNotificacao) {
        erroAoNotificar = erroNotificacao;
        console.error("A conversa foi aceita, mas a notificação não pôde ser gravada:", erroNotificacao);
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
        desabafo_post_id: aceita.desabafo_post_id,
        desabafo: post.texto || pedido.desabafo || ""
      };

      localStorage.setItem("pulsanConversaAtual", JSON.stringify(dadosRecentes));
      localStorage.setItem("pulsanNomeOutraPessoa", pedido.nome || "Apoiador");
      localStorage.setItem("pulsanFotoOutraPessoa", pedido.foto || "");
      localStorage.setItem("pulsanMediaOutraPessoa", String(pedido.mediaAvaliacoes || "Novo"));
      localStorage.setItem("pulsanQuantidadeAvaliacoesOutraPessoa", String(pedido.quantidadeAvaliacoes || 0));
      localStorage.setItem("pulsanSeloOutraPessoa", pedido.textoSelo || "");
      localStorage.setItem("pulsanPapelConversa", "autor-desabafo");
      localStorage.setItem("pulsanIdDesabafoConversa", String(aceita.desabafo_post_id || ""));
      localStorage.setItem("pulsanDesabafoConversa", dadosRecentes.desabafo);

      setSolicitacoes((anteriores) =>
        anteriores.filter((item) => item.id !== pedido.id)
      );

      setNotificacoesSolicitacoes(() => {
        const restantes = solicitacoes.filter((item) => item.id !== pedido.id);
        return restantes.some((item) => !item.foiVista);
      });

      setRecentes((anteriores) => [
        dadosRecentes,
        ...anteriores.filter((item) => String(item.id) !== String(conversa.id))
      ]);

      setConversaAtual(dadosRecentes);
      setMensagens([]);
      setTela("chat");

      if (erroAoNotificar) {
        setErro("A conversa foi aceita e criada, mas não conseguimos registrar a notificação. Verifique as permissões de INSERT da tabela notificacoes no Supabase.");
      }
    } catch (erro) {
      console.error("Erro ao aceitar solicitação:", erro);
      setErro(erro?.message || "Não foi possível aceitar esta solicitação.");
    }
  }

  /* RECUSAR SOLICITAÇÃO */

  async function recusarSolicitacao(pedido) {
    if (!usuarioId || !pedido?.id) return;

    if (!window.confirm(
      `Deseja recusar a solicitação de ${pedido.nome || "Pessoa anônima"}?`
    )) return;

    try {
      setErro("");

      if (!pedido.desabafo_post_id) {
        throw new Error("Esta solicitação não está vinculada a um desabafo.");
      }

      const { data: meusPosts, error: erroPost } = await supabase.rpc("pulsan_meus_posts_chat", {
        p_post_ids: [pedido.desabafo_post_id]
      });

      if (erroPost) throw erroPost;

      const post = (meusPosts || []).find(
        (item) => String(item.id) === String(pedido.desabafo_post_id)
      );

      if (!post) {
        throw new Error("Somente quem publicou este desabafo pode recusar a solicitação.");
      }

      const { error } = await supabase
        .from("solicitacoes_chat")
        .update({ status: "recusada" })
        .eq("id", pedido.id)
        .eq("destinatario_id", usuarioId)
        .eq("status", "pendente");

      if (error) throw error;

      setSolicitacoes((anteriores) =>
        anteriores.filter((item) => item.id !== pedido.id)
      );

      setNotificacoesSolicitacoes(() => {
        const restantes = solicitacoes.filter((item) => item.id !== pedido.id);
        return restantes.some((item) => !item.foiVista);
      });
    } catch (erro) {
      console.error("Erro ao recusar solicitação:", erro);
      setErro(erro?.message || "Não foi possível recusar esta solicitação.");
    }
  }

  /* ENVIAR MENSAGEM */

  async function analisarMensagemAntesDeEnviar(texto) {
    const apiUrl =
      import.meta.env.VITE_API_URL ||
      (window.location.hostname === "localhost"
        ? "http://localhost:3001"
        : "");

    if (!apiUrl) return { permitido: true };

    try {
      const resposta = await fetch(`${apiUrl}/api/analisar-mensagem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          texto,
          usuario_id: usuarioId,
          conversa_id: conversaAtual?.id || null
        })
      });

      if (!resposta.ok) {
        console.warn("Não foi possível analisar a mensagem no servidor.");
        return { permitido: true };
      }

      const resultado = await resposta.json();

      if (
        resultado?.permitido === false ||
        resultado?.bloqueado === true ||
        resultado?.moderado === true
      ) {
        return {
          permitido: false,
          motivo: resultado?.motivo || resultado?.mensagem || "Essa mensagem não pode ser enviada."
        };
      }

      return resultado || { permitido: true };
    } catch (erro) {
      console.warn("Falha na análise da mensagem:", erro);
      return { permitido: true };
    }
  }

  async function inserirMensagemComCompatibilidade(texto) {
    return await supabase
      .from("mensagens_conversa")
      .insert({
        conversa_id: conversaAtual.id,
        remetente_id: usuarioId,
        mensagem: texto
      })
      .select("*")
      .single();
  }

  async function enviarMensagem(event) {
    if (event) event.preventDefault();

    const texto = novaMensagem.trim();

    if (
      !texto ||
      !conversaAtual?.id ||
      !usuarioId ||
      enviando
    ) return;

    try {
      setEnviando(true);
      setErro("");

      const { data: conversaVerificada, error: erroConversaVerificada } = await supabase
        .from("conversas")
        .select("id, status, solicitante_id, destinatario_id")
        .eq("id", conversaAtual.id)
        .maybeSingle();

      if (erroConversaVerificada) throw erroConversaVerificada;
      if (!conversaVerificada) throw new Error("Esta conversa não foi encontrada.");

      if (String(conversaVerificada.status || "").toLowerCase() === "finalizada") {
        setConversaAtual((anterior) =>
          anterior ? { ...anterior, status: "finalizada" } : anterior
        );
        throw new Error("Esta conversa já foi finalizada.");
      }

      const analise = await analisarMensagemAntesDeEnviar(texto);

      if (analise?.permitido === false) {
        setErro(
          analise.motivo ||
          "Essa mensagem não pode ser enviada. Tente reformular com respeito."
        );
        return;
      }

      const { data, error } = await inserirMensagemComCompatibilidade(texto);
      if (error) throw error;

      if (data) {
        setMensagens((anteriores) => {
          if (anteriores.some((item) => String(item.id) === String(data.id))) {
            return anteriores;
          }
          return [...anteriores, data];
        });
      }

      setNovaMensagem("");

      setTimeout(() => {
        inputRef.current?.focus();

        requestAnimationFrame(() => {
          const container = mensagensContainerRef.current;
          if (!container) return;
          container.scrollTo({
            top: container.scrollHeight,
            behavior: "smooth"
          });
        });
      }, 80);
    } catch (erro) {
      console.error("Erro ao enviar mensagem:", erro);
      setErro(erro?.message || "Não foi possível enviar a mensagem.");
    } finally {
      setEnviando(false);
    }
  }

  /* FINALIZAR CONVERSA / AVALIAR QUEM SOLICITOU */

  async function finalizarConversa() {
    if (finalizando || !conversaAtual?.id || !usuarioId) return;

    const souAutorDoDesabafo =
      String(conversaAtual.destinatario_id) === String(usuarioId);

    if (!souAutorDoDesabafo) {
      setErro("Somente quem publicou o desabafo pode finalizar esta conversa.");
      return;
    }

    const solicitanteId =
      conversaAtual.solicitante_id ||
      conversaAtual.outraPessoaId ||
      "";

    if (!solicitanteId) {
      setErro("Não foi possível identificar quem solicitou o chat.");
      return;
    }

    if (!window.confirm(
      "Deseja realmente finalizar esta conversa? Depois disso, não será possível enviar novas mensagens. Você poderá avaliar a pessoa na próxima etapa."
    )) return;

    try {
      setFinalizando(true);
      setErro("");

      const { data: conversaBanco, error: erroBusca } = await supabase
        .from("conversas")
        .select("id, status, destinatario_id, solicitante_id")
        .eq("id", conversaAtual.id)
        .maybeSingle();

      if (erroBusca) throw erroBusca;
      if (!conversaBanco) throw new Error("Conversa não encontrada.");

      if (String(conversaBanco.destinatario_id) !== String(usuarioId)) {
        throw new Error("Você não tem autorização para finalizar esta conversa.");
      }

      if (String(conversaBanco.status || "").toLowerCase() !== "finalizada") {
        const { data: atualizada, error: erroAtualizacao } = await supabase
          .from("conversas")
          .update({ status: "finalizada" })
          .eq("id", conversaAtual.id)
          .eq("destinatario_id", usuarioId)
          .select("id, status")
          .maybeSingle();

        if (erroAtualizacao) throw erroAtualizacao;

        if (!atualizada || String(atualizada.status || "").toLowerCase() !== "finalizada") {
          throw new Error("O banco não confirmou o encerramento da conversa.");
        }
      }

      const dadosAvaliacao = {
        ...conversaAtual,
        id: conversaAtual.id,
        ajudanteId: solicitanteId,
        avaliadoId: solicitanteId,
        ajudanteNome: conversaAtual.nome || "Apoiador",
        ajudanteFoto: conversaAtual.foto || "",
        avaliadorId: usuarioId,
        finalizacaoSolicitadaEm: new Date().toISOString(),
        status: "finalizada"
      };

      setConversaAtual((anterior) =>
        anterior ? { ...anterior, status: "finalizada" } : anterior
      );

      setRecentes((anteriores) =>
        anteriores.filter((item) => String(item.id) !== String(conversaAtual.id))
      );

      localStorage.setItem("pulsanConversaAtual", JSON.stringify(dadosAvaliacao));
      localStorage.setItem("pulsanSolicitacaoAtual", JSON.stringify({
        ...dadosAvaliacao,
        conversaId: conversaAtual.id,
        solicitante_id: solicitanteId,
        destinatario_id: usuarioId
      }));

      localStorage.setItem("pulsanAjudanteId", String(solicitanteId));
      localStorage.setItem("pulsanNomeOutraPessoa", conversaAtual.nome || "Apoiador");
      localStorage.setItem("pulsanFotoOutraPessoa", conversaAtual.foto || "");
      localStorage.setItem("pulsanPapelConversa", "autor-desabafo");
      localStorage.setItem("pulsanAvaliacaoConversaPendente", "true");
      localStorage.setItem("pulsanConversaId", String(conversaAtual.id));

      if (typeof irPara === "function") {
        irPara("avaliacao");
      } else {
        throw new Error("Não foi possível abrir a tela de avaliação.");
      }
    } catch (erroFinalizacao) {
      console.error("Erro ao finalizar conversa:", erroFinalizacao);
      setErro(erroFinalizacao?.message || "Não foi possível finalizar a conversa.");
    } finally {
      setFinalizando(false);
    }
  }

  /* VOLTAR */

  function voltarParaLista() {
    setTela("lista");
    setConversaAtual(null);
    setMensagens([]);
    setErro("");
    localStorage.removeItem("pulsanAvaliacaoConversaPendente");
    localStorage.removeItem("pulsanConversaId");
  }

  /* =========================================================
     TELA DE LISTA
  ========================================================= */

  if (tela === "lista") {
    return (
      <div className={`pulsan-conversas ${modoEscuro ? "pulsan-dark" : ""}`}>
        <style>{CSS}</style>

        <main className="pulsan-conversas-container">
          <section className="pulsan-hero-conversas">
            <div className="pulsan-hero-glow" />

            <div className="pulsan-kicker">
              PULSAN • ESPAÇO SEGURO
            </div>

            <h1>Com quem você quer conversar?</h1>

            <p>
              Escolha uma solicitação ou continue
              uma conversa que já começou.
              Aqui, cada palavra pode ser um ponto
              de apoio.
            </p>

            <div className="pulsan-floating-icons" aria-hidden="true">
              <span><Icon name="heartPulse" size={25}/></span>
              <span><Icon name="sparkles" size={22}/></span>
              <span><Icon name="heart" size={23}/></span>
            </div>
          </section>

          {erro && (
            <div className="pulsan-error">
              {erro}
            </div>
          )}

          {carregandoLista ? (
            <div className="pulsan-loading-card">
              <div className="pulsan-loader">
                <Icon name="heartPulse" size={32}/>
              </div>
              <strong>Preparando seu espaço seguro...</strong>
              <span>Estamos buscando suas conversas.</span>
            </div>
          ) : (
            <>
              <div className="pulsan-mobile-tabs" role="tablist" aria-label="Área de conversas">
                <button
                  type="button"
                  role="tab"
                  aria-selected={abaMobile === "solicitacoes"}
                  className={abaMobile === "solicitacoes" ? "ativo" : ""}
                  onClick={() => setAbaMobile("solicitacoes")}
                >
                  <Icon name="message" size={19}/>
                  <strong>Solicitações</strong>
                  <b>{solicitacoes.length}</b>
                  {notificacoesSolicitacoes && <i aria-label="Novas solicitações"/>}
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={abaMobile === "recentes"}
                  className={abaMobile === "recentes" ? "ativo" : ""}
                  onClick={() => setAbaMobile("recentes")}
                >
                  <Icon name="messages" size={19}/>
                  <strong>Recentes</strong>
                  <b>{recentes.length}</b>
                  {notificacoesRecentes && <i aria-label="Novas mensagens"/>}
                </button>
              </div>

              <div className="pulsan-conversas-grid">
                {/* SOLICITAÇÕES */}
                <section
                  className={`pulsan-section pulsan-panel pulsan-panel-request ${
                    abaMobile === "solicitacoes" ? "pulsan-mobile-active" : "pulsan-mobile-hidden"
                  }`}
                >
                  <div className="pulsan-section-title">
                    <div className="pulsan-title-with-icon">
                      <div className="pulsan-section-icon request-icon">
                        <Icon name="message" size={23}/>
                      </div>
                      <div>
                        <span className="pulsan-mini-label">AGORA</span>
                        <h2>Solicitações</h2>
                        <p>Pedidos de conversa que chegaram até você.</p>
                      </div>
                    </div>

                    <div className="pulsan-title-side">
                      {notificacoesSolicitacoes && (
                        <span className="pulsan-notification-dot" title="Novas solicitações"/>
                      )}
                      <span className="pulsan-count">{solicitacoes.length}</span>
                    </div>
                  </div>

                  {solicitacoes.length === 0 ? (
                    <div className="pulsan-empty pulsan-panel-empty">
                      <div className="pulsan-empty-icon">
                        <Icon name="sprout" size={34}/>
                      </div>
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

                          <Avatar foto={pedido.foto} nome={pedido.nome}/>

                          <div className="pulsan-card-content">
                            <div className="pulsan-card-top">
                              <strong>{pedido.nome}</strong>

                              {pedido.possuiSelo && (
                                <span
                                  className="pulsan-profile-seal"
                                  title={pedido.textoSelo || "Selo Pulsan"}
                                  aria-label={pedido.textoSelo || "Selo Pulsan"}
                                >
                                  <Icon
                                    name={pedido.tipoSelo === "psicologo" ? "brain" : "badgeCheck"}
                                    size={15}
                                  />
                                </span>
                              )}

                              {!pedido.foiVista && (
                                <span className="pulsan-new-badge">NOVO</span>
                              )}
                            </div>

                            <span className="pulsan-origin">
                              <Icon name="message" size={13}/>
                              A partir de um desabafo
                            </span>

                            {pedido.identidadeRevelada && (
                              <span className="pulsan-identity-revealed">
                                <Icon name="lockOpen" size={13}/>
                                Identidade revelada para você
                              </span>
                            )}

                            <div className="pulsan-person-meta">
                              <span>
                                <Icon name="star" size={13}/>
                                {pedido.mediaAvaliacoes || "Novo"}
                                {Number(pedido.quantidadeAvaliacoes || 0) > 0
                                  ? ` • ${pedido.quantidadeAvaliacoes} ${Number(pedido.quantidadeAvaliacoes) === 1 ? "avaliação" : "avaliações"}`
                                  : " • ainda sem avaliações"}
                              </span>

                              {pedido.possuiSelo && (
                                <span className="pulsan-meta-seal">
                                  <Icon
                                    name={pedido.tipoSelo === "psicologo" ? "brain" : "badgeCheck"}
                                    size={13}
                                  />
                                  {pedido.textoSelo}
                                </span>
                              )}
                            </div>

                            <div className="pulsan-request-desabafo">
                              <span>
                                <Icon name="message" size={13}/>
                                SEU DESABAFO
                              </span>
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
                                <Icon name="x" size={15}/>
                                Recusar
                              </button>

                              <button
                                type="button"
                                className="pulsan-request-accept"
                                onClick={() => aceitarSolicitacao(pedido)}
                              >
                                <Icon name="check" size={15}/>
                                Aceitar
                              </button>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </section>

                {/* CONVERSAS RECENTES */}
                <section
                  className={`pulsan-section pulsan-panel pulsan-panel-recent ${
                    abaMobile === "recentes" ? "pulsan-mobile-active" : "pulsan-mobile-hidden"
                  }`}
                >
                  <div className="pulsan-section-title">
                    <div className="pulsan-title-with-icon">
                      <div className="pulsan-section-icon recent-icon">
                        <Icon name="messages" size={23}/>
                      </div>
                      <div>
                        <span className="pulsan-mini-label">CONTINUE</span>
                        <h2>Conversas recentes</h2>
                        <p>Retome um espaço onde uma conversa já começou.</p>
                      </div>
                    </div>

                    <div className="pulsan-title-side">
                      {notificacoesRecentes && (
                        <span className="pulsan-notification-dot" title="Novas mensagens"/>
                      )}
                      <span className="pulsan-count">{recentes.length}</span>
                    </div>
                  </div>

                  {recentes.length === 0 ? (
                    <div className="pulsan-empty pulsan-panel-empty">
                      <div className="pulsan-empty-icon">
                        <Icon name="sparkles" size={34}/>
                      </div>
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

                          <Avatar foto={conversa.foto} nome={conversa.nome}/>

                          <div className="pulsan-card-content">
                            <div className="pulsan-card-top">
                              <strong>{conversa.nome}</strong>

                              {conversa.possuiSelo && (
                                <span
                                  className="pulsan-profile-seal"
                                  title={conversa.textoSelo || "Selo Pulsan"}
                                  aria-label={conversa.textoSelo || "Selo Pulsan"}
                                >
                                  <Icon
                                    name={conversa.tipoSelo === "psicologo" ? "brain" : "badgeCheck"}
                                    size={15}
                                  />
                                </span>
                              )}

                              {conversa.mensagemNova ? (
                                <span className="pulsan-new-badge">NOVA</span>
                              ) : (
                                <span className="pulsan-private-badge">
                                  <Icon name="lock" size={11}/>
                                  PRIVADA
                                </span>
                              )}
                            </div>

                            <div className="pulsan-person-meta recent-meta">
                              <span>
                                <Icon name="star" size={13}/>
                                {conversa.mediaAvaliacoes || "Novo"}
                                {Number(conversa.quantidadeAvaliacoes || 0) > 0
                                  ? ` • ${conversa.quantidadeAvaliacoes} ${Number(conversa.quantidadeAvaliacoes) === 1 ? "avaliação" : "avaliações"}`
                                  : ""}
                              </span>

                              {conversa.possuiSelo && (
                                <span className="pulsan-meta-seal">
                                  <Icon
                                    name={conversa.tipoSelo === "psicologo" ? "brain" : "badgeCheck"}
                                    size={13}
                                  />
                                  {conversa.textoSelo}
                                </span>
                              )}
                            </div>

                            <p>{conversa.preview}</p>

                            <span className="pulsan-card-action">
                              {conversa.mensagemNova
                                ? <>Nova mensagem <Icon name="arrowRight" size={13}/></>
                                : <>Entrar na conversa <Icon name="arrowRight" size={13}/></>}
                            </span>
                          </div>

                          <span className="pulsan-arrow">
                            <Icon name="arrowRight" size={19}/>
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </section>
              </div>

              <div className="pulsan-essence">
                <div className="pulsan-essence-icon">
                  <Icon name="heartPulse" size={23}/>
                </div>
                <div>
                  <strong>Um lugar para falar, ouvir e acolher.</strong>
                  <span>
                    No Pulsan, cada conversa respeita seu tempo,
                    sua privacidade e o direito de falar sem medo de julgamento.
                  </span>
                </div>
                <div className="pulsan-essence-symbols" aria-hidden="true">
                  <Icon name="sparkles" size={17}/>
                  <Icon name="heart" size={17}/>
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
    <div className={`pulsan-chat-page ${modoEscuro ? "pulsan-dark" : ""}`}>
      <style>{CSS}</style>

      <header className="pulsan-chat-header">
        <button
          type="button"
          className="pulsan-back"
          onClick={voltarParaLista}
          aria-label="Voltar"
        >
          <Icon name="arrowLeft" size={21}/>
        </button>

        <Avatar
          foto={localStorage.getItem("pulsanFotoOutraPessoa") || ""}
          nome={conversaAtual?.nome || "Pessoa anônima"}
          pequeno
        />

        <div className="pulsan-chat-person">
          <strong>{conversaAtual?.nome || "Pessoa anônima"}</strong>
          <span>
            <Icon name="lock" size={12}/>
            Conversa privada
          </span>
        </div>
      </header>

      <main className="pulsan-chat-main">
        <div className="pulsan-chat-security">
          <span>
            <Icon name="shieldCheck" size={23}/>
          </span>
          <div>
            <strong>Um espaço de respeito e segurança</strong>
            <p>
              Evite compartilhar informações pessoais.
              Você pode conversar sem revelar sua identidade.
            </p>
          </div>
        </div>

        {localStorage.getItem("pulsanDesabafoConversa") && (
          <div className="pulsan-desabafo-origin">
            <span>
              <Icon name="message" size={13}/>
              DESABAFO DE ORIGEM
            </span>
            <p>{localStorage.getItem("pulsanDesabafoConversa")}</p>
          </div>
        )}

        {erro && (
          <div className="pulsan-error">
            {erro}
          </div>
        )}

        <div
          ref={mensagensContainerRef}
          className="pulsan-messages"
        >
          {carregandoMensagens ? (
            <div className="pulsan-chat-empty">
              <div><Icon name="heartPulse" size={36}/></div>
              <strong>Preparando a conversa...</strong>
            </div>
          ) : mensagens.length === 0 ? (
            <div className="pulsan-chat-empty">
              <div><Icon name="sprout" size={36}/></div>
              <strong>Este é o começo da conversa</strong>
              <span>
                Uma mensagem simples pode ser o primeiro passo
                para alguém se sentir ouvido.
              </span>
            </div>
          ) : (
            mensagens.map((item, index) => {
              const remetenteId = item.remetente_id || item.remetenteId;
              const texto = item.mensagem || item.texto || "";
              const dataMensagem =
                item.criada_em ||
                item.criado_em ||
                item.created_at ||
                null;

              const minha = String(remetenteId) === String(usuarioId);

              return (
                <div
                  key={item.id || `${item.criada_em}-${index}`}
                  className={`pulsan-message-row ${minha ? "mine" : "other"}`}
                >
                  <div className="pulsan-message-bubble">
                    <span>{texto}</span>

                    {dataMensagem && (
                      <small>
                        {new Date(dataMensagem).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </small>
                    )}
                  </div>
                </div>
              );
            })
          )}

          <div ref={fimMensagensRef}/>
        </div>
      </main>

      <div
        className={`pulsan-composer-wrap ${tecladoAberto ? "pulsan-keyboard-open" : ""}`}
        style={
          tecladoAberto
            ? { bottom: `${Math.max(8, alturaTeclado + 8)}px` }
            : undefined
        }
      >
        <form className="pulsan-composer" onSubmit={enviarMensagem}>
          <div className="pulsan-composer-topline">
            <span className="pulsan-composer-heart">
              <Icon name="heart" size={13}/>
            </span>
            <span>Uma palavra de cada vez. Você está em um espaço seguro.</span>
            <span className="pulsan-composer-live">
              <i/>
              AO VIVO
            </span>
          </div>

          <div className="pulsan-composer-row">
            <input
              ref={inputRef}
              type="text"
              value={novaMensagem}
              onChange={(event) => setNovaMensagem(event.target.value)}
              placeholder="Escreva uma mensagem de apoio..."
              maxLength={2000}
              autoComplete="off"
            />

            <button
              type="submit"
              disabled={
                !novaMensagem.trim() ||
                enviando ||
                String(conversaAtual?.status || "").toLowerCase() === "finalizada"
              }
              aria-label="Enviar mensagem"
              className={novaMensagem.trim() ? "has-text" : ""}
            >
              {enviando
                ? <span className="pulsan-send-loading">…</span>
                : <Icon name="send" size={19}/>}
            </button>
          </div>
        </form>

        {String(conversaAtual?.destinatario_id) === String(usuarioId) &&
          String(conversaAtual?.status || "").toLowerCase() !== "finalizada" && (
            <button
              type="button"
              className="pulsan-btn-finalizar-chat"
              onClick={finalizarConversa}
              disabled={finalizando}
            >
              <span className="pulsan-finalizar-icon">
                <Icon name="checkCircle" size={19}/>
              </span>
              <span className="pulsan-finalizar-texto">
                <strong>{finalizando ? "Abrindo avaliação..." : "Finalizar conversa"}</strong>
                <small>
                  Avalie quem pediu o chat e ajude a reconhecer esse apoio.
                </small>
              </span>
              <span className="pulsan-finalizar-arrow">
                <Icon name="arrowRight" size={18}/>
              </span>
            </button>
          )}

        {String(conversaAtual?.status || "").toLowerCase() === "finalizada" ? (
          <div className="pulsan-helper-status">
            <span><Icon name="heart" size={15}/></span>
            <span>
              Esta conversa foi finalizada. Obrigado por fazer parte do espaço de apoio do Pulsan.
            </span>
          </div>
        ) : String(conversaAtual?.destinatario_id) !== String(usuarioId) && (
          <div className="pulsan-helper-status">
            <span><Icon name="heartPulse" size={15}/></span>
            <span>Você está aqui para ouvir, acolher e apoiar.</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ERROR BOUNDARY */

class ConversaErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { erro: null };
  }

  static getDerivedStateFromError(erro) {
    return { erro };
  }

  componentDidCatch(erro, info) {
    console.error("Erro na aba Conversas do Pulsan:", erro, info);
  }

  render() {
    if (this.state.erro) {
      return (
        <div className="pulsan-error-boundary">
          <div className="pulsan-error-boundary-card">
            <div className="pulsan-error-boundary-icon">
              <Icon name="heartPulse" size={36}/>
            </div>
            <h2>Não foi possível abrir as conversas</h2>
            <p>
              A tela encontrou um erro inesperado. Recarregue a página.
              Se continuar, abra o console do navegador para vermos o erro exato.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
            >
              Recarregar
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function Conversa(props) {
  return (
    <ConversaErrorBoundary>
      <ConversaPrincipal {...props}/>
    </ConversaErrorBoundary>
  );
}

/* AVATAR */

function Avatar({ foto, nome, pequeno = false }) {
  const letra = (nome || "P").trim().charAt(0).toUpperCase() || "P";

  return (
    <div className={`pulsan-avatar ${pequeno ? "small" : ""}`}>
      {foto ? (
        <img src={foto} alt=""/>
      ) : (
        <span>{letra}</span>
      )}
    </div>
  );
}

/* CSS — A CONTINUAÇÃO ESTÁ NA PARTE 3 */
const CSS = `
.pulsan-conversas,
.pulsan-chat-page {
  --pulsan-blue:#3A7DFF;
  --pulsan-deep:#0F2D5B;
  --pulsan-light:#EAF3FF;
  --pulsan-soft:#A8C7FF;
  --pulsan-bg:#F7FAFF;
  --pulsan-white:#FFFFFF;
  --pulsan-text-soft:#647895;
  min-height:100vh;
  background:
    radial-gradient(circle at 8% 4%,rgba(168,199,255,.35),transparent 25%),
    radial-gradient(circle at 94% 14%,rgba(58,125,255,.10),transparent 24%),
    var(--pulsan-bg);
  color:var(--pulsan-deep);
}
.pulsan-dark {
  --pulsan-bg:#09182d;
  --pulsan-white:#102744;
  --pulsan-text-soft:#a9bad2;
  color:#edf5ff;
}
.pulsan-dark .pulsan-hero-conversas,
.pulsan-dark .pulsan-conversation-card,
.pulsan-dark .pulsan-empty,
.pulsan-dark .pulsan-loading-card {
  background:#102744;
  color:#edf5ff;
  border-color:rgba(168,199,255,.15);
}
.pulsan-dark .pulsan-hero-conversas p,
.pulsan-dark .pulsan-empty span,
.pulsan-dark .pulsan-card-content p,
.pulsan-dark .pulsan-section-title p {
  color:#a9bad2;
}
.pulsan-conversas-container {
  width:min(1240px,calc(100% - 48px));
  margin:0 auto;
  padding:28px 0 100px;
}
.pulsan-hero-conversas {
  position:relative;
  overflow:hidden;
  padding:42px 46px;
  min-height:230px;
  border-radius:34px;
  background:linear-gradient(135deg,#fff 0%,#eaf3ff 100%);
  border:1px solid rgba(58,125,255,.12);
  box-shadow:0 18px 50px rgba(15,45,91,.09);
}
.pulsan-hero-glow {
  position:absolute;
  width:190px;
  height:190px;
  right:-70px;
  top:-75px;
  border-radius:50%;
  background:rgba(168,199,255,.34);
}
.pulsan-kicker,
.pulsan-mini-label {
  color:var(--pulsan-blue);
  font-size:11px;
  font-weight:900;
  letter-spacing:.12em;
}
.pulsan-hero-conversas h1 {
  position:relative;
  margin:7px 0 8px;
  font-size:clamp(30px,3.2vw,44px);
  line-height:1.1;
  letter-spacing:-.03em;
}
.pulsan-hero-conversas p {
  position:relative;
  max-width:680px;
  margin:0;
  color:#617590;
  line-height:1.6;
}
.pulsan-floating-icons {
  position:absolute;
  right:28px;
  bottom:24px;
  display:flex;
  gap:12px;
  align-items:center;
}
.pulsan-floating-icons span {
  display:inline-flex;
  align-items:center;
  justify-content:center;
  color:var(--pulsan-blue);
  animation:pulsanFloat 3.5s ease-in-out infinite;
}
.pulsan-floating-icons span:nth-child(2){animation-delay:.6s}
.pulsan-floating-icons span:nth-child(3){animation-delay:1.1s}
@keyframes pulsanFloat {
  50%{transform:translateY(-7px) rotate(4deg)}
}
.pulsan-conversas-grid {
  display:grid;
  grid-template-columns:minmax(0,1fr) minmax(0,1fr);
  gap:24px;
  margin-top:26px;
  align-items:stretch;
}
.pulsan-panel {
  position:relative;
  margin-top:0;
  min-height:430px;
  padding:25px;
  border:1px solid rgba(58,125,255,.12);
  border-radius:30px;
  background:rgba(255,255,255,.82);
  box-shadow:0 18px 45px rgba(15,45,91,.07);
  overflow:hidden;
}
.pulsan-panel::before {
  content:"";
  position:absolute;
  width:150px;
  height:150px;
  border-radius:50%;
  right:-70px;
  top:-70px;
  background:rgba(168,199,255,.18);
  pointer-events:none;
}
.pulsan-panel-request {
  background:linear-gradient(150deg,#fff 0%,#f1f7ff 100%);
}
.pulsan-panel-recent {
  background:linear-gradient(150deg,#fff 0%,#f7faff 100%);
}
.pulsan-dark .pulsan-panel {
  background:linear-gradient(150deg,#102744 0%,#0d203b 100%);
}
.pulsan-title-with-icon {
  display:flex;
  align-items:center;
  gap:13px;
  min-width:0;
}
.pulsan-section-icon {
  width:52px;
  height:52px;
  flex:0 0 52px;
  display:flex;
  align-items:center;
  justify-content:center;
  border-radius:18px;
  background:#EAF3FF;
  color:#3A7DFF;
  box-shadow:inset 0 0 0 1px rgba(58,125,255,.08);
}
.pulsan-dark .pulsan-section-icon {
  background:rgba(58,125,255,.16);
}
.pulsan-section-title>div:first-child{min-width:0}
.pulsan-section-title h2 {
  margin:3px 0 2px;
  font-size:21px;
  letter-spacing:-.02em;
}
.pulsan-section-title p {
  margin:0;
  color:var(--pulsan-text-soft);
  font-size:11px;
  line-height:1.45;
}
.pulsan-title-side {
  display:flex;
  align-items:center;
  gap:9px;
  flex-shrink:0;
}
.pulsan-notification-dot,
.pulsan-card-notification {
  display:block;
  border-radius:50%;
  background:#3A7DFF;
  box-shadow:0 0 0 4px rgba(58,125,255,.12),0 4px 12px rgba(58,125,255,.28);
}
.pulsan-notification-dot{width:10px;height:10px}
.pulsan-card-notification {
  position:absolute;
  left:10px;
  top:10px;
  width:9px;
  height:9px;
  z-index:2;
}
.pulsan-conversation-card{position:relative}
.pulsan-conversation-card.is-unread {
  border-color:rgba(58,125,255,.28);
  box-shadow:0 12px 30px rgba(58,125,255,.10);
}
.pulsan-conversation-card.is-unread .pulsan-card-content strong {
  color:var(--pulsan-deep);
}
.pulsan-panel-empty {
  min-height:255px;
  margin-top:18px;
  display:flex;
  align-items:center;
  justify-content:center;
}
.pulsan-essence-symbols {
  margin-left:auto;
  display:flex;
  gap:9px;
  align-items:center;
  color:var(--pulsan-blue);
  opacity:.7;
}
.pulsan-section{margin-top:25px}
.pulsan-section-title {
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:12px;
}
.pulsan-count {
  min-width:30px;
  height:30px;
  padding:0 8px;
  border-radius:999px;
  display:flex;
  justify-content:center;
  align-items:center;
  background:var(--pulsan-blue);
  color:#fff;
  font-size:12px;
  font-weight:900;
}
.pulsan-list {
  display:grid;
  gap:12px;
}
.pulsan-conversation-card {
  width:100%;
  border:1px solid rgba(58,125,255,.12);
  background:#fff;
  border-radius:22px;
  padding:15px;
  display:flex;
  align-items:center;
  gap:14px;
  text-align:left;
  cursor:pointer;
  color:var(--pulsan-deep);
  box-shadow:0 9px 26px rgba(15,45,91,.06);
  transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease;
  font:inherit;
}
.pulsan-conversation-card:hover {
  transform:translateY(-2px);
  border-color:rgba(58,125,255,.30);
  box-shadow:0 15px 32px rgba(15,45,91,.10);
}
.pulsan-conversation-card.request {
  background:linear-gradient(135deg,#fff,#f5f9ff);
}
.pulsan-avatar {
  width:55px;
  height:55px;
  flex:0 0 55px;
  border-radius:19px;
  overflow:hidden;
  display:flex;
  align-items:center;
  justify-content:center;
  background:linear-gradient(135deg,#eaf3ff,#a8c7ff);
  color:var(--pulsan-deep);
  font-size:21px;
  font-weight:900;
}
.pulsan-avatar.small {
  width:43px;
  height:43px;
  flex:0 0 43px;
  border-radius:15px;
  font-size:17px;
}
.pulsan-avatar img {
  width:100%;
  height:100%;
  object-fit:cover;
}
.pulsan-card-content {
  min-width:0;
  flex:1;
}
.pulsan-card-top {
  display:flex;
  align-items:center;
  gap:8px;
  min-width:0;
}
.pulsan-card-top strong {
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}
.pulsan-card-content p {
  margin:6px 0;
  color:#697c96;
  font-size:13px;
  line-height:1.45;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}
.pulsan-origin {
  display:inline-flex;
  align-items:center;
  gap:5px;
  margin-top:5px;
  color:var(--pulsan-blue);
  font-size:11px;
  font-weight:800;
}
.pulsan-new-badge,
.pulsan-private-badge {
  flex-shrink:0;
  display:inline-flex;
  align-items:center;
  gap:4px;
  padding:4px 7px;
  border-radius:999px;
  font-size:9px;
  font-weight:900;
  background:var(--pulsan-light);
  color:var(--pulsan-blue);
}
.pulsan-new-badge {
  background:var(--pulsan-blue);
  color:#fff;
}
.pulsan-profile-seal {
  display:inline-flex;
  align-items:center;
  justify-content:center;
  width:24px;
  height:24px;
  margin-left:6px;
  border-radius:999px;
  background:rgba(58,125,255,.12);
  border:1px solid rgba(58,125,255,.22);
  color:#3A7DFF;
  vertical-align:middle;
  flex:0 0 auto;
}
.pulsan-request-desabafo {
  margin-top:12px;
  padding:11px 12px;
  border-radius:14px;
  background:rgba(234,243,255,.72);
  border:1px solid rgba(168,199,255,.48);
}
.pulsan-request-desabafo>span {
  display:flex;
  align-items:center;
  gap:5px;
  margin-bottom:5px;
  color:var(--pulsan-blue);
  font-size:9px;
  font-weight:900;
  letter-spacing:.08em;
}
.pulsan-request-desabafo p {
  margin:0;
  color:var(--pulsan-deep);
  font-size:12px;
  line-height:1.5;
  display:-webkit-box;
  -webkit-line-clamp:3;
  -webkit-box-orient:vertical;
  overflow:hidden;
}
.pulsan-person-meta {
  display:flex;
  flex-wrap:wrap;
  align-items:center;
  gap:7px;
  margin:7px 0 10px;
  color:var(--pulsan-text-soft);
  font-size:11px;
  font-weight:700;
}
.pulsan-person-meta>span {
  display:inline-flex;
  align-items:center;
  gap:4px;
}
.pulsan-meta-seal {
  display:inline-flex;
  align-items:center;
  gap:4px;
  padding:4px 8px;
  border-radius:999px;
  background:#eef5ff;
  color:#315f9f;
  border:1px solid rgba(58,125,255,.14);
}
.pulsan-dark .pulsan-meta-seal {
  background:#17365f;
  color:#dbe9ff;
  border-color:rgba(168,199,255,.18);
}
.pulsan-person-meta.recent-meta {
  margin-top:4px;
  margin-bottom:7px;
}
.pulsan-request-actions {
  display:flex;
  gap:8px;
  margin-top:12px;
}
.pulsan-request-actions button {
  border:0;
  border-radius:12px;
  padding:9px 13px;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  gap:6px;
  font-size:11px;
  font-weight:900;
  cursor:pointer;
  transition:transform .18s ease,opacity .18s ease;
}
.pulsan-request-actions button:hover{transform:translateY(-1px)}
.pulsan-request-reject {
  background:rgba(15,45,91,.08);
  color:var(--pulsan-deep);
}
.pulsan-request-accept {
  background:var(--pulsan-blue);
  color:#fff;
}
.pulsan-card-action {
  display:inline-flex;
  align-items:center;
  gap:4px;
  color:var(--pulsan-blue);
  font-size:11px;
  font-weight:900;
}
.pulsan-arrow {
  color:var(--pulsan-blue);
  display:flex;
  align-items:center;
  justify-content:center;
}
.pulsan-empty,
.pulsan-loading-card {
  padding:27px 18px;
  text-align:center;
  border:1px dashed rgba(58,125,255,.24);
  border-radius:22px;
  background:rgba(255,255,255,.78);
  color:var(--pulsan-text-soft);
}
.pulsan-empty-icon,
.pulsan-loader {
  display:flex;
  align-items:center;
  justify-content:center;
  color:var(--pulsan-blue);
  margin-bottom:7px;
}
.pulsan-loader {
  animation:pulsanSpin 2.5s ease-in-out infinite;
}
@keyframes pulsanSpin {
  50%{transform:scale(1.12) rotate(5deg)}
}
.pulsan-empty strong,
.pulsan-loading-card strong {
  display:block;
  margin-bottom:5px;
  color:var(--pulsan-deep);
}
.pulsan-dark .pulsan-empty strong,
.pulsan-dark .pulsan-loading-card strong{color:#edf5ff}
.pulsan-empty span,
.pulsan-loading-card span {
  font-size:13px;
  line-height:1.5;
}
.pulsan-essence {
  display:flex;
  align-items:center;
  gap:13px;
  margin-top:25px;
  padding:17px 18px;
  border-radius:19px;
  background:rgba(234,243,255,.82);
  color:#526b89;
}
.pulsan-dark .pulsan-essence {
  background:#102744;
  color:#a9bad2;
}
.pulsan-essence-icon {
  width:42px;
  height:42px;
  flex:0 0 42px;
  display:flex;
  align-items:center;
  justify-content:center;
  border-radius:15px;
  background:#fff;
  color:var(--pulsan-blue);
}
.pulsan-essence strong {
  display:block;
  color:var(--pulsan-deep);
  font-size:12px;
  margin-bottom:3px;
}
.pulsan-dark .pulsan-essence strong{color:#edf5ff}
.pulsan-essence span {
  font-size:12px;
  line-height:1.4;
}
.pulsan-error {
  margin-top:14px;
  padding:12px 14px;
  border-radius:14px;
  background:#fff1f1;
  color:#a13b3b;
  font-size:13px;
}

/* ERROR BOUNDARY */

.pulsan-error-boundary {
  min-height:100vh;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:24px;
  background:#F7FAFF;
  color:#0F2D5B;
  font-family:Arial,sans-serif;
}
.pulsan-error-boundary-card {
  max-width:520px;
  width:100%;
  background:#fff;
  border-radius:24px;
  padding:28px;
  box-shadow:0 18px 50px rgba(15,45,91,.10);
  border:1px solid rgba(58,125,255,.12);
}
.pulsan-error-boundary-icon {
  display:flex;
  color:#3A7DFF;
  margin-bottom:12px;
}
.pulsan-error-boundary-card h2{margin:0 0 8px}
.pulsan-error-boundary-card p {
  margin:0 0 18px;
  line-height:1.5;
  color:#647895;
}
.pulsan-error-boundary-card button {
  border:0;
  border-radius:12px;
  padding:11px 18px;
  background:#3A7DFF;
  color:#fff;
  font-weight:700;
  cursor:pointer;
}

/* CHAT */

.pulsan-chat-page {
  display:flex;
  flex-direction:column;
  position:relative;
  isolation:isolate;
  overflow:hidden;
  min-height:100dvh;
  background:
    radial-gradient(circle at 8% 18%,rgba(168,199,255,.28) 0,rgba(168,199,255,0) 24%),
    radial-gradient(circle at 91% 24%,rgba(126,102,255,.14) 0,rgba(126,102,255,0) 22%),
    radial-gradient(circle at 48% 88%,rgba(92,211,177,.10) 0,rgba(92,211,177,0) 25%),
    linear-gradient(145deg,#f6f9ff 0%,#edf4ff 46%,#f8fbff 100%);
}
.pulsan-chat-page::before,
.pulsan-chat-page::after {
  content:"";
  position:fixed;
  z-index:-1;
  pointer-events:none;
  border-radius:50%;
  filter:blur(2px);
}
.pulsan-chat-page::before {
  width:330px;
  height:330px;
  top:80px;
  left:-150px;
  background:radial-gradient(circle,rgba(58,125,255,.16),transparent 68%);
  animation:pulsanBackgroundFloat 9s ease-in-out infinite;
}
.pulsan-chat-page::after {
  width:390px;
  height:390px;
  right:-190px;
  bottom:70px;
  background:radial-gradient(circle,rgba(111,91,255,.13),transparent 68%);
  animation:pulsanBackgroundFloat 11s ease-in-out infinite reverse;
}
@keyframes pulsanBackgroundFloat {
  0%,100%{transform:translate3d(0,0,0) scale(1)}
  50%{transform:translate3d(16px,-12px,0) scale(1.05)}
}
.pulsan-dark {
  background:
    radial-gradient(circle at 8% 18%,rgba(58,125,255,.16) 0,rgba(58,125,255,0) 25%),
    radial-gradient(circle at 90% 25%,rgba(123,99,255,.12) 0,rgba(123,99,255,0) 23%),
    radial-gradient(circle at 48% 90%,rgba(64,190,155,.07) 0,rgba(64,190,155,0) 26%),
    linear-gradient(145deg,#07182e 0%,#0a213d 50%,#081a31 100%);
}

/* CABEÇALHO */

.pulsan-chat-header {
  position:sticky;
  top:0;
  z-index:10;
  min-height:68px;
  display:flex;
  align-items:center;
  gap:11px;
  padding:10px max(16px,calc((100vw - 900px)/2));
  background:rgba(255,255,255,.91);
  border-bottom:1px solid rgba(58,125,255,.10);
  backdrop-filter:blur(15px);
}
.pulsan-dark .pulsan-chat-header{background:rgba(9,24,45,.92)}
.pulsan-back {
  border:0;
  background:transparent;
  color:var(--pulsan-blue);
  display:flex;
  align-items:center;
  justify-content:center;
  cursor:pointer;
  padding:5px 10px 5px 0;
}
.pulsan-chat-person {
  display:flex;
  flex-direction:column;
  min-width:0;
}
.pulsan-chat-person strong {
  font-size:15px;
  overflow:hidden;
  text-overflow:ellipsis;
  white-space:nowrap;
}
.pulsan-chat-person span {
  margin-top:2px;
  display:flex;
  align-items:center;
  gap:5px;
  color:var(--pulsan-blue);
  font-size:11px;
  font-weight:800;
}

/* ÁREA PRINCIPAL */

.pulsan-chat-main {
  width:min(900px,calc(100% - 28px));
  height:calc(100dvh - 68px);
  min-height:0;
  margin:0 auto;
  flex:1 1 auto;
  box-sizing:border-box;
  display:flex;
  flex-direction:column;
  overflow:hidden;
  padding:18px 0 175px;
}
.pulsan-chat-security {
  display:flex;
  gap:11px;
  padding:14px 16px;
  border-radius:18px;
  background:var(--pulsan-light);
  margin-bottom:13px;
}
.pulsan-chat-security>span {
  display:flex;
  flex:0 0 24px;
  justify-content:center;
  color:#3A7DFF;
}
.pulsan-chat-security strong {
  display:block;
  font-size:12px;
}
.pulsan-chat-security p {
  margin:3px 0 0;
  color:#607590;
  font-size:11px;
  line-height:1.45;
}
.pulsan-dark .pulsan-chat-security p{color:#9eb2cc}

/* DESABAFO DE ORIGEM */

.pulsan-desabafo-origin {
  margin-bottom:17px;
  padding:15px;
  border-left:4px solid var(--pulsan-blue);
  border-radius:14px;
  background:rgba(255,255,255,.80);
}
.pulsan-dark .pulsan-desabafo-origin{background:#102744}
.pulsan-desabafo-origin span {
  display:flex;
  align-items:center;
  gap:5px;
  color:var(--pulsan-blue);
  font-size:10px;
  font-weight:900;
  letter-spacing:.08em;
}
.pulsan-desabafo-origin p {
  margin:7px 0 0;
  color:#5d718d;
  font-size:13px;
  line-height:1.5;
}
.pulsan-dark .pulsan-desabafo-origin p{color:#a9bad2}

/* MENSAGENS */

.pulsan-messages {
  position:relative;
  z-index:1;
  flex:1 1 auto;
  min-height:0;
  display:flex;
  flex-direction:column;
  gap:11px;
  overflow-y:auto;
  overflow-x:hidden;
  padding:18px 14px 190px;
  margin:0 -14px;
  scroll-padding-bottom:220px;
  overscroll-behavior:contain;
  scroll-behavior:smooth;
  scrollbar-width:thin;
  scrollbar-color:rgba(58,125,255,.35) transparent;
  background:linear-gradient(180deg,rgba(255,255,255,.18),rgba(255,255,255,0));
  border-radius:28px;
}
.pulsan-dark .pulsan-messages {
  background:linear-gradient(180deg,rgba(18,48,80,.18),rgba(18,48,80,0));
}
.pulsan-messages::-webkit-scrollbar{width:6px}
.pulsan-messages::-webkit-scrollbar-track{background:transparent}
.pulsan-messages::-webkit-scrollbar-thumb {
  background:rgba(58,125,255,.28);
  border-radius:999px;
}
.pulsan-messages::-webkit-scrollbar-thumb:hover{background:rgba(58,125,255,.48)}
.pulsan-message-row {
  display:flex;
  width:100%;
  padding:0 4px;
}
.pulsan-message-row.other {
  justify-content:flex-start;
  padding-right:22%;
  padding-left:4px;
}
.pulsan-message-row.mine {
  justify-content:flex-end;
  padding-left:22%;
  padding-right:4px;
}
.pulsan-message-bubble {
  position:relative;
  max-width:min(68%,540px);
  padding:13px 16px 9px;
  border-radius:22px;
  transition:transform .18s ease,box-shadow .18s ease;
  animation:pulsanMessageIn .24s ease-out;
}
.pulsan-message-bubble:hover{transform:translateY(-1px)}
@keyframes pulsanMessageIn {
  from{opacity:0;transform:translateY(6px) scale(.985)}
  to{opacity:1;transform:translateY(0) scale(1)}
}
.pulsan-message-row.other .pulsan-message-bubble {
  background:rgba(255,255,255,.97);
  color:#0F2D5B;
  border:1px solid rgba(58,125,255,.12);
  border-bottom-left-radius:7px;
  box-shadow:0 8px 25px rgba(15,45,91,.09);
}
.pulsan-message-row.other .pulsan-message-bubble::before {
  content:"";
  position:absolute;
  left:-7px;
  bottom:0;
  width:15px;
  height:15px;
  background:#fff;
  clip-path:polygon(100% 0,100% 100%,0 100%);
  filter:drop-shadow(-1px 1px 0 rgba(58,125,255,.08));
}
.pulsan-message-row.mine .pulsan-message-bubble {
  background:linear-gradient(135deg,#3A7DFF 0%,#596FFF 55%,#7562F5 100%);
  color:#fff;
  border:0;
  border-bottom-right-radius:7px;
  box-shadow:0 10px 28px rgba(58,125,255,.25);
}
.pulsan-message-row.mine .pulsan-message-bubble::after {
  content:"";
  position:absolute;
  right:-7px;
  bottom:0;
  width:15px;
  height:15px;
  background:#685fff;
  clip-path:polygon(0 0,100% 100%,0 100%);
}
.pulsan-message-row.mine .pulsan-message-bubble span{color:#fff}
.pulsan-message-row.mine .pulsan-message-bubble small{color:rgba(255,255,255,.78)}
.pulsan-message-row.other .pulsan-message-bubble span{color:#0F2D5B}
.pulsan-message-row.other .pulsan-message-bubble small{color:#68809d}
.pulsan-dark .pulsan-message-row.other .pulsan-message-bubble {
  background:rgba(20,48,80,.98);
  color:#EAF3FF;
  border-color:rgba(168,199,255,.16);
  box-shadow:0 8px 25px rgba(0,0,0,.20);
}
.pulsan-dark .pulsan-message-row.other .pulsan-message-bubble::before{background:#143050}
.pulsan-dark .pulsan-message-row.other .pulsan-message-bubble span{color:#EAF3FF}
.pulsan-dark .pulsan-message-row.other .pulsan-message-bubble small{color:#A9BAD2}
.pulsan-message-bubble>span {
  display:block;
  font-size:13px;
  line-height:1.5;
  white-space:pre-wrap;
  word-break:break-word;
}
.pulsan-message-bubble small {
  display:block;
  margin-top:5px;
  text-align:right;
  opacity:.65;
  font-size:9px;
}
.pulsan-message-row+.pulsan-message-row{margin-top:2px}
.pulsan-message-row.mine+.pulsan-message-row.other,
.pulsan-message-row.other+.pulsan-message-row.mine{margin-top:8px}

/* ESTADO VAZIO */

.pulsan-chat-empty {
  min-height:220px;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  text-align:center;
  color:var(--pulsan-text-soft);
}
.pulsan-chat-empty>div {
  display:flex;
  align-items:center;
  justify-content:center;
  color:#3A7DFF;
  margin-bottom:10px;
}
.pulsan-chat-empty strong {
  color:var(--pulsan-deep);
  font-size:15px;
}
.pulsan-dark .pulsan-chat-empty strong{color:#edf5ff}
.pulsan-chat-empty span {
  max-width:380px;
  margin-top:5px;
  font-size:12px;
  line-height:1.5;
}

/* CAMPO DE MENSAGEM */

.pulsan-composer-wrap {
  position:fixed;
  z-index:50;
  left:50%;
  bottom:82px;
  transform:translateX(-50%);
  width:min(860px,calc(100% - 26px));
  display:flex;
  flex-direction:column;
  gap:7px;
  transition:bottom .18s ease;
  padding-bottom:env(safe-area-inset-bottom,0px);
}
.pulsan-composer {
  width:100%;
  box-sizing:border-box;
  display:flex;
  flex-direction:column;
  gap:5px;
  padding:7px 8px 8px;
  border-radius:22px;
  background:rgba(255,255,255,.96);
  border:1px solid rgba(58,125,255,.14);
  box-shadow:0 15px 40px rgba(15,45,91,.16);
  backdrop-filter:blur(16px);
}
.pulsan-dark .pulsan-composer{background:rgba(16,39,68,.97)}
.pulsan-composer-topline {
  display:flex;
  align-items:center;
  gap:6px;
  padding:2px 5px 0;
  color:#7890ad;
  font-size:9px;
  line-height:1.2;
}
.pulsan-composer-heart {
  display:flex;
  align-items:center;
  color:var(--pulsan-blue);
  animation:pulsanSpark 2.2s ease-in-out infinite;
}
.pulsan-composer-live {
  margin-left:auto;
  display:inline-flex;
  align-items:center;
  gap:5px;
  color:#35a77a;
  font-size:8px;
  font-weight:900;
  letter-spacing:.07em;
}
.pulsan-composer-live i {
  width:6px;
  height:6px;
  border-radius:50%;
  background:#35a77a;
  box-shadow:0 0 0 3px rgba(53,167,122,.12);
}
.pulsan-composer-row {
  display:flex;
  align-items:center;
  gap:8px;
}
.pulsan-composer input {
  flex:1;
  min-width:0;
  min-height:43px;
  border:0;
  outline:0;
  background:transparent;
  padding:10px 12px;
  color:var(--pulsan-deep);
  font-size:13px;
  line-height:1.35;
  box-sizing:border-box;
}
.pulsan-dark .pulsan-composer input{color:#edf5ff}
.pulsan-composer input::placeholder{color:#8b9bb0}
.pulsan-composer-row>button {
  width:45px;
  height:45px;
  flex:0 0 45px;
  border:0;
  border-radius:16px;
  background:linear-gradient(135deg,#3A7DFF,#6d9dff);
  color:#fff;
  display:flex;
  align-items:center;
  justify-content:center;
  cursor:pointer;
  transition:transform .18s,opacity .18s,box-shadow .18s;
  box-shadow:0 7px 18px rgba(58,125,255,.20);
}
.pulsan-composer-row>button.has-text {
  animation:pulsanSendReady 1.8s ease-in-out infinite;
}
.pulsan-composer-row>button:hover:not(:disabled) {
  transform:translateY(-2px) scale(1.04);
}
.pulsan-composer-row>button:disabled {
  opacity:.45;
  cursor:not-allowed;
  box-shadow:none;
}
.pulsan-send-loading{font-size:19px}
.pulsan-btn-finalizar-chat {
  width:100%;
  min-height:54px;
  display:flex;
  align-items:center;
  gap:10px;
  padding:9px 13px;
  border:1px solid rgba(58,125,255,.13);
  border-radius:18px;
  background:linear-gradient(100deg,rgba(255,255,255,.98),rgba(234,243,255,.96));
  color:var(--pulsan-deep);
  cursor:pointer;
  box-shadow:0 9px 24px rgba(15,45,91,.10);
  text-align:left;
  transition:transform .18s,box-shadow .18s,border-color .18s;
}
.pulsan-btn-finalizar-chat:hover:not(:disabled) {
  transform:translateY(-2px);
  box-shadow:0 13px 28px rgba(58,125,255,.16);
  border-color:rgba(58,125,255,.30);
}
.pulsan-btn-finalizar-chat:disabled{opacity:.65;cursor:wait}
.pulsan-dark .pulsan-btn-finalizar-chat {
  background:linear-gradient(100deg,#102744,#14345a);
  color:#edf5ff;
  border-color:rgba(168,199,255,.16);
}
.pulsan-finalizar-icon {
  width:34px;
  height:34px;
  flex:0 0 34px;
  display:grid;
  place-items:center;
  border-radius:12px;
  background:linear-gradient(135deg,#3A7DFF,#7b63ff);
  color:#fff;
  box-shadow:0 6px 14px rgba(58,125,255,.22);
}
.pulsan-finalizar-texto {
  min-width:0;
  display:flex;
  flex-direction:column;
  gap:2px;
}
.pulsan-finalizar-texto strong{font-size:11px}
.pulsan-finalizar-texto small {
  color:#7186a1;
  font-size:9px;
  line-height:1.3;
}
.pulsan-dark .pulsan-finalizar-texto small{color:#a9bad2}
.pulsan-finalizar-arrow {
  margin-left:auto;
  display:flex;
  align-items:center;
  color:var(--pulsan-blue);
}
.pulsan-helper-status {
  display:flex;
  align-items:center;
  justify-content:center;
  gap:7px;
  min-height:30px;
  border-radius:13px;
  background:rgba(234,243,255,.90);
  color:#6d829f;
  font-size:9px;
  box-shadow:0 7px 18px rgba(15,45,91,.06);
}
.pulsan-helper-status>span:first-child {
  display:inline-flex;
  align-items:center;
  color:var(--pulsan-blue);
}
.pulsan-dark .pulsan-helper-status {
  background:rgba(16,39,68,.95);
  color:#a9bad2;
}
@keyframes pulsanSpark {
  0%,100%{transform:scale(1);opacity:.75}
  50%{transform:scale(1.18);opacity:1}
}
@keyframes pulsanSendReady {
  0%,100%{box-shadow:0 7px 18px rgba(58,125,255,.20)}
  50%{box-shadow:0 7px 23px rgba(58,125,255,.42)}
}

/* ABAS CELULAR */

.pulsan-mobile-tabs{display:none}
.pulsan-mobile-hidden{display:block}
.pulsan-identity-revealed {
  display:inline-flex;
  align-items:center;
  gap:5px;
  width:fit-content;
  max-width:100%;
  margin-top:7px;
  padding:5px 8px;
  border-radius:999px;
  background:rgba(58,125,255,.08);
  border:1px solid rgba(58,125,255,.13);
  color:#3A67B8;
  font-size:9px;
  font-weight:800;
  line-height:1.2;
}
.pulsan-dark .pulsan-identity-revealed {
  background:rgba(58,125,255,.14);
  border-color:rgba(168,199,255,.15);
  color:#CFE0FF;
}

/* TABLET */

@media (min-width:701px) and (max-width:1050px) {
  .pulsan-conversas-container {
    width:min(960px,calc(100% - 32px));
    padding-top:22px;
  }
  .pulsan-hero-conversas {
    padding:34px;
    min-height:210px;
  }
  .pulsan-conversas-grid{gap:17px}
  .pulsan-panel {
    min-height:410px;
    padding:20px;
    border-radius:26px;
  }
  .pulsan-section-title h2{font-size:18px}
  .pulsan-section-title p{font-size:10px}
  .pulsan-conversation-card {
    padding:13px;
    gap:10px;
  }
  .pulsan-avatar {
    width:47px;
    height:47px;
    flex-basis:47px;
  }
}

/* CELULAR */

@media (max-width:700px) {
  .pulsan-conversas-container {
    width:min(calc(100% - 22px),900px);
    padding-top:15px;
  }
  .pulsan-mobile-tabs {
    display:grid;
    grid-template-columns:repeat(2,minmax(0,1fr));
    gap:8px;
    margin-top:15px;
    padding:5px;
    border-radius:18px;
    background:rgba(234,243,255,.72);
    border:1px solid rgba(58,125,255,.10);
    box-shadow:0 8px 24px rgba(15,45,91,.05);
  }
  .pulsan-mobile-tabs button {
    position:relative;
    min-width:0;
    min-height:50px;
    border:0;
    border-radius:14px;
    background:transparent;
    color:var(--pulsan-text-soft);
    display:flex;
    align-items:center;
    justify-content:center;
    gap:7px;
    padding:8px 10px;
    cursor:pointer;
    font:inherit;
  }
  .pulsan-mobile-tabs button>svg{flex:0 0 auto}
  .pulsan-mobile-tabs button strong {
    font-size:11px;
    white-space:nowrap;
  }
  .pulsan-mobile-tabs button b {
    min-width:22px;
    height:22px;
    display:inline-grid;
    place-items:center;
    padding:0 6px;
    border-radius:999px;
    background:rgba(255,255,255,.75);
    color:var(--pulsan-blue);
    font-size:9px;
  }
  .pulsan-mobile-tabs button i {
    position:absolute;
    top:7px;
    right:7px;
    width:7px;
    height:7px;
    border-radius:50%;
    background:#3A7DFF;
    box-shadow:0 0 0 3px rgba(58,125,255,.12);
  }
  .pulsan-mobile-tabs button.ativo {
    background:#fff;
    color:var(--pulsan-deep);
    box-shadow:0 7px 18px rgba(15,45,91,.08);
  }
  .pulsan-mobile-tabs button.ativo b{background:#EAF3FF}
  .pulsan-dark .pulsan-mobile-tabs {
    background:rgba(15,45,91,.72);
    border-color:rgba(168,199,255,.10);
  }
  .pulsan-dark .pulsan-mobile-tabs button{color:#A9BAD2}
  .pulsan-dark .pulsan-mobile-tabs button.ativo {
    background:#15365F;
    color:#F4F8FF;
  }
  .pulsan-dark .pulsan-mobile-tabs button b {
    background:rgba(58,125,255,.18);
    color:#CFE0FF;
  }
  .pulsan-conversas-grid {
    grid-template-columns:1fr;
    gap:12px;
    margin-top:12px;
  }
  .pulsan-mobile-hidden{display:none}
  .pulsan-mobile-active {
    display:block;
    animation:pulsanMobilePanelIn .22s ease both;
  }
  @keyframes pulsanMobilePanelIn {
    from{opacity:0;transform:translateY(5px)}
    to{opacity:1;transform:translateY(0)}
  }
  .pulsan-panel {
    min-height:0;
    padding:15px;
    border-radius:20px;
  }
  .pulsan-title-with-icon {
    gap:8px;
    align-items:flex-start;
  }
  .pulsan-section-icon {
    width:36px;
    height:36px;
    flex-basis:36px;
    border-radius:12px;
  }
  .pulsan-section-title {
    align-items:flex-start;
    gap:5px;
  }
  .pulsan-section-title h2{font-size:14px}
  .pulsan-section-title p{display:none}
  .pulsan-mini-label{font-size:8px}
  .pulsan-count {
    min-width:23px;
    height:23px;
    padding:0 6px;
    font-size:9px;
  }
  .pulsan-notification-dot {
    width:8px;
    height:8px;
  }
  .pulsan-panel-empty {
    min-height:245px;
    margin-top:10px;
    padding:15px 9px;
  }
  .pulsan-panel-empty strong{font-size:11px}
  .pulsan-panel-empty span{font-size:10px}
  .pulsan-hero-conversas {
    padding:23px 20px;
    border-radius:24px;
  }
  .pulsan-hero-conversas h1 {
    font-size:25px;
    padding-right:35px;
  }
  .pulsan-floating-icons {
    right:15px;
    bottom:15px;
    gap:8px;
  }
  .pulsan-floating-icons svg {
    width:18px;
    height:18px;
  }
  .pulsan-conversation-card {
    padding:11px 9px 11px 12px;
    border-radius:16px;
    gap:8px;
    align-items:flex-start;
  }
  .pulsan-avatar {
    width:34px;
    height:34px;
    flex-basis:34px;
    border-radius:11px;
    font-size:14px;
  }
  .pulsan-card-content p{max-width:100%}
  .pulsan-arrow{display:none}
  .pulsan-private-badge{display:none}
  .pulsan-new-badge {
    display:inline-flex;
    font-size:7px;
    padding:3px 5px;
  }
  .pulsan-card-notification {
    left:5px;
    top:5px;
    width:7px;
    height:7px;
  }
  .pulsan-card-content p {
    font-size:10px;
    line-height:1.35;
    white-space:normal;
    display:-webkit-box;
    -webkit-line-clamp:2;
    -webkit-box-orient:vertical;
  }
  .pulsan-origin{font-size:8px}
  .pulsan-identity-revealed {
    margin-top:6px;
    padding:5px 7px;
    font-size:8px;
  }
  .pulsan-card-action{font-size:8px}
  .pulsan-essence {
    margin-top:15px;
    padding:13px;
  }
  .pulsan-essence-symbols{display:none}
  .pulsan-chat-main {
    width:calc(100% - 18px);
    height:calc(100dvh - 68px);
    padding-top:12px;
    padding-bottom:205px;
  }
  .pulsan-messages {
    padding:16px 5px 250px;
    margin:0 -5px;
    scroll-padding-bottom:250px;
    gap:9px;
  }
  .pulsan-message-bubble {
    max-width:86%;
    padding:11px 13px 8px;
    border-radius:18px;
  }
  .pulsan-message-row.other{padding-right:8%}
  .pulsan-message-row.mine{padding-left:8%}
  .pulsan-composer-wrap {
    bottom:calc(66px + env(safe-area-inset-bottom,0px));
    width:calc(100% - 14px);
    gap:6px;
  }
  .pulsan-composer-wrap.pulsan-keyboard-open{bottom:8px}
  .pulsan-composer {
    border-radius:19px;
    padding:6px 7px 7px;
    box-shadow:0 12px 35px rgba(15,45,91,.20);
  }
  .pulsan-composer-topline{font-size:8px}
  .pulsan-composer input{font-size:16px}
  .pulsan-composer input:focus{scroll-margin-bottom:280px}
  .pulsan-composer-row>button {
    width:43px;
    height:43px;
    flex-basis:43px;
    border-radius:14px;
  }
  .pulsan-btn-finalizar-chat {
    min-height:50px;
    border-radius:16px;
    padding:8px 10px;
  }
  .pulsan-finalizar-icon {
    width:31px;
    height:31px;
    flex-basis:31px;
  }
  .pulsan-finalizar-texto strong{font-size:10px}
  .pulsan-finalizar-texto small{font-size:8px}
  .pulsan-keyboard-open .pulsan-composer-topline{display:none}
  .pulsan-keyboard-open .pulsan-composer{padding-top:5px}
  .pulsan-keyboard-open .pulsan-btn-finalizar-chat{display:none}
}

/* FUNDO SUAVE */

.pulsan-chat-main{position:relative}
.pulsan-chat-main::before {
  content:"";
  position:absolute;
  top:145px;
  right:7%;
  width:5px;
  height:5px;
  border-radius:50%;
  background:rgba(58,125,255,.2);
  box-shadow:
    22px 15px 0 rgba(58,125,255,.17),
    50px 3px 0 rgba(58,125,255,.14),
    75px 21px 0 rgba(58,125,255,.18);
  pointer-events:none;
  animation:pulsanTwinkle 4s ease-in-out infinite;
}
@keyframes pulsanTwinkle {
  0%,100%{opacity:.35;transform:translateY(0)}
  50%{opacity:.9;transform:translateY(-5px)}
}
.pulsan-dark .pulsan-chat-main::before {
  background:rgba(168,199,255,.24);
  box-shadow:
    22px 15px 0 rgba(168,199,255,.18),
    50px 3px 0 rgba(168,199,255,.14),
    75px 21px 0 rgba(168,199,255,.20);
}

/* MOVIMENTO REDUZIDO */

@media (prefers-reduced-motion:reduce) {
  .pulsan-floating-icons span,
  .pulsan-loader,
  .pulsan-composer-heart,
  .pulsan-composer-row>button.has-text,
  .pulsan-chat-page::before,
  .pulsan-chat-page::after,
  .pulsan-chat-main::before {
    animation:none!important;
  }
  .pulsan-conversation-card,
  .pulsan-btn-finalizar-chat,
  .pulsan-message-bubble {
    transition:none!important;
  }
}

/* AJUSTES FINAIS — CARTÕES DE SOLICITAÇÃO E TEMA */
.pulsan-dark .pulsan-panel-request,
.pulsan-dark .pulsan-panel-recent {
  background:linear-gradient(150deg,#102744 0%,#0d203b 100%) !important;
  color:#edf5ff;
}
.pulsan-dark .pulsan-conversation-card,
.pulsan-dark .pulsan-conversation-card.request,
.pulsan-dark .pulsan-conversation-card.is-unread,
.pulsan-dark .pulsan-conversation-card.is-viewed {
  background:linear-gradient(145deg,#15365f 0%,#102b4c 100%) !important;
  color:#edf5ff !important;
  border-color:rgba(168,199,255,.24) !important;
}
.pulsan-dark .pulsan-conversation-card .pulsan-card-content strong,
.pulsan-dark .pulsan-conversation-card .pulsan-card-content,
.pulsan-dark .pulsan-conversation-card .pulsan-card-action {
  color:#edf5ff !important;
}
.pulsan-dark .pulsan-conversation-card .pulsan-card-content p,
.pulsan-dark .pulsan-conversation-card .pulsan-person-meta {
  color:#c2d2e8 !important;
}
.pulsan-dark .pulsan-request-desabafo {
  background:rgba(7,24,46,.58) !important;
  border-color:rgba(168,199,255,.22) !important;
}
.pulsan-dark .pulsan-request-desabafo p {
  color:#edf5ff !important;
}
.pulsan-request-actions {
  display:flex !important;
  flex-wrap:wrap;
  align-items:center;
  gap:9px;
  width:100%;
}
.pulsan-request-actions button {
  min-height:40px;
  flex:0 0 auto;
  white-space:nowrap;
}
.pulsan-request-reject {
  background:rgba(15,45,91,.10);
  color:#0F2D5B;
  border:1px solid rgba(15,45,91,.12) !important;
}
.pulsan-request-accept {
  background:#3A7DFF !important;
  color:#fff !important;
  border:1px solid #3A7DFF !important;
}
.pulsan-dark .pulsan-request-reject {
  background:rgba(234,243,255,.10) !important;
  color:#edf5ff !important;
  border-color:rgba(168,199,255,.24) !important;
}
.pulsan-dark .pulsan-request-accept {
  background:#3A7DFF !important;
  color:#fff !important;
}
@media (max-width:700px) {
  .pulsan-request-actions {
    display:grid !important;
    grid-template-columns:repeat(2,minmax(0,1fr));
  }
  .pulsan-request-actions button {
    width:100%;
    min-width:0;
    min-height:42px;
    padding:10px 8px;
    font-size:12px;
  }
}


/* REFINAMENTO VISUAL DA CONVERSA */
.pulsan-chat-page {
  min-height:100dvh;
  height:100dvh;
  overflow:hidden;
  color:#0F2D5B;
}
.pulsan-chat-header {
  min-height:76px;
  padding:11px max(22px,calc((100vw - 1040px)/2));
  gap:13px;
  box-shadow:0 5px 22px rgba(15,45,91,.045);
}
.pulsan-chat-header .pulsan-back {
  width:40px;
  height:40px;
  flex:0 0 40px;
  padding:0;
  border-radius:13px;
  background:#EAF3FF;
  transition:background .18s,transform .18s;
}
.pulsan-chat-header .pulsan-back:hover {
  background:#dceaff;
  transform:translateX(-2px);
}
.pulsan-chat-header .pulsan-avatar {
  width:46px;
  height:46px;
  flex-basis:46px;
  border:2px solid #fff;
  box-shadow:0 3px 12px rgba(15,45,91,.12);
}
.pulsan-chat-person strong {
  font-size:15px;
  letter-spacing:-.01em;
}
.pulsan-chat-person span {
  font-size:10px;
  font-weight:750;
}
.pulsan-chat-main {
  width:min(820px,calc(100% - 40px));
  height:calc(100dvh - 76px);
  padding:20px 0 190px;
}
.pulsan-chat-security {
  align-items:center;
  gap:13px;
  margin:0 auto 14px;
  width:100%;
  box-sizing:border-box;
  padding:13px 17px;
  border:1px solid rgba(58,125,255,.13);
  border-radius:17px;
  background:linear-gradient(110deg,rgba(234,243,255,.96),rgba(255,255,255,.88));
  box-shadow:0 6px 20px rgba(15,45,91,.045);
}
.pulsan-chat-security>span {
  width:38px;
  height:38px;
  flex:0 0 38px;
  align-items:center;
  border-radius:13px;
  background:#fff;
  box-shadow:0 4px 12px rgba(58,125,255,.10);
}
.pulsan-chat-security strong {font-size:12px;letter-spacing:.01em}
.pulsan-chat-security p {font-size:10px;line-height:1.45}
.pulsan-desabafo-origin {
  margin:0 0 13px;
  padding:12px 15px;
  border:1px solid rgba(58,125,255,.12);
  border-left:3px solid #3A7DFF;
  border-radius:14px;
  box-shadow:0 5px 16px rgba(15,45,91,.035);
}
.pulsan-desabafo-origin p {font-size:12px}
.pulsan-messages {
  padding:20px 22px 190px;
  margin:0;
  border:1px solid rgba(58,125,255,.09);
  border-radius:23px;
  background:rgba(255,255,255,.36);
  gap:12px;
}
.pulsan-message-row.other {padding-right:18%;padding-left:2px}
.pulsan-message-row.mine {padding-left:18%;padding-right:2px}
.pulsan-message-bubble {
  max-width:min(74%,560px);
  padding:13px 16px 10px;
  border-radius:19px;
}
.pulsan-message-row.other .pulsan-message-bubble {
  background:rgba(255,255,255,.98);
  border-color:rgba(58,125,255,.10);
  box-shadow:0 5px 17px rgba(15,45,91,.065);
}
.pulsan-message-row.mine .pulsan-message-bubble {
  background:linear-gradient(135deg,#3478f6 0%,#4f75ed 100%);
  box-shadow:0 7px 19px rgba(58,125,255,.19);
}
.pulsan-message-bubble>span {font-size:13px;line-height:1.55}
.pulsan-message-bubble small {font-size:9px;margin-top:6px}
.pulsan-chat-empty {
  flex:1;
  min-height:190px;
  padding:20px;
}
.pulsan-chat-empty>div {
  width:58px;
  height:58px;
  display:grid;
  place-items:center;
  border-radius:20px;
  background:rgba(234,243,255,.85);
}
.pulsan-chat-empty strong {font-size:14px}
.pulsan-chat-empty span {font-size:11px}
.pulsan-composer-wrap {
  width:min(760px,calc(100% - 40px));
  bottom:88px;
  gap:8px;
}
.pulsan-composer {
  padding:9px 10px 10px;
  gap:6px;
  border:1px solid rgba(58,125,255,.16);
  border-radius:20px;
  box-shadow:0 12px 34px rgba(15,45,91,.13);
}
.pulsan-composer-topline {
  padding:1px 7px 0;
  font-size:9px;
}
.pulsan-composer-row {gap:9px}
.pulsan-composer input {
  min-height:46px;
  padding:11px 13px;
  border-radius:13px;
  background:rgba(234,243,255,.43);
  font-size:13px;
}
.pulsan-composer-row>button {
  width:46px;
  height:46px;
  flex-basis:46px;
  border-radius:15px;
}
.pulsan-btn-finalizar-chat {
  min-height:52px;
  padding:8px 12px;
  border-radius:16px;
  background:rgba(255,255,255,.97);
}
.pulsan-helper-status {
  min-height:29px;
  padding:0 12px;
  font-size:9px;
}
.pulsan-dark .pulsan-chat-security {
  background:linear-gradient(110deg,rgba(16,39,68,.98),rgba(18,48,80,.94));
  border-color:rgba(168,199,255,.15);
}
.pulsan-dark .pulsan-chat-security>span,
.pulsan-dark .pulsan-chat-empty>div {
  background:rgba(58,125,255,.16);
}
.pulsan-dark .pulsan-messages {
  background:rgba(8,26,49,.25);
  border-color:rgba(168,199,255,.09);
}
.pulsan-dark .pulsan-composer input {
  background:rgba(7,24,46,.38);
}
@media (min-width:701px) {
  .pulsan-chat-main {padding-bottom:205px}
  .pulsan-composer-wrap {bottom:88px}
}
@media (max-width:700px) {
  .pulsan-chat-page {height:100dvh;min-height:100dvh}
  .pulsan-chat-header {
    min-height:62px;
    padding:8px 13px;
    gap:9px;
  }
  .pulsan-chat-header .pulsan-back {
    width:35px;height:35px;flex-basis:35px;border-radius:11px;
  }
  .pulsan-chat-header .pulsan-avatar {
    width:39px;height:39px;flex-basis:39px;border-radius:13px;
  }
  .pulsan-chat-person strong {font-size:13px}
  .pulsan-chat-main {
    width:calc(100% - 18px);
    height:calc(100dvh - 62px);
    padding:12px 0 190px;
  }
  .pulsan-chat-security {
    padding:10px 11px;
    gap:9px;
    margin-bottom:10px;
    border-radius:14px;
  }
  .pulsan-chat-security>span {
    width:32px;height:32px;flex-basis:32px;border-radius:11px;
  }
  .pulsan-chat-security>span svg {width:19px;height:19px}
  .pulsan-chat-security strong {font-size:10px}
  .pulsan-chat-security p {font-size:9px}
  .pulsan-desabafo-origin {padding:10px 12px;margin-bottom:10px}
  .pulsan-desabafo-origin p {font-size:11px}
  .pulsan-messages {
    padding:13px 9px 225px;
    margin:0;
    border-radius:17px;
    gap:9px;
  }
  .pulsan-message-row.other {padding-right:9%;padding-left:1px}
  .pulsan-message-row.mine {padding-left:9%;padding-right:1px}
  .pulsan-message-bubble {
    max-width:88%;
    padding:10px 12px 8px;
    border-radius:16px;
  }
  .pulsan-message-bubble>span {font-size:13px}
  .pulsan-composer-wrap {
    bottom:calc(66px + env(safe-area-inset-bottom,0px));
    width:calc(100% - 14px);
    gap:6px;
  }
  .pulsan-composer {
    padding:6px 7px 7px;
    border-radius:17px;
  }
  .pulsan-composer input {
    min-height:42px;
    background:transparent;
    padding:9px 10px;
  }
  .pulsan-composer-row>button {
    width:42px;height:42px;flex-basis:42px;border-radius:13px;
  }
  .pulsan-btn-finalizar-chat {min-height:47px}
  .pulsan-helper-status {font-size:8px;min-height:27px}
  .pulsan-dark .pulsan-composer input {background:transparent}
}
@media (prefers-reduced-motion:reduce) {
  .pulsan-chat-header .pulsan-back {transition:none}
}

`;
