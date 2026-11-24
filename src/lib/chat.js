import { supabase } from "./supabase";

/**
 * Loads the last 50 chat messages for the authenticated user
 */
export async function loadChatMessages(userId, limit = 50) {
  if (!supabase || !userId) return [];
  try {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("id, role, content, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.warn("loadChatMessages error:", error);
      return [];
    }

    // Return in chronological order
    return (data || []).reverse().map(msg => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      created_at: msg.created_at
    }));
  } catch (err) {
    console.warn("loadChatMessages exception:", err);
    return [];
  }
}

/**
 * Saves a new message to chat_messages table
 */
export async function saveChatMessage(userId, role, content) {
  if (!supabase || !userId || !content) return null;
  try {
    const { data, error } = await supabase
      .from("chat_messages")
      .insert({
        user_id: userId,
        role: role,
        content: content
      })
      .select()
      .single();

    if (error) {
      console.warn("saveChatMessage error:", error);
      return null;
    }
    return data;
  } catch (err) {
    console.warn("saveChatMessage exception:", err);
    return null;
  }
}

/**
 * Clears all chat messages for this user
 */
export async function clearChatHistory(userId) {
  if (!supabase || !userId) return false;
  try {
    const { error } = await supabase
      .from("chat_messages")
      .delete()
      .eq("user_id", userId);

    if (error) {
      console.warn("clearChatHistory error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("clearChatHistory exception:", err);
    return false;
  }
}
