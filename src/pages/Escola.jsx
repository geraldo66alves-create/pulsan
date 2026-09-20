import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

function Escola({ irPara }) {
  const [texto, setTexto] = useState("");
  const [analisando, setAnalisando] = useState(false);
  const [posts, setPosts] = useState([]);
  const [carregandoPosts, setCarregandoPosts] = useState(true);
  const [usuarioId, setUsuarioId] = useState(null);

  const apiUrl =
    import.meta.env.VITE_API_URL?.replace(/\/$/, "") || "http://localhost:3001";

  async function carregarUsuario() {
    const { data } = await supabase.auth.getUser();
    const id = data?.user?.id || null;
    setUsuarioId(id);
    return id;
  }

  async function carregarPosts() {
    try {
      setCarregandoPosts(true);

      const { data, error } = await supabase
        .from("posts_ambiente")
        .select(
          "id, texto, criado_em, apoiadores, categoria, sentimento, urgencia, classificacao, alerta, usuario_id"
        )
        .eq("ambiente", "escolar")
        .or("ativo.eq.true,ativo.is.null")
        .order("criado_em", { ascending: false });

      if (error) throw error;

      setPosts(data || []);
    } catch (error) {
      console.error("Erro ao carregar publicações escolares:", error);
    } finally {
      setCarregandoPosts(false);
    }
  }

  useEffect(() => {
    let canal;

    async function iniciar() {
      await carregarUsuario();
      await carregarPosts();

      canal = supabase
        .channel("pulsan-escola-posts")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "posts_ambiente",
            filter: "ambiente=eq.escolar",
          },
          () => {
            carregarPosts();
          }
        )
        .subscribe();
    }

    iniciar();

    return () => {
      if (canal) supabase.removeChannel(canal);
    };
  }, []);

  function abrirComentarios(post) {
    localStorage.setItem(
      "pulsanPostComentarios",
      JSON.stringify({
        id: post.id,
        texto: post.texto,
        ambiente: "escolar",
      })
    );
    irPara("comentarios");
  }

  async function apoiar(post) {
    if (!usuarioId) {
      alert("É necessário estar conectado para apoiar uma publicação.");
      return;
    }

    try {
      const apoiadores = Array.isArray(post.apoiadores)
        ? post.apoiadores
        : [];

      const jaApoiou = apoiadores.includes(usuarioId);

      const novosApoiadores = jaApoiou
        ? apoiadores.filter((id) => id !== usuarioId)
        : [...apoiadores, usuarioId];

      const { error } = await supabase
        .from("posts_ambiente")
        .update({ apoiadores: novosApoiadores })
        .eq("id", post.id);

      if (error) throw error;

      setPosts((atual) =>
        atual.map((item) =>
          item.id === post.id
            ? { ...item, apoiadores: novosApoiadores }
            : item
        )
      );
    } catch (error) {
      console.error("Erro ao apoiar publicação:", error);
      alert("Não foi possível registrar o apoio agora.");
    }
  }

  async function publicar(e) {
    if (e) e.preventDefault();

    const textoLimpo = texto.trim();

    if (!textoLimpo) {
      alert("Escreva algo antes de publicar.");
      return;
    }

    if (analisando) return;

    try {
      setAnalisando(true);

      const idUsuario = usuarioId || (await carregarUsuario());

      if (!idUsuario) {
        alert("Sua sessão não foi encontrada. Entre novamente no Pulsan.");
        return;
      }

      // A IA analisa o conteúdo antes de qualquer publicação.
      const { data, error } = await supabase.functions.invoke(
        "analisar-desabafo",
        {
          body: {
            texto: textoLimpo,
            ambiente: "escolar",
          },
        }
      );

      if (error) {
        console.error("Erro na análise:", error);
        alert("Não foi possível analisar seu desabafo. Tente novamente.");
        return;
      }

      console.log("Resultado da análise:", data);

      // Conteúdo ofensivo não é publicado.
      if (data?.permitir_publicacao === false) {
        alert(
          data?.mensagem ||
            "Sua mensagem contém linguagem ofensiva. Reformule o texto."
        );
        return;
      }

      const possivelRisco = Boolean(data?.possivel_risco);
      const possivelAmeaca = Boolean(data?.possivel_ameaca);
      const possivelBullying = Boolean(data?.possivel_bullying);
      const possivelAssedio = Boolean(data?.possivel_assedio);

      const alerta = possivelRisco || possivelAmeaca || possivelBullying || possivelAssedio;

      const urgencia =
        possivelRisco || possivelAmeaca
          ? "urgente"
          : possivelBullying || possivelAssedio
            ? "importante"
            : "normal";

      const categoria =
        data?.categoria ||
        (possivelBullying
          ? "bullying"
          : possivelAssedio
            ? "assedio"
            : possivelAmeaca
              ? "ameaca"
              : possivelRisco
                ? "risco"
                : "desabafo");

      // A publicação só acontece depois da análise.
      const { error: insertError } = await supabase
        .from("posts_ambiente")
        .insert({
          usuario_id: idUsuario,
          texto: textoLimpo,
          criado_em: new Date().toISOString(),
          apoiadores: [],
          nome_usuario: "Anônimo",
          foto_usuario: null,
          prioridade: urgencia,
          categoria,
          sentimento: data?.sentimento || null,
          urgencia,
          ambiente: "escolar",
          classificacao:
            data?.classificacao ||
            (alerta ? "atenção" : "normal"),
          alerta,
          moderado: true,
          moderacao_motivo: data?.mensagem || null,
        });

      if (insertError) {
        console.error("Erro ao publicar no Supabase:", insertError);
        alert("A análise foi concluída, mas não foi possível publicar o desabafo.");
        return;
      }

      setTexto("");
      await carregarPosts();

      if (possivelRisco) {
        alert(
          "Seu relato foi recebido e recebeu prioridade de atenção. Pessoas autorizadas poderão avaliar a situação."
        );
        return;
      }

      if (possivelAmeaca) {
        alert(
          "Seu relato foi recebido e recebeu um alerta prioritário para avaliação."
        );
        return;
      }

      if (possivelBullying) {
        alert(
          "Seu relato foi publicado anonimamente. Identificamos possíveis sinais de bullying e o caso poderá receber atenção."
        );
        return;
      }

      if (possivelAssedio) {
        alert(
          "Seu relato foi publicado anonimamente e poderá receber atenção de pessoas autorizadas."
        );
        return;
      }

      alert("Seu desabafo foi publicado anonimamente. 💚");
    } catch (erro) {
      console.error("Erro inesperado:", erro);
      alert("Ocorreu um erro ao analisar seu desabafo. Tente novamente.");
    } finally {
      setAnalisando(false);
    }
  }

  return (
    <main className="escola-page">

      {/* ================================
          CABEÇALHO
      ================================= */}

      <header className="escola-header">

        <div className="escola-brand">

          <img
            src="/logo.png"
            alt="Logo Pulsan"
          />

          <div>
            <strong>PULSAN</strong>
            <span>Ambiente Escola</span>
          </div>

        </div>

        <button
          type="button"
          className="escola-perfil"
          onClick={() => irPara("perfil")}
        >
          👤
        </button>

      </header>


      {/* ================================
          APRESENTAÇÃO
      ================================= */}

      <section className="escola-intro">

        <span className="escola-label">
          ESPAÇO SEGURO
        </span>

        <h1>
          Ambiente Escola 💚
        </h1>

        <p>
          Um espaço para falar, ouvir, acolher e pedir ajuda
          sem precisar se identificar.
        </p>

      </section>


      {/* ================================
          PEDIR AJUDA
      ================================= */}

      <section className="escola-help">

        <div className="escola-help-icon">
          🫶
        </div>

        <div className="escola-help-text">

          <strong>
            Você precisa de ajuda?
          </strong>

          <p>
            Se alguma situação está te incomodando,
            você pode pedir ajuda de forma segura.
          </p>

        </div>

        <button
          type="button"
          onClick={() => irPara("solicitar-ajuda")}
        >
          Pedir ajuda
        </button>

      </section>


      {/* ================================
          AÇÕES PRINCIPAIS
      ================================= */}

      <section className="escola-actions">

        {/* DESABAFAR */}

        <button
          type="button"
          className="escola-action-card"
          onClick={() => {
            document
              .getElementById("escola-desabafo")
              ?.scrollIntoView({
                behavior: "smooth"
              });
          }}
        >

          <div className="escola-action-icon">
            💬
          </div>

          <div>

            <h2>
              Desabafar
            </h2>

            <p>
              Conte o que está sentindo de forma anônima.
            </p>

          </div>

          <span className="escola-action-arrow">
            →
          </span>

        </button>


        {/* AJUDAR */}

        <button
          type="button"
          className="escola-action-card"
          onClick={() => irPara("ajudar")}
        >

          <div className="escola-action-icon">
            💚
          </div>

          <div>

            <h2>
              Ajudar alguém
            </h2>

            <p>
              Uma palavra de apoio pode fazer diferença.
            </p>

          </div>

          <span className="escola-action-arrow">
            →
          </span>

        </button>

      </section>


      {/* ================================
          DESABAFO
      ================================= */}

      <section
        className="escola-publish"
        id="escola-desabafo"
      >

        <div className="escola-publish-header">

          <div>

            <span className="escola-publish-label">
              DESABAFO ANÔNIMO
            </span>

            <h2>
              O que você está sentindo?
            </h2>

            <p>
              Escreva livremente. Você não precisa colocar seu nome.
            </p>

          </div>

          <span className="escola-safe">
            🔒 Seguro
          </span>

        </div>


        {/* IDENTIFICAÇÃO */}

        <div className="escola-anonimo">
          👤 ANÔNIMO
        </div>


        {/* CAMPO */}

        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escreva aqui o que está acontecendo, como você está se sentindo ou aquilo que gostaria de compartilhar..."
          maxLength={1000}
        />


        {/* INFORMAÇÕES */}

        <div className="escola-publish-info">

          <span>
            🔒 Sua identidade permanece protegida.
          </span>

          <span>
            {texto.length}/1000
          </span>

        </div>


        {/* BOTÃO */}

       <button
  type="button"
  className="escola-publish-button"
  onClick={publicar}
  disabled={analisando}
>
  {analisando
    ? "🤖 Analisando..."
    : "💚 Publicar anonimamente"}
</button>

      </section>


      {/* ================================
          COMUNIDADE
      ================================= */}

      <section className="escola-community">
        <div className="escola-community-header">
          <div>
            <span>COMUNIDADE</span>
            <h2>O que outras pessoas estão compartilhando</h2>
          </div>

          <span className="escola-community-lock">🔒 Anônimo</span>
        </div>

        {carregandoPosts ? (
          <div className="escola-empty">
            <div className="escola-empty-icon">💚</div>
            <h3>Carregando desabafos...</h3>
            <p>Estamos preparando o espaço da comunidade.</p>
          </div>
        ) : posts.length === 0 ? (
          <>
            <div className="escola-empty">
              <div className="escola-empty-icon">🌱</div>
              <h3>Este espaço está começando</h3>
              <p>
                Novos desabafos aparecerão aqui de forma anônima.
              </p>
            </div>
          </>
        ) : (
          posts.map((post) => {
            const apoiadores = Array.isArray(post.apoiadores)
              ? post.apoiadores
              : [];

            const apoiou = usuarioId
              ? apoiadores.includes(usuarioId)
              : false;

            const dataPost = post.criado_em
              ? new Date(post.criado_em).toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "Agora";

            return (
              <article className="escola-post" key={post.id}>
                <div className="escola-post-header">
                  <div className="escola-post-avatar">👤</div>

                  <div>
                    <strong>Anônimo</strong>
                    <span>{dataPost}</span>
                  </div>
                </div>

                <p>{post.texto}</p>

                <div className="escola-post-actions">
                  <button
                    type="button"
                    onClick={() => apoiar(post)}
                    aria-pressed={apoiou}
                  >
                    {apoiou ? "💚 Apoiado" : "🤍 Apoiar"}{" "}
                    {apoiadores.length > 0 ? `(${apoiadores.length})` : ""}
                  </button>

                  <button
                    type="button"
                    onClick={() => abrirComentarios(post)}
                  >
                    💬 Comentários
                  </button>
                </div>
              </article>
            );
          })
        )}
      </section>


      {/* ================================
          INFORMAÇÕES DE SEGURANÇA
      ================================= */}

      <section className="escola-info-cards">

        <div className="escola-info-card">

          <span>
            🔒
          </span>

          <div>

            <strong>
              Anonimato
            </strong>

            <p>
              Você pode compartilhar sem revelar sua identidade.
            </p>

          </div>

        </div>


        <div className="escola-info-card">

          <span>
            🤝
          </span>

          <div>

            <strong>
              Acolhimento
            </strong>

            <p>
              Incentivamos respeito, empatia e apoio.
            </p>

          </div>

        </div>


        <div className="escola-info-card">

          <span>
            🆘
          </span>

          <div>

            <strong>
              Ajuda
            </strong>

            <p>
              Situações preocupantes podem receber atenção.
            </p>

          </div>

        </div>

      </section>


      {/* ================================
          NAVEGAÇÃO
      ================================= */}

      <nav className="escola-bottom-nav">

        <button
          type="button"
          onClick={() => irPara("inicio")}
        >
          <span>🏠</span>
          <small>Início</small>
        </button>


        <button
          type="button"
          onClick={() => irPara("conversas")}
        >
          <span>💬</span>
          <small>Conversas</small>
        </button>


        <button
          type="button"
          className="active"
          onClick={() => irPara("escola")}
        >
          <span>💚</span>
          <small>Apoiar</small>
        </button>


        <button
          type="button"
          onClick={() => irPara("solicitacoes")}
        >
          <span>🤝</span>
          <small>Ajuda</small>
        </button>


        <button
          type="button"
          onClick={() => irPara("perfil")}
        >
          <span>👤</span>
          <small>Perfil</small>
        </button>

      </nav>

    </main>
  );
}

export default Escola;