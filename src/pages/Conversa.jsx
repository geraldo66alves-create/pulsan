import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import "../tema.css";

function ConversaPrincipal({ irPara, tema = "claro" }) {
  const [tela, setTela] = useState("lista");
  const [usuario, setUsuario] = useState(null);

  // No celular, solicitações e conversas recentes funcionam como abas.
  // Em telas maiores, os dois painéis continuam visíveis lado a lado.
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
        }

        if (ativo && data?.user) {
          setUsuario((anterior) => ({
            ...(anterior || {}),
            id: data.user.id,
            email: data.user.email || anterior?.email || "",
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
          .map((item) => item.desabafo_post_id)
          .filter(Boolean);

        const idsSolicitantes = listaPedidos
          .map((item) => item.solicitante_id)
          .filter(Boolean);

        let posts = [];
        let perfisSolicitantes = [];
        let avaliacoesSolicitantes = [];

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

        // A identidade exibida na solicitação é a de quem ofereceu ajuda.
        // Os dados vêm de uma função pública controlada que retorna apenas
        // os campos de perfil necessários para a conversa.
        if (idsSolicitantes.length > 0) {
          const idsUnicos = [...new Set(idsSolicitantes)];

          const { data: perfisData, error: erroPerfis } = await supabase
            .rpc("obter_perfis_publicos_conversa", {
              p_ids: idsUnicos,
            });

          if (erroPerfis) {
            console.warn("Erro ao carregar perfis públicos dos solicitantes:", erroPerfis);
          } else {
            perfisSolicitantes = perfisData || [];
          }

          const { data: avaliacoesData, error: erroAvaliacoes } = await supabase
            .rpc("obter_avaliacoes_publicas_conversa", {
              p_ids: idsUnicos,
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

        const solicitacoesFormatadas = listaPedidos.map(
          (pedido) => {
            const post = posts.find(
              (item) => item.id === pedido.desabafo_post_id
            );

            const perfilSolicitante = perfisSolicitantes.find(
              (item) => String(item.id) === String(pedido.solicitante_id)
            );

            const psicologoAprovado =
              perfilSolicitante?.verificacao_psicologo === "aprovado" ||
              perfilSolicitante?.psicologo_parceiro === true;

            const seloExplicito =
              perfilSolicitante?.selo ||
              "";

            const avaliacaoSolicitante = avaliacoesSolicitantes.find(
              (item) => String(item.avaliado_id) === String(pedido.solicitante_id)
            );

            const mediaAvaliacoes = avaliacaoSolicitante?.media != null
              ? Number(avaliacaoSolicitante.media).toFixed(1)
              : "Novo";

            const quantidadeAvaliacoes = Number(
              avaliacaoSolicitante?.quantidade || 0
            );

            return {
              ...pedido,
              nome:
                perfilSolicitante?.nome ||
                (psicologoAprovado ? "Psicólogo parceiro" : "Apoiador"),
              foto: perfilSolicitante?.foto_url || "",
              mediaAvaliacoes,
              quantidadeAvaliacoes,
              possuiSelo: Boolean(psicologoAprovado || seloExplicito),
              tipoSelo: psicologoAprovado
                ? "psicologo"
                : seloExplicito
                ? "confianca"
                : "",
              textoSelo: psicologoAprovado
                ? "Psicólogo parceiro"
                : seloExplicito || "Apoiador de confiança",
              identidadeRevelada: true,
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
        let avaliacoesOutrasPessoas = [];

        if (idsOutrasPessoas.length > 0) {
          const idsUnicosOutras = [...new Set(idsOutrasPessoas)];

          const { data: perfisData, error: erroPerfisRecentes } = await supabase
            .rpc("obter_perfis_publicos_conversa", {
              p_ids: idsUnicosOutras,
            });

          if (erroPerfisRecentes) {
            console.warn("Erro ao carregar perfis públicos das conversas recentes:", erroPerfisRecentes);
          } else {
            perfisOutrasPessoas = perfisData || [];
          }

          const { data: avaliacoesData, error: erroAvaliacoesRecentes } = await supabase
            .rpc("obter_avaliacoes_publicas_conversa", {
              p_ids: idsUnicosOutras,
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

          const outraPessoaSelo =
            perfilOutraPessoa?.selo ||
            "";

          const avaliacaoOutraPessoa = avaliacoesOutrasPessoas.find(
            (item) => String(item.avaliado_id) === String(outraPessoaId)
          );

          const souAutorDoDesabafo =
            String(conversa.destinatario_id) === String(usuarioId);

          return {
            ...conversa,
            outraPessoaId,
            // Quem publicou o desabafo permanece anônimo para quem ofereceu ajuda.
            nome: souAutorDoDesabafo
              ? (outraPessoaPsicologo
                  ? "Psicólogo parceiro"
                  : (perfilOutraPessoa?.nome || "Pessoa anônima"))
              : "Anônimo",
            foto: souAutorDoDesabafo
              ? (perfilOutraPessoa?.foto_url || "")
              : "",
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
            desabafo_post_id: conversa.desabafo_post_id || null,
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

          // Se outra tela encontrou uma conversa ativa para um desabafo,
          // abre essa conversa diretamente sem criar uma nova solicitação.
          const abrirId = localStorage.getItem("pulsanAbrirConversaId");
          if (abrirId) {
            const conversaParaAbrir = recentesFormatadas.find(
              (item) => String(item.id) === String(abrirId)
            );

            if (conversaParaAbrir) {
              setConversaAtual(conversaParaAbrir);
              setTela("chat");
              setErro("");
              localStorage.setItem(
                "pulsanConversaAtual",
                JSON.stringify(conversaParaAbrir)
              );
              localStorage.removeItem("pulsanAbrirConversaId");
              localStorage.setItem(
                "pulsanIdDesabafoConversa",
                String(conversaParaAbrir.desabafo_post_id || "")
              );
            }
          }
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

    // =====================================================
    // TEMPO REAL — solicitações e conversas
    // =====================================================
    // Em vez de consultar o banco a cada poucos segundos,
    // o Supabase avisa quando uma solicitação/conversa mudou.
    const canal = supabase
      .channel(`pulsan-lista-${usuarioId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "solicitacoes_chat",
          filter: `destinatario_id=eq.${usuarioId}`,
        },
        () => {
          carregarLista();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "solicitacoes_chat",
          filter: `solicitante_id=eq.${usuarioId}`,
        },
        () => {
          carregarLista();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversas",
          filter: `solicitante_id=eq.${usuarioId}`,
        },
        () => {
          carregarLista();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversas",
          filter: `destinatario_id=eq.${usuarioId}`,
        },
        () => {
          carregarLista();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "mensagens_conversa",
        },
        () => {
          // Atualiza Recentes imediatamente quando qualquer mensagem
          // de uma conversa do usuário for gravada.
          carregarLista();
        }
      )
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
          .eq("conversa_id", conversaAtual.id);

        if (error) {
          throw error;
        }

        if (ativo) {
          const ordenadas = [...(data || [])].sort((a, b) => {
            const aData = a?.criada_em || a?.criado_em || a?.created_at || 0;
            const bData = b?.criada_em || b?.criado_em || b?.created_at || 0;
            return new Date(aData).getTime() - new Date(bData).getTime();
          });
          setMensagens(ordenadas);
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

    // =====================================================
    // TEMPO REAL — mensagens da conversa aberta
    // =====================================================
    // Na tela de lista não existe uma conversa selecionada ainda.
    // Portanto, não criamos um canal com conversaAtual nula.
    if (!conversaAtual?.id) {
      return () => {
        ativo = false;
      };
    }

    const idConversa = String(conversaAtual.id);

    const canal = supabase
      .channel(`pulsan-mensagens-${idConversa}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "mensagens_conversa",
          filter: `conversa_id=eq.${idConversa}`,
        },
        (payload) => {
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
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "mensagens_conversa",
          filter: `conversa_id=eq.${idConversa}`,
        },
        (payload) => {
          const atualizada = payload?.new;
          if (!atualizada?.id) return;

          setMensagens((anteriores) =>
            anteriores.map((item) =>
              String(item.id) === String(atualizada.id)
                ? atualizada
                : item
            )
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "mensagens_conversa",
          filter: `conversa_id=eq.${idConversa}`,
        },
        (payload) => {
          const removida = payload?.old;
          if (!removida?.id) return;

          setMensagens((anteriores) =>
            anteriores.filter(
              (item) => String(item.id) !== String(removida.id)
            )
          );
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "conversas",
          filter: `id=eq.${idConversa}`,
        },
        (payload) => {
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
            setMensagens((anteriores) => anteriores);
            setErro("Esta conversa foi finalizada.");
          } else {
            setConversaAtual((anterior) =>
              anterior
                ? { ...anterior, ...conversaAtualizada }
                : anterior
            );
          }
        }
      )
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

  /* =========================================================
     SCROLL AUTOMÁTICO
  ========================================================= */

  useEffect(() => {
    const container = mensagensContainerRef.current;
    if (!container) return;

    // Mantém o scroll dentro do painel de mensagens.
    // Assim o envio/recebimento não move a página inteira.
    requestAnimationFrame(() => {
      // O composer fica fixo sobre a tela. Rolamos apenas a área
      // das mensagens até o final, deixando a última mensagem
      // visível logo acima do campo de envio.
      const destino = Math.max(
        0,
        container.scrollHeight - container.clientHeight + 18
      );

      container.scrollTo({
        top: destino,
        behavior: "smooth",
      });
    });
  }, [mensagens]);

  /* =========================================================
     ABRIR CONVERSA RECENTE
  ========================================================= */

  function abrirConversa(conversa) {
    if (!conversa?.id) return;

    if (String(conversa.status || "").toLowerCase() === "finalizada") {
      setErro("Esta conversa já foi finalizada e não está mais disponível para novas mensagens.");
      setRecentes((anteriores) =>
        anteriores.filter((item) => String(item.id) !== String(conversa.id))
      );
      return;
    }

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

    localStorage.removeItem("pulsanNomeOutraPessoa");
    localStorage.removeItem("pulsanFotoOutraPessoa");

    if (conversa.desabafo_post_id) {
      localStorage.setItem(
        "pulsanIdDesabafoConversa",
        conversa.desabafo_post_id
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

      if (!pedido.desabafo_post_id) {
        throw new Error("Esta solicitação não está vinculada a um desabafo.");
      }

      // Confirma que o usuário atual é realmente o autor do desabafo.
      const { data: post, error: erroPost } = await supabase
        .from("posts_ambiente")
        .select("id, usuario_id, texto")
        .eq("id", pedido.desabafo_post_id)
        .maybeSingle();

      if (erroPost) throw erroPost;
      if (!post) throw new Error("O desabafo relacionado não foi encontrado.");

      if (String(post.usuario_id) !== String(usuarioId)) {
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
            desabafo_post_id: aceita.desabafo_post_id,
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
        desabafo_post_id: aceita.desabafo_post_id,
        desabafo: post.texto || pedido.desabafo || "",
      };

      // Contexto completo para a tela de chat.
      localStorage.setItem("pulsanConversaAtual", JSON.stringify(dadosRecentes));
      localStorage.setItem("pulsanNomeOutraPessoa", pedido.nome || "Apoiador");
      localStorage.setItem("pulsanFotoOutraPessoa", pedido.foto || "");
      localStorage.setItem("pulsanMediaOutraPessoa", String(pedido.mediaAvaliacoes || "Novo"));
      localStorage.setItem("pulsanQuantidadeAvaliacoesOutraPessoa", String(pedido.quantidadeAvaliacoes || 0));
      localStorage.setItem("pulsanSeloOutraPessoa", pedido.textoSelo || "");
      localStorage.setItem("pulsanPapelConversa", "autor-desabafo");
      localStorage.setItem("pulsanIdDesabafoConversa", String(aceita.desabafo_post_id || ""));
      localStorage.setItem("pulsanDesabafoConversa", dadosRecentes.desabafo);

      setSolicitacoes((anteriores) => anteriores.filter((item) => item.id !== pedido.id));
      setNotificacoesSolicitacoes((valorAnterior) => {
        const restantes = solicitacoes.filter(
          (item) => item.id !== pedido.id
        );
        return restantes.some((item) => !item.foiVista);
      });

      // A conversa entra em Recentes e abre imediatamente o chat.
      setRecentes((anteriores) => [
        dadosRecentes,
        ...anteriores.filter((item) => String(item.id) !== String(conversa.id)),
      ]);

      setConversaAtual(dadosRecentes);
      setMensagens([]);
      setTela("chat");
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

      if (!pedido.desabafo_post_id) {
        throw new Error("Esta solicitação não está vinculada a um desabafo.");
      }

      const { data: post, error: erroPost } = await supabase
        .from("posts_ambiente")
        .select("id, usuario_id")
        .eq("id", pedido.desabafo_post_id)
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
      setNotificacoesSolicitacoes((valorAnterior) => {
        const restantes = solicitacoes.filter(
          (item) => item.id !== pedido.id
        );
        return restantes.some((item) => !item.foiVista);
      });
    } catch (erro) {
      console.error("Erro ao recusar solicitação:", erro);
      setErro(erro?.message || "Não foi possível recusar esta solicitação.");
    }
  }

  /* =========================================================
     ENVIAR MENSAGEM
  ========================================================= */

  async function analisarMensagemAntesDeEnviar(texto) {
    const apiUrl =
      import.meta.env.VITE_API_URL ||
      (window.location.hostname === "localhost"
        ? "http://localhost:3001"
        : "");

    if (!apiUrl) {
      return { permitido: true };
    }

    try {
      const resposta = await fetch(`${apiUrl}/api/analisar-mensagem`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          texto,
          usuario_id: usuarioId,
          conversa_id: conversaAtual?.id || null,
        }),
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
          motivo:
            resultado?.motivo ||
            resultado?.mensagem ||
            "Essa mensagem não pode ser enviada.",
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
        mensagem: texto,
      })
      .select("*")
      .single();
  }

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

      const { data: conversaVerificada, error: erroConversaVerificada } = await supabase
        .from("conversas")
        .select("id, status, solicitante_id, destinatario_id")
        .eq("id", conversaAtual.id)
        .maybeSingle();

      if (erroConversaVerificada) throw erroConversaVerificada;

      if (!conversaVerificada) {
        throw new Error("Esta conversa não foi encontrada.");
      }

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

      const { data, error } =
        await inserirMensagemComCompatibilidade(texto);

      if (error) {
        throw error;
      }

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
      }, 50);
    } catch (erro) {
      console.error(
        "Erro ao enviar mensagem:",
        erro
      );

      setErro(
        erro?.message ||
          "Não foi possível enviar a mensagem."
      );
    } finally {
      setEnviando(false);
    }
  }

  /* =========================================================
     FINALIZAR CONVERSA / AVALIAR QUEM SOLICITOU

     Quem publicou o desabafo (destinatario_id) encerra a conversa.
     A pessoa que solicitou o chat (solicitante_id) é quem será
     avaliada na próxima tela e receberá os pontos após a avaliação.
  ========================================================= */

  async function finalizarConversa() {
    if (finalizando || !conversaAtual?.id || !usuarioId) return;

    const souAutorDoDesabafo =
      String(conversaAtual.destinatario_id) === String(usuarioId);

    if (!souAutorDoDesabafo) {
      setErro(
        "A finalização e a avaliação ficam disponíveis para quem publicou o desabafo."
      );
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

    if (
      !window.confirm(
        "Encerrar esta conversa?\n\n" +
        "Na próxima etapa você poderá avaliar a pessoa que pediu o chat. " +
        "Depois da avaliação, ela receberá os pontos da ajuda."
      )
    ) {
      return;
    }

    try {
      setFinalizando(true);
      setErro("");

      const dadosAvaliacao = {
        ...conversaAtual,
        id: conversaAtual.id,
        ajudanteId: solicitanteId,
        avaliadoId: solicitanteId,
        ajudanteNome: conversaAtual.nome || "Apoiador",
        ajudanteFoto: conversaAtual.foto || "",
        avaliadorId: usuarioId,
        finalizacaoSolicitadaEm: new Date().toISOString(),
      };

      localStorage.setItem(
        "pulsanConversaAtual",
        JSON.stringify(dadosAvaliacao)
      );
      localStorage.setItem(
        "pulsanSolicitacaoAtual",
        JSON.stringify({
          ...dadosAvaliacao,
          conversaId: conversaAtual.id,
          solicitante_id: solicitanteId,
          destinatario_id: usuarioId,
        })
      );
      localStorage.setItem("pulsanAjudanteId", String(solicitanteId));
      localStorage.setItem("pulsanNomeOutraPessoa", conversaAtual.nome || "Apoiador");
      localStorage.setItem("pulsanFotoOutraPessoa", conversaAtual.foto || "");
      localStorage.setItem("pulsanPapelConversa", "autor-desabafo");
      localStorage.setItem("pulsanAvaliacaoConversaPendente", "true");
      localStorage.setItem("pulsanConversaId", String(conversaAtual.id));

      // A conversa só passa para finalizada depois que a avaliação for salva.
      if (typeof irPara === "function") {
        irPara("avaliacao");
      }
    } catch (erroFinalizacao) {
      console.error("Erro ao preparar finalização da conversa:", erroFinalizacao);
      setErro(
        erroFinalizacao?.message ||
          "Não foi possível abrir a etapa de avaliação."
      );
    } finally {
      setFinalizando(false);
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
    localStorage.removeItem("pulsanAvaliacaoConversaPendente");
    localStorage.removeItem("pulsanConversaId");
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
              {/* ABAS NO CELULAR */}
              <div className="pulsan-mobile-tabs" role="tablist" aria-label="Área de conversas">
                <button
                  type="button"
                  role="tab"
                  aria-selected={abaMobile === "solicitacoes"}
                  className={abaMobile === "solicitacoes" ? "ativo" : ""}
                  onClick={() => setAbaMobile("solicitacoes")}
                >
                  <span>💬</span>
                  <strong>Solicitações</strong>
                  <b>{solicitacoes.length}</b>
                  {notificacoesSolicitacoes && <i aria-label="Novas solicitações" />}
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={abaMobile === "recentes"}
                  className={abaMobile === "recentes" ? "ativo" : ""}
                  onClick={() => setAbaMobile("recentes")}
                >
                  <span>🕊️</span>
                  <strong>Recentes</strong>
                  <b>{recentes.length}</b>
                  {notificacoesRecentes && <i aria-label="Novas mensagens" />}
                </button>
              </div>

              {/* PAINÉIS PRINCIPAIS */}
              <div className="pulsan-conversas-grid">

                {/* SOLICITAÇÕES */}
                <section
                  className={`pulsan-section pulsan-panel pulsan-panel-request ${
                    abaMobile === "solicitacoes" ? "pulsan-mobile-active" : "pulsan-mobile-hidden"
                  }`}
                >
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

                            {pedido.identidadeRevelada && (
                              <span className="pulsan-identity-revealed">
                                🔓 Identidade revelada para você
                              </span>
                            )}

                            <div className="pulsan-person-meta">
                              <span>
                                ⭐ {pedido.mediaAvaliacoes || "Novo"}
                                {Number(pedido.quantidadeAvaliacoes || 0) > 0
                                  ? ` • ${pedido.quantidadeAvaliacoes} ${Number(pedido.quantidadeAvaliacoes) === 1 ? "avaliação" : "avaliações"}`
                                  : " • ainda sem avaliações"}
                              </span>
                              {pedido.possuiSelo && (
                                <span className="pulsan-meta-seal">
                                  {pedido.tipoSelo === "psicologo" ? "🧠" : "🏅"} {pedido.textoSelo}
                                </span>
                              )}
                            </div>

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
                <section
                  className={`pulsan-section pulsan-panel pulsan-panel-recent ${
                    abaMobile === "recentes" ? "pulsan-mobile-active" : "pulsan-mobile-hidden"
                  }`}
                >
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

                            <div className="pulsan-person-meta recent-meta">
                              <span>
                                ⭐ {conversa.mediaAvaliacoes || "Novo"}
                                {Number(conversa.quantidadeAvaliacoes || 0) > 0
                                  ? ` • ${conversa.quantidadeAvaliacoes} ${Number(conversa.quantidadeAvaliacoes) === 1 ? "avaliação" : "avaliações"}`
                                  : ""}
                              </span>
                              {conversa.possuiSelo && (
                                <span className="pulsan-meta-seal">
                                  {conversa.tipoSelo === "psicologo" ? "🧠" : "🏅"} {conversa.textoSelo}
                                </span>
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
            {conversaAtual?.nome || "Pessoa anônima"}
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

        <div
          ref={mensagensContainerRef}
          className="pulsan-messages"
        >

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

                const dataMensagem =
                  item.criada_em ||
                  item.criado_em ||
                  item.created_at ||
                  null;

                const minha =
                  String(remetenteId) === String(usuarioId);

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

                      {dataMensagem && (
                        <small>
                          {new Date(
                            dataMensagem
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

      <div className="pulsan-composer-wrap">
        <form
          className="pulsan-composer"
          onSubmit={enviarMensagem}
        >
          <div className="pulsan-composer-topline">
            <span className="pulsan-composer-heart">✦</span>
            <span>Uma palavra de cada vez. Você está em um espaço seguro.</span>
            <span className="pulsan-composer-live">● AO VIVO</span>
          </div>

          <div className="pulsan-composer-row">
            <input
              ref={inputRef}
              type="text"
              value={novaMensagem}
              onChange={(event) =>
                setNovaMensagem(event.target.value)
              }
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
              {enviando ? "…" : "➤"}
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
            <span className="pulsan-finalizar-icon">✓</span>
            <span className="pulsan-finalizar-texto">
              <strong>{finalizando ? "Abrindo avaliação..." : "Finalizar conversa"}</strong>
              <small>Avalie quem pediu o chat e ajude a reconhecer esse apoio.</small>
            </span>
            <span className="pulsan-finalizar-arrow">→</span>
          </button>
        )}

        {String(conversaAtual?.status || "").toLowerCase() === "finalizada" ? (
          <div className="pulsan-helper-status">
            <span>💚</span>
            <span>Esta conversa foi finalizada. Obrigado por fazer parte do espaço de apoio do Pulsan.</span>
          </div>
        ) : String(conversaAtual?.destinatario_id) !== String(usuarioId) && (
          <div className="pulsan-helper-status">
            <span>💙</span>
            <span>Você está aqui para ouvir, acolher e apoiar.</span>
          </div>
        )}
      </div>
    </div>
  );
}

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
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "#F7FAFF", color: "#0F2D5B", fontFamily: "Arial, sans-serif" }}>
          <div style={{ maxWidth: 520, width: "100%", background: "#FFFFFF", borderRadius: 24, padding: 28, boxShadow: "0 18px 50px rgba(15,45,91,.10)", border: "1px solid rgba(58,125,255,.12)" }}>
            <div style={{ fontSize: 34, marginBottom: 12 }}>💙</div>
            <h2 style={{ margin: "0 0 8px" }}>Não foi possível abrir as conversas</h2>
            <p style={{ margin: "0 0 18px", lineHeight: 1.5, color: "#647895" }}>A tela encontrou um erro inesperado. Recarregue a página. Se continuar, abra o console do navegador para vermos o erro exato.</p>
            <button type="button" onClick={() => window.location.reload()} style={{ border: 0, borderRadius: 12, padding: "11px 18px", background: "#3A7DFF", color: "#fff", fontWeight: 700, cursor: "pointer" }}>Recarregar</button>
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
      <ConversaPrincipal {...props} />
    </ConversaErrorBoundary>
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

.pulsan-person-meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 7px;
  margin: 7px 0 10px;
  color: var(--pulsan-text-soft);
  font-size: 11px;
  font-weight: 700;
}

.pulsan-meta-seal {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 999px;
  background: #eef5ff;
  color: #315f9f;
  border: 1px solid rgba(58,125,255,.14);
}

.pulsan-dark .pulsan-meta-seal {
  background: #17365f;
  color: #dbe9ff;
  border-color: rgba(168,199,255,.18);
}

.pulsan-person-meta.recent-meta {
  margin-top: 4px;
  margin-bottom: 7px;
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
  width: min(900px, calc(100% - 28px));
  height: calc(100vh - 68px);
  min-height: 0;
  margin: 0 auto;
  flex: 1 1 auto;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 18px 0 155px;
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
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 11px;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 18px 8px 105px;
  margin: 0 -8px;
  overscroll-behavior: contain;
  scroll-behavior: smooth;
  scrollbar-width: thin;
  scrollbar-color: rgba(58,125,255,.35) transparent;
}

.pulsan-messages::-webkit-scrollbar { width: 6px; }
.pulsan-messages::-webkit-scrollbar-track { background: transparent; }
.pulsan-messages::-webkit-scrollbar-thumb { background: rgba(58,125,255,.28); border-radius: 999px; }
.pulsan-messages::-webkit-scrollbar-thumb:hover { background: rgba(58,125,255,.48); }

 .pulsan-message-row {
  display: flex;
  width: 100%;
  padding: 0 4px;
}

.pulsan-message-row.other {
  padding-right: 14%;
}

.pulsan-message-row.mine {
  justify-content: flex-end;
  padding-left: 14%;
}

.pulsan-message-row.mine {
  justify-content: flex-end;
}

.pulsan-message-bubble {
  position: relative;
  max-width: min(75%, 560px);
  padding: 12px 15px 9px;
  border-radius: 20px;
  background: #fff;
  border: 1px solid rgba(58,125,255,.10);
  box-shadow: 0 7px 20px rgba(15,45,91,.07);
  animation: pulsanMessageIn .24s ease-out;
}

@keyframes pulsanMessageIn {
  from { opacity: 0; transform: translateY(6px) scale(.985); }
  to { opacity: 1; transform: translateY(0) scale(1); }
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

  border-bottom-right-radius: 7px;
  box-shadow: 0 8px 22px rgba(58,125,255,.22);
}

.pulsan-message-row.other
.pulsan-message-bubble {
  color: #0F2D5B;
  background: #FFFFFF;
  border-bottom-left-radius: 7px;
}

.pulsan-message-row.other
.pulsan-message-bubble span {
  color: #0F2D5B;
}

.pulsan-message-row.other
.pulsan-message-bubble small {
  color: #617590;
}

.pulsan-dark
.pulsan-message-row.other
.pulsan-message-bubble {
  color: #EAF3FF;
  background: #102744;
  border-color: rgba(168,199,255,.14);
}

.pulsan-dark
.pulsan-message-row.other
.pulsan-message-bubble span {
  color: #EAF3FF;
}

.pulsan-dark
.pulsan-message-row.other
.pulsan-message-bubble small {
  color: #A9BAD2;
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

/* COMPOSER + FINALIZAÇÃO */

.pulsan-composer-wrap {
  position: fixed;
  z-index: 20;
  left: 50%;
  bottom: 84px;
  transform: translateX(-50%);
  width: min(860px, calc(100% - 26px));
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.pulsan-composer {
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 7px 8px 8px;
  border-radius: 22px;
  background: rgba(255,255,255,.96);
  border: 1px solid rgba(58,125,255,.14);
  box-shadow: 0 15px 40px rgba(15,45,91,.16);
  backdrop-filter: blur(16px);
}

.pulsan-dark .pulsan-composer {
  background: rgba(16,39,68,.97);
}

.pulsan-composer-topline {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 5px 0;
  color: #7890ad;
  font-size: 9px;
  line-height: 1.2;
}

.pulsan-composer-heart {
  color: var(--pulsan-blue);
  animation: pulsanSpark 2.2s ease-in-out infinite;
}

.pulsan-composer-live {
  margin-left: auto;
  color: #35a77a;
  font-size: 8px;
  font-weight: 900;
  letter-spacing: .07em;
}

.pulsan-composer-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pulsan-composer input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  padding: 10px 12px;
  color: var(--pulsan-deep);
  font-size: 13px;
}

.pulsan-dark .pulsan-composer input {
  color: #edf5ff;
}

.pulsan-composer input::placeholder {
  color: #8b9bb0;
}

.pulsan-composer-row > button {
  width: 45px;
  height: 45px;
  flex: 0 0 45px;
  border: 0;
  border-radius: 16px;
  background: linear-gradient(135deg, #3A7DFF, #6d9dff);
  color: white;
  font-size: 19px;
  cursor: pointer;
  transition: transform .18s, opacity .18s, box-shadow .18s;
  box-shadow: 0 7px 18px rgba(58,125,255,.20);
}

.pulsan-composer-row > button.has-text {
  animation: pulsanSendReady 1.8s ease-in-out infinite;
}

.pulsan-composer-row > button:hover:not(:disabled) {
  transform: translateY(-2px) scale(1.04);
}

.pulsan-composer-row > button:disabled {
  opacity: .45;
  cursor: not-allowed;
  box-shadow: none;
}

.pulsan-btn-finalizar-chat {
  width: 100%;
  min-height: 54px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 13px;
  border: 1px solid rgba(58,125,255,.13);
  border-radius: 18px;
  background: linear-gradient(100deg, rgba(255,255,255,.98), rgba(234,243,255,.96));
  color: var(--pulsan-deep);
  cursor: pointer;
  box-shadow: 0 9px 24px rgba(15,45,91,.10);
  text-align: left;
  transition: transform .18s, box-shadow .18s, border-color .18s;
}

.pulsan-btn-finalizar-chat:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 13px 28px rgba(58,125,255,.16);
  border-color: rgba(58,125,255,.30);
}

.pulsan-btn-finalizar-chat:disabled {
  opacity: .65;
  cursor: wait;
}

.pulsan-dark .pulsan-btn-finalizar-chat {
  background: linear-gradient(100deg, #102744, #14345a);
  color: #edf5ff;
  border-color: rgba(168,199,255,.16);
}

.pulsan-finalizar-icon {
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: linear-gradient(135deg, #3A7DFF, #7b63ff);
  color: #fff;
  font-size: 15px;
  box-shadow: 0 6px 14px rgba(58,125,255,.22);
}

.pulsan-finalizar-texto {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.pulsan-finalizar-texto strong {
  font-size: 11px;
}

.pulsan-finalizar-texto small {
  color: #7186a1;
  font-size: 9px;
  line-height: 1.3;
}

.pulsan-dark .pulsan-finalizar-texto small {
  color: #a9bad2;
}

.pulsan-finalizar-arrow {
  margin-left: auto;
  color: var(--pulsan-blue);
  font-size: 18px;
}

.pulsan-helper-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  min-height: 30px;
  border-radius: 13px;
  background: rgba(234,243,255,.90);
  color: #6d829f;
  font-size: 9px;
  box-shadow: 0 7px 18px rgba(15,45,91,.06);
}

.pulsan-dark .pulsan-helper-status {
  background: rgba(16,39,68,.95);
  color: #a9bad2;
}

@keyframes pulsanSpark {
  0%, 100% { transform: scale(1); opacity: .75; }
  50% { transform: scale(1.18); opacity: 1; }
}

@keyframes pulsanSendReady {
  0%, 100% { box-shadow: 0 7px 18px rgba(58,125,255,.20); }
  50% { box-shadow: 0 7px 23px rgba(58,125,255,.42); }
}

@media (prefers-reduced-motion: reduce) {
  .pulsan-composer-heart,
  .pulsan-composer-row > button.has-text {
    animation: none;
  }
}

/* =========================================================
   ABAS DE CONVERSAS — CELULAR
========================================================= */

.pulsan-mobile-tabs {
  display: none;
}

.pulsan-mobile-hidden {
  display: block;
}

.pulsan-identity-revealed {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  max-width: 100%;
  margin-top: 7px;
  padding: 5px 8px;
  border-radius: 999px;
  background: rgba(58,125,255,.08);
  border: 1px solid rgba(58,125,255,.13);
  color: #3A67B8;
  font-size: 9px;
  font-weight: 800;
  line-height: 1.2;
}

.pulsan-dark .pulsan-identity-revealed {
  background: rgba(58,125,255,.14);
  border-color: rgba(168,199,255,.15);
  color: #CFE0FF;
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

  .pulsan-mobile-tabs {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    margin-top: 15px;
    padding: 5px;
    border-radius: 18px;
    background: rgba(234,243,255,.72);
    border: 1px solid rgba(58,125,255,.10);
    box-shadow: 0 8px 24px rgba(15,45,91,.05);
  }

  .pulsan-mobile-tabs button {
    position: relative;
    min-width: 0;
    min-height: 50px;
    border: 0;
    border-radius: 14px;
    background: transparent;
    color: var(--pulsan-text-soft);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    padding: 8px 10px;
    cursor: pointer;
    font: inherit;
  }

  .pulsan-mobile-tabs button > span {
    font-size: 17px;
    flex: 0 0 auto;
  }

  .pulsan-mobile-tabs button strong {
    font-size: 11px;
    white-space: nowrap;
  }

  .pulsan-mobile-tabs button b {
    min-width: 22px;
    height: 22px;
    display: inline-grid;
    place-items: center;
    padding: 0 6px;
    border-radius: 999px;
    background: rgba(255,255,255,.75);
    color: var(--pulsan-blue);
    font-size: 9px;
  }

  .pulsan-mobile-tabs button i {
    position: absolute;
    top: 7px;
    right: 7px;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #3A7DFF;
    box-shadow: 0 0 0 3px rgba(58,125,255,.12);
  }

  .pulsan-mobile-tabs button.ativo {
    background: #ffffff;
    color: var(--pulsan-deep);
    box-shadow: 0 7px 18px rgba(15,45,91,.08);
  }

  .pulsan-mobile-tabs button.ativo b {
    background: #EAF3FF;
  }

  .pulsan-dark .pulsan-mobile-tabs {
    background: rgba(15,45,91,.72);
    border-color: rgba(168,199,255,.10);
  }

  .pulsan-dark .pulsan-mobile-tabs button {
    color: #A9BAD2;
  }

  .pulsan-dark .pulsan-mobile-tabs button.ativo {
    background: #15365F;
    color: #F4F8FF;
  }

  .pulsan-dark .pulsan-mobile-tabs button b {
    background: rgba(58,125,255,.18);
    color: #CFE0FF;
  }

  .pulsan-conversas-grid {
    grid-template-columns: 1fr;
    gap: 12px;
    margin-top: 12px;
  }

  .pulsan-mobile-hidden {
    display: none;
  }

  .pulsan-mobile-active {
    display: block;
    animation: pulsanMobilePanelIn .22s ease both;
  }

  @keyframes pulsanMobilePanelIn {
    from {
      opacity: 0;
      transform: translateY(5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .pulsan-panel {
    min-height: 0;
    padding: 15px;
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

  .pulsan-identity-revealed {
    margin-top: 6px;
    padding: 5px 7px;
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
    width: calc(100% - 20px);
    height: calc(100vh - 68px);
    padding-bottom: 140px;
  }

  .pulsan-messages {
    padding-bottom: 105px;
  }

  .pulsan-message-bubble {
    max-width: 84%;
  }

  .pulsan-composer-wrap {
    bottom: 78px;
    width: calc(100% - 18px);
  }

  .pulsan-composer {
    border-radius: 18px;
  }

  .pulsan-composer-topline {
    font-size: 8px;
  }

  .pulsan-composer-row > button {
    width: 43px;
    height: 43px;
    flex-basis: 43px;
    border-radius: 14px;
  }

  .pulsan-btn-finalizar-chat {
    min-height: 50px;
    border-radius: 16px;
    padding: 8px 10px;
  }

  .pulsan-finalizar-icon {
    width: 31px;
    height: 31px;
    flex-basis: 31px;
  }

  .pulsan-finalizar-texto strong {
    font-size: 10px;
  }

  .pulsan-finalizar-texto small {
    font-size: 8px;
  }
}

/* =========================================================
   PULSAN — FUNDO EMOCIONAL + BALÕES ORGANIZADOS
========================================================= */

.pulsan-chat-page {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  min-height: 100dvh;
  background:
    radial-gradient(circle at 8% 18%, rgba(168,199,255,.28) 0, rgba(168,199,255,0) 24%),
    radial-gradient(circle at 91% 24%, rgba(126,102,255,.14) 0, rgba(126,102,255,0) 22%),
    radial-gradient(circle at 48% 88%, rgba(92,211,177,.10) 0, rgba(92,211,177,0) 25%),
    linear-gradient(145deg, #f6f9ff 0%, #edf4ff 46%, #f8fbff 100%);
}

.pulsan-chat-page::before,
.pulsan-chat-page::after {
  content: "";
  position: fixed;
  z-index: -1;
  pointer-events: none;
  border-radius: 50%;
  filter: blur(2px);
}

/* brilho suave no canto superior */
.pulsan-chat-page::before {
  width: 330px;
  height: 330px;
  top: 80px;
  left: -150px;
  background: radial-gradient(circle, rgba(58,125,255,.16), transparent 68%);
  animation: pulsanBackgroundFloat 9s ease-in-out infinite;
}

/* brilho suave no canto inferior */
.pulsan-chat-page::after {
  width: 390px;
  height: 390px;
  right: -190px;
  bottom: 70px;
  background: radial-gradient(circle, rgba(111,91,255,.13), transparent 68%);
  animation: pulsanBackgroundFloat 11s ease-in-out infinite reverse;
}

@keyframes pulsanBackgroundFloat {
  0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
  50% { transform: translate3d(16px, -12px, 0) scale(1.05); }
}

/* Pequenos pontos de luz lembrando acolhimento/esperança */
.pulsan-chat-main::before {
  content: "✦   ·   ✦        ·        ✦";
  position: absolute;
  top: 145px;
  right: 7%;
  color: rgba(58,125,255,.20);
  font-size: 12px;
  letter-spacing: 18px;
  pointer-events: none;
  animation: pulsanTwinkle 4s ease-in-out infinite;
}

@keyframes pulsanTwinkle {
  0%, 100% { opacity: .35; transform: translateY(0); }
  50% { opacity: .9; transform: translateY(-5px); }
}

.pulsan-dark {
  background:
    radial-gradient(circle at 8% 18%, rgba(58,125,255,.16) 0, rgba(58,125,255,0) 25%),
    radial-gradient(circle at 90% 25%, rgba(123,99,255,.12) 0, rgba(123,99,255,0) 23%),
    radial-gradient(circle at 48% 90%, rgba(64,190,155,.07) 0, rgba(64,190,155,0) 26%),
    linear-gradient(145deg, #07182e 0%, #0a213d 50%, #081a31 100%);
}

.pulsan-dark .pulsan-chat-main::before {
  color: rgba(168,199,255,.24);
}

/* Área das mensagens como um pequeno espaço próprio */
.pulsan-messages {
  position: relative;
  z-index: 1;
  background:
    linear-gradient(180deg, rgba(255,255,255,.18), rgba(255,255,255,0));
  border-radius: 28px;
  padding: 18px 14px 190px;
  margin: 0 -14px;
}

.pulsan-dark .pulsan-messages {
  background: linear-gradient(180deg, rgba(18,48,80,.18), rgba(18,48,80,0));
}

/* QUEM RECEBE: sempre à esquerda */
.pulsan-message-row.other {
  justify-content: flex-start;
  padding-right: 22%;
  padding-left: 4px;
}

/* QUEM ENVIA: sempre à direita */
.pulsan-message-row.mine {
  justify-content: flex-end;
  padding-left: 22%;
  padding-right: 4px;
}

.pulsan-message-bubble {
  max-width: min(68%, 540px);
  position: relative;
  border-radius: 22px;
  padding: 13px 16px 9px;
  transition: transform .18s ease, box-shadow .18s ease;
}

.pulsan-message-bubble:hover {
  transform: translateY(-1px);
}

/* Balão recebido */
.pulsan-message-row.other .pulsan-message-bubble {
  background: rgba(255,255,255,.97);
  color: #0F2D5B;
  border: 1px solid rgba(58,125,255,.12);
  border-bottom-left-radius: 7px;
  box-shadow: 0 8px 25px rgba(15,45,91,.09);
}

/* pequeno detalhe visual do balão recebido */
.pulsan-message-row.other .pulsan-message-bubble::before {
  content: "";
  position: absolute;
  left: -7px;
  bottom: 0;
  width: 15px;
  height: 15px;
  background: #fff;
  clip-path: polygon(100% 0, 100% 100%, 0 100%);
  filter: drop-shadow(-1px 1px 0 rgba(58,125,255,.08));
}

/* Balão enviado */
.pulsan-message-row.mine .pulsan-message-bubble {
  background: linear-gradient(135deg, #3A7DFF 0%, #596FFF 55%, #7562F5 100%);
  color: #fff;
  border: 0;
  border-bottom-right-radius: 7px;
  box-shadow: 0 10px 28px rgba(58,125,255,.25);
}

.pulsan-message-row.mine .pulsan-message-bubble::after {
  content: "";
  position: absolute;
  right: -7px;
  bottom: 0;
  width: 15px;
  height: 15px;
  background: #685fff;
  clip-path: polygon(0 0, 100% 100%, 0 100%);
}

.pulsan-message-row.mine .pulsan-message-bubble span {
  color: #fff;
}

.pulsan-message-row.mine .pulsan-message-bubble small {
  color: rgba(255,255,255,.78);
}

.pulsan-message-row.other .pulsan-message-bubble span {
  color: #0F2D5B;
}

.pulsan-message-row.other .pulsan-message-bubble small {
  color: #68809d;
}

/* No escuro, o balão recebido continua claramente separado */
.pulsan-dark .pulsan-message-row.other .pulsan-message-bubble {
  background: rgba(20,48,80,.98);
  color: #EAF3FF;
  border-color: rgba(168,199,255,.16);
  box-shadow: 0 8px 25px rgba(0,0,0,.20);
}

.pulsan-dark .pulsan-message-row.other .pulsan-message-bubble::before {
  background: #143050;
}

.pulsan-dark .pulsan-message-row.other .pulsan-message-bubble span {
  color: #EAF3FF;
}

.pulsan-dark .pulsan-message-row.other .pulsan-message-bubble small {
  color: #A9BAD2;
}

/* separação visual entre blocos de mensagens */
.pulsan-message-row + .pulsan-message-row {
  margin-top: 2px;
}

/* Quando a pessoa troca de lado, cria uma pausa maior */
.pulsan-message-row.mine + .pulsan-message-row.other,
.pulsan-message-row.other + .pulsan-message-row.mine {
  margin-top: 8px;
}

@media (max-width: 680px) {
  .pulsan-message-row.other {
    padding-right: 12%;
  }

  .pulsan-message-row.mine {
    padding-left: 12%;
  }

  .pulsan-message-bubble {
    max-width: 78%;
  }
}

`;