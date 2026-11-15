import React,{useEffect,useMemo,useRef,useState} from "react";

/* ───────── DADOS ───────── */
const territorios=[
{id:"mares",nome:"Marés interiores",curto:"Marés",cor:"#2a9db5",fundo:"#e1f3f6",x:170,y:165,s:"≈",frase:"Espaços de equilíbrio, presença e recuperação.",ent:"Momentos de equilíbrio também merecem atenção: perceber o que ajuda você a se sentir bem torna mais fácil repetir isso depois.",sinais:["Respiração confortável","Corpo mais solto","Mais clareza","Sensação de segurança"],emocoes:["Tranquilidade","Paz","Alívio","Gratidão","Segurança","Leveza","Serenidade","Calma"]},
{id:"labirinto",nome:"Labirinto dos pensamentos",curto:"Labirinto",cor:"#7461bd",fundo:"#ece8fa",x:450,y:105,s:"⌁",frase:"Caminhos para compreender pensamentos que parecem não parar.",ent:"Preocupação e ansiedade envolvem uma mente em alerta, tentando antecipar o futuro. Dar nome ao que está acontecendo costuma reduzir a intensidade.",sinais:["Pensamentos acelerados","Tensão no corpo","Dificuldade para descansar","Vontade de evitar"],emocoes:["Ansiedade","Preocupação","Medo","Insegurança","Dúvida","Pensando demais","Confusão","Sobrecarga"]},
{id:"vulcao",nome:"Vulcão das emoções",curto:"Vulcão",cor:"#cf6a50",fundo:"#fae9e3",x:800,y:175,s:"◈",frase:"Reconheça a força do que está acontecendo dentro de você.",ent:"Emoções intensas, como a raiva, indicam que algo importante foi tocado e ativam o corpo. Perceber isso antes de agir amplia suas opções.",sinais:["Calor ou tensão muscular","Fala acelerada","Vontade de reagir já","Sensação de limite ultrapassado"],emocoes:["Raiva","Irritação","Frustração","Ciúme","Indignação","Impaciência","Mágoa","Tensão"]},
{id:"vale",nome:"Vale das profundezas",curto:"Vale",cor:"#b2689a",fundo:"#f6e8f0",x:300,y:410,s:"⌂",frase:"Um espaço para acolher sentimentos que pedem cuidado.",ent:"Tristeza, solidão e saudade são respostas humanas a perdas e mudanças. Acolher sem se cobrar e dar pequenos passos de cuidado tende a ajudar.",sinais:["Vontade de se recolher","Menos energia","Sensibilidade maior","Sensação de que ninguém entende"],emocoes:["Tristeza","Solidão","Saudade","Vazio","Desânimo","Rejeição","Luto","Decepção","Cansaço emocional","Carência"]},
{id:"florescer",nome:"Terras do florescer",curto:"Florescer",cor:"#2f946f",fundo:"#e3f3ea",x:700,y:420,s:"✳",frase:"Pequenos passos também podem abrir novos caminhos.",ent:"Esperança e coragem apontam algo que você valoriza. Transformar esse impulso em passos pequenos ajuda a mantê-lo vivo.",sinais:["Vontade de avançar","Interesse por possibilidades","Energia para tentar","Reconhecimento das suas capacidades"],emocoes:["Esperança","Coragem","Confiança","Motivação","Entusiasmo","Autoestima","Determinação","Orgulho","Vontade de recomeçar"]}
];

const REG={
respiracao:{nome:"Respiração lenta",fonte:"Zaccaro et al., 2018; Balban et al., 2023",nivel:"Evidência moderada",desc:"Inspirar por 4 s e soltar o ar por 6 s (cerca de 6 respirações por minuto) tende a reduzir a ativação do corpo."},
aterramento:{nome:"Voltar ao presente (5-4-3)",fonte:"Atenção plena: Goyal et al., 2014",nivel:"Evidência inicial",desc:"Direciona a atenção para os sentidos. A técnica em si tem pouca pesquisa própria; vem de práticas de atenção plena, com efeitos pequenos a moderados."},
relaxamento:{nome:"Relaxamento muscular progressivo",fonte:"Jacobson, 1938; Manzoni et al., 2008",nivel:"Evidência moderada",desc:"Tensionar e soltar grupos musculares ajuda a perceber e reduzir a tensão física."}
};
const RX=["Mãos e antebraços: feche as mãos por 5 s e solte por 10 s.","Ombros: leve-os às orelhas por 5 s e solte.","Rosto: franza a testa e feche os olhos por 5 s e solte.","Abdômen: contraia levemente por 5 s e solte.","Pernas e pés: pressione os pés no chão por 5 s e solte."];
const SENT=[["Vejo",5],["Toco ou sinto",4],["Escuto",3]];
const CICLOS=6;

