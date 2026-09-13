const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001";

function base64UrlToUint8Array(base64String) {
  const padding = "=".repeat(
    (4 - (base64String.length % 4)) % 4
  );

  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);

  return Uint8Array.from(
    [...rawData].map((char) => char.charCodeAt(0))
  );
}

export async function ativarNotificacoesPulsan(sentimento) {
  // Verifica se o navegador suporta notificações
  if (
    typeof window === "undefined" ||
    !("Notification" in window) ||
    !("serviceWorker" in navigator) ||
    !("PushManager" in window)
  ) {
    console.log("Este dispositivo não suporta notificações Push.");
    return false;
  }

  try {
    // Solicita permissão ao usuário
    let permissao = Notification.permission;

    if (permissao !== "granted") {
      permissao = await Notification.requestPermission();
    }

    // Usuário recusou
    if (permissao !== "granted") {
      console.log("Permissão para notificações não concedida.");
      return false;
    }

    // Registra o Service Worker
    const registro =
      await navigator.serviceWorker.register("/sw.js");

    await navigator.serviceWorker.ready;

    // Busca a chave pública no servidor
    const respostaChave = await fetch(
      `${API_URL}/api/notificacoes/chave-publica`
    );

    if (!respostaChave.ok) {
      throw new Error(
        "Não foi possível obter a chave pública das notificações."
      );
    }

    const { chavePublica } =
      await respostaChave.json();

    if (!chavePublica) {
      throw new Error(
        "A chave pública das notificações não está configurada."
      );
    }

    // Verifica se o dispositivo já está inscrito
    let subscription =
      await registro.pushManager.getSubscription();

    // Se ainda não estiver, cria a inscrição
    if (!subscription) {
      subscription =
        await registro.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey:
            base64UrlToUint8Array(chavePublica),
        });
    }

    // Envia a inscrição e o sentimento para o servidor
    const resposta = await fetch(
      `${API_URL}/api/notificacoes/inscrever`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscription,
          sentimento:
            typeof sentimento === "string"
              ? sentimento
              : "bem",
        }),
      }
    );

    if (!resposta.ok) {
      throw new Error(
        "Não foi possível registrar o dispositivo."
      );
    }

    console.log(
      "🔔 Notificações do Pulsan ativadas!"
    );

    return true;
  } catch (erro) {
    console.error(
      "❌ Erro ao ativar notificações do Pulsan:",
      erro
    );

    return false;
  }
}