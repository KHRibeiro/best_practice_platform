// modal-loader.js

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

  const SUPABASE_URL = 'https://qnxvprptwczutzojjyve.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFueHZwcnB0d2N6dXR6b2pqeXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MzIxMjAsImV4cCI6MjA2OTMwODEyMH0.oBi3ZBvEIBUzsaAPvYRJIhAZlJuetYVMcxFTRs_gBio';
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentUser = null;

async function loadMessageModal() {
  const container = document.createElement("div");
  document.body.appendChild(container);

  try {
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

  if (to) document.getElementById("to").value = to;
  if (subject) document.getElementById("subject").value = subject;
  if (body) document.getElementById("body").value = body;

  const modal = new bootstrap.Modal(modalEl);
  modal.show();
  
  // Atenção: É melhor adicionar o event listener apenas uma vez.
  // Para evitar múltiplos listeners, podemos removê-lo e adicioná-lo novamente
  // ou usar uma abordagem mais robusta, mas para este caso, vamos focar no Supabase.
  const sendForm = document.getElementById("send-form");
  
  // Lógica de envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 2. Obtenha o usuário logado ATUALMENTE
    const { data: { user: currentUser }, error: sessionError } = await supabase.auth.getUser();

    if (sessionError || !currentUser) {
      alert("Erro de autenticação. Por favor, faça login novamente.");
      return;
    }

    const toEmail = document.getElementById("to").value;
    const subjectValue = document.getElementById("subject").value;
    const bodyValue = document.getElementById("body").value;

    // 3. Sua lógica original agora tem acesso ao `supabase` e `currentUser`
    let { data: users, error } = await supabase.rpc("get_user_by_email", { email: toEmail });
    if (error || !users || users.length === 0) {
      alert("Usuário destinatário não encontrado.");
      return;
    }
    
    const receiverId = users[0].id;
    const { error: insertError } = await supabase.from("messages").insert([
        { sender: currentUser.id, receiver: receiverId, subject: subjectValue, body: bodyValue }
    ]);

    if (insertError) {
        alert("Ocorreu um erro ao enviar a mensagem: " + insertError.message);
    } else {
        alert("Mensagem enviada com sucesso!");
        e.target.reset();
        modal.hide(); // Fecha o modal após o envio
    }
  };
  
  // Substitui o listener antigo para evitar duplicação
  sendForm.replaceWith(sendForm.cloneNode(true));
  document.getElementById("send-form").addEventListener("submit", handleSubmit);
};

// Carrega o modal assim que a página abrir
loadMessageModal();

