import React, { useState } from "react";
import { supabase } from "../lib/supabase";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";function Desabafar({ irPara }) {

  const [texto, setTexto] = useState("");
  const [analisando, setAnalisando] = useState(false);

  // =====================================
  // AMBIENTE
  // =====================================

  const ambiente =
    localStorage.getItem("pulsanAmbiente") || "escola";


  // =====================================
  // FILTRO DE PALAVRAS OFENSIVAS
  // =====================================

  const palavrasOfensivas = [
    "idiota",
    "imbecil",
    "burro",
    "burra",
    "burro demais",
    "burra demais",
    "otario",
    "otaria",
    "otário",
    "otária",
    "retardado",
    "retardada",
    "retardado mental",
    "retardada mental",
    "babaca",
    "besta",
    "cretino",
    "cretina",
    "canalha",
    "patife",
    "inutil",
    "inútil",
    "incompetente",
    "idiota completo",
    "idiota completa",
    "palhaco",
    "palhaço",
    "palhaca",
    "palhaça",
    "otario de merda",
    "otária de merda",
    "sem noção",
    "sem nocao",
    "animal",
    "verme",
    "lixo",
    "fracassado",
    "fracassada",
    "ridiculo",
    "ridículo",
    "ridicula",
    "ridícula",
    "nojento",
    "nojenta",
    "asqueroso",
    "asquerosa",
    "repugnante",
    "desgraçado",
    "desgracado",
    "desgraçada",
    "desgracada",
    "maldito",
    "maldita",
    "miseravel",
    "miserável",
    "safado",
    "safada",
    "sacana",
    "vagabundo",
    "vagabunda",
    "moleque",
    "moleca",

    "merda",
    "merdinha",
    "merdao",
    "merdão",
    "porra",
    "porrinha",
    "caralho",
    "caralhinho",
    "cacete",
    "caceteiro",
    "caceteira",
    "foda",
    "foda-se",
    "fodase",
    "foder",
    "fudê",
    "fude",
    "fuder",
    "fudido",
    "fudida",
    "fodido",
    "fodida",
    "fucking",
    "fuck",
    "shit",
    "bosta",
    "bostinha",
    "bostao",
    "bostão",
    "cu",
    "cuzinho",
    "cuzão",
    "cuzao",
    "cuzona",
    "buceta",
    "bucetinha",
    "bucetao",
    "bucetão",
    "xota",
    "xoxota",
    "xoxotinha",
    "pica",
    "picao",
    "picão",
    "piroca",
    "piroquinha",
    "rola",
    "rolinha",
    "pau no cu",

    "filho da puta",
    "filha da puta",
    "filho de uma puta",
    "filha de uma puta",
    "filho de puta",
    "filha de puta",
    "seu filho da puta",
    "sua filha da puta",
    "seu filho de uma puta",
    "sua filha de uma puta",
    "seu merda",
    "sua merda",
    "seu idiota",
    "sua idiota",
    "seu imbecil",
    "sua imbecil",
    "seu otario",
    "sua otaria",
    "seu otário",
    "sua otária",
    "seu babaca",
    "sua babaca",
    "seu burro",
    "sua burra",
    "seu retardado",
    "sua retardada",
    "seu desgraçado",
    "sua desgraçada",
    "seu desgracado",
    "sua desgracada",
    "seu canalha",
    "sua canalha",
    "seu vagabundo",
    "sua vagabunda",
    "seu lixo",
    "sua lixo",
    "seu verme",
    "sua verme",
    "seu nojento",
    "sua nojenta",

    "vai se foder",
    "vai tomar no cu",
    "vai pro inferno",
    "vai para o inferno",
    "vai à merda",
    "vai a merda",
    "vai pra merda",
    "vai para merda",
    "vai se ferrar",
    "vai se lascar",
    "vai se danar",
    "foda-se você",
    "foda se voce",
    "foda-se voce",
    "foda se você",
    "que se foda",
    "que se dane",
    "que se lasque",
    "que se ferre",
    "puta que pariu",
    "puta que o pariu",
    "filho do caralho",
    "filha do caralho",
    "seu pedaço de merda",
    "sua pedaço de merda",
    "pedaço de merda",
    "pedaco de merda",
    "bando de idiotas",
    "bando de imbecis",
    "bando de babacas",
    "seus idiotas",
    "suas idiotas",
    "seus imbecis",
    "suas imbecis",
    "seus babacas",
    "suas babacas",

    "puta",
    "puto",
    "putinha",
    "putinha de merda",
    "puto de merda",
    "vadia",
    "vadia de merda",
    "vadiazinha",
    "prostituta de merda",
    "prostituto de merda",
    "piranha",
    "piranha de merda",
    "piranha velha",
    "cachorra",
    "cachorro de merda",
    "cachorra de merda",
    "galinha",
    "galinha de merda",

    "tomar no cu",
    "tomou no cu",
    "toma no cu",
    "vai tomar no cu",
    "enfia no cu",
    "enfia isso no cu",
    "enfia essa merda",
    "enfia essa porra",
    "enfia isso",
    "chupa",
    "chupa meu pau",
    "chupa essa",
    "chupa essa porra",
    "vai chupar",
    "vai chupar o dedo",
    "lambe meu",
    "se foder",
    "se fode",
    "foda se",
    "foda voce",
    "foda você",

    "vou te matar",
    "eu vou te matar",
    "quero te matar",
    "vou acabar com voce",
    "vou acabar com você",
    "vou acabar contigo",
    "quero acabar contigo",
    "vou te pegar",
    "vou te arrebentar",
    "vou te bater",
    "vou bater em voce",
    "vou bater em você",
    "vou te espancar",
    "vou quebrar sua cara",
    "quebrar sua cara",
    "vou acabar com sua vida",
    "acabar com sua vida",
    "merece morrer",
    "você merece morrer",
    "voce merece morrer",
    "tomara que morra",
    "tomara que voce morra",
    "tomara que você morra",
    "vai morrer",
    "vou fazer voce sofrer",
    "vou fazer você sofrer",

    "lixo humano",
    "ser humano lixo",
    "escoria",
    "escória",
    "escoria humana",
    "escória humana",
    "sem vergonha",
    "sem-vergonha",
    "cara de pau",
    "cara de merda",
    "mente de merda",
    "vida de merda",
    "trabalho de merda",
    "escola de merda",
    "empresa de merda",
    "professor de merda",
    "professora de merda",
    "aluno de merda",
    "aluna de merda",
    "colega de merda",
    "amigo de merda",
    "amiga de merda",

    "fdp",
    "f d p",
    "f.d.p",
    "vsf",
    "vai tomar no c",
    "vtc",
    "vtnc",
    "pqp",
    "p q p",
    "p.q.p",
    "tnc",
    "toma no c",
    "seu fdp",
    "sua fdp",
    "seu f d p",
    "sua f d p",
    "filho duma puta",
    "filha duma puta",
    "filho duma p",
    "filha duma p",
    "fdp de merda",
    "idiota de merda",
    "imbecil de merda",
    "babaca de merda",
    "otario de merda",
    "otária de merda",
    "burro de merda",
    "burra de merda",
    "retardado de merda",
    "retardada de merda",
  ];


  // =====================================
  // NORMALIZAR TEXTO
  // =====================================

  function normalizarTexto(conteudo) {
    return conteudo
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[0-9]/g, (numero) => {
        const mapa = {
          "0": "o",
          "1": "i",
          "2": "z",
          "3": "e",
          "4": "a",
          "5": "s",
          "6": "g",
          "7": "t",
          "8": "b",
          "9": "g",
        };

        return mapa[numero] || numero;
      })
      .replace(/[@!$]/g, (simbolo) => {
        const mapa = {
          "@": "a",
          "!": "i",
          "$": "s",
        };

        return mapa[simbolo] || simbolo;
      })
      .replace(/[.,!?;:()[\]{}"'`´~^_*+=<>/@#$%&|\\-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }


  // =====================================
  // VERIFICAR PALAVRAS OFENSIVAS
  // =====================================

  function possuiPalavraOfensiva(conteudo) {
    const textoNormalizado =
      normalizarTexto(conteudo);

    return palavrasOfensivas.some((palavra) => {
      const palavraNormalizada =
        normalizarTexto(palavra);

      if (!palavraNormalizada) {
        return false;
      }

      if (palavraNormalizada.includes(" ")) {
        return textoNormalizado.includes(
          palavraNormalizada
        );
      }

      const regex = new RegExp(
        `(^|\\s)${palavraNormalizada}(?=\\s|$)`,
        "i"
      );

      return regex.test(textoNormalizado);
    });
  }


  // =====================================
  // PUBLICAR DESABAFO
  // =====================================

  async function publicarDesabafo(e) {
    e.preventDefault();

    const conteudo = texto.trim();

    if (!conteudo) {
      alert("Escreva algo antes de publicar.");
      return;
    }


    // ===================================
    // FILTRO LOCAL
    // ===================================

    if (possuiPalavraOfensiva(conteudo)) {
      alert(
        "Seu desabafo contém linguagem inadequada.\n\n" +
        "Por favor, revise o texto antes de publicar. 💚"
      );

      return;
    }


    setAnalisando(true);


    try {
      let classificacao = "normal";
      let alerta = false;

      // =================================
      // RESULTADO DA IA
      // =================================

      let resultadoIA = null;


      // =================================
      // ESCOLA
      // =================================

      if (ambiente === "escola") {
        try {
          const resposta =
            await fetch(
              `${API_URL}/api/analisar-desabafo`,
              {
                method: "POST",

                headers: {
                  "Content-Type":
                    "application/json",
                },

                body: JSON.stringify({
                  texto: conteudo,
                  ambiente: "escola",
                }),
              }
            );


          if (resposta.ok) {
            resultadoIA =
              await resposta.json();


            // =================================
            // MODERAÇÃO DO SERVIDOR
            // =================================

            if (
              resultadoIA.publicarPermitido ===
              false
            ) {
              alert(
                resultadoIA.motivoModeracao ||
                  "Seu desabafo contém linguagem ofensiva ou inadequada. Revise o texto antes de publicar."
              );

              return;
            }


            // =================================
            // CLASSIFICAÇÃO
            // =================================

            if (
              resultadoIA.classificacao ===
              "urgente"
            ) {
              classificacao = "urgente";
              alerta = true;

            } else if (
              resultadoIA.classificacao ===
              "grave"
            ) {
              classificacao = "grave";
              alerta = true;

            } else if (
              resultadoIA.classificacao ===
              "intermediario"
            ) {
              classificacao = "intermediario";
              alerta = true;

            } else {
              classificacao = "normal";
              alerta = false;
            }
          }

        } catch (erro) {
          console.error(
            "Erro na análise da IA:",
            erro
          );

          classificacao = "normal";
          alerta = false;
        }
      }


      // =================================
      // EMPRESA
      // =================================

      if (ambiente === "empresa") {
        classificacao = "normal";
        alerta = false;
      }


      // =================================
      // PUBLICAÇÕES EXISTENTES
      // =================================

      const publicacoes =
        JSON.parse(
          localStorage.getItem(
            "pulsanPublicacoes"
          )
        ) || [];


      // =================================
      // NOVA PUBLICAÇÃO
      // =================================

    // =====================================
// USUÁRIO AUTENTICADO
// =====================================

const {
  data: usuarioAutenticado,
  error: erroUsuario,
} = await supabase.auth.getUser();

if (
  erroUsuario ||
  !usuarioAutenticado?.user
) {
  alert("Faça login para publicar seu desabafo.");
  return;
}

const usuarioId =
  usuarioAutenticado.user.id;

// A coluna urgencia aceita apenas: normal, importante ou urgente.
// A classificação da IA pode ser normal, intermediario ou grave,
// portanto não enviamos a classificação diretamente para urgencia.
const urgenciaBanco =
  classificacao === "urgente" || classificacao === "grave"
    ? "urgente"
    : classificacao === "intermediario"
      ? "importante"
      : "normal";


// =====================================
// SALVAR NO SUPABASE
// =====================================

// A tabela atual de posts_ambiente não possui a coluna "ativo".
// Também normalizamos "prioridade" para a mesma escala aceita em
// "urgencia": normal, importante ou urgente.
const prioridadeBanco = urgenciaBanco;

const payloadPublicacao = {
  usuario_id: usuarioId,
  texto: conteudo,
  ambiente: ambiente,
  classificacao: classificacao,
  alerta: Boolean(alerta),
  nome_usuario: "Anônimo",
  prioridade: prioridadeBanco,
  categoria: ambiente,
  urgencia: urgenciaBanco,
};

let publicacaoBanco = null;

const resultadoInsercao = await supabase
  .from("posts_ambiente")
  .insert(payloadPublicacao);

if (resultadoInsercao.error) {
  console.error(
    "Erro ao salvar desabafo completo no Supabase:",
    resultadoInsercao.error
  );

  // Segunda tentativa com somente os campos básicos da tabela.
  // Isso evita que uma restrição adicional de alguma coluna opcional
  // impeça a publicação do desabafo.
  const tentativaBasica = await supabase
    .from("posts_ambiente")
    .insert({
      usuario_id: usuarioId,
      texto: conteudo,
      nome_usuario: "Anônimo",
    })
    .select("id, usuario_id, texto, criado_em")
    .single();

  if (tentativaBasica.error) {
    console.error(
      "Erro ao salvar desabafo básico no Supabase:",
      tentativaBasica.error
    );

    alert(
      tentativaBasica.error?.message
        ? `Não foi possível publicar agora.\n\n${tentativaBasica.error.message}`
        : "Não foi possível publicar agora. Tente novamente."
    );

    return;
  }

  publicacaoBanco = tentativaBasica.data;
} else {
  // O INSERT foi concluído. Não exigimos SELECT no primeiro caminho,
  // pois a política de leitura pode ser diferente da de inserção.
  publicacaoBanco = null;
}

// =====================================
// NOVA PUBLICAÇÃO LOCAL
// =====================================

const novaPublicacao = {
  id: publicacaoBanco?.id || `local-${Date.now()}`,

  texto: conteudo,

  autor: "Anônimo",

  hora: "Agora",

  ambiente: ambiente,

  classificacao: classificacao,

  alerta: alerta,

  apoios: 0,

  apoiado: false,

  comentarios: [],
};


      // =================================
      // SALVAR PUBLICAÇÃO
      // =================================

      localStorage.setItem(
        "pulsanPublicacoes",
        JSON.stringify([
          novaPublicacao,
          ...publicacoes,
        ])
      );


      // =====================================
      // ALERTA REAL
      // =====================================
      //
      // O backend já cria o alerta no
      // Supabase durante a análise.
      //
      // Aqui apenas garantimos que a resposta
      // da IA foi recebida e registrada.
      //

      if (
        ambiente === "escola" &&
        alerta &&
        resultadoIA
      ) {
        console.log(
          "🔔 Alerta real processado:",
          {
            classificacao:
              resultadoIA.classificacao,

            prioridade:
              resultadoIA.prioridade,

            tipo:
              resultadoIA.tipo,

            motivo:
              resultadoIA.motivo,
          }
        );
      }


      // =====================================
      // ALERTA LOCAL
      // =====================================

      if (
        ambiente === "escola" &&
        classificacao ===
          "intermediario"
      ) {
        localStorage.setItem(
          "pulsanNovoAlerta",
          "true"
        );

        localStorage.setItem(
          "pulsanTipoAlerta",
          "intermediario"
        );

        localStorage.setItem(
          "pulsanAlertaPublicacao",
          JSON.stringify(
            novaPublicacao
          )
        );
      }


      if (
        ambiente === "escola" &&
        classificacao ===
          "grave"
      ) {
        localStorage.setItem(
          "pulsanNovoAlerta",
          "true"
        );

        localStorage.setItem(
          "pulsanTipoAlerta",
          "grave"
        );

        localStorage.setItem(
          "pulsanAlertaPublicacao",
          JSON.stringify(
            novaPublicacao
          )
        );
      }


      if (
        ambiente === "escola" &&
        classificacao ===
          "urgente"
      ) {
        localStorage.setItem(
          "pulsanNovoAlerta",
          "true"
        );

        localStorage.setItem(
          "pulsanTipoAlerta",
          "urgente"
        );

        localStorage.setItem(
          "pulsanAlertaPublicacao",
          JSON.stringify(
            novaPublicacao
          )
        );
      }


      // =====================================
      // LIMPAR
      // =====================================

      setTexto("");


      // =====================================
      // MENSAGEM PARA O USUÁRIO
      // =====================================

      if (
        ambiente === "escola" &&
        classificacao ===
          "urgente"
      ) {
        alert(
          "Seu desabafo foi publicado. 💚\n\n" +
          "Nossa equipe poderá acompanhar a situação."
        );

      } else if (
        ambiente === "escola" &&
        classificacao ===
          "grave"
      ) {
        alert(
          "Seu desabafo foi publicado. 💚\n\n" +
          "Nossa equipe poderá acompanhar a situação."
        );

      } else if (
        ambiente === "escola" &&
        classificacao ===
          "intermediario"
      ) {
        alert(
          "Seu desabafo foi publicado. 💚\n\n" +
          "Ele poderá receber atenção adicional."
        );

      } else {
        alert(
          "Seu desabafo foi publicado anonimamente. 💚"
        );
      }


      // =====================================
      // VOLTAR
      // =====================================

      irPara("ambiente");

    } finally {
      setAnalisando(false);
    }
  }


  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#fffdf9",
        fontFamily:
          "Arial, Helvetica, sans-serif",
        paddingBottom: "100px",
        boxSizing: "border-box",
      }}
    >

      {/* =====================================
          CABEÇALHO
      ===================================== */}

      <header
        style={{
          width: "100%",
          background: "#f7dcd0",
          padding: "18px 35px",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          gap: "15px",
        }}
      >

        <button
          type="button"
          onClick={() =>
            irPara("ambiente")
          }
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            border: "none",
            background: "#ffffff",
            fontSize: "22px",
            cursor: "pointer",
          }}
        >
          ←
        </button>


        <div>

          <strong
            style={{
              fontSize: "22px",
              color: "#173b38",
            }}
          >
            PULSAN
          </strong>


          <div
            style={{
              fontSize: "14px",
              color: "#777",
              marginTop: "3px",
            }}
          >
            Um espaço seguro para falar
          </div>

        </div>

      </header>


      {/* =====================================
          CONTEÚDO
      ===================================== */}

      <main
        style={{
          width: "100%",
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "45px 30px",
          boxSizing: "border-box",
        }}
      >

        <h1
          style={{
            fontSize: "34px",
            color: "#172c35",
            margin:
              "0 0 10px",
          }}
        >
          O que está sendo compartilhado
        </h1>


        <p
          style={{
            fontSize: "17px",
            color: "#777",
            marginBottom: "30px",
          }}
        >
          Conte o que está acontecendo.
          Você não precisa se identificar.
        </p>


        {/* =====================================
            IDENTIDADE
        ===================================== */}

        <div
          style={{
            display:
              "inline-flex",
            alignItems:
              "center",
            gap: "8px",
            background:
              "#eef4f3",
            padding:
              "10px 18px",
            borderRadius:
              "12px",
            color:
              "#173b38",
            fontWeight:
              "700",
            marginBottom:
              "15px",
          }}
        >
          👤 ANÔNIMO
        </div>


        {/* =====================================
            FORMULÁRIO
        ===================================== */}

        <form
          onSubmit={publicarDesabafo}
        >

          <div
            style={{
              background:
                "#ffffff",
              border:
                "1px solid #e5e5e5",
              borderRadius:
                "18px",
              overflow:
                "hidden",
              boxShadow:
                "0 5px 20px rgba(0,0,0,0.04)",
            }}
          >

            <textarea
              value={texto}
              onChange={(e) =>
                setTexto(
                  e.target.value
                )
              }
              placeholder="Fale sobre o que está acontecendo. Você pode desabafar, pedir apoio ou contar como está se sentindo..."
              maxLength={1000}
              disabled={analisando}
              style={{
                width: "100%",
                minHeight: "300px",
                border: "none",
                outline: "none",
                resize: "vertical",
                padding: "25px",
                boxSizing:
                  "border-box",
                fontSize: "17px",
                fontFamily:
                  "Arial, Helvetica, sans-serif",
                color: "#333",
                opacity:
                  analisando
                    ? 0.6
                    : 1,
              }}
            />


            <div
              style={{
                padding:
                  "12px 20px",
                textAlign:
                  "right",
                color: "#888",
                fontSize:
                  "13px",
                borderTop:
                  "1px solid #eeeeee",
              }}
            >
              {texto.length}/1000
            </div>

          </div>


          {/* =====================================
              AVISO
          ===================================== */}

          <div
            style={{
              marginTop: "18px",
              color: "#777",
              fontSize: "14px",
            }}
          >
            🔒 Sua identidade permanece
            anônima.
          </div>


          {/* =====================================
              INFORMAÇÃO DO AMBIENTE
          ===================================== */}

          {ambiente ===
            "escola" ? (

            <div
              style={{
                marginTop:
                  "12px",
                padding:
                  "12px 15px",
                background:
                  "#f0faf8",
                border:
                  "1px solid #dceeea",
                borderRadius:
                  "10px",
                color:
                  "#168f92",
                fontSize:
                  "13px",
              }}
            >
              🏫 Este ambiente utiliza
              moderação de linguagem e
              análise contextual para
              ajudar a identificar situações
              que podem precisar de atenção.
            </div>

          ) : (

            <div
              style={{
                marginTop:
                  "12px",
                padding:
                  "12px 15px",
                background:
                  "#f5f5f5",
                border:
                  "1px solid #e5e5e5",
                borderRadius:
                  "10px",
                color:
                  "#666",
                fontSize:
                  "13px",
              }}
            >
              🏢 Este ambiente utiliza
              moderação de linguagem para
              manter as conversas respeitosas.
            </div>

          )}


          {/* =====================================
              PUBLICAR
          ===================================== */}

          <button
            type="submit"
            disabled={analisando}
            style={{
              marginTop:
                "18px",
              border:
                "none",
              background:
                analisando
                  ? "#9ad7d8"
                  : "#20adb0",
              color:
                "#ffffff",
              padding:
                "15px 28px",
              borderRadius:
                "12px",
              fontSize:
                "16px",
              fontWeight:
                "700",
              cursor:
                analisando
                  ? "wait"
                  : "pointer",
            }}
          >
            {analisando
              ? "🤖 Analisando..."
              : "💬 Publicar anonimamente"}
          </button>

        </form>

      </main>


      {/* =====================================
          BARRA INFERIOR
      ===================================== */}

      <nav
        style={{
          position:
            "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: "82px",
          background:
            "#ffffff",
          borderTop:
            "1px solid #e5e5e5",
          display:
            "flex",
          justifyContent:
            "space-around",
          alignItems:
            "center",
          zIndex: 1000,
          boxShadow:
            "0 -3px 15px rgba(0,0,0,0.04)",
        }}
      >

        {/* CONVERSAS */}

        <button
          type="button"
          onClick={() =>
            irPara(
              "solicitacoes"
            )
          }
          style={{
            border:
              "none",
            background:
              "transparent",
            cursor:
              "pointer",
            display:
              "flex",
            flexDirection:
              "column",
            alignItems:
              "center",
            gap: "5px",
            color:
              "#777",
            fontSize:
              "13px",
            fontWeight:
              "600",
          }}
        >

          <span
            style={{
              fontSize:
                "25px",
            }}
          >
            💬
          </span>

          <span>
            Conversas
          </span>

        </button>


        {/* AJUDAR */}

        <button
          type="button"
          onClick={() =>
            irPara("ajudar")
          }
          style={{
            border:
              "none",
            background:
              "transparent",
            cursor:
              "pointer",
            display:
              "flex",
            flexDirection:
              "column",
            alignItems:
              "center",
            gap: "5px",
            color:
              "#20adb0",
            fontSize:
              "13px",
            fontWeight:
              "600",
          }}
        >

          <span
            style={{
              fontSize:
                "25px",
            }}
          >
            💚
          </span>

          <span>
            Ajudar
          </span>

        </button>


        {/* PERFIL */}

        <button
          type="button"
          onClick={() =>
            irPara("perfil")
          }
          style={{
            border:
              "none",
            background:
              "transparent",
            cursor:
              "pointer",
            display:
              "flex",
            flexDirection:
              "column",
            alignItems:
              "center",
            gap: "5px",
            color:
              "#777",
            fontSize:
              "13px",
            fontWeight:
              "600",
          }}
        >

          <span
            style={{
              fontSize:
                "25px",
            }}
          >
            👤
          </span>

          <span>
            Perfil
          </span>

        </button>

      </nav>

    </div>
  );
}

export default Desabafar;