const TEC={
saborear:{nome:"Saborear o momento",fonte:"Bryant & Veroff, 2007",nivel:"Evidência moderada",passos:["Escolha algo bom agora: um som, uma pessoa, um lugar.","Fique 1 a 2 minutos atento aos detalhes.","Perceba onde no corpo essa sensação aparece.","Pense em quem poderia compartilhar isso com você."],campo:"O que quero lembrar deste momento?"},
tres_coisas:{nome:"Três coisas boas",fonte:"Seligman et al., 2005",nivel:"Evidência moderada (efeito pequeno)",passos:["Lembre de três coisas que foram bem hoje, mesmo pequenas.","Para cada uma, anote por que aconteceu.","Perceba qual foi seu papel ou o de outras pessoas."],campo:"Uma coisa boa e por que aconteceu:"},
preocupacao:{nome:"Separar o controlável e reservar um tempo",fonte:"Borkovec et al., 1983; Hofmann et al., 2012",nivel:"Evidência robusta (componente da TCC)",passos:["Escreva a preocupação em uma frase.","Separe: o que posso influenciar × o que não posso.","Defina uma ação pequena e quando vai fazê-la.","Para o restante, reserve 15 minutos mais tarde e volte ao presente agora."],campo:"Minha ação pequena e quando vou fazê-la:"},
reestruturacao:{nome:"Registro de pensamentos",fonte:"Beck, 1976; Hofmann et al., 2012",nivel:"Evidência robusta (TCC)",passos:["Descreva a situação em uma frase.","Anote o pensamento automático que surgiu.","Procure evidências a favor e contra esse pensamento.","Escreva uma versão mais equilibrada dele."],campo:"Meu pensamento mais equilibrado:"},
exposicao:{nome:"Aproximação gradual",fonte:"Foa & Kozak, 1986; Craske et al., 2014",nivel:"Evidência robusta (base do tratamento de medos)",passos:["Confirme que não há perigo real e imediato.","Liste 3 situações ligadas ao medo, da mais leve à mais difícil.","Escolha a mais leve e planeje como e quando tentar.","Avance só se for seguro e pare se precisar. Peça apoio profissional em medos intensos."],campo:"Primeiro passo que vou tentar:"},
reavaliacao:{nome:"Pausa e reavaliação",fonte:"Gross, 1998; Beck & Fernandez, 1998",nivel:"Evidência moderada a robusta",passos:["Afaste-se ou adie a resposta por alguns minutos.","Identifique o limite ou a necessidade que foi tocada.","Pergunte: existe outra leitura possível do que aconteceu?","Se fizer sentido, escolha como comunicar com clareza e respeito."],campo:"O que preciso comunicar, em uma frase calma:"},
autocompaixao:{nome:"Autocompaixão",fonte:"Neff, 2003; MacBeth & Gumley, 2012",nivel:"Evidência moderada",passos:["Reconheça: este momento é difícil.","Lembre: sofrer faz parte da experiência humana.","Pense no que diria a um amigo querido nessa situação.","Ofereça essa mesma frase a si mesmo."],campo:"Frase gentil que eu diria a mim mesmo:"},
ativacao:{nome:"Ativação comportamental",fonte:"Cuijpers et al., 2007",nivel:"Evidência robusta (tratamento da depressão)",passos:["Escolha uma atividade pequena ligada ao que importa ou dá prazer.","Reduza até caber em 10 minutos.","Defina horário e lugar.","Faça mesmo sem vontade: a motivação costuma vir depois de começar."],campo:"Atividade e horário:"},
conexao:{nome:"Aproximação social",fonte:"Masi et al., 2011",nivel:"Evidência moderada",passos:["Pense em uma pessoa com quem o contato costuma ser bom.","Escreva uma mensagem simples, como “lembrei de você”.","Envie ou agende o envio.","Se não houver ninguém, escolha um grupo ou atividade de interesse."],campo:"Para quem vou escrever:"},
escrita:{nome:"Escrita expressiva",fonte:"Pennebaker & Beall, 1986; Frattaroli, 2006",nivel:"Evidência moderada (efeito pequeno)",passos:["Reserve 10 a 15 minutos em um lugar privado.","Escreva livremente sobre o que sente, sem se preocupar com forma.","Se ficar intenso demais, pare e respire.","Ao terminar, decida se guarda ou descarta o texto."],campo:"Uma frase sobre o que percebi:"},
intencao:{nome:"Intenção “Se… então…”",fonte:"Gollwitzer & Sheeran, 2006",nivel:"Evidência robusta (efeito médio em metas)",passos:["Defina o objetivo em uma frase.","Escolha a primeira ação, de até 15 minutos.","Complete: “Se for [momento ou lugar], então vou [ação]”.","Prepare o ambiente para facilitar o começo."],campo:"Se ___, então eu vou ___:"},
evidencias:{nome:"Evidências de capacidade",fonte:"Bandura, 1977",nivel:"Evidência moderada",passos:["Lembre de algo difícil que você superou.","Anote o que você fez que ajudou.","Identifique uma habilidade que pode usar agora.","Escolha um desafio pequeno para praticar."],campo:"Uma habilidade minha:"}
};
const DEF={mares:"saborear",labirinto:"preocupacao",vulcao:"reavaliacao",vale:"ativacao",florescer:"intencao"};
const TECE={Gratidão:"tres_coisas",Medo:"exposicao",Insegurança:"reestruturacao",Dúvida:"reestruturacao",Confusão:"reestruturacao",Mágoa:"autocompaixao",Rejeição:"autocompaixao",Solidão:"conexao",Carência:"conexao",Saudade:"escrita",Luto:"escrita",Decepção:"escrita",Confiança:"evidencias",Autoestima:"evidencias",Orgulho:"evidencias"};
const ESTACOES=["Nomear","Regular","Agir","Reavaliar"];
const CONTEXTOS=["Trabalho ou estudos","Casa ou família","Relacionamentos","Situações sociais","Comigo mesmo","Não sei ainda"];
const FONTES="pulsan_autocuidado_v1";
const C=2*Math.PI*66;
const norm=s=>s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"");

