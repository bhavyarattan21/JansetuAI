// Real Google Cloud Console Authentication for JanSetu AI
// Uses Google Identity Services (GSI) & Google OAuth 2.0 Token Client

export const DEFAULT_GOOGLE_CLIENT_ID =
  "763750528919-r050jj6b5t578jdhcr4he3h6jj0qi060.apps.googleusercontent.com";

export function getGoogleClientId() {
  return (
    localStorage.getItem("jansetu_google_client_id") ||
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    DEFAULT_GOOGLE_CLIENT_ID
  );
}

export function setGoogleClientId(id) {
  if (id && id.trim()) {
    localStorage.setItem("jansetu_google_client_id", id.trim());
  } else {
    localStorage.removeItem("jansetu_google_client_id");
  }
}

// Ensure the official Google GSI script is loaded
export function loadGoogleGsiScript() {
  return new Promise((resolve) => {
    if (window.google?.accounts) {
      resolve(true);
      return;
    }
    const existing = document.querySelector('script[src*="accounts.google.com/gsi/client"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      return;
    }
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

// Trigger real Google OAuth 2.0 Flow via Google Identity Services
export function triggerGoogleSignIn(onSuccess, onError) {
  const clientId = getGoogleClientId();

  // 1. If Google Identity Services OAuth 2.0 Token Client is available, use it (opens official accounts.google.com popup)
  if (window.google?.accounts?.oauth2) {
    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: "openid profile email",
        callback: async (tokenResponse) => {
          if (tokenResponse.error) {
            console.warn("Google OAuth error:", tokenResponse.error);
            onError?.(tokenResponse.error);
            return;
          }
          if (tokenResponse.access_token) {
            try {
              // Fetch genuine profile directly from Google's userinfo API
              const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
              });
              const profile = await res.json();
              if (profile.email) {
                const user = {
                  name: profile.name || "Verified Citizen",
                  email: profile.email,
                  picture: profile.picture || null,
                  sub: profile.sub || `GOOGLE-${Date.now()}`,
                  provider: "google",
                  verified: true,
                  accessToken: tokenResponse.access_token,
                  loginTime: new Date().toLocaleString()
                };
                onSuccess?.(user);
                return;
              }
            } catch (err) {
              console.error("Failed to fetch userinfo from Google:", err);
            }
          }
        }
      });
      client.requestAccessToken({ prompt: "select_account" });
      return;
    } catch (e) {
      console.warn("OAuth2 token client init failed, falling back to GSI One Tap:", e);
    }
  }

  // 2. If Google GSI ID client is available, prompt One Tap / account chooser directly on accounts.google.com
  if (window.google?.accounts?.id) {
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
              const user = {
                name: data.name || "Verified Citizen",
                email: data.email,
                picture: data.picture || null,
                sub: data.sub,
                provider: "google",
                verified: true,
                loginTime: new Date().toLocaleString()
              };
              onSuccess?.(user);
            } catch (err) {
              console.error("JWT parse error:", err);
              onError?.(err);
            }
          }
        },
        auto_select: false
      });
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          // Fallback to real Google OAuth window
          openRealGoogleOAuthRedirect(clientId, onSuccess);
        }
      });
      return;
    } catch (e) {
      console.warn("GSI ID prompt failed:", e);
    }
  }

  // 3. Fallback: Direct OAuth 2.0 window on accounts.google.com
  openRealGoogleOAuthRedirect(clientId, onSuccess);
}

// Direct Google Cloud OAuth 2.0 URL (runs 100% on accounts.google.com)
function openRealGoogleOAuthRedirect(clientId, onSuccess) {
  const redirectUri = window.location.origin;
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(
    clientId
  )}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=token%20id_token&scope=openid%20profile%20email&nonce=${Date.now()}&prompt=select_account`;

  const width = 500;
  const height = 650;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2.5;

  const popup = window.open(
    authUrl,
    "GoogleSignInOfficial",
    `width=${width},height=${height},left=${left},top=${top},status=0,toolbar=0,menubar=0`
  );

  if (!popup) {
    // If popup blocked, redirect directly
    window.location.href = authUrl;
    return;
  }

  // Listen for OAuth token in popup redirect or storage
  const checkTimer = setInterval(() => {
    try {
      if (!popup || popup.closed) {
        clearInterval(checkTimer);
        return;
      }
      if (popup.location && popup.location.origin === window.location.origin) {
        const hash = popup.location.hash;
        if (hash) {
          const params = new URLSearchParams(hash.substring(1));
          const accessToken = params.get("access_token");
          const idToken = params.get("id_token");
          if (accessToken || idToken) {
            clearInterval(checkTimer);
            popup.close();
            if (idToken) {
              const base64Url = idToken.split(".")[1];
              const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
              const jsonPayload = decodeURIComponent(
                atob(base64)
                  .split("")
                  .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                  .join("")
              );
              const data = JSON.parse(jsonPayload);
              onSuccess?.({
                name: data.name,
                email: data.email,
                picture: data.picture,
                sub: data.sub,
                provider: "google",
                verified: true,
                loginTime: new Date().toLocaleString()
              });
            } else if (accessToken) {
              fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
                headers: { Authorization: `Bearer ${accessToken}` }
              })
                .then((r) => r.json())
                .then((data) => {
                  onSuccess?.({
                    name: data.name,
                    email: data.email,
                    picture: data.picture,
                    sub: data.sub,
                    provider: "google",
                    verified: true,
                    loginTime: new Date().toLocaleString()
                  });
                });
            }
          }
        }
      }
    } catch (e) {
      // Cross-origin access until redirected back is normal
    }
  }, 400);
}
