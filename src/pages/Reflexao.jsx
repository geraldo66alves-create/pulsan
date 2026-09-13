import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

/* =========================================================
   SENTIMENTOS
========================================================= */

const sentimentos = [
  {
    id: "cansado",
    emoji: "😴",
    nome: "Cansado",
    descricao: "Talvez você precise desacelerar.",

    reflexoes: [
      "Às vezes, o que você chama de preguiça é apenas cansaço que você não se permitiu sentir.",
      "Você precisa realmente fazer mais ou precisa se permitir descansar?",
      "Nem todo dia precisa ser produtivo para ter sido um dia importante.",
      "Talvez seu corpo esteja pedindo aquilo que sua mente insiste em negar.",
      "Descansar não significa desistir. Às vezes, significa escolher continuar de uma maneira diferente.",
      "Você está cansado de fazer coisas ou cansado de precisar ser forte o tempo inteiro.",
      "Quando foi a última vez que você descansou sem sentir culpa?",
    ],

    sons: [
      {
        nome: "Chuva suave",
        descricao: "para desacelerar",
        arquivo: "/sons/chuva.mp3",
        emoji: "🌧️",
      },
      {
        nome: "Ondas",
        descricao: "para relaxar",
        arquivo: "/sons/ondas.mp3",
        emoji: "🌊",
      },
      {
        nome: "Floresta",
        descricao: "para respirar",
        arquivo: "/sons/floresta.mp3",
        emoji: "🌿",
      },
    ],

    momento: {
      titulo: "Talvez você não seja preguiçoso.",
      descricao:
        "Talvez exista uma diferença entre não querer fazer algo e simplesmente não ter mais energia para continuar.",
      video: "/videos/cansaco.mp4",
      audio: "/sons/cansaco.mp3",
      reflexao:
        "Se você não precisasse provar que consegue dar conta de tudo, o que escolheria fazer hoje?",
    },
  },

  {
    id: "ansioso",
    emoji: "😰",
    nome: "Ansioso",
    descricao: "Talvez seja hora de voltar para o presente.",

    reflexoes: [
      "Você está vivendo o que está acontecendo ou aquilo que imagina que pode acontecer?",
      "Nem todo pensamento precisa de uma resposta.",
      "Você está tentando resolver hoje um problema que talvez nem aconteça amanhã?",
      "Às vezes, a mente corre para o futuro porque tem medo de permanecer no presente.",
      "Você não precisa controlar tudo para conseguir continuar.",
      "Talvez algumas coisas não precisem ser resolvidas agora.",
      "O futuro ainda não aconteceu. Este momento já está aqui.",
    ],

    sons: [
      {
        nome: "Chuva suave",
        descricao: "para acalmar",
        arquivo: "/sons/chuva.mp3",
        emoji: "",
      },
      {
        nome: "Ondas tranquilas",
        descricao: "para desacelerar",
        arquivo: "/sons/ondas.mp3",
        emoji: "🌊",
      },
      {
        nome: "Som ambiente",
        descricao: "para voltar ao presente",
        arquivo: "/sons/ambiente.mp3",
        emoji: "🫧",
      },
       {
        nome: "Chuva e Som Abiente",
        descricao: "para voltar ao presente",
        arquivo: "/sons/chuvaambiente.mp3",
        emoji: "🫧🌧️",
      },
    ],

    momento: {
      titulo: "Você não precisa resolver tudo agora.",
      descricao:
        "Talvez sua mente esteja tentando encontrar respostas para perguntas que ainda nem precisam ser respondidas.",
      video: "/videos/ansiedade.mp4",
      audio: "/sons/ansiedade.mp3",
      reflexao:
        "Se você tivesse certeza de que tudo ficaria bem, o que faria diferente hoje?",
    },
  },

  {
    id: "triste",
    emoji: "😔",
    nome: "Triste",
    descricao: "Talvez esse sentimento precise ser ouvido.",

    reflexoes: [
      "Nem toda tristeza precisa ser consertada imediatamente. Algumas precisam primeiro ser escutadas.",
      "Você não precisa transformar tudo o que sente em força.",
      "Talvez hoje você não precise encontrar uma solução. Talvez precise apenas reconhecer o que está doendo.",
      "Sentir tristeza não significa que você está fraco.",
      "Você tem permitido sentir ou tem passado tempo demais tentando parecer bem?",
      "Às vezes, dizer 'isso está doendo' é mais honesto do que dizer 'está tudo bem'.",
      "Você não precisa esconder aquilo que sente para merecer estar perto de alguém.",
    ],

    sons: [
      {
        nome: "Chuva",
        descricao: "para acolher o momento",
        arquivo: "/sons/chuva.mp3",
        emoji: "🌧️",
      },
      {
        nome: "Piano suave",
        descricao: "para contemplar",
        arquivo: "/sons/piano.mp3",
        emoji: "🎹",
      },
      {
        nome: "Noite tranquila",
        descricao: "para ficar em silêncio",
        arquivo: "/sons/noite.mp3",
        emoji: "🌙",
      },
    ],

    momento: {
      titulo: "Você não precisa fingir que está tudo bem.",
      descricao:
        "Alguns sentimentos não pedem uma solução imediata. Pedem espaço.",
      video: "/videos/tristeza.mp4",
      audio: "/sons/tristeza.mp3",
      reflexao:
        "Se você pudesse falar sem medo de ser julgado, o que gostaria de dizer agora?",
    },
  },

  {
    id: "pensando",
    emoji: "💭",
    nome: "Pensando demais",
    descricao: "Talvez nem todo pensamento precise ser seguido.",

    reflexoes: [
      "Nem todo pensamento que aparece na sua cabeça representa aquilo que realmente está acontecendo.",
      "Você está procurando uma solução ou apenas repetindo o mesmo pensamento?",
      "Pensar sobre algo pode ajudar. Pensar sobre a mesma coisa sem parar pode apenas cansar.",
      "Nem tudo precisa fazer sentido imediatamente.",
      "Talvez sua mente esteja procurando certeza em um lugar onde só existe possibilidade.",
      "Você consegue perceber seus pensamentos sem precisar acreditar em todos eles?",
      "Às vezes, o que precisamos não é pensar mais, mas descansar a mente.",
    ],

    sons: [
      {
        nome: "Floresta",
        descricao: "para limpar a mente",
        arquivo: "/sons/floresta.mp3",
        emoji: "🌿",
      },
      {
        nome: "Água",
        descricao: "para desacelerar",
        arquivo: "/sons/agua.mp3",
        emoji: "💧",
      },
      {
        nome: "Chuva leve",
        descricao: "para contemplar",
        arquivo: "/sons/chuva.mp3",
        emoji: "🌧️",
      },
    ],

    momento: {
      titulo: "Nem todo pensamento precisa de uma resposta.",
      descricao:
        "Às vezes, observar aquilo que passa pela mente já é suficiente para criar um pouco de distância.",
      video: "/videos/pensamentos.mp4",
      audio: "/sons/pensamentos.mp3",
      reflexao:
        "Qual pensamento você continua alimentando mesmo sem saber se ele é realmente verdade?",
    },
  },

  {
    id: "irritado",
    emoji: "😡",
    nome: "Irritado",
    descricao: "Talvez exista algo por trás dessa raiva.",

    reflexoes: [
      "A raiva nem sempre aparece porque você é uma pessoa agressiva. Às vezes, ela aparece porque alguma coisa ultrapassou um limite.",
      "O que exatamente está machucando por trás daquilo que está irritando você?",
      "Você está com raiva da situação ou de tudo aquilo que ela representa?",
      "Às vezes, a raiva é uma emoção tentando proteger outra que é mais difícil de admitir.",
      "Você precisa responder agora ou pode esperar até conseguir entender o que realmente sente?",
      "Quais limites seus talvez estejam sendo ignorados?",
      "Talvez ouvir a sua raiva seja diferente de deixar que ela decida por você.",
    ],

    sons: [
      {
        nome: "Chuva",
        descricao: "para desacelerar",
        arquivo: "/sons/chuva.mp3",
        emoji: "🌧️",
      },
      {
        nome: "Ondas",
        descricao: "para respirar",
        arquivo: "/sons/ondas.mp3",
        emoji: "🌊",
      },
      {
        nome: "Floresta",
        descricao: "para se afastar do excesso",
        arquivo: "/sons/floresta.mp3",
        emoji: "🌿",
      },
    ],

    momento: {
      titulo: "O que existe por trás da sua raiva?",
      descricao:
        "Talvez entender aquilo que despertou a raiva seja mais importante do que simplesmente tentar eliminá-la.",
      video: "/videos/raiva.mp4",
      audio: "/sons/raiva.mp3",
      reflexao:
        "Se a sua raiva pudesse explicar exatamente o que ela está tentando proteger, o que ela diria?",
    },
  },

  {
    id: "vazio",
    emoji: "😶",
    nome: "Vazio",
    descricao: "Talvez você não precise preencher esse espaço imediatamente.",

    reflexoes: [
      "Você sente falta de alguma coisa ou sente falta de sentir alguma coisa?",
      "Nem todo vazio precisa ser preenchido imediatamente.",
      "Às vezes, ficamos tão ocupados tentando preencher um espaço que nunca descobrimos o que realmente faltava.",
      "Você tem se permitido perceber o que está sentindo?",
      "Talvez você não esteja perdido. Talvez esteja atravessando uma fase em que ainda não sabe para onde ir.",
      "O silêncio também pode revelar coisas que o excesso de distração esconde.",
      "Você consegue ficar alguns minutos consigo mesmo sem tentar fugir do que sente?",
    ],

    sons: [
      {
        nome: "Noite tranquila",
        descricao: "para contemplar",
        arquivo: "/sons/noite.mp3",
        emoji: "🌙",
      },
      {
        nome: "Chuva",
        descricao: "para acolher",
        arquivo: "/sons/chuva.mp3",
        emoji: "🌧️",
      },
      {
        nome: "Piano",
        descricao: "para refletir",
        arquivo: "/sons/piano.mp3",
        emoji: "🎹",
      },
    ],

    momento: {
      titulo: "Nem todo vazio precisa ser preenchido.",
      descricao:
        "Alguns espaços precisam primeiro ser compreendidos antes de serem ocupados novamente.",
      video: "/videos/vazio.mp4",
      audio: "/sons/vazio.mp3",
      reflexao:
        "Se você não pudesse fugir desse vazio agora, o que acha que ele tentaria mostrar?",
    },
  },

  {
    id: "desanimado",
    emoji: "🥀",
    nome: "Desanimado",
    descricao: "Talvez o caminho precise mudar, não terminar.",

    reflexoes: [
      "Talvez você não esteja desistindo. Talvez esteja cansado de tentar do mesmo jeito.",
      "Uma fase difícil não é necessariamente uma vida difícil.",
      "Você ainda quer aquilo ou apenas sente que deveria querer?",
      "Às vezes, mudar o caminho não significa abandonar o destino.",
      "Você está olhando apenas para aquilo que ainda falta ou também consegue perceber o quanto já caminhou?",
      "Nem todo progresso é visível.",
      "Talvez você precise de uma pausa, não de uma desistência.",
    ],

    sons: [
      {
        nome: "Floresta",
        descricao: "para renovar",
        arquivo: "/sons/floresta.mp3",
        emoji: "🌿",
      },
      {
        nome: "Ondas",
        descricao: "para desacelerar",
        arquivo: "/sons/ondas.mp3",
        emoji: "🌊",
      },
      {
        nome: "Piano suave",
        descricao: "para contemplar",
        arquivo: "/sons/piano.mp3",
        emoji: "🎹",
      },
    ],

    momento: {
      titulo: "Talvez você não precise desistir.",
      descricao:
        "Talvez exista outra maneira de continuar sem precisar permanecer exatamente onde você está.",
      video: "/videos/desanimo.mp4",
      audio: "/sons/desanimo.mp3",
      reflexao:
        "Se você pudesse começar novamente sem precisar voltar ao ponto de partida, por onde começaria?",
    },
  },

  {
    id: "medo",
    emoji: "😨",
    nome: "Com medo",
    descricao: "Talvez o medo esteja tentando dizer alguma coisa.",

    reflexoes: [
      "O medo nem sempre está dizendo para você parar. Às vezes, está dizendo que aquilo importa.",
      "Você tem medo de fracassar ou medo de descobrir que consegue?",
      "Quantas decisões você já tomou apenas para não sentir medo?",
      "Talvez coragem não seja ausência de medo. Talvez seja não deixar que ele escolha tudo por você.",
      "Você está protegendo sua paz ou evitando uma possibilidade?",
      "O medo está te impedindo de viver ou está mostrando algo que precisa ser compreendido?",
      "Talvez você possa dar um passo pequeno em vez de exigir de si mesmo um salto enorme.",
    ],

    sons: [
      {
        nome: "Som ambiente",
        descricao: "para desacelerar",
        arquivo: "/sons/ambiente.mp3",
        emoji: "🫧",
      },
      {
        nome: "Ondas",
        descricao: "para acalmar",
        arquivo: "/sons/ondas.mp3",
        emoji: "🌊",
      },
      {
        nome: "Chuva",
        descricao: "para voltar ao presente",
        arquivo: "/sons/chuva.mp3",
        emoji: "🌧️",
      },
    ],

    momento: {
      titulo: "E se o medo não precisasse decidir por você?",
      descricao:
        "Você não precisa deixar de sentir medo para começar a caminhar.",
      video: "/videos/medo.mp4",
      audio: "/sons/medo.mp3",
      reflexao:
        "O que você faria hoje se tivesse certeza de que poderia tentar novamente caso desse errado?",
    },
  },

  {
    id: "inseguro",
    emoji: "🪞",
    nome: "Inseguro",
    descricao: "Talvez seu valor não dependa da opinião dos outros.",

    reflexoes: [
      "Você não precisa ser escolhido por todo mundo para ter valor.",
      "Seu valor não diminui porque alguém não conseguiu enxergá-lo.",
      "Você está tentando ser você mesmo ou tentando ser aquilo que acha que os outros esperam?",
      "Talvez a comparação esteja fazendo você esquecer da sua própria história.",
      "Você faria as mesmas críticas a alguém que ama?",
      "Nem toda rejeição significa que existe algo errado com você.",
      "Talvez o maior desafio não seja fazer todos gostarem de você, mas não se abandonar para conseguir isso.",
    ],

    sons: [
      {
        nome: "Piano suave",
        descricao: "para acolher",
        arquivo: "/sons/piano.mp3",
        emoji: "🎹",
      },
      {
        nome: "Chuva",
        descricao: "para desacelerar",
        arquivo: "/sons/chuva.mp3",
        emoji: "🌧️",
      },
      {
        nome: "Floresta",
        descricao: "para respirar",
        arquivo: "/sons/floresta.mp3",
        emoji: "🌿",
      },
    ],

    momento: {
      titulo: "Seu valor não depende da aprovação.",
      descricao:
        "Talvez você esteja tentando encontrar nos outros uma confirmação que precisa começar a construir dentro de si.",
      video: "/videos/autoestima.mp4",
      audio: "/sons/autoestima.mp3",
      reflexao:
        "Quem você seria se não precisasse provar o seu valor para ninguém?",
    },
  },

  {
    id: "sobrecarregado",
    emoji: "💼",
    nome: "Sobrecarregado",
    descricao: "Você não precisa carregar tudo sozinho.",

    reflexoes: [
      "Você não precisa transformar todos os seus dias em uma prova para provar que é capaz.",
      "Dar conta de tudo não deveria ser a única maneira de se sentir suficiente.",
      "Quantas coisas você está carregando porque acredita que não pode dizer não?",
      "Talvez o problema não seja falta de organização. Talvez seja excesso de coisas para uma única pessoa.",
      "Você consegue reconhecer seus limites antes que eles sejam ultrapassados?",
      "Pedir ajuda também pode ser uma forma de responsabilidade consigo mesmo.",
      "Você não precisa esperar chegar ao limite para perceber que precisava de uma pausa.",
    ],

    sons: [
      {
        nome: "Chuva",
        descricao: "para desacelerar",
        arquivo: "/sons/chuva.mp3",
        emoji: "🌧️",
      },
      {
        nome: "Floresta",
        descricao: "para respirar",
        arquivo: "/sons/floresta.mp3",
        emoji: "🌿",
      },
      {
        nome: "Ondas",
        descricao: "para relaxar",
        arquivo: "/sons/ondas.mp3",
        emoji: "🌊",
      },
    ],

    momento: {
      titulo: "Você não precisa dar conta de tudo.",
      descricao:
        "Seu valor não precisa ser medido pela quantidade de coisas que você consegue suportar.",
      video: "/videos/pressao.mp4",
      audio: "/sons/pressao.mp3",
      reflexao:
        "O que você poderia deixar de carregar se aceitasse que não precisa resolver tudo sozinho?",
    },
  },

  {
    id: "frustrado",
    emoji: "😤",
    nome: "Frustrado",
    descricao: "Talvez você esteja cansado de tentar sem ver resultado.",
    reflexoes: [
      "Você está frustrado porque não conseguiu ou porque esperava conseguir mais rápido?",
      "Nem todo esforço produz resultado imediatamente.",
      "O que você precisa neste momento: insistir, mudar o caminho ou descansar?",
      "Você pode reconhecer sua frustração sem deixar que ela defina quem você é.",
      "Talvez o resultado não tenha vindo ainda, mas isso não apaga o que você tentou.",
    ],
    sons: [
      { nome: "Chuva suave", descricao: "para desacelerar", arquivo: "/sons/chuva.mp3", emoji: "🌧️" },
      { nome: "Ondas", descricao: "para aliviar a tensão", arquivo: "/sons/ondas.mp3", emoji: "🌊" },
      { nome: "Piano suave", descricao: "para reorganizar os pensamentos", arquivo: "/sons/piano.mp3", emoji: "🎹" },
    ],
    momento: {
      titulo: "Você não precisa acertar tudo de primeira.",
      descricao: "A frustração pode mostrar que algo importa, mas não precisa decidir o próximo passo por você.",
      video: "/videos/frustracao.mp4",
      audio: "/sons/frustracao.mp3",
      reflexao: "O que você faria diferente se não precisasse transformar cada tentativa em uma prova do seu valor?",
    },
  },

  {
    id: "futuro",
    emoji: "🔮",
    nome: "Medo do futuro",
    descricao: "Talvez você esteja tentando controlar o que ainda não aconteceu.",
    reflexoes: [
      "Você está vivendo o presente ou tentando se preparar para todas as possibilidades?",
      "O futuro ainda não exige de você as respostas que sua mente está cobrando agora.",
      "Nem tudo que você imagina que pode dar errado vai acontecer.",
      "Você pode planejar o amanhã sem abandonar o dia de hoje.",
      "Qual é o menor passo possível que está ao seu alcance neste momento?",
    ],
    sons: [
      { nome: "Som ambiente", descricao: "para voltar ao presente", arquivo: "/sons/ambiente.mp3", emoji: "🫧" },
      { nome: "Chuva", descricao: "para acalmar", arquivo: "/sons/chuva.mp3", emoji: "🌧️" },
      { nome: "Floresta", descricao: "para respirar", arquivo: "/sons/floresta.mp3", emoji: "🌿" },
    ],
    momento: {
      titulo: "Você não precisa conhecer todo o caminho.",
      descricao: "Às vezes, segurança não vem de saber o que acontecerá, mas de perceber que você pode lidar com um passo de cada vez.",
      video: "/videos/medo-futuro.mp4",
      audio: "/sons/medo-futuro.mp3",
      reflexao: "O que está sob seu controle hoje, mesmo que o futuro continue incerto?",
    },
  },

  {
    id: "depressivo",
    emoji: "🌧️",
    nome: "Depressivo",
    descricao: "Você merece acolhimento, cuidado e apoio.",
    reflexoes: [
      "Você não precisa enfrentar tudo sozinho nem explicar perfeitamente o que sente.",
      "Sua dor merece ser levada a sério, mesmo quando você não consegue colocá-la em palavras.",
      "Hoje, fazer apenas o possível já pode ser suficiente.",
      "Pedir ajuda não diminui sua força; mostra que você também merece cuidado.",
      "Você não precisa resolver a vida inteira para dar um pequeno passo agora.",
    ],
    sons: [
      { nome: "Piano suave", descricao: "para acolher", arquivo: "/sons/piano.mp3", emoji: "🎹" },
      { nome: "Chuva leve", descricao: "para permanecer no momento", arquivo: "/sons/chuva.mp3", emoji: "🌧️" },
      { nome: "Noite tranquila", descricao: "para respirar em silêncio", arquivo: "/sons/noite.mp3", emoji: "🌙" },
    ],
    momento: {
      titulo: "Você merece cuidado, não cobrança.",
      descricao: "Quando tudo parece pesado, buscar apoio profissional ou conversar com alguém de confiança pode ser um passo importante.",
      video: "/videos/depressao.mp4",
      audio: "/sons/depressao.mp3",
      reflexao: "Qual seria uma forma pequena e possível de cuidar de você hoje?",
    },
  },

  {
    id: "solitario",
    emoji: "🫂",
    nome: "Solitário",
    descricao: "Talvez você esteja precisando de conexão e acolhimento.",
    reflexoes: [
      "Você sente falta de alguém ou sente falta de ser verdadeiramente compreendido?",
      "Você não precisa esconder o que sente para merecer companhia.",
      "Às vezes, uma mensagem simples pode ser o começo de uma aproximação.",
      "Estar sozinho agora não significa que você estará sozinho para sempre.",
      "Você consegue pensar em alguém com quem poderia dividir um pouco do que está sentindo?",
    ],
    sons: [
      { nome: "Piano suave", descricao: "para acolher", arquivo: "/sons/piano.mp3", emoji: "🎹" },
      { nome: "Chuva", descricao: "para ficar consigo", arquivo: "/sons/chuva.mp3", emoji: "🌧️" },
      { nome: "Ondas", descricao: "para respirar", arquivo: "/sons/ondas.mp3", emoji: "🌊" },
    ],
    momento: {
      titulo: "Você merece ser ouvido.",
      descricao: "A solidão pode fazer parecer que ninguém se importa, mas seus sentimentos merecem espaço e conexão.",
      video: "/videos/solidao.mp4",
      audio: "/sons/solidao.mp3",
      reflexao: "Quem poderia receber uma mensagem sua hoje, mesmo que fosse apenas para dizer como você está?",
    },
  },

  {
    id: "sem-esperanca",
    emoji: "🕯️",
    nome: "Sem esperança",
    descricao: "Talvez hoje você não consiga enxergar uma saída, mas não precisa enfrentar isso sozinho.",
    reflexoes: [
      "Você precisa encontrar esperança para a vida inteira ou apenas atravessar este momento?",
      "O fato de você não enxergar uma saída agora não significa que nenhuma exista.",
      "Você não precisa acreditar em tudo de bom que pode acontecer; pode apenas permitir que alguém caminhe ao seu lado.",
      "Mesmo um passo pequeno pode ser importante quando tudo parece impossível.",
      "Sua dor merece apoio real e não precisa ser carregada em silêncio.",
    ],
    sons: [
      { nome: "Piano suave", descricao: "para acolher", arquivo: "/sons/piano.mp3", emoji: "🎹" },
      { nome: "Chuva leve", descricao: "para respirar", arquivo: "/sons/chuva.mp3", emoji: "🌧️" },
      { nome: "Floresta", descricao: "para permanecer presente", arquivo: "/sons/floresta.mp3", emoji: "🌿" },
    ],
    momento: {
      titulo: "Você não precisa atravessar isso sozinho.",
      descricao: "Quando a esperança parece distante, procure alguém de confiança ou apoio profissional. Se houver risco de se machucar, busque ajuda imediata.",
      video: "/videos/sem-esperanca.mp4",
      audio: "/sons/sem-esperanca.mp3",
      reflexao: "Quem poderia estar ao seu lado enquanto você atravessa este momento?",
    },
  },

];

