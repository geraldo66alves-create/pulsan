import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/* =====================================================
   SESSÃO SUPABASE — PULSAN

   Navegador: sessionStorage
   PWA instalado: localStorage

   Assim, o navegador não mantém a sessão depois que a
   aba/janela é encerrada, enquanto o Pulsan instalado
   mantém a conta conectada até o usuário sair.
===================================================== */
function pulsAnEstaInstalado() {
  if (typeof window === "undefined") return false;

  return Boolean(
    window.matchMedia?.("(display-mode: standalone)")?.matches ||
    window.navigator.standalone === true ||
    document.referrer.startsWith("android-app://")
  );
}

function criarArmazenamentoSessaoPulsan() {
  const armazenamentoTemporario =
    typeof window !== "undefined" ? window.sessionStorage : null;
  const armazenamentoPersistente =
    typeof window !== "undefined" ? window.localStorage : null;

  return {
    getItem(chave) {
      if (!armazenamentoTemporario || !armazenamentoPersistente) return null;

      if (pulsAnEstaInstalado()) {
        // Se o usuário acabou de instalar/abrir o PWA depois de
        // estar logado no navegador, aproveita a sessão temporária
        // uma única vez e a promove para o armazenamento persistente.
        const persistente = armazenamentoPersistente.getItem(chave);
        if (persistente !== null) return persistente;

        const temporario = armazenamentoTemporario.getItem(chave);
        if (temporario !== null) {
          armazenamentoPersistente.setItem(chave, temporario);
          armazenamentoTemporario.removeItem(chave);
        }

        return temporario;
      }

      // No navegador, nunca recupera o token salvo no localStorage.
      return armazenamentoTemporario.getItem(chave);
    },

    setItem(chave, valor) {
      if (!armazenamentoTemporario || !armazenamentoPersistente) return;

      if (pulsAnEstaInstalado()) {
        armazenamentoPersistente.setItem(chave, valor);
      } else {
        armazenamentoTemporario.setItem(chave, valor);
      }
    },

    removeItem(chave) {
      if (!armazenamentoTemporario || !armazenamentoPersistente) return;

      // Remove dos dois locais para evitar que uma sessão antiga
      // reapareça ao alternar entre navegador e PWA.
      armazenamentoTemporario.removeItem(chave);
      armazenamentoPersistente.removeItem(chave);
    },
  };
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: criarArmazenamentoSessaoPulsan(),
    },
  }
);
