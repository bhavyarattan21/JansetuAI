import React, { useState, useEffect, useRef } from "react";
import { ShieldCheck, User, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";

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

  // Fallback Google dialog window
  const launchGooglePopup = () => {
    if (clientId && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            openSimulatedGooglePopup();
          }
        });
        return;
      } catch (e) {}
    }
    openSimulatedGooglePopup();
  };

  const openSimulatedGooglePopup = () => {
    const width = 480;
    const height = 580;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2.5;

    const popup = window.open(
      "about:blank",
      "GoogleSignIn",
      `width=${width},height=${height},left=${left},top=${top},status=0,toolbar=0,menubar=0`
    );

    if (!popup) {
      // Direct login if popup blocked
      onLogin({
        name: "Citizen Resident",
        email: "citizen@jansetu.local",
        provider: "google",
        loginTime: new Date().toLocaleString()
      });
      return;
    }

    const popupHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Sign in – Google Accounts</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 32px; background: #fff; color: #202124; }
          .logo { text-align: center; margin-bottom: 12px; }
          h2 { font-weight: 400; font-size: 22px; text-align: center; margin: 0 0 6px; }
          .sub { text-align: center; color: #5f6368; font-size: 14px; margin-bottom: 24px; }
          .acc { display: flex; align-items: center; padding: 12px; border-bottom: 1px solid #dadce0; cursor: pointer; }
          .acc:hover { background: #f8f9fa; border-radius: 6px; }
          .avatar { width: 36px; height: 36px; border-radius: 50%; background: #1a73e8; color: #fff; display: grid; place-items: center; font-weight: 700; margin-right: 12px; }
          .name { font-size: 14px; font-weight: 500; }
          .email { font-size: 12px; color: #5f6368; }
          .btn-custom { margin-top: 16px; width: 100%; padding: 10px; background: #1a73e8; color: #fff; border: none; border-radius: 4px; font-weight: 500; cursor: pointer; }
        </style>
      </head>
      <body>
        <div class="logo">
          <svg width="40" height="40" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
        </div>
        <h2>Choose an account</h2>
        <div class="sub">to continue to <strong>JanSetuAI</strong></div>
        <div class="acc" onclick="select('Bhavya Rattan', 'bhavyarattan21@gmail.com')">
          <div class="avatar">B</div>
          <div><div class="name">Bhavya Rattan</div><div class="email">bhavyarattan21@gmail.com</div></div>
        </div>
        <div class="acc" onclick="select('Citizen Resident', 'citizen@jansetu.demo')">
          <div class="avatar" style="background:#0f9d58;">C</div>
          <div><div class="name">Demo Citizen</div><div class="email">citizen@jansetu.demo</div></div>
        </div>
        <script>
          function select(name, email) {
            if (window.opener) {
              window.opener.postMessage({ type: 'GOOGLE_AUTH_DONE', user: { name, email, provider: 'google' } }, '*');
            }
            window.close();
          }
        </script>
      </body>
      </html>
    `;
    popup.document.write(popupHtml);
    popup.document.close();

    const handleMessage = (e) => {
      if (e.data?.type === 'GOOGLE_AUTH_DONE' && e.data.user) {
        window.removeEventListener('message', handleMessage);
        onLogin(e.data.user);
      }
    };
    window.addEventListener('message', handleMessage);
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
          width: "56px",
          height: "56px",
          borderRadius: "16px",
          background: "linear-gradient(135deg, var(--blue), #0284c7)",
          color: "#ffffff",
          display: "grid",
          placeItems: "center",
          fontSize: "22px",
          fontWeight: 800,
          margin: "0 auto 16px"
        }}>
          JS
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
