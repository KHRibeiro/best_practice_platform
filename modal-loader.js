// modal-loader.js
async function loadMessageModal() {
  const container = document.createElement("div");
  document.body.appendChild(container);

  try {
    const response = await fetch("modal-mensagem.html");
    container.innerHTML = await response.text();
  } catch (error) {
    console.error("Erro ao carregar modal de mensagem:", error);
  }
}

// Carregar automaticamente quando a página abrir
loadMessageModal();
