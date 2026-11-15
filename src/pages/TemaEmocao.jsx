import React from "react";

/* ═════════════════════════════════════════════════════════
   TEMAS POR EMOÇÃO
   cor: destaque · suave: tom dos cartões · fundo: degradê da página
   texto: cor de leitura · clima: rótulo curto · efeito: animação ambiente
═════════════════════════════════════════════════════════ */
export const TEMAS = {
  neutro:          { cor: "#3a7dff", suave: "#eaf3ff", fundo: ["#f8fbff", "#eaf3ff"], texto: "#173b68", clima: "Escolha como você está", efeito: "orbes" },
  cansado:         { cor: "#6f8fb5", suave: "#e4ecf5", fundo: ["#eef2f7", "#d9e4ef"], texto: "#2f4660", clima: "Hora de descansar", efeito: "estrelas" },
  ansioso:         { cor: "#4f9aa0", suave: "#dcedee", fundo: ["#ecf5f5", "#d4e8e9"], texto: "#2e5558", clima: "Respire junto com a luz", efeito: "orbes" },
  triste:          { cor: "#9a7fa6", suave: "#ebe2ee", fundo: ["#f2edf3", "#e2d9e6"], texto: "#4f4058", clima: "Chuva suave, sem pressa", efeito: "chuva" },
  pensando:        { cor: "#7b8fbf", suave: "#e3e8f3", fundo: ["#eef0f6", "#dbe1ee"], texto: "#3f4d70", clima: "Deixe os pensamentos subirem", efeito: "bolhas" },
  irritado:        { cor: "#d0805f", suave: "#f6e4db", fundo: ["#f7ece6", "#ecd7cc"], texto: "#6a4234", clima: "Esfriando aos poucos", efeito: "brasas" },
  vazio:           { cor: "#8ea2b3", suave: "#e2e9ef", fundo: ["#eceff2", "#dae1e8"], texto: "#3d4f5c", clima: "Silêncio sem cobrança", efeito: "estrelas" },
  desanimado:      { cor: "#7fa879", suave: "#e2eddf", fundo: ["#edf3ea", "#dce9d7"], texto: "#3f5a3c", clima: "Recomeçar tem seu tempo", efeito: "folhas" },
  desmotivado:     { cor: "#9cb06f", suave: "#e8eed9", fundo: ["#f0f3e8", "#e1e9d4"], texto: "#4a5a30", clima: "Um passo pequeno basta", efeito: "bolhas" },
  inseguro:        { cor: "#a58bc2", suave: "#ece5f3", fundo: ["#f2eef6", "#e4dced"], texto: "#55456a", clima: "Seu valor continua aqui", efeito: "orbes" },
  sobrecarregado:  { cor: "#5fa0a8", suave: "#d9eaec", fundo: ["#ebf2f3", "#d6e5e7"], texto: "#2f5558", clima: "Deixe a maré levar o peso", efeito: "ondas" },
  frustrado:       { cor: "#c79a64", suave: "#f1e6d6", fundo: ["#f5efe8", "#eadfd0"], texto: "#5d4a32", clima: "Respire e recomece", efeito: "brasas" },
  futuro:          { cor: "#6aa0c6", suave: "#dcebf4", fundo: ["#eaf1f6", "#d6e6f1"], texto: "#35566f", clima: "Um dia de cada vez", efeito: "vento" },
  depressivo:      { cor: "#8a97b8", suave: "#e3e7f0", fundo: ["#eceef3", "#dce1ec"], texto: "#424d6d", clima: "Acolhimento, sem cobrança", efeito: "chuva" },
  solitario:       { cor: "#b387b3", suave: "#eee0ee", fundo: ["#f4eef3", "#e6dbe6"], texto: "#5b4560", clima: "Você não está só", efeito: "vagalumes" },
  "sem-esperanca": { cor: "#5fa59b", suave: "#d9ece9", fundo: ["#eaf0f1", "#d6e4e4"], texto: "#2f5750", clima: "Uma luz pequena já é luz", efeito: "vagalumes" },
};

export const temaDe = (id) => TEMAS[id] || TEMAS.neutro;

