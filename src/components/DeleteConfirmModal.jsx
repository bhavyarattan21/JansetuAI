import React, { useEffect, useRef } from "react";
import { AlertTriangle, Archive, Trash2, X } from "lucide-react";

export function DeleteConfirmModal({
  isOpen,
  title = "Delete this complaint?",
  message = "This action will remove the record. You will have 5 seconds to undo before permanent removal.",
  onConfirmDelete,
  onArchiveInstead,
  onClose,
  isProcessing = false
}) {
  const deleteBtnRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    deleteBtnRef.current?.focus();
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modalOverlay"
      onClick={onClose}
      style={{ zIndex: 10000 }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="panel"
        style={{ width: "min(420px, 92vw)", padding: "28px", borderRadius: "18px", textAlign: "center" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          width: "52px",
          height: "52px",
          borderRadius: "14px",
          background: "var(--rose-subtle)",
          color: "var(--rose)",
          display: "grid",
          placeItems: "center",
          margin: "0 auto 16px"
        }}>
          <AlertTriangle size={26} />
        </div>

        <h3 style={{ margin: "0 0 8px", fontSize: "18px", color: "var(--text-heading)" }}>
          {title}
        </h3>
        <p style={{ margin: "0 0 24px", fontSize: "13px", color: "var(--muted)", lineHeight: 1.5 }}>
          {message}
        </p>

        <div style={{ display: "grid", gap: "10px" }}>
          {/* Safer Option: Archive */}
          {onArchiveInstead && (
            <button
              type="button"
              className="archiveBtn"
              onClick={onArchiveInstead}
              style={{ width: "100%", justifyContent: "center", padding: "10px", fontSize: "13px", fontWeight: 600 }}
            >
              <Archive size={14} />
              <span>Archive Instead (Recommended)</span>
            </button>
          )}

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              className="archiveBtn"
              onClick={onClose}
              disabled={isProcessing}
              style={{ flex: 1, justifyContent: "center", padding: "10px" }}
            >
              Cancel
            </button>
            <button
              ref={deleteBtnRef}
              type="button"
              className="primary"
              onClick={onConfirmDelete}
              disabled={isProcessing}
              style={{ flex: 1, justifyContent: "center", padding: "10px", background: "var(--rose)", borderColor: "var(--rose)" }}
            >
              <Trash2 size={14} />
              <span>{isProcessing ? "Deleting..." : "Delete"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
