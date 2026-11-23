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
        <Home size={18} />
        <span>{t("navHome")}</span>
      </button>

      <button
        type="button"
        className={`mobileNavItem ${active === "file" ? "active" : ""}`}
        onClick={() => setActive("file")}
      >
        <FileText size={18} />
        <span>File</span>
      </button>

      <button
        type="button"
        className={`mobileNavItem ${active === "tracker" ? "active" : ""}`}
        onClick={() => setActive("tracker")}
      >
        <AlertCircle size={18} />
        <span>Tracker</span>
      </button>

      <button
        type="button"
        className={`mobileNavItem ${active === "schemes" ? "active" : ""}`}
        onClick={() => setActive("schemes")}
      >
        <BookOpen size={18} />
        <span>Schemes</span>
      </button>

      <button
        type="button"
        className={`mobileNavItem ${active === "documents" ? "active" : ""}`}
        onClick={() => setActive("documents")}
      >
        <FileCheck2 size={18} />
        <span>Docs</span>
      </button>
    </nav>
  );
}
