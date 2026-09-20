import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

function Icon({ name, size = 18, strokeWidth = 1.9, className = "" }) {
  const paths = {
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
    brain: <><path d="M9.5 4.5a3.2 3.2 0 0 0-5.8 1.9A3.2 3.2 0 0 0 4 12.6a3.2 3.2 0 0 0 3.4 5.1c.6 1.1 1.7 1.8 3 1.8V4.7a3 3 0 0 0-.9-.2Z"/><path d="M14.5 4.5a3.2 3.2 0 0 1 5.8 1.9 3.2 3.2 0 0 1-.3 6.2 3.2 3.2 0 0 1-3.4 5.1c-.6 1.1-1.7 1.8-3 1.8V4.7c.3-.1.6-.2.9-.2Z"/><path d="M8 8.5h1.5M14.5 8.5H16M8.2 13h1.3M14.5 13h1.3M12 4.5v15"/></>,
    alert: <><path d="M12 3 2.8 20h18.4L12 3Z"/><path d="M12 9v5M12 17.2h.01"/></>,
    users: <><path d="M16 20v-1.5a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V20"/><circle cx="9.5" cy="7" r="3.5"/><path d="M17 11a3.5 3.5 0 1 0-1.2-6.8M17 14.5h.5a4 4 0 0 1 4 4V20"/></>,
    school: <><path d="m3 10 9-6 9 6-9 6-9-6Z"/><path d="M6 12.2V17c3 2.2 9 2.2 12 0v-4.8M21 10v6"/></>,
    company: <><path d="M4 21V5.5A1.5 1.5 0 0 1 5.5 4h7A1.5 1.5 0 0 1 14 5.5V21M14 9.5A1.5 1.5 0 0 1 15.5 8h3A1.5 1.5 0 0 1 20 9.5V21M2 21h20M7 8h2M7 12h2M7 16h2M16 12h2M16 16h2"/></>,
    shield: <><path d="M12 3 20 6v5.5c0 5-3.3 8.8-8 10.5-4.7-1.7-8-5.5-8-10.5V6l8-3Z"/><path d="m8.5 12 2.2 2.2 4.8-5"/></>,
    chart: <><path d="M4 19V5M4 19h17"/><path d="m7 15 3-4 3 2 5-7"/></>,
    chat: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v7a2.5 2.5 0 0 1-2.5 2.5H11l-5 4v-4.2a2.5 2.5 0 0 1-2-2.3v-7Z"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.7 1.7-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-2.4v-.2a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L8 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H6.6v-2.4h.2a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L8 8.6l1.7-1.7.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6v-.2h2.4v.2a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.7 1.7-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2V14h-.2a1.7 1.7 0 0 0-1.6 1Z"/></>,
    content: <><path d="M5 4h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z"/><path d="M8 8h8M8 12h8M8 16h5"/></>,
    pending: <><circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3 2"/></>,
    partner: <><path d="M8.5 12.5 6 15a3 3 0 0 0 4.2 4.2l2.1-2.1M15.5 11.5 18 9a3 3 0 0 0-4.2-4.2l-2.1 2.1"/><path d="m9 15 6-6"/></>,
    student: <><path d="m3 9 9-5 9 5-9 5-9-5Z"/><path d="M7 11.2V17c2.8 2 7.2 2 10 0v-5.8M21 9v6"/></>,
    briefcase: <><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18M10 12v2h4v-2"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    logout: <><path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4M14 16l4-4-4-4M18 12H9"/></>,
    refresh: <><path d="M20 11a8 8 0 0 0-14.8-3L3 11M4 5v5h5"/><path d="M4 13a8 8 0 0 0 14.8 3L21 13M20 19v-5h-5"/></>,
    sun: <><circle cx="12" cy="12" r="3.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>,
    moon: <path d="M20 15.2A8 8 0 0 1 8.8 4a8.4 8.4 0 1 0 11.2 11.2Z"/>,
    search: <><circle cx="10.8" cy="10.8" r="6.5"/><path d="m16 16 4.5 4.5"/></>,
    location: <><path d="M19 10c0 5-7 10-7 10S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2.3"/></>,
    lock: <><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></>,
    video: <><rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3Z"/></>,
    back: <><path d="M19 12H5M11 18l-6-6 6-6"/></>,
    arrow: <path d="M5 12h14M13 6l6 6-6 6"/>,
    check: <path d="m5 12 4 4L19 6"/>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      {paths[name] || paths.dashboard}
    </svg>
  );
}

