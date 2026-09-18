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

      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailNormalizado,
        password: senha,
      });

      if (error) {
        console.error("Erro no login:", error);

        if (
          error.message.toLowerCase().includes("email not confirmed")
        ) {
          alert("Confirme seu e-mail antes de entrar na plataforma.");
        } else {
          alert("E-mail ou senha incorretos.");
        }

        return;
      }

      const usuarioAuth = data.user;

      if (!usuarioAuth) {
        alert("Não foi possível identificar sua conta.");
        return;
      }

      const { data: perfil, error: erroPerfil } = await supabase
        .from("perfis")
        .select("*")
        .eq("id", usuarioAuth.id)
        .maybeSingle();

      if (erroPerfil) {
        console.error("Erro ao buscar perfil:", erroPerfil);
      }

      const tipoUsuario =
        perfil?.tipo_usuario ||
        usuarioAuth.user_metadata?.tipo_usuario ||
        "aluno";

      const usuarioEncontrado = {
        id: usuarioAuth.id,
        email: usuarioAuth.email || emailNormalizado,

        nome:
          perfil?.nome ||
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
          perfil?.crp ||
          usuarioAuth.user_metadata?.crp ||
          "",

        verificacao_psicologo:
          perfil?.verificacao_psicologo ||
          usuarioAuth.user_metadata?.verificacao_psicologo ||
          "pendente",

        psicologo_parceiro:
          perfil?.psicologo_parceiro ||
          usuarioAuth.user_metadata?.psicologo_parceiro ||
          false,

        documento:
          perfil?.documento ||
          usuarioAuth.user_metadata?.documento ||
          "",

        nome_documento:
          perfil?.nome_documento ||
          usuarioAuth.user_metadata?.nome_documento ||
          "",
      };

      localStorage.setItem(
        "usuarioLogado",
        JSON.stringify(usuarioEncontrado)
      );

      localStorage.setItem(
        "pulsanUsuarioAtual",
        JSON.stringify(usuarioEncontrado)
      );

      localStorage.setItem(
        "pulsanNome",
        usuarioEncontrado.nome
      );

      localStorage.setItem(
        "pulsanEmail",
        usuarioEncontrado.email
      );

      localStorage.setItem(
        "pulsanFoto",
        usuarioEncontrado.foto_url
      );

      localStorage.setItem(
        "pulsanTipo",
        usuarioEncontrado.tipo_usuario
      );

      if (usuarioEncontrado.tipo_usuario === "psicologo") {
        localStorage.setItem(
          "pulsanCRP",
          usuarioEncontrado.crp
        );

        localStorage.setItem(
          "pulsanVerificacaoPsicologo",
          usuarioEncontrado.verificacao_psicologo
        );

        localStorage.setItem(
          "pulsanPsicologoParceiro",
          usuarioEncontrado.psicologo_parceiro
            ? "true"
            : "false"
        );

        if (usuarioEncontrado.documento) {
          localStorage.setItem(
            "pulsanDocumentoProfissional",
            usuarioEncontrado.documento
          );
        }

        if (usuarioEncontrado.nome_documento) {
          localStorage.setItem(
            "pulsanNomeDocumento",
            usuarioEncontrado.nome_documento
          );
        }
      }

      const ehAdministrador =
        usuarioEncontrado.tipo_usuario === "admin" ||
        usuarioEncontrado.tipo_usuario === "administrador" ||
        usuarioEncontrado.tipo_usuario === "equipe_pulsan";

      localStorage.setItem(
        "pulsanEquipePulsan",
        ehAdministrador ? "true" : "false"
      );

      // Define a área de acesso da conta.
      // Contas administrativas ficam exclusivamente na área administrativa.
      localStorage.setItem(
        "pulsanAreaAcesso",
        ehAdministrador ? "administrativo" : "usuario"
      );

      // A conta administrativa não utiliza o fluxo comum da plataforma.
      // Ela não passa pela configuração inicial de acessibilidade e
      // não deve ser encaminhada para ambiente, empresa ou outras páginas.
      if (ehAdministrador) {
        localStorage.setItem("pulsanAcessoAdmin", "true");
      } else {
        localStorage.removeItem("pulsanAcessoAdmin");
      }

      alert(
        `Bem-vindo ao Pulsan, ${
          usuarioEncontrado.nome || "usuário"
        }! 💚`
      );

      setEmail("");
      setSenha("");

      // ============================================================
      // ACESSO ADMINISTRATIVO EXCLUSIVO
      // ============================================================
      // Se a conta for administrativa, o único destino permitido
      // neste fluxo é o Painel Administrativo.
      if (ehAdministrador) {
        irPara("painel-admin");
        return;
      }

      // A configuração de acessibilidade é individual por conta.
      // Assim, uma conta nova não herda a configuração de outra pessoa no mesmo navegador.
      const chaveAcessibilidadeConta = `pulsanAcessibilidadeConfigurada_${usuarioEncontrado.id}`;
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

      alert(
        "Ocorreu um erro inesperado ao entrar na conta."
      );
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
            redirectTo: `${window.location.origin}/`,
          }
        );

      if (error) {
        console.error(
          "Erro ao recuperar senha:",
          error
        );

        alert(
          "Não foi possível enviar o e-mail de recuperação."
        );

        return;
      }

      alert(
        "Enviamos um link de recuperação para seu e-mail. Verifique também a caixa de spam."
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
            overflow: auto;
          }

          .pulsan-login-essence {
            min-height: auto;
            padding: 38px 28px 30px;
            text-align: center;
          }

          .pulsan-login-essence-content {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .pulsan-login-logo {
            width: 70px;
            height: 70px;
            margin-bottom: 13px;
          }

          .pulsan-login-brand {
            margin-bottom: 16px;
          }

          .pulsan-login-essence h1 {
            font-size: clamp(32px, 8vw, 48px);
          }

          .pulsan-login-essence-text {
            margin: 16px auto 20px;
            font-size: 15px;
            max-width: 540px;
          }

          .pulsan-login-values {
            justify-content: center;
            margin-bottom: 22px;
          }

          .pulsan-login-commitment {
            display: none;
          }

          .pulsan-login-wings {
            right: 4%;
            top: 8%;
            transform: scale(.72) rotate(-12deg);
          }

          .pulsan-login-panel {
            padding: 0 22px 40px;
            background: #EAF3FF;
          }

          .pulsan-login-card {
            max-width: 520px;
            border-radius: 25px;
            box-shadow: 0 15px 45px rgba(15,45,91,.10);
          }
        }

        @media (max-width: 560px) {
          .pulsan-login-page {
            background: #EAF3FF;
          }

          .pulsan-login-essence {
            padding: 30px 20px 20px;
          }

          .pulsan-login-logo {
            width: 58px;
            height: 58px;
          }

          .pulsan-login-brand {
            font-size: 15px;
            letter-spacing: .25em;
          }

          .pulsan-login-essence h1 {
            max-width: 340px;
            font-size: 31px;
            line-height: 1.1;
          }

          .pulsan-login-essence-text {
            max-width: 340px;
            font-size: 14px;
            line-height: 1.5;
          }

          .pulsan-login-values {
            gap: 7px;
            margin-bottom: 14px;
          }

          .pulsan-login-value {
            padding: 8px 10px;
            font-size: 11px;
          }

          .pulsan-login-value:nth-child(n+3) {
            display: none;
          }

          .pulsan-login-panel {
            padding: 0 14px 28px;
          }

          .pulsan-login-card {
            padding: 25px 20px 22px;
            border-radius: 23px;
          }

          .pulsan-login-card-logo {
            width: 40px;
            height: 40px;
            margin-bottom: 14px;
          }

          .pulsan-login-card h2 {
            font-size: 27px;
          }

          .pulsan-login-card-description {
            margin-bottom: 24px;
            font-size: 14px;
          }

          .pulsan-login-form {
            gap: 15px;
          }

          .pulsan-login-input,
          .pulsan-login-submit {
            height: 52px;
          }

          .pulsan-login-security {
            margin-top: 18px;
          }

          .pulsan-login-orb.one {
            width: 180px;
            height: 180px;
            top: -95px;
            left: -75px;
          }

          .pulsan-login-orb.two {
            width: 150px;
            height: 150px;
          }

          .pulsan-login-wings {
            display: none;
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