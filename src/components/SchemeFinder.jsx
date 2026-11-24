import React, { useState } from "react";
import {
  Search, CheckCircle2, AlertCircle, ExternalLink, Filter,
  Sparkles, ArrowRight, UserCheck, Check, FileCheck2, ChevronDown, ChevronUp,
  Sprout, HeartPulse, Home, Store, Heart, Wrench, GraduationCap, Shield,
  Lightbulb, Flame, Briefcase, Sun, Layers, Droplets
} from "lucide-react";
import { schemesDatabase, evaluateUserSchemes } from "../data/schemes";

// Category colors map
const CATEGORY_COLORS = {
  "Agriculture & Farmers": { bg: "#ecfdf5", border: "#a7f3d0", text: "#065f46", gradient: "linear-gradient(135deg, #059669, #10b981)", icon: Sprout },
  "Healthcare": { bg: "#fdf2f8", border: "#fbcfe8", text: "#9d174d", gradient: "linear-gradient(135deg, #e11d48, #f43f5e)", icon: HeartPulse },
  "Housing": { bg: "#fffbeb", border: "#fde68a", text: "#92400e", gradient: "linear-gradient(135deg, #d97706, #f59e0b)", icon: Home },
  "Business & Entrepreneurship": { bg: "#f0fdfa", border: "#ccfbf1", text: "#0f766e", gradient: "linear-gradient(135deg, #0f766e, #14b8a6)", icon: Store },
  "Women & Child": { bg: "#faf5ff", border: "#e9d5ff", text: "#6b21a8", gradient: "linear-gradient(135deg, #7c3aed, #a855f7)", icon: Heart },
  "Artisans & Craftsmen": { bg: "#fefce8", border: "#fef08a", text: "#854d0e", gradient: "linear-gradient(135deg, #b45309, #d97706)", icon: Wrench },
  "Youth & Skill Development": { bg: "#f0fdfa", border: "#99f6e4", text: "#115e59", gradient: "linear-gradient(135deg, #0f766e, #14b8a6)", icon: GraduationCap },
  "Social Security & Pension": { bg: "#f8fafc", border: "#cbd5e1", text: "#334155", gradient: "linear-gradient(135deg, #475569, #64748b)", icon: Shield },
  "Insurance": { bg: "#f0fdf4", border: "#bbf7d0", text: "#166534", gradient: "linear-gradient(135deg, #15803d, #22c55e)", icon: Shield },
  "Street Vendors & Micro Trade": { bg: "#fff7ed", border: "#fed7aa", text: "#9a3412", gradient: "linear-gradient(135deg, #c2410c, #f97316)", icon: Store },
  "Women & Energy": { bg: "#fff1f2", border: "#fecdd3", text: "#9f1239", gradient: "linear-gradient(135deg, #be123c, #fb7185)", icon: Flame },
  "Entrepreneurship": { bg: "#f5f3ff", border: "#ddd6fe", text: "#5b21b6", gradient: "linear-gradient(135deg, #6d28d9, #8b5cf6)", icon: Briefcase },
  "Innovation & Startups": { bg: "#f0fdfa", border: "#ccfbf1", text: "#0f766e", gradient: "linear-gradient(135deg, #0f766e, #2dd4bf)", icon: Lightbulb },
  "Unorganized Workers": { bg: "#f1f5f9", border: "#cbd5e1", text: "#334155", gradient: "linear-gradient(135deg, #334155, #64748b)", icon: Layers },
  "Senior Citizens": { bg: "#f8fafc", border: "#e2e8f0", text: "#475569", gradient: "linear-gradient(135deg, #64748b, #94a3b8)", icon: UserCheck },
  "Widow Welfare": { bg: "#fdf2f8", border: "#fce7f3", text: "#831843", gradient: "linear-gradient(135deg, #be185d, #ec4899)", icon: Heart },
  "Education & Scholarships": { bg: "#f0fdfa", border: "#ccfbf1", text: "#134e4a", gradient: "linear-gradient(135deg, #0d9488, #2dd4bf)", icon: GraduationCap },
  "Manufacturing & Self-Employment": { bg: "#fffbeb", border: "#fef3c7", text: "#78350f", gradient: "linear-gradient(135deg, #b45309, #f59e0b)", icon: Briefcase },
  "Employment & Jobs": { bg: "#f0fdfa", border: "#ccfbf1", text: "#134e4a", gradient: "linear-gradient(135deg, #0f766e, #14b8a6)", icon: Briefcase },
  "Maternal Health & Women": { bg: "#fdf2f8", border: "#fbcfe8", text: "#9d174d", gradient: "linear-gradient(135deg, #db2777, #f472b6)", icon: Heart },
  "Persons with Disabilities": { bg: "#f5f3ff", border: "#ede9fe", text: "#4c1d95", gradient: "linear-gradient(135deg, #7c3aed, #a78bfa)", icon: Shield },
  "Fisheries & Aquaculture": { bg: "#ecfeff", border: "#cffafe", text: "#155e75", gradient: "linear-gradient(135deg, #0891b2, #06b6d4)", icon: Droplets },
  "Agriculture & Credit": { bg: "#f0fdf4", border: "#dcfce7", text: "#14532d", gradient: "linear-gradient(135deg, #16a34a, #4ade80)", icon: Sprout },
  "Unorganized Sector": { bg: "#f1f5f9", border: "#e2e8f0", text: "#1e293b", gradient: "linear-gradient(135deg, #475569, #94a3b8)", icon: Layers },
  "Renewable Energy & Agriculture": { bg: "#fefce8", border: "#fef08a", text: "#713f12", gradient: "linear-gradient(135deg, #ca8a04, #eab308)", icon: Sun }
};

