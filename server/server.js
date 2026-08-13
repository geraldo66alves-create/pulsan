import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/analisar", async (req, res) => {
  try {
    const { mensagem } = req.body;

    if (!mensagem || !mensagem.trim()) {
      return res.status(400).json({
        erro: "Mensagem vazia.",
      });
    }

    // Verificação de conteúdo ofensivo ou perigoso
    const moderacao = await client.moderations.create({
      model: "omni-moderation-latest",
      input: mensagem,
    });

    const resultadoModeracao = moderacao.results[0];

    if (resultadoModeracao.flagged) {
      return res.json({
        permitido: false,
        nivel: "BLOQUEADO",
        mensagem:
          "Sua mensagem contém conteúdo que não pode ser publicado dessa forma.",
      });
    }

    // Análise da situação escolar
    const resposta = await client.responses.create({
      model: "gpt-5",
      instructions: `
Você é o sistema de análise de segurança do Pulsan.

O Pulsan é uma plataforma de apoio emocional anônimo para estudantes.

Analise a mensagem e classifique a situação em apenas uma destas categorias:

NORMAL
Situação que pode ser acolhida pela comunidade.

ATENÇÃO
Situação preocupante que merece acompanhamento.

URGENTE
Situação que pode envolver risco sério à pessoa ou a outra pessoa e precisa de encaminhamento rápido para um adulto responsável ou profissional adequado.

IMPORTANTE:
- Não faça diagnóstico psicológico.
- Não acuse a pessoa.
- Não tente descobrir a identidade do usuário.
- Não substitua um psicólogo, responsável ou serviço de emergência.
- Apenas identifique o nível de atenção necessário.

Responda neste formato:

NIVEL: NORMAL, ATENÇÃO ou URGENTE
MOTIVO: explicação curta
AÇÃO: orientação curta sobre o próximo encaminhamento
      `,
      input: mensagem,
    });

    return res.json({
      permitido: true,
      analise: resposta.output_text,
    });
  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      erro: "Não foi possível analisar a mensagem.",
    });
  }
});

app.listen(3001, () => {
  console.log("Servidor do Pulsan rodando em http://localhost:3001");
});