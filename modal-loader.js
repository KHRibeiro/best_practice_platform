// modal-loader.js
async function loadMessageModal() {
  const container = document.createElement("div");
  document.body.appendChild(container);

  try {
    const response = await fetch("modal-mensagem.html");
    container.innerHTML = await response.text();
    document.dispatchEvent(new Event("modalLoaded")); // 🔔 dispara evento
  } catch (error) {
    console.error("Erro ao carregar modal de mensagem:", error);
  }
}

loadMessageModal();
