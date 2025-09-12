async function loadNewMessagesCount() {
  try {
    const { data, error } = await supabase
      .from("messages")
      .select("id", { count: "exact" })
      .eq("is_read", false);

    if (error) {
      console.error("Erro ao buscar mensagens novas:", error);
      return;
    }

    const count = data.length; // ou use `data.count` se preferir
    const badge = document.getElementById("msg-badge");

    if (badge) {
      if (count > 0) {
        badge.textContent = count;
        badge.classList.remove("d-none");
      } else {
        badge.classList.add("d-none");
      }
    }
  } catch (err) {
    console.error("Falha loadNewMessagesCount:", err);
  }
}

// atualiza a cada 30s (opcional)
setInterval(loadNewMessagesCount, 30000);

// exporta para outros arquivos se precisar
window.loadNewMessagesCount = loadNewMessagesCount;
