import React, { useState } from "react";
import {
  FileCheck2, Check, AlertCircle, ExternalLink, Bot, ArrowRight
} from "lucide-react";
import { certificatesData } from "../data/certificates";

const DEPT_MONOGRAMS = {
  income_cert: {
    code: "REV",
    deptName: "Revenue Dept / Tehsildar",
    deptNameHi: "राजस्व विभाग / तहसीलदार",
    bg: "rgba(2, 132, 199, 0.12)",
    color: "#0284C7",
    border: "rgba(2, 132, 199, 0.28)"
  },
  caste_cert: {
    code: "SDM",
    deptName: "Sub-Divisional Magistrate",
    deptNameHi: "उप-मंडल मजिस्ट्रेट (SDM)",
    bg: "rgba(124, 58, 237, 0.12)",
    color: "#7C3AED",
    border: "rgba(124, 58, 237, 0.28)"
  },
  residence_cert: {
    code: "DM",
    deptName: "District Administration",
    deptNameHi: "जिला प्रशासन / तहसीलदार",
    bg: "rgba(217, 119, 6, 0.12)",
    color: "#D97706",
    border: "rgba(217, 119, 6, 0.28)"
  },
  birth_cert: {
    code: "CRS",
    deptName: "Civil Registry (Municipal)",
    deptNameHi: "जन्म-मृत्यु पंजीयक (नगर पालिका)",
    bg: "rgba(5, 150, 105, 0.12)",
    color: "#059669",
    border: "rgba(5, 150, 105, 0.28)"
  },
  death_cert: {
    code: "CRS",
    deptName: "Civil Registry (Health)",
    deptNameHi: "जन्म-मृत्यु पंजीयक (स्वास्थ्य)",
    bg: "rgba(71, 85, 105, 0.14)",
    color: "#475569",
    border: "rgba(71, 85, 105, 0.28)"
  },
  disability_cert: {
    code: "DMB",
    deptName: "District Medical Board",
    deptNameHi: "जिला मेडिकल बोर्ड / DEPwD",
    bg: "rgba(13, 148, 136, 0.12)",
    color: "#0D9488",
    border: "rgba(13, 148, 136, 0.28)"
  }
};

