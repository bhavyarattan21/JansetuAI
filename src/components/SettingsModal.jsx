import React, { useState } from "react";
import {
  Settings, X, Moon, Sun, Languages, Bell, ShieldCheck,
  CheckCircle2, MapPin, Key, ExternalLink, Save, Trash2
} from "lucide-react";
import { DeleteConfirmModal } from "./DeleteConfirmModal";

export function SettingsModal({
  isOpen,
  onClose,
  theme,
  toggleTheme,
  lang,
  toggleLanguage,
  onDeleteAllData,
  notify,
  t
}) {
  const isHi = lang === "हिन्दी";
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);

  const [selectedWard, setSelectedWard] = useState(() => {
    return localStorage.getItem("jansetu_ward") || "Sohna Municipal Committee (Ward 07)";
  });

  const [smsAlerts, setSmsAlerts] = useState(() => {
    return localStorage.getItem("jansetu_sms_alerts") === "true";
  });

  const [mobilePhone, setMobilePhone] = useState(() => {
    return localStorage.getItem("jansetu_phone") || "+91 98100 48291";
  });

  const [googleClientId, setGoogleClientId] = useState(() => {
    return localStorage.getItem("jansetu_google_client_id") || "763750528919-r050jj6b5t578jdhcr4he3h6jj0qi060.apps.googleusercontent.com";
  });

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("jansetu_ward", selectedWard);
    localStorage.setItem("jansetu_sms_alerts", smsAlerts ? "true" : "false");
    localStorage.setItem("jansetu_phone", mobilePhone);
    if (googleClientId.trim()) {
      localStorage.setItem("jansetu_google_client_id", googleClientId.trim());
    }
    notify?.(isHi ? "सेटिंग्स सफलतापूर्वक सहेजी गईं!" : "Settings saved successfully!");
    onClose();
  };

  return (
    <div className="modalOverlay" onClick={onClose} style={{ zIndex: 10000 }}>
      <div className="settingsModal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              background: "var(--blue-subtle)",
              color: "var(--blue)",
              display: "grid",
              placeItems: "center"
            }}>
              <Settings size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: "18px", color: "var(--text-heading)", fontWeight: 700 }}>
                {isHi ? "नागरिक एवं पोर्टल सेटिंग्स" : "Citizen & Portal Settings"}
              </h3>
              <p style={{ margin: "2px 0 0", fontSize: "12px", color: "var(--muted)" }}>
                {isHi ? "अपनी थीम, भाषा, अधिकार क्षेत्र और Google OAuth प्रबंधित करें" : "Manage appearance, language, jurisdiction, and Google OAuth"}
              </p>
            </div>
          </div>
          <button className="modalClose" onClick={onClose} aria-label="Close" style={{ position: "static" }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave}>
          {/* Appearance & Theme */}
          <div className="settingsSection" style={{ borderTop: 0, paddingTop: 0 }}>
            <span className="settingsSectionTitle">
              {isHi ? "दिखावट व थीम (Appearance)" : "Appearance & Theme"}
            </span>

            <div className="settingsOptionRow">
              <div className="settingsOptionInfo">
                <strong>{theme === "dark" ? (isHi ? "डार्क थीम (Dark Mode)" : "Dark Mode") : (isHi ? "लाइट थीम (Light Mode)" : "Light Mode")}</strong>
                <small>{theme === "dark" ? "High-contrast civic dark theme" : "Clean daylight civic theme"}</small>
              </div>
              <button
                type="button"
                className="secondary"
                onClick={toggleTheme}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "1px solid var(--line)",
                  background: "var(--panel)",
                  color: "var(--text)",
                  fontWeight: 600,
                  fontSize: "13px"
                }}
              >
                {theme === "dark" ? <Sun size={15} color="#F59E0B" /> : <Moon size={15} color="var(--blue)" />}
                <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
              </button>
            </div>

            <div className="settingsOptionRow">
              <div className="settingsOptionInfo">
                <strong>{isHi ? "भाषा / Language" : "Language / भाषा"}</strong>
                <small>{lang === "English" ? "Current: English (Official)" : "वर्तमान: हिन्दी (राजभाषा)"}</small>
              </div>
              <button
                type="button"
                className="secondary"
                onClick={toggleLanguage}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "8px 14px",
                  borderRadius: "8px",
                  border: "1px solid var(--line)",
                  background: "var(--panel)",
                  color: "var(--text)",
                  fontWeight: 600,
                  fontSize: "13px"
                }}
              >
                <Languages size={15} color="var(--blue)" />
                <span>{lang === "English" ? "हिन्दी" : "English"}</span>
              </button>
            </div>
          </div>

          {/* Municipal Zone & Ward */}
          <div className="settingsSection">
            <span className="settingsSectionTitle">
              {isHi ? "नगर निगम व स्थानीय क्षेत्र (Jurisdiction)" : "Jurisdiction & Municipal Zone"}
            </span>
            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", fontSize: "12px", fontWeight: 600, marginBottom: "6px", color: "var(--text)" }}>
                {isHi ? "प्राथमिक नगर निगम वार्ड" : "Primary Municipal Area"}
              </label>
              <select
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  border: "1px solid var(--line)",
                  background: "var(--panel2)",
                  color: "var(--text)",
                  fontSize: "13px"
                }}
              >
                <option value="Sohna Municipal Committee (Ward 07)">Sohna Municipal Committee (Ward 07, Haryana)</option>
                <option value="Municipal Corporation of Gurugram (Zone 4)">Municipal Corporation of Gurugram (MCG Zone 4)</option>
                <option value="Municipal Corporation of Delhi (South Zone)">Municipal Corporation of Delhi (MCD South Zone)</option>
                <option value="Faridabad Municipal Corporation (NIT Zone)">Faridabad Municipal Corporation (NIT Zone)</option>
              </select>
            </div>
          </div>

          {/* Citizen Follow-up Alert Preferences */}
          <div className="settingsSection">
            <span className="settingsSectionTitle">
              {isHi ? "नागरिक फॉलो-अप सूचनाएं (Follow-up Reminders)" : "Follow-Up & Resolution Reminders"}
            </span>
            <div className="settingsOptionRow">
              <div className="settingsOptionInfo">
                <strong>{isHi ? "एसएमएस व ईमेल फॉलो-अप अनुस्मारक" : "SLA Expiry Follow-up Alerts"}</strong>
                <small>{isHi ? "समय सीमा समाप्त होने पर एस्केलेशन व आरटीआई नोटिस अलर्ट" : "Receive instant alerts when portal resolution window expires"}</small>
              </div>
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                style={{ width: "18px", height: "18px", cursor: "pointer" }}
              />
            </div>
          </div>

          {/* Google Cloud OAuth 2.0 Credentials */}
          <div className="settingsSection">
            <span className="settingsSectionTitle">
              {isHi ? "गूगल क्लाउड प्रमाणीकरण (Google OAuth 2.0)" : "Google Cloud OAuth 2.0 Configuration"}
            </span>
            <div style={{ background: "var(--panel2)", padding: "12px 14px", borderRadius: "10px", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <ShieldCheck size={16} color="var(--emerald)" />
                <strong style={{ fontSize: "13px", color: "var(--text-heading)" }}>Google Identity Services Active</strong>
              </div>
              <p style={{ margin: "0 0 10px", fontSize: "12px", color: "var(--muted)", lineHeight: 1.5 }}>
                {isHi
                  ? "गूगल लॉगिन के लिए अधिकृत क्लाइंट आईडी। यह आपके Google Cloud Console वेब क्रेडेंशियल से जुड़ा है।"
                  : "Authorized Client ID for Google Identity Services (GSI). Used for cryptographic citizen verification."}
              </p>
              <input
                type="text"
                value={googleClientId}
                onChange={(e) => setGoogleClientId(e.target.value)}
                placeholder="Google OAuth Web Client ID"
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid var(--line)",
                  background: "var(--panel)",
                  color: "var(--text)",
                  fontSize: "12px",
                  fontFamily: "monospace"
                }}
              />
            </div>
          </div>

          {/* Danger Zone: Citizen Data Privacy */}
          {onDeleteAllData && (
            <div className="settingsSection">
              <span className="settingsSectionTitle" style={{ color: "var(--rose)" }}>
                {isHi ? "डेटा प्रबंधन (Data Privacy & Danger Zone)" : "Data Privacy & Danger Zone"}
              </span>
              <div style={{ background: "rgba(239, 68, 68, 0.06)", border: "1px solid rgba(239, 68, 68, 0.25)", padding: "14px", borderRadius: "10px" }}>
                <strong style={{ fontSize: "13px", color: "var(--rose)", display: "block", marginBottom: "4px" }}>
                  {isHi ? "मेरा समस्त नागरिक डेटा हटाएं" : "Purge All My Citizen Data"}
                </strong>
                <p style={{ margin: "0 0 12px", fontSize: "12px", color: "var(--muted)", lineHeight: 1.5 }}>
                  {isHi
                    ? "डेटाबेस से आपकी सभी शिकायतें, अपलोड की गई फोटो, और चैट संदेश स्थायी रूप से हटा दिए जाएंगे।"
                    : "Permanently delete all your complaints, uploaded evidence photos from storage, and AI chat history."}
                </p>
                <button
                  type="button"
                  className="archiveBtn"
                  onClick={() => setShowDeleteAllModal(true)}
                  style={{ color: "var(--rose)", borderColor: "rgba(220, 38, 38, 0.4)", padding: "8px 14px", fontSize: "12px" }}
                >
                  <Trash2 size={13} />
                  <span>{isHi ? "समस्त डेटा हटाएं" : "Delete All My Data"}</span>
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "24px" }}>
            <button
              type="button"
              className="archiveBtn"
              onClick={onClose}
              style={{ padding: "10px 18px" }}
            >
              {isHi ? "रद्द करें" : "Cancel"}
            </button>
            <button
              type="submit"
              className="primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "10px 22px",
                borderRadius: "10px",
                fontWeight: 600
              }}
            >
              <Save size={15} />
              <span>{isHi ? "सेटिंग्स सहेजें" : "Save Settings"}</span>
            </button>
          </div>
        </form>

        {/* Delete All Data Confirmation Modal requiring typing DELETE */}
        {showDeleteAllModal && (
          <DeleteConfirmModal
            isOpen={showDeleteAllModal}
            title={isHi ? "समस्त नागरिक डेटा हटाएं?" : "Purge all your citizen data?"}
            message={
              isHi
                ? `यह क्रिया डेटाबेस से आपकी सभी शिकायतें, निजी स्टोरेज से फोटो और चैट इतिहास को स्थायी रूप से हटा देगी। इसे पूर्ववत नहीं किया जा सकता।`
                : `This will permanently delete all your complaints, uploaded photos, and chat history from Supabase. This action cannot be undone.`
            }
            requireWord="DELETE"
            onConfirmDelete={async () => {
              setShowDeleteAllModal(false);
              onClose();
              await onDeleteAllData?.();
            }}
            onClose={() => setShowDeleteAllModal(false)}
          />
        )}
      </div>
    </div>
  );
}
