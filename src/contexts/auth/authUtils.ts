
// Função para limpar completamente o estado de autenticação
export const cleanupAuthState = () => {
  localStorage.removeItem("agendaja_authenticated");
  localStorage.removeItem("agendaja_user_type");
  
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
      localStorage.removeItem(key);
    }
  });
  
  if (typeof sessionStorage !== 'undefined') {
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  }
};
