import React, { useState } from "react";

function Avaliacao({ irPara }) {
  // =====================================================
  // CONVERSA ATUAL
  // =====================================================

  let solicitacao = {};
  let conversa = {};

  try {
    solicitacao =
      JSON.parse(
        localStorage.getItem(
          "pulsanSolicitacaoAtual"
        ) || "{}"
      ) || {};

    conversa =
      JSON.parse(
        localStorage.getItem(
          "pulsanConversaAtual"
        ) || "{}"
      ) || {};
  } catch (erro) {
    console.log(
      "Erro ao carregar dados da conversa:",
      erro
    );
  }

  // =====================================================
  // USUÁRIO ATUAL
  // =====================================================

  let usuario = {};

  try {
    usuario =
      JSON.parse(
        localStorage.getItem(
          "usuarioLogado"
        ) || "{}"
      ) || {};
  } catch {
    usuario = {};
  }

  const usuarioId =
    usuario.id ||
    usuario.email ||
    localStorage.getItem(
      "pulsanUsuarioId"
    ) ||
    "usuario";

  const nomeUsuario =
    usuario.nome ||
    usuario.name ||
    localStorage.getItem(
      "pulsanNome"
    ) ||
    "Usuário";

  // =====================================================
  // IDENTIFICAR QUEM AJUDOU
  // =====================================================

  const ajudanteId =
    solicitacao.ajudanteId ||
    solicitacao.apoiadorId ||
    solicitacao.helperId ||
    conversa.ajudanteId ||
    conversa.apoiadorId ||
    localStorage.getItem(
      "pulsanAjudanteId"
    ) ||
    "";

  const ajudanteNome =
    solicitacao.ajudanteNome ||
    solicitacao.apoiadorNome ||
    conversa.ajudanteNome ||
    conversa.apoiadorNome ||
    localStorage.getItem(
      "pulsanNomeOutraPessoa"
    ) ||
    "Apoiador";

  const ajudanteFoto =
    solicitacao.ajudanteFoto ||
    solicitacao.apoiadorFoto ||
    conversa.ajudanteFoto ||
    conversa.apoiadorFoto ||
    localStorage.getItem(
      "pulsanFotoOutraPessoa"
    ) ||
    "";

  // =====================================================
  // ESTADO
  // =====================================================

  const [estrelas, setEstrelas] =
    useState(0);

  const [enviado, setEnviado] =
    useState(false);

  const [mensagem, setMensagem] =
    useState("");

  const [hover, setHover] =
    useState(0);

  // =====================================================
  // TEXTO DA ESTRELA
  // =====================================================

  function textoAvaliacao() {
    if (estrelas === 1) {
      return "Muito ruim";
    }

    if (estrelas === 2) {
      return "Ruim";
    }

    if (estrelas === 3) {
      return "Regular";
    }

    if (estrelas === 4) {
      return "Boa";
    }

    if (estrelas === 5) {
      return "Excelente";
    }

    return "Escolha uma avaliação";
  }

  // =====================================================
  // OBTER USUÁRIOS
  // =====================================================

  function obterUsuarios() {
    try {
      const dados =
        JSON.parse(
          localStorage.getItem(
            "pulsanUsuarios"
          ) || "[]"
        );

      return Array.isArray(dados)
        ? dados
        : [];
    } catch {
      return [];
    }
  }

  // =====================================================
  // SALVAR USUÁRIOS
  // =====================================================

  function salvarUsuarios(usuarios) {
    localStorage.setItem(
      "pulsanUsuarios",
      JSON.stringify(
        usuarios
      )
    );
  }

  // =====================================================
  // ATUALIZAR USUÁRIO LOGADO
  // =====================================================

  function atualizarUsuarioLogado(
    dadosAtualizados
  ) {
    try {
      const atual =
        JSON.parse(
          localStorage.getItem(
            "usuarioLogado"
          ) || "{}"
        ) || {};

      const novoUsuario = {
        ...atual,
        ...dadosAtualizados,
      };

      localStorage.setItem(
        "usuarioLogado",
        JSON.stringify(
          novoUsuario
        )
      );
    } catch (erro) {
      console.log(
        "Erro ao atualizar usuário:",
        erro
      );
    }
  }

  // =====================================================
  // REGISTRAR AVALIAÇÃO
  // =====================================================

  function enviarAvaliacao() {
    if (estrelas < 1) {
      alert(
        "Escolha de 1 a 5 estrelas para continuar."
      );

      return;
    }

    // -----------------------------------------------
    // ID ÚNICO DA CONVERSA
    // -----------------------------------------------

    const conversaId =
      conversa.id ||
      solicitacao.id ||
      localStorage.getItem(
        "pulsanConversaId"
      ) ||
      "conversa";

    // -----------------------------------------------
    // VERIFICAR AVALIAÇÕES EXISTENTES
    // -----------------------------------------------

    let avaliacoes = [];

    try {
      avaliacoes =
        JSON.parse(
          localStorage.getItem(
            "pulsanAvaliacoes"
          ) || "[]"
        );

      if (
        !Array.isArray(
          avaliacoes
        )
      ) {
        avaliacoes = [];
      }
    } catch {
      avaliacoes = [];
    }

    // -----------------------------------------------
    // IMPEDIR DUPLICIDADE
    // -----------------------------------------------

    const avaliacaoExistente =
      avaliacoes.find(
        (item) =>
          String(
            item.conversaId
          ) ===
            String(
              conversaId
            ) &&
          String(
            item.avaliadorId
          ) ===
            String(
              usuarioId
            )
      );

    if (avaliacaoExistente) {
      alert(
        "Você já avaliou esta conversa."
      );

      setEnviado(true);

      return;
    }

    // -----------------------------------------------
    // NOVA AVALIAÇÃO
    // -----------------------------------------------

    const novaAvaliacao = {
      id:
        "avaliacao-" +
        Date.now(),

      conversaId:

        conversaId,

      avaliadorId:
        String(
          usuarioId
        ),

      avaliadorNome:
        nomeUsuario,

      avaliadoId:
        String(
          ajudanteId ||
            "ajudante"
        ),

      avaliadoNome:
        ajudanteNome,

      estrelas:
        estrelas,

      comentario:
        mensagem.trim(),

      data:
        new Date().toISOString(),
    };

    avaliacoes.push(
      novaAvaliacao
    );

    localStorage.setItem(
      "pulsanAvaliacoes",
      JSON.stringify(
        avaliacoes
      )
    );

    // =================================================
    // BUSCAR TODAS AS AVALIAÇÕES DO AJUDANTE
    // =================================================

    const avaliacoesDoAjudante =
      avaliacoes.filter(
        (item) =>
          String(
            item.avaliadoId
          ) ===
          String(
            ajudanteId ||
              "ajudante"
          )
      );

    // =================================================
    // CALCULAR MÉDIA
    // =================================================

    const somaEstrelas =
      avaliacoesDoAjudante.reduce(
        (
          total,
          item
        ) =>
          total +
          Number(
            item.estrelas ||
              0
          ),
        0
      );

    const quantidade =
      avaliacoesDoAjudante.length;

    const media =
      quantidade > 0
        ? somaEstrelas /
          quantidade
        : 0;

    const mediaArredondada =
      Number(
        media.toFixed(2)
      );

    // =================================================
    // BUSCAR DADOS DO AJUDANTE
    // =================================================

    const usuarios =
      obterUsuarios();

    const indiceAjudante =
      usuarios.findIndex(
        (item) =>
          String(
            item.id ||
              item.email ||
              ""
          ) ===
          String(
            ajudanteId
          )
      );

    let dadosAjudante = null;

    if (
      indiceAjudante >=
      0
    ) {
      dadosAjudante =
        usuarios[
          indiceAjudante
        ];
    } else {
      dadosAjudante = {
        id:
          ajudanteId ||
          "ajudante",
        nome:
          ajudanteNome,
        foto:
          ajudanteFoto,
        avaliacoes: [],
        pontos: 0,
        ajudas: 0,
      };
    }

    // =================================================
    // PONTOS
    // =================================================

    const pontosAtuais =
      Number(
        dadosAjudante.pontos ||
          0
      );

    // 10 pontos por avaliação
    let pontosGanhos = 10;

    // bônus de 5 estrelas
    if (estrelas === 5) {
      pontosGanhos += 5;
    }

    const novosPontos =
      pontosAtuais +
      pontosGanhos;

    // =================================================
    // QUANTIDADE DE AJUDAS
    // =================================================

    const ajudasAtuais =
      Number(
        dadosAjudante.ajudas ||
          0
      );

    const novasAjudas =
      ajudasAtuais + 1;

    // =================================================
    // VERIFICAÇÃO
    // =================================================

    const verificado =
      quantidade >= 10 &&
      mediaArredondada >=
        4.5;

    // =================================================
    // ATUALIZAR AVALIAÇÕES DO PERFIL
    // =================================================

    const avaliacoesPerfil =
      Array.isArray(
        dadosAjudante.avaliacoes
      )
        ? [
            ...dadosAjudante.avaliacoes,
            {
              estrelas:
                estrelas,
              avaliadorId:
                String(
                  usuarioId
                ),
              conversaId:
                conversaId,
              data:
                new Date().toISOString(),
            },
          ]
        : [
            {
              estrelas:
                estrelas,
              avaliadorId:
                String(
                  usuarioId
                ),
              conversaId:
                conversaId,
              data:
                new Date().toISOString(),
            },
          ];

    // =================================================
    // NOVOS DADOS
    // =================================================

    const ajudanteAtualizado = {
      ...dadosAjudante,

      avaliacoes:
        avaliacoesPerfil,

      quantidadeAvaliacoes:
        quantidade,

      somaEstrelas:
        somaEstrelas,

      mediaEstrelas:
        mediaArredondada,

      pontos:
        novosPontos,

      ajudas:
        novasAjudas,

      verificado:
        verificado,

      seloVerificado:
        verificado,

      selo:
        verificado
          ? "Verificado pelo Pulsan"
          : null,
    };

    // =================================================
    // SALVAR NO BANCO LOCAL
    // =================================================

    if (
      indiceAjudante >=
      0
    ) {
      usuarios[
        indiceAjudante
      ] =
        ajudanteAtualizado;
    } else {
      usuarios.push(
        ajudanteAtualizado
      );
    }

    salvarUsuarios(
      usuarios
    );

    // =================================================
    // CASO O USUÁRIO ATUAL SEJA O AJUDANTE
    // =================================================

    if (
      String(
        ajudanteId
      ) ===
      String(
        usuarioId
      )
    ) {
      atualizarUsuarioLogado({
        avaliacoes:
          avaliacoesPerfil,

        quantidadeAvaliacoes:
          quantidade,

        somaEstrelas:
          somaEstrelas,

        mediaEstrelas:
          mediaArredondada,

        pontos:
          novosPontos,

        ajudas:
          novasAjudas,

        verificado:
          verificado,

        seloVerificado:
          verificado,

        selo:
          verificado
            ? "Verificado pelo Pulsan"
            : null,
      });
    }

    // =================================================
    // ATUALIZAR DADOS DA OUTRA PESSOA
    // =================================================

    localStorage.setItem(
      "pulsanMediaOutraPessoa",
      mediaArredondada.toFixed(
        2
      )
    );

    localStorage.setItem(
      "pulsanAvaliacoesOutraPessoa",
      String(
        quantidade
      )
    );

    localStorage.setItem(
      "pulsanSeloApoiadorOutraPessoa",
      String(
        verificado
      )
    );

    // =================================================
    // MARCAR CONVERSA COMO AVALIADA
    // =================================================

    localStorage.setItem(
      "pulsanAvaliacaoFeita-" +
        conversaId,
      "true"
    );

    // =================================================
    // ATUALIZAR CONVERSA
    // =================================================

    try {
      const conversas =
        JSON.parse(
          localStorage.getItem(
            "pulsanConversas"
          ) || "[]"
        );

      if (
        Array.isArray(
          conversas
        )
      ) {
        const atualizadas =
          conversas.map(
            (item) => {
              if (
                String(
                  item.id
                ) ===
                String(
                  conversaId
                )
              ) {
                return {
                  ...item,

                  status:
                    "finalizada",

                  avaliacaoFeita:
                    true,

                  avaliacao:
                    estrelas,

                  avaliadoEm:
                    new Date().toISOString(),
                };
              }

              return item;
            }
          );

        localStorage.setItem(
          "pulsanConversas",
          JSON.stringify(
            atualizadas
          )
        );
      }
    } catch {
      // não interromper
    }

    // =================================================
    // MOSTRAR RESULTADO
    // =================================================

    setEnviado(true);

    if (verificado) {
      setTimeout(() => {
        alert(
          "🎉 Parabéns!\n\n" +
          "Este apoiador atingiu " +
          "10 avaliações com média igual ou superior a 4,5 estrelas.\n\n" +
          "✓ Verificado pelo Pulsan!"
        );
      }, 200);
    }
  }

  // =====================================================
  // VOLTAR
  // =====================================================

  function voltar() {
    irPara(
      "solicitacoes"
    );
  }

  // =====================================================
  // TELA DE SUCESSO
  // =====================================================

  if (enviado) {
    return (
      <div
        style={{
          minHeight:
            "100vh",
          background:
            "var(--pulsan-fundo, #fffdf9)",
          display:
            "flex",
          alignItems:
            "center",
          justifyContent:
            "center",
          padding:
            "20px",
          boxSizing:
            "border-box",
        }}
      >
        <div
          style={{
            width:
              "100%",
            maxWidth:
              "500px",
            background:
              "var(--pulsan-card, #ffffff)",
            borderRadius:
              "28px",
            padding:
              "35px 25px",
            textAlign:
              "center",
            boxShadow:
              "0 8px 30px rgba(0,0,0,0.08)",
            border:
              "1px solid var(--pulsan-borda, #e5e5e5)",
          }}
        >

          <div
            style={{
              fontSize:
                "60px",
              marginBottom:
                "15px",
            }}
          >
            💚
          </div>

          <h1
            style={{
              margin:
                "0 0 10px",
              color:
                "var(--pulsan-texto, #173b38)",
              fontSize:
                "25px",
            }}
          >
            Avaliação enviada!
          </h1>

          <p
            style={{
              color:
                "#777",
              lineHeight:
                "1.6",
              marginBottom:
                "20px",
            }}
          >
            Obrigado por contribuir
            com uma rede de apoio
            mais acolhedora.
          </p>

          <div
            style={{
              background:
                "#f3faf7",
              borderRadius:
                "18px",
              padding:
                "15px",
              marginBottom:
                "20px",
            }}
          >
            <div
              style={{
                fontSize:
                  "28px",
                marginBottom:
                  "5px",
              }}
            >
              {"⭐".repeat(
                estrelas
              )}
            </div>

            <strong
              style={{
                color:
                  "#168f92",
              }}
            >
              {textoAvaliacao()}
            </strong>
          </div>

          <button
            type="button"
            onClick={
              voltar
            }
            style={{
              width:
                "100%",
              border:
                "none",
              borderRadius:
                "16px",
              padding:
                "13px",
              background:
                "#20adb0",
              color:
                "#ffffff",
              fontWeight:
                "700",
              cursor:
                "pointer",
              fontSize:
                "14px",
            }}
          >
            Voltar para Conversas
          </button>

        </div>
      </div>
    );
  }

  // =====================================================
  // TELA PRINCIPAL
  // =====================================================

  return (
    <div
      style={{
        minHeight:
          "100vh",
        background:
          "var(--pulsan-fundo, #fffdf9)",
        color:
          "var(--pulsan-texto, #173b38)",
        padding:
          "25px 15px 100px",
        boxSizing:
          "border-box",
        fontFamily:
          "Arial, Helvetica, sans-serif",
      }}
    >

      {/* ================================================
          VOLTAR
      ================================================= */}

      <div
        style={{
          maxWidth:
            "600px",
          margin:
            "0 auto 15px",
        }}
      >
        <button
          type="button"
          onClick={
            voltar
          }
          style={{
            border:
              "none",
            background:
              "transparent",
            fontSize:
              "25px",
            cursor:
              "pointer",
            color:
              "var(--pulsan-texto, #173b38)",
          }}
        >
          ←
        </button>
      </div>

      {/* ================================================
          CARD
      ================================================= */}

      <div
        style={{
          width:
            "100%",
          maxWidth:
            "600px",
          margin:
            "0 auto",
          background:
            "var(--pulsan-card, #ffffff)",
          borderRadius:
            "28px",
          padding:
            "30px 22px",
          boxSizing:
            "border-box",
          boxShadow:
            "0 8px 30px rgba(0,0,0,0.07)",
          border:
            "1px solid var(--pulsan-borda, #e5e5e5)",
          textAlign:
            "center",
        }}
      >

        {/* FOTO */}

        <div
          style={{
            width:
              "75px",
            height:
              "75px",
            borderRadius:
              "50%",
            background:
              "#e5f2ef",
            margin:
              "0 auto 12px",
            display:
              "flex",
            alignItems:
              "center",
            justifyContent:
              "center",
            overflow:
              "hidden",
            fontSize:
              "32px",
          }}
        >
          {ajudanteFoto ? (
            <img
              src={
                ajudanteFoto
              }
              alt=""
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
        </div>

        {/* NOME */}

        <h1
          style={{
            margin:
              "0 0 5px",
            fontSize:
              "23px",
          }}
        >
          Avalie {ajudanteNome}
        </h1>

        <p
          style={{
            color:
              "#777",
            fontSize:
              "14px",
            lineHeight:
              "1.5",
          }}
        >
          Como foi sua experiência
          com essa pessoa?
        </p>

        {/* =============================================
            ESTRELAS
        ============================================== */}

        <div
          style={{
            display:
              "flex",
            justifyContent:
              "center",
            gap:
              "5px",
            margin:
              "25px 0 10px",
          }}
        >
          {[1, 2, 3, 4, 5].map(
            (numero) => (
              <button
                key={
                  numero
                }
                type="button"
                onClick={() =>
                  setEstrelas(
                    numero
                  )
                }
                onMouseEnter={() =>
                  setHover(
                    numero
                  )
                }
                onMouseLeave={() =>
                  setHover(
                    0
                  )
                }
                aria-label={
                  numero +
                  " estrelas"
                }
                style={{
                  border:
                    "none",
                  background:
                    "transparent",
                  cursor:
                    "pointer",
                  fontSize:
                    "43px",
                  padding:
                    "2px",
                  transform:
                    numero ===
                      (hover ||
                        estrelas)
                      ? "scale(1.12)"
                      : "scale(1)",
                  transition:
                    "0.15s",
                  filter:
                    numero <=
                    (hover ||
                      estrelas)
                      ? "none"
                      : "grayscale(1)",
                  opacity:
                    numero <=
                    (hover ||
                      estrelas)
                      ? 1
                      : 0.35,
                }}
              >
                ⭐
              </button>
            )
          )}
        </div>

        {/* TEXTO */}

        <strong
          style={{
            display:
              "block",
            color:
              estrelas
                ? "#168f92"
                : "#999",
            marginBottom:
              "25px",
          }}
        >
          {textoAvaliacao()}
        </strong>

        {/* =============================================
            COMENTÁRIO
        ============================================== */}

        <textarea
          value={
            mensagem
          }
          onChange={(e) =>
            setMensagem(
              e.target.value
            )
          }
          placeholder="Quer deixar um comentário? (opcional)"
          maxLength={500}
          rows={4}
          style={{
            width:
              "100%",
            boxSizing:
              "border-box",
            resize:
              "vertical",
            border:
              "1px solid var(--pulsan-borda, #dfe7e4)",
            borderRadius:
              "17px",
            padding:
              "13px",
            outline:
              "none",
            background:
              "var(--pulsan-card-secundario, #f8faf9)",
            color:
              "var(--pulsan-texto, #173b38)",
            fontFamily:
              "Arial, Helvetica, sans-serif",
            fontSize:
              "14px",
            marginBottom:
              "5px",
          }}
        />

        <div
          style={{
            textAlign:
              "right",
            fontSize:
              "10px",
            color:
              "#aaa",
            marginBottom:
              "20px",
          }}
        >
          {mensagem.length}/500
        </div>

        {/* =============================================
            BOTÃO
        ============================================== */}

        <button
          type="button"
          onClick={
            enviarAvaliacao
          }
          disabled={
            estrelas === 0
          }
          style={{
            width:
              "100%",
            border:
              "none",
            borderRadius:
              "17px",
            padding:
              "14px",
            background:
              estrelas > 0
                ? "#20adb0"
                : "#d9e6e4",
            color:
              "#ffffff",
            fontWeight:
              "700",
            fontSize:
              "15px",
            cursor:
              estrelas > 0
                ? "pointer"
                : "not-allowed",
            boxShadow:
              estrelas > 0
                ? "0 6px 18px rgba(32,173,176,0.25)"
                : "none",
          }}
        >
          ⭐ Enviar avaliação
        </button>

      </div>

      {/* ================================================
          INFORMAÇÃO
      ================================================= */}

      <div
        style={{
          maxWidth:
            "600px",
          margin:
            "15px auto 0",
          background:
            "var(--pulsan-card, #ffffff)",
          borderRadius:
            "18px",
          padding:
            "15px",
          border:
            "1px solid var(--pulsan-borda, #e5e5e5)",
          fontSize:
            "12px",
          lineHeight:
            "1.5",
          color:
            "#777",
          textAlign:
            "center",
          boxSizing:
            "border-box",
        }}
      >
        💚 Sua avaliação ajuda o Pulsan
        a reconhecer quem contribui
        para a rede de apoio.
      </div>

    </div>
  );
}

export default Avaliacao;