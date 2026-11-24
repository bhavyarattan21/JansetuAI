import React, { useState } from "react";
import {
  X, Camera, CheckCircle2, AlertCircle, Upload, Check
} from "lucide-react";

export function ResolutionModal({
  grievance,
  onConfirmResolved,
  onClose,
  lang,
  t,
  notify
}) {
  const [afterPhoto, setAfterPhoto] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState("");

  const handleConfirm = () => {
    onConfirmResolved(grievance.id, {
      afterPhoto: afterPhoto,
      resolutionNotes: resolutionNotes || (lang === "हिन्दी" ? "नागरिक द्वारा स्थल पर समाधान सत्यापित किया गया।" : "Verified on-site by citizen.")
    });
    notify(lang === "हिन्दी" ? "समाधान नागरिक द्वारा सफलतापूर्वक सत्यापित किया गया!" : "Resolution confirmed by citizen!");
    onClose();
  };

  const beforePhoto = grievance.photos?.find(p => p.kind === "before")?.url || grievance.evidencePhotos?.[0] || grievance.photos?.[0]?.url || null;

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="panel" style={{ width: "min(640px, 94vw)", padding: "28px", borderRadius: "18px" }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--emerald)", fontWeight: 700, fontSize: "12px", background: "var(--emerald-subtle)", padding: "3px 10px", borderRadius: "20px", marginBottom: "6px" }}>
              <CheckCircle2 size={13} />
              {t("confirmedBadge")}
            </div>
            <h3 style={{ margin: 0, fontSize: "20px", color: "var(--text-heading)" }}>
              {t("resolveTitle")}
            </h3>
            <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--muted)" }}>
              {t("resolveSub")}
            </p>
          </div>
          <button className="modalClose" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Side-by-Side Before / After Field Comparison */}
        <div className="beforeAfterContainer">
          <div className="beforeAfterBox">
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--muted)" }}>
              {t("beforeLabel")}
            </span>
            {beforePhoto ? (
              <img src={beforePhoto} alt="Before filing" />
            ) : (
              <div style={{ height: "180px", display: "grid", placeItems: "center", background: "var(--panel)", borderRadius: "8px", marginTop: "8px", fontSize: "12px", color: "var(--muted)" }}>
                No initial photo attached
              </div>
            )}
          </div>

          <div className="beforeAfterBox">
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--emerald)" }}>
              {t("afterLabel")}
            </span>
            {afterPhoto ? (
              <img src={afterPhoto} alt="After resolution" />
            ) : (
              <label style={{ height: "180px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", background: "var(--panel)", border: "2px dashed var(--line-strong)", borderRadius: "8px", marginTop: "8px", cursor: "pointer", padding: "12px" }}>
                <Camera size={24} color="var(--blue)" />
                <span style={{ fontSize: "12px", color: "var(--blue)", fontWeight: 600 }}>
                  {t("uploadAfterPhoto")}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      const file = e.target.files[0];
                      const reader = new FileReader();
                      reader.onload = () => setAfterPhoto(reader.result);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            )}
          </div>
        </div>

        {/* Verification Note */}
        <div style={{ margin: "16px 0 20px" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "6px" }}>
            Verification Feedback (Optional)
          </label>
          <input
            type="text"
            value={resolutionNotes}
            onChange={(e) => setResolutionNotes(e.target.value)}
            placeholder="e.g. Patchwork completed cleanly, drain cover installed..."
            style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--panel-input)", color: "var(--text)", fontSize: "13px" }}
          />
        </div>

        {/* Action Button */}
        <button
          type="button"
          className="primary"
          onClick={handleConfirm}
          style={{ width: "100%", padding: "12px", fontSize: "15px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "var(--emerald)", borderColor: "var(--emerald)" }}
        >
          <CheckCircle2 size={18} />
          <span>{t("btnConfirmFixed")}</span>
        </button>
      </div>
    </div>
  );
}
