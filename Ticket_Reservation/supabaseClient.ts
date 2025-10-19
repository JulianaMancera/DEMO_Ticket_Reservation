// src/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const VITE_SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!VITE_SUPABASE_URL || !VITE_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

console.log('Supabase URL:', VITE_SUPABASE_URL);
console.log('Supabase Anon Key:', VITE_SUPABASE_ANON_KEY);
export const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);