const ACOLHE=["Você chegou até aqui, e isso já é um cuidado. Vamos devagar, sem pressa.","Seu corpo também merece acolhimento. Respire como quem recebe uma boa notícia.","Um passo pequeno, feito com gentileza, vale mais do que um passo perfeito.","Olhe para trás: você atravessou quatro estações por si mesmo. Isso importa."];
const FECHO={mares:"Que essa calma volte a você sempre que precisar.",labirinto:"Os pensamentos podem seguir; você já sabe como voltar ao seu chão.",vulcao:"Sentir com intensidade é sinal de que algo importa. Você cuidou disso com respeito.",vale:"Você não precisou atravessar isso com pressa nem sozinho. O cuidado continua.",florescer:"Cada passo pequeno já é semente. Continue no seu tempo."};
const ACORDES={mares:[261.63,329.63,392],labirinto:[196,246.94,293.66],vulcao:[174.61,220,261.63],vale:[220,261.63,329.63],florescer:[293.66,369.99,440]};
/* ───────── COMPONENTE ───────── */
export default function Autocuidado({irPara,acessibilidade}){
const reduzir=acessibilidade?.reduzirAnimacoes===true;
const [territorio,setTerritorio]=useState(null),[emocao,setEmocao]=useState(null),[et,setEt]=useState(0),[ok,setOk]=useState([false,false,false,false]),[fim,setFim]=useState(false);
const [busca,setBusca]=useState(""),[sel,setSel]=useState([]);
const [sinais,setSinais]=useState([]),[nome,setNome]=useState(""),[contexto,setContexto]=useState(""),[antes,setAntes]=useState(null),[depois,setDepois]=useState(null);
const [reg,setReg]=useState("respiracao"),[resp,setResp]=useState({on:false,fase:"in",s:4,ciclos:0}),[gr,setGr]=useState([0,0,0]),[rx,setRx]=useState([]);
const [tc,setTc]=useState([]),[campo,setCampo]=useState("");
const [hist,setHist]=useState(()=>{try{return JSON.parse(localStorage.getItem(FONTES))||[]}catch{return[]}});
const atual=territorios.find(t=>t.id===territorio);
const grupo=emocao?territorios.find(t=>t.emocoes.includes(emocao)):null;
const tec=emocao?TEC[TECE[emocao]||(grupo?DEF[grupo.id]:null)]:null;

useEffect(()=>{try{localStorage.setItem(FONTES,JSON.stringify(hist))}catch{}},[hist]);
/* ── Som sintetizado (Web Audio): pad suave por território, chuva/oceano e sinos ── */
const [som,setSom]=useState(false),[vol,setVol]=useState(25),[amb,setAmb]=useState("acolher"),[ond,setOnd]=useState(0),au=useRef(null);
const parar=()=>{try{const a=au.current;if(a){a.nodes.forEach(n=>{try{n.stop()}catch{}});a.ctx.close()}}catch{}au.current=null};
const ligar=async(tipo=amb,gid=grupo?.id||"mares")=>{parar();try{const AC=window.AudioContext||window.webkitAudioContext,ctx=new AC();await ctx.resume();const master=ctx.createGain();master.gain.value=vol/100*.35;master.connect(ctx.destination);const nodes=[],pad=ctx.createGain();pad.gain.value=.5;pad.connect(master);
ACORDES[gid].forEach((f,i)=>{const o=ctx.createOscillator(),g=ctx.createGain(),l=ctx.createOscillator(),lg=ctx.createGain();o.type="sine";o.frequency.value=f;o.detune.value=i*4-4;g.gain.value=.12;l.frequency.value=.07+i*.03;lg.gain.value=.05;l.connect(lg);lg.connect(g.gain);o.connect(g);g.connect(pad);o.start();l.start();nodes.push(o,l)});
if(tipo!=="acolher"){const b=ctx.createBuffer(1,ctx.sampleRate*4,ctx.sampleRate),d=b.getChannelData(0);let last=0;for(let i=0;i<d.length;i++){last=(last+(Math.random()*2-1)*.06)/1.02;d[i]=last*3}
const sr=ctx.createBufferSource(),f=ctx.createBiquadFilter(),g=ctx.createGain();sr.buffer=b;sr.loop=true;f.type="lowpass";f.frequency.value=tipo==="oceano"?420:1800;g.gain.value=tipo==="oceano"?.9:.6;
if(tipo==="oceano"){const l=ctx.createOscillator(),lg=ctx.createGain();l.frequency.value=.1;lg.gain.value=.5;l.connect(lg);lg.connect(g.gain);l.start();nodes.push(l)}
sr.connect(f);f.connect(g);g.connect(master);sr.start();nodes.push(sr)}
au.current={ctx,master,pad,nodes};setSom(true)}catch{}};
const sino=n=>{const a=au.current;if(!a)return;const t=a.ctx.currentTime;[0,4,7].forEach((st,i)=>{const o=a.ctx.createOscillator(),g=a.ctx.createGain(),t0=t+i*.12;o.type="sine";o.frequency.value=523.25*Math.pow(2,(st+n)/12);g.gain.setValueAtTime(0,t0);g.gain.linearRampToValueAtTime(.2,t0+.03);g.gain.exponentialRampToValueAtTime(.0001,t0+2.2);o.connect(g);g.connect(a.master);o.start(t0);o.stop(t0+2.4)})};
useEffect(()=>{const a=au.current;if(a)a.master.gain.setTargetAtTime(vol/100*.35,a.ctx.currentTime,.2)},[vol]);
useEffect(()=>{if(au.current)ligar(amb,grupo?.id||"mares")},[amb,grupo?.id]);
useEffect(()=>{const a=au.current;if(a)a.pad.gain.setTargetAtTime(resp.on?(resp.fase==="in"?1:.3):.5,a.ctx.currentTime,resp.fase==="in"?1.2:2.2)},[resp.on,resp.fase]);
useEffect(()=>{if(resp.ciclos===CICLOS)sino(2)},[resp.ciclos]);
useEffect(()=>()=>parar(),[]);
useEffect(()=>{if(!resp.on)return;const id=setInterval(()=>setResp(r=>{if(r.s>1)return{...r,s:r.s-1};if(r.fase==="in")return{...r,fase:"out",s:6};const c=r.ciclos+1;return c>=CICLOS?{on:false,fase:"in",s:4,ciclos:c}:{...r,fase:"in",s:4,ciclos:c}}),1000);return()=>clearInterval(id)},[resp.on]);

const todas=useMemo(()=>territorios.flatMap(t=>t.emocoes),[]);
const filtradas=todas.filter(n=>norm(n).includes(norm(busca)));
const prog=t=>new Set(hist.filter(h=>h.g===t.id).map(h=>h.e)).size/t.emocoes.length;
const totalFeitas=new Set(hist.map(h=>h.e)).size;
const regOk=reg==="respiracao"?resp.ciclos>=CICLOS:reg==="aterramento"?gr.join()==="5,4,3":rx.length===RX.length;
const tecOk=tec&&tc.length===tec.passos.length;
const pode=[antes!==null,regOk,tecOk,depois!==null];

const zerar=()=>{setEt(0);setOk([false,false,false,false]);setFim(false);setSinais([]);setNome("");setContexto("");setAntes(null);setDepois(null);setReg("respiracao");setResp({on:false,fase:"in",s:4,ciclos:0});setGr([0,0,0]);setRx([]);setTc([]);setCampo("")};
const abrir=n=>{zerar();setEmocao(n)};
const sair=()=>{zerar();setEmocao(null)};
const voltar=()=>{if(emocao)sair();else if(territorio)setTerritorio(null);else irPara?.("ambiente")};
const tog=(set,v)=>set(a=>a.includes(v)?a.filter(x=>x!==v):[...a,v]);
const concluir=i=>{sino(i);setOnd(n=>n+1);setOk(o=>o.map((v,k)=>k===i?true:v));setEt(Math.min(i+1,3));if(i===1)setResp(r=>({...r,on:false}))};
const finalizar=()=>{sino(5);setOnd(n=>n+1);setOk([true,true,true,true]);setFim(true);setHist(h=>[...h,{e:emocao,g:grupo.id,a:antes,d:depois,t:Date.now()}].slice(-60))};
const acessivel=i=>i===0||ok[i-1];
const dur=reduzir?"none":undefined;

/* ───────── ESTAÇÕES ───────── */
const Est0=()=><div className="pa-body">
<h3>Nomear o que você sente</h3>
<p>{grupo.ent}</p>
<div className="pa-ev"><b>Base científica:</b> colocar emoções em palavras (rotulagem afetiva) está associado a menor reatividade emocional (Lieberman et al., 2007). <i>Evidência moderada.</i></div>
<h4>Quais sinais fazem sentido hoje?</h4>
{grupo.sinais.map(x=><label className="pa-chk" key={x}><input type="checkbox" checked={sinais.includes(x)} onChange={()=>tog(setSinais,x)}/>{x}</label>)}
<h4>Em uma frase, o que está acontecendo? (opcional)</h4>
<textarea className="pa-in" value={nome} onChange={e=>setNome(e.target.value)} placeholder={`Estou sentindo ${emocao.toLowerCase()} porque…`}/>
<h4>Onde isso aparece mais?</h4>
<div className="pa-row">{CONTEXTOS.map(x=><button key={x} className={contexto===x?"on":""} onClick={()=>setContexto(x)}>{x}</button>)}</div>
<h4>Intensidade agora (0 = nenhuma, 10 = máxima)</h4>
<div className="pa-row pa-scale">{[0,1,2,3,4,5,6,7,8,9,10].map(n=><button key={n} className={antes===n?"on":""} aria-label={`Intensidade ${n}`} onClick={()=>setAntes(n)}>{n}</button>)}</div>
{antes>=9&&<div className="pa-alert">Essa intensidade é alta. Se estiver difícil de suportar, fale agora com alguém de confiança. No Brasil, o CVV atende 24 h pelo telefone 188, e em emergência você pode ligar 192 (SAMU).</div>}
</div>;

const Est1=()=><div className="pa-body">
<h3>Regular o corpo</h3>
<p>Antes de resolver qualquer coisa, ajuda diminuir a ativação do corpo. Escolha uma prática e faça no seu ritmo.</p>
<div className="pa-row">{Object.entries(REG).map(([k,v])=><button key={k} className={reg===k?"on":""} onClick={()=>{setReg(k);setResp(r=>({...r,on:false}))}}>{v.nome}</button>)}</div>
<div className="pa-ev"><b>{REG[reg].nivel}.</b> {REG[reg].desc}<br/><small>Fonte: {REG[reg].fonte}</small></div>
{reg==="respiracao"&&<div className="pa-breath-wrap">
<div className="pa-breath" style={{transform:resp.on?(resp.fase==="in"?"scale(1.3)":"scale(.9)"):"scale(1)",transition:reduzir?"none":`transform ${resp.fase==="in"?4:6}s ease-in-out,box-shadow ${resp.fase==="in"?4:6}s ease-in-out`,boxShadow:resp.on?`0 0 ${resp.fase==="in"?70:10}px ${grupo.cor}66`:"none",background:`radial-gradient(circle,${grupo.fundo},#fff 75%)`,borderColor:grupo.cor}}>
<div><strong>{resp.on?(resp.fase==="in"?"Inspire":"Solte o ar"):resp.ciclos>=CICLOS?"Concluído":"Pronto?"}</strong><small>{resp.on?`${resp.s} s`:"4 s inspirar · 6 s soltar"}</small></div></div>
<p className="pa-center">{Math.min(resp.ciclos,CICLOS)} de {CICLOS} ciclos (cerca de 1 minuto)</p>
<div className="pa-row pa-c"><button className="pri" onClick={()=>setResp(r=>({...r,on:!r.on,fase:"in",s:4,ciclos:r.ciclos>=CICLOS?0:r.ciclos}))}>{resp.on?"Pausar":resp.ciclos>=CICLOS?"Repetir":"Começar"}</button><button onClick={()=>setResp({on:false,fase:"in",s:4,ciclos:0})}>Reiniciar</button></div>
<small className="pa-muted">Respire sem forçar. Se sentir tontura ou desconforto, pare e respire normalmente.</small></div>}
{reg==="aterramento"&&<div>{SENT.map(([t,n],i)=><div className="pa-sense" key={t}><span>{t} {n} coisas</span><div>{Array.from({length:n},(_,k)=><button key={k} aria-label={`${t} ${k+1}`} className={`pa-dot ${gr[i]>k?"on":""}`} onClick={()=>setGr(g=>g.map((v,j)=>j===i?(v===k+1?k:k+1):v))}/>)}</div></div>)}
<small className="pa-muted">Toque em cada círculo quando perceber algo. Pare se não for confortável.</small></div>}
{reg==="relaxamento"&&<div>{RX.map((x,i)=><label className="pa-chk" key={i}><input type="checkbox" checked={rx.includes(i)} onChange={()=>tog(setRx,i)}/>{x}</label>)}
<small className="pa-muted">Tensione com suavidade. Evite fazer se sentir dor ou tiver lesão na região.</small></div>}
</div>;

const Est2=()=><div className="pa-body">
<h3>{tec.nome}</h3>
<div className="pa-ev"><b>{tec.nivel}.</b> <small>Fonte: {tec.fonte}</small></div>
<h4>Marque cada passo conforme for fazendo</h4>
{tec.passos.map((x,i)=><label className="pa-chk" key={i}><input type="checkbox" checked={tc.includes(i)} onChange={()=>tog(setTc,i)}/>{x}</label>)}
<div className="pa-bar"><span style={{width:`${tc.length/tec.passos.length*100}%`,background:grupo.cor}}/></div>
<h4>{tec.campo}</h4>
<textarea className="pa-in" value={campo} onChange={e=>setCampo(e.target.value)} placeholder="Escreva apenas se quiser. Não fica salvo."/>
</div>;

const Est3=()=>{const d=antes!==null&&depois!==null?depois-antes:null;return <div className="pa-body">
<h3>Reavaliar</h3>
<p>Perceba se algo mudou, mesmo que pouco. Também vale notar quando não mudou.</p>
<h4>Intensidade agora (0 a 10)</h4>
<div className="pa-row pa-scale">{[0,1,2,3,4,5,6,7,8,9,10].map(n=><button key={n} className={depois===n?"on":""} aria-label={`Intensidade ${n}`} onClick={()=>setDepois(n)}>{n}</button>)}</div>
{d!==null&&<div className="pa-compare"><div><small>Antes</small><b>{antes}</b></div><span>→</span><div><small>Depois</small><b>{depois}</b></div>
<p>{d<0?"A intensidade diminuiu. Vale notar o que ajudou.":d===0?"A intensidade ficou igual. Isso é comum, e uma prática curta nem sempre muda o quadro.":"A intensidade aumentou. Isso pode acontecer. Tente outra prática mais tarde ou procure apoio."}</p></div>}
<div className="pa-alert soft">Estas práticas têm apoio em pesquisas, mas os efeitos costumam ser de pequenos a moderados e variam entre pessoas. Se o sofrimento for intenso, persistente ou afetar sua rotina, procure um profissional de saúde mental. Você não precisa esperar piorar para pedir ajuda.</div>
</div>};

const estacoes=[Est0,Est1,Est2,Est3];
const Est=estacoes[et];

/* ───────── TRILHA (progresso da emoção) ───────── */
const xs=[125,375,625,875];
const Trilha=()=><svg viewBox="0 0 1000 150" className="pa-trail" role="group" aria-label="Progresso da jornada">
{xs.slice(0,3).map((x,i)=>{const a=x+30,b=xs[i+1]-30,m=(a+b)/2;return <path key={i} d={`M${a} 62 H${m-34} l12 -14 l12 44 l14 -58 l12 50 l8 -22 H${b}`} fill="none" stroke={ok[i]?grupo.cor:"#c9d6e3"} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>})}
{xs.map((x,i)=><g key={i} role="button" tabIndex={acessivel(i)?0:-1} aria-label={`Estação ${i+1}: ${ESTACOES[i]}`} aria-current={et===i} style={{cursor:acessivel(i)?"pointer":"not-allowed"}} onClick={()=>acessivel(i)&&setEt(i)} onKeyDown={e=>{if((e.key==="Enter"||e.key===" ")&&acessivel(i)){e.preventDefault();setEt(i)}}}>
{et===i&&!fim&&<circle cx={x} cy="62" r="34" fill="none" stroke={grupo.cor} strokeWidth="2" opacity=".35"/>}
<circle cx={x} cy="62" r="26" fill={ok[i]?grupo.cor:"#fff"} stroke={acessivel(i)?grupo.cor:"#c9d6e3"} strokeWidth="3"/>
<text x={x} y="69" textAnchor="middle" fontSize="20" fontWeight="700" fill={ok[i]?"#fff":acessivel(i)?grupo.cor:"#a7b6c6"}>{ok[i]?"✓":i+1}</text>
<text x={x} y="118" textAnchor="middle" fontSize="17" fontWeight={et===i?700:500} fill="#26496b">{ESTACOES[i]}</text></g>)}
</svg>;

/* ───────── ATLAS ───────── */
const POS={vulcao:[160,420],labirinto:[315,150],vale:[500,420],florescer:[685,150],mares:[840,420]};
const ORDEM=["vulcao","labirinto","vale","florescer","mares"];
const CAM="M160 420 C240 420 235 150 315 150 S420 420 500 420 S600 150 685 150 S760 420 840 420";
const CHECK=[["Agitado ou preocupado","Ansiedade"],["Irritado","Raiva"],["Triste ou desanimado","Tristeza"],["Sozinho","Solidão"],["Esgotado","Cansaço emocional"],["Bem e calmo","Calma"],["Quero me motivar","Motivação"],["Não sei dizer","Confusão"]];
const camRef=useRef(null),[walk,setWalk]=useState([160,420]),[dica,setDica]=useState(""),[sug,setSug]=useState(null);
const pctCam=ORDEM.reduce((a,id)=>a+prog(territorios.find(t=>t.id===id)),0)/5*100;
const alivio=hist.length?+(hist.reduce((a,h)=>a+h.a-h.d,0)/hist.length).toFixed(1):0;
useEffect(()=>{const c=camRef.current;if(c&&c.getTotalLength){const pt=c.getPointAtLength(c.getTotalLength()*pctCam/100);setWalk([pt.x,pt.y])}},[pctCam,emocao]);
const tecla=fn=>e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();fn()}};
const Atlas=()=><svg viewBox="-60 0 1120 630" className="pa-atlas" role="group" aria-label="Mapa de progresso das emoções">
<defs><linearGradient id="pcam" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stopColor="#cf6a50"/><stop offset=".3" stopColor="#7461bd"/><stop offset=".6" stopColor="#b2689a"/><stop offset=".8" stopColor="#2f946f"/><stop offset="1" stopColor="#2a9db5"/></linearGradient></defs>
<path d={CAM} fill="none" stroke="#dde7f0" strokeWidth="20" strokeLinecap="round"/>
<path ref={camRef} d={CAM} pathLength="100" fill="none" stroke="url(#pcam)" strokeWidth="20" strokeLinecap="round" strokeDasharray={`${pctCam} 100`} style={{transition:reduzir?"none":"stroke-dasharray 1s ease"}}/>
<path d={CAM} fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="2 12" strokeLinecap="round" opacity=".9"/>
{ORDEM.map(id=>{const t=territorios.find(x=>x.id===id),[x,y]=POS[id],p=prog(t),n=t.emocoes.length,on=territorio===id;return <g key={id}>
<g role="button" tabIndex={0} aria-label={`${t.nome}, ${Math.round(p*100)}% percorrido`} className="pa-node" onClick={()=>setTerritorio(id)} onKeyDown={tecla(()=>setTerritorio(id))}>
{on&&<circle cx={x} cy={y} r="56" fill="none" stroke={t.cor} strokeWidth="2" opacity=".4" className={reduzir?"":"pa-halo"}/>}
<circle cx={x} cy={y} r="46" fill={t.fundo} stroke={t.cor} strokeWidth={on?5:3}/>
<text x={x} y={y-6} textAnchor="middle" fontSize="26" fill={t.cor}>{t.s}</text>
<text x={x} y={y+14} textAnchor="middle" fontSize="15" fontWeight="700" fill="#1c405f">{t.curto}</text>
<text x={x} y={y+29} textAnchor="middle" fontSize="11" fill="#5f7790">{Math.round(p*100)}%</text></g>
{t.emocoes.map((e,i)=>{const a=i/n*2*Math.PI-Math.PI/2,dx=x+Math.cos(a)*92,dy=y+Math.sin(a)*92,f=hist.some(h=>h.e===e);return <g key={e} role="button" tabIndex={0} aria-label={`${e}${f?", já percorrida":""}`} className="pa-dotn" onClick={()=>abrir(e)} onKeyDown={tecla(()=>abrir(e))} onMouseEnter={()=>setDica(e)} onMouseLeave={()=>setDica("")} onFocus={()=>setDica(e)} onBlur={()=>setDica("")}>
<circle cx={dx} cy={dy} r="13" fill={f?t.cor:"#fff"} stroke={t.cor} strokeWidth="2.5" className={sug===e&&!reduzir?"pa-sug":""}/>
{f&&<text x={dx} y={dy+4} textAnchor="middle" fontSize="12" fill="#fff" fontWeight="700">✓</text>}{(()=>{const c=Math.cos(a);return <text x={x+c*112} y={y+Math.sin(a)*112+5} textAnchor={c>.3?"start":c<-.3?"end":"middle"} className="pa-lbl" fill={f?t.cor:"#3d5972"} fontWeight={f?700:500}>{e}</text>})()}<title>{e}</title></g>})}</g>})}
<g style={{transform:`translate(${walk[0]}px,${walk[1]}px)`,transition:reduzir?"none":"transform 1s ease"}} pointerEvents="none"><circle r="9" fill="#fff" stroke="#1f6aa5" strokeWidth="4"/>{!reduzir&&<circle r="9" fill="none" stroke="#1f6aa5" strokeWidth="2" className="pa-halo"/>}</g>
<text x="500" y="615" textAnchor="middle" fontSize="18" fill="#26496b">{dica||"Toque em um ponto para abrir uma emoção"}</text>
</svg>;

