import { createClient } from '@supabase/supabase-js';

export const supabaseConfigurado = Boolean(
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY,
);

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'supabase-anon-key-missing';

if (!supabaseConfigurado) {
  console.warn('[PetMate] Faltan VITE_SUPABASE_URL y/o VITE_SUPABASE_ANON_KEY en .env.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
