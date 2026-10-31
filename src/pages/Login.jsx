import React, { useState } from "react";

import { supabase } from "../lib/supabase";

function Login({ irPara }) {

  const [email, setEmail] = useState("");

  const [senha, setSenha] = useState("");

  const [mostrarSenha, setMostrarSenha] = useState(false);

  const [carregando, setCarregando] = useState(false);

  async function entrar(e) {

    e.preventDefault();

    if (!email.trim() || !senha) {

      alert("Preencha seu e-mail e sua senha.");

      return;

    }

    setCarregando(true);

    try {

      const emailNormalizado = email.trim().toLowerCase();

      // A autenticação real é feita pelo Supabase Auth.

      // O localStorage é usado somente para dados de interface/navegação,

      // nunca como fonte de autenticação ou senha.

      const { data, error } = await supabase.auth.signInWithPassword({

        email: emailNormalizado,

        password: senha,

      });

      if (error) {

        console.error("Erro no login:", error);

        if (error.message?.toLowerCase().includes("email not confirmed")) {

          alert("Confirme seu e-mail antes de entrar na plataforma.");

        } else {

          alert("E-mail ou senha incorretos.");

        }

        return;

      }

      const usuarioAuth = data?.user;

      if (!usuarioAuth) {

        alert("Não foi possível identificar sua conta.");

        return;

      }

      // Valida o perfil pelo usuário autenticado.

      // O RPC evita a chamada REST direta que estava causando "Failed to fetch".

      const { data: perfisRecebidos, error: erroPerfil } =

        await supabase.rpc("obter_meu_perfil");

      console.log("RESULTADO DA VALIDAÇÃO DO PERFIL:", {

        usuarioId: usuarioAuth.id,

        perfil: Array.isArray(perfisRecebidos)

          ? perfisRecebidos[0] || null

          : null,

        erro: erroPerfil,

      });

      if (erroPerfil) {

        console.error("ERRO COMPLETO AO BUSCAR PERFIL:", erroPerfil);

        await supabase.auth.signOut();

        alert(

          `Erro ao carregar perfil:\n\n` +

            `Código: ${erroPerfil.code || "não informado"}\n` +

            `Mensagem: ${erroPerfil.message || "não informada"}\n` +

            `Detalhes: ${erroPerfil.details || "não informado"}`

        );

        return;

      }

      const perfil = Array.isArray(perfisRecebidos)

        ? perfisRecebidos[0] || null

        : null;

      if (!perfil) {

        console.error(

          "PERFIL NÃO ENCONTRADO PARA O USUÁRIO:",

          usuarioAuth.id

        );

        await supabase.auth.signOut();

        alert(

          "Sua conta foi autenticada, mas o perfil não foi encontrado. " +

            "O cadastro precisa ser concluído antes de entrar na plataforma."

        );

        return;

      }

      console.log("PERFIL VALIDADO COM SUCESSO:", perfil);

      /*

       * O tipo do usuário é definido no metadata criado durante o cadastro.

       * O perfil continua sendo usado para os dados públicos da conta.

       *

       * Importante: "tipo_usuario" não existe atualmente na tabela "perfis",

       * portanto não dependemos dessa coluna para o login.

       */

      /*

       * IDENTIFICAÇÃO DA CONTA ADMINISTRATIVA

       *

       * O administrador não pode depender de uma única chave.

       * Contas criadas em versões diferentes do Pulsan podem ter

       * a informação administrativa em campos diferentes do

       * metadata do Supabase.

       *

       * A autenticação continua sendo feita pelo Supabase Auth.

       * Aqui apenas identificamos o tipo/área da conta já autenticada.

       */

      const metadataUsuario = usuarioAuth.user_metadata || {};

      const tipoUsuarioBruto =

        metadataUsuario.tipo_usuario ||

        metadataUsuario.tipo ||

        perfil?.tipo_usuario ||

        perfil?.tipo ||

        "";

      const areaAcessoBruta =

        metadataUsuario.area_acesso ||

        metadataUsuario.areaAcesso ||

        metadataUsuario.area ||

        perfil?.area_acesso ||

        perfil?.areaAcesso ||

        "";

      const valorNormalizado = (valor) =>

        String(valor || "")

          .trim()

          .toLowerCase()

          .normalize("NFD")

          .replace(/[\u0300-\u036f]/g, "")

          .replace(/[-\s]+/g, "_");

      const tipoNormalizado = valorNormalizado(tipoUsuarioBruto);

      const areaNormalizada = valorNormalizado(areaAcessoBruta);

      const ehAdministrador =

        emailNormalizado === "admin.pulsan@gmail.com" ||

        ["admin", "administrador", "equipe_pulsan", "equipe_pulsan_admin"].includes(

          tipoNormalizado

        ) ||

        ["administrativo", "admin", "painel_admin", "painel_administrativo"].includes(

          areaNormalizada

        ) ||

        metadataUsuario.is_admin === true ||

        metadataUsuario.isAdmin === true ||

        metadataUsuario.admin === true;

      /*

       * Para o restante da aplicação, o administrador recebe um

       * tipo único e inequívoco. Isso evita que o App trate a conta

       * administrativa como aluno/usuário comum.

       */

      const tipoUsuario = ehAdministrador

        ? "admin"

        : tipoUsuarioBruto || "aluno";

      let dadosPsicologo = null;

      // Para psicólogos, a situação de aprovação vem da tabela psicologos,

      // vinculada ao auth.users por usuario_id. Assim, não dependemos de

      // localStorage para decidir se o profissional foi aprovado.

      if (tipoUsuario === "psicologo") {

        const { data: psicologo, error: erroPsicologo } = await supabase

          .from("psicologos")

          .select(

            "id, usuario_id, nome, email, telefone, crp, estado_crp, area_atuacao, verificado, ativo, disponivel"

          )

          .eq("usuario_id", usuarioAuth.id)

          .maybeSingle();

        if (erroPsicologo) {

          console.error("Erro ao buscar cadastro do psicólogo:", erroPsicologo);

        } else {

          dadosPsicologo = psicologo;

        }

      }

      const verificacaoPsicologo =

        tipoUsuario === "psicologo"

          ? dadosPsicologo?.verificado === true

            ? "aprovado"

            : usuarioAuth.user_metadata?.verificacao_psicologo || "pendente"

          : perfil?.verificacao_psicologo ||

            usuarioAuth.user_metadata?.verificacao_psicologo ||

            "nao_enviado";

      const psicologoParceiro =

        tipoUsuario === "psicologo"

          ? dadosPsicologo?.verificado === true &&

            dadosPsicologo?.ativo !== false

          : Boolean(

              perfil?.psicologo_parceiro ||

                usuarioAuth.user_metadata?.psicologo_parceiro

            );

      const usuarioEncontrado = {

        id: usuarioAuth.id,

        email: usuarioAuth.email || emailNormalizado,

        nome:

          perfil?.nome ||

          dadosPsicologo?.nome ||

          usuarioAuth.user_metadata?.nome ||

          usuarioAuth.user_metadata?.name ||

          "Usuário",

        foto_url:

          perfil?.foto_url ||

          perfil?.foto ||

          usuarioAuth.user_metadata?.foto_url ||

          "",

        tipo_usuario: tipoUsuario,

        crp:

          dadosPsicologo?.crp ||

          perfil?.crp ||

          usuarioAuth.user_metadata?.crp ||

          "",

        estado_crp:

          dadosPsicologo?.estado_crp ||

          usuarioAuth.user_metadata?.estado_crp ||

          "",

        area_atuacao:

          dadosPsicologo?.area_atuacao ||

          usuarioAuth.user_metadata?.area_atuacao ||

          "",

        verificacao_psicologo: verificacaoPsicologo,

        psicologo_parceiro: psicologoParceiro,

        // O documento profissional não é mais carregado nem salvo no

        // localStorage. Documentos devem permanecer em armazenamento

        // privado e ser acessados somente por fluxo autorizado.

        documento: "",

        nome_documento: "",

      };

      // Mantém os dados necessários para as telas existentes.

      // A sessão/autenticação continua sob responsabilidade do Supabase Auth.

      localStorage.setItem(

        "usuarioLogado",

        JSON.stringify(usuarioEncontrado)

      );

      localStorage.setItem(

        "pulsanUsuarioAtual",

        JSON.stringify(usuarioEncontrado)

      );

      localStorage.setItem("pulsanNome", usuarioEncontrado.nome);

      localStorage.setItem("pulsanEmail", usuarioEncontrado.email);

      localStorage.setItem("pulsanFoto", usuarioEncontrado.foto_url);

      localStorage.setItem("pulsanTipo", usuarioEncontrado.tipo_usuario);

      if (usuarioEncontrado.tipo_usuario === "psicologo") {

        localStorage.setItem("pulsanCRP", usuarioEncontrado.crp);

        localStorage.setItem(

          "pulsanVerificacaoPsicologo",

          usuarioEncontrado.verificacao_psicologo

        );

        localStorage.setItem(

          "pulsanPsicologoParceiro",

          usuarioEncontrado.psicologo_parceiro ? "true" : "false"

        );

        // Remove dados antigos eventualmente gravados por versões

        // anteriores do cadastro/login.

        localStorage.removeItem("pulsanDocumentoProfissional");

        localStorage.removeItem("pulsanNomeDocumento");

      }

      // Grava explicitamente a área da conta para o App.jsx.

      // O administrador não entra no fluxo comum da plataforma.

      localStorage.setItem(

        "pulsanEquipePulsan",

        ehAdministrador ? "true" : "false"

      );

      localStorage.setItem(

        "pulsanAreaAcesso",

        ehAdministrador ? "administrativo" : "usuario"

      );

      localStorage.setItem(

        "pulsanAcessoAdmin",

        ehAdministrador ? "true" : "false"

      );

      // A conta administrativa não utiliza o fluxo comum da plataforma.

      if (ehAdministrador) {

        localStorage.setItem("pulsanAcessoAdmin", "true");

        alert(

          `Bem-vindo ao Pulsan, ${usuarioEncontrado.nome || "usuário"}! 💚`

        );

        setEmail("");

        setSenha("");

        irPara("painel-admin");

        return;

      }

      localStorage.removeItem("pulsanAcessoAdmin");

      alert(

        `Bem-vindo ao Pulsan, ${usuarioEncontrado.nome || "usuário"}! 💚`

      );

      setEmail("");

      setSenha("");

      // A configuração de acessibilidade é individual por conta.

      const chaveAcessibilidadeConta =

        `pulsanAcessibilidadeConfigurada_${usuarioEncontrado.id}`;

      const acessibilidadeJaConfigurada =

        localStorage.getItem(chaveAcessibilidadeConta) === "true";

      if (!acessibilidadeJaConfigurada) {

        irPara("acessibilidade-inicial");

        return;

      }

      if (

        usuarioEncontrado.tipo_usuario === "aluno" ||

        usuarioEncontrado.tipo_usuario === "psicologo"

      ) {

        irPara("ambiente");

        return;

      }

      if (usuarioEncontrado.tipo_usuario === "colaborador") {

        irPara("empresa");

        return;

      }

      irPara("ambiente");

    } catch (erro) {

      console.error("Erro inesperado no login:", erro);

      alert("Ocorreu um erro inesperado ao entrar na conta.");

    } finally {

      setCarregando(false);

    }

  }

  async function recuperarSenha() {

    const emailNormalizado = email.trim().toLowerCase();

    if (!emailNormalizado) {

      alert(

        "Digite seu e-mail no campo acima para recuperar sua senha."

      );

      return;

    }

    setCarregando(true);

    try {

      const { error } =

        await supabase.auth.resetPasswordForEmail(

          emailNormalizado,

          {

            redirectTo: "https://pulsan.vercel.app/?redefinir-senha=1",

          }

        );

      if (error) {

        console.error(

          "Erro ao recuperar senha:",

          error

        );

        alert(

          error.message?.toLowerCase().includes("rate limit")

            ? "Muitas solicitações em pouco tempo. Aguarde alguns minutos e tente novamente."

            : "Não foi possível enviar o link. Confira o e-mail informado e tente novamente."

        );

        return;

      }

      alert(

        "Se esse endereço estiver cadastrado no Pulsan, enviaremos um link de recuperação. Verifique sua caixa de entrada e também o spam."

      );

    } catch (erro) {

      console.error(

        "Erro inesperado na recuperação:",

        erro

      );

      alert(

        "Ocorreu um erro ao tentar recuperar sua senha."

      );

    } finally {

      setCarregando(false);

    }

  }

  return (

    <main className="pulsan-login-page">

      <style>{`

        .pulsan-login-page {

          min-height: 100vh;

          min-height: 100dvh;

          display: grid;

          grid-template-columns: minmax(0, 1.08fr) minmax(420px, 0.92fr);

          background: #EAF3FF;

          color: #0F2D5B;

          overflow: hidden;

          position: relative;

        }

        .pulsan-login-page *,

        .pulsan-login-page *::before,

        .pulsan-login-page *::after {

          box-sizing: border-box;

        }

        .pulsan-login-essence {

          position: relative;

          display: flex;

          align-items: center;

          justify-content: center;

          padding: 60px clamp(35px, 7vw, 110px);

          overflow: hidden;

          background:

            radial-gradient(circle at 15% 20%, rgba(168,199,255,.55), transparent 28%),

            radial-gradient(circle at 85% 80%, rgba(58,125,255,.22), transparent 32%),

            linear-gradient(145deg, #EAF3FF 0%, #FFFFFF 100%);

        }

        .pulsan-login-orb {

          position: absolute;

          border-radius: 50%;

          pointer-events: none;

          opacity: .7;

        }

        .pulsan-login-orb.one {

          width: 300px;

          height: 300px;

          top: -145px;

          left: -100px;

          background: #A8C7FF;

          filter: blur(2px);

        }

        .pulsan-login-orb.two {

          width: 240px;

          height: 240px;

          right: -90px;

          bottom: -110px;

          background: #A8C7FF;

          opacity: .35;

        }

        .pulsan-login-wings {

          position: absolute;

          right: 7%;

          top: 11%;

          width: 145px;

          height: 105px;

          opacity: .3;

          transform: rotate(-12deg);

        }

        .pulsan-login-wings::before,

        .pulsan-login-wings::after {

          content: "";

          position: absolute;

          width: 72px;

          height: 100px;

          border: 2px solid #3A7DFF;

          background: rgba(168,199,255,.22);

          border-radius: 75% 25% 65% 35%;

        }

        .pulsan-login-wings::before {

          left: 4px;

          transform: rotate(18deg);

        }

        .pulsan-login-wings::after {

          right: 4px;

          transform: scaleX(-1) rotate(18deg);

        }

        .pulsan-login-essence-content {

          position: relative;

          z-index: 2;

          width: min(100%, 650px);

        }

        .pulsan-login-logo {

          width: 82px;

          height: 82px;

          object-fit: contain;

          display: block;

          margin-bottom: 20px;

          filter: drop-shadow(0 8px 18px rgba(58,125,255,.18));

        }

        .pulsan-login-brand {

          margin-bottom: 25px;

          font-size: 18px;

          letter-spacing: .32em;

          font-weight: 800;

          color: #0F2D5B;

        }

        .pulsan-login-essence h1 {

          margin: 0;

          max-width: 590px;

          font-size: clamp(38px, 4.5vw, 68px);

          line-height: 1.05;

          letter-spacing: -.04em;

          color: #0F2D5B;

        }

        .pulsan-login-essence-text {

          max-width: 550px;

          margin: 24px 0 30px;

          font-size: 18px;

          line-height: 1.7;

          color: #31527e;

        }

        .pulsan-login-values {

          display: flex;

          flex-wrap: wrap;

          gap: 10px;

          margin-bottom: 38px;

        }

        .pulsan-login-value {

          display: inline-flex;

          align-items: center;

          gap: 8px;

          padding: 10px 14px;

          border: 1px solid #A8C7FF;

          border-radius: 999px;

          background: rgba(255,255,255,.72);

          color: #0F2D5B;

          font-size: 13px;

          font-weight: 700;

          box-shadow: 0 5px 18px rgba(15,45,91,.05);

        }

        .pulsan-login-commitment {

          max-width: 520px;

          padding: 19px 21px;

          border-left: 4px solid #3A7DFF;

          border-radius: 0 18px 18px 0;

          background: rgba(255,255,255,.68);

          box-shadow: 0 8px 28px rgba(15,45,91,.06);

        }

        .pulsan-login-commitment strong {

          display: block;

          margin-bottom: 6px;

          font-size: 16px;

          color: #0F2D5B;

        }

        .pulsan-login-commitment span {

          display: block;

          font-size: 14px;

          line-height: 1.6;

          color: #48658c;

        }

        .pulsan-login-panel {

          display: flex;

          align-items: center;

          justify-content: center;

          padding: 40px clamp(22px, 5vw, 75px);

          background: #FFFFFF;

          position: relative;

          z-index: 3;

        }

        .pulsan-login-card {

          width: min(100%, 450px);

          padding: clamp(30px, 4vw, 48px);

          border: 1px solid #A8C7FF;

          border-radius: 30px;

          background: #FFFFFF;

          box-shadow: 0 22px 65px rgba(15,45,91,.12);

        }

        .pulsan-login-card-logo {

          width: 48px;

          height: 48px;

          object-fit: contain;

          margin-bottom: 18px;

        }

        .pulsan-login-card h2 {

          margin: 0;

          color: #0F2D5B;

          font-size: clamp(27px, 3vw, 34px);

          line-height: 1.15;

          letter-spacing: -.025em;

        }

        .pulsan-login-card-description {

          margin: 10px 0 30px;

          color: #58708f;

          font-size: 15px;

          line-height: 1.55;

        }

        .pulsan-login-form {

          display: flex;

          flex-direction: column;

          gap: 18px;

        }

        .pulsan-login-field {

          display: flex;

          flex-direction: column;

          gap: 8px;

        }

        .pulsan-login-field label {

          color: #0F2D5B;

          font-size: 13px;

          font-weight: 750;

        }

        .pulsan-login-input-wrap {

          position: relative;

        }

        .pulsan-login-input {

          width: 100%;

          height: 54px;

          border: 1.5px solid #A8C7FF;

          border-radius: 15px;

          padding: 0 16px;

          outline: none;

          background: #EAF3FF;

          color: #0F2D5B;

          font-size: 15px;

          transition: .2s ease;

        }

        .pulsan-login-input::placeholder {

          color: #7a93b4;

        }

        .pulsan-login-input:focus {

          border-color: #3A7DFF;

          background: #FFFFFF;

          box-shadow: 0 0 0 4px rgba(58,125,255,.12);

        }

        .pulsan-login-password {

          padding-right: 78px;

        }

        .pulsan-login-show {

          position: absolute;

          top: 50%;

          right: 10px;

          transform: translateY(-50%);

          border: none;

          background: transparent;

          color: #3A7DFF;

          font-size: 12px;

          font-weight: 750;

          cursor: pointer;

          padding: 9px 8px;

        }

        .pulsan-login-link {

          align-self: flex-end;

          margin-top: -5px;

          border: none;

          background: transparent;

          color: #3A7DFF;

          font-size: 13px;

          font-weight: 700;

          cursor: pointer;

          padding: 4px 0;

        }

        .pulsan-login-submit {

          width: 100%;

          height: 54px;

          border: none;

          border-radius: 15px;

          background: #3A7DFF;

          color: #FFFFFF;

          font-size: 15px;

          font-weight: 800;

          cursor: pointer;

          box-shadow: 0 10px 24px rgba(58,125,255,.25);

          transition: transform .18s ease, box-shadow .18s ease;

        }

        .pulsan-login-submit:hover:not(:disabled) {

          transform: translateY(-2px);

          box-shadow: 0 14px 30px rgba(58,125,255,.32);

        }

        .pulsan-login-submit:disabled,

        .pulsan-login-link:disabled,

        .pulsan-login-show:disabled {

          opacity: .6;

          cursor: not-allowed;

        }

        .pulsan-login-register {

          width: 100%;

          margin-top: 20px;

          padding: 12px;

          border: none;

          background: transparent;

          color: #0F2D5B;

          font-size: 14px;

          cursor: pointer;

        }

        .pulsan-login-register strong {

          color: #3A7DFF;

        }

        .pulsan-login-back {

          width: 100%;

          margin-top: 3px;

          padding: 8px;

          border: none;

          background: transparent;

          color: #6a819e;

          font-size: 13px;

          cursor: pointer;

        }

        .pulsan-login-security {

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 7px;

          margin-top: 23px;

          padding-top: 18px;

          border-top: 1px solid #EAF3FF;

          color: #58708f;

          font-size: 12px;

          text-align: center;

          line-height: 1.4;

        }

        @media (max-width: 900px) {
  .pulsan-login-page {
    grid-template-columns: 1fr;
    min-height: 100dvh;
    overflow-x: hidden;
    overflow-y: auto;
    background: #EAF3FF;
  }

  .pulsan-login-essence {
    min-height: auto;
    padding: 46px 28px 42px;
    text-align: center;
  }

  .pulsan-login-essence-content {
    width: 100%;
    max-width: 620px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
  }

  .pulsan-login-logo {
    width: 76px;
    height: 76px;
    margin: 0 auto 14px;
  }

  .pulsan-login-brand {
    margin-bottom: 22px;
    font-size: 17px;
    letter-spacing: .28em;
  }

  .pulsan-login-essence h1 {
    max-width: 560px;
    font-size: clamp(34px, 7vw, 48px);
    line-height: 1.08;
  }

  .pulsan-login-essence-text {
    max-width: 560px;
    margin: 22px auto 26px;
    font-size: 17px;
    line-height: 1.55;
  }

  .pulsan-login-values {
    justify-content: center;
    gap: 10px;
    margin-bottom: 0;
  }

  .pulsan-login-value {
    padding: 10px 14px;
    font-size: 14px;
  }

  .pulsan-login-value:nth-child(n+3) {
    display: none;
  }

  .pulsan-login-commitment,
  .pulsan-login-wings {
    display: none;
  }

  .pulsan-login-panel {
    min-height: auto;
    padding: 0 22px 34px;
    background: #EAF3FF;
    align-items: flex-start;
  }

  .pulsan-login-card {
    width: 100%;
    max-width: 620px;
    margin: 0 auto;
    padding: 38px 34px 28px;
    border-radius: 28px;
    box-shadow: 0 15px 45px rgba(15,45,91,.10);
  }

  .pulsan-login-card-logo {
    width: 54px;
    height: 54px;
    margin-bottom: 24px;
  }

  .pulsan-login-card h2 {
    font-size: 34px;
    line-height: 1.12;
  }

  .pulsan-login-card-description {
    margin: 16px 0 34px;
    font-size: 18px;
    line-height: 1.55;
  }

  .pulsan-login-form {
    gap: 20px;
  }

  .pulsan-login-field {
    gap: 9px;
  }

  .pulsan-login-field label {
    font-size: 16px;
  }

  .pulsan-login-input {
    height: 60px;
    border-radius: 17px;
    font-size: 17px;
  }

  .pulsan-login-password {
    padding-right: 96px;
  }

  .pulsan-login-show {
    right: 12px;
    font-size: 15px;
  }

  .pulsan-login-link {
    font-size: 16px;
  }

  .pulsan-login-submit {
    height: 60px;
    border-radius: 17px;
    font-size: 19px;
  }

  .pulsan-login-register {
    margin-top: 24px;
    font-size: 16px;
  }

  .pulsan-login-back {
    margin-top: 8px;
    font-size: 15px;
  }

  .pulsan-login-security {
    margin-top: 24px;
    padding-top: 20px;
    font-size: 14px;
  }
}

@media (max-width: 560px) {
  .pulsan-login-page {
    display: block;
    width: 100%;
    min-height: 100dvh;
    background: #EAF3FF;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .pulsan-login-essence {
    min-height: 360px;
    padding: 32px 20px 30px;
    text-align: center;
  }

  .pulsan-login-essence-content {
    width: 100%;
    max-width: 360px;
    margin: 0 auto;
  }

  .pulsan-login-logo {
    width: 60px;
    height: 60px;
    margin: 0 auto 12px;
  }

  .pulsan-login-brand {
    margin-bottom: 20px;
    font-size: 15px;
    letter-spacing: .27em;
  }

  .pulsan-login-essence h1 {
    max-width: 350px;
    margin: 0 auto;
    font-size: 31px;
    line-height: 1.08;
    letter-spacing: -.035em;
  }

  .pulsan-login-essence-text {
    max-width: 350px;
    margin: 20px auto 24px;
    font-size: 14px;
    line-height: 1.55;
  }

  .pulsan-login-values {
    justify-content: center;
    gap: 8px;
    margin: 0;
  }

  .pulsan-login-value {
    padding: 8px 11px;
    font-size: 12px;
  }

  .pulsan-login-value:nth-child(n+3) {
    display: none;
  }

  .pulsan-login-commitment,
  .pulsan-login-wings {
    display: none;
  }

  .pulsan-login-orb.one {
    width: 180px;
    height: 180px;
    top: -92px;
    left: -78px;
  }

  .pulsan-login-orb.two {
    width: 150px;
    height: 150px;
    right: -75px;
    bottom: -75px;
  }

  .pulsan-login-panel {
    width: 100%;
    min-height: auto;
    padding: 0 13px 28px;
    background: #EAF3FF;
  }

  .pulsan-login-card {
    width: 100%;
    max-width: none;
    margin: 0;
    padding: 28px 20px 22px;
    border: 1px solid #A8C7FF;
    border-radius: 28px;
    background: #FFFFFF;
    box-shadow: 0 14px 40px rgba(15,45,91,.09);
  }

  .pulsan-login-card-logo {
    width: 42px;
    height: 42px;
    margin-bottom: 20px;
  }

  .pulsan-login-card h2 {
    margin: 0;
    font-size: 27px;
    line-height: 1.12;
  }

  .pulsan-login-card-description {
    margin: 14px 0 28px;
    font-size: 14px;
    line-height: 1.55;
  }

  .pulsan-login-form {
    gap: 17px;
  }

  .pulsan-login-field {
    gap: 8px;
  }

  .pulsan-login-field label {
    font-size: 14px;
  }

  .pulsan-login-input {
    height: 52px;
    padding: 0 15px;
    border-radius: 15px;
    font-size: 15px;
  }

  .pulsan-login-password {
    padding-right: 78px;
  }

  .pulsan-login-show {
    right: 9px;
    font-size: 12px;
    padding: 8px 7px;
  }

  .pulsan-login-link {
    margin-top: -3px;
    font-size: 13px;
  }

  .pulsan-login-submit {
    height: 52px;
    border-radius: 15px;
    font-size: 16px;
  }

  .pulsan-login-register {
    margin-top: 22px;
    padding: 10px 4px;
    font-size: 14px;
  }

  .pulsan-login-back {
    margin-top: 4px;
    padding: 8px 4px;
    font-size: 13px;
  }

  .pulsan-login-security {
    margin-top: 22px;
    padding-top: 18px;
    font-size: 12px;
    line-height: 1.45;
  }
}

@media (prefers-reduced-motion: no-preference) {

          .pulsan-login-orb.two {

            animation: pulsanFloat 7s ease-in-out infinite;

          }

          @keyframes pulsanFloat {

            0%, 100% { transform: translateY(0); }

            50% { transform: translateY(-10px); }

          }

        }

      `}</style>

      <section className="pulsan-login-essence">

        <span className="pulsan-login-orb one" />

        <span className="pulsan-login-orb two" />

        <span className="pulsan-login-wings" />

        <div className="pulsan-login-essence-content">

          <img

            src="/logo.png"

            alt="Logo Pulsan"

            className="pulsan-login-logo"

          />

          <div className="pulsan-login-brand">PULSAN</div>

          <h1>

            Aqui, você não precisa enfrentar tudo sozinho.

          </h1>

          <p className="pulsan-login-essence-text">

            Um espaço para ouvir, acolher e conectar pessoas.

            Porque cuidar do emocional também é cuidar de quem

            está ao nosso lado.

          </p>

          <div className="pulsan-login-values">

            <span className="pulsan-login-value">💬 Escuta</span>

            <span className="pulsan-login-value">🤝 Apoio</span>

            <span className="pulsan-login-value">🔒 Segurança</span>

            <span className="pulsan-login-value">💙 Acolhimento</span>

          </div>

          <div className="pulsan-login-commitment">

            <strong>Cuidar de pessoas é o nosso compromisso.</strong>

            <span>

              O Pulsan foi pensado para criar um espaço onde

              sentimentos possam ser compartilhados com respeito,

              segurança e acolhimento.

            </span>

          </div>

        </div>

      </section>

      <section className="pulsan-login-panel">

        <div className="pulsan-login-card">

          <img

            src="/logo.png"

            alt="Pulsan"

            className="pulsan-login-card-logo"

          />

          <h2>Que bom ter você aqui.</h2>

          <p className="pulsan-login-card-description">

            Entre na sua conta para continuar sua jornada no Pulsan.

          </p>

          <form className="pulsan-login-form" onSubmit={entrar}>

            <div className="pulsan-login-field">

              <label htmlFor="email">E-mail</label>

              <input

                id="email"

                type="email"

                className="pulsan-login-input"

                placeholder="Digite seu e-mail"

                value={email}

                onChange={(e) => setEmail(e.target.value)}

                autoComplete="email"

                disabled={carregando}

              />

            </div>

            <div className="pulsan-login-field">

              <label htmlFor="senha">Senha</label>

              <div className="pulsan-login-input-wrap">

                <input

                  id="senha"

                  type={mostrarSenha ? "text" : "password"}

                  className="pulsan-login-input pulsan-login-password"

                  placeholder="Digite sua senha"

                  value={senha}

                  onChange={(e) => setSenha(e.target.value)}

                  autoComplete="current-password"

                  disabled={carregando}

                />

                <button

                  type="button"

                  className="pulsan-login-show"

                  onClick={() => setMostrarSenha(!mostrarSenha)}

                  disabled={carregando}

                >

                  {mostrarSenha ? "Ocultar" : "Mostrar"}

                </button>

              </div>

            </div>

            <button

              type="button"

              className="pulsan-login-link"

              onClick={recuperarSenha}

              disabled={carregando}

            >

              Esqueci minha senha

            </button>

            <button

              type="submit"

              className="pulsan-login-submit"

              disabled={carregando}

            >

              {carregando ? "Entrando..." : "Entrar"}

            </button>

          </form>

          <button

            type="button"

            className="pulsan-login-register"

            onClick={() => irPara("cadastro")}

            disabled={carregando}

          >

            Ainda não tenho uma conta{" "}

            <strong>→ Criar conta</strong>

          </button>

          <button

            type="button"

            className="pulsan-login-back"

            onClick={() => irPara("inicio")}

            disabled={carregando}

          >

            ← Voltar para o início

          </button>

          <div className="pulsan-login-security">

            🔒 Sua privacidade e segurança são importantes para nós.

          </div>

        </div>

      </section>

       </main>

  );

}

export default Login;