/* ───────── RENDER ───────── */
return <main className="pa">
<style>{`
.pa{--navy:#0e2a47;--blue:#1f6aa5;--pulse:#17a89a;--mut:#5b7189;min-height:100vh;padding:22px clamp(14px,3vw,40px) 40px;background:#f2f6fa;color:var(--navy);font-family:inherit}
.pa *{box-sizing:border-box}
.pa button{cursor:pointer;border:1px solid #d3dfeb;border-radius:12px;background:#fff;color:#2c4d6b;padding:9px 13px;font:inherit;font-size:13px;transition:background .15s,border-color .15s}
.pa button:hover{border-color:#6ea5d3;background:#f4f9fd}
.pa button:focus-visible,.pa input:focus-visible,.pa textarea:focus-visible,.pa g:focus-visible{outline:3px solid #7db4e6;outline-offset:2px}
.pa .pri,.pa button.on{background:var(--blue);border-color:var(--blue);color:#fff;font-weight:600}
.pa-wrap{max-width:1360px;margin:0 auto}
.pa-head{display:flex;justify-content:space-between;align-items:center;gap:12px}
.pa-logo{display:flex;align-items:center;gap:10px;font-weight:800;letter-spacing:.04em;font-size:18px}
.pa-logo small{font-weight:500;color:var(--mut);letter-spacing:0;font-size:14px}
.pa h1{font-size:clamp(26px,3.2vw,40px);letter-spacing:-.02em;margin:26px 0 8px}
.pa-lead{max-width:760px;color:var(--mut);font-size:15px;line-height:1.7;margin:0 0 20px}
.pa-grid{display:grid;grid-template-columns:minmax(0,1.7fr) minmax(290px,.8fr);gap:20px;align-items:start}
.pa-panel{background:#fff;border:1px solid #dfe8f1;border-radius:20px;padding:18px}
.pa-atlas{width:100%;height:auto;display:block}
.pa-node{cursor:pointer}
.pa-node:hover circle:nth-of-type(2){stroke:#fff}
.pa-ecg{stroke-dasharray:1400;animation:paDraw 3.2s ease-out both}
@keyframes paDraw{from{stroke-dashoffset:1400}to{stroke-dashoffset:0}}
.pa-halo{animation:paHalo 2.4s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
@keyframes paHalo{50%{transform:scale(1.08);opacity:.15}}
.pa-side{display:flex;flex-direction:column;gap:14px}
.pa-side h3,.pa-panel h3{margin:0 0 8px;font-size:17px}
.pa-side p,.pa-panel p{font-size:14px;line-height:1.7;color:var(--mut);margin:0 0 10px}
.pa-big{display:flex;align-items:baseline;gap:8px}
.pa-big b{font-size:34px;color:var(--blue)}
.pa-in{width:100%;padding:10px 12px;border:1px solid #d3dfeb;border-radius:10px;background:#f8fafc;color:var(--navy);font:inherit;font-size:14px}
textarea.pa-in{min-height:84px;resize:vertical}
.pa-row{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0 12px}
.pa-c{justify-content:center}
.pa-scale button{width:42px;padding:9px 0;text-align:center}
.pa-chip{font-size:12px!important;border-radius:20px!important;padding:6px 11px!important}
.pa-detail{margin-top:20px}
.pa-top{display:flex;justify-content:space-between;gap:14px;align-items:flex-start}
.pa-detail h2{margin:4px 0 6px;font-size:clamp(22px,2.6vw,30px)}
.pa h4{font-size:14px;margin:18px 0 6px}
.pa-chk{display:flex;gap:10px;align-items:flex-start;padding:10px 0;border-bottom:1px solid #edf1f5;font-size:14px;line-height:1.6;color:#3d5972}
.pa-chk input{accent-color:var(--blue);margin-top:4px;width:16px;height:16px}
.pa-ev{border-left:3px solid var(--pulse);background:#eef8f7;border-radius:0 10px 10px 0;padding:11px 14px;margin:12px 0;font-size:13px;line-height:1.7;color:#35566a}
.pa-ev small{color:#5a7a8c}
.pa-alert{border-radius:12px;background:#fdf1e7;border:1px solid #f1cfae;padding:12px 14px;font-size:13px;line-height:1.7;color:#7a4a1f;margin:14px 0}
.pa-alert.soft{background:#f1f6fb;border-color:#d6e4f1;color:#4d6880}
.pa-trail{width:100%;max-width:900px;height:auto;display:block;margin:6px auto 0}
.pa-body{margin-top:6px;max-width:760px}
.pa-body h3{font-size:21px}
.pa-breath-wrap{text-align:center}
.pa-breath{width:150px;height:150px;margin:24px auto 18px;border:2px solid;border-radius:50%;display:grid;place-items:center}
.pa-breath strong,.pa-breath small{display:block}
.pa-breath small{font-size:12px;color:var(--mut)}
.pa-center{text-align:center}
.pa-muted{display:block;color:var(--mut);font-size:12px;line-height:1.6;margin-top:6px}
.pa-sense{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid #edf1f5;font-size:14px;flex-wrap:wrap}
.pa-sense div{display:flex;gap:8px}
.pa .pa-dot{width:30px;height:30px;padding:0;border-radius:50%}
.pa .pa-dot.on{background:var(--pulse);border-color:var(--pulse)}
.pa-bar{height:7px;border-radius:8px;background:#e6edf4;overflow:hidden;margin:14px 0}
.pa-bar span{display:block;height:100%;transition:width .3s}
.pa-compare{display:flex;flex-wrap:wrap;align-items:center;gap:18px;margin:10px 0}
.pa-compare div{text-align:center}.pa-compare b{display:block;font-size:34px;color:var(--blue)}.pa-compare small{color:var(--mut)}
.pa-compare p{flex-basis:100%;margin:0}
.pa-nav{display:flex;flex-wrap:wrap;gap:10px;justify-content:space-between;margin-top:22px;padding-top:16px;border-top:1px solid #e6edf4}
.pa-hist{list-style:none;padding:0;margin:0;font-size:13px;color:#47637c}
.pa-hist li{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #edf1f5}
.pa-fim{text-align:center;padding:26px 8px}
.pa-fim b{font-size:20px}
.pa-foot{max-width:900px;margin:26px auto 0;text-align:center;font-size:12px;line-height:1.7;color:#7a8ea1}
.pa-sound{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:16px;padding:10px 14px;border:1px solid #dfe8f1;border-radius:16px;background:#fff;font-size:13px;color:var(--mut)}
.pa-sound label{display:flex;align-items:center;gap:8px;margin-left:auto}
.pa-sound input{accent-color:var(--blue)}
.pa-detail{position:relative;overflow:hidden}
.pa-detail>*{position:relative;z-index:1}
.pa-detail>.pa-float{position:absolute;inset:0;z-index:0;pointer-events:none}
.pa-float span{position:absolute;bottom:-20px;width:10px;height:10px;border-radius:50%;opacity:.16;animation:paUp linear infinite}
@keyframes paUp{to{transform:translateY(-640px) scale(1.8);opacity:0}}
.pa-detail>.pa-ripple{position:absolute;left:50%;top:120px;width:40px;height:40px;margin:-20px;border:2px solid;border-radius:50%;animation:paRip 1.6s ease-out forwards;pointer-events:none;z-index:0}
@keyframes paRip{to{transform:scale(22);opacity:0}}
.pa-warm{display:flex;gap:12px;align-items:center;margin:14px auto 0;max-width:760px;padding:14px 16px;border-radius:16px;background:linear-gradient(120deg,#f5fafd,#fdf6f9);border:1px solid #e3ebf3}
.pa-warm p{margin:0;font-size:15px;line-height:1.6;font-style:italic;color:#3a5873}
.pa-heart{color:#d9627f;font-size:22px;animation:paBeat 1.4s ease-in-out infinite}
@keyframes paBeat{0%,100%{transform:scale(1)}15%{transform:scale(1.25)}30%{transform:scale(1)}45%{transform:scale(1.18)}}
.pa-fade{animation:paFade .5s ease both}
@keyframes paFade{from{opacity:0;transform:translateY(8px)}}
.pa-logo svg path{stroke-dasharray:60;animation:paDraw2 2.4s ease-in-out infinite}
@keyframes paDraw2{0%{stroke-dashoffset:60}60%,100%{stroke-dashoffset:0}}
.pa-dotn{cursor:pointer}.pa-dotn:hover circle{filter:brightness(.9)}
.pa-sug{animation:paSug 1.4s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
@keyframes paSug{50%{transform:scale(1.6)}}
.pa-uni{margin:0 0 20px}
.pa-ucards{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px}
.pa .pa-ucard{display:flex;flex-direction:column;align-items:flex-start;gap:6px;text-align:left;padding:16px;border-radius:18px;border:2px solid transparent;background:var(--bg);color:var(--navy);box-shadow:0 6px 18px #1a45670d;transition:transform .2s,border-color .2s,box-shadow .2s}
.pa .pa-ucard:hover{transform:translateY(-4px);border-color:var(--c);background:var(--bg)}
.pa .pa-ucard.on{border-color:var(--c);box-shadow:0 10px 26px color-mix(in srgb,var(--c) 30%,transparent)}
.pa-ucard .s{font-size:28px;color:var(--c);line-height:1}
.pa-ucard b{font-size:15px}
.pa-ucard small{font-size:12px;line-height:1.5;color:var(--mut)}
.pa-ucard .bar{display:block;width:100%;height:5px;border-radius:5px;background:#ffffffb0;overflow:hidden}
.pa-ucard .bar span{display:block;height:100%;background:var(--c);transition:width .4s}
.pa-udet{margin-top:14px;border-width:2px;animation:paFade .35s ease both}
.pa-emos{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px;margin-top:14px}
.pa .pa-emo{display:flex;align-items:center;gap:10px;padding:14px;border-radius:14px;border:1.5px solid var(--c);background:#fff;color:var(--navy);font-weight:600;font-size:14px;text-align:left;transition:transform .15s,background .15s,color .15s}
.pa .pa-emo span{color:var(--c);font-size:18px}
.pa .pa-emo.feita{background:color-mix(in srgb,var(--c) 14%,#fff)}
.pa .pa-emo:hover{background:var(--c);color:#fff;transform:translateY(-2px)}
.pa .pa-emo:hover span{color:#fff}
.pa-lbl{font-size:15px}
@media(max-width:760px){.pa-lbl{display:none}}
@media(max-width:1000px){.pa-grid{grid-template-columns:1fr}}
@media(max-width:600px){.pa-top{flex-direction:column}.pa-scale button{width:38px}}
@media(prefers-reduced-motion:reduce){.pa *{animation:none!important;transition:none!important}}

/* Responsividade adicional */
.pa{width:100%;min-width:0;overflow-x:hidden;padding-left:clamp(12px,2.5vw,40px);padding-right:clamp(12px,2.5vw,40px);padding-bottom:max(28px,env(safe-area-inset-bottom))}
.pa-wrap,.pa-panel,.pa-grid,.pa-side,.pa-detail,.pa-body{min-width:0}
.pa-wrap{width:100%}
.pa-panel{padding:clamp(12px,1.6vw,20px);min-width:0}
.pa-grid{grid-template-columns:minmax(0,1.65fr) minmax(270px,.85fr);gap:clamp(12px,1.5vw,20px)}
.pa-atlas-scroll{width:100%;max-width:100%;overflow-x:auto;overscroll-behavior-inline:contain}
.pa-atlas{width:100%;min-width:0;height:auto}
.pa-sound{min-width:0;flex-wrap:wrap}
.pa-sound label{margin-left:auto}
.pa-ucards{grid-template-columns:repeat(auto-fit,minmax(min(100%,210px),1fr))}
.pa-emos{grid-template-columns:repeat(auto-fit,minmax(min(100%,150px),1fr))}
.pa-row>*{max-width:100%}
.pa-nav{align-items:center}
.pa-nav button{max-width:100%;white-space:normal}
.pa-chk{overflow-wrap:anywhere}
.pa-in{min-width:0;max-width:100%}
.pa-trail{max-width:100%}
@media(max-width:1100px){
 .pa-grid{grid-template-columns:minmax(0,1fr)}
 .pa-side{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));align-items:start}
 .pa-side>.pa-panel:first-child,.pa-side>.pa-panel:last-child{grid-column:1/-1}
}
@media(max-width:760px){
 .pa{padding:14px 12px max(26px,env(safe-area-inset-bottom))}
 .pa-head{align-items:flex-start}
 .pa-logo{font-size:16px;gap:7px;flex-wrap:wrap}
 .pa-logo small{font-size:12px}
 .pa h1{font-size:clamp(24px,6vw,32px);margin:20px 0 7px;overflow-wrap:anywhere}
 .pa-lead{font-size:14px;line-height:1.6}
 .pa-sound{gap:7px;padding:10px;border-radius:13px}
 .pa-sound button{font-size:12px;padding:8px 10px}
 .pa-sound label{margin:0;flex:1 1 100%;justify-content:space-between}
 .pa-sound input[type=range]{max-width:55%}
 .pa-side{grid-template-columns:minmax(0,1fr)}
 .pa-side>.pa-panel:first-child,.pa-side>.pa-panel:last-child{grid-column:auto}
 .pa-atlas-scroll{padding-bottom:5px}
 .pa-atlas{min-width:620px;width:620px;max-width:none}
 .pa-trail{min-width:560px}
 .pa-detail{overflow:hidden}
 .pa-top{gap:10px}
 .pa-top>div{min-width:0}
 .pa-top button{flex-shrink:0}
 .pa-body{max-width:none}
 .pa-body h3{font-size:19px}
 .pa-body p{overflow-wrap:anywhere}
 .pa-row{gap:7px}
 .pa-row button{flex:1 1 auto;min-width:0}
 .pa-scale{display:grid;grid-template-columns:repeat(6,minmax(0,1fr))}
 .pa-scale button{width:100%;padding:10px 0}
 .pa-nav{display:grid;grid-template-columns:1fr;gap:9px}
 .pa-nav button{width:100%;min-height:42px}
 .pa-warm{align-items:flex-start;padding:12px;gap:9px}
 .pa-warm p{font-size:14px}
 .pa-compare{gap:12px}
 .pa-foot{font-size:11px}
}
@media(max-width:420px){
 .pa{padding-left:10px;padding-right:10px}
 .pa-panel{padding:12px;border-radius:15px}
 .pa-logo svg{width:30px}
 .pa-head>button{padding:8px 10px;font-size:12px}
 .pa-ucards{grid-template-columns:1fr}
 .pa-emos{grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}
 .pa .pa-emo{padding:11px 9px;font-size:12px;gap:7px;overflow-wrap:anywhere}
 .pa .pa-ucard{padding:13px}
 .pa-row button{font-size:12px;padding:8px 9px}
 .pa-sense{align-items:flex-start}
 .pa-sense div{gap:5px}
 .pa .pa-dot{width:27px;height:27px}
 .pa-breath{width:136px;height:136px}
 .pa-nav{margin-top:16px;padding-top:12px}
 .pa-compare b{font-size:28px}
}
@media(max-width:340px){
 .pa-emos{grid-template-columns:1fr}
 .pa-scale{grid-template-columns:repeat(4,minmax(0,1fr))}
 .pa-top{flex-direction:column}
 .pa-top button{align-self:flex-start}
}
@media(prefers-reduced-motion:reduce){.pa *{scroll-behavior:auto!important}}

`}</style>
<div className="pa-wrap">
<header className="pa-head">
<div className="pa-logo"><svg width="38" height="24" viewBox="0 0 38 24" aria-hidden="true"><path d="M1 13 H10 l4 -8 l6 18 l5 -14 l3 4 H37" fill="none" stroke="#1f6aa5" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>PULSAN <small>/ Autocuidado</small></div>
<button onClick={voltar}>← Voltar</button>
</header>
<div className="pa-sound" role="group" aria-label="Som ambiente">
<button className={som?"on":""} aria-pressed={som} onClick={()=>som?(parar(),setSom(false)):ligar()}>{som?"♪ Som ligado":"♪ Ligar som ambiente"}</button>
{[["acolher","Acolhimento"],["chuva","Chuva"],["oceano","Oceano"]].map(([k,n])=><button key={k} className={`pa-chip ${amb===k?"on":""}`} onClick={()=>setAmb(k)}>{n}</button>)}
<label>Volume <input type="range" min="0" max="60" value={vol} onChange={e=>setVol(+e.target.value)} aria-label="Volume"/></label>
</div>

