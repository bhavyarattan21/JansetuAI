import React, { useState, useEffect, useRef } from "react";
import { ShieldCheck, User, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { triggerGoogleSignIn } from "../utils/googleAuth";

export function LoginPage({ onLogin, lang, t, notify }) {
  const isHi = lang === "हिन्दी";
  const googleBtnContainerRef = useRef(null);
  const [gsiLoaded, setGsiLoaded] = useState(false);

  const clientId = localStorage.getItem("jansetu_google_client_id") ||
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    "763750528919-r050jj6b5t578jdhcr4he3h6jj0qi060.apps.googleusercontent.com";

  // Google GSI Initialization
  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 12;

    const initGsi = () => {
      attempts++;
      if (window.google?.accounts?.id && googleBtnContainerRef.current) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: (response) => {
              if (response?.credential) {
                try {
                  const base64Url = response.credential.split('.')[1];
                  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                  const jsonPayload = decodeURIComponent(
                    atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
                  );
                  const data = JSON.parse(jsonPayload);
                  onLogin({
                    name: data.name || "Verified Citizen",
                    email: data.email,
                    picture: data.picture,
                    provider: "google",
                    sub: data.sub,
                    loginTime: new Date().toLocaleString()
                  });
                  notify?.(isHi ? "Google से सफलतापूर्वक लॉग इन हुआ!" : "Signed in with Google!");
                } catch (err) {
                  console.error("JWT parse err:", err);
                }
              }
            },
            auto_select: false
          });

          googleBtnContainerRef.current.innerHTML = "";
          window.google.accounts.id.renderButton(googleBtnContainerRef.current, {
            theme: "outline",
            size: "large",
            width: 300,
            text: "continue_with",
            shape: "rectangular"
          });
          setGsiLoaded(true);
        } catch (e) {
          console.warn("GSI init warning:", e);
        }
      } else if (attempts < maxAttempts) {
        setTimeout(initGsi, 300);
      }
    };

    initGsi();
  }, [clientId, onLogin, notify, isHi]);

  // Trigger Google Sign-In with official GSI or direct popup
  const launchGooglePopup = () => {
    triggerGoogleSignIn((user) => {
      onLogin(user);
      notify?.(isHi ? "Google से सफलतापूर्वक लॉग इन हुआ!" : "Signed in with Google!");
    });
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg-gradient)",
      padding: "20px"
    }}>
      <div className="panel" style={{
        width: "min(440px, 94vw)",
        padding: "36px 32px",
        borderRadius: "24px",
        textAlign: "center",
        boxShadow: "var(--shadow-lg)"
      }}>
        {/* Emblem */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "16px"
        }}>
          <img
            src="/jansetu-emblem.svg"
            alt="JanSetu AI"
            style={{
              height: "64px",
              width: "auto",
              filter: "drop-shadow(0 8px 24px rgba(0, 180, 255, 0.35))"
            }}
          />
        </div>

        <span className="kicker" style={{ display: "inline-block", marginBottom: "6px" }}>
          INDEPENDENT CIVIC COPILOT
        </span>
        <h2 style={{ fontSize: "22px", color: "var(--text-heading)", margin: "0 0 8px" }}>
          {isHi ? "जनसेतु AI में आपका स्वागत है" : "Welcome to JanSetu AI"}
        </h2>
        <p style={{ fontSize: "14px", color: "var(--muted)", margin: "0 0 28px", lineHeight: 1.5 }}>
          {isHi
            ? "नागरिक शिकायत तैयारी, योजना खोज एवं प्रमाणपत्रों हेतु आपका स्वतंत्र एआई सहायक।"
            : "Sign in with your Google account to save your complaint drafts, tracking timers, and scheme eligibility."}
        </p>

        {/* Real Google GSI Container */}
        <div
          ref={googleBtnContainerRef}
          style={{ display: gsiLoaded ? "flex" : "none", justifyContent: "center", marginBottom: "16px" }}
        />

        {/* Fallback Google Sign-In Button */}
        {!gsiLoaded && (
          <button
            type="button"
            className="googleBtn"
            onClick={launchGooglePopup}
            style={{
              width: "100%",
              padding: "12px 18px",
              borderRadius: "12px",
              border: "1px solid var(--line)",
              background: "var(--panel)",
              color: "var(--text)",
              fontWeight: 600,
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              cursor: "pointer",
              boxShadow: "var(--shadow-sm)",
              marginBottom: "16px"
            }}
          >
            <span style={{ fontWeight: 800, color: "#4285F4", fontSize: "16px" }}>G</span>
            <span>{isHi ? "Google से आगे बढ़ें" : "Continue with Google"}</span>
          </button>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "16px 0" }}>
          <div style={{ flex: 1, height: "1px", background: "var(--line)" }} />
          <span style={{ fontSize: "12px", color: "var(--muted)" }}>or</span>
          <div style={{ flex: 1, height: "1px", background: "var(--line)" }} />
        </div>

        {/* 1-Click Guest Citizen Mode for Hackathon Evaluators */}
        <button
          type="button"
          onClick={() => onLogin({
            name: isHi ? "अतिथि नागरिक" : "Citizen Evaluator",
            email: "evaluator@jansetu.local",
            provider: "local",
            loginTime: new Date().toLocaleString()
          })}
          style={{
            width: "100%",
            padding: "11px 16px",
            borderRadius: "12px",
            border: "1px solid var(--line)",
            background: "var(--panel2)",
            color: "var(--muted)",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          {isHi ? "अतिथि के रूप में जारी रखें (डेमो)" : "Continue as Guest Citizen (Instant Demo)"}
        </button>

        <div style={{ marginTop: "24px", fontSize: "11px", color: "var(--muted)", lineHeight: 1.4 }}>
          {isHi
            ? "जनसेतु AI एक स्वतंत्र नागरिक सेवा है। यह किसी भी सरकारी संस्था से संबद्ध नहीं है।"
            : "JanSetu AI is an independent guide. We prepare your grievance and direct you to official portals."}
        </div>
      </div>
    </div>
  );
}
