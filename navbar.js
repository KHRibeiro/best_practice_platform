// navbar.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// --- substitua pelos seus valores (use somente a anon key no frontend) ---
const SUPABASE_URL = 'https://qnxvprptwczutzojjyve.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFueHZwcnB0d2N6dXR6b2pqeXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MzIxMjAsImV4cCI6MjA2OTMwODEyMH0.oBi3ZBvEIBUzsaAPvYRJIhAZlJuetYVMcxFTRs_gBio';

// ---------------------------------------------------------------------

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// Exponha se você quiser usar window.supabase em outros scripts
window.supabase = supabase;

async function fetchAndInjectNavbar(containerSelector = '#navbar-container', navbarPath = '/navbar.html') {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  const res = await fetch(navbarPath);
  const html = await res.text();
  container.innerHTML = html;

  // garante ícones do bootstrap (só adiciona se não existir)
  if (!document.querySelector('link[href*="bootstrap-icons"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css';
    document.head.appendChild(link);
  }

  setupNavbar();
}

async function loadNewMessagesCount() {
  try {
    const { count, data, error } = await supabase
      .from('messages')
      .select('id', { count: 'exact' })
      .eq('is_read', false);

    if (error) { console.error('Supabase error:', error); return; }

    const badge = document.getElementById('msg-badge');
    // alguns retornos usam count, outros data.length — cobre os dois
    const cnt = (typeof count === 'number') ? count : (Array.isArray(data) ? data.length : 0);

    if (!badge) return;
    if (cnt > 0) {
      badge.textContent = String(cnt);
      badge.classList.remove('d-none');
    } else {
      badge.classList.add('d-none');
    }
  } catch (err) {
    console.error('Erro loadNewMessagesCount:', err);
  }
}

function setupNavbar() {
  const icon = document.getElementById('msg-icon');
  if (icon) icon.addEventListener('click', () => window.location.href = 'inbox.html');

  loadNewMessagesCount();
  setInterval(loadNewMessagesCount, 30000);
}

// inicializa
fetchAndInjectNavbar('#navbar-container', '/navbar.html');
