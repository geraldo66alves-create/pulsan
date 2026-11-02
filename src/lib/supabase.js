import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/+$/, "");

// Usa a chave Publishable atual. Mantém compatibilidade com a variável antiga.
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY;

function pulsAnEstaInstalado() {
  if (typeof window === "undefined") return false;

  return Boolean(
    window.matchMedia?.("(display-mode: standalone)")?.matches ||
      window.navigator.standalone === true ||
      document.referrer.startsWith("android-app://")
  );
}

function acessarArmazenamento(tipo) {
  try {
    if (typeof window === "undefined") return null;
    return tipo === "local" ? window.localStorage : window.sessionStorage;
  } catch {
    return null;
  }
}

function criarArmazenamentoSessaoPulsan() {
  return {
    getItem(chave) {
      try {
        const temporario = acessarArmazenamento("session");
        const persistente = acessarArmazenamento("local");

        if (pulsAnEstaInstalado()) {
          const valorPersistente = persistente?.getItem(chave);
          if (valorPersistente !== null && valorPersistente !== undefined) {
            return valorPersistente;
          }

          const valorTemporario = temporario?.getItem(chave);
          if (valorTemporario !== null && valorTemporario !== undefined) {
            persistente?.setItem(chave, valorTemporario);
            temporario?.removeItem(chave);
          }
          return valorTemporario ?? null;
        }

        return temporario?.getItem(chave) ?? null;
      } catch (erro) {
        console.error("Erro ao recuperar a sessão do Pulsan:", erro);
        return null;
      }
    },

    setItem(chave, valor) {
      try {
        const armazenamento = acessarArmazenamento(
          pulsAnEstaInstalado() ? "local" : "session"
        );
        armazenamento?.setItem(chave, valor);
      } catch (erro) {
        console.error("Erro ao salvar a sessão do Pulsan:", erro);
      }
    },

    removeItem(chave) {
      try {
        acessarArmazenamento("session")?.removeItem(chave);
        acessarArmazenamento("local")?.removeItem(chave);
      } catch (erro) {
        console.error("Erro ao remover a sessão do Pulsan:", erro);
      }
    },
  };
}

function fetchSupabase(input, options = {}) {
  const urlRecebida =
    typeof input === "string"
      ? input
      : input instanceof URL
        ? input.href
        : input?.url;

  if (typeof window === "undefined" || !urlRecebida) {
    return fetch(input, options);
  }

  try {
    const url = new URL(urlRecebida, window.location.origin);
    const urlSupabase = new URL(supabaseUrl);

    if (url.origin !== urlSupabase.origin) {
      return window.fetch(input, options);
    }

    let destino = null;

    if (url.pathname.startsWith("/auth/v1/")) {
      destino = `/api/supabase-auth${url.pathname.slice("/auth/v1".length)}${url.search}`;
    } else if (url.pathname.startsWith("/rest/v1/")) {
      destino = `/api/supabase-rest${url.pathname.slice("/rest/v1".length)}${url.search}`;
    }

    if (!destino) {
      return window.fetch(input, options);
    }

    // Preserva método, headers e corpo das chamadas do Supabase,
    // inclusive quando o SDK fornece um objeto Request.
    if (typeof Request !== "undefined" && input instanceof Request) {
      const init = {
        method: options.method || input.method,
        headers: options.headers || input.headers,
        body: options.body !== undefined ? options.body : undefined,
        credentials: options.credentials || input.credentials,
        cache: options.cache || input.cache,
        redirect: options.redirect || input.redirect,
        referrer: options.referrer || input.referrer,
        referrerPolicy: options.referrerPolicy || input.referrerPolicy,
        integrity: options.integrity || input.integrity,
        keepalive: options.keepalive ?? input.keepalive,
        signal: options.signal || input.signal,
      };

      if (
        init.body === undefined &&
        !["GET", "HEAD"].includes(init.method.toUpperCase())
      ) {
        return input.clone().arrayBuffer().then((body) =>
          window.fetch(destino, { ...init, body })
        );
      }

      return window.fetch(destino, init);
    }

    return window.fetch(destino, options);
  } catch (erro) {
    console.error("Erro ao encaminhar requisição ao Supabase:", erro);
    return Promise.reject(erro);
  }
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Pulsan: configure VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY no ambiente."
  );
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "chave-nao-configurada",
  {
    global: { fetch: fetchSupabase },
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: criarArmazenamentoSessaoPulsan(),
    },
  }
);
