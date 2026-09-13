import React, { useEffect, useMemo, useState } from "react";

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
  }, []);

  function lerLocalStorage(chave) {
    try {
      const valor = JSON.parse(localStorage.getItem(chave) || "[]");
      return Array.isArray(valor) ? valor : [];
    } catch {
      return [];
    }
  }

  function carregarDados() {
    try {
      const contas = lerLocalStorage("pulsanContas");

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

      const alertas = lerLocalStorage("pulsanAlertas");
      const escolasSalvas = lerLocalStorage("pulsanEscolas");
      const empresasSalvas = lerLocalStorage("pulsanEmpresas");
      const moderacoesSalvas = lerLocalStorage("pulsanModeracoes");
      const conversasSalvas = lerLocalStorage("pulsanConversas");

      setUsuarios(contas);
      setEscolas(escolasSalvas);
      setEmpresas(empresasSalvas);
      setModeracoes(moderacoesSalvas);
      setConversas(conversasSalvas);

      try {
        const configSalva = JSON.parse(
          localStorage.getItem("pulsanConfiguracoesAdmin") || "null"
        );

        if (configSalva) {
          setConfiguracoes((atual) => ({
            ...atual,
            ...configSalva,
          }));
        }
      } catch {}

      setDados({
        usuarios: contas.length,
        psicologos: psicologos.length,
        pendentes: pendentes.length,
        aprovados: aprovados.length,
        recusados: recusados.length,
        colaboradores: colaboradores.length,
        alunos: alunos.length,
        alertas: alertas.length,
        escolas: escolasSalvas.length,
        empresas: empresasSalvas.length,
        moderacoes: moderacoesSalvas.length,
        conversas: conversasSalvas.length,
      });
    } catch (erro) {
      console.error("Erro ao carregar dados administrativos:", erro);
    }
  }

  function salvarLista(chave, lista) {
    localStorage.setItem(chave, JSON.stringify(lista));
  }

  function sair() {
  localStorage.removeItem("usuarioLogado");
  localStorage.removeItem("pulsanUsuarioAtual");
  localStorage.removeItem("pulsanEquipePulsan");

  localStorage.removeItem("pulsanNome");
  localStorage.removeItem("pulsanEmail");
  localStorage.removeItem("pulsanFoto");
  localStorage.removeItem("pulsanTipo");

  localStorage.removeItem("pulsanCRP");
  localStorage.removeItem("pulsanVerificacaoPsicologo");
  localStorage.removeItem("pulsanPsicologoParceiro");
  localStorage.removeItem("pulsanDocumentoProfissional");
  localStorage.removeItem("pulsanNomeDocumento");

  irPara("login");
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

  function alterarModeracao(id, status) {
    const novaLista = moderacoes.map((item) =>
      item.id === id
        ? {
            ...item,
            status,
            analisado_em: new Date().toISOString(),
          }
        : item
    );

    salvarLista("pulsanModeracoes", novaLista);
    setModeracoes(novaLista);
    carregarDados();
  }

  function limparModeracoes() {
    if (
      !window.confirm(
        "Deseja remover todas as ocorrências de moderação?"
      )
    ) {
      return;
    }

    salvarLista("pulsanModeracoes", []);
    setModeracoes([]);
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
          margin: "0 auto 24px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "7px 12px",
                borderRadius: "999px",
                background: "rgba(32,173,176,0.12)",
                color: "var(--pulsan-primaria, #20adb0)",
                fontSize: "12px",
                fontWeight: "700",
                marginBottom: "12px",
              }}
            >
              🛡️ Equipe Pulsan
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: "30px",
                lineHeight: 1.15,
              }}
            >
              Painel Administrativo
            </h1>

            <p
              style={{
                margin: "8px 0 0",
                color: "var(--pulsan-texto-secundario, #777)",
                fontSize: "15px",
              }}
            >
              Controle geral da plataforma Pulsan.
            </p>
          </div>

          <button
            type="button"
            onClick={sair}
            style={botaoSecundario}
          >
            Sair
          </button>
        </div>
      </section>

      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto 28px",
        }}
      >
        <h2 style={tituloSecao}>Visão geral</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(190px, 1fr))",
            gap: "14px",
          }}
        >
          <CardResumo
            icone="👥"
            titulo="Usuários"
            valor={dados.usuarios}
            descricao="Contas cadastradas"
          />

          <CardResumo
            icone="🧠"
            titulo="Psicólogos"
            valor={dados.psicologos}
            descricao="Profissionais cadastrados"
          />

          <CardResumo
            icone="⏳"
            titulo="Pendentes"
            valor={dados.pendentes}
            descricao="Aguardando aprovação"
          />

          <CardResumo
            icone="✅"
            titulo="Parceiros"
            valor={dados.aprovados}
            descricao="Psicólogos aprovados"
          />

          <CardResumo
            icone="🚨"
            titulo="Alertas"
            valor={dados.alertas}
            descricao="Alertas registrados"
          />

          <CardResumo
            icone="🏫"
            titulo="Alunos"
            valor={dados.alunos}
            descricao="Usuários alunos"
          />

          <CardResumo
            icone="💼"
            titulo="Colaboradores"
            valor={dados.colaboradores}
            descricao="Usuários colaboradores"
          />

          <CardResumo
            icone="🏫"
            titulo="Escolas"
            valor={dados.escolas}
            descricao="Instituições cadastradas"
          />

          <CardResumo
            icone="🏢"
            titulo="Empresas"
            valor={dados.empresas}
            descricao="Empresas cadastradas"
          />

          <CardResumo
            icone="🛡️"
            titulo="Moderação"
            valor={dados.moderacoes}
            descricao="Ocorrências registradas"
          />

          <CardResumo
            icone="💬"
            titulo="Conversas"
            valor={dados.conversas}
            descricao="Conversas registradas"
          />

          <CardResumo
            icone="❌"
            titulo="Recusados"
            valor={dados.recusados}
            descricao="Psicólogos recusados"
          />
        </div>
      </section>

      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <h2 style={tituloSecao}>Administração</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "14px",
          }}
        >
          <CardAdministracao
            icone="🧠"
            titulo="Gestão de Psicólogos"
            descricao="Analise cadastros, documentos e aprove ou recuse profissionais."
            destaque={dados.pendentes}
            textoDestaque={
              dados.pendentes > 0
                ? `${dados.pendentes} aguardando análise`
                : "Nenhuma pendência"
            }
            onClick={() => irPara("gestao-psicologos")}
          />

          <CardAdministracao
            icone="🚨"
            titulo="Alertas"
            descricao="Acompanhe situações classificadas pela inteligência artificial."
            destaque={dados.alertas}
            textoDestaque={`${dados.alertas} alerta(s) registrado(s)`}
            onClick={() => irPara("alertas")}
          />

          <CardAdministracao
            icone="👥"
            titulo="Usuários"
            descricao="Consulte informações gerais sobre todos os usuários cadastrados."
            onClick={abrirUsuarios}
          />

          <CardAdministracao
            icone="🏫"
            titulo="Escolas"
            descricao="Cadastre e acompanhe as instituições escolares participantes."
            onClick={() => abrirPagina("escolas")}
          />

          <CardAdministracao
            icone="🏢"
            titulo="Empresas"
            descricao="Cadastre e acompanhe as empresas participantes da plataforma."
            onClick={() => abrirPagina("empresas")}
          />

          <CardAdministracao
            icone="🛡️"
            titulo="Moderação"
            descricao="Analise conteúdos sinalizados e ocorrências que precisam da equipe."
            destaque={dados.moderacoes}
            textoDestaque={`${dados.moderacoes} ocorrência(s)`}
            onClick={() => abrirPagina("moderacao")}
          />

          <CardAdministracao
            icone="📊"
            titulo="Relatórios"
            descricao="Visualize indicadores gerais e acompanhe o crescimento da plataforma."
            onClick={() => abrirPagina("relatorios")}
          />

          <CardAdministracao
            icone="💬"
            titulo="Conversas"
            descricao="Acompanhe o funcionamento geral das conversas e atendimentos."
            onClick={() => abrirPagina("conversas")}
          />

          <CardAdministracao
            icone="⚙️"
            titulo="Configurações"
            descricao="Controle recursos administrativos e preferências gerais da plataforma."
            onClick={() => abrirPagina("configuracoes")}
          />
        </div>
      </section>
    </main>
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
            Limpar ocorrências
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