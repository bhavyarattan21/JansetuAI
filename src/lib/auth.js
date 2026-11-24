import { supabase, isSupabaseConfigured } from "./supabase";

/**
 * Helper to get clean display name for header and badges
 * Returns Google name if available, or "Guest" for anonymous citizens
 */
export function getCitizenDisplayName(user, isHi = false) {
  if (!user || user.is_anonymous) {
    return isHi ? "अतिथि नागरिक" : "Guest";
  }
  return (
    user.user_metadata?.full_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    (isHi ? "सत्यापित नागरिक" : "Citizen")
  );
}

/**
 * Helper to get avatar URL or initial
 */
export function getCitizenAvatar(user) {
  if (!user || user.is_anonymous) {
    return null;
  }
  return user.user_metadata?.avatar_url || user.user_metadata?.picture || null;
}

/**
 * Initializes citizen session.
 * On first visit with no session, calls supabase.auth.signInAnonymously().
 */
export async function initializeCitizenSession() {
  if (!isSupabaseConfigured || !supabase) {
    return { session: null, user: null, error: "Supabase not configured" };
  }

  try {
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.warn("[Auth] getSession error:", sessionError);
    }

    if (session?.user) {
      return { session, user: session.user, error: null };
    }

    // No existing session: sign in anonymously
    const { data: anonData, error: anonError } = await supabase.auth.signInAnonymously();
    if (anonError) {
      console.error("[Auth] signInAnonymously error:", anonError);
      return { session: null, user: null, error: anonError };
    }

    return { session: anonData.session, user: anonData.user, error: null };
  } catch (err) {
    console.error("[Auth] Unexpected session init error:", err);
    return { session: null, user: null, error: err };
  }
}

/**
 * Links a verified Google identity to the current anonymous citizen account,
 * ensuring all drafted and filed complaints remain attached to this user_id.
 */
export async function linkGoogleAccount() {
  if (!supabase) throw new Error("Supabase is not configured");

  const { data: { user } } = await supabase.auth.getUser();

  // If user is already anonymous, use linkIdentity so their UUID is preserved
  if (user && user.is_anonymous) {
    const { data, error } = await supabase.auth.linkIdentity({
      provider: "google",
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) throw error;
    return data;
  }

  // Otherwise perform standard OAuth sign-in
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin
    }
  });
  if (error) throw error;
  return data;
}

/**
 * Standard Google OAuth sign-in fallback
 */
export async function signInWithGoogle() {
  return linkGoogleAccount();
}

/**
 * Signs out the current user and immediately seeds a clean anonymous citizen session,
 * guaranteeing the citizen can continue using the portal without any unauthenticated crash.
 */
export async function signOutCitizen() {
  if (!supabase) return { user: null, session: null };

  try {
    await supabase.auth.signOut();
  } catch (err) {
    console.warn("[Auth] signOut warning:", err);
  }

  try {
    const { data } = await supabase.auth.signInAnonymously();
    return { session: data?.session || null, user: data?.user || null };
  } catch (err) {
    console.error("[Auth] anonymous fallback error:", err);
    return { session: null, user: null };
  }
}
