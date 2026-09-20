import React, { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

function Ambiente({ irPara, tema = "claro" }) {
  // O tema é controlado centralmente pelo App.jsx e alterado pelo Perfil.
  const modoEscuro = tema === "escuro";

  const [desabafos, setDesabafos] = useState([]);
  const [carregandoDesabafos, setCarregandoDesabafos] =
    useState(true);

  const [comentariosAbertos, setComentariosAbertos] =
    useState(null);

  const [aba, setAba] = useState("feed");

  const [comentario, setComentario] = useState("");
  const [enviandoComentario, setEnviandoComentario] =
    useState(false);

  const [notificacoes, setNotificacoes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("pulsanNotificacoes") || "[]");
    } catch (erro) {
      return [];
    }
  });

  async function deletarDesabafo(id) {
    const confirmar = window.confirm("Deseja realmente deletar este desabafo?");
    if (!confirmar) return;

    const { error } = await supabase
      .from("posts_ambiente")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Erro ao deletar desabafo:", error);
      alert("Não foi possível deletar o desabafo.");
      return;
    }

    setDesabafos((atual) => atual.filter((item) => item.id !== id));
  }

  async function denunciarDesabafo(desabafo) {
    const motivo = window.prompt(
      "Escolha o motivo da denúncia:\n1 - Ofensa ou discurso de ódio\n2 - Bullying ou assédio\n3 - Conteúdo inadequado\n4 - Ameaça ou risco\n5 - Outro",
      "1"
    );

    if (!motivo) return;

    const descricao = window.prompt(
      "Se quiser, explique melhor a denúncia (opcional):"
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Faça login para denunciar.");
      return;
    }

    const { error } = await supabase.from("denuncias").insert([{
      usuario_id: user.id,
      desabafo_id: desabafo.id,
      motivo,
      descricao: descricao || null,
      status: "pendente"
    }]);

    if (error) {
      console.error("Erro ao denunciar desabafo:", error);
      alert("Não foi possível enviar a denúncia.");
      return;
    }

    alert("Denúncia enviada. Obrigado por ajudar a manter o ambiente seguro.");
  }

  // =====================================================
  // USUÁRIO
  // =====================================================

  const [usuario, setUsuario] = useState({});

  useEffect(() => {
    async function carregarUsuario() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUsuario(user);
      } else {
        try {
          const usuarioLocal = JSON.parse(
            localStorage.getItem("usuarioLogado") ||
              localStorage.getItem("pulsanUsuarioAtual") ||
              "{}"
          );

          setUsuario(usuarioLocal || {});
        } catch (erro) {
          setUsuario({});
        }
      }
    }

    carregarUsuario();
  }, []);

  const usuarioId =
    usuario.id ||
    usuario.email ||
    "usuario";

  const nomeUsuario =
    usuario.nome ||
    usuario.name ||
    usuario.user_metadata?.nome ||
    "Usuário";

  function usuarioAuthId() {
    return usuario.id || null;
  }

  // =====================================================
  // TEMPO RELATIVO COM ATUALIZAÇÃO AUTOMÁTICA
  // =====================================================

  const [tempoAtual, setTempoAtual] = useState(new Date());

  useEffect(() => {
    const intervalo = setInterval(() => {
      setTempoAtual(new Date());
    }, 30000); // Atualiza a cada 30 segundos

    return () => clearInterval(intervalo);
  }, []);

  function formatarTempoRelativo(dataISO) {
    if (!dataISO) return "Agora";

    const dataObj = new Date(dataISO);
    if (Number.isNaN(dataObj.getTime())) return "Agora";

    const diffMs = tempoAtual - dataObj;
    const diffSeg = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSeg / 60);
    const diffHora = Math.floor(diffMin / 60);
    const diffDia = Math.floor(diffHora / 24);

    if (diffSeg < 60) return "Agora";
    if (diffMin < 1) return "Agora";
    if (diffMin === 1) return "Há 1 minuto";
    if (diffMin < 60) return `Há ${diffMin} minutos`;
    if (diffHora === 1) return "Há 1 hora";
    if (diffHora < 24) return `Há ${diffHora} horas`;
    if (diffDia === 1) return "Ontem";
    if (diffDia < 7) return `Há ${diffDia} dias`;

    return dataObj.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
    }).replace(".", "");
  }

  // =====================================================
  // CARREGAR DESABAFOS E COMENTÁRIOS COM REALTIME
  // =====================================================

  const montadoRef = useRef(false);

  useEffect(() => {
    // React StrictMode executa o efeito de montagem duas vezes em desenvolvimento.
    // Por isso a referência precisa voltar para true sempre que o efeito montar.
    montadoRef.current = true;

    return () => {
      montadoRef.current = false;
    };
  }, []);

  const carregarDesabafos = useCallback(async () => {
    if (!montadoRef.current) return;

    setCarregandoDesabafos(true);

    try {
      const { data, error } = await supabase
        .from("posts_ambiente")
        .select("*")
        .order("criado_em", {
          ascending: false,
        });

      if (error) {
        console.error(
          "Erro ao carregar desabafos:",
          error
        );

        if (montadoRef.current) {
          setDesabafos([]);
        }

        return;
      }

      const postsComComentarios = await Promise.all(
        (data || []).map(async (post) => {
          const {
            data: comentariosBanco,
            error: erroComentarios,
          } = await supabase
            .from("comentarios_ambiente")
            .select("*")
            .eq("post_id", post.id)
            .order("criado_em", {
              ascending: true,
            });

          if (erroComentarios) {
            console.error(
              "Erro ao carregar comentários do desabafo:",
              post.id,
              erroComentarios
            );
          }

          return {
            ...post,
            usuarioId: post.usuario_id,
            nomeUsuario:
              post.nome_usuario ||
              "Usuário anônimo",
            fotoUsuario:
              post.foto_usuario || "",
            texto: post.texto,
            apoiadores: Array.isArray(post.apoiadores)
              ? post.apoiadores
              : [],
            comentarios: (comentariosBanco || []).map(
              (comentarioBanco) => ({
                id: comentarioBanco.id,
                usuarioId:
                  comentarioBanco.usuario_id,
                nome: "Anônimo",
                texto: comentarioBanco.texto,
                data: comentarioBanco.criado_em,
              })
            ),
          };
        })
      );

      if (montadoRef.current) {
        setDesabafos(postsComComentarios);
      }
    } catch (erro) {
      console.error(
        "Erro inesperado ao carregar o Ambiente:",
        erro
      );

      if (montadoRef.current) {
        setDesabafos([]);
      }
    } finally {
      if (montadoRef.current) {
        setCarregandoDesabafos(false);
      }
    }
  }, []);
  // Setup do Realtime para os desabafos
  useEffect(() => {
    if (!usuarioId) return;

    // Disparo inicial
    carregarDesabafos();

    // Aguarda que o Realtime esteja autenticado
    const sessao = JSON.parse(localStorage.getItem("pulsanSessao") || "{}");
    if (sessao.session?.access_token) {
      supabase.realtime.setAuth(sessao.session.access_token);
    }

    // Débounce para evitar múltiplas recargas simultâneas
    let timeoutAtualizacao;
    function agendarAtualizacao() {
      clearTimeout(timeoutAtualizacao);
      timeoutAtualizacao = setTimeout(() => {
        if (montadoRef.current) carregarDesabafos();
      }, 400);
    }

    // Canal 1: Novos desabafos inseridos
    const canalNovoPost = supabase
      .channel("ambiente-novo-post")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "posts_ambiente",
        },
        () => {
          agendarAtualizacao();
        }
      )
      .subscribe();

    // Canal 2: Desabafos atualizados (apoios, exclusões)
    const canalAtualizacaoPost = supabase
      .channel("ambiente-atualizacao-post")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "posts_ambiente",
        },
        () => {
          agendarAtualizacao();
        }
      )
      .subscribe();

    // Canal 3: Novos comentários
    const canalNovoComentario = supabase
      .channel("ambiente-novo-comentario")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comentarios_ambiente",
        },
        () => {
          agendarAtualizacao();
        }
      )
      .subscribe();

    // Cleanup
    return () => {
      clearTimeout(timeoutAtualizacao);
      supabase.removeChannel(canalNovoPost);
      supabase.removeChannel(canalAtualizacaoPost);
      supabase.removeChannel(canalNovoComentario);
    };
  }, [usuarioId, carregarDesabafos]);

  useEffect(() => {
    localStorage.setItem("pulsanNotificacoes", JSON.stringify(notificacoes));
  }, [notificacoes]);

  function notificarNovoComentario(post, textoComentario) {
    const souDono = String(post.usuario_id || post.usuarioId) === String(usuarioId);
    if (!souDono) return;

    const novaNotificacao = {
      id: Date.now(),
      tipo: "comentario",
      mensagem: "Alguém comentou no seu desabafo.",
      texto: textoComentario,
      postId: post.id,
      data: new Date().toISOString(),
      lida: false,
    };

    setNotificacoes((lista) => [novaNotificacao, ...lista]);

    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Novo comentário no Pulsan", {
        body: "Alguém comentou no seu desabafo.",
      });
    }
  }

  // =====================================================
  // SEQUÊNCIA DE APOIO
  // =====================================================

  function registrarApoioDiario() {
    const hoje = new Date()
      .toISOString()
      .split("T")[0];

    let salvo = {};

    try {
      salvo = JSON.parse(
        localStorage.getItem(
          "pulsanSequenciaApoio"
        ) || "{}"
      );
    } catch (erro) {
      salvo = {};
    }

    if (salvo.ultimoDia === hoje) {
      return;
    }

    const ontem = new Date();
    ontem.setDate(ontem.getDate() - 1);

    const dataOntem = ontem
      .toISOString()
      .split("T")[0];

    const sequencia =
      salvo.ultimoDia === dataOntem
        ? (salvo.sequencia || 0) + 1
        : 1;

    localStorage.setItem(
      "pulsanSequenciaApoio",
      JSON.stringify({
        sequencia,
        ultimoDia: hoje,
      })
    );
  }

  function obterSequenciaApoio() {
    try {
      const dados = JSON.parse(
        localStorage.getItem(
          "pulsanSequenciaApoio"
        ) || "{}"
      );

      return Number(dados.sequencia) || 0;
    } catch (erro) {
      return 0;
    }
  }

  async function compartilharSequenciaApoio() {
    const dias = obterSequenciaApoio();
    const mensagem = `Já estou há ${dias} dias espalhando apoio no Pulsan 💙. Você também pode fazer a diferença!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Minha sequência de apoio no Pulsan",
          text: mensagem,
          url: window.location.href,
        });
      } catch (erro) {
        if (erro.name !== "AbortError") console.error(erro);
      }
    } else {
      await navigator.clipboard.writeText(mensagem);
      alert("Mensagem copiada. Você pode compartilhar nas suas redes sociais.");
    }
  }

  // =====================================================
  // APOIAR
  // =====================================================

  async function apoiar(id) {
    const idUsuario = usuarioAuthId();

    if (!idUsuario) {
      alert("Entre na sua conta para apoiar um desabafo.");
      return;
    }

    const post = desabafos.find(
      (item) => item.id === id
    );

    if (!post) {
      return;
    }

    const { data: novosApoiadores, error } = await supabase.rpc(
      "alternar_apoio",
      {
        p_post_id: id,
      }
    );

    if (error) {
      console.error(
        "Erro ao registrar apoio:",
        error
      );

      alert(
        "Não foi possível registrar o apoio."
      );

      return;
    }

    const apoiadoresAtualizados = Array.isArray(
      novosApoiadores
    )
      ? novosApoiadores
      : [];

    setDesabafos((listaAtual) =>
      listaAtual.map((item) =>
        item.id === id
          ? {
              ...item,
              apoiadores: apoiadoresAtualizados,
            }
          : item
      )
    );

    registrarApoioDiario();
  }

  // =====================================================
  // COMENTAR
  // =====================================================

  async function enviarComentario(id) {
    if (!comentario.trim()) {
      return;
    }

    const idUsuario = usuarioAuthId();

    if (!idUsuario) {
      alert(
        "Entre na sua conta para comentar."
      );

      return;
    }

    setEnviandoComentario(true);

    const textoComentario =
      comentario.trim();

    const { data, error } = await supabase
      .from("comentarios_ambiente")
      .insert({
        post_id: id,
        usuario_id: idUsuario,
        texto: textoComentario,
      })
      .select()
      .single();

    if (error) {
      console.error(
        "Erro ao enviar comentário:",
        error
      );

      alert(
        "Não foi possível enviar o comentário."
      );

      setEnviandoComentario(false);
      return;
    }

    setDesabafos((listaAtual) =>
      listaAtual.map((item) =>
        item.id === id
          ? {
              ...item,
              comentarios: [
                ...(Array.isArray(
                  item.comentarios
                )
                  ? item.comentarios
                  : []),
                {
                  id: data.id,
                  usuarioId:
                    data.usuario_id,
                  nome: "Anônimo",
                  texto: data.texto,
                  data: data.criado_em,
                },
              ],
            }
          : item
      )
    );

    setComentario("");
    setEnviandoComentario(false);

    notificarNovoComentario(
      desabafos.find((item) => item.id === id) || {},
      textoComentario
    );
  }

  // =====================================================
  // SOLICITAR CHAT
  // =====================================================

 async function solicitarChat(desabafo) {
  try {
    const {
      data: { user },
      error: erroUsuario,
    } = await supabase.auth.getUser();

    if (erroUsuario || !user) {
      alert("Faça login para solicitar uma conversa.");
      return;
    }

    const destinatarioId =
      desabafo.usuario_id ||
      desabafo.usuarioId ||
      desabafo.autor_id ||
      desabafo.destinatario_id;

    if (!destinatarioId) {
      alert("Não foi possível identificar a pessoa deste desabafo.");
      return;
    }

    if (String(user.id) === String(destinatarioId)) {
      alert("Você não pode solicitar conversa consigo mesmo.");
      return;
    }

    // 1. PRIMEIRO: procura uma conversa ATIVA ligada exatamente a este desabafo.
    // Se existir, o usuário volta para ela. Não cria uma nova solicitação.
    const { data: conversaAtiva, error: erroConversaAtiva } = await supabase
      .from("conversas")
      .select("*")
      .eq("desabafo_post_id", desabafo.id)
      .eq("status", "ativa")
      .or(`solicitante_id.eq.${user.id},destinatario_id.eq.${user.id}`)
      .order("criada_em", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (erroConversaAtiva) {
      console.error("Erro ao verificar conversa ativa:", erroConversaAtiva);
      alert(
        `Não foi possível verificar a conversa deste desabafo.\n\n${
          erroConversaAtiva.message || "Verifique as políticas do Supabase."
        }`
      );
      return;
    }

    if (conversaAtiva) {
      localStorage.setItem(
        "pulsanAbrirConversaId",
        String(conversaAtiva.id)
      );
      localStorage.setItem(
        "pulsanConversaAtual",
        JSON.stringify(conversaAtiva)
      );
      localStorage.setItem(
        "pulsanIdDesabafoConversa",
        String(desabafo.id)
      );
      localStorage.setItem(
        "pulsanDesabafoConversa",
        String(desabafo.texto || "")
      );

      if (typeof irPara === "function") {
        irPara("conversa");
      }

      return;
    }

    // 2. Se não existe conversa ativa, verifica se já existe um pedido
    // pendente para ESTE desabafo.
    const { data: solicitacaoPendente, error: erroBusca } = await supabase
      .from("solicitacoes_chat")
      .select("id, status, desabafo_post_id")
      .eq("solicitante_id", user.id)
      .eq("destinatario_id", destinatarioId)
      .eq("desabafo_post_id", desabafo.id)
      .eq("status", "pendente")
      .maybeSingle();

    if (erroBusca) {
      console.error("Erro ao verificar solicitação:", erroBusca);
      alert(
        `Erro ao verificar solicitação:\n\n${
          erroBusca.message || "Verifique a configuração do Supabase."
        }`
      );
      return;
    }

    if (solicitacaoPendente) {
      alert("Você já enviou uma solicitação para este desabafo. 💙");
      return;
    }

    // 3. Sem conversa ativa e sem solicitação pendente: cria um novo pedido.
    const { error: erroInsercao } = await supabase
      .from("solicitacoes_chat")
      .insert({
        solicitante_id: user.id,
        destinatario_id: destinatarioId,
        desabafo_post_id: desabafo.id,
        status: "pendente",
      });

    if (erroInsercao) {
      console.error(
        "Erro detalhado ao criar solicitação:",
        JSON.stringify(erroInsercao, null, 2)
      );

      alert(
        `Não foi possível enviar a solicitação.\n\n${
          erroInsercao.message ||
          "Verifique a tabela solicitacoes_chat e as políticas RLS."
        }`
      );
      return;
    }

    alert("Solicitação de chat enviada! 💙");
  } catch (erro) {
    console.error("Erro inesperado ao solicitar conversa:", erro);
    alert(
      `Ocorreu um erro ao solicitar a conversa.\n\n${
        erro.message || "Erro desconhecido."
      }`
    );
  }
}

  // =====================================================
  // DENUNCIAR
  // =====================================================

  function denunciar(item) {
    const motivo = window.prompt(
      "Digite o motivo da denúncia:"
    );

    if (!motivo) {
      return;
    }

    let denuncias = [];

    try {
      denuncias = JSON.parse(
        localStorage.getItem(
          "pulsanDenuncias"
        ) || "[]"
      );

      if (!Array.isArray(denuncias)) {
        denuncias = [];
      }
    } catch (erro) {
      denuncias = [];
    }

    denuncias.push({
      id: Date.now(),

      publicacaoId: item.id,

      motivo,

      usuarioId,

      data: new Date().toISOString(),
    });

    localStorage.setItem(
      "pulsanDenuncias",
      JSON.stringify(denuncias)
    );

    alert(
      "Denúncia enviada. Obrigado por ajudar a manter o Pulsan seguro."
    );
  }

  // =====================================================
  // TELA
  // =====================================================

  const meusDesabafos = desabafos.filter(
    (item) => String(item.usuarioId || item.usuario_id || item.autor_id || "") === String(usuarioId)
  );

  const listaExibicao = aba === "meus"
    ? meusDesabafos
    : desabafos.filter(
        (item) => String(item.usuarioId || item.usuario_id || item.autor_id || "") !== String(usuarioId)
      );

  const notificacoesNaoLidas = notificacoes.filter((item) => !item.lida).length;
  const sequenciaAtual = obterSequenciaApoio();

  function marcarNotificacoesComoLidas() {
    setNotificacoes((lista) => lista.map((item) => ({ ...item, lida: true })));
  }

  function obterNivelUrgencia(item) {
    if (item.prioridade === "urgente" || item.urgencia === "grave") {
      return {
        tipo: "urgente",
        icone: "🔴",
        titulo: "Precisa de atenção",
        texto: "Este desabafo pode precisar de um cuidado mais próximo.",
        fundo: "#FFF1F2",
        borda: "#FDA4AF",
        textoCor: "#9F1239",
      };
    }

    if (item.prioridade === "importante" || item.urgencia === "intermediario") {
      return {
        tipo: "apoio",
        icone: "🟡",
        titulo: "Precisa de apoio",
        texto: "Uma palavra de acolhimento pode fazer diferença.",
        fundo: "#FFF9E8",
        borda: "#F6D365",
        textoCor: "#8A5A00",
      };
    }

    return {
      tipo: "conversa",
      icone: "🟢",
      titulo: "Aberto para conversa",
      texto: "Um espaço para ouvir e compartilhar apoio.",
      fundo: "#ECFDF5",
      borda: "#A7E8D0",
      textoCor: "#087F5B",
    };
  }

  return (
    <div
      className={`ambiente-pulsan ${modoEscuro ? "ambiente-dark" : ""}`}
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, var(--ambiente-bg, #EAF3FF) 0%, var(--ambiente-bg-soft, #F8FBFF) 42%, var(--ambiente-card, #FFFFFF) 100%)",
        color: "var(--ambiente-text)",
        paddingBottom: "120px",
        fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <style>{`
        .ambiente-pulsan {
          --ambiente-bg: #EAF3FF;
          --ambiente-bg-soft: #F8FBFF;
          --ambiente-card: #FFFFFF;
          --ambiente-card-soft: #F7FAFF;
          --ambiente-text: #0F2D5B;
          --ambiente-muted: #667D9B;
          --ambiente-muted-2: #7186A1;
          --ambiente-border: #DCE9FA;
          --ambiente-border-strong: #C9DCFA;
          --ambiente-primary: #3A7DFF;
          --ambiente-primary-soft: #EAF3FF;
          --ambiente-input: #FFFFFF;
        }

        .ambiente-pulsan.ambiente-dark {
          --ambiente-bg: #081B35;
          --ambiente-bg-soft: #0A2342;
          --ambiente-card: #0F2D5B;
          --ambiente-card-soft: #15365F;
          --ambiente-text: #FFFFFF;
          --ambiente-muted: #B8C9DF;
          --ambiente-muted-2: #AFC2DA;
          --ambiente-border: #315A91;
          --ambiente-border-strong: #416DA4;
          --ambiente-primary: #6EA0FF;
          --ambiente-primary-soft: #15365F;
          --ambiente-input: #0B2547;
        }

        .ambiente-pulsan .ambiente-header {
          background: rgba(255,255,255,.92);
          border-bottom-color: var(--ambiente-border);
        }

        .ambiente-pulsan.ambiente-dark .ambiente-header {
          background: rgba(8,27,53,.94);
        }

        .ambiente-pulsan .ambiente-nav-btn,
        .ambiente-pulsan .ambiente-card,
        .ambiente-pulsan .ambiente-comment,
        .ambiente-pulsan .ambiente-mini-fab {
          background: var(--ambiente-card);
          color: var(--ambiente-text);
          border-color: var(--ambiente-border);
        }

        .ambiente-pulsan .ambiente-action {
          background: var(--ambiente-card-soft);
          color: var(--ambiente-text);
          border-color: var(--ambiente-border);
        }

        .ambiente-pulsan .ambiente-action.primary {
          background: var(--ambiente-primary);
          border-color: var(--ambiente-primary);
          color: #FFFFFF;
        }

        .ambiente-pulsan .ambiente-action.supported {
          background: var(--ambiente-primary-soft);
          border-color: #A8C7FF;
          color: var(--ambiente-primary);
        }

        .ambiente-pulsan .ambiente-comment-input {
          color: var(--ambiente-text);
          background: var(--ambiente-input);
          border-color: var(--ambiente-border-strong);
        }

        .ambiente-pulsan .ambiente-comment-input::placeholder {
          color: var(--ambiente-muted);
        }

        .ambiente-pulsan.ambiente-dark .ambiente-hero-card {
          background: linear-gradient(135deg,#0F2D5B 0%,#15365F 100%) !important;
          border-color: var(--ambiente-border-strong) !important;
        }

        .ambiente-pulsan.ambiente-dark .ambiente-mini-fab {
          background: var(--ambiente-card);
          color: var(--ambiente-text);
        }

        /* Contraste reforçado no modo escuro. O tema continua vindo do Perfil/App. */
        .ambiente-pulsan.ambiente-dark .ambiente-header,
        .ambiente-pulsan.ambiente-dark .ambiente-nav-btn {
          color: #FFFFFF !important;
        }
        .ambiente-pulsan.ambiente-dark .ambiente-brand-text p {
          color: #C2D2E8 !important;
        }
        .ambiente-pulsan.ambiente-dark .ambiente-hero-card > div > div:first-child p {
          color: #D7E5F7 !important;
        }
        .ambiente-pulsan.ambiente-dark .ambiente-hero-card > div:last-child > div {
          background: #15365F !important;
          border-color: #416DA4 !important;
          color: #FFFFFF !important;
        }
        .ambiente-pulsan.ambiente-dark .ambiente-post > div:first-child strong,
        .ambiente-pulsan.ambiente-dark .ambiente-post > p {
          color: #FFFFFF !important;
        }
        .ambiente-pulsan.ambiente-dark .ambiente-post > div:first-child div {
          color: #C2D2E8 !important;
        }
        .ambiente-pulsan.ambiente-dark .ambiente-post > div[style*="border-top"] {
          border-top-color: #416DA4 !important;
          color: #C2D2E8 !important;
        }
        .ambiente-pulsan.ambiente-dark .ambiente-post > div[style*="border-top"] strong {
          color: #FFFFFF !important;
        }
        .ambiente-pulsan.ambiente-dark .ambiente-comment {
          background: #15365F !important;
          border-color: #416DA4 !important;
        }
        .ambiente-pulsan.ambiente-dark .ambiente-comment strong,
        .ambiente-pulsan.ambiente-dark .ambiente-comment div {
          color: #EAF3FF !important;
        }
        .ambiente-pulsan.ambiente-dark .ambiente-comment-form {
          border-color: #416DA4;
        }
        .ambiente-pulsan.ambiente-dark .ambiente-card[style*="F3F8FF"] {
          background: #15365F !important;
          border-color: #6EA0FF !important;
        }
        .ambiente-pulsan.ambiente-dark .ambiente-card[style*="F3F8FF"] strong {
          color: #FFFFFF !important;
        }
        .ambiente-pulsan.ambiente-dark .ambiente-card[style*="F3F8FF"] div {
          color: #C2D2E8 !important;
        }
        .ambiente-pulsan.ambiente-dark .ambiente-side strong,
        .ambiente-pulsan.ambiente-dark .ambiente-side h3 {
          color: #FFFFFF !important;
        }
        .ambiente-pulsan.ambiente-dark .ambiente-side p,
        .ambiente-pulsan.ambiente-dark .ambiente-side span {
          color: #C2D2E8 !important;
        }
        .ambiente-pulsan.ambiente-dark .ambiente-side > .ambiente-card:not([style*="173E78"]) {
          color: #FFFFFF;
        }
        .ambiente-pulsan.ambiente-dark .ambiente-side > .ambiente-card:not([style*="173E78"]) div[style*="color"] {
          color: #D7E5F7 !important;
        }
        .ambiente-pulsan.ambiente-dark .ambiente-side > .ambiente-card div[style*="background: #EAF3FF"] {
          background: #15365F !important;
          border-color: #416DA4 !important;
        }
        .ambiente-pulsan.ambiente-dark .ambiente-action {
          color: #FFFFFF !important;
        }
        .ambiente-pulsan.ambiente-dark .ambiente-action.supported {
          background: #315A91 !important;
          border-color: #6EA0FF !important;
          color: #FFFFFF !important;
        }

        /* Animações de entrada */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .ambiente-post {
          animation: fadeInUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .ambiente-comment {
          animation: slideInFromTop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        /* Pulso suave para novos comentários */
        .ambiente-comment-new {
          box-shadow: 0 0 0 3px rgba(58, 125, 255, 0.1);
          animation: fadeInUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* Transição suave em apoios */
        .ambiente-action {
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .ambiente-action:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(15, 45, 91, 0.12);
        }

        .ambiente-shell { width: min(100% - 32px, 980px); margin: 0 auto; }
        .ambiente-header { position: sticky; top: 0; z-index: 30; backdrop-filter: blur(16px); background: var(--ambiente-card); border-bottom: 1px solid var(--ambiente-border); }
        .ambiente-header-inner { width: min(100% - 32px, 1180px); min-height: 76px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 18px; }
        .ambiente-brand { display:flex; align-items:center; gap:12px; min-width:0; }
        .ambiente-logo { width:44px; height:44px; border-radius:14px; object-fit:contain; background:#EAF3FF; padding:5px; }
        .ambiente-nav { display:flex; align-items:center; gap:8px; }
        .ambiente-nav-btn { border:1px solid #DCE9FA; background:var(--ambiente-card); color:var(--ambiente-text); border-radius:13px; padding:10px 14px; font-weight:750; cursor:pointer; transition:.2s; }
        .ambiente-nav-btn.active { background:#3A7DFF; border-color:#3A7DFF; color:#fff; }
        .ambiente-hero { padding:30px 0 12px; }
        .ambiente-hero-card { background:linear-gradient(135deg,#FFFFFF 0%,#EAF3FF 100%); border:1px solid #C9DCFA; border-radius:28px; padding:28px; box-shadow:0 12px 40px rgba(15,45,91,.08); }
        .ambiente-grid { display:grid; grid-template-columns:1fr 310px; gap:18px; align-items:start; }
        .ambiente-card { background:var(--ambiente-card); border:1px solid #DCE9FA; border-radius:24px; box-shadow:0 8px 30px rgba(15,45,91,.06); }
        .ambiente-post { padding:22px; margin-bottom:16px; }
        .ambiente-actions { display:flex; flex-wrap:wrap; gap:8px; margin-top:18px; }
        .ambiente-action { border:1px solid #DCE9FA; border-radius:14px; padding:10px 13px; background:var(--ambiente-card-soft); color:var(--ambiente-text); font-weight:750; cursor:pointer; }
        .ambiente-action.primary { background:#3A7DFF; border-color:#3A7DFF; color:#fff; }
        .ambiente-action.supported { background:#EAF3FF; border-color:#A8C7FF; color:#245DBF; }
        .ambiente-comment { background:var(--ambiente-card-soft); border:1px solid #E2ECFA; border-radius:16px; padding:12px 14px; margin-top:8px; }
        .ambiente-comment-form { display:flex; gap:8px; margin-top:12px; }
        .ambiente-comment-input { flex:1; min-width:0; border:1px solid #C9DCFA; border-radius:14px; padding:12px 14px; outline:none; color:var(--ambiente-text); background:var(--ambiente-card); }
        .ambiente-side { position:sticky; top:94px; }
        .ambiente-fab { position:fixed; right:24px; bottom:88px; z-index:40; width:64px; height:64px; border:0; border-radius:50%; background:#3A7DFF; color:#fff; font-size:27px; cursor:pointer; box-shadow:0 12px 30px rgba(58,125,255,.35); }
        .ambiente-mini-fab { position:fixed; right:100px; bottom:103px; z-index:40; width:38px; height:38px; border:1px solid #DCE9FA; border-radius:50%; background:var(--ambiente-card); color:var(--ambiente-text); font-size:19px; cursor:pointer; box-shadow:0 8px 20px rgba(15,45,91,.14); }
        @media (max-width: 820px) {
          .ambiente-grid { grid-template-columns:1fr; }
          .ambiente-side { position:static; }
          .ambiente-header-inner { min-height:68px; }
          .ambiente-nav-btn span { display:none; }
        }
        @media (max-width: 560px) {
          .ambiente-shell, .ambiente-header-inner { width:min(100% - 20px, 980px); }
          .ambiente-hero { padding-top:16px; }
          .ambiente-hero-card, .ambiente-post { padding:17px; border-radius:20px; }
          .ambiente-header-inner { gap:8px; }
          .ambiente-brand-text p { display:none; }
          .ambiente-nav { gap:5px; }
          .ambiente-nav-btn { padding:9px 10px; border-radius:12px; }
          .ambiente-actions { display:grid; grid-template-columns:1fr 1fr; }
          .ambiente-action.primary { grid-column:1 / -1; }
          .ambiente-comment-form { flex-direction:column; }
          .ambiente-comment-form button { min-height:44px; }
          .ambiente-fab { right:16px; bottom:78px; }
          .ambiente-mini-fab { right:90px; bottom:92px; }
        }
      `}</style>

      <header className="ambiente-header">
        <div className="ambiente-header-inner">
          <div className="ambiente-brand">
            <img className="ambiente-logo" src="/logo.png" alt="Pulsan" />
            <div className="ambiente-brand-text" style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 850, fontSize: 20, letterSpacing: "-0.4px" }}>Pulsan</div>
              <p style={{ margin: "2px 0 0", color: "#5E7594", fontSize: 12 }}>Um espaço para ouvir e ser ouvido.</p>
            </div>
          </div>

          <nav className="ambiente-nav" aria-label="Navegação do Ambiente">
            <button className={`ambiente-nav-btn ${aba === "feed" ? "active" : ""}`} onClick={() => setAba("feed")}>
              💙 <span>Comunidade</span>
            </button>
            <button className={`ambiente-nav-btn ${aba === "meus" ? "active" : ""}`} onClick={() => setAba("meus")}>
              👤 <span>Meus desabafos</span>
            </button>
            {notificacoesNaoLidas > 0 && (
              <button className="ambiente-nav-btn" onClick={marcarNotificacoesComoLidas} title="Marcar notificações como lidas">
                🔔 <span>{notificacoesNaoLidas}</span>
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="ambiente-shell">
        <section className="ambiente-hero">
          <div className="ambiente-hero-card">
            <div style={{ display: "flex", justifyContent: "space-between", gap: 18, alignItems: "flex-start", flexWrap: "wrap" }}>
              <div style={{ maxWidth: 650 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "#fff", border: "1px solid #C9DCFA", borderRadius: 999, padding: "7px 11px", color: "#245DBF", fontSize: 12, fontWeight: 800 }}>
                  💙 AMBIENTE PULSAN
                </div>
                <h1 style={{ margin: "14px 0 8px", fontSize: "clamp(26px, 4vw, 38px)", lineHeight: 1.1, letterSpacing: "-1px" }}>
                  Aqui, você pode falar. E também pode acolher.
                </h1>
                <p style={{ margin: 0, color: "#4D6687", lineHeight: 1.65, fontSize: 15 }}>
                  Um espaço de apoio onde pessoas podem compartilhar o que sentem, receber acolhimento e oferecer uma palavra de cuidado — sem julgamentos.
                </p>
              </div>
              <div style={{ fontSize: 58, lineHeight: 1, padding: 8 }}>🦋</div>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 20 }}>
              <div style={{ background: "rgba(255,255,255,.82)", border: "1px solid #D7E6FA", borderRadius: 14, padding: "10px 13px", color: "#0F2D5B", fontSize: 13 }}>🔒 Identidade protegida</div>
              <div style={{ background: "rgba(255,255,255,.82)", border: "1px solid #D7E6FA", borderRadius: 14, padding: "10px 13px", color: "#0F2D5B", fontSize: 13 }}>🤝 Apoio entre pessoas</div>
              <div style={{ background: "rgba(255,255,255,.82)", border: "1px solid #D7E6FA", borderRadius: 14, padding: "10px 13px", color: "#0F2D5B", fontSize: 13 }}>💬 Conversas com consentimento</div>
            </div>
          </div>
        </section>

        {notificacoesNaoLidas > 0 && (
          <section className="ambiente-card" style={{ marginBottom: 18, padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, background: "#F3F8FF", borderColor: "#A8C7FF" }}>
            <div>
              <strong style={{ color: "#0F2D5B" }}>🔔 Novidade no seu desabafo</strong>
              <div style={{ marginTop: 3, color: "#58708F", fontSize: 13 }}>
                Você tem {notificacoesNaoLidas} novo(s) comentário(s) para conferir.
              </div>
            </div>
            <button className="ambiente-action primary" onClick={marcarNotificacoesComoLidas}>Ver e marcar como lidas</button>
          </section>
        )}

        <div className="ambiente-grid">
          <section>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 14, flexWrap: "wrap" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 22 }}>{aba === "meus" ? "Meus desabafos" : "Espaço da comunidade"}</h2>
                <p style={{ margin: "5px 0 0", color: "#667D9B", fontSize: 13 }}>
                  {aba === "meus" ? "Acompanhe o que você compartilhou." : "Talvez alguém precise exatamente de uma palavra sua hoje."}
                </p>
              </div>
            </div>

            {carregandoDesabafos && (
              <div className="ambiente-card" style={{ padding: 35, textAlign: "center", color: "#5E7594" }}>
                <div style={{ fontSize: 30, marginBottom: 8 }}>💙</div>
                Carregando o espaço de apoio...
              </div>
            )}

            {!carregandoDesabafos && listaExibicao.length === 0 && (
              <div className="ambiente-card" style={{ padding: "42px 22px", textAlign: "center" }}>
                <div style={{ fontSize: 48, marginBottom: 10 }}>🦋</div>
                <h3 style={{ margin: "0 0 7px" }}>{aba === "meus" ? "Você ainda não publicou um desabafo." : "Ainda não existem desabafos."}</h3>
                <p style={{ margin: 0, color: "#667D9B", lineHeight: 1.6 }}>
                  {aba === "meus" ? "Quando quiser colocar seus sentimentos para fora, este espaço estará aqui." : "Quando alguém compartilhar, você poderá acolher, comentar ou oferecer uma conversa."}
                </p>
              </div>
            )}

            {!carregandoDesabafos && listaExibicao.map((item, index) => {
              const apoiadores = Array.isArray(item.apoiadores) ? item.apoiadores : [];
              const comentarios = Array.isArray(item.comentarios) ? item.comentarios : [];
              const jaApoiou = apoiadores.includes(String(usuarioId));
              const dono = String(item.usuarioId || item.autorId || item.donoId || item.usuario_id || "") === String(usuarioId);
              const urgencia = obterNivelUrgencia(item);

              return (
                <article className="ambiente-card ambiente-post" key={item.id || index}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 48, height: 48, flex: "0 0 48px", borderRadius: "50%", background: "linear-gradient(135deg,#EAF3FF,#A8C7FF)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "2px solid #fff", boxShadow: "0 2px 10px rgba(58,125,255,.12)" }}>
                      {item.fotoUsuario ? <img src={item.fotoUsuario} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 22 }}>👤</span>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <strong style={{ color: "#0F2D5B" }}>{item.nomeUsuario || "Usuário anônimo"}</strong>
                      <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 3, color: "#7186A1", fontSize: 11 }}>
                        <span>Identidade protegida</span>
                        {item.criado_em && <span>• {formatarTempoRelativo(item.criado_em)}</span>}
                      </div>
                    </div>
                    {aba === "meus" && dono ? (
                      <button onClick={() => deletarDesabafo(item.id)} title="Deletar desabafo" aria-label="Deletar desabafo" style={{ border: 0, background: "transparent", fontSize: 18, cursor: "pointer" }}>🗑️</button>
                    ) : !dono ? (
                      <button onClick={() => denunciarDesabafo(item)} title="Denunciar desabafo" aria-label="Denunciar desabafo" style={{ border: 0, background: "transparent", color: "#5E7594", fontSize: 12, fontWeight: 750, cursor: "pointer" }}>🚩</button>
                    ) : null}
                  </div>

                  <div style={{ marginTop: 17, background: urgencia.fundo, border: `1px solid ${urgencia.borda}`, borderRadius: 14, padding: "10px 12px", display: "flex", gap: 9, alignItems: "flex-start" }}>
                    <span>{urgencia.icone}</span>
                    <div>
                      <strong style={{ display: "block", color: urgencia.textoCor, fontSize: 12 }}>{urgencia.titulo}</strong>
                      <span style={{ color: urgencia.textoCor, opacity: .82, fontSize: 11 }}>{urgencia.texto}</span>
                    </div>
                  </div>

                  <p style={{ fontSize: "clamp(16px, 2vw, 18px)", lineHeight: 1.7, margin: "18px 0 0", color: "#243F62", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                    {item.texto}
                  </p>

                  <div style={{ marginTop: 15, paddingTop: 12, borderTop: "1px solid #EDF2F8", color: "#7186A1", fontSize: 12 }}>
                    🔒 <strong style={{ color: "#496887" }}>Privacidade:</strong> quem publicou este desabafo permanece anônimo. O foco aqui é o que essa pessoa está sentindo.
                  </div>

                  <div className="ambiente-actions">
                    <button className={`ambiente-action ${jaApoiou ? "supported" : ""}`} onClick={() => apoiar(item.id)}>
                      {jaApoiou ? "💙 Apoiando" : "🤍 Apoiar"}{apoiadores.length > 0 ? ` ${apoiadores.length}` : ""}
                    </button>
                    <button className="ambiente-action" onClick={() => setComentariosAbertos(comentariosAbertos === item.id ? null : item.id)}>
                      💬 Comentar{comentarios.length > 0 ? ` ${comentarios.length}` : ""}
                    </button>
                    {!dono && (
                      <button className="ambiente-action primary" onClick={() => solicitarChat(item)}>
                        🤝 Oferecer conversa privada
                      </button>
                    )}
                  </div>

                  {comentariosAbertos === item.id && (
                    <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid #E6EEF8" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                        <strong style={{ fontSize: 14, color: "#0F2D5B" }}>Comentários de apoio</strong>
                        <span style={{ fontSize: 11, color: "#7A8FA9" }}>{comentarios.length} comentário(s)</span>
                      </div>

                      {comentarios.length === 0 && (
                        <div style={{ background: "#F7FAFF", borderRadius: 15, padding: 13, color: "#7186A1", fontSize: 13 }}>
                          Ainda não há comentários. Uma palavra gentil pode ser o começo.
                        </div>
                      )}

                      {comentarios.map((coment) => (
                        <div className="ambiente-comment" key={coment.id}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#EAF3FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>💙</div>
                            <strong style={{ fontSize: 12, color: "#365A82" }}>{coment.nome || "Anônimo"}</strong>
                            {coment.data && <span style={{ color: "#8AA0B9", fontSize: 10 }}>• {formatarTempoRelativo(coment.data)}</span>}
                          </div>
                          <div style={{ marginTop: 7, color: "#36506F", fontSize: 13.5, lineHeight: 1.55 }}>{coment.texto}</div>
                        </div>
                      ))}

                      <div className="ambiente-comment-form">
                        <input className="ambiente-comment-input" value={comentario} onChange={(e) => setComentario(e.target.value)} placeholder="Escreva uma palavra de apoio..." disabled={enviandoComentario} />
                        <button className="ambiente-action primary" onClick={() => enviarComentario(item.id)} disabled={enviandoComentario}>
                          {enviandoComentario ? "Enviando..." : "Enviar"}
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </section>

          <aside className="ambiente-side">
            <div className="ambiente-card" style={{ padding: 20, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 44, height: 44, borderRadius: 15, background: "#EAF3FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 23 }}>💙</div>
                <div>
                  <strong style={{ display: "block", color: "#0F2D5B" }}>Como fazer parte?</strong>
                  <span style={{ color: "#7186A1", fontSize: 12 }}>Pequenas atitudes também acolhem.</span>
                </div>
              </div>
              <div style={{ marginTop: 16, display: "grid", gap: 10 }}>
                <div style={{ display: "flex", gap: 9, color: "#496887", fontSize: 13 }}><span>1.</span><span>Leia com respeito e sem julgamentos.</span></div>
                <div style={{ display: "flex", gap: 9, color: "#496887", fontSize: 13 }}><span>2.</span><span>Deixe uma mensagem de apoio.</span></div>
                <div style={{ display: "flex", gap: 9, color: "#496887", fontSize: 13 }}><span>3.</span><span>Se houver abertura, ofereça uma conversa.</span></div>
              </div>
            </div>

            <div className="ambiente-card" style={{ padding: 20, background: "linear-gradient(145deg,#0F2D5B,#173E78)", color: "#fff", border: "none" }}>
              <div style={{ fontSize: 25 }}>🔒</div>
              <h3 style={{ margin: "10px 0 7px", color: "#fff" }}>Seu espaço é protegido</h3>
              <p style={{ margin: 0, color: "#DDEBFF", fontSize: 13, lineHeight: 1.6 }}>
                No Ambiente, o desabafo é o centro da conversa. A identidade de quem compartilha deve permanecer protegida.
              </p>
            </div>

            <div className="ambiente-card" style={{ marginTop: 16, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <div>
                  <strong style={{ color: "#0F2D5B" }}>🔥 Sequência de apoio</strong>
                  <p style={{ margin: "5px 0 0", color: "#7186A1", fontSize: 12 }}>Dias espalhando apoio.</p>
                </div>
                <div style={{ minWidth: 58, height: 58, borderRadius: "50%", background: "#EAF3FF", border: "2px solid #A8C7FF", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <strong style={{ fontSize: 19, color: "#3A7DFF" }}>{sequenciaAtual}</strong>
                  <span style={{ fontSize: 9, color: "#5E7594" }}>dias</span>
                </div>
              </div>
              <p style={{ margin: "14px 0 0", color: "#496887", fontSize: 13, lineHeight: 1.55 }}>
                Cada apoio conta. O objetivo não é competir, mas lembrar que acolhimento também é uma forma de cuidado.
              </p>
              {[7, 14, 30].includes(sequenciaAtual) && (
                <button className="ambiente-action primary" style={{ width: "100%", marginTop: 12 }} onClick={compartilharSequenciaApoio}>
                  📣 Compartilhar minha sequência
                </button>
              )}
            </div>
          </aside>
        </div>
      </main>

      <button className="ambiente-mini-fab" onClick={() => setAba(aba === "meus" ? "feed" : "meus")} title="Alternar entre comunidade e meus desabafos" aria-label="Alternar entre comunidade e meus desabafos">⋯</button>
      <button className="ambiente-fab" onClick={() => irPara("desabafar")} title="Desabafar" aria-label="Desabafar">✎</button>
    </div>
  );
}
export default Ambiente;