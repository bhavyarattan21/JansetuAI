import React, { useState } from "react";
import {
  Bot, Send, Sparkles, User, ArrowRight, CornerDownRight, FileText
} from "lucide-react";

export function CivicCoPilot({
  chat,
  message,
  setMessage,
  sendMessage,
  onAction,
  lang,
  t
}) {
  const isHi = lang === "हिन्दी";

  const suggestions = isHi ? [
    "सड़क के गड्ढे की शिकायत कैसे दर्ज करें?",
    "पीएम-किसान योजना की पात्रता क्या है?",
    "आय प्रमाण पत्र के लिए कौन से दस्तावेज़ चाहिए?",
    "यदि सरकारी पोर्टल पर शिकायत का समाधान न हो तो क्या करें?"
  ] : [
    "How do I prepare a road repair complaint for PWD?",
    "What are the eligibility criteria for PM-KISAN?",
    "Which documents are required for an Income Certificate?",
    "What should I do if the municipal portal ignores my complaint?"
  ];

  return (
    <main className="page helpPage" style={{ maxWidth: "900px", margin: "0 auto", paddingBottom: "60px" }}>
      <div className="pageTitle">
        <span className="kicker">INDEPENDENT CIVIC ASSISTANT</span>
        <h1 style={{ fontSize: "28px", margin: "4px 0 6px", color: "var(--text-heading)" }}>
          {t("navHelp")}
        </h1>
        <p style={{ color: "var(--muted)", margin: 0, fontSize: "14px" }}>
          {isHi
            ? "सरकारी प्रक्रियाओं, योजनाओं और शिकायत दर्ज करने के संबंध में कोई भी सवाल पूछें। JanSetu AI निष्पक्ष व तथ्यपरक मार्गदर्शन प्रदान करता है।"
            : "Ask any question regarding civic paperwork, welfare eligibility, or portal escalations. JanSetu AI provides verified statutory guidance."}
        </p>
      </div>

      <div className="chat" style={{ background: "var(--panel)", border: "1px solid var(--line)", borderRadius: "18px", overflow: "hidden", display: "flex", flexDirection: "column", height: "580px", boxShadow: "var(--shadow-md)" }}>
        {/* Chat Header */}
        <div className="chatHead" style={{ padding: "14px 20px", borderBottom: "1px solid var(--line)", background: "var(--panel2)", display: "flex", alignItems: "center", gap: "10px" }}>
          <div className="aiBadge" style={{ width: "32px", height: "32px", borderRadius: "8px", background: "var(--blue)", color: "#fff", display: "grid", placeItems: "center" }}>
            <Bot size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-heading)" }}>
              JanSetu AI Copilot
            </div>
            <div style={{ fontSize: "11px", color: "var(--emerald)", fontWeight: 600 }}>
              Online • Ready to assist
            </div>
          </div>
        </div>

        {/* Message Stream */}
        <div className="messages" style={{ flex: 1, padding: "20px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Welcome Message */}
          <div className="message assistant" style={{ alignSelf: "flex-start", maxWidth: "80%", background: "var(--panel2)", padding: "14px 18px", borderRadius: "14px 14px 14px 2px", fontSize: "14px", lineHeight: 1.5, color: "var(--text)" }}>
            <p style={{ margin: 0 }}>
              {isHi
                ? "नमस्ते! मैं जनसेतु एआई हूँ — आपका स्वतंत्र नागरिक सहायक। आप किसी भी जनसमस्या का समाधान, सरकारी योजनाओं की पात्रता या प्रमाणपत्रों के नियम पूछ सकते हैं।"
                : "Namaste! I am JanSetu AI — your independent civic copilot. How can I assist you with civic grievances, welfare schemes, or certificates today?"}
            </p>
          </div>

          {chat.map((m, idx) => (
            <div
              key={idx}
              className={`message ${m.role}`}
              style={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "80%",
                background: m.role === "user" ? "var(--blue)" : "var(--panel2)",
                color: m.role === "user" ? "#ffffff" : "var(--text)",
                padding: "12px 16px",
                borderRadius: m.role === "user" ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                fontSize: "14px",
                lineHeight: 1.5,
                whiteSpace: "pre-wrap"
              }}
            >
              {m.text}
            </div>
          ))}
        </div>

        {/* Quick Suggestion Pills */}
        <div style={{ padding: "8px 16px", background: "var(--panel2)", borderTop: "1px solid var(--line)", display: "flex", gap: "6px", overflowX: "auto" }}>
          {suggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setMessage(s);
                sendMessage(s);
              }}
              style={{ background: "var(--panel)", border: "1px solid var(--line)", padding: "5px 10px", borderRadius: "14px", fontSize: "11px", color: "var(--text)", whiteSpace: "nowrap", cursor: "pointer" }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          className="chatForm"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          style={{ padding: "12px 16px", display: "flex", gap: "8px", background: "var(--panel)" }}
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={isHi ? "यहाँ अपना सवाल लिखें..." : "Type your civic question here..."}
            style={{ flex: 1, padding: "12px 14px", borderRadius: "10px", border: "1px solid var(--line)", background: "var(--panel-input)", color: "var(--text)", fontSize: "14px" }}
          />
          <button
            type="submit"
            className="primary"
            disabled={!message.trim()}
            style={{ padding: "0 18px", borderRadius: "10px", display: "grid", placeItems: "center" }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </main>
  );
}
