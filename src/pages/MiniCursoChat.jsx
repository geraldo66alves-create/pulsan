import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

const ETAPAS = [
  {
    id: 1, titulo: "Perceber", subtitulo: "Nem todo pedido de ajuda é feito em voz alta.", video: "/videos/mini-curso/etapa-1.mp4",
    abertura: "Antes de ajudar alguém, precisamos aprender a perceber quando uma pessoa pode estar passando por um momento difícil.",
    mensagem: "Perceber não significa diagnosticar o que alguém está sentindo. Significa notar mudanças, demonstrar cuidado e mostrar que aquela pessoa não está invisível.",
    situacao: "Uma pessoa que normalmente conversa bastante está mais quieta nos últimos dias. Quando alguém pergunta se está tudo bem, ela responde apenas: \"Estou normal.\" O que você faria?",
    opcoes: [
      { texto: "Deixaria passar. Se ela quiser conversar, vai procurar alguém.", correta: false, explicacao: "Nem sempre quem precisa de ajuda consegue dar o primeiro passo. Demonstrar disponibilidade pode fazer diferença." },
      { texto: "Perguntaria com cuidado se está tudo bem e mostraria que estou disponível para ouvir.", correta: true, explicacao: "Perfeito. Você não está obrigando a pessoa a falar. Está apenas mostrando que percebeu e que existe alguém disponível." },
      { texto: "Perguntaria imediatamente o que aconteceu e insistiria até ela responder.", correta: false, explicacao: "Demonstrar preocupação é importante, mas pressionar pode fazer a pessoa se fechar ainda mais." }
    ]
  },
  {
    id: 2, titulo: "Aproximar", subtitulo: "Como chegar sem invadir.", video: "/videos/mini-curso/etapa-2.mp4",
    abertura: "Agora que você percebeu que alguém pode não estar bem, vem uma pergunta importante: como chegar perto sem transformar cuidado em pressão?",
    mensagem: "Uma abordagem acolhedora deixa espaço para a pessoa escolher se quer conversar. Você demonstra preocupação sem exigir uma explicação.",
    situacao: "Você percebe que alguém está diferente. Qual destas abordagens demonstra mais cuidado?",
    opcoes: [
      { texto: "\"O que aconteceu? Você precisa me contar agora.\"", correta: false, explicacao: "A intenção pode ser boa, mas a frase coloca pressão e tira da pessoa o direito de escolher quando falar." },
      { texto: "\"Percebi que você parece um pouco diferente. Está tudo bem? Se quiser conversar, estou aqui.\"", correta: true, explicacao: "Essa abordagem demonstra atenção, mas respeita o espaço da pessoa." },
      { texto: "\"Você está estranho ultimamente. Tem alguma coisa errada com você?\"", correta: false, explicacao: "A frase pode soar como julgamento. O ideal é demonstrar cuidado sem rotular a pessoa." }
    ]
  },
  {
    id: 3, titulo: "Escutar", subtitulo: "Ouvir é mais do que esperar sua vez de falar.", video: "/videos/mini-curso/etapa-3.mp4",
    abertura: "Quando alguém começa a desabafar, talvez você já queira responder, aconselhar ou contar uma experiência parecida. Mas existe algo que vem antes: escutar.",
    mensagem: "Escutar de verdade é prestar atenção, não interromper, não transformar a conversa em uma competição e tentar compreender o que a pessoa está vivendo.",
    situacao: "A pessoa diz: \"Eu estou cansado de fingir que está tudo bem.\" Qual resposta demonstra mais disponibilidade para ouvir?",
    opcoes: [
      { texto: "\"Eu sei como é. Comigo aconteceu algo muito pior.\"", correta: false, explicacao: "Comparar sofrimentos pode fazer a pessoa sentir que sua experiência foi diminuída." },
      { texto: "\"Você precisa pensar positivo. Isso vai passar.\"", correta: false, explicacao: "A frase tenta resolver rapidamente algo que ainda precisa ser compreendido." },
      { texto: "\"Imagino que esteja sendo difícil. Se quiser, pode me contar o que está acontecendo.\"", correta: true, explicacao: "Essa resposta reconhece o sentimento e deixa a pessoa livre para continuar." }
    ]
  },
  {
    id: 4, titulo: "Acolher", subtitulo: "Você não precisa resolver para fazer diferença.", video: "/videos/mini-curso/etapa-4.mp4",
    abertura: "Acolher não significa ter a resposta perfeita. Muitas vezes, significa fazer alguém perceber que seus sentimentos não foram ignorados.",
    mensagem: "Antes de oferecer soluções, procure compreender. Evite diminuir sentimentos, julgar ou dizer que a pessoa deveria simplesmente esquecer o problema.",
    situacao: "Alguém diz: \"Eu estou muito sobrecarregado e não sei mais o que fazer.\" Qual resposta é mais acolhedora?",
    opcoes: [
      { texto: "\"Todo mundo passa por isso. Você precisa ser forte.\"", correta: false, explicacao: "A frase pode fazer a pessoa sentir que não deveria estar sofrendo." },
      { texto: "\"Entendo que isso esteja pesado para você. Quer me contar um pouco mais?\"", correta: true, explicacao: "Você reconhece o que a pessoa está sentindo e abre espaço para ela falar." },
      { texto: "\"Se fosse comigo, eu faria exatamente isso...\"", correta: false, explicacao: "A experiência de cada pessoa é diferente. O primeiro passo é compreender, não substituir a história dela pela sua." }
    ]
  },
  {
    id: 5, titulo: "Respeitar", subtitulo: "Confiança também é saber guardar.", video: "/videos/mini-curso/etapa-5.mp4",
    abertura: "Quando alguém compartilha algo pessoal, ela está confiando em você. Essa confiança precisa ser tratada com responsabilidade.",
    mensagem: "Não compartilhe histórias, prints ou informações pessoais. Também respeite quando alguém não quiser continuar uma conversa.",
    situacao: "Depois de uma conversa no PULSAN, um amigo pergunta o que a outra pessoa contou. O que você faria?",
    opcoes: [
      { texto: "Contaria porque meu amigo é de confiança.", correta: false, explicacao: "A informação foi confiada a você, não ao seu amigo. Privacidade continua sendo importante." },
      { texto: "Contaria apenas uma parte.", correta: false, explicacao: "Compartilhar apenas uma parte ainda quebra a confiança da pessoa." },
      { texto: "Preservaria a conversa e não compartilharia o que foi confiado.", correta: true, explicacao: "Exatamente. Acolhimento também significa proteger a privacidade." }
    ]
  },
  {
    id: 6, titulo: "Reconhecer seus limites", subtitulo: "Ajudar não significa carregar tudo sozinho.", video: "/videos/mini-curso/etapa-6.mp4",
    abertura: "Existe uma coisa importante que você precisa lembrar: você não precisa resolver a vida de alguém para ajudar.",
    mensagem: "Seu papel é ouvir, acolher e reconhecer quando uma situação ultrapassa aquilo que você consegue oferecer. Em situações graves, é importante buscar o apoio adequado.",
    situacao: "Durante uma conversa, você percebe que a situação é muito mais séria do que imaginava. O que fazer?",
    opcoes: [
      { texto: "Tentar resolver tudo sozinho para não abandonar a pessoa.", correta: false, explicacao: "Você não precisa assumir sozinho uma situação que exige apoio adequado." },
      { texto: "Continuar ouvindo com cuidado, reconhecer seus limites e incentivar a busca pelo apoio adequado quando necessário.", correta: true, explicacao: "Essa é uma postura responsável. Acolher também é saber quando procurar ajuda." },
      { texto: "Encerrar a conversa imediatamente sem explicar nada.", correta: false, explicacao: "Reconhecer limites não significa abandonar a pessoa. É possível estabelecer limites com respeito." }
    ]
  },
  {
    id: 7, titulo: "Desafio final", subtitulo: "Agora vamos descobrir se você está preparado.", video: "/videos/mini-curso/etapa-7.mp4",
    abertura: "Agora você conhece os principais princípios. Mas conhecer é diferente de saber aplicar. Vamos testar suas decisões.",
    mensagem: "Pense como se a pessoa estivesse realmente na sua frente. Não procure apenas a resposta que parece bonita. Pense no que realmente seria acolhedor e responsável.",
    situacao: "Uma pessoa diz: \"Não quero incomodar ninguém com os meus problemas.\" Qual resposta você considera mais acolhedora?",
    opcoes: [
      { texto: "\"Você está incomodando mesmo, mas pode falar.\"", correta: false, explicacao: "Essa resposta pode reforçar o medo da pessoa de incomodar." },
      { texto: "\"Você não precisa passar por isso sozinho. Se quiser falar, eu estou aqui para ouvir.\"", correta: true, explicacao: "Você demonstra disponibilidade sem obrigar a pessoa a falar." },
      { texto: "\"Todo mundo tem problemas, então tente esquecer isso.\"", correta: false, explicacao: "Comparar problemas pode diminuir o sentimento da pessoa." }
    ]
  }
];

