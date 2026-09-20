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
  const [estadoCrp, setEstadoCrp] = useState("");
  const [areaAtuacao, setAreaAtuacao] = useState("");
  const [telefone, setTelefone] = useState("");

  const [carregando, setCarregando] = useState(false);
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const [mostrarTermos, setMostrarTermos] = useState(false);

  // Confirmação de e-mail
  const [emailEnviado, setEmailEnviado] = useState(false);
  const [emailConfirmacao, setEmailConfirmacao] = useState("");

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

    if (
      tipo === "colaborador" &&
      !emailNormalizado.endsWith("@grupobrisanet.com.br")
    ) {
      alert(
        "Para se cadastrar como Funcionário Brisanet, use seu e-mail corporativo terminando com @grupobrisanet.com.br."
      );
      return;
    }

    if (tipo === "psicologo") {
      if (!telefone.trim()) {
        alert("Informe seu telefone.");
        return;
      }

      if (!crp.trim()) {
        alert("Informe seu CRP.");
        return;
      }

      if (!estadoCrp) {
        alert("Selecione o estado/região do seu CRP.");
        return;
      }

      if (!areaAtuacao) {
        alert("Selecione sua área de atuação.");
        return;
      }

      if (!documento) {
        alert(
          "Envie um documento para comprovar sua habilitação profissional."
        );
        return;
      }
    }

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
      // CRIA A CONTA NO SUPABASE AUTH
      // A conta só poderá entrar depois da confirmação
      // do endereço de e-mail.
      // ==========================================

      const { data: cadastroAuth, error: erroAuth } =
        await supabase.auth.signUp({
          email: emailNormalizado,
          password: senha,
          options: {
            emailRedirectTo: window.location.origin,
            data: {
              nome: nome.trim(),
              tipo_usuario: tipo,
            },
          },
        });

      if (erroAuth) {
        throw new Error(
          erroAuth.message || "Não foi possível criar a conta."
        );
      }

      const usuarioAuth = cadastroAuth?.user;

      if (!usuarioAuth) {
        throw new Error("O Supabase não retornou o usuário criado.");
      }

      // ==========================================
      // PSICÓLOGO
      // A solicitação fica registrada como pendente.
      // A entrada na plataforma continua bloqueada até
      // o e-mail ser confirmado.
      // ==========================================

      if (tipo === "psicologo") {
        const resposta = await fetch(`${API_URL}/api/psicologos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            usuario_id: usuarioAuth.id,
            nome: nome.trim(),
            email: emailNormalizado,
            telefone: telefone.trim(),
            crp: crp.trim(),
            estado_crp: estadoCrp,
            area_atuacao: areaAtuacao,
          }),
        });

        const resultado = await resposta.json().catch(() => ({}));

        if (!resposta.ok) {
          throw new Error(
            resultado?.erro ||
              resultado?.error ||
              "A conta foi criada, mas não foi possível registrar a solicitação do psicólogo."
          );
        }
      }

      // Não gravamos a sessão local aqui.
      // O usuário ainda precisa confirmar o e-mail.
      setEmailConfirmacao(emailNormalizado);
      setEmailEnviado(true);

      alert(
        `Cadastro iniciado!\n\nEnviamos um e-mail de confirmação para:\n${emailNormalizado}\n\nAbra o e-mail e clique em "Confirm your email address". Depois, volte ao Pulsan e faça login.`
      );
    } catch (erro) {
      console.error("Erro no cadastro:", erro);

      alert(
        "Não foi possível iniciar o cadastro.\n\n" +
          (erro?.message || "Verifique sua conexão e tente novamente.")
      );
    } finally {
      setCarregando(false);
    }
  }

  // ==========================================
  // REENVIAR E-MAIL DE CONFIRMAÇÃO
  // ==========================================

  async function reenviarEmailConfirmacao() {
    if (carregando || !emailConfirmacao) return;

    try {
      setCarregando(true);

      const { error } = await supabase.auth.resend({
        type: "signup",
        email: emailConfirmacao,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });

      if (error) {
        throw new Error(
          error.message || "Não foi possível reenviar o e-mail de confirmação."
        );
      }

      alert(
        `Um novo e-mail de confirmação foi enviado para ${emailConfirmacao}.\n\nVerifique também a pasta de spam, promoções ou lixo eletrônico.`
      );
    } catch (erro) {
      console.error("Erro ao reenviar confirmação:", erro);

      alert(
        "Não foi possível reenviar o e-mail.\n\n" +
          (erro?.message || "Tente novamente em alguns instantes.")
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <>
      <style>{`
        :root {
          --pulsan-blue: #3A7DFF;
          --pulsan-deep: #0F2D5B;
          --pulsan-soft: #EAF3FF;
          --pulsan-light: #A8C7FF;
          --pulsan-text: #18345C;
          --pulsan-muted: #6D7F99;
          --pulsan-border: #DCE8F8;
          --pulsan-white: #FFFFFF;
        }

        * { box-sizing: border-box; }

        .pulsan-cadastro-page {
          min-height: 100vh;
          min-height: 100dvh;
          padding: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(circle at 8% 12%, rgba(168,199,255,.42), transparent 28%),
            radial-gradient(circle at 92% 88%, rgba(58,125,255,.12), transparent 30%),
            linear-gradient(135deg, #F8FBFF 0%, #EAF3FF 48%, #FFFFFF 100%);
          color: var(--pulsan-text);
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .pulsan-glow {
          position: absolute;
          width: 380px;
          height: 380px;
          border-radius: 50%;
          background: rgba(168,199,255,.18);
          filter: blur(8px);
          pointer-events: none;
        }

        .pulsan-glow.one { top: -210px; left: -120px; }
        .pulsan-glow.two { bottom: -240px; right: -130px; background: rgba(58,125,255,.10); }

        .cadastro-shell {
          width: min(1080px, 100%);
          min-height: 680px;
          display: grid;
          grid-template-columns: .86fr 1.14fr;
          background: rgba(255,255,255,.88);
          border: 1px solid rgba(255,255,255,.95);
          border-radius: 32px;
          box-shadow: 0 28px 80px rgba(15,45,91,.16);
          overflow: hidden;
          position: relative;
          z-index: 1;
          backdrop-filter: blur(16px);
        }

        .cadastro-story {
          position: relative;
          padding: 52px 44px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background:
            radial-gradient(circle at 80% 18%, rgba(168,199,255,.30), transparent 26%),
            linear-gradient(155deg, #0F2D5B 0%, #183F78 62%, #3A7DFF 150%);
          color: white;
          overflow: hidden;
        }

        .cadastro-story::after {
          content: "";
          position: absolute;
          width: 260px;
          height: 260px;
          border: 1px solid rgba(255,255,255,.16);
          border-radius: 50%;
          right: -100px;
          bottom: -100px;
        }

        .story-brand {
          display: flex;
          align-items: center;
          gap: 13px;
          position: relative;
          z-index: 1;
        }

        .story-logo {
          width: 54px;
          height: 54px;
          object-fit: contain;
          border-radius: 16px;
          background: rgba(255,255,255,.12);
          padding: 7px;
        }

        .story-brand strong {
          letter-spacing: .18em;
          font-size: 15px;
        }

        .story-content {
          position: relative;
          z-index: 1;
          max-width: 410px;
        }

        .story-kicker {
          display: inline-flex;
          padding: 7px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,.11);
          border: 1px solid rgba(255,255,255,.14);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: .04em;
          margin-bottom: 22px;
        }

        .story-content h2 {
          margin: 0 0 17px;
          font-size: clamp(30px, 4vw, 46px);
          line-height: 1.06;
          letter-spacing: -.04em;
        }

        .story-content p {
          margin: 0;
          color: rgba(255,255,255,.78);
          line-height: 1.7;
          font-size: 15px;
        }

        .story-message {
          margin-top: 28px;
          padding: 18px;
          border-left: 3px solid #A8C7FF;
          background: rgba(255,255,255,.07);
          border-radius: 0 16px 16px 0;
          font-size: 14px;
          line-height: 1.6;
          color: rgba(255,255,255,.91);
        }

        .story-footer {
          position: relative;
          z-index: 1;
          display: flex;
          gap: 9px;
          flex-wrap: wrap;
        }

        .story-pill {
          border: 1px solid rgba(255,255,255,.14);
          background: rgba(255,255,255,.08);
          border-radius: 999px;
          padding: 8px 11px;
          font-size: 11px;
          color: rgba(255,255,255,.82);
        }

        .cadastro-form-side {
          padding: 46px clamp(28px, 5vw, 58px);
          overflow-y: auto;
          max-height: 92vh;
          max-height: 92dvh;
          background: #fff;
        }

        .form-heading {
          margin-bottom: 28px;
        }

        .form-heading .eyebrow {
          color: var(--pulsan-blue);
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .12em;
          margin-bottom: 9px;
        }

        .form-heading h1 {
          margin: 0 0 9px;
          color: var(--pulsan-deep);
          font-size: clamp(27px, 3vw, 36px);
          letter-spacing: -.035em;
        }

        .form-heading p {
          margin: 0;
          color: var(--pulsan-muted);
          line-height: 1.55;
          font-size: 14px;
        }

        .auth-form { display: flex; flex-direction: column; gap: 17px; }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .form-group { display: flex; flex-direction: column; gap: 7px; }

        .form-group label,
        .profile-photo-group > label,
        .terms-label {
          color: var(--pulsan-text);
          font-size: 12px;
          font-weight: 800;
        }

        .form-group input,
        .form-group select {
          width: 100%;
          min-height: 49px;
          border: 1px solid var(--pulsan-border);
          border-radius: 14px;
          padding: 0 14px;
          background: #FBFDFF;
          color: var(--pulsan-text);
          outline: none;
          font-size: 14px;
          transition: .2s ease;
        }

        .form-group input:focus,
        .form-group select:focus {
          border-color: var(--pulsan-blue);
          box-shadow: 0 0 0 4px rgba(58,125,255,.10);
          background: #fff;
        }

        .form-group input::placeholder { color: #A0AEC0; }

        .type-section {
          padding: 18px;
          border: 1px solid var(--pulsan-border);
          background: linear-gradient(180deg, #FBFDFF, #F7FAFF);
          border-radius: 19px;
        }

        .type-section > label {
          display: block;
          margin-bottom: 12px;
          color: var(--pulsan-text);
          font-size: 12px;
          font-weight: 800;
        }

        .type-options {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }

        .type-option {
          min-height: 72px;
          text-align: left;
          border: 1px solid var(--pulsan-border);
          background: #fff;
          border-radius: 15px;
          padding: 11px 12px;
          cursor: pointer;
          color: var(--pulsan-text);
          transition: .2s ease;
        }

        .type-option:hover { border-color: #A8C7FF; transform: translateY(-1px); }

        .type-option.active {
          border-color: var(--pulsan-blue);
          background: var(--pulsan-soft);
          box-shadow: 0 7px 18px rgba(58,125,255,.10);
        }

        .type-icon { font-size: 20px; display: block; margin-bottom: 5px; }
        .type-title { font-weight: 800; font-size: 12px; display: block; }
        .type-desc { font-size: 10px; color: var(--pulsan-muted); display: block; margin-top: 3px; }

        .profile-photo-group {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 15px;
          border: 1px solid var(--pulsan-border);
          border-radius: 18px;
          background: #FBFDFF;
          flex-wrap: wrap;
        }

        .profile-photo-preview {
          width: 64px;
          height: 64px;
          border-radius: 20px;
          overflow: hidden;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          background: var(--pulsan-soft);
          border: 1px solid #D5E4F8;
          font-size: 25px;
        }

        .profile-photo-preview img { width: 100%; height: 100%; object-fit: cover; }

        .photo-info { flex: 1; min-width: 180px; }
        .photo-info strong { display: block; font-size: 12px; color: var(--pulsan-text); margin-bottom: 4px; }
        .photo-info small { color: var(--pulsan-muted); line-height: 1.45; font-size: 10px; display: block; }

        .photo-upload-button,
        .document-button {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          min-height: 42px;
          padding: 0 14px;
          border-radius: 12px;
          background: #fff;
          border: 1px solid #C9DCF7;
          color: var(--pulsan-blue);
          cursor: pointer;
          font-size: 12px;
          font-weight: 800;
        }

        .psychology-box {
          padding: 20px;
          border-radius: 20px;
          border: 1px solid #CFE1FA;
          background:
            radial-gradient(circle at 100% 0%, rgba(168,199,255,.25), transparent 34%),
            linear-gradient(145deg, #F5FAFF, #ECF4FF);
        }

        .psychology-header {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 17px;
        }

        .psychology-icon {
          width: 43px;
          height: 43px;
          border-radius: 14px;
          display: grid;
          place-items: center;
          background: #fff;
          box-shadow: 0 6px 16px rgba(58,125,255,.12);
          font-size: 21px;
          flex: 0 0 auto;
        }

        .psychology-header h2 { margin: 0 0 4px; font-size: 16px; color: var(--pulsan-deep); }
        .psychology-header p { margin: 0; font-size: 11px; line-height: 1.5; color: var(--pulsan-muted); }

        .document-area {
          padding: 14px;
          border: 1px dashed #AFC9E9;
          border-radius: 14px;
          background: rgba(255,255,255,.72);
        }

        .document-area small { display: block; margin-top: 8px; color: var(--pulsan-muted); line-height: 1.45; font-size: 10px; }
        .document-name { margin-top: 9px; padding: 9px 11px; background: #fff; border-radius: 10px; font-size: 11px; color: var(--pulsan-text); overflow-wrap: anywhere; }

        .verification-note {
          margin-top: 13px;
          padding: 12px;
          border-radius: 12px;
          background: rgba(255,255,255,.65);
          color: #536B88;
          font-size: 10px;
          line-height: 1.5;
        }

        .terms-box {
          padding: 13px 14px;
          border-radius: 14px;
          background: #F8FBFF;
          border: 1px solid var(--pulsan-border);
        }

        .terms-label {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          cursor: pointer;
          line-height: 1.5;
          font-weight: 600;
          color: #526984;
        }

        .terms-label input {
          width: 17px;
          height: 17px;
          margin: 1px 0 0;
          accent-color: var(--pulsan-blue);
          flex: 0 0 auto;
        }

        .terms-label button {
          border: 0;
          background: transparent;
          padding: 0;
          color: var(--pulsan-blue);
          text-decoration: underline;
          cursor: pointer;
          font-weight: 800;
        }

        .security-line {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #6D7F99;
          font-size: 11px;
          line-height: 1.45;
        }

        .auth-button {
          width: 100%;
          min-height: 52px;
          border: 0;
          border-radius: 15px;
          background: linear-gradient(135deg, #3A7DFF, #2F69DE);
          color: #fff;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 10px 22px rgba(58,125,255,.22);
          transition: .2s ease;
        }

        .auth-button:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 13px 26px rgba(58,125,255,.28); }
        .auth-button:disabled { opacity: .65; cursor: not-allowed; }

        .auth-register,
        .auth-back {
          width: 100%;
          border: 0;
          background: transparent;
          cursor: pointer;
          font-weight: 700;
          font-size: 12px;
          padding: 8px;
        }

        .auth-register { color: var(--pulsan-blue); margin-top: 11px; }
        .auth-back { color: #7B8BA0; }

        .terms-modal {
          position: fixed;
          inset: 0;
          z-index: 1000;
          background: rgba(5,22,45,.58);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 18px;
          backdrop-filter: blur(6px);
        }

        .terms-modal-card {
          width: 100%;
          max-width: 620px;
          max-height: 86vh;
          max-height: 86dvh;
          overflow-y: auto;
          background: #fff;
          color: var(--pulsan-text);
          border-radius: 24px;
          padding: 26px;
          box-shadow: 0 25px 70px rgba(0,0,0,.24);
        }

        .terms-modal-card h2 { margin-top: 0; color: var(--pulsan-deep); }
        .terms-modal-card h3 { margin-bottom: 6px; color: var(--pulsan-deep); font-size: 14px; }
        .terms-modal-card p { color: #63758D; font-size: 13px; line-height: 1.6; }


        .email-verification-card {
          padding: 28px;
          border: 1px solid var(--pulsan-border);
          border-radius: 24px;
          background:
            radial-gradient(circle at 100% 0%, rgba(168,199,255,.22), transparent 32%),
            linear-gradient(180deg, #FBFDFF 0%, #F5F9FF 100%);
          box-shadow: 0 12px 30px rgba(15,45,91,.07);
          text-align: center;
        }

        .email-verification-icon {
          width: 66px;
          height: 66px;
          margin: 0 auto 15px;
          display: grid;
          place-items: center;
          border-radius: 21px;
          background: var(--pulsan-soft);
          border: 1px solid #D4E5FA;
          font-size: 29px;
        }

        .email-verification-eyebrow {
          color: var(--pulsan-blue);
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .11em;
          margin-bottom: 8px;
        }

        .email-verification-card h2 {
          margin: 0 0 10px;
          color: var(--pulsan-deep);
          font-size: 27px;
          letter-spacing: -.03em;
        }

        .email-verification-card > p {
          margin: 0;
          color: var(--pulsan-muted);
          font-size: 13px;
          line-height: 1.55;
        }

        .email-verification-email {
          display: block;
          margin: 7px 0 23px;
          color: var(--pulsan-text);
          font-size: 14px;
          overflow-wrap: anywhere;
        }

        .email-verification-help {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          margin: 15px 0;
          padding: 12px;
          border-radius: 13px;
          background: rgba(234,243,255,.65);
          color: #63758D;
          font-size: 11px;
          line-height: 1.5;
          text-align: left;
        }

        .resend-code-button {
          width: 100%;
          border: 0;
          background: transparent;
          color: var(--pulsan-blue);
          cursor: pointer;
          font-size: 12px;
          font-weight: 800;
          padding: 13px 8px 8px;
        }

        .resend-code-button:disabled {
          opacity: .6;
          cursor: not-allowed;
        }

        @media (max-width: 900px) {
          .pulsan-cadastro-page { padding: 20px; align-items: flex-start; }
          .cadastro-shell { grid-template-columns: 1fr; max-width: 720px; margin: 12px auto; }
          .cadastro-story { padding: 28px; min-height: 250px; }
          .story-content { max-width: none; }
          .story-content h2 { font-size: 32px; }
          .story-footer { margin-top: 25px; }
          .cadastro-form-side { max-height: none; padding: 34px 28px; }
        }

        @media (max-width: 600px) {
          .pulsan-cadastro-page { padding: 0; display: block; }
          .cadastro-shell {
            width: 100%;
            min-height: 100vh;
            min-height: 100dvh;
            margin: 0;
            border-radius: 0;
            display: block;
            box-shadow: none;
          }
          .cadastro-story {
            min-height: auto;
            padding: 24px 20px 25px;
            border-radius: 0;
          }
          .story-brand { margin-bottom: 27px; }
          .story-logo { width: 45px; height: 45px; }
          .story-content h2 { font-size: 29px; }
          .story-content p { font-size: 13px; }
          .story-message { margin-top: 18px; font-size: 12px; padding: 13px; }
          .story-footer { display: none; }
          .cadastro-form-side { padding: 27px 18px 32px; }
          .form-heading { margin-bottom: 22px; }
          .form-heading h1 { font-size: 27px; }
          .form-grid { grid-template-columns: 1fr; }
          .type-options { grid-template-columns: 1fr 1fr; }
          .type-option { min-height: 78px; }
          .profile-photo-group { align-items: flex-start; }
          .photo-info { min-width: calc(100% - 80px); }
          .photo-upload-button { width: 100%; }
          .psychology-box { padding: 15px; }
          .email-verification-card { padding: 20px; }
          .terms-modal-card { padding: 20px; border-radius: 18px; }
        }

        @media (max-width: 380px) {
          .type-options { grid-template-columns: 1fr; }
          .type-option { min-height: 67px; }
          .cadastro-form-side { padding-left: 14px; padding-right: 14px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .type-option, .auth-button, .form-group input, .form-group select { transition: none; }
        }
      `}</style>

      <main className="pulsan-cadastro-page">
        <div className="pulsan-glow one" />
        <div className="pulsan-glow two" />

        <div className="cadastro-shell">
          <section className="cadastro-story">
            <div className="story-brand">
              <img src="/logo.png" alt="Logo Pulsan" className="story-logo" />
              <strong>PULSAN</strong>
            </div>

            <div className="story-content">
              <span className="story-kicker">um espaço para você</span>
              <h2>Você não precisa passar por tudo sozinho.</h2>
              <p>
                O Pulsan nasceu para aproximar pessoas, incentivar a escuta
                e criar um ambiente onde falar, ouvir e pedir apoio possa ser
                mais leve.
              </p>
              <div className="story-message">
                <strong>“Você decide o que compartilhar.”</strong><br />
                Aqui, cada pessoa tem seu próprio espaço e seu próprio tempo.
              </div>
            </div>

            <div className="story-footer">
              <span className="story-pill">🔒 Segurança</span>
              <span className="story-pill">💙 Acolhimento</span>
              <span className="story-pill">🤝 Respeito</span>
            </div>
          </section>

          <section className="cadastro-form-side">
            <div className="form-heading">
              <div className="eyebrow">Primeiro passo</div>
              <h1>Criar minha conta</h1>
              <p>
                Dê apenas as informações necessárias para começar a fazer
                parte do Pulsan.
              </p>
            </div>


            {emailEnviado ? (
              <section className="email-verification-card" aria-labelledby="email-verification-title">
                <div className="email-verification-icon">✉️</div>
                <div className="email-verification-eyebrow">Confirmação de segurança</div>

                <h2 id="email-verification-title">Confirme seu e-mail</h2>

                <p>
                  Enviamos um e-mail de confirmação para:
                </p>

                <strong className="email-verification-email">
                  {emailConfirmacao}
                </strong>

                <div className="email-verification-help">
                  <span>🔐</span>
                  <span>
                    Abra a mensagem recebida e clique em
                    <strong> “Confirm your email address”</strong>.
                    Depois da confirmação, você poderá entrar no Pulsan com
                    seu e-mail e senha.
                  </span>
                </div>

                <button
                  type="button"
                  className="auth-button"
                  onClick={() => irPara("login")}
                >
                  Já confirmei meu e-mail
                </button>

                <button
                  type="button"
                  className="resend-code-button"
                  onClick={reenviarEmailConfirmacao}
                  disabled={carregando}
                >
                  {carregando
                    ? "Enviando..."
                    : "↻ Não recebi o e-mail — enviar novamente"}
                </button>

                <button
                  type="button"
                  className="auth-back"
                  onClick={() => {
                    if (carregando) return;
                    setEmailEnviado(false);
                    setEmailConfirmacao("");
                  }}
                  disabled={carregando}
                >
                  ← Voltar para o cadastro
                </button>
              </section>
            ) : (
              <form className="auth-form" onSubmit={cadastrar}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="nome">Nome</label>
                  <input
                    id="nome"
                    type="text"
                    placeholder="Como podemos chamar você?"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    autoComplete="name"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cadastro-email">E-mail</label>
                  <input
                    id="cadastro-email"
                    type="email"
                    placeholder="seuemail@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="type-section">
                <label>Como você quer entrar no Pulsan?</label>
                <div className="type-options">
                  {[
                    ["aluno", "🎓", "Aluno", "Sem critério adicional"],
                    ["visitante", "👤", "Visitante", "Conheça o Pulsan"],
                    ["colaborador", "💼", "Funcionário", "Conta corporativa"],
                    ["psicologo", "🧠", "Psicólogo parceiro", "Verificação profissional"],
                  ].map(([valor, icone, titulo, descricao]) => (
                    <button
                      key={valor}
                      type="button"
                      className={`type-option ${tipo === valor ? "active" : ""}`}
                      onClick={() => setTipo(valor)}
                      aria-pressed={tipo === valor}
                    >
                      <span className="type-icon">{icone}</span>
                      <span className="type-title">{titulo}</span>
                      <span className="type-desc">{descricao}</span>
                    </button>
                  ))}
                </div>

                {tipo === "colaborador" && (
                  <div style={{ marginTop: 12, color: "#6D7F99", fontSize: 11, lineHeight: 1.5 }}>
                    🏢 Funcionários Brisanet devem usar e-mail corporativo
                    <strong> @grupobrisanet.com.br</strong>.
                  </div>
                )}
              </div>

              <div className="profile-photo-group">
                <div className="profile-photo-preview">
                  {foto ? <img src={foto} alt="Prévia da foto de perfil" /> : <span>👤</span>}
                </div>
                <div className="photo-info">
                  <strong>Foto de perfil</strong>
                  <small>
                    Sua foto ajuda outras pessoas a reconhecer você quando
                    oferecer ajuda.
                  </small>
                </div>
                <label htmlFor="foto" className="photo-upload-button">📷 Escolher foto</label>
                <input
                  id="foto"
                  type="file"
                  accept="image/*"
                  onChange={selecionarFoto}
                  hidden
                />
              </div>

              {tipo === "psicologo" && (
                <div className="psychology-box">
                  <div className="psychology-header">
                    <div className="psychology-icon">🧠</div>
                    <div>
                      <h2>Verificação profissional</h2>
                      <p>
                        Essas informações serão analisadas pela equipe Pulsan
                        antes da liberação do selo de Psicólogo parceiro.
                      </p>
                    </div>
                  </div>

                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="telefone">Telefone</label>
                      <input
                        id="telefone"
                        type="tel"
                        placeholder="(00) 00000-0000"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        autoComplete="tel"
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="crp">Número do CRP</label>
                      <input
                        id="crp"
                        type="text"
                        placeholder="Ex.: CRP 00/00000"
                        value={crp}
                        onChange={(e) => setCrp(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-grid" style={{ marginTop: 15 }}>
                    <div className="form-group">
                      <label htmlFor="estado-crp">Estado/região do CRP</label>
                      <select
                        id="estado-crp"
                        value={estadoCrp}
                        onChange={(e) => setEstadoCrp(e.target.value)}
                      >
                        <option value="">Selecione</option>
                        {[
                          "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT",
                          "MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO",
                          "RR","SC","SP","SE","TO"
                        ].map((uf) => <option key={uf} value={uf}>{uf}</option>)}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="area-atuacao">Área de atuação</label>
                      <select
                        id="area-atuacao"
                        value={areaAtuacao}
                        onChange={(e) => setAreaAtuacao(e.target.value)}
                      >
                        <option value="">Selecione uma área</option>
                        <option>Psicologia clínica</option>
                        <option>Psicologia escolar/educacional</option>
                        <option>Psicologia organizacional e do trabalho</option>
                        <option>Psicologia social</option>
                        <option>Saúde mental</option>
                        <option>Psicologia familiar</option>
                        <option>Psicologia infantil</option>
                        <option>Psicologia do adolescente</option>
                        <option>Outra</option>
                      </select>
                    </div>
                  </div>

                  <div className="document-area" style={{ marginTop: 15 }}>
                    <div className="form-group">
                      <label>Documento comprobatório profissional</label>
                      <label htmlFor="documento-profissional" className="document-button">
                        📄 Selecionar documento
                      </label>
                      <input
                        id="documento-profissional"
                        type="file"
                        accept=".pdf,image/jpeg,image/png,image/webp"
                        onChange={selecionarDocumento}
                        hidden
                      />
                      {nomeDocumento && <div className="document-name">📎 {nomeDocumento}</div>}
                      <small>
                        PDF, JPG, PNG ou WEBP · máximo de 5 MB.
                      </small>
                    </div>
                  </div>

                  <div className="verification-note">
                    🔒 O documento será utilizado somente para a verificação
                    profissional. O selo não será liberado automaticamente:
                    a aprovação será feita pela equipe responsável do Pulsan.
                  </div>
                </div>
              )}

              <div className="form-grid">
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

                <div className="form-group">
                  <label htmlFor="confirmar-senha">Confirmar senha</label>
                  <input
                    id="confirmar-senha"
                    type="password"
                    placeholder="Digite novamente"
                    value={confirmarSenha}
                    onChange={(e) => setConfirmarSenha(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <div className="terms-box">
                <label className="terms-label">
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
                    >
                      Termo de Uso
                    </button>{" "}
                    e a Política de Privacidade do Pulsan.
                  </span>
                </label>
              </div>

              <div className="security-line">
                <span>🔒</span>
                <span>Seus dados são protegidos. Sua participação na comunidade pode ser anônima.</span>
              </div>

              <button type="submit" className="auth-button" disabled={carregando}>
                {carregando ? "Criando seu espaço..." : "Criar meu espaço"}
              </button>
            </form>
            )}



            {mostrarTermos && (
              <div className="terms-modal">
                <div className="terms-modal-card">
                  <h2>Termo de Uso e Consentimento — Pulsan</h2>
                  <p>
                    O Pulsan é uma plataforma de apoio emocional. Ele busca
                    incentivar a escuta, o respeito e a empatia, mas não
                    substitui atendimento psicológico, médico ou psiquiátrico.
                  </p>
                  <h3>Uso responsável</h3>
                  <p>
                    Não é permitido publicar ameaças, ofensas, preconceito,
                    assédio, perseguição, exposição de dados pessoais,
                    incentivo à violência, automutilação ou suicídio.
                  </p>
                  <h3>Privacidade e anonimato</h3>
                  <p>
                    O Pulsan busca oferecer espaços anônimos, mas o anonimato
                    não é uma garantia absoluta. Informações poderão ser
                    analisadas ou compartilhadas quando necessário para cumprir
                    a lei ou proteger alguém.
                  </p>
                  <h3>Conversas privadas</h3>
                  <p>
                    Conversas privadas dependem da aceitação do outro usuário.
                    Ninguém é obrigado a aceitar ou continuar uma interação.
                  </p>
                  <h3>Moderação e situações de risco</h3>
                  <p>
                    O Pulsan poderá utilizar moderação automática e humana para
                    identificar conteúdos ofensivos, ameaças, bullying e
                    possíveis situações de risco.
                  </p>
                  <h3>Declaração de aceite</h3>
                  <p>
                    Ao aceitar, o usuário declara que leu e compreendeu as
                    regras de utilização e entende que o Pulsan não é um
                    serviço de emergência.
                  </p>
                  <button
                    type="button"
                    className="auth-button"
                    onClick={() => {
                      setAceitouTermos(true);
                      setMostrarTermos(false);
                    }}
                  >
                    Li e aceito os termos
                  </button>
                  <button
                    type="button"
                    className="auth-back"
                    onClick={() => setMostrarTermos(false)}
                  >
                    Fechar
                  </button>
                </div>
              </div>
            )}

            <button type="button" className="auth-register" onClick={() => irPara("login")}>
              Já tenho uma conta
            </button>

            <button type="button" className="auth-back" onClick={() => irPara("inicio")}>
              ← Voltar
            </button>
          </section>
        </div>
      </main>
    </>
  );
}

export default Cadastro;
