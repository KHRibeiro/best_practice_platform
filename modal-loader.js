// modal-loader.js
async function loadMessageModal() {
  const container = document.createElement("div");
  document.body.appendChild(container);

  try {
    // Monta o caminho do arquivo no mesmo diretório da página atual
    const basePath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/") + 1);
    const response = await fetch(basePath + "modal-mensagem.html");

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const html = await response.text();
    container.innerHTML = html;

    console.log("✅ Modal carregado no DOM");
  } catch (error) {
    console.error("❌ Erro ao carregar modal:", error);
  }
}

// Função global para abrir o modal com segurança
window.openMessageModal = function (to = "", subject = "", body = "") {
  const modalEl = document.getElementById("newMessageModal");

  if (!modalEl) {
    alert("Modal ainda não carregado, aguarde...");
    return;
  }

  // Preenche os campos se valores forem passados
  if (to) document.getElementById("to").value = to;
  if (subject) document.getElementById("subject").value = subject;
  if (body) document.getElementById("body").value = body;

  // Abre o modal usando API do Bootstrap
  const modal = new bootstrap.Modal(modalEl);
  modal.show();
};

// Carrega o modal assim que a página abrir
loadMessageModal();
