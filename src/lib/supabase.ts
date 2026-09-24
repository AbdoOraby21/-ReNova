import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl as string, supabaseAnonKey as string)
  : null;

export const NOT_CONFIGURED_ERROR =
  'قاعدة البيانات غير مُعدّة بعد. أضف VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY إلى ملف .env';

export function requireSupabase(): SupabaseClient {
  if (!supabase) throw new Error(NOT_CONFIGURED_ERROR);
  return supabase;
}
