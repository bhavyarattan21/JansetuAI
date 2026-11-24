import { supabase } from "./supabase";
import { getSignedPhotoUrl } from "./photos";

/**
 * Computes overdue status and follow-up status dynamically without storing in DB.
 * Status: 'filed' and expected_by < now() => overdue / follow-up due.
 */
export function computeComplaintFlags(complaint) {
  if (!complaint) return {};
  const now = new Date();
  const expectedDate = complaint.expected_by ? new Date(complaint.expected_by) : null;
  const isFiled = complaint.status === "filed";

  const isOverdue = Boolean(isFiled && expectedDate && expectedDate < now);
  const isFollowUpDue = Boolean(isFiled && expectedDate && (expectedDate - now) < 2 * 24 * 60 * 60 * 1000); // within 48h or past

  return {
    isOverdue,
    isFollowUpDue
  };
}

/**
 * Helper to update complaint status and simultaneously record an audit row in complaint_events
 */
async function transitionComplaintStatus(complaintId, newStatus, eventType, note = null, extraFields = {}) {
  if (!supabase) throw new Error("Supabase is not configured");

  // 1. Update complaints table
  const { data: updatedComplaint, error: updateError } = await supabase
    .from("complaints")
    .update({
      status: newStatus,
      ...extraFields
    })
    .eq("id", complaintId)
    .select()
    .single();

  if (updateError) {
    console.error(`Failed to update complaint status to ${newStatus}:`, updateError);
    throw updateError;
  }

  // 2. Insert complaint_events audit row
  const { error: eventError } = await supabase
    .from("complaint_events")
    .insert({
      complaint_id: complaintId,
      type: eventType,
      note: note || `Status updated to ${newStatus}`
    });

  if (eventError) {
    console.warn("Failed to insert complaint event audit row:", eventError);
  }

  return updatedComplaint;
}

/**
 * Creates a new complaint and logs the 'created' / 'filed' event
 */
export async function createComplaint(complaintData) {
  if (!supabase) throw new Error("Supabase is not configured");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Active session is required to create a complaint");

  const status = complaintData.status || "filed";
  const filedAt = status === "filed" ? (complaintData.filed_at || new Date().toISOString()) : null;
  
  // Calculate expected_by date if filed
  let expectedBy = complaintData.expected_by;
  if (!expectedBy && status === "filed") {
    const days = complaintData.expectedDays || 7;
    const exp = new Date();
    exp.setDate(exp.getDate() + days);
    expectedBy = exp.toISOString();
  }

  const newRow = {
    user_id: user.id,
    category: complaintData.category || "General Grievance",
    department: complaintData.department || "Municipal Administration",
    portal_name: complaintData.portal_name || "Official Portal",
    location: complaintData.location || "Unspecified Location",
    description: complaintData.description || "",
    draft_letter: complaintData.draft_letter || complaintData.description || "",
    urgency: complaintData.urgency || "medium",
    status: status,
    portal_reference: complaintData.portal_reference || null,
    filed_at: filedAt,
    expected_by: expectedBy,
    is_demo: Boolean(complaintData.is_demo),
    is_archived: false
  };

  const { data: complaint, error } = await supabase
    .from("complaints")
    .insert(newRow)
    .select()
    .single();

  if (error) {
    console.error("createComplaint error:", error);
    throw error;
  }

  // Insert initial event audit row
  await supabase.from("complaint_events").insert({
    complaint_id: complaint.id,
    type: status === "filed" ? "filed" : "created",
    note: complaintData.portal_reference 
      ? `Filed with portal reference: ${complaintData.portal_reference}`
      : "Draft created"
  });

  return complaint;
}

/**
 * Lists complaints for the current authenticated user.
 * Joins complaint_events and complaint_photos, excludes archived complaints unless requested.
 */
