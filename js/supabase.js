/* ================================================================
   SUPABASE.JS — Inicialización del cliente Supabase
   La Brasa de Cal Petit

   El cliente queda expuesto como variable global `supabaseClient`
   para que reservas.js pueda usarlo directamente.
   ================================================================ */

const SUPABASE_URL = 'https://ihqajufaoybfvrrjhwyh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_UNtdwFPRXOZ_x-it2Df_Lw_i8ApuaJS';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
