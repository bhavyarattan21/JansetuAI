import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import {
  X, Check, Copy, ShieldCheck, CheckCircle2, AlertCircle, LogOut,
  User, Key, ExternalLink, Zap, RotateCcw
} from "lucide-react";
import "./styles.css";

import { translations } from "./i18n/translations";
import { initialSeedGrievances, demoScenarioTicket } from "./data/seedData";
import { Navbar } from "./components/Navbar";
import { HomeHero } from "./components/HomeHero";
import { PrepareAndFile } from "./components/PrepareAndFile";
import { MyComplaints } from "./components/MyComplaints";
import { SchemeFinder } from "./components/SchemeFinder";
import { DocumentsHub } from "./components/DocumentsHub";
import { CivicCoPilot } from "./components/CivicCoPilot";
import { MobileBottomNav } from "./components/MobileBottomNav";
import { EscalationModal } from "./components/EscalationModal";
import { LoadingScreen } from "./components/LoadingScreen";
import { LoginPage } from "./components/LoginPage";
import { SettingsModal } from "./components/SettingsModal";
import { Footer } from "./components/Footer";
import { triggerGoogleSignIn } from "./utils/googleAuth";

// Root JanSetu AI Application
function App() {
  // Splash Loading Screen (850ms sequence)
  const [loading, setLoading] = useState(true);

  // Theme state: Defaults to LIGHT mode for maximum civic clarity & hackathon presentation
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("jansetu_theme") || "light";
  });

  // Language state: English or हिन्दी
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem("jansetu_lang") || "English";
  });

  // Active view tab: home | file | tracker | schemes | documents | help
  const [active, setActive] = useState("home");

  // User Authentication (Enforces genuine Google Cloud authentication; no guest bypass)
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("jansetu_current_user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed && parsed.provider === "google") return parsed;
      }
    } catch (e) {}
    return null;
  });

  // Persistent Complaints Store (initialized with honest, realistic Sohna demo data)
  const [complaints, setComplaints] = useState(() => {
    try {
      const saved = localStorage.getItem("jansetu_complaints_v3");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return initialSeedGrievances;
  });

  // State passed to Prepare & File from the Hero front door
  const [prepareInitialData, setPrepareInitialData] = useState(null);

  // Active Demo Scenario modal trigger
  const [demoEscalationModal, setDemoEscalationModal] = useState(null);

  // Co-Pilot Chat Context (when opened from specific scheme or document card)
  const [chatContext, setChatContext] = useState(null);

  // Persistent Co-Pilot Chat History
  const [chat, setChat] = useState(() => {
    try {
      const saved = localStorage.getItem("jansetu_copilot_chat");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  // 5-Second Soft Delete Undo State
  const [undoDelete, setUndoDelete] = useState(null);
  const undoTimerRef = useRef(null);

  // UI Modals & Toasts
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [toast, setToast] = useState("");

  // Persist Theme changes to DOM & localStorage
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    if (theme === "dark") {
      document.body.classList.add("dark-theme");
      document.body.classList.remove("light-theme");
    } else {
      document.body.classList.add("light-theme");
      document.body.classList.remove("dark-theme");
    }
    localStorage.setItem("jansetu_theme", theme);
  }, [theme]);

  // Persist Language
  const toggleLanguage = () => {
    const nextLang = lang === "हिन्दी" ? "English" : "हिन्दी";
    setLangState(nextLang);
    localStorage.setItem("jansetu_lang", nextLang);
    showToast(nextLang === "हिन्दी" ? "भाषा बदलकर हिन्दी कर दी गई।" : "Switched language to English.");
  };

  // Persist Theme Toggle
  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    showToast(nextTheme === "dark" ? "Dark mode activated" : "Light mode activated");
  };

  // Toast notification helper
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3200);
  };

  // Persist complaints to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("jansetu_complaints_v3", JSON.stringify(complaints));
    } catch (e) {
      console.error("Storage error:", e);
    }
  }, [complaints]);

  // Persist Co-Pilot Chat
  useEffect(() => {
    try {
      localStorage.setItem("jansetu_copilot_chat", JSON.stringify(chat));
    } catch (e) {}
  }, [chat]);

  // Translation helper
  const t = (key) => {
    return translations[lang]?.[key] || translations["English"]?.[key] || key;
  };

  // Route from Home Hero Co-Pilot into the appropriate flow
  const handleRouteFlow = (result) => {
    if (result.intent === "scheme") {
      setActive("schemes");
      showToast(lang === "हिन्दी" ? "योजना खोजक पर पुनः निर्देशित किया गया।" : "Navigated to Scheme Finder.");
    } else if (result.intent === "certificate") {
      setActive("documents");
      showToast(lang === "हिन्दी" ? "दस्तावेज़ चेकलिस्ट पर पुनः निर्देशित किया गया।" : "Navigated to Document Checklists.");
    } else {
      setPrepareInitialData(result);
      setActive("file");
      showToast(lang === "हिन्दी" ? "शिकायत प्रारूपण शुरू किया गया।" : "Started complaint drafting flow.");
    }
  };

  // One-Click 60-Second Demo Scenario for Hackathon Judges
  const handleLaunchDemoScenario = () => {
    setActive("tracker");
    setDemoEscalationModal(demoScenarioTicket);
    showToast(
      lang === "हिन्दी"
        ? "60-सेकंड डेमो परिदृश्य लोड हुआ: सोहना सड़क समस्या व आरटीआई एस्केलेशन।"
        : "Loaded 60-Second Demo: Sohna Highway Pothole & RTI Escalation!"
    );
  };

  // Complaint Management Actions
  const handleComplaintFiled = (newComplaint) => {
    setComplaints((prev) => [newComplaint, ...prev]);
  };

  const handleArchiveComplaint = (id) => {
    setComplaints((prev) => prev.filter((c) => c.id !== id));
    showToast(t("archivedSuccess") || "Complaint archived.");
  };

  // Soft Delete with 5-Second Undo Toast
  const handleDeleteWithUndo = (complaint) => {
    setComplaints((prev) => prev.filter((c) => c.id !== complaint.id));

    if (undoTimerRef.current) clearInterval(undoTimerRef.current);

    let timeLeft = 5;
    setUndoDelete({ complaint, timeLeft });

    undoTimerRef.current = setInterval(() => {
      timeLeft -= 1;
      if (timeLeft <= 0) {
        clearInterval(undoTimerRef.current);
        setUndoDelete(null);
        showToast(lang === "हिन्दी" ? "शिकायत स्थायी रूप से हटा दी गई।" : "Complaint deleted.");
      } else {
        setUndoDelete((prev) => (prev ? { ...prev, timeLeft } : null));
      }
    }, 1000);
  };

  const handleRestoreComplaint = () => {
    if (undoTimerRef.current) clearInterval(undoTimerRef.current);
    if (undoDelete?.complaint) {
      setComplaints((prev) => [undoDelete.complaint, ...prev]);
      showToast(lang === "हिन्दी" ? "शिकायत पुनर्स्थापित की गई!" : "Complaint restored!");
    }
    setUndoDelete(null);
  };

  const handleConfirmResolved = (id, { afterPhoto, resolutionNotes }) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        return {
          ...c,
          status: "resolved",
          statusHi: "नागरिक द्वारा सत्यापित समाधान",
          resolutionConfirmed: true,
          afterPhoto: afterPhoto,
          resolutionDate: new Date().toLocaleString(),
          resolutionNotes: resolutionNotes,
          timeline: [
            ...(c.timeline || []),
            {
              title: "Citizen Confirmed Resolution on Ground",
              date: new Date().toLocaleString(),
              note: resolutionNotes,
              actor: "Citizen (Verified on JanSetu)"
            }
          ]
        };
      })
    );
  };

  // 1. Initial Loading Screen
  if (loading) {
    return <LoadingScreen onFinish={() => setLoading(false)} minDuration={850} />;
  }

  // 2. Main Civic Portal View (Unauthenticated visitors can explore Home, Schemes, Documents, and CoPilot; Google Login required before filing)
  return (
    <div className="app">
      {/* Toast Notification Banner */}
      {toast && (
        <div style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          background: "var(--text-heading)",
          color: "var(--bg)",
          padding: "12px 20px",
          borderRadius: "10px",
          fontSize: "13px",
          fontWeight: 600,
          boxShadow: "var(--shadow-lg)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          animation: "fadeIn 0.2s ease"
        }}>
          <CheckCircle2 size={16} color="var(--emerald)" />
          <span>{toast}</span>
        </div>
      )}

      {/* 5-Second Soft Delete Undo Banner */}
      {undoDelete && (
        <div style={{
          position: "fixed",
          bottom: "76px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "#0F172A",
          color: "#FFFFFF",
          padding: "12px 22px",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          boxShadow: "0 12px 32px rgba(0,0,0,0.35)",
          zIndex: 10001,
          fontSize: "13px",
          border: "1px solid rgba(255,255,255,0.18)"
        }}>
          <span>
            {lang === "हिन्दी"
              ? `शिकायत हटाई गई (${undoDelete.timeLeft}s)`
              : `Complaint deleted (${undoDelete.timeLeft}s)`}
          </span>
          <button
            type="button"
            onClick={handleRestoreComplaint}
            style={{
              background: "var(--blue)",
              color: "#FFFFFF",
              border: "none",
              padding: "5px 12px",
              borderRadius: "6px",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              gap: "5px"
            }}
          >
            <RotateCcw size={13} />
            <span>{lang === "हिन्दी" ? "पूर्ववत (Undo)" : "Undo"}</span>
          </button>
        </div>
      )}

      {/* Main Navigation Header */}
      <Navbar
        active={active}
        setActive={setActive}
        lang={lang}
        toggleLanguage={toggleLanguage}
        theme={theme}
        toggleTheme={toggleTheme}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenSettings={() => setSettingsModalOpen(true)}
        complaintsCount={complaints.length}
        t={t}
      />

      {/* Views */}
      {active === "home" && (
        <HomeHero
          onRouteFlow={handleRouteFlow}
          onLaunchDemoScenario={handleLaunchDemoScenario}
          lang={lang}
          t={t}
        />
      )}

      {active === "file" && (
        <PrepareAndFile
          initialData={prepareInitialData}
          onComplaintFiled={handleComplaintFiled}
          onViewTracker={() => setActive("tracker")}
          user={user}
          onLogin={(u) => {
            setUser(u);
            localStorage.setItem("jansetu_current_user", JSON.stringify(u));
            showToast(lang === "हिन्दी" ? `नमस्ते, ${u.name}!` : `Welcome, ${u.name}!`);
          }}
          lang={lang}
          t={t}
          notify={showToast}
        />
      )}

      {active === "tracker" && (
        <MyComplaints
          complaints={complaints}
          onArchiveComplaint={handleArchiveComplaint}
          onDeleteWithUndo={handleDeleteWithUndo}
          onConfirmResolved={handleConfirmResolved}
          onLodgeNew={() => {
            setPrepareInitialData(null);
            setActive("file");
          }}
          lang={lang}
          t={t}
          notify={showToast}
        />
      )}

      {active === "schemes" && (
        <SchemeFinder
          onNavigateToDocs={() => setActive("documents")}
          onAskAI={(scheme) => {
            setChatContext({
              type: "scheme",
              title: scheme.title,
              ministry: scheme.ministry,
              benefit: scheme.benefit,
              eligibilityCriteria: scheme.eligibilityCriteria
            });
            setActive("help");
          }}
          lang={lang}
          t={t}
          notify={showToast}
        />
      )}

      {active === "documents" && (
        <DocumentsHub
          onAskAI={(doc) => {
            setChatContext({
              type: "certificate",
              title: doc.title,
              titleHi: doc.titleHi,
              dept: doc.dept,
              fee: doc.fee,
              sla: doc.sla,
              checklistItems: doc.checklistItems
            });
            setActive("help");
          }}
          lang={lang}
          t={t}
          notify={showToast}
        />
      )}

      {active === "help" && (
        <CivicCoPilot
          chat={chat}
          setChat={setChat}
          contextItem={chatContext}
          onClearContext={() => setChatContext(null)}
          onRouteWithComplaint={(draftData) => {
            setPrepareInitialData(draftData);
            setActive("file");
          }}
          lang={lang}
          t={t}
          notify={showToast}
        />
      )}

      {/* Multi-Column Honest Institutional Footer */}
      <Footer
        setActive={setActive}
        toggleLanguage={toggleLanguage}
        lang={lang}
        t={t}
      />

      {/* Mobile-first bottom navigation bar */}
      <MobileBottomNav
        active={active}
        setActive={setActive}
        complaintsCount={complaints.length}
        t={t}
      />

      {/* 60-Second Demo Scenario Escalation Modal */}
      {demoEscalationModal && (
        <EscalationModal
          grievance={demoEscalationModal}
          onClose={() => setDemoEscalationModal(null)}
          lang={lang}
          t={t}
          notify={showToast}
        />
      )}

      {/* Citizen Auth & Profile Modal */}
      {authModalOpen && (
        <AuthModal
          user={user}
          onLogin={(u) => {
            setUser(u);
            localStorage.setItem("jansetu_current_user", JSON.stringify(u));
            setAuthModalOpen(false);
            showToast(lang === "हिन्दी" ? `नमस्ते, ${u.name}!` : `Welcome, ${u.name}!`);
          }}
          onLogout={() => {
            setUser(null);
            localStorage.removeItem("jansetu_current_user");
            setAuthModalOpen(false);
            showToast(lang === "हिन्दी" ? "सफलतापूर्वक साइन आउट हुआ।" : "Signed out.");
          }}
          onClose={() => setAuthModalOpen(false)}
          lang={lang}
          t={t}
        />
      )}

      {/* Citizen & Portal Settings Modal */}
      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        theme={theme}
        toggleTheme={toggleTheme}
        lang={lang}
        toggleLanguage={toggleLanguage}
        notify={showToast}
        t={t}
      />
    </div>
  );
}

