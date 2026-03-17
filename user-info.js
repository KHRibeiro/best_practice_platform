<script type="module">
  import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
  
  const supabase = createClient('https://qnxvprptwczutzojjyve.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFueHZwcnB0d2N6dXR6b2pqeXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MzIxMjAsImV4cCI6MjA2OTMwODEyMH0.oBi3ZBvEIBUzsaAPvYRJIhAZlJuetYVMcxFTRs_gBio');
  
  //Função para identificar usuário
  export async function getLoggedUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
  
    if (error) {
      console.error("Erro ao obter usuário:", error.message);
      return null;
    }
  
    return user;
  }
  
  
  //Função para buscar dados do usuário
  export async function getUserData(email) {
    const { data, error } = await supabase
      .from("users")
      .select("site_region, role")
      .eq("email", email)
      .single();
  
    if (error) {
      console.error("Erro ao obter dados do usuário:", error.message);
      return null;
    }
  
    return data;
  }
  
  //Função para carregar dados na tela
  export async function carregarDadosUsuario() {
  
    const user = await getLoggedUser();
    if (!user) return;
  
    const email = user.email;
  
    const userData = await getUserData(email);
    if (!userData) return;
  
    document.getElementById("usuario").innerText = email;
    document.getElementById("region").innerText = userData.site_region;
    document.getElementById("userlvl").innerText = userData.role;
  }
</script>
