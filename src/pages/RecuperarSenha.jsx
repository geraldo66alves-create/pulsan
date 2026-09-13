import React, { useState } from "react";
import { supabase } from "../lib/supabase";

function RecuperarSenha({ irPara }) {
  const [email, setEmail] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  async function enviarRecuperacao(e) {
    e.preventDefault();

    if (!email.trim()) {
      alert("Digite o e-mail cadastrado.");
      return;
    }

    setCarregando(true);

    try {
      const { error } =
        await supabase.auth.resetPasswordForEmail(
          email.trim().toLowerCase(),
          {
            redirectTo: `${window.location.origin}/redefinir-senha`,
          }
        );

      if (error) {
        console.error(
          "Erro ao enviar recuperação:",
          error
        );

        alert(
          "Não foi possível enviar o e-mail de recuperação."
        );

        return;
      }

      setEnviado(true);
    } catch (erro) {
      console.error(
        "Erro inesperado na recuperação:",
        erro
      );

      alert(
        "Ocorreu um erro ao solicitar a recuperação."
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
          Recuperar senha
        </h1>

        {!enviado ? (
          <>
            <p className="auth-description">
              Informe seu e-mail para receber um
              link de recuperação de senha.
            </p>

            <form
              className="auth-form"
              onSubmit={enviarRecuperacao}
            >
              <div className="form-group">
                <label htmlFor="emailRecuperacao">
                  E-mail
                </label>

                <input
                  id="emailRecuperacao"
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

              <button
                type="submit"
                className="primary-button auth-button"
                disabled={carregando}
              >
                {carregando
                  ? "Enviando..."
                  : "Enviar recuperação"}
              </button>
            </form>
          </>
        ) : (
          <div className="auth-description">
            <p>
              Se o e-mail estiver cadastrado, você
              receberá um link para criar uma nova senha.
            </p>

            <p>
              Verifique também a caixa de spam ou lixo
              eletrônico.
            </p>
          </div>
        )}

        <button
          type="button"
          className="auth-back"
          onClick={() => irPara("login")}
          disabled={carregando}
        >
          ← Voltar para o login
        </button>

        <div className="auth-security">
          🔒 Sua identidade é protegida dentro da plataforma
        </div>
      </div>
    </main>
  );
}

export default RecuperarSenha;