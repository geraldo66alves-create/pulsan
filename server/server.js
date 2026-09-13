import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createClient } from "@supabase/supabase-js";

dotenv.config({
  path: "../.env.local",
});

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const PORT = process.env.PORT || 3001;
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// =====================================================
// GEMINI
// =====================================================

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY não encontrada no .env.local");
}

const client = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// =====================================================
// SUPABASE
// =====================================================

const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL;

const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

let supabaseAdmin = null;

if (
  SUPABASE_URL &&
  SUPABASE_SERVICE_ROLE_KEY
) {
  supabaseAdmin = createClient(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  console.log("✅ Supabase administrativo conectado.");
} else {
  console.warn(
    "⚠️ SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não encontrada."
  );

  console.warn(
    "⚠️ A IA continuará funcionando, mas os alertas não serão salvos."
  );
}

// =====================================================
// CONFIGURAÇÃO DA IA
// =====================================================

const MODELO_IA = "gemini-3.5-flash-lite";

// =====================================================
// CLASSIFICAÇÃO DO PULSAN
// =====================================================

const classificacaoSchema = {
  type: Type.OBJECT,

  properties: {
    classificacao: {
      type: Type.STRING,
      enum: [
        "normal",
        "intermediario",
        "grave",
        "urgente",
      ],
    },

    tipoSituacao: {
      type: Type.STRING,
      enum: [
        "nenhum",
        "sofrimento_emocional",
        "conflito",
        "bullying",
        "cyberbullying",
        "assedio",
        "ameaca",
        "violencia",
        "discriminacao",
        "perseguicao",
        "automutilacao",
        "risco_suicida",
        "risco_a_outra_pessoa",
        "outro",
      ],
    },

    motivo: {
      type: Type.STRING,
    },

    alerta: {
      type: Type.BOOLEAN,
    },

    prioridadeAlerta: {
      type: Type.STRING,
      enum: [
        "nenhuma",
        "baixa",
        "media",
        "alta",
        "critica",
      ],
    },

    ambienteEscolar: {
      type: Type.BOOLEAN,
    },

    conteudoOfensivo: {
      type: Type.BOOLEAN,
    },

    categoriaOfensa: {
      type: Type.STRING,
      enum: [
        "nenhuma",
        "palavrao",
        "insulto",
        "odio",
        "assedio_verbal",
        "ameaca",
        "outro",
      ],
    },

    publicarPermitido: {
      type: Type.BOOLEAN,
    },

    motivoModeracao: {
      type: Type.STRING,
    },
  },

  required: [
    "classificacao",
    "tipoSituacao",
    "motivo",
    "alerta",
    "prioridadeAlerta",
    "ambienteEscolar",
    "conteudoOfensivo",
    "categoriaOfensa",
    "publicarPermitido",
    "motivoModeracao",
  ],
};

// =====================================================
// CRIAR ALERTA NO SUPABASE
// =====================================================

async function criarAlertaPulsan(
  texto,
  resultado,
  ambiente
) {
  if (!supabaseAdmin) {
    console.warn(
      "⚠️ Alerta não salvo: Supabase administrativo não configurado."
    );

    return {
      criado: false,
      motivo: "supabase_nao_configurado",
    };
  }

  if (
    resultado.classificacao === "normal"
  ) {
    return {
      criado: false,
      motivo: "classificacao_normal",
    };
  }

  const dadosAlerta = {
    publicacao_id: null,

    classificacao:
      resultado.classificacao,

    tipo_situacao:
      resultado.tipoSituacao,

    motivo:
      resultado.motivo || "",

    prioridade:
      resultado.prioridadeAlerta,

    ambiente:
      ambiente || "geral",

    resolvido: false,

    texto:
      texto.trim(),
  };

  const {
    data: alerta,
    error: erroAlerta,
  } = await supabaseAdmin
    .from("alertas_ia")
    .insert(dadosAlerta)
    .select("id")
    .single();

  if (erroAlerta) {
    console.error(
      "❌ Erro ao criar alerta:",
      erroAlerta
    );

    throw new Error(
      "Não foi possível registrar o alerta."
    );
  }

  const alertaId = alerta.id;

  console.log(
    `🚨 Alerta #${alertaId} criado: ${resultado.classificacao} / ${resultado.prioridadeAlerta}`
  );

  const {
    data: psicologos,
    error: erroPsicologos,
  } = await supabaseAdmin
    .from("psicologos")
    .select("id")
    .eq("ativo", true)
    .eq("verificado", true);

  if (erroPsicologos) {
    console.error(
      "❌ Erro ao buscar psicólogos:",
      erroPsicologos
    );
  }

  const {
    data: equipe,
    error: erroEquipe,
  } = await supabaseAdmin
    .from("equipe_pulsan")
    .select("id")
    .eq("ativo", true);

  if (erroEquipe) {
    console.error(
      "❌ Erro ao buscar equipe Pulsan:",
      erroEquipe
    );
  }

  let responsaveisEscola = [];

  if (resultado.ambienteEscolar) {
    const {
      data,
      error,
    } = await supabaseAdmin
      .from("responsaveis_escola")
      .select("id")
      .eq("ativo", true)
      .eq("autorizado_alertas", true);

    if (error) {
      console.error(
        "❌ Erro ao buscar responsáveis da escola:",
        error
      );
    }

    responsaveisEscola = data || [];
  }

  const destinatarios = [];

  for (const psicologo of psicologos || []) {
    destinatarios.push({
      alerta_id: alertaId,
      psicologo_id: psicologo.id,
      equipe_id: null,
      responsavel_escola_id: null,
      recebido: false,
      visualizado: false,
    });
  }

  for (const membro of equipe || []) {
    destinatarios.push({
      alerta_id: alertaId,
      psicologo_id: null,
      equipe_id: membro.id,
      responsavel_escola_id: null,
      recebido: false,
      visualizado: false,
    });
  }

  if (
    resultado.ambienteEscolar &&
    resultado.classificacao === "urgente"
  ) {
    for (
      const responsavel of responsaveisEscola
    ) {
      destinatarios.push({
        alerta_id: alertaId,
        psicologo_id: null,
        equipe_id: null,
        responsavel_escola_id:
          responsavel.id,
        recebido: false,
        visualizado: false,
      });
    }
  }

  if (destinatarios.length > 0) {
    const {
      error: erroDestinatarios,
    } = await supabaseAdmin
      .from("destinatarios_alerta")
      .insert(destinatarios);

    if (erroDestinatarios) {
      console.error(
        "❌ Erro ao criar destinatários:",
        erroDestinatarios
      );
    } else {
      console.log(
        `📨 ${destinatarios.length} destinatário(s) receberam o alerta interno.`
      );
    }
  } else {
    console.warn(
      "⚠️ Alerta criado, mas nenhum destinatário está cadastrado."
    );
  }

  return {
    criado: true,
    alertaId,
    quantidadeDestinatarios:
      destinatarios.length,
  };
}

// =====================================================
// ANALISAR CONTEÚDO
// =====================================================

async function analisarConteudo(
  texto,
  ambiente = "geral",
  tipo = "desabafo"
) {
  if (!texto || typeof texto !== "string") {
    throw new Error("Texto inválido.");
  }

  const textoSeguro = texto
    .trim()
    .slice(0, 5000);

  const ambienteNormalizado =
    String(ambiente).toLowerCase();

  const ehEscolar =
    ambienteNormalizado.includes("escola") ||
    ambienteNormalizado.includes("escolar");

  const instrucoes = `
Você é o sistema de triagem e segurança do Pulsan.

Sua função é analisar mensagens enviadas pelos usuários e identificar:
1. situações que merecem atenção humana;
2. linguagem ofensiva que não deve ser publicada.

Você NÃO é psicólogo.
Você NÃO deve diagnosticar doenças.
Você NÃO deve inventar informações.
Você NÃO deve revelar ou tentar descobrir a identidade da pessoa.

AMBIENTE:
${ambiente}

TIPO:
${tipo}

REGRAS DE CLASSIFICAÇÃO:

NORMAL
- conversa comum;
- desabafo comum;
- problema cotidiano;
- tristeza ou preocupação sem indicação de risco;
- conflito simples.

INTERMEDIARIO
- sofrimento emocional relevante;
- conflito recorrente;
- exclusão;
- humilhação;
- bullying ou cyberbullying sem risco imediato;
- perseguição preocupante;
- assédio que merece atenção humana.

INTERMEDIÁRIO NÃO É EMERGÊNCIA.

Quando for intermediário:
- deve gerar alerta interno;
- prioridade deve ser "media";
- serve para acompanhamento;
- não deve ser tratado como perigo imediato.

GRAVE
- ameaça;
- violência;
- bullying persistente ou severo;
- assédio grave;
- perseguição séria;
- automutilação mencionada de maneira preocupante;
- risco significativo para a pessoa ou outra pessoa.

Quando for grave:
- deve gerar alerta interno;
- prioridade deve ser "alta".

URGENTE
- perigo imediato;
- ameaça séria e iminente;
- intenção clara de causar dano;
- violência acontecendo ou prestes a acontecer;
- risco suicida imediato;
- risco imediato de alguém ser ferido.

Quando for urgente:
- deve gerar alerta interno;
- prioridade deve ser "critica".

REGRA DE ALERTA:

normal:
alerta = false
prioridadeAlerta = "nenhuma"

intermediario:
alerta = true
prioridadeAlerta = "media"

grave:
alerta = true
prioridadeAlerta = "alta"

urgente:
alerta = true
prioridadeAlerta = "critica"

MODERAÇÃO DE LINGUAGEM:

Você também deve verificar se o próprio autor está usando palavrões, xingamentos ou insultos.

Exemplos que DEVEM ser bloqueados:

"seu filho da puta"
"seu idiota"
"seu imbecil"
"seu babaca"
"vai se foder"
"vai tomar no cu"

Se o próprio autor estiver usando linguagem ofensiva para atacar alguém:

conteudoOfensivo = true
publicarPermitido = false

Use:
categoriaOfensa = "palavrao"
ou
categoriaOfensa = "insulto"

motivoModeracao deve explicar brevemente que a mensagem contém linguagem ofensiva.

IMPORTANTE:

Não bloqueie automaticamente quando a pessoa estiver relatando que foi ofendida.

Exemplo:

"Ele me chamou de filho da puta e eu fiquei muito mal."

Nesse caso, a pessoa está relatando uma situação de ofensa.

Portanto:

conteudoOfensivo = false
publicarPermitido = true
categoriaOfensa = "nenhuma"
motivoModeracao = ""

A moderação é independente da classificação de risco.

Uma mensagem pode ser ofensiva e também representar uma situação grave.

Se não houver ofensa:

conteudoOfensivo = false
categoriaOfensa = "nenhuma"
publicarPermitido = true
motivoModeracao = ""

Se houver ofensa direta feita pelo autor:

conteudoOfensivo = true
publicarPermitido = false

AMBIENTE ESCOLAR:

${
  ehEscolar
    ? `
Este é um ambiente escolar.

Observe especialmente:
- bullying;
- cyberbullying;
- ameaças;
- violência;
- assédio;
- discriminação;
- perseguição;
- automutilação;
- risco de suicídio;
- risco de alguém causar dano a outra pessoa.

Somente situações urgentes podem ser encaminhadas ao responsável escolar autorizado.
`
    : `
Este conteúdo não deve ser tratado automaticamente como situação escolar.
`
}

Não revele dados pessoais.
Não tente identificar a pessoa.
Não invente contexto.

Analise SOMENTE o conteúdo recebido.
`;

  const resposta =
    await client.models.generateContent({
      model: MODELO_IA,
      contents: textoSeguro,
      config: {
        systemInstruction:
          instrucoes,
        responseMimeType:
          "application/json",
        responseSchema:
          classificacaoSchema,
      },
    });

  const textoResposta =
    resposta.text?.trim();

  if (!textoResposta) {
    throw new Error(
      "A IA não retornou uma resposta."
    );
  }

  const resultado =
    JSON.parse(textoResposta);

  const classificacoesPermitidas = [
    "normal",
    "intermediario",
    "grave",
    "urgente",
  ];

  const tiposPermitidos = [
    "nenhum",
    "sofrimento_emocional",
    "conflito",
    "bullying",
    "cyberbullying",
    "assedio",
    "ameaca",
    "violencia",
    "discriminacao",
    "perseguicao",
    "automutilacao",
    "risco_suicida",
    "risco_a_outra_pessoa",
    "outro",
  ];

  if (
    !classificacoesPermitidas.includes(
      resultado.classificacao
    )
  ) {
    throw new Error(
      "Classificação retornada pela IA é inválida."
    );
  }

  if (
    !tiposPermitidos.includes(
      resultado.tipoSituacao
    )
  ) {
    throw new Error(
      "Tipo de situação retornado pela IA é inválido."
    );
  }

  // ===================================================
  // REGRA DEFINITIVA DO SERVIDOR
  // ===================================================

  let deveAlertar = false;
  let prioridade = "nenhuma";

  if (
    resultado.classificacao ===
    "intermediario"
  ) {
    deveAlertar = true;
    prioridade = "media";
  }

  if (
    resultado.classificacao ===
    "grave"
  ) {
    deveAlertar = true;
    prioridade = "alta";
  }

  if (
    resultado.classificacao ===
    "urgente"
  ) {
    deveAlertar = true;
    prioridade = "critica";
  }

  // ===================================================
  // MODERAÇÃO FINAL
  // ===================================================

  const categoriasOfensaPermitidas = [
    "nenhuma",
    "palavrao",
    "insulto",
    "odio",
    "assedio_verbal",
    "ameaca",
    "outro",
  ];

  let conteudoOfensivo =
    Boolean(resultado.conteudoOfensivo);

  let categoriaOfensa =
    categoriasOfensaPermitidas.includes(
      resultado.categoriaOfensa
    )
      ? resultado.categoriaOfensa
      : "nenhuma";

  let publicarPermitido =
    resultado.publicarPermitido !== false;

  let motivoModeracao =
    resultado.motivoModeracao || "";

  // ===================================================
  // PROTEÇÃO EXTRA CONTRA OFENSAS DIRETAS
  // ===================================================

  const textoNormalizado = textoSeguro
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const padroesOfensivosDiretos = [
    /\bfilho(?:s)? da puta\b/,
    /\bfilha da puta\b/,
    /\bfilho de uma puta\b/,
    /\bfilha de uma puta\b/,
    /\bseu merda\b/,
    /\bsua merda\b/,
    /\bseu idiota\b/,
    /\bsua idiota\b/,
    /\bseu imbecil\b/,
    /\bsua imbecil\b/,
    /\bseu otario\b/,
    /\bsua otaria\b/,
    /\bseu babaca\b/,
    /\bsua babaca\b/,
    /\bvai se foder\b/,
    /\bvai tomar no cu\b/,
    /\bputa que pariu\b/,
  ];

  const encontrouOfensaDireta =
    padroesOfensivosDiretos.some(
      (padrao) =>
        padrao.test(textoNormalizado)
    );

  if (encontrouOfensaDireta) {
    conteudoOfensivo = true;
    publicarPermitido = false;
    categoriaOfensa = "palavrao";

    motivoModeracao =
      "A mensagem contém linguagem ofensiva. Revise o texto e tente novamente.";
  }

  if (!conteudoOfensivo) {
    categoriaOfensa = "nenhuma";
    publicarPermitido = true;
    motivoModeracao = "";
  }

  return {
    classificacao:
      resultado.classificacao,

    tipoSituacao:
      resultado.tipoSituacao,

    motivo:
      resultado.motivo || "",

    alerta:
      deveAlertar,

    prioridadeAlerta:
      prioridade,

    ambienteEscolar:
      ehEscolar,

    conteudoOfensivo,

    categoriaOfensa,

    publicarPermitido,

    motivoModeracao,
  };
}

// =====================================================
// DESABAFO
// =====================================================

app.post(
  "/api/analisar-desabafo",
  async (req, res) => {
    try {
      const {
        texto,
        ambiente,
      } = req.body;

      if (
        !texto ||
        typeof texto !== "string"
      ) {
        return res.status(400).json({
          erro: "Texto não informado.",
        });
      }

      const ambienteFinal =
        ambiente || "geral";

      const resultado =
        await analisarConteudo(
          texto,
          ambienteFinal,
          "desabafo"
        );

      // =================================================
      // BLOQUEAR PUBLICAÇÃO OFENSIVA
      // =================================================

      if (
        resultado.publicarPermitido === false
      ) {
        return res.json({
          ...resultado,
          alertaCriado: false,
          alertaId: null,
        });
      }

      // =================================================
      // CRIAR ALERTA AUTOMATICAMENTE
      // =================================================

      let alertaBanco = {
        criado: false,
      };

      if (resultado.alerta) {
        try {
          alertaBanco =
            await criarAlertaPulsan(
              texto,
              resultado,
              ambienteFinal
            );
        } catch (erroAlerta) {
          console.error(
            "❌ Erro ao salvar alerta:",
            erroAlerta
          );
        }
      }

      return res.json({
        ...resultado,

        alertaCriado:
          alertaBanco.criado || false,

        alertaId:
          alertaBanco.alertaId || null,
      });

    } catch (erro) {
      console.error(
        "❌ Erro IA desabafo:",
        erro
      );

      return res.status(500).json({
        erro:
          "Não foi possível analisar o desabafo.",
      });
    }
  }
);

// =====================================================
// CONVERSA
// =====================================================

app.post(
  "/api/analisar-mensagem",
  async (req, res) => {
    try {
      const {
        texto,
        ambiente,
      } = req.body;

      if (
        !texto ||
        typeof texto !== "string"
      ) {
        return res.status(400).json({
          erro: "Texto não informado.",
        });
      }

      const resultado =
        await analisarConteudo(
          texto,
          ambiente || "geral",
          "mensagem de conversa"
        );

      return res.json(resultado);

    } catch (erro) {
      console.error(
        "❌ Erro IA conversa:",
        erro
      );

      return res.status(500).json({
        erro:
          "Não foi possível analisar a mensagem.",
      });
    }
  }
);

// =====================================================
// CONVERSA ESCOLAR
// =====================================================

app.post(
  "/api/analisar-conversa-escolar",
  async (req, res) => {
    try {
      const {
        texto,
      } = req.body;

      if (
        !texto ||
        typeof texto !== "string"
      ) {
        return res.status(400).json({
          erro: "Texto não informado.",
        });
      }

      const resultado =
        await analisarConteudo(
          texto,
          "escola",
          "conversa escolar"
        );

      return res.json(resultado);

    } catch (erro) {
      console.error(
        "❌ Erro IA conversa escolar:",
        erro
      );

      return res.status(500).json({
        erro:
          "Não foi possível analisar a conversa escolar.",
      });
    }
  }
);

// =====================================================
// ALERTAS - EQUIPE PULSAN
// =====================================================

app.get(
  "/api/alertas",
  async (req, res) => {
    try {
      if (!supabaseAdmin) {
        return res.status(503).json({
          erro:
            "Supabase administrativo não configurado.",
          alertas: [],
        });
      }

      const tipo =
        String(
          req.query.tipo ||
          "equipe_pulsan"
        ).toLowerCase();

      let query =
        supabaseAdmin
          .from("destinatarios_alerta")
          .select(
            "id, alerta_id, psicologo_id, equipe_id, responsavel_escola_id, recebido, visualizado"
          )
          .order("id", {
            ascending: false,
          });

      // -----------------------------------------------
      // EQUIPE PULSAN
      // -----------------------------------------------

      if (
        tipo === "equipe_pulsan"
      ) {
        query =
          query.not(
            "equipe_id",
            "is",
            null
          );
      }

      // -----------------------------------------------
      // PSICÓLOGO
      // -----------------------------------------------

      else if (
        tipo === "psicologo"
      ) {
        const psicologoId =
          req.query.psicologoId;

        if (!psicologoId) {
          return res.status(400).json({
            erro:
              "psicologoId não informado.",
            alertas: [],
          });
        }

        query =
          query.eq(
            "psicologo_id",
            psicologoId
          );
      }

      else {
        return res.status(400).json({
          erro:
            "Tipo de destinatário inválido.",
          alertas: [],
        });
      }

      const {
        data: destinatarios,
        error:
          erroDestinatarios,
      } = await query;

      if (erroDestinatarios) {
        console.error(
          "❌ Erro ao buscar destinatários dos alertas:",
          erroDestinatarios
        );

        return res.status(500).json({
          erro:
            "Não foi possível buscar os destinatários dos alertas.",
          alertas: [],
        });
      }

      if (
        !destinatarios ||
        destinatarios.length === 0
      ) {
        return res.json({
          alertas: [],
        });
      }

      // -----------------------------------------------
      // BUSCAR IDS DOS ALERTAS
      // -----------------------------------------------

      const idsAlertas = [
        ...new Set(
          destinatarios.map(
            (item) =>
              item.alerta_id
          )
        ),
      ];

      // -----------------------------------------------
      // BUSCAR ALERTAS
      // -----------------------------------------------

      const {
        data: alertasBanco,
        error: erroAlertas,
      } = await supabaseAdmin
        .from("alertas_ia")
        .select("*")
        .in(
          "id",
          idsAlertas
        )
        .order("id", {
          ascending: false,
        });

      if (erroAlertas) {
        console.error(
          "❌ Erro ao buscar alertas:",
          erroAlertas
        );

        return res.status(500).json({
          erro:
            "Não foi possível buscar os alertas.",
          alertas: [],
        });
      }

      const mapaAlertas =
        new Map(
          (alertasBanco || []).map(
            (alerta) => [
              alerta.id,
              alerta,
            ]
          )
        );

      // -----------------------------------------------
      // JUNTAR ALERTA + DESTINATÁRIO
      // -----------------------------------------------

      const alertas =
        destinatarios
          .map(
            (destinatario) => {
              const alerta =
                mapaAlertas.get(
                  destinatario.alerta_id
                );

              if (!alerta) {
                return null;
              }

              return {
                ...alerta,

                destinatario_id:
                  destinatario.id,

                visualizado:
                  Boolean(
                    destinatario.visualizado
                  ),

                recebido:
                  Boolean(
                    destinatario.recebido
                  ),
              };
            }
          )
          .filter(Boolean);

      return res.json({
        alertas,
      });

    } catch (erro) {
      console.error(
        "❌ Erro inesperado ao buscar alertas:",
        erro
      );

      return res.status(500).json({
        erro:
          "Não foi possível carregar os alertas.",
        alertas: [],
      });
    }
  }
);

// =====================================================
// MARCAR ALERTA COMO VISUALIZADO
// =====================================================

app.patch(
  "/api/alertas/:id/visualizado",
  async (req, res) => {
    try {
      if (!supabaseAdmin) {
        return res.status(503).json({
          erro:
            "Supabase administrativo não configurado.",
        });
      }

      const alertaId =
        req.params.id;

      if (!alertaId) {
        return res.status(400).json({
          erro:
            "ID do alerta não informado.",
        });
      }

      const {
        data,
        error,
      } = await supabaseAdmin
        .from(
          "destinatarios_alerta"
        )
        .update({
          visualizado: true,
          recebido: true,
        })
        .eq(
          "alerta_id",
          alertaId
        )
        .not(
          "equipe_id",
          "is",
          null
        )
        .select(
          "id, alerta_id, equipe_id, visualizado, recebido"
        );

      if (error) {
        console.error(
          "❌ Erro ao marcar alerta como visualizado:",
          error
        );

        return res.status(500).json({
          erro:
            "Não foi possível marcar o alerta como visualizado.",
        });
      }

      return res.json({
        sucesso: true,

        alertaId,

        destinatariosAtualizados:
          data?.length || 0,
      });

    } catch (erro) {
      console.error(
        "❌ Erro inesperado ao atualizar alerta:",
        erro
      );

      return res.status(500).json({
        erro:
          "Não foi possível atualizar o alerta.",
      });
    }
  }
);

// =====================================================
// ATUALIZAR VERIFICAÇÃO DO PSICÓLOGO
// =====================================================

app.patch("/api/psicologos/:id/verificacao", async (req, res) => {
  try {
    const { verificado } = req.body;

    if (typeof verificado !== "boolean") {
      return res.status(400).json({
        erro: "O campo verificado deve ser true ou false.",
      });
    }

    const { data, error } = await supabaseAdmin
      .from("psicologos")
      .update({
        verificado,
        disponivel: verificado,
        ativo: verificado ? true : false,
      })
      .eq("id", req.params.id)
      .select()
      .single();

    if (error) {
      console.error("Erro ao atualizar psicólogo:", error);

      return res.status(500).json({
        erro: "Não foi possível atualizar o psicólogo.",
        detalhes: error.message,
      });
    }

    return res.json({
      sucesso: true,
      psicologo: data,
    });
  } catch (error) {
    console.error("Erro na aprovação do psicólogo:", error);

    return res.status(500).json({
      erro: "Erro interno ao atualizar psicólogo.",
    });
  }
});

// =====================================================
// LISTAR PSICÓLOGOS
// =====================================================

app.get("/api/psicologos", async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("psicologos")
      .select(
        "id, nome, email, crp, verificado, ativo, disponivel, created_at"
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar psicólogos:", error);

      return res.status(500).json({
        erro: "Não foi possível buscar os psicólogos.",
      });
    }

    return res.json({
      psicologos: data || [],
    });
  } catch (erro) {
    console.error("Erro inesperado:", erro);

    return res.status(500).json({
      erro: "Erro inesperado ao buscar psicólogos.",
    });
  }
});