export function SchemeFinder({
  onNavigateToDocs,
  onAskAI,
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

  const [categoryFilter, setCategoryFilter] = useState("all");
  const [expandedSchemeId, setExpandedSchemeId] = useState(null);

  // Evaluate schemes deterministically based on profile
  const { eligible, almostEligible } = evaluateUserSchemes(profile);

  // Filter schemes
  const filteredEligible = eligible.filter(s => {
    if (categoryFilter === "all") return true;
    return s.tag.toLowerCase().includes(categoryFilter.toLowerCase());
  });

  const toggleExpand = (id) => {
    setExpandedSchemeId(expandedSchemeId === id ? null : id);
  };

  return (
    <main className="page" style={{ maxWidth: "1380px", width: "95%", margin: "0 auto", paddingBottom: "60px" }}>
      {/* Header */}
      <div className="pageTitle">
        <span className="kicker">DETERMINISTIC CITIZEN RULE ENGINE</span>
        <h1 style={{ fontSize: "28px", margin: "4px 0 6px", color: "var(--text-heading)" }}>
          {t("schemesTitle")}
        </h1>
        <p style={{ color: "var(--muted)", margin: 0, fontSize: "14px", maxWidth: "800px" }}>
          {t("schemesSub")}
        </p>
      </div>

      <div className="schemeFinderLayout">
        {/* Profile Wizard Form Panel */}
        <div className="panel" style={{ padding: "26px", borderRadius: "20px", position: "sticky", top: "90px" }}>
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

            {/* Checkbox Options */}
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
          <div style={{ background: "linear-gradient(135deg, rgba(29, 78, 216, 0.08), rgba(22, 163, 74, 0.08))", border: "1px solid var(--line)", borderRadius: "18px", padding: "18px 24px", marginBottom: "20px" }}>
            <h3 style={{ margin: "0 0 4px", fontSize: "18px", color: "var(--text-heading)" }}>
              {t("resultsEligibleHead").replace("{count}", String(eligible.length))}
            </h3>
            <p style={{ margin: 0, fontSize: "13px", color: "var(--muted)" }}>
              {t("disclaimerScheme")}
            </p>
          </div>

          {/* Category Filter Chips with hidden native scrollbar */}
          <div style={{
            display: "flex",
            gap: "8px",
            overflowX: "auto",
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
            paddingBottom: "12px",
            marginBottom: "16px"
          }}>
            <button
              type="button"
              className={`filterPill ${categoryFilter === "all" ? "active" : ""}`}
              onClick={() => setCategoryFilter("all")}
            >
              All ({eligible.length})
            </button>
            <button
              type="button"
              className={`filterPill ${categoryFilter === "farmers" ? "active" : ""}`}
              onClick={() => setCategoryFilter("farmers")}
            >
              Farmers
            </button>
            <button
              type="button"
              className={`filterPill ${categoryFilter === "health" ? "active" : ""}`}
              onClick={() => setCategoryFilter("health")}
            >
              Healthcare
            </button>
            <button
              type="button"
              className={`filterPill ${categoryFilter === "housing" ? "active" : ""}`}
              onClick={() => setCategoryFilter("housing")}
            >
              Housing
            </button>
            <button
              type="button"
              className={`filterPill ${categoryFilter === "business" ? "active" : ""}`}
              onClick={() => setCategoryFilter("business")}
            >
              Business
            </button>
            <button
              type="button"
              className={`filterPill ${categoryFilter === "women" ? "active" : ""}`}
              onClick={() => setCategoryFilter("women")}
            >
              Women & Child
            </button>
          </div>

          {/* Eligible Schemes Cards with Visual Banners */}
          <div style={{ display: "grid", gap: "20px" }}>
            {filteredEligible.map((s, index) => {
              const isExpanded = expandedSchemeId === s.id;
              const catConfig = CATEGORY_COLORS[s.tag] || {
                bg: "#f1f5f9",
                border: "#cbd5e1",
                text: "#334155",
                gradient: "linear-gradient(135deg, #0f766e, #14b8a6)",
                icon: Sparkles
              };
              const CatIcon = catConfig.icon;

              return (
                <div
                  key={s.id}
                  className="panel"
                  style={{
                    borderRadius: "18px",
                    overflow: "hidden",
                    border: "1px solid var(--line)",
                    transition: "all 0.2s ease"
                  }}
                >
                  {/* Visual Top Banner (Section F) */}
                  <div className="schemeBannerTop" style={{
                    background: catConfig.gradient
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "12px",
                        background: "rgba(255, 255, 255, 0.2)",
                        backdropFilter: "blur(6px)",
                        display: "grid",
                        placeItems: "center",
                        color: "#ffffff"
                      }}>
                        <CatIcon size={24} />
                      </div>
                      <div>
                        <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", opacity: 0.9 }}>
                          #{index + 1} • {s.tag}
                        </div>
                        <h4 style={{ margin: "2px 0 0", fontSize: "16px", fontWeight: 700, color: "#fff" }}>
                          {isHi ? s.nameHi : s.name}
                        </h4>
                      </div>
                    </div>

                    <div style={{
                      background: "rgba(0, 0, 0, 0.25)",
                      backdropFilter: "blur(6px)",
                      padding: "6px 14px",
                      borderRadius: "20px",
                      fontSize: "13px",
                      fontWeight: 800,
                      color: "#fff",
                      border: "1px solid rgba(255, 255, 255, 0.2)"
                    }}>
                      {isHi ? s.benefitHi : s.benefit}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: "20px 24px" }}>
                    <div style={{ fontSize: "12px", color: "var(--muted)", marginBottom: "12px" }}>
                      {isHi ? s.ministryHi : s.ministry} • <em>Verified {s.lastVerified}</em>
                    </div>

                    {/* Why you qualify checklist */}
                    <div style={{ background: "var(--panel2)", borderRadius: "10px", padding: "12px 16px", marginBottom: "14px" }}>
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
                          style={{ background: "transparent", border: "none", color: "var(--blue)", fontSize: "12px", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px", cursor: "pointer" }}
                        >
                          <span>{isExpanded ? "Hide Details" : "Application Guide & Documents"}</span>
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>

                        {s.requiredCertificateIds && s.requiredCertificateIds.length > 0 && (
                          <button
                            type="button"
                            onClick={() => onNavigateToDocs()}
                            style={{ background: "var(--panel2)", border: "1px solid var(--line)", padding: "4px 10px", borderRadius: "6px", fontSize: "11px", color: "var(--text)", display: "inline-flex", alignItems: "center", gap: "4px", cursor: "pointer" }}
                          >
                            <FileCheck2 size={12} color="var(--blue)" />
                            <span>Check Certificate Readiness</span>
                          </button>
                        )}
                      </div>

                      <div style={{ display: "flex", gap: "8px" }}>
                        {onAskAI && (
                          <button
                            type="button"
                            className="inlineCopyBtn"
                            onClick={() => onAskAI(s)}
                            style={{ padding: "8px 12px" }}
                          >
                            <Sparkles size={13} color="var(--blue)" />
                            <span>Ask AI</span>
                          </button>
                        )}

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
                    </div>

                    {/* Expanded Application Guide */}
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