// Clean, official Google Auth Modal (Profile & Google Account Management)
function AuthModal({ user, onLogin, onLogout, onClose, lang, t }) {
  const isHi = lang === "हिन्दी";

  const handleGoogleSignIn = () => {
    triggerGoogleSignIn((googleUser) => {
      onLogin(googleUser);
    });
  };

  return (
    <div className="modalOverlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div className="panel" style={{ width: "min(460px, 92vw)", padding: "28px", borderRadius: "18px" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ margin: 0, fontSize: "18px", color: "var(--text-heading)", fontWeight: 700 }}>
            {user ? (isHi ? "नागरिक Google प्रोफ़ाइल" : "Citizen Google Profile") : (isHi ? "Google साइन-इन" : "Google Sign-In")}
          </h3>
          <button className="modalClose" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {user ? (
          <div>
            {/* Citizen Info Badge */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px", background: "var(--panel2)", borderRadius: "12px", marginBottom: "16px", border: "1px solid var(--line)" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#1A73E8", color: "#fff", display: "grid", placeItems: "center", fontWeight: 700, fontSize: "18px", flexShrink: 0, overflow: "hidden" }}>
                {user.picture ? (
                  <img src={user.picture} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  user.name ? user.name[0].toUpperCase() : "G"
                )}
              </div>
              <div style={{ overflow: "hidden", flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <strong style={{ fontSize: "15px", color: "var(--text-heading)", display: "block", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                    {user.name}
                  </strong>
                  <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: "rgba(16, 185, 129, 0.15)", color: "#10B981", fontWeight: 700 }}>
                    GOOGLE VERIFIED
                  </span>
                </div>
                <span style={{ display: "block", fontSize: "12px", color: "var(--muted)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                  {user.email}
                </span>
              </div>
            </div>

            {/* Switch Account (Google) */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              style={{
                width: "100%",
                padding: "10px 14px",
                borderRadius: "10px",
                border: "1px solid var(--line)",
                background: "var(--panel2)",
                color: "var(--text-heading)",
                fontSize: "13px",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                cursor: "pointer",
                marginBottom: "10px"
              }}
            >
              <svg width="16" height="16" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              <span>{isHi ? "Google खाता बदलें" : "Switch Google Account"}</span>
            </button>

            {/* Sign Out Button */}
            <button
              type="button"
              className="archiveBtn"
              onClick={onLogout}
              style={{ width: "100%", justifyContent: "center", color: "var(--rose)", borderColor: "var(--rose)", padding: "10px", marginTop: "4px" }}
            >
              <LogOut size={16} />
              <span>{isHi ? "साइन आउट करें" : "Sign Out"}</span>
            </button>
          </div>
        ) : (
          <div>
            <p style={{ fontSize: "14px", color: "var(--muted)", margin: "0 0 18px", lineHeight: 1.5 }}>
              {isHi
                ? "जनसेतु AI में सुरक्षित रहने हेतु अपनी अधिकृत Google ईमेल आईडी से साइन इन करें।"
                : "Sign in with your verified Google email account to access your records."}
            </p>

            {/* Google Sign In Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid var(--line-strong)",
                background: "#FFFFFF",
                color: "#202124",
                fontWeight: 700,
                fontSize: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                cursor: "pointer",
                boxShadow: "var(--shadow-sm)"
              }}
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              <span>{isHi ? "Google से आगे बढ़ें" : "Continue with Google"}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Mount React Root
const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
