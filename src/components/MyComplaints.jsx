import React, { useState } from "react";
import {
  Clock, AlertTriangle, CheckCircle2, ShieldAlert, Archive,
  ExternalLink, FileText, ChevronRight, Copy, Check, Eye
} from "lucide-react";
import { EscalationModal } from "./EscalationModal";
import { ResolutionModal } from "./ResolutionModal";

export function MyComplaints({
  complaints,
  onArchiveComplaint,
  onConfirmResolved,
  onLodgeNew,
  lang,
  t,
  notify
}) {
  const [filter, setFilter] = useState("all");
  const [activeEscalationComplaint, setActiveEscalationComplaint] = useState(null);
  const [activeResolutionComplaint, setActiveResolutionComplaint] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState("");

  const isHi = lang === "हिन्दी";

  // Filter complaints based on status
  const filteredList = (complaints || []).filter(c => {
    if (filter === "all") return true;
    if (filter === "draft") return c.status === "draft";
    if (filter === "filed") return c.status === "filed";
    if (filter === "overdue") return c.status === "follow_up_due" || (c.status === "filed" && (c.daysElapsed || 0) > (c.expectedResolutionDays || 3));
    if (filter === "escalated") return c.status === "escalated";
    if (filter === "resolved") return c.status === "resolved";
    return true;
  });

  const handleCopyRef = (id, refNum) => {
    navigator.clipboard?.writeText(refNum);
    setCopiedId(id);
    notify(isHi ? "संदर्भ नंबर कॉपी हुआ!" : "Reference ID copied!");
    setTimeout(() => setCopiedId(""), 2000);
  };

  const getStatusBadge = (c) => {
    switch (c.status) {
      case "draft":
        return { label: t("statusDraft"), color: "var(--muted)", bg: "var(--panel2)", icon: Clock };
      case "filed":
        return { label: t("statusFiled"), color: "var(--blue)", bg: "var(--blue-subtle)", icon: CheckCircle2 };
      case "follow_up_due":
        return { label: t("statusOverdue"), color: "var(--amber)", bg: "rgba(245, 158, 11, 0.12)", icon: AlertTriangle };
      case "escalated":
        return { label: t("statusEscalated"), color: "var(--rose)", bg: "var(--rose-subtle)", icon: ShieldAlert };
      case "resolved":
        return { label: t("statusResolved"), color: "var(--emerald)", bg: "var(--emerald-subtle)", icon: CheckCircle2 };
      default:
        return { label: c.status, color: "var(--text)", bg: "var(--panel2)", icon: Clock };
    }
  };

  return (
    <main className="page" style={{ maxWidth: "1000px", margin: "0 auto", paddingBottom: "60px" }}>
      {/* Title & Action Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <span className="kicker">CITIZEN REDRESSAL RECORD</span>
          <h1 style={{ fontSize: "28px", margin: "4px 0 6px", color: "var(--text-heading)" }}>
            {t("myComplaintsTitle")}
          </h1>
          <p style={{ color: "var(--muted)", margin: 0, fontSize: "14px" }}>
            {t("myComplaintsSub")}
          </p>
        </div>

        <button
          type="button"
          className="primary"
          onClick={onLodgeNew}
          style={{ padding: "10px 20px", fontSize: "14px", borderRadius: "10px" }}
        >
          + {t("navFile")}
        </button>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "12px", marginBottom: "20px" }}>
        <button
          className={`filterPill ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          {t("filterAll")} ({complaints.length})
        </button>
        <button
          className={`filterPill ${filter === "active" ? "active" : ""}`}
          onClick={() => setFilter("filed")}
        >
          {t("filterActive")} ({complaints.filter(c => c.status === "filed").length})
        </button>
        <button
          className={`filterPill ${filter === "overdue" ? "active" : ""}`}
          onClick={() => setFilter("overdue")}
        >
          {t("filterOverdue")} ({complaints.filter(c => c.status === "follow_up_due").length})
        </button>
        <button
          className={`filterPill ${filter === "escalated" ? "active" : ""}`}
          onClick={() => setFilter("escalated")}
        >
          {t("filterEscalated")} ({complaints.filter(c => c.status === "escalated").length})
        </button>
        <button
          className={`filterPill ${filter === "resolved" ? "active" : ""}`}
          onClick={() => setFilter("resolved")}
        >
          {t("filterResolved")} ({complaints.filter(c => c.status === "resolved").length})
        </button>
      </div>

      {/* Complaints List */}
      {filteredList.length === 0 ? (
        <div className="emptyGrievancesCard">
          <div className="emptyGrievanceIcon">
            <FileText size={32} />
          </div>
          <h3 style={{ margin: "0 0 6px", color: "var(--text-heading)" }}>
            {t("emptyComplaints")}
          </h3>
          <p style={{ color: "var(--muted)", fontSize: "14px", maxWidth: "420px", margin: "0 auto 20px" }}>
            {t("emptyComplaintsSub")}
          </p>
          <button type="button" className="primary" onClick={onLodgeNew}>
            + {t("navFile")}
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "16px" }}>
          {filteredList.map((c) => {
            const badge = getStatusBadge(c);
            const BadgeIcon = badge.icon;
            const isOverdue = c.status === "follow_up_due" || (c.status === "filed" && (c.daysElapsed || 0) > (c.expectedResolutionDays || 3));
            const isExpanded = expandedId === c.id;

            return (
              <div
                key={c.id}
                className="panel"
                style={{
                  borderRadius: "16px",
                  padding: "20px 24px",
                  border: isOverdue && c.status !== "resolved" ? "1px solid rgba(239, 68, 68, 0.4)" : "1px solid var(--line)",
                  transition: "all 0.2s ease"
                }}
              >
                {/* Overdue Warning Alert */}
                {isOverdue && c.status !== "resolved" && (
                  <div className="overdueAlertBanner">
                    <AlertTriangle size={16} />
                    <span>
                      {t("overdueAlert").replace("{days}", String(Math.max(1, (c.daysElapsed || 7) - (c.expectedResolutionDays || 3)))).replace("{target}", String(c.expectedResolutionDays || 3))}
                    </span>
                  </div>
                )}

                {/* Card Top Row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px", marginBottom: "12px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-heading)" }}>
                        {isHi ? c.categoryHi || c.category : c.category}
                      </span>
                      {c.isDemo && (
                        <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 6px", borderRadius: "4px", background: "var(--panel2)", color: "var(--muted)", border: "1px solid var(--line)" }}>
                          {t("demoBadge")}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: "13px", color: "var(--muted)", marginTop: "2px" }}>
                      {c.dept}
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 12px",
                    borderRadius: "20px",
                    background: badge.bg,
                    color: badge.color,
                    fontSize: "12px",
                    fontWeight: 700
                  }}>
                    <BadgeIcon size={14} />
                    <span>{badge.label}</span>
                  </div>
                </div>

                {/* Card Description */}
                <p style={{ margin: "0 0 14px", fontSize: "14px", color: "var(--text)", lineHeight: 1.5 }}>
                  {c.desc}
                </p>

                {/* Metadata Row */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", fontSize: "12px", color: "var(--muted)", padding: "10px 14px", background: "var(--panel2)", borderRadius: "10px", marginBottom: "16px" }}>
                  <div>
                    <span>Portal: </span>
                    <strong style={{ color: "var(--text)" }}>{c.portalName || "CPGRAMS"}</strong>
                  </div>
                  <div>
                    <span>Ref Number: </span>
                    <strong style={{ color: "var(--blue)", fontFamily: "monospace" }}>
                      {c.portalRefNumber || "Draft (Not filed yet)"}
                    </strong>
                    {c.portalRefNumber && (
                      <button
                        type="button"
                        onClick={() => handleCopyRef(c.id, c.portalRefNumber)}
                        style={{ background: "transparent", border: "none", color: "var(--blue)", cursor: "pointer", marginLeft: "4px" }}
                      >
                        {copiedId === c.id ? <Check size={12} color="var(--emerald)" /> : <Copy size={12} />}
                      </button>
                    )}
                  </div>
                  <div>
                    <span>Filed: </span>
                    <strong style={{ color: "var(--text)" }}>{c.filingDate}</strong>
                  </div>
                  <div>
                    <span>Timeline: </span>
                    <strong>{c.expectedResolutionDays} days ({c.daysElapsed || 0} elapsed)</strong>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {/* Escalation Button (When overdue or filed) */}
                    {c.status !== "resolved" && c.status !== "draft" && (
                      <button
                        type="button"
                        className="escalateActionBtn"
                        onClick={() => setActiveEscalationComplaint(c)}
                      >
                        <ShieldAlert size={14} />
                        <span>{t("tabRti")} / Escalate</span>
                      </button>
                    )}

                    {/* Verify Resolution Button */}
                    {c.status !== "resolved" && c.status !== "draft" && (
                      <button
                        type="button"
                        className="inlineCopyBtn"
                        onClick={() => setActiveResolutionComplaint(c)}
                        style={{ background: "var(--emerald-subtle)", color: "var(--emerald)", borderColor: "var(--emerald)" }}
                      >
                        <CheckCircle2 size={14} />
                        <span>Confirm Resolved</span>
                      </button>
                    )}

                    {/* Toggle Timeline */}
                    <button
                      type="button"
                      className="archiveBtn"
                      onClick={() => setExpandedId(isExpanded ? null : c.id)}
                    >
                      <Eye size={13} />
                      <span>{isExpanded ? "Hide Timeline" : "View Timeline"}</span>
                    </button>
                  </div>

                  {/* Archive Button (Replaces delete trash button) */}
                  <button
                    type="button"
                    className="archiveBtn"
                    onClick={() => onArchiveComplaint(c.id)}
                    title="Archive this record"
                  >
                    <Archive size={13} />
                    <span>{t("btnArchive")}</span>
                  </button>
                </div>

                {/* Expanded Timeline & Evidence Details */}
                {isExpanded && (
                  <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid var(--line)" }}>
                    <h4 style={{ margin: "0 0 10px", fontSize: "13px", color: "var(--muted)", textTransform: "uppercase" }}>
                      Event Timeline (Audited Events)
                    </h4>
                    <div style={{ display: "grid", gap: "8px" }}>
                      {(c.timeline || []).map((step, idx) => (
                        <div key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "13px" }}>
                          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--blue)", marginTop: "6px" }} />
                          <div>
                            <strong>{step.title}</strong>
                            <span style={{ fontSize: "11px", color: "var(--muted)", marginLeft: "8px" }}>{step.date}</span>
                            <div style={{ fontSize: "12px", color: "var(--muted)" }}>{step.note} ({step.actor || "System"})</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Before / After Photo Comparison if Resolved */}
                    {c.status === "resolved" && (
                      <div style={{ marginTop: "16px" }}>
                        <h4 style={{ margin: "0 0 10px", fontSize: "13px", color: "var(--emerald)" }}>
                          {t("beforeAfterTitle")}
                        </h4>
                        <div className="beforeAfterContainer">
                          <div className="beforeAfterBox">
                            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)" }}>{t("beforeLabel")}</span>
                            {c.evidencePhotos?.[0] ? <img src={c.evidencePhotos[0]} alt="Before" /> : <div style={{ height: "140px", display: "grid", placeItems: "center" }}>No photo</div>}
                          </div>
                          <div className="beforeAfterBox">
                            <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--emerald)" }}>{t("afterLabel")}</span>
                            {c.afterPhoto ? <img src={c.afterPhoto} alt="After" /> : <div style={{ height: "140px", display: "grid", placeItems: "center" }}>Verified on site</div>}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Escalation Modal */}
      {activeEscalationComplaint && (
        <EscalationModal
          grievance={activeEscalationComplaint}
          onClose={() => setActiveEscalationComplaint(null)}
          lang={lang}
          t={t}
          notify={notify}
        />
      )}

      {/* Resolution Modal */}
      {activeResolutionComplaint && (
        <ResolutionModal
          grievance={activeResolutionComplaint}
          onConfirmResolved={onConfirmResolved}
          onClose={() => setActiveResolutionComplaint(null)}
          lang={lang}
          t={t}
          notify={notify}
        />
      )}
    </main>
  );
}
