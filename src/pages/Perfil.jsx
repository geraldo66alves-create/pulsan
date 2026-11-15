import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

/* ═════════ ÍCONES ═════════ */
const ICONES = {
  usuario: <><circle cx="12" cy="8" r="3.5" /><path d="M5.5 20c.7-3.3 3-5 6.5-5s5.8 1.7 6.5 5" /></>,
  editar: <><path d="M4 20h4l10.8-10.8a2.1 2.1 0 0 0-3-3L5 17v3Z" /><path d="m14.8 7.2 2 2" /></>,
  conversa: <><path d="M5 5.5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H11l-4.5 3v-3.1A2 2 0 0 1 4 17.5v-10a2 2 0 0 1 1-2Z" /><path d="M8 10h8M8 13h5" /></>,
  coracao: <path d="M20.8 8.8c0 5.3-8.8 10.1-8.8 10.1S3.2 14.1 3.2 8.8A4.7 4.7 0 0 1 12 6.2a4.7 4.7 0 0 1 8.8 2.6Z" />,
  estrela: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" />,
  trofeu: <><path d="M8 4h8v4.5a4 4 0 0 1-8 0V4Z" /><path d="M8 6H5a2 2 0 0 0 2 4M16 6h3a2 2 0 0 1-2 4" /><path d="M12 12.5V17M8.5 20h7M10 17h4" /></>,
  premio: <><path d="M7 8h10v11H7z" /><path d="M7 11H4.5A2.5 2.5 0 0 1 2 8.5V7h5M17 11h2.5A2.5 2.5 0 0 0 22 8.5V7h-5" /><path d="M12 8v11M9 5.5A2.5 2.5 0 1 1 12 8V5.5A2.5 2.5 0 1 0 9 8M15 5.5A2.5 2.5 0 1 0 12 8V5.5A2.5 2.5 0 1 1 15 8" /></>,
  cadeado: <><rect x="5" y="10" width="14" height="10" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v2" /></>,
  escudo: <path d="M12 3 19 6v5c0 4.7-3 7.8-7 10-4-2.2-7-5.3-7-10V6l7-3Z" />,
  acessibilidade: <><circle cx="12" cy="4.5" r="1.7" /><path d="M5 8.5h14M12 8.5v11M8.5 20l3.5-5 3.5 5M8 13l4 2 4-2" /></>,
  sol: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></>,
  lua: <path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8.7 8.7 0 1 0 20 15.5Z" />,
  salvar: <><path d="M5 4h12l2 2v14H5z" /><path d="M8 4v5h7V4M8 20v-7h8v7" /></>,
  imagem: <><rect x="4" y="5" width="16" height="14" rx="2" /><circle cx="9" cy="10" r="1.5" /><path d="m5 17 4.5-4.5 3 3 2-2 4.5 4.5" /></>,
  sair: <path d="M10 5H5v14h5M14 8l4 4-4 4M10 12h8" />,
  protecao: <><path d="M12 3 19 6v5c0 4.7-3 7.8-7 10-4-2.2-7-5.3-7-10V6l7-3Z" /><path d="m9 12 2 2 4-4" /></>,
  borboleta: <><path d="M12 9.5c-1.2-3.6-4.2-6-6.5-5.2-2.1.7-1.9 4.2-.3 6.2 1.3 1.7 3.5 2.1 5.8.8" /><path d="M12 9.5c1.2-3.6 4.2-6 6.5-5.2 2.1.7 1.9 4.2.3 6.2-1.3 1.7-3.5 2.1-5.8.8" /><path d="M12 9.5v9M10.3 20h3.4M10.5 6.5 9 4.2M13.5 6.5 15 4.2" /></>,
  vagalume: <><path d="M9 10c-2.5-2.2-5.3-1.5-6.5 0 1.2 2.7 3.8 4 6.2 2.8M15 10c2.5-2.2 5.3-1.5 6.5 0-1.2 2.7-3.8 4-6.2 2.8" /><ellipse cx="12" cy="13" rx="3.2" ry="5" /><path d="M10.5 18h3M10 21h4M12 8V4" /></>,
  camaleao: <><path d="M4 14c0-4 3.3-7 7.5-7H15c2.8 0 5 1.8 5 4.3 0 2.7-2.3 4.7-5.2 4.7H11" /><circle cx="16.2" cy="11.2" r=".7" fill="currentColor" stroke="none" /><path d="M4 14c-1.5 1.2-1.7 3-.4 4.1 1.2 1 3.1.5 3.5-1.1M11 16c-.8 1.6-2.2 2.6-4.2 2.6" /></>,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
};

function Icone({ nome, tamanho = 20, cor = "currentColor", espessura = 2 }) {
  return (
    <svg width={tamanho} height={tamanho} viewBox="0 0 24 24" fill="none" stroke={cor} strokeWidth={espessura}
      strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flex: "none" }}>
      {ICONES[nome] || ICONES.coracao}
    </svg>
  );
}

/* ═════════ DADOS DE APOIO ═════════ */
const NIVEIS = [
  { nome: "Semente", min: 0 },
  { nome: "Broto", min: 50 },
  { nome: "Flor", min: 150 },
  { nome: "Luz", min: 300 },
];

