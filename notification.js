// js/notification.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

  const SUPABASE_URL = 'https://qnxvprptwczutzojjyve.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFueHZwcnB0d2N6dXR6b2pqeXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MzIxMjAsImV4cCI6MjA2OTMwODEyMH0.oBi3ZBvEIBUzsaAPvYRJIhAZlJuetYVMcxFTRs_gBio';

  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentUser = null;

// Inicializa a notificação
export async function initNotification() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  currentUser = user;

  insertBadge();     // Cria o badge no DOM
  updateBadge();     // Atualiza contagem inicial
  setupRealtime();   // Configura atualizações em tempo real
}

// Cria o badge se ainda não existir
function insertBadge() {
  if (document.getElementById("message-badge")) return; // já existe

  const icons = document.querySelectorAll(".message-icon");
  icons.forEach(icon => {
    const badge = document.createElement("span");
    badge.id = "message-badge";
    badge.className = "absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full hidden";
    badge.innerText = "0";
    icon.style.position = "relative";
    icon.appendChild(badge);
  });
}

// Atualiza contagem inicial de mensagens não lidas
async function updateBadge() {
  const { data, error } = await supabase
    .from("messages")
    .select("id")
    .eq("receiver", currentUser.id)
    .eq("is_read", false);

  if (!error && data && data.length > 0) {
    const badge = document.getElementById("message-badge");
    badge.innerText = data.length;
    badge.classList.remove("hidden");
  }
}

// Configura Realtime para novas mensagens
function setupRealtime() {
  supabase
    .channel('public:messages')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'messages', filter: `receiver=eq.${currentUser.id}` },
      payload => {
        console.log("Nova mensagem recebida:", payload);
        incrementBadge();
      }
    )
    .subscribe();
}

// Incrementa badge quando chega nova mensagem
function incrementBadge() {
  const badge = document.getElementById("message-badge");
  let count = parseInt(badge.innerText || "0") + 1;
  badge.innerText = count;
  badge.classList.remove("hidden");
}

// Limpa badge (quando o usuário abre a caixa de mensagens)
export function clearBadge() {
  const badge = document.getElementById("message-badge");
  if (!badge) return;
  badge.innerText = 0;
  badge.classList.add("hidden");
}
