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

  document.getElementById("send-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const toEmail = document.getElementById("to").value;
    const subject = document.getElementById("subject").value;
    const body = document.getElementById("body").value;
    let { data: users, error } = await supabase.rpc("get_user_by_email", { email: toEmail });
    if (error || !users || users.length === 0) { alert("Usuário não encontrado."); return; }
    const receiverId = users[0].id;
    await supabase.from("messages").insert([{ sender: currentUser.id, receiver: receiverId, subject, body }]);
    e.target.reset();
  });
  
};

// Carrega o modal assim que a página abrir
loadMessageModal();








