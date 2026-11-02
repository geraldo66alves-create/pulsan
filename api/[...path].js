export default async function handler(req, res) {
  try {
    const modulo = await import("../server/server.js");
    const app = modulo.default;

    if (typeof app !== "function") {
      throw new Error("Servidor Express não exportado.");
    }

    const originalUrl = req.url || "/";
    const caminho = originalUrl.split("?")[0];

    if (!caminho.startsWith("/api/")) {
      req.url = `/api/${originalUrl.replace(/^\/+/, "")}`;
    }

    console.log("PULSAN API:", req.method, req.url);

    return app(req, res);
  } catch (erro) {
    console.error("ERRO API PULSAN:", erro);

    if (res.headersSent) return res.end();

    return res.status(500).json({
      sucesso: false,
      erro: erro.message || "Erro interno da API",
    });
  }
}
