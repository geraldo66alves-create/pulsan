import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function RedefinirSenha({ irPara }) {
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    let ativo = true;
    let recuperacaoConfirmada = false;

    const parametros = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));

    const erroRetorno =
      parametros.get("error_description") ||
      hash.get("error_description") ||
      parametros.get("error") ||
      hash.get("error");

    if (erroRetorno) {
      const mensagem = String(erroRetorno).toLowerCase();
      setErro(
        mensagem.includes("expired") || mensagem.includes("invalid")
          ? "Este link de recuperação expirou ou já foi utilizado. Solicite um novo e-mail."
          : "Não foi possível validar o link de recuperação. Solicite um novo e-mail."
      );
      setCarregando(false);
      return () => {
        ativo = false;
      };
    }

    const tipoRecuperacao =
      hash.get("type") === "recovery" ||
      parametros.get("type") === "recovery" ||
      parametros.get("redefinir-senha") === "1";

    const { data: listener } = supabase.auth.onAuthStateChange(
      (evento, session) => {
        if (ativo && evento === "PASSWORD_RECOVERY" && session) {
          recuperacaoConfirmada = true;
          setPronto(true);
          setErro("");
          setCarregando(false);
        }
      }
    );

    const prepararRecuperacao = async () => {
      try {
        if (!tipoRecuperacao) {
          throw new Error("O endereço não contém um pedido de recuperação.");
        }

        // detectSessionInUrl do Supabase processa automaticamente o retorno
        // do e-mail (PKCE ou tokens). Aguardamos a sessão ficar disponível.
        for (let tentativa = 0; tentativa < 6; tentativa += 1) {
          if (!ativo || recuperacaoConfirmada) return;

          const { data, error } = await supabase.auth.getSession();
          if (error) throw error;

          if (data?.session) {
            recuperacaoConfirmada = true;
            if (ativo) {
              setPronto(true);
              setErro("");
              setCarregando(false);
            }
            return;
          }

          await new Promise((resolve) => setTimeout(resolve, 400));
        }

        if (ativo && !recuperacaoConfirmada) {
          setErro(
            "Este link de recuperação expirou, já foi utilizado ou não pôde ser validado. Solicite um novo e-mail para redefinir sua senha."
          );
        }
      } catch (e) {
        console.error("Erro ao abrir recuperação de senha:", e);
        if (ativo) {
          setErro(
            "Não foi possível validar este link de recuperação. Solicite um novo link e tente novamente."
          );
        }
      } finally {
        if (ativo && !recuperacaoConfirmada) setCarregando(false);
      }
    };

    prepararRecuperacao();

    return () => {
      ativo = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const requisitos = {
    tamanho: senha.length >= 8,
    maiuscula: /[A-Z]/.test(senha),
    minuscula: /[a-z]/.test(senha),
    numero: /\d/.test(senha),
    especial: /[^A-Za-z0-9]/.test(senha),
  };

  const senhaForte = Object.values(requisitos).every(Boolean);

  async function salvarNovaSenha(e) {
    e.preventDefault();
    setErro("");

    if (!pronto) {
      setErro("O link de recuperação ainda não foi validado.");
      return;
    }

    if (!senhaForte) {
      setErro(
        "A senha precisa ter pelo menos 8 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial."
      );
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    setSalvando(true);

    try {
      const { data: sessaoAtual } = await supabase.auth.getSession();

      if (!sessaoAtual?.session) {
        throw new Error("A sessão de recuperação expirou.");
      }

      const { error } = await supabase.auth.updateUser({
        password: senha,
      });

      if (error) throw error;

      // A senha foi alterada com sucesso. Encerra a sessão de recuperação
      // para que o usuário entre novamente usando a nova senha.
      const { error: erroSaida } = await supabase.auth.signOut();
      if (erroSaida) {
        console.warn("A senha foi alterada, mas não foi possível encerrar a sessão:", erroSaida);
      }

      // Remove os dados temporários do link da barra de endereço.
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );

      alert("Sua senha foi redefinida com sucesso. Agora entre no Pulsan usando sua nova senha.");

      irPara("login");
    } catch (e) {
      console.error("Erro ao redefinir senha:", e);

      const mensagem = String(e?.message || "").toLowerCase();

      if (
        mensagem.includes("expired") ||
        mensagem.includes("invalid") ||
        mensagem.includes("otp")
      ) {
        setErro(
          "Este link de recuperação expirou ou já foi utilizado. Solicite um novo link."
        );
      } else {
        setErro(
          e?.message ||
            "Não foi possível redefinir sua senha. Tente solicitar um novo link."
        );
      }
    } finally {
      setSalvando(false);
    }
  }

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
        background:
          "linear-gradient(145deg, #EAF3FF 0%, #FFFFFF 62%, #EAF3FF 100%)",
        color: "#0F2D5B",
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
        <div
          style={{
            width: "58px",
            height: "58px",
            borderRadius: "18px",
            background: "#EAF3FF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <img
            src="/logo.png"
            alt="Pulsan"
            style={{ width: "42px", height: "42px", objectFit: "contain" }}
          />
        </div>

        <div
          style={{
            fontSize: "13px",
            fontWeight: "800",
            letterSpacing: ".22em",
            color: "#3A7DFF",
            marginBottom: "10px",
          }}
        >
          PULSAN
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: "clamp(27px, 5vw, 35px)",
            lineHeight: 1.12,
            letterSpacing: "-.03em",
          }}
        >
          Redefinir senha
        </h1>

        <p
          style={{
            margin: "11px 0 27px",
            color: "#58708F",
            fontSize: "14px",
            lineHeight: 1.6,
          }}
        >
          Crie uma nova senha para voltar a acessar sua conta com segurança.
        </p>

        {carregando ? (
          <div
            style={{
              padding: "18px",
              borderRadius: "15px",
              background: "#EAF3FF",
              color: "#31527E",
              lineHeight: 1.5,
              fontSize: "14px",
            }}
          >
            Validando seu link de recuperação...
          </div>
        ) : erro && !pronto ? (
          <div>
            <div
              style={{
                padding: "15px",
                borderRadius: "15px",
                background: "#FFF3F3",
                border: "1px solid #F0CACA",
                color: "#9A3030",
                fontSize: "13px",
                lineHeight: 1.55,
                marginBottom: "17px",
              }}
            >
              {erro}
            </div>

            <button
              type="button"
              onClick={() => irPara("login")}
              style={{
                width: "100%",
                height: "52px",
                border: "none",
                borderRadius: "14px",
                background: "#3A7DFF",
                color: "#FFFFFF",
                fontWeight: "800",
                cursor: "pointer",
              }}
            >
              Voltar para o login
            </button>
          </div>
        ) : (
          <form onSubmit={salvarNovaSenha}>
            <div style={{ marginBottom: "16px" }}>
              <label
                htmlFor="nova-senha"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "13px",
                  fontWeight: "800",
                }}
              >
                Nova senha
              </label>

              <div style={{ position: "relative" }}>
                <input
                  id="nova-senha"
                  type={mostrarSenha ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  autoComplete="new-password"
                  placeholder="Digite sua nova senha"
                  disabled={salvando}
                  style={{
                    width: "100%",
                    height: "52px",
                    padding: "0 76px 0 15px",
                    border: "1.5px solid #A8C7FF",
                    borderRadius: "14px",
                    background: "#EAF3FF",
                    color: "#0F2D5B",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha((v) => !v)}
                  style={{
                    position: "absolute",
                    right: "8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "transparent",
                    color: "#3A7DFF",
                    fontSize: "12px",
                    fontWeight: "800",
                    cursor: "pointer",
                  }}
                >
                  {mostrarSenha ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label
                htmlFor="confirmar-nova-senha"
                style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "13px",
                  fontWeight: "800",
                }}
              >
                Confirmar nova senha
              </label>

              <div style={{ position: "relative" }}>
                <input
                  id="confirmar-nova-senha"
                  type={mostrarConfirmacao ? "text" : "password"}
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  autoComplete="new-password"
                  placeholder="Digite a senha novamente"
                  disabled={salvando}
                  style={{
                    width: "100%",
                    height: "52px",
                    padding: "0 76px 0 15px",
                    border: "1.5px solid #A8C7FF",
                    borderRadius: "14px",
                    background: "#EAF3FF",
                    color: "#0F2D5B",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setMostrarConfirmacao((v) => !v)}
                  style={{
                    position: "absolute",
                    right: "8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    border: "none",
                    background: "transparent",
                    color: "#3A7DFF",
                    fontSize: "12px",
                    fontWeight: "800",
                    cursor: "pointer",
                  }}
                >
                  {mostrarConfirmacao ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            <div
              style={{
                padding: "14px",
                borderRadius: "15px",
                background: "#F7FAFF",
                border: "1px solid #DCE8F8",
                marginBottom: "17px",
              }}
            >
              <strong style={{ fontSize: "12px" }}>A senha precisa ter:</strong>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "6px 10px",
                  marginTop: "9px",
                  fontSize: "11px",
                  color: "#6D7F99",
                }}
              >
                {[
                  [requisitos.tamanho, "8 caracteres ou mais"],
                  [requisitos.maiuscula, "1 letra maiúscula"],
                  [requisitos.minuscula, "1 letra minúscula"],
                  [requisitos.numero, "1 número"],
                  [requisitos.especial, "1 caractere especial"],
                ].map(([ok, texto]) => (
                  <span key={texto} style={{ color: ok ? "#16845B" : "#6D7F99" }}>
                    {ok ? "✓" : "•"} {texto}
                  </span>
                ))}
              </div>
            </div>

            {erro && (
              <div
                style={{
                  padding: "13px",
                  borderRadius: "13px",
                  background: "#FFF3F3",
                  border: "1px solid #F0CACA",
                  color: "#9A3030",
                  fontSize: "12px",
                  lineHeight: 1.5,
                  marginBottom: "15px",
                }}
              >
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={salvando || !pronto}
              style={{
                width: "100%",
                height: "54px",
                border: "none",
                borderRadius: "15px",
                background: salvando ? "#8DB1F5" : "#3A7DFF",
                color: "#FFFFFF",
                fontWeight: "800",
                cursor: salvando ? "wait" : "pointer",
                boxShadow: "0 10px 24px rgba(58,125,255,.22)",
              }}
            >
              {salvando ? "Salvando nova senha..." : "Salvar nova senha"}
            </button>
          </form>
        )}

        <div
          style={{
            marginTop: "20px",
            paddingTop: "17px",
            borderTop: "1px solid #EAF3FF",
            color: "#6D7F99",
            fontSize: "11px",
            textAlign: "center",
            lineHeight: 1.5,
          }}
        >
          O link de recuperação é temporário e só pode ser utilizado pelo fluxo de autenticação do Supabase.
        </div>
      </section>
    </main>
  );
}

export default RedefinirSenha;
