import React, { useState } from "react";
import {
  X, Copy, Check, Printer, ExternalLink, ShieldAlert, FileText,
  Mail, Scale, AlertTriangle, Send
} from "lucide-react";
import { generateEscalationPackage } from "../services/ai";

export function EscalationModal({
  grievance,
  onClose,
  lang,
  t,
  notify
}) {
  const [activeTab, setActiveTab] = useState("reminder"); // 'reminder' | 'appeal' | 'rti' | 'dossier'
  const [copied, setCopied] = useState(false);

  // Generate escalation text package if not already attached
  const escalationData = grievance.escalation || generateEscalationPackage(grievance, lang);

  const getActiveText = () => {
    switch (activeTab) {
      case "reminder": return escalationData.reminderLetter;
      case "appeal": return escalationData.appellateAppeal;
      case "rti": return escalationData.rtiDraft;
      case "dossier": return escalationData.evidenceSummary;
      default: return "";
    }
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(getActiveText());
    setCopied(true);
    notify(lang === "हिन्दी" ? "पत्र क्लिपबोर्ड पर कॉपी किया गया!" : "Text copied to clipboard!");
    setTimeout(() => setCopied(false), 2200);
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>${activeTab.toUpperCase()} - ${grievance.portalRefNumber || grievance.id}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #111; line-height: 1.6; }
            h2 { border-bottom: 2px solid #111; padding-bottom: 8px; }
            pre { white-space: pre-wrap; font-family: inherit; font-size: 14px; }
            .footer { margin-top: 40px; font-size: 12px; color: #666; border-top: 1px solid #ccc; padding-top: 10px; }
          </style>
        </head>
        <body>
          <h2>JanSetu AI Escalation Dossier</h2>
          <pre>${getActiveText()}</pre>
          <div class="footer">Generated independently by JanSetu AI Copilot for citizen grievance redressal. Reference: ${grievance.portalRefNumber || grievance.id}</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="escalationModalBox" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="escalationHeader">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(220, 38, 38, 0.1)", color: "var(--rose)", display: "grid", placeItems: "center" }}>
              <ShieldAlert size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "17px", color: "var(--text-heading)" }}>
                {t("escalationTitle")}
              </h3>
              <p style={{ margin: "2px 0 0", fontSize: "12px", color: "var(--muted)" }}>
                {grievance.portalRefNumber || grievance.id} • {grievance.category}
              </p>
            </div>
          </div>
          <button className="modalClose" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* 4 Escalation Tabs */}
        <div className="escalationNavTabs">
          <button
            className={`escalationTabBtn ${activeTab === "reminder" ? "active" : ""}`}
            onClick={() => setActiveTab("reminder")}
          >
            <Mail size={14} style={{ display: "inline", marginRight: "6px" }} />
            {t("tabReminder")}
          </button>

          <button
            className={`escalationTabBtn ${activeTab === "appeal" ? "active" : ""}`}
            onClick={() => setActiveTab("appeal")}
          >
            <Scale size={14} style={{ display: "inline", marginRight: "6px" }} />
            {t("tabAppeal")}
          </button>

          <button
            className={`escalationTabBtn ${activeTab === "rti" ? "active" : ""}`}
            onClick={() => setActiveTab("rti")}
          >
            <FileText size={14} style={{ display: "inline", marginRight: "6px" }} />
            {t("tabRti")}
          </button>

          <button
            className={`escalationTabBtn ${activeTab === "dossier" ? "active" : ""}`}
            onClick={() => setActiveTab("dossier")}
          >
            <Printer size={14} style={{ display: "inline", marginRight: "6px" }} />
            {t("tabDossier")}
          </button>
        </div>

        {/* Letter Preview Area */}
        <div className="letterPreviewArea">
          {getActiveText()}
        </div>

        {/* Modal Footer Actions */}
        <div style={{ padding: "16px 24px", borderTop: "1px solid var(--line)", background: "var(--panel2)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", gap: "8px" }}>
            {activeTab === "rti" && (
              <a
                href="https://rtionline.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inlineCopyBtn"
                style={{ padding: "8px 14px", textDecoration: "none" }}
              >
                <span>{t("openRtiPortalBtn")}</span>
                <ExternalLink size={14} />
              </a>
            )}
            <button
              type="button"
              className="inlineCopyBtn"
              onClick={handlePrint}
              style={{ padding: "8px 14px" }}
            >
              <Printer size={14} />
              <span>{t("printDossierBtn")}</span>
            </button>
          </div>

          <button
            type="button"
            className="primary"
            onClick={handleCopy}
            style={{ padding: "8px 20px", display: "inline-flex", alignItems: "center", gap: "6px" }}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? t("copied") : t("copyLetterBtn")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