const TOTAL_ETAPAS = ETAPAS.length;
const num = (v, d = 0) => { const n = Number(v); return Number.isFinite(n) ? n : d; };
const embaralhar = (n) => {
  const a = [...Array(n).keys()];
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};

function obterUsuario() {
  if (typeof window === "undefined") return "visitante-local";
  for (const chave of ["usuarioLogado", "pulsanUsuarioAtual"]) {
    try {
      const usuario = JSON.parse(localStorage.getItem(chave) || "{}");
      if (usuario?.id || usuario?.email) return String(usuario.id || usuario.email);
    } catch { /* tenta a próxima chave */ }
  }
  return "visitante-local";
}

export default function MiniCursoChat({ irPara, tema = "claro", acessibilidade = {}, alterarAcessibilidade }) {
  const usuario = obterUsuario();
  const chave = (nome) => `pulsanMiniCursoChat_${usuario}_${nome}`;
  const reduzir = acessibilidade?.reduzirAnimacoes === true;

  // O progresso só avança quando a pessoa acerta. A etapa salva é sempre a próxima a ser vencida.
  const [etapaAtual, setEtapaAtual] = useState(() => {
    if (typeof window === "undefined") return 1;
    const salvo = num(localStorage.getItem(chave("Etapa")) || localStorage.getItem("pulsanMiniCursoChatEtapa"), 1);
    return Math.min(Math.max(salvo, 1), TOTAL_ETAPAS);
  });
  const [retomou] = useState(() => typeof window !== "undefined" && num(localStorage.getItem(chave("Etapa")), 1) > 1);
  const [selecionada, setSelecionada] = useState(null);
  const [confirmada, setConfirmada] = useState(false);
  const [tentativasEtapa, setTentativasEtapa] = useState(0);
  const [ordem, setOrdem] = useState(() => embaralhar(3));
  const [acertos, setAcertos] = useState(() => (typeof window === "undefined" ? 0 : num(localStorage.getItem(chave("Acertos")) || localStorage.getItem("pulsanMiniCursoChatAcertos"), 0)));
  const [erros, setErros] = useState(() => (typeof window === "undefined" ? 0 : num(localStorage.getItem(chave("Erros")), 0)));
  const [concluido, setConcluido] = useState(false);
  const [carregandoStatus, setCarregandoStatus] = useState(true);
  const [salvandoConclusao, setSalvandoConclusao] = useState(false);
  const [erroConclusao, setErroConclusao] = useState("");
  const [videoErro, setVideoErro] = useState(false);

  useEffect(() => {
    let ativo = true;
    async function carregarStatus() {
      try {
        const { data, error } = await supabase.rpc("pulsan_status_minicurso_chat");
        if (error) throw error;
        if (!ativo) return;
        if (data?.concluido === true && Number(data?.etapas_concluidas) === TOTAL_ETAPAS) {
          setConcluido(true);
          setEtapaAtual(TOTAL_ETAPAS);
          localStorage.setItem(chave("Concluido"), "true");
          localStorage.setItem(chave("ConcluidoEm"), data?.concluido_em || new Date().toISOString());
          localStorage.setItem(chave("Etapa"), String(TOTAL_ETAPAS));
        }
      } catch (erro) {
        console.error("Erro ao consultar progresso do minicurso:", erro);
      } finally {
        if (ativo) setCarregandoStatus(false);
      }
    }
    carregarStatus();
    return () => { ativo = false; };
  }, []);

  useEffect(() => { setVideoErro(false); }, [etapaAtual]);

  const etapa = ETAPAS[etapaAtual - 1];
  const acertou = confirmada && selecionada !== null && etapa.opcoes[selecionada].correta;
  const errou = confirmada && selecionada !== null && !etapa.opcoes[selecionada].correta;
  const concluidas = etapaAtual - 1 + (acertou ? 1 : 0);
  const progresso = useMemo(() => Math.round((concluidas / TOTAL_ETAPAS) * 100), [concluidas]);

  const rolar = (id) => document.getElementById(id)?.scrollIntoView({ behavior: reduzir ? "auto" : "smooth", block: "start" });

  function responder(indice) {
    if (confirmada || salvandoConclusao) return;
    setSelecionada(indice);
  }

  function confirmarResposta() {
    if (selecionada === null || confirmada) return;
    setConfirmada(true);
    if (etapa.opcoes[selecionada].correta) {
      if (tentativasEtapa === 0) {
        const total = acertos + 1;
        setAcertos(total);
        localStorage.setItem(chave("Acertos"), String(total));
      }
    } else {
      const total = erros + 1;
      setErros(total);
      setTentativasEtapa((t) => t + 1);
      localStorage.setItem(chave("Erros"), String(total));
    }
  }

  // Resposta errada: a etapa não avança. A pessoa tenta de novo, com as opções em nova ordem.
  function tentarNovamente() {
    setSelecionada(null);
    setConfirmada(false);
    setOrdem(embaralhar(etapa.opcoes.length));
    rolar("mc-pratique");
  }

  async function proximaEtapa() {
    if (!acertou || salvandoConclusao) return;
    setErroConclusao("");

    if (etapaAtual < TOTAL_ETAPAS) {
      const proxima = etapaAtual + 1;
      setEtapaAtual(proxima);
      localStorage.setItem(chave("Etapa"), String(proxima));
      setSelecionada(null);
      setConfirmada(false);
      setTentativasEtapa(0);
      setOrdem(embaralhar(ETAPAS[proxima - 1].opcoes.length));
      window.scrollTo({ top: 0, behavior: reduzir ? "auto" : "smooth" });
      return;
    }

    setSalvandoConclusao(true);
    try {
      const { error } = await supabase.rpc("pulsan_concluir_minicurso_chat");
      if (error) throw error;
      localStorage.setItem(chave("Concluido"), "true");
      localStorage.setItem(chave("ConcluidoEm"), new Date().toISOString());
      localStorage.setItem(chave("Etapa"), String(TOTAL_ETAPAS));
      setConcluido(true);
    } catch (erro) {
      console.error("Erro ao registrar conclusão do minicurso:", erro);
      setErroConclusao(erro?.message || "Não foi possível salvar sua conclusão. Verifique sua conexão e tente novamente.");
    } finally {
      setSalvandoConclusao(false);
    }
  }

  function reiniciarCurso() {
    ["Etapa", "Acertos", "Erros"].forEach((nome) => localStorage.removeItem(chave(nome)));
    setEtapaAtual(1);
    setSelecionada(null);
    setConfirmada(false);
    setTentativasEtapa(0);
    setOrdem(embaralhar(3));
    setAcertos(0);
    setErros(0);
    setConcluido(false);
    setErroConclusao("");
    window.scrollTo({ top: 0, behavior: reduzir ? "auto" : "smooth" });
  }

  const css = (
    <style>{`
.mc{--bg:#f3f7fc;--card:#fff;--card2:#f6f9fe;--ink:#13284a;--mut:#5d7190;--line:#dbe5f2;--pri:#2f6fed;--pri2:#2559c4;--onpri:#fff;--soft:#e8f0fe;--okbg:#eaf7f0;--ok:#2e9d68;--nobg:#fdf0ef;--no:#d9534f;--sh:0 10px 30px #13284a10;min-height:100vh;padding:24px 20px 120px;background:var(--bg);color:var(--ink);font-family:inherit}
.mc[data-tema="escuro"]{--bg:#0b1626;--card:#12233b;--card2:#162b46;--ink:#e8f0fb;--mut:#9fb3cf;--line:#26405f;--pri:#6ea0ff;--pri2:#8bb4ff;--onpri:#0a1a33;--soft:#1a3355;--okbg:#14382e;--ok:#4cc38a;--nobg:#3d2226;--no:#ef7b77;--sh:0 10px 30px #00000045}
.mc *{box-sizing:border-box}
.mc-top{max-width:1120px;margin:0 auto 20px;display:flex;align-items:center;justify-content:space-between;gap:12px}
.mc-back{border:1px solid var(--line);background:var(--card);color:var(--ink);border-radius:10px;padding:9px 14px;font:inherit;font-size:14px;font-weight:600;cursor:pointer}
.mc-back:hover{background:var(--card2)}
.mc-brand{font-size:13px;font-weight:700;letter-spacing:.08em;color:var(--mut)}
.mc-wrap{max-width:1120px;margin:0 auto;display:grid;grid-template-columns:270px minmax(0,1fr);gap:24px;align-items:start}
.mc-side{position:sticky;top:20px;background:var(--card);border:1px solid var(--line);border-radius:18px;padding:20px;box-shadow:var(--sh)}
.mc-side h2{margin:0 0 4px;font-size:16px}
.mc-side p{margin:0 0 14px;font-size:13px;color:var(--mut);line-height:1.5}
.mc-bar{height:8px;border-radius:8px;background:var(--soft);overflow:hidden;margin-bottom:6px}
.mc-bar span{display:block;height:100%;background:var(--pri);border-radius:8px;transition:width .35s ease}
.mc-pct{display:flex;justify-content:space-between;font-size:12px;color:var(--mut);margin-bottom:16px}
.mc-steps{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:4px}
.mc-step{display:flex;align-items:center;gap:12px;padding:9px 10px;border-radius:12px;font-size:14px;color:var(--mut)}
.mc-step i{flex:none;width:26px;height:26px;border-radius:50%;display:grid;place-items:center;font-style:normal;font-size:12px;font-weight:700;border:1.5px solid var(--line);background:var(--card)}
.mc-step.done{color:var(--ink)}
.mc-step.done i{background:var(--ok);border-color:var(--ok);color:#fff}
.mc-step.cur{background:var(--soft);color:var(--ink);font-weight:700}
.mc-step.cur i{border-color:var(--pri);color:var(--pri)}
.mc-card{background:var(--card);border:1px solid var(--line);border-radius:22px;box-shadow:var(--sh);overflow:hidden}
.mc-head{padding:clamp(22px,4vw,34px);border-bottom:1px solid var(--line);background:linear-gradient(135deg,var(--card),var(--soft))}
.mc-eyebrow{font-size:12px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--pri)}
.mc-head h1{margin:8px 0 6px;font-size:clamp(26px,4vw,38px);line-height:1.12;letter-spacing:-.01em}
.mc-head p{margin:0;color:var(--mut);font-size:16px;line-height:1.55}
.mc-body{padding:clamp(18px,4vw,32px);display:flex;flex-direction:column;gap:24px}
.mc-video{position:relative;aspect-ratio:16/9;border-radius:16px;overflow:hidden;background:#0b1626}
.mc-video video{width:100%;height:100%;object-fit:cover;display:block}
.mc-vfall{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:24px;text-align:center;color:#fff;background:linear-gradient(135deg,#13335f,#2f6fed)}
.mc-vfall span{font-size:13px;opacity:.85;max-width:380px;line-height:1.5}
.mc-sec{scroll-margin-top:16px}
.mc-label{display:flex;align-items:center;gap:8px;margin-bottom:10px;font-size:12px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--pri)}
.mc-learn{background:var(--card2);border:1px solid var(--line);border-left:4px solid var(--pri);border-radius:14px;padding:20px}
.mc-learn strong{display:block;font-size:16px;line-height:1.6;margin-bottom:10px}
.mc-learn p{margin:0;color:var(--mut);font-size:15px;line-height:1.7}
.mc-q{margin:0 0 16px;font-size:clamp(19px,3vw,24px);line-height:1.35}
.mc-ops{display:grid;gap:10px}
.mc-op{display:flex;align-items:flex-start;gap:12px;width:100%;text-align:left;border:2px solid var(--line);border-radius:14px;padding:14px 16px;background:var(--card);color:var(--ink);font:inherit;font-size:15px;line-height:1.5;cursor:pointer;transition:border-color .15s,background .15s,transform .15s}
.mc-op b{flex:none;width:28px;height:28px;border-radius:50%;display:grid;place-items:center;background:var(--card2);color:var(--mut);font-size:13px}
.mc-op:hover:not(:disabled){border-color:var(--pri);transform:translateY(-1px)}
.mc-op.sel{border-color:var(--pri);background:var(--soft)}
.mc-op.sel b{background:var(--pri);color:var(--onpri)}
.mc-op.ok{border-color:var(--ok);background:var(--okbg)}
.mc-op.ok b{background:var(--ok);color:#fff}
.mc-op.no{border-color:var(--no);background:var(--nobg)}
.mc-op.no b{background:var(--no);color:#fff}
.mc-op:disabled{cursor:default}
.mc-fb{margin-top:16px;border-radius:14px;padding:18px;border:1px solid;font-size:15px;line-height:1.65}
.mc-fb strong{display:block;margin-bottom:6px;font-size:16px}
.mc-fb.ok{background:var(--okbg);border-color:var(--ok)}
.mc-fb.no{background:var(--nobg);border-color:var(--no)}
.mc-fb small{display:block;margin-top:10px;color:var(--mut);font-size:13px;line-height:1.55}
.mc-act{display:flex;flex-wrap:wrap;gap:10px;margin-top:18px}
.mc-btn{flex:1 1 220px;border:0;border-radius:12px;padding:15px 22px;background:var(--pri);color:var(--onpri);font:inherit;font-size:15px;font-weight:700;cursor:pointer;transition:background .15s,transform .15s}
.mc-btn:hover:not(:disabled){background:var(--pri2);transform:translateY(-1px)}
.mc-btn:disabled{opacity:.45;cursor:not-allowed}
.mc-btn.sec{background:transparent;color:var(--ink);border:1px solid var(--line)}
.mc-btn.sec:hover:not(:disabled){background:var(--card2)}
.mc-note{max-width:1120px;margin:0 auto 16px;padding:12px 16px;border-radius:12px;background:var(--soft);color:var(--ink);font-size:14px;line-height:1.5}
.mc-err{border:1px solid var(--no);background:var(--nobg)}
.mc-res{max-width:760px;margin:0 auto;background:var(--card);border:1px solid var(--line);border-radius:24px;box-shadow:var(--sh);padding:clamp(26px,5vw,48px)}
.mc-res h1{margin:8px 0 12px;font-size:clamp(26px,5vw,38px);line-height:1.12}
.mc-res>p{color:var(--mut);line-height:1.7;font-size:16px;margin:0 0 22px}
.mc-stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-bottom:22px}
.mc-stats div{background:var(--card2);border:1px solid var(--line);border-radius:14px;padding:16px 10px;text-align:center}
.mc-stats strong{display:block;font-size:26px;color:var(--pri)}
.mc-stats span{font-size:12px;color:var(--mut)}
.mc-learned{list-style:none;margin:0 0 24px;padding:0;display:grid;gap:8px}
.mc-learned li{display:flex;gap:10px;font-size:14px;line-height:1.5;color:var(--mut)}
.mc-learned li b{color:var(--ink)}
.mc-learned li:before{content:"✓";color:var(--ok);font-weight:800}
.mc button:focus-visible{outline:3px solid color-mix(in srgb,var(--pri) 45%,transparent);outline-offset:2px}
@media(max-width:900px){.mc-wrap{grid-template-columns:1fr}.mc-side{position:static}.mc-steps{flex-direction:row;overflow-x:auto;padding-bottom:4px}.mc-step{flex:none;padding:6px}.mc-step span{display:none}.mc-step.cur span{display:inline}}

.mc{width:100%;min-width:0;overflow-x:hidden;padding-left:max(16px,env(safe-area-inset-left));padding-right:max(16px,env(safe-area-inset-right));padding-bottom:calc(40px + env(safe-area-inset-bottom))}
.mc-top,.mc-wrap,.mc-note{width:100%;min-width:0}
.mc-wrap{grid-template-columns:minmax(230px,270px) minmax(0,1fr);gap:clamp(14px,2.2vw,24px)}
.mc-side,.mc-card,.mc-res{min-width:0}
.mc-head h1,.mc-head p,.mc-q,.mc-learn,.mc-op,.mc-fb,.mc-res p,.mc-learned li{overflow-wrap:anywhere}
.mc-video{width:100%;max-width:100%}
.mc-op span{min-width:0;overflow-wrap:anywhere}
.mc-btn{min-width:0;white-space:normal;overflow-wrap:anywhere}
@media(max-width:900px){
  .mc{padding-top:18px}
  .mc-wrap{grid-template-columns:minmax(0,1fr);max-width:760px}
  .mc-side{padding:16px}
  .mc-steps{gap:6px;scrollbar-width:thin}
  .mc-step{min-width:34px;justify-content:center}
  .mc-step.cur{padding-right:12px}
  .mc-step.cur span{white-space:nowrap}
}
@media(max-width:600px){
  .mc{padding:14px 12px calc(28px + env(safe-area-inset-bottom))}
  .mc-top{margin-bottom:14px;gap:8px}
  .mc-back{padding:9px 11px;font-size:13px;flex:none}
  .mc-brand{font-size:10px;letter-spacing:.06em;text-align:right}
  .mc-wrap{gap:12px}
  .mc-side{border-radius:14px;padding:13px}
  .mc-side h2{font-size:15px}
  .mc-side p{font-size:12px;margin-bottom:10px}
  .mc-pct{font-size:11px;margin-bottom:10px}
  .mc-steps{margin-right:-4px}
  .mc-step{gap:6px;padding:5px}
  .mc-step i{width:25px;height:25px}
  .mc-step.cur span{font-size:11px}
  .mc-card{border-radius:16px}
  .mc-head{padding:21px 18px}
  .mc-eyebrow,.mc-label{font-size:10px;letter-spacing:.08em}
  .mc-head h1{font-size:clamp(24px,7vw,31px)}
  .mc-head p{font-size:14px;line-height:1.5}
  .mc-body{padding:16px;gap:20px}
  .mc-video{border-radius:12px}
  .mc-learn{padding:15px;border-radius:12px}
  .mc-learn strong{font-size:14px;line-height:1.55}
  .mc-learn p{font-size:14px;line-height:1.6}
  .mc-q{font-size:19px;line-height:1.4;margin-bottom:13px}
  .mc-ops{gap:9px}
  .mc-op{gap:9px;padding:12px;font-size:14px;line-height:1.45;border-radius:12px}
  .mc-op b{width:25px;height:25px;font-size:12px}
  .mc-fb{padding:14px;font-size:14px;line-height:1.55}
  .mc-fb strong{font-size:15px}
  .mc-act{display:grid;grid-template-columns:minmax(0,1fr);gap:9px;margin-top:15px}
  .mc-btn{width:100%;min-height:46px;padding:12px 15px;font-size:14px;flex:auto}
  .mc-note{font-size:13px;padding:11px 12px;margin-bottom:12px}
  .mc-res{padding:22px 17px;border-radius:17px}
  .mc-res h1{font-size:clamp(24px,7vw,32px)}
  .mc-res>p{font-size:14px}
  .mc-stats{gap:7px}
  .mc-stats div{padding:12px 5px}
  .mc-stats strong{font-size:22px}
  .mc-stats span{font-size:10px}
  .mc-learned li{font-size:13px}
}
@media(max-width:380px){
  .mc{padding-left:9px;padding-right:9px}
  .mc-top{gap:5px}
  .mc-brand{font-size:9px}
  .mc-head{padding:18px 14px}
  .mc-body{padding:13px}
  .mc-step.cur span{display:none}
  .mc-op{padding:11px 10px;font-size:13px}
  .mc-stats{grid-template-columns:1fr}
  .mc-stats div{display:flex;align-items:center;justify-content:center;gap:8px}
  .mc-stats strong{font-size:20px}
}
@media(min-width:901px) and (max-width:1100px){
  .mc-wrap{grid-template-columns:230px minmax(0,1fr);gap:16px}
  .mc-side{padding:16px}
}
@media(prefers-reduced-motion:reduce){.mc *{transition:none!important}}
    `}</style>
  );

  if (carregandoStatus) {
    return (
      <main className="mc" data-tema={tema} style={{ display: "grid", placeItems: "center" }}>
        {css}
        <p style={{ color: "var(--mut)", fontWeight: 600 }}>Verificando seu progresso...</p>
      </main>
    );
  }

  if (concluido) {
    return (
      <main className="mc" data-tema={tema}>
        {css}
        <div className="mc-top"><button type="button" className="mc-back" onClick={() => irPara("ambiente")}>← Voltar</button><span className="mc-brand">PULSAN · MINI CURSO</span></div>
        <section className="mc-res">
          <div className="mc-eyebrow">Mini curso concluído</div>
          <h1>Você completou todas as etapas do acolhimento.</h1>
          <p>Você aprendeu a perceber, aproximar, escutar, acolher, respeitar a confiança e reconhecer seus limites. Acolher não exige respostas perfeitas. Exige presença, respeito e responsabilidade.</p>
          <div className="mc-stats">
            <div><strong>{TOTAL_ETAPAS}</strong><span>etapas concluídas</span></div>
            <div><strong>{Math.min(acertos, TOTAL_ETAPAS)}</strong><span>acertos de primeira</span></div>
            <div><strong>{erros}</strong><span>tentativas extras</span></div>
          </div>
          <div className="mc-label">O que você leva</div>
          <ul className="mc-learned">
            {ETAPAS.map((e) => <li key={e.id}><span><b>{e.titulo}.</b> {e.subtitulo}</span></li>)}
          </ul>
          <div className="mc-act">
            <button type="button" className="mc-btn" onClick={() => irPara("ambiente")}>Voltar para o PULSAN</button>
            <button type="button" className="mc-btn sec" onClick={reiniciarCurso}>Refazer mini curso</button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="mc" data-tema={tema}>
      {css}
      <div className="mc-top">
        <button type="button" className="mc-back" onClick={() => irPara("ambiente")}>← Voltar</button>
        <span className="mc-brand">PULSAN · MINI CURSO</span>
      </div>

      {retomou && etapaAtual > 1 && !confirmada && tentativasEtapa === 0 && (
        <div className="mc-note">Você continua de onde parou, na etapa {etapaAtual}. Seu progresso foi mantido.</div>
      )}
      {erroConclusao && <div role="alert" className="mc-note mc-err">{erroConclusao}</div>}

      <div className="mc-wrap">
        <aside className="mc-side" aria-label="Progresso do curso">
          <h2>Como acolher</h2>
          <p>Aprenda cada princípio e aplique em uma situação real. Você avança ao acertar.</p>
          <div className="mc-bar" role="progressbar" aria-valuenow={progresso} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${progresso}%` }} /></div>
          <div className="mc-pct"><span>{concluidas} de {TOTAL_ETAPAS} etapas</span><span>{progresso}%</span></div>
          <ol className="mc-steps">
            {ETAPAS.map((e) => {
              const feita = e.id < etapaAtual || (e.id === etapaAtual && acertou);
              const atual = e.id === etapaAtual;
              return (
                <li key={e.id} className={`mc-step ${feita ? "done" : atual ? "cur" : ""}`} aria-current={atual ? "step" : undefined}>
                  <i>{feita ? "✓" : e.id}</i><span>{e.titulo}</span>
                </li>
              );
            })}
          </ol>
        </aside>

        <section className="mc-card">
          <div className="mc-head">
            <div className="mc-eyebrow">Etapa {String(etapa.id).padStart(2, "0")} de {String(TOTAL_ETAPAS).padStart(2, "0")}</div>
            <h1>{etapa.titulo}</h1>
            <p>{etapa.subtitulo}</p>
          </div>

          <div className="mc-body">
            <div className="mc-video">
              {!videoErro ? (
                <video key={etapa.video} controls playsInline preload="metadata"
                  onError={() => { console.warn("Vídeo não encontrado:", etapa.video); setVideoErro(true); }}>
                  <source src={etapa.video} type="video/mp4" />
                </video>
              ) : (
                <div className="mc-vfall">
                  <strong>Vídeo desta etapa em preparação</strong>
                  <span>O conteúdo escrito abaixo cobre o mesmo tema. Leia com atenção antes de responder.</span>
                </div>
              )}
            </div>

            <div className="mc-sec" id="mc-aprenda">
              <div className="mc-label">1 · Aprenda</div>
              <div className="mc-learn">
                <strong>{etapa.abertura}</strong>
                <p>{etapa.mensagem}</p>
              </div>
            </div>

            <div className="mc-sec" id="mc-pratique">
              <div className="mc-label">2 · Pratique{tentativasEtapa > 0 ? ` · tentativa ${tentativasEtapa + 1}` : ""}</div>
              <h2 className="mc-q">{etapa.situacao}</h2>

              <div className="mc-ops" role="radiogroup" aria-label="Alternativas">
                {ordem.map((indice, pos) => {
                  const opcao = etapa.opcoes[indice];
                  const sel = selecionada === indice;
                  const cls = confirmada && sel ? (opcao.correta ? "ok" : "no") : sel ? "sel" : "";
                  return (
                    <button key={opcao.texto} type="button" role="radio" aria-checked={sel}
                      className={`mc-op ${cls}`} onClick={() => responder(indice)} disabled={confirmada || salvandoConclusao}>
                      <b>{String.fromCharCode(65 + pos)}</b><span>{opcao.texto}</span>
                    </button>
                  );
                })}
              </div>

              {acertou && (
                <div className="mc-fb ok" role="status">
                  <strong>Resposta correta</strong>
                  {etapa.opcoes[selecionada].explicacao}
                  {tentativasEtapa > 0 && <small>Você acertou depois de {tentativasEtapa} {tentativasEtapa === 1 ? "tentativa" : "tentativas"}. Errar faz parte de aprender.</small>}
                </div>
              )}
              {errou && (
                <div className="mc-fb no" role="status">
                  <strong>Ainda não foi desta vez</strong>
                  {etapa.opcoes[selecionada].explicacao}
                  <small>Você só avança ao acertar. Releia o conteúdo da etapa e tente novamente. Seu progresso está salvo nesta etapa.</small>
                </div>
              )}

              <div className="mc-act">
                {!confirmada && (
                  <button type="button" className="mc-btn" disabled={selecionada === null} onClick={confirmarResposta}>Confirmar resposta</button>
                )}
                {errou && (
                  <>
                    <button type="button" className="mc-btn sec" onClick={() => rolar("mc-aprenda")}>Rever o conteúdo</button>
                    <button type="button" className="mc-btn" onClick={tentarNovamente}>Tentar novamente</button>
                  </>
                )}
                {acertou && (
                  <button type="button" className="mc-btn" onClick={proximaEtapa} disabled={salvandoConclusao}>
                    {etapaAtual === TOTAL_ETAPAS ? (salvandoConclusao ? "Salvando conclusão..." : "Concluir mini curso") : "Próxima etapa →"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}