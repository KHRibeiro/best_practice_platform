
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const SUPABASE_URL = 'https://qnxvprptwczutzojjyve.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFueHZwcnB0d2N6dXR6b2pqeXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MzIxMjAsImV4cCI6MjA2OTMwODEyMH0.oBi3ZBvEIBUzsaAPvYRJIhAZlJuetYVMcxFTRs_gBio';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
let currentUser = null;

async function loadUser() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) { document.getElementById("user-info").innerHTML = `<a href="login.html" class="text-blue-500">Fazer login</a>`; return; }
  currentUser = user;
  loadUsersForAutocomplete();
  document.getElementById("user-info").innerText = `Logado como: ${user.email}`;
  loadMessages();
  setupRealtime();
}

async function getUserEmail(uid) {
  if (!uid) return "desconhecido";
  let { data, error } = await supabase.rpc("get_user_email", { uid: uid });
  return error ? uid : data;
}

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
  loadMessages();
});

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
loadUser();