export async function listComplaints({ includeArchived = false, onlyArchived = false } = {}) {
  if (!supabase) return [];

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  let query = supabase
    .from("complaints")
    .select(`
      *,
      complaint_events ( id, type, note, created_at ),
      complaint_photos ( id, storage_path, kind, created_at )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (onlyArchived) {
    query = query.eq("is_archived", true);
  } else if (!includeArchived) {
    query = query.eq("is_archived", false);
  }

  const { data, error } = await query;
  if (error) {
    console.error("listComplaints error:", error);
    throw error;
  }

  // Resolve signed URLs for photos and sort events by created_at ascending
  const enriched = await Promise.all(
    (data || []).map(async (item) => {
      // Sort audit events chronologically
      const sortedEvents = (item.complaint_events || []).sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );

      // Generate signed URLs for private photos
      const photosWithUrls = await Promise.all(
        (item.complaint_photos || []).map(async (photo) => {
          const signedUrl = await getSignedPhotoUrl(photo.storage_path);
          return {
            ...photo,
            url: signedUrl
          };
        })
      );

      const flags = computeComplaintFlags(item);

      return {
        ...item,
        events: sortedEvents,
        photos: photosWithUrls,
        ...flags
      };
    })
  );

  return enriched;
}

/**
 * Fetches a single complaint by ID with all joined events and photos
 */
export async function getComplaint(id) {
  if (!supabase || !id) return null;

  const { data, error } = await supabase
    .from("complaints")
    .select(`
      *,
      complaint_events ( id, type, note, created_at ),
      complaint_photos ( id, storage_path, kind, created_at )
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("getComplaint error:", error);
    throw error;
  }

  const sortedEvents = (data.complaint_events || []).sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );

  const photosWithUrls = await Promise.all(
    (data.complaint_photos || []).map(async (photo) => {
      const signedUrl = await getSignedPhotoUrl(photo.storage_path);
      return {
        ...photo,
        url: signedUrl
      };
    })
  );

  return {
    ...data,
    events: sortedEvents,
    photos: photosWithUrls,
    ...computeComplaintFlags(data)
  };
}

/**
 * Marks complaint as filed on official portal with registration reference and expected SLA days
 */
export async function markFiled(id, portalReference, expectedDays = 7) {
  const filedAt = new Date().toISOString();
  const exp = new Date();
  exp.setDate(exp.getDate() + expectedDays);

  return transitionComplaintStatus(
    id,
    "filed",
    "filed",
    `Filed on official portal. Ref ID: ${portalReference}. Expected resolution within ${expectedDays} days.`,
    {
      portal_reference: portalReference,
      filed_at: filedAt,
      expected_by: exp.toISOString()
    }
  );
}

/**
 * Marks complaint as escalated (e.g. RTI application drafted/filed)
 */
export async function markEscalated(id, note = "Escalated to First Appellate Authority under RTI Act Section 6(1)") {
  return transitionComplaintStatus(
    id,
    "escalated",
    "escalated",
    note
  );
}

/**
 * Marks complaint as resolved after citizen verification
 */
export async function markResolved(id, note = "Citizen verified resolution on ground") {
  return transitionComplaintStatus(
    id,
    "resolved",
    "resolved",
    note,
    {
      resolved_at: new Date().toISOString()
    }
  );
}

/**
 * Soft archives a complaint
 */
export async function archiveComplaint(id) {
  if (!supabase) throw new Error("Supabase is not configured");

  const { data, error } = await supabase
    .from("complaints")
    .update({ is_archived: true })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  await supabase.from("complaint_events").insert({
    complaint_id: id,
    type: "archived",
    note: "Complaint archived by citizen"
  });

  return data;
}

/**
 * Restores a soft-archived complaint
 */
export async function restoreComplaint(id) {
  if (!supabase) throw new Error("Supabase is not configured");

  const { data, error } = await supabase
    .from("complaints")
    .update({ is_archived: false })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  await supabase.from("complaint_events").insert({
    complaint_id: id,
    type: "restored",
    note: "Complaint restored from archive"
  });

  return data;
}

/**
 * Permanently deletes a complaint and all associated storage photos
 */
export async function deletePermanently(id) {
  if (!supabase) throw new Error("Supabase is not configured");

  // 1. Fetch photo storage paths to clean up Storage bucket
  const { data: photos } = await supabase
    .from("complaint_photos")
    .select("storage_path")
    .eq("complaint_id", id);

  if (photos && photos.length > 0) {
    const paths = photos.map(p => p.storage_path).filter(Boolean);
    try {
      await supabase.storage.from("complaint-photos").remove(paths);
    } catch (err) {
      console.warn("Storage photos cleanup error:", err);
    }
  }

  // 2. Delete complaint (cascade automatically deletes complaint_events and complaint_photos)
  const { error } = await supabase
    .from("complaints")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
}
