import React, { useState } from "react";
import { supabase } from "../lib/supabase";

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:3001" : "");

/* Palavras e expressões bloqueadas. Frases que já contêm uma palavra da lista
   (ex.: "idiota de merda", "seu babaca") continuam bloqueadas pela palavra-base. */
const palavrasOfensivas = [
  "idiota","imbecil","burro","burra","otario","otaria","otário","otária","retardado","retardada","babaca","besta","cretino","cretina","canalha","patife","inutil","inútil","incompetente","palhaco","palhaço","palhaca","palhaça","sem noção","sem nocao","animal","verme","lixo","fracassado","fracassada","ridiculo","ridículo","ridicula","ridícula","nojento","nojenta","asqueroso","asquerosa","repugnante","desgraçado","desgracado","desgraçada","desgracada","maldito","maldita","miseravel","miserável","safado","safada","sacana","vagabundo","vagabunda","moleque","moleca",
  "merda","merdinha","merdao","merdão","porra","porrinha","caralho","caralhinho","cacete","caceteiro","caceteira","foda","foda-se","fodase","foder","fudê","fude","fuder","fudido","fudida","fodido","fodida","fucking","fuck","shit","bosta","bostinha","bostao","bostão","cu","cuzinho","cuzão","cuzao","cuzona","buceta","bucetinha","bucetao","bucetão","xota","xoxota","xoxotinha","pica","picao","picão","piroca","piroquinha","rola","rolinha","pau no cu",
  "filho da puta","filha da puta","filho de uma puta","filha de uma puta","filho de puta","filha de puta","filho duma puta","filha duma puta","filho do caralho","filha do caralho","puta que pariu","puta que o pariu",
  "vai se foder","vai tomar no cu","vai pro inferno","vai para o inferno","vai à merda","vai a merda","vai pra merda","vai para merda","vai se ferrar","vai se lascar","vai se danar","foda se voce","foda se você","que se foda","que se dane","que se lasque","que se ferre",
  "puta","puto","putinha","vadia","vadiazinha","piranha","cachorra","galinha","tomar no cu","tomou no cu","toma no cu","enfia no cu","enfia isso no cu","enfia essa merda","enfia essa porra","enfia isso","chupa","chupa meu pau","vai chupar","lambe meu","se foder","se fode","foda voce","foda você",
  "vou te matar","eu vou te matar","quero te matar","vou acabar com voce","vou acabar com você","vou acabar contigo","quero acabar contigo","vou te pegar","vou te arrebentar","vou te bater","vou bater em voce","vou bater em você","vou te espancar","vou quebrar sua cara","quebrar sua cara","vou acabar com sua vida","acabar com sua vida","merece morrer","você merece morrer","voce merece morrer","tomara que morra","tomara que voce morra","tomara que você morra","vai morrer","vou fazer voce sofrer","vou fazer você sofrer",
  "lixo humano","ser humano lixo","escoria","escória","sem vergonha","sem-vergonha","cara de pau","pedaço de merda","pedaco de merda","bando de idiotas","bando de imbecis","bando de babacas",
  "fdp","f d p","f.d.p","vsf","vai tomar no c","vtc","vtnc","pqp","p q p","p.q.p","tnc","toma no c",
];

const FRASES = [
  "Hoje eu estou me sentindo…",
  "Algo que me incomoda é…",
  "Preciso de apoio com…",
  "Uma coisa boa que aconteceu foi…",
];

const MAX = 1000;