<h1>{emocao||atual?.nome||"Pulsan Universe"}</h1>
<p className="pa-lead">{emocao?"Você não precisa dar conta de tudo agora. Vamos por quatro estações, com calma e com carinho. Cada prática mostra sua base científica.":atual?.frase||"Escolha um território ou toque em qualquer emoção no mapa. Cada jornada colore um pedaço do seu caminho."}</p>

{!emocao&&<section className="pa-uni" id="pa-uni" aria-label="Territórios do Pulsan Universe">
<div className="pa-ucards">
{territorios.map(t=>{const p=prog(t),on=territorio===t.id;return <button key={t.id} className={`pa-ucard ${on?"on":""}`} style={{"--c":t.cor,"--bg":t.fundo}} aria-pressed={on} onClick={()=>setTerritorio(on?null:t.id)}>
<span className="s" aria-hidden="true">{t.s}</span><b>{t.nome}</b><small>{t.frase}</small>
<span className="bar"><span style={{width:`${p*100}%`}}/></span><small>{new Set(hist.filter(h=>h.g===t.id).map(h=>h.e)).size} de {t.emocoes.length} emoções</small>
</button>})}
</div>
{territorio&&<div className="pa-panel pa-udet" style={{borderColor:atual.cor}}>
<div className="pa-top"><div><h2>{atual.nome}</h2><p>Escolha uma emoção para iniciar a jornada.</p></div><button onClick={()=>setTerritorio(null)}>Fechar</button></div>
<div className="pa-emos">{atual.emocoes.map(n=>{const f=hist.some(h=>h.e===n);return <button key={n} className={`pa-emo ${f?"feita":""}`} style={{"--c":atual.cor}} onClick={()=>abrir(n)}><span aria-hidden="true">{f?"✓":atual.s}</span>{n}</button>})}</div>
</div>}
</section>}

