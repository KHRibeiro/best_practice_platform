// modal-loader.js
async function loadMessageModal() {
  const container = document.createElement("div");
  document.body.appendChild(container);

  try {
    const response = await fetch("modal-mensagem.html");
    container.innerHTML = await response.text();
    console.log("✅ Modal carregado");
  } catch (error) {
    console.error("Erro ao carregar modal de mensagem:", error);
  }
}

// Função global para abrir o modal com segurança
window.openMessageModal = function (to = "", subject = "", body = "") {
  const modalEl = document.getElementById("newMessageModal");
  if (!modalEl) {
    alert("Modal ainda não carregado, aguarde...");
    return;
  }

  // Preenche os campos, se fornecidos
  if (to) document.getElementById("to").value = to;
  if (subject) document.getElementById("subject").value = subject;
  if (body) document.getElementById("body").value = body;

  // Abre o modal usando API do Bootstrap
  const modal = new bootstrap.Modal(modalEl);
  modal.show();
};

// Carrega o modal assim que a página abre
loadMessageModal();
