import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Verificar se as variáveis de ambiente estão disponíveis
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase não configurado corretamente. Verifique as variáveis de ambiente.");
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null; // Retorna null se não houver configuração