{!emocao&&<div className="pa-grid">
<section className="pa-panel" aria-label="Mapa">
<div className="pa-atlas-scroll">{Atlas()}</div>
<small className="pa-muted pa-center">Toque em um território ou em qualquer emoção. Ponto preenchido: já percorrida. O ponto azul mostra onde você está.</small>
</section>
<aside className="pa-side">
<section className="pa-panel"><h3>Como você está agora?</h3><p>Escolha o que mais se aproxima. Vamos sugerir por onde começar no mapa.</p><div className="pa-row">{CHECK.map(([l,e])=><button key={e} className={`pa-chip ${sug===e?"on":""}`} onClick={()=>setSug(e)}>{l}</button>)}</div>{sug&&<div className="pa-warm"><p>Podemos começar por {sug.toLowerCase()}. O ponto que pulsa no mapa mostra onde ela está.</p><button className="pri" onClick={()=>abrir(sug)}>Começar</button></div>}</section>
<section className="pa-panel"><h3>Seu progresso</h3>
<div className="pa-big"><b>{hist.length}</b><span>jornadas concluídas</span></div>
<p>{totalFeitas} de {todas.length} emoções exploradas.</p>{hist.length>0&&<p>{alivio>0?`Em média, a intensidade que você registrou diminuiu ${alivio} ponto(s)`:alivio<0?`Em média, a intensidade subiu ${-alivio} ponto(s). Isso acontece; considere buscar apoio profissional`:"Em média, a intensidade ficou igual"}, entre o antes e o depois (autorrelato).</p>}
{hist.length>0&&<><h4>Últimas jornadas (intensidade antes → depois)</h4><ul className="pa-hist">{hist.slice(-4).reverse().map((h,i)=><li key={i}><span>{h.e}</span><span>{h.a} → {h.d}</span></li>)}</ul>
<div className="pa-row"><button onClick={()=>setHist([])}>Apagar histórico</button></div></>}
<small className="pa-muted">O histórico guarda só a emoção, as notas e a data, neste dispositivo. Textos que você escreve não são salvos.</small>
</section>
<section className="pa-panel"><h3>Encontre uma emoção</h3>
<input className="pa-in" value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar uma emoção…" aria-label="Buscar emoção"/>
<div className="pa-row">{filtradas.map(n=><button key={n} className={`pa-chip ${sel.includes(n)?"on":""}`} onClick={()=>tog(setSel,n)}>{sel.includes(n)?"✓ ":"+ "}{n}</button>)}{!filtradas.length&&<small className="pa-muted">Nenhuma emoção encontrada.</small>}</div>
{sel.length>0&&<div className="pa-row">{sel.map(n=><button key={n} className="pri" onClick={()=>abrir(n)}>Começar com {n} →</button>)}</div>}
<p>Você pode sentir mais de uma emoção ao mesmo tempo. Comece pela que mais pede atenção.</p></section>
<section className="pa-panel"><h3>Sobre as práticas</h3><p>As técnicas vêm de abordagens estudadas, como TCC, ativação comportamental e treino de atenção plena. Os efeitos costumam ser de pequenos a moderados e variam entre pessoas. Elas complementam, mas não substituem, o cuidado profissional.</p></section>
</aside>
</div>}



