export default async function handler(req, res) {
  try {
    // Normaliza o caminho recebido pela Vercel.
    const urlOriginal = req.url || "/";
    const caminho = urlOriginal.split("?")[0];

    if (
      caminho !== "/api" &&
      !caminho.startsWith("/api/")
    ) {
      req.url = `/api${urlOriginal.startsWith("/") ? "" : "/"}${urlOriginal}`;
    }

    const modulo = await import("../server/server.js");
    const app = modulo.default;

    if (typeof app !== "function") {
      throw new Error("O servidor Express não foi exportado corretamente.");
    }

    return app(req, res);
  } catch (erro) {
    console.error("ERRO AO INICIALIZAR API PULSAN:", erro);

    if (res.headersSent) {
      return res.end();
    }

    return res.status(500).json({
      sucesso: false,
      etapa: "inicializacao_api",
      erro: erro?.message || "Erro desconhecido ao iniciar o servidor.",
      tipo: erro?.name || "Erro",
    });
  }
}