function PainelAdmin({ irPara, tema, alterarTema }) {
  const [dados, setDados] = useState({
    usuarios: 0,
    psicologos: 0,
    pendentes: 0,
    aprovados: 0,
    recusados: 0,
    colaboradores: 0,
    alunos: 0,
    alertas: 0,
    escolas: 0,
    empresas: 0,
    moderacoes: 0,
    conversas: 0,
  });

  const [paginaAdmin, setPaginaAdmin] = useState("inicio");

  const [usuarios, setUsuarios] = useState([]);
  const [buscaUsuario, setBuscaUsuario] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");

  const [escolas, setEscolas] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [moderacoes, setModeracoes] = useState([]);
  const [conversas, setConversas] = useState([]);
  const [solicitacoesChat, setSolicitacoesChat] = useState([]);
  const [alertasIA, setAlertasIA] = useState([]);
  const [psicologosRegistros, setPsicologosRegistros] = useState([]);

  const [buscaEscola, setBuscaEscola] = useState("");
  const [buscaEmpresa, setBuscaEmpresa] = useState("");
  const [buscaModeracao, setBuscaModeracao] = useState("");

  const [configuracoes, setConfiguracoes] = useState({
    moderacaoAutomatica: true,
    alertasAutomaticos: true,
    permitirCadastroEscola: true,
    permitirCadastroEmpresa: true,
    modoManutencao: false,
  });

  useEffect(() => {
    carregarDados();

    try {
      const configuracoesSalvas = JSON.parse(
        localStorage.getItem("pulsanConfiguracoesAdmin") || "null"
      );

      if (configuracoesSalvas && typeof configuracoesSalvas === "object") {
        setConfiguracoes((atual) => ({
          ...atual,
          ...configuracoesSalvas,
        }));
      }
    } catch (erro) {
      console.error("Erro ao carregar configurações administrativas:", erro);
    }
  }, []);

  function lerLocalStorage(chave) {
    try {
      const valor = JSON.parse(localStorage.getItem(chave) || "[]");
      return Array.isArray(valor) ? valor : [];
    } catch {
      return [];
    }
  }

  async function carregarDados() {
    try {
      const [
        perfisResult,
        usuariosAuthResult,
        psicologosResult,
        postsResult,
        chatsResult,
        solicitacoesChatResult,
        denunciasResult,
        alertasResult,
      ] = await Promise.all([
        supabase
          .from("perfis")
          .select("id,nome,foto_url,selo,verificacao_psicologo,psicologo_parceiro,criado_em"),
        supabase.rpc("painel_admin_usuarios"),
        supabase
          .from("psicologos")
          .select("id,usuario_id,nome,email,telefone,crp,estado_crp,area_atuacao,verificado,ativo,disponivel,created_at"),
        supabase
          .from("posts_ambiente")
          .select("id,usuario_id,texto,nome_usuario,foto_usuario,criado_em,apoiadores")
          .order("criado_em", { ascending: false }),
        supabase
          .from("conversas")
          .select("id,solicitacao_id,solicitante_id,destinatario_id,status,iniciada_em,criada_em,ultima_mensagem_em,desabafo_post_id")
          .order("criada_em", { ascending: false }),
        supabase
          .from("solicitacoes_chat")
          .select("id,solicitante_id,destinatario_id,desabafo_id,status,criado_em,atualizado_em,categoria,urgencia,motivo,desabafo_post_id")
          .order("criado_em", { ascending: false }),
        supabase
          .from("denuncias")
          .select("id,publicacao_id,denunciante_id,motivo,descricao,status,analisada_por,resposta_admin,criada_em,analisada_em")
          .order("criada_em", { ascending: false }),
        supabase
          .from("alertas_ia")
          .select("id,publicacao_id,classificacao,tipo_situacao,motivo,prioridade,ambiente,resolvido,created_at,texto,visualizado,visualizado_em")
          .order("created_at", { ascending: false }),
      ]);

      if (perfisResult.error) throw perfisResult.error;
      if (usuariosAuthResult.error) throw usuariosAuthResult.error;
      if (psicologosResult.error) throw psicologosResult.error;
      if (postsResult.error) throw postsResult.error;
      if (chatsResult.error) throw chatsResult.error;
      if (solicitacoesChatResult.error) throw solicitacoesChatResult.error;
      if (denunciasResult.error) throw denunciasResult.error;
      if (alertasResult.error) throw alertasResult.error;

      const perfis = perfisResult.data || [];
      const usuariosAuth = usuariosAuthResult.data || [];
      const registrosPsicologos = psicologosResult.data || [];
      setPsicologosRegistros(registrosPsicologos);
      const posts = postsResult.data || [];
      const chats = chatsResult.data || [];
      const solicitacoesChat = solicitacoesChatResult.data || [];
      const denuncias = denunciasResult.data || [];
      const alertas = alertasResult.data || [];

      // A tabela perfis não possui tipo_usuario. Para não inventar
      // uma coluna no banco, o tipo de psicólogo é identificado pela
      // tabela psicologos.usuario_id. Tipos antigos mantidos no
      // localStorage são usados apenas como compatibilidade.
      const contasLocais = lerLocalStorage("pulsanContas");
      const mapaPsicologos = new Map(
        registrosPsicologos
          .filter((item) => item.usuario_id)
          .map((item) => [String(item.usuario_id), item])
      );

      const mapaAuth = new Map(
        usuariosAuth.map((item) => [String(item.id), item])
      );

      const mapaContasLocais = new Map();
      contasLocais.forEach((conta) => {
        const chaves = [conta.id, conta.usuario_id, conta.email]
          .filter(Boolean)
          .map(String);
        chaves.forEach((chave) => mapaContasLocais.set(chave, conta));
      });

      const contas = perfis.map((perfil) => {
        const authUsuario = mapaAuth.get(String(perfil.id));
        const metadata = authUsuario?.metadata || {};
        const psicologo = mapaPsicologos.get(String(perfil.id));
        const contaLocal =
          mapaContasLocais.get(String(perfil.id)) ||
          mapaContasLocais.get(String(perfil.email || ""));

        let tipoUsuario =
          metadata.tipo_usuario ||
          metadata.tipo ||
          contaLocal?.tipo_usuario ||
          "usuario";

        if (psicologo) {
          tipoUsuario = "psicologo";
        }

        let verificacao = perfil.verificacao_psicologo || "nao_enviado";

        if (psicologo && !["aprovado", "recusado", "pendente"].includes(verificacao)) {
          verificacao = psicologo.verificado ? "aprovado" : "pendente";
        }

        return {
          ...perfil,
          ...(contaLocal || {}),
          ...perfil,
          email: authUsuario?.email || psicologo?.email || contaLocal?.email || "",
          confirmado_em: authUsuario?.confirmado_em || null,
          ultimo_login: authUsuario?.ultimo_login || null,
          tipo_usuario: tipoUsuario,
          verificacao_psicologo: verificacao,
          psicologo_parceiro:
            Boolean(perfil.psicologo_parceiro) ||
            Boolean(psicologo?.verificado),
          crp: psicologo?.crp || contaLocal?.crp || "",
          telefone: psicologo?.telefone || contaLocal?.telefone || "",
          estado_crp: psicologo?.estado_crp || contaLocal?.estado_crp || "",
          area_atuacao:
            psicologo?.area_atuacao || contaLocal?.area_atuacao || "",
          psicologo_id: psicologo?.id || null,
        };
      });

      // Contas antigas que ainda estão no localStorage e não possuem
      // perfil no banco não entram como usuários reais do Supabase.
      const psicologosUsuarios = contas.filter(
        (usuario) => usuario.tipo_usuario === "psicologo"
      );
      const pendentes = psicologosUsuarios.filter(
        (usuario) => usuario.verificacao_psicologo === "pendente"
      );
      const aprovados = psicologosUsuarios.filter(
        (usuario) => usuario.verificacao_psicologo === "aprovado"
      );
      const recusados = psicologosUsuarios.filter(
        (usuario) => usuario.verificacao_psicologo === "recusado"
      );
      const colaboradores = contas.filter(
        (usuario) => usuario.tipo_usuario === "colaborador"
      );
      const alunos = contas.filter(
        (usuario) => usuario.tipo_usuario === "aluno"
      );

      const moderacoesDeDenuncias = denuncias.map((item) => ({
        ...item,
        _origem: "denuncia",
        conteudo: item.descricao || item.motivo || "Denúncia registrada",
        categoria: item.motivo || "Denúncia",
        usuario: item.denunciante_id ? "Usuário identificado internamente" : "Anônimo",
        status: item.status || "pendente",
      }));

      const moderacoesDeAlertas = alertas.map((item) => ({
        ...item,
        _origem: "alerta_ia",
        conteudo: item.texto || item.motivo || item.tipo_situacao || "Alerta gerado pela IA",
        categoria: item.classificacao || item.tipo_situacao || "Alerta",
        usuario: "Anônimo",
        status: item.resolvido ? "resolvido" : "pendente",
      }));

      const moderacoesSalvas = [
        ...moderacoesDeDenuncias,
        ...moderacoesDeAlertas,
      ];

      const escolasSalvas = lerLocalStorage("pulsanEscolas");
      const empresasSalvas = lerLocalStorage("pulsanEmpresas");

      setUsuarios(contas);
      setEscolas(escolasSalvas);
      setEmpresas(empresasSalvas);
      setModeracoes(moderacoesSalvas);
      setConversas(chats.map((conversa) => ({
        ...conversa,
        _participantes: 2,
        _privada: true,
      })));
      setSolicitacoesChat(solicitacoesChat);
      setAlertasIA(alertas);

      setDados({
        usuarios: usuariosAuth.length || contas.length,
        psicologos: psicologosUsuarios.length,
        pendentes: pendentes.length,
        aprovados: aprovados.length,
        recusados: recusados.length,
        colaboradores: colaboradores.length,
        alunos: alunos.length,
        // Alertas reais vêm da tabela alertas_ia.
        // O contador considera os alertas ainda não resolvidos.
        alertas: alertas.filter((alerta) => !Boolean(alerta.resolvido)).length,
        escolas: escolasSalvas.length,
        empresas: empresasSalvas.length,
        moderacoes: moderacoesSalvas.length,
        conversas: chats.length,
      });
    } catch (erro) {
      console.error("Erro ao carregar dados administrativos:", erro);
    }
  }

  function salvarLista(chave, lista) {
    localStorage.setItem(chave, JSON.stringify(lista));
  }

  async function sair() {
    // Primeiro encerra a sessão real do Supabase.
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Erro ao encerrar sessão do Supabase:", error);
      }
    } catch (erro) {
      console.error("Erro ao encerrar sessão do Supabase:", erro);
    }

    // Remove somente os dados locais da sessão atual.
    const chavesSessao = [
      "usuarioLogado",
      "pulsanUsuarioAtual",
      "pulsanEquipePulsan",
      "pulsanAcessoAdmin",
      "pulsanAreaAcesso",
      "pulsanNome",
      "pulsanEmail",
      "pulsanFoto",
      "pulsanTipo",
      "pulsanCRP",
      "pulsanVerificacaoPsicologo",
      "pulsanPsicologoParceiro",
      "pulsanDocumentoProfissional",
      "pulsanNomeDocumento",
    ];

    chavesSessao.forEach((chave) => {
      localStorage.removeItem(chave);
    });

    // Sai da área administrativa e volta para o início do Pulsan.
    if (typeof irPara === "function") {
      irPara("inicio");
    } else {
      // Fallback caso a função de navegação não tenha sido recebida pelo App.
      window.location.href = "/";
    }
  }

  function voltarInicio() {
    carregarDados();
    setPaginaAdmin("inicio");
  }

  function abrirUsuarios() {
    carregarDados();
    setPaginaAdmin("usuarios");
  }

  function abrirPagina(nome) {
    carregarDados();
    setPaginaAdmin(nome);
  }

  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((usuario) => {
      const termo = buscaUsuario.trim().toLowerCase();

      const correspondeBusca =
        !termo ||
        String(usuario.nome || "")
          .toLowerCase()
          .includes(termo) ||
        String(usuario.email || "")
          .toLowerCase()
          .includes(termo) ||
        String(usuario.crp || "")
          .toLowerCase()
          .includes(termo);

      const correspondeTipo =
        filtroTipo === "todos" ||
        usuario.tipo_usuario === filtroTipo;

      return correspondeBusca && correspondeTipo;
    });
  }, [usuarios, buscaUsuario, filtroTipo]);

  const escolasFiltradas = useMemo(() => {
    const termo = buscaEscola.trim().toLowerCase();

    return escolas.filter(
      (escola) =>
        !termo ||
        String(escola.nome || "")
          .toLowerCase()
          .includes(termo) ||
        String(escola.email || "")
          .toLowerCase()
          .includes(termo) ||
        String(escola.cidade || "")
          .toLowerCase()
          .includes(termo)
    );
  }, [escolas, buscaEscola]);

  const empresasFiltradas = useMemo(() => {
    const termo = buscaEmpresa.trim().toLowerCase();

    return empresas.filter(
      (empresa) =>
        !termo ||
        String(empresa.nome || "")
          .toLowerCase()
          .includes(termo) ||
        String(empresa.email || "")
          .toLowerCase()
          .includes(termo) ||
        String(empresa.cnpj || "")
          .toLowerCase()
          .includes(termo)
    );
  }, [empresas, buscaEmpresa]);

  const moderacoesFiltradas = useMemo(() => {
    const termo = buscaModeracao.trim().toLowerCase();

    return moderacoes.filter(
      (item) =>
        !termo ||
        String(item.conteudo || "")
          .toLowerCase()
          .includes(termo) ||
        String(item.categoria || "")
          .toLowerCase()
          .includes(termo) ||
        String(item.usuario || "")
          .toLowerCase()
          .includes(termo)
    );
  }, [moderacoes, buscaModeracao]);

  function adicionarEscola() {
    const nome = window.prompt("Nome da escola:");

    if (!nome || !nome.trim()) return;

    const novaEscola = {
      id: Date.now(),
      nome: nome.trim(),
      email: "",
      cidade: "",
      responsavel: "",
      status: "ativa",
      criado_em: new Date().toISOString(),
    };

    const novaLista = [...escolas, novaEscola];

    salvarLista("pulsanEscolas", novaLista);
    setEscolas(novaLista);
    carregarDados();
  }

  function alterarStatusEscola(id) {
    const novaLista = escolas.map((escola) =>
      escola.id === id
        ? {
            ...escola,
            status:
              escola.status === "ativa"
                ? "inativa"
                : "ativa",
          }
        : escola
    );

    salvarLista("pulsanEscolas", novaLista);
    setEscolas(novaLista);
    carregarDados();
  }

  function excluirEscola(id) {
    if (!window.confirm("Deseja excluir esta escola?")) return;

    const novaLista = escolas.filter(
      (escola) => escola.id !== id
    );

    salvarLista("pulsanEscolas", novaLista);
    setEscolas(novaLista);
    carregarDados();
  }

  function adicionarEmpresa() {
    const nome = window.prompt("Nome da empresa:");

    if (!nome || !nome.trim()) return;

    const novaEmpresa = {
      id: Date.now(),
      nome: nome.trim(),
      email: "",
      cnpj: "",
      responsavel: "",
      status: "ativa",
      criado_em: new Date().toISOString(),
    };

    const novaLista = [...empresas, novaEmpresa];

    salvarLista("pulsanEmpresas", novaLista);
    setEmpresas(novaLista);
    carregarDados();
  }

  function alterarStatusEmpresa(id) {
    const novaLista = empresas.map((empresa) =>
      empresa.id === id
        ? {
            ...empresa,
            status:
              empresa.status === "ativa"
                ? "inativa"
                : "ativa",
          }
        : empresa
    );

    salvarLista("pulsanEmpresas", novaLista);
    setEmpresas(novaLista);
    carregarDados();
  }

  function excluirEmpresa(id) {
    if (!window.confirm("Deseja excluir esta empresa?")) return;

    const novaLista = empresas.filter(
      (empresa) => empresa.id !== id
    );

    salvarLista("pulsanEmpresas", novaLista);
    setEmpresas(novaLista);
    carregarDados();
  }

  async function alterarModeracao(id, status) {
    const item = moderacoes.find((registro) => String(registro.id) === String(id));
    if (!item) return;

    try {
      if (item._origem === "alerta_ia") {
        const resolvido = status === "removido" || status === "resolvido";
        const { error } = await supabase
          .from("alertas_ia")
          .update({
            resolvido,
            visualizado: true,
            visualizado_em: new Date().toISOString(),
          })
          .eq("id", item.id);

        if (error) throw error;
      } else if (item._origem === "denuncia") {
        const novoStatus = status === "removido" ? "resolvida" : "analisada";
        const { error } = await supabase
          .from("denuncias")
          .update({
            status: novoStatus,
            analisada_por: null,
            analisada_em: new Date().toISOString(),
            resposta_admin:
              status === "removido"
                ? "Ocorrência analisada pela equipe Pulsan."
                : "Conteúdo mantido após análise da equipe Pulsan.",
          })
          .eq("id", item.id);

        if (error) throw error;
      }

      await carregarDados();
    } catch (erro) {
      console.error("Erro ao atualizar moderação:", erro);
      alert("Não foi possível atualizar esta ocorrência.");
    }
  }

  function limparModeracoes() {
    // As ocorrências permanecem registradas no banco para auditoria.
    // O botão apenas atualiza a lista, evitando apagar evidências reais.
    carregarDados();
  }

  async function alterarStatusPsicologo(psicologo, acao) {
    if (!psicologo?.id) return;

    try {
      const aprovado = acao === "aprovar";
      const recusado = acao === "recusar";

      const atualizacaoPsicologo = {
        verificado: aprovado,
        ativo: aprovado,
      };

      const { error: erroPsicologo } = await supabase
        .from("psicologos")
        .update(atualizacaoPsicologo)
        .eq("id", psicologo.id);

      if (erroPsicologo) throw erroPsicologo;

      if (psicologo.usuario_id) {
        const atualizacaoPerfil = {
          verificacao_psicologo: aprovado
            ? "aprovado"
            : recusado
              ? "recusado"
              : "pendente",
          psicologo_parceiro: aprovado,
        };

        const { error: erroPerfil } = await supabase
          .from("perfis")
          .update(atualizacaoPerfil)
          .eq("id", psicologo.usuario_id);

        if (erroPerfil) throw erroPerfil;
      }

      await carregarDados();
    } catch (erro) {
      console.error("Erro ao atualizar psicólogo:", erro);
      alert("Não foi possível atualizar o cadastro do psicólogo.");
    }
  }

  async function alterarAtivoPsicologo(psicologo) {
    if (!psicologo?.id) return;

    try {
      const { error } = await supabase
        .from("psicologos")
        .update({ ativo: !Boolean(psicologo.ativo) })
        .eq("id", psicologo.id);

      if (error) throw error;
      await carregarDados();
    } catch (erro) {
      console.error("Erro ao alterar status do psicólogo:", erro);
      alert("Não foi possível alterar o status do psicólogo.");
    }
  }

  function alterarConfiguracao(chave) {
    const novaConfiguracao = {
      ...configuracoes,
      [chave]: !configuracoes[chave],
    };

    setConfiguracoes(novaConfiguracao);

    localStorage.setItem(
      "pulsanConfiguracoesAdmin",
      JSON.stringify(novaConfiguracao)
    );
  }

  if (paginaAdmin === "conteudo") {
    return <PaginaConteudoPulsan voltarInicio={voltarInicio} />;
  }

  if (paginaAdmin === "gestao-psicologos") {
    return (
      <PaginaGestaoPsicologos
        psicologos={psicologosRegistros}
        voltarInicio={voltarInicio}
        alterarStatus={alterarStatusPsicologo}
        alterarAtivo={alterarAtivoPsicologo}
      />
    );
  }

  if (paginaAdmin === "usuarios") {
    return (
      <PaginaUsuarios
        usuarios={usuariosFiltrados}
        totalUsuarios={usuarios.length}
        buscaUsuario={buscaUsuario}
        setBuscaUsuario={setBuscaUsuario}
        filtroTipo={filtroTipo}
        setFiltroTipo={setFiltroTipo}
        voltarInicio={voltarInicio}
      />
    );
  }

  if (paginaAdmin === "escolas") {
    return (
      <PaginaEscolas
        escolas={escolasFiltradas}
        busca={buscaEscola}
        setBusca={setBuscaEscola}
        voltarInicio={voltarInicio}
        adicionarEscola={adicionarEscola}
        alterarStatus={alterarStatusEscola}
        excluirEscola={excluirEscola}
      />
    );
  }

  if (paginaAdmin === "empresas") {
    return (
      <PaginaEmpresas
        empresas={empresasFiltradas}
        busca={buscaEmpresa}
        setBusca={setBuscaEmpresa}
        voltarInicio={voltarInicio}
        adicionarEmpresa={adicionarEmpresa}
        alterarStatus={alterarStatusEmpresa}
        excluirEmpresa={excluirEmpresa}
      />
    );
  }

  if (paginaAdmin === "moderacao") {
    return (
      <PaginaModeracao
        moderacoes={moderacoesFiltradas}
        busca={buscaModeracao}
        setBusca={setBuscaModeracao}
        voltarInicio={voltarInicio}
        alterarModeracao={alterarModeracao}
        limparModeracoes={limparModeracoes}
      />
    );
  }

  if (paginaAdmin === "relatorios") {
    return (
      <PaginaRelatorios
        dados={dados}
        escolas={escolas}
        empresas={empresas}
        moderacoes={moderacoes}
        conversas={conversas}
        solicitacoes={solicitacoesChat}
        voltarInicio={voltarInicio}
      />
    );
  }

  if (paginaAdmin === "conversas") {
    return (
      <PaginaConversas
        conversas={conversas}
        solicitacoes={solicitacoesChat}
        voltarInicio={voltarInicio}
      />
    );
  }

  if (paginaAdmin === "configuracoes") {
    return (
      <PaginaConfiguracoes
        configuracoes={configuracoes}
        alterarConfiguracao={alterarConfiguracao}
        voltarInicio={voltarInicio}
        tema={tema}
        alterarTema={alterarTema}
      />
    );
  }

  const usuarioAdmin = (() => {
    try {
      return JSON.parse(localStorage.getItem("pulsanUsuarioAtual") || "null") || {};
    } catch {
      return {};
    }
  })();

  const pendenciasTotais =
    Number(dados.pendentes || 0) +
    Number(dados.alertas || 0) +
    Number(dados.moderacoes || 0);

  const inicialAdmin =
    String(usuarioAdmin.nome || "Equipe Pulsan")
      .trim()
      .charAt(0)
      .toUpperCase() || "P";

  return (
    <main className={`pulsan-admin-dashboard tema-${tema === "dark" ? "dark" : "light"}`}>
      <style>{`
        .pulsan-admin-dashboard {
          min-height: 100vh;
          background:
            radial-gradient(circle at 85% 0%, rgba(168,199,255,.32), transparent 30%),
            linear-gradient(180deg, #f7faff 0%, #eef5ff 100%);
          color: #0F2D5B;
          padding: 22px;
          box-sizing: border-box;
          font-family: inherit;
        }

        .pulsan-admin-shell {
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 245px minmax(0, 1fr);
          gap: 20px;
        }

        .pulsan-admin-sidebar {
          position: sticky;
          top: 22px;
          height: calc(100vh - 44px);
          min-height: 0;
          max-height: calc(100vh - 44px);
          box-sizing: border-box;
          overflow-y: auto;
          overflow-x: hidden;
          border: 1px solid rgba(168,199,255,.55);
          border-radius: 26px;
          background: rgba(255,255,255,.92);
          box-shadow: 0 18px 50px rgba(15,45,91,.08);
          padding: 18px;
          display: flex;
          flex-direction: column;
        }

        .pulsan-admin-brand {
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 8px 6px 22px;
        }

        .pulsan-admin-brand-mark {
          width: 42px;
          height: 42px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          color: #fff;
          font-size: 21px;
          font-weight: 900;
          background: linear-gradient(135deg, #3A7DFF, #0F2D5B);
          box-shadow: 0 8px 20px rgba(58,125,255,.25);
        }

        .pulsan-admin-nav-title {
          margin: 4px 8px 9px;
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .11em;
          text-transform: uppercase;
          color: #7b91ad;
        }

        .pulsan-admin-nav {
          display: grid;
          gap: 7px;
        }

        .pulsan-admin-nav button {
          width: 100%;
          border: 0;
          border-radius: 13px;
          background: transparent;
          color: #49627f;
          padding: 11px 12px;
          text-align: left;
          font: inherit;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          transition: .18s ease;
        }

        .pulsan-admin-nav button:hover {
          background: #EAF3FF;
          color: #0F2D5B;
          transform: translateX(2px);
        }

        .pulsan-admin-sidebar-spacer {
          flex: 1 1 auto;
          min-height: 14px;
        }

        .pulsan-admin-account,
        .pulsan-admin-sidebar > .pulsan-admin-action {
          flex-shrink: 0;
        }

        .pulsan-admin-account {
          border: 1px solid #dce9fb;
          background: #f7faff;
          border-radius: 17px;
          padding: 11px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .pulsan-admin-avatar {
          width: 38px;
          height: 38px;
          border-radius: 13px;
          flex: 0 0 auto;
          display: grid;
          place-items: center;
          overflow: hidden;
          background: #EAF3FF;
          color: #3A7DFF;
          font-weight: 900;
        }

        .pulsan-admin-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .pulsan-admin-content {
          min-width: 0;
        }

        .pulsan-admin-topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 18px;
        }

        .pulsan-admin-kicker {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border-radius: 999px;
          padding: 7px 11px;
          background: rgba(58,125,255,.10);
          color: #3A7DFF;
          font-size: 11px;
          font-weight: 900;
        }

        .pulsan-admin-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .pulsan-admin-action {
          border: 1px solid #d7e5f8;
          background: rgba(255,255,255,.9);
          color: #0F2D5B;
          border-radius: 12px;
          padding: 10px 13px;
          font: inherit;
          font-size: 12px;
          font-weight: 900;
          cursor: pointer;
          transition: .18s ease;
        }

        .pulsan-admin-action:hover {
          border-color: #A8C7FF;
          background: #EAF3FF;
          transform: translateY(-1px);
        }

        .pulsan-admin-hero {
          position: relative;
          overflow: hidden;
          border-radius: 28px;
          padding: 27px;
          margin-bottom: 18px;
          color: #fff;
          background:
            radial-gradient(circle at 90% 20%, rgba(168,199,255,.35), transparent 25%),
            linear-gradient(135deg, #0F2D5B 0%, #174c96 52%, #3A7DFF 100%);
          box-shadow: 0 22px 55px rgba(15,45,91,.18);
        }

        .pulsan-admin-hero::after {
          content: "";
          position: absolute;
          width: 180px;
          height: 180px;
          right: -55px;
          bottom: -80px;
          border-radius: 50%;
          border: 28px solid rgba(255,255,255,.08);
        }

        .pulsan-admin-hero-inner {
          position: relative;
          z-index: 1;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 22px;
        }

        .pulsan-admin-hero h1 {
          margin: 10px 0 7px;
          font-size: clamp(27px, 4vw, 39px);
          line-height: 1.05;
          letter-spacing: -.03em;
        }

        .pulsan-admin-hero p {
          margin: 0;
          max-width: 620px;
          color: rgba(255,255,255,.78);
          font-size: 14px;
          line-height: 1.6;
        }

        .pulsan-admin-status {
          min-width: 185px;
          border: 1px solid rgba(255,255,255,.16);
          background: rgba(255,255,255,.10);
          backdrop-filter: blur(10px);
          border-radius: 18px;
          padding: 14px;
        }

        .pulsan-admin-status strong {
          display: block;
          font-size: 25px;
          margin-top: 4px;
        }

        .pulsan-admin-status span {
          font-size: 11px;
          color: rgba(255,255,255,.72);
        }

        .pulsan-admin-section-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin: 22px 0 11px;
        }

        .pulsan-admin-section-title h2 {
          margin: 0;
          font-size: 17px;
          color: #0F2D5B;
        }

        .pulsan-admin-section-title span {
          color: #7890ad;
          font-size: 11px;
          font-weight: 800;
        }

        .pulsan-admin-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 11px;
        }

        .pulsan-admin-stat {
          border: 1px solid #dce9fb;
          border-radius: 18px;
          background: rgba(255,255,255,.94);
          padding: 16px;
          box-shadow: 0 9px 28px rgba(15,45,91,.055);
          transition: .18s ease;
        }

        .pulsan-admin-stat:hover {
          transform: translateY(-2px);
          border-color: #A8C7FF;
          box-shadow: 0 14px 32px rgba(58,125,255,.10);
        }

        .pulsan-admin-stat-icon {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 11px;
          background: #EAF3FF;
          margin-bottom: 13px;
          font-size: 17px;
        }

        .pulsan-admin-stat-value {
          font-size: 25px;
          font-weight: 950;
          color: #0F2D5B;
          line-height: 1;
        }

        .pulsan-admin-stat-name {
          margin-top: 7px;
          font-size: 12px;
          font-weight: 900;
          color: #334e6e;
        }

        .pulsan-admin-stat-desc {
          margin-top: 3px;
          font-size: 10px;
          color: #8295ac;
        }

        .pulsan-admin-tools {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 11px;
        }

        .pulsan-admin-tool {
          position: relative;
          min-height: 142px;
          border: 1px solid #dce9fb;
          border-radius: 19px;
          background: rgba(255,255,255,.95);
          padding: 17px;
          text-align: left;
          color: #0F2D5B;
          cursor: pointer;
          box-shadow: 0 9px 28px rgba(15,45,91,.055);
          transition: .18s ease;
        }

        .pulsan-admin-tool:hover {
          transform: translateY(-3px);
          border-color: #A8C7FF;
          box-shadow: 0 16px 35px rgba(58,125,255,.12);
        }

        .pulsan-admin-tool-icon {
          width: 39px;
          height: 39px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          background: #EAF3FF;
          font-size: 19px;
        }

        .pulsan-admin-tool-arrow {
          position: absolute;
          top: 17px;
          right: 17px;
          width: 28px;
          height: 28px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: #f2f7ff;
          color: #3A7DFF;
          font-weight: 900;
        }

        .pulsan-admin-tool h3 {
          margin: 14px 0 5px;
          font-size: 14px;
        }

        .pulsan-admin-tool p {
          margin: 0;
          color: #7186a0;
          font-size: 11px;
          line-height: 1.5;
        }

        .pulsan-admin-tool-badge {
          display: inline-flex;
          margin-top: 10px;
          padding: 5px 8px;
          border-radius: 999px;
          background: #fff7df;
          color: #9b7200;
          font-size: 9px;
          font-weight: 900;
        }

        .pulsan-admin-tool-badge.ok {
          background: #e8f8ef;
          color: #168653;
        }

        .pulsan-admin-dashboard.tema-dark {
          background:
            radial-gradient(circle at 85% 0%, rgba(58,125,255,.20), transparent 30%),
            linear-gradient(180deg, #07172f 0%, #0b203e 100%);
          color: #eef5ff;
        }

        .pulsan-admin-dashboard.tema-dark .pulsan-admin-sidebar,
        .pulsan-admin-dashboard.tema-dark .pulsan-admin-stat,
        .pulsan-admin-dashboard.tema-dark .pulsan-admin-tool,
        .pulsan-admin-dashboard.tema-dark .pulsan-admin-action {
          background: rgba(15,45,91,.82);
          border-color: rgba(168,199,255,.18);
          color: #eef5ff;
        }

        .pulsan-admin-dashboard.tema-dark .pulsan-admin-nav button {
          color: #b8cae0;
        }

        .pulsan-admin-dashboard.tema-dark .pulsan-admin-nav button:hover,
        .pulsan-admin-dashboard.tema-dark .pulsan-admin-action:hover {
          background: rgba(58,125,255,.18);
          color: #fff;
        }

        .pulsan-admin-dashboard.tema-dark .pulsan-admin-section-title h2,
        .pulsan-admin-dashboard.tema-dark .pulsan-admin-stat-value,
        .pulsan-admin-dashboard.tema-dark .pulsan-admin-stat-name {
          color: #fff;
        }

        .pulsan-admin-dashboard.tema-dark .pulsan-admin-stat-desc,
        .pulsan-admin-dashboard.tema-dark .pulsan-admin-section-title span {
          color: #9db3cf;
        }

        .pulsan-admin-dashboard.tema-dark .pulsan-admin-account {
          background: rgba(7,23,47,.7);
          border-color: rgba(168,199,255,.15);
        }

        .pulsan-admin-dashboard.tema-dark .pulsan-admin-tool p {
          color: #a8bad0;
        }

        .pulsan-admin-dashboard.tema-dark .pulsan-admin-tool-arrow {
          background: rgba(58,125,255,.16);
        }

        @media (max-width: 1050px) {
          .pulsan-admin-shell { grid-template-columns: 1fr; }
          .pulsan-admin-sidebar {
            position: static;
            height: auto;
            min-height: 0;
          }
          .pulsan-admin-nav { grid-template-columns: repeat(4, minmax(0, 1fr)); }
          .pulsan-admin-sidebar-spacer { display: none; }
          .pulsan-admin-account { margin-top: 14px; }
          .pulsan-admin-stats { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }

        @media (max-width: 760px) {
          .pulsan-admin-dashboard { padding: 10px; }
          .pulsan-admin-sidebar, .pulsan-admin-hero { border-radius: 20px; }
          .pulsan-admin-nav { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .pulsan-admin-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .pulsan-admin-tools { grid-template-columns: 1fr; }
          .pulsan-admin-hero-inner { align-items: stretch; flex-direction: column; }
          .pulsan-admin-status { min-width: 0; }
          .pulsan-admin-topbar { align-items: flex-start; }
          .pulsan-admin-actions { flex-wrap: wrap; justify-content: flex-end; }
        }

        @media (max-width: 430px) {
          .pulsan-admin-stats { grid-template-columns: 1fr 1fr; gap: 8px; }
          .pulsan-admin-stat { padding: 12px; }
          .pulsan-admin-stat-value { font-size: 22px; }
          .pulsan-admin-nav button { font-size: 11px; }
        }
      `}</style>

      <div className="pulsan-admin-shell">
        <aside className="pulsan-admin-sidebar">
          <div className="pulsan-admin-brand">
            <div className="pulsan-admin-brand-mark">P</div>
            <div>
              <div style={{ fontWeight: 950, fontSize: 18 }}>Pulsan</div>
              <div style={{ fontSize: 10, color: "#7b91ad", fontWeight: 800 }}>
                Administração
              </div>
            </div>
          </div>

          <div className="pulsan-admin-nav-title">Navegação</div>

          <nav className="pulsan-admin-nav">
            <button type="button" onClick={() => setPaginaAdmin("inicio")}>⌂ &nbsp; Visão geral</button>
            <button type="button" onClick={() => abrirPagina("gestao-psicologos")}><Icon name="brain" size={17} /> &nbsp; Psicólogos</button>
            <button type="button" onClick={() => irPara("alertas")}><Icon name="alert" size={17} /> &nbsp; Alertas</button>
            <button type="button" onClick={abrirUsuarios}><Icon name="users" size={17} /> &nbsp; Usuários</button>
            <button type="button" onClick={() => abrirPagina("escolas")}><Icon name="school" size={17} /> &nbsp; Escolas</button>
            <button type="button" onClick={() => abrirPagina("empresas")}><Icon name="company" size={17} /> &nbsp; Empresas</button>
            <button type="button" onClick={() => abrirPagina("moderacao")}><Icon name="shield" size={17} /> &nbsp; Moderação</button>
            <button type="button" onClick={() => abrirPagina("relatorios")}><Icon name="chart" size={17} /> &nbsp; Relatórios</button>
            <button type="button" onClick={() => abrirPagina("conversas")}><Icon name="chat" size={17} /> &nbsp; Conversas</button>
            <button type="button" onClick={() => abrirPagina("configuracoes")}><Icon name="settings" size={17} /> &nbsp; Configurações</button>
             <button type="button" onClick={() => abrirPagina("conteudo")}><Icon name="content" size={17} /> &nbsp; Conteúdo Pulsan</button>
          </nav>

          <div className="pulsan-admin-sidebar-spacer" />

          <div className="pulsan-admin-account">
            <div className="pulsan-admin-avatar">
              {usuarioAdmin.foto_url || usuarioAdmin.foto ? (
                <img src={usuarioAdmin.foto_url || usuarioAdmin.foto} alt="" />
              ) : (
                inicialAdmin
              )}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 900, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {usuarioAdmin.nome || "Equipe Pulsan"}
              </div>
              <div style={{ fontSize: 9, color: "#7b91ad", marginTop: 2 }}>
                Acesso administrativo
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={sair}
            className="pulsan-admin-action"
            style={{ width: "100%", marginTop: 9 }}
          >
            ↪ Sair da conta
          </button>
        </aside>

        <section className="pulsan-admin-content">
          <div className="pulsan-admin-topbar">
            <div className="pulsan-admin-kicker"><Icon name="shield" size={15} /> Área restrita · Equipe Pulsan</div>

            <div className="pulsan-admin-actions">
              <button
                type="button"
                className="pulsan-admin-action"
                onClick={carregarDados}
                title="Atualizar dados"
              >
                <Icon name="refresh" size={16} /> Atualizar
              </button>

              {typeof alterarTema === "function" && (
                <button
                  type="button"
                  className="pulsan-admin-action"
                  onClick={() => alterarTema(tema === "dark" ? "light" : "dark")}
                >
                  {tema === "dark" ? <><Icon name="sun" size={16} /> Claro</> : <><Icon name="moon" size={16} /> Escuro</>}
                </button>
              )}
            </div>
          </div>

          <div className="pulsan-admin-hero">
            <div className="pulsan-admin-hero-inner">
              <div>
                <div style={{ fontSize: 11, fontWeight: 900, opacity: .8 }}>
                  CENTRO DE CONTROLE
                </div>
                <h1>Painel Administrativo</h1>
                <p>
                  Gerencie usuários, profissionais, instituições, alertas e recursos do Pulsan
                  em um único espaço.
                </p>
              </div>

              <div className="pulsan-admin-status">
                <span>Itens que merecem atenção</span>
                <strong>{pendenciasTotais}</strong>
                <span>
                  {pendenciasTotais === 1 ? "pendência registrada" : "itens registrados"}
                </span>
              </div>
            </div>
          </div>

          <div className="pulsan-admin-section-title">
            <h2>Visão geral</h2>
            <span>Dados atuais da plataforma</span>
          </div>

          <div className="pulsan-admin-stats">
            <CardResumoModerno icone="users" titulo="Usuários" valor={dados.usuarios} descricao="Contas cadastradas" />
            <CardResumoModerno icone="brain" titulo="Psicólogos" valor={dados.psicologos} descricao="Profissionais cadastrados" />
            <CardResumoModerno icone="pending" titulo="Pendentes" valor={dados.pendentes} descricao="Aguardando aprovação" />
            <CardResumoModerno icone="partner" titulo="Parceiros" valor={dados.aprovados} descricao="Psicólogos aprovados" />
            <CardResumoModerno icone="alert" titulo="Alertas" valor={dados.alertas} descricao="Alertas registrados" />
            <CardResumoModerno icone="student" titulo="Alunos" valor={dados.alunos} descricao="Usuários alunos" />
            <CardResumoModerno icone="briefcase" titulo="Colaboradores" valor={dados.colaboradores} descricao="Usuários colaboradores" />
            <CardResumoModerno icone="school" titulo="Escolas" valor={dados.escolas} descricao="Instituições cadastradas" />
            <CardResumoModerno icone="company" titulo="Empresas" valor={dados.empresas} descricao="Empresas cadastradas" />
            <CardResumoModerno icone="shield" titulo="Moderação" valor={dados.moderacoes} descricao="Ocorrências registradas" />
            <CardResumoModerno icone="chat" titulo="Conversas" valor={dados.conversas} descricao="Conversas registradas" />
            <CardResumoModerno icone="close" titulo="Recusados" valor={dados.recusados} descricao="Psicólogos recusados" />
          </div>

          <div className="pulsan-admin-section-title">
            <h2>Acesso rápido</h2>
            <span>Ferramentas administrativas</span>
          </div>

          <div className="pulsan-admin-tools">
            <CardAdministracaoModerno
              icone="brain"
              titulo="Gestão de Psicólogos"
              descricao="Analise documentos, acompanhe verificações e aprove ou recuse profissionais."
              destaque={dados.pendentes}
              textoDestaque={dados.pendentes > 0 ? `${dados.pendentes} aguardando análise` : "Tudo em dia"}
              onClick={() => abrirPagina("gestao-psicologos")}
            />

            <CardAdministracaoModerno
              icone="alert"
              titulo="Alertas"
              descricao="Acompanhe situações classificadas e encaminhamentos da plataforma."
              destaque={dados.alertas}
              textoDestaque={`${dados.alertas} alerta(s) registrado(s)`}
              onClick={() => irPara("alertas")}
            />

            <CardAdministracaoModerno icone="users" titulo="Usuários" descricao="Pesquise e filtre as contas cadastradas." onClick={abrirUsuarios} />
            <CardAdministracaoModerno icone="school" titulo="Escolas" descricao="Cadastre, ative, desative ou exclua instituições." onClick={() => abrirPagina("escolas")} />
            <CardAdministracaoModerno icone="company" titulo="Empresas" descricao="Cadastre, ative, desative ou exclua empresas." onClick={() => abrirPagina("empresas")} />
            <CardAdministracaoModerno
              icone="shield"
              titulo="Moderação"
              descricao="Analise conteúdos sinalizados e registre a decisão da equipe."
              destaque={dados.moderacoes}
              textoDestaque={`${dados.moderacoes} ocorrência(s)`}
              onClick={() => abrirPagina("moderacao")}
            />
            <CardAdministracaoModerno icone="chart" titulo="Relatórios" descricao="Consulte os principais indicadores administrativos." onClick={() => abrirPagina("relatorios")} />
            <CardAdministracaoModerno icone="chat" titulo="Conversas" descricao="Consulte as conversas registradas respeitando o anonimato." onClick={() => abrirPagina("conversas")} />
            <CardAdministracaoModerno icone="settings" titulo="Configurações" descricao="Controle recursos e preferências administrativas." onClick={() => abrirPagina("configuracoes")} />
             <CardAdministracaoModerno icone="content" titulo="Conteúdo Pulsan" descricao="Gerencie reflexões e Momentos Pulsan publicados no aplicativo." onClick={() => abrirPagina("conteudo")} />
          </div>
        </section>
      </div>
    </main>
  );
}


