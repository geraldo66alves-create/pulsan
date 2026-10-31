import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.replace(/\/+$/, "");
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

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

    return tipo === "local"
      ? window.localStorage
      : window.sessionStorage;
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

    const pertenceAoSupabase =
      url.origin === urlSupabase.origin &&
      url.pathname.startsWith("/rest/v1/");

    if (pertenceAoSupabase) {
      const caminho = url.pathname.slice("/rest/v1".length);
      const destino = `/api/supabase-rest${caminho}${url.search}`;

      return window.fetch(destino, options);
    }
  } catch (erro) {
    console.error("Erro ao preparar a requisição ao Supabase:", erro);
  }

  return window.fetch(input, options);
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Pulsan: configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo de ambiente."
  );
}

export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co",
  supabaseAnonKey || "chave-nao-configurada",
  {
    global: {
      fetch: fetchSupabase,
    },

    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: criarArmazenamentoSessaoPulsan(),
    },
  }
);