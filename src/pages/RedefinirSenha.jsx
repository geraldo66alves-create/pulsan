import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function RedefinirSenha({ irPara }) {
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [sessaoValida, setSessaoValida] = useState(false);

  useEffect(() => {
    verificarSessao();
  }, []);

  async function verificarSessao() {
    const { data } = await supabase.auth.getSession();

    if (data?.session) {
      setSessaoValida(true);
    } else {
      alert(
        "O link de recuperação é inválido ou expirou."
      );

      irPara("login");
    }
  }

  async function salvarNovaSenha(e) {
    e.preventDefault();

    if (!novaSenha || !confirmarSenha) {
      alert("Preencha os dois campos.");
      return;
    }

    if (novaSenha.length < 6) {
      alert(
        "A nova senha deve ter pelo menos 6 caracteres."
      );
      return;
    }

    if (novaSenha !== confirmarSenha) {
      alert(
        "A confirmação da senha não confere."
      );
      return;
    }

    setCarregando(true);

    try {
      const { error } =
        await supabase.auth.updateUser({
          password: novaSenha,
        });

      if (error) {
        console.error(
          "Erro ao atualizar senha:",
          error
        );

        alert(
          "Não foi possível atualizar sua senha."
        );

        return;
      }

      alert(
        "Sua senha foi alterada com sucesso! 💚"
      );

      await supabase.auth.signOut();

      irPara("login");
    } catch (erro) {
      console.error(
        "Erro inesperado ao redefinir senha:",
        erro
      );

      alert(
        "Ocorreu um erro ao redefinir sua senha."
      );
    } finally {
      setCarregando(false);
    }
  }

  if (!sessaoValida) {
    return (
      <main className="auth-page">
        <div className="auth-card">
          <p className="auth-description">
            Verificando o link de recuperação...
          </p>
        </div>
      </main>
    );
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
          Criar nova senha
        </h1>

        <p className="auth-description">
          Digite uma nova senha para sua conta.
        </p>

        <form
          className="auth-form"
          onSubmit={salvarNovaSenha}
        >
          <div className="form-group">
            <label htmlFor="novaSenha">
              Nova senha
            </label>

            <input
              id="novaSenha"
              type="password"
              placeholder="Digite sua nova senha"
              value={novaSenha}
              onChange={(e) =>
                setNovaSenha(e.target.value)
              }
              autoComplete="new-password"
              disabled={carregando}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmarSenha">
              Confirmar nova senha
            </label>

            <input
              id="confirmarSenha"
              type="password"
              placeholder="Digite novamente sua senha"
              value={confirmarSenha}
              onChange={(e) =>
                setConfirmarSenha(e.target.value)
              }
              autoComplete="new-password"
              disabled={carregando}
            />
          </div>

          <button
            type="submit"
            className="primary-button auth-button"
            disabled={carregando}
          >
            {carregando
              ? "Salvando..."
              : "Salvar nova senha"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default RedefinirSenha;