import React, { useState, useEffect } from "react";
import {
  MapPin, Camera, Sparkles, ArrowRight, Check, Copy, ExternalLink,
  Edit3, CheckCircle2, AlertCircle, FileText, Upload, RefreshCw
} from "lucide-react";
import { generateComplaintDraft } from "../services/ai";
import { getPortalForCategory } from "../data/portals";

export function PrepareAndFile({
  initialData,
  onComplaintFiled,
  onViewTracker,
  user,
  lang,
  t,
  notify
}) {
  const [step, setStep] = useState(1); // 1: Describe, 2: Review, 3: File, 4: Tracked
  const [category, setCategory] = useState(initialData?.category || "roads");
  const [location, setLocation] = useState(initialData?.location || "Sohna-Alwar Road, Ward 4, Sohna, Haryana");
  const [description, setDescription] = useState(initialData?.description || "");
  const [urgency, setUrgency] = useState(initialData?.urgency || "high");
  const [evidencePhoto, setEvidencePhoto] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);

  // AI Generated Draft State
  const [draft, setDraft] = useState(null);
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [editedSubject, setEditedSubject] = useState("");
  const [editedBody, setEditedBody] = useState("");
  const [copiedField, setCopiedField] = useState("");

  // Portal Filing State
  const [portalRefInput, setPortalRefInput] = useState("");
  const [confirmedComplaint, setConfirmedComplaint] = useState(null);

  // Sync initialData if provided from Co-Pilot hero
  useEffect(() => {
    if (initialData?.category) setCategory(initialData.category);
    if (initialData?.extractedSummary) setDescription(initialData.extractedSummary);
    if (initialData?.urgency) setUrgency(initialData.urgency);
  }, [initialData]);

  // Handle Geolocation
  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      notify(lang === "हिन्दी" ? "ब्राउज़र में जीपीएस उपलब्ध नहीं है।" : "Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = `Lat: ${pos.coords.latitude.toFixed(4)}, Long: ${pos.coords.longitude.toFixed(4)}`;
        setLocation(`Near GPS Location (${coords}), Sohna Ward Area`);
        setIsLocating(false);
        notify(lang === "हिन्दी" ? "जीपीएस स्थान सफलतापूर्वक जोड़ा गया!" : "GPS coordinates captured!");
      },
      (err) => {
        setIsLocating(false);
        notify(lang === "हिन्दी" ? "स्थान प्राप्त करने की अनुमति नहीं मिली।" : "Permission denied for location access.");
      }
    );
  };

  // Step 1 -> Step 2: Generate AI Draft
  const handleGenerateDraft = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      notify(lang === "हिन्दी" ? "कृपया समस्या का विवरण भरें।" : "Please provide a description of the issue.");
      return;
    }

    setIsDrafting(true);
    try {
      const generated = await generateComplaintDraft({
        category,
        location,
        description,
        urgency,
        lang,
        user
      });
      setDraft(generated);
      setEditedSubject(generated.subject);
      setEditedBody(generated.body);
      setStep(2);
    } catch (err) {
      console.error("Draft generation error:", err);
      notify("Draft generation encountered an issue; using standard template.");
    } finally {
      setIsDrafting(false);
    }
  };

  // Copy helper
  const handleCopy = (text, fieldName) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldName);
    notify(lang === "हिन्दी" ? "क्लिपबोर्ड पर कॉपी किया गया!" : "Copied to clipboard!");
    setTimeout(() => setCopiedField(""), 2200);
  };

  // Step 2 -> Step 3: Proceed to Official Portal
  const handleProceedToFile = () => {
    setStep(3);
  };

  // Step 3: Confirm citizen has filed on portal
  const handleConfirmFiling = () => {
    const portalInfo = getPortalForCategory(category);
    const newRecord = {
      id: `JAN-${Date.now().toString().slice(-6)}`,
      isDemo: false,
      category: category === "roads" ? "Roads & Potholes" : (category === "water" ? "Water Supply" : (category === "waste" ? "Waste Management" : "Street Lighting")),
      categoryHi: category === "roads" ? "सड़क और गड्ढे" : (category === "water" ? "जल आपूर्ति" : (category === "waste" ? "कचरा प्रबंधन" : "स्ट्रीट लाइट")),
      portalId: portalInfo.portal?.id || "cpgrams",
      portalName: portalInfo.portal?.name || "Official Portal",
      portalRefNumber: portalRefInput.trim() || `PORTAL-REF-${Math.floor(100000 + Math.random() * 900000)}`,
      dept: draft?.department || portalInfo.department,
      location: location,
      desc: description,
      urgency: urgency,
      filingDate: new Date().toLocaleString(),
      filingTimestamp: Date.now(),
      expectedResolutionDays: draft?.typicalResolutionDays || portalInfo.typicalResolutionDays || 5,
      status: "filed", // 'draft' | 'filed' | 'follow_up_due' | 'escalated' | 'resolved'
      statusHi: "पोर्टल पर दर्ज",
      daysElapsed: 0,
      evidencePhotos: evidencePhoto ? [evidencePhoto] : [],
      afterPhoto: null,
      resolutionConfirmed: false,
      aiDraftSubject: editedSubject,
      aiDraftBody: editedBody,
      timeline: [
        {
          title: "AI Complaint Draft Prepared",
          date: new Date().toLocaleString(),
          note: `Categorized under ${draft?.department}. Priority: ${urgency.toUpperCase()}`,
          actor: "JanSetu AI Copilot"
        },
        {
          title: "Marked as Filed by Citizen",
          date: new Date().toLocaleString(),
          note: `Citizen confirmed filing with Portal Ref: ${portalRefInput.trim() || "Generated"}`,
          actor: "Citizen"
        }
      ]
    };

    setConfirmedComplaint(newRecord);
    onComplaintFiled(newRecord);
    setStep(4);
    notify(lang === "हिन्दी" ? "शिकायत सफलतापूर्वक ट्रैकर में जोड़ी गई!" : "Complaint added to your tracking record!");
  };

  // Save as unfiled draft
  const handleSaveDraftOnly = () => {
    const portalInfo = getPortalForCategory(category);
    const draftRecord = {
      id: `DRAFT-${Date.now().toString().slice(-5)}`,
      isDemo: false,
      category: category,
      portalName: portalInfo.portal?.name || "CPGRAMS",
      portalRefNumber: null,
      dept: draft?.department || portalInfo.department,
      location: location,
      desc: description,
      urgency: urgency,
      filingDate: "Draft (Unfiled)",
      filingTimestamp: Date.now(),
      expectedResolutionDays: portalInfo.typicalResolutionDays || 5,
      status: "draft",
      statusHi: "ड्राफ्ट तैयार",
      daysElapsed: 0,
      evidencePhotos: evidencePhoto ? [evidencePhoto] : [],
      aiDraftSubject: editedSubject,
      aiDraftBody: editedBody,
      timeline: [
        {
          title: "AI Draft Saved",
          date: new Date().toLocaleString(),
          note: "Saved for later filing on official portal.",
          actor: "Citizen"
        }
      ]
    };
    onComplaintFiled(draftRecord);
    onViewTracker();
    notify(lang === "हिन्दी" ? "ड्राफ्ट सुरक्षित कर लिया गया है।" : "Draft saved to My Complaints.");
  };

  return (
    <main className="page" style={{ maxWidth: "880px", margin: "0 auto", paddingBottom: "60px" }}>
      {/* 4-Step Stepper Bar */}
      <div className="stepperContainer">
        <div className={`stepPill ${step === 1 ? "active" : (step > 1 ? "completed" : "")}`}>
          {step > 1 ? <Check size={14} /> : "1"}
          <span>{t("step1")}</span>
        </div>
        <div className={`stepPill ${step === 2 ? "active" : (step > 2 ? "completed" : "")}`}>
          {step > 2 ? <Check size={14} /> : "2"}
          <span>{t("step2")}</span>
        </div>
        <div className={`stepPill ${step === 3 ? "active" : (step > 3 ? "completed" : "")}`}>
          {step > 3 ? <Check size={14} /> : "3"}
          <span>{t("step3")}</span>
        </div>
        <div className={`stepPill ${step === 4 ? "active" : ""}`}>
          <span>4</span>
          <span>{t("step4")}</span>
        </div>
      </div>

      {/* STEP 1: Describe the Issue */}
      {step === 1 && (
        <form onSubmit={handleGenerateDraft} className="panel" style={{ padding: "32px", borderRadius: "18px" }}>
          <div style={{ marginBottom: "24px" }}>
            <span className="kicker">STEP 1 OF 3</span>
            <h2 style={{ fontSize: "24px", margin: "6px 0 8px", color: "var(--text-heading)" }}>
              {t("flowTitle")}
            </h2>
            <p style={{ color: "var(--muted)", margin: 0, fontSize: "14px" }}>
              {lang === "हिन्दी" ? "समस्या का विवरण दें। हमारा एआई इसे कानूनी व आधिकारिक प्रारूप में तैयार करेगा।" : "Describe the problem in plain words. JanSetu AI prepares a formal complaint letter and routes it to the exact portal."}
            </p>
          </div>

          <div style={{ display: "grid", gap: "20px" }}>
            {/* Category */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "8px" }}>
                {t("fieldCategory")}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid var(--line)", background: "var(--panel-input)", color: "var(--text)" }}
              >
                <option value="roads">Roads & Potholes (सड़क और गड्ढे) - PWD</option>
                <option value="water">Water Supply & Leakage (जल आपूर्ति) - Jal Board</option>
                <option value="waste">Waste & Sanitation (कचरा व सफाई) - Municipal Swachhata</option>
                <option value="streetlight">Street Lights (स्ट्रीट लाइट) - Municipal Electrical</option>
                <option value="general">Other Municipal Grievance (अन्य नागरिक शिकायत)</option>
              </select>
            </div>

            {/* Location */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <label style={{ fontSize: "13px", fontWeight: 700 }}>
                  {t("fieldLocation")}
                </label>
                <button
                  type="button"
                  onClick={handleUseLocation}
                  disabled={isLocating}
                  style={{ background: "transparent", border: "none", color: "var(--blue)", fontSize: "12px", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px" }}
                >
                  <MapPin size={13} />
                  {isLocating ? t("locating") : t("useMyLocation")}
                </button>
              </div>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Near Shiv Kund Chowk, Pole #14, Sohna, Haryana"
                required
                style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid var(--line)", background: "var(--panel-input)", color: "var(--text)" }}
              />
            </div>

            {/* Description */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "8px" }}>
                {t("fieldDescription")}
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("descPlaceholder")}
                required
                style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid var(--line)", background: "var(--panel-input)", color: "var(--text)", lineHeight: 1.5 }}
              />
            </div>

            {/* Urgency / Severity */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "8px" }}>
                  {t("fieldUrgency")}
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  style={{ width: "100%", padding: "12px 14px", borderRadius: "10px", border: "1px solid var(--line)", background: "var(--panel-input)", color: "var(--text)" }}
                >
                  <option value="low">{t("urgencyLow")}</option>
                  <option value="medium">{t("urgencyMed")}</option>
                  <option value="high">{t("urgencyHigh")}</option>
                  <option value="safety-critical">{t("urgencyCrit")}</option>
                </select>
              </div>

              {/* Photo Upload */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "8px" }}>
                  {t("fieldPhoto")}
                </label>
                <label style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  padding: "11px 14px",
                  borderRadius: "10px",
                  border: "1px dashed var(--line-strong)",
                  background: "var(--panel2)",
                  cursor: "pointer",
                  fontSize: "13px",
                  color: evidencePhoto ? "var(--emerald)" : "var(--muted)",
                  fontWeight: 600
                }}>
                  <Camera size={16} />
                  <span>{evidencePhoto ? t("photoSelected") : t("uploadPhoto")}</span>
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        const file = e.target.files[0];
                        const reader = new FileReader();
                        reader.onload = () => setEvidencePhoto(reader.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="primary"
              disabled={isDrafting}
              style={{ padding: "14px 24px", fontSize: "16px", borderRadius: "12px", marginTop: "12px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
            >
              {isDrafting ? (
                <>
                  <RefreshCw size={18} className="spin" />
                  <span>{lang === "हिन्दी" ? "एआई ड्राफ्ट तैयार हो रहा है..." : "Generating AI Statutory Draft..."}</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>{t("btnGenerateDraft")}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: Review AI Draft with Copy Buttons */}
      {step === 2 && draft && (
        <div className="aiDraftReviewCard">
          <div className="draftHeaderRow">
            <div>
              <span className="kicker">STEP 2 OF 3</span>
              <h2 style={{ fontSize: "22px", margin: "4px 0", color: "var(--text-heading)" }}>
                {t("draftReadyTitle")}
              </h2>
              <p style={{ color: "var(--muted)", margin: 0, fontSize: "13px" }}>
                {t("draftReadySub")}
              </p>
            </div>
            <div className="aiDraftLabelBadge">
              <Sparkles size={14} />
              {t("aiDraftBadge")}
            </div>
          </div>

          {/* Copyable Fields */}
          {/* 1. Subject */}
          <div className="copyFieldBox">
            <div className="copyFieldHeader">
              <span className="copyFieldLabel">{t("subjectLabel")}</span>
              <button
                type="button"
                className="inlineCopyBtn"
                onClick={() => handleCopy(editedSubject, "subject")}
              >
                {copiedField === "subject" ? <Check size={13} color="var(--emerald)" /> : <Copy size={13} />}
                {copiedField === "subject" ? t("copied") : t("copyField")}
              </button>
            </div>
            {isEditingDraft ? (
              <input
                type="text"
                value={editedSubject}
                onChange={(e) => setEditedSubject(e.target.value)}
                style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid var(--blue)", background: "var(--panel)", color: "var(--text)" }}
              />
            ) : (
              <div style={{ fontWeight: 600, color: "var(--text-heading)", fontSize: "14px" }}>
                {editedSubject}
              </div>
            )}
          </div>

          {/* 2. Department */}
          <div className="copyFieldBox">
            <div className="copyFieldHeader">
              <span className="copyFieldLabel">{t("deptLabel")}</span>
              <button
                type="button"
                className="inlineCopyBtn"
                onClick={() => handleCopy(draft.department, "dept")}
              >
                {copiedField === "dept" ? <Check size={13} color="var(--emerald)" /> : <Copy size={13} />}
                {copiedField === "dept" ? t("copied") : t("copyField")}
              </button>
            </div>
            <div style={{ fontWeight: 600, color: "var(--blue)", fontSize: "14px" }}>
              {draft.department}
            </div>
          </div>

          {/* 3. Formal Complaint Letter */}
          <div className="copyFieldBox">
            <div className="copyFieldHeader">
              <span className="copyFieldLabel">Full Complaint Letter (कानूनी शिकायत पत्र)</span>
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  type="button"
                  className="inlineCopyBtn"
                  onClick={() => setIsEditingDraft(!isEditingDraft)}
                >
                  <Edit3 size={13} />
                  {isEditingDraft ? t("saveDraftBtn") : t("editDraftBtn")}
                </button>
                <button
                  type="button"
                  className="inlineCopyBtn"
                  onClick={() => handleCopy(editedBody, "body")}
                >
                  {copiedField === "body" ? <Check size={13} color="var(--emerald)" /> : <Copy size={13} />}
                  {copiedField === "body" ? t("copied") : t("copyField")}
                </button>
              </div>
            </div>
            {isEditingDraft ? (
              <textarea
                rows={10}
                value={editedBody}
                onChange={(e) => setEditedBody(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid var(--blue)", background: "var(--panel)", color: "var(--text)", fontFamily: "monospace", fontSize: "13px", lineHeight: 1.5 }}
              />
            ) : (
              <div style={{ whiteSpace: "pre-wrap", fontSize: "13px", lineHeight: 1.6, color: "var(--text)", maxHeight: "260px", overflowY: "auto", paddingRight: "8px" }}>
                {editedBody}
              </div>
            )}
          </div>

          {/* 4. Evidence Checklist */}
          {draft.recommendedEvidence && draft.recommendedEvidence.length > 0 && (
            <div style={{ background: "var(--panel2)", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px" }}>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>
                {t("evidenceLabel")}:
              </span>
              <ul style={{ margin: "8px 0 0", paddingLeft: "18px", fontSize: "13px", color: "var(--text)", lineHeight: 1.5 }}>
                {draft.recommendedEvidence.map((ev, i) => (
                  <li key={i}>{ev}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Step 2 Actions */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <button
              type="button"
              className="inlineCopyBtn"
              style={{ padding: "10px 18px", fontSize: "14px" }}
              onClick={() => handleCopy(`SUBJECT:\n${editedSubject}\n\nDEPARTMENT:\n${draft.department}\n\nLETTER:\n${editedBody}`, "all")}
            >
              {copiedField === "all" ? <CheckCircle2 size={16} color="var(--emerald)" /> : <Copy size={16} />}
              {copiedField === "all" ? t("allCopied") : t("copyAllBtn")}
            </button>

            <button
              type="button"
              className="primary"
              onClick={handleProceedToFile}
              style={{ padding: "12px 24px", fontSize: "15px", borderRadius: "10px", display: "inline-flex", alignItems: "center", gap: "8px" }}
            >
              <span>{t("btnProceedToFile")}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: File on Official Portal & Enter Reference ID */}
      {step === 3 && draft && (
        <div className="panel" style={{ padding: "32px", borderRadius: "18px" }}>
          <div style={{ marginBottom: "20px" }}>
            <span className="kicker">STEP 3 OF 3</span>
            <h2 style={{ fontSize: "22px", margin: "4px 0", color: "var(--text-heading)" }}>
              {t("fileStepTitle")}
            </h2>
            <p style={{ color: "var(--muted)", margin: 0, fontSize: "14px" }}>
              {t("fileStepSub")}
            </p>
          </div>

          {/* Action Box with Official Portal Link */}
          <div className="officialPortalBox">
            <h3>{draft.portal?.name || "Official Grievance Portal"}</h3>
            <p style={{ fontSize: "13px", color: "var(--muted)", margin: "4px 0 16px" }}>
              {draft.portal?.desc}
            </p>

            <a
              href={draft.portal?.url || "https://pgportal.gov.in/"}
              target="_blank"
              rel="noopener noreferrer"
              className="primary"
              style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 26px", fontSize: "15px", borderRadius: "10px", textDecoration: "none" }}
            >
              <span>{t("openOfficialPortalBtn")}</span>
              <ExternalLink size={16} />
            </a>

            <div className="portalInstructionsList">
              <div>{t("fileInstruction1")}</div>
              <div>{t("fileInstruction2")}</div>
              <div>{t("fileInstruction3")}</div>
            </div>
          </div>

          {/* Reference Input */}
          <div style={{ marginTop: "24px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 700, marginBottom: "8px" }}>
              {t("refInputLabel")}
            </label>
            <input
              type="text"
              value={portalRefInput}
              onChange={(e) => setPortalRefInput(e.target.value)}
              placeholder={t("refInputPlaceholder")}
              style={{ width: "100%", padding: "14px 16px", borderRadius: "10px", border: "2px solid var(--blue)", background: "var(--panel-input)", color: "var(--text)", fontSize: "15px", fontWeight: 600 }}
            />
          </div>

          {/* Final Submission Buttons */}
          <div style={{ display: "flex", gap: "12px", marginTop: "24px", flexWrap: "wrap" }}>
            <button
              type="button"
              className="primary"
              onClick={handleConfirmFiling}
              style={{ flex: 1, padding: "14px 20px", fontSize: "15px", borderRadius: "10px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
            >
              <CheckCircle2 size={18} />
              <span>{t("btnConfirmFiled")}</span>
            </button>

            <button
              type="button"
              onClick={handleSaveDraftOnly}
              style={{ padding: "14px 20px", fontSize: "14px", borderRadius: "10px", border: "1px solid var(--line)", background: "var(--panel2)", color: "var(--text)", fontWeight: 600 }}
            >
              {t("saveAsDraftOnly")}
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Marked as Filed Confirmation */}
      {step === 4 && confirmedComplaint && (
        <div className="panel" style={{ padding: "40px 32px", borderRadius: "18px", textAlign: "center" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "var(--emerald-subtle)", color: "var(--emerald)", display: "grid", placeItems: "center", margin: "0 auto 18px" }}>
            <CheckCircle2 size={36} />
          </div>
          <h2 style={{ fontSize: "24px", color: "var(--text-heading)", margin: "0 0 8px" }}>
            {lang === "हिन्दी" ? "शिकायत ट्रैकर में दर्ज हुई" : "Grievance Added to Your Tracker"}
          </h2>
          <p style={{ color: "var(--muted)", fontSize: "15px", maxWidth: "540px", margin: "0 auto 20px" }}>
            {lang === "हिन्दी"
              ? `संदर्भ संख्या ${confirmedComplaint.portalRefNumber} के साथ दर्ज। JanSetu AI अब निर्धारित समय सीमा तक इसका फॉलो-अप ट्रैक करेगा।`
              : `Logged under reference ${confirmedComplaint.portalRefNumber}. JanSetu AI is now tracking your resolution window.`}
          </p>

          <div style={{ background: "var(--panel2)", border: "1px solid var(--line)", borderRadius: "12px", padding: "16px 20px", maxWidth: "480px", margin: "0 auto 24px", textAlign: "left" }}>
            <div style={{ fontSize: "12px", color: "var(--muted)" }}>Portal Reference:</div>
            <div style={{ fontSize: "18px", fontWeight: 700, color: "var(--blue)", fontFamily: "monospace" }}>
              {confirmedComplaint.portalRefNumber}
            </div>
            <div style={{ fontSize: "12px", color: "var(--muted)", marginTop: "8px" }}>
              Typical Resolution Window: <strong>{confirmedComplaint.expectedResolutionDays} working days</strong>
            </div>
          </div>

          <button
            type="button"
            className="primary"
            onClick={onViewTracker}
            style={{ padding: "12px 28px", borderRadius: "10px", fontSize: "15px", display: "inline-flex", alignItems: "center", gap: "8px" }}
          >
            <span>{t("navTracker")}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </main>
  );
}