// =====================================================
// STATUS
// =====================================================

app.get(
  "/api/status",
  (req, res) => {
    res.json({
      funcionando: true,

      sistema: "Pulsan IA",

      modelo: MODELO_IA,

      supabase:
        Boolean(supabaseAdmin),

      endpoints: [
        "/api/analisar-desabafo",
        "/api/analisar-mensagem",
        "/api/analisar-conversa-escolar",
        "/api/alertas",
        "/api/alertas/:id/visualizado",
      ],
    });
  }
);

// =====================================================
// CADASTRO DE PSICÓLOGO
// =====================================================

app.post(
  "/api/psicologos",
  async (req, res) => {
    try {
      if (!supabaseAdmin) {
        return res.status(503).json({
          erro:
            "Supabase administrativo não configurado.",
        });
      }

      const {
        id,
        nome,
        email,
        crp,
      } = req.body;

      if (
        !id ||
        !nome ||
        !email ||
        !crp
      ) {
        return res.status(400).json({
          erro:
            "Nome, e-mail, CRP e ID são obrigatórios.",
        });
      }

      const {
        data: psicologoExistente,
        error: erroBusca,
      } = await supabaseAdmin
        .from("psicologos")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (erroBusca) {
        console.error(
          "❌ Erro ao verificar psicólogo:",
          erroBusca
        );

        return res.status(500).json({
          erro:
            "Não foi possível verificar o cadastro.",
        });
      }

      if (psicologoExistente) {
        return res.status(409).json({
          erro:
            "Este e-mail já está cadastrado como psicólogo.",
        });
      }

      const {
        data: novoPsicologo,
        error: erroCadastro,
      } = await supabaseAdmin
        .from("psicologos")
        .insert({
          id,
          nome: nome.trim(),
          email: email.trim().toLowerCase(),
          crp: crp.trim(),
          verificado: false,
          ativo: true,
          disponivel: false,
        })
        .select(
          "id, nome, email, crp, verificado, ativo, disponivel, created_at"
        )
        .single();

      if (erroCadastro) {
        console.error(
          "❌ Erro ao cadastrar psicólogo:",
          erroCadastro
        );

        return res.status(500).json({
          erro:
            "Não foi possível salvar o psicólogo no Supabase.",
        });
      }

      console.log(
        `🧠 Psicólogo cadastrado para análise: ${novoPsicologo.email}`
      );

      return res.status(201).json({
        sucesso: true,
        psicologo: novoPsicologo,
      });
    } catch (erro) {
      console.error(
        "❌ Erro inesperado no cadastro de psicólogo:",
        erro
      );

      return res.status(500).json({
        erro:
          "Erro inesperado ao cadastrar psicólogo.",
      });
    }
  }
);

