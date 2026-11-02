import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({
  path: resolve(__dirname, "../.env.local"),
});

const app = express();

// CORS explícito para o Vite local e para chamadas entre origens autorizadas.
// Em produção, a aplicação hospedada na mesma origem não depende de CORS.
const origensPermitidas = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
  ...(process.env.PULSAN_ALLOWED_ORIGINS || "")
    .split(",")
    .map((origem) => origem.trim())
    .filter(Boolean),
]);

const configuracaoCors = {
  origin(origem, callback) {
    // Permite chamadas sem Origin (curl, health checks e comunicação servidor-servidor).
    if (!origem) return callback(null, true);

    let origemValida = origensPermitidas.has(origem);

    // O Vite pode usar outra porta quando a 5173 já está ocupada.
    if (!origemValida) {
      try {
        const urlOrigem = new URL(origem);
        origemValida =
          (urlOrigem.protocol === "http:" &&
            ["localhost", "127.0.0.1"].includes(urlOrigem.hostname)) ||
          (urlOrigem.protocol === "https:" &&
            urlOrigem.hostname.endsWith(".vercel.app"));
      } catch {
        origemValida = false;
      }
    }

    return callback(
      origemValida ? null : new Error("Origem não autorizada pelo CORS."),
      origemValida
    );
  },
  methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Accept",
    "Authorization",
    "Content-Type",
    "apikey",
    "Prefer",
    "Range",
    "Accept-Profile",
    "Content-Profile",
    "X-Client-Info",
    "X-Supabase-Api-Version",
    "X-Retry-Count",
  ],
  exposedHeaders: [
    "Content-Range",
    "Accept-Ranges",
    "Preference-Applied",
    "Location",
    "ETag",
  ],
  optionsSuccessStatus: 204,
  maxAge: 86400,
};

app.use(cors(configuracaoCors));
app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  return next();
});
app.use(express.json({ limit: "1mb" }));

const PORT = process.env.PORT || 3001;

// =====================================================
// GEMINI
// =====================================================

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY não encontrada no .env.local");
}

let clienteGeminiPromise = null;

async function obterClienteGemini() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY não configurada no servidor.");
  }

  if (!clienteGeminiPromise) {
    clienteGeminiPromise = import("@google/genai").then(
      ({ GoogleGenAI }) =>
        new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
    );
  }

  return clienteGeminiPromise;
}

// =====================================================
// SUPABASE
// =====================================================

const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.VITE_SUPABASE_URL;

const SUPABASE_URL_NORMALIZADA =
  SUPABASE_URL?.replace(/\/+$/, "");

const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

const SUPABASE_PUBLIC_KEY =
  process.env.SUPABASE_ANON_KEY ||
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  process.env.VITE_SUPABASE_ANON_KEY;

let supabaseAdmin = null;