{emocao&&grupo&&tec&&<section className="pa-panel pa-detail">
{!reduzir&&<div className="pa-float" aria-hidden="true">{[...Array(9)].map((_,i)=><span key={i} style={{left:`${8+i*11}%`,animationDelay:`${i*-2.1}s`,animationDuration:`${14+i%4*3}s`,background:grupo.cor}}/>)}</div>}
{ond>0&&!reduzir&&<span key={ond} className="pa-ripple" style={{borderColor:grupo.cor}}/>}
<div className="pa-top"><div><p style={{margin:0}}>{grupo.nome}</p><h2>{emocao}</h2></div><button onClick={sair}>Trocar emoção</button></div>
{Trilha()}
{!fim?<>
<div className="pa-warm" key={"w"+et}><span className="pa-heart" aria-hidden="true">♥</span><p>{ACOLHE[et]}</p></div>
<div key={et} className="pa-fade">{Est()}</div>
<div className="pa-nav">
<button disabled={et===0} onClick={()=>setEt(et-1)} style={{opacity:et===0?.4:1}}>← Estação anterior</button>
{et<3?<button className="pri" disabled={!pode[et]} onClick={()=>concluir(et)} style={{opacity:pode[et]?1:.45}}>{pode[et]?"Concluir estação →":"Complete a estação para avançar"}</button>
:<button className="pri" disabled={!pode[3]} onClick={finalizar} style={{opacity:pode[3]?1:.45}}>Finalizar jornada</button>}
</div></>
:<div className="pa-fim"><b>Jornada concluída</b>
<p>Você passou pelas quatro estações de {emocao.toLowerCase()}. Intensidade: {antes} → {depois}.</p><div className="pa-warm"><span className="pa-heart" aria-hidden="true">♥</span><p>{FECHO[grupo.id]}</p></div>
<div className="pa-row pa-c"><button className="pri" onClick={sair}>Voltar ao atlas</button><button onClick={()=>abrir(emocao)}>Repetir esta jornada</button></div></div>}
</section>}

<p className="pa-foot">O Autocuidado do Pulsan é um espaço educativo de acolhimento e autoconhecimento. Não faz diagnóstico, não substitui atendimento psicológico e não é um serviço de emergência. Se houver risco imediato à sua segurança ou à de outra pessoa, ligue 192 (SAMU) ou procure ajuda presencial. O CVV atende 24 h pelo 188.</p>
</div>
</main>;
}