import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function Perfil({
  irPara,
  tema = "claro",
  alterarTema,
  acessibilidade = {},
  alterarAcessibilidade,
  sairDaConta,
}) {
  const escuro = tema === "escuro";

  const altoContraste = acessibilidade?.altoContraste ?? false;
  const textoGrande = acessibilidade?.textoMaior ?? false;
  const botoesGrandes = acessibilidade?.botoesMaiores ?? false;

  const cores = {
    fundo: escuro ? "#071A31" : "#F5F9FF",
    card: escuro ? "#0F2D5B" : "#FFFFFF",
    cardSuave: escuro ? "#15365F" : "#EAF3FF",
    texto: escuro ? "#F4F8FF" : "#102D50",
    textoSuave: escuro ? "#B8CBE3" : "#61758F",
    borda: escuro ? "#274A73" : "#D8E6F5",
    azul: "#3A7DFF",
    azulSuave: escuro ? "#173B6A" : "#EAF3FF",
  };

  const [nome, setNome] = useState(
    localStorage.getItem("pulsanNome") || "Usuário Pulsan"
  );
  const [foto, setFoto] = useState(
    localStorage.getItem("pulsanFoto") || ""
  );
  const [email, setEmail] = useState("");
  const [tipoUsuario, setTipoUsuario] = useState(
    localStorage.getItem("pulsanTipoUsuario") ||
      localStorage.getItem("tipoUsuario") ||
      localStorage.getItem("tipo") ||
      "Membro Pulsan"
  );

  const [editando, setEditando] = useState(false);
  const [novoNome, setNovoNome] = useState(nome);
  const [novoEmail, setNovoEmail] = useState("");
  const [novaFoto, setNovaFoto] = useState(foto);
  const [salvando, setSalvando] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");

  const [quantidadeAvaliacoes, setQuantidadeAvaliacoes] = useState(0);
  const [media, setMedia] = useState("—");
  const [quantidadeAjudas, setQuantidadeAjudas] = useState(0);
  const [pontos, setPontos] = useState(0);

  useEffect(() => {
    let ativo = true;

    async function carregarPerfil() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user || !ativo) return;

        const { data, error } = await supabase
          .from("perfis")
          .select("nome, foto_url")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          console.warn("Não foi possível carregar o perfil:", error);
        }

        const nomeBanco = data?.nome || user.user_metadata?.nome;
        const fotoBanco = data?.foto_url || user.user_metadata?.foto_url || user.user_metadata?.foto || localStorage.getItem("pulsanFoto") || "";

        setEmail(user.email || "");
        setNovoEmail(user.email || "");

        if (nomeBanco) {
          setNome(nomeBanco);
          setNovoNome(nomeBanco);
          localStorage.setItem("pulsanNome", nomeBanco);
        }

        if (fotoBanco) {
          setFoto(fotoBanco);
          setNovaFoto(fotoBanco);
          localStorage.setItem("pulsanFoto", fotoBanco);
        }
      } catch (e) {
        console.error("Erro ao carregar perfil:", e);
      }
    }

    carregarPerfil();

    return () => {
      ativo = false;
    };
  }, []);

  useEffect(() => {
    let ativo = true;

    async function carregarEstatisticas() {
      try {
        // Mantém as avaliações antigas do cache local para não alterar
        // a aparência/funcionamento já existente do perfil.
        const avaliacoes =
          JSON.parse(localStorage.getItem("pulsanAvaliacoes") || "[]");

        const quantidade = avaliacoes.length;
        const mediaCalculada =
          quantidade > 0
            ? (
                avaliacoes.reduce(
                  (total, avaliacao) =>
                    total + Number(avaliacao?.nota || 0),
                  0
                ) / quantidade
              ).toFixed(1)
            : "—";

        if (ativo) {
          setQuantidadeAvaliacoes(quantidade);
          setMedia(mediaCalculada);
        }

        // Os pontos e a quantidade de ajudas vêm do Supabase.
        // O ID do Supabase Auth é a fonte de verdade para evitar
        // divergência com o usuarioId salvo no localStorage.
        const {
          data: { user },
          error: erroUsuario,
        } = await supabase.auth.getUser();

        if (erroUsuario) {
          console.warn("Não foi possível identificar o usuário:", erroUsuario);
        }

        if (!user) {
          if (ativo) {
            setQuantidadeAjudas(0);
            setPontos(0);
          }
          return;
        }

        const { data: dadosPontos, error: erroPontos } = await supabase
          .from("pontos_pulsan")
          .select("pontos, ajudas")
          .eq("usuario_id", user.id)
          .maybeSingle();

        if (erroPontos) {
          console.warn("Não foi possível carregar os pontos do Pulsan:", erroPontos);
          return;
        }

        if (!ativo) return;

        const pontosBanco = Number(dadosPontos?.pontos ?? 0);
        const ajudasBanco = Number(dadosPontos?.ajudas ?? 0);

        setPontos(pontosBanco);
        setQuantidadeAjudas(ajudasBanco);

        // Atualiza também o cache local para outras telas que ainda o utilizem.
        localStorage.setItem("pulsanPontos", String(pontosBanco));
        localStorage.setItem("pulsanAjudas", String(ajudasBanco));
      } catch (e) {
        console.warn("Erro ao carregar estatísticas:", e);
      }
    }

    carregarEstatisticas();

    return () => {
      ativo = false;
    };
  }, []);

  const possuiSeloApoiador =
    quantidadeAvaliacoes >= 10 && Number(media) >= 4.5;

  const possuiSeloPsicologo =
    localStorage.getItem("pulsanPsicologoParceiro") === "true";

  function alternarTema() {
    if (typeof alterarTema === "function") {
      alterarTema(escuro ? "claro" : "escuro");
    }
  }

  function mostrarEstrelas() {
    if (!quantidadeAvaliacoes) return "☆☆☆☆☆";

    const cheias = Math.max(
      0,
      Math.min(5, Math.round(Number(media)))
    );

    return "★".repeat(cheias) + "☆".repeat(5 - cheias);
  }

  function iniciarEdicao() {
    setNovoNome(nome);
    setNovoEmail(email);
    setNovaFoto(foto);
    setMensagem("");
    setErro("");
    setEditando(true);
  }

  function cancelarEdicao() {
    setNovoNome(nome);
    setNovoEmail(email);
    setNovaFoto(foto);
    setMensagem("");
    setErro("");
    setEditando(false);
  }

  function selecionarFoto(event) {
    const arquivo = event.target.files?.[0];
    if (!arquivo) return;

    if (!arquivo.type.startsWith("image/")) {
      setErro("Escolha uma imagem válida.");
      return;
    }

    if (arquivo.size > 3 * 1024 * 1024) {
      setErro("A imagem deve ter no máximo 3 MB.");
      return;
    }

    const leitor = new FileReader();

    leitor.onload = () => {
      setNovaFoto(String(leitor.result || ""));
      setErro("");
    };

    leitor.onerror = () => {
      setErro("Não foi possível carregar a imagem.");
    };

    leitor.readAsDataURL(arquivo);
  }

  async function salvarPerfil() {
    const nomeLimpo = novoNome.trim();
    const emailLimpo = novoEmail.trim().toLowerCase();

    if (!nomeLimpo) {
      setErro("Digite seu nome.");
      return;
    }

    if (!emailLimpo) {
      setErro("Digite seu e-mail.");
      return;
    }

    try {
      setSalvando(true);
      setMensagem("");
      setErro("");

      const {
        data: { user },
        error: erroUsuario,
      } = await supabase.auth.getUser();

      if (erroUsuario || !user) {
        throw new Error("Usuário não autenticado.");
      }

      const { error: erroPerfil } = await supabase
        .from("perfis")
        .update({
          nome: nomeLimpo,
          foto_url: novaFoto || null,
        })
        .eq("id", user.id);

      if (erroPerfil) {
        throw erroPerfil;
      }

      let mensagemEmail = "";

      if (emailLimpo !== (user.email || "").toLowerCase()) {
        const { error: erroEmail } = await supabase.auth.updateUser({
          email: emailLimpo,
        });

        if (erroEmail) {
          throw erroEmail;
        }

        mensagemEmail =
          " O novo e-mail poderá precisar de confirmação.";
      }

      setNome(nomeLimpo);
      setFoto(novaFoto || "");
      setEmail(emailLimpo);
      setNovoNome(nomeLimpo);
      setNovoEmail(emailLimpo);

      localStorage.setItem("pulsanNome", nomeLimpo);

      if (novaFoto) {
        localStorage.setItem("pulsanFoto", novaFoto);
      } else {
        localStorage.removeItem("pulsanFoto");
      }

      // Mantém também a foto no metadata do usuário para que o perfil
      // continue conseguindo recuperá-la mesmo antes de uma nova leitura.
      try {
        await supabase.auth.updateUser({
          data: {
            nome: nomeLimpo,
            foto_url: novaFoto || "",
          },
        });
      } catch (erroMetadata) {
        console.warn("Não foi possível atualizar a foto no metadata:", erroMetadata);
      }

      // Mantém os dados que outras telas do Pulsan podem utilizar.
      try {
        const usuarioLogado = JSON.parse(
          localStorage.getItem("usuarioLogado") || "{}"
        );

        const atualizado = {
          ...usuarioLogado,
          id: user.id,
          nome: nomeLimpo,
          email: emailLimpo,
          foto: novaFoto || "",
          foto_url: novaFoto || "",
        };

        localStorage.setItem(
          "usuarioLogado",
          JSON.stringify(atualizado)
        );
      } catch {
        // O perfil já foi salvo no Supabase; o cache local é apenas complementar.
      }

      setEditando(false);
      setMensagem(
        `Perfil atualizado com sucesso! 💙${mensagemEmail}`
      );
    } catch (e) {
      console.error("Erro ao salvar perfil:", e);
      setErro(
        e?.message ||
          "Não foi possível salvar as alterações."
      );
    } finally {
      setSalvando(false);
    }
  }

  function sair() {
    const confirmar = window.confirm(
      "Deseja realmente sair da sua conta?"
    );

    if (!confirmar) return;

    if (typeof sairDaConta === "function") {
      sairDaConta();
    } else if (typeof irPara === "function") {
      irPara("inicio");
    }
  }

  const estilos = {
    pagina: {
      minHeight: "100vh",
      background: `
        radial-gradient(circle at 7% 5%, ${
          escuro ? "rgba(58,125,255,.15)" : "rgba(168,199,255,.35)"
        } 0, transparent 24%),
        radial-gradient(circle at 94% 15%, ${
          escuro ? "rgba(58,125,255,.12)" : "rgba(58,125,255,.09)"
        } 0, transparent 23%),
        ${cores.fundo}
      `,
      color: cores.texto,
      fontFamily: "Arial, Helvetica, sans-serif",
      fontSize: textoGrande ? "18px" : "16px",
      paddingBottom: "105px",
      transition: "background .3s ease, color .3s ease",
    },
    container: {
      width: "min(1180px, calc(100% - 34px))",
      margin: "0 auto",
      padding: "28px 0 30px",
    },
    card: {
      background: cores.card,
      border: `1px solid ${cores.borda}`,
      borderRadius: "26px",
      boxShadow: escuro
        ? "0 18px 45px rgba(0,0,0,.18)"
        : "0 18px 45px rgba(15,45,91,.07)",
    },
  };

  return (
    <div
      style={estilos.pagina}
      className={altoContraste ? "pulsan-alto-contraste" : ""}
    >
      <style>{`
        * { box-sizing: border-box; }

        .perfil-pulsan-header {
          position: sticky;
          top: 0;
          z-index: 20;
          background: ${escuro ? "rgba(7,26,49,.94)" : "rgba(255,255,255,.92)"};
          border-bottom: 1px solid ${cores.borda};
          backdrop-filter: blur(16px);
        }

        .perfil-header-inner {
          width: min(1180px, calc(100% - 34px));
          min-height: 78px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
        }

        .perfil-brand {
          display: flex;
          align-items: center;
          gap: 13px;
        }

        .perfil-brand img {
          width: 48px;
          height: 48px;
          object-fit: contain;
        }

        .perfil-brand-name {
          font-size: 21px;
          font-weight: 900;
          letter-spacing: .18em;
          color: ${cores.texto};
        }

        .perfil-brand-sub {
          display: block;
          margin-top: 3px;
          color: ${cores.textoSuave};
          font-size: 12px;
        }

        .perfil-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.25fr) minmax(300px, .75fr);
          gap: 22px;
          align-items: start;
        }

        .perfil-hero {
          position: relative;
          overflow: hidden;
          padding: 34px;
          background: linear-gradient(
            135deg,
            ${escuro ? "#0F2D5B" : "#FFFFFF"} 0%,
            ${escuro ? "#15365F" : "#EAF3FF"} 100%
          );
        }

        .perfil-hero::before {
          content: "";
          position: absolute;
          width: 230px;
          height: 230px;
          right: -90px;
          top: -105px;
          border-radius: 50%;
          background: ${escuro ? "rgba(168,199,255,.09)" : "rgba(168,199,255,.42)"};
        }

        .perfil-hero::after {
          content: "✦";
          position: absolute;
          right: 48px;
          bottom: 30px;
          color: ${escuro ? "rgba(168,199,255,.35)" : "rgba(58,125,255,.20)"};
          font-size: 30px;
          animation: perfilFloat 4s ease-in-out infinite;
        }

        @keyframes perfilFloat {
          50% { transform: translateY(-7px) rotate(5deg); }
        }

        .perfil-hero-content {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 25px;
        }

        .perfil-photo-wrap {
          position: relative;
          flex: 0 0 auto;
        }

        .perfil-photo {
          width: 128px;
          height: 128px;
          border-radius: 38px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #EAF3FF, #A8C7FF);
          color: #0F2D5B;
          font-size: 50px;
          border: 5px solid ${escuro ? "#173B6A" : "#FFFFFF"};
          box-shadow: 0 14px 35px rgba(15,45,91,.14);
        }

        .perfil-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .perfil-photo-edit {
          position: absolute;
          right: -5px;
          bottom: -5px;
          width: 40px;
          height: 40px;
          border: 4px solid ${cores.card};
          border-radius: 50%;
          background: ${cores.azul};
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .perfil-kicker {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 11px;
          border-radius: 999px;
          background: ${cores.azulSuave};
          color: ${cores.azul};
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .12em;
        }

        .perfil-title {
          margin: 10px 0 5px;
          font-size: clamp(27px, 4vw, 38px);
          line-height: 1.05;
          letter-spacing: -.035em;
        }

        .perfil-type {
          color: ${cores.textoSuave};
          font-size: 13px;
        }

        .perfil-message {
          max-width: 510px;
          margin: 13px 0 0;
          color: ${cores.textoSuave};
          line-height: 1.6;
          font-size: 13px;
        }

        .perfil-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 9px;
          margin-top: 18px;
        }

        .perfil-primary,
        .perfil-secondary {
          border-radius: 14px;
          padding: 12px 17px;
          font-weight: 800;
          cursor: pointer;
          font-size: 13px;
          border: 1px solid transparent;
          transition: transform .15s ease, box-shadow .15s ease;
        }

        .perfil-primary {
          background: ${cores.azul};
          color: white;
          box-shadow: 0 9px 20px rgba(58,125,255,.22);
        }

        .perfil-secondary {
          background: ${escuro ? "#173B6A" : "#FFFFFF"};
          color: ${cores.texto};
          border-color: ${cores.borda};
        }

        .perfil-primary:hover,
        .perfil-secondary:hover {
          transform: translateY(-1px);
        }

        .perfil-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 15px;
        }

        .perfil-badge {
          padding: 7px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          background: ${escuro ? "#173B6A" : "#FFFFFF"};
          border: 1px solid ${cores.borda};
          color: ${cores.texto};
        }

        .perfil-side {
          padding: 23px;
        }

        .perfil-side-kicker {
          color: ${cores.azul};
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .12em;
        }

        .perfil-side h2 {
          margin: 6px 0 4px;
          font-size: 20px;
        }

        .perfil-side p {
          margin: 0;
          color: ${cores.textoSuave};
          line-height: 1.55;
          font-size: 12px;
        }

        .perfil-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-top: 17px;
        }

        .perfil-stat {
          padding: 15px 10px;
          border-radius: 17px;
          background: ${escuro ? "#15365F" : "#F7FAFF"};
          border: 1px solid ${cores.borda};
          text-align: center;
        }

        .perfil-stat-icon {
          font-size: 22px;
        }

        .perfil-stat strong {
          display: block;
          margin-top: 5px;
          font-size: 22px;
        }

        .perfil-stat span {
          display: block;
          margin-top: 4px;
          color: ${cores.textoSuave};
          font-size: 10px;
          line-height: 1.3;
        }

        .perfil-section {
          margin-top: 22px;
          padding: 24px;
        }

        .perfil-section-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 17px;
        }

        .perfil-section-title h2 {
          margin: 0;
          font-size: 19px;
        }

        .perfil-section-title span {
          color: ${cores.textoSuave};
          font-size: 11px;
        }

        .perfil-feature-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .perfil-feature {
          padding: 17px;
          border-radius: 18px;
          background: ${escuro ? "#15365F" : "#F7FAFF"};
          border: 1px solid ${cores.borda};
        }

        .perfil-feature-icon {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 14px;
          background: ${cores.azulSuave};
          font-size: 21px;
          margin-bottom: 10px;
        }

        .perfil-feature strong {
          display: block;
          font-size: 13px;
          margin-bottom: 4px;
        }

        .perfil-feature p {
          margin: 0;
          color: ${cores.textoSuave};
          font-size: 11px;
          line-height: 1.45;
        }

        .perfil-data-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        .perfil-data {
          padding: 16px;
          border-radius: 17px;
          background: ${escuro ? "#15365F" : "#F8FBFF"};
          border: 1px solid ${cores.borda};
        }

        .perfil-data-label {
          color: ${cores.textoSuave};
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .04em;
          text-transform: uppercase;
        }

        .perfil-data-value {
          display: block;
          margin-top: 5px;
          font-size: 13px;
          overflow-wrap: anywhere;
        }

        .perfil-edit {
          margin-top: 18px;
          padding: 21px;
          border-radius: 20px;
          background: ${escuro ? "#0B2444" : "#F7FAFF"};
          border: 1px solid ${cores.borda};
        }

        .perfil-edit-grid {
          display: grid;
          grid-template-columns: 170px 1fr;
          gap: 20px;
          align-items: center;
        }

        .perfil-edit-photo {
          width: 132px;
          height: 132px;
          margin: 0 auto;
          border-radius: 35px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #EAF3FF, #A8C7FF);
          font-size: 45px;
        }

        .perfil-edit-photo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .perfil-upload {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          margin-top: 9px;
          padding: 10px;
          border-radius: 12px;
          background: ${cores.azul};
          color: white;
          cursor: pointer;
          font-size: 11px;
          font-weight: 800;
        }

        .perfil-upload input {
          display: none;
        }

        .perfil-fields {
          display: grid;
          gap: 12px;
        }

        .perfil-field label {
          display: block;
          margin-bottom: 5px;
          color: ${cores.textoSuave};
          font-size: 11px;
          font-weight: 800;
        }

        .perfil-field input {
          width: 100%;
          min-height: 44px;
          padding: 11px 13px;
          border-radius: 12px;
          border: 1px solid ${cores.borda};
          outline: none;
          background: ${cores.card};
          color: ${cores.texto};
          font: inherit;
          font-size: 13px;
        }

        .perfil-field input:focus {
          border-color: ${cores.azul};
          box-shadow: 0 0 0 3px rgba(58,125,255,.10);
        }

        .perfil-edit-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 9px;
          margin-top: 15px;
        }

        .perfil-notice {
          margin-top: 13px;
          padding: 11px 13px;
          border-radius: 12px;
          background: ${escuro ? "#173B6A" : "#EAF3FF"};
          color: ${cores.textoSuave};
          font-size: 11px;
          line-height: 1.45;
        }

        .perfil-success,
        .perfil-error {
          margin-top: 13px;
          padding: 11px 13px;
          border-radius: 12px;
          font-size: 12px;
          line-height: 1.4;
        }

        .perfil-success {
          background: ${escuro ? "#173B6A" : "#EAF3FF"};
          color: ${escuro ? "#CDE0FA" : "#245AA8"};
        }

        .perfil-error {
          background: ${escuro ? "#3B2028" : "#FFF1F3"};
          color: ${escuro ? "#F3B8C3" : "#A83F50"};
        }

        .perfil-security {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
        }

        .perfil-security-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 15px;
          border-radius: 17px;
          background: ${escuro ? "#15365F" : "#F8FBFF"};
          border: 1px solid ${cores.borda};
        }

        .perfil-security-icon {
          width: 42px;
          height: 42px;
          flex: 0 0 42px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${cores.azulSuave};
          font-size: 20px;
        }

        .perfil-security strong {
          display: block;
          font-size: 12px;
        }

        .perfil-security span {
          display: block;
          margin-top: 3px;
          color: ${cores.textoSuave};
          font-size: 10px;
          line-height: 1.35;
        }

        .perfil-theme {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
        }

        .perfil-theme-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .perfil-theme-icon {
          width: 45px;
          height: 45px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${cores.azulSuave};
          font-size: 22px;
        }

        .perfil-theme-info strong {
          display: block;
          font-size: 14px;
        }

        .perfil-theme-info span {
          display: block;
          margin-top: 3px;
          color: ${cores.textoSuave};
          font-size: 11px;
        }

        .perfil-theme-button {
          border: 1px solid ${cores.borda};
          border-radius: 13px;
          padding: 11px 15px;
          background: ${escuro ? "#173B6A" : "#EAF3FF"};
          color: ${escuro ? "#fff" : "#245AA8"};
          font-weight: 800;
          cursor: pointer;
        }

        .perfil-points {
          background: linear-gradient(135deg, #3A7DFF 0%, #0F2D5B 100%);
          color: white;
          overflow: hidden;
          position: relative;
        }

        .perfil-points::after {
          content: "🦋";
          position: absolute;
          right: 26px;
          top: 19px;
          font-size: 46px;
          opacity: .18;
          transform: rotate(-8deg);
        }

        .perfil-points h2 {
          margin: 0 0 6px;
          font-size: 20px;
        }

        .perfil-points p {
          max-width: 650px;
          margin: 0;
          opacity: .88;
          line-height: 1.5;
          font-size: 12px;
        }

        .perfil-points-button {
          margin-top: 16px;
          border: none;
          border-radius: 13px;
          padding: 11px 16px;
          background: white;
          color: #245AA8;
          font-weight: 900;
          cursor: pointer;
        }

        .perfil-logout {
          width: 100%;
          margin-top: 22px;
          padding: 14px;
          border-radius: 15px;
          border: 1px solid ${escuro ? "#613743" : "#E8CDD4"};
          background: ${escuro ? "#2A1B25" : "#FFF8FA"};
          color: #B64A4A;
          font-weight: 800;
          cursor: pointer;
        }

        .perfil-nav {
          position: fixed;
          z-index: 9999;
          left: 0;
          right: 0;
          bottom: 0;
          height: 76px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: clamp(30px, 12vw, 90px);
          background: ${escuro ? "#0B2444" : "rgba(255,255,255,.96)"};
          border-top: 1px solid ${cores.borda};
          box-shadow: ${escuro
            ? "0 -8px 25px rgba(0,0,0,.18)"
            : "0 -8px 25px rgba(15,45,91,.05)"};
          backdrop-filter: blur(12px);
        }

        .perfil-nav button {
          min-width: 70px;
          border: 0;
          background: transparent;
          cursor: pointer;
          color: ${escuro ? "#B8CBE3" : "#777"};
          font-size: 12px;
          text-align: center;
        }

        .perfil-nav button div {
          font-size: 23px;
          margin-bottom: 2px;
        }

        .perfil-nav .ativo {
          color: ${cores.azul};
          font-weight: 900;
        }

        .pulsan-alto-contraste {
          filter: contrast(1.08);
        }

        @media (max-width: 900px) {
          .perfil-grid {
            grid-template-columns: 1fr;
          }

          .perfil-feature-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .perfil-security {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 680px) {
          .perfil-header-inner {
            width: calc(100% - 22px);
            min-height: 68px;
          }

          .perfil-brand img {
            width: 42px;
            height: 42px;
          }

          .perfil-brand-name {
            font-size: 18px;
          }

          .perfil-brand-sub {
            font-size: 10px;
          }

          .perfil-brand-name {
            letter-spacing: .12em;
          }

          .perfil-grid {
            gap: 15px;
          }

          .perfil-hero {
            padding: 22px;
            border-radius: 22px;
          }

          .perfil-hero-content {
            flex-direction: column;
            text-align: center;
          }

          .perfil-photo {
            width: 108px;
            height: 108px;
            border-radius: 31px;
          }

          .perfil-title {
            font-size: 28px;
          }

          .perfil-actions {
            justify-content: center;
          }

          .perfil-badges {
            justify-content: center;
          }

          .perfil-section,
          .perfil-side {
            padding: 18px;
            border-radius: 20px;
          }

          .perfil-feature-grid {
            grid-template-columns: 1fr;
          }

          .perfil-data-grid {
            grid-template-columns: 1fr;
          }

          .perfil-edit-grid {
            grid-template-columns: 1fr;
          }

          .perfil-edit-photo {
            width: 112px;
            height: 112px;
          }

          .perfil-edit-buttons {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }

          .perfil-theme {
            align-items: flex-start;
            flex-direction: column;
          }

          .perfil-theme-button {
            width: 100%;
          }

          .perfil-nav {
            height: 70px;
            gap: 12px;
          }

          .perfil-nav button {
            min-width: 82px;
          }
        }

        @media (max-width: 390px) {
          .perfil-container {
            width: calc(100% - 18px) !important;
          }

          .perfil-stats {
            gap: 7px;
          }

          .perfil-stat {
            padding: 12px 7px;
          }

          .perfil-nav button {
            min-width: 72px;
            font-size: 11px;
          }
        }
      `}</style>

      <header className="perfil-pulsan-header">
        <div className="perfil-header-inner">
          <div className="perfil-brand">
            <img src="/logo.png" alt="Logo Pulsan" />
            <div>
              <div className="perfil-brand-name">PULSAN</div>
              <span className="perfil-brand-sub">
                Seu espaço de acolhimento
              </span>
            </div>
          </div>
        </div>
      </header>

      <main
        className="perfil-container"
        style={estilos.container}
      >
        <div className="perfil-grid">
          <section
            className="perfil-hero"
            style={estilos.card}
          >
            <div className="perfil-hero-content">
              <div className="perfil-photo-wrap">
                <div className="perfil-photo">
                  {foto ? (
                    <img src={foto} alt="Foto do perfil" />
                  ) : (
                    "👤"
                  )}
                </div>

                {!editando && (
                  <button
                    type="button"
                    className="perfil-photo-edit"
                    onClick={iniciarEdicao}
                    aria-label="Editar foto do perfil"
                  >
                    ✏️
                  </button>
                )}
              </div>

              <div style={{ minWidth: 0 }}>
                <span className="perfil-kicker">
                  ✦ MEU ESPAÇO PULSAN
                </span>

                {!editando ? (
                  <>
                    <h1 className="perfil-title">{nome}</h1>
                    <div className="perfil-type">
                      {tipoUsuario}
                    </div>

                    <p className="perfil-message">
                      Aqui você pode ser você. O Pulsan existe para
                      aproximar pessoas por meio da escuta, do acolhimento
                      e do respeito.
                    </p>

                    <div className="perfil-badges">
                      {possuiSeloPsicologo && (
                        <span className="perfil-badge">
                          🧠 Psicólogo parceiro
                        </span>
                      )}

                      {possuiSeloApoiador && (
                        <span className="perfil-badge">
                          🏅 Apoiador de confiança
                        </span>
                      )}
                    </div>

                    <div className="perfil-actions">
                      <button
                        type="button"
                        className="perfil-primary"
                        onClick={iniciarEdicao}
                      >
                        ✏️ Editar meu perfil
                      </button>

                      <button
                        type="button"
                        className="perfil-secondary"
                        onClick={() => irPara("conversa")}
                      >
                        💬 Minhas conversas
                      </button>
                    </div>
                  </>
                ) : (
                  <div style={{ width: "100%" }}>
                    <h1 className="perfil-title">
                      Editar meu perfil
                    </h1>
                    <p className="perfil-message">
                      Atualize os dados que aparecem no seu espaço Pulsan.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          <aside
            className="perfil-side"
            style={estilos.card}
          >
            <span className="perfil-side-kicker">
              SUA JORNADA
            </span>

            <h2>O que você constrói aqui</h2>

            <p>
              Cada conversa respeitosa pode ser um pequeno ponto de luz
              para alguém.
            </p>

            <div className="perfil-stats">
              <div className="perfil-stat">
                <div className="perfil-stat-icon">💬</div>
                <strong>{quantidadeAvaliacoes}</strong>
                <span>Avaliações recebidas</span>
              </div>

              <div className="perfil-stat">
                <div className="perfil-stat-icon">💙</div>
                <strong>{quantidadeAjudas}</strong>
                <span>Pessoas ajudadas</span>
              </div>

              <div className="perfil-stat">
                <div className="perfil-stat-icon">⭐</div>
                <strong>{media}</strong>
                <span>Média das avaliações</span>
              </div>

              <div className="perfil-stat">
                <div className="perfil-stat-icon">🏆</div>
                <strong>{pontos}</strong>
                <span>Pontos acumulados</span>
              </div>
            </div>
          </aside>
        </div>

        {editando && (
          <section
            className="perfil-section perfil-edit"
            style={estilos.card}
          >
            <div className="perfil-section-title">
              <div>
                <h2>✏️ Seus dados</h2>
                <span>Você pode atualizar sua imagem, nome e e-mail.</span>
              </div>
            </div>

            <div className="perfil-edit-grid">
              <div>
                <div className="perfil-edit-photo">
                  {novaFoto ? (
                    <img
                      src={novaFoto}
                      alt="Pré-visualização"
                    />
                  ) : (
                    "👤"
                  )}
                </div>

                <label className="perfil-upload">
                  🖼️ Trocar imagem
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={selecionarFoto}
                  />
                </label>

                {novaFoto && (
                  <button
                    type="button"
                    onClick={() => setNovaFoto("")}
                    style={{
                      width: "100%",
                      marginTop: 7,
                      border: 0,
                      background: "transparent",
                      color: cores.textoSuave,
                      cursor: "pointer",
                      fontSize: 10,
                    }}
                  >
                    Remover imagem
                  </button>
                )}
              </div>

              <div>
                <div className="perfil-fields">
                  <div className="perfil-field">
                    <label htmlFor="pulsan-nome">
                      NOME
                    </label>
                    <input
                      id="pulsan-nome"
                      value={novoNome}
                      onChange={(e) => setNovoNome(e.target.value)}
                      placeholder="Seu nome"
                      maxLength={100}
                    />
                  </div>

                  <div className="perfil-field">
                    <label htmlFor="pulsan-email">
                      E-MAIL
                    </label>
                    <input
                      id="pulsan-email"
                      type="email"
                      value={novoEmail}
                      onChange={(e) => setNovoEmail(e.target.value)}
                      placeholder="seu@email.com"
                      maxLength={150}
                    />
                  </div>
                </div>

                <div className="perfil-notice">
                  🔐 A alteração do e-mail usa a autenticação do
                  Supabase. Dependendo da configuração da conta,
                  pode ser necessário confirmar o novo endereço.
                </div>

                <div className="perfil-edit-buttons">
                  <button
                    type="button"
                    className="perfil-secondary"
                    onClick={cancelarEdicao}
                    disabled={salvando}
                  >
                    Cancelar
                  </button>

                  <button
                    type="button"
                    className="perfil-primary"
                    onClick={salvarPerfil}
                    disabled={salvando}
                  >
                    {salvando ? "Salvando..." : "💾 Salvar alterações"}
                  </button>
                </div>
              </div>
            </div>

            {erro && (
              <div className="perfil-error">
                {erro}
              </div>
            )}
          </section>
        )}

        {mensagem && !editando && (
          <div className="perfil-success">
            {mensagem}
          </div>
        )}

        <section
          className="perfil-section"
          style={estilos.card}
        >
          <div className="perfil-section-title">
            <div>
              <h2>💙 A essência do Pulsan</h2>
              <span>Mais do que um perfil</span>
            </div>
          </div>

          <div className="perfil-feature-grid">
            <div className="perfil-feature">
              <div className="perfil-feature-icon">🦋</div>
              <strong>Transformação</strong>
              <p>
                Assim como a borboleta, cada pessoa pode encontrar
                espaço para recomeçar.
              </p>
            </div>

            <div className="perfil-feature">
              <div className="perfil-feature-icon">🪲</div>
              <strong>Um ponto de luz</strong>
              <p>
                O acolhimento pode iluminar momentos difíceis e
                lembrar que ninguém precisa enfrentar tudo sozinho.
              </p>
            </div>

            <div className="perfil-feature">
              <div className="perfil-feature-icon">🦎</div>
              <strong>Sem medo de julgamento</strong>
              <p>
                Você não precisa esconder o que sente para fazer
                parte do Pulsan.
              </p>
            </div>
          </div>
        </section>

        <section
          className="perfil-section"
          style={estilos.card}
        >
          <div className="perfil-section-title">
            <div>
              <h2>👤 Seus dados</h2>
              <span>Informações da sua conta</span>
            </div>

            {!editando && (
              <button
                type="button"
                className="perfil-secondary"
                onClick={iniciarEdicao}
                style={{ padding: "9px 12px" }}
              >
                ✏️ Editar
              </button>
            )}
          </div>

          <div className="perfil-data-grid">
            <div className="perfil-data">
              <span className="perfil-data-label">Nome</span>
              <span className="perfil-data-value">{nome}</span>
            </div>

            <div className="perfil-data">
              <span className="perfil-data-label">E-mail</span>
              <span className="perfil-data-value">
                {email || "Não informado"}
              </span>
            </div>

            <div className="perfil-data">
              <span className="perfil-data-label">Tipo de perfil</span>
              <span className="perfil-data-value">
                {tipoUsuario}
              </span>
            </div>

            <div className="perfil-data">
              <span className="perfil-data-label">Reputação</span>
              <span className="perfil-data-value">
                {media === "—"
                  ? "Ainda sem avaliações"
                  : `${media}/5 ${mostrarEstrelas()}`}
              </span>
            </div>
          </div>
        </section>

        <section
          className="perfil-section"
          style={estilos.card}
        >
          <div className="perfil-section-title">
            <div>
              <h2>🔒 Segurança e privacidade</h2>
              <span>Seu espaço deve continuar sendo seguro.</span>
            </div>
          </div>

          <div className="perfil-security">
            <div className="perfil-security-item">
              <div className="perfil-security-icon">🔐</div>
              <div>
                <strong>Privacidade</strong>
                <span>
                  Seus dados são tratados de forma protegida.
                </span>
              </div>
            </div>

            <div className="perfil-security-item">
              <div className="perfil-security-icon">🛡️</div>
              <div>
                <strong>Proteção</strong>
                <span>
                  Você pode conversar sem precisar expor sua identidade.
                </span>
              </div>
            </div>

            <button
              type="button"
              className="perfil-security-item"
              onClick={() => irPara("acessibilidade")}
              style={{
                width: "100%",
                textAlign: "left",
                color: cores.texto,
                cursor: "pointer",
              }}
            >
              <div className="perfil-security-icon">♿</div>
              <div>
                <strong>Acessibilidade</strong>
                <span>
                  Personalize o Pulsan para ficar mais confortável para você.
                </span>
              </div>
            </button>
          </div>
        </section>

        <section
          className="perfil-section"
          style={estilos.card}
        >
          <div className="perfil-theme">
            <div className="perfil-theme-info">
              <div className="perfil-theme-icon">
                {escuro ? "🌙" : "☀️"}
              </div>
              <div>
                <strong>Aparência do Pulsan</strong>
                <span>
                  {escuro
                    ? "Você está usando o modo escuro."
                    : "Você está usando o modo claro."}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="perfil-theme-button"
              onClick={alternarTema}
            >
              {escuro ? "☀️ Usar modo claro" : "🌙 Usar modo escuro"}
            </button>
          </div>
        </section>

        <section
          className="perfil-section perfil-points"
          style={estilos.card}
        >
          <h2>🏆 Seu impacto também importa</h2>
          <p>
            Quando você acolhe alguém com respeito, ajuda a construir
            uma comunidade onde pedir ajuda e oferecer apoio fazem
            parte da mesma rede.
          </p>

          <button
            type="button"
            className="perfil-points-button"
            onClick={() => irPara("premios")}
          >
            🎁 Ver benefícios e prêmios
          </button>
        </section>

        <button
          type="button"
          className="perfil-logout"
          onClick={sair}
        >
          🚪 Sair da conta
        </button>
      </main>

      <nav className="perfil-nav">
        <button
          type="button"
          onClick={() => irPara("solicitacoes")}
        >
          <div>💬</div>
          Conversas
        </button>

        <button
          type="button"
          onClick={() => irPara("ajudar")}
        >
          <div>💚</div>
          Ajudar
        </button>

        <button
          type="button"
          className="ativo"
        >
          <div>👤</div>
          Perfil
        </button>
      </nav>
    </div>
  );
}

export default Perfil;
