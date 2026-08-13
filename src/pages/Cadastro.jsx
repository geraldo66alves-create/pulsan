import React, { useState } from "react";

function Cadastro({ irPara }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [tipo, setTipo] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [foto, setFoto] = useState("");

  // Dados do psicólogo
  const [crp, setCrp] = useState("");
  const [documento, setDocumento] = useState("");
  const [nomeDocumento, setNomeDocumento] = useState("");

  // =========================
  // SELECIONAR FOTO
  // =========================

  function selecionarFoto(e) {
    const arquivo = e.target.files[0];

    if (!arquivo) {
      return;
    }

    if (!arquivo.type.startsWith("image/")) {
      alert("Selecione apenas uma imagem.");
      return;
    }

    const leitor = new FileReader();

    leitor.onload = () => {
      setFoto(leitor.result);
    };

    leitor.readAsDataURL(arquivo);
  }

  // =========================
  // SELECIONAR DOCUMENTO
  // =========================

  function selecionarDocumento(e) {
    const arquivo = e.target.files[0];

    if (!arquivo) {
      return;
    }

    const tiposPermitidos = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!tiposPermitidos.includes(arquivo.type)) {
      alert(
        "Envie um documento em PDF, JPG, PNG ou WEBP."
      );
      return;
    }

    // Limite de 5 MB
    if (arquivo.size > 5 * 1024 * 1024) {
      alert(
        "O documento deve ter no máximo 5 MB."
      );
      return;
    }

    setNomeDocumento(arquivo.name);

    const leitor = new FileReader();

    leitor.onload = () => {
      setDocumento(leitor.result);
    };

    leitor.readAsDataURL(arquivo);
  }

  // =========================
  // CADASTRAR
  // =========================

  function cadastrar(e) {
    e.preventDefault();

    // Campos básicos
    if (
      !nome.trim() ||
      !email.trim() ||
      !tipo ||
      !senha ||
      !confirmarSenha ||
      !foto
    ) {
      alert(
        "Preencha todos os campos e selecione uma foto."
      );
      return;
    }

    // =========================
    // E-MAIL DO FUNCIONÁRIO BRISANET
    // =========================

    if (tipo === "colaborador") {
      const emailColaborador =
        email.trim().toLowerCase();

      if (
        !emailColaborador.endsWith(
          "@grupobrisanet.com.br"
        )
      ) {
        alert(
          "Para se cadastrar como Funcionário Brisanet, use seu e-mail corporativo terminando com @grupobrisanet.com.br."
        );
        return;
      }
    }

    // Campos do psicólogo
    if (tipo === "psicologo") {
      if (!crp.trim()) {
        alert("Informe seu CRP.");
        return;
      }

      if (!documento) {
        alert(
          "Envie um documento para comprovar sua habilitação profissional."
        );
        return;
      }
    }

    // Senha
    if (senha.length < 6) {
      alert(
        "A senha precisa ter pelo menos 6 caracteres."
      );
      return;
    }

    if (senha !== confirmarSenha) {
      alert("As senhas não são iguais.");
      return;
    }

    // Usuários existentes
    const usuariosSalvos =
      JSON.parse(
        localStorage.getItem("usuariosPulsan")
      ) || [];

    // E-mail existente
    const usuarioExistente =
      usuariosSalvos.find(
        (usuario) =>
          usuario.email.toLowerCase() ===
          email.trim().toLowerCase()
      );

    if (usuarioExistente) {
      alert("Este e-mail já está cadastrado.");
      return;
    }

    // =========================
    // NOVO USUÁRIO
    // =========================

    const novoUsuario = {
      id: Date.now(),

      nome: nome.trim(),

      email:
        email.trim().toLowerCase(),

      tipo: tipo,

      senha: senha,

      foto: foto,

      // =========================
      // DADOS DO PSICÓLOGO
      // =========================

      psicologoParceiro:
        tipo === "psicologo",

      crp:
        tipo === "psicologo"
          ? crp.trim()
          : "",

      documentoProfissional:
        tipo === "psicologo"
          ? documento
          : "",

      nomeDocumento:
        tipo === "psicologo"
          ? nomeDocumento
          : "",

      // O selo NÃO é liberado automaticamente
      seloPsicologo:
        false,

      // Status da verificação
      verificacaoPsicologo:
        tipo === "psicologo"
          ? "pendente"
          : "nao_se_aplica",

      // Selo de apoiador
      seloApoiador:
        false,

      // Dados iniciais
      avaliacoes: [],

      pontos: 0,

      ajudas: 0,
    };

    // Adiciona usuário
    usuariosSalvos.push(novoUsuario);

    // Salva
    localStorage.setItem(
      "usuariosPulsan",
      JSON.stringify(usuariosSalvos)
    );

    // Dados do usuário atual
    localStorage.setItem(
      "pulsanNome",
      nome.trim()
    );

    localStorage.setItem(
      "pulsanFoto",
      foto
    );

    localStorage.setItem(
      "pulsanTipo",
      tipo
    );

    // =========================
    // DADOS DO PSICÓLOGO ATUAL
    // =========================

    if (tipo === "psicologo") {
      localStorage.setItem(
        "pulsanCRP",
        crp.trim()
      );

      localStorage.setItem(
        "pulsanPsicologoParceiro",
        "false"
      );

      localStorage.setItem(
        "pulsanVerificacaoPsicologo",
        "pendente"
      );
    } else {
      localStorage.removeItem(
        "pulsanCRP"
      );

      localStorage.removeItem(
        "pulsanPsicologoParceiro"
      );

      localStorage.removeItem(
        "pulsanVerificacaoPsicologo"
      );
    }

    // =========================
    // FINAL
    // =========================

    if (tipo === "psicologo") {
      alert(
        "Cadastro realizado! 🧠\n\n" +
        "Sua solicitação para ser Psicólogo Parceiro Pulsan foi enviada para verificação.\n\n" +
        "O selo será liberado somente após a aprovação."
      );
    } else {
      alert(
        "Conta criada com sucesso! 💚"
      );
    }

    // Vai para login
    irPara("login");
  }

  return (
    <main className="auth-page">
      <div className="auth-card">

        {/* LOGO */}

        <img
          src="/logo.png"
          alt="Logo Pulsan"
          className="auth-logo"
        />

        <div className="auth-brand">
          PULSAN
        </div>

        <h1>
          Criar minha conta 💚
        </h1>

        <p className="auth-description">
          Faça parte de um espaço seguro de apoio.
        </p>

        {/* =========================
            FORMULÁRIO
        ========================= */}

        <form
          className="auth-form"
          onSubmit={cadastrar}
        >

          {/* NOME */}

          <div className="form-group">
            <label htmlFor="nome">
              Nome
            </label>

            <input
              id="nome"
              type="text"
              placeholder="Digite seu nome"
              value={nome}
              onChange={(e) =>
                setNome(e.target.value)
              }
              autoComplete="name"
            />
          </div>

          {/* =========================
              FOTO
          ========================= */}

          <div className="profile-photo-group">

            <label>
              Foto de perfil
            </label>

            <div className="profile-photo-preview">

              {foto ? (
                <img
                  src={foto}
                  alt="Prévia da foto de perfil"
                />
              ) : (
                <span>
                  👤
                </span>
              )}

            </div>

            <label
              htmlFor="foto"
              className="photo-upload-button"
            >
              📷 Escolher foto
            </label>

            <input
              id="foto"
              type="file"
              accept="image/*"
              onChange={selecionarFoto}
              hidden
            />

            <small>
              Sua foto será usada para identificar
              você quando oferecer ajuda a outra pessoa.
            </small>

          </div>

          {/* E-MAIL */}

          <div className="form-group">

            <label htmlFor="cadastro-email">
              E-mail
            </label>

            <input
              id="cadastro-email"
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              autoComplete="email"
            />

            {tipo === "colaborador" && (
              <small
                style={{
                  display: "block",
                  marginTop: "7px",
                  color: "#777",
                  lineHeight: "1.4",
                }}
              >
                🏢 Funcionários Brisanet devem usar o
                e-mail corporativo
                <strong> @grupobrisanet.com.br</strong>.
              </small>
            )}

          </div>

          {/* =========================
              TIPO DE USUÁRIO
          ========================= */}

          <div className="form-group">

            <label htmlFor="tipo">
              Você é
            </label>

            <select
              id="tipo"
              value={tipo}
              onChange={(e) =>
                setTipo(e.target.value)
              }
            >

              <option value="">
                Selecione uma opção
              </option>

              <option value="aluno">
                Aluno
              </option>

              <option value="colaborador">
                Funcionário Brisanet
              </option>

              <option value="psicologo">
                🧠 Psicólogo / Profissional parceiro
              </option>

            </select>

          </div>

          {/* =========================
              ÁREA DO PSICÓLOGO
          ========================= */}

          {tipo === "psicologo" && (
            <div
              style={{
                marginTop: "15px",
                padding: "20px",
                background: "#f4f9ff",
                border:
                  "1px solid #cfe2f3",
                borderRadius: "16px",
              }}
            >

              <div
                style={{
                  fontSize: "25px",
                  marginBottom: "8px",
                }}
              >
                🧠
              </div>

              <h2
                style={{
                  margin: "0 0 8px",
                  color: "#173b38",
                  fontSize: "19px",
                }}
              >
                Cadastro profissional
              </h2>

              <p
                style={{
                  margin: "0 0 18px",
                  color: "#666",
                  fontSize: "13px",
                  lineHeight: "1.5",
                }}
              >
                Para solicitar o selo de Psicólogo
                Parceiro Pulsan, precisamos verificar
                sua habilitação profissional.
              </p>

              {/* CRP */}

              <div className="form-group">

                <label htmlFor="crp">
                  Número do CRP
                </label>

                <input
                  id="crp"
                  type="text"
                  placeholder="Ex.: CRP 00/00000"
                  value={crp}
                  onChange={(e) =>
                    setCrp(e.target.value)
                  }
                />

              </div>

              {/* DOCUMENTO */}

              <div
                className="form-group"
                style={{
                  marginTop: "15px",
                }}
              >

                <label>
                  Documento comprobatório
                </label>

                <label
                  htmlFor="documento-profissional"
                  style={{
                    display: "block",
                    padding: "14px",
                    marginTop: "7px",
                    border:
                      "1px dashed #9bbfd8",
                    borderRadius: "12px",
                    background: "#ffffff",
                    cursor: "pointer",
                    textAlign: "center",
                    color: "#27628f",
                    fontWeight: "700",
                  }}
                >
                  📄 Selecionar documento
                </label>

                <input
                  id="documento-profissional"
                  type="file"
                  accept=".pdf,image/jpeg,image/png,image/webp"
                  onChange={selecionarDocumento}
                  hidden
                />

                {nomeDocumento && (
                  <div
                    style={{
                      marginTop: "10px",
                      padding: "10px",
                      background: "#ffffff",
                      borderRadius: "10px",
                      fontSize: "13px",
                      color: "#555",
                    }}
                  >
                    📎 {nomeDocumento}
                  </div>
                )}

                <small
                  style={{
                    display: "block",
                    marginTop: "8px",
                    color: "#777",
                    lineHeight: "1.4",
                  }}
                >
                  Aceitamos PDF, JPG, PNG ou WEBP.
                  Tamanho máximo: 5 MB.
                </small>

              </div>

              {/* AVISO */}

              <div
                style={{
                  marginTop: "18px",
                  padding: "13px",
                  background: "#fffdf3",
                  border:
                    "1px solid #eee0a8",
                  borderRadius: "10px",
                  color: "#75651b",
                  fontSize: "12px",
                  lineHeight: "1.5",
                }}
              >
                🔒 O documento será utilizado somente
                para verificação profissional.
                <br />
                <br />
                O selo de Psicólogo Parceiro não será
                liberado automaticamente. A aprovação
                será feita pela equipe responsável.
              </div>

            </div>
          )}

          {/* SENHA */}

          <div className="form-group">

            <label htmlFor="cadastro-senha">
              Senha
            </label>

            <input
              id="cadastro-senha"
              type="password"
              placeholder="Crie uma senha"
              value={senha}
              onChange={(e) =>
                setSenha(e.target.value)
              }
              autoComplete="new-password"
            />

          </div>

          {/* CONFIRMAR SENHA */}

          <div className="form-group">

            <label htmlFor="confirmar-senha">
              Confirmar senha
            </label>

            <input
              id="confirmar-senha"
              type="password"
              placeholder="Digite a senha novamente"
              value={confirmarSenha}
              onChange={(e) =>
                setConfirmarSenha(e.target.value)
              }
              autoComplete="new-password"
            />

          </div>

          {/* PRIVACIDADE */}

          <div className="auth-security">

            🔒 Seus dados são protegidos.

            <br />

            Sua participação na comunidade
            pode ser anônima.

          </div>

          {/* BOTÃO */}

          <button
            type="submit"
            className="primary-button auth-button"
          >
            Criar conta
          </button>

        </form>

        {/* LOGIN */}

        <button
          type="button"
          className="auth-register"
          onClick={() =>
            irPara("login")
          }
        >
          Já tenho uma conta
        </button>

        {/* VOLTAR */}

        <button
          type="button"
          className="auth-back"
          onClick={() =>
            irPara("inicio")
          }
        >
          ← Voltar
        </button>

      </div>
    </main>
  );
}

export default Cadastro;