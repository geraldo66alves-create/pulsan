self.addEventListener("push", (event) => {
  let dados = {
    title: "Pulsan 💙",
    body: "Como você está se sentindo agora?",
    icon: "/logo.png",
    badge: "/logo.png",
    data: {
      url: "/",
    },
  };

  try {
    if (event.data) {
      dados = {
        ...dados,
        ...event.data.json(),
      };
    }
  } catch {
    // Mantém a mensagem padrão se o payload não for JSON.
  }

  event.waitUntil(
    self.registration.showNotification(
      dados.title || "Pulsan 💙",
      {
        body:
          dados.body ||
          "Um pequeno lembrete de cuidado para você.",
        icon: dados.icon || "/logo.png",
        badge: dados.badge || "/logo.png",
        tag: dados.tag || "pulsan-acolhimento",
        data: dados.data || {
          url: "/",
        },
      }
    )
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const destino =
    event.notification?.data?.url || "/";

  event.waitUntil(
    clients
      .matchAll({
        type: "window",
        includeUncontrolled: true,
      })
      .then((lista) => {
        for (const cliente of lista) {
          if ("focus" in cliente) {
            cliente.navigate(destino);
            return cliente.focus();
          }
        }

        if (clients.openWindow) {
          return clients.openWindow(destino);
        }

        return undefined;
      })
  );
});