const ABAS = [
  ["resumo", "Resumo", "usuario"],
  ["conquistas", "Conquistas", "trofeu"],
  ["dados", "Meus dados", "editar"],
  ["seguranca", "Segurança", "escudo"],
  ["aparencia", "Aparência", "sol"],
];

function calcularNivel(pontos) {
  let indice = 0;
  NIVEIS.forEach((n, i) => { if (pontos >= n.min) indice = i; });
  const atual = NIVEIS[indice];
  const proximo = NIVEIS[indice + 1];
  const pct = proximo ? Math.min(100, ((pontos - atual.min) / (proximo.min - atual.min)) * 100) : 100;
  return { atual, proximo, pct, falta: proximo ? proximo.min - pontos : 0 };
}

/* ═════════ HOOKS (lógica separada da tela) ═════════ */
function usePerfil() {
  const [nome, setNome] = useState(localStorage.getItem("pulsanNome") || "Usuário Pulsan");
  const [foto, setFoto] = useState(localStorage.getItem("pulsanFoto") || "");
  const [email, setEmail] = useState("");
  const tipoUsuario =
    localStorage.getItem("pulsanTipoUsuario") || localStorage.getItem("tipoUsuario") ||
    localStorage.getItem("tipo") || "Membro Pulsan";

  useEffect(() => {
    let ativo = true;
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user || !ativo) return;
        const { data, error } = await supabase.from("perfis").select("nome, foto_url").eq("id", user.id).maybeSingle();
        if (error) console.warn("Não foi possível carregar o perfil:", error);
        const nomeBanco = data?.nome || user.user_metadata?.nome;
        const fotoBanco = data?.foto_url || user.user_metadata?.foto_url || user.user_metadata?.foto || localStorage.getItem("pulsanFoto") || "";
        setEmail(user.email || "");
        if (nomeBanco) { setNome(nomeBanco); localStorage.setItem("pulsanNome", nomeBanco); }
        if (fotoBanco) { setFoto(fotoBanco); localStorage.setItem("pulsanFoto", fotoBanco); }
      } catch (e) { console.error("Erro ao carregar perfil:", e); }
    })();
    return () => { ativo = false; };
  }, []);

  /** Salva nome, foto e e-mail. Lança erro em caso de falha; devolve um aviso extra sobre o e-mail. */
  async function salvar(nomeLimpo, emailLimpo, novaFoto) {
    const { data: { user }, error: erroUsuario } = await supabase.auth.getUser();
    if (erroUsuario || !user) throw new Error("Usuário não autenticado.");

    const { error: erroPerfil } = await supabase.from("perfis").update({ nome: nomeLimpo, foto_url: novaFoto || null }).eq("id", user.id);
    if (erroPerfil) throw erroPerfil;

    let aviso = "";
    if (emailLimpo !== (user.email || "").toLowerCase()) {
      const { error: erroEmail } = await supabase.auth.updateUser({ email: emailLimpo });
      if (erroEmail) throw erroEmail;
      aviso = " O novo e-mail poderá precisar de confirmação.";
    }

    setNome(nomeLimpo); setFoto(novaFoto || ""); setEmail(emailLimpo);
    localStorage.setItem("pulsanNome", nomeLimpo);
    if (novaFoto) localStorage.setItem("pulsanFoto", novaFoto); else localStorage.removeItem("pulsanFoto");

    try { await supabase.auth.updateUser({ data: { nome: nomeLimpo, foto_url: novaFoto || "" } }); }
    catch (e) { console.warn("Não foi possível atualizar a foto no metadata:", e); }

    try {
      const logado = JSON.parse(localStorage.getItem("usuarioLogado") || "{}");
      localStorage.setItem("usuarioLogado", JSON.stringify({ ...logado, id: user.id, nome: nomeLimpo, email: emailLimpo, foto: novaFoto || "", foto_url: novaFoto || "" }));
    } catch { /* cache local é complementar */ }

    return aviso;
  }

  return { nome, foto, email, tipoUsuario, salvar };
}

function useEstatisticas() {
  const [quantidade, setQuantidade] = useState(0);
  const [media, setMedia] = useState("—");
  const [ajudas, setAjudas] = useState(0);
  const [pontos, setPontos] = useState(0);

  useEffect(() => {
    let ativo = true;
    (async () => {
      try {
        const avaliacoes = JSON.parse(localStorage.getItem("pulsanAvaliacoes") || "[]");
        const q = avaliacoes.length;
        const m = q > 0 ? (avaliacoes.reduce((t, a) => t + Number(a?.nota || 0), 0) / q).toFixed(1) : "—";
        if (ativo) { setQuantidade(q); setMedia(m); }

        const { data: { user }, error: erroUsuario } = await supabase.auth.getUser();
        if (erroUsuario) console.warn("Não foi possível identificar o usuário:", erroUsuario);
        if (!user) { if (ativo) { setAjudas(0); setPontos(0); } return; }

        const { data, error } = await supabase.from("pontos_pulsan").select("pontos, ajudas").eq("usuario_id", user.id).maybeSingle();
        if (error) { console.warn("Não foi possível carregar os pontos do Pulsan:", error); return; }
        if (!ativo) return;

        const p = Number(data?.pontos ?? 0), a = Number(data?.ajudas ?? 0);
        setPontos(p); setAjudas(a);
        localStorage.setItem("pulsanPontos", String(p));
        localStorage.setItem("pulsanAjudas", String(a));
      } catch (e) { console.warn("Erro ao carregar estatísticas:", e); }
    })();
    return () => { ativo = false; };
  }, []);

  return { quantidade, media, ajudas, pontos };
}

