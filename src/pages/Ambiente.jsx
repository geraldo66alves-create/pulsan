import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { supabase } from "../lib/supabase";


const palavrasOfensivasComentarios = [
    "idiota",
    "imbecil",
    "burro",
    "burra",
    "burro demais",
    "burra demais",
    "otario",
    "otaria",
    "otário",
    "otária",
    "retardado",
    "retardada",
    "retardado mental",
    "retardada mental",
    "babaca",
    "besta",
    "cretino",
    "cretina",
    "canalha",
    "patife",
    "inutil",
    "inútil",
    "incompetente",
    "idiota completo",
    "idiota completa",
    "palhaco",
    "palhaço",
    "palhaca",
    "palhaça",
    "otario de merda",
    "otária de merda",
    "sem noção",
    "sem nocao",
    "animal",
    "verme",
    "lixo",
    "fracassado",
    "fracassada",
    "ridiculo",
    "ridículo",
    "ridicula",
    "ridícula",
    "nojento",
    "nojenta",
    "asqueroso",
    "asquerosa",
    "repugnante",
    "desgraçado",
    "desgracado",
    "desgraçada",
    "desgracada",
    "maldito",
    "maldita",
    "miseravel",
    "miserável",
    "safado",
    "safada",
    "sacana",
    "vagabundo",
    "vagabunda",
    "moleque",
    "moleca",

    "merda",
    "merdinha",
    "merdao",
    "merdão",
    "porra",
    "porrinha",
    "caralho",
    "caralhinho",
    "cacete",
    "caceteiro",
    "caceteira",
    "foda",
    "foda-se",
    "fodase",
    "foder",
    "fudê",
    "fude",
    "fuder",
    "fudido",
    "fudida",
    "fodido",
    "fodida",
    "fucking",
    "fuck",
    "shit",
    "bosta",
    "bostinha",
    "bostao",
    "bostão",
    "cu",
    "cuzinho",
    "cuzão",
    "cuzao",
    "cuzona",
    "buceta",
    "bucetinha",
    "bucetao",
    "bucetão",
    "xota",
    "xoxota",
    "xoxotinha",
    "pica",
    "picao",
    "picão",
    "piroca",
    "piroquinha",
    "rola",
    "rolinha",
    "pau no cu",

    "filho da puta",
    "filha da puta",
    "filho de uma puta",
    "filha de uma puta",
    "filho de puta",
    "filha de puta",
    "seu filho da puta",
    "sua filha da puta",
    "seu filho de uma puta",
    "sua filha de uma puta",
    "seu merda",
    "sua merda",
    "seu idiota",
    "sua idiota",
    "seu imbecil",
    "sua imbecil",
    "seu otario",
    "sua otaria",
    "seu otário",
    "sua otária",
    "seu babaca",
    "sua babaca",
    "seu burro",
    "sua burra",
    "seu retardado",
    "sua retardada",
    "seu desgraçado",
    "sua desgraçada",
    "seu desgracado",
    "sua desgracada",
    "seu canalha",
    "sua canalha",
    "seu vagabundo",
    "sua vagabunda",
    "seu lixo",
    "sua lixo",
    "seu verme",
    "sua verme",
    "seu nojento",
    "sua nojenta",

    "vai se foder",
    "vai tomar no cu",
    "vai pro inferno",
    "vai para o inferno",
    "vai à merda",
    "vai a merda",
    "vai pra merda",
    "vai para merda",
    "vai se ferrar",
    "vai se lascar",
    "vai se danar",
    "foda-se você",
    "foda se voce",
    "foda-se voce",
    "foda se você",
    "que se foda",
    "que se dane",
    "que se lasque",
    "que se ferre",
    "puta que pariu",
    "puta que o pariu",
    "filho do caralho",
    "filha do caralho",
    "seu pedaço de merda",
    "sua pedaço de merda",
    "pedaço de merda",
    "pedaco de merda",
    "bando de idiotas",
    "bando de imbecis",
    "bando de babacas",
    "seus idiotas",
    "suas idiotas",
    "seus imbecis",
    "suas imbecis",
    "seus babacas",
    "suas babacas",

    "puta",
    "puto",
    "putinha",
    "putinha de merda",
    "puto de merda",
    "vadia",
    "vadia de merda",
    "vadiazinha",
    "prostituta de merda",
    "prostituto de merda",
    "piranha",
    "piranha de merda",
    "piranha velha",
    "cachorra",
    "cachorro de merda",
    "cachorra de merda",
    "galinha",
    "galinha de merda",

    "tomar no cu",
    "tomou no cu",
    "toma no cu",
    "vai tomar no cu",
    "enfia no cu",
    "enfia isso no cu",
    "enfia essa merda",
    "enfia essa porra",
    "enfia isso",
    "chupa",
    "chupa meu pau",
    "chupa essa",
    "chupa essa porra",
    "vai chupar",
    "vai chupar o dedo",
    "lambe meu",
    "se foder",
    "se fode",
    "foda se",
    "foda voce",
    "foda você",

    "vou te matar",
    "eu vou te matar",
    "quero te matar",
    "vou acabar com voce",
    "vou acabar com você",
    "vou acabar contigo",
    "quero acabar contigo",
    "vou te pegar",
    "vou te arrebentar",
    "vou te bater",
    "vou bater em voce",
    "vou bater em você",
    "vou te espancar",
    "vou quebrar sua cara",
    "quebrar sua cara",
    "vou acabar com sua vida",
    "acabar com sua vida",
    "merece morrer",
    "você merece morrer",
    "voce merece morrer",
    "tomara que morra",
    "tomara que voce morra",
    "tomara que você morra",
    "vai morrer",
    "vou fazer voce sofrer",
    "vou fazer você sofrer",

    "lixo humano",
    "ser humano lixo",
    "escoria",
    "escória",
    "escoria humana",
    "escória humana",
    "sem vergonha",
    "sem-vergonha",
    "cara de pau",
    "cara de merda",
    "mente de merda",
    "vida de merda",
    "trabalho de merda",
    "escola de merda",
    "empresa de merda",
    "professor de merda",
    "professora de merda",
    "aluno de merda",
    "aluna de merda",
    "colega de merda",
    "amigo de merda",
    "amiga de merda",

    "fdp",
    "f d p",
    "f.d.p",
    "vsf",
    "vai tomar no c",
    "vtc",
    "vtnc",
    "pqp",
    "p q p",
    "p.q.p",
    "tnc",
    "toma no c",
    "seu fdp",
    "sua fdp",
    "seu f d p",
    "sua f d p",
    "filho duma puta",
    "filha duma puta",
    "filho duma p",
    "filha duma p",
    "fdp de merda",
    "idiota de merda",
    "imbecil de merda",
    "babaca de merda",
    "otario de merda",
    "otária de merda",
    "burro de merda",
    "burra de merda",
    "retardado de merda",
    "retardada de merda",
];

