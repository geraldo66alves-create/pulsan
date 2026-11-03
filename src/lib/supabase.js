
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim().replace(/\/+$/, "");
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

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Pulsan: configure VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: criarArmazenamentoSessaoPulsan(),
  },
});

