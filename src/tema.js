export function aplicarTema(tema) {
  document.documentElement.setAttribute(
    "data-theme",
    tema
  );

  localStorage.setItem(
    "pulsanTema",
    tema
  );
}


export function carregarTema() {
  const temaSalvo =
    localStorage.getItem("pulsanTema");

  const tema =
    temaSalvo || "claro";

  document.documentElement.setAttribute(
    "data-theme",
    tema
  );

  return tema;
}