/* Números "aleatórios" estáveis: as partículas não mudam de lugar a cada renderização. */
const rnd = (i, s) => {
  const x = Math.sin(i * 12.9898 + s * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

function particula(efeito, i, cor) {
  const esq = `${Math.round(rnd(i, 1) * 100)}%`;
  const dur = (a, b) => `${(a + rnd(i, 2) * (b - a)).toFixed(1)}s`;
  const atraso = `${(-rnd(i, 3) * 20).toFixed(1)}s`;
  const t = 6 + Math.round(rnd(i, 4) * 10);

  switch (efeito) {
    case "chuva":
      return { left: esq, top: 0, width: 2, height: 28 + Math.round(rnd(i, 5) * 30), borderRadius: 2,
        background: `linear-gradient(transparent,${cor}88)`, animation: `emoRain ${dur(1.6, 3.2)} linear ${atraso} infinite` };
    case "bolhas":
      return { left: esq, bottom: 0, width: t * 2, height: t * 2, borderRadius: "50%", border: `1.5px solid ${cor}66`, background: `${cor}14`,
        animation: `emoSobe ${dur(12, 22)} ease-in ${atraso} infinite` };
    case "brasas":
      return { left: esq, bottom: 0, width: t, height: t, borderRadius: "50%", background: `${cor}99`, filter: "blur(1px)",
        animation: `emoSobe ${dur(10, 18)} ease-out ${atraso} infinite` };
    case "folhas":
      return { left: esq, top: 0, width: t * 1.6, height: t, borderRadius: "80% 0 80% 0", background: `${cor}77`,
        animation: `emoFolha ${dur(14, 24)} linear ${atraso} infinite` };
    case "vento":
      return { left: 0, top: `${Math.round(rnd(i, 6) * 95)}%`, width: 120 + Math.round(rnd(i, 7) * 160), height: 2, borderRadius: 2,
        background: `linear-gradient(90deg,transparent,${cor}66,transparent)`, animation: `emoVento ${dur(14, 26)} linear ${atraso} infinite` };
    case "vagalumes":
      return { left: esq, top: `${Math.round(rnd(i, 8) * 90)}%`, width: 7, height: 7, borderRadius: "50%", background: "#ffe9a8",
        boxShadow: `0 0 14px 4px ${cor}99`, animation: `emoPisca ${dur(3, 7)} ease-in-out ${atraso} infinite` };
    default: // estrelas
      return { left: esq, top: `${Math.round(rnd(i, 9) * 85)}%`, width: 4, height: 4, borderRadius: "50%", background: cor,
        animation: `emoPisca ${dur(4, 9)} ease-in-out ${atraso} infinite` };
  }
}

function Ondas({ cor }) {
  const d = "M0 60 Q100 20 200 60 T400 60 T600 60 T800 60 T1000 60 T1200 60 T1400 60 T1600 60 V120 H0Z";
  return (
    <>
      {[["emoOnda 22s linear infinite", 0.14, 120], ["emoOnda 34s linear infinite reverse", 0.1, 90]].map(([anim, op, h], i) => (
        <svg key={i} className="emo-onda" viewBox="0 0 1600 120" preserveAspectRatio="none"
          style={{ position: "absolute", left: 0, bottom: i * 14, width: "200%", height: h, animation: anim }}>
          <path d={d} fill={cor} opacity={op} />
        </svg>
      ))}
    </>
  );
}

/**
 * Camada de ambiente: degradê próprio da emoção + animação suave.
 * Fica atrás do conteúdo. Troca com um fade quando a emoção muda.
 * Respeita "reduzir movimento": sem animação, só o degradê.
 */
export function AmbienteEmocao({ id }) {
  const t = temaDe(id);
  const orbes = t.efeito === "orbes";
  const quantidade = { chuva: 22, vento: 7, vagalumes: 14, bolhas: 14, brasas: 14, folhas: 12, estrelas: 22 }[t.efeito] || 0;

  return (
    <div key={id || "neutro"} className="emo-amb" aria-hidden="true"
      style={{ background: `radial-gradient(900px 480px at 50% -8%, ${t.cor}30, transparent 70%), linear-gradient(160deg, ${t.fundo[0]}, ${t.fundo[1]})` }}>
      <style>{`
.emo-amb{position:fixed;inset:0;z-index:0;overflow:hidden;pointer-events:none;animation:emoEntra 1s ease both}
.emo-amb .emo-p{position:absolute;opacity:.4}
@keyframes emoEntra{from{opacity:0}to{opacity:1}}
@keyframes emoRain{from{transform:translateY(-12vh)}to{transform:translateY(112vh)}}
@keyframes emoSobe{from{transform:translateY(8vh) scale(.6);opacity:0}15%{opacity:.55}to{transform:translateY(-110vh) scale(1.2);opacity:0}}
@keyframes emoPisca{0%,100%{opacity:.08;transform:scale(.8)}50%{opacity:.85;transform:scale(1.25)}}
@keyframes emoFolha{from{transform:translate(0,-10vh) rotate(0)}to{transform:translate(9vw,112vh) rotate(360deg)}}
@keyframes emoRespira{0%,100%{transform:scale(.88);opacity:.3}50%{transform:scale(1.18);opacity:.6}}
@keyframes emoVento{from{transform:translateX(-30vw)}to{transform:translateX(130vw)}}
@keyframes emoOnda{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@media(prefers-reduced-motion:reduce){.emo-amb *,.emo-amb{animation:none!important}}
      `}</style>

      {orbes && [0, 1, 2].map((i) => (
        <span key={i} className="emo-p" style={{
          left: `${15 + i * 32}%`, top: `${18 + (i % 2) * 34}%`, width: 280 - i * 40, height: 280 - i * 40, borderRadius: "50%",
          background: `radial-gradient(circle,${t.cor}55,transparent 70%)`, opacity: 0.4, animation: `emoRespira ${9 + i * 3}s ease-in-out ${-i * 3}s infinite`,
        }} />
      ))}

      {t.efeito === "ondas" && <Ondas cor={t.cor} />}

      {Array.from({ length: quantidade }, (_, i) => (
        <span key={i} className="emo-p" style={particula(t.efeito, i, t.cor)} />
      ))}
    </div>
  );
}