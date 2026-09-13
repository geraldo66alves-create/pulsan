import React, { useState } from "react";
import { supabase } from "../lib/supabase";

const API_URL = "http://localhost:3001";

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

  const [carregando, setCarregando] = useState(false);
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [mostrarTermos, setMostrarTermos] = useState(false);

  // =========================
  // SELECIONAR FOTO
  // =========================

  function selecionarFoto(e) {
    const arquivo = e.target.files?.[0];

    if (!arquivo) return;

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
    const arquivo = e.target.files?.[0];

    if (!arquivo) return;

    const tiposPermitidos = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!tiposPermitidos.includes(arquivo.type)) {
      alert("Envie um documento em PDF, JPG, PNG ou WEBP.");
      return;
    }

    if (arquivo.size > 5 * 1024 * 1024) {
      alert("O documento deve ter no máximo 5 MB.");
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

  async function cadastrar(e) {
    e.preventDefault();

    if (carregando) return;

    if (!aceitouTermos) {
      alert("Você precisa ler e aceitar o Termo de Uso para criar sua conta.");
      return;
    }

    // Verificação dos campos básicos
    if (
      !nome.trim() ||
      !email.trim() ||
      !tipo ||
      !senha ||
      !confirmarSenha ||
      !foto
    ) {
      alert("Preencha todos os campos e selecione uma foto.");
      return;
    }

    const emailNormalizado = email.trim().toLowerCase();

    // Funcionário Brisanet
    if (
      tipo === "colaborador" &&
      !emailNormalizado.endsWith("@grupobrisanet.com.br")
    ) {
      alert(
        "Para se cadastrar como Funcionário Brisanet, use seu e-mail corporativo terminando com @grupobrisanet.com.br."
      );
      return;
    }

    // Psicólogo
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
      alert("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      alert("As senhas não são iguais.");
      return;
    }

    try {
      setCarregando(true);

      // ==========================================
      // CADASTRO SEGURO PELO SUPABASE AUTH
      // ==========================================

      const { data: cadastroAuth, error: erroAuth } =
        await supabase.auth.signUp({
          email: emailNormalizado,
          password: senha,
          options: {
            data: {
              nome: nome.trim(),
              tipo_usuario: tipo,
            },
          },
        });

      if (erroAuth) {
        throw new Error(erroAuth.message || "Não foi possível criar a conta.");
      }

      const usuarioAuth = cadastroAuth?.user;

      if (!usuarioAuth) {
        throw new Error("O Supabase não retornou o usuário criado.");
      }

      // O perfil é criado automaticamente pelo trigger do Supabase.
      // Não inserir novamente em "perfis", pois isso causa duplicate key.


      if (tipo === "psicologo") {
        const resposta = await fetch(`${API_URL}/api/psicologos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: usuarioAuth.id,
            nome: nome.trim(),
            email: emailNormalizado,
            crp: crp.trim(),
          }),
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
          throw new Error(
            resultado?.erro || resultado?.error || "Não foi possível registrar o psicólogo."
          );
        }
      }

      // Mantém somente dados não sensíveis da sessão local.
      localStorage.setItem("pulsanNome", nome.trim());
      localStorage.setItem("pulsanEmail", emailNormalizado);
      localStorage.setItem("pulsanFoto", foto);
      localStorage.setItem("pulsanTipo", tipo);
      localStorage.setItem(
        "pulsanUsuarioAtual",
        JSON.stringify({
          id: usuarioAuth.id,
          nome: nome.trim(),
          email: emailNormalizado,
          tipo_usuario: tipo,
          foto_url: foto,
          termos_aceitos: true,
          data_aceite_termos: new Date().toISOString(),
          versao_termos: "1.0",
        })
      );

      if (tipo === "psicologo") {
        localStorage.setItem("pulsanCRP", crp.trim());
        localStorage.setItem("pulsanPsicologoParceiro", "false");
        localStorage.setItem("pulsanVerificacaoPsicologo", "pendente");
        localStorage.setItem("pulsanDocumentoProfissional", documento);
        localStorage.setItem("pulsanNomeDocumento", nomeDocumento);
      } else {
        localStorage.removeItem("pulsanCRP");
        localStorage.removeItem("pulsanPsicologoParceiro");
        localStorage.removeItem("pulsanVerificacaoPsicologo");
        localStorage.removeItem("pulsanDocumentoProfissional");
        localStorage.removeItem("pulsanNomeDocumento");
      }

      // ==========================================
      // MENSAGEM
      // ==========================================

      if (tipo === "psicologo") {
        alert(
          "Cadastro realizado! 🧠\n\nSua solicitação para ser Psicólogo Parceiro Pulsan foi enviada para análise da equipe responsável."
        );
      } else {
        alert("Conta criada com sucesso! 💚");
      }

      // Vai para login
      irPara("login");
    } catch (erro) {
      console.error("Erro no cadastro:", erro);

      alert(
        "Não foi possível concluir o cadastro.\n\n" +
          (erro?.message || "Verifique se o servidor está funcionando.")
      );
    } finally {
      setCarregando(false);
    }
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

        <div className="auth-brand">PULSAN</div>

        <h1>Criar minha conta 💚</h1>

        <p className="auth-description">
          Faça parte de um espaço seguro de apoio.
        </p>

        {/* FORMULÁRIO */}

        <form className="auth-form" onSubmit={cadastrar}>
          {/* NOME */}

          <div className="form-group">
            <label htmlFor="nome">Nome</label>

            <input
              id="nome"
              type="text"
              placeholder="Digite seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              autoComplete="name"
            />
          </div>

          {/* FOTO */}

          <div className="profile-photo-group">
            <label>Foto de perfil</label>

            <div className="profile-photo-preview">
              {foto ? (
                <img
                  src={foto}
                  alt="Prévia da foto de perfil"
                />
              ) : (
                <span>👤</span>
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
              Sua foto será usada para identificar você
              quando oferecer ajuda a outra pessoa.
            </small>
          </div>

          {/* E-MAIL */}

          <div className="form-group">
            <label htmlFor="cadastro-email">E-mail</label>

            <input
              id="cadastro-email"
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                e-mail corporativo{" "}
                <strong>@grupobrisanet.com.br</strong>.
              </small>
            )}
          </div>

          {/* TIPO DE USUÁRIO */}

          <div className="form-group">
            <label htmlFor="tipo">Você é</label>

            <select
              id="tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <option value="">
                Selecione uma opção
              </option>

              <option value="aluno">Aluno</option>

              <option value="colaborador">
                Funcionário Brisanet
              </option>

              <option value="psicologo">
                🧠 Psicólogo / Profissional parceiro
              </option>
            </select>
          </div>

          {/* ÁREA DO PSICÓLOGO */}

          {tipo === "psicologo" && (
            <div
              style={{
                marginTop: "15px",
                padding: "20px",
                background: "#f4f9ff",
                border: "1px solid #cfe2f3",
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
                  onChange={(e) => setCrp(e.target.value)}
                />
              </div>

              {/* DOCUMENTO */}

              <div
                className="form-group"
                style={{
                  marginTop: "15px",
                }}
              >
                <label>Documento comprobatório</label>

                <label
                  htmlFor="documento-profissional"
                  style={{
                    display: "block",
                    padding: "14px",
                    marginTop: "7px",
                    border: "1px dashed #9bbfd8",
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
                  border: "1px solid #eee0a8",
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
            <label htmlFor="cadastro-senha">Senha</label>

            <input
              id="cadastro-senha"
              type="password"
              placeholder="Crie uma senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
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

          {/* TERMOS DE USO */}

          <div className="terms-group">
            <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "13px", lineHeight: "1.5", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={aceitouTermos}
                onChange={(e) => setAceitouTermos(e.target.checked)}
                disabled={carregando}
              />

              <span>
                Li e aceito o{" "}
                <button
                  type="button"
                  onClick={() => setMostrarTermos(true)}
                  disabled={carregando}
                  style={{ border: "none", background: "transparent", padding: 0, color: "var(--cor-primaria, #3a7dff)", textDecoration: "underline", cursor: "pointer", fontWeight: "700" }}
                >
                  Termo de Uso
                </button>{" "}
                e a Política de Privacidade do Pulsan.
              </span>
            </label>
          </div>

          {/* PRIVACIDADE */}

          <div className="auth-security">
            🔒 Seus dados são protegidos.

            <br />

            Sua participação na comunidade pode ser anônima.
          </div>

          {/* BOTÃO */}

          <button
            type="submit"
            className="primary-button auth-button"
            disabled={carregando}
          >
            {carregando ? "Criando conta..." : "Criar conta"}
          </button>
        </form>

        {mostrarTermos && (
          <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
            <div style={{ width: "100%", maxWidth: "620px", maxHeight: "85vh", overflowY: "auto", background: "var(--cor-card, #fff)", color: "var(--cor-texto, #17345f)", borderRadius: "18px", padding: "24px", boxSizing: "border-box" }}>
              <h2>Termo de Uso e Consentimento — Pulsan</h2>
              <p>O Pulsan é uma plataforma de apoio emocional. Ele busca incentivar a escuta, o respeito e a empatia, mas não substitui atendimento psicológico, médico ou psiquiátrico.</p>
              <h3>Uso responsável</h3>
              <p>Não é permitido publicar ameaças, ofensas, preconceito, assédio, perseguição, exposição de dados pessoais, incentivo à violência, automutilação ou suicídio.</p>
              <h3>Privacidade e anonimato</h3>
              <p>O Pulsan busca oferecer espaços anônimos, mas o anonimato não é uma garantia absoluta. Informações poderão ser analisadas ou compartilhadas quando necessário para cumprir a lei ou proteger alguém.</p>
              <h3>Conversas privadas</h3>
              <p>Conversas privadas dependem da aceitação do outro usuário. Ninguém é obrigado a aceitar ou continuar uma interação.</p>
              <h3>Moderação e situações de risco</h3>
              <p>O Pulsan poderá utilizar moderação automática e humana para identificar conteúdos ofensivos, ameaças, bullying e possíveis situações de risco.</p>
              <h3>Declaração de aceite</h3>
              <p>Ao aceitar, o usuário declara que leu e compreendeu as regras de utilização e entende que o Pulsan não é um serviço de emergência.</p>
              <button type="button" className="primary-button auth-button" onClick={() => { setAceitouTermos(true); setMostrarTermos(false); }}>
                Li e aceito os termos
              </button>
              <button type="button" className="auth-back" onClick={() => setMostrarTermos(false)}>
                Fechar
              </button>
            </div>
          </div>
        )}

        {/* LOGIN */}

        <button
          type="button"
          className="auth-register"
          onClick={() => irPara("login")}
        >
          Já tenho uma conta
        </button>

        {/* VOLTAR */}

        <button
          type="button"
          className="auth-back"
          onClick={() => irPara("inicio")}
        >
          ← Voltar
        </button>
      </div>
    </main>
  );
}

export default Cadastro;