// =====================================================
// REFLEXÃO PARA NOTIFICAÇÃO
// =====================================================

app.get("/api/notificacoes/reflexao", async (req, res) => {
  try {
    if (!supabaseAdmin) {
      return res.status(503).json({
        erro: "Supabase administrativo não configurado.",
      });
    }

    const agora = new Date();

    const horarioAtual = agora
      .toTimeString()
      .slice(0, 8);

    const {
      data,
      error,
    } = await supabaseAdmin
      .from("reflexoes_notificacoes")
      .select("*")
      .eq("ativa", true)
      .lte("horario", horarioAtual)
      .order("horario", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(
        "❌ Erro ao buscar reflexão:",
        error
      );

      return res.status(500).json({
        erro: "Não foi possível buscar a reflexão.",
      });
    }

    if (!data) {
      return res.status(404).json({
        erro: "Nenhuma reflexão disponível.",
      });
    }

    return res.json({
      sucesso: true,
      reflexao: data,
    });
  } catch (erro) {
    console.error(
      "❌ Erro inesperado ao buscar reflexão:",
      erro
    );

    return res.status(500).json({
      erro: "Erro interno ao buscar reflexão.",
    });
  }
});

// =====================================================
// SERVIDOR
// =====================================================

app.listen(
  PORT,
  () => {
    console.log(
      `🤖 Pulsan IA funcionando na porta ${PORT}`
    );

    console.log(
      `📡 http://localhost:${PORT}/api/status`
    );
  }
);