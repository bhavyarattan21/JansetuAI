import React from "react";
import { Home, FileText, AlertCircle, BookOpen, FileCheck2, HelpCircle } from "lucide-react";

export function MobileBottomNav({
  active,
  setActive,
  complaintsCount,
  t
}) {
  return (
    <nav className="mobileBottomBar">
      <button
        type="button"
        className={`mobileNavItem ${active === "home" ? "active" : ""}`}
        onClick={() => setActive("home")}
      >
        <div className="mobileNavIconWrap">
          <Home size={19} />
        </div>
        <span>{t("navHome") || "Home"}</span>
      </button>

      <button
        type="button"
        className={`mobileNavItem ${active === "file" ? "active" : ""}`}
        onClick={() => setActive("file")}
      >
        <div className="mobileNavIconWrap">
          <FileText size={19} />
        </div>
        <span>{t("navFile") || "File"}</span>
      </button>

      <button
        type="button"
        className={`mobileNavItem ${active === "tracker" ? "active" : ""}`}
        onClick={() => setActive("tracker")}
      >
        <div className="mobileNavIconWrap" style={{ position: "relative" }}>
          <AlertCircle size={19} />
          {complaintsCount > 0 && (
            <span style={{
              position: "absolute",
              top: "-5px",
              right: "-8px",
              background: "var(--blue)",
              color: "#FFFFFF",
              fontSize: "9px",
              fontWeight: 800,
              padding: "1px 5px",
              borderRadius: "10px",
              minWidth: "14px",
              textAlign: "center"
            }}>
              {complaintsCount}
            </span>
          )}
        </div>
        <span>{t("navTracker") || "Tracker"}</span>
      </button>

      <button
        type="button"
        className={`mobileNavItem ${active === "schemes" ? "active" : ""}`}
        onClick={() => setActive("schemes")}
      >
        <div className="mobileNavIconWrap">
          <BookOpen size={19} />
        </div>
        <span>{t("navSchemes") || "Schemes"}</span>
      </button>

      <button
        type="button"
        className={`mobileNavItem ${active === "documents" ? "active" : ""}`}
        onClick={() => setActive("documents")}
      >
        <div className="mobileNavIconWrap">
          <FileCheck2 size={19} />
        </div>
        <span>{t("navDocs") || "Docs"}</span>
      </button>
    </nav>
  );
}