if (
  SUPABASE_URL &&
  SUPABASE_SERVICE_ROLE_KEY
) {
  supabaseAdmin = createClient(
    SUPABASE_URL_NORMALIZADA,
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
// PROXY DE AUTENTICAÇÃO DO SUPABASE
// =====================================================
app.use("/api/supabase-auth", async (req, res) => {
  try {
    if (!SUPABASE_URL_NORMALIZADA || !SUPABASE_PUBLIC_KEY) {
      return res.status(503).json({
        erro: "Supabase não configurado no servidor.",
      });
    }

    const prefixo = "/api/supabase-auth";
    const caminho = req.originalUrl.slice(prefixo.length) || "/";
    const destino = new URL(
      `/auth/v1${caminho}`,
      SUPABASE_URL_NORMALIZADA
    );

    const metodosPermitidos = [
      "GET",
      "HEAD",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ];

    if (!metodosPermitidos.includes(req.method)) {
      return res.status(405).json({
        erro: "Método não permitido.",
      });
    }

    const headers = new Headers();
    headers.set("apikey", SUPABASE_PUBLIC_KEY);

    const headersPermitidos = [
      "authorization",
      "accept",
      "content-type",
      "x-client-info",
      "x-supabase-api-version",
    ];

    for (const nome of headersPermitidos) {
      const valor = req.headers[nome];
      if (valor) headers.set(nome, valor);
    }

    let corpo;

    if (!["GET", "HEAD", "OPTIONS"].includes(req.method)) {
      if (req.body !== undefined) {
        corpo = JSON.stringify(req.body);
      }
    }

    console.log("➡️ Supabase Auth:", req.method, destino.pathname);

    const resposta = await fetch(destino, {
      method: req.method,
      headers,
      body: corpo,
      redirect: "manual",
    });

    for (const nome of [
      "content-type",
      "cache-control",
      "expires",
      "pragma",
      "location",
    ]) {
      const valor = resposta.headers.get(nome);
      if (valor) res.setHeader(nome, valor);
    }

    const dados = Buffer.from(await resposta.arrayBuffer());

    console.log(
      "⬅️ Supabase Auth:",
      resposta.status,
      destino.pathname
    );

    return res.status(resposta.status).send(dados);
  } catch (erro) {
    console.error("❌ FALHA NO PROXY AUTH:", {
      mensagem: erro.message,
      causa: erro.cause?.message,
      codigo: erro.cause?.code,
      nome: erro.name,
    });

    return res.status(502).json({
      erro: "Falha na comunicação com o Supabase Auth.",
      detalhe: erro.cause?.message || erro.message,
      codigo: erro.cause?.code || null,
    });
  }
})


// =====================================================
// PROXY REST DO SUPABASE
// =====================================================

app.use("/api/supabase-rest", async (req, res) => {
  try {
    if (!SUPABASE_URL_NORMALIZADA || !SUPABASE_PUBLIC_KEY) {
      return res.status(503).json({
        erro: "Supabase não configurado no servidor.",
      });
    }

    const prefixo = "/api/supabase-rest";
    const caminho = req.originalUrl.slice(prefixo.length) || "/";
    const destino = new URL(`/rest/v1${caminho}`, SUPABASE_URL_NORMALIZADA);

    const metodosPermitidos = [
      "GET",
      "HEAD",
      "POST",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ];

    if (!metodosPermitidos.includes(req.method)) {
      return res.status(405).json({
        erro: "Método não permitido.",
      });
    }

    const headers = new Headers();

    headers.set(
      "apikey",
      req.headers.apikey || SUPABASE_PUBLIC_KEY
    );

    headers.set(
      "authorization",
      req.headers.authorization || `Bearer ${SUPABASE_PUBLIC_KEY}`
    );

    for (const nome of [
      "accept",
      "content-type",
      "prefer",
      "range",
      "accept-profile",
      "content-profile",
      "x-client-info",
    ]) {
      const valor = req.headers[nome];

      if (valor) {
        headers.set(
          nome,
          Array.isArray(valor) ? valor.join(",") : valor
        );
      }
    }

    let corpo;

    if (
      !["GET", "HEAD", "OPTIONS"].includes(req.method) &&
      req.body !== undefined
    ) {
      corpo =
        typeof req.body === "string"
          ? req.body
          : JSON.stringify(req.body);
    }

    const resposta = await fetch(destino, {
      method: req.method,
      headers,
      body: corpo,
      signal: AbortSignal.timeout(30000),
    });

    console.log(
      "⬅️ Supabase REST:",
      resposta.status,
      destino.pathname
    );

    for (const nome of [
      "content-type",
      "content-range",
      "accept-ranges",
      "preference-applied",
      "location",
      "etag",
    ]) {
      const valor = resposta.headers.get(nome);

      if (valor) {
        res.setHeader(nome, valor);
      }
    }

    res.status(resposta.status);

    if (
      req.method === "HEAD" ||
      resposta.status === 204
    ) {
      return res.end();
    }

    const dados = Buffer.from(
      await resposta.arrayBuffer()
    );

    return res.send(dados);
  } catch (erro) {
    console.error("❌ Erro no proxy REST do Supabase:", {
      mensagem: erro?.message,
      causa: erro?.cause?.message,
      codigo: erro?.cause?.code,
      nome: erro?.name,
    });

    return res.status(502).json({
      erro: "Não foi possível comunicar com o Supabase.",
      detalhe: erro?.cause?.message || erro?.message || "Falha desconhecida.",
      codigo: erro?.cause?.code || null,
    });
  }
});

// Verifica a comunicação do servidor com o endpoint REST do Supabase.
app.get("/api/teste-supabase", async (req, res) => {
  try {
    if (!SUPABASE_URL_NORMALIZADA || !SUPABASE_PUBLIC_KEY) {
      return res.status(503).json({
        funcionando: false,
        erro: "Supabase não configurado no servidor.",
      });
    }

    const resposta = await fetch(
      new URL("/auth/v1/health", SUPABASE_URL_NORMALIZADA),
      {
        headers: { apikey: SUPABASE_PUBLIC_KEY },
        signal: AbortSignal.timeout(15000),
      }
    );

    return res.status(resposta.ok ? 200 : resposta.status).json({
      funcionando: resposta.ok,
      supabaseStatus: resposta.status,
    });
  } catch (erro) {
    console.error("❌ Falha no teste de comunicação Supabase:", {
      mensagem: erro?.message,
      causa: erro?.cause?.message,
      codigo: erro?.cause?.code,
    });

    return res.status(502).json({
      funcionando: false,
      erro: "O servidor não conseguiu alcançar o Supabase.",
      detalhe: erro?.cause?.message || erro?.message,
    });
  }
});

// =====================================================
// AUTENTICAÇÃO E SEGURANÇA DO PULSAN
// =====================================================

async function autenticarUsuario(req, res, next) {
  try {
    if (!supabaseAdmin) {
      return res.status(503).json({
        erro: "Serviço de autenticação indisponível.",
      });
    }

    const autorizacao = req.headers.authorization || "";

    if (!autorizacao.startsWith("Bearer ")) {
      return res.status(401).json({
        erro: "Autenticação necessária.",
      });
    }

    const token = autorizacao.slice(7).trim();

    if (!token) {
      return res.status(401).json({
        erro: "Token não informado.",
      });
    }

    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        erro: "Sessão inválida ou expirada.",
      });
    }

    if (!user.email_confirmed_at) {
      return res.status(403).json({
        erro: "Confirme seu e-mail antes de continuar.",
      });
    }

    req.usuario = user;

    return next();
  } catch (erro) {
    console.error("Erro na autenticação:", erro);

    return res.status(500).json({
      erro: "Não foi possível validar sua sessão.",
    });
  }
}