/* =========================================================
   COMPONENTE
========================================================= */

function Reflexao({ irPara, tema, alterarTema }) {
  const [sentimentoSelecionado, setSentimentoSelecionado] = useState(null);
  const [cardAtual, setCardAtual] = useState(0);

  // Reflexões carregadas do Supabase
  const [reflexoesBanco, setReflexoesBanco] = useState([]);
  const [carregandoReflexoes, setCarregandoReflexoes] = useState(false);
  const [erroReflexoes, setErroReflexoes] = useState("");

  // Quantidade de cards vistos desde o último Momento Pulsan
  const [cardsVistos, setCardsVistos] = useState(0);

  const [mostrarMomento, setMostrarMomento] = useState(false);
  const [tipoMomento, setTipoMomento] = useState(null);

  const audioFundoRef = useRef(null);
  const [somAtual, setSomAtual] = useState(null);
  const [tocandoFundo, setTocandoFundo] = useState(false);
  const [erroSom, setErroSom] = useState(false);

  const audioMomentoRef = useRef(null);
  const [tocandoMomentoAudio, setTocandoMomentoAudio] = useState(false);
  const [erroMomentoAudio, setErroMomentoAudio] = useState(false);
  const [frasePulsan, setFrasePulsan] = useState("");
const [carregandoFrasePulsan, setCarregandoFrasePulsan] = useState(false);
const [frasesUsadasPulsan, setFrasesUsadasPulsan] = useState([]);

  // Sequências independentes de vídeos e áudios do Momento Pulsan
  const [videoMomentoAtual, setVideoMomentoAtual] = useState(0);
  const [audioMomentoAtual, setAudioMomentoAtual] = useState(0);

  function obterArquivoDaSequencia(arquivoOriginal, numero) {
    if (!arquivoOriginal || numero === 0) return arquivoOriginal;

    const ponto = arquivoOriginal.lastIndexOf(".");
    const nome = arquivoOriginal.slice(0, ponto);
    const extensao = arquivoOriginal.slice(ponto);

    return `${nome}-${numero + 1}${extensao}`;
  }

  function obterVideoMomento() {
    return obterArquivoDaSequencia(
      sentimento?.momento?.video,
      videoMomentoAtual
    );
  }

  function obterAudioMomento() {
    return obterArquivoDaSequencia(
      sentimento?.momento?.audio,
      audioMomentoAtual
    );
  }

  function avancarVideoMomento() {
    setVideoMomentoAtual((atual) => (atual + 1) % 7);
  }

  function avancarAudioMomento() {
    setAudioMomentoAtual((atual) => (atual + 1) % 7);
  }

  const [arrastando, setArrastando] = useState(false);
  const [posicaoX, setPosicaoX] = useState(0);

  const inicioXRef = useRef(0);
  const pointerIdRef = useRef(null);

  const sentimento = sentimentos.find(
    (item) => item.id === sentimentoSelecionado
  );

  const sentimentoComReflexoes = sentimento
    ? {
        ...sentimento,
        reflexoes:
          reflexoesBanco.length > 0
            ? reflexoesBanco
            : sentimento.reflexoes,
      }
    : null;

  /* =========================================================
     ÁUDIO DE FUNDO
  ========================================================= */

  function pararAudioFundo(reset = true) {
    if (audioFundoRef.current) {
      audioFundoRef.current.pause();

      if (reset) {
        audioFundoRef.current.currentTime = 0;
      }

      audioFundoRef.current = null;
    }

    setTocandoFundo(false);

    if (reset) {
      setSomAtual(null);
    }
  }

  function pausarAudioFundo() {
    if (audioFundoRef.current) {
      audioFundoRef.current.pause();
    }

    setTocandoFundo(false);
  }

  function continuarAudioFundo() {
    const audio = audioFundoRef.current;

    if (!audio) return;

    audio
      .play()
      .then(() => {
        setTocandoFundo(true);
        setErroSom(false);
      })
      .catch(() => {
        setTocandoFundo(false);
        setErroSom(true);
      });
  }

  function tocarSomFundo(som) {
    setErroSom(false);

    if (somAtual === som.arquivo && audioFundoRef.current) {
      if (tocandoFundo) {
        pausarAudioFundo();
      } else {
        continuarAudioFundo();
      }

      return;
    }

    pararAudioFundo(true);

    const audio = new Audio(som.arquivo);

    audio.loop = true;
    audio.volume = 0.45;
    audio.preload = "auto";

    audio.addEventListener("error", () => {
      setErroSom(true);
      setTocandoFundo(false);
    });

    audioFundoRef.current = audio;
    setSomAtual(som.arquivo);

    audio
      .play()
      .then(() => {
        setTocandoFundo(true);
        setErroSom(false);
      })
      .catch(() => {
        setTocandoFundo(false);
        setErroSom(true);
      });
  }

  /* =========================================================
     ÁUDIO DO MOMENTO PULSAN
  ========================================================= */

  function pararAudioMomento() {
    if (audioMomentoRef.current) {
      audioMomentoRef.current.pause();
      audioMomentoRef.current.currentTime = 0;
      audioMomentoRef.current = null;
    }

    setTocandoMomentoAudio(false);
  }

  function tocarAudioMomento() {
    if (!sentimento?.momento?.audio) return;

    setErroMomentoAudio(false);

    if (!audioMomentoRef.current) {
      const audio = new Audio(obterAudioMomento());

      audio.volume = 0.65;
      audio.preload = "auto";

      audio.addEventListener("ended", () => {
        setTocandoMomentoAudio(false);
        avancarAudioMomento();
        audioMomentoRef.current = null;
      });

      audio.addEventListener("error", () => {
        setTocandoMomentoAudio(false);
        setErroMomentoAudio(true);
      });

      audioMomentoRef.current = audio;
    }

    if (tocandoMomentoAudio) {
      audioMomentoRef.current.pause();
      setTocandoMomentoAudio(false);
      return;
    }

    audioMomentoRef.current
      .play()
      .then(() => {
        setTocandoMomentoAudio(true);
        setErroMomentoAudio(false);
      })
      .catch(() => {
        setTocandoMomentoAudio(false);
        setErroMomentoAudio(true);
      });
  }

  /* =========================================================
     ESCOLHER SENTIMENTO
  ========================================================= */

  async function carregarFrasePulsan(id) {
  setCarregandoFrasePulsan(true);

  const sentimentoBanco =
    id === "pensando"
      ? "pensando demais"
      : id === "medo"
        ? "com medo"
        : id;

  const { data, error } = await supabase
    .from("frases_pulsan")
    .select("id, frase")
    .eq("sentimento", sentimentoBanco)
    .eq("ativa", true);

  if (error) {
    console.error("Erro ao carregar frase Pulsan:", error);

    setFrasePulsan(
      "Você não precisa enfrentar tudo sozinho."
    );

    setCarregandoFrasePulsan(false);
    return;
  }

  if (data && data.length > 0) {
    let frasesDisponiveis = data.filter(
      (item) => !frasesUsadasPulsan.includes(item.id)
    );

    if (frasesDisponiveis.length === 0) {
      frasesDisponiveis = data;
      setFrasesUsadasPulsan([]);
    }

    const fraseAleatoria =
      frasesDisponiveis[
        Math.floor(Math.random() * frasesDisponiveis.length)
      ];

    setFrasePulsan(fraseAleatoria.frase);

    setFrasesUsadasPulsan((anteriores) => [
      ...anteriores,
      fraseAleatoria.id,
    ]);
  } else {
    setFrasePulsan(
      "Você merece cuidado, acolhimento e compreensão."
    );
  }

  setCarregandoFrasePulsan(false);
}

 
  async function escolherSentimento(id) {
    pararAudioFundo(true);
    pararAudioMomento();

    // Entra imediatamente no sentimento escolhido.
    setSentimentoSelecionado(id);
    setVideoMomentoAtual(0);
    setAudioMomentoAtual(0);
    carregarFrasePulsan(id);
    setCardAtual(0);
    setCardsVistos(0);
    setMostrarMomento(false);
    setTipoMomento(null);
    setErroSom(false);
    setErroMomentoAudio(false);
    setPosicaoX(0);
    setErroReflexoes("");
    setReflexoesBanco([]);
    setCarregandoReflexoes(true);


    const sentimentoBanco =
      id === "pensando"
        ? "pensando demais"
        : id === "medo"
          ? "com medo"
          : id;

    const { data, error } = await supabase
      .from("reflexoes")
      .select("id, mensagem, situacao, horario")
      .eq("sentimento", sentimentoBanco)
      .eq("ativa", true)
      .limit(200);

    if (error) {
      console.error("Erro ao carregar reflexões do Supabase:", error);
      setErroReflexoes(
        "Não foi possível carregar as reflexões do banco."
      );
      setCarregandoReflexoes(false);
      return;
    }

    // Remove duplicadas ANTES de embaralhar as reflexões.
    // A comparação ignora maiúsculas/minúsculas e espaços extras.
    const mapaReflexoes = new Map();

    (data || []).forEach((item) => {
      const mensagem = String(item?.mensagem || "").trim();

      if (!mensagem) return;

      const chave = mensagem
        .replace(/\s+/g, " ")
        .toLowerCase();

      if (!mapaReflexoes.has(chave)) {
        mapaReflexoes.set(chave, mensagem);
      }
    });

    // Embaralha somente depois de garantir que não existem repetidas.
    const reflexoesEmbaralhadas = Array.from(
      mapaReflexoes.values()
    ).sort(() => Math.random() - 0.5);

    setReflexoesBanco(reflexoesEmbaralhadas);
    setCarregandoReflexoes(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /* =========================================================
     CONTAR PASSAGEM DE CARD
  ========================================================= */

  function registrarPassagemCard() {
    if (!sentimento || mostrarMomento) return false;

    const novoTotal = cardsVistos + 1;

    // A contagem é interna e considera tanto direita quanto esquerda.
    if (novoTotal >= 10) {
      setCardsVistos(10);

      // Pausa o som de fundo sem perder a posição
      pausarAudioFundo();

      setTipoMomento(null);
      setMostrarMomento(true);
      if (sentimentoSelecionado) {
  carregarFrasePulsan(sentimentoSelecionado);
}

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return true;
    }

    setCardsVistos(novoTotal);
    return false;
  }

  /* =========================================================
     AVANÇAR CARD — ESQUERDA
  ========================================================= */

  function avancarCard() {
    if (!sentimento || mostrarMomento) return;

    setPosicaoX(0);

    // Passar para a esquerda também conta como uma reflexão vista.
    if (registrarPassagemCard()) return;

    setCardAtual(
      (atual) =>
        (atual + 1) % sentimentoComReflexoes.reflexoes.length
    );
  }

  /* =========================================================
     VOLTAR CARD — DIREITA
  ========================================================= */

  function voltarCard() {
    if (!sentimento || mostrarMomento) return;

    setPosicaoX(0);

    // Passar para a direita também conta como uma reflexão vista.
    if (registrarPassagemCard()) return;

    setCardAtual((atual) =>
      atual === 0
        ? sentimentoComReflexoes.reflexoes.length - 1
        : atual - 1
    );
  }

  /* =========================================================
     ARRASTAR CARD
  ========================================================= */

  function iniciarArrasto(e) {
    if (e.pointerType === "mouse" && e.button !== 0) {
      return;
    }

    pointerIdRef.current = e.pointerId;
    inicioXRef.current = e.clientX;

    setArrastando(true);

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch (_) {}
  }

  function moverArrasto(e) {
    if (
      !arrastando ||
      pointerIdRef.current !== e.pointerId
    ) {
      return;
    }

    const distancia =
      e.clientX - inicioXRef.current;

    setPosicaoX(distancia);
  }

  function finalizarArrasto(e) {
    if (
      !arrastando ||
      pointerIdRef.current !== e.pointerId
    ) {
      return;
    }

    const distancia =
      e.clientX - inicioXRef.current;

    setArrastando(false);
    pointerIdRef.current = null;

    try {
      e.currentTarget.releasePointerCapture(
        e.pointerId
      );
    } catch (_) {}

    if (distancia < -90) {
      avancarCard();
      return;
    }

    if (distancia > 90) {
      voltarCard();
      return;
    }

    setPosicaoX(0);
  }

  /* =========================================================
     CONTINUAR REFLEXÕES
  ========================================================= */

  function continuarReflexoes() {
    if (!sentimento) return;

    /*
      Fecha o Momento Pulsan.
    */

    setMostrarMomento(false);
    setTipoMomento(null);

    /*
      MUITO IMPORTANTE:

      Reinicia a sequência.

      Assim:
      10 cards
      Momento
      10 novos cards
      Momento novamente
    */

    setCardsVistos(0);

    /*
      Avança para o próximo card.
    */

    setCardAtual(
      (atual) =>
        (atual + 1) % sentimentoComReflexoes.reflexoes.length
    );

    /*
      Retoma o som exatamente de onde parou.
    */

    continuarAudioFundo();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /* =========================================================
     VOLTAR PARA SENTIMENTOS
  ========================================================= */

  function voltarSentimentos() {
    pararAudioFundo(true);
    pararAudioMomento();

    setSentimentoSelecionado(null);
    setCardAtual(0);
    setCardsVistos(0);
    setMostrarMomento(false);
    setTipoMomento(null);

    setErroSom(false);
    setErroMomentoAudio(false);
    setPosicaoX(0);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /* =========================================================
     LIMPEZA DOS ÁUDIOS
  ========================================================= */

  useEffect(() => {
    return () => {
      if (audioFundoRef.current) {
        audioFundoRef.current.pause();
        audioFundoRef.current = null;
      }

      if (audioMomentoRef.current) {
        audioMomentoRef.current.pause();
        audioMomentoRef.current = null;
      }
    };
  }, []);

  /* =========================================================
     TELA DE SENTIMENTOS
  ========================================================= */

  if (!sentimento) {
    return (
      <div style={styles.page}>
        <Header irPara={irPara} />

        <main style={styles.container}>
          <section style={styles.topo}>
            <div style={styles.tag}>
              REFLEXÃO
            </div>

            <h1 style={styles.titulo}>
              Como você está se sentindo?
            </h1>

            <p style={styles.subtitulo}>
              Não precisa explicar. Escolha apenas aquilo
              que mais se aproxima de você neste momento.
            </p>
          </section>

          <section style={styles.sentimentosGrid}>
            {sentimentos.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  escolherSentimento(item.id)
                }
                style={styles.sentimentoCard}
              >
                <span style={styles.sentimentoEmoji}>
                  {item.emoji}
                </span>

                <span style={styles.sentimentoNome}>
                  {item.nome}
                </span>

                <span style={styles.sentimentoDescricao}>
                  {item.descricao}
                </span>
              </button>
            ))}
          </section>

          <div style={styles.fraseInicio}>
            <span>✦</span>

            <p>
              Você não precisa saber exatamente o que
              sente. Pode simplesmente começar por onde
              estiver.
            </p>
          </div>
        </main>

        <MenuInferior />
      </div>
    );
  }

  /* =========================================================
     MOMENTO PULSAN
  ========================================================= */

  if (mostrarMomento) {
    return (
      <div style={styles.page}>
        <Header irPara={irPara} />

        <main style={styles.container}>
          <button
            type="button"
            onClick={voltarSentimentos}
            style={styles.voltar}
          >
            ← Escolher outro momento
          </button>

          <section style={styles.momento}>
            <div style={styles.momentoTag}>
              ✨ MOMENTO PULSAN
            </div>

            <h1 style={styles.momentoTitulo}>
              {sentimento.momento.titulo}
            </h1>

            <p style={styles.momentoIntro}>
              {sentimento.momento.descricao}
            </p>

            {/* =================================================
                VÍDEO
            ================================================= */}

            <div style={styles.conteudoProfundo}>
              <button
                type="button"
                onClick={() =>
                  setTipoMomento(
                    tipoMomento === "video"
                      ? null
                      : "video"
                  )
                }
                style={styles.conteudoBotao}
              >
                <div style={styles.conteudoIcone}>
                  ▶
                </div>

                <div style={styles.conteudoTexto}>
                  <strong>
                    Ouça alguém falar sobre isso
                  </strong>

                  <span>
                    Um vídeo curto para aprofundar
                    sua reflexão.
                  </span>
                </div>

                <span style={styles.seta}>
                  →
                </span>
              </button>

              {tipoMomento === "video" && (
                <div style={styles.areaVideo}>
                  <video
                    key={obterVideoMomento()}
                    controls
                    playsInline
                    preload="metadata"
                    style={styles.video}
                    onEnded={avancarVideoMomento}
                    onError={() =>
                      setTipoMomento("videoErro")
                    }
                  >
                    <source
                      src={obterVideoMomento()}
                      type="video/mp4"
                    />

                    Seu navegador não suporta vídeo.
                  </video>

                  <p style={styles.videoAviso}>
                    O vídeo precisa estar em{" "}
                    <strong>
                      public/videos
                    </strong>
                    .
                  </p>
                </div>
              )}

              {tipoMomento === "videoErro" && (
                <div style={styles.erroSom}>
                  Não foi possível abrir este vídeo.
                  Verifique se o arquivo existe em{" "}
                  <strong>
                    public/videos
                  </strong>{" "}
                  e se o nome termina em{" "}
                  <strong>.mp4</strong>.
                </div>
              )}
            </div>

            {/* =================================================
                ÁUDIO
            ================================================= */}

            <div style={styles.conteudoProfundo}>
              <button
                type="button"
                onClick={() =>
                  setTipoMomento(
                    tipoMomento === "audio"
                      ? null
                      : "audio"
                  )
                }
                style={styles.conteudoBotao}
              >
                <div style={styles.conteudoIconeAudio}>
                  🎧
                </div>

                <div style={styles.conteudoTexto}>
                  <strong>
                    Um áudio para este momento
                  </strong>

                  <span>
                    Para desacelerar e permanecer com
                    a reflexão.
                  </span>
                </div>

                <span style={styles.seta}>
                  →
                </span>
              </button>

              {tipoMomento === "audio" && (
                <div style={styles.audioMomento}>
                  <div style={styles.audioMomentoIcone}>
                    🎧
                  </div>

                  <div style={styles.audioMomentoTexto}>
                    <strong>
                      Áudio para este momento
                    </strong>

                    <span>
                      Toque para ouvir.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={tocarAudioMomento}
                    style={styles.playPequeno}
                  >
                    {tocandoMomentoAudio
                      ? "❚❚"
                      : "▶"}
                  </button>
                </div>
              )}

              {tipoMomento === "audio" &&
                erroMomentoAudio && (
                  <div style={styles.erroSom}>
                    Este áudio não foi encontrado.
                    Coloque o arquivo em{" "}
                    <strong>
                      public/sons
                    </strong>{" "}
                    e confira o nome no código.
                  </div>
                )}
            </div>

            {/* =================================================
                REFLEXÃO PROFUNDA
            ================================================= */}

            <div style={styles.conteudoProfundo}>
              <button
                type="button"
                onClick={() =>
                  setTipoMomento(
                    tipoMomento === "reflexao"
                      ? null
                      : "reflexao"
                  )
                }
                style={styles.conteudoBotao}
              >
                <div style={styles.conteudoIconeReflexao}>
                  💭
                </div>

                <div style={styles.conteudoTexto}>
                  <strong>
                    Uma reflexão para levar com você
                  </strong>

                  <span>
                    Uma pergunta para continuar
                    pensando depois daqui.
                  </span>
                </div>

                <span style={styles.seta}>
                  →
                </span>
              </button>

              {tipoMomento === "reflexao" && (
                <div style={styles.reflexaoProfunda}>
                  <span style={styles.quotation}>
                    “
                  </span>

                 <p style={styles.reflexaoTexto}>
  {carregandoFrasePulsan
    ? "Preparando uma frase para este momento..."
    : frasePulsan ||
      "Você não precisa enfrentar tudo sozinho."}
</p>

                  <span style={styles.quotation}>
                    ”
                  </span>
                </div>
              )}
            </div>

            {/* =================================================
                CONTINUAR
            ================================================= */}

            <button
              type="button"
              onClick={continuarReflexoes}
              style={styles.continuar}
            >
              Continuar reflexões →
            </button>

            <button
              type="button"
              onClick={voltarSentimentos}
              style={styles.outroSentimento}
            >
              Quero escolher outro momento
            </button>
          </section>
        </main>

        <MenuInferior />
      </div>
    );
  }

  /* =========================================================
     FLASH CARD
  ========================================================= */

  if (carregandoReflexoes) {
    return (
      <div style={styles.page}>
        <Header irPara={irPara} />
        <main style={styles.container}>
          <div style={styles.fraseInicio}>
            <p>Carregando suas reflexões...</p>
          </div>
        </main>
        <MenuInferior />
      </div>
    );
  }

  if (erroReflexoes) {
    return (
      <div style={styles.page}>
        <Header irPara={irPara} />
        <main style={styles.container}>
          <button
            type="button"
            onClick={voltarSentimentos}
            style={styles.voltar}
          >
            ← Voltar
          </button>
          <div style={styles.fraseInicio}>
            <p>{erroReflexoes}</p>
          </div>
        </main>
        <MenuInferior />
      </div>
    );
  }

  const reflexaoAtual =
    sentimentoComReflexoes.reflexoes[cardAtual];

  return (
    <div style={styles.page}>
      <Header irPara={irPara} />

      <main style={styles.container}>
        <button
          type="button"
          onClick={voltarSentimentos}
          style={styles.voltar}
        >
          ← {sentimento.emoji} {sentimento.nome}
        </button>

        {/* =================================================
            FLASH CARD
        ================================================= */}

        <section
          key={`reflexao-${cardAtual}-${reflexaoAtual}`}
          style={{
            ...styles.flashCard,

            transform: `
              translateX(${posicaoX}px)
              rotate(${posicaoX * 0.04}deg)
            `,

            transition: arrastando
              ? "none"
              : "transform 0.25s ease",

            cursor: arrastando
              ? "grabbing"
              : "grab",

            userSelect: "none",
            touchAction: "none",
          }}
          onPointerDown={iniciarArrasto}
          onPointerMove={moverArrasto}
          onPointerUp={finalizarArrasto}
          onPointerCancel={finalizarArrasto}
        >
          <div style={styles.flashCardTopo}>
            <span>
              {sentimento.emoji}
            </span>

            <span>
              {sentimento.nome}
            </span>
          </div>

          <p style={styles.flashFrase}>
            “{reflexaoAtual}”
          </p>

          <div style={styles.flashCardRodape}>
            <span>✦</span>

            <small>
              Apenas leia. Não precisa responder.
            </small>
          </div>
        </section>

        {/* =================================================
            INDICAÇÃO
        ================================================= */}

        <div style={styles.arrasteIndicacao}>
          <span>←</span>

          <span>
            Arraste o card para mudar
          </span>

          <span>→</span>
        </div>

        {/* =================================================
            SONS
        ================================================= */}

        <section style={styles.sonsArea}>
          <div style={styles.sonsTitulo}>
            Sons para este momento
          </div>

          <div style={styles.sonsLista}>
            {sentimento.sons.map(
              (som, index) => {
                const estaTocando =
                  somAtual === som.arquivo &&
                  tocandoFundo;

                return (
                  <button
                    key={`${som.arquivo}-${index}`}
                    type="button"
                    onClick={() =>
                      tocarSomFundo(som)
                    }
                    style={
                      estaTocando
                        ? styles.somAtivo
                        : styles.som
                    }
                  >
                    <span style={styles.somEmoji}>
                      {som.emoji}
                    </span>

                    <span style={styles.somInfo}>
                      <strong>
                        {som.nome}
                      </strong>

                      <small>
                        {som.descricao}
                      </small>
                    </span>

                    <span style={styles.somPlay}>
                      {estaTocando
                        ? "❚❚"
                        : "▶"}
                    </span>
                  </button>
                );
              }
            )}
          </div>

          {erroSom && (
            <div style={styles.erroSom}>
              Este áudio não foi encontrado ou não
              pôde ser reproduzido.
              <br />
              Coloque o arquivo correspondente em{" "}
              <strong>
                public/sons
              </strong>
              .
            </div>
          )}
        </section>

        <p style={styles.pequenaMensagem}>
          Você não precisa encontrar respostas agora.
          Apenas permita-se pensar.
        </p>
      </main>

      <MenuInferior />
    </div>
  );
}

/* =========================================================
   HEADER
========================================================= */

function Header({ irPara }) {
  return (
    <header style={styles.header}>
      <button
        onClick={() =>
          irPara &&
          irPara("inicio")
        }
        style={styles.logoButton}
      >
        <img
          src="/logo.png"
          alt="Logo Pulsan"
          style={styles.logo}
        />

        <div>
          <div style={styles.logoTexto}>
            PULSAN
          </div>

          <div style={styles.logoSubtexto}>
            um espaço para você
          </div>
        </div>
      </button>

      <div style={styles.headerPerfil}>
        👤
      </div>
    </header>
  );
}

/* =========================================================
   MENU
========================================================= */

function MenuInferior() {
  return (
    <nav style={styles.menu}>
      <div style={styles.menuItem}>
        <span>🏠</span>
        <small>Início</small>
      </div>

      <div style={styles.menuItem}>
        <span>💬</span>
        <small>Conversas</small>
      </div>

      <div
        style={{
          ...styles.menuItem,
          ...styles.menuAtivo,
        }}
      >
        <span>💭</span>
        <small>Reflexão</small>
      </div>

      <div style={styles.menuItem}>
        <span>👤</span>
        <small>Perfil</small>
      </div>
    </nav>
  );
}

/* =========================================================
   ESTILOS
========================================================= */

const styles = {
  page: {
    minHeight: "100vh",
    width: "100%",
    background: "#fffdf9",
    color: "#173b38",
    fontFamily:
      "Arial, Helvetica, sans-serif",
    paddingBottom: "100px",
    boxSizing: "border-box",
  },

  header: {
    width: "100%",
    minHeight: "72px",
    padding: "10px 5%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#ffffff",
    borderBottom: "1px solid #eeeeee",
    boxSizing: "border-box",
  },

  logoButton: {
    border: "none",
    background: "transparent",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    padding: 0,
  },

  logo: {
    width: "43px",
    height: "43px",
    objectFit: "contain",
  },

  logoTexto: {
    fontSize: "18px",
    fontWeight: "800",
    letterSpacing: "3px",
    color: "#173b38",
  },

  logoSubtexto: {
    color: "#999999",
    fontSize: "10px",
    marginTop: "2px",
  },

  headerPerfil: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "#f1f8f7",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
  },

  container: {
    width: "92%",
    maxWidth: "900px",
    margin: "0 auto",
    paddingTop: "40px",
    boxSizing: "border-box",
  },

  topo: {
    textAlign: "center",
    marginBottom: "38px",
  },

  tag: {
    color: "#20adb0",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "4px",
    marginBottom: "10px",
  },

  titulo: {
    fontSize: "clamp(30px, 5vw, 43px)",
    lineHeight: "1.15",
    margin: 0,
    color: "#173b38",
  },

  subtitulo: {
    maxWidth: "620px",
    margin: "15px auto 0",
    color: "#808080",
    fontSize: "15px",
    lineHeight: "1.6",
  },

  sentimentosGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "13px",
  },

  sentimentoCard: {
    border: "1px solid #e1ebe9",
    background: "#ffffff",
    borderRadius: "18px",
    padding: "20px 14px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "145px",
    cursor: "pointer",
    boxShadow:
      "0 4px 18px rgba(0,0,0,0.035)",
  },

  sentimentoEmoji: {
    fontSize: "29px",
    marginBottom: "8px",
  },

  sentimentoNome: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#234542",
  },

  sentimentoDescricao: {
    fontSize: "11px",
    color: "#999999",
    textAlign: "center",
    lineHeight: "1.4",
    marginTop: "5px",
  },

  fraseInicio: {
    maxWidth: "580px",
    margin: "35px auto 0",
    display: "flex",
    gap: "10px",
    alignItems: "flex-start",
    justifyContent: "center",
    color: "#888888",
    textAlign: "center",
    fontSize: "13px",
    lineHeight: "1.5",
  },

  voltar: {
    border: "none",
    background: "transparent",
    color: "#20adb0",
    cursor: "pointer",
    fontSize: "14px",
    padding: "5px 0",
    marginBottom: "22px",
  },

  flashCard: {
    maxWidth: "700px",
    minHeight: "390px",
    margin: "0 auto",
    background: "#ffffff",
    border: "1px solid #e4eceb",
    borderRadius: "28px",
    padding: "45px 40px",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    boxShadow:
      "0 10px 35px rgba(0,0,0,0.045)",
  },

  flashCardTopo: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    color: "#20adb0",
    fontSize: "13px",
    fontWeight: "700",
    marginBottom: "30px",
  },

  flashFrase: {
    textAlign: "center",
    color: "#234542",
    fontSize:
      "clamp(22px, 3vw, 30px)",
    lineHeight: "1.55",
    fontWeight: "600",
    margin: 0,
  },

  flashCardRodape: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "7px",
    marginTop: "35px",
    color: "#aaaaaa",
  },

  arrasteIndicacao: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "12px",
    marginTop: "12px",
    color: "#aaaaaa",
    fontSize: "12px",
  },

  sonsArea: {
    maxWidth: "700px",
    margin: "18px auto 0",
  },

  sonsTitulo: {
    color: "#8a8a8a",
    fontSize: "12px",
    marginBottom: "9px",
    paddingLeft: "4px",
  },

  sonsLista: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },

  som: {
    border: "1px solid #e4ebea",
    background: "#ffffff",
    borderRadius: "12px",
    padding: "7px 10px",
    display: "flex",
    alignItems: "center",
    gap: "7px",
    cursor: "pointer",
    color: "#496663",
    minHeight: "42px",
  },

  somAtivo: {
    border: "1px solid #20adb0",
    background: "#f0fbfa",
    borderRadius: "12px",
    padding: "7px 10px",
    display: "flex",
    alignItems: "center",
    gap: "7px",
    cursor: "pointer",
    color: "#168f92",
    minHeight: "42px",
  },

  somEmoji: {
    fontSize: "16px",
  },

  somInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    lineHeight: "1.2",
  },

  somPlay: {
    fontSize: "12px",
    marginLeft: "3px",
  },

  erroSom: {
    marginTop: "9px",
    padding: "9px 12px",
    borderRadius: "10px",
    background: "#fff8ef",
    color: "#9a7650",
    fontSize: "11px",
    lineHeight: "1.5",
  },

  pequenaMensagem: {
    textAlign: "center",
    color: "#aaaaaa",
    fontSize: "12px",
    lineHeight: "1.5",
    margin: "13px auto 0",
    maxWidth: "400px",
  },

  /* =======================================================
     MOMENTO PULSAN
  ======================================================= */

  momento: {
    maxWidth: "750px",
    margin: "0 auto",
    background: "#f3faf9",
    border: "1px solid #dceceb",
    borderRadius: "28px",
    padding: "40px",
    boxSizing: "border-box",
  },

  momentoTag: {
    textAlign: "center",
    color: "#20adb0",
    fontSize: "12px",
    fontWeight: "800",
    letterSpacing: "3px",
  },

  momentoTitulo: {
    textAlign: "center",
    color: "#173b38",
    fontSize:
      "clamp(27px, 4vw, 37px)",
    lineHeight: "1.2",
    margin: "12px 0 12px",
  },

  momentoIntro: {
    maxWidth: "570px",
    margin: "0 auto 28px",
    textAlign: "center",
    color: "#777777",
    fontSize: "14px",
    lineHeight: "1.6",
  },

  conteudoProfundo: {
    marginTop: "10px",
  },

  conteudoBotao: {
    width: "100%",
    border: "1px solid #dce7e6",
    background: "#ffffff",
    borderRadius: "17px",
    padding: "14px",
    display: "flex",
    alignItems: "center",
    gap: "13px",
    cursor: "pointer",
    textAlign: "left",
    boxSizing: "border-box",
  },

  conteudoIcone: {
    width: "45px",
    height: "45px",
    minWidth: "45px",
    borderRadius: "50%",
    background: "#20adb0",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "17px",
  },

  conteudoIconeAudio: {
    width: "45px",
    height: "45px",
    minWidth: "45px",
    borderRadius: "50%",
    background: "#edf7f6",
    color: "#20adb0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
  },

  conteudoIconeReflexao: {
    width: "45px",
    height: "45px",
    minWidth: "45px",
    borderRadius: "50%",
    background: "#edf7f6",
    color: "#20adb0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "19px",
  },

  conteudoTexto: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    minWidth: 0,
  },

  seta: {
    color: "#20adb0",
    fontSize: "21px",
  },

  areaVideo: {
    background: "#ffffff",
    padding: "10px",
    borderRadius: "15px",
    marginTop: "8px",
  },

  video: {
    width: "100%",
    maxHeight: "480px",
    display: "block",
    borderRadius: "10px",
    background: "#111111",
  },

  videoAviso: {
    color: "#999999",
    fontSize: "11px",
    lineHeight: "1.5",
    margin: "8px 4px 2px",
  },

  audioMomento: {
    marginTop: "8px",
    background: "#ffffff",
    borderRadius: "15px",
    padding: "12px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  audioMomentoIcone: {
    fontSize: "22px",
  },

  audioMomentoTexto: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "3px",
    fontSize: "13px",
  },

  playPequeno: {
    width: "38px",
    height: "38px",
    border: "none",
    borderRadius: "50%",
    background: "#20adb0",
    color: "#ffffff",
    cursor: "pointer",
  },

  reflexaoProfunda: {
    marginTop: "8px",
    padding: "24px",
    background: "#ffffff",
    borderRadius: "17px",
    textAlign: "center",
    color: "#234542",
  },

  reflexaoTexto: {
    fontSize: "20px",
    lineHeight: "1.6",
    margin: "5px 0",
    fontWeight: "600",
  },

  quotation: {
    fontSize: "30px",
    color: "#20adb0",
  },

  continuar: {
    width: "100%",
    border: "none",
    background: "#20adb0",
    color: "#ffffff",
    padding: "15px",
    borderRadius: "13px",
    marginTop: "25px",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: "700",
  },

  outroSentimento: {
    display: "block",
    margin: "13px auto 0",
    border: "none",
    background: "transparent",
    color: "#20adb0",
    cursor: "pointer",
    fontSize: "13px",
  },

  /* =======================================================
     MENU
  ======================================================= */

  menu: {
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 0,
    height: "72px",
    background: "#ffffff",
    borderTop: "1px solid #e5e5e5",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-around",
    zIndex: 1000,
    boxSizing: "border-box",
  },

  menuItem: {
    minWidth: "65px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "3px",
    color: "#858585",
    fontSize: "19px",
  },

  menuAtivo: {
    color: "#20adb0",
    fontWeight: "700",
  },
};

/* =========================================================
   RESPONSIVIDADE
========================================================= */

if (
  typeof document !== "undefined" &&
  !document.getElementById(
    "pulsan-reflexao-responsive"
  )
) {
  const style =
    document.createElement("style");

  style.id =
    "pulsan-reflexao-responsive";

  style.innerHTML = `
    @media (max-width: 700px) {
      .pulsan-mobile {
        width: 100%;
      }
    }

    @media (max-width: 600px) {
      body {
        overflow-x: hidden;
      }
    }

    @media (max-width: 500px) {
      button {
        -webkit-tap-highlight-color: transparent;
      }
    }
  `;

  document.head.appendChild(style);
}

export default Reflexao;