function PaginaConteudoPulsan({ voltarInicio }) {
  const [aba, setAba] = useState("reflexoes");
  const [reflexoes, setReflexoes] = useState([]);
  const [momentos, setMomentos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [editando, setEditando] = useState(null);

  const sentimentos = [
    "Cansado", "Ansioso", "Triste", "Pensando demais", "Irritado", "Vazio",
    "Desanimado", "Com medo", "Inseguro", "Sobrecarregado", "Frustrado",
    "Medo do futuro", "Depressivo", "Solitário", "Sem esperança",
  ];

  async function carregar() {
    setCarregando(true);
    const [r, m] = await Promise.all([
      supabase.from("reflexoes").select("id,sentimento,mensagem,pergunta,acao,categoria,nivel,ativa,ativo").order("id", { ascending: false }),
      supabase.from("momentos_pulsan").select("id,sentimento,titulo,descricao,reflexao,video_url,audio_url,ordem,ativo,created_at,updated_at").order("ordem", { ascending: true }),
    ]);
    if (r.error) console.error("Erro ao carregar reflexões:", r.error);
    if (m.error) console.error("Erro ao carregar Momentos Pulsan:", m.error);
    setReflexoes(r.data || []);
    setMomentos(m.data || []);
    setCarregando(false);
  }

  useEffect(() => { carregar(); }, []);

  async function excluirReflexao(id) {
    if (!window.confirm("Excluir esta reflexão?")) return;
    const { error } = await supabase.from("reflexoes").delete().eq("id", id);
    if (error) return alert("Não foi possível excluir a reflexão.");
    carregar();
  }

  async function alternarReflexao(item) {
    const ativo = !(item.ativa !== false && item.ativo !== false);
    const { error } = await supabase.from("reflexoes").update({ ativa: ativo, ativo: ativo }).eq("id", item.id);
    if (error) return alert("Não foi possível alterar o status da reflexão.");
    carregar();
  }

  async function excluirMomento(id) {
    if (!window.confirm("Excluir este Momento Pulsan?")) return;
    const { error } = await supabase.from("momentos_pulsan").delete().eq("id", id);
    if (error) return alert("Não foi possível excluir o momento.");
    carregar();
  }

  async function alternarMomento(item) {
    const { error } = await supabase.from("momentos_pulsan").update({ ativo: !item.ativo, updated_at: new Date().toISOString() }).eq("id", item.id);
    if (error) return alert("Não foi possível alterar o status do momento.");
    carregar();
  }

  if (editando) {
    return (
      <PaginaBase titulo={editando.tipo === "momento" ? "Editar Momento Pulsan" : "Editar reflexão"} icone="content" voltarInicio={() => { setEditando(null); carregar(); }}>
        <EditorConteudoPulsan item={editando.item} tipo={editando.tipo} cancelar={() => setEditando(null)} salvo={() => { setEditando(null); carregar(); }} />
      </PaginaBase>
    );
  }

  return (
    <PaginaBase titulo="Conteúdo Pulsan" icone="content" voltarInicio={voltarInicio}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        <button type="button" style={aba === "reflexoes" ? botaoPrimario : botaoPequeno} onClick={() => setAba("reflexoes")}>Reflexões / Cards</button>
        <button type="button" style={aba === "momentos" ? botaoPrimario : botaoPequeno} onClick={() => setAba("momentos")}>Momentos Pulsan</button>
        <button type="button" style={botaoPequeno} onClick={carregar}><Icon name="refresh" size={16} /> Atualizar</button>
      </div>
      {carregando ? <EstadoVazio icone="pending" titulo="Carregando conteúdo" texto="Buscando os conteúdos no Supabase." /> : aba === "reflexoes" ? (
        <div style={lista}>
          {reflexoes.length === 0 ? <EstadoVazio icone="content" titulo="Nenhuma reflexão" texto="Cadastre a primeira reflexão no painel." /> : reflexoes.map((item) => (
            <div key={item.id} style={cardLista}>
              <strong>{item.sentimento || "Sem sentimento"}</strong>
              <p style={textoSecundario}>{item.mensagem || "Sem mensagem"}</p>
              {item.pergunta && <p style={textoSecundario}><b>Pergunta:</b> {item.pergunta}</p>}
              {item.acao && <p style={textoSecundario}><b>Ação:</b> {item.acao}</p>}
              <div style={detalhes}><span style={badgeNeutro}>{item.categoria || "geral"}</span><span style={badgeNeutro}>{item.nivel || "normal"}</span><span style={item.ativa !== false && item.ativo !== false ? badgeVerde : badgeVermelho}>{item.ativa !== false && item.ativo !== false ? "Ativa" : "Inativa"}</span></div>
              <div style={acoes}><button type="button" style={botaoPequeno} onClick={() => setEditando({ tipo: "reflexao", item })}>Editar</button><button type="button" style={botaoPequeno} onClick={() => alternarReflexao(item)}>{item.ativa !== false && item.ativo !== false ? "Desativar" : "Ativar"}</button><button type="button" style={botaoPerigo} onClick={() => excluirReflexao(item.id)}>Excluir</button></div>
            </div>
          ))}
        </div>
      ) : (
        <div style={lista}>
          {momentos.length === 0 ? <EstadoVazio icone="video" titulo="Nenhum Momento Pulsan" texto="Cadastre o primeiro momento no painel." /> : momentos.map((item) => (
            <div key={item.id} style={cardLista}>
              <strong>{item.titulo}</strong><div style={textoSecundario}>{item.sentimento}</div><p style={textoSecundario}>{item.descricao || item.reflexao || "Sem descrição"}</p>
              <div style={detalhes}><span style={badgeNeutro}>Ordem: {item.ordem}</span><span style={badgeNeutro}>Vídeo {item.video_url ? "✓" : "—"}</span><span style={badgeNeutro}>Áudio {item.audio_url ? "✓" : "—"}</span><span style={item.ativo ? badgeVerde : badgeVermelho}>{item.ativo ? "Ativo" : "Inativo"}</span></div>
              <div style={acoes}><button type="button" style={botaoPequeno} onClick={() => setEditando({ tipo: "momento", item })}>Editar</button><button type="button" style={botaoPequeno} onClick={() => alternarMomento(item)}>{item.ativo ? "Desativar" : "Ativar"}</button><button type="button" style={botaoPerigo} onClick={() => excluirMomento(item.id)}>Excluir</button></div>
            </div>
          ))}
        </div>
      )}
    </PaginaBase>
  );
}

function EditorConteudoPulsan({ item, tipo, cancelar, salvo }) {
  const [form, setForm] = useState(tipo === "momento" ? {
    sentimento: item?.sentimento || "Cansado", titulo: item?.titulo || "", descricao: item?.descricao || "", reflexao: item?.reflexao || "", video_url: item?.video_url || "", audio_url: item?.audio_url || "", ordem: item?.ordem || 1, ativo: item?.ativo !== false,
  } : {
    sentimento: item?.sentimento || "Cansado", mensagem: item?.mensagem || "", pergunta: item?.pergunta || "", acao: item?.acao || "", categoria: item?.categoria || "geral", nivel: item?.nivel || "normal", ativa: item?.ativa !== false, ativo: item?.ativo !== false,
  });
  const [salvando, setSalvando] = useState(false);
  const sentimentos = ["Cansado","Ansioso","Triste","Pensando demais","Irritado","Vazio","Desanimado","Com medo","Inseguro","Sobrecarregado","Frustrado","Medo do futuro","Depressivo","Solitário","Sem esperança"];
  const alterar = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));
  async function salvar() {
    setSalvando(true);
    const payload = tipo === "momento" ? { ...form, ordem: Number(form.ordem) || 1, updated_at: new Date().toISOString() } : { ...form, ativa: Boolean(form.ativa), ativo: Boolean(form.ativo) };
    const q = item?.id ? supabase.from(tipo === "momento" ? "momentos_pulsan" : "reflexoes").update(payload).eq("id", item.id) : supabase.from(tipo === "momento" ? "momentos_pulsan" : "reflexoes").insert(payload);
    const { error } = await q;
    setSalvando(false);
    if (error) { console.error(error); alert("Não foi possível salvar. Confira as colunas e as políticas do Supabase."); return; }
    salvo();
  }
  return <div style={cardLista}>
    <div style={{ display: "grid", gap: 12 }}>
      <label>Sentimento<select value={form.sentimento} onChange={(e) => alterar("sentimento", e.target.value)} style={inputStyle}>{sentimentos.map((s) => <option key={s}>{s}</option>)}</select></label>
      {tipo === "momento" ? <>
        <label>Título<input value={form.titulo} onChange={(e) => alterar("titulo", e.target.value)} style={inputStyle} /></label>
        <label>Descrição<textarea value={form.descricao} onChange={(e) => alterar("descricao", e.target.value)} style={{ ...inputStyle, minHeight: 90 }} /></label>
        <label>Reflexão<textarea value={form.reflexao} onChange={(e) => alterar("reflexao", e.target.value)} style={{ ...inputStyle, minHeight: 90 }} /></label>
        <label>URL do vídeo<input value={form.video_url} onChange={(e) => alterar("video_url", e.target.value)} style={inputStyle} /></label>
        <label>URL do áudio<input value={form.audio_url} onChange={(e) => alterar("audio_url", e.target.value)} style={inputStyle} /></label>
        <label>Ordem<input type="number" value={form.ordem} onChange={(e) => alterar("ordem", e.target.value)} style={inputStyle} /></label>
        <label><input type="checkbox" checked={form.ativo} onChange={(e) => alterar("ativo", e.target.checked)} /> Ativo</label>
      </> : <>
        <label>Mensagem<textarea value={form.mensagem} onChange={(e) => alterar("mensagem", e.target.value)} style={{ ...inputStyle, minHeight: 120 }} /></label>
        <label>Pergunta<textarea value={form.pergunta} onChange={(e) => alterar("pergunta", e.target.value)} style={{ ...inputStyle, minHeight: 80 }} /></label>
        <label>Ação<textarea value={form.acao} onChange={(e) => alterar("acao", e.target.value)} style={{ ...inputStyle, minHeight: 80 }} /></label>
        <label>Categoria<input value={form.categoria} onChange={(e) => alterar("categoria", e.target.value)} style={inputStyle} /></label>
        <label>Nível<input value={form.nivel} onChange={(e) => alterar("nivel", e.target.value)} style={inputStyle} /></label>
        <label><input type="checkbox" checked={form.ativa} onChange={(e) => alterar("ativa", e.target.checked)} /> Ativa</label>
        <label><input type="checkbox" checked={form.ativo} onChange={(e) => alterar("ativo", e.target.checked)} /> Ativo</label>
      </>}
      <div style={acoes}><button type="button" style={botaoPrimario} onClick={salvar} disabled={salvando}>{salvando ? "Salvando..." : "Salvar"}</button><button type="button" style={botaoPequeno} onClick={cancelar}>Cancelar</button></div>
    </div>
  </div>;
}