function useContador(alvo, reduzir) {
  const [valor, setValor] = useState(0);
  const anterior = useRef(0);
  useEffect(() => {
    const fim = Number(alvo);
    if (!Number.isFinite(fim) || reduzir) { setValor(fim || 0); return; }
    const ini = anterior.current, t0 = performance.now();
    let raf;
    const passo = (t) => {
      const k = Math.min(1, (t - t0) / 900);
      setValor(Math.round(ini + (fim - ini) * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(passo); else anterior.current = fim;
    };
    raf = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(raf);
  }, [alvo, reduzir]);
  return valor;
}

/* ═════════ COMPONENTES POR FUNÇÃO ═════════ */
function Estatistica({ icone, valor, rotulo, reduzir }) {
  const numerico = valor !== "—" && Number.isFinite(Number(valor));
  const animado = useContador(numerico ? Number(valor) : 0, reduzir || String(valor).includes("."));
  return (
    <div className="pf-stat">
      <span className="pf-stat-i"><Icone nome={icone} tamanho={20} /></span>
      <strong>{numerico && !String(valor).includes(".") ? animado : valor}</strong>
      <span>{rotulo}</span>
    </div>
  );
}

function Cartao({ icone, titulo, subtitulo, acao, children, destaque }) {
  return (
    <section className={`pf-card ${destaque ? "pf-destaque" : ""}`}>
      <div className="pf-card-top">
        <div className="pf-card-ti"><span className="pf-chip-i"><Icone nome={icone} tamanho={19} /></span>
          <div><h2>{titulo}</h2>{subtitulo && <small>{subtitulo}</small>}</div></div>
        {acao}
      </div>
      {children}
    </section>
  );
}

function AbaResumo({ pontos, irPara }) {
  const nivel = calcularNivel(pontos);
  const essencia = [
    ["borboleta", "Transformação", "Assim como a borboleta, cada pessoa pode encontrar espaço para recomeçar."],
    ["vagalume", "Um ponto de luz", "O acolhimento pode iluminar momentos difíceis e lembrar que ninguém precisa enfrentar tudo sozinho."],
    ["camaleao", "Sem medo de julgamento", "Você não precisa esconder o que sente para fazer parte do Pulsan."],
  ];
  return (
    <>
      <Cartao icone="estrela" titulo="Sua jornada" subtitulo={`Nível ${nivel.atual.nome}`}>
        <div className="pf-bar"><span style={{ width: `${nivel.pct}%` }} /></div>
        <p className="pf-txt">{nivel.proximo ? `Faltam ${nivel.falta} pontos para o nível ${nivel.proximo.nome}.` : "Você alcançou o nível mais alto. Obrigado por acolher."}</p>
      </Cartao>
      <Cartao icone="coracao" titulo="A essência do Pulsan" subtitulo="Mais do que um perfil">
        <div className="pf-trio">
          {essencia.map(([i, t, d]) => (
            <div className="pf-feat" key={t}><span className="pf-chip-i"><Icone nome={i} tamanho={22} /></span><strong>{t}</strong><p>{d}</p></div>
          ))}
        </div>
      </Cartao>
      <Cartao destaque icone="trofeu" titulo="Seu impacto também importa">
        <p className="pf-txt">Quando você acolhe alguém com respeito, ajuda a construir uma comunidade onde pedir ajuda e oferecer apoio fazem parte da mesma rede.</p>
        <button type="button" className="pf-btn branco" onClick={() => irPara("premios")}><Icone nome="premio" tamanho={17} /> Ver benefícios e prêmios</button>
      </Cartao>
    </>
  );
}

function AbaConquistas({ quantidade, media, ajudas, selos }) {
  const m = Number(media) || 0;
  const conquistas = [
    { icone: "trofeu", titulo: "Apoiador de confiança", desc: "10 avaliações com média 4,5 ou mais.", ok: selos.apoiador,
      barras: [["Avaliações", Math.min(100, quantidade * 10), `${quantidade}/10`], ["Média", Math.min(100, (m / 4.5) * 100), `${media}/4,5`]] },
    { icone: "coracao", titulo: "Primeira ajuda", desc: "Ajude pelo menos uma pessoa.", ok: ajudas >= 1, barras: [["Pessoas ajudadas", Math.min(100, ajudas * 100), `${ajudas}/1`]] },
    { icone: "protecao", titulo: "Psicólogo parceiro", desc: "Selo concedido a profissionais parceiros.", ok: selos.psicologo },
  ];
  return (
    <Cartao icone="trofeu" titulo="Conquistas" subtitulo="Selos que mostram seu cuidado">
      <div className="pf-conq">
        {conquistas.map((c) => (
          <div key={c.titulo} className={`pf-conquista ${c.ok ? "ok" : ""}`}>
            <span className="pf-conq-i"><Icone nome={c.ok ? "check" : "cadeado"} tamanho={22} /></span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <strong>{c.titulo}</strong><p>{c.desc}</p>
              {!c.ok && c.barras?.map(([r, p, t]) => (
                <div key={r} className="pf-mini"><div className="pf-bar sm"><span style={{ width: `${p}%` }} /></div><small>{r}: {t}</small></div>
              ))}
            </div>
            <span className="pf-tag">{c.ok ? "Conquistado" : "Bloqueado"}</span>
          </div>
        ))}
      </div>
    </Cartao>
  );
}

function AbaDados({ perfil, media, quantidade, editando, setEditando, aviso, setAviso }) {
  const [novoNome, setNovoNome] = useState(perfil.nome);
  const [novoEmail, setNovoEmail] = useState(perfil.email);
  const [novaFoto, setNovaFoto] = useState(perfil.foto);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");

  useEffect(() => {
    if (editando) { setNovoNome(perfil.nome); setNovoEmail(perfil.email); setNovaFoto(perfil.foto); setErro(""); }
  }, [editando]); // eslint-disable-line

  const estrelas = quantidade ? "★".repeat(Math.max(0, Math.min(5, Math.round(Number(media))))).padEnd(5, "☆") : "☆☆☆☆☆";

  function selecionarFoto(e) {
    const arquivo = e.target.files?.[0];
    if (!arquivo) return;
    if (!arquivo.type.startsWith("image/")) { setErro("Escolha uma imagem válida."); return; }
    if (arquivo.size > 3 * 1024 * 1024) { setErro("A imagem deve ter no máximo 3 MB."); return; }
    const leitor = new FileReader();
    leitor.onload = () => { setNovaFoto(String(leitor.result || "")); setErro(""); };
    leitor.onerror = () => setErro("Não foi possível carregar a imagem.");
    leitor.readAsDataURL(arquivo);
  }

  async function salvar() {
    const nomeLimpo = novoNome.trim(), emailLimpo = novoEmail.trim().toLowerCase();
    if (!nomeLimpo) { setErro("Digite seu nome."); return; }
    if (!emailLimpo) { setErro("Digite seu e-mail."); return; }
    try {
      setSalvando(true); setErro(""); setAviso("");
      const extra = await perfil.salvar(nomeLimpo, emailLimpo, novaFoto);
      setEditando(false);
      setAviso(`Perfil atualizado com sucesso!${extra}`);
    } catch (e) {
      console.error("Erro ao salvar perfil:", e);
      setErro(e?.message || "Não foi possível salvar as alterações.");
    } finally { setSalvando(false); }
  }

  const dados = [["Nome", perfil.nome], ["E-mail", perfil.email || "Não informado"], ["Tipo de perfil", perfil.tipoUsuario],
    ["Reputação", media === "—" ? "Ainda sem avaliações" : `${media}/5 ${estrelas}`]];

  return (
    <Cartao icone="editar" titulo={editando ? "Editar meu perfil" : "Meus dados"} subtitulo="Informações da sua conta"
      acao={!editando && <button type="button" className="pf-btn suave" onClick={() => setEditando(true)}><Icone nome="editar" tamanho={16} /> Editar</button>}>
      {aviso && !editando && <div className="pf-aviso ok" role="status">{aviso}</div>}
      {!editando ? (
        <div className="pf-dados">{dados.map(([r, v]) => <div className="pf-dado" key={r}><small>{r}</small><span>{v}</span></div>)}</div>
      ) : (
        <div className="pf-edit">
          <div className="pf-edit-foto">
            <div className="pf-foto-grande">{novaFoto ? <img src={novaFoto} alt="Pré-visualização" /> : <Icone nome="usuario" tamanho={48} />}</div>
            <label className="pf-btn cheio"><Icone nome="imagem" tamanho={16} /> Trocar imagem
              <input type="file" accept="image/png,image/jpeg,image/webp" onChange={selecionarFoto} hidden /></label>
            {novaFoto && <button type="button" className="pf-link" onClick={() => setNovaFoto("")}>Remover imagem</button>}
          </div>
          <div className="pf-campos">
            <label>NOME<input value={novoNome} onChange={(e) => setNovoNome(e.target.value)} placeholder="Seu nome" maxLength={100} /></label>
            <label>E-MAIL<input type="email" value={novoEmail} onChange={(e) => setNovoEmail(e.target.value)} placeholder="seu@email.com" maxLength={150} /></label>
            <div className="pf-aviso"><Icone nome="cadeado" tamanho={15} /> A alteração do e-mail usa a autenticação do Supabase. Dependendo da configuração da conta, pode ser necessário confirmar o novo endereço.</div>
            {erro && <div className="pf-aviso erro" role="alert">{erro}</div>}
            <div className="pf-linha">
              <button type="button" className="pf-btn suave" onClick={() => { setEditando(false); setErro(""); }} disabled={salvando}>Cancelar</button>
              <button type="button" className="pf-btn cheio" onClick={salvar} disabled={salvando}>{salvando ? "Salvando..." : <><Icone nome="salvar" tamanho={16} /> Salvar alterações</>}</button>
            </div>
          </div>
        </div>
      )}
    </Cartao>
  );
}

function AbaSeguranca({ irPara }) {
  const itens = [
    ["cadeado", "Privacidade", "Seus dados são tratados de forma protegida."],
    ["escudo", "Proteção", "Você pode conversar sem precisar expor sua identidade."],
  ];
  return (
    <Cartao icone="cadeado" titulo="Segurança e privacidade" subtitulo="Seu espaço deve continuar sendo seguro.">
      <div className="pf-trio">
        {itens.map(([i, t, d]) => <div className="pf-feat" key={t}><span className="pf-chip-i"><Icone nome={i} tamanho={22} /></span><strong>{t}</strong><p>{d}</p></div>)}
        <button type="button" className="pf-feat clicavel" onClick={() => irPara("acessibilidade")}>
          <span className="pf-chip-i"><Icone nome="acessibilidade" tamanho={22} /></span><strong>Acessibilidade</strong>
          <p>Personalize o Pulsan para ficar mais confortável para você.</p>
        </button>
      </div>
    </Cartao>
  );
}

function AbaAparencia({ escuro, alterarTema }) {
  const escolher = (valor) => { if (typeof alterarTema === "function" && (valor === "escuro") !== escuro) alterarTema(valor); };
  return (
    <Cartao icone={escuro ? "lua" : "sol"} titulo="Aparência do Pulsan" subtitulo={escuro ? "Você está usando o modo escuro." : "Você está usando o modo claro."}>
      <div className="pf-temas" role="radiogroup" aria-label="Tema">
        {[["claro", "Claro", "sol"], ["escuro", "Escuro", "lua"]].map(([v, n, i]) => {
          const ativo = (v === "escuro") === escuro;
          return (
            <button key={v} type="button" role="radio" aria-checked={ativo} className={`pf-tema ${v} ${ativo ? "ativo" : ""}`} onClick={() => escolher(v)}>
              <span className="pf-previa"><i /><i /><i /></span>
              <span className="pf-tema-n"><Icone nome={i} tamanho={17} /> {n}{ativo && <Icone nome="check" tamanho={16} />}</span>
            </button>
          );
        })}
      </div>
    </Cartao>
  );
}

function BarraNavegacao({ irPara }) {
  const itens = [["solicitacoes", "Conversas", "conversa"], ["ajudar", "Ajudar", "coracao"], [null, "Perfil", "usuario"]];
  return (
    <nav className="pf-nav" aria-label="Navegação">
      {itens.map(([id, n, i]) => (
        <button key={n} type="button" className={!id ? "ativo" : ""} aria-current={!id ? "page" : undefined} onClick={() => id && irPara(id)}>
          <Icone nome={i} tamanho={23} /><span>{n}</span>
        </button>
      ))}
    </nav>
  );
}

/* ═════════ ESTILOS ═════════ */
const CSS = `
.pf{--bg:#f4f8ff;--card:#fff;--soft:#eaf3ff;--ink:#102d50;--mut:#61758f;--line:#d8e6f5;--az:#3a7dff;--az2:#2563d9;--ok:#2e9d68;--sh:0 14px 40px #0f2d5b12;min-height:100vh;padding-bottom:110px;background:radial-gradient(900px 420px at 8% -5%,#a8c7ff55,transparent 70%),radial-gradient(700px 400px at 96% 10%,#3a7dff14,transparent 70%),var(--bg);color:var(--ink);font-family:Arial,Helvetica,sans-serif}
.pf[data-tema="escuro"]{--bg:#071a31;--card:#0f2d5b;--soft:#15365f;--ink:#f4f8ff;--mut:#b8cbe3;--line:#274a73;--sh:0 14px 40px #00000040;background:radial-gradient(900px 420px at 8% -5%,#3a7dff26,transparent 70%),var(--bg)}
.pf *{box-sizing:border-box}
.pf-head{position:sticky;top:0;z-index:20;background:color-mix(in srgb,var(--card) 86%,transparent);border-bottom:1px solid var(--line);backdrop-filter:blur(14px)}
.pf-head-in,.pf-main{width:min(1000px,calc(100% - 32px));margin:0 auto}
.pf-head-in{min-height:72px;display:flex;align-items:center;gap:12px}
.pf-head img{width:44px;height:44px;object-fit:contain}
.pf-head strong{display:block;font-size:20px;font-weight:900;letter-spacing:.18em}
.pf-head small{color:var(--mut);font-size:12px}
.pf-main{padding:24px 0}
.pf-hero{position:relative;background:var(--card);border:1px solid var(--line);border-radius:28px;box-shadow:var(--sh);overflow:hidden}
.pf-banner{height:128px;background:linear-gradient(120deg,#3a7dff,#1d4fb8 60%,#0f2d5b);position:relative;overflow:hidden}
.pf-banner svg{position:absolute;left:0;right:0;bottom:18px;width:100%;height:60px;opacity:.28}
.pf-banner:before{content:"";position:absolute;width:220px;height:220px;right:-60px;top:-110px;border-radius:50%;background:#ffffff1f}
.pf-hero-body{padding:0 clamp(20px,4vw,34px) 26px;display:flex;gap:22px;align-items:flex-end;flex-wrap:wrap;margin-top:-62px}
.pf-avatar{position:relative;width:148px;height:148px;flex:none}
.pf-avatar svg.ring{position:absolute;inset:0;transform:rotate(-90deg)}
.pf-foto{position:absolute;inset:12px;border-radius:50%;overflow:hidden;display:grid;place-items:center;background:linear-gradient(135deg,#eaf3ff,#a8c7ff);color:var(--az);border:4px solid var(--card)}
.pf-foto img{width:100%;height:100%;object-fit:cover}
.pf-nivel{position:absolute;left:50%;bottom:-6px;transform:translateX(-50%);padding:4px 12px;border-radius:999px;background:var(--az);color:#fff;font-size:11px;font-weight:800;border:3px solid var(--card);white-space:nowrap}
.pf-info{flex:1;min-width:230px;padding-top:68px}
.pf-info h1{margin:0 0 4px;font-size:clamp(26px,4vw,36px);letter-spacing:-.03em;line-height:1.1}
.pf-info p{margin:0;color:var(--mut);font-size:14px}
.pf-selos{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
.pf-selo{display:inline-flex;align-items:center;gap:7px;padding:7px 12px;border-radius:999px;background:var(--soft);border:1px solid var(--line);color:var(--az);font-size:12px;font-weight:800}
.pf-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:18px 0}
.pf-stat{background:var(--card);border:1px solid var(--line);border-radius:20px;padding:16px 10px;text-align:center;box-shadow:var(--sh);transition:transform .2s}
.pf-stat:hover{transform:translateY(-3px)}
.pf-stat-i{display:inline-grid;place-items:center;width:38px;height:38px;border-radius:12px;background:var(--soft);color:var(--az)}
.pf-stat strong{display:block;margin-top:8px;font-size:26px}
.pf-stat span:last-child{display:block;margin-top:3px;color:var(--mut);font-size:11px}
.pf-tabs{display:flex;gap:6px;padding:6px;background:var(--card);border:1px solid var(--line);border-radius:18px;overflow-x:auto;box-shadow:var(--sh)}
.pf-tab{flex:1 0 auto;display:flex;align-items:center;justify-content:center;gap:8px;border:0;border-radius:13px;padding:11px 16px;background:transparent;color:var(--mut);font:inherit;font-size:14px;font-weight:700;cursor:pointer;white-space:nowrap;transition:background .2s,color .2s}
.pf-tab:hover{background:var(--soft);color:var(--ink)}
.pf-tab[aria-selected="true"]{background:var(--az);color:#fff;box-shadow:0 8px 18px #3a7dff40}
.pf-panel{display:grid;gap:16px;margin-top:16px;animation:pfIn .35s ease both}
@keyframes pfIn{from{opacity:0;transform:translateY(8px)}}
.pf-card{background:var(--card);border:1px solid var(--line);border-radius:24px;padding:clamp(18px,3vw,26px);box-shadow:var(--sh)}
.pf-destaque{background:linear-gradient(135deg,#3a7dff,#0f2d5b);color:#fff;border:0}
.pf-destaque .pf-txt,.pf-destaque small{color:#ffffffcc}
.pf-destaque .pf-chip-i{background:#ffffff26;color:#fff}
.pf-card-top{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:16px;flex-wrap:wrap}
.pf-card-ti{display:flex;align-items:center;gap:12px}
.pf-card h2{margin:0;font-size:19px}
.pf-card small{color:var(--mut);font-size:12px}
.pf-chip-i{flex:none;width:42px;height:42px;border-radius:14px;display:grid;place-items:center;background:var(--soft);color:var(--az)}
.pf-txt{margin:12px 0 0;color:var(--mut);font-size:14px;line-height:1.65}
.pf-bar{height:10px;border-radius:10px;background:var(--soft);overflow:hidden}
.pf-bar.sm{height:6px}
.pf-bar span{display:block;height:100%;border-radius:10px;background:linear-gradient(90deg,#3a7dff,#7fb0ff);transition:width .8s ease}
.pf-trio{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
.pf-feat{display:flex;flex-direction:column;align-items:flex-start;gap:6px;text-align:left;padding:18px;border-radius:18px;background:var(--soft);border:1px solid var(--line);color:var(--ink);font:inherit}
.pf-feat p{margin:0;color:var(--mut);font-size:13px;line-height:1.5}
.pf-feat.clicavel{cursor:pointer;transition:transform .2s,border-color .2s}
.pf-feat.clicavel:hover{transform:translateY(-3px);border-color:var(--az)}
.pf-conq{display:grid;gap:12px}
.pf-conquista{display:flex;gap:14px;align-items:flex-start;padding:16px;border-radius:18px;border:1px dashed var(--line);background:var(--soft);opacity:.85}
.pf-conquista.ok{opacity:1;border:1px solid var(--ok);background:color-mix(in srgb,var(--ok) 12%,var(--card))}
.pf-conquista p{margin:3px 0 0;color:var(--mut);font-size:13px}
.pf-conq-i{flex:none;width:44px;height:44px;border-radius:14px;display:grid;place-items:center;background:var(--card);color:var(--mut)}
.pf-conquista.ok .pf-conq-i{background:var(--ok);color:#fff}
.pf-tag{font-size:11px;font-weight:800;color:var(--mut);white-space:nowrap}
.pf-conquista.ok .pf-tag{color:var(--ok)}
.pf-mini{margin-top:10px}.pf-mini small{display:block;margin-top:4px}
.pf-dados{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
.pf-dado{padding:16px;border-radius:16px;background:var(--soft);border:1px solid var(--line)}
.pf-dado small{display:block;font-weight:800;letter-spacing:.05em;text-transform:uppercase;font-size:10px}
.pf-dado span{display:block;margin-top:5px;font-size:15px;overflow-wrap:anywhere}
.pf-edit{display:grid;grid-template-columns:180px 1fr;gap:22px;align-items:start}
.pf-edit-foto{display:grid;gap:10px;justify-items:center}
.pf-foto-grande{width:140px;height:140px;border-radius:36px;overflow:hidden;display:grid;place-items:center;background:linear-gradient(135deg,#eaf3ff,#a8c7ff);color:var(--az)}
.pf-foto-grande img{width:100%;height:100%;object-fit:cover}
.pf-campos{display:grid;gap:14px}
.pf-campos label{font-size:11px;font-weight:800;color:var(--mut);letter-spacing:.05em}
.pf-campos input{display:block;width:100%;margin-top:6px;min-height:46px;padding:11px 14px;border-radius:12px;border:1px solid var(--line);background:var(--card);color:var(--ink);font:inherit;font-size:14px;outline:0}
.pf-campos input:focus{border-color:var(--az);box-shadow:0 0 0 4px #3a7dff22}
.pf-aviso{display:flex;gap:8px;align-items:flex-start;padding:12px 14px;border-radius:12px;background:var(--soft);color:var(--mut);font-size:12px;line-height:1.5}
.pf-aviso.ok{margin-bottom:14px;background:color-mix(in srgb,var(--ok) 14%,var(--card));color:var(--ink)}
.pf-aviso.erro{background:#ffe9ec;color:#a83f50}
.pf[data-tema="escuro"] .pf-aviso.erro{background:#3b2028;color:#f3b8c3}
.pf-linha{display:flex;justify-content:flex-end;gap:10px;flex-wrap:wrap}
.pf-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:1px solid transparent;border-radius:13px;padding:12px 18px;font:inherit;font-size:14px;font-weight:800;cursor:pointer;transition:transform .15s,box-shadow .15s,opacity .15s}
.pf-btn:hover:not(:disabled){transform:translateY(-2px)}
.pf-btn:disabled{opacity:.6;cursor:wait}
.pf-btn.cheio{background:var(--az);color:#fff;box-shadow:0 10px 22px #3a7dff40}
.pf-btn.suave{background:var(--soft);color:var(--ink);border-color:var(--line)}
.pf-btn.branco{background:#fff;color:#245aa8;margin-top:16px}
.pf-link{border:0;background:transparent;color:var(--mut);font:inherit;font-size:12px;cursor:pointer;text-decoration:underline}
.pf-temas{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
.pf-tema{display:grid;gap:12px;padding:14px;border-radius:20px;border:2px solid var(--line);background:var(--card);color:var(--ink);font:inherit;cursor:pointer;transition:transform .2s,border-color .2s}
.pf-tema:hover{transform:translateY(-3px)}
.pf-tema.ativo{border-color:var(--az);box-shadow:0 0 0 4px #3a7dff22}
.pf-previa{display:grid;gap:6px;padding:14px;border-radius:14px;border:1px solid #0001}
.pf-tema.claro .pf-previa{background:#f4f8ff}.pf-tema.escuro .pf-previa{background:#071a31}
.pf-previa i{display:block;height:10px;border-radius:6px}
.pf-tema.claro .pf-previa i{background:#d8e6f5}.pf-tema.escuro .pf-previa i{background:#274a73}
.pf-previa i:first-child{width:60%;background:#3a7dff!important}
.pf-tema-n{display:flex;align-items:center;gap:8px;font-weight:800;font-size:14px}
.pf-tema-n svg:last-child{margin-left:auto;color:var(--az)}
.pf-sair{width:100%;margin-top:22px;padding:14px;border-radius:16px;border:1px solid #e8cdd4;background:#fff8fa;color:#b64a4a;font:inherit;font-weight:800;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px}
.pf[data-tema="escuro"] .pf-sair{background:#2a1b25;border-color:#613743}
.pf-nav{position:fixed;z-index:50;left:0;right:0;bottom:0;height:76px;display:flex;align-items:center;justify-content:center;gap:clamp(24px,10vw,80px);background:color-mix(in srgb,var(--card) 94%,transparent);border-top:1px solid var(--line);backdrop-filter:blur(12px)}
.pf-nav button{display:flex;flex-direction:column;align-items:center;gap:3px;min-width:72px;border:0;background:transparent;color:var(--mut);font:inherit;font-size:12px;cursor:pointer}
.pf-nav .ativo{color:var(--az);font-weight:900}
.pf button:focus-visible,.pf input:focus-visible{outline:3px solid #3a7dff66;outline-offset:2px}
.pf.pf-contraste{filter:contrast(1.08)}
.pf.pf-botoes .pf-btn,.pf.pf-botoes .pf-tab{padding:15px 20px}
@media(max-width:760px){.pf-stats{grid-template-columns:repeat(2,1fr)}.pf-trio,.pf-dados,.pf-edit{grid-template-columns:1fr}.pf-hero-body{justify-content:center;text-align:center}.pf-info{padding-top:6px}.pf-selos{justify-content:center}.pf-temas{grid-template-columns:1fr 1fr}}
@media(prefers-reduced-motion:reduce){.pf *{animation:none!important;transition:none!important}}
`;

/* ═════════ TELA ═════════ */
function Perfil({ irPara, tema = "claro", alterarTema, acessibilidade = {}, alterarAcessibilidade, sairDaConta }) {
  const escuro = tema === "escuro";
  const reduzir = acessibilidade?.reduzirAnimacoes === true;
  const perfil = usePerfil();
  const { quantidade, media, ajudas, pontos } = useEstatisticas();

  const [aba, setAba] = useState("resumo");
  const [editando, setEditando] = useState(false);
  const [aviso, setAviso] = useState("");

  const selos = {
    apoiador: quantidade >= 10 && Number(media) >= 4.5,
    psicologo: localStorage.getItem("pulsanPsicologoParceiro") === "true",
  };
  const nivel = calcularNivel(pontos);
  const R = 70, C = 2 * Math.PI * R;

  function iniciarEdicao() { setAviso(""); setAba("dados"); setEditando(true); }

  function sair() {
    if (!window.confirm("Deseja realmente sair da sua conta?")) return;
    if (typeof sairDaConta === "function") sairDaConta();
    else if (typeof irPara === "function") irPara("inicio");
  }

  const classes = ["pf", acessibilidade?.altoContraste ? "pf-contraste" : "", acessibilidade?.botoesMaiores ? "pf-botoes" : ""].join(" ");

  return (
    <div className={classes} data-tema={escuro ? "escuro" : "claro"} style={{ fontSize: acessibilidade?.textoMaior ? 18 : 16 }}>
      <style>{CSS}</style>

      <header className="pf-head">
        <div className="pf-head-in">
          <img src="/logo.png" alt="Logo Pulsan" />
          <div><strong>PULSAN</strong><small>Seu espaço de acolhimento</small></div>
        </div>
      </header>

      <main className="pf-main">
        <section className="pf-hero">
          <div className="pf-banner" aria-hidden="true">
            <svg viewBox="0 0 600 60" preserveAspectRatio="none"><path d="M0 32H190l12-10 12 10 12-28 16 54 14-36 10 10H600" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </div>
          <div className="pf-hero-body">
            <div className="pf-avatar">
              <svg className="ring" viewBox="0 0 148 148" aria-hidden="true">
                <circle cx="74" cy="74" r={R} fill="none" stroke="var(--line)" strokeWidth="6" />
                <circle cx="74" cy="74" r={R} fill="none" stroke="#3a7dff" strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={`${(nivel.pct / 100) * C} ${C}`} style={{ transition: reduzir ? "none" : "stroke-dasharray 1s ease" }} />
              </svg>
              <div className="pf-foto">{perfil.foto ? <img src={perfil.foto} alt="Foto do perfil" /> : <Icone nome="usuario" tamanho={52} />}</div>
              <span className="pf-nivel">Nível {nivel.atual.nome}</span>
            </div>

            <div className="pf-info">
              <h1>{perfil.nome}</h1>
              <p>{perfil.tipoUsuario}</p>
              <div className="pf-selos">
                <span className="pf-selo"><Icone nome="borboleta" tamanho={15} /> Meu espaço Pulsan</span>
                {selos.psicologo && <span className="pf-selo"><Icone nome="protecao" tamanho={15} /> Psicólogo parceiro</span>}
                {selos.apoiador && <span className="pf-selo"><Icone nome="trofeu" tamanho={15} /> Apoiador de confiança</span>}
              </div>
            </div>

            <button type="button" className="pf-btn cheio" onClick={iniciarEdicao}><Icone nome="editar" tamanho={17} /> Editar meu perfil</button>
          </div>
        </section>

        <div className="pf-stats">
          <Estatistica icone="conversa" valor={quantidade} rotulo="Avaliações recebidas" reduzir={reduzir} />
          <Estatistica icone="coracao" valor={ajudas} rotulo="Pessoas ajudadas" reduzir={reduzir} />
          <Estatistica icone="estrela" valor={media} rotulo="Média das avaliações" reduzir={reduzir} />
          <Estatistica icone="trofeu" valor={pontos} rotulo="Pontos acumulados" reduzir={reduzir} />
        </div>

        <div className="pf-tabs" role="tablist" aria-label="Seções do perfil">
          {ABAS.map(([id, nome, icone]) => (
            <button key={id} type="button" role="tab" id={`tab-${id}`} aria-selected={aba === id} aria-controls="pf-painel" className="pf-tab"
              onClick={() => { setAba(id); if (id !== "dados") setEditando(false); }}>
              <Icone nome={icone} tamanho={17} />{nome}
            </button>
          ))}
        </div>

        <div className="pf-panel" key={aba} id="pf-painel" role="tabpanel" aria-labelledby={`tab-${aba}`}>
          {aba === "resumo" && <AbaResumo pontos={pontos} irPara={irPara} />}
          {aba === "conquistas" && <AbaConquistas quantidade={quantidade} media={media} ajudas={ajudas} selos={selos} />}
          {aba === "dados" && <AbaDados perfil={perfil} media={media} quantidade={quantidade} editando={editando} setEditando={setEditando} aviso={aviso} setAviso={setAviso} />}
          {aba === "seguranca" && <AbaSeguranca irPara={irPara} />}
          {aba === "aparencia" && <AbaAparencia escuro={escuro} alterarTema={alterarTema} />}
        </div>

        <button type="button" className="pf-sair" onClick={sair}><Icone nome="sair" tamanho={18} /> Sair da conta</button>
      </main>

      <BarraNavegacao irPara={irPara} />
    </div>
  );
}

export default Perfil;