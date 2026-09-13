import React, { useEffect, useRef, useState } from "react";

function Ajudar({ irPara }) {
  // =========================================================
  // SENTIMENTOS
  // =========================================================

  const sentimentos = [
    {
      id: "triste",
      emoji: "😔",
      nome: "Triste",
      descricao: "Talvez eu precise de acolhimento",
    },
    {
      id: "ansioso",
      emoji: "😰",
      nome: "Preocupado",
      descricao: "Minha mente não para",
    },
    {
      id: "cansado",
      emoji: "😴",
      nome: "Cansado",
      descricao: "Preciso desacelerar",
    },
    {
      id: "pensativo",
      emoji: "🤔",
      nome: "Pensativo",
      descricao: "Estou pensando muito",
    },
    {
      id: "sozinho",
      emoji: "🥺",
      nome: "Sozinho",
      descricao: "Queria me sentir compreendido",
    },
    {
      id: "irritado",
      emoji: "😡",
      nome: "Irritado",
      descricao: "Algo está me incomodando",
    },
    {
      id: "confuso",
      emoji: "😶",
      nome: "Confuso",
      descricao: "Não sei exatamente o que sinto",
    },
    {
      id: "recomecando",
      emoji: "🌱",
      nome: "Recomeçando",
      descricao: "Estou vivendo uma mudança",
    },
    {
      id: "motivado",
      emoji: "✨",
      nome: "Motivado",
      descricao: "Quero aproveitar esse momento",
    },
    {
      id: "bem",
      emoji: "💚",
      nome: "Estou bem",
      descricao: "Quero aproveitar o momento",
    },
    {
      id: "paz",
      emoji: "😌",
      nome: "Em paz",
      descricao: "Quero permanecer nesse estado",
    },
    {
      id: "grato",
      emoji: "❤️",
      nome: "Grato",
      descricao: "Estou percebendo coisas boas",
    },
  ];

  // =========================================================
  // SONS
  // =========================================================
  // Os arquivos precisam estar dentro de:
  //
  // public/sons/
  //
  // Exemplo:
  // public/sons/chuva.mp3
  // =========================================================

  const sons = [
    {
      id: "chuva",
      emoji: "🌧️",
      nome: "Chuva",
      finalidade: "Para relaxar",
      descricao: "Um som contínuo para acompanhar uma pausa.",
      arquivo: "/sons/chuva.mp3",
      categorias: [
        "triste",
        "ansioso",
        "cansado",
        "sozinho",
        "irritado",
        "confuso",
        "paz",
      ],
    },

    {
      id: "chuva-janela",
      emoji: "🌧️",
      nome: "Chuva na janela",
      finalidade: "Para desacelerar",
      descricao: "Chuva suave para momentos mais tranquilos.",
      arquivo: "/sons/chuva-janela.mp3",
      categorias: [
        "triste",
        "ansioso",
        "sozinho",
        "cansado",
        "paz",
      ],
    },

    {
      id: "ondas",
      emoji: "🌊",
      nome: "Ondas do mar",
      finalidade: "Para acalmar",
      descricao: "O movimento das ondas acompanhando sua pausa.",
      arquivo: "/sons/ondas.mp3",
      categorias: [
        "ansioso",
        "irritado",
        "triste",
        "paz",
        "grato",
        "bem",
      ],
    },

    {
      id: "mar-noite",
      emoji: "🌊",
      nome: "Mar à noite",
      finalidade: "Para descansar",
      descricao: "Ondas suaves para um momento mais silencioso.",
      arquivo: "/sons/mar-noite.mp3",
      categorias: [
        "cansado",
        "sozinho",
        "paz",
        "pensativo",
      ],
    },

    {
      id: "floresta",
      emoji: "🌲",
      nome: "Floresta",
      finalidade: "Para desacelerar",
      descricao: "Sons naturais para afastar um pouco o excesso de pensamentos.",
      arquivo: "/sons/floresta.mp3",
      categorias: [
        "ansioso",
        "irritado",
        "confuso",
        "recomecando",
        "paz",
        "pensativo",
      ],
    },

    {
      id: "passaros",
      emoji: "🐦",
      nome: "Pássaros",
      finalidade: "Para renovar o momento",
      descricao: "Sons da natureza para acompanhar novos começos.",
      arquivo: "/sons/passarinhos.mp3",
      categorias: [
        "bem",
        "motivado",
        "grato",
        "recomecando",
      ],
    },

    {
      id: "agua",
      emoji: "💧",
      nome: "Água corrente",
      finalidade: "Para relaxar",
      descricao: "Água corrente para acompanhar uma pausa.",
      arquivo: "/sons/agua.mp3",
      categorias: [
        "ansioso",
        "irritado",
        "cansado",
        "paz",
        "confuso",
      ],
    },

    {
      id: "vento",
      emoji: "🌬️",
      nome: "Vento nas árvores",
      finalidade: "Para desacelerar",
      descricao: "Um ambiente natural para deixar os pensamentos respirarem.",
      arquivo: "/sons/vento.mp3",
      categorias: [
        "ansioso",
        "pensativo",
        "irritado",
        "paz",
        "recomecando",
      ],
    },

    {
      id: "cachoeira",
      emoji: "🏞️",
      nome: "Cachoeira",
      finalidade: "Para renovar a mente",
      descricao: "O som contínuo da água acompanhando seu momento.",
      arquivo: "/sons/cachoeira.mp3",
      categorias: [
        "cansado",
        "confuso",
        "recomecando",
        "motivado",
        "bem",
      ],
    },

    {
      id: "fogueira",
      emoji: "🔥",
      nome: "Fogueira",
      finalidade: "Para criar um ambiente tranquilo",
      descricao: "Um som aconchegante para momentos de introspecção.",
      arquivo: "/sons/fogueira.mp3",
      categorias: [
        "triste",
        "sozinho",
        "cansado",
        "paz",
        "pensativo",
      ],
    },

    {
      id: "piano",
      emoji: "🎹",
      nome: "Piano suave",
      finalidade: "Para refletir",
      descricao: "Instrumental suave para acompanhar pensamentos.",
      arquivo: "/sons/piano.mp3",
      categorias: [
        "triste",
        "pensativo",
        "sozinho",
        "paz",
        "grato",
      ],
    },

    {
      id: "piano-noite",
      emoji: "🎹",
      nome: "Piano noturno",
      finalidade: "Para desacelerar",
      descricao: "Piano suave para um momento mais silencioso.",
      arquivo: "/sons/piano-noite.mp3",
      categorias: [
        "cansado",
        "paz",
        "sozinho",
      ],
    },

    {
      id: "violao",
      emoji: "🎸",
      nome: "Violão acústico",
      finalidade: "Para acolher",
      descricao: "Um som leve para acompanhar momentos mais sensíveis.",
      arquivo: "/sons/violao.mp3",
      categorias: [
        "triste",
        "sozinho",
        "bem",
        "grato",
      ],
    },

    {
      id: "flauta",
      emoji: "🪈",
      nome: "Flauta suave",
      finalidade: "Para desacelerar",
      descricao: "Instrumental leve para acompanhar uma pausa.",
      arquivo: "/sons/flauta.mp3",
      categorias: [
        "ansioso",
        "paz",
        "pensativo",
        "cansado",
      ],
    },

    {
      id: "instrumental",
      emoji: "🎻",
      nome: "Instrumental calmo",
      finalidade: "Para pensar",
      descricao: "Música instrumental para acompanhar uma reflexão.",
      arquivo: "/sons/instrumental.mp3",
      categorias: [
        "pensativo",
        "confuso",
        "motivado",
        "recomecando",
      ],
    },
  ];

  // =========================================================
  // FLASH CARDS REFLEXIVOS
  // =========================================================

  const flashCards = [
    {
      sentimento: "triste",
      emoji: "💙",
      titulo: "Talvez você não precise esconder isso",
      texto:
        "Às vezes, tentar parecer bem o tempo inteiro acaba sendo mais cansativo do que admitir que alguma coisa está doendo.",
    },

    {
      sentimento: "triste",
      emoji: "🌧️",
      titulo: "Nem todo dia precisa ser bom",
      texto:
        "Existem dias em que simplesmente continuar já é uma forma de coragem.",
    },

    {
      sentimento: "triste",
      emoji: "🪞",
      titulo: "Você está triste ou está cansado de fingir que está bem?",
      texto:
        "Nem sempre aquilo que sentimos é exatamente aquilo que conseguimos explicar.",
    },

    {
      sentimento: "ansioso",
      emoji: "🌿",
      titulo: "Você não precisa resolver tudo agora",
      texto:
        "Talvez parte da sua ansiedade venha da tentativa de viver hoje problemas que ainda pertencem ao amanhã.",
    },

    {
      sentimento: "ansioso",
      emoji: "💭",
      titulo: "Sua mente está tentando proteger você?",
      texto:
        "Pensar em todas as possibilidades pode parecer uma forma de se preparar. Mas será que você está se preparando ou apenas se cansando antes da hora?",
    },

    {
      sentimento: "ansioso",
      emoji: "🕊️",
      titulo: "E se você simplesmente parasse?",
      texto:
        "Nem toda pausa é perda de tempo. Às vezes, parar é justamente o que permite continuar.",
    },

    {
      sentimento: "cansado",
      emoji: "😴",
      titulo: "Talvez não seja preguiça",
      texto:
        "Às vezes, o que você chama de preguiça é apenas cansaço que você ainda não se permitiu reconhecer.",
    },

    {
      sentimento: "cansado",
      emoji: "🌙",
      titulo: "Você precisa produzir para ter valor?",
      texto:
        "Descansar não diminui aquilo que você é. Você continua sendo você mesmo quando não está produzindo.",
    },

    {
      sentimento: "cansado",
      emoji: "🌱",
      titulo: "Talvez seu corpo esteja pedindo uma pausa",
      texto:
        "Nem sempre precisamos de mais disciplina. Às vezes precisamos de descanso suficiente para conseguir continuar.",
    },

    {
      sentimento: "pensativo",
      emoji: "🪞",
      titulo: "Olhe novamente",
      texto:
        "Você está enxergando a situação como ela realmente é ou como seus pensamentos estão permitindo que você a enxergue?",
    },

    {
      sentimento: "pensativo",
      emoji: "💭",
      titulo: "Nem todo pensamento é uma verdade",
      texto:
        "Pensar alguma coisa sobre você não significa que aquilo define quem você é.",
    },

    {
      sentimento: "pensativo",
      emoji: "🧠",
      titulo: "O que existe por trás desse pensamento?",
      texto:
        "Às vezes, aquilo que ocupa nossa cabeça é apenas a superfície de algo que ainda não conseguimos nomear.",
    },

    {
      sentimento: "sozinho",
      emoji: "🫂",
      titulo: "Você está sozinho ou está se sentindo sozinho?",
      texto:
        "Existe uma diferença entre estar sem pessoas por perto e sentir que ninguém realmente consegue enxergar aquilo que acontece dentro de você.",
    },

    {
      sentimento: "sozinho",
      emoji: "💙",
      titulo: "Você não precisa carregar tudo sozinho",
      texto:
        "Pedir para ser ouvido não é fraqueza. Às vezes, é apenas reconhecer que você também merece cuidado.",
    },

    {
      sentimento: "sozinho",
      emoji: "🌱",
      titulo: "Uma conexão pode começar pequena",
      texto:
        "Talvez você não precise encontrar muitas pessoas. Talvez uma conversa verdadeira já seja um começo.",
    },

    {
      sentimento: "irritado",
      emoji: "🔥",
      titulo: "O que existe por trás da raiva?",
      texto:
        "Às vezes, a raiva aparece primeiro, mas por trás dela existe frustração, medo, tristeza ou sensação de injustiça.",
    },

    {
      sentimento: "irritado",
      emoji: "🌿",
      titulo: "Responder ou reagir?",
      texto:
        "Existe uma pequena diferença entre aquilo que sentimos imediatamente e aquilo que escolhemos fazer depois.",
    },

    {
      sentimento: "irritado",
      emoji: "🪞",
      titulo: "O que realmente te incomodou?",
      texto:
        "Talvez aquilo que provocou sua irritação não seja exatamente aquilo que está machucando você.",
    },

    {
      sentimento: "confuso",
      emoji: "🌀",
      titulo: "Você não precisa entender tudo hoje",
      texto:
        "Algumas respostas aparecem somente depois que deixamos de tentar encontrá-las à força.",
    },

    {
      sentimento: "confuso",
      emoji: "🪞",
      titulo: "Talvez a dúvida também esteja dizendo alguma coisa",
      texto:
        "Nem sempre estar confuso significa estar perdido. Às vezes significa que alguma coisa dentro de você está mudando.",
    },

    {
      sentimento: "confuso",
      emoji: "🌱",
      titulo: "Comece pelo que você sabe",
      texto:
        "Quando tudo parece confuso, talvez seja suficiente encontrar uma única coisa que ainda faça sentido.",
    },

    {
      sentimento: "recomecando",
      emoji: "🦋",
      titulo: "Recomeçar não apaga o que aconteceu",
      texto:
        "Você não precisa esquecer sua história para construir uma nova parte dela.",
    },

    {
      sentimento: "recomecando",
      emoji: "🌱",
      titulo: "Talvez você esteja mudando",
      texto:
        "Algumas versões nossas precisam ficar para trás para que outras possam existir.",
    },

    {
      sentimento: "recomecando",
      emoji: "🚪",
      titulo: "Você está com medo de começar ou de deixar para trás?",
      texto:
        "Às vezes, o que mais dificulta um novo caminho não é o desconhecido, mas aquilo que ainda não conseguimos soltar.",
    },

    {
      sentimento: "motivado",
      emoji: "✨",
      titulo: "Não transforme motivação em cobrança",
      texto:
        "Você pode querer crescer sem precisar transformar cada dia em uma corrida contra si mesmo.",
    },

    {
      sentimento: "motivado",
      emoji: "🌱",
      titulo: "Pequenos passos também mudam caminhos",
      texto:
        "Nem toda transformação começa com uma grande decisão. Algumas começam com uma pequena escolha repetida.",
    },

    {
      sentimento: "motivado",
      emoji: "🦋",
      titulo: "Você está crescendo ou apenas tentando provar alguma coisa?",
      texto:
        "Existe uma diferença entre fazer algo porque deseja e fazer algo para provar que é capaz.",
    },

    {
      sentimento: "bem",
      emoji: "💚",
      titulo: "Você percebeu que está bem?",
      texto:
        "Às vezes estamos tão acostumados a procurar problemas que esquecemos de reconhecer quando alguma coisa simplesmente está boa.",
    },

    {
      sentimento: "bem",
      emoji: "🌻",
      titulo: "Guarde este momento",
      texto:
        "Você não precisa esperar um momento difícil para perceber o valor de um momento tranquilo.",
    },

    {
      sentimento: "bem",
      emoji: "✨",
      titulo: "O que tornou este momento diferente?",
      texto:
        "Talvez perceber o que faz bem também seja uma maneira de aprender a cuidar de si.",
    },

    {
      sentimento: "paz",
      emoji: "🌿",
      titulo: "Não tenha pressa para sair daqui",
      texto:
        "Alguns momentos não precisam servir para alguma coisa. Eles podem simplesmente existir.",
    },

    {
      sentimento: "paz",
      emoji: "🌊",
      titulo: "A calma também merece espaço",
      texto:
        "Talvez você não precise procurar uma solução. Talvez possa apenas permanecer alguns minutos em paz.",
    },

    {
      sentimento: "paz",
      emoji: "🕊️",
      titulo: "Permita-se não fazer nada por alguns minutos",
      texto:
        "Nem todo silêncio precisa ser preenchido. Algumas pausas também são importantes.",
    },

    {
      sentimento: "grato",
      emoji: "❤️",
      titulo: "Nem tudo precisa ser extraordinário",
      texto:
        "Às vezes, aquilo que merece nossa gratidão está escondido justamente nas coisas que parecem pequenas.",
    },

    {
      sentimento: "grato",
      emoji: "🌻",
      titulo: "Perceba o que já existe",
      texto:
        "Enquanto procuramos aquilo que falta, podemos deixar de perceber aquilo que já está fazendo parte da nossa vida.",
    },

    {
      sentimento: "grato",
      emoji: "✨",
      titulo: "O que você quase não percebeu hoje?",
      texto:
        "Talvez exista algo bom acontecendo ao seu redor que mereça alguns segundos da sua atenção.",
    },
  ];

  // =========================================================
  // PENSAMENTOS FILOSÓFICOS
  // =========================================================

  const pensamentosFilosoficos = [
    {
      autor: "Sócrates",
      texto:
        "Uma vida que não é examinada não merece ser vivida.",
    },

    {
      autor: "Aristóteles",
      texto:
        "A felicidade depende de nós mesmos.",
    },

    {
      autor: "Epicteto",
      texto:
        "Não são as coisas que perturbam as pessoas, mas os julgamentos que fazem sobre elas.",
    },

    {
      autor: "Sêneca",
      texto:
        "Não é que tenhamos pouco tempo, mas que perdemos muito dele.",
    },

    {
      autor: "Marco Aurélio",
      texto:
        "Você tem poder sobre sua mente, não sobre os acontecimentos externos.",
    },

    {
      autor: "Epicuro",
      texto:
        "Não estrague aquilo que você tem desejando aquilo que você não tem.",
    },
  ];

  // =========================================================
  // CONTEÚDOS DE VÍDEO
  // =========================================================
  //
  // Os links abaixo podem ser trocados depois pelos vídeos
  // escolhidos pelo projeto Pulsan.
  //
  // Se preferir vídeos locais, podemos adaptar para:
  // /videos/nome-do-video.mp4
  // =========================================================

  const videos = [
    {
      id: 1,
      titulo: "Quando a mente não consegue parar",
      descricao:
        "Uma reflexão sobre pensamentos, preocupação e a necessidade de desacelerar.",
      categorias: ["ansioso", "pensativo", "confuso"],
      url: "https://www.youtube.com/results?search_query=reflexao+quando+a+mente+nao+para",
      emoji: "🎬",
    },

    {
      id: 2,
      titulo: "Talvez você esteja apenas cansado",
      descricao:
        "Uma reflexão sobre descanso, cobrança e a diferença entre preguiça e cansaço.",
      categorias: ["cansado", "ansioso", "motivado"],
      url: "https://www.youtube.com/results?search_query=reflexao+cansaco+autocobranca",
      emoji: "🎬",
    },

    {
      id: 3,
      titulo: "Aprender a recomeçar",
      descricao:
        "Uma reflexão sobre mudanças, ciclos e novos caminhos.",
      categorias: ["recomecando", "triste", "confuso"],
      url: "https://www.youtube.com/results?search_query=reflexao+recomecar+na+vida",
      emoji: "🦋",
    },

    {
      id: 4,
      titulo: "Sobre comparação",
      descricao:
        "Uma reflexão sobre comparar seu caminho com o caminho de outras pessoas.",
      categorias: ["triste", "pensativo", "ansioso", "motivado"],
      url: "https://www.youtube.com/results?search_query=reflexao+comparacao+com+outras+pessoas",
      emoji: "🪞",
    },

    {
      id: 5,
      titulo: "O valor de parar",
      descricao:
        "Uma reflexão sobre descanso, silêncio e presença.",
      categorias: ["cansado", "paz", "ansioso"],
      url: "https://www.youtube.com/results?search_query=reflexao+importancia+de+parar+e+descansar",
      emoji: "🌿",
    },

    {
      id: 6,
      titulo: "Você realmente está atrasado?",
      descricao:
        "Uma reflexão sobre tempo, comparação e expectativas.",
      categorias: ["recomecando", "motivado", "ansioso", "confuso"],
      url: "https://www.youtube.com/results?search_query=reflexao+voce+esta+atrasado+na+vida",
      emoji: "⏳",
    },
  ];

  // =========================================================
  // ESTADOS
  // =========================================================

  const [sentimentoSelecionado, setSentimentoSelecionado] =
    useState("");

  const [cardAtual, setCardAtual] = useState(0);

  const [momentoIniciado, setMomentoIniciado] =
    useState(false);

  const [momentoFinalizado, setMomentoFinalizado] =
    useState(false);

  const [somSelecionado, setSomSelecionado] =
    useState(null);

  const [tocando, setTocando] =
    useState(false);

  const [volume, setVolume] =
    useState(0.8);

  const [erroAudio, setErroAudio] =
    useState("");

  const [mensagemExtra, setMensagemExtra] =
    useState(null);

  const audioRef = useRef(null);

  // =========================================================
  // SENTIMENTO ATUAL
  // =========================================================

  const sentimentoAtual = sentimentos.find(
    (item) =>
      item.id === sentimentoSelecionado
  );

  // =========================================================
  // CARDS DO MOMENTO
  // =========================================================

  const cardsDoMomento = sentimentoSelecionado
    ? flashCards.filter(
        (card) =>
          card.sentimento === sentimentoSelecionado
      )
    : [];

  // =========================================================
  // SONS RELACIONADOS
  // =========================================================

  const sonsRelacionados = sentimentoSelecionado
    ? sons.filter((som) =>
        som.categorias.includes(
          sentimentoSelecionado
        )
      )
    : sons.slice(0, 8);

  // =========================================================
  // VÍDEOS RELACIONADOS
  // =========================================================

  const videosRelacionados = sentimentoSelecionado
    ? videos.filter((video) =>
        video.categorias.includes(
          sentimentoSelecionado
        )
      )
    : videos;

  // =========================================================
  // ESCOLHER SENTIMENTO
  // =========================================================

  function escolherSentimento(id) {
    pararAudio();

    setSentimentoSelecionado(id);
    setCardAtual(0);
    setMomentoIniciado(false);
    setMomentoFinalizado(false);
    setMensagemExtra(null);

    setTimeout(() => {
      const elemento =
        document.getElementById(
          "momento-pulsan"
        );

      if (elemento) {
        elemento.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 150);
  }

  // =========================================================
  // INICIAR MOMENTO
  // =========================================================

  function iniciarMomento() {
    setMomentoIniciado(true);
    setCardAtual(0);
    setMomentoFinalizado(false);

    setTimeout(() => {
      const elemento =
        document.getElementById(
          "flash-card-atual"
        );

      if (elemento) {
        elemento.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }, 100);
  }

  // =========================================================
  // PRÓXIMO CARD
  // =========================================================

  function proximoCard() {
    if (
      cardAtual <
      cardsDoMomento.length - 1
    ) {
      setCardAtual(
        (anterior) =>
          anterior + 1
      );

      setTimeout(() => {
        const elemento =
          document.getElementById(
            "flash-card-atual"
          );

        if (elemento) {
          elemento.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }, 100);
    } else {
      setMomentoFinalizado(true);

      setTimeout(() => {
        const elemento =
          document.getElementById(
            "conteudos-reflexivos"
          );

        if (elemento) {
          elemento.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 150);
    }
  }

  // =========================================================
  // VOLTAR CARD
  // =========================================================

  function voltarCard() {
    if (cardAtual > 0) {
      setCardAtual(
        (anterior) =>
          anterior - 1
      );
    }
  }

  // =========================================================
  // NOVA REFLEXÃO
  // =========================================================

  function novaReflexao() {
    if (!cardsDoMomento.length) {
      return;
    }

    const indiceAleatorio =
      Math.floor(
        Math.random() *
          cardsDoMomento.length
      );

    setCardAtual(indiceAleatorio);
    setMomentoIniciado(true);
    setMomentoFinalizado(false);
  }

  // =========================================================
  // ESCOLHER SOM
  // =========================================================

  function escolherSom(som) {
    setErroAudio("");

    if (
      somSelecionado?.id ===
      som.id
    ) {
      alternarAudio();
      return;
    }

    pararAudio();

    const novoAudio =
      new Audio(som.arquivo);

    novoAudio.loop = true;
    novoAudio.volume = volume;

    novoAudio.onplay = () => {
      setTocando(true);
      setErroAudio("");
    };

    novoAudio.onpause = () => {
      setTocando(false);
    };

    novoAudio.onended = () => {
      setTocando(false);
    };

    novoAudio.onerror = () => {
      setTocando(false);

      setErroAudio(
        `Não foi possível encontrar o áudio "${som.nome}".`
      );
    };

    audioRef.current = novoAudio;

    setSomSelecionado(som);

    novoAudio
      .play()
      .catch(() => {
        setTocando(false);

        setErroAudio(
          `Não foi possível reproduzir "${som.nome}". Confirme se o arquivo está em public/sons/${som.id}.mp3.`
        );
      });
  }

  // =========================================================
  // PLAY / PAUSE
  // =========================================================

  function alternarAudio() {
    if (!audioRef.current) {
      if (somSelecionado) {
        escolherSom(somSelecionado);
      }

      return;
    }

    if (tocando) {
      audioRef.current.pause();
    } else {
      audioRef.current
        .play()
        .catch(() => {
          setErroAudio(
            "Não foi possível iniciar o áudio."
          );
        });
    }
  }

  // =========================================================
  // PARAR ÁUDIO
  // =========================================================

  function pararAudio() {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    setTocando(false);
    setSomSelecionado(null);
  }

  // =========================================================
  // VOLUME
  // =========================================================

  function alterarVolume(event) {
    const novoVolume =
      Number(event.target.value);

    setVolume(novoVolume);

    if (audioRef.current) {
      audioRef.current.volume =
        novoVolume;
    }
  }

  // =========================================================
  // REFLEXÃO EXTRA
  // =========================================================

  function mostrarPensamento() {
    const indice =
      Math.floor(
        Math.random() *
          pensamentosFilosoficos.length
      );

    setMensagemExtra(
      pensamentosFilosoficos[indice]
    );
  }

  // =========================================================
  // LIMPAR ÁUDIO AO SAIR
  // =========================================================

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // =========================================================
  // ESTILOS
  // =========================================================

  const cardStyle = {
    background:
      "var(--pulsan-card, #ffffff)",
    border:
      "1px solid var(--pulsan-borda, #e5e5e5)",
    borderRadius: "24px",
    boxShadow:
      "0 8px 25px rgba(0,0,0,0.05)",
  };

  // =========================================================
  // RETORNO
  // =========================================================

  return (
    <>
      <style>
        {`

        * {
          box-sizing: border-box;
        }

        .reflexao-page {
          min-height: 100vh;
          width: 100%;
          background:
            var(--pulsan-fundo, #f7fafb);
          color:
            var(--pulsan-texto, #173b38);
          font-family:
            Arial, Helvetica, sans-serif;
          padding-bottom: 110px;
          overflow-x: hidden;
        }

        .reflexao-container {
          width: 100%;
          max-width: 1050px;
          margin: 0 auto;
          padding: 30px 24px 50px;
        }

        /* =========================================
           CABEÇALHO
        ========================================= */

        .reflexao-topo {
          text-align: center;
          margin-bottom: 30px;
        }

        .reflexao-mini {
          display: inline-block;
          color:
            var(--pulsan-primaria, #20adb0);
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 3px;
          margin-bottom: 12px;
        }

        .reflexao-topo h1 {
          margin: 0;
          font-size: 40px;
          line-height: 1.15;
        }

        .reflexao-topo p {
          max-width: 700px;
          margin: 14px auto 0;
          color:
            var(--pulsan-texto-secundario, #777);
          font-size: 16px;
          line-height: 1.6;
        }

        /* =========================================
           SENTIMENTOS
        ========================================= */

        .sentimentos-card {
          padding: 24px;
          margin-bottom: 30px;
        }

        .sentimentos-card h2 {
          margin: 0 0 7px;
          font-size: 23px;
        }

        .sentimentos-card > p {
          margin: 0 0 18px;
          color:
            var(--pulsan-texto-secundario, #777);
          font-size: 14px;
        }

        .sentimentos-grid {
          display: grid;
          grid-template-columns:
            repeat(4, minmax(0, 1fr));
          gap: 11px;
        }

        .sentimento-button {
          border:
            1px solid
            var(--pulsan-borda, #e5e5e5);
          background:
            var(--pulsan-card, #ffffff);
          color:
            var(--pulsan-texto, #173b38);
          border-radius: 18px;
          padding: 15px 9px;
          min-height: 100px;
          cursor: pointer;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border 0.2s ease;
        }

        .sentimento-button:hover {
          transform: translateY(-2px);
          box-shadow:
            0 8px 20px rgba(0,0,0,0.06);
        }

        .sentimento-button.ativo {
          background:
            var(--pulsan-primaria, #20adb0);
          color: #ffffff;
          border-color:
            var(--pulsan-primaria, #20adb0);
        }

        .sentimento-emoji {
          display: block;
          font-size: 28px;
          margin-bottom: 7px;
        }

        .sentimento-nome {
          display: block;
          font-size: 13px;
          font-weight: 800;
        }

        .sentimento-descricao {
          display: block;
          margin-top: 4px;
          font-size: 10px;
          opacity: 0.75;
          line-height: 1.3;
        }

        /* =========================================
           MOMENTO PULSAN
        ========================================= */

        .momento-pulsan {
          scroll-margin-top: 20px;
          margin-top: 20px;
        }

        .momento-introducao {
          padding: 38px 30px;
          text-align: center;
          background:
            linear-gradient(
              145deg,
              #ffffff,
              #f0faf9
            );
        }

        .momento-selo {
          display: inline-block;
          color:
            var(--pulsan-primaria, #20adb0);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 3px;
          margin-bottom: 18px;
        }

        .momento-introducao h2 {
          margin: 0;
          font-size: 34px;
          line-height: 1.2;
        }

        .momento-introducao h3 {
          margin: 12px 0;
          font-size: 21px;
        }

        .momento-introducao p {
          max-width: 650px;
          margin: 0 auto;
          color:
            var(--pulsan-texto-secundario, #777);
          font-size: 16px;
          line-height: 1.7;
        }

        .momento-botao {
          margin-top: 25px;
          border: none;
          background:
            var(--pulsan-primaria, #20adb0);
          color: #ffffff;
          border-radius: 14px;
          padding: 14px 28px;
          min-height: 48px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
        }

        .momento-botao:hover {
          transform: translateY(-1px);
        }

        /* =========================================
           FLASH CARD
        ========================================= */

        .flash-area {
          margin-top: 25px;
          scroll-margin-top: 20px;
        }

        .flash-card {
          min-height: 420px;
          padding: 45px 35px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          background:
            linear-gradient(
              145deg,
              #ffffff,
              #f8fcfb
            );
          position: relative;
          overflow: hidden;
        }

        .flash-card::before {
          content: "";
          position: absolute;
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background:
            rgba(32,173,176,0.07);
          top: -70px;
          right: -60px;
        }

        .flash-card::after {
          content: "";
          position: absolute;
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background:
            rgba(32,173,176,0.05);
          bottom: -60px;
          left: -50px;
        }

        .flash-numero {
          position: relative;
          z-index: 1;
          color:
            var(--pulsan-primaria, #20adb0);
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 2px;
          margin-bottom: 25px;
        }

        .flash-emoji {
          position: relative;
          z-index: 1;
          font-size: 48px;
          margin-bottom: 20px;
        }

        .flash-titulo {
          position: relative;
          z-index: 1;
          max-width: 760px;
          margin: 0;
          font-size: 29px;
          line-height: 1.3;
        }

        .flash-texto {
          position: relative;
          z-index: 1;
          max-width: 720px;
          margin: 20px auto 0;
          color:
            var(--pulsan-texto-secundario, #666);
          font-size: 18px;
          line-height: 1.75;
        }

        .flash-controles {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 600px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 32px;
        }

        .flash-secundario {
          border:
            1px solid
            var(--pulsan-borda, #dce5e3);
          background: #ffffff;
          color:
            var(--pulsan-texto, #173b38);
          border-radius: 12px;
          padding: 12px 18px;
          cursor: pointer;
          font-weight: 700;
        }

        .flash-principal {
          border: none;
          background:
            var(--pulsan-primaria, #20adb0);
          color: #ffffff;
          border-radius: 12px;
          padding: 13px 25px;
          cursor: pointer;
          font-weight: 800;
        }

        .progresso {
          width: 100%;
          max-width: 600px;
          height: 5px;
          border-radius: 10px;
          background: #e7eeee;
          overflow: hidden;
          margin: 25px auto 0;
        }

        .progresso-barra {
          height: 100%;
          background:
            var(--pulsan-primaria, #20adb0);
          transition: width 0.3s ease;
        }

        /* =========================================
           CONTEÚDOS APÓS OS CARDS
        ========================================= */

        .conteudos-reflexivos {
          scroll-margin-top: 20px;
          margin-top: 30px;
        }

        .conteudo-intro {
          text-align: center;
          margin-bottom: 20px;
        }

        .conteudo-intro h2 {
          margin: 0;
          font-size: 28px;
        }

        .conteudo-intro p {
          max-width: 650px;
          margin: 10px auto 0;
          color:
            var(--pulsan-texto-secundario, #777);
          line-height: 1.6;
          font-size: 14px;
        }

        .conteudo-opcoes {
          display: grid;
          grid-template-columns:
            repeat(3, minmax(0, 1fr));
          gap: 15px;
        }

        .conteudo-opcao {
          padding: 23px;
          cursor: pointer;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .conteudo-opcao:hover {
          transform: translateY(-3px);
          box-shadow:
            0 12px 30px rgba(0,0,0,0.07);
        }

        .conteudo-opcao-emoji {
          font-size: 34px;
          margin-bottom: 12px;
        }

        .conteudo-opcao h3 {
          margin: 0 0 8px;
          font-size: 18px;
        }

        .conteudo-opcao p {
          margin: 0;
          color:
            var(--pulsan-texto-secundario, #777);
          line-height: 1.5;
          font-size: 13px;
        }

        /* =========================================
           VÍDEOS
        ========================================= */

        .videos-area {
          margin-top: 30px;
        }

        .videos-grid {
          display: grid;
          grid-template-columns:
            repeat(2, minmax(0, 1fr));
          gap: 15px;
        }

        .video-card {
          padding: 22px;
        }

        .video-card-topo {
          display: flex;
          align-items: flex-start;
          gap: 14px;
        }

        .video-icone {
          width: 52px;
          height: 52px;
          flex: 0 0 52px;
          border-radius: 15px;
          background:
            #eef8f8;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 25px;
        }

        .video-card h3 {
          margin: 0 0 7px;
          font-size: 17px;
        }

        .video-card p {
          margin: 0;
          color:
            var(--pulsan-texto-secundario, #777);
          font-size: 13px;
          line-height: 1.5;
        }

        .video-button {
          display: inline-block;
          margin-top: 17px;
          text-decoration: none;
          border: none;
          background:
            var(--pulsan-primaria, #20adb0);
          color: #ffffff;
          border-radius: 11px;
          padding: 10px 15px;
          font-size: 12px;
          font-weight: 800;
        }

        /* =========================================
           PENSAMENTO FILOSÓFICO
        ========================================= */

        .filosofia-area {
          margin-top: 30px;
          padding: 30px;
          text-align: center;
          background:
            linear-gradient(
              145deg,
              #ffffff,
              #f5f2ff
            );
        }

        .filosofia-selo {
          color:
            var(--pulsan-primaria, #20adb0);
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 2px;
        }

        .filosofia-texto {
          max-width: 760px;
          margin: 20px auto 0;
          font-size: 21px;
          line-height: 1.7;
          font-style: italic;
        }

        .filosofia-autor {
          margin-top: 15px;
          color:
            var(--pulsan-texto-secundario, #777);
          font-size: 13px;
          font-weight: 700;
        }

        .filosofia-button {
          margin-top: 20px;
          border:
            1px solid
            var(--pulsan-borda, #ddd);
          background: #ffffff;
          color:
            var(--pulsan-texto, #173b38);
          border-radius: 12px;
          padding: 10px 18px;
          cursor: pointer;
          font-weight: 700;
        }

        /* =========================================
           SONS
        ========================================= */

        .sons-area {
          margin-top: 30px;
        }

        .secao-titulo {
          margin: 0 0 7px;
          font-size: 27px;
        }

        .secao-descricao {
          margin: 0 0 18px;
          color:
            var(--pulsan-texto-secundario, #777);
          font-size: 14px;
          line-height: 1.5;
        }

        .sons-grid {
          display: grid;
          grid-template-columns:
            repeat(4, minmax(0, 1fr));
          gap: 12px;
        }

        .som-card {
          padding: 18px;
          cursor: pointer;
          transition:
            transform 0.2s ease;
        }

        .som-card:hover {
          transform: translateY(-2px);
        }

        .som-card.ativo {
          border:
            2px solid
            var(--pulsan-primaria, #20adb0);
        }

        .som-emoji {
          font-size: 30px;
        }

        .som-card h3 {
          margin: 9px 0 7px;
          font-size: 16px;
        }

        .som-finalidade {
          display: inline-block;
          margin-bottom: 8px;
          padding: 5px 8px;
          border-radius: 12px;
          background:
            #eef8f8;
          color:
            var(--pulsan-primaria, #168f92);
          font-size: 10px;
          font-weight: 800;
        }

        .som-card p {
          margin: 0;
          color:
            var(--pulsan-texto-secundario, #777);
          font-size: 12px;
          line-height: 1.45;
        }

        /* =========================================
           PLAYER
        ========================================= */

        .som-player {
          margin-top: 18px;
          padding: 20px;
          border-radius: 20px;
          background:
            var(--pulsan-card, #ffffff);
          border:
            1px solid
            var(--pulsan-borda, #e5e5e5);
        }

        .player-topo {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
        }

        .player-info strong {
          display: block;
          font-size: 18px;
          margin-bottom: 5px;
        }

        .player-info span {
          color:
            var(--pulsan-texto-secundario, #777);
          font-size: 12px;
        }

        .player-controles {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .player-button {
          border: none;
          background:
            var(--pulsan-primaria, #20adb0);
          color: #ffffff;
          border-radius: 12px;
          padding: 11px 17px;
          cursor: pointer;
          font-weight: 800;
        }

        .player-stop {
          border:
            1px solid
            var(--pulsan-borda, #ddd);
          background: #ffffff;
          color:
            var(--pulsan-texto, #173b38);
          border-radius: 12px;
          padding: 10px 16px;
          cursor: pointer;
          font-weight: 700;
        }

        .volume-area {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 15px;
          color:
            var(--pulsan-texto-secundario, #777);
          font-size: 13px;
        }

        .volume-area input {
          flex: 1;
          accent-color:
            var(--pulsan-primaria, #20adb0);
        }

        .erro-audio {
          margin-top: 13px;
          padding: 12px;
          border-radius: 12px;
          background: #fff1f1;
          color: #a33;
          font-size: 12px;
          line-height: 1.5;
        }

        /* =========================================
           FINAL
        ========================================= */

        .final-area {
          margin-top: 30px;
          padding: 30px;
          text-align: center;
        }

        .final-area h2 {
          margin: 0 0 9px;
          font-size: 24px;
        }

        .final-area p {
          max-width: 650px;
          margin: 0 auto 18px;
          color:
            var(--pulsan-texto-secundario, #777);
          font-size: 14px;
          line-height: 1.5;
        }

        .final-button {
          border: none;
          background:
            var(--pulsan-primaria, #20adb0);
          color: #ffffff;
          border-radius: 12px;
          padding: 13px 20px;
          cursor: pointer;
          font-weight: 800;
        }

        /* =========================================
           NOTEBOOK / TABLET
        ========================================= */

        @media (max-width: 900px) {

          .sentimentos-grid {
            grid-template-columns:
              repeat(3, minmax(0, 1fr));
          }

          .sons-grid {
            grid-template-columns:
              repeat(3, minmax(0, 1fr));
          }

          .conteudo-opcoes {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

        }

        /* =========================================
           CELULAR
        ========================================= */

        @media (max-width: 600px) {

          .reflexao-container {
            padding:
              20px 12px 35px;
          }

          .reflexao-topo {
            margin-bottom: 22px;
          }

          .reflexao-topo h1 {
            font-size: 29px;
          }

          .reflexao-topo p {
            font-size: 14px;
          }

          .sentimentos-card {
            padding: 16px;
          }

          .sentimentos-card h2 {
            font-size: 20px;
          }

          .sentimentos-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .sentimento-button {
            min-height: 94px;
          }

          .momento-introducao {
            padding: 30px 20px;
          }

          .momento-introducao h2 {
            font-size: 28px;
          }

          .momento-introducao h3 {
            font-size: 19px;
          }

          .momento-introducao p {
            font-size: 14px;
          }

          .flash-card {
            min-height: 390px;
            padding:
              35px 20px;
          }

          .flash-titulo {
            font-size: 24px;
          }

          .flash-texto {
            font-size: 16px;
            line-height: 1.6;
          }

          .flash-controles {
            flex-wrap: wrap;
          }

          .flash-secundario,
          .flash-principal {
            min-height: 44px;
          }

          .conteudo-opcoes {
            grid-template-columns: 1fr;
          }

          .videos-grid {
            grid-template-columns: 1fr;
          }

          .sons-grid {
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          .player-topo {
            flex-direction: column;
            align-items: flex-start;
          }

          .player-controles {
            width: 100%;
          }

          .player-button,
          .player-stop {
            flex: 1;
          }

          .filosofia-area {
            padding: 25px 18px;
          }

          .filosofia-texto {
            font-size: 18px;
          }

        }

        @media (max-width: 360px) {

          .sentimentos-grid {
            grid-template-columns: 1fr;
          }

          .sons-grid {
            grid-template-columns: 1fr;
          }

          .reflexao-container {
            padding-left: 9px;
            padding-right: 9px;
          }

        }

        `}
      </style>

      <main className="reflexao-page">

        <div className="reflexao-container">

          {/* =====================================================
              CABEÇALHO
          ===================================================== */}

          <section className="reflexao-topo">

            <span className="reflexao-mini">
              PULSAN
            </span>

            <h1>
              Reflexão 🌱
            </h1>

            <p>
              Um espaço para parar,
              perceber o que você sente
              e encontrar novas maneiras
              de olhar para aquilo que
              está vivendo.
            </p>

          </section>

          {/* =====================================================
              SENTIMENTOS
          ===================================================== */}

          <section
            className="sentimentos-card"
            style={cardStyle}
          >

            <h2>
              O que você está sentindo?
              💭
            </h2>

            <p>
              Escolha o que mais se aproxima
              do seu momento. Não existe
              resposta certa.
            </p>

            <div className="sentimentos-grid">

              {sentimentos.map(
                (sentimento) => (

                  <button
                    key={sentimento.id}
                    type="button"
                    className={
                      "sentimento-button " +
                      (
                        sentimentoSelecionado ===
                        sentimento.id
                          ? "ativo"
                          : ""
                      )
                    }
                    onClick={() =>
                      escolherSentimento(
                        sentimento.id
                      )
                    }
                  >

                    <span className="sentimento-emoji">
                      {sentimento.emoji}
                    </span>

                    <span className="sentimento-nome">
                      {sentimento.nome}
                    </span>

                    <span className="sentimento-descricao">
                      {sentimento.descricao}
                    </span>

                  </button>

                )
              )}

            </div>

          </section>

          {/* =====================================================
              MOMENTO PULSAN
          ===================================================== */}

          {sentimentoSelecionado && (

            <section
              id="momento-pulsan"
              className="momento-pulsan"
            >

              {!momentoIniciado && (

                <div
                  className="momento-introducao"
                  style={cardStyle}
                >

                  <div className="momento-selo">
                    MOMENTO PULSAN
                  </div>

                  <h2>
                    Você chegou até aqui.
                  </h2>

                  <h3>
                    Talvez seja hora de
                    parar por um minuto.
                  </h3>

                  <p>
                    Você não precisa continuar
                    procurando respostas o tempo
                    todo.
                    <br />
                    Às vezes, apenas respirar e
                    perceber o que está sentindo
                    já é importante.
                  </p>

                  <button
                    type="button"
                    className="momento-botao"
                    onClick={
                      iniciarMomento
                    }
                  >
                    🌿 Começar meu momento
                  </button>

                </div>

              )}

              {momentoIniciado &&
                !momentoFinalizado &&
                cardsDoMomento.length > 0 && (

                <div
                  id="flash-card-atual"
                  className="flash-area"
                >

                  <article
                    className="flash-card"
                    style={cardStyle}
                  >

                    <div className="flash-numero">
                      REFLEXÃO{" "}
                      {cardAtual + 1} DE{" "}
                      {cardsDoMomento.length}
                    </div>

                    <div className="flash-emoji">
                      {
                        cardsDoMomento[
                          cardAtual
                        ].emoji
                      }
                    </div>

                    <h2 className="flash-titulo">
                      {
                        cardsDoMomento[
                          cardAtual
                        ].titulo
                      }
                    </h2>

                    <p className="flash-texto">
                      {
                        cardsDoMomento[
                          cardAtual
                        ].texto
                      }
                    </p>

                    <div className="progresso">
                      <div
                        className="progresso-barra"
                        style={{
                          width:
                            `${
                              (
                                (cardAtual + 1) /
                                cardsDoMomento.length
                              ) * 100
                            }%`,
                        }}
                      />
                    </div>

                    <div className="flash-controles">

                      {cardAtual > 0 && (

                        <button
                          type="button"
                          className="flash-secundario"
                          onClick={
                            voltarCard
                          }
                        >
                          ← Voltar
                        </button>

                      )}

                      <button
                        type="button"
                        className="flash-principal"
                        onClick={
                          proximoCard
                        }
                      >
                        {cardAtual ===
                        cardsDoMomento.length - 1
                          ? "Continuar ✨"
                          : "Continuar →"}
                      </button>

                    </div>

                  </article>

                </div>

              )}

              {momentoFinalizado && (

                <div
                  className="momento-introducao"
                  style={cardStyle}
                >

                  <div className="momento-selo">
                    MOMENTO PULSAN
                  </div>

                  <h2>
                    Você chegou ao final
                    desta reflexão. 🌿
                  </h2>

                  <p>
                    Talvez alguma dessas ideias
                    tenha encontrado um espaço
                    dentro de você.
                    <br />
                    Agora, se quiser, continue
                    esse momento através de
                    outros conteúdos.
                  </p>

                  <button
                    type="button"
                    className="momento-botao"
                    onClick={
                      novaReflexao
                    }
                  >
                    💭 Quero outra reflexão
                  </button>

                </div>

              )}

            </section>

          )}

          {/* =====================================================
              CONTEÚDOS REFLEXIVOS
          ===================================================== */}

          {momentoFinalizado && (

            <section
              id="conteudos-reflexivos"
              className="conteudos-reflexivos"
            >

              <div className="conteudo-intro">

                <h2>
                  ✨ Continue seu momento
                </h2>

                <p>
                  Depois de algumas reflexões,
                  talvez exista outro conteúdo
                  que converse com aquilo que
                  você está vivendo.
                </p>

              </div>

              <div className="conteudo-opcoes">

                {/* VÍDEOS */}

                <article
                  className="conteudo-opcao"
                  style={cardStyle}
                  onClick={() => {
                    const elemento =
                      document.getElementById(
                        "videos-area"
                      );

                    elemento?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                >

                  <div className="conteudo-opcao-emoji">
                    🎬
                  </div>

                  <h3>
                    Histórias para refletir
                  </h3>

                  <p>
                    Vídeos relacionados ao
                    momento que você escolheu.
                  </p>

                </article>

                {/* FILOSOFIA */}

                <article
                  className="conteudo-opcao"
                  style={cardStyle}
                  onClick={
                    mostrarPensamento
                  }
                >

                  <div className="conteudo-opcao-emoji">
                    💭
                  </div>

                  <h3>
                    Uma nova perspectiva
                  </h3>

                  <p>
                    Pensamentos que podem fazer
                    você enxergar algo por outro
                    ângulo.
                  </p>

                </article>

                {/* SONS */}

                <article
                  className="conteudo-opcao"
                  style={cardStyle}
                  onClick={() => {
                    const elemento =
                      document.getElementById(
                        "sons-area"
                      );

                    elemento?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                >

                  <div className="conteudo-opcao-emoji">
                    🎧
                  </div>

                  <h3>
                    Um ambiente para o momento
                  </h3>

                  <p>
                    Sons selecionados para
                    acompanhar seu estado atual.
                  </p>

                </article>

              </div>

            </section>

          )}

          {/* =====================================================
              PENSAMENTO EXTRA
          ===================================================== */}

          {mensagemExtra && (

            <section
              className="filosofia-area"
              style={cardStyle}
            >

              <div className="filosofia-selo">
                UMA IDEIA PARA LEVAR COM VOCÊ
              </div>

              <div className="filosofia-texto">
                “{mensagemExtra.texto}”
              </div>

              <div className="filosofia-autor">
                — {mensagemExtra.autor}
              </div>

              <button
                type="button"
                className="filosofia-button"
                onClick={
                  mostrarPensamento
                }
              >
                Outra perspectiva
              </button>

            </section>

          )}

          {/* =====================================================
              VÍDEOS
          ===================================================== */}

          {momentoFinalizado && (

            <section
              id="videos-area"
              className="videos-area"
            >

              <h2 className="secao-titulo">
                🎬 Talvez esse vídeo converse
                com seu momento
              </h2>

              <p className="secao-descricao">
                Conteúdos selecionados de acordo
                com o que você escolheu sentir.
              </p>

              <div className="videos-grid">

                {videosRelacionados.map(
                  (video) => (

                    <article
                      key={video.id}
                      className="video-card"
                      style={cardStyle}
                    >

                      <div className="video-card-topo">

                        <div className="video-icone">
                          {video.emoji}
                        </div>

                        <div>

                          <h3>
                            {video.titulo}
                          </h3>

                          <p>
                            {video.descricao}
                          </p>

                        </div>

                      </div>

                      <a
                        href={video.url}
                        target="_blank"
                        rel="noreferrer"
                        className="video-button"
                      >
                        ▶ Assistir reflexão
                      </a>

                    </article>

                  )
                )}

              </div>

            </section>

          )}

          {/* =====================================================
              FILOSOFIA
          ===================================================== */}

          {momentoFinalizado && (

            <section
              className="filosofia-area"
              style={cardStyle}
            >

              <div className="filosofia-selo">
                PENSAMENTO FILOSÓFICO
              </div>

              <div className="filosofia-texto">
                “A reflexão começa quando
                deixamos de apenas reagir
                e começamos a observar.”
              </div>

              <div className="filosofia-autor">
                — Pulsan
              </div>

              <button
                type="button"
                className="filosofia-button"
                onClick={
                  mostrarPensamento
                }
              >
                💭 Encontrar outro pensamento
              </button>

            </section>

          )}

          {/* =====================================================
              SONS
          ===================================================== */}

          <section
            id="sons-area"
            className="sons-area"
          >

            <h2 className="secao-titulo">
              🎧 Sons para acompanhar
              seu momento
            </h2>

            <p className="secao-descricao">

              {sentimentoSelecionado
                ? `Selecionamos sons que podem acompanhar seu momento de ${sentimentoAtual?.nome?.toLowerCase()}.`
                : "Escolha um sentimento para receber sugestões."
              }

            </p>

            <div className="sons-grid">

              {sonsRelacionados.map(
                (som) => (

                  <article
                    key={som.id}
                    className={
                      "som-card " +
                      (
                        somSelecionado?.id ===
                        som.id
                          ? "ativo"
                          : ""
                      )
                    }
                    style={cardStyle}
                    onClick={() =>
                      escolherSom(som)
                    }
                  >

                    <div className="som-emoji">
                      {som.emoji}
                    </div>

                    <h3>
                      {som.nome}
                    </h3>

                    <span className="som-finalidade">
                      {som.finalidade}
                    </span>

                    <p>
                      {som.descricao}
                    </p>

                  </article>

                )
              )}

            </div>

            {/* =================================================
                PLAYER REAL
            ================================================= */}

            {somSelecionado && (

              <div className="som-player">

                <div className="player-topo">

                  <div className="player-info">

                    <strong>
                      {somSelecionado.emoji}{" "}
                      {somSelecionado.nome}
                    </strong>

                    <span>
                      {somSelecionado.finalidade}
                    </span>

                  </div>

                  <div className="player-controles">

                    <button
                      type="button"
                      className="player-button"
                      onClick={
                        alternarAudio
                      }
                    >
                      {tocando
                        ? "⏸ Pausar"
                        : "▶ Ouvir"}
                    </button>

                    <button
                      type="button"
                      className="player-stop"
                      onClick={
                        pararAudio
                      }
                    >
                      ⏹ Parar
                    </button>

                  </div>

                </div>

                <div className="volume-area">

                  <span>
                    🔊
                  </span>

                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={
                      alterarVolume
                    }
                    aria-label="Volume"
                  />

                  <span>
                    {Math.round(
                      volume * 100
                    )}
                    %
                  </span>

                </div>

                {erroAudio && (

                  <div className="erro-audio">

                    ⚠️ {erroAudio}

                    <br />

                    <small>
                      Exemplo de localização:
                      <strong>
                        {" "}
                        public/sons/chuva.mp3
                      </strong>
                    </small>

                  </div>

                )}

              </div>

            )}

          </section>

          {/* =====================================================
              FINAL
          ===================================================== */}

          <section
            className="final-area"
            style={cardStyle}
          >

            <h2>
              💚 Seu momento não precisa
              terminar aqui.
            </h2>

            <p>
              Se depois de refletir você
              sentir vontade de conversar,
              o Pulsan continua disponível
              para você.
            </p>

            <button
              type="button"
              className="final-button"
              onClick={() =>
                irPara("conversas")
              }
            >
              💬 Ir para Conversas
            </button>

          </section>

        </div>

      </main>
    </>
  );
}

export default Ajudar;