function CardResumoModerno({ icone, titulo, valor, descricao }) {
  return (
    <div className="pulsan-admin-stat">
      <div className="pulsan-admin-stat-icon"><Icon name={icone} size={18} /></div>
      <div className="pulsan-admin-stat-value">{valor}</div>
      <div className="pulsan-admin-stat-name">{titulo}</div>
      <div className="pulsan-admin-stat-desc">{descricao}</div>
    </div>
  );
}

function CardAdministracaoModerno({
  icone,
  titulo,
  descricao,
  destaque,
  textoDestaque,
  onClick,
}) {
  const possuiDestaque = typeof destaque === "number";

  return (
    <button type="button" className="pulsan-admin-tool" onClick={onClick}>
      <div className="pulsan-admin-tool-icon"><Icon name={icone} size={19} /></div>
      <div className="pulsan-admin-tool-arrow"><Icon name="arrow" size={15} /></div>
      <h3>{titulo}</h3>
      <p>{descricao}</p>

      {possuiDestaque && (
        <span className={`pulsan-admin-tool-badge ${destaque === 0 ? "ok" : ""}`}>
          {destaque === 0 ? <Icon name="check" size={13} /> : <Icon name="pending" size={13} />}
          {textoDestaque}
        </span>
      )}
    </button>
  );
}

