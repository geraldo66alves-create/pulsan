import React, { useEffect, useRef, useState } from "react";


function Icon({ name, size = 22, strokeWidth = 1.9, className = "" }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    className,
    "aria-hidden": true,
  };

  const paths = {
    message: (
      <>
        <path d="M20 11.5a7.5 7.5 0 0 1-8 7.45 8.8 8.8 0 0 1-3.25-.62L4 20l1.67-3.42A7.4 7.4 0 0 1 4.5 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z" />
        <path d="M8 11.5h.01M12 11.5h.01M16 11.5h.01" />
      </>
    ),
    headphones: (
      <>
        <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
        <path d="M4 14h3v5H5a1 1 0 0 1-1-1v-4ZM20 14h-3v5h2a1 1 0 0 0 1-1v-4Z" />
      </>
    ),
    heartHandshake: (
      <>
        <path d="m12 20-1.3-1.2C5.6 14.15 3 11.8 3 8.9A4.4 4.4 0 0 1 7.4 4.5c1.7 0 3.1.8 4.1 2 1-1.2 2.4-2 4.1-2A4.4 4.4 0 0 1 20 8.9c0 2.9-2.6 5.25-7.7 9.9L12 20Z" />
        <path d="m8.5 11.5 2 1.8a2 2 0 0 0 2.7-.05l1.2-1.15M7 10.5l2.1 1.9M17 10.5l-2.1 1.9" />
      </>
    ),
    users: (
      <>
        <path d="M16 21v-1.6a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4V21" />
        <circle cx="9.5" cy="7.5" r="3.5" />
        <path d="M17 11a3.3 3.3 0 0 0 0-6.4M21 21v-1.6a4 4 0 0 0-3-3.86" />
      </>
    ),
    building: (
      <>
        <path d="M4 21V5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v16M16 8h3a1 1 0 0 1 1 1v12M8 8h2M8 12h2M8 16h2M12 8h2M12 12h2M12 16h2M3 21h18" />
      </>
    ),
    school: (
      <>
        <path d="m3 10 9-5 9 5-9 5-9-5Z" />
        <path d="M7 12.2V16c2.7 2 7.3 2 10 0v-3.8M21 10v6" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
      </>
    ),
    eye: (
      <>
        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
  };

  return <svg {...common}>{paths[name] || paths.message}</svg>;
}

const BUBBLE_ONE = "Às vezes eu só precisava que alguém me escutasse.";
const BUBBLE_TWO = "Você não precisa enfrentar tudo sozinho.";

const SOBRE_DATA = [
  {
    icon: "message",
    titulo: "Falar",
    texto:
      "Compartilhe aquilo que está sentindo e coloque em palavras o que muitas vezes fica guardado.",
    extra:
      "Sem formulários, sem categorias obrigatórias — só o espaço em branco e o que você precisa dizer.",
  },
  {
    icon: "headphones",
    titulo: "Ser ouvido",
    texto: "Encontre pessoas dispostas a ouvir e oferecer uma palavra de apoio.",
    extra:
      "Quem responde escolheu estar ali. Cada comentário é alguém que decidiu prestar atenção.",
  },
  {
    icon: "heartHandshake",
    titulo: "Acolher",
    texto: "Incentive relações baseadas em empatia, respeito e compreensão.",
    extra:
      "Acolher não é resolver o problema do outro — é mostrar que ele não está enfrentando isso sozinho.",
  },
];

const PASSOS_DATA = [
  {
    numero: "01",
    icon: "message",
    titulo: "Compartilhe",
    texto: "Escreva sobre o que você está sentindo em um espaço pensado para acolher.",
    exemplo: "Seu desabafo entra no Ambiente sem nome, sem foto, sem rastro.",
  },
  {
    numero: "02",
    icon: "users",
    titulo: "Receba apoio",
    texto: "Pessoas dispostas a ajudar podem demonstrar interesse em conversar.",
    exemplo: "Um pedido de conversa chega para você aceitar ou recusar — a escolha é sempre sua.",
  },
  {
    numero: "03",
    icon: "message",
    titulo: "Converse",
    texto: "Quando houver aceitação, vocês podem iniciar uma conversa privada.",
    exemplo: "A conversa fica só entre vocês dois, separada de tudo o mais no Ambiente.",
  },
];

