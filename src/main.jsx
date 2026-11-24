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
import { isSupabaseConfigured, supabase } from "./lib/supabase";
import { initializeCitizenSession, linkGoogleAccount, signOutCitizen } from "./lib/auth";
import {
  createComplaint,
  listComplaints,
  markFiled,
  markEscalated,
  markResolved,
  archiveComplaint,
  restoreComplaint,
  deletePermanently
} from "./lib/complaints";
import { uploadComplaintPhoto } from "./lib/photos";
import { syncUserProfile, saveLanguagePreference, getUserProfile } from "./lib/profile";
import { loadDemoScenario, removeDemoData } from "./lib/demoData";

// Root JanSetu AI Application
function App() {
  // Splash Loading Screen (850ms sequence)
  const [loading, setLoading] = useState(true);

  // Supabase Auth & Session State (Pages must wait for session before querying)
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);

  // Initialize Citizen Session on first load:
  // On first visit with no session, call supabase.auth.signInAnonymously()
  useEffect(() => {
    let isMounted = true;

    async function initSession() {
      const res = await initializeCitizenSession();
      if (!isMounted) return;
      if (res.user) {
        setUser(res.user);
        setSession(res.session);
      }
      setAuthReady(true);
    }

    initSession();

    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
        if (!isMounted) return;
        setSession(newSession);
        if (newSession?.user) {
          setUser(newSession.user);
        } else if (event === "SIGNED_OUT") {
          // Re-seed anonymous session immediately so citizen is never unauthenticated
          const { data } = await supabase.auth.signInAnonymously();
          if (isMounted && data?.user) {
            setUser(data.user);
            setSession(data.session);
          }
        }
        setAuthReady(true);
      });

      return () => {
        isMounted = false;
        subscription?.unsubscribe();
      };
    } else {
      setAuthReady(true);
    }
  }, []);

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

  // Persistent Complaints Store loaded from Supabase (DB + Storage)
  const [complaints, setComplaints] = useState([]);
  const [complaintsLoading, setComplaintsLoading] = useState(true);
  const [complaintsError, setComplaintsError] = useState(null);

  // Fetch complaints from Supabase
  const fetchComplaints = async () => {
    if (!user?.id) return;
    setComplaintsLoading(true);
    setComplaintsError(null);
    try {
      const data = await listComplaints();
      setComplaints(data);
    } catch (err) {
      console.error("Failed to load complaints from Supabase:", err);
      setComplaintsError(err.message || "Failed to load complaints from database");
    } finally {
      setComplaintsLoading(false);
    }
  };

  // Sync profile and fetch complaints on user readiness
  useEffect(() => {
    if (user?.id) {
      fetchComplaints();
      syncUserProfile(user.id, {
        language: lang === "हिन्दी" ? "hi" : "en",
        full_name: user.name || user.user_metadata?.full_name || null
      });
    }
  }, [user?.id]);

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

  // Persist Language & Sync to Supabase
  const toggleLanguage = () => {
    const nextLang = lang === "हिन्दी" ? "English" : "हिन्दी";
    setLangState(nextLang);
    localStorage.setItem("jansetu_lang", nextLang);
    if (user?.id) {
      saveLanguagePreference(user.id, nextLang === "हिन्दी" ? "hi" : "en");
    }
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

  // One-Click Demo Scenario (Inserts 5 realistic complaints into Supabase)
  const handleLaunchDemoScenario = async () => {
    if (!user?.id) {
      showToast("Waiting for citizen session...");
      return;
    }
    try {
      showToast(lang === "हिन्दी" ? "डेमो परिदृश्य लोड हो रहा है..." : "Loading demo scenario into Supabase...");
      await loadDemoScenario(user.id);
      await fetchComplaints();
      setActive("tracker");
      showToast(
        lang === "हिन्दी"
          ? "5 वास्तविक डेमो शिकायतें डेटाबेस में जोड़ी गईं!"
          : "Loaded 5 realistic demo complaints into Supabase!"
      );
    } catch (err) {
      console.error("Demo load error:", err);
      showToast(`Demo load error: ${err.message}`);
    }
  };

  // Complaint Management Actions - Connected directly to Supabase DB & Storage
  const handleComplaintFiled = async (complaintData, rawPhotos = []) => {
    try {
      showToast(lang === "हिन्दी" ? "शिकायत डेटाबेस में दर्ज हो रही है..." : "Saving complaint to Supabase...");
      
      const created = await createComplaint({
        category: complaintData.category,
        department: complaintData.dept,
        portal_name: complaintData.portalName,
        location: complaintData.location,
        description: complaintData.desc,
        draft_letter: complaintData.aiDraftBody || complaintData.desc,
        urgency: complaintData.urgency || "medium",
        status: "filed",
        portal_reference: complaintData.portalRefNumber,
        expectedDays: complaintData.expectedResolutionDays || 7
      });

      // Upload photos to Supabase Storage if attached
      if (rawPhotos && rawPhotos.length > 0 && user?.id) {
        for (const photo of rawPhotos) {
          try {
            await uploadComplaintPhoto({
              userId: user.id,
              complaintId: created.id,
              fileOrBlobOrDataUrl: photo,
              kind: "before"
            });
          } catch (photoErr) {
            console.error("Failed to upload photo to Supabase storage:", photoErr);
          }
        }
      }

      await fetchComplaints();
      showToast(lang === "हिन्दी" ? "शिकायत सुरक्षित रूप से डेटाबेस में दर्ज हुई!" : "Complaint successfully saved to Supabase!");
    } catch (err) {
      console.error("Error filing complaint in Supabase:", err);
      showToast(`Error saving: ${err.message}`);
    }
  };

  const handleArchiveComplaint = async (id) => {
    try {
      await archiveComplaint(id);
      await fetchComplaints();
      showToast(t("archivedSuccess") || "Complaint archived.");
    } catch (err) {
      console.error("Archive error:", err);
      showToast(`Archive error: ${err.message}`);
    }
  };

  // Soft Delete with 5-Second Undo Toast
  const handleDeleteWithUndo = (complaint) => {
    setComplaints((prev) => prev.filter((c) => c.id !== complaint.id));

    if (undoTimerRef.current) clearInterval(undoTimerRef.current);

    let timeLeft = 5;
    setUndoDelete({ complaint, timeLeft });

    undoTimerRef.current = setInterval(async () => {
      timeLeft -= 1;
      if (timeLeft <= 0) {
        clearInterval(undoTimerRef.current);
        setUndoDelete(null);
        try {
          await archiveComplaint(complaint.id);
          showToast(lang === "हिन्दी" ? "शिकायत संग्रहीत की गई।" : "Complaint archived.");
        } catch (e) {
          console.error("Archive error on timer expiry:", e);
        }
      } else {
        setUndoDelete((prev) => (prev ? { ...prev, timeLeft } : null));
      }
    }, 1000);
  };

  const handleRestoreComplaint = async () => {
    if (undoTimerRef.current) clearInterval(undoTimerRef.current);
    if (undoDelete?.complaint) {
      try {
        await restoreComplaint(undoDelete.complaint.id);
        await fetchComplaints();
        showToast(lang === "हिन्दी" ? "शिकायत पुनर्स्थापित की गई!" : "Complaint restored!");
      } catch (e) {
        console.error("Restore error:", e);
      }
    }
    setUndoDelete(null);
  };

  const handleConfirmResolved = async (id, { afterPhoto, resolutionNotes }) => {
    try {
      showToast(lang === "हिन्दी" ? "समाधान दर्ज किया जा रहा है..." : "Updating resolution in Supabase...");
      
      await markResolved(id, resolutionNotes);

      if (afterPhoto && user?.id) {
        await uploadComplaintPhoto({
          userId: user.id,
          complaintId: id,
          fileOrBlobOrDataUrl: afterPhoto,
          kind: "after"
        });
      }

      await fetchComplaints();
      showToast(lang === "हिन्दी" ? "नागरिक सत्यापन डेटाबेस में सहेजा गया!" : "Resolution confirmed in Supabase!");
    } catch (err) {
      console.error("Failed to resolve complaint:", err);
      showToast(`Error: ${err.message}`);
    }
  };

  const handleUserLogin = async (u) => {
    setUser(u);
    localStorage.setItem("jansetu_current_user", JSON.stringify(u));
    if (user?.id) {
      await syncUserProfile(user.id, {
        full_name: u.name,
        language: lang === "हिन्दी" ? "hi" : "en"
      });
    }
    showToast(lang === "हिन्दी" ? `नमस्ते, ${u.name}! डेटाबेस से सिंक हुआ।` : `Welcome, ${u.name}! Profile synced to Supabase.`);
  };

  const handleLogout = async () => {
    const res = await signOutCitizen();
    setUser(res.user);
    setSession(res.session);
    showToast(lang === "हिन्दी" ? "साइन आउट हुआ। आप अतिथि मोड में हैं।" : "Signed out. You are now in Guest mode.");
  };

  // 1. Initial Loading Screen (waits for splash + session establishment)
  if (loading || !authReady) {
    return <LoadingScreen onFinish={() => setLoading(false)} minDuration={850} />;
  }

  // 2. Main Civic Portal View (Unauthenticated visitors can explore Home, Schemes, Documents, and CoPilot; Google Login required before filing)
  return (
    <div className="app">
      {!isSupabaseConfigured && (
        <div style={{
          background: "linear-gradient(90deg, #FEF2F2, #FFF1F2)",
          borderBottom: "1px solid #F87171",
          color: "#991B1B",
          padding: "10px 16px",
          fontSize: "13px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          zIndex: 10000,
          fontWeight: 600,
          position: "sticky",
          top: 0
        }}>
          <AlertCircle size={16} color="#DC2626" />
          <span>
            Supabase is not configured. Please add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in <code>.env.local</code> (or Vercel).
          </span>
        </div>
      )}

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
        onLogout={handleLogout}
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
          onLogin={handleUserLogin}
          lang={lang}
          t={t}
          notify={showToast}
        />
      )}

      {active === "tracker" && (
        <MyComplaints
          complaints={complaints}
          loading={complaintsLoading}
          error={complaintsError}
          onRetry={fetchComplaints}
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
          user={user}
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
          user={user}
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
          onLogin={async (u) => {
            await handleUserLogin(u);
            setAuthModalOpen(false);
          }}
          onLogout={async () => {
            await handleLogout();
            setAuthModalOpen(false);
          }}
          onClose={() => setAuthModalOpen(false)}
          lang={lang}
          t={t}
          notify={showToast}
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

// Clean, official Supabase + Google Auth Modal (Profile & Google Account Management)
function AuthModal({ user, onLogin, onLogout, onClose, lang, t, notify }) {
  const isHi = lang === "हिन्दी";
  const isAnonymous = !user || user.is_anonymous || (!user.email && user.provider !== "google");
  const [linking, setLinking] = useState(false);

  // Link Google Account to keep existing complaints (calls linkIdentity)
  const handleLinkGoogle = async () => {
    setLinking(true);
    try {
      await linkGoogleAccount();
      // Supabase redirects to Google OAuth
    } catch (err) {
      console.warn("linkGoogleAccount fallback to GSI:", err);
      // Fallback to client-side Google popup
      triggerGoogleSignIn(
        (googleUser) => {
          setLinking(false);
          onLogin(googleUser);
          notify?.(isHi ? `नमस्ते, ${googleUser.name}! Google खाता लिंक हुआ।` : `Linked Google account for ${googleUser.name}!`);
        },
        (error) => {
          setLinking(false);
          notify?.(isHi ? "Google प्रमाणीकरण विफल हुआ।" : "Google authentication was cancelled.");
        }
      );
    }
  };

  const displayName = isAnonymous
    ? (isHi ? "अतिथि नागरिक" : "Guest Citizen")
    : (user.user_metadata?.full_name || user.name || user.email?.split("@")[0] || "Citizen");
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || user?.picture;
  const email = user?.email || user?.user_metadata?.email || (isAnonymous ? (isHi ? "सत्र आधारित (अस्थायी)" : "Browser Session (Temporary)") : "");

  return (
    <div className="modalOverlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div className="panel" style={{ width: "min(460px, 92vw)", padding: "28px", borderRadius: "18px" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ margin: 0, fontSize: "18px", color: "var(--text-heading)", fontWeight: 700 }}>
            {isHi ? "नागरिक प्रोफ़ाइल व खाता" : "Citizen Profile & Account"}
          </h3>
          <button className="modalClose" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Citizen Info Badge */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px", background: "var(--panel2)", borderRadius: "12px", marginBottom: "16px", border: "1px solid var(--line)" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: !isAnonymous ? "#1A73E8" : "var(--line-strong, #64748B)", color: "#fff", display: "grid", placeItems: "center", fontWeight: 700, fontSize: "18px", flexShrink: 0, overflow: "hidden" }}>
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              isAnonymous ? "G" : (displayName[0]?.toUpperCase() || "C")
            )}
          </div>
          <div style={{ overflow: "hidden", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <strong style={{ fontSize: "15px", color: "var(--text-heading)", display: "block", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                {displayName}
              </strong>
              {!isAnonymous ? (
                <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: "rgba(16, 185, 129, 0.15)", color: "#10B981", fontWeight: 700 }}>
                  GOOGLE VERIFIED
                </span>
              ) : (
                <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: "rgba(234, 179, 8, 0.15)", color: "#D97706", fontWeight: 700 }}>
                  GUEST CITIZEN
                </span>
              )}
            </div>
            <span style={{ display: "block", fontSize: "12px", color: "var(--muted)", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
              {email}
            </span>
          </div>
        </div>

        {isAnonymous ? (
          <div>
            <div style={{
              background: "rgba(37, 99, 235, 0.08)",
              border: "1px solid rgba(37, 99, 235, 0.2)",
              borderRadius: "10px",
              padding: "12px 14px",
              marginBottom: "16px",
              fontSize: "12px",
              lineHeight: "1.5",
              color: "var(--text)"
            }}>
              <p style={{ margin: "0 0 6px", fontWeight: 700, color: "var(--blue)" }}>
                {isHi ? "शिकायतों को सुरक्षित रखें (Google से जोड़ें)" : "Keep Your Complaints Across Devices"}
              </p>
              <span>
                {isHi
                  ? "वर्तमान में आप अतिथि के रूप में कार्य कर रहे हैं। अपनी दर्ज शिकायतों को हमेशा सुरक्षित रखने हेतु Google खाता लिंक करें।"
                  : "You are currently signed in as a Guest. Sign in with Google via linkIdentity so all your complaints and tracking records are kept permanently."}
              </span>
            </div>

            {/* Google Sign In / Link Button */}
            <button
              type="button"
              disabled={linking}
              onClick={handleLinkGoogle}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid var(--line-strong)",
                background: "#FFFFFF",
                color: "#202124",
                fontWeight: 700,
                fontSize: "13px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                cursor: linking ? "wait" : "pointer",
                boxShadow: "var(--shadow-sm)",
                marginBottom: "10px"
              }}
            >
              <svg width="18" height="18" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              <span>{linking ? (isHi ? "जोड़ा जा रहा है..." : "Connecting...") : (isHi ? "Google से लिंक करें (शिकायतें सुरक्षित रखें)" : "Sign in with Google (Keep Complaints)")}</span>
            </button>
          </div>
        ) : (
          <div>
            {/* Switch Account (Google) */}
            <button
              type="button"
              disabled={linking}
              onClick={handleLinkGoogle}
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
          </div>
        )}

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
    </div>
  );
}

// Mount React Root
const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
