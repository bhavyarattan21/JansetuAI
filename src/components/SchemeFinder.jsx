import React, { useState } from "react";
import {
  Search, CheckCircle2, AlertCircle, ExternalLink, Filter,
  Sparkles, ArrowRight, UserCheck, Check, FileCheck2, ChevronDown, ChevronUp
} from "lucide-react";
import { schemesDatabase, evaluateUserSchemes } from "../data/schemes";

export function SchemeFinder({
  onNavigateToDocs,
  lang,
  t,
  notify
}) {
  const isHi = lang === "हिन्दी";

  // Citizen Profile Wizard State
  const [profile, setProfile] = useState({
    state: "Haryana",
    age: 28,
    gender: "female",
    annualIncome: 180000,
    occupation: "worker",
    category: "OBC",
    housingStatus: "kutcha",
    hasBankAccount: true,
    hasGirlChildUnder10: true,
    isPregnantOrLactating: false,
    hasDisability: false,
    familyHasWoman: true
  });

  const [hasEvaluated, setHasEvaluated] = useState(true);
  const [expandedSchemeId, setExpandedSchemeId] = useState(null);

  // Evaluate schemes deterministically based on profile
  const { eligible, almostEligible } = evaluateUserSchemes(profile);

  const toggleExpand = (id) => {
    setExpandedSchemeId(expandedSchemeId === id ? null : id);
  };

  return (
    <main className="page" style={{ maxWidth: "1060px", margin: "0 auto", paddingBottom: "60px" }}>
      {/* Header */}
      <div className="pageTitle">
        <span className="kicker">DETERMINISTIC CITIZEN RULE ENGINE</span>
        <h1 style={{ fontSize: "28px", margin: "4px 0 6px", color: "var(--text-heading)" }}>
          {t("schemesTitle")}
        </h1>
        <p style={{ color: "var(--muted)", margin: 0, fontSize: "14px", maxWidth: "720px" }}>
          {t("schemesSub")}
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: "24px", alignItems: "start" }}>
        {/* Profile Wizard Form Panel */}
        <div className="panel" style={{ padding: "24px", borderRadius: "18px", position: "sticky", top: "90px" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: "16px", color: "var(--text-heading)", display: "flex", alignItems: "center", gap: "8px" }}>
            <UserCheck size={18} color="var(--blue)" />
            <span>Citizen Profile Wizard</span>
          </h3>

          <div style={{ display: "grid", gap: "14px" }}>
            {/* Age & Gender */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted)", marginBottom: "4px" }}>
                  {t("wizardAge")}
                </label>
                <input
                  type="number"
                  value={profile.age}
                  onChange={(e) => setProfile({ ...profile, age: Number(e.target.value) })}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--panel-input)", color: "var(--text)", fontSize: "13px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted)", marginBottom: "4px" }}>
                  {t("wizardGender")}
                </label>
                <select
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                  style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--panel-input)", color: "var(--text)", fontSize: "13px" }}
                >
                  <option value="female">{t("female")}</option>
                  <option value="male">{t("male")}</option>
                  <option value="other">{t("other")}</option>
                </select>
              </div>
            </div>

            {/* Annual Income */}
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted)", marginBottom: "4px" }}>
                {t("wizardIncome")}
              </label>
              <select
                value={profile.annualIncome}
                onChange={(e) => setProfile({ ...profile, annualIncome: Number(e.target.value) })}
                style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--panel-input)", color: "var(--text)", fontSize: "13px" }}
              >
                <option value={120000}>Below ₹1.5 Lakh / year (BPL / EWS)</option>
                <option value={240000}>₹1.5 Lakh - ₹2.5 Lakh / year</option>
                <option value={500000}>₹2.5 Lakh - ₹6.0 Lakh / year (LIG)</option>
                <option value={900000}>Above ₹8.0 Lakh / year</option>
              </select>
            </div>

            {/* Occupation */}
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted)", marginBottom: "4px" }}>
                {t("wizardOccupation")}
              </label>
              <select
                value={profile.occupation}
                onChange={(e) => setProfile({ ...profile, occupation: e.target.value })}
                style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--panel-input)", color: "var(--text)", fontSize: "13px" }}
              >
                <option value="worker">{t("worker")}</option>
                <option value="farmer">{t("farmer")}</option>
                <option value="student">{t("student")}</option>
                <option value="business">{t("business")}</option>
                <option value="homemaker">{t("homemaker")}</option>
              </select>
            </div>

            {/* Social Category */}
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted)", marginBottom: "4px" }}>
                {t("wizardCategory")}
              </label>
              <select
                value={profile.category}
                onChange={(e) => setProfile({ ...profile, category: e.target.value })}
                style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--panel-input)", color: "var(--text)", fontSize: "13px" }}
              >
                <option value="OBC">OBC (Other Backward Class)</option>
                <option value="SC">SC (Scheduled Caste)</option>
                <option value="ST">ST (Scheduled Tribe)</option>
                <option value="EWS">EWS (Economically Weaker Section)</option>
                <option value="General">General Category</option>
              </select>
            </div>

            {/* Housing Status */}
            <div>
              <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted)", marginBottom: "4px" }}>
                {t("wizardHousing")}
              </label>
              <select
                value={profile.housingStatus}
                onChange={(e) => setProfile({ ...profile, housingStatus: e.target.value })}
                style={{ width: "100%", padding: "8px 10px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--panel-input)", color: "var(--text)", fontSize: "13px" }}
              >
                <option value="kutcha">{t("kutcha")}</option>
                <option value="rented">{t("rented")}</option>
                <option value="pucca">{t("pucca")}</option>
              </select>
            </div>

            {/* Toggles */}
            <div style={{ display: "grid", gap: "8px", fontSize: "12px", color: "var(--text)", borderTop: "1px solid var(--line)", paddingTop: "12px" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={profile.hasGirlChildUnder10}
                  onChange={(e) => setProfile({ ...profile, hasGirlChildUnder10: e.target.checked })}
                />
                <span>{t("wizardGirlChild")}</span>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={profile.isPregnantOrLactating}
                  onChange={(e) => setProfile({ ...profile, isPregnantOrLactating: e.target.checked })}
                />
                <span>{t("wizardPregnant")}</span>
              </label>

              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={profile.hasDisability}
                  onChange={(e) => setProfile({ ...profile, hasDisability: e.target.checked })}
                />
                <span>{t("wizardDisability")}</span>
              </label>
            </div>
          </div>
        </div>

        {/* Results Stream */}
        <div>
          {/* Summary Banner */}
          <div style={{ background: "linear-gradient(135deg, rgba(29, 78, 216, 0.08), rgba(22, 163, 74, 0.08))", border: "1px solid var(--line)", borderRadius: "16px", padding: "18px 24px", marginBottom: "24px" }}>
            <h3 style={{ margin: "0 0 4px", fontSize: "18px", color: "var(--text-heading)" }}>
              {t("resultsEligibleHead").replace("{count}", String(eligible.length))}
            </h3>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--muted)" }}>
              {t("disclaimerScheme")}
            </p>
          </div>

          {/* Eligible Schemes List */}
          <div style={{ display: "grid", gap: "16px" }}>
            {eligible.map((s, index) => {
              const isExpanded = expandedSchemeId === s.id;
              return (
                <div
                  key={s.id}
                  className="panel"
                  style={{ borderRadius: "16px", padding: "20px 24px", border: "1px solid var(--line)", transition: "all 0.2s" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", flexWrap: "wrap", marginBottom: "8px" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 8px", borderRadius: "12px", background: "var(--blue-subtle)", color: "var(--blue)" }}>
                          #{index + 1} {isHi ? s.tagHi : s.tag}
                        </span>
                        <span style={{ fontSize: "11px", color: "var(--muted)" }}>
                          Verified: {s.lastVerified}
                        </span>
                      </div>
                      <h3 style={{ margin: "6px 0 2px", fontSize: "17px", color: "var(--text-heading)" }}>
                        {isHi ? s.nameHi : s.name}
                      </h3>
                      <div style={{ fontSize: "12px", color: "var(--muted)" }}>
                        {isHi ? s.ministryHi : s.ministry}
                      </div>
                    </div>

                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "15px", fontWeight: 800, color: "var(--emerald)" }}>
                        {isHi ? s.benefitHi : s.benefit}
                      </div>
                    </div>
                  </div>

                  {/* Why you qualify checklist */}
                  <div style={{ background: "var(--panel2)", borderRadius: "10px", padding: "12px 16px", margin: "12px 0" }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>
                      {t("rulesMetLabel")}
                    </span>
                    <div style={{ display: "grid", gap: "4px", marginTop: "6px" }}>
                      {s.rulesMet.map((rule, rIdx) => (
                        <div key={rIdx} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--text)" }}>
                          <Check size={13} color="var(--emerald)" />
                          <span>{rule}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <button
                        type="button"
                        onClick={() => toggleExpand(s.id)}
                        style={{ background: "transparent", border: "none", color: "var(--blue)", fontSize: "12px", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px" }}
                      >
                        <span>{isExpanded ? "Hide Details" : "Required Documents & How to Apply"}</span>
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>

                      {s.requiredCertificateIds && s.requiredCertificateIds.length > 0 && (
                        <button
                          type="button"
                          onClick={() => onNavigateToDocs()}
                          style={{ background: "var(--panel2)", border: "1px solid var(--line)", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", color: "var(--text)", display: "inline-flex", alignItems: "center", gap: "4px" }}
                        >
                          <FileCheck2 size={12} color="var(--blue)" />
                          <span>Check Document Readiness</span>
                        </button>
                      )}
                    </div>

                    <a
                      href={s.portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inlineCopyBtn"
                      style={{ padding: "8px 14px", textDecoration: "none" }}
                    >
                      <span>{t("btnApplyScheme")}</span>
                      <ExternalLink size={13} />
                    </a>
                  </div>

                  {/* Expanded Checklist & Application instructions */}
                  {isExpanded && (
                    <div style={{ marginTop: "14px", paddingTop: "14px", borderTop: "1px solid var(--line)", fontSize: "13px" }}>
                      <div style={{ marginBottom: "10px" }}>
                        <strong>{t("howToApplyLabel")}</strong>
                        <p style={{ margin: "4px 0", color: "var(--muted)", lineHeight: 1.5 }}>
                          {isHi ? s.howToApplyHi : s.howToApply}
                        </p>
                      </div>

                      <div>
                        <strong>{t("docsCarriedLabel")}</strong>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "6px" }}>
                          {s.requiredDocuments.map((doc, dIdx) => (
                            <span key={dIdx} style={{ background: "var(--panel2)", border: "1px solid var(--line)", padding: "4px 8px", borderRadius: "6px", fontSize: "11px", color: "var(--text)" }}>
                              • {doc}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Almost Eligible Schemes */}
          {almostEligible.length > 0 && (
            <div style={{ marginTop: "40px" }}>
              <div style={{ marginBottom: "16px" }}>
                <h3 style={{ fontSize: "20px", color: "var(--text-heading)", margin: "0 0 4px" }}>
                  {t("resultsAlmostHead").replace("{count}", String(almostEligible.length))}
                </h3>
                <p style={{ margin: 0, fontSize: "13px", color: "var(--muted)" }}>
                  Schemes you are close to qualifying for with minor documentation steps:
                </p>
              </div>

              <div style={{ display: "grid", gap: "12px" }}>
                {almostEligible.map((s) => (
                  <div key={s.id} className="panel" style={{ padding: "16px 20px", borderRadius: "12px", border: "1px dashed var(--line-strong)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
                      <div>
                        <h4 style={{ margin: 0, fontSize: "15px", color: "var(--text-heading)" }}>
                          {isHi ? s.nameHi : s.name}
                        </h4>
                        <div style={{ fontSize: "12px", color: "var(--amber)", marginTop: "4px" }}>
                          <strong>{t("missingLabel")}</strong> {s.missingReason}
                        </div>
                      </div>
                      <a
                        href={s.portalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inlineCopyBtn"
                        style={{ textDecoration: "none", fontSize: "11px" }}
                      >
                        Official Details <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
