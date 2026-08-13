import React, { useState } from "react";

function Login({ irPara }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

 
  function entrar(e) {
  e.preventDefault();

  // VERIFICA SE OS CAMPOS FORAM PREENCHIDOS
  if (!email || !senha) {
    alert("Preencha seu e-mail e sua senha.");
    return;
  }

  // PEGA OS USUÁRIOS CADASTRADOS
  const usuariosSalvos =
    JSON.parse(localStorage.getItem("usuariosPulsan")) || [];

  // PROCURA O USUÁRIO PELO E-MAIL E SENHA
  const usuarioEncontrado = usuariosSalvos.find(
    (usuario) =>
      usuario.email === email &&
      usuario.senha === senha
  );

  // SE NÃO ENCONTROU
  if (!usuarioEncontrado) {
    alert("E-mail ou senha incorretos.");
    return;
  }

  // SALVA O USUÁRIO QUE ESTÁ LOGADO
  localStorage.setItem(
    "usuarioLogado",
    JSON.stringify(usuarioEncontrado)
  );

  // VERIFICA O TIPO DE USUÁRIO
  if (usuarioEncontrado.tipo === "aluno") {
    irPara("ambiente");
    return;
  }

  if (usuarioEncontrado.tipo === "colaborador") {
    irPara("empresa");
    return;
  }

  // CASO O TIPO NÃO SEJA RECONHECIDO
  alert("Tipo de usuário não reconhecido.");
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

        {/* NOME */}
        <div className="auth-brand">
          PULSAN
        </div>

        {/* TÍTULO */}
        <h1>
          Bem-vindo de volta 💚
        </h1>

        <p className="auth-description">
          Entre na sua conta para continuar.
        </p>

        {/* FORMULÁRIO */}
        <form
          className="auth-form"
          onSubmit={entrar}
        >

          {/* E-MAIL */}
          <div className="form-group">

            <label htmlFor="email">
              E-mail
            </label>

            <input
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />

          </div>


          {/* SENHA */}
          <div className="form-group">

            <label htmlFor="senha">
              Senha
            </label>

            <input
              id="senha"
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="current-password"
            />

          </div>


          {/* ENTRAR */}
          <button
            type="submit"
            className="primary-button auth-button"
          >
            Entrar
          </button>

        </form>


        {/* CADASTRO */}
        <button
          type="button"
          className="auth-register"
          onClick={() => irPara("cadastro")}
        >
          Ainda não tenho uma conta
        </button>


        {/* VOLTAR */}
        <button
          type="button"
          className="auth-back"
          onClick={() => irPara("inicio")}
        >
          ← Voltar
        </button>


        {/* SEGURANÇA */}
        <div className="auth-security">
          🔒 Sua identidade é protegida dentro da plataforma
        </div>

      </div>

    </main>
  );
}

export default Login;