import React, { useState } from "react";

function SolicitarAjuda({ irPara }) {
  const [motivo, setMotivo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [urgencia, setUrgencia] = useState("normal");

  function enviarSolicitacao(e) {
    e.preventDefault();

    if (!categoria) {
      alert("Selecione o tipo de ajuda que você precisa.");
      return;
    }

    if (!motivo.trim()) {
      alert("Conte um pouco sobre o que está acontecendo.");
      return;
    }

    alert(
      "Sua solicitação foi enviada de forma anônima. 💚"
    );

    setMotivo("");
    setCategoria("");
    setUrgencia("normal");

    irPara("solicitacoes");
  }

  return (
    <main className="solicitar-ajuda-page">

      {/* CABEÇALHO */}

      <header className="solicitar-ajuda-header">

        <button
          type="button"
          className="solicitar-ajuda-voltar"
          onClick={() => irPara("ambiente")}
        >
          ←
        </button>

        <div className="solicitar-ajuda-brand">

          <img
            src="/logo.png"
            alt="Logo Pulsan"
          />

          <div>
            <strong>PULSAN</strong>
            <span>Pedir ajuda</span>
          </div>

        </div>

        <span className="solicitar-ajuda-lock">
          🔒
        </span>

      </header>


      {/* CONTEÚDO */}

      <section className="solicitar-ajuda-container">

        {/* INTRODUÇÃO */}

        <div className="solicitar-ajuda-intro">

          <div className="solicitar-ajuda-icon">
            🫶
          </div>

          <span className="solicitar-ajuda-label">
            ESPAÇO SEGURO
          </span>

          <h1>
            Você precisa de ajuda?
          </h1>

          <p>
            Conte o que está acontecendo. Sua solicitação
            será enviada de forma anônima.
          </p>

        </div>


        {/* AVISO */}

        <div className="solicitar-ajuda-aviso">

          <span>
            🔒
          </span>

          <div>

            <strong>
              Sua identidade está protegida
            </strong>

            <p>
              Outras pessoas verão apenas sua solicitação,
              sem seu nome ou informações pessoais.
            </p>

          </div>

        </div>


        {/* FORMULÁRIO */}

        <form
          className="solicitar-ajuda-form"
          onSubmit={enviarSolicitacao}
        >

          {/* CATEGORIA */}

          <div className="solicitar-ajuda-grupo">

            <label htmlFor="categoria">
              Que tipo de ajuda você precisa?
            </label>

            <select
              id="categoria"
              value={categoria}
              onChange={(e) =>
                setCategoria(e.target.value)
              }
            >

              <option value="">
                Selecione uma opção
              </option>

              <option value="conversa">
                💬 Preciso conversar
              </option>

              <option value="bullying">
                🏫 Estou sofrendo bullying
              </option>

              <option value="conflito">
                🤝 Estou passando por um conflito
              </option>

              <option value="familia">
                🏠 Tenho problemas familiares
              </option>

              <option value="emocional">
                💚 Não estou me sentindo bem
              </option>

              <option value="outro">
                💭 Outro motivo
              </option>

            </select>

          </div>


          {/* URGÊNCIA */}

          <div className="solicitar-ajuda-grupo">

            <label>
              Como você considera a situação?
            </label>

            <div className="urgencia-opcoes">

              <button
                type="button"
                className={
                  urgencia === "normal"
                    ? "urgencia-opcao selecionada"
                    : "urgencia-opcao"
                }
                onClick={() =>
                  setUrgencia("normal")
                }
              >
                <span>🟢</span>

                <div>
                  <strong>
                    Posso conversar
                  </strong>

                  <small>
                    Não é urgente.
                  </small>
                </div>

              </button>


              <button
                type="button"
                className={
                  urgencia === "importante"
                    ? "urgencia-opcao selecionada"
                    : "urgencia-opcao"
                }
                onClick={() =>
                  setUrgencia("importante")
                }
              >
                <span>🟡</span>

                <div>
                  <strong>
                    Preciso de atenção
                  </strong>

                  <small>
                    Gostaria de receber apoio em breve.
                  </small>
                </div>

              </button>


              <button
                type="button"
                className={
                  urgencia === "urgente"
                    ? "urgencia-opcao selecionada"
                    : "urgencia-opcao"
                }
                onClick={() =>
                  setUrgencia("urgente")
                }
              >
                <span>🔴</span>

                <div>
                  <strong>
                    Situação urgente
                  </strong>

                  <small>
                    Preciso de ajuda o quanto antes.
                  </small>
                </div>

              </button>

            </div>

          </div>


          {/* MOTIVO */}

          <div className="solicitar-ajuda-grupo">

            <label htmlFor="motivo">
              Conte o que está acontecendo
            </label>

            <textarea
              id="motivo"
              value={motivo}
              onChange={(e) =>
                setMotivo(e.target.value)
              }
              placeholder="Escreva o que você gostaria que alguém soubesse. Não precisa escrever tudo de uma vez..."
              maxLength={1000}
            />

            <div className="solicitar-ajuda-contador">
              <span>
                🔒 Anônimo
              </span>

              <span>
                {motivo.length}/1000
              </span>
            </div>

          </div>


          {/* BOTÃO */}

          <button
            type="submit"
            className="solicitar-ajuda-button"
          >
            💚 Enviar solicitação de ajuda
          </button>

        </form>


        {/* FRASE DE ACOLHIMENTO */}

        <div className="solicitar-ajuda-acolhimento">

          <div>
            🫶
          </div>

          <section>

            <strong>
              Pedir ajuda é um ato de coragem.
            </strong>

            <p>
              Você não precisa enfrentar uma situação
              difícil sozinho.
            </p>

          </section>

        </div>


        {/* VOLTAR */}

        <button
          type="button"
          className="solicitar-ajuda-voltar-button"
          onClick={() => irPara("ambiente")}
        >
          ← Voltar para o ambiente
        </button>

      </section>

    </main>
  );
}

export default SolicitarAjuda;