function normalizarTextoComentario(conteudo) {
  return String(conteudo || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[0-9]/g, (numero) => ({ "0": "o", "1": "i", "2": "z", "3": "e", "4": "a", "5": "s", "6": "g", "7": "t", "8": "b", "9": "g" }[numero] || numero))
    .replace(/[@!$]/g, (simbolo) => ({ "@": "a", "!": "i", "$": "s" }[simbolo] || simbolo))
    .replace(/[.,!?;:()[\]{}"'`´~^_*+=<>/@#$%&|\\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function possuiPalavraOfensivaComentario(conteudo) {
  const textoNormalizado = normalizarTextoComentario(conteudo);
  return palavrasOfensivasComentarios.some((palavra) => {
    const palavraNormalizada = normalizarTextoComentario(palavra);
    if (!palavraNormalizada) return false;
    if (palavraNormalizada.includes(" ")) return textoNormalizado.includes(palavraNormalizada);
    const regex = new RegExp(`(^|\\s)${palavraNormalizada}(?=\\s|$)`, "i");
    return regex.test(textoNormalizado);
  });
}

function Icon({ name, size = 18, stroke = "currentColor", strokeWidth = 1.9 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke,
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    style: { flex: "0 0 auto", display: "inline-block", verticalAlign: "middle" },
  };
  const paths = {
    heart: <><path d="M20.8 8.8c0 5.1-8.8 10-8.8 10s-8.8-4.9-8.8-10A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.8 2.7Z" /></>,
    user: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20c.7-3.3 3.1-5 7-5s6.3 1.7 7 5" /></>,
    bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    lock: <><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="9.5" cy="7" r="3" /><path d="M17 8a3 3 0 0 1 0 6M21 21v-2a4 4 0 0 0-3-3.87" /></>,
    message: <><path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H7l-4 3v-6.2A7.5 7.5 0 1 1 20 11.5Z" /></>,
    trash: <><path d="M4 7h16" /><path d="M10 11v6M14 11v6" /><path d="M6 7l1 14h10l1-14M9 7V4h6v3" /></>,
    flag: <><path d="M5 21V4" /><path d="M5 5c4-3 7 3 14 0v9c-7 3-10-3-14 0" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    support: <><path d="M12 21a9 9 0 1 0-9-9 9 9 0 0 0 9 9Z" /><path d="M8 12h8M12 8v8" /></>,
    share: <><circle cx="18" cy="5" r="2.5" /><circle cx="6" cy="12" r="2.5" /><circle cx="18" cy="19" r="2.5" /><path d="m8.2 10.8 7.6-4.4M8.2 13.2l7.6 4.4" /></>,
    edit: <><path d="m4 20 4.2-1 10.3-10.3a2.1 2.1 0 0 0-3-3L5.2 16 4 20Z" /><path d="m14.5 7.5 2 2" /></>,
    alert: <><path d="M12 3 2.8 20h18.4L12 3Z" /><path d="M12 9v5M12 17h.01" /></>,
    shield: <><path d="M12 3 20 6v5c0 5-3.3 8.4-8 10-4.7-1.6-8-5-8-10V6l8-3Z" /><path d="m9 12 2 2 4-4" /></>,
    flame: <><path d="M12 21c4 0 7-2.8 7-6.6 0-3.2-2-5.6-4.2-7.9.1 2-1 3.4-2.1 4.3.2-3.3-1.3-5.6-3.5-7.8.1 3.8-4.2 5.7-4.2 10.2C5 17.6 8.1 21 12 21Z" /></>,
  };
  return <svg {...common}>{paths[name] || paths.heart}</svg>;
}

function obterDadosPerfilPulsan() {
  const chaves = ["usuarioLogado", "pulsanUsuarioAtual"];
  let usuario = {};
  for (const chave of chaves) {
    try {
      const valor = JSON.parse(localStorage.getItem(chave) || "{}");
      if (valor && typeof valor === "object" && Object.keys(valor).length) {
        usuario = valor;
        break;
      }
    } catch { /* tenta a próxima chave */ }
  }
  const tipo = String(
    localStorage.getItem("pulsanTipo") ||
    usuario.tipo_usuario || usuario.tipo ||
    usuario.user_metadata?.tipo_usuario || usuario.user_metadata?.tipo || "aluno"
  ).toLowerCase().trim();
  if (["colaborador", "funcionario", "funcionário", "employee", "empresa"].includes(tipo)) return "colaborador";
  if (["visitante", "visitor"].includes(tipo)) return "visitante";
  if (["psicologo", "psicóloga", "psicologo_parceiro", "psychologist"].includes(tipo)) return "psicologo";
  if (["admin", "administrador", "equipe_pulsan"].includes(tipo)) return "admin";
  return "aluno";
}

function Ambiente({ irPara, tema = "claro" }) {
  const modoEscuro = tema === "escuro";
  const tipoPerfil = obterDadosPerfilPulsan();
  const ambientesPermitidos =
    tipoPerfil === "aluno" ? ["escola", "geral"] :
    tipoPerfil === "colaborador" ? ["trabalho", "geral"] :
    tipoPerfil === "visitante" ? ["geral"] :
    ["geral"];

  const [desabafos, setDesabafos] = useState([]);
  const [carregandoDesabafos, setCarregandoDesabafos] = useState(true);
  const [comentariosAbertos, setComentariosAbertos] = useState(null);
  const [aba, setAba] = useState("feed");
  const [comentario, setComentario] = useState("");
  const [enviandoComentario, setEnviandoComentario] = useState(false);
  const [notificacoes, setNotificacoes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("pulsanNotificacoes") || "[]");
    } catch (erro) {
      return [];
    }
  });
  const [statusMinicurso, setStatusMinicurso] = useState({
    etapas_concluidas: 0,
    concluido: false,
    carregando: true,
  });

  async function deletarDesabafo(id) {
    const confirmar = window.confirm("Deseja realmente deletar este desabafo?");
    if (!confirmar) return;
    const { error } = await supabase.from("posts_ambiente").delete().eq("id", id);
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
    const descricao = window.prompt("Se quiser, explique melhor a denúncia (opcional):");
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

  const [usuario, setUsuario] = useState({});

  const carregarStatusMinicurso = useCallback(async (usuarioAutenticado = null) => {
    try {
      let user = usuarioAutenticado;
      if (user === null) {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        user = data?.user || null;
      }
      if (!user?.id) {
        setStatusMinicurso({ etapas_concluidas: 0, concluido: false, carregando: false });
        return false;
      }
      const { data, error } = await supabase.rpc("pulsan_status_minicurso_chat");
      if (error) throw error;
      const registro = Array.isArray(data) ? data[0] : data;
      const etapas = Math.min(7, Math.max(0, Number(registro?.etapas_concluidas) || 0));
      const concluido = registro?.concluido === true || etapas >= 7;
      setStatusMinicurso({ etapas_concluidas: etapas, concluido, carregando: false });
      return concluido;
    } catch (erro) {
      console.error("Erro ao consultar progresso do minicurso:", erro);
      setStatusMinicurso((atual) => ({ ...atual, carregando: false }));
      return false;
    }
  }, []);

  useEffect(() => {
    let ativo = true;
    async function carregarUsuario() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        if (ativo) {
          setUsuario(user);
          carregarStatusMinicurso(user);
        }
      } else {
        try {
          const usuarioLocal = JSON.parse(
            localStorage.getItem("usuarioLogado") ||
            localStorage.getItem("pulsanUsuarioAtual") ||
            "{}"
          );
          if (ativo) {
            setUsuario(usuarioLocal || {});
            setStatusMinicurso({ etapas_concluidas: 0, concluido: false, carregando: false });
          }
        } catch (erro) {
          if (ativo) {
            setUsuario({});
            setStatusMinicurso({ etapas_concluidas: 0, concluido: false, carregando: false });
          }
        }
      }
    }
    carregarUsuario();
    const { data: listener } = supabase.auth.onAuthStateChange((_evento, session) => {
      if (session?.user) {
        setUsuario(session.user);
        carregarStatusMinicurso(session.user);
      } else {
        setUsuario({});
        setStatusMinicurso({ etapas_concluidas: 0, concluido: false, carregando: false });
      }
    });
    return () => {
      ativo = false;
      listener?.subscription?.unsubscribe();
    };
  }, [carregarStatusMinicurso]);

  const usuarioId = usuario.id || usuario.email || "usuario";
  const nomeUsuario = usuario.nome || usuario.name || usuario.user_metadata?.nome || "Usuário";

  function usuarioAuthId() {
    return usuario.id || null;
  }

  const [tempoAtual, setTempoAtual] = useState(new Date());

  useEffect(() => {
    const intervalo = setInterval(() => setTempoAtual(new Date()), 30000);
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

  const montadoRef = useRef(false);

  useEffect(() => {
    montadoRef.current = true;
    return () => {
      montadoRef.current = false;
    };
  }, []);

  const carregarDesabafos = useCallback(async () => {
    if (!montadoRef.current) return;
    setCarregandoDesabafos(true);
    try {
      const { data, error } = await supabase.rpc("pulsan_listar_posts_anonimos");
      if (error) {
        console.error("Erro ao carregar desabafos:", error);
        if (montadoRef.current) setDesabafos([]);
        return;
      }
      const postsVisiveis = data || [];
      const postsComComentarios = await Promise.all(
        postsVisiveis.map(async (post) => {
          const { data: comentariosBanco, error: erroComentarios } = await supabase
            .from("comentarios_ambiente")
            .select("*")
            .eq("post_id", post.id)
            .order("criado_em", { ascending: true });
          if (erroComentarios) {
            console.error("Erro ao carregar comentários do desabafo:", post.id, erroComentarios);
          }
          return {
            ...post,
            souAutor: post.sou_autor === true,
            usuarioId: post.sou_autor === true ? usuarioId : null,
            nomeUsuario: post.nome_usuario || "Usuário anônimo",
            fotoUsuario: post.foto_usuario || "",
            texto: post.texto,
            apoiadores: Array.isArray(post.apoiadores) ? post.apoiadores : [],
            comentarios: (comentariosBanco || []).map((comentarioBanco) => ({
              id: comentarioBanco.id,
              usuarioId: comentarioBanco.usuario_id,
              nome: "Anônimo",
              texto: comentarioBanco.texto,
              data: comentarioBanco.criado_em,
            })),
          };
        })
      );
      if (montadoRef.current) setDesabafos(postsComComentarios);
    } catch (erro) {
      console.error("Erro inesperado ao carregar o Ambiente:", erro);
      if (montadoRef.current) setDesabafos([]);
    } finally {
      if (montadoRef.current) setCarregandoDesabafos(false);
    }
  }, [tipoPerfil, usuarioId]);

  useEffect(() => {
    if (!usuario.id) return;
    carregarDesabafos();
    const sessao = JSON.parse(localStorage.getItem("pulsanSessao") || "{}");
    if (sessao.session?.access_token) {
      supabase.realtime.setAuth(sessao.session.access_token);
    }
    let timeoutAtualizacao;
    function agendarAtualizacao() {
      clearTimeout(timeoutAtualizacao);
      timeoutAtualizacao = setTimeout(() => {
        if (montadoRef.current) carregarDesabafos();
      }, 400);
    }
    const canalNovoPost = supabase.channel("ambiente-novo-post")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "posts_ambiente" }, () => {
        agendarAtualizacao();
      }).subscribe();
    const canalAtualizacaoPost = supabase.channel("ambiente-atualizacao-post")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "posts_ambiente" }, () => {
        agendarAtualizacao();
      }).subscribe();
    const canalNovoComentario = supabase.channel("ambiente-novo-comentario")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "comentarios_ambiente" }, () => {
        agendarAtualizacao();
      }).subscribe();
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
    const souDono = post.souAutor === true;
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

  function registrarApoioDiario() {
    const hoje = new Date().toISOString().split("T")[0];
    let salvo = {};
    try {
      salvo = JSON.parse(localStorage.getItem("pulsanSequenciaApoio") || "{}");
    } catch (erro) {
      salvo = {};
    }
    if (salvo.ultimoDia === hoje) return;
    const ontem = new Date();
    ontem.setDate(ontem.getDate() - 1);
    const dataOntem = ontem.toISOString().split("T")[0];
    const sequencia = salvo.ultimoDia === dataOntem ? (salvo.sequencia || 0) + 1 : 1;
    localStorage.setItem("pulsanSequenciaApoio", JSON.stringify({
      sequencia,
      ultimoDia: hoje,
    }));
  }

  function obterSequenciaApoio() {
    try {
      const dados = JSON.parse(localStorage.getItem("pulsanSequenciaApoio") || "{}");
      return Number(dados.sequencia) || 0;
    } catch (erro) {
      return 0;
    }
  }

  async function compartilharSequenciaApoio() {
    const dias = obterSequenciaApoio();
    const mensagem = `Já estou há ${dias} dias espalhando apoio no Pulsan. Você também pode fazer a diferença!`;
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

  async function apoiar(id) {
    const idUsuario = usuarioAuthId();
        if (!idUsuario) {
      alert("Entre na sua conta para apoiar um desabafo.");
      return;
    }
    const post = desabafos.find((item) => item.id === id);
    if (!post) return;
    const { data: novosApoiadores, error } = await supabase.rpc("alternar_apoio", {
      p_post_id: id,
    });
    if (error) {
      console.error("Erro ao registrar apoio:", error);
      alert("Não foi possível registrar o apoio.");
      return;
    }
    const apoiadoresAtualizados = Array.isArray(novosApoiadores) ? novosApoiadores : [];
    setDesabafos((listaAtual) => listaAtual.map((item) =>
      item.id === id ? { ...item, apoiadores: apoiadoresAtualizados } : item
    ));
    registrarApoioDiario();
  }

  async function enviarComentario(id) {
    const textoComentario = comentario.trim();
    if (!textoComentario) return;
    if (possuiPalavraOfensivaComentario(textoComentario)) {
      alert("Seu comentário contém linguagem ofensiva ou inadequada. Revise o texto antes de enviar.");
      return;
    }
    const idUsuario = usuarioAuthId();
    if (!idUsuario) {
      alert("Entre na sua conta para comentar.");
      return;
    }
    setEnviandoComentario(true);
    const { data, error } = await supabase.from("comentarios_ambiente").insert({
      post_id: id,
      usuario_id: idUsuario,
      texto: textoComentario,
    }).select().single();
    if (error) {
      console.error("Erro ao enviar comentário:", error);
      alert("Não foi possível enviar o comentário.");
      setEnviandoComentario(false);
      return;
    }
    setDesabafos((listaAtual) => listaAtual.map((item) =>
      item.id === id ? {
        ...item,
        comentarios: [
          ...(Array.isArray(item.comentarios) ? item.comentarios : []),
          {
            id: data.id,
            usuarioId: data.usuario_id,
            nome: "Anônimo",
            texto: data.texto,
            data: data.criado_em,
          },
        ],
      } : item
    ));
    setComentario("");
    setEnviandoComentario(false);
    notificarNovoComentario(desabafos.find((item) => item.id === id) || {}, textoComentario);
  }

  async function solicitarChat(desabafo) {
    try {
      const { data: { user }, error: erroUsuario } = await supabase.auth.getUser();
      if (erroUsuario || !user) {
        alert("Faça login para solicitar uma conversa.");
        return;
      }
      if (!desabafo?.id || desabafo.souAutor) {
        alert("Não foi possível solicitar uma conversa para este desabafo.");
        return;
      }
      const minicursoConcluido = await carregarStatusMinicurso(user);
      if (!minicursoConcluido) {
        alert("Para oferecer uma conversa privada, primeiro conclua as 7 etapas do minicurso de acolhimento.");
        irPara("mini-curso-chat");
        return;
      }
      const { data, error } = await supabase.rpc("pulsan_solicitar_chat_post", {
        p_post_id: desabafo.id,
      });
      if (error) {
        const mensagem = String(error.message || "").toLowerCase();
        if (mensagem.includes("minicurso") || mensagem.includes("minicurso_chat")) {
          alert("Conclua as 7 etapas do minicurso antes de solicitar uma nova conversa privada.");
          irPara("mini-curso-chat");
          return;
        }
        throw error;
      }
      const resultado = Array.isArray(data) ? data[0] : data;
      if (resultado?.status === "conversa_existente" && resultado?.conversa_id) {
        alert("Você já possui uma conversa sobre este desabafo.");
        return;
      }
      if (resultado?.status === "solicitacao_existente") {
        alert("Você já enviou uma solicitação para este desabafo.");
        return;
      }
      alert("Solicitação de chat enviada!");
    } catch (erro) {
      console.error("Erro ao solicitar conversa:", erro);
      alert(erro?.message || "Não foi possível enviar a solicitação.");
    }
  }

  function denunciar(item) {
    const motivo = window.prompt("Digite o motivo da denúncia:");
    if (!motivo) return;
    let denuncias = [];
    try {
      denuncias = JSON.parse(localStorage.getItem("pulsanDenuncias") || "[]");
      if (!Array.isArray(denuncias)) denuncias = [];
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
    localStorage.setItem("pulsanDenuncias", JSON.stringify(denuncias));
    alert("Denúncia enviada. Obrigado por ajudar a manter o Pulsan seguro.");
  }

  const meusDesabafos = desabafos.filter((item) => item.souAutor === true);
  const listaExibicao = aba === "meus"
    ? meusDesabafos
    : desabafos.filter((item) => item.souAutor !== true);
  const notificacoesNaoLidas = notificacoes.filter((item) => !item.lida).length;
  const sequenciaAtual = obterSequenciaApoio();

  function marcarNotificacoesComoLidas() {
    setNotificacoes((lista) => lista.map((item) => ({ ...item, lida: true })));
  }

  function obterNivelUrgencia(item) {
    if (item.prioridade === "urgente" || item.urgencia === "grave") {
      return {
        tipo: "urgente",
        icone: "alert",
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
        icone: "support",
        titulo: "Precisa de apoio",
        texto: "Uma palavra de acolhimento pode fazer diferença.",
        fundo: "#FFF9E8",
        borda: "#F6D365",
        textoCor: "#8A5A00",
      };
    }
    return {
      tipo: "conversa",
      icone: "check",
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
        .ambiente-pulsan.ambiente-dark .ambiente-hero-card > div:nth-child(2) > div {
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
        .ambiente-pulsan .ambiente-minicurso {
          background: var(--ambiente-card);
          border: 1px solid var(--ambiente-border);
          border-radius: 22px;
          padding: 20px;
          margin: 0 0 18px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          box-shadow: 0 8px 26px rgba(15,45,91,.06);
        }
        @media (max-width: 560px) {
          .ambiente-pulsan .ambiente-minicurso {
            align-items: stretch;
            flex-direction: column;
          }
          .ambiente-pulsan .ambiente-minicurso button {
            width: 100%;
          }
        }
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
        .ambiente-comment-new {
          box-shadow: 0 0 0 3px rgba(58, 125, 255, 0.1);
          animation: fadeInUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
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
       .ambiente-fab {
          position: fixed !important;
          right: 24px !important;
          left: auto !important;
          bottom: calc(100px + env(safe-area-inset-bottom, 0px)) !important;
          z-index: 2000 !important;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: auto;
          min-width: 156px;
          min-height: 56px;
          height: auto;
          padding: 0 22px;
          border: 0;
          border-radius: 999px;
          background: #3A7DFF;
          color: #FFFFFF;
          font-size: 15px;
          font-weight: 800;
          line-height: 1;
          white-space: nowrap;
          cursor: pointer;
          box-shadow: 0 12px 30px rgba(58,125,255,.35);
          transition: transform .2s ease, box-shadow .2s ease, background .2s ease;
        }
        .ambiente-pulsan .ambiente-fab:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 34px rgba(58,125,255,.42);
          background: #286CEB;
        }
        .ambiente-pulsan .ambiente-fab:focus-visible {
          outline: 3px solid #A8C7FF;
          outline-offset: 4px;
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
         
          .ambiente-mini-fab { right:90px; bottom:92px; }
          .ambiente-fab {
            right: 16px !important;
            bottom: calc(92px + env(safe-area-inset-bottom, 0px)) !important;
            min-width: 148px;
            min-height: 54px;
            padding: 0 18px;
            font-size: 14px;
          }
        }

        .ambiente-pulsan,.ambiente-pulsan *{box-sizing:border-box}
        .ambiente-pulsan{width:100%;max-width:100%;overflow-x:clip}
        .ambiente-shell{width:min(100% - 32px,1180px);min-width:0}
        .ambiente-grid{grid-template-columns:minmax(0,1fr) minmax(260px,310px);gap:22px}
        .ambiente-grid>section,.ambiente-side{min-width:0}
        .ambiente-post,.ambiente-card{min-width:0;overflow-wrap:anywhere}
        .ambiente-post p{max-width:100%}
        .ambiente-actions>*{min-width:0}
        .ambiente-fab{max-width:calc(100vw - 32px)}
        @media(max-width:900px){
          .ambiente-shell{width:min(100% - 28px,720px)}
          .ambiente-grid{grid-template-columns:minmax(0,1fr)}
          .ambiente-side{position:static;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px;margin-top:8px}
          .ambiente-side>.ambiente-card{margin:0!important;min-width:0}
          .ambiente-side>.ambiente-card:last-child{grid-column:1/-1}
        }
        @media(max-width:600px){
          .ambiente-pulsan{padding-bottom:calc(112px + env(safe-area-inset-bottom,0px))!important}
          .ambiente-header-inner{width:calc(100% - 24px);min-height:64px;gap:8px;flex-wrap:wrap;padding:8px 0}
          .ambiente-logo{width:38px;height:38px;flex:0 0 38px}
          .ambiente-brand{gap:8px}
          .ambiente-brand-text>div{font-size:18px!important}
          .ambiente-nav{flex:1;justify-content:flex-end;min-width:0;gap:5px}
          .ambiente-nav-btn{display:inline-flex;align-items:center;justify-content:center;gap:5px;padding:8px 9px;font-size:11px;white-space:nowrap;min-height:38px}
          .ambiente-shell{width:calc(100% - 24px);max-width:560px}
          .ambiente-hero{padding:12px 0 8px}
          .ambiente-hero-card{padding:16px;border-radius:18px}
          .ambiente-hero-card h1{font-size:clamp(23px,6vw,30px)!important;letter-spacing:-.6px!important}
          .ambiente-hero-card p{font-size:13px!important}
          .ambiente-hero-card>div[style*="marginTop: 22px"]{padding:14px!important;gap:12px!important}
          .ambiente-minicurso{padding:14px!important;margin-bottom:12px!important;border-radius:17px!important;gap:12px!important}
          .ambiente-grid{display:grid;grid-template-columns:minmax(0,1fr);gap:16px}
          .ambiente-grid>section{width:100%;min-width:0}
          .ambiente-grid>section>div:first-child h2{font-size:19px!important}
          .ambiente-post{padding:15px!important;margin-bottom:12px!important;border-radius:18px!important}
          .ambiente-post>div:first-child{gap:9px!important}
          .ambiente-post>div:first-child>div:first-child{width:40px!important;height:40px!important;flex-basis:40px!important}
          .ambiente-post p{font-size:16px!important;line-height:1.6!important}
          .ambiente-actions{display:flex;flex-wrap:wrap;gap:7px;margin-top:14px}
          .ambiente-action{padding:10px 11px;font-size:12px;min-height:40px;border-radius:12px}
          .ambiente-action.primary{flex:1 1 100%;justify-content:center}
          .ambiente-comment-form{display:flex;flex-direction:row;align-items:stretch}
          .ambiente-comment-input{width:100%;min-width:0;font-size:16px}
          .ambiente-comment-form button{flex:0 0 auto;min-height:44px}
          .ambiente-side{display:flex;flex-direction:column;gap:12px;margin-top:0}
          .ambiente-side>.ambiente-card{padding:16px!important;border-radius:18px!important}
          .ambiente-fab{right:14px!important;bottom:calc(82px + env(safe-area-inset-bottom,0px))!important;min-width:0;min-height:48px;padding:0 17px;font-size:13px}
          .ambiente-mini-fab{right:14px!important;bottom:calc(140px + env(safe-area-inset-bottom,0px))!important}
        }
        @media(max-width:380px){
          .ambiente-header-inner{width:calc(100% - 18px)}
          .ambiente-nav-btn{padding:7px 7px;font-size:10px;gap:3px}
          .ambiente-nav-btn svg{width:14px;height:14px}
          .ambiente-shell{width:calc(100% - 18px)}
          .ambiente-hero-card{padding:13px}
          .ambiente-post{padding:13px!important}
          .ambiente-actions .ambiente-action{font-size:11px;padding:9px 8px}
          .ambiente-fab{right:10px!important}
        }
        @media(prefers-reduced-motion:reduce){
          .ambiente-pulsan .ambiente-post,.ambiente-pulsan .ambiente-comment{animation:none!important}
          .ambiente-pulsan *{scroll-behavior:auto!important;transition:none!important}
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
              <Icon name="heart" size={17} /> <span>Comunidade</span>
            </button>
            <button className={`ambiente-nav-btn ${aba === "meus" ? "active" : ""}`} onClick={() => setAba("meus")}>
              <Icon name="user" size={17} /> <span>Meus desabafos</span>
            </button>
            {notificacoesNaoLidas > 0 && (
              <button className="ambiente-nav-btn" onClick={marcarNotificacoesComoLidas} title="Marcar notificações como lidas">
                <Icon name="bell" size={17} /> <span>{notificacoesNaoLidas}</span>
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
                  <Icon name="heart" size={15} /> AMBIENTE PULSAN
                </div>
                <h1 style={{ margin: "14px 0 8px", fontSize: "clamp(26px, 4vw, 38px)", lineHeight: 1.1, letterSpacing: "-1px" }}>
                  Aqui, você pode falar. E também pode acolher.
                </h1>
                <p style={{ margin: 0, color: "#4D6687", lineHeight: 1.65, fontSize: 15 }}>
                  Um espaço de apoio onde pessoas podem compartilhar o que sentem, receber acolhimento e oferecer uma palavra de cuidado — sem julgamentos.
                </p>
              </div>
              <div style={{ width: 64, height: 64, lineHeight: 1, padding: 8, color: "#3A7DFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon name="heart" size={48} strokeWidth={1.6} />
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 20 }}>
              <div style={{ background: "rgba(255,255,255,.82)", border: "1px solid #D7E6FA", borderRadius: 14, padding: "10px 13px", color: "#0F2D5B", fontSize: 13 }}><Icon name="lock" size={15} /> Identidade protegida</div>
              <div style={{ background: "rgba(255,255,255,.82)", border: "1px solid #D7E6FA", borderRadius: 14, padding: "10px 13px", color: "#0F2D5B", fontSize: 13 }}><Icon name="users" size={15} /> Apoio entre pessoas</div>
              <div style={{ background: "rgba(255,255,255,.82)", border: "1px solid #D7E6FA", borderRadius: 14, padding: "10px 13px", color: "#0F2D5B", fontSize: 13 }}><Icon name="message" size={15} /> Conversas com consentimento</div>
            </div>
            <div style={{
              marginTop: 22,
              padding: 20,
              borderRadius: 20,
              background: modoEscuro ? "rgba(110,160,255,.12)" : "rgba(255,255,255,.78)",
              border: `1px solid ${modoEscuro ? "#416DA4" : "#C9DCFA"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 18,
              flexWrap: "wrap"
            }}>
              <div style={{ flex: "1 1 240px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                  <Icon name="heart" size={19} />
                  <strong style={{ fontSize: 16 }}>Um momento para cuidar de você</strong>
                </div>
                <p style={{ margin: 0, color: modoEscuro ? "#D7E5F7" : "#4D6687", fontSize: 13, lineHeight: 1.6 }}>
                  Nem sempre precisamos conversar. Às vezes, uma pausa, um exercício de respiração ou alguns minutos de autocuidado já podem ajudar.
                </p>
              </div>
              <button
                onClick={() => irPara("autocuidado")}
                style={{
                  border: 0,
                  borderRadius: 13,
                  padding: "12px 20px",
                  background: "#3A7DFF",
                  color: "#FFFFFF",
                  fontWeight: 800,
                  fontSize: 13,
                  cursor: "pointer",
                  whiteSpace: "nowrap"
                }}
              >
                Começar agora
              </button>
            </div>
          </div>
        </section>

        <section className="ambiente-minicurso">
          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
            <span style={{ width: 42, height: 42, flex: "0 0 42px", borderRadius: 13, background: "var(--ambiente-primary-soft)", color: "var(--ambiente-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="shield" size={21} />
            </span>
            <div style={{ minWidth: 0 }}>
              <strong style={{ display: "block", fontSize: 15 }}>
                {statusMinicurso.carregando
                  ? "Verificando seus cursos..."
                  : statusMinicurso.concluido
                    ? "Você está com todos os cursos em dia!"
                    : "Você tem um minicurso pendente."}
              </strong>
              {!statusMinicurso.carregando && !statusMinicurso.concluido && (
                <span style={{ display: "block", marginTop: 4, color: "var(--ambiente-muted)", fontSize: 12, lineHeight: 1.5 }}>
                  Conclua o minicurso para liberar as solicitações de conversas privadas.
                </span>
              )}
            </div>
          </div>
          {!statusMinicurso.carregando && !statusMinicurso.concluido && (
            <button className="ambiente-action primary" onClick={() => irPara("mini-curso-chat")} style={{ whiteSpace: "nowrap", minHeight: 44 }}>
              Fazer minicurso
            </button>
          )}
        </section>

        {notificacoesNaoLidas > 0 && (
          <section className="ambiente-card" style={{ marginBottom: 18, padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, background: "#F3F8FF", borderColor: "#A8C7FF" }}>
            <div>
              <strong style={{ color: "#0F2D5B" }}><Icon name="bell" size={17} /> Novidade no seu desabafo</strong>
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
                <div style={{ fontSize: 30, marginBottom: 8 }}><Icon name="heart" size={23} /></div>
                Carregando o espaço de apoio...
              </div>
            )}

            {!carregandoDesabafos && listaExibicao.length === 0 && (
              <div className="ambiente-card" style={{ padding: "42px 22px", textAlign: "center" }}>
                <div style={{ marginBottom: 10, color: "#3A7DFF" }}>
                  <Icon name="heart" size={42} strokeWidth={1.6} />
                </div>
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
              const dono = item.souAutor === true;
              const urgencia = obterNivelUrgencia(item);

              return (
                <article className="ambiente-card ambiente-post" key={item.id || index}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 48, height: 48, flex: "0 0 48px", borderRadius: "50%", background: "linear-gradient(135deg,#EAF3FF,#A8C7FF)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "2px solid #fff", boxShadow: "0 2px 10px rgba(58,125,255,.12)" }}>
                      {item.fotoUsuario ? <img src={item.fotoUsuario} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 22 }}><Icon name="user" size={22} /></span>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <strong style={{ color: "#0F2D5B" }}>{item.nomeUsuario || "Usuário anônimo"}</strong>
                      <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 3, color: "#7186A1", fontSize: 11 }}>
                        <span>Identidade protegida</span>
                        {item.criado_em && <span>• {formatarTempoRelativo(item.criado_em)}</span>}
                      </div>
                    </div>
                    {aba === "meus" && dono ? (
                      <button onClick={() => deletarDesabafo(item.id)} title="Deletar desabafo" aria-label="Deletar desabafo" style={{ border: 0, background: "transparent", fontSize: 18, cursor: "pointer" }}><Icon name="trash" size={18} /></button>
                    ) : !dono ? (
                      <button onClick={() => denunciarDesabafo(item)} title="Denunciar desabafo" aria-label="Denunciar desabafo" style={{ border: 0, background: "transparent", color: "#5E7594", fontSize: 12, fontWeight: 750, cursor: "pointer" }}><Icon name="flag" size={18} /></button>
                    ) : null}
                  </div>

                  <div style={{ marginTop: 17, background: urgencia.fundo, border: `1px solid ${urgencia.borda}`, borderRadius: 14, padding: "10px 12px", display: "flex", gap: 9, alignItems: "flex-start" }}>
                    <span style={{ display: "inline-flex", paddingTop: 1 }}><Icon name={urgencia.icone} size={17} /></span>
                    <div>
                      <strong style={{ display: "block", color: urgencia.textoCor, fontSize: 12 }}>{urgencia.titulo}</strong>
                      <span style={{ color: urgencia.textoCor, opacity: .82, fontSize: 11 }}>{urgencia.texto}</span>
                    </div>
                  </div>

                  <p style={{ fontSize: "clamp(16px, 2vw, 18px)", lineHeight: 1.7, margin: "18px 0 0", color: "#243F62", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                    {item.texto}
                  </p>

                  <div style={{ marginTop: 15, paddingTop: 12, borderTop: "1px solid #EDF2F8", color: "#7186A1", fontSize: 12 }}>
                    <Icon name="lock" size={14} /> <strong style={{ color: "#496887" }}>Privacidade:</strong> quem publicou este desabafo permanece anônimo. O foco aqui é o que essa pessoa está sentindo.
                  </div>

                  <div className="ambiente-actions">
                    <button className={`ambiente-action ${jaApoiou ? "supported" : ""}`} onClick={() => apoiar(item.id)}>
                      {jaApoiou ? <><Icon name="heart" size={16} /> Apoiando</> : <><Icon name="heart" size={16} /> Apoiar</>}{apoiadores.length > 0 ? ` ${apoiadores.length}` : ""}
                    </button>
                    <button className="ambiente-action" onClick={() => setComentariosAbertos(comentariosAbertos === item.id ? null : item.id)}>
                      <Icon name="message" size={16} /> Comentar{comentarios.length > 0 ? ` ${comentarios.length}` : ""}
                    </button>
                    {!dono && (
                      <button
                        className="ambiente-action primary"
                        onClick={() => statusMinicurso.concluido ? solicitarChat(item) : irPara("mini-curso-chat")}
                        disabled={statusMinicurso.carregando}
                        title={statusMinicurso.concluido ? "Oferecer conversa privada" : "Conclua o minicurso para oferecer uma conversa privada"}
                      >
                        {statusMinicurso.concluido
                          ? <><Icon name="users" size={16} /> Oferecer conversa privada</>
                          : <><Icon name="shield" size={16} /> Concluir minicurso para conversar</>}
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
                            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#EAF3FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}><Icon name="heart" size={23} /></div>
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
                <div style={{ width: 44, height: 44, borderRadius: 15, background: "#EAF3FF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 23 }}><Icon name="heart" size={23} /></div>
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
              <div style={{ fontSize: 25 }}><Icon name="lock" size={25} /></div>
              <h3 style={{ margin: "10px 0 7px", color: "#fff" }}>Seu espaço é protegido</h3>
              <p style={{ margin: 0, color: "#DDEBFF", fontSize: 13, lineHeight: 1.6 }}>
                No Ambiente, o desabafo é o centro da conversa. A identidade de quem compartilha deve permanecer protegida.
              </p>
            </div>

            <div className="ambiente-card" style={{ marginTop: 16, padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                <div>
                  <strong style={{ color: "#0F2D5B" }}><Icon name="flame" size={17} /> Sequência de apoio</strong>
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
                  <Icon name="share" size={16} /> Compartilhar minha sequência
                </button>
              )}
            </div>
          </aside>
        </div>
      </main>

      <button className="ambiente-mini-fab" onClick={() => setAba(aba === "meus" ? "feed" : "meus")} title="Alternar entre comunidade e meus desabafos" aria-label="Alternar entre comunidade e meus desabafos">⋯</button>
      {typeof document !== "undefined" && createPortal(
        <button type="button" className="ambiente-fab" onClick={() => irPara("desabafar")} title="Desabafar" aria-label="Desabafar">
          <Icon name="edit" size={19} />
          <span>Desabafar</span>
        </button>,
        document.body
      )}
    </div>
  );
}

export default Ambiente;