
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://rlnywipigilgldpwwnfn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJsbnl3aXBpZ2lsZ2xkcHd3bmZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwMDY3NjksImV4cCI6MjA2NTU4Mjc2OX0.tX2xDusZyCQy3MXAgiXQSLPzw09PCdVVKkkMeRD7pxM";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'x-client-info': 'supabase-js-web/2.50.0'
    }
  }
});

// Adicionar listener para debug de erros
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session?.user?.email);
  
  if (event === 'SIGNED_OUT') {
    console.log('Usuário deslogado');
  } else if (event === 'SIGNED_IN') {
    console.log('Usuário logado:', session?.user?.email);
  } else if (event === 'TOKEN_REFRESHED') {
    console.log('Token renovado');
  }
});
