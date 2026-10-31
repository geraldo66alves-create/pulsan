import React, { useState } from "react";
import { supabase } from "../lib/supabase";

function RecuperarSenha({ irPara, emailInicial = "", email: emailRecebido = "" }) {
  const [email, setEmail] = useState(emailInicial || emailRecebido || "");
  const [carregando, setCarregando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState("");

  async function solicitarRecuperacao(evento) {
    evento.preventDefault();
    setErro("");
    setEnviado(false);

    const emailNormalizado = email.trim().toLowerCase();
    if (!emailNormalizado) {
      setErro("Digite o e-mail cadastrado na sua conta.");
      return;
    }

    setCarregando(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        emailNormalizado,
        {
          redirectTo: `${window.location.origin}/?redefinir-senha=1`,
        }
      );

      if (error) throw error;
      setEnviado(true);
    } catch (e) {
      console.error("Erro ao solicitar recuperação de senha:", e);
      setErro(
        "Não foi possível enviar o e-mail de recuperação agora. Confira o endereço e tente novamente."
      );
    } finally {
      setCarregando(false);
    }
  }

  const voltarLogin = () => {
    if (typeof irPara === "function") irPara("login");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        boxSizing: "border-box",
        background: "linear-gradient(145deg, #EAF3FF 0%, #FFFFFF 62%, #EAF3FF 100%)",
        color: "#0F2D5B",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "470px",
          background: "#FFFFFF",
          border: "1px solid #A8C7FF",
          borderRadius: "28px",
          padding: "34px",
          boxSizing: "border-box",
          boxShadow: "0 22px 65px rgba(15,45,91,.12)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "22px" }}>
          <img
            src="/logo.png"
            alt="Pulsan"
            style={{ width: "48px", height: "48px", objectFit: "contain" }}
          />
          <div>
            <div style={{ fontSize: "15px", fontWeight: 800, letterSpacing: ".18em", color: "#3A7DFF" }}>
              PULSAN
            </div>
            <div style={{ fontSize: "12px", color: "#6D7F99", marginTop: "3px" }}>
              ajuda anônima a quem precisa
            </div>
          </div>
        </div>

        <h1 style={{ margin: "0 0 12px", fontSize: "clamp(26px, 5vw, 34px)", lineHeight: 1.15 }}>
          Recuperar senha
        </h1>
        <p style={{ margin: "0 0 25px", color: "#58708F", fontSize: "14px", lineHeight: 1.6 }}>
          Informe o e-mail associado à sua conta. Enviaremos um link para você criar uma nova senha.
        </p>

        {enviado ? (
          <div
            role="status"
            style={{ padding: "16px", borderRadius: "15px", background: "#EAF8F1", border: "1px solid #B9E5CF", color: "#176B49", fontSize: "14px", lineHeight: 1.6, marginBottom: "18px" }}
          >
            Se o endereço informado estiver cadastrado, enviaremos um e-mail com as instruções para redefinir sua senha. Verifique também a caixa de spam.
          </div>
        ) : (
          <form onSubmit={solicitarRecuperacao}>
            <label htmlFor="email-recuperacao" style={{ display: "block", marginBottom: "8px", fontSize: "13px", fontWeight: 800 }}>
              E-mail cadastrado
            </label>
            <input
              id="email-recuperacao"
              type="email"
              value={email}
              onChange={(evento) => setEmail(evento.target.value)}
              autoComplete="email"
              placeholder="Digite seu e-mail"
              disabled={carregando}
              required
              style={{
                width: "100%",
                height: "52px",
                padding: "0 15px",
                border: "1.5px solid #A8C7FF",
                borderRadius: "14px",
                background: "#EAF3FF",
                color: "#0F2D5B",
                outline: "none",
                boxSizing: "border-box",
                fontSize: "14px",
                marginBottom: "16px",
              }}
            />

            {erro && (
              <div role="alert" style={{ padding: "13px", borderRadius: "13px", background: "#FFF3F3", border: "1px solid #F0CACA", color: "#9A3030", fontSize: "12px", lineHeight: 1.5, marginBottom: "15px" }}>
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={carregando}
              style={{ width: "100%", height: "54px", border: "none", borderRadius: "15px", background: carregando ? "#8DB1F5" : "#3A7DFF", color: "#FFFFFF", fontWeight: 800, cursor: carregando ? "wait" : "pointer", boxShadow: "0 10px 24px rgba(58,125,255,.22)" }}
            >
              {carregando ? "Enviando..." : "Enviar link de recuperação"}
            </button>
          </form>
        )}

        <button
          type="button"
          onClick={voltarLogin}
          disabled={carregando}
          style={{ width: "100%", height: "48px", marginTop: "13px", border: "1px solid #DCE8F8", borderRadius: "14px", background: "#FFFFFF", color: "#31527E", fontWeight: 700, cursor: "pointer" }}
        >
          Voltar para o login
        </button>

        <p style={{ margin: "20px 0 0", color: "#8A9AB0", fontSize: "11px", textAlign: "center", lineHeight: 1.5 }}>
          Por segurança, não informamos se um e-mail está ou não cadastrado.
        </p>
      </section>
    </main>
  );
}

export default RecuperarSenha;
