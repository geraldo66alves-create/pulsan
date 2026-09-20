import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function Empresa({ irPara }) {
  const [texto, setTexto] = useState("");
  const [publicacoes, setPublicacoes] = useState([]);
  const [apoios, setApoios] = useState({});
  const [comentariosAbertos, setComentariosAbertos] = useState({});
  const [novoComentario, setNovoComentario] = useState({});
  const [solicitacoes, setSolicitacoes] = useState({});
  const [carregando, setCarregando] = useState(true);
  const [publicando, setPublicando] = useState(false);

  const limite = 1000;
  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3001";

  const [usuarioAtual, setUsuarioAtual] = useState(null);

  useEffect(() => {
    let canalPosts = null;
    let montado = true;

    async function carregarDados() {
      setCarregando(true);

      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError || !authData?.user) {
        if (montado) {
          setUsuarioAtual(null);
          setPublicacoes([]);
          setCarregando(false);
        }
        return;
      }

      const usuario = authData.user;
      if (montado) setUsuarioAtual(usuario);

      const { data: posts, error: postsError } = await supabase
        .from("posts_ambiente")
        .select(
          "id, usuario_id, texto, criado_em, apoiadores, nome_usuario, ambiente, classificacao, alerta, ativo"
        )
        .eq("ambiente", "empresa")
        .or("ativo.is.null,ativo.eq.true")
        .order("criado_em", { ascending: false });

      if (postsError) {
        console.error("Erro ao carregar publicações da empresa:", postsError);
        if (montado) {
          setPublicacoes([]);
          setCarregando(false);
        }
        return;
      }

      const ids = (posts || []).map((post) => post.id);

      let comentariosPorPost = {};
      if (ids.length > 0) {
        const { data: comentarios, error: comentariosError } =
          await supabase
            .from("comentarios_ambiente")
            .select("id, post_id, usuario_id, texto, criado_em, ativo")
            .in("post_id", ids)
            .or("ativo.is.null,ativo.eq.true")
            .order("criado_em", { ascending: true });

        if (comentariosError) {
          console.error(
            "Erro ao carregar comentários da empresa:",
            comentariosError
          );
        } else {
          (comentarios || []).forEach((comentario) => {
            if (!comentariosPorPost[comentario.post_id]) {
              comentariosPorPost[comentario.post_id] = [];
            }

            comentariosPorPost[comentario.post_id].push({
              id: comentario.id,
              texto: comentario.texto,
              usuarioId: comentario.usuario_id,
              data: comentario.criado_em
                ? new Date(comentario.criado_em).toLocaleDateString("pt-BR")
                : "Agora",
              hora: comentario.criado_em
                ? new Date(comentario.criado_em).toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "",
            });
          });
        }
      }

      const mapaApoios = {};
      const publicacoesFormatadas = (posts || []).map((post) => {
        const apoiadores = Array.isArray(post.apoiadores)
          ? post.apoiadores
          : [];

        mapaApoios[post.id] = apoiadores.includes(usuario.id);

        return {
          ...post,
          autor: "Anônimo",
          anonimato: true,
          tipoAmbiente: "empresa",
          apoios: apoiadores.length,
          apoiado: apoiadores.includes(usuario.id),
          comentarios: comentariosPorPost[post.id] || [],
          data: post.criado_em
            ? new Date(post.criado_em).toLocaleDateString("pt-BR")
            : "Agora",
          hora: post.criado_em
            ? new Date(post.criado_em).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "",
        };
      });

      if (montado) {
        setApoios(mapaApoios);
        setPublicacoes(publicacoesFormatadas);
        setCarregando(false);
      }

      canalPosts = supabase
        .channel("empresa-posts-e-comentarios")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "posts_ambiente",
          },
          () => {
            carregarDados();
          }
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "comentarios_ambiente",
          },
          () => {
            carregarDados();
          }
        )
        .subscribe();
    }

    carregarDados();

    return () => {
      montado = false;
      if (canalPosts) {
        supabase.removeChannel(canalPosts);
      }
    };
  }, []);

  const nomeUsuario =
    localStorage.getItem("pulsanNome") || "Usuário";

  const fotoUsuario =
    localStorage.getItem("pulsanFoto") || "";

  const tipoUsuario =
    localStorage.getItem("pulsanTipo") || "";

  const seloUsuario =
    localStorage.getItem("pulsanSelo") || "";

  async function publicar(e) {
    e.preventDefault();

    const textoLimpo = texto.trim();

    if (!textoLimpo) {
      alert("Escreva algo antes de publicar.");
      return;
    }

    if (publicando) return;

    if (!usuarioAtual) {
      alert("Faça login para publicar.");
      return;
    }

    setPublicando(true);

    try {
      const respostaIA = await fetch(
        `${API_URL}/api/analisar-desabafo`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            texto: textoLimpo,
            ambiente: "empresa",
          }),
        }
      );

      if (!respostaIA.ok) {
        throw new Error("Falha na análise de segurança.");
      }

      const analiseIA = await respostaIA.json();

      if (analiseIA?.publicarPermitido === false) {
        alert(
          analiseIA.motivoModeracao ||
            "Seu texto contém linguagem ofensiva ou inadequada. Revise a mensagem e tente novamente."
        );
        return;
      }

      const classificacaoPermitida = [
        "normal",
        "intermediario",
        "grave",
        "urgente",
      ];

      const classificacao = classificacaoPermitida.includes(
        analiseIA?.classificacao
      )
        ? analiseIA.classificacao
        : "normal";

      const { error } = await supabase
        .from("posts_ambiente")
        .insert({
          usuario_id: usuarioAtual.id,
          texto: textoLimpo,
          ambiente: "empresa",
          classificacao,
          alerta: Boolean(analiseIA?.alerta),
          nome_usuario: "Anônimo",
          prioridade: classificacao,
          categoria: "empresa",
          sentimento: null,
          urgencia: classificacao,
          ativo: true,
        });

      if (error) {
        console.error("Erro ao publicar no Supabase:", error);
        alert("Não foi possível publicar agora. Tente novamente.");
        return;
      }

      setTexto("");
      alert("Sua publicação foi enviada anonimamente. 💚");
      irPara("ambiente");
    } catch (erro) {
      console.error("Erro ao publicar desabafo:", erro);
      alert(
        "Não foi possível verificar seu desabafo no momento. Tente novamente."
      );
    } finally {
      setPublicando(false);
    }
  }

  async function apoiar(publicacao) {
    if (!usuarioAtual) {
      alert("Faça login para apoiar uma publicação.");
      return;
    }

    const atuais = Array.isArray(publicacao.apoiadores)
      ? publicacao.apoiadores
      : [];

    const jaApoiou = atuais.includes(usuarioAtual.id);

    const novosApoiadores = jaApoiou
      ? atuais.filter((id) => id !== usuarioAtual.id)
      : [...atuais, usuarioAtual.id];

    const { error } = await supabase
      .from("posts_ambiente")
      .update({
        apoiadores: novosApoiadores,
      })
      .eq("id", publicacao.id);

    if (error) {
      console.error("Erro ao registrar apoio:", error);
      alert("Não foi possível registrar o apoio agora.");
      return;
    }

    setApoios((anteriores) => ({
      ...anteriores,
      [publicacao.id]: !jaApoiou,
    }));

    setPublicacoes((anteriores) =>
      anteriores.map((item) =>
        item.id === publicacao.id
          ? {
              ...item,
              apoiadores: novosApoiadores,
              apoios: novosApoiadores.length,
              apoiado: !jaApoiou,
            }
          : item
      )
    );
  }

  function abrirComentarios(id) {
    setComentariosAbertos((anteriores) => ({
      ...anteriores,
      [id]: !anteriores[id],
    }));
  }

  function alterarComentario(id, valor) {
    setNovoComentario((anteriores) => ({
      ...anteriores,
      [id]: valor,
    }));
  }

  async function adicionarComentario(e, publicacao) {
    e.preventDefault();

    const textoComentario = (
      novoComentario[publicacao.id] || ""
    ).trim();

    if (!textoComentario) return;

    if (!usuarioAtual) {
      alert("Faça login para comentar.");
      return;
    }

    try {
      const respostaIA = await fetch(
        `${API_URL}/api/analisar-mensagem`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            texto: textoComentario,
            ambiente: "empresa",
          }),
        }
      );

      if (!respostaIA.ok) {
        throw new Error("Falha na moderação do comentário.");
      }

      const moderacao = await respostaIA.json();

      if (moderacao?.publicarPermitido === false) {
        alert(
          moderacao.motivoModeracao ||
            "Esse comentário não pode ser publicado."
        );
        return;
      }

      const { data, error } = await supabase
        .from("comentarios_ambiente")
        .insert({
          post_id: publicacao.id,
          usuario_id: usuarioAtual.id,
          texto: textoComentario,
          ativo: true,
        })
        .select()
        .single();

      if (error) {
        console.error("Erro ao salvar comentário:", error);
        alert("Não foi possível publicar o comentário.");
        return;
      }

      const novo = {
        id: data.id,
        texto: data.texto,
        usuarioId: usuarioAtual.id,
        data: new Date(data.criado_em || Date.now()).toLocaleDateString(
          "pt-BR"
        ),
        hora: new Date(data.criado_em || Date.now()).toLocaleTimeString(
          "pt-BR",
          {
            hour: "2-digit",
            minute: "2-digit",
          }
        ),
      };

      setPublicacoes((anteriores) =>
        anteriores.map((item) =>
          item.id === publicacao.id
            ? {
                ...item,
                comentarios: [...(item.comentarios || []), novo],
              }
            : item
        )
      );

      setNovoComentario((anteriores) => ({
        ...anteriores,
        [publicacao.id]: "",
      }));
    } catch (erro) {
      console.error("Erro ao adicionar comentário:", erro);
      alert(
        "Não foi possível verificar o comentário no momento. Tente novamente."
      );
    }
  }

  async function solicitarChat(publicacao) {
    if (!usuarioAtual) {
      alert("Faça login para oferecer ajuda.");
      return;
    }

    if (!publicacao.usuario_id) {
      alert("Não foi possível identificar a pessoa que publicou este desabafo.");
      return;
    }

    if (publicacao.usuario_id === usuarioAtual.id) {
      alert("Você não pode solicitar uma conversa com você mesmo.");
      return;
    }

    const confirmar = window.confirm(
      "Você está oferecendo ajuda para esta pessoa.\n\n" +
        "A pessoa verá seu nome, sua foto e seus selos, caso tenha.\n\n" +
        "A pessoa que publicou o desabafo continuará anônima para você.\n\n" +
        "Deseja enviar a solicitação?"
    );

    if (!confirmar) return;

    const { data: existente } = await supabase
      .from("solicitacoes_chat")
      .select("id,status")
      .eq("solicitante_id", usuarioAtual.id)
      .eq("destinatario_id", publicacao.usuario_id)
      .eq("status", "pendente")
      .maybeSingle();

    if (existente) {
      alert("Você já enviou uma solicitação para essa pessoa.");
      return;
    }

    /*
     * O schema atual de solicitacoes_chat possui desabafo_id como UUID,
     * enquanto posts_ambiente.id está definido como bigint.
     * Por isso, não enviamos esse campo aqui para evitar erro de tipo.
     * O texto do desabafo é preservado em motivo para a solicitação.
     */
    const { data, error } = await supabase
      .from("solicitacoes_chat")
      .insert({
        solicitante_id: usuarioAtual.id,
        destinatario_id: publicacao.usuario_id,
        status: "pendente",
        categoria: "empresa",
        urgencia: "normal",
        motivo: `Desabafo #${publicacao.id}: ${publicacao.texto}`,
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao criar solicitação:", error);
      alert(
        "Não foi possível enviar a solicitação de ajuda agora."
      );
      return;
    }

    setSolicitacoes((anteriores) => ({
      ...anteriores,
      [publicacao.id]: data,
    }));

    alert(
      "Solicitação enviada! 💚\n\n" +
        "A pessoa poderá decidir se aceita a conversa."
    );

    irPara("solicitacoes");
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <main
      style={{
        minHeight:
          "100vh",

        background:
          "linear-gradient(180deg, #fffdf9 0%, #f1f8f5 100%)",

        color:
          "#173b38",

        fontFamily:
          "Arial, Helvetica, sans-serif",

        paddingBottom:
          "100px",

        boxSizing:
          "border-box",
      }}
    >


      {/* =================================================
          CABEÇALHO
      ================================================= */}

      <header
        style={{
          position:
            "sticky",

          top:
            0,

          zIndex:
            100,

          background:
            "rgba(255,255,255,0.96)",

          backdropFilter:
            "blur(10px)",

          borderBottom:
            "1px solid #e5e5e5",

          padding:
            "12px 18px",

          display:
            "flex",

          alignItems:
            "center",

          justifyContent:
            "space-between",
        }}
      >

        <div
          style={{
            display:
              "flex",

            alignItems:
              "center",

            gap:
              "9px",
          }}
        >

          <img
            src="/logo.png"
            alt="Logo Pulsan"
            style={{
              width:
                "42px",

              height:
                "42px",

              objectFit:
                "contain",
            }}
          />


          <div>

            <strong
              style={{
                display:
                  "block",

                fontSize:
                  "18px",

                letterSpacing:
                  "4px",
              }}
            >
              PULSAN
            </strong>


            <span
              style={{
                display:
                  "block",

                color:
                  "#999",

                fontSize:
                  "10px",
              }}
            >
              Ambiente Empresa
            </span>

          </div>

        </div>


        {/* PERFIL */}

        <button
          type="button"
          onClick={() =>
            irPara(
              "perfil"
            )
          }
          style={{
            width:
              "42px",

            height:
              "42px",

            border:
              "none",

            borderRadius:
              "50%",

            background:
              "#eef5f2",

            cursor:
              "pointer",

            fontSize:
              "19px",

            overflow:
              "hidden",

            padding:
              0,
          }}
        >

          {fotoUsuario ? (

            <img
              src={
                fotoUsuario
              }
              alt="Perfil"
              style={{
                width:
                  "100%",

                height:
                  "100%",

                objectFit:
                  "cover",
              }}
            />

          ) : (

            "👤"

          )}

        </button>

      </header>


      {/* =================================================
          INTRODUÇÃO
      ================================================= */}

      <section
        style={{
          maxWidth:
            "700px",

          margin:
            "0 auto",

          padding:
            "30px 18px 20px",

          textAlign:
            "center",
        }}
      >

        <span
          style={{
            display:
              "inline-block",

            color:
              "#20adb0",

            fontSize:
              "10px",

            fontWeight:
              "800",

            letterSpacing:
              "2px",

            marginBottom:
              "8px",
          }}
        >
          ESPAÇO CORPORATIVO
        </span>


        <h1
          style={{
            margin:
              0,

            fontSize:
              "31px",

            fontWeight:
              "800",

            color:
              "#173b38",
          }}
        >
          Ambiente Empresa
        </h1>


        <p
          style={{
            maxWidth:
              "560px",

            margin:
              "10px auto 0",

            color:
              "#777",

            fontSize:
              "14px",

            lineHeight:
              "1.6",
          }}
        >
          Um espaço seguro para
          colaboradores falarem,
          serem ouvidos e encontrarem
          apoio.
        </p>

      </section>


      {/* =================================================
          SEGURANÇA
      ================================================= */}

      <section
        style={{
          maxWidth:
            "700px",

          margin:
            "0 auto 20px",

          padding:
            "0 18px",

          boxSizing:
            "border-box",
        }}
      >

        <div
          style={{
            display:
              "flex",

            alignItems:
              "center",

            gap:
              "12px",

            padding:
              "15px",

            background:
              "#eef8f5",

            border:
              "1px solid #d9eee8",

            borderRadius:
              "17px",
          }}
        >

          <div
            style={{
              width:
                "42px",

              height:
                "42px",

              flexShrink:
                0,

              borderRadius:
                "50%",

              background:
                "#ffffff",

              display:
                "flex",

              alignItems:
                "center",

              justifyContent:
                "center",

              fontSize:
                "19px",
            }}
          >
            🔒
          </div>


          <div>

            <strong
              style={{
                display:
                  "block",

                fontSize:
                  "13px",
              }}
            >
              Privacidade e acolhimento
            </strong>


            <p
              style={{
                margin:
                  "4px 0 0",

                color:
                  "#7d8985",

                fontSize:
                  "11px",

                lineHeight:
                  "1.5",
              }}
            >
              As publicações podem ser
              feitas anonimamente.
              Sua identidade permanece
              protegida.
            </p>

          </div>

        </div>

      </section>


      {/* =================================================
          AÇÕES
      ================================================= */}

      <section
        style={{
          maxWidth:
            "700px",

          margin:
            "0 auto",

          padding:
            "0 18px",

          display:
            "grid",

          gridTemplateColumns:
            "repeat(2, 1fr)",

          gap:
            "12px",

          boxSizing:
            "border-box",
        }}
      >

        {/* DESABAFAR */}

        <button
          type="button"
          onClick={() => {
            document
              .getElementById(
                "empresa-publicar"
              )
              ?.scrollIntoView({
                behavior:
                  "smooth",
              });
          }}
          style={{
            border:
              "1px solid #d9eae5",

            background:
              "#ffffff",

            borderRadius:
              "18px",

            padding:
              "18px",

            textAlign:
              "left",

            cursor:
              "pointer",

            boxShadow:
              "0 5px 18px rgba(0,0,0,0.04)",
          }}
        >

          <div
            style={{
              fontSize:
                "27px",

              marginBottom:
                "8px",
            }}
          >
            💬
          </div>


          <strong
            style={{
              display:
                "block",

              fontSize:
                "15px",

              color:
                "#173b38",
            }}
          >
            Desabafar
          </strong>


          <p
            style={{
              margin:
                "5px 0 0",

              color:
                "#888",

              fontSize:
                "11px",

              lineHeight:
                "1.4",
            }}
          >
            Compartilhe como você
            está se sentindo.
          </p>

        </button>


        {/* AJUDAR */}

        <button
          type="button"
          onClick={() =>
            irPara(
              "ajudar"
            )
          }
          style={{
            border:
              "1px solid #d9eae5",

            background:
              "#ffffff",

            borderRadius:
              "18px",

            padding:
              "18px",

            textAlign:
              "left",

            cursor:
              "pointer",

            boxShadow:
              "0 5px 18px rgba(0,0,0,0.04)",
          }}
        >

          <div
            style={{
              fontSize:
                "27px",

              marginBottom:
                "8px",
            }}
          >
            💚
          </div>


          <strong
            style={{
              display:
                "block",

              fontSize:
                "15px",

              color:
                "#173b38",
            }}
          >
            Ajudar alguém
          </strong>


          <p
            style={{
              margin:
                "5px 0 0",

              color:
                "#888",

              fontSize:
                "11px",

              lineHeight:
                "1.4",
            }}
          >
            Ofereça apoio para
            alguém que precisa.
          </p>

        </button>

      </section>


      {/* =================================================
          PUBLICAR
      ================================================= */}

      <section
        id="empresa-publicar"
        style={{
          maxWidth:
            "700px",

          margin:
            "25px auto 0",

          padding:
            "0 18px",

          boxSizing:
            "border-box",
        }}
      >

        <form
          onSubmit={
            publicar
          }
          style={{
            background:
              "#ffffff",

            border:
              "1px solid #e5e7e6",

            borderRadius:
              "22px",

            padding:
              "20px",

            boxShadow:
              "0 8px 30px rgba(0,0,0,0.05)",
          }}
        >

          <div
            style={{
              display:
                "flex",

              alignItems:
                "flex-start",

              justifyContent:
                "space-between",

              gap:
                "10px",

              marginBottom:
                "13px",
            }}
          >

            <div>

              <span
                style={{
                  color:
                    "#20adb0",

                  fontSize:
                    "9px",

                  fontWeight:
                    "800",

                  letterSpacing:
                    "1.5px",
                }}
              >
                COMUNIDADE
              </span>


              <h2
                style={{
                  margin:
                    "5px 0 0",

                  fontSize:
                    "20px",
                }}
              >
                O que você quer compartilhar?
              </h2>


              <p
                style={{
                  margin:
                    "5px 0 0",

                  color:
                    "#888",

                  fontSize:
                    "11px",
                }}
              >
                Conte o que está
                acontecendo.
              </p>

            </div>


            <span
              style={{
                padding:
                  "6px 8px",

                borderRadius:
                  "8px",

                background:
                  "#eef7f4",

                color:
                  "#4e7168",

                fontSize:
                  "9px",

                fontWeight:
                  "800",
              }}
            >
              🔒 ANÔNIMO
            </span>

          </div>


          <textarea
            value={
              texto
            }
            onChange={(e) =>
              setTexto(
                e.target.value
              )
            }
            placeholder="Escreva sobre o que está sentindo, uma dificuldade no trabalho ou algo que gostaria de compartilhar..."
            maxLength={
              1000
            }
            rows={
              8
            }
            style={{
              width:
                "100%",

              minHeight:
                "190px",

              resize:
                "vertical",

              boxSizing:
                "border-box",

              border:
                "1px solid #dfe5e2",

              borderRadius:
                "15px",

              background:
                "#fbfcfb",

              padding:
                "15px",

              outline:
                "none",

              fontFamily:
                "Georgia, 'Times New Roman', serif",

              fontSize:
                "16px",

              lineHeight:
                "1.6",

              color:
                "#344540",
            }}
          />


          <div
            style={{
              display:
                "flex",

              justifyContent:
                "space-between",

              marginTop:
                "8px",

              marginBottom:
                "13px",

              color:
                "#999",

              fontSize:
                "10px",
            }}
          >

            <span>
              🔒 Sua identidade permanece protegida.
            </span>


            <span>
              {texto.length}/1000
            </span>

          </div>


          <button
            type="submit"
            style={{
              width:
                "100%",

              border:
                "none",

              borderRadius:
                "14px",

              padding:
                "14px",

              background:
                texto.trim()
                  ? "#20adb0"
                  : "#cddbd8",

              color:
                "#ffffff",

              cursor:
                texto.trim()
                  ? "pointer"
                  : "default",

              fontSize:
                "13px",

              fontWeight:
                "800",
            }}
          >
            💚 Publicar anonimamente
          </button>

        </form>

      </section>


      {/* =================================================
          INDICADORES
      ================================================= */}

      <section
        style={{
          maxWidth:
            "700px",

          margin:
            "22px auto",

          padding:
            "0 18px",

          display:
            "grid",

          gridTemplateColumns:
            "repeat(3, 1fr)",

          gap:
            "9px",

          boxSizing:
            "border-box",
        }}
      >

        <div
          style={{
            background:
              "#ffffff",

            borderRadius:
              "15px",

            padding:
              "13px 8px",

            textAlign:
              "center",

            border:
              "1px solid #e7e7e7",
          }}
        >
          <div>
            💚
          </div>

          <strong
            style={{
              display:
                "block",

              marginTop:
                "5px",

              fontSize:
                "11px",
            }}
          >
            Apoio
          </strong>

          <span
            style={{
              display:
                "block",

              color:
                "#999",

              fontSize:
                "9px",

              marginTop:
                "3px",
            }}
          >
            Ouvir e acolher
          </span>
        </div>


        <div
          style={{
            background:
              "#ffffff",

            borderRadius:
              "15px",

            padding:
              "13px 8px",

            textAlign:
              "center",

            border:
              "1px solid #e7e7e7",
          }}
        >
          <div>
            🔒
          </div>

          <strong
            style={{
              display:
                "block",

              marginTop:
                "5px",

              fontSize:
                "11px",
            }}
          >
            Anonimato
          </strong>

          <span
            style={{
              display:
                "block",

              color:
                "#999",

              fontSize:
                "9px",

              marginTop:
                "3px",
            }}
          >
            Identidade protegida
          </span>
        </div>


        <div
          style={{
            background:
              "#ffffff",

            borderRadius:
              "15px",

            padding:
              "13px 8px",

            textAlign:
              "center",

            border:
              "1px solid #e7e7e7",
          }}
        >
          <div>
            🤝
          </div>

          <strong
            style={{
              display:
                "block",

              marginTop:
                "5px",

              fontSize:
                "11px",
            }}
          >
            Comunidade
          </strong>

          <span
            style={{
              display:
                "block",

              color:
                "#999",

              fontSize:
                "9px",

              marginTop:
                "3px",
            }}
          >
            Pessoas ajudando
          </span>
        </div>

      </section>


      {/* =================================================
          PUBLICAÇÕES DA EMPRESA
      ================================================= */}

      <section
        style={{
          maxWidth:
            "700px",

          margin:
            "25px auto",

          padding:
            "0 18px",

          boxSizing:
            "border-box",
        }}
      >

        <h2
          style={{
            margin:
              "0 0 15px",

            fontSize:
              "20px",
          }}
        >
          💭 Desabafos da comunidade
        </h2>


        {publicacoes.length ===
        0 ? (

          <div
            style={{
              background:
                "#ffffff",

              border:
                "1px solid #e5e5e5",

              borderRadius:
                "20px",

              padding:
                "35px 20px",

              textAlign:
                "center",
            }}
          >

            <div
              style={{
                fontSize:
                  "40px",
              }}
            >
              🌱
            </div>


            <h3
              style={{
                margin:
                  "10px 0 5px",

                fontSize:
                  "16px",
              }}
            >
              Ainda não há publicações
            </h3>


            <p
              style={{
                margin:
                  0,

                color:
                  "#888",

                fontSize:
                  "12px",

                lineHeight:
                  "1.5",
              }}
            >
              Seja uma das primeiras
              pessoas a compartilhar
              algo com a comunidade.
            </p>

          </div>

        ) : (

          <div
            style={{
              display:
                "flex",

              flexDirection:
                "column",

              gap:
                "18px",
            }}
          >

            {publicacoes.map(
              (publicacao) => {

                const comentarios =
                  publicacao.comentarios ||
                  [];


                const jaApoiou =
                  apoios[
                    publicacao.id
                  ] ||
                  false;


                return (

                  <article
                    key={
                      publicacao.id
                    }
                    style={{
                      background:
                        "#ffffff",

                      borderRadius:
                        "21px",

                      padding:
                        "19px",

                      border:
                        "1px solid #e5e5e5",

                      boxShadow:
                        "0 7px 22px rgba(0,0,0,0.04)",
                    }}
                  >

                    {/* USUÁRIO */}

                    <div
                      style={{
                        display:
                          "flex",

                        alignItems:
                          "center",

                        gap:
                          "10px",

                        marginBottom:
                          "13px",
                      }}
                    >

                      <div
                        style={{
                          width:
                            "42px",

                          height:
                            "42px",

                          borderRadius:
                            "50%",

                          background:
                            "#edf6f3",

                          display:
                            "flex",

                          alignItems:
                            "center",

                          justifyContent:
                            "center",
                        }}
                      >
                        🔒
                      </div>


                      <div>

                        <strong
                          style={{
                            display:
                              "block",

                            fontSize:
                              "13px",
                          }}
                        >
                          Anônimo
                        </strong>


                        <span
                          style={{
                            color:
                              "#999",

                            fontSize:
                              "10px",
                          }}
                        >
                          {publicacao.data ||
                            "Agora"}
                        </span>

                      </div>

                    </div>


                    {/* TEXTO */}

                    <p
                      style={{
                        margin:
                          0,

                        fontFamily:
                          "Georgia, 'Times New Roman', serif",

                        fontSize:
                          "19px",

                        lineHeight:
                          "1.55",

                        color:
                          "#364641",

                        whiteSpace:
                          "pre-wrap",
                      }}
                    >
                      “{publicacao.texto}”
                    </p>


                    {/* AÇÕES */}

                    <div
                      style={{
                        display:
                          "grid",

                        gridTemplateColumns:
                          "1fr 1fr 1.2fr",

                        gap:
                          "7px",

                        marginTop:
                          "17px",

                        paddingTop:
                          "12px",

                        borderTop:
                          "1px solid #eeeeee",
                      }}
                    >

                      <button
                        type="button"
                        onClick={() =>
                          apoiar(
                            publicacao
                          )
                        }
                        style={{
                          border:
                            "none",

                          background:
                            jaApoiou
                              ? "#e7f8f3"
                              : "#f7f7f7",

                          color:
                            jaApoiou
                              ? "#168f92"
                              : "#666",

                          borderRadius:
                            "10px",

                          padding:
                            "10px 4px",

                          cursor:
                            "pointer",

                          fontWeight:
                            "700",

                          fontSize:
                            "11px",
                        }}
                      >
                        {jaApoiou
                          ? "💚 Apoiado"
                          : "❤️ Apoiar"}

                        <small
                          style={{
                            display:
                              "block",

                            marginTop:
                              "3px",

                            fontWeight:
                              "400",
                          }}
                        >
                          {publicacao.apoios ||
                            0}
                        </small>
                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          abrirComentarios(
                            publicacao.id
                          )
                        }
                        style={{
                          border:
                            "none",

                          background:
                            "#f7f7f7",

                          color:
                            "#666",

                          borderRadius:
                            "10px",

                          padding:
                            "10px 4px",

                          cursor:
                            "pointer",

                          fontWeight:
                            "700",

                          fontSize:
                            "11px",
                        }}
                      >
                        💬 Comentar

                        <small
                          style={{
                            display:
                              "block",

                            marginTop:
                              "3px",

                            fontWeight:
                              "400",
                          }}
                        >
                          {comentarios.length}
                        </small>
                      </button>


                      <button
                        type="button"
                        onClick={() =>
                          solicitarChat(
                            publicacao
                          )
                        }
                        style={{
                          border:
                            "none",

                          background:
                            "#20adb0",

                          color:
                            "#ffffff",

                          borderRadius:
                            "10px",

                          padding:
                            "10px 4px",

                          cursor:
                            "pointer",

                          fontWeight:
                            "700",

                          fontSize:
                            "10px",
                        }}
                      >
                        🤝 Solicitar chat
                      </button>

                    </div>


                    {/* COMENTÁRIOS */}

                    {comentariosAbertos[
                      publicacao.id
                    ] && (

                      <section
                        style={{
                          marginTop:
                            "16px",

                          paddingTop:
                            "15px",

                          borderTop:
                            "1px solid #eeeeee",
                        }}
                      >

                        <h3
                          style={{
                            margin:
                              "0 0 12px",

                            fontSize:
                              "16px",
                          }}
                        >
                          💬 Comentários
                        </h3>


                        {comentarios.map(
                          (
                            comentario
                          ) => (

                            <div
                              key={
                                comentario.id
                              }
                              style={{
                                display:
                                  "flex",

                                gap:
                                  "8px",

                                padding:
                                  "9px",

                                marginBottom:
                                  "8px",

                                background:
                                  "#f7faf9",

                                borderRadius:
                                  "11px",
                              }}
                            >

                              <span>
                                👤
                              </span>

                              <div>

                                <strong
                                  style={{
                                    display:
                                      "block",

                                    fontSize:
                                      "11px",
                                  }}
                                >
                                  Anônimo
                                </strong>

                                <p
                                  style={{
                                    margin:
                                      "3px 0 0",

                                    fontSize:
                                      "12px",

                                    color:
                                      "#555",

                                    lineHeight:
                                      "1.45",
                                  }}
                                >
                                  {
                                    comentario.texto
                                  }
                                </p>

                              </div>

                            </div>

                          )
                        )}


                        {/* COMENTAR */}

                        <form
                          onSubmit={(e) =>
                            adicionarComentario(
                              e,
                              publicacao
                            )
                          }
                          style={{
                            display:
                              "flex",

                            gap:
                              "7px",

                            marginTop:
                              "10px",
                          }}
                        >

                          <input
                            type="text"
                            value={
                              novoComentario[
                                publicacao.id
                              ] ||
                              ""
                            }
                            onChange={(e) =>
                              alterarComentario(
                                publicacao.id,
                                e.target
                                  .value
                              )
                            }
                            placeholder="Escreva uma palavra de apoio..."
                            maxLength={
                              300
                            }
                            style={{
                              flex:
                                1,

                              minWidth:
                                0,

                              border:
                                "1px solid #ddd",

                              borderRadius:
                                "10px",

                              padding:
                                "10px",

                              outline:
                                "none",

                              fontSize:
                                "12px",
                            }}
                          />


                          <button
                            type="submit"
                            style={{
                              border:
                                "none",

                              background:
                                "#20adb0",

                              color:
                                "#ffffff",

                              borderRadius:
                                "10px",

                              padding:
                                "0 13px",

                              cursor:
                                "pointer",
                            }}
                          >
                            ➤
                          </button>

                        </form>

                      </section>

                    )}

                  </article>

                );
              }
            )}

          </div>

        )}

      </section>


      {/* =================================================
          IMPORTANTE:
          O MENU INFERIOR NÃO FICA AQUI.
          
          Ele é controlado pelo App.jsx.
          
          Fica:
          🏠 Início
          💬 Conversas
          💚 Ajudar
          👤 Perfil
      ================================================= */}

    </main>
  );
}

export default Empresa;