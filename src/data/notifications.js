// Notification API helpers for Supabase
import { supabase } from "../Lib/supabaseClient";

/**
 * Fetch all notifications for a user
 * @param {string} userId - The ID of the user
 * @returns {Promise<Array>} Array of notification objects
 */
export async function fetchNotifications(userId) {
  if (!userId) return [];
  
  const { data, error } = await supabase
    .from("user_notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
    
  if (error) throw error;
  return data || [];
}

/**
 * Delete a notification by ID
 * @param {string} id - The ID of the notification to delete
 * @returns {Promise<boolean>} True if successful
 */
export async function deleteNotification(id) {
  const { error } = await supabase
    .from("user_notifications")
    .delete()
    .eq("id", id);
    
  if (error) throw error;
  return true;
}

/**
 * Mark a notification as read
 * @param {string} id - The ID of the notification to mark as read
 * @returns {Promise<Object>} The updated notification
 */
export async function markAsRead(id) {
  const { data, error } = await supabase
    .from("user_notifications")
    .update({ 
      is_read: true,
      read_at: new Date().toISOString()
    })
    .eq("id", id)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

/**
 * Mark all notifications as read for a user
 * @param {string} userId - The ID of the user
 * @returns {Promise<Array>} Array of updated notification objects
 */
export async function markAllAsRead(userId) {
  if (!userId) return [];
  
  const { data, error } = await supabase
    .from("user_notifications")
    .update({ 
      is_read: true,
      read_at: new Date().toISOString()
    })
    .eq("user_id", userId)
    .eq("is_read", false)
    .select();
    
  if (error) throw error;
  return data || [];
}

/**
 * Subscribe to real-time notifications
 * @param {string} userId - The ID of the user to subscribe for
 * @param {Function} callback - Function to call when notifications change
 * @returns {Object} The Supabase channel for unsubscribing
 */
export function subscribeToNotifications(userId, callback) {
  if (!userId) return null;
  
  const channel = supabase
    .channel(`user_notifications_${userId}`)
    .on(
      'postgres_changes',
      { 
        event: '*', 
        schema: 'public', 
        table: 'user_notifications',
        filter: `user_id=eq.${userId}`
      },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();
    
  return channel;
}
