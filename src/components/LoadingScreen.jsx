import React, { useState, useEffect } from "react";
import { Sparkles, ShieldCheck, Zap } from "lucide-react";

export function LoadingScreen({ onFinish, minDuration = 850 }) {
  const [progress, setProgress] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  const tips = [
    "Prepared right. Filed fast. Followed up.",
    "JanSetu AI sits in front of government portals so filing takes 30 seconds.",
    "When authorities ignore your complaint, our escalation engine drafts an RTI in 1 click.",
    "Deterministic citizen rule engine for 25+ statutory welfare schemes."
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
        }, 120);
      }
    }, 35);

    const tipTimer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % tips.length);
    }, 2200);

    return () => {
      clearInterval(interval);
      clearInterval(tipTimer);
    };
  }, [minDuration, onFinish]);

  const getPhaseText = () => {
    if (progress < 35) return "Initializing JanSetu AI Copilot...";
    if (progress < 75) return "Syncing Citizen Charter Portals & Rules...";
    return "Ready for Indian Citizens";
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "var(--bg)",
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        userSelect: "none"
      }}
    >
      {/* Animated Brand Emblem Container */}
      <div
        style={{
          position: "relative",
          width: "140px",
          height: "140px",
          display: "grid",
          placeItems: "center",
          marginBottom: "24px"
        }}
      >
        {/* Glowing Aura Ring Behind Logo */}
        <div
          style={{
            position: "absolute",
            width: "110px",
            height: "110px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0, 180, 255, 0.45) 0%, rgba(29, 78, 216, 0.2) 60%, transparent 80%)",
            animation: "auraGlow 2.4s ease-in-out infinite",
            filter: "blur(10px)",
            pointerEvents: "none"
          }}
        />

        {/* Orbit Ring Around Logo */}
        <div
          style={{
            position: "absolute",
            width: "124px",
            height: "124px",
            borderRadius: "50%",
            border: "1.5px dashed rgba(56, 189, 248, 0.4)",
            animation: "orbitSpin 10s linear infinite",
            pointerEvents: "none"
          }}
        />

        {/* Orbit Dot */}
        <div
          style={{
            position: "absolute",
            width: "138px",
            height: "138px",
            animation: "orbitSpin 6s linear infinite",
            pointerEvents: "none"
          }}
        >
          <div
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#38BDF8",
              boxShadow: "0 0 10px #38BDF8",
              position: "absolute",
              top: "0px",
              left: "50%",
              transform: "translateX(-50%)"
            }}
          />
        </div>

        {/* The Animated Logo Emblem */}
        <img
          src="/jansetu-emblem.svg"
          alt="JanSetu AI Logo"
          style={{
            height: "82px",
            width: "auto",
            position: "relative",
            zIndex: 2,
            animation: "logoFloat 2.4s ease-in-out infinite"
          }}
        />
      </div>

      {/* Brand Title */}
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <h1
          style={{
            fontSize: "26px",
            fontWeight: 800,
            color: "var(--text-heading)",
            letterSpacing: "-0.5px",
            margin: "0 0 6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "4px"
          }}
        >
          <span>JanSetu</span>{" "}
          <span style={{ color: "var(--saffron)" }}>A</span>
          <span style={{ color: "var(--blue)" }}>I</span>
        </h1>
        <p style={{ fontSize: "13px", color: "var(--muted)", margin: 0, fontWeight: 500 }}>
          Independent Civic Copilot for Indian Citizens
        </p>
      </div>

      {/* Progress Container */}
      <div style={{ width: "min(340px, 86vw)", textAlign: "center", marginBottom: "20px" }}>
        {/* Phase subtitle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "12px",
            color: "var(--muted)",
            marginBottom: "8px",
            fontWeight: 600
          }}
        >
          <span>{getPhaseText()}</span>
          <span style={{ color: "var(--blue)", fontFamily: "monospace" }}>{progress}%</span>
        </div>

        {/* Smooth Shimmer Progress Bar */}
        <div
          style={{
            width: "100%",
            height: "6px",
            background: "var(--line)",
            borderRadius: "999px",
            overflow: "hidden",
            position: "relative"
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: "linear-gradient(90deg, #1D4ED8 0%, #38BDF8 50%, #2563EB 100%)",
              borderRadius: "999px",
              transition: "width 0.08s ease-out",
              boxShadow: "0 0 12px rgba(56, 189, 248, 0.5)"
            }}
          />
        </div>
      </div>

      {/* Rotating Civic Tip */}
      <div
        style={{
          maxWidth: "420px",
          textAlign: "center",
          fontSize: "12px",
          color: "var(--muted)",
          minHeight: "36px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          padding: "0 16px",
          lineHeight: 1.5
        }}
      >
        <Sparkles size={14} color="var(--blue)" style={{ flexShrink: 0 }} />
        <span>{tips[tipIndex]}</span>
      </div>
    </div>
  );
}
