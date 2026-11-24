import React, { useState, useEffect, useRef } from "react";
import { ShieldCheck, User, Sparkles, CheckCircle2, AlertCircle, Key, Settings, ExternalLink } from "lucide-react";
import { triggerGoogleSignIn, getGoogleClientId, setGoogleClientId, loadGoogleGsiScript } from "../utils/googleAuth";

export function LoginPage({ onLogin, lang, t, notify }) {
  const isHi = lang === "हिन्दी";
  const googleBtnContainerRef = useRef(null);
  const [gsiLoaded, setGsiLoaded] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [clientIdInput, setClientIdInput] = useState(() => getGoogleClientId());
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const clientId = getGoogleClientId();

  // Load official Google GSI client library and render Google button
  useEffect(() => {
    let mounted = true;

    const setupGoogleGsi = async () => {
      await loadGoogleGsiScript();
      if (!mounted) return;

      if (window.google?.accounts?.id && googleBtnContainerRef.current) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: (response) => {
              if (response?.credential) {
                try {
                  const base64Url = response.credential.split(".")[1];
                  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
                  const jsonPayload = decodeURIComponent(
                    atob(base64)
                      .split("")
                      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                      .join("")
                  );
                  const data = JSON.parse(jsonPayload);
                  onLogin({
                    name: data.name || "Verified Citizen",
                    email: data.email,
                    picture: data.picture,
                    provider: "google",
                    sub: data.sub,
                    verified: true,
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
            width: 320,
            text: "signin_with",
            shape: "rectangular"
          });
          setGsiLoaded(true);
        } catch (e) {
          console.warn("GSI init notice:", e);
        }
      }
    };

    setupGoogleGsi();
    const interval = setInterval(() => {
      if (!gsiLoaded && window.google?.accounts?.id) {
        setupGoogleGsi();
      }
    }, 800);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [clientId, onLogin, notify, isHi, gsiLoaded]);

  // Real Google Cloud Console OAuth 2.0 Trigger
  const handleGoogleSignIn = () => {
    setIsAuthenticating(true);
    triggerGoogleSignIn(
      (user) => {
        setIsAuthenticating(false);
        onLogin(user);
        notify?.(isHi ? `नमस्ते, ${user.name}! Google से लॉग इन हुआ।` : `Welcome, ${user.name}! Signed in via Google.`);
      },
      (err) => {
        setIsAuthenticating(false);
        console.error("Google login failed:", err);
        notify?.(isHi ? "Google प्रमाणीकरण विफल हुआ। पुनः प्रयास करें।" : "Google authentication was cancelled or failed. Please try again.");
      }
    );
  };

  const handleSaveClientId = (e) => {
    e.preventDefault();
    setGoogleClientId(clientIdInput.trim());
    notify?.(isHi ? "Google Client ID सहेजा गया! पुनः लोड हो रहा है..." : "Google Client ID updated!");
    setShowConfig(false);
    window.location.reload();
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
        width: "min(460px, 94vw)",
        padding: "40px 32px",
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
          OFFICIAL GOOGLE AUTHENTICATION
        </span>
        <h2 style={{ fontSize: "24px", color: "var(--text-heading)", margin: "0 0 8px", letterSpacing: "-0.5px" }}>
          {isHi ? "जनसेतु AI में लॉगिन करें" : "Sign in to JanSetu AI"}
        </h2>
        <p style={{ fontSize: "14px", color: "var(--muted)", margin: "0 0 24px", lineHeight: 1.5 }}>
          {isHi
            ? "अपनी शिकायतों, आरटीआई ड्राफ्ट व योजना पात्रता को सुरक्षित रखने के लिए अपनी Google ID से लॉगिन करें।"
            : "Sign in with your verified Google email account to access your complaint drafts, SLA tracking, and welfare schemes."}
        </p>

        {/* Real Google GSI Container (Renders Google's official iframe button) */}
        <div
          ref={googleBtnContainerRef}
          style={{ display: "flex", justifyContent: "center", marginBottom: "14px", minHeight: "44px" }}
        />

        {/* Primary Google Cloud OAuth 2.0 Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isAuthenticating}
          style={{
            width: "100%",
            padding: "13px 20px",
            borderRadius: "12px",
            border: "1px solid var(--line-strong)",
            background: "#FFFFFF",
            color: "#1F2937",
            fontWeight: 700,
            fontSize: "15px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
            transition: "all 0.15s ease",
            marginBottom: "16px"
          }}
        >
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          <span>{isAuthenticating ? (isHi ? "Google से जुड़ रहा है..." : "Connecting to Google...") : (isHi ? "Google खाते से लॉगिन करें" : "Sign in with Google")}</span>
        </button>

        {/* Security badge note */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          fontSize: "12px",
          color: "var(--muted)",
          marginTop: "12px"
        }}>
          <ShieldCheck size={14} color="#10B981" />
          <span>{isHi ? "Google Cloud Console OAuth 2.0 सुरक्षित" : "Secured by Google Cloud Console OAuth 2.0"}</span>
        </div>

        {/* Config Link */}
        <div style={{ marginTop: "18px", paddingTop: "14px", borderTop: "1px solid var(--line)" }}>
          <button
            type="button"
            onClick={() => setShowConfig(!showConfig)}
            style={{
              background: "none",
              border: "none",
              color: "var(--blue)",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "5px"
            }}
          >
            <Key size={13} />
            <span>{showConfig ? (isHi ? "कंसोल सेटिंग्स छुपाएं" : "Hide Google Console Config") : (isHi ? "Google Cloud Client ID प्रबंधित करें" : "Google Cloud Console Client ID")}</span>
          </button>
        </div>

        {/* Client ID Configuration Drawer */}
        {showConfig && (
          <form onSubmit={handleSaveClientId} style={{ marginTop: "14px", padding: "14px", background: "var(--panel2)", borderRadius: "12px", border: "1px solid var(--line)", textAlign: "left" }}>
            <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "var(--muted)", marginBottom: "4px" }}>
              Google Cloud OAuth 2.0 Web Client ID
            </label>
            <input
              type="text"
              value={clientIdInput}
              onChange={(e) => setClientIdInput(e.target.value)}
              placeholder="e.g. 763750528919-...apps.googleusercontent.com"
              style={{
                width: "100%",
                padding: "8px 10px",
                borderRadius: "8px",
                border: "1px solid var(--line)",
                background: "var(--panel)",
                color: "var(--text)",
                fontSize: "12px",
                fontFamily: "monospace",
                marginBottom: "10px"
              }}
            />
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="submit"
                className="primary"
                style={{ flex: 1, padding: "8px", fontSize: "12px", borderRadius: "8px" }}
              >
                Save Client ID
              </button>
              <button
                type="button"
                className="secondary"
                onClick={() => setShowConfig(false)}
                style={{ padding: "8px 12px", fontSize: "12px", borderRadius: "8px" }}
              >
                Cancel
              </button>
            </div>
            <div style={{ fontSize: "10px", color: "var(--muted)", marginTop: "8px" }}>
              Authorized JavaScript Origin in Google Cloud Console: <code>{window.location.origin}</code>
            </div>
          </form>
        )}

        <div style={{ marginTop: "24px", fontSize: "11px", color: "var(--muted)", lineHeight: 1.4 }}>
          {isHi
            ? "जनसेतु AI एक स्वतंत्र नागरिक सेवा है। यह किसी भी सरकारी संस्था से संबद्ध नहीं है।"
            : "JanSetu AI is an independent civic guide. We prepare your grievance and direct you to official portals."}
        </div>
      </div>
    </div>
  );
}
