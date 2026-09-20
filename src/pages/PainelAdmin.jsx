import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

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
      const [perfisResult, psicologosResult, postsResult, chatsResult, denunciasResult] =
        await Promise.all([
          supabase
            .from("perfis")
            .select(
              "id,nome,foto_url,selo,verificacao_psicologo,psicologo_parceiro,criado_em"
            ),
          supabase
            .from("psicologos")
            .select(
              "id,usuario_id,nome,email,telefone,crp,estado_crp,area_atuacao,verificado,ativo,disponivel,created_at"
            ),
          supabase
            .from("posts_ambiente")
            .select("*")
            .order("criado_em", { ascending: false }),
          supabase.from("conversas").select("*"),
          supabase
            .from("denuncias")
            .select("*")
            .order("criado_em", { ascending: false }),
        ]);

      if (perfisResult.error) throw perfisResult.error;
      if (psicologosResult.error) throw psicologosResult.error;
      if (postsResult.error) throw postsResult.error;
      if (chatsResult.error) throw chatsResult.error;
      if (denunciasResult.error) throw denunciasResult.error;

      const perfis = perfisResult.data || [];
      const registrosPsicologos = psicologosResult.data || [];
      const posts = postsResult.data || [];
      const chats = chatsResult.data || [];
      const denuncias = denunciasResult.data || [];

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

      const mapaContasLocais = new Map();
      contasLocais.forEach((conta) => {
        const chaves = [conta.id, conta.usuario_id, conta.email]
          .filter(Boolean)
          .map(String);
        chaves.forEach((chave) => mapaContasLocais.set(chave, conta));
      });

      const contas = perfis.map((perfil) => {
        const psicologo = mapaPsicologos.get(String(perfil.id));
        const contaLocal =
          mapaContasLocais.get(String(perfil.id)) ||
          mapaContasLocais.get(String(perfil.email || ""));

        let tipoUsuario = contaLocal?.tipo_usuario || "usuario";

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
          email: psicologo?.email || contaLocal?.email || "",
          psicologo_id: psicologo?.id || null,
        };
      });

      // Contas antigas que ainda estão no localStorage e não possuem
      // perfil no banco não entram como usuários reais do Supabase.
      const psicologos = contas.filter(
        (usuario) => usuario.tipo_usuario === "psicologo"
      );
      const pendentes = psicologos.filter(
        (usuario) => usuario.verificacao_psicologo === "pendente"
      );
      const aprovados = psicologos.filter(
        (usuario) => usuario.verificacao_psicologo === "aprovado"
      );
      const recusados = psicologos.filter(
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
        conteudo:
          item.descricao ||
          item.conteudo ||
          item.motivo ||
          "Denúncia registrada",
        categoria: item.categoria || item.motivo || "Denúncia",
        usuario: item.usuario || "Anônimo",
      }));

      const moderacoesDePosts = posts
        .filter((post) => post.alerta || post.moderado)
        .map((post) => ({
          ...post,
          _origem: "post",
          conteudo: post.texto || "Conteúdo sinalizado",
          categoria:
            post.categoria ||
            post.urgencia ||
            post.classificacao ||
            "Conteúdo sinalizado",
          usuario: "Anônimo",
          status: post.ativo === false ? "removido" : "pendente",
        }));

      const moderacoesSalvas = [
        ...moderacoesDeDenuncias,
        ...moderacoesDePosts,
      ];

      const escolasSalvas = lerLocalStorage("pulsanEscolas");
      const empresasSalvas = lerLocalStorage("pulsanEmpresas");

      setUsuarios(contas);
      setEscolas(escolasSalvas);
      setEmpresas(empresasSalvas);
      setModeracoes(moderacoesSalvas);
      setConversas(chats);

      setDados({
        usuarios: contas.length,
        psicologos: psicologos.length,
        pendentes: pendentes.length,
        aprovados: aprovados.length,
        recusados: recusados.length,
        colaboradores: colaboradores.length,
        alunos: alunos.length,
        alertas: posts.filter(
          (post) =>
            post.alerta ||
            post.urgencia === "grave" ||
            post.urgencia === "urgente"
        ).length,
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

    const agora = new Date().toISOString();

    if (item._origem === "post") {
      const atualizacao =
        status === "removido"
          ? {
              ativo: false,
              moderado: true,
              moderacao_motivo: "Removido pela equipe Pulsan.",
              moderado_em: agora,
            }
          : {
              ativo: true,
              moderado: false,
              moderacao_motivo: null,
              moderado_em: agora,
            };

      const { error } = await supabase
        .from("posts_ambiente")
        .update(atualizacao)
        .eq("id", item.id);

      if (error) {
        console.error("Erro ao atualizar moderação do conteúdo:", error);
        alert("Não foi possível atualizar este conteúdo.");
        return;
      }
    } else if (item._origem === "denuncia") {
      const { error } = await supabase
        .from("denuncias")
        .update({ status })
        .eq("id", item.id);

      if (error) {
        console.error("Erro ao atualizar denúncia:", error);
        alert("Não foi possível atualizar esta denúncia.");
        return;
      }
    }

    await carregarDados();
  }

  function limparModeracoes() {
    // As ocorrências permanecem registradas no banco para auditoria.
    // O botão apenas atualiza a lista, evitando apagar evidências reais.
    carregarDados();
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
        voltarInicio={voltarInicio}
      />
    );
  }

  if (paginaAdmin === "conversas") {
    return (
      <PaginaConversas
        conversas={conversas}
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
            <button type="button" onClick={() => irPara("gestao-psicologos")}>🧠 &nbsp; Psicólogos</button>
            <button type="button" onClick={() => irPara("alertas")}>🚨 &nbsp; Alertas</button>
            <button type="button" onClick={abrirUsuarios}>👥 &nbsp; Usuários</button>
            <button type="button" onClick={() => abrirPagina("escolas")}>🏫 &nbsp; Escolas</button>
            <button type="button" onClick={() => abrirPagina("empresas")}>🏢 &nbsp; Empresas</button>
            <button type="button" onClick={() => abrirPagina("moderacao")}>🛡️ &nbsp; Moderação</button>
            <button type="button" onClick={() => abrirPagina("relatorios")}>📊 &nbsp; Relatórios</button>
            <button type="button" onClick={() => abrirPagina("conversas")}>💬 &nbsp; Conversas</button>
            <button type="button" onClick={() => abrirPagina("configuracoes")}>⚙️ &nbsp; Configurações</button>
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
            <div className="pulsan-admin-kicker">🛡️ Área restrita · Equipe Pulsan</div>

            <div className="pulsan-admin-actions">
              <button
                type="button"
                className="pulsan-admin-action"
                onClick={carregarDados}
                title="Atualizar dados"
              >
                ↻ Atualizar
              </button>

              {typeof alterarTema === "function" && (
                <button
                  type="button"
                  className="pulsan-admin-action"
                  onClick={() => alterarTema(tema === "dark" ? "light" : "dark")}
                >
                  {tema === "dark" ? "☀️ Claro" : "🌙 Escuro"}
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
            <CardResumoModerno icone="👥" titulo="Usuários" valor={dados.usuarios} descricao="Contas cadastradas" />
            <CardResumoModerno icone="🧠" titulo="Psicólogos" valor={dados.psicologos} descricao="Profissionais cadastrados" />
            <CardResumoModerno icone="⏳" titulo="Pendentes" valor={dados.pendentes} descricao="Aguardando aprovação" />
            <CardResumoModerno icone="🤝" titulo="Parceiros" valor={dados.aprovados} descricao="Psicólogos aprovados" />
            <CardResumoModerno icone="🚨" titulo="Alertas" valor={dados.alertas} descricao="Alertas registrados" />
            <CardResumoModerno icone="🎓" titulo="Alunos" valor={dados.alunos} descricao="Usuários alunos" />
            <CardResumoModerno icone="💼" titulo="Colaboradores" valor={dados.colaboradores} descricao="Usuários colaboradores" />
            <CardResumoModerno icone="🏫" titulo="Escolas" valor={dados.escolas} descricao="Instituições cadastradas" />
            <CardResumoModerno icone="🏢" titulo="Empresas" valor={dados.empresas} descricao="Empresas cadastradas" />
            <CardResumoModerno icone="🛡️" titulo="Moderação" valor={dados.moderacoes} descricao="Ocorrências registradas" />
            <CardResumoModerno icone="💬" titulo="Conversas" valor={dados.conversas} descricao="Conversas registradas" />
            <CardResumoModerno icone="❌" titulo="Recusados" valor={dados.recusados} descricao="Psicólogos recusados" />
          </div>

          <div className="pulsan-admin-section-title">
            <h2>Acesso rápido</h2>
            <span>Ferramentas administrativas</span>
          </div>

          <div className="pulsan-admin-tools">
            <CardAdministracaoModerno
              icone="🧠"
              titulo="Gestão de Psicólogos"
              descricao="Analise documentos, acompanhe verificações e aprove ou recuse profissionais."
              destaque={dados.pendentes}
              textoDestaque={dados.pendentes > 0 ? `${dados.pendentes} aguardando análise` : "Tudo em dia"}
              onClick={() => irPara("gestao-psicologos")}
            />

            <CardAdministracaoModerno
              icone="🚨"
              titulo="Alertas"
              descricao="Acompanhe situações classificadas e encaminhamentos da plataforma."
              destaque={dados.alertas}
              textoDestaque={`${dados.alertas} alerta(s) registrado(s)`}
              onClick={() => irPara("alertas")}
            />

            <CardAdministracaoModerno icone="👥" titulo="Usuários" descricao="Pesquise e filtre as contas cadastradas." onClick={abrirUsuarios} />
            <CardAdministracaoModerno icone="🏫" titulo="Escolas" descricao="Cadastre, ative, desative ou exclua instituições." onClick={() => abrirPagina("escolas")} />
            <CardAdministracaoModerno icone="🏢" titulo="Empresas" descricao="Cadastre, ative, desative ou exclua empresas." onClick={() => abrirPagina("empresas")} />
            <CardAdministracaoModerno
              icone="🛡️"
              titulo="Moderação"
              descricao="Analise conteúdos sinalizados e registre a decisão da equipe."
              destaque={dados.moderacoes}
              textoDestaque={`${dados.moderacoes} ocorrência(s)`}
              onClick={() => abrirPagina("moderacao")}
            />
            <CardAdministracaoModerno icone="📊" titulo="Relatórios" descricao="Consulte os principais indicadores administrativos." onClick={() => abrirPagina("relatorios")} />
            <CardAdministracaoModerno icone="💬" titulo="Conversas" descricao="Consulte as conversas registradas respeitando o anonimato." onClick={() => abrirPagina("conversas")} />
            <CardAdministracaoModerno icone="⚙️" titulo="Configurações" descricao="Controle recursos e preferências administrativas." onClick={() => abrirPagina("configuracoes")} />
          </div>
        </section>
      </div>
    </main>
  );
}

function CardResumoModerno({ icone, titulo, valor, descricao }) {
  return (
    <div className="pulsan-admin-stat">
      <div className="pulsan-admin-stat-icon">{icone}</div>
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
      <div className="pulsan-admin-tool-icon">{icone}</div>
      <div className="pulsan-admin-tool-arrow">→</div>
      <h3>{titulo}</h3>
      <p>{descricao}</p>

      {possuiDestaque && (
        <span className={`pulsan-admin-tool-badge ${destaque === 0 ? "ok" : ""}`}>
          {destaque === 0 ? "✓ " : "⏳ "}
          {textoDestaque}
        </span>
      )}
    </button>
  );
}

/* =========================================================
   PÁGINA DE ESCOLAS
========================================================= */

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
      icone="🏫"
      voltarInicio={voltarInicio}
    >
      <div style={barraAcao}>
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="🔎 Buscar escola..."
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
          icone="🏫"
          titulo="Nenhuma escola cadastrada"
          texto="As instituições cadastradas aparecerão aqui."
        />
      ) : (
        <div style={lista}>
          {escolas.map((escola) => (
            <div key={escola.id} style={cardLista}>
              <div style={linhaPrincipal}>
                <div style={avatarGrande}>🏫</div>

                <div style={{ flex: 1 }}>
                  <strong>{escola.nome}</strong>

                  <div style={textoSecundario}>
                    {escola.email || "E-mail não informado"}
                  </div>

                  <div style={detalhes}>
                    {escola.cidade && (
                      <span style={badgeNeutro}>
                        📍 {escola.cidade}
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
      icone="🏢"
      voltarInicio={voltarInicio}
    >
      <div style={barraAcao}>
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="🔎 Buscar empresa..."
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
          icone="🏢"
          titulo="Nenhuma empresa cadastrada"
          texto="As empresas participantes aparecerão aqui."
        />
      ) : (
        <div style={lista}>
          {empresas.map((empresa) => (
            <div key={empresa.id} style={cardLista}>
              <div style={linhaPrincipal}>
                <div style={avatarGrande}>🏢</div>

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
      icone="🛡️"
      voltarInicio={voltarInicio}
    >
      <div style={barraAcao}>
        <input
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="🔎 Buscar ocorrência..."
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
          icone="🛡️"
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
                    ? "🔴"
                    : "🟡"}
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
      icone="📊"
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
        <strong>📈 Indicadores da plataforma</strong>

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

function PaginaConversas({ conversas, voltarInicio }) {
  return (
    <PaginaBase
      titulo="Conversas"
      icone="💬"
      voltarInicio={voltarInicio}
    >
      {conversas.length === 0 ? (
        <EstadoVazio
          icone="💬"
          titulo="Nenhuma conversa registrada"
          texto="As conversas da plataforma aparecerão aqui quando o recurso estiver conectado."
        />
      ) : (
        <div style={lista}>
          {conversas.map((conversa, index) => (
            <div
              key={conversa.id || index}
              style={cardLista}
            >
              <div style={linhaPrincipal}>
                <div style={avatarGrande}>💬</div>

                <div style={{ flex: 1 }}>
                  <strong>
                    {conversa.titulo ||
                      "Conversa anônima"}
                  </strong>

                  <div style={textoSecundario}>
                    {conversa.status ||
                      "Em andamento"}
                  </div>

                  {conversa.criado_em && (
                    <div style={dataTexto}>
                      {new Date(
                        conversa.criado_em
                      ).toLocaleString("pt-BR")}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={infoBox}>
        <strong>🔐 Privacidade</strong>

        <p style={textoSecundario}>
          O painel administrativo deve mostrar apenas
          informações permitidas pelas regras de
          anonimato da plataforma.
        </p>
      </div>
    </PaginaBase>
  );
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
      icone="⚙️"
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
                ? "☀️ Claro"
                : "🌙 Escuro"}
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
            ←
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
              🛡️ Equipe Pulsan
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
        return "🧠 Psicólogo";
      case "aluno":
        return "🎓 Aluno";
      case "colaborador":
        return "💼 Colaborador";
      case "equipe_pulsan":
        return "🛡️ Equipe Pulsan";
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
            ←
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
              🛡️ Equipe Pulsan
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
            placeholder="🔎 Buscar por nome, e-mail ou CRP..."
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
              🎓 Alunos
            </option>

            <option value="colaborador">
              💼 Colaboradores
            </option>

            <option value="psicologo">
              🧠 Psicólogos
            </option>

            <option value="equipe_pulsan">
              🛡️ Equipe Pulsan
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
            icone="🔎"
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
                      "👤"
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
          {icone}
        </div>

        <span style={{ fontSize: "20px" }}>
          →
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
          {destaque > 0 ? "⏳ " : "✓ "}
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