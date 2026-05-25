import { createClient } from "@supabase/supabase-js";

// Use placeholder values when not configured so createClient doesn't throw during build/SSR.
// All runtime calls are guarded by isSupabaseConfigured.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "placeholder-anon-key";

// Singleton browser client — uses anon key + RLS
export const supabase = createClient(url, key, {
  auth: { persistSession: true, autoRefreshToken: true },
});

export const isSupabaseConfigured = !!(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