/* =========================================================
   PÁGINA DE ESCOLAS
========================================================= */

function PaginaGestaoPsicologos({
  psicologos = [],
  voltarInicio,
  alterarStatus,
  alterarAtivo,
}) {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState("todos");

  const lista = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return psicologos.filter((p) => {
      const status = p.verificado
        ? "aprovado"
        : p.ativo === false && p.verificado === false
          ? "pendente"
          : "pendente";

      const bateFiltro = filtro === "todos" || status === filtro;
      const bateBusca = !termo || [
        p.nome,
        p.email,
        p.crp,
        p.estado_crp,
        p.area_atuacao,
        p.telefone,
      ].filter(Boolean).some((valor) => String(valor).toLowerCase().includes(termo));

      return bateFiltro && bateBusca;
    });
  }, [psicologos, busca, filtro]);

  const pendentes = psicologos.filter((p) => !p.verificado).length;
  const aprovados = psicologos.filter((p) => p.verificado).length;

  return (
    <PaginaBase titulo="Psicólogos parceiros" subtitulo="Analise, aprove e gerencie os profissionais cadastrados no Pulsan." voltarInicio={voltarInicio}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 14, marginBottom: 20 }}>
        <CardResumoModerno icone="brain" titulo="Total" valor={psicologos.length} descricao="Cadastros" />
        <CardResumoModerno icone="pending" titulo="Pendentes" valor={pendentes} descricao="Aguardando análise" />
        <CardResumoModerno icone="check" titulo="Aprovados" valor={aprovados} descricao="Parceiros verificados" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 190px", gap: 12, marginBottom: 18 }}>
        <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por nome, e-mail, CRP ou área..." style={inputStyle} />
        <select value={filtro} onChange={(e) => setFiltro(e.target.value)} style={inputStyle}>
          <option value="todos">Todos</option>
          <option value="pendente">Pendentes</option>
          <option value="aprovado">Aprovados</option>
        </select>
      </div>

      {lista.length === 0 ? (
        <EstadoVazio icone="brain" titulo="Nenhum psicólogo encontrado" texto="Não há cadastros correspondentes aos filtros atuais." />
      ) : (
        <div style={{ display: "grid", gap: 14 }}>
          {lista.map((p) => {
            const aprovado = Boolean(p.verificado);
            return (
              <div key={p.id} style={{ background: "#fff", border: "1px solid #dbe7f5", borderRadius: 20, padding: 18, boxShadow: "0 8px 24px rgba(15,45,91,.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                  <div style={{ display: "flex", gap: 14, alignItems: "flex-start", minWidth: 0 }}>
                    <div style={{ width: 54, height: 54, borderRadius: "50%", background: "#EAF3FF", display: "grid", placeItems: "center", fontSize: 24, flexShrink: 0 }}><Icon name="brain" size={24} /></div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 18, fontWeight: 950, color: "#0F2D5B" }}>{p.nome || "Nome não informado"}</div>
                      <div style={{ marginTop: 4, color: "#5f7692", fontSize: 13 }}>{p.email || "E-mail não informado"}</div>
                      <div style={{ marginTop: 8, display: "flex", gap: 7, flexWrap: "wrap" }}>
                        <span style={badgeStyle(aprovado ? "#e9f9ef" : "#fff5dc", aprovado ? "#167347" : "#9a6500")}>{aprovado ? <><Icon name="check" size={13} /> Aprovado</> : <><Icon name="pending" size={13} /> Pendente</>}</span>
                        <span style={badgeStyle(p.ativo ? "#eef6ff" : "#f2f4f7", p.ativo ? "#2563a8" : "#667085")}>{p.ativo ? "Ativo" : "Inativo"}</span>
                        {p.disponivel && <span style={badgeStyle("#eefcf8", "#13795b")}>Disponível</span>}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                    {!aprovado && <button type="button" onClick={() => alterarStatus(p, "aprovar")} style={buttonPrimary}>Aprovar</button>}
                    {!aprovado && <button type="button" onClick={() => alterarStatus(p, "recusar")} style={buttonDanger}>Recusar</button>}
                    {aprovado && <button type="button" onClick={() => alterarAtivo(p)} style={buttonSecondary}>{p.ativo ? "Desativar" : "Ativar"}</button>}
                  </div>
                </div>

                <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 10 }}>
                  <InfoMini titulo="CRP" valor={p.crp || "Não informado"} />
                  <InfoMini titulo="Estado do CRP" valor={p.estado_crp || "Não informado"} />
                  <InfoMini titulo="Telefone" valor={p.telefone || "Não informado"} />
                  <InfoMini titulo="Área de atuação" valor={p.area_atuacao || "Não informada"} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PaginaBase>
  );
}

function InfoMini({ titulo, valor }) {
  return (
    <div style={{ background: "#f7faff", borderRadius: 14, padding: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 850, color: "#7890aa", textTransform: "uppercase" }}>{titulo}</div>
      <div style={{ marginTop: 4, color: "#183b63", fontWeight: 800, fontSize: 13, wordBreak: "break-word" }}>{valor}</div>
    </div>
  );
}

function badgeStyle(background, color) {
  return { display: "inline-flex", alignItems: "center", padding: "6px 9px", borderRadius: 999, background, color, fontSize: 11, fontWeight: 900 };
}

const buttonPrimary = { border: "none", borderRadius: 12, padding: "10px 14px", background: "#3A7DFF", color: "#fff", fontWeight: 900, cursor: "pointer" };
const buttonDanger = { border: "1px solid #f1b5b5", borderRadius: 12, padding: "10px 14px", background: "#fff5f5", color: "#a33434", fontWeight: 900, cursor: "pointer" };
const buttonSecondary = { border: "1px solid #cbd9ea", borderRadius: 12, padding: "10px 14px", background: "#fff", color: "#23496f", fontWeight: 900, cursor: "pointer" };

function PaginaEscolas({
  escolas,
  busca,
  setBusca,
  voltarInicio,
  adicionarEscola,
  alterarStatus,
  excluirEscola,
}) {
  return (
    <PaginaBase
      titulo="Gestão de Escolas"
      icone="school"
      voltarInicio={voltarInicio}
    >
      <div style={barraAcao}>
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar escola..."
          style={inputStyle}
        />

        <button
          type="button"
          onClick={adicionarEscola}
          style={botaoPrimario}
        >
          + Nova escola
        </button>
      </div>

      <div style={contadorBox}>
        <strong>{escolas.length}</strong>
        <span> instituição(ões) encontrada(s)</span>
      </div>

      {escolas.length === 0 ? (
        <EstadoVazio
          icone="school"
          titulo="Nenhuma escola cadastrada"
          texto="As instituições cadastradas aparecerão aqui."
        />
      ) : (
        <div style={lista}>
          {escolas.map((escola) => (
            <div key={escola.id} style={cardLista}>
              <div style={linhaPrincipal}>
                <div style={avatarGrande}><Icon name="school" size={24} /></div>

                <div style={{ flex: 1 }}>
                  <strong>{escola.nome}</strong>

                  <div style={textoSecundario}>
                    {escola.email || "E-mail não informado"}
                  </div>

                  <div style={detalhes}>
                    {escola.cidade && (
                      <span style={badgeNeutro}>
                        <span style={{display:"inline-flex",alignItems:"center",gap:5}}><Icon name="location" size={13} />{escola.cidade}</span>
                      </span>
                    )}

                    <span
                      style={
                        escola.status === "ativa"
                          ? badgeVerde
                          : badgeVermelho
                      }
                    >
                      {escola.status === "ativa"
                        ? "Ativa"
                        : "Inativa"}
                    </span>
                  </div>
                </div>
              </div>

              <div style={acoes}>
                <button
                  type="button"
                  onClick={() => alterarStatus(escola.id)}
                  style={botaoPequeno}
                >
                  {escola.status === "ativa"
                    ? "Desativar"
                    : "Ativar"}
                </button>

                <button
                  type="button"
                  onClick={() => excluirEscola(escola.id)}
                  style={botaoPerigo}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PaginaBase>
  );
}

/* =========================================================
   PÁGINA DE EMPRESAS
========================================================= */

function PaginaEmpresas({
  empresas,
  busca,
  setBusca,
  voltarInicio,
  adicionarEmpresa,
  alterarStatus,
  excluirEmpresa,
}) {
  return (
    <PaginaBase
      titulo="Gestão de Empresas"
      icone="company"
      voltarInicio={voltarInicio}
    >
      <div style={barraAcao}>
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar empresa..."
          style={inputStyle}
        />

        <button
          type="button"
          onClick={adicionarEmpresa}
          style={botaoPrimario}
        >
          + Nova empresa
        </button>
      </div>

      <div style={contadorBox}>
        <strong>{empresas.length}</strong>
        <span> empresa(s) encontrada(s)</span>
      </div>

      {empresas.length === 0 ? (
        <EstadoVazio
          icone="company"
          titulo="Nenhuma empresa cadastrada"
          texto="As empresas participantes aparecerão aqui."
        />
      ) : (
        <div style={lista}>
          {empresas.map((empresa) => (
            <div key={empresa.id} style={cardLista}>
              <div style={linhaPrincipal}>
                <div style={avatarGrande}><Icon name="company" size={24} /></div>

                <div style={{ flex: 1 }}>
                  <strong>{empresa.nome}</strong>

                  <div style={textoSecundario}>
                    {empresa.email || "E-mail não informado"}
                  </div>

                  <div style={detalhes}>
                    {empresa.cnpj && (
                      <span style={badgeNeutro}>
                        CNPJ: {empresa.cnpj}
                      </span>
                    )}

                    <span
                      style={
                        empresa.status === "ativa"
                          ? badgeVerde
                          : badgeVermelho
                      }
                    >
                      {empresa.status === "ativa"
                        ? "Ativa"
                        : "Inativa"}
                    </span>
                  </div>
                </div>
              </div>

              <div style={acoes}>
                <button
                  type="button"
                  onClick={() => alterarStatus(empresa.id)}
                  style={botaoPequeno}
                >
                  {empresa.status === "ativa"
                    ? "Desativar"
                    : "Ativar"}
                </button>

                <button
                  type="button"
                  onClick={() => excluirEmpresa(empresa.id)}
                  style={botaoPerigo}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PaginaBase>
  );
}

/* =========================================================
   PÁGINA DE MODERAÇÃO
========================================================= */

function PaginaModeracao({
  moderacoes,
  busca,
  setBusca,
  voltarInicio,
  alterarModeracao,
  limparModeracoes,
}) {
  return (
    <PaginaBase
      titulo="Moderação"
      icone="shield"
      voltarInicio={voltarInicio}
    >
      <div style={barraAcao}>
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar ocorrência..."
          style={inputStyle}
        />

        {moderacoes.length > 0 && (
          <button
            type="button"
            onClick={limparModeracoes}
            style={botaoPerigo}
          >
            Atualizar ocorrências
          </button>
        )}
      </div>

      {moderacoes.length === 0 ? (
        <EstadoVazio
          icone="shield"
          titulo="Nenhuma ocorrência"
          texto="Conteúdos sinalizados para moderação aparecerão aqui."
        />
      ) : (
        <div style={lista}>
          {moderacoes.map((item) => (
            <div key={item.id} style={cardLista}>
              <div style={linhaPrincipal}>
                <div style={avatarGrande}>
                  {item.categoria === "grave"
                    ? <Icon name="alert" size={22} />
                    : <Icon name="pending" size={22} />}
                </div>

                <div style={{ flex: 1 }}>
                  <strong>
                    {item.categoria || "Conteúdo sinalizado"}
                  </strong>

                  <div
                    style={{
                      ...textoSecundario,
                      marginTop: "6px",
                    }}
                  >
                    {item.conteudo ||
                      "Conteúdo não informado."}
                  </div>

                  <div style={detalhes}>
                    <span style={badgeNeutro}>
                      Usuário:{" "}
                      {item.usuario || "Anônimo"}
                    </span>

                    <span
                      style={
                        item.status === "aprovado"
                          ? badgeVerde
                          : item.status === "removido"
                          ? badgeVermelho
                          : badgeAmarelo
                      }
                    >
                      {item.status || "pendente"}
                    </span>
                  </div>
                </div>
              </div>

              <div style={acoes}>
                <button
                  type="button"
                  onClick={() =>
                    alterarModeracao(
                      item.id,
                      "aprovado"
                    )
                  }
                  style={botaoPequeno}
                >
                  Manter conteúdo
                </button>

                <button
                  type="button"
                  onClick={() =>
                    alterarModeracao(
                      item.id,
                      "removido"
                    )
                  }
                  style={botaoPerigo}
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PaginaBase>
  );
}

/* =========================================================
   RELATÓRIOS
========================================================= */

function PaginaRelatorios({
  dados,
  escolas,
  empresas,
  moderacoes,
  conversas,
  voltarInicio,
}) {
  const taxaAprovacao =
    dados.psicologos > 0
      ? Math.round(
          (dados.aprovados / dados.psicologos) * 100
        )
      : 0;

  return (
    <PaginaBase
      titulo="Relatórios"
      icone="chart"
      voltarInicio={voltarInicio}
    >
      <div style={gridRelatorios}>
        <RelatorioCard
          titulo="Usuários"
          valor={dados.usuarios}
          descricao="Total de contas"
        />

        <RelatorioCard
          titulo="Psicólogos"
          valor={dados.psicologos}
          descricao="Profissionais cadastrados"
        />

        <RelatorioCard
          titulo="Taxa de aprovação"
          valor={`${taxaAprovacao}%`}
          descricao="Psicólogos aprovados"
        />

        <RelatorioCard
          titulo="Escolas"
          valor={escolas.length}
          descricao="Instituições"
        />

        <RelatorioCard
          titulo="Empresas"
          valor={empresas.length}
          descricao="Empresas participantes"
        />

        <RelatorioCard
          titulo="Moderação"
          valor={moderacoes.length}
          descricao="Ocorrências"
        />

        <RelatorioCard
          titulo="Conversas"
          valor={conversas.length}
          descricao="Conversas registradas"
        />

        <RelatorioCard
          titulo="Alertas"
          valor={dados.alertas}
          descricao="Alertas de IA"
        />
      </div>

      <div style={infoBox}>
        <strong style={{display:"inline-flex",alignItems:"center",gap:7}}><Icon name="chart" size={17} /> Indicadores da plataforma</strong>

        <p style={textoSecundario}>
          Esta área será ampliada posteriormente com
          gráficos, períodos, filtros e exportação de
          relatórios.
        </p>
      </div>
    </PaginaBase>
  );
}

/* =========================================================
   CONVERSAS
========================================================= */

function mascararIdConversa(id) {
  if (!id) return "Participante não identificado";
  const valor = String(id);
  if (valor.length <= 10) return "Participante protegido";
  return `Participante ••••${valor.slice(-6)}`;
}

function PaginaConversas({ conversas, solicitacoes = [], voltarInicio }) {
  const pendentes = solicitacoes.filter(
    (solicitacao) => String(solicitacao.status || "").toLowerCase() === "pendente"
  );

  return (
    <PaginaBase
      titulo="Conversas privadas"
      icone="chat"
      voltarInicio={voltarInicio}
    >
      <div style={gridResumo}>
        <div style={resumoCard}>
          <span style={resumoNumero}>{conversas.length}</span>
          <span style={resumoLabel}>Conversas iniciadas</span>
        </div>
        <div style={resumoCard}>
          <span style={resumoNumero}>{pendentes.length}</span>
          <span style={resumoLabel}>Solicitações pendentes</span>
        </div>
        <div style={resumoCard}>
          <span style={resumoNumero}>2</span>
          <span style={resumoLabel}>Pessoas por conversa</span>
        </div>
      </div>

      {conversas.length === 0 ? (
        <EstadoVazio
          icone="chat"
          titulo="Nenhuma conversa registrada"
          texto="As conversas privadas aparecerão aqui quando duas pessoas iniciarem um atendimento entre si."
        />
      ) : (
        <div style={lista}>
          {conversas.map((conversa, index) => {
            const status = String(conversa.status || "ativa").toLowerCase();
            const statusTexto =
              status === "ativa"
                ? "Ativa"
                : status === "encerrada"
                ? "Encerrada"
                : status;

            return (
              <div
                key={conversa.id || index}
                style={cardLista}
              >
                <div style={linhaPrincipal}>
                  <div style={avatarGrande}><Icon name="lock" size={16} /></div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <strong>Conversa privada</strong>

                    <div style={textoSecundario}>
                      Somente os dois participantes possuem acesso ao conteúdo desta conversa.
                    </div>

                    <div style={participantesConversa}>
                      <span style={participanteChip}>
                        {mascararIdConversa(conversa.solicitante_id)}
                      </span>
                      <span style={separadorParticipantes}>↔</span>
                      <span style={participanteChip}>
                        {mascararIdConversa(conversa.destinatario_id)}
                      </span>
                    </div>

                    <div style={metaConversa}>
                      <span style={statusChip(status)}>{statusTexto}</span>
                      <span>
                        {conversa.ultima_mensagem_em
                          ? `Última mensagem: ${new Date(conversa.ultima_mensagem_em).toLocaleString("pt-BR")}`
                          : conversa.criada_em
                          ? `Criada: ${new Date(conversa.criada_em).toLocaleString("pt-BR")}`
                          : "Data não informada"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={infoBox}>
        <strong style={{display:"inline-flex",alignItems:"center",gap:7}}><Icon name="lock" size={17} /> Privacidade das conversas</strong>
        <p style={textoSecundario}>
          Cada conversa é vinculada a exatamente dois participantes: o solicitante e o destinatário.
          O painel administrativo não carrega nem exibe o conteúdo das mensagens privadas.
        </p>
        <p style={textoSecundario}>
          As mensagens permanecem na tabela de mensagens da conversa e o acesso é controlado pelas
          políticas de segurança do Supabase, permitindo leitura e envio somente aos participantes daquela conversa.
        </p>
      </div>
    </PaginaBase>
  );
}


const gridResumo = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
  gap: 12,
  marginBottom: 18,
};

const resumoCard = {
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(168,199,255,0.22)",
  borderRadius: 16,
  padding: "16px 18px",
  display: "flex",
  flexDirection: "column",
  gap: 4,
};

const resumoNumero = {
  fontSize: 24,
  fontWeight: 900,
};

const resumoLabel = {
  fontSize: 12,
  opacity: 0.75,
};

const participantesConversa = {
  display: "flex",
  alignItems: "center",
  gap: 8,
  flexWrap: "wrap",
  marginTop: 12,
};

const participanteChip = {
  display: "inline-flex",
  alignItems: "center",
  minHeight: 30,
  padding: "6px 10px",
  borderRadius: 999,
  background: "rgba(58,125,255,0.12)",
  border: "1px solid rgba(168,199,255,0.22)",
  fontSize: 12,
  fontWeight: 800,
};

const separadorParticipantes = {
  opacity: 0.7,
  fontWeight: 900,
};

const metaConversa = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  flexWrap: "wrap",
  marginTop: 12,
  fontSize: 11,
  opacity: 0.8,
};

function statusChip(status) {
  return {
    display: "inline-flex",
    alignItems: "center",
    padding: "5px 9px",
    borderRadius: 999,
    background: status === "ativa" ? "rgba(46, 204, 113, 0.13)" : "rgba(168,199,255,0.12)",
    border: "1px solid rgba(168,199,255,0.22)",
    fontWeight: 900,
    textTransform: "capitalize",
  };
}

/* =========================================================
   CONFIGURAÇÕES
========================================================= */

function PaginaConfiguracoes({
  configuracoes,
  alterarConfiguracao,
  voltarInicio,
  tema,
  alterarTema,
}) {
  return (
    <PaginaBase
      titulo="Configurações"
      icone="settings"
      voltarInicio={voltarInicio}
    >
      <div style={lista}>
        <ConfiguracaoItem
          titulo="Moderação automática"
          descricao="Permite que a IA analise conteúdos automaticamente."
          valor={configuracoes.moderacaoAutomatica}
          onClick={() =>
            alterarConfiguracao(
              "moderacaoAutomatica"
            )
          }
        />

        <ConfiguracaoItem
          titulo="Alertas automáticos"
          descricao="Permite gerar alertas a partir das classificações da IA."
          valor={configuracoes.alertasAutomaticos}
          onClick={() =>
            alterarConfiguracao("alertasAutomaticos")
          }
        />

        <ConfiguracaoItem
          titulo="Cadastro de escolas"
          descricao="Permite novos cadastros de instituições escolares."
          valor={configuracoes.permitirCadastroEscola}
          onClick={() =>
            alterarConfiguracao(
              "permitirCadastroEscola"
            )
          }
        />

        <ConfiguracaoItem
          titulo="Cadastro de empresas"
          descricao="Permite novos cadastros de empresas."
          valor={configuracoes.permitirCadastroEmpresa}
          onClick={() =>
            alterarConfiguracao(
              "permitirCadastroEmpresa"
            )
          }
        />

        <ConfiguracaoItem
          titulo="Modo manutenção"
          descricao="Ativa o modo de manutenção da plataforma."
          valor={configuracoes.modoManutencao}
          onClick={() =>
            alterarConfiguracao("modoManutencao")
          }
        />

        {typeof alterarTema === "function" && (
          <div style={cardLista}>
            <div>
              <strong>Aparência</strong>

              <p style={textoSecundario}>
                Tema visual utilizado pela equipe.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                alterarTema(
                  tema === "dark" ? "light" : "dark"
                )
              }
              style={botaoPequeno}
            >
              {tema === "dark"
                ? <><Icon name="sun" size={16} /> Claro</>
                : <><Icon name="moon" size={16} /> Escuro</>}
            </button>
          </div>
        )}
      </div>
    </PaginaBase>
  );
}

/* =========================================================
   CONFIGURAÇÃO INDIVIDUAL
========================================================= */

function ConfiguracaoItem({
  titulo,
  descricao,
  valor,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...cardLista,
        width: "100%",
        textAlign: "left",
        cursor: "pointer",
      }}
    >
      <div>
        <strong>{titulo}</strong>

        <p style={textoSecundario}>{descricao}</p>
      </div>

      <span
        style={
          valor
            ? badgeVerde
            : badgeNeutro
        }
      >
        {valor ? "Ativado" : "Desativado"}
      </span>
    </button>
  );
}

/* =========================================================
   PÁGINA BASE
========================================================= */

function PaginaBase({
  titulo,
  icone,
  voltarInicio,
  children,
}) {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "24px 18px 100px",
        boxSizing: "border-box",
        background: "var(--pulsan-bg, #fffdf9)",
        color: "var(--pulsan-texto, #172c35)",
      }}
    >
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "22px",
          }}
        >
          <button
            type="button"
            onClick={voltarInicio}
            style={botaoVoltar}
          >
            <Icon name="back" size={18} />
          </button>

          <div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: "700",
                color:
                  "var(--pulsan-primaria, #20adb0)",
                marginBottom: "4px",
              }}
            >
              <span style={{display:"inline-flex",alignItems:"center",gap:6}}><Icon name="shield" size={14} /> Equipe Pulsan</span>
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "28px",
              }}
            >
              {icone} {titulo}
            </h1>
          </div>
        </div>

        {children}
      </section>
    </main>
  );
}

/* =========================================================
   PÁGINA DE USUÁRIOS
========================================================= */

function PaginaUsuarios({
  usuarios,
  totalUsuarios,
  buscaUsuario,
  setBuscaUsuario,
  filtroTipo,
  setFiltroTipo,
  voltarInicio,
}) {
  function nomeTipo(tipo) {
    switch (tipo) {
      case "psicologo":
        return "Psicólogo";
      case "aluno":
        return "Aluno";
      case "colaborador":
        return "Colaborador";
      case "equipe_pulsan":
        return "Equipe Pulsan";
      default:
        return tipo || "Usuário";
    }
  }

  function corTipo(tipo) {
    switch (tipo) {
      case "psicologo":
        return "#3b82f6";
      case "aluno":
        return "#20adb0";
      case "colaborador":
        return "#8b5cf6";
      case "equipe_pulsan":
        return "#c99500";
      default:
        return "#777";
    }
  }

  function statusUsuario(usuario) {
    if (usuario.tipo_usuario === "psicologo") {
      if (
        usuario.verificacao_psicologo ===
        "aprovado"
      ) {
        return "Parceiro aprovado";
      }

      if (
        usuario.verificacao_psicologo ===
        "recusado"
      ) {
        return "Verificação recusada";
      }

      return "Aguardando verificação";
    }

    return "Conta cadastrada";
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "24px 18px 100px",
        boxSizing: "border-box",
        background: "var(--pulsan-bg, #fffdf9)",
        color: "var(--pulsan-texto, #172c35)",
      }}
    >
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "22px",
          }}
        >
          <button
            type="button"
            onClick={voltarInicio}
            style={botaoVoltar}
          >
            <Icon name="back" size={18} />
          </button>

          <div>
            <div
              style={{
                fontSize: "12px",
                fontWeight: "700",
                color:
                  "var(--pulsan-primaria, #20adb0)",
                marginBottom: "4px",
              }}
            >
              <span style={{display:"inline-flex",alignItems:"center",gap:6}}><Icon name="shield" size={14} /> Equipe Pulsan</span>
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "28px",
              }}
            >
              Usuários
            </h1>
          </div>
        </div>

        <div style={contadorBox}>
          <div
            style={{
              fontSize: "13px",
              color:
                "var(--pulsan-texto-secundario, #777)",
            }}
          >
            Usuários cadastrados
          </div>

          <div
            style={{
              fontSize: "30px",
              fontWeight: "800",
              marginTop: "4px",
            }}
          >
            {totalUsuarios}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "minmax(0, 1fr) 220px",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          <input
            type="text"
            value={buscaUsuario}
            onChange={(e) =>
              setBuscaUsuario(e.target.value)
            }
            placeholder="Buscar por nome, e-mail ou CRP..."
            style={inputStyle}
          />

          <select
            value={filtroTipo}
            onChange={(e) =>
              setFiltroTipo(e.target.value)
            }
            style={inputStyle}
          >
            <option value="todos">
              Todos os usuários
            </option>

            <option value="aluno">
              <span style={{display:"inline-flex",alignItems:"center",gap:6}}><Icon name="student" size={15} /> Alunos</span>
            </option>

            <option value="colaborador">
              <span style={{display:"inline-flex",alignItems:"center",gap:6}}><Icon name="briefcase" size={15} /> Colaboradores</span>
            </option>

            <option value="psicologo">
              <span style={{display:"inline-flex",alignItems:"center",gap:6}}><Icon name="brain" size={15} /> Psicólogos</span>
            </option>

            <option value="equipe_pulsan">
              <span style={{display:"inline-flex",alignItems:"center",gap:6}}><Icon name="shield" size={14} /> Equipe Pulsan</span>
            </option>
          </select>
        </div>

        <div style={textoLista}>
          {usuarios.length} usuário
          {usuarios.length !== 1 ? "s" : ""} encontrado
          {usuarios.length !== 1 ? "s" : ""}
        </div>

        {usuarios.length === 0 ? (
          <EstadoVazio
            icone="search"
            titulo="Nenhum usuário encontrado"
            texto="Tente mudar a busca ou o filtro."
          />
        ) : (
          <div style={lista}>
            {usuarios.map((usuario, index) => (
              <div
                key={
                  usuario.id ||
                  usuario.email ||
                  index
                }
                style={cardLista}
              >
                <div style={linhaPrincipal}>
                  <div style={avatarUsuario}>
                    {usuario.foto_url ? (
                      <img
                        src={usuario.foto_url}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <Icon name="users" size={18} />
                    )}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: "800",
                        fontSize: "16px",
                      }}
                    >
                      {usuario.nome ||
                        "Nome não informado"}
                    </div>

                    <div style={textoSecundario}>
                      {usuario.email ||
                        "E-mail não informado"}
                    </div>
                  </div>
                </div>

                <div style={detalhes}>
                  <span
                    style={{
                      ...badgeBase,
                      background: `${corTipo(
                        usuario.tipo_usuario
                      )}18`,
                      color: corTipo(
                        usuario.tipo_usuario
                      ),
                    }}
                  >
                    {nomeTipo(
                      usuario.tipo_usuario
                    )}
                  </span>

                  <span style={badgeNeutro}>
                    {statusUsuario(usuario)}
                  </span>
                </div>

                {usuario.tipo_usuario ===
                  "psicologo" &&
                  usuario.crp && (
                    <div style={textoDetalhe}>
                      <strong>CRP:</strong>{" "}
                      {usuario.crp}
                    </div>
                  )}

                {usuario.criado_em && (
                  <div style={dataTexto}>
                    Cadastro:{" "}
                    {new Date(
                      usuario.criado_em
                    ).toLocaleDateString("pt-BR")}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

/* =========================================================
   COMPONENTES VISUAIS
========================================================= */

function CardResumo({
  icone,
  titulo,
  valor,
  descricao,
}) {
  return (
    <div style={cardResumo}>
      <div
        style={{
          fontSize: "25px",
          marginBottom: "10px",
        }}
      >
        {icone}
      </div>

      <div
        style={{
          fontSize: "29px",
          fontWeight: "800",
          lineHeight: 1,
          marginBottom: "7px",
        }}
      >
        {valor}
      </div>

      <div
        style={{
          fontWeight: "700",
          fontSize: "14px",
        }}
      >
        {titulo}
      </div>

      <div style={textoSecundario}>
        {descricao}
      </div>
    </div>
  );
}

function CardAdministracao({
  icone,
  titulo,
  descricao,
  destaque,
  textoDestaque,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        ...cardAdministracao,
        cursor: "pointer",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        <div style={{ fontSize: "28px" }}>
          <Icon name={icone} size={28} />
        </div>

        <span style={{ fontSize: "20px", display: "inline-flex" }}>
          <Icon name="arrow" size={18} />
        </span>
      </div>

      <h3
        style={{
          margin: "14px 0 7px",
          fontSize: "17px",
        }}
      >
        {titulo}
      </h3>

      <p
        style={{
          margin: 0,
          fontSize: "13px",
          lineHeight: 1.5,
          color:
            "var(--pulsan-texto-secundario, #777)",
        }}
      >
        {descricao}
      </p>

      {typeof destaque === "number" && (
        <div
          style={{
            marginTop: "13px",
            fontSize: "12px",
            fontWeight: "700",
            color:
              destaque > 0
                ? "#c99500"
                : "#20a66a",
          }}
        >
          {destaque > 0 ? <Icon name="pending" size={13} /> : <Icon name="check" size={13} />}
          {textoDestaque}
        </div>
      )}
    </button>
  );
}

function RelatorioCard({
  titulo,
  valor,
  descricao,
}) {
  return (
    <div style={cardResumo}>
      <div style={textoSecundario}>
        {titulo}
      </div>

      <div
        style={{
          fontSize: "30px",
          fontWeight: "800",
          margin: "8px 0",
        }}
      >
        {valor}
      </div>

      <div style={textoSecundario}>
        {descricao}
      </div>
    </div>
  );
}

function EstadoVazio({
  icone,
  titulo,
  texto,
}) {
  return (
    <div style={estadoVazio}>
      <div
        style={{
          fontSize: "42px",
          marginBottom: "12px",
        }}
      >
        {icone}
      </div>

      <h3 style={{ margin: "0 0 7px" }}>
        {titulo}
      </h3>

      <p
        style={{
          margin: 0,
          color:
            "var(--pulsan-texto-secundario, #777)",
          fontSize: "13px",
        }}
      >
        {texto}
      </p>
    </div>
  );
}

/* =========================================================
   ESTILOS
========================================================= */

const botaoSecundario = {
  border: "1px solid var(--pulsan-borda, #e5e5e5)",
  background: "var(--pulsan-card, #fff)",
  color: "var(--pulsan-texto, #172c35)",
  borderRadius: "12px",
  padding: "10px 14px",
  cursor: "pointer",
  fontWeight: "700",
};

const botaoVoltar = {
  width: "42px",
  height: "42px",
  borderRadius: "12px",
  border: "1px solid var(--pulsan-borda, #e5e5e5)",
  background: "var(--pulsan-card, #fff)",
  cursor: "pointer",
  fontSize: "18px",
};

const botaoPrimario = {
  border: "none",
  background: "var(--pulsan-primaria, #20adb0)",
  color: "#fff",
  borderRadius: "12px",
  padding: "13px 16px",
  cursor: "pointer",
  fontWeight: "800",
  whiteSpace: "nowrap",
};

const botaoPequeno = {
  border: "1px solid var(--pulsan-borda, #e5e5e5)",
  background: "var(--pulsan-card, #fff)",
  color: "var(--pulsan-texto, #172c35)",
  borderRadius: "10px",
  padding: "9px 12px",
  cursor: "pointer",
  fontWeight: "700",
};

const botaoPerigo = {
  border: "1px solid rgba(220,60,60,0.2)",
  background: "rgba(220,60,60,0.08)",
  color: "#c0392b",
  borderRadius: "10px",
  padding: "9px 12px",
  cursor: "pointer",
  fontWeight: "700",
};

const tituloSecao = {
  fontSize: "19px",
  margin: "0 0 14px",
};

const cardResumo = {
  background: "var(--pulsan-card, #ffffff)",
  border: "1px solid var(--pulsan-borda, #e5e5e5)",
  borderRadius: "18px",
  padding: "18px",
  boxSizing: "border-box",
  boxShadow: "0 5px 18px rgba(0,0,0,0.04)",
};

const cardAdministracao = {
  width: "100%",
  textAlign: "left",
  border: "1px solid var(--pulsan-borda, #e5e5e5)",
  background: "var(--pulsan-card, #ffffff)",
  borderRadius: "18px",
  padding: "20px",
  boxShadow: "0 5px 18px rgba(0,0,0,0.04)",
  color: "var(--pulsan-texto, #172c35)",
};

const cardLista = {
  background: "var(--pulsan-card, #ffffff)",
  border: "1px solid var(--pulsan-borda, #e5e5e5)",
  borderRadius: "18px",
  padding: "18px",
  boxShadow: "0 5px 18px rgba(0,0,0,0.04)",
};

const lista = {
  display: "grid",
  gap: "12px",
};

const linhaPrincipal = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
};

const barraAcao = {
  display: "grid",
  gridTemplateColumns:
    "minmax(0, 1fr) auto",
  gap: "12px",
  marginBottom: "18px",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid var(--pulsan-borda, #e5e5e5)",
  background: "var(--pulsan-card, #fff)",
  color: "var(--pulsan-texto, #172c35)",
  outline: "none",
  fontSize: "14px",
};

const contadorBox = {
  background: "var(--pulsan-card, #ffffff)",
  border: "1px solid var(--pulsan-borda, #e5e5e5)",
  borderRadius: "18px",
  padding: "18px",
  marginBottom: "18px",
  boxShadow: "0 5px 18px rgba(0,0,0,0.04)",
};

const textoSecundario = {
  marginTop: "5px",
  fontSize: "13px",
  color: "var(--pulsan-texto-secundario, #777)",
};

const textoLista = {
  marginBottom: "12px",
  fontSize: "13px",
  fontWeight: "700",
  color: "var(--pulsan-texto-secundario, #777)",
};

const textoDetalhe = {
  marginTop: "12px",
  fontSize: "13px",
};

const dataTexto = {
  marginTop: "8px",
  fontSize: "11px",
  color: "var(--pulsan-texto-secundario, #888)",
};

const avatarUsuario = {
  width: "52px",
  height: "52px",
  borderRadius: "50%",
  overflow: "hidden",
  flexShrink: 0,
  background: "rgba(32,173,176,0.10)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "22px",
};

const avatarGrande = {
  width: "50px",
  height: "50px",
  borderRadius: "14px",
  background: "rgba(32,173,176,0.10)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "23px",
  flexShrink: 0,
};

const detalhes = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  marginTop: "14px",
};

const acoes = {
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  marginTop: "15px",
};

const badgeBase = {
  display: "inline-flex",
  padding: "6px 10px",
  borderRadius: "999px",
  fontSize: "11px",
  fontWeight: "800",
};

const badgeNeutro = {
  ...badgeBase,
  background: "rgba(0,0,0,0.05)",
  color: "var(--pulsan-texto, #172c35)",
};

const badgeVerde = {
  ...badgeBase,
  background: "rgba(32,166,106,0.12)",
  color: "#168653",
};

const badgeVermelho = {
  ...badgeBase,
  background: "rgba(220,60,60,0.12)",
  color: "#c0392b",
};

const badgeAmarelo = {
  ...badgeBase,
  background: "rgba(201,149,0,0.14)",
  color: "#a67900",
};

const estadoVazio = {
  background: "var(--pulsan-card, #ffffff)",
  border: "1px solid var(--pulsan-borda, #e5e5e5)",
  borderRadius: "18px",
  padding: "40px 20px",
  textAlign: "center",
};

const infoBox = {
  marginTop: "18px",
  padding: "18px",
  borderRadius: "18px",
  background: "rgba(32,173,176,0.08)",
  border: "1px solid rgba(32,173,176,0.18)",
};

const gridRelatorios = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(190px, 1fr))",
  gap: "14px",
};

export default PainelAdmin;