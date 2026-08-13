import React, { useState } from "react";

function Escola({ irPara }) {
  const [texto, setTexto] = useState("");

  function publicar(e) {
    e.preventDefault();

    if (!texto.trim()) {
      alert("Escreva algo antes de publicar.");
      return;
    }

    alert("Seu desabafo foi publicado anonimamente. 💚");
    setTexto("");
  }

  return (
    <main className="escola-page">

      {/* ================================
          CABEÇALHO
      ================================= */}

      <header className="escola-header">

        <div className="escola-brand">

          <img
            src="/logo.png"
            alt="Logo Pulsan"
          />

          <div>
            <strong>PULSAN</strong>
            <span>Ambiente Escola</span>
          </div>

        </div>

        <button
          type="button"
          className="escola-perfil"
          onClick={() => irPara("perfil")}
        >
          👤
        </button>

      </header>


      {/* ================================
          APRESENTAÇÃO
      ================================= */}

      <section className="escola-intro">

        <span className="escola-label">
          ESPAÇO SEGURO
        </span>

        <h1>
          Ambiente Escola 💚
        </h1>

        <p>
          Um espaço para falar, ouvir, acolher e pedir ajuda
          sem precisar se identificar.
        </p>

      </section>


      {/* ================================
          PEDIR AJUDA
      ================================= */}

      <section className="escola-help">

        <div className="escola-help-icon">
          🫶
        </div>

        <div className="escola-help-text">

          <strong>
            Você precisa de ajuda?
          </strong>

          <p>
            Se alguma situação está te incomodando,
            você pode pedir ajuda de forma segura.
          </p>

        </div>

        <button
          type="button"
          onClick={() => irPara("solicitar-ajuda")}
        >
          Pedir ajuda
        </button>

      </section>


      {/* ================================
          AÇÕES PRINCIPAIS
      ================================= */}

      <section className="escola-actions">

        {/* DESABAFAR */}

        <button
          type="button"
          className="escola-action-card"
          onClick={() => {
            document
              .getElementById("escola-desabafo")
              ?.scrollIntoView({
                behavior: "smooth"
              });
          }}
        >

          <div className="escola-action-icon">
            💬
          </div>

          <div>

            <h2>
              Desabafar
            </h2>

            <p>
              Conte o que está sentindo de forma anônima.
            </p>

          </div>

          <span className="escola-action-arrow">
            →
          </span>

        </button>


        {/* AJUDAR */}

        <button
          type="button"
          className="escola-action-card"
          onClick={() => irPara("ajudar")}
        >

          <div className="escola-action-icon">
            💚
          </div>

          <div>

            <h2>
              Ajudar alguém
            </h2>

            <p>
              Uma palavra de apoio pode fazer diferença.
            </p>

          </div>

          <span className="escola-action-arrow">
            →
          </span>

        </button>

      </section>


      {/* ================================
          DESABAFO
      ================================= */}

      <section
        className="escola-publish"
        id="escola-desabafo"
      >

        <div className="escola-publish-header">

          <div>

            <span className="escola-publish-label">
              DESABAFO ANÔNIMO
            </span>

            <h2>
              O que você está sentindo?
            </h2>

            <p>
              Escreva livremente. Você não precisa colocar seu nome.
            </p>

          </div>

          <span className="escola-safe">
            🔒 Seguro
          </span>

        </div>


        {/* IDENTIFICAÇÃO */}

        <div className="escola-anonimo">
          👤 ANÔNIMO
        </div>


        {/* CAMPO */}

        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escreva aqui o que está acontecendo, como você está se sentindo ou aquilo que gostaria de compartilhar..."
          maxLength={1000}
        />


        {/* INFORMAÇÕES */}

        <div className="escola-publish-info">

          <span>
            🔒 Sua identidade permanece protegida.
          </span>

          <span>
            {texto.length}/1000
          </span>

        </div>


        {/* BOTÃO */}

        <button
          type="button"
          className="escola-publish-button"
          onClick={publicar}
        >
          💚 Publicar anonimamente
        </button>

      </section>


      {/* ================================
          COMUNIDADE
      ================================= */}

      <section className="escola-community">

        <div className="escola-community-header">

          <div>

            <span>
              COMUNIDADE
            </span>

            <h2>
              O que outras pessoas estão compartilhando
            </h2>

          </div>

          <span className="escola-community-lock">
            🔒 Anônimo
          </span>

        </div>


        {/* PUBLICAÇÃO DE EXEMPLO */}

        <article className="escola-post">

          <div className="escola-post-header">

            <div className="escola-post-avatar">
              👤
            </div>

            <div>

              <strong>
                Anônimo
              </strong>

              <span>
                Hoje
              </span>

            </div>

          </div>

          <p>
            Este é um espaço onde podemos compartilhar
            nossos sentimentos e lembrar que ninguém precisa
            enfrentar tudo sozinho. 💚
          </p>

          <div className="escola-post-actions">

            <button
              type="button"
              onClick={() =>
                alert("Obrigado por demonstrar apoio. 💚")
              }
            >
              💚 Apoiar
            </button>

            <button
              type="button"
              onClick={() =>
                irPara("comentarios")
              }
            >
              💬 Comentários
            </button>

          </div>

        </article>


        {/* ESTADO VAZIO / MAIS PUBLICAÇÕES */}

        <div className="escola-empty">

          <div className="escola-empty-icon">
            🌱
          </div>

          <h3>
            Este espaço está começando
          </h3>

          <p>
            Novos desabafos aparecerão aqui de forma anônima.
          </p>

        </div>

      </section>


      {/* ================================
          INFORMAÇÕES DE SEGURANÇA
      ================================= */}

      <section className="escola-info-cards">

        <div className="escola-info-card">

          <span>
            🔒
          </span>

          <div>

            <strong>
              Anonimato
            </strong>

            <p>
              Você pode compartilhar sem revelar sua identidade.
            </p>

          </div>

        </div>


        <div className="escola-info-card">

          <span>
            🤝
          </span>

          <div>

            <strong>
              Acolhimento
            </strong>

            <p>
              Incentivamos respeito, empatia e apoio.
            </p>

          </div>

        </div>


        <div className="escola-info-card">

          <span>
            🆘
          </span>

          <div>

            <strong>
              Ajuda
            </strong>

            <p>
              Situações preocupantes podem receber atenção.
            </p>

          </div>

        </div>

      </section>


      {/* ================================
          NAVEGAÇÃO
      ================================= */}

      <nav className="escola-bottom-nav">

        <button
          type="button"
          onClick={() => irPara("inicio")}
        >
          <span>🏠</span>
          <small>Início</small>
        </button>


        <button
          type="button"
          onClick={() => irPara("conversas")}
        >
          <span>💬</span>
          <small>Conversas</small>
        </button>


        <button
          type="button"
          className="active"
          onClick={() => irPara("escola")}
        >
          <span>💚</span>
          <small>Apoiar</small>
        </button>


        <button
          type="button"
          onClick={() => irPara("solicitacoes")}
        >
          <span>🤝</span>
          <small>Ajuda</small>
        </button>


        <button
          type="button"
          onClick={() => irPara("perfil")}
        >
          <span>👤</span>
          <small>Perfil</small>
        </button>

      </nav>

    </main>
  );
}

export default Escola;