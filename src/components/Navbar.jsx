import React from "react";
import {
  FileText, Home, HelpCircle, BookOpen, FileCheck2, AlertCircle,
  Sun, Moon, Languages, User, LogIn, ExternalLink
} from "lucide-react";

export function Navbar({
  active,
  setActive,
  lang,
  toggleLanguage,
  theme,
  toggleTheme,
  user,
  onOpenAuth,
  complaintsCount,
  t
}) {
  return (
    <>
      {/* Tricolor India Indicator */}
      <div className="tricolorBar" />

      <header className="topbar">
        {/* Brand */}
        <div className="brand" onClick={() => setActive("home")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src="/jansetu-emblem.svg"
            alt="JanSetu AI Logo"
            style={{
              height: "38px",
              width: "auto",
              objectFit: "contain",
              filter: "drop-shadow(0 2px 8px rgba(0, 180, 255, 0.35))"
            }}
          />
          <div className="brandTitles">
            <div className="brandName" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontWeight: 800, fontSize: "18px", color: "var(--text-heading)", letterSpacing: "-0.3px" }}>
                JanSetu <span style={{ color: "var(--saffron)" }}>A</span><span style={{ color: "var(--blue)" }}>I</span>
              </span>
              <span style={{ fontSize: "10px", padding: "2px 6px", borderRadius: "4px", background: "var(--blue-subtle)", color: "var(--blue)", fontWeight: 700 }}>
                COPILOT
              </span>
            </div>
            <div className="brandMeta" style={{ fontSize: "11px", color: "var(--muted)" }}>
              {t("brandTag")}
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="desktopNav" style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <button
            className={`navBtn ${active === "home" ? "active" : ""}`}
            onClick={() => setActive("home")}
          >
            <Home size={15} />
            <span>{t("navHome")}</span>
          </button>

          <button
            className={`navBtn ${active === "file" ? "active" : ""}`}
            onClick={() => setActive("file")}
          >
            <FileText size={15} />
            <span>{t("navFile")}</span>
          </button>

          <button
            className={`navBtn ${active === "tracker" ? "active" : ""}`}
            onClick={() => setActive("tracker")}
          >
            <AlertCircle size={15} />
            <span>{t("navTracker")}</span>
            {complaintsCount > 0 && (
              <span className="navCounterPill">{complaintsCount}</span>
            )}
          </button>

          <button
            className={`navBtn ${active === "schemes" ? "active" : ""}`}
            onClick={() => setActive("schemes")}
          >
            <BookOpen size={15} />
            <span>{t("navSchemes")}</span>
          </button>

          <button
            className={`navBtn ${active === "documents" ? "active" : ""}`}
            onClick={() => setActive("documents")}
          >
            <FileCheck2 size={15} />
            <span>{t("navDocs")}</span>
          </button>

          <button
            className={`navBtn ${active === "help" ? "active" : ""}`}
            onClick={() => setActive("help")}
          >
            <HelpCircle size={15} />
            <span>{t("navHelp")}</span>
          </button>
        </nav>

        {/* Controls: Language, Theme, User */}
        <div className="topbarRight" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Language Switcher */}
          <button
            className="topbarIconBtn"
            onClick={toggleLanguage}
            title={lang === "हिन्दी" ? "Switch to English" : "हिंदी में बदलें"}
            style={{ display: "flex", alignItems: "center", gap: "5px", padding: "6px 10px", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--panel)" }}
          >
            <Languages size={15} color="var(--blue)" />
            <span style={{ fontSize: "12px", fontWeight: 700 }}>
              {lang === "हिन्दी" ? "English" : "हिन्दी"}
            </span>
          </button>

          {/* Theme Switcher */}
          <button
            className="topbarIconBtn"
            onClick={toggleTheme}
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            style={{ width: "36px", height: "36px", display: "grid", placeItems: "center", borderRadius: "8px", border: "1px solid var(--line)", background: "var(--panel)", color: "var(--text)" }}
          >
            {theme === "light" ? <Moon size={16} /> : <Sun size={16} color="var(--amber)" />}
          </button>

          {/* User Profile / Auth */}
          {user ? (
            <button
              className="userProfilePill"
              onClick={onOpenAuth}
              style={{ display: "flex", alignItems: "center", gap: "6px", padding: "4px 10px", borderRadius: "20px", border: "1px solid var(--line)", background: "var(--panel)" }}
            >
              <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "var(--blue)", color: "#fff", display: "grid", placeItems: "center", fontSize: "11px", fontWeight: 700 }}>
                {user.name ? user.name[0].toUpperCase() : "C"}
              </div>
              <span style={{ fontSize: "12px", fontWeight: 600, maxWidth: "90px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.name?.split(" ")[0] || "Citizen"}
              </span>
            </button>
          ) : (
            <button
              className="loginCtaBtn"
              onClick={onOpenAuth}
              style={{ display: "flex", alignItems: "center", gap: "5px", padding: "6px 12px", borderRadius: "8px", background: "var(--blue)", color: "#fff", border: "none", fontSize: "12px", fontWeight: 600 }}
            >
              <LogIn size={14} />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </header>
    </>
  );
}