async function exigirAdministrador(req, res, next) {
  try {
    const administradores = String(
      process.env.PULSAN_ADMIN_EMAILS || ""
    )
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);

    const emailUsuario = String(
      req.usuario?.email || ""
    ).trim().toLowerCase();

    if (
      !emailUsuario ||
      !administradores.includes(emailUsuario)
    ) {
      return res.status(403).json({
        erro: "Você não tem permissão para executar esta ação.",
      });
    }

    return next();
  } catch (erro) {
    console.error("Erro ao verificar administrador:", erro);

    return res.status(500).json({
      erro: "Não foi possível verificar suas permissões.",
    });
  }
}

// =====================================================
// CONFIGURAÇÃO DA IA
// =====================================================

const MODELO_IA = "gemini-3.5-flash-lite";

// =====================================================
// CLASSIFICAÇÃO DO PULSAN
// =====================================================

const classificacaoSchema = {
  type: "OBJECT",

  properties: {
    classificacao: {
      type: "STRING",
      enum: [
        "normal",
        "intermediario",
        "grave",
        "urgente",
      ],
    },

    tipoSituacao: {
      type: "STRING",
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
      type: "STRING",
    },

    alerta: {
      type: "BOOLEAN",
    },

    prioridadeAlerta: {
      type: "STRING",
      enum: [
        "nenhuma",
        "baixa",
        "media",
        "alta",
        "critica",
      ],
    },

    ambienteEscolar: {
      type: "BOOLEAN",
    },

    conteudoOfensivo: {
      type: "BOOLEAN",
    },

    categoriaOfensa: {
      type: "STRING",
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
      type: "BOOLEAN",
    },

    motivoModeracao: {
      type: "STRING",
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
    classificacao: resultado.classificacao,
    tipo_situacao: resultado.tipoSituacao,
    motivo: resultado.motivo || "",
    prioridade: resultado.prioridadeAlerta,
    ambiente: ambiente || "geral",
    resolvido: false,
    texto: texto.trim(),
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
    for (const responsavel of responsaveisEscola) {
      destinatarios.push({
        alerta_id: alertaId,
        psicologo_id: null,
        equipe_id: null,
        responsavel_escola_id: responsavel.id,
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
    quantidadeDestinatarios: destinatarios.length,
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

  const client = await obterClienteGemini();

  const resposta =
    await client.models.generateContent({
      model: MODELO_IA,
      contents: textoSeguro,
      config: {
        systemInstruction: instrucoes,
        responseMimeType: "application/json",
        responseSchema: classificacaoSchema,
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
    resultado.classificacao === "intermediario"
  ) {
    deveAlertar = true;
    prioridade = "media";
  }

  if (
    resultado.classificacao === "grave"
  ) {
    deveAlertar = true;
    prioridade = "alta";
  }

  if (
    resultado.classificacao === "urgente"
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
    classificacao: resultado.classificacao,
    tipoSituacao: resultado.tipoSituacao,
    motivo: resultado.motivo || "",
    alerta: deveAlertar,
    prioridadeAlerta: prioridade,
    ambienteEscolar: ehEscolar,
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

      if (
        resultado.publicarPermitido === false
      ) {
        return res.json({
          ...resultado,
          alertaCriado: false,
          alertaId: null,
        });
      }

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
        alertaCriado: alertaBanco.criado || false,
        alertaId: alertaBanco.alertaId || null,
      });

    } catch (erro) {
      console.error(
        "❌ Erro IA desabafo:",
        erro
      );

      return res.status(500).json({
        erro: "Não foi possível analisar o desabafo.",
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
        erro: "Não foi possível analisar a mensagem.",
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
        erro: "Não foi possível analisar a conversa escolar.",
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
          erro: "Supabase administrativo não configurado.",
          alertas: [],
        });
      }

      const tipo =
        String(
          req.query.tipo || "equipe_pulsan"
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

      if (tipo === "equipe_pulsan") {
        query = query.not("equipe_id", "is", null);
      } else if (tipo === "psicologo") {
        const psicologoId = req.query.psicologoId;

        if (!psicologoId) {
          return res.status(400).json({
            erro: "psicologoId não informado.",
            alertas: [],
          });
        }

        query = query.eq("psicologo_id", psicologoId);
      } else {
        return res.status(400).json({
          erro: "Tipo de destinatário inválido.",
          alertas: [],
        });
      }

      const {
        data: destinatarios,
        error: erroDestinatarios,
      } = await query;

      if (erroDestinatarios) {
        console.error(
          "❌ Erro ao buscar destinatários dos alertas:",
          erroDestinatarios
        );

        return res.status(500).json({
          erro: "Não foi possível buscar os destinatários dos alertas.",
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

      const idsAlertas = [
        ...new Set(
          destinatarios.map(
            (item) => item.alerta_id
          )
        ),
      ];

      const {
        data: alertasBanco,
        error: erroAlertas,
      } = await supabaseAdmin
        .from("alertas_ia")
        .select("*")
        .in("id", idsAlertas)
        .order("id", {
          ascending: false,
        });

      if (erroAlertas) {
        console.error(
          "❌ Erro ao buscar alertas:",
          erroAlertas
        );

        return res.status(500).json({
          erro: "Não foi possível buscar os alertas.",
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

      const alertas =
        destinatarios
          .map((destinatario) => {
            const alerta =
              mapaAlertas.get(
                destinatario.alerta_id
              );

            if (!alerta) {
              return null;
            }

            return {
              ...alerta,
              destinatario_id: destinatario.id,
              visualizado: Boolean(destinatario.visualizado),
              recebido: Boolean(destinatario.recebido),
            };
          })
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
        erro: "Não foi possível carregar os alertas.",
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
          erro: "Supabase administrativo não configurado.",
        });
      }

      const alertaId = req.params.id;

      if (!alertaId) {
        return res.status(400).json({
          erro: "ID do alerta não informado.",
        });
      }

      const {
        data,
        error,
      } = await supabaseAdmin
        .from("destinatarios_alerta")
        .update({
          visualizado: true,
          recebido: true,
        })
        .eq("alerta_id", alertaId)
        .not("equipe_id", "is", null)
        .select(
          "id, alerta_id, equipe_id, visualizado, recebido"
        );

      if (error) {
        console.error(
          "❌ Erro ao marcar alerta como visualizado:",
          error
        );

        return res.status(500).json({
          erro: "Não foi possível marcar o alerta como visualizado.",
        });
      }

      return res.json({
        sucesso: true,
        alertaId,
        destinatariosAtualizados: data?.length || 0,
      });

    } catch (erro) {
      console.error(
        "❌ Erro inesperado ao atualizar alerta:",
        erro
      );

      return res.status(500).json({
        erro: "Não foi possível atualizar o alerta.",
      });
    }
  }
);

// =====================================================
// ATUALIZAR VERIFICAÇÃO DO PSICÓLOGO
// =====================================================

app.patch(
  "/api/psicologos/:id/verificacao",
  autenticarUsuario,
  exigirAdministrador,
  async (req, res) => {
    try {
      if (!supabaseAdmin) {
        return res.status(503).json({
          erro: "Supabase administrativo não configurado.",
        });
      }

      const { verificado } = req.body;

      if (typeof verificado !== "boolean") {
        return res.status(400).json({
          erro: "O campo verificado deve ser true ou false.",
        });
      }

      const {
        data: psicologoAtual,
        error: erroBusca,
      } = await supabaseAdmin
        .from("psicologos")
        .select("id, usuario_id, nome, email, crp")
        .eq("id", req.params.id)
        .maybeSingle();

      if (erroBusca) {
        console.error(
          "Erro ao buscar psicólogo:",
          erroBusca
        );

        return res.status(500).json({
          erro: "Não foi possível localizar o psicólogo.",
        });
      }

      if (!psicologoAtual) {
        return res.status(404).json({
          erro: "Psicólogo não encontrado.",
        });
      }

      const status = verificado ? "aprovado" : "recusado";

      const {
        data,
        error,
      } = await supabaseAdmin
        .from("psicologos")
        .update({
          verificado,
          disponivel: verificado,
          ativo: verificado,
        })
        .eq("id", req.params.id)
        .select(
          "id, usuario_id, nome, email, telefone, crp, estado_crp, area_atuacao, verificado, ativo, disponivel, created_at"
        )
        .single();

      if (error) {
        console.error(
          "Erro ao atualizar psicólogo:",
          error
        );

        return res.status(500).json({
          erro: "Não foi possível atualizar o psicólogo.",
          detalhes: error.message,
        });
      }

      if (psicologoAtual.usuario_id) {
        const { error: erroPerfil } = await supabaseAdmin
          .from("perfis")
          .update({
            verificacao_psicologo: status,
            psicologo_parceiro: verificado,
          })
          .eq("id", psicologoAtual.usuario_id);

        if (erroPerfil) {
          console.error(
            "⚠️ Psicólogo atualizado, mas não foi possível atualizar o perfil:",
            erroPerfil
          );
        }
      }

      return res.json({
        sucesso: true,
        status,
        psicologo: data,
      });
    } catch (error) {
      console.error(
        "Erro na verificação do psicólogo:",
        error
      );

      return res.status(500).json({
        erro: "Erro interno ao atualizar psicólogo.",
      });
    }
  }
);

// =====================================================
// LISTAR PSICÓLOGOS
// =====================================================

app.get(
  "/api/psicologos",
  autenticarUsuario,
  exigirAdministrador,
  async (req, res) => {
    try {
      if (!supabaseAdmin) {
        return res.status(503).json({
          erro: "Supabase administrativo não configurado.",
          psicologos: [],
        });
      }

      const {
        data: psicologosBanco,
        error,
      } = await supabaseAdmin
        .from("psicologos")
        .select(
          "id, usuario_id, nome, email, telefone, crp, estado_crp, area_atuacao, verificado, ativo, disponivel, created_at"
        )
        .order("created_at", {
          ascending: false,
        });

      if (error) {
        console.error(
          "Erro ao buscar psicólogos:",
          error
        );

        return res.status(500).json({
          erro: "Não foi possível buscar os psicólogos.",
          psicologos: [],
        });
      }

      const lista = psicologosBanco || [];

      const usuarioIds = [
        ...new Set(
          lista
            .map((psicologo) => psicologo.usuario_id)
            .filter(Boolean)
        ),
      ];

      let perfisPorUsuario = new Map();

      if (usuarioIds.length > 0) {
        const {
          data: perfis,
          error: erroPerfis,
        } = await supabaseAdmin
          .from("perfis")
          .select("id, verificacao_psicologo, psicologo_parceiro")
          .in("id", usuarioIds);

        if (erroPerfis) {
          console.error(
            "⚠️ Não foi possível carregar os status dos perfis:",
            erroPerfis
          );
        } else {
          perfisPorUsuario = new Map(
            (perfis || []).map((perfil) => [
              perfil.id,
              perfil,
            ])
          );
        }
      }

      const psicologos = lista.map((psicologo) => {
        const perfil = perfisPorUsuario.get(psicologo.usuario_id);

        let verificacao_psicologo = "pendente";

        if (
          perfil?.verificacao_psicologo === "aprovado" ||
          psicologo.verificado === true
        ) {
          verificacao_psicologo = "aprovado";
        } else if (
          perfil?.verificacao_psicologo === "recusado"
        ) {
          verificacao_psicologo = "recusado";
        }

        return {
          ...psicologo,
          verificacao_psicologo,
          psicologo_parceiro:
            Boolean(perfil?.psicologo_parceiro) ||
            psicologo.verificado === true,
        };
      });

      return res.json({
        psicologos,
      });
    } catch (erro) {
      console.error(
        "Erro inesperado:",
        erro
      );

      return res.status(500).json({
        erro: "Erro inesperado ao buscar os psicólogos.",
        psicologos: [],
      });
    }
  }
);

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
      supabase: Boolean(supabaseAdmin),
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
          erro: "Supabase administrativo não configurado.",
        });
      }

      const {
        usuario_id,
        nome,
        email,
        telefone,
        crp,
        estado_crp,
        area_atuacao,
      } = req.body;

      if (
        !usuario_id ||
        !nome ||
        !email ||
        !crp
      ) {
        return res.status(400).json({
          erro: "Usuário, nome, e-mail e CRP são obrigatórios.",
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
          erro: "Não foi possível verificar o cadastro.",
        });
      }

      if (psicologoExistente) {
        return res.status(409).json({
          erro: "Este e-mail já está cadastrado como psicólogo.",
        });
      }

      const {
        data: novoPsicologo,
        error: erroCadastro,
      } = await supabaseAdmin
        .from("psicologos")
        .insert({
          usuario_id,
          nome: nome.trim(),
          email: email.trim().toLowerCase(),
          telefone: telefone?.trim() || null,
          crp: crp.trim(),
          estado_crp: estado_crp?.trim() || null,
          area_atuacao: area_atuacao?.trim() || null,
          verificado: false,
          ativo: true,
          disponivel: false,
        })
        .select(
          "id, usuario_id, nome, email, telefone, crp, estado_crp, area_atuacao, verificado, ativo, disponivel, created_at"
        )
        .single();

      if (erroCadastro) {
        console.error(
          "❌ Erro ao cadastrar psicólogo:",
          erroCadastro
        );

        return res.status(500).json({
          erro: "Não foi possível salvar o psicólogo no Supabase.",
        });
      }

      const { error: erroPerfil } = await supabaseAdmin
        .from("perfis")
        .update({
          verificacao_psicologo: "pendente",
          psicologo_parceiro: false,
        })
        .eq("id", usuario_id);

      if (erroPerfil) {
        console.error(
          "⚠️ Psicólogo salvo, mas não foi possível atualizar o perfil:",
          erroPerfil
        );
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
        erro: "Erro inesperado ao cadastrar psicólogo.",
      });
    }
  }
);

// =====================================================
// REFLEXÃO PARA NOTIFICAÇÃO
// =====================================================

app.get(
  "/api/notificacoes/reflexao",
  async (req, res) => {
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
  }
);

// =====================================================
// SERVIDOR
// =====================================================

export default app;

if (process.env.VERCEL !== "1") {
  app.listen(PORT, () => {
    console.log(
      `🤖 Pulsan IA funcionando na porta ${PORT}`
    );

    console.log(
      `📡 http://localhost:${PORT}/api/status`
    );
  });
}