export function DocumentsHub({
  onAskAI,
  lang,
  t,
  notify
}) {
  const isHi = lang === "हिन्दी";

  // State to track checked document checkboxes per certificate
  const [checkedMap, setCheckedMap] = useState(() => {
    try {
      const saved = localStorage.getItem("jansetu_docs_checklist");
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  const toggleCheck = (certId, itemId) => {
    setCheckedMap(prev => {
      const current = prev[certId] || [];
      const updated = current.includes(itemId)
        ? current.filter(id => id !== itemId)
        : [...current, itemId];
      const nextMap = { ...prev, [certId]: updated };
      try {
        localStorage.setItem("jansetu_docs_checklist", JSON.stringify(nextMap));
      } catch (e) {}
      return nextMap;
    });
  };

  return (
    <main className="page" style={{ maxWidth: "1380px", width: "95%", margin: "0 auto", paddingBottom: "60px" }}>
      {/* Title */}
      <div className="pageTitle">
        <span className="kicker">STATUTORY CITIZEN DOCUMENTATION</span>
        <h1 style={{ fontSize: "28px", margin: "4px 0 6px", color: "var(--text-heading)" }}>
          {t("docsTitle")}
        </h1>
        <p style={{ color: "var(--muted)", margin: 0, fontSize: "14px", maxWidth: "720px" }}>
          {t("docsSub")}
        </p>
      </div>

      {/* Grid of Certificates with Interactive Readiness Checklists */}
      <div className="docsChecklistGrid">
        {certificatesData.map((doc) => {
          const checkedItems = checkedMap[doc.id] || [];
          const totalItems = doc.checklistItems.length;
          const progressPercent = Math.round((checkedItems.length / totalItems) * 100);
          const isComplete = progressPercent === 100;
          const missingItems = doc.checklistItems.filter(item => !checkedItems.includes(item.id));

          const mono = DEPT_MONOGRAMS[doc.id] || {
            code: "GOV",
            deptName: doc.dept,
            deptNameHi: doc.deptHi,
            bg: "var(--blue-subtle)",
            color: "var(--blue)",
            border: "rgba(29, 78, 216, 0.25)"
          };

          return (
            <div
              key={doc.id}
              className="panel"
              style={{
                borderRadius: "18px",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                border: isComplete ? "2px solid var(--emerald)" : "1px solid var(--line)"
              }}
            >
              {/* Department Monogram & Title */}
              <div style={{ marginBottom: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                  <div
                    title={isHi ? mono.deptNameHi : mono.deptName}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: "40px",
                      height: "26px",
                      padding: "0 6px",
                      borderRadius: "6px",
                      background: mono.bg,
                      color: mono.color,
                      border: `1px solid ${mono.border}`,
                      fontSize: "11px",
                      fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                      fontWeight: 800,
                      letterSpacing: "0.5px"
                    }}
                  >
                    {mono.code}
                  </div>
                  <span style={{ fontSize: "12px", fontWeight: 600, color: "var(--muted)" }}>
                    {isHi ? mono.deptNameHi : mono.deptName}
                  </span>
                </div>
                <h3 style={{ margin: "0 0 6px", fontSize: "18px", color: "var(--text-heading)" }}>
                  {isHi ? doc.titleHi : doc.title}
                </h3>
                <p style={{ margin: 0, fontSize: "13px", color: "var(--muted)", lineHeight: 1.5 }}>
                  {isHi ? doc.descHi : doc.desc}
                </p>
              </div>

              {/* Readiness Progress Bar */}
              <div style={{ margin: "12px 0 16px", background: "var(--panel2)", padding: "12px 14px", borderRadius: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", marginBottom: "6px" }}>
                  <span style={{ fontWeight: 700, color: "var(--text)" }}>
                    {t("checklistProgress")} {progressPercent}%
                  </span>
                  {isComplete ? (
                    <span style={{ color: "var(--emerald)", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                      <Check size={13} /> {t("readyBadge")}
                    </span>
                  ) : (
                    <span style={{ color: "var(--muted)" }}>
                      {checkedItems.length}/{totalItems} items ready
                    </span>
                  )}
                </div>
                <div style={{ width: "100%", height: "6px", background: "var(--line)", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ width: `${progressPercent}%`, height: "100%", background: isComplete ? "var(--emerald)" : "var(--blue)", transition: "width 0.3s ease" }} />
                </div>
              </div>

              {/* Interactive Checkbox Checklist: "Tick what you have" */}
              <div style={{ marginBottom: "16px" }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                  Tick what you currently have:
                </span>
                <div style={{ display: "grid", gap: "8px" }}>
                  {doc.checklistItems.map((item) => {
                    const isChecked = checkedItems.includes(item.id);
                    return (
                      <label
                        key={item.id}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "8px",
                          fontSize: "12px",
                          color: isChecked ? "var(--text-heading)" : "var(--muted)",
                          cursor: "pointer",
                          padding: "4px 0"
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleCheck(doc.id, item.id)}
                          style={{ marginTop: "2px" }}
                        />
                        <div>
                          <strong style={{ fontWeight: isChecked ? 700 : 500 }}>{item.label}</strong>
                          {!isChecked && (
                            <span style={{ display: "block", fontSize: "11px", color: "var(--muted)" }}>
                              Where to get: {item.source}
                            </span>
                          )}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Missing Guidance Alert */}
              {!isComplete && missingItems.length > 0 && (
                <div style={{ background: "rgba(245, 158, 11, 0.08)", border: "1px solid rgba(245, 158, 11, 0.2)", borderRadius: "8px", padding: "10px 12px", fontSize: "12px", color: "var(--text)", marginBottom: "16px" }}>
                  <strong style={{ color: "var(--amber)", display: "block", marginBottom: "3px" }}>
                    {t("missingDocsNotice")}
                  </strong>
                  <ul style={{ margin: "4px 0 0", paddingLeft: "16px", lineHeight: 1.4 }}>
                    {missingItems.map(m => (
                      <li key={m.id}>
                        {m.label} ({m.source})
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* SLA & Fee Meta */}
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "var(--muted)", padding: "10px 0", borderTop: "1px solid var(--line)", marginTop: "auto" }}>
                <div>
                  <span>SLA: </span>
                  <strong style={{ color: "var(--text)" }}>{isHi ? doc.slaHi : doc.sla}</strong>
                </div>
                <div>
                  <span>Govt Fee: </span>
                  <strong style={{ color: "var(--blue)" }}>{doc.fee}</strong>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                <button
                  type="button"
                  className="inlineCopyBtn"
                  onClick={() => onAskAI(doc)}
                  style={{ flex: 1, justifyContent: "center", padding: "8px 10px" }}
                >
                  <Bot size={14} />
                  <span>Ask AI Copilot</span>
                </button>

                <a
                  href={doc.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inlineCopyBtn"
                  style={{ textDecoration: "none", padding: "8px 12px" }}
                >
                  <span>Portal</span>
                  <ExternalLink size={13} />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}
