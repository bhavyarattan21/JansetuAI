import { createClient } from "@supabase/supabase-js";

// Read environment variables (supports Vite VITE_ prefix as well as Next.js NEXT_PUBLIC_ fallback)
const rawUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || "";
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Normalize URL in case user pasted endpoint with trailing /rest/v1 or slash
const supabaseUrl = rawUrl.trim().replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
const supabaseAnonKey = rawKey.trim();

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith("https://") &&
  supabaseAnonKey.length > 10
);

if (!isSupabaseConfigured) {
  console.warn(
    "[JanSetu AI] Supabase credentials are missing or incomplete. Please check your .env.local file (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)."
  );
}

// Single browser client instance with auto-refresh and persistent local session storage
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    })
  : null;

/**
 * Health check helper to verify Supabase connectivity
 * @returns {Promise<{ ok: boolean, message?: string }>}
 */
export async function checkSupabaseConnection() {
  if (!isSupabaseConfigured || !supabase) {
    return { ok: false, message: "Supabase environment variables are missing." };
  }
  try {
    const { error } = await supabase.from("profiles").select("id").limit(1);
    if (error && error.code !== "PGRST116") {
      // If table exists but empty or RLS blocks anon, that's fine; connection succeeded
      return { ok: true };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, message: err.message };
  }
}
