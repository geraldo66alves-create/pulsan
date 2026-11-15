
import React, { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const sentimentos = [
  ["Muito bem", "😄"], ["Bem", "🙂"], ["Tranquilo", "😌"],
  ["Cansado", "😴"], ["Ansioso", "😟"], ["Sobrecarregado", "😣"],
  ["Triste", "😢"], ["Irritado", "😠"], ["Confuso", "😕"],
  ["Desanimado", "😔"]
];

const css = {
  fundo: "var(--pulsan-bg, #EAF3FF)",
  card: "var(--pulsan-card, #FFFFFF)",
  texto: "var(--pulsan-texto, #0F2D5B)",
  secundario: "var(--pulsan-texto-secundario, #5F7695)",
  borda: "var(--pulsan-borda, #A8C7FF)",
  primaria: "var(--pulsan-primaria, #3A7DFF)"
};

function dataFormatada(valor) {
  return new Date(valor).toLocaleString("pt-BR", {
    day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
}

export default function CheckinEmocional() {
  const [sentimento, setSentimento] = useState("");
  const [intensidade, setIntensidade] = useState(3);
  const [observacao, setObservacao] = useState("");
  const [historico, setHistorico] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const carregarHistorico = useCallback(async () => {
    setCarregando(true);
    setErro("");
    const { data: auth, error: authError } = await supabase.auth.getUser();
    if (authError || !auth?.user) {
      setErro("Entre na sua conta para acessar seu histórico.");
      setCarregando(false);
      return;
    }
    const { data, error } = await supabase
      .from("checkins_emocionais")
      .select("id,sentimento,intensidade,observacao,criado_em")
      .eq("usuario_id", auth.user.id)
      .order("criado_em", { ascending: false })
      .limit(30);
    if (error) {
      setErro("Não foi possível carregar o histórico. Confira a tabela no Supabase.");
    } else {
      setHistorico(data || []);
    }
    setCarregando(false);
  }, []);

  useEffect(() => {
    carregarHistorico();
  }, [carregarHistorico]);

  async function salvarCheckin(e) {
    e.preventDefault();
    if (!sentimento) {
      setErro("Escolha como você está se sentindo.");
      return;
    }
    setSalvando(true);
    setErro("");
    setSucesso("");
    const { data: auth, error: authError } = await supabase.auth.getUser();
    if (authError || !auth?.user) {
      setErro("Sua sessão expirou. Entre novamente.");
      setSalvando(false);
      return;
    }
    const { error } = await supabase.from("checkins_emocionais").insert({
      usuario_id: auth.user.id,
      sentimento,
      intensidade,
      observacao: observacao.trim() || null
    });
    if (error) {
      setErro("Não foi possível salvar o check-in. Verifique a tabela e as políticas RLS.");
      setSalvando(false);
      return;
    }
    setSentimento("");
    setIntensidade(3);
    setObservacao("");
    setSucesso("Seu check-in foi registrado com privacidade.");
    await carregarHistorico();
    setSalvando(false);
  }

  const card = {
    background: css.card,
    border: `1px solid ${css.borda}`,
    borderRadius: 20,
    padding: 20,
    boxShadow: "0 8px 28px rgba(15,45,91,.06)"
  };

  return (
    <main style={{ minHeight: "100vh", background: css.fundo, color: css.texto, padding: "28px 16px 110px", boxSizing: "border-box" }}>
      <div style={{ maxWidth: 820, margin: "0 auto" }}>
        <header style={{ marginBottom: 22 }}>
          <span style={{ color: css.primaria, fontWeight: 700, fontSize: 13 }}>CUIDADO COM VOCÊ</span>
          <h1 style={{ fontSize: "clamp(26px, 5vw, 36px)", margin: "8px 0" }}>Check-in emocional</h1>
          <p style={{ color: css.secundario, lineHeight: 1.6, margin: 0 }}>Pare um instante e reconheça como você está. Não existe resposta certa ou errada.</p>
        </header>

        <form onSubmit={salvarCheckin} style={{ ...card, marginBottom: 22 }}>
          <h2 style={{ fontSize: 20, margin: "0 0 8px" }}>Como você está se sentindo agora?</h2>
          <p style={{ color: css.secundario, margin: "0 0 16px", fontSize: 14 }}>Escolha a opção que mais se aproxima do seu momento.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(125px,1fr))", gap: 10 }}>
            {sentimentos.map(([nome, emoji]) => {
              const ativo = sentimento === nome;
              return (
                <button key={nome} type="button" onClick={() => setSentimento(nome)} aria-pressed={ativo}
                  style={{ border: `2px solid ${ativo ? css.primaria : css.borda}`, background: ativo ? "#EAF3FF" : css.card, color: css.texto, borderRadius: 14, padding: "13px 8px", cursor: "pointer", fontWeight: ativo ? 700 : 500 }}>
                  <span style={{ display: "block", fontSize: 27, marginBottom: 5 }}>{emoji}</span>{nome}
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: 22 }}>
            <label htmlFor="checkin-intensidade" style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Intensidade desse sentimento</label>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ color: css.secundario, fontSize: 12 }}>Leve</span>
              <input id="checkin-intensidade" type="range" min="1" max="5" value={intensidade} onChange={e => setIntensidade(Number(e.target.value))} style={{ flex: 1, accentColor: css.primaria }} />
              <span style={{ color: css.secundario, fontSize: 12 }}>Intenso</span>
              <strong style={{ color: css.primaria }}>{intensidade}/5</strong>
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <label htmlFor="checkin-observacao" style={{ display: "block", fontWeight: 700, marginBottom: 8 }}>Quer registrar algo? <span style={{ color: css.secundario, fontWeight: 400 }}>(opcional)</span></label>
            <textarea id="checkin-observacao" value={observacao} onChange={e => setObservacao(e.target.value)} maxLength={1000} rows={3} placeholder="Escreva livremente, se desejar..." style={{ width: "100%", boxSizing: "border-box", border: `1px solid ${css.borda}`, borderRadius: 12, padding: 12, resize: "vertical", background: css.card, color: css.texto, font: "inherit" }} />
            <small style={{ color: css.secundario }}>{observacao.length}/1000 caracteres</small>
          </div>

          {erro && <p role="alert" style={{ color: "#B42318" }}>{erro}</p>}
          {sucesso && <p role="status" style={{ color: "#16804A" }}>{sucesso}</p>}
          <button type="submit" disabled={salvando} style={{ width: "100%", marginTop: 18, border: 0, borderRadius: 12, padding: 15, background: css.primaria, color: "#fff", fontWeight: 700, fontSize: 15, cursor: salvando ? "wait" : "pointer", opacity: salvando ? .7 : 1 }}>
            {salvando ? "Salvando..." : "Registrar meu check-in"}
          </button>
          <p style={{ color: css.secundario, fontSize: 12, lineHeight: 1.5 }}>Seus registros são privados e ficam disponíveis apenas na sua conta.</p>
        </form>

        <section style={card}>
          <h2 style={{ margin: "0 0 5px", fontSize: 20 }}>Meu histórico</h2>
          <p style={{ color: css.secundario, fontSize: 13, margin: "0 0 14px" }}>Seus últimos 30 registros.</p>
          {carregando ? <p>Carregando histórico...</p> :
            historico.length === 0 ? <p style={{ color: css.secundario }}>Você ainda não registrou nenhum check-in. Seu primeiro registro aparecerá aqui.</p> :
            <div style={{ display: "grid", gap: 10 }}>
              {historico.map(item => {
                const emocao = sentimentos.find(s => s[0] === item.sentimento);
                return (
                  <article key={item.id} style={{ border: `1px solid ${css.borda}`, borderRadius: 14, padding: 14, background: "var(--pulsan-card-secundario,#F7FAFF)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                      <strong>{emocao?.[1] || "💙"} {item.sentimento}</strong>
                      <small style={{ color: css.secundario }}>{dataFormatada(item.criado_em)}</small>
                    </div>
                    <p style={{ color: css.secundario, fontSize: 13, margin: "8px 0 0" }}>Intensidade: {item.intensidade}/5</p>
                    {item.observacao && <p style={{ margin: "8px 0 0", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{item.observacao}</p>}
                  </article>
                );
              })}
            </div>
          }
        </section>
      </div>
    </main>
  );
}