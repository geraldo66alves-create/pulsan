
export default async function handler(req, res) {
  try {
    const modulo = await import("../server/server.js");
    const app = modulo.default;

    if (typeof app !== "function") {
      throw new Error("O servidor Express não foi exportado corretamente.");
    }

    return app(req, res);
  } catch (erro) {
    console.error("ERRO AO INICIALIZAR API PULSAN:", erro);

    return res.status(500).json({
      sucesso: false,
      etapa: "inicializacao_api",
      erro: erro?.message || "Erro desconhecido ao iniciar o servidor.",
      tipo: erro?.name || "Erro",
    });
  }
}