const PUBLICO_DATA = [
  {
    icon: "building",
    titulo: "Empresas",
    texto: "Incentivar uma cultura de escuta, acolhimento e cuidado entre colaboradores.",
    voz: "“Descobri que dois colegas do meu time estavam passando pela mesma semana difícil que eu.”",
  },
  {
    icon: "school",
    titulo: "Escolas",
    texto: "Criar espaços de diálogo e atenção às relações e ao bem-estar dos estudantes.",
    voz: "“Consegui contar o que estava acontecendo sem precisar dizer meu nome na frente da turma.”",
  },
  {
    icon: "users",
    titulo: "Comunidade",
    texto: "Aproximar pessoas através da empatia, escuta e apoio mútuo.",
    voz: "“Respondi ao desabafo de alguém e, sem saber quem era, consegui ajudar.”",
  },
];

function Inicio({ irPara }) {
  // Página pública/landing: mantém a identidade visual clara do Pulsan.
  // A navegação e os botões continuam sendo controlados pelo App.jsx.
  const [activeSobre, setActiveSobre] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [flipped, setFlipped] = useState({});
  const [anonReveal, setAnonReveal] = useState(false);

  const [typedOne, setTypedOne] = useState("");
  const [typedTwo, setTypedTwo] = useState("");
  const [showTwo, setShowTwo] = useState(false);
  const [phase, setPhase] = useState("one"); // one -> two -> done
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotionRef.current) {
      setTypedOne(BUBBLE_ONE);
      setTypedTwo(BUBBLE_TWO);
      setShowTwo(true);
      setPhase("done");
      return;
    }

    let i = 0;
    const timers = [];

    const typeOne = () => {
      const interval = setInterval(() => {
        i += 1;
        setTypedOne(BUBBLE_ONE.slice(0, i));
        if (i >= BUBBLE_ONE.length) {
          clearInterval(interval);
          timers.push(setTimeout(startTwo, 550));
        }
      }, 28);
      timers.push(interval);
    };

    const startTwo = () => {
      setShowTwo(true);
      setPhase("two");
      let j = 0;
      const interval = setInterval(() => {
        j += 1;
        setTypedTwo(BUBBLE_TWO.slice(0, j));
        if (j >= BUBBLE_TWO.length) {
          clearInterval(interval);
          setPhase("done");
        }
      }, 28);
      timers.push(interval);
    };

    timers.push(setTimeout(typeOne, 500));

    return () => {
      timers.forEach((t) => clearInterval(t) || clearTimeout(t));
    };
  }, []);

  const irParaCadastro = () => irPara("cadastro");
  const irParaLogin = () => irPara("login");

  const toggleFlip = (index) => {
    setFlipped((prev) => ({ ...prev, [index]: !prev[index] }));
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
          <img src="/logo.png" alt="Logo Pulsan" />
          <div>
            <strong>Pulsan</strong>
            <span>Você importa</span>
          </div>
        </div>

        <div className="inicio-nav-links">
          <a href="#sobre">Sobre</a>
          <a href="#como-funciona">Como funciona</a>
          <a href="#seguranca">Segurança</a>

          <button type="button" onClick={irParaLogin} className="inicio-nav-login">
            Entrar
          </button>
        </div>
      </nav>

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="inicio-hero">
        <div className="inicio-hero-text">
          <span className="inicio-tag">Um espaço para ser ouvido</span>

          <h1>
            Você não precisa
            <span> passar por tudo sozinho.</span>
          </h1>

          <p>
            O Pulsan é um espaço de apoio emocional criado para aproximar
            pessoas, incentivar a escuta e tornar mais fácil falar sobre
            aquilo que muitas vezes guardamos para nós mesmos.
          </p>

          <div className="inicio-hero-buttons">
            <button type="button" className="inicio-btn-primary" onClick={irParaCadastro}>
              Criar minha conta
              <span>→</span>
            </button>

            <button type="button" className="inicio-btn-secondary" onClick={irParaLogin}>
              Já tenho uma conta
            </button>
          </div>

          <div className="inicio-hero-info">
            <div>
              <span><Icon name="lock" size={16} /></span>
              <small>Privacidade</small>
            </div>

            <div>
              <span><Icon name="heartHandshake" size={15} /></span>
              <small>Acolhimento</small>
            </div>

            <div>
              <span><Icon name="users" size={15} /></span>
              <small>Escuta</small>
            </div>
          </div>
        </div>

        {/* CARD VISUAL */}

        <div className="inicio-hero-card">
          <div className="hero-card-glow"></div>

          <svg
            className="hero-pulse-svg"
            viewBox="0 0 400 60"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              className="hero-pulse-path"
              d="M0,30 L120,30 L140,8 L162,52 L184,30 L400,30"
            />
          </svg>

          <div className="hero-card-top">
            <span className="hero-card-dot"></span>
            <span>Espaço seguro</span>
            <span className="hero-card-lock"><Icon name="lock" size={14} /></span>
          </div>

          <div className="hero-bubble bubble-one" aria-live="polite">
            {typedOne}
            {phase === "one" && <span className="type-cursor" aria-hidden="true" />}
          </div>

          {showTwo && (
            <div className="hero-bubble bubble-two" aria-live="polite">
              {typedTwo}
              {phase === "two" && <span className="type-cursor" aria-hidden="true" />}
            </div>
          )}

          <div className="hero-card-bottom">
            <div className="hero-mini-avatar"><Icon name="message" size={19} /></div>

            <div>
              <strong>Um lugar para falar</strong>
              <span>Sem julgamentos.</span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FRASE
      ===================================================== */}

      <section className="inicio-frase">
        <div className="inicio-frase-line"></div>
        <p>"Falar também é uma forma de cuidar de si."</p>
        <div className="inicio-frase-line"></div>
      </section>

      {/* =====================================================
          SOBRE
      ===================================================== */}

      <section id="sobre" className="inicio-section inicio-sobre">
        <div className="inicio-section-title">
          <span>Conheça o Pulsan</span>

          <h2>
            Um espaço criado para
            <strong> acolher.</strong>
          </h2>

          <p>
            Nem sempre é fácil falar sobre o que sentimos. O Pulsan nasceu
            com a proposta de criar um ambiente onde as pessoas possam
            compartilhar seus sentimentos, encontrar escuta e construir
            conexões baseadas em empatia e respeito.
          </p>
        </div>

        <div className="inicio-sobre-grid">
          {SOBRE_DATA.map((item, index) => {
            const isActive = activeSobre === index;
            return (
              <button
                type="button"
                key={item.titulo}
                className={`inicio-sobre-card${isActive ? " destaque" : ""}`}
                onClick={() => setActiveSobre(index)}
                aria-expanded={isActive}
              >
                <div className="card-icon"><Icon name={item.icon} size={22} /></div>
                <h3>{item.titulo}</h3>
                <p>{item.texto}</p>

                <div className={`sobre-extra${isActive ? " open" : ""}`}>
                  <p>{item.extra}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          COMO FUNCIONA
      ===================================================== */}

      <section id="como-funciona" className="inicio-section inicio-como">
        <div className="inicio-section-title center">
          <span>Como funciona</span>

          <h2>
            Simples para você.
            <strong> Humano por essência.</strong>
          </h2>

          <p>
            O Pulsan foi pensado para que pedir apoio, oferecer escuta e
            conversar seja algo simples e natural.
          </p>
        </div>

        <div className="inicio-passos-wrap">
          <div className="pulso-track" aria-hidden="true">
            <svg className="pulso-line" viewBox="0 0 600 40" preserveAspectRatio="none">
              <path d="M0,20 L230,20 L250,4 L270,36 L290,20 L600,20" />
            </svg>
            <div
              className="pulso-dot"
              style={{ left: `${activeStep * 50}%` }}
            ></div>
          </div>

          <div className="inicio-passos">
            {PASSOS_DATA.map((passo, index) => {
              const isActive = activeStep === index;
              return (
                <React.Fragment key={passo.titulo}>
                  <button
                    type="button"
                    className={`inicio-passo${isActive ? " active" : ""}`}
                    onClick={() => setActiveStep(index)}
                  >
                    <div className="passo-numero">{passo.numero}</div>
                    <div className="passo-icon"><Icon name={passo.icon} size={27} /></div>
                    <h3>{passo.titulo}</h3>
                    <p>{passo.texto}</p>
                  </button>

                  {index < PASSOS_DATA.length - 1 && <div className="passo-espaco"></div>}
                </React.Fragment>
              );
            })}
          </div>

          <div className="passo-exemplo">
            <span><Icon name="message" size={16} /></span>
            <p>{PASSOS_DATA[activeStep].exemplo}</p>
          </div>
        </div>
      </section>

      {/* =====================================================
          PARA QUEM É
      ===================================================== */}

      <section className="inicio-section inicio-publico">
        <div className="inicio-publico-text">
          <span>Para quem é o Pulsan?</span>

          <h2>
            Um projeto que pode
            <strong> fazer parte de diferentes ambientes.</strong>
          </h2>

          <p>
            O Pulsan foi pensado inicialmente para contextos onde o cuidado
            emocional e a comunicação podem fazer diferença no dia a dia.
          </p>
        </div>

        <div className="inicio-publico-cards">
          {PUBLICO_DATA.map((item, index) => (
            <button
              type="button"
              key={item.titulo}
              className={`publico-flip${flipped[index] ? " is-flipped" : ""}`}
              onClick={() => toggleFlip(index)}
              aria-label={`Ver depoimento sobre ${item.titulo}`}
              aria-expanded={Boolean(flipped[index])}
            >
              <div className="publico-flip-inner">
                <div className="publico-card publico-front">
                  <span><Icon name={item.icon} size={22} /></span>
                  <div>
                    <h3>{item.titulo}</h3>
                    <p>{item.texto}</p>
                  </div>
                </div>

                <div className="publico-card publico-back">
                  <p>{item.voz}</p>
                  <small>toque para voltar</small>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* =====================================================
          SEGURANÇA
      ===================================================== */}

      <section id="seguranca" className="inicio-section inicio-seguranca">
        <div className="seguranca-visual">
          <div className="seguranca-circle">
            <div><Icon name="lock" size={38} /></div>
          </div>

          <span className="seguranca-orbit orbit-one"></span>
          <span className="seguranca-orbit orbit-two"></span>
        </div>

        <div className="seguranca-text">
          <span>Privacidade e segurança</span>

          <h2>
            Sua identidade
            <strong> merece proteção.</strong>
          </h2>

          <p>
            O Pulsan foi pensado para preservar a identidade de quem decide
            compartilhar um desabafo. O objetivo é proporcionar um ambiente
            onde falar sobre sentimentos não precise significar medo de
            exposição ou julgamento.
          </p>

          <button
            type="button"
            className="seguranca-demo"
            onClick={() => setAnonReveal((v) => !v)}
            aria-pressed={anonReveal}
          >
            <span className={`seguranca-demo-nome${anonReveal ? " protegido" : ""}`}>
              {anonReveal ? "Anônimo" : "Ana Lima"}
            </span>
            <span className="seguranca-demo-icone">{anonReveal ? <Icon name="lock" size={14} /> : <Icon name="eye" size={14} />}</span>
          </button>
          <small className="seguranca-demo-legenda">
            {anonReveal
              ? "Assim é como seu desabafo aparece para os outros."
              : "Toque para ver como o Pulsan protege esse nome."}
          </small>

          <div className="seguranca-lista">
            <div>
              <span><Icon name="check" size={13} /></span>
              <p>Identidade protegida nos desabafos</p>
            </div>

            <div>
              <span><Icon name="check" size={13} /></span>
              <p>Conversas privadas entre as pessoas envolvidas</p>
            </div>

            <div>
              <span><Icon name="check" size={13} /></span>
              <p>Ambiente baseado em respeito e acolhimento</p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PROPÓSITO
      ===================================================== */}

      <section className="inicio-proposito">
        <div className="proposito-content">
          <span>O propósito do Pulsan</span>

          <h2>
            Porque às vezes,
            <br />
            <strong>ser ouvido já faz diferença.</strong>
          </h2>

          <p>
            O Pulsan busca incentivar uma cultura de empatia, escuta e
            cuidado emocional, mostrando que falar sobre o que sentimos pode
            ser um passo importante para não enfrentar tudo sozinho.
          </p>
        </div>
      </section>

      {/* =====================================================
          CTA FINAL
      ===================================================== */}

      <section className="inicio-final">
        <div className="inicio-final-card">
          <div className="final-pulse" aria-hidden="true"></div>

          <span>Quer fazer parte?</span>

          <h2>Existe espaço para você aqui.</h2>

          <p>
            Crie sua conta e conheça uma nova forma de compartilhar, ouvir e
            acolher.
          </p>

          <button type="button" onClick={irParaCadastro}>
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
          <img src="/logo.png" alt="Pulsan" />
          <div>
            <strong>Pulsan</strong>
            <span>Você importa.</span>
          </div>
        </div>

        <p>Um espaço para ouvir, acolher e conectar.</p>
      </footer>

      {/* =====================================================
          CSS
      ===================================================== */}

      <style>{`

        .inicio-page,
        .inicio-page * {
          box-sizing: border-box;
        }

        .inicio-page {
          scroll-behavior: smooth;
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
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #3a7dff;
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

          overflow: hidden;
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

        .hero-pulse-svg {
          position: absolute;
          left: 0;
          right: 0;
          top: 58px;

          width: 100%;
          height: 44px;

          opacity: .55;
          z-index: 1;
        }

        .hero-pulse-path {
          fill: none;
          stroke: #3a7dff;
          stroke-width: 2;
          stroke-linecap: round;
          stroke-linejoin: round;

          stroke-dasharray: 620;
          stroke-dashoffset: 620;
          animation: pulseDraw 2.4s ease-out .4s forwards,
                      pulseGlow 2.6s ease-in-out 2.8s infinite;
        }

        @keyframes pulseDraw {
          to { stroke-dashoffset: 0; }
        }

        @keyframes pulseGlow {
          0%, 100% { opacity: .35; }
          50% { opacity: .8; }
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
          display: inline-flex;
          align-items: center;
          color: #3a7dff;
        }

        .hero-bubble {
          position: relative;
          z-index: 2;

          max-width: 280px;
          min-height: 1.5em;
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
          margin-top: 14px;

          background: #3a7dff;
          color: #ffffff;

          border-bottom-right-radius: 5px;

          box-shadow: 0 12px 25px rgba(58,125,255,.20);
        }

        .type-cursor {
          display: inline-block;
          width: 2px;
          height: 12px;
          margin-left: 2px;
          background: currentColor;
          vertical-align: middle;
          animation: blink 1s step-end infinite;
        }

        @keyframes blink {
          50% { opacity: 0; }
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
          color: #3a7dff;
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
          font-size: 12px;
          font-weight: 700;
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
           SOBRE (agora interativo)
        ================================================= */

        .inicio-sobre-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          margin-top: 45px;
          align-items: start;
        }

        .inicio-sobre-card {
          width: 100%;

          padding: 28px;

          border: 1px solid #e1ebf8;
          border-radius: 22px;

          background: #ffffff;
          color: inherit;
          font: inherit;
          text-align: left;

          cursor: pointer;

          box-shadow: 0 15px 40px rgba(15,45,91,.05);

          transition: border-color .25s, background .25s, transform .25s, box-shadow .25s;
        }

        .inicio-sobre-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 45px rgba(15,45,91,.09);
        }

        .inicio-sobre-card:focus-visible {
          outline: 2px solid #3a7dff;
          outline-offset: 3px;
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
          color: #3a7dff;

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

        .sobre-extra {
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition: max-height .35s ease, opacity .3s ease, margin-top .35s ease;
        }

        .sobre-extra p {
          margin: 0;
          padding-top: 12px;
          border-top: 1px dashed #a8c7ff;

          color: #3a7dff;
          font-size: 12px;
          line-height: 1.7;
        }

        .sobre-extra.open {
          max-height: 160px;
          opacity: 1;
          margin-top: 14px;
        }


        /* =================================================
           COMO FUNCIONA (linha de pulso)
        ================================================= */

        .inicio-como {
          max-width: 1200px;
        }

        .inicio-passos-wrap {
          margin-top: 60px;
        }

        .pulso-track {
          position: relative;
          height: 40px;
          margin: 0 auto -6px;
          max-width: 600px;
        }

        .pulso-line {
          width: 100%;
          height: 100%;
        }

        .pulso-line path {
          fill: none;
          stroke: #a8c7ff;
          stroke-width: 1.5;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .pulso-dot {
          position: absolute;
          top: 50%;
          width: 12px;
          height: 12px;
          margin-left: -6px;
          margin-top: -6px;

          border-radius: 50%;
          background: #3a7dff;
          box-shadow: 0 0 0 6px rgba(58,125,255,.18);

          transition: left .45s ease;
        }

        .inicio-passos {
          display: flex;
          align-items: stretch;
          justify-content: center;
        }

        .inicio-passo {
          flex: 1;
          max-width: 280px;

          border: none;
          background: transparent;
          font: inherit;
          color: inherit;

          padding: 6px 10px 0;
          text-align: center;
          cursor: pointer;

          border-radius: 16px;
          transition: transform .25s, background .25s;
        }

        .inicio-passo:hover {
          background: #eaf3ff;
        }

        .inicio-passo:focus-visible {
          outline: 2px solid #3a7dff;
          outline-offset: 3px;
        }

        .inicio-passo.active {
          background: #eaf3ff;
        }

        .passo-numero {
          color: #a8c7ff;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1px;
        }

        .inicio-passo.active .passo-numero {
          color: #3a7dff;
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
          color: #3a7dff;

          font-size: 27px;

          transition: transform .3s;
        }

        .inicio-passo.active .passo-icon {
          transform: scale(1.08);
          background: #ffffff;
          box-shadow: 0 12px 25px rgba(58,125,255,.18);
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

        .passo-espaco {
          width: 70px;
        }

        .passo-exemplo {
          display: flex;
          align-items: center;
          gap: 10px;

          max-width: 560px;
          margin: 34px auto 0;
          padding: 16px 20px;

          border: 1px solid #e1ebf8;
          border-radius: 16px;
          background: #ffffff;

          box-shadow: 0 10px 30px rgba(15,45,91,.05);
        }

        .passo-exemplo span {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #3a7dff;
          font-size: 16px;
        }

        .passo-exemplo p {
          margin: 0;
          color: #60728f;
          font-size: 12px;
          line-height: 1.6;
        }


        /* =================================================
           PÚBLICO (flip cards)
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

        .publico-flip {
          border: none;
          background: transparent;
          padding: 0;
          font: inherit;
          color: inherit;
          text-align: left;
          cursor: pointer;

          perspective: 1200px;
        }

        .publico-flip:focus-visible {
          outline: 2px solid #3a7dff;
          outline-offset: 3px;
        }

        .publico-flip-inner {
          position: relative;
          width: 100%;
          min-height: 92px;

          transform-style: preserve-3d;
          transition: transform .5s;
        }

        .publico-flip.is-flipped .publico-flip-inner {
          transform: rotateY(180deg);
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

        .publico-front,
        .publico-back {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;

          backface-visibility: hidden;
        }

        .publico-back {
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          gap: 6px;

          background: #eaf3ff;
          border-color: #a8c7ff;

          transform: rotateY(180deg);
        }

        .publico-back p {
          margin: 0;
          color: #0f2d5b;
          font-size: 12px;
          font-style: italic;
          line-height: 1.6;
        }

        .publico-back small {
          color: #3a7dff;
          font-size: 10px;
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
          color: #3a7dff;

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
           SEGURANÇA (demo interativa)
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
          color: #3a7dff;

          font-size: 38px;

          box-shadow: 0 15px 35px rgba(15,45,91,.08);
        }

        .seguranca-orbit {
          position: absolute;
          border: 1px dashed #a8c7ff;
          border-radius: 50%;
          animation: orbitSpin 22s linear infinite;
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
          animation-duration: 34s;
          animation-direction: reverse;
        }

        @keyframes orbitSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .seguranca-demo {
          display: inline-flex;
          align-items: center;
          gap: 10px;

          margin-top: 22px;
          padding: 10px 16px;

          border: 1px solid #a8c7ff;
          border-radius: 30px;
          background: #eaf3ff;

          cursor: pointer;
          transition: background .2s;
        }

        .seguranca-demo:hover {
          background: #dceafe;
        }

        .seguranca-demo:focus-visible {
          outline: 2px solid #3a7dff;
          outline-offset: 3px;
        }

        .seguranca-demo-nome {
          font-size: 13px;
          font-weight: 700;
          color: #0f2d5b;
          filter: blur(0px);
          transition: filter .3s, color .3s;
        }

        .seguranca-demo-nome.protegido {
          color: #3a7dff;
        }

        .seguranca-demo-icone {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #3a7dff;
        }

        .seguranca-demo-legenda {
          display: block;
          margin-top: 8px;
          color: #60728f;
          font-size: 11px;
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

        .final-pulse {
          position: absolute;
          top: -60px;
          right: -60px;

          width: 160px;
          height: 160px;

          border-radius: 50%;
          background: rgba(58,125,255,.16);

          animation: finalPulse 3.2s ease-in-out infinite;
        }

        @keyframes finalPulse {
          0%, 100% { transform: scale(1); opacity: .6; }
          50% { transform: scale(1.25); opacity: .3; }
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
          position: relative;
          z-index: 1;

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
          transition: transform .2s;
        }

        .inicio-final-card button:hover {
          transform: translateY(-3px);
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
           MOVIMENTO REDUZIDO
        ================================================= */

        @media (prefers-reduced-motion: reduce) {

          .hero-pulse-path {
            animation: none;
            stroke-dashoffset: 0;
          }

          .seguranca-orbit {
            animation: none;
          }

          .final-pulse {
            animation: none;
          }

          .type-cursor {
            animation: none;
          }

          .inicio-passo,
          .publico-flip-inner,
          .inicio-sobre-card,
          .pulso-dot {
            transition: none;
          }

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

          .seguranca-demo {
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

          .pulso-track {
            display: none;
          }

          .inicio-passos {
            flex-direction: column;
            align-items: center;
            gap: 10px;
          }

          .inicio-passo {
            width: 100%;
          }

          .passo-espaco {
            display: none;
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