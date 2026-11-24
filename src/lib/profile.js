import { supabase } from "./supabase";

/**
 * Fetches the user profile from public.profiles
 */
export async function getUserProfile(userId) {
  if (!supabase || !userId) return null;
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.warn("getUserProfile error:", error);
      return null;
    }
    return data;
  } catch (err) {
    console.warn("getUserProfile exception:", err);
    return null;
  }
}

/**
 * Upserts user profile information (name, phone, state, language, scheme_profile)
 */
export async function syncUserProfile(userId, fields = {}) {
  if (!supabase || !userId) return null;
  try {
    const { data, error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: userId,
          ...fields
        },
        { onConflict: "id" }
      )
      .select()
      .maybeSingle();

    if (error) {
      console.warn("syncUserProfile error:", error);
      return null;
    }
    return data;
  } catch (err) {
    console.warn("syncUserProfile exception:", err);
    return null;
  }
}

/**
 * Saves scheme finder answers to profiles.scheme_profile
 */
export async function saveSchemeProfile(userId, schemeProfileData) {
  return syncUserProfile(userId, { scheme_profile: schemeProfileData });
}

/**
 * Saves preferred language to profiles.language
 */
export async function saveLanguagePreference(userId, language) {
  return syncUserProfile(userId, { language });
}
