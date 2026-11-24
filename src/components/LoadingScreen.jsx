import React, { useState, useEffect } from "react";
import { Sparkles, ShieldCheck } from "lucide-react";

export function LoadingScreen({ onFinish, minDuration = 900 }) {
  const [progress, setProgress] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  const tips = [
    "We prepare your complaint in 30 seconds. You file it on the official portal.",
    "JanSetu AI is an independent civic guide, not a government portal.",
    "When government portals ignore your complaint, our escalation engine drafts an RTI in 1 click.",
    "All welfare scheme eligibility is evaluated with deterministic rules, not AI guesses."
  ];

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / minDuration) * 100));
      setProgress(pct);

      if (elapsed >= minDuration) {
        clearInterval(interval);
        setTimeout(() => {
          onFinish();
        }, 150);
      }
    }, 40);

    const tipTimer = setInterval(() => {
      setTipIndex(prev => (prev + 1) % tips.length);
    }, 2400);

    return () => {
      clearInterval(interval);
      clearInterval(tipTimer);
    };
  }, [minDuration, onFinish]);

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "var(--bg)",
      zIndex: 99999,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
      transition: "opacity 0.25s ease"
    }}>
      {/* Brand Emblem */}
      <div style={{
        position: "relative",
        marginBottom: "20px",
        display: "grid",
        placeItems: "center"
      }}>
        <img
          src="/jansetu-emblem.svg"
          alt="JanSetu AI"
          style={{
            height: "76px",
            width: "auto",
            filter: "drop-shadow(0 10px 28px rgba(0, 180, 255, 0.4))",
            animation: "pulseLogo 1.6s ease infinite"
          }}
        />
      </div>

      <h2 style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-heading)", margin: "0 0 6px" }}>
        JanSetu AI
      </h2>
      <p style={{ fontSize: "14px", color: "var(--muted)", margin: "0 0 28px" }}>
        Independent Civic Copilot • Prepared right. Filed fast.
      </p>

      {/* Smooth Progress Bar */}
      <div style={{
        width: "min(320px, 80vw)",
        height: "6px",
        background: "var(--line)",
        borderRadius: "999px",
        overflow: "hidden",
        marginBottom: "20px"
      }}>
        <div style={{
          width: `${progress}%`,
          height: "100%",
          background: "var(--blue)",
          transition: "width 0.05s linear",
          borderRadius: "999px"
        }} />
      </div>

      {/* Rotating Honest Tip */}
      <div style={{
        maxWidth: "400px",
        textAlign: "center",
        fontSize: "12px",
        color: "var(--muted)",
        minHeight: "36px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px"
      }}>
        <Sparkles size={13} color="var(--blue)" style={{ flexShrink: 0 }} />
        <span>{tips[tipIndex]}</span>
      </div>
    </div>
  );
}
