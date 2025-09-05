// modal-loader.js

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const SUPABASE_URL = 'https://qnxvprptwczutzojjyve.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFueHZwcnB0d2N6dXR6b2pqeXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MzIxMjAsImV4cCI6MjA2OTMwODEyMH0.oBi3ZBvEIBUzsaAPvYRJIhAZlJuetYVMcxFTRs_gBio';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function loadMessageModal() {
  const container = document.createElement("div");
  document.body.appendChild(container);

  try {
    const basePath = window.location.pathname.substring(0, window.location.pathname.lastIndexOf("/") + 1);
    const response = await fetch(basePath + "modal-MultMessage.html");

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const html = await response.text();
    container.innerHTML = html;

    console.log("✅ Modal carregado no DOM");
  } catch (error) {
    console.error("❌ Erro ao carregar modal:", error);
  }
}

window.openMessageModal = function (to = "", subject = "", body = "") {
  const modalEl = document.getElementById("newMessageModal");

  if (!modalEl) {
    alert("Modal ainda não carregado, aguarde...");
    return;
  }

  // Se recebeu um destinatário (caso approve/reprove), guardamos ele
  if (to) {
    modalEl.setAttribute("data-fixed-to", to);
  } else {
    modalEl.removeAttribute("data-fixed-to");
  }

  if (subject) document.getElementById("subject").value = subject;
  if (body) document.getElementById("body").value = body;

  const modal = new bootstrap.Modal(modalEl);
  modal.show();

  const sendForm = document.getElementById("send-form");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data: { user: currentUser }, error: sessionError } = await supabase.auth.getUser();
    if (sessionError || !currentUser) {
      alert("Erro de autenticação. Faça login novamente.");
      return;
    }

    const subjectValue = document.getElementById("subject").value;
    const bodyValue = document.getElementById("body").value;

    // Caso 1: envio para responsável (um único email)
    if (modalEl.hasAttribute("data-fixed-to")) {
      const toEmail = modalEl.getAttribute("data-fixed-to");

      let { data: users, error } = await supabase.from("users").select("id").eq("email", toEmail);
      if (error || !users || users.length === 0) {
        alert("Responsável não encontrado.");
        return;
      }

      const receiverId = users[0].id;

      const { error: insertError } = await supabase.from("messages").insert([
        { sender: currentUser.id, receiver: receiverId, subject: subjectValue, body: bodyValue }
      ]);

      if (insertError) {
        alert("Erro ao enviar: " + insertError.message);
      } else {
        alert("Mensagem enviada com sucesso ao responsável!");
        e.target.reset();
        modal.hide();
      }
      return;
    }

    // Caso 2: envio normal para múltiplos sites
    const selectedSites = Array.from(document.querySelectorAll(".site-checkbox:checked")).map(cb => cb.value);
    if (selectedSites.length === 0) {
      alert("Selecione pelo menos um site.");
      return;
    }

    let { data: users, error } = await supabase
      .from("users")
      .select("id, email, site_region")
      .in("site_region", selectedSites);

    if (error || !users || users.length === 0) {
      alert("Nenhum usuário encontrado nos sites selecionados.");
      return;
    }

    const messages = users.map(u => ({
      sender: currentUser.id,
      receiver: u.id,
      subject: subjectValue,
      body: bodyValue
    }));

    const { error: insertError } = await supabase.from("messages").insert(messages);

    if (insertError) {
      alert("Erro ao enviar: " + insertError.message);
    } else {
      alert(`Mensagem enviada com sucesso para ${users.length} usuários.`);
      e.target.reset();
      modal.hide();
    }
  };

  sendForm.replaceWith(sendForm.cloneNode(true));
  document.getElementById("send-form").addEventListener("submit", handleSubmit);
};


window.toggleAllSites = function(select) {
  const checkboxes = document.querySelectorAll(".site-checkbox");
  checkboxes.forEach(cb => cb.checked = select);
};

// Carrega o modal assim que a página abrir
loadMessageModal();
