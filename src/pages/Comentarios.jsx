import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "../tema.css";

export default function Comentarios({
  postId,
  usuarioId,
  tema = "claro",
  onFechar,
}) {
  const [comentarios, setComentarios] = useState([]);
  const [novoComentario, setNovoComentario] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");

  const modoEscuro = tema === "escuro";

  /*
   * =========================================================
   * CARREGAR COMENTÁRIOS
   * =========================================================
   */

  async function carregarComentarios() {
    if (!postId) {
      setComentarios([]);
      setCarregando(false);
      return;
    }

    try {
      setErro("");

      const { data, error } = await supabase
        .from("comentarios_ambiente")
        .select(`
          id,
          post_id,
          usuario_id,
          texto,
          criado_em,
          ativo
        `)
        .eq("post_id", postId)
        .eq("ativo", true)
        .order("criado_em", {
          ascending: true,
        });

      if (error) {
        throw error;
      }

      setComentarios(data || []);
    } catch (error) {
      console.error("Erro ao carregar comentários:", error);

      setErro(
        "Não foi possível carregar os comentários."
      );
    } finally {
      setCarregando(false);
    }
  }

  /*
   * =========================================================
   * PRIMEIRO CARREGAMENTO
   * =========================================================
   */

  useEffect(() => {
    let ativo = true;

    async function iniciar() {
      if (!ativo) return;

      await carregarComentarios();
    }

    iniciar();

    return () => {
      ativo = false;
    };
  }, [postId]);

  /*
   * =========================================================
   * REALTIME
   * =========================================================
   */

  useEffect(() => {
    if (!postId) return;

    const canal = supabase
      .channel(`comentarios-post-${postId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comentarios_ambiente",
          filter: `post_id=eq.${postId}`,
        },
        () => {
          carregarComentarios();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, [postId]);

  /*
   * =========================================================
   * ENVIAR COMENTÁRIO
   * =========================================================
   */

  async function enviarComentario(event) {
    event?.preventDefault();

    const texto = novoComentario.trim();

    if (!texto) {
      return;
    }

    if (!usuarioId) {
      setErro(
        "Você precisa estar conectado para comentar."
      );
      return;
    }

    if (!postId) {
      setErro(
        "Não foi possível identificar o desabafo."
      );
      return;
    }

    if (texto.length > 1000) {
      setErro(
        "O comentário pode ter no máximo 1000 caracteres."
      );
      return;
    }

    try {
      setEnviando(true);
      setErro("");

      /*
       * O conteúdo é enviado para a moderação do servidor
       * antes de ser salvo no banco.
       */

      const apiUrl =
        import.meta.env.VITE_API_URL ||
        (window.location.hostname === "localhost"
          ? "http://localhost:3001"
          : "");

      if (apiUrl) {
        try {
          const resposta = await fetch(
            `${apiUrl}/api/analisar-mensagem`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                texto,
                usuario_id: usuarioId,
                post_id: postId,
              }),
            }
          );

          if (resposta.ok) {
            const analise = await resposta.json();

            if (
              analise?.permitido === false ||
              analise?.bloqueado === true ||
              analise?.moderado === true
            ) {
              setErro(
                analise?.motivo ||
                  analise?.mensagem ||
                  "Esse comentário não pode ser publicado."
              );

              return;
            }
          }
        } catch (erroModeracao) {
          console.warn(
            "Não foi possível consultar a moderação:",
            erroModeracao
          );
        }
      }

      /*
       * Salva diretamente no Supabase.
       */

      const { data, error } = await supabase
        .from("comentarios_ambiente")
        .insert({
          post_id: postId,
          usuario_id: usuarioId,
          texto,
          criado_em: new Date().toISOString(),
          ativo: true,
        })
        .select(`
          id,
          post_id,
          usuario_id,
          texto,
          criado_em,
          ativo
        `)
        .single();

      if (error) {
        throw error;
      }

      /*
       * Adiciona imediatamente na tela.
       * O Realtime também atualizará os demais usuários.
       */

      if (data) {
        setComentarios((anteriores) => {
          const jaExiste = anteriores.some(
            (item) => String(item.id) === String(data.id)
          );

          if (jaExiste) {
            return anteriores;
          }

          return [
            ...anteriores,
            data,
          ];
        });
      }

      setNovoComentario("");
    } catch (error) {
      console.error(
        "Erro ao enviar comentário:",
        error
      );

      setErro(
        error?.message ||
          "Não foi possível publicar o comentário."
      );
    } finally {
      setEnviando(false);
    }
  }

  /*
   * =========================================================
   * EXCLUIR / DESATIVAR MEU COMENTÁRIO
   * =========================================================
   */

  async function excluirComentario(comentario) {
    if (!usuarioId) return;

    if (
      String(comentario.usuario_id) !==
      String(usuarioId)
    ) {
      return;
    }

    const confirmar = window.confirm(
      "Deseja excluir este comentário?"
    );

    if (!confirmar) {
      return;
    }

    try {
      setErro("");

      const { error } = await supabase
        .from("comentarios_ambiente")
        .update({
          ativo: false,
        })
        .eq("id", comentario.id)
        .eq("usuario_id", usuarioId);

      if (error) {
        throw error;
      }

      setComentarios((anteriores) =>
        anteriores.filter(
          (item) =>
            String(item.id) !==
            String(comentario.id)
        )
      );
    } catch (error) {
      console.error(
        "Erro ao excluir comentário:",
        error
      );

      setErro(
        "Não foi possível excluir o comentário."
      );
    }
  }

  /*
   * =========================================================
   * DATA
   * =========================================================
   */

  function formatarData(data) {
    if (!data) return "";

    const dataObj = new Date(data);

    if (Number.isNaN(dataObj.getTime())) {
      return "";
    }

    return dataObj.toLocaleString(
      "pt-BR",
      {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  }

  /*
   * =========================================================
   * RENDER
   * =========================================================
   */

  return (
    <div
      className={`pulsan-comentarios ${
        modoEscuro
          ? "pulsan-comentarios-dark"
          : ""
      }`}
    >
      <div className="pulsan-comentarios-header">
        <div>
          <span className="pulsan-comentarios-kicker">
            ESPAÇO DE APOIO
          </span>

          <h3>
            Comentários
          </h3>

          <span className="pulsan-comentarios-count">
            {comentarios.length}{" "}
            {comentarios.length === 1
              ? "comentário"
              : "comentários"}
          </span>
        </div>

        {onFechar && (
          <button
            type="button"
            onClick={onFechar}
            className="pulsan-comentarios-fechar"
            aria-label="Fechar comentários"
          >
            ×
          </button>
        )}
      </div>

      {erro && (
        <div
          className="pulsan-comentarios-erro"
          role="alert"
        >
          {erro}
        </div>
      )}

      <div className="pulsan-comentarios-lista">
        {carregando ? (
          <div className="pulsan-comentarios-vazio">
            <div className="pulsan-comentarios-icone">
              💙
            </div>

            <strong>
              Carregando comentários...
            </strong>
          </div>
        ) : comentarios.length === 0 ? (
          <div className="pulsan-comentarios-vazio">
            <div className="pulsan-comentarios-icone">
              🌱
            </div>

            <strong>
              Ainda não há comentários
            </strong>

            <span>
              Seja a primeira pessoa a deixar
              uma mensagem de apoio.
            </span>
          </div>
        ) : (
          comentarios.map((comentario) => {
            const meuComentario =
              String(comentario.usuario_id) ===
              String(usuarioId);

            return (
              <article
                key={comentario.id}
                className={`pulsan-comentario ${
                  meuComentario
                    ? "pulsan-comentario-meu"
                    : ""
                }`}
              >
                <div className="pulsan-comentario-avatar">
                  {meuComentario
                    ? "Você".charAt(0)
                    : "P"}
                </div>

                <div className="pulsan-comentario-corpo">
                  <div className="pulsan-comentario-topo">
                    <strong>
                      {meuComentario
                        ? "Você"
                        : "Pessoa anônima"}
                    </strong>

                    <span>
                      {formatarData(
                        comentario.criado_em
                      )}
                    </span>
                  </div>

                  <p>
                    {comentario.texto}
                  </p>

                  {meuComentario && (
                    <button
                      type="button"
                      onClick={() =>
                        excluirComentario(
                          comentario
                        )
                      }
                      className="pulsan-comentario-excluir"
                    >
                      Excluir
                    </button>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>

      <form
        className="pulsan-comentarios-form"
        onSubmit={enviarComentario}
      >
        <textarea
          value={novoComentario}
          onChange={(event) =>
            setNovoComentario(
              event.target.value
            )
          }
          placeholder="Escreva uma mensagem de apoio..."
          maxLength={1000}
          rows={2}
          disabled={enviando}
        />

        <div className="pulsan-comentarios-form-bottom">
          <span>
            {novoComentario.length}/1000
          </span>

          <button
            type="submit"
            disabled={
              enviando ||
              !novoComentario.trim()
            }
          >
            {enviando
              ? "Enviando..."
              : "Enviar"}
          </button>
        </div>
      </form>

      <div className="pulsan-comentarios-privacidade">
        🔒 Comentários são publicados de forma
        anônima.
      </div>

      <style>{`
        .pulsan-comentarios {
          --blue: #3A7DFF;
          --deep: #0F2D5B;
          --light: #EAF3FF;
          --soft: #A8C7FF;

          width: 100%;
          background: #ffffff;
          color: var(--deep);
          border-radius: 24px;
          overflow: hidden;
        }

        .pulsan-comentarios-dark {
          background: #102744;
          color: #edf5ff;
        }

        .pulsan-comentarios-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid rgba(58,125,255,.10);
        }

        .pulsan-comentarios-kicker {
          color: var(--blue);
          font-size: 10px;
          font-weight: 900;
          letter-spacing: .12em;
        }

        .pulsan-comentarios-header h3 {
          margin: 4px 0 2px;
          font-size: 20px;
        }

        .pulsan-comentarios-count {
          color: #7b8b9d;
          font-size: 11px;
        }

        .pulsan-comentarios-fechar {
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 50%;
          background: var(--light);
          color: var(--deep);
          font-size: 24px;
          cursor: pointer;
        }

        .pulsan-comentarios-lista {
          max-height: 420px;
          overflow-y: auto;
          padding: 16px;
        }

        .pulsan-comentario {
          display: flex;
          gap: 10px;
          padding: 13px 0;
          border-bottom: 1px solid rgba(58,125,255,.08);
        }

        .pulsan-comentario-avatar {
          width: 36px;
          height: 36px;
          flex: 0 0 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--light);
          color: var(--blue);
          font-size: 11px;
          font-weight: 800;
        }

        .pulsan-comentario-corpo {
          flex: 1;
          min-width: 0;
        }

        .pulsan-comentario-topo {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .pulsan-comentario-topo strong {
          font-size: 12px;
        }

        .pulsan-comentario-topo span {
          color: #8a98a8;
          font-size: 9px;
        }

        .pulsan-comentario p {
          margin: 0;
          font-size: 13px;
          line-height: 1.5;
          white-space: pre-wrap;
          word-break: break-word;
        }

        .pulsan-comentario-excluir {
          margin-top: 6px;
          padding: 0;
          border: none;
          background: transparent;
          color: #d46b6b;
          font-size: 10px;
          cursor: pointer;
        }

        .pulsan-comentarios-vazio {
          min-height: 180px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          gap: 7px;
          color: #718294;
        }

        .pulsan-comentarios-icone {
          font-size: 30px;
          margin-bottom: 4px;
        }

        .pulsan-comentarios-vazio strong {
          color: var(--deep);
          font-size: 14px;
        }

        .pulsan-comentarios-dark
        .pulsan-comentarios-vazio strong {
          color: #edf5ff;
        }

        .pulsan-comentarios-vazio span {
          max-width: 250px;
          font-size: 11px;
          line-height: 1.5;
        }

        .pulsan-comentarios-form {
          padding: 12px 16px;
          border-top: 1px solid rgba(58,125,255,.10);
        }

        .pulsan-comentarios-form textarea {
          width: 100%;
          box-sizing: border-box;
          resize: none;
          border: 1px solid #dce6f0;
          border-radius: 16px;
          padding: 11px 13px;
          outline: none;
          font-family: inherit;
          font-size: 13px;
          background: #f8fbff;
          color: var(--deep);
        }

        .pulsan-comentarios-form textarea:focus {
          border-color: var(--blue);
          box-shadow: 0 0 0 3px rgba(58,125,255,.10);
        }

        .pulsan-comentarios-form-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 7px;
        }

        .pulsan-comentarios-form-bottom span {
          color: #94a0ad;
          font-size: 9px;
        }

        .pulsan-comentarios-form-bottom button {
          border: none;
          border-radius: 999px;
          padding: 9px 18px;
          background: var(--blue);
          color: white;
          font-size: 11px;
          font-weight: 800;
          cursor: pointer;
        }

        .pulsan-comentarios-form-bottom button:disabled {
          background: #cbd5e1;
          cursor: not-allowed;
        }

        .pulsan-comentarios-erro {
          margin: 10px 16px 0;
          padding: 10px 12px;
          border-radius: 12px;
          background: #fff1f1;
          color: #b94b4b;
          font-size: 11px;
        }

        .pulsan-comentarios-privacidade {
          padding: 8px 16px 12px;
          text-align: center;
          color: #8a98a8;
          font-size: 9px;
        }

        .pulsan-comentarios-dark
        .pulsan-comentarios-form textarea {
          background: #0d203b;
          border-color: rgba(168,199,255,.18);
          color: #edf5ff;
        }

        .pulsan-comentarios-dark
        .pulsan-comentarios-header {
          border-color: rgba(168,199,255,.12);
        }

        .pulsan-comentarios-dark
        .pulsan-comentarios-form {
          border-color: rgba(168,199,255,.12);
        }
      `}</style>
    </div>
  );
}