import React from "react";
import { ExternalLink, ShieldCheck, Heart, AlertCircle, Sparkles } from "lucide-react";

export function Footer({ setActive, toggleLanguage, lang, t }) {
  const isHi = lang === "हिन्दी";

  return (
    <footer style={{
      background: "var(--panel)",
      borderTop: "1px solid var(--line)",
      marginTop: "auto",
      padding: "54px 24px 28px",
      color: "var(--text)",
      position: "relative",
      zIndex: 10
    }}>
      <div style={{
        maxWidth: "1280px",
        margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "36px",
        marginBottom: "40px"
      }}>
        {/* Column 1: About */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
            <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: "var(--blue)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 800, fontSize: "14px" }}>
              JS
            </div>
            <strong style={{ fontSize: "17px", color: "var(--text-heading)" }}>JanSetu AI</strong>
          </div>
          <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.6, margin: "0 0 16px" }}>
            {isHi
              ? "सरकारी पोर्टलों के समक्ष नागरिकों का स्वतंत्र एआई सहायक। हम शिकायत तैयार करते हैं, फॉलो-अप ट्रैक करते हैं और विलंब होने पर आरटीआई उपलब्ध कराते हैं।"
              : "The independent AI copilot that sits in front of official government portals. We prepare complaints, track follow-ups, and generate escalations when neglected."}
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: 700, padding: "4px 10px", borderRadius: "20px", background: "var(--blue-subtle)", color: "var(--blue)" }}>
            <ShieldCheck size={13} />
            <span>Independent Citizen Tech</span>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-heading)", margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            {isHi ? "त्वरित लिंक" : "Quick Links"}
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "10px", fontSize: "13px" }}>
            <li>
              <button type="button" onClick={() => setActive("home")} style={{ background: "none", border: "none", padding: 0, color: "var(--muted)", cursor: "pointer", transition: "color 0.15s" }}>
                {t("navHome")}
              </button>
            </li>
            <li>
              <button type="button" onClick={() => setActive("file")} style={{ background: "none", border: "none", padding: 0, color: "var(--muted)", cursor: "pointer" }}>
                {t("navFile")}
              </button>
            </li>
            <li>
              <button type="button" onClick={() => setActive("tracker")} style={{ background: "none", border: "none", padding: 0, color: "var(--muted)", cursor: "pointer" }}>
                {t("navTracker")}
              </button>
            </li>
            <li>
              <button type="button" onClick={() => setActive("schemes")} style={{ background: "none", border: "none", padding: 0, color: "var(--muted)", cursor: "pointer" }}>
                {t("navSchemes")}
              </button>
            </li>
            <li>
              <button type="button" onClick={() => setActive("documents")} style={{ background: "none", border: "none", padding: 0, color: "var(--muted)", cursor: "pointer" }}>
                {t("navDocs")}
              </button>
            </li>
            <li>
              <button type="button" onClick={() => setActive("help")} style={{ background: "none", border: "none", padding: 0, color: "var(--muted)", cursor: "pointer" }}>
                {t("navHelp")}
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Official Government Portals */}
        <div>
          <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-heading)", margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            {isHi ? "आधिकारिक सरकारी पोर्टल" : "Official Portals"}
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "10px", fontSize: "13px" }}>
            <li>
              <a href="https://pgportal.gov.in/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <span>CPGRAMS (Central Grievance)</span>
                <ExternalLink size={12} />
              </a>
            </li>
            <li>
              <a href="https://rtionline.gov.in/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <span>RTI Online Portal</span>
                <ExternalLink size={12} />
              </a>
            </li>
            <li>
              <a href="https://www.myscheme.gov.in/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <span>myScheme (Govt of India)</span>
                <ExternalLink size={12} />
              </a>
            </li>
            <li>
              <a href="https://cmharyanacell.nic.in/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <span>Haryana CM Window</span>
                <ExternalLink size={12} />
              </a>
            </li>
            <li>
              <a href="https://swachhata.mohua.gov.in/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <span>Swachhata Urban Portal</span>
                <ExternalLink size={12} />
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4: Help & Language */}
        <div>
          <h4 style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-heading)", margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            {isHi ? "सहायता व भाषा" : "Help & Settings"}
          </h4>
          <p style={{ fontSize: "13px", color: "var(--muted)", lineHeight: 1.5, margin: "0 0 14px" }}>
            {isHi
              ? "अपनी भाषा बदलें या एआई सहायक से तुरंत मार्गदर्शन प्राप्त करें।"
              : "Toggle between Hindi and English or launch the conversational copilot."}
          </p>
          <button
            type="button"
            className="archiveBtn"
            onClick={toggleLanguage}
            style={{ padding: "8px 14px", fontSize: "13px", fontWeight: 600 }}
          >
            Switch to {isHi ? "English" : "हिन्दी"}
          </button>
        </div>
      </div>

      {/* Bottom Legal Disclaimer & Copyright */}
      <div style={{
        maxWidth: "1280px",
        margin: "0 auto",
        paddingTop: "24px",
        borderTop: "1px solid var(--line)",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "14px",
        fontSize: "12px",
        color: "var(--muted)"
      }}>
        <div style={{ maxWidth: "760px", lineHeight: 1.5 }}>
          <strong style={{ color: "var(--text-heading)" }}>Honest Transparency Note:</strong> JanSetu AI is an independent citizen guide. We are not an official government entity and do not represent any municipal corporation or ministry. We prepare your formal statutory complaint and direct you to the official portal for submission.
        </div>
        <div style={{ display: "flex", gap: "16px" }}>
          <span>© 2026 JanSetu AI</span>
          <span style={{ cursor: "pointer" }}>Privacy Policy</span>
          <span style={{ cursor: "pointer" }}>Terms of Use</span>
        </div>
      </div>
    </footer>
  );
}
