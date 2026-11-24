import { supabase } from "./supabase";

/**
 * Compresses an image File or Blob to max 1600px dimension and JPEG 0.8 quality
 * @param {File|Blob} file 
 * @returns {Promise<Blob>}
 */
export async function compressImage(file) {
  return new Promise((resolve, reject) => {
    // Basic validation
    if (!file || !file.type.startsWith("image/")) {
      return reject(new Error("File must be a valid image"));
    }
    if (file.size > 5 * 1024 * 1024) {
      return reject(new Error("File size exceeds 5MB limit"));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Failed to read image file"));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error("Failed to load image element"));
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const maxDim = 1600;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Canvas compression failed"));
            }
          },
          "image/jpeg",
          0.8
        );
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Converts a data URL to a Blob
 */
export function dataURLtoBlob(dataUrl) {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}

/**
 * Uploads a complaint photo to the private 'complaint-photos' bucket and inserts row in complaint_photos.
 * Path convention: {user_id}/{complaint_id}/{uuid}.jpg
 */
export async function uploadComplaintPhoto({ userId, complaintId, fileOrBlobOrDataUrl, kind = "before" }) {
  if (!supabase) throw new Error("Supabase is not configured");
  if (!userId) throw new Error("User ID is required for photo upload");
  if (!complaintId) throw new Error("Complaint ID is required for photo upload");

  let blob = fileOrBlobOrDataUrl;
  if (typeof fileOrBlobOrDataUrl === "string" && fileOrBlobOrDataUrl.startsWith("data:")) {
    blob = dataURLtoBlob(fileOrBlobOrDataUrl);
  }

  // Ensure compressed
  let compressedBlob = blob;
  try {
    if (blob.size > 200 * 1024) {
      compressedBlob = await compressImage(blob);
    }
  } catch (err) {
    console.warn("Compression skipped or fallback:", err);
    compressedBlob = blob;
  }

  const photoUuid = (crypto.randomUUID ? crypto.randomUUID() : `photo-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  const storagePath = `${userId}/${complaintId}/${photoUuid}.jpg`;

  // 1. Upload to Supabase Storage bucket
  const { error: uploadError } = await supabase.storage
    .from("complaint-photos")
    .upload(storagePath, compressedBlob, {
      contentType: "image/jpeg",
      upsert: true
    });

  if (uploadError) {
    console.error("Storage upload error:", uploadError);
    throw uploadError;
  }

  // 2. Insert row into complaint_photos
  const { data: photoRecord, error: dbError } = await supabase
    .from("complaint_photos")
    .insert({
      complaint_id: complaintId,
      storage_path: storagePath,
      kind: kind
    })
    .select()
    .single();

  if (dbError) {
    console.error("DB complaint_photos insert error:", dbError);
    throw dbError;
  }

  // 3. Generate a signed URL valid for 1 hour (3600 seconds)
  const signedUrl = await getSignedPhotoUrl(storagePath);

  return {
    ...photoRecord,
    signedUrl
  };
}

/**
 * Generates a signed URL for a photo in the private bucket (valid for 1 hour)
 */
export async function getSignedPhotoUrl(storagePath) {
  if (!supabase || !storagePath) return null;
  try {
    const { data, error } = await supabase.storage
      .from("complaint-photos")
      .createSignedUrl(storagePath, 3600);

    if (error) {
      console.warn("createSignedUrl error:", error);
      return null;
    }
    return data?.signedUrl || null;
  } catch (e) {
    console.warn("Failed to generate signed url:", e);
    return null;
  }
}

/**
 * Removes a photo from Supabase Storage and deletes the complaint_photos row
 */
export async function deleteComplaintPhoto(photoId, storagePath) {
  if (!supabase) return;
  try {
    if (storagePath) {
      await supabase.storage.from("complaint-photos").remove([storagePath]);
    }
    if (photoId) {
      await supabase.from("complaint_photos").delete().eq("id", photoId);
    }
  } catch (e) {
    console.error("Error deleting complaint photo:", e);
    throw e;
  }
}
