import React from "react";

function Inicio({ irPara }) {
  const irParaCadastro = () => {
    irPara("cadastro");
  };

  const irParaLogin = () => {
    irPara("login");
  };

  return (
    <main className="inicio-page">

      {/* =====================================================
          FUNDO DECORATIVO
      ===================================================== */}

      <div className="inicio-bg-blur blur-1"></div>
      <div className="inicio-bg-blur blur-2"></div>
      <div className="inicio-bg-circle circle-1"></div>
      <div className="inicio-bg-circle circle-2"></div>


      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav className="inicio-navbar">

        <div className="inicio-brand">
          <img
            src="/logo.png"
            alt="Logo Pulsan"
          />

          <div>
            <strong>Pulsan</strong>
            <span>Você importa</span>
          </div>
        </div>

        <div className="inicio-nav-links">
          <a href="#sobre">Sobre</a>
          <a href="#como-funciona">Como funciona</a>
          <a href="#seguranca">Segurança</a>

          <button
            type="button"
            onClick={irParaLogin}
            className="inicio-nav-login"
          >
            Entrar
          </button>
        </div>

      </nav>


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="inicio-hero">

        <div className="inicio-hero-text">

          <span className="inicio-tag">
            Um espaço para ser ouvido
          </span>

          <h1>
            Você não precisa
            <span> passar por tudo sozinho.</span>
          </h1>

          <p>
            O Pulsan é um espaço de apoio emocional criado para
            aproximar pessoas, incentivar a escuta e tornar mais
            fácil falar sobre aquilo que muitas vezes guardamos
            para nós mesmos.
          </p>

          <div className="inicio-hero-buttons">

            <button
              type="button"
              className="inicio-btn-primary"
              onClick={irParaCadastro}
            >
              Criar minha conta
              <span>→</span>
            </button>

            <button
              type="button"
              className="inicio-btn-secondary"
              onClick={irParaLogin}
            >
              Já tenho uma conta
            </button>

          </div>

          <div className="inicio-hero-info">

            <div>
              <span>🔒</span>
              <small>Privacidade</small>
            </div>

            <div>
              <span>💙</span>
              <small>Acolhimento</small>
            </div>

            <div>
              <span>🤝</span>
              <small>Escuta</small>
            </div>

          </div>

        </div>


        {/* CARD VISUAL */}

        <div className="inicio-hero-card">

          <div className="hero-card-glow"></div>

          <div className="hero-card-top">
            <span className="hero-card-dot"></span>

            <span>
              Espaço seguro
            </span>

            <span className="hero-card-lock">
              🔒
            </span>
          </div>

          <div className="hero-bubble bubble-one">
            Às vezes eu só precisava
            que alguém me escutasse.
          </div>

          <div className="hero-bubble bubble-two">
            Você não precisa enfrentar
            tudo sozinho. 💙
          </div>

          <div className="hero-card-bottom">

            <div className="hero-mini-avatar">
              💬
            </div>

            <div>
              <strong>
                Um lugar para falar
              </strong>

              <span>
                Sem julgamentos.
              </span>
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FRASE
      ===================================================== */}

      <section className="inicio-frase">

        <div className="inicio-frase-line"></div>

        <p>
          "Falar também é uma forma de cuidar de si."
        </p>

        <div className="inicio-frase-line"></div>

      </section>


      {/* =====================================================
          SOBRE
      ===================================================== */}

      <section
        id="sobre"
        className="inicio-section inicio-sobre"
      >

        <div className="inicio-section-title">

          <span>CONHEÇA O PULSAN</span>

          <h2>
            Um espaço criado para
            <strong> acolher.</strong>
          </h2>

          <p>
            Nem sempre é fácil falar sobre o que sentimos.
            O Pulsan nasceu com a proposta de criar um ambiente
            onde as pessoas possam compartilhar seus sentimentos,
            encontrar escuta e construir conexões baseadas em
            empatia e respeito.
          </p>

        </div>


        <div className="inicio-sobre-grid">

          <div className="inicio-sobre-card destaque">

            <div className="card-icon">
              💭
            </div>

            <h3>
              Falar
            </h3>

            <p>
              Compartilhe aquilo que está sentindo
              e coloque em palavras o que muitas vezes
              fica guardado.
            </p>

          </div>


          <div className="inicio-sobre-card">

            <div className="card-icon">
              👂
            </div>

            <h3>
              Ser ouvido
            </h3>

            <p>
              Encontre pessoas dispostas a ouvir
              e oferecer uma palavra de apoio.
            </p>

          </div>


          <div className="inicio-sobre-card">

            <div className="card-icon">
              💙
            </div>

            <h3>
              Acolher
            </h3>

            <p>
              Incentive relações baseadas em empatia,
              respeito e compreensão.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          COMO FUNCIONA
      ===================================================== */}

      <section
        id="como-funciona"
        className="inicio-section inicio-como"
      >

        <div className="inicio-section-title center">

          <span>COMO FUNCIONA</span>

          <h2>
            Simples para você.
            <strong> Humano por essência.</strong>
          </h2>

          <p>
            O Pulsan foi pensado para que pedir apoio,
            oferecer escuta e conversar seja algo simples
            e natural.
          </p>

        </div>


        <div className="inicio-passos">

          <div className="inicio-passo">

            <div className="passo-numero">
              01
            </div>

            <div className="passo-icon">
              💭
            </div>

            <h3>
              Compartilhe
            </h3>

            <p>
              Escreva sobre o que você está sentindo
              em um espaço pensado para acolher.
            </p>

          </div>


          <div className="passo-linha"></div>


          <div className="inicio-passo">

            <div className="passo-numero">
              02
            </div>

            <div className="passo-icon">
              🤝
            </div>

            <h3>
              Receba apoio
            </h3>

            <p>
              Pessoas dispostas a ajudar podem
              demonstrar interesse em conversar.
            </p>

          </div>


          <div className="passo-linha"></div>


          <div className="inicio-passo">

            <div className="passo-numero">
              03
            </div>

            <div className="passo-icon">
              💬
            </div>

            <h3>
              Converse
            </h3>

            <p>
              Quando houver aceitação, vocês podem
              iniciar uma conversa privada.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          PARA QUEM É
      ===================================================== */}

      <section className="inicio-section inicio-publico">

        <div className="inicio-publico-text">

          <span>
            PARA QUEM É O PULSAN?
          </span>

          <h2>
            Um projeto que pode
            <strong> fazer parte de diferentes ambientes.</strong>
          </h2>

          <p>
            O Pulsan foi pensado inicialmente para contextos
            onde o cuidado emocional e a comunicação podem
            fazer diferença no dia a dia.
          </p>

        </div>


        <div className="inicio-publico-cards">

          <div className="publico-card">

            <span>
              🏢
            </span>

            <div>
              <h3>
                Empresas
              </h3>

              <p>
                Incentivar uma cultura de escuta,
                acolhimento e cuidado entre colaboradores.
              </p>
            </div>

          </div>


          <div className="publico-card">

            <span>
              🎓
            </span>

            <div>
              <h3>
                Escolas
              </h3>

              <p>
                Criar espaços de diálogo e atenção
                às relações e ao bem-estar dos estudantes.
              </p>
            </div>

          </div>


          <div className="publico-card">

            <span>
              👥
            </span>

            <div>
              <h3>
                Comunidade
              </h3>

              <p>
                Aproximar pessoas através da empatia,
                escuta e apoio mútuo.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          SEGURANÇA
      ===================================================== */}

      <section
        id="seguranca"
        className="inicio-section inicio-seguranca"
      >

        <div className="seguranca-visual">

          <div className="seguranca-circle">

            <div>
              🔒
            </div>

          </div>

          <span className="seguranca-orbit orbit-one"></span>
          <span className="seguranca-orbit orbit-two"></span>

        </div>


        <div className="seguranca-text">

          <span>
            PRIVACIDADE E SEGURANÇA
          </span>

          <h2>
            Sua identidade
            <strong> merece proteção.</strong>
          </h2>

          <p>
            O Pulsan foi pensado para preservar a identidade
            de quem decide compartilhar um desabafo.
            O objetivo é proporcionar um ambiente onde falar
            sobre sentimentos não precise significar medo
            de exposição ou julgamento.
          </p>


          <div className="seguranca-lista">

            <div>
              <span>✓</span>
              <p>
                Identidade protegida nos desabafos
              </p>
            </div>

            <div>
              <span>✓</span>
              <p>
                Conversas privadas entre as pessoas envolvidas
              </p>
            </div>

            <div>
              <span>✓</span>
              <p>
                Ambiente baseado em respeito e acolhimento
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          PROPÓSITO
      ===================================================== */}

      <section className="inicio-proposito">

        <div className="proposito-content">

          <span>
            O PROPÓSITO DO PULSAN
          </span>

          <h2>
            Porque às vezes,
            <br />
            <strong>ser ouvido já faz diferença.</strong>
          </h2>

          <p>
            O Pulsan busca incentivar uma cultura de empatia,
            escuta e cuidado emocional, mostrando que falar
            sobre o que sentimos pode ser um passo importante
            para não enfrentar tudo sozinho.
          </p>

        </div>

      </section>


      {/* =====================================================
          CTA FINAL
      ===================================================== */}

      <section className="inicio-final">

        <div className="inicio-final-card">

          <div className="final-decoration">
            ✦
          </div>

          <span>
            QUER FAZER PARTE?
          </span>

          <h2>
            Existe espaço para você aqui.
          </h2>

          <p>
            Crie sua conta e conheça uma nova forma
            de compartilhar, ouvir e acolher.
          </p>

          <button
            type="button"
            onClick={irParaCadastro}
          >
            Começar agora
            <span>→</span>
          </button>

        </div>

      </section>


      {/* =====================================================
          RODAPÉ
      ===================================================== */}

      <footer className="inicio-footer">

        <div className="footer-brand">

          <img
            src="/logo.png"
            alt="Pulsan"
          />

          <div>
            <strong>Pulsan</strong>
            <span>Você importa.</span>
          </div>

        </div>

        <p>
          Um espaço para ouvir, acolher e conectar.
        </p>

      </footer>


      {/* =====================================================
          CSS
      ===================================================== */}

      <style>{`

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }

        .inicio-page {
          width: 100%;
          min-height: 100vh;
          overflow: hidden;
          background: #ffffff;
          color: #0f2d5b;
          font-family:
            Arial,
            Helvetica,
            sans-serif;
        }


        /* =================================================
           FUNDO
        ================================================= */

        .inicio-bg-blur {
          position: absolute;
          border-radius: 50%;
          filter: blur(70px);
          pointer-events: none;
        }

        .blur-1 {
          width: 420px;
          height: 420px;
          top: 100px;
          left: -220px;
          background: rgba(168, 199, 255, 0.24);
        }

        .blur-2 {
          width: 380px;
          height: 380px;
          top: 250px;
          right: -220px;
          background: rgba(58, 125, 255, 0.10);
        }

        .inicio-bg-circle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }

        .circle-1 {
          width: 12px;
          height: 12px;
          top: 180px;
          left: 10%;
          background: #a8c7ff;
        }

        .circle-2 {
          width: 8px;
          height: 8px;
          top: 420px;
          right: 12%;
          background: #3a7dff;
        }


        /* =================================================
           NAVBAR
        ================================================= */

        .inicio-navbar {
          position: relative;
          z-index: 10;

          width: min(1180px, calc(100% - 40px));
          height: 76px;

          margin: 0 auto;

          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .inicio-brand {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .inicio-brand img {
          width: 42px;
          height: 42px;
          object-fit: contain;
        }

        .inicio-brand div {
          display: flex;
          flex-direction: column;
        }

        .inicio-brand strong {
          font-size: 17px;
          color: #0f2d5b;
        }

        .inicio-brand span {
          margin-top: 2px;
          color: #60728f;
          font-size: 9px;
        }

        .inicio-nav-links {
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .inicio-nav-links a {
          color: #60728f;
          text-decoration: none;
          font-size: 13px;
          transition: .2s;
        }

        .inicio-nav-links a:hover {
          color: #3a7dff;
        }

        .inicio-nav-login {
          border: 1px solid #a8c7ff;
          border-radius: 11px;
          padding: 9px 17px;
          background: #ffffff;
          color: #3a7dff;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: .2s;
        }

        .inicio-nav-login:hover {
          background: #eaf3ff;
        }


        /* =================================================
           HERO
        ================================================= */

        .inicio-hero {
          position: relative;
          z-index: 2;

          width: min(1180px, calc(100% - 40px));
          min-height: 650px;

          margin: 0 auto;

          display: grid;
          grid-template-columns: 1.1fr .9fr;
          align-items: center;
          gap: 70px;
        }

        .inicio-hero-text {
          max-width: 650px;
        }

        .inicio-tag {
          display: inline-flex;
          padding: 8px 14px;
          border-radius: 30px;
          background: #eaf3ff;
          color: #3a7dff;
          font-size: 11px;
          font-weight: 700;
        }

        .inicio-hero h1 {
          margin: 20px 0 0;

          font-size: clamp(40px, 5.2vw, 68px);
          line-height: 1.04;
          letter-spacing: -2.5px;
          font-weight: 800;
        }

        .inicio-hero h1 span {
          display: block;
          color: #3a7dff;
        }

        .inicio-hero-text > p {
          max-width: 570px;
          margin: 25px 0;

          color: #60728f;
          font-size: 16px;
          line-height: 1.7;
        }

        .inicio-hero-buttons {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .inicio-btn-primary,
        .inicio-btn-secondary {
          min-height: 48px;
          padding: 0 20px;

          border-radius: 13px;

          font-size: 13px;
          font-weight: 700;

          cursor: pointer;
          transition: .25s;
        }

        .inicio-btn-primary {
          border: 1px solid #3a7dff;
          background: #3a7dff;
          color: #ffffff;
          box-shadow: 0 12px 28px rgba(58,125,255,.22);
        }

        .inicio-btn-primary span {
          margin-left: 12px;
          font-size: 18px;
        }

        .inicio-btn-primary:hover {
          transform: translateY(-3px);
        }

        .inicio-btn-secondary {
          border: 1px solid #a8c7ff;
          background: #ffffff;
          color: #3a7dff;
        }

        .inicio-btn-secondary:hover {
          background: #eaf3ff;
        }

        .inicio-hero-info {
          display: flex;
          gap: 25px;
          margin-top: 28px;
        }

        .inicio-hero-info div {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .inicio-hero-info span {
          font-size: 14px;
        }

        .inicio-hero-info small {
          color: #60728f;
          font-size: 10px;
        }


        /* =================================================
           HERO CARD
        ================================================= */

        .inicio-hero-card {
          position: relative;

          width: 100%;
          max-width: 420px;
          min-height: 440px;

          margin: auto;

          padding: 28px;

          display: flex;
          flex-direction: column;
          justify-content: space-between;

          border: 1px solid rgba(168,199,255,.8);
          border-radius: 34px;

          background:
            linear-gradient(
              145deg,
              #eaf3ff,
              #ffffff 70%
            );

          box-shadow:
            0 35px 80px rgba(15,45,91,.12);
        }

        .hero-card-glow {
          position: absolute;
          width: 180px;
          height: 180px;
          top: -50px;
          right: -50px;
          border-radius: 50%;
          background: rgba(58,125,255,.12);
          filter: blur(25px);
        }

        .hero-card-top {
          position: relative;
          z-index: 2;

          display: flex;
          align-items: center;
          gap: 8px;

          color: #60728f;
          font-size: 11px;
        }

        .hero-card-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #3a7dff;
        }

        .hero-card-lock {
          margin-left: auto;
        }

        .hero-bubble {
          position: relative;
          z-index: 2;

          max-width: 280px;
          padding: 18px;

          border-radius: 20px;

          font-size: 13px;
          line-height: 1.5;
        }

        .bubble-one {
          margin-top: 55px;
          align-self: flex-start;

          background: #ffffff;
          color: #0f2d5b;

          border-bottom-left-radius: 5px;

          box-shadow: 0 10px 25px rgba(15,45,91,.06);
        }

        .bubble-two {
          align-self: flex-end;

          background: #3a7dff;
          color: #ffffff;

          border-bottom-right-radius: 5px;

          box-shadow: 0 12px 25px rgba(58,125,255,.20);
        }

        .hero-card-bottom {
          position: relative;
          z-index: 2;

          display: flex;
          align-items: center;
          gap: 12px;

          padding-top: 20px;
          border-top: 1px solid rgba(168,199,255,.55);
        }

        .hero-mini-avatar {
          width: 40px;
          height: 40px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 13px;
          background: #ffffff;
        }

        .hero-card-bottom div:last-child {
          display: flex;
          flex-direction: column;
        }

        .hero-card-bottom strong {
          font-size: 12px;
        }

        .hero-card-bottom span {
          margin-top: 3px;
          color: #60728f;
          font-size: 10px;
        }


        /* =================================================
           FRASE
        ================================================= */

        .inicio-frase {
          width: min(900px, calc(100% - 40px));
          margin: 20px auto 100px;

          display: flex;
          align-items: center;
          gap: 20px;
        }

        .inicio-frase-line {
          flex: 1;
          height: 1px;
          background: #dce8f9;
        }

        .inicio-frase p {
          margin: 0;
          color: #60728f;
          font-size: 13px;
          font-style: italic;
          text-align: center;
        }


        /* =================================================
           SEÇÕES
        ================================================= */

        .inicio-section {
          width: min(1120px, calc(100% - 40px));
          margin: 0 auto;
          padding: 100px 0;
        }

        .inicio-section-title {
          max-width: 700px;
        }

        .inicio-section-title.center {
          margin: auto;
          text-align: center;
        }

        .inicio-section-title > span,
        .inicio-publico-text > span,
        .seguranca-text > span,
        .proposito-content > span,
        .inicio-final-card > span {
          color: #3a7dff;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.5px;
        }

        .inicio-section-title h2,
        .inicio-publico-text h2,
        .seguranca-text h2 {
          margin: 12px 0 15px;

          font-size: clamp(30px, 4vw, 46px);
          line-height: 1.1;
          letter-spacing: -1.5px;
        }

        .inicio-section-title h2 strong,
        .inicio-publico-text h2 strong,
        .seguranca-text h2 strong {
          color: #3a7dff;
        }

        .inicio-section-title > p,
        .inicio-publico-text > p,
        .seguranca-text > p {
          margin: 0;
          color: #60728f;
          font-size: 14px;
          line-height: 1.75;
        }


        /* =================================================
           SOBRE
        ================================================= */

        .inicio-sobre-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          margin-top: 45px;
        }

        .inicio-sobre-card {
          padding: 28px;

          border: 1px solid #e1ebf8;
          border-radius: 22px;

          background: #ffffff;

          box-shadow: 0 15px 40px rgba(15,45,91,.05);

          transition: .25s;
        }

        .inicio-sobre-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 45px rgba(15,45,91,.09);
        }

        .inicio-sobre-card.destaque {
          background: #eaf3ff;
          border-color: #a8c7ff;
        }

        .card-icon {
          width: 48px;
          height: 48px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 15px;
          background: #ffffff;

          font-size: 23px;
        }

        .inicio-sobre-card h3 {
          margin: 20px 0 8px;
          font-size: 17px;
        }

        .inicio-sobre-card p {
          margin: 0;
          color: #60728f;
          font-size: 12px;
          line-height: 1.7;
        }


        /* =================================================
           COMO FUNCIONA
        ================================================= */

        .inicio-como {
          max-width: 1200px;
        }

        .inicio-passos {
          display: flex;
          align-items: stretch;
          justify-content: center;

          margin-top: 60px;
        }

        .inicio-passo {
          flex: 1;
          max-width: 280px;
          text-align: center;
        }

        .passo-numero {
          color: #a8c7ff;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .passo-icon {
          width: 64px;
          height: 64px;

          margin: 12px auto;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 20px;
          background: #eaf3ff;

          font-size: 27px;
        }

        .inicio-passo h3 {
          margin: 12px 0 7px;
          font-size: 16px;
        }

        .inicio-passo p {
          margin: 0;
          color: #60728f;
          font-size: 12px;
          line-height: 1.6;
        }

        .passo-linha {
          width: 70px;
          height: 1px;
          margin-top: 92px;
          background: #a8c7ff;
        }


        /* =================================================
           PÚBLICO
        ================================================= */

        .inicio-publico {
          display: grid;
          grid-template-columns: .85fr 1.15fr;
          align-items: center;
          gap: 70px;

          padding-top: 100px;
          padding-bottom: 100px;
        }

        .inicio-publico-cards {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .publico-card {
          display: flex;
          align-items: center;
          gap: 16px;

          padding: 20px;

          border: 1px solid #e1ebf8;
          border-radius: 18px;

          background: #ffffff;

          box-shadow: 0 10px 30px rgba(15,45,91,.04);
        }

        .publico-card > span {
          width: 48px;
          height: 48px;

          flex: 0 0 48px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 15px;
          background: #eaf3ff;

          font-size: 22px;
        }

        .publico-card h3 {
          margin: 0 0 5px;
          font-size: 15px;
        }

        .publico-card p {
          margin: 0;
          color: #60728f;
          font-size: 11px;
          line-height: 1.5;
        }


        /* =================================================
           SEGURANÇA
        ================================================= */

        .inicio-seguranca {
          display: grid;
          grid-template-columns: .8fr 1.2fr;
          align-items: center;
          gap: 80px;

          padding-top: 120px;
          padding-bottom: 120px;
        }

        .seguranca-visual {
          position: relative;

          width: 280px;
          height: 280px;

          margin: auto;
        }

        .seguranca-circle {
          position: absolute;

          width: 190px;
          height: 190px;

          top: 45px;
          left: 45px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background: #eaf3ff;
          border: 1px solid #a8c7ff;

          box-shadow: 0 25px 60px rgba(58,125,255,.13);
        }

        .seguranca-circle div {
          width: 95px;
          height: 95px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 30px;

          background: #ffffff;

          font-size: 38px;

          box-shadow: 0 15px 35px rgba(15,45,91,.08);
        }

        .seguranca-orbit {
          position: absolute;
          border: 1px dashed #a8c7ff;
          border-radius: 50%;
        }

        .orbit-one {
          width: 250px;
          height: 250px;
          top: 15px;
          left: 15px;
        }

        .orbit-two {
          width: 280px;
          height: 280px;
          top: 0;
          left: 0;
          opacity: .45;
        }

        .seguranca-lista {
          display: flex;
          flex-direction: column;
          gap: 12px;

          margin-top: 25px;
        }

        .seguranca-lista div {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .seguranca-lista span {
          width: 22px;
          height: 22px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 50%;

          background: #eaf3ff;
          color: #3a7dff;

          font-size: 11px;
          font-weight: 800;
        }

        .seguranca-lista p {
          margin: 0;
          color: #60728f;
          font-size: 12px;
        }


        /* =================================================
           PROPÓSITO
        ================================================= */

        .inicio-proposito {
          width: 100%;
          padding: 110px 20px;

          background:
            linear-gradient(
              135deg,
              #0f2d5b,
              #193f7a
            );

          color: white;

          text-align: center;
        }

        .proposito-content {
          width: min(760px, 100%);
          margin: auto;
        }

        .proposito-content > span {
          color: #a8c7ff;
        }

        .proposito-content h2 {
          margin: 15px 0;

          font-size: clamp(30px, 5vw, 52px);
          line-height: 1.1;
          letter-spacing: -1.5px;
        }

        .proposito-content h2 strong {
          color: #a8c7ff;
        }

        .proposito-content p {
          max-width: 620px;
          margin: auto;

          color: rgba(255,255,255,.72);
          font-size: 14px;
          line-height: 1.8;
        }


        /* =================================================
           CTA
        ================================================= */

        .inicio-final {
          width: min(1000px, calc(100% - 40px));
          margin: auto;
          padding: 100px 0;
        }

        .inicio-final-card {
          position: relative;
          overflow: hidden;

          padding: 70px 30px;

          border: 1px solid #a8c7ff;
          border-radius: 30px;

          background: #eaf3ff;

          text-align: center;
        }

        .final-decoration {
          position: absolute;

          top: 20px;
          right: 30px;

          color: #3a7dff;
          font-size: 25px;
        }

        .inicio-final-card h2 {
          margin: 12px 0;

          font-size: clamp(30px, 4vw, 46px);
          letter-spacing: -1.5px;
        }

        .inicio-final-card p {
          max-width: 520px;
          margin: 0 auto 25px;

          color: #60728f;
          font-size: 13px;
          line-height: 1.7;
        }

        .inicio-final-card button {
          min-height: 48px;

          padding: 0 22px;

          border: none;
          border-radius: 13px;

          background: #3a7dff;
          color: white;

          font-size: 13px;
          font-weight: 700;

          cursor: pointer;

          box-shadow: 0 12px 25px rgba(58,125,255,.20);
        }

        .inicio-final-card button span {
          margin-left: 10px;
          font-size: 17px;
        }


        /* =================================================
           FOOTER
        ================================================= */

        .inicio-footer {
          width: min(1120px, calc(100% - 40px));

          margin: auto;
          padding: 30px 0 40px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          border-top: 1px solid #e1ebf8;
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .footer-brand img {
          width: 35px;
          height: 35px;
          object-fit: contain;
        }

        .footer-brand div {
          display: flex;
          flex-direction: column;
        }

        .footer-brand strong {
          font-size: 14px;
        }

        .footer-brand span {
          margin-top: 2px;
          color: #60728f;
          font-size: 9px;
        }

        .inicio-footer > p {
          margin: 0;
          color: #8b9bb2;
          font-size: 10px;
        }


        /* =================================================
           TABLET
        ================================================= */

        @media (max-width: 900px) {

          .inicio-navbar {
            width: calc(100% - 30px);
          }

          .inicio-nav-links {
            gap: 14px;
          }

          .inicio-nav-links a {
            display: none;
          }

          .inicio-hero {
            grid-template-columns: 1fr;
            gap: 50px;
            padding-top: 55px;
            padding-bottom: 70px;
            text-align: center;
          }

          .inicio-hero-text {
            margin: auto;
          }

          .inicio-hero-text > p {
            margin-left: auto;
            margin-right: auto;
          }

          .inicio-hero-buttons,
          .inicio-hero-info {
            justify-content: center;
          }

          .inicio-hero-card {
            min-height: 400px;
          }

          .inicio-sobre-grid {
            grid-template-columns: 1fr;
          }

          .inicio-sobre-card {
            display: grid;
            grid-template-columns: 55px 1fr;
            column-gap: 15px;
          }

          .inicio-sobre-card .card-icon {
            grid-row: span 2;
          }

          .inicio-sobre-card h3 {
            margin: 2px 0 5px;
          }

          .inicio-publico,
          .inicio-seguranca {
            grid-template-columns: 1fr;
            gap: 50px;
          }

          .inicio-publico-text,
          .seguranca-text {
            text-align: center;
          }

          .seguranca-lista {
            align-items: flex-start;
            width: fit-content;
            margin-left: auto;
            margin-right: auto;
          }

        }


        /* =================================================
           CELULAR
        ================================================= */

        @media (max-width: 600px) {

          .inicio-navbar {
            height: 65px;
          }

          .inicio-brand img {
            width: 36px;
            height: 36px;
          }

          .inicio-brand strong {
            font-size: 15px;
          }

          .inicio-nav-login {
            padding: 8px 13px;
          }

          .inicio-hero {
            width: calc(100% - 30px);
            min-height: auto;
            padding-top: 45px;
          }

          .inicio-tag {
            font-size: 9px;
          }

          .inicio-hero h1 {
            font-size: 39px;
            letter-spacing: -1.5px;
          }

          .inicio-hero-text > p {
            font-size: 14px;
            line-height: 1.65;
          }

          .inicio-hero-buttons {
            flex-direction: column;
          }

          .inicio-btn-primary,
          .inicio-btn-secondary {
            width: 100%;
          }

          .inicio-hero-info {
            gap: 14px;
          }

          .inicio-hero-card {
            min-height: 360px;
            padding: 20px;
            border-radius: 25px;
          }

          .hero-bubble {
            max-width: 230px;
            padding: 14px;
            font-size: 12px;
          }

          .inicio-frase {
            margin-bottom: 40px;
          }

          .inicio-frase p {
            font-size: 11px;
          }

          .inicio-section {
            width: calc(100% - 30px);
            padding: 70px 0;
          }

          .inicio-section-title h2,
          .inicio-publico-text h2,
          .seguranca-text h2 {
            font-size: 31px;
          }

          .inicio-section-title > p,
          .inicio-publico-text > p,
          .seguranca-text > p {
            font-size: 13px;
          }

          .inicio-sobre-grid {
            margin-top: 30px;
          }

          .inicio-sobre-card {
            padding: 20px;
          }

          .inicio-passos {
            flex-direction: column;
            align-items: center;
            gap: 10px;
            margin-top: 40px;
          }

          .inicio-passo {
            width: 100%;
          }

          .passo-linha {
            width: 1px;
            height: 35px;
            margin: 0;
          }

          .inicio-publico {
            padding-top: 70px;
            padding-bottom: 70px;
          }

          .publico-card {
            align-items: flex-start;
            padding: 16px;
          }

          .inicio-seguranca {
            padding-top: 70px;
            padding-bottom: 70px;
          }

          .seguranca-visual {
            transform: scale(.85);
          }

          .inicio-proposito {
            padding: 80px 20px;
          }

          .proposito-content h2 {
            font-size: 32px;
          }

          .proposito-content p {
            font-size: 13px;
          }

          .inicio-final {
            width: calc(100% - 30px);
            padding: 70px 0;
          }

          .inicio-final-card {
            padding: 55px 20px;
            border-radius: 24px;
          }

          .inicio-final-card h2 {
            font-size: 31px;
          }

          .inicio-footer {
            width: calc(100% - 30px);
            flex-direction: column;
            gap: 15px;
            align-items: flex-start;
          }

        }


        /* =================================================
           CELULARES MUITO PEQUENOS
        ================================================= */

        @media (max-width: 380px) {

          .inicio-hero h1 {
            font-size: 34px;
          }

          .inicio-hero-info {
            flex-direction: column;
            align-items: center;
          }

          .inicio-hero-card {
            min-height: 340px;
          }

          .seguranca-visual {
            transform: scale(.72);
            margin-left: -25px;
            margin-right: -25px;
          }

        }

      `}</style>

    </main>
  );
}

export default Inicio;