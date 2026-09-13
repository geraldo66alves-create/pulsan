import React, { useEffect, useState } from "react";

function Inicio({ irPara }) {
  const [recursoAtual, setRecursoAtual] = useState(0);

  const recursos = [
    {
      icone: "💬",
      titulo: "Fale sem medo",
      texto: "Compartilhe o que sente em um ambiente acolhedor e sem julgamentos.",
    },
    {
      icone: "🤝",
      titulo: "Encontre apoio",
      texto: "Conecte-se com pessoas dispostas a ouvir e oferecer apoio.",
    },
    {
      icone: "🔒",
      titulo: "Sua privacidade importa",
      texto: "Conteúdos e interações pensados para proteger sua identidade.",
    },
    {
      icone: "🦋",
      titulo: "Cuide do seu emocional",
      texto: "Reconheça seus sentimentos e dê pequenos passos em direção ao bem-estar.",
    },
  ];

  useEffect(() => {
    const intervalo = setInterval(() => {
      setRecursoAtual((atual) => (atual + 1) % recursos.length);
    }, 4000);

    return () => clearInterval(intervalo);
  }, [recursos.length]);

  return (
    <main className="inicio-page">
      <div className="inicio-decoracao">
        <span className="decoracao-brilho">✦</span>
        <strong>Pulsan</strong>
        <small>Você importa</small>
      </div>

      <div className="inicio-formas forma-um"></div>
      <div className="inicio-formas forma-dois"></div>

      <section className="inicio-conteudo">
             <div className="inicio-identidade">
            <img
              src="/logo.png"
              alt="Logo Pulsan"
              className="inicio-logo"
            />
            <h2 className="inicio-nome">Pulsan</h2>
          </div>

        <span className="inicio-etiqueta">
          Um espaço para cuidar de você
        </span>

        <h1>
          Você não precisa passar por tudo sozinho.
        </h1>

        <p className="inicio-descricao">
          O Pulsan é uma plataforma de apoio emocional que conecta pessoas,
          promove escuta e cria um espaço seguro para compartilhar sentimentos.
        </p>

        <div className="inicio-botoes">
          <button
            type="button"
            className="inicio-botao principal"
            onClick={() => irPara("login")}
          >
            Entrar
          </button>

          <button
            type="button"
            className="inicio-botao secundario"
            onClick={() => irPara("cadastro")}
          >
            Criar conta
          </button>
        </div>

        <div className="recursos-area">
          <div className="recursos-titulo">
            <span>Conheça o Pulsan</span>
            <div className="recursos-indicadores">
              {recursos.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  className={
                    index === recursoAtual
                      ? "indicador ativo"
                      : "indicador"
                  }
                  onClick={() => setRecursoAtual(index)}
                  aria-label={`Mostrar recurso ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>

          <div className="recurso-card">
            <div className="recurso-icone">
              {recursos[recursoAtual].icone}
            </div>

            <div className="recurso-texto">
              <h2>{recursos[recursoAtual].titulo}</h2>
              <p>{recursos[recursoAtual].texto}</p>
            </div>

            <button
              type="button"
              className="recurso-proximo"
              onClick={() =>
                setRecursoAtual((atual) => (atual + 1) % recursos.length)
              }
              aria-label="Próximo recurso"
            >
              →
            </button>
          </div>
        </div>
      </section>

      <style>{`
        .inicio-page {
          min-height: 100vh;
          width: 100%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          box-sizing: border-box;
          overflow: hidden;
          background: var(--cor-fundo, #ffffff);
          color: var(--cor-texto, #0f2d5b);
        }

        .inicio-identidade {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-bottom: 22px;
        }

        .inicio-logo {
          display: block;
          width: 145px;
          height: auto;
          max-width: 100%;
          object-fit: contain;
          margin: 0;
        }

        .inicio-nome {
          margin: 8px 0 0;
          font-size: 25px;
          line-height: 1;
          font-weight: 800;
          letter-spacing: 0.5px;
          color: var(--cor-texto, #0f2d5b);
        }

        .inicio-etiqueta {
          padding: 7px 14px;
          border-radius: 30px;
          background: #eaf3ff;
          color: #3a7dff;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.3px;
          margin-bottom: 18px;
        }

        .inicio-conteudo h1 {
          max-width: 650px;
          margin: 0;
          font-size: clamp(32px, 5vw, 54px);
          line-height: 1.1;
          letter-spacing: -1.5px;
          font-weight: 800;
          color: var(--cor-texto, #0f2d5b);
        }

        .inicio-descricao {
          max-width: 570px;
          margin: 22px 0 28px;
          font-size: 16px;
          line-height: 1.6;
          color: var(--cor-texto-secundario, #60728f);
        }

        .inicio-botoes {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 14px;
          margin-bottom: 34px;
        }

        .inicio-botao {
          min-width: 150px;
          padding: 14px 28px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .inicio-botao:hover {
          transform: translateY(-3px);
        }

        .inicio-botao.principal {
          border: 1px solid #3a7dff;
          background: #3a7dff;
          color: #ffffff;
          box-shadow: 0 8px 22px rgba(58, 125, 255, 0.25);
        }

        .inicio-botao.secundario {
          border: 1px solid #a8c7ff;
          background: transparent;
          color: #3a7dff;
        }

        .inicio-botao.secundario:hover {
          background: #eaf3ff;
        }

        .recursos-area {
          width: 100%;
          max-width: 560px;
        }

        .recursos-titulo {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          padding: 0 4px;
          color: var(--cor-texto-secundario, #60728f);
          font-size: 12px;
          font-weight: 700;
        }

        .recursos-indicadores {
          display: flex;
          gap: 5px;
        }

        .indicador {
          width: 7px;
          height: 7px;
          padding: 0;
          border: 0;
          border-radius: 20px;
          background: #cbdcf7;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .indicador.ativo {
          width: 22px;
          background: #3a7dff;
        }

        .recurso-card {
          display: flex;
          align-items: center;
          gap: 15px;
          min-height: 104px;
          padding: 18px;
          text-align: left;
          border: 1px solid rgba(168, 199, 255, 0.5);
          border-radius: 18px;
          background: rgba(234, 243, 255, 0.72);
          box-shadow: 0 12px 30px rgba(15, 45, 91, 0.07);
          animation: deslizar 0.45s ease;
        }

        .recurso-icone {
          width: 54px;
          height: 54px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 16px;
          background: #ffffff;
          font-size: 27px;
        }

        .recurso-texto {
          flex: 1;
        }

        .recurso-texto h2 {
          margin: 0 0 5px;
          font-size: 16px;
          color: #0f2d5b;
        }

        .recurso-texto p {
          margin: 0;
          font-size: 13px;
          line-height: 1.5;
          color: #60728f;
        }

        .recurso-proximo {
          width: 34px;
          height: 34px;
          flex-shrink: 0;
          border: 0;
          border-radius: 50%;
          background: #3a7dff;
          color: #ffffff;
          font-size: 20px;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .recurso-proximo:hover {
          transform: translateX(3px);
        }

        .inicio-decoracao {
          position: absolute;
          top: 24px;
          right: 24px;
          z-index: 3;
          width: 82px;
          height: 62px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2px;
          border: 1px solid rgba(58, 125, 255, 0.18);
          border-radius: 14px;
          background: rgba(234, 243, 255, 0.7);
          box-shadow: 0 8px 24px rgba(15, 45, 91, 0.06);
          pointer-events: none;
        }

        .decoracao-brilho {
          color: #3a7dff;
          font-size: 17px;
        }

        .inicio-decoracao strong {
          color: #0f2d5b;
          font-size: 11px;
        }

        .inicio-decoracao small {
          color: #60728f;
          font-size: 9px;
        }

        .inicio-formas {
          position: absolute;
          border-radius: 50%;
          filter: blur(1px);
          pointer-events: none;
        }

        .forma-um {
          width: 260px;
          height: 260px;
          top: -150px;
          left: -100px;
          background: rgba(168, 199, 255, 0.2);
        }

        .forma-dois {
          width: 230px;
          height: 230px;
          bottom: -150px;
          right: -80px;
          background: rgba(58, 125, 255, 0.1);
        }

        @keyframes aparecer {
          from {
            opacity: 0;
            transform: translateY(18px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes deslizar {
          from {
            opacity: 0;
            transform: translateX(15px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @media (max-width: 600px) {
          .inicio-page {
            padding: 30px 20px;
          }

          .inicio-decoracao {
            top: 14px;
            right: 14px;
            width: 70px;
            height: 54px;
          }

          .inicio-logo {
            width: 120px;
          }

          .inicio-nome {
            font-size: 22px;
          }

          .inicio-conteudo h1 {
            font-size: 33px;
            letter-spacing: -0.8px;
          }

          .inicio-descricao {
            font-size: 14px;
          }

          .inicio-botoes {
            width: 100%;
            flex-direction: column;
            gap: 10px;
          }

          .inicio-botao {
            width: 100%;
            max-width: 280px;
          }

          .recursos-titulo {
            font-size: 11px;
          }

          .recurso-card {
            padding: 14px;
            gap: 10px;
          }

          .recurso-icone {
            width: 43px;
            height: 43px;
            font-size: 22px;
          }

          .recurso-texto h2 {
            font-size: 14px;
          }

          .recurso-texto p {
            font-size: 12px;
          }
        }
      `}</style>
    </main>
  );
}

export default Inicio;