function normalizarTexto(conteudo) {
  const num = { 0: "o", 1: "i", 2: "z", 3: "e", 4: "a", 5: "s", 6: "g", 7: "t", 8: "b", 9: "g" };
  const sim = { "@": "a", "!": "i", "$": "s" };
  return conteudo
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[0-9]/g, (n) => num[n] || n)
    .replace(/[@!$]/g, (s) => sim[s] || s)
    .replace(/[.,!?;:()[\]{}"'`´~^_*+=<>/@#$%&|\\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function possuiPalavraOfensiva(conteudo) {
  const t = normalizarTexto(conteudo);
  return palavrasOfensivas.some((p) => {
    const pn = normalizarTexto(p);
    if (!pn) return false;
    if (pn.includes(" ")) return t.includes(pn);
    return new RegExp(`(^|\\s)${pn}(?=\\s|$)`, "i").test(t);
  });
}

function obterPerfilAtual() {
  let usuario = {};
  for (const chave of ["usuarioLogado", "pulsanUsuarioAtual"]) {
    try {
      const valor = JSON.parse(localStorage.getItem(chave) || "{}");
      if (valor && Object.keys(valor).length) { usuario = valor; break; }
    } catch { /* tenta a próxima chave */ }
  }
  const tipo = String(
    localStorage.getItem("pulsanTipo") || usuario.tipo_usuario || usuario.tipo ||
    usuario.user_metadata?.tipo_usuario || usuario.user_metadata?.tipo || "aluno"
  ).toLowerCase().trim();
  if (["colaborador", "funcionario", "funcionário", "employee", "empresa"].includes(tipo)) return "colaborador";
  if (["visitante", "visitor"].includes(tipo)) return "visitante";
  if (["psicologo", "psicóloga", "psicologo_parceiro", "psychologist"].includes(tipo)) return "psicologo";
  if (["admin", "administrador", "equipe_pulsan"].includes(tipo)) return "admin";
  return "aluno";
}

/* Tema escuro: suave, porém escuro. Use tema="claro" | "escuro" | "auto" (segue o sistema). */
const DARK = "--bg1:#10171d;--surf:#18222a;--surf2:#1e2a33;--line:#2a3a45;--ink:#e4eef2;--mut:#94a9b4;--ph:#6c8290;--ac:#5cc8cb;--acs:#1c3a40;--btn:#4fc3c6;--btn2:#68d1d4;--onbtn:#0b2327;--shadow:0 10px 30px #00000040;--glow1:#1a3a42aa;--glow2:#2b2a3dbb;--chip:#1e2a33;--navbg:#141d24;--ring:#4fc3c633;";

const Icone = ({ d, c = "currentColor" }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);

function Desabafar({ irPara, tema = "auto" }) {
  const [texto, setTexto] = useState("");
  const [analisando, setAnalisando] = useState(false);
  const [foco, setFoco] = useState(false);

  const tipoPerfil = obterPerfilAtual();
  const ambienteSalvoBruto = localStorage.getItem("pulsanAmbiente");
  const ambienteSalvo = ambienteSalvoBruto === "empresa" ? "trabalho" : ambienteSalvoBruto;
  const ambiente = tipoPerfil === "colaborador" ? "trabalho"
    : tipoPerfil === "aluno" ? "escola"
    : tipoPerfil === "visitante" ? "geral"
    : ["escola", "trabalho", "geral"].includes(ambienteSalvo) ? ambienteSalvo : "geral";

  async function publicarDesabafo(e) {
    e.preventDefault();
    const conteudo = texto.trim();

    if (tipoPerfil === "admin") { alert("A equipe Pulsan não publica desabafos nesta área."); return; }
    if (!conteudo) { alert("Escreva algo antes de publicar."); return; }
    if (possuiPalavraOfensiva(conteudo)) {
      alert("Seu desabafo contém linguagem inadequada.\n\nPor favor, revise o texto antes de publicar.");
      return;
    }

    setAnalisando(true);
    try {
      let classificacao = "normal";
      let alerta = false;
      let resultadoIA = null;

      // Análise por IA (somente escola)
      if (ambiente === "escola") {
        try {
          const resposta = await fetch(`${API_URL}/api/analisar-desabafo`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ texto: conteudo, ambiente: "escola" }),
          });
          if (resposta.ok) {
            resultadoIA = await resposta.json();
            if (resultadoIA.publicarPermitido === false) {
              alert(resultadoIA.motivoModeracao || "Seu desabafo contém linguagem ofensiva ou inadequada. Revise o texto antes de publicar.");
              return;
            }
            if (["urgente", "grave", "intermediario"].includes(resultadoIA.classificacao)) {
              classificacao = resultadoIA.classificacao;
              alerta = true;
            }
          }
        } catch (erro) {
          console.error("Erro na análise da IA:", erro);
          classificacao = "normal";
          alerta = false;
        }
      }

      // Usuário autenticado
      const { data: usuarioAutenticado, error: erroUsuario } = await supabase.auth.getUser();
      if (erroUsuario || !usuarioAutenticado?.user) { alert("Faça login para publicar seu desabafo."); return; }
      const usuarioId = usuarioAutenticado.user.id;

      // posts_ambiente possui somente os campos básicos confirmados no banco.
      const resultadoInsercao = await supabase.from("posts_ambiente").insert({
        usuario_id: usuarioId,
        texto: conteudo,
        nome_usuario: "Anônimo",
        ambiente,
      });
      if (resultadoInsercao.error) {
        console.error("Erro ao salvar desabafo no Supabase:", resultadoInsercao.error);
        alert(resultadoInsercao.error.message
          ? `Não foi possível publicar agora.\n\n${resultadoInsercao.error.message}`
          : "Não foi possível publicar agora. Tente novamente.");
        return;
      }

      const novaPublicacao = {
        id: null,
        texto: conteudo,
        autor: "Anônimo",
        hora: "Agora",
        ambiente,
        classificacao,
        alerta,
        apoios: 0,
        apoiado: false,
        comentarios: [],
      };

      // O backend já cria o alerta real no Supabase durante a análise.
      if (ambiente === "escola" && alerta && resultadoIA) {
        console.log("🔔 Alerta real processado:", {
          classificacao: resultadoIA.classificacao,
          prioridade: resultadoIA.prioridade,
          tipo: resultadoIA.tipo,
          motivo: resultadoIA.motivo,
        });
      }

      // Alerta local
      if (ambiente === "escola" && ["intermediario", "grave", "urgente"].includes(classificacao)) {
        localStorage.setItem("pulsanNovoAlerta", "true");
        localStorage.setItem("pulsanTipoAlerta", classificacao);
        localStorage.setItem("pulsanAlertaPublicacao", JSON.stringify(novaPublicacao));
      }

      setTexto("");

      if (ambiente === "escola" && (classificacao === "urgente" || classificacao === "grave")) {
        alert("Seu desabafo foi publicado.\n\nNossa equipe poderá acompanhar a situação.");
      } else if (ambiente === "escola" && classificacao === "intermediario") {
        alert("Seu desabafo foi publicado.\n\nEle poderá receber atenção adicional.");
      } else {
        alert("Seu desabafo foi publicado anonimamente.");
      }

      irPara("ambiente");
    } finally {
      setAnalisando(false);
    }
  }

  const n = texto.length;
  const pct = Math.min(n / MAX, 1);
  const escola = ambiente === "escola";
  const nav = [
    { id: "solicitacoes", nome: "Conversas", d: "M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" },
    { id: "ajudar", nome: "Ajudar", d: "M12 21s-7-4.4-9-9.2C1.6 8 4 5 7 5c2 0 3.4 1 5 3 1.6-2 3-3 5-3 3 0 5.4 3 4 6.8C19 16.6 12 21 12 21z", ativo: true },
    { id: "perfil", nome: "Perfil", d: "M20 21a8 8 0 0 0-16 0M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" },
  ];
  const LOCK = "M6 11V8a6 6 0 0 1 12 0v3M5 11h14v10H5z";
  const info = [
    { d: LOCK, t: "Anonimato", p: "Sua publicação aparece como “Anônimo” para as outras pessoas." },
    { d: "M12 3l8 3v6c0 4.5-3.2 8.3-8 9-4.8-.7-8-4.5-8-9V6l8-3zM9 12l2 2 4-4", t: "Moderação", p: escola
      ? "O texto passa por moderação de linguagem e por análise contextual, para identificar situações que possam precisar de atenção."
      : "O texto passa por moderação de linguagem, para manter as conversas respeitosas." },
    { d: "M12 8v4m0 4h.01M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z", t: "Precisa de ajuda agora?", p: "Em situação de risco imediato, ligue 188 (CVV, 24 h) ou 192 (SAMU)." },
  ];

  return (
    <div className="ds" data-tema={tema}>
      <style>{`
.ds{--bg1:#f8fbfc;--surf:#ffffff;--surf2:#f5fafb;--line:#e6eef1;--ink:#1f3b46;--mut:#6a8590;--ph:#9db0b8;--ac:#17797d;--acs:#e6f5f5;--btn:#1f8f93;--btn2:#177579;--onbtn:#ffffff;--shadow:0 10px 30px #1f3b460d;--glow1:#d8f1f2cc;--glow2:#fdebe1cc;--chip:#f4f9fa;--navbg:#ffffff;--ring:#1f8f9326;
min-height:100vh;padding-bottom:190px;color:var(--ink);font-family:inherit;background:radial-gradient(900px 440px at 88% -8%,var(--glow1),transparent 70%),radial-gradient(760px 420px at -8% 34%,var(--glow2),transparent 70%),var(--bg1)}
.ds[data-tema="escuro"]{${DARK}}
@media(prefers-color-scheme:dark){.ds[data-tema="auto"]{${DARK}}}
[data-theme="dark"] .ds[data-tema="auto"],.dark .ds[data-tema="auto"]{${DARK}}
.ds *{box-sizing:border-box}
.ds-head{border-bottom:1px solid var(--line);background:color-mix(in srgb,var(--surf) 78%,transparent);backdrop-filter:blur(10px)}
.ds-head-in{max-width:1100px;margin:0 auto;padding:14px 28px;display:flex;align-items:center;gap:22px}
.ds-back{border:1px solid var(--line);background:var(--surf);color:var(--ink);border-radius:12px;padding:9px 15px;font:inherit;font-size:14px;cursor:pointer;transition:background .15s,transform .15s}
.ds-back:hover{background:var(--surf2);transform:translateX(-2px)}
.ds-logo{display:flex;align-items:center;gap:10px}
.ds-logo svg path{stroke:var(--ac)}
.ds-logo strong{font-size:18px;letter-spacing:.1em}
.ds-logo small{display:block;color:var(--mut);font-size:12px;margin-top:1px}
.ds-main{max-width:1100px;margin:0 auto;padding:44px 28px 0;display:grid;grid-template-columns:minmax(0,1fr) 310px;gap:32px;align-items:start}
.ds-eyebrow{display:inline-flex;align-items:center;gap:8px;margin:0 0 10px;padding:5px 12px;border-radius:999px;background:var(--acs);font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--ac)}
.ds h1{margin:0 0 12px;font-size:clamp(28px,3.8vw,38px);line-height:1.18;letter-spacing:-.02em;font-weight:750}
.ds-lead{margin:0 0 26px;font-size:16.5px;line-height:1.75;color:var(--mut);max-width:600px}
.ds-card{background:var(--surf);border:1px solid var(--line);border-radius:22px;box-shadow:var(--shadow);overflow:hidden;transition:border-color .2s,box-shadow .2s}
.ds-card.on{border-color:var(--btn);box-shadow:0 0 0 4px var(--ring),var(--shadow)}
.ds-cardtop{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:15px 22px;border-bottom:1px solid var(--line);font-size:13px;color:var(--mut)}
.ds-tag{display:inline-flex;align-items:center;gap:8px;font-weight:650;color:var(--ac)}
.ds-card textarea{display:block;width:100%;min-height:290px;border:0;outline:0;resize:vertical;padding:22px;font:inherit;font-size:16.5px;line-height:1.75;color:var(--ink);background:transparent}
.ds-card textarea::placeholder{color:var(--ph)}
.ds-foot{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;padding:14px 22px;border-top:1px solid var(--line);background:var(--surf2);font-size:13px;color:var(--mut)}
.ds-sug{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.ds-chip{border:1px solid var(--line);background:var(--chip);color:var(--ink);padding:7px 12px;border-radius:10px;font:inherit;font-size:12.5px;cursor:pointer;transition:background .15s,border-color .15s,transform .15s}
.ds-chip:hover:not(:disabled){border-color:var(--btn);background:var(--acs);transform:translateY(-1px)}
.ds-meter{height:3px;background:var(--line)}
.ds-meter span{display:block;height:100%;background:var(--btn);transition:width .2s}
.ds-aside{display:flex;flex-direction:column;gap:14px;position:sticky;top:24px}
.ds-note{display:flex;gap:14px;padding:18px;background:var(--surf);border:1px solid var(--line);border-radius:18px;box-shadow:var(--shadow);font-size:13px;line-height:1.65;color:var(--mut)}
.ds-note b{display:block;margin-bottom:3px;font-size:14.5px;color:var(--ink)}
.ds-ic{flex:none;width:38px;height:38px;border-radius:12px;background:var(--acs);color:var(--ac);display:grid;place-items:center}
.ds-dock{position:fixed;left:0;right:0;bottom:78px;z-index:999;background:color-mix(in srgb,var(--surf) 88%,transparent);backdrop-filter:blur(12px);border-top:1px solid var(--line)}
.ds-dock-in{max-width:1100px;margin:0 auto;padding:13px 28px;display:flex;align-items:center;justify-content:space-between;gap:18px}
.ds-dock p{margin:0;font-size:13px;color:var(--mut);line-height:1.5}
.ds-btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;min-width:230px;border:0;padding:15px 28px;border-radius:14px;background:var(--btn);color:var(--onbtn);font:inherit;font-size:16px;font-weight:650;cursor:pointer;box-shadow:0 8px 20px color-mix(in srgb,var(--btn) 30%,transparent);transition:background .15s,transform .15s,opacity .15s}
.ds-btn:hover:not(:disabled){background:var(--btn2);transform:translateY(-1px)}
.ds-btn.vazio{opacity:.55;box-shadow:none}
.ds-btn:disabled{cursor:wait;opacity:.8}
.ds-spin{width:16px;height:16px;border:2.5px solid color-mix(in srgb,var(--onbtn) 35%,transparent);border-top-color:var(--onbtn);border-radius:50%;animation:dsSpin .8s linear infinite}
@keyframes dsSpin{to{transform:rotate(360deg)}}
.ds-nav{position:fixed;left:0;right:0;bottom:0;height:78px;display:flex;justify-content:space-around;align-items:center;background:var(--navbg,var(--surf));border-top:1px solid var(--line);z-index:1000;padding-bottom:env(safe-area-inset-bottom,0)}
.ds-nav button{border:0;background:transparent;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:4px;color:var(--mut);font:inherit;font-size:12px;font-weight:600;padding:8px 24px;border-radius:14px;transition:background .15s}
.ds-nav button.a{color:var(--ac);background:var(--acs)}
.ds button:focus-visible,.ds textarea:focus-visible{outline:3px solid var(--ring);outline-offset:2px}
@media(max-width:860px){
.ds{min-height:100dvh;padding-bottom:calc(154px + env(safe-area-inset-bottom,0px));overflow-x:hidden}
.ds-main{width:100%;max-width:680px;grid-template-columns:minmax(0,1fr);padding:24px 16px 0;gap:20px}
.ds-main>section,.ds-aside{min-width:0;width:100%}
.ds-aside{position:static;gap:10px}
.ds-head-in{padding:12px 16px;gap:12px}
.ds-back{flex:none;padding:9px 12px}
.ds-logo{min-width:0}
.ds-logo strong{font-size:16px}
.ds-logo small{font-size:11px}
.ds h1{font-size:clamp(25px,7vw,32px);overflow-wrap:anywhere}
.ds-lead{font-size:15px;line-height:1.6;margin-bottom:20px}
.ds-card{width:100%;border-radius:18px}
.ds-cardtop{padding:13px 15px;align-items:flex-start;flex-wrap:wrap;font-size:12px}
.ds-card textarea{min-height:220px;padding:17px 15px;font-size:16px;line-height:1.6}
.ds-foot{padding:12px 15px;align-items:flex-start}
.ds-sug{width:100%;gap:7px}
.ds-chip{max-width:100%;white-space:normal;text-align:left;line-height:1.35}
.ds-note{padding:14px;gap:11px;font-size:12.5px}
.ds-ic{width:34px;height:34px}
.ds-dock{bottom:calc(70px + env(safe-area-inset-bottom,0px));}
.ds-dock-in{width:100%;padding:10px 14px;gap:10px}
.ds-dock p{display:none}
.ds-btn{width:100%;min-width:0;padding:14px 16px;font-size:15px}
.ds-nav{height:calc(70px + env(safe-area-inset-bottom,0px));padding:6px 8px env(safe-area-inset-bottom,0px)}
.ds-nav button{flex:1;min-width:0;padding:7px 4px;font-size:11px}
.ds-nav button svg{width:21px;height:21px}
}
@media(max-width:380px){
.ds-main{padding-left:12px;padding-right:12px}
.ds-head-in{padding-left:12px;padding-right:12px}
.ds-cardtop{gap:7px}
.ds-cardtop>span:last-child{font-size:11px}
.ds-foot{gap:8px}
.ds-note{padding:12px}
.ds-dock-in{padding-left:10px;padding-right:10px}
}
@media(prefers-reduced-motion:reduce){.ds *{transition:none!important;animation:none!important}}
      `}</style>

      <header className="ds-head">
        <div className="ds-head-in">
          <button type="button" className="ds-back" onClick={() => irPara("ambiente")}>← Voltar</button>
          <div className="ds-logo">
            <svg width="34" height="22" viewBox="0 0 38 24" aria-hidden="true"><path d="M1 13 H10 l4 -8 l6 18 l5 -14 l3 4 H37" fill="none" stroke="#168f92" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <div><strong>PULSAN</strong><small>Um espaço seguro para falar</small></div>
          </div>
        </div>
      </header>

      <form className="ds-main" onSubmit={publicarDesabafo}>
        <section>
          <p className="ds-eyebrow">Desabafar</p>
          <h1>Compartilhe o que está acontecendo</h1>
          <p className="ds-lead">Escreva com calma e no seu ritmo. Você pode desabafar, pedir apoio ou contar como está se sentindo, sem precisar se identificar.</p>

          <div className={`ds-card ${foco ? "on" : ""}`}>
            <div className="ds-cardtop">
              <span className="ds-tag"><Icone d={LOCK} />Publicação anônima</span>
              <span>{escola ? "Ambiente escolar" : "Ambiente corporativo"}</span>
            </div>
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              onFocus={() => setFoco(true)}
              onBlur={() => setFoco(false)}
              onKeyDown={(e) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); e.currentTarget.form?.requestSubmit(); } }}
              placeholder="Escreva aqui o que deseja compartilhar..."
              maxLength={MAX}
              disabled={analisando}
              aria-label="Seu desabafo"
              style={{ opacity: analisando ? 0.6 : 1 }}
            />
            <div className="ds-foot">
              <div className="ds-sug">
                <span>Para começar:</span>
                {FRASES.map((f) => (
                  <button key={f} type="button" className="ds-chip" disabled={analisando}
                    onClick={() => setTexto((t) => (t ? `${t.trimEnd()} ${f} ` : `${f} `).slice(0, MAX))}>{f}</button>
                ))}
              </div>
              <span>{n}/{MAX}</span>
            </div>
            <div className="ds-meter" aria-hidden="true"><span style={{ width: `${pct * 100}%` }} /></div>
          </div>
        </section>

        <aside className="ds-aside" aria-label="Informações">
          {info.map((i) => (
            <div className="ds-note" key={i.t}>
              <span className="ds-ic"><Icone d={i.d} /></span>
              <div><b>{i.t}</b>{i.p}</div>
            </div>
          ))}
        </aside>

        <div className="ds-dock">
          <div className="ds-dock-in">
            <p>Revise com calma antes de enviar. Atalho: Ctrl + Enter.</p>
            <button type="submit" className={`ds-btn ${n ? "" : "vazio"}`} disabled={analisando}>
              {analisando ? (<><span className="ds-spin" />Analisando…</>) : "Publicar anonimamente"}
            </button>
          </div>
        </div>
      </form>

      <nav className="ds-nav" aria-label="Navegação">
        {nav.map((x) => (
          <button key={x.id} type="button" className={x.ativo ? "a" : ""} onClick={() => irPara(x.id)}>
            <Icone d={x.d} />
            <span>{x.nome}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default Desabafar;