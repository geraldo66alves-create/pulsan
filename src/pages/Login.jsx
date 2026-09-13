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

      alert(
        `Bem-vindo ao Pulsan, ${
          usuarioEncontrado.nome || "usuário"
        }! 💚`
      );

      setEmail("");
      setSenha("");

      if (ehAdministrador) {
        irPara("painel-admin");
        return;
      }

      if (
        usuarioEncontrado.tipo_usuario === "aluno" ||
        usuarioEncontrado.tipo_usuario === "psicologo"
      ) {
        irPara("ambiente");
        return;
      }

      if (
        usuarioEncontrado.tipo_usuario === "colaborador"
      ) {
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
    <main className="auth-page">
      <div className="auth-card">
        <img
          src="/logo.png"
          alt="Logo Pulsan"
          className="auth-logo"
        />

        <div className="auth-brand">
          PULSAN
        </div>

        <h1>
          Bem-vindo de volta 💚
        </h1>

        <p className="auth-description">
          Entre na sua conta para continuar.
        </p>

        <form
          className="auth-form"
          onSubmit={entrar}
        >
          <div className="form-group">
            <label htmlFor="email">
              E-mail
            </label>

            <input
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              autoComplete="email"
              disabled={carregando}
            />
          </div>

          <div className="form-group">
            <label htmlFor="senha">
              Senha
            </label>

            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              <input
                id="senha"
                type={
                  mostrarSenha
                    ? "text"
                    : "password"
                }
                placeholder="Digite sua senha"
                value={senha}
                onChange={(e) =>
                  setSenha(e.target.value)
                }
                autoComplete="current-password"
                disabled={carregando}
                style={{
                  width: "100%",
                  paddingRight: "80px",
                }}
              />

              <button
                type="button"
                onClick={() =>
                  setMostrarSenha(!mostrarSenha)
                }
                disabled={carregando}
                style={{
                  position: "absolute",
                  right: "8px",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  color:
                    "var(--cor-texto-secundario)",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                {mostrarSenha
                  ? "Ocultar"
                  : "Mostrar"}
              </button>
            </div>
          </div>

          <button
            type="button"
            className="auth-register"
            onClick={recuperarSenha}
            disabled={carregando}
          >
            Esqueci minha senha
          </button>

          <button
            type="submit"
            className="primary-button auth-button"
            disabled={carregando}
          >
            {carregando
              ? "Entrando..."
              : "Entrar"}
          </button>
        </form>

        <button
          type="button"
          className="auth-register"
          onClick={() => irPara("cadastro")}
          disabled={carregando}
        >
          Ainda não tenho uma conta
        </button>

        <button
          type="button"
          className="auth-back"
          onClick={() => irPara("inicio")}
          disabled={carregando}
        >
          ← Voltar
        </button>

        <div className="auth-security">
          🔒 Sua identidade é protegida dentro da plataforma
        </div>
      </div>
    </main>
  );
}

export default Login;