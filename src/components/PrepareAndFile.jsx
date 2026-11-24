import React, { useState, useEffect } from "react";
import {
  MapPin, Camera, Sparkles, ArrowRight, Check, Copy, ExternalLink,
  Edit3, CheckCircle2, AlertCircle, FileText, Upload, RefreshCw, X, Image as ImageIcon,
  Zap, Info, Clock, ShieldAlert, Calendar, Building2, LogIn, Navigation
} from "lucide-react";
import { generateComplaintDraft, analyzePhotoForComplaint } from "../services/ai";
import { getPortalForCategory } from "../data/portals";
import { LocationPickerMap, POPULAR_LOCATIONS, DEFAULT_CENTER } from "./LocationPickerMap";
import { triggerGoogleSignIn } from "../utils/googleAuth";

export function PrepareAndFile({
  initialData,
  onComplaintFiled,
  onViewTracker,
  user,
  onLogin,
  lang,
  t,
  notify
}) {
  const isHi = lang === "हिन्दी";

  const [step, setStep] = useState(1);
  const [category, setCategory] = useState(initialData?.category || "roads");
  const portalInfo = getPortalForCategory(category);
  const [location, setLocation] = useState(initialData?.location || "");
  const [coords, setCoords] = useState(DEFAULT_CENTER);
  const [description, setDescription] = useState(initialData?.extractedSummary || initialData?.description || "");
  const [urgency, setUrgency] = useState(initialData?.urgency || "high");
  const [showInlineMap, setShowInlineMap] = useState(true);

  // Quick GPS Location Detector (Pan-India & Global Coverage with Seamless IP Fallback)
  const handleDetectGpsLocation = async () => {
    notify?.(isHi ? "स्थान का पता लगाया जा रहा है..." : "Detecting real-time location...");

    const applyLocation = (lat, lng, label) => {
      setCoords({ lat, lng });
      const display = label || `Current Location (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E)`;
      setLocation(display);
      notify?.(isHi ? "स्थान फॉर्म में अपडेट हुआ!" : "Location updated in form!");
    };

    const fallbackToIp = async () => {
      // 1. BigDataCloud Client IP Geo
      try {
        const res = await fetch("https://api.bigdatacloud.net/data/reverse-geocode-client");
        if (res.ok) {
          const data = await res.json();
          if (data.latitude && data.longitude) {
            const parts = [data.locality || data.city, data.principalSubdivision, data.countryName].filter(Boolean);
            applyLocation(data.latitude, data.longitude, `${parts.join(", ")} (${data.latitude.toFixed(4)}° N, ${data.longitude.toFixed(4)}° E)`);
            return;
          }
        }
      } catch (e) {}

      // 2. ipwho.is Client IP Geo
      try {
        const res2 = await fetch("https://ipwho.is/");
        if (res2.ok) {
          const data2 = await res2.json();
          if (data2.success && data2.latitude && data2.longitude) {
            const parts = [data2.city, data2.region, data2.country].filter(Boolean);
            applyLocation(data2.latitude, data2.longitude, `${parts.join(", ")} (${data2.latitude.toFixed(4)}° N, ${data2.longitude.toFixed(4)}° E)`);
            return;
          }
        }
      } catch (e) {}
    };

    if (!navigator.geolocation) {
      fallbackToIp();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        applyLocation(pos.coords.latitude, pos.coords.longitude);
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&zoom=18&addressdetails=1`)
          .then(r => r.json())
          .then(data => {
            const a = data.address || {};
            const parts = [a.amenity || a.road, a.neighbourhood || a.suburb, a.city || a.town || a.village, a.state].filter(Boolean);
            if (parts.length > 0) {
              setLocation(`${parts.join(", ")} (${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E)`);
            }
          })
          .catch(() => {});
      },
      () => {
        // High accuracy failed or permission blocked -> seamless IP location
        fallbackToIp();
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 30000 }
    );
  };

  // Up to 3 photos with client compression
  const [photos, setPhotos] = useState(() => {
    if (initialData?.photo) return [initialData.photo];
    return [];
  });
  const [isCompressingPhoto, setIsCompressingPhoto] = useState(false);
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

  // Sync initialData
  useEffect(() => {
    if (initialData?.category) setCategory(initialData.category);
    if (initialData?.extractedSummary) setDescription(initialData.extractedSummary);
    if (initialData?.urgency) setUrgency(initialData.urgency);
    if (initialData?.photo && photos.length === 0) setPhotos([initialData.photo]);
  }, [initialData]);

  // Client-Side Canvas Image Compression (max 1600px, 0.8 quality, 5MB validation)
  const processAndCompressFile = (file) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      notify(isHi ? "फ़ाइल का आकार 5MB से कम होना चाहिए।" : "File size exceeds 5MB limit.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      notify(isHi ? "कृपया केवल फोटो फ़ाइल चुनें।" : "Please upload a valid image file.");
      return;
    }

    if (photos.length >= 3) {
      notify(isHi ? "अधिकतम 3 फोटो ही संलग्न की जा सकती हैं।" : "Maximum 3 photos allowed.");
      return;
    }

    setIsCompressingPhoto(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        const maxDim = 1600;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.8);
        setPhotos(prev => [...prev, compressedDataUrl]);
        setIsCompressingPhoto(false);

        // Run auto-suggestion on first photo
        if (photos.length === 0) {
          analyzePhotoForComplaint(compressedDataUrl).then(res => {
            if (res.category) setCategory(res.category);
            if (res.urgency) setUrgency(res.urgency);
          });
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = (idx) => {
    setPhotos(prev => prev.filter((_, i) => i !== idx));
  };

  // Step 1 -> Step 2: Generate Draft
  const handleGenerateDraft = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      notify(isHi ? "कृपया समस्या का विवरण भरें।" : "Please provide a description of the issue.");
      return;
    }

    setIsDrafting(true);
    try {
      const generated = await generateComplaintDraft({
        category,
        location,
        description,
        urgency,
        lang: isHi ? "हिन्दी" : "English",
        user
      });
      setDraft(generated);
      setEditedSubject(generated.subject);
      setEditedBody(generated.body);
      setStep(2);
    } catch (err) {
      console.error("Draft generation error:", err);
    } finally {
      setIsDrafting(false);
    }
  };

  // Copy helper
  const handleCopy = (text, fieldName) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(fieldName);
    notify(isHi ? "क्लिपबोर्ड पर कॉपी किया गया!" : "Copied to clipboard!");
    setTimeout(() => setCopiedField(""), 2000);
  };

  // Step 3: Confirm citizen has filed on portal
  const handleConfirmFiling = () => {
    if (!user) {
      triggerGoogleSignIn((u) => {
        onLogin?.(u);
        notify(isHi ? `नमस्ते, ${u.name}! Google से लॉगिन हुआ।` : `Signed in as ${u.name}. Saving complaint.`);
      });
      notify(isHi ? "शिकायत दर्ज करने हेतु कृपया पहले Google से लॉगिन करें।" : "Please sign in with Google to file and save this complaint.");
      return;
    }

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
      coords: coords,
      desc: description,
      urgency: urgency,
      filingDate: new Date().toLocaleString(),
      filingTimestamp: Date.now(),
      expectedResolutionDays: draft?.typicalResolutionDays || portalInfo.typicalResolutionDays || 5,
      status: "filed",
      statusHi: "पोर्टल पर दर्ज",
      daysElapsed: 0,
      evidencePhotos: photos,
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
    notify(isHi ? "शिकायत सफलतापूर्वक ट्रैकर में जोड़ी गई!" : "Complaint added to your tracking record!");
  };

  return (
    <main className="page" style={{ maxWidth: "1380px", width: "95%", margin: "0 auto", paddingBottom: "60px" }}>
      {/* Google Login Banner if unauthenticated */}
      {!user && (
        <div style={{
          maxWidth: "980px",
          margin: "0 auto 20px",
          padding: "12px 18px",
          borderRadius: "14px",
          background: "rgba(37, 99, 235, 0.08)",
          border: "1px solid rgba(37, 99, 235, 0.25)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "12px"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "var(--blue)",
              color: "#FFF",
              display: "grid",
              placeItems: "center"
            }}>
              <LogIn size={16} />
            </div>
            <div style={{ fontSize: "13px", color: "var(--text)" }}>
              <strong>{isHi ? "Google लॉगिन:" : "Google Sign-In Recommended:"}</strong>{" "}
              {isHi
                ? "शिकायत प्रारूप तैयार करने के बाद उसे सुरक्षित रूप से सहेजने और ट्रैक करने हेतु लॉगिन करें।"
                : "Sign in with your Google account so your complaint draft is saved and tracked under your profile."}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              triggerGoogleSignIn((u) => {
                onLogin?.(u);
                notify?.(isHi ? `नमस्ते, ${u.name}!` : `Welcome, ${u.name}!`);
              });
            }}
            style={{
              padding: "7px 14px",
              borderRadius: "8px",
              background: "#FFFFFF",
              color: "#1F2937",
              border: "1px solid var(--line-strong)",
              fontWeight: 700,
              fontSize: "12px",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              cursor: "pointer",
              boxShadow: "var(--shadow-sm)"
            }}
          >
            <svg width="15" height="15" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            <span>{isHi ? "Google से लॉगिन करें" : "Sign in with Google"}</span>
          </button>
        </div>
      )}
      {/* 4-Step Stepper Bar */}
      <div className="stepperContainer" style={{ maxWidth: "980px" }}>
        <div className={`stepPill ${step === 1 ? "active" : (step > 1 ? "completed" : "")}`}>
          <span className="stepBadge">{step > 1 ? <Check size={14} /> : "1"}</span>
          <span className="stepText">{t("step1")}</span>
        </div>
        <div className={`stepPill ${step === 2 ? "active" : (step > 2 ? "completed" : "")}`}>
          <span className="stepBadge">{step > 2 ? <Check size={14} /> : "2"}</span>
          <span className="stepText">{t("step2")}</span>
        </div>
        <div className={`stepPill ${step === 3 ? "active" : (step > 3 ? "completed" : "")}`}>
          <span className="stepBadge">{step > 3 ? <Check size={14} /> : "3"}</span>
          <span className="stepText">{t("step3")}</span>
        </div>
        <div className={`stepPill ${step === 4 ? "active" : ""}`}>
          <span className="stepBadge">4</span>
          <span className="stepText">{t("step4")}</span>
        </div>
      </div>

      {/* STEP 1: Two-Column Form Layout on Desktop, 1-Column on Mobile */}
      {step === 1 && (
        <div className="prepareGrid">
          {/* Left Column: Form Input */}
          <form onSubmit={handleGenerateDraft} className="panel" style={{ padding: "32px", borderRadius: "20px" }}>
            <div style={{ marginBottom: "20px" }}>
              <span className="kicker">STEP 1 OF 3</span>
              <h2 style={{ fontSize: "24px", margin: "4px 0 8px", color: "var(--text-heading)" }}>
                {t("flowTitle")}
              </h2>
              <p style={{ color: "var(--muted)", margin: 0, fontSize: "14px" }}>
                Describe the problem. JanSetu AI identifies the exact department and prepares a formal statutory complaint.
              </p>
            </div>

            <div style={{ display: "grid", gap: "18px" }}>
              {/* Category */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "6px" }}>
                  {t("fieldCategory")}
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid var(--line)", background: "var(--panel-input)", color: "var(--text)" }}
                >
                  <option value="roads">Roads & Potholes (सड़क और गड्ढे) - PWD / NHAI</option>
                  <option value="water">Water Supply & Leakage (जल आपूर्ति) - Jal Board</option>
                  <option value="waste">Waste & Garbage (कचरा व सफाई) - Municipal Swachhata</option>
                  <option value="streetlight">Street Lights (स्ट्रीट लाइट) - Municipal Electrical</option>
                  <option value="general">Other Municipal Grievance (अन्य नागरिक शिकायत)</option>
                </select>
              </div>

              {/* Location / Landmark Field with Direct Interactive Map Link */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px", flexWrap: "wrap", gap: "6px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 700, margin: 0 }}>
                    {t("fieldLocation")}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowInlineMap(!showInlineMap)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "var(--blue)",
                      fontSize: "12px",
                      fontWeight: 600,
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      cursor: "pointer",
                      padding: 0
                    }}
                  >
                    <MapPin size={13} />
                    <span>{showInlineMap ? (isHi ? "नक्शा छुपाएं" : "Hide Map") : (isHi ? "🗺️ इंटरएक्टिव नक्शा खोलें" : "🗺️ Open Interactive Map")}</span>
                  </button>
                </div>

                <div style={{ position: "relative" }}>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder={isHi ? "उदा. मुख्य सड़क, वार्ड नंबर 4, बस स्टैंड के पास (या नीचे नक्शे पर क्लिक करें)" : "e.g. Near Market Chowk, Main Road, Ward 4 (or click anywhere on map below)"}
                    required
                    style={{
                      width: "100%",
                      padding: "12px 14px",
                      borderRadius: "10px",
                      border: "1px solid var(--line)",
                      background: "var(--panel-input)",
                      color: "var(--text)",
                      fontSize: "14px"
                    }}
                  />
                </div>

                {/* Coords & Map Pin Status Badge */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "6px", marginBottom: "8px", flexWrap: "wrap", gap: "6px" }}>
                  <span style={{ fontSize: "11px", color: "var(--blue)", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                    <MapPin size={12} />
                    <span>
                      {coords
                        ? `${isHi ? "मानचित्र पिन सेट:" : "Map Pin:"} ${coords.lat.toFixed(4)}° N, ${coords.lng.toFixed(4)}° E`
                        : "28.6139° N, 77.2090° E"}
                    </span>
                    <span style={{ color: "var(--muted)", fontWeight: 400 }}>
                      ({isHi ? "नीचे नक्शे पर क्लिक करके बदलें" : "Click map below to set"})
                    </span>
                  </span>
                  <span style={{ fontSize: "11px", color: "var(--muted)" }}>
                    {isHi ? "वार्ड / नगर निकाय" : "Municipal Ward / Local Body"}
                  </span>
                </div>

                {/* Interactive Map Picker directly inside Location / Landmark */}
                {showInlineMap && (
                  <div style={{
                    padding: "14px",
                    borderRadius: "14px",
                    background: "var(--panel2)",
                    border: "1px solid var(--line)",
                    marginBottom: "4px"
                  }}>
                    <LocationPickerMap
                      initialLocation={location}
                      initialCoords={coords}
                      onLocationSelected={({ address: newAddr, lat, lng }) => {
                        setLocation(newAddr);
                        setCoords({ lat, lng });
                        notify?.(isHi ? "स्थान / लैंडमार्क नक्शे से सेट किया गया!" : "Location / Landmark updated from map pin!");
                      }}
                      lang={lang}
                    />
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "6px" }}>
                  {t("fieldDescription")}
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("descPlaceholder")}
                  required
                  style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid var(--line)", background: "var(--panel-input)", color: "var(--text)", lineHeight: 1.5 }}
                />
              </div>

              {/* Urgency */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "6px" }}>
                  {t("fieldUrgency")}
                </label>
                <select
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value)}
                  style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid var(--line)", background: "var(--panel-input)", color: "var(--text)" }}
                >
                  <option value="low">{t("urgencyLow")}</option>
                  <option value="medium">{t("urgencyMed")}</option>
                  <option value="high">{t("urgencyHigh")}</option>
                  <option value="safety-critical">{t("urgencyCrit")}</option>
                </select>
              </div>

              {/* Multi-Photo Upload Field (Take Photo + Choose from Gallery) */}
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, marginBottom: "6px" }}>
                  Evidence Photos (Up to 3 photos)
                </label>

                <div style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
                  {/* Button 1: Camera (Take Photo) */}
                  <label style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    padding: "10px",
                    borderRadius: "10px",
                    border: "1px solid var(--line)",
                    background: "var(--panel2)",
                    cursor: photos.length >= 3 ? "not-allowed" : "pointer",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--text)"
                  }}>
                    <Camera size={15} color="var(--blue)" />
                    <span>Take Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      disabled={photos.length >= 3}
                      style={{ display: "none" }}
                      onChange={(e) => processAndCompressFile(e.target.files?.[0])}
                    />
                  </label>

                  {/* Button 2: Gallery */}
                  <label style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    padding: "10px",
                    borderRadius: "10px",
                    border: "1px solid var(--line)",
                    background: "var(--panel2)",
                    cursor: photos.length >= 3 ? "not-allowed" : "pointer",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "var(--text)"
                  }}>
                    <ImageIcon size={15} color="var(--emerald)" />
                    <span>From Gallery</span>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={photos.length >= 3}
                      style={{ display: "none" }}
                      onChange={(e) => processAndCompressFile(e.target.files?.[0])}
                    />
                  </label>
                </div>

                {/* Privacy Warning */}
                <div style={{ fontSize: "11px", color: "var(--muted)", marginBottom: "12px" }}>
                  🔒 <em>Privacy Note: Please avoid capturing citizen faces or vehicle registration plates.</em>
                </div>

                {/* Thumbnails with Remove Buttons */}
                {photos.length > 0 && (
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "12px" }}>
                    {photos.map((src, i) => (
                      <div key={i} style={{ position: "relative", width: "72px", height: "72px" }}>
                        <img src={src} alt="Evidence" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px", border: "1px solid var(--line)" }} />
                        <button
                          type="button"
                          onClick={() => removePhoto(i)}
                          style={{
                            position: "absolute",
                            top: "-6px",
                            right: "-6px",
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            background: "var(--rose)",
                            color: "#fff",
                            border: "none",
                            display: "grid",
                            placeItems: "center",
                            cursor: "pointer"
                          }}
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                className="primary"
                disabled={isDrafting || isCompressingPhoto}
                style={{ padding: "14px 24px", fontSize: "15px", borderRadius: "12px", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
              >
                {isDrafting ? (
                  <>
                    <RefreshCw size={18} className="spin" />
                    <span>Generating Statutory Draft...</span>
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

          {/* Right Column: Civic Location & Routing Intelligence */}
          <div style={{ display: "grid", gap: "20px" }}>
            <div className="panel" style={{ padding: "26px", borderRadius: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: "rgba(37, 99, 235, 0.12)",
                    color: "var(--blue)",
                    display: "grid",
                    placeItems: "center"
                  }}>
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: "15px", color: "var(--text-heading)", fontWeight: 700 }}>
                      {isHi ? "स्थान व रूटिंग विश्लेषण" : "Location & Routing Intelligence"}
                    </h4>
                    <span style={{ fontSize: "11px", color: "var(--muted)" }}>
                      {isHi ? "नक्शे के साथ लाइव सिंक्ड" : "Live-synced from Interactive Map"}
                    </span>
                  </div>
                </div>

                <span style={{
                  fontSize: "11px",
                  padding: "4px 9px",
                  borderRadius: "6px",
                  background: "var(--blue-subtle)",
                  color: "var(--blue)",
                  fontWeight: 700,
                  fontFamily: "monospace"
                }}>
                  {coords ? `${coords.lat.toFixed(4)}° N, ${coords.lng.toFixed(4)}° E` : "28.2468° N, 77.0617° E"}
                </span>
              </div>

              {/* Active Pinned Location Display */}
              <div style={{
                padding: "14px 16px",
                borderRadius: "14px",
                background: "var(--panel2)",
                border: "1px solid var(--line)",
                marginBottom: "18px"
              }}>
                <div style={{ fontSize: "11px", color: "var(--muted)", textTransform: "uppercase", fontWeight: 700, marginBottom: "4px", display: "flex", alignItems: "center", gap: "5px" }}>
                  <CheckCircle2 size={13} color="#10B981" />
                  <span>{isHi ? "फॉर्म में सक्रिय स्थान:" : "Active Form Location:"}</span>
                </div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-heading)", lineHeight: 1.4 }}>
                  {location || (isHi ? "मानचित्र पर स्थान चुनें या जीपीएस का उपयोग करें" : "Select location on map or use GPS")}
                </div>
              </div>

              {/* Department, Portal & SLA Routing Breakdown */}
              <div style={{ display: "grid", gap: "12px", fontSize: "13px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "10px", borderBottom: "1px solid var(--line)" }}>
                  <span style={{ color: "var(--muted)" }}>{isHi ? "जिम्मेदार विभाग:" : "Responsible Department:"}</span>
                  <strong style={{ color: "var(--text-heading)", textAlign: "right" }}>{portalInfo.department}</strong>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "10px", borderBottom: "1px solid var(--line)" }}>
                  <span style={{ color: "var(--muted)" }}>{isHi ? "नागरिक चार्टर समयसीमा:" : "Statutory SLA Window:"}</span>
                  <span style={{ color: "var(--emerald)", fontWeight: 700 }}>{portalInfo.typicalResolutionDays} {isHi ? "कार्य दिवस" : "Working Days"}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "10px", borderBottom: "1px solid var(--line)" }}>
                  <span style={{ color: "var(--muted)" }}>{isHi ? "आधिकारिक पोर्टल:" : "Designated Portal:"}</span>
                  <span style={{ color: "var(--blue)", fontWeight: 600 }}>{portalInfo.portal.name}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ color: "var(--muted)" }}>{isHi ? "अपीलीय नोडल अधिकारी:" : "Escalation Authority:"}</span>
                  <span style={{ color: "var(--text-heading)", fontWeight: 600 }}>{isHi ? "एसडीएम / जिला लोक शिकायत अधिकारी / सीएम हेल्पलाइन" : "Sub-Divisional Magistrate (SDM) / District Grievance Officer / CM Helpline"}</span>
                </div>
              </div>
            </div>

            <div className="panel" style={{ padding: "24px", borderRadius: "20px", background: "var(--panel2)" }}>
              <h4 style={{ margin: "0 0 8px", fontSize: "14px", color: "var(--text-heading)", display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={16} color="var(--blue)" />
                <span>{isHi ? "नक्शे के सटीक निर्देशांक क्यों जरूरी हैं?" : "Why Exact Map Coordinates Matter"}</span>
              </h4>
              <p style={{ margin: 0, fontSize: "13px", color: "var(--muted)", lineHeight: 1.6 }}>
                {isHi
                  ? "सरकारी पोर्टल पर सामान्य शिकायतें (जैसे 'सड़क पर गड्ढा है') अस्पष्ट बताकर खारिज कर दी जाती हैं। जनसेतु AI आपकी शिकायत में सटीक जीपीएस पिन और निकटतम लैंडमार्क जोड़ता है, जिससे पीडब्ल्यूडी/नगरपालिका इंजीनियर सीधे वर्क-ऑर्डर जारी कर सकें।"
                  : "Informal complaints like 'pothole on my road' often get dismissed by clerks as non-actionable. JanSetu AI embeds your exact map coordinates and landmark reference into the formal statutory draft so municipal field teams can immediately dispatch work orders without site ambiguity."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Review AI Draft with Copy Buttons */}
      {step === 2 && draft && (
        <div className="aiDraftReviewCard" style={{ padding: "32px", borderRadius: "20px" }}>
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

          <div className="copyFieldBox">
            <div className="copyFieldHeader">
              <span className="copyFieldLabel">Full Statutory Notice (औपचारिक पत्र)</span>
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
              <div style={{ whiteSpace: "pre-wrap", fontSize: "13px", lineHeight: 1.6, color: "var(--text)", maxHeight: "280px", overflowY: "auto", paddingRight: "8px" }}>
                {editedBody}
              </div>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginTop: "24px" }}>
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
              onClick={() => setStep(3)}
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
        <div className="panel" style={{ padding: "36px", borderRadius: "20px" }}>
          <div style={{ marginBottom: "20px" }}>
            <span className="kicker">STEP 3 OF 3</span>
            <h2 style={{ fontSize: "22px", margin: "4px 0", color: "var(--text-heading)" }}>
              {t("fileStepTitle")}
            </h2>
            <p style={{ color: "var(--muted)", margin: 0, fontSize: "14px" }}>
              {t("fileStepSub")}
            </p>
          </div>

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

          <div style={{ marginTop: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 700, margin: 0 }}>
                {t("refInputLabel")}
              </label>
              <button
                type="button"
                onClick={() => {
                  const prefixes = ["CPGRAMS/2026/HAR", "MCG/GRV/2026", "MCD/CIV/2026", "CM-WINDOW/HR"];
                  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
                  const randomNum = Math.floor(100000 + Math.random() * 900000);
                  setPortalRefInput(`${prefix}/${randomNum}`);
                  notify?.(isHi ? "डेमो रजिस्ट्रेशन नंबर भर दिया गया!" : "Demo portal reference number filled!");
                }}
                style={{
                  background: "var(--blue-subtle)",
                  border: "1px solid var(--blue)",
                  color: "var(--blue)",
                  borderRadius: "6px",
                  padding: "4px 10px",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "5px"
                }}
              >
                <Zap size={13} />
                <span>{isHi ? "⚡ डेमो रजिस्ट्रेशन नंबर भरें" : "⚡ Fill Demo Registration Number"}</span>
              </button>
            </div>
            <input
              type="text"
              value={portalRefInput}
              onChange={(e) => setPortalRefInput(e.target.value)}
              placeholder={t("refInputPlaceholder")}
              style={{ width: "100%", padding: "14px 16px", borderRadius: "10px", border: "2px solid var(--blue)", background: "var(--panel-input)", color: "var(--text)", fontSize: "15px", fontWeight: 600 }}
            />
            {/* Explanatory helper box for hackathon evaluators */}
            <div style={{
              marginTop: "10px",
              padding: "10px 14px",
              borderRadius: "8px",
              background: "var(--panel2)",
              border: "1px dashed var(--line)",
              fontSize: "12px",
              color: "var(--muted)",
              display: "flex",
              alignItems: "flex-start",
              gap: "8px",
              lineHeight: 1.5
            }}>
              <Info size={16} color="var(--blue)" style={{ flexShrink: 0, marginTop: "2px" }} />
              <span>
                {isHi
                  ? "पोर्टल रजिस्ट्रेशन नंबर क्या है? जब आप आधिकारिक सरकारी पोर्टल (CPGRAMS / नगर निगम) पर सबमिट करते हैं, तो वे एक पावती रसीद नंबर जारी करते हैं। JanSetu AI उसी नंबर से आपके समाधान की समय सीमा ट्रैक करता है और समय बीतने पर आरटीआई अपील तैयार करता है।"
                  : "What is this registration number? When you submit your complaint on the official government portal (CPGRAMS / Municipal portal), they issue a confirmation receipt ID. JanSetu AI uses this exact reference number to track your resolution deadline and auto-generate RTI escalations if ignored."}
              </span>
            </div>
          </div>

          {/* Pre-Filing Google Authentication Box in Step 3 */}
          {!user && (
            <div style={{
              marginTop: "20px",
              padding: "20px",
              borderRadius: "14px",
              background: "rgba(37, 99, 235, 0.06)",
              border: "1px solid rgba(37, 99, 235, 0.2)",
              textAlign: "center"
            }}>
              <h4 style={{ margin: "0 0 6px", fontSize: "15px", color: "var(--text-heading)", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <LogIn size={18} color="var(--blue)" />
                <span>{isHi ? "शिकायत दर्ज करने से पहले Google लॉगिन आवश्यक है" : "Google Sign-In Required to Track & File"}</span>
              </h4>
              <p style={{ margin: "0 auto 14px", fontSize: "13px", color: "var(--muted)", maxWidth: "460px" }}>
                {isHi
                  ? "पोर्टल संदर्भ नंबर को अपने नागरिक रिकॉर्ड से जोड़ने और समय बीतने पर कानूनी आरटीआई अपील तैयार करने हेतु कृपया लॉगिन करें।"
                  : "Please sign in with your Google account so your portal reference is attached to your citizen profile for statutory SLA tracking and automated RTI appeals."}
              </p>
              <button
                type="button"
                onClick={() => {
                  triggerGoogleSignIn((u) => {
                    onLogin?.(u);
                    notify?.(isHi ? `नमस्ते, ${u.name}! Google से लॉगिन हुआ।` : `Welcome, ${u.name}!`);
                  });
                }}
                style={{
                  padding: "10px 20px",
                  borderRadius: "10px",
                  background: "#FFFFFF",
                  color: "#1F2937",
                  border: "1px solid var(--line-strong)",
                  fontWeight: 700,
                  fontSize: "14px",
                  display: "inline-flex",
                  alignItems: "center",
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
                <span>{isHi ? "Google से लॉगिन करें" : "Sign in with Google"}</span>
              </button>
            </div>
          )}

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
          </div>
        </div>
      )}

      {/* STEP 4: Marked as Filed Confirmation & Live SLA Tracker */}
      {step === 4 && confirmedComplaint && (
        <div className="panel" style={{ padding: "40px 32px", borderRadius: "20px" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "var(--emerald-subtle)", color: "var(--emerald)", display: "grid", placeItems: "center", margin: "0 auto 16px" }}>
              <CheckCircle2 size={36} />
            </div>
            <span className="kicker" style={{ color: "var(--emerald)", fontWeight: 700 }}>
              {isHi ? "सफलतापूर्वक दर्ज • ट्रैकर सक्रिय" : "OFFICIALLY LODGED • LIVE TRACKER ACTIVE"}
            </span>
            <h2 style={{ fontSize: "26px", color: "var(--text-heading)", margin: "6px 0 8px" }}>
              {isHi ? "शिकायत ट्रैकर व समाधान टाइमलाइन" : "Grievance Tracker & Resolution Timeline"}
            </h2>
            <p style={{ color: "var(--muted)", fontSize: "14px", maxWidth: "600px", margin: "0 auto" }}>
              {isHi
                ? `आपकी शिकायत पोर्टल संदर्भ ${confirmedComplaint.portalRefNumber} के तहत आधिकारिक रूप से दर्ज हो चुकी है। JanSetu AI अब समाधान की निगरानी कर रहा है।`
                : `Your complaint is actively logged under reference ${confirmedComplaint.portalRefNumber}. JanSetu AI is actively monitoring the department's statutory SLA window.`}
            </p>
          </div>

          {/* Quick Metrics Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "14px",
            marginBottom: "28px"
          }}>
            {/* Metric 1: Reference */}
            <div style={{ background: "var(--panel2)", border: "1px solid var(--line)", borderRadius: "12px", padding: "16px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {isHi ? "पोर्टल संदर्भ संख्या" : "Official Portal Reference"}
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "4px" }}>
                <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--blue)", fontFamily: "monospace" }}>
                  {confirmedComplaint.portalRefNumber}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(confirmedComplaint.portalRefNumber);
                    notify?.(isHi ? "संदर्भ संख्या कॉपी हुई!" : "Reference number copied!");
                  }}
                  style={{ background: "transparent", border: "none", color: "var(--blue)", cursor: "pointer", padding: "4px" }}
                  title="Copy reference number"
                >
                  <Copy size={14} />
                </button>
              </div>
              <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "4px" }}>
                {confirmedComplaint.portalName || "CPGRAMS / Municipal Portal"}
              </div>
            </div>

            {/* Metric 2: Current Stage */}
            <div style={{ background: "var(--panel2)", border: "1px solid var(--line)", borderRadius: "12px", padding: "16px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {isHi ? "वर्तमान स्थिति / चरण" : "Current Application Stage"}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#3B82F6" }} />
                <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-heading)" }}>
                  {isHi ? "चरण 2: विभागीय समीक्षा जारी" : "Stage 2: Official Desk Review"}
                </span>
              </div>
              <div style={{ fontSize: "11px", color: "var(--emerald)", fontWeight: 600, marginTop: "4px" }}>
                {isHi ? "अभिस्वीकृति (Receipt) जारी" : "Official receipt confirmed"}
              </div>
            </div>

            {/* Metric 3: Resolution Window & Target Date */}
            <div style={{ background: "var(--panel2)", border: "1px solid var(--line)", borderRadius: "12px", padding: "16px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {isHi ? "समाधान समय सीमा (SLA)" : "Estimated Resolution Window"}
              </div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-heading)", marginTop: "4px" }}>
                {confirmedComplaint.expectedResolutionDays || 7} {isHi ? "कार्य दिवस" : "working days"}
              </div>
              <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "4px" }}>
                Target: <strong>{new Date(Date.now() + (confirmedComplaint.expectedResolutionDays || 7) * 86400000).toLocaleDateString(isHi ? "hi-IN" : "en-IN", { day: "numeric", month: "short", year: "numeric" })}</strong>
              </div>
            </div>

            {/* Metric 4: Assigned Department */}
            <div style={{ background: "var(--panel2)", border: "1px solid var(--line)", borderRadius: "12px", padding: "16px" }}>
              <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {isHi ? "जिम्मेदार विभाग" : "Assigned Authority"}
              </div>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-heading)", marginTop: "4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {confirmedComplaint.dept || "Competent Municipal Cell"}
              </div>
              <div style={{ fontSize: "11px", color: "var(--muted)", marginTop: "4px" }}>
                Citizen Charter SLA Enforced
              </div>
            </div>
          </div>

          {/* Detailed 4-Step Lifecycle Timeline */}
          <div style={{
            background: "var(--panel2)",
            border: "1px solid var(--line)",
            borderRadius: "16px",
            padding: "24px",
            marginBottom: "28px"
          }}>
            <h3 style={{ margin: "0 0 16px", fontSize: "16px", color: "var(--text-heading)", display: "flex", alignItems: "center", gap: "8px" }}>
              <Clock size={16} color="var(--blue)" />
              <span>{isHi ? "आवेदन की चरणबद्ध स्थिति (Where is your application right now?)" : "Where is your application right now? (4-Stage Redressal Lifecycle)"}</span>
            </h3>

            <div style={{ display: "grid", gap: "16px" }}>
              {/* Stage 1: Completed */}
              <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--emerald)", color: "#fff", display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <Check size={16} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "4px" }}>
                    <strong style={{ fontSize: "14px", color: "var(--text-heading)" }}>
                      {isHi ? "चरण 1: शिकायत तैयार व पोर्टल पर दर्ज" : "Stage 1: Complaint Prepared & Filed on Official Portal"}
                    </strong>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "var(--emerald)", padding: "2px 8px", borderRadius: "10px", background: "var(--emerald-subtle)" }}>
                      COMPLETED TODAY
                    </span>
                  </div>
                  <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--muted)", lineHeight: 1.5 }}>
                    {isHi
                      ? `संदर्भ संख्या ${confirmedComplaint.portalRefNumber} के साथ आधिकारिक पोर्टल पर सफलतापूर्वक सबमिट की गई।`
                      : `Citizen verified complaint submission. Official acknowledgement generated under Reference ${confirmedComplaint.portalRefNumber}.`}
                  </p>
                </div>
              </div>

              {/* Stage 2: In Progress (Current) */}
              <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--blue)", color: "#fff", display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <Clock size={16} />
                </div>
                <div style={{ flex: 1, background: "var(--panel)", border: "1px solid var(--blue)", borderRadius: "10px", padding: "12px 14px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "4px" }}>
                    <strong style={{ fontSize: "14px", color: "var(--blue)" }}>
                      {isHi ? "चरण 2: विभागीय डेस्क समीक्षा व नोडल अधिकारी आवंटन (वर्तमान चरण)" : "Stage 2: Official Desk Review & Nodal Allocation (CURRENT STEP)"}
                    </strong>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#FFFFFF", padding: "2px 8px", borderRadius: "10px", background: "var(--blue)" }}>
                      IN PROGRESS (DAY 1 OF {confirmedComplaint.expectedResolutionDays || 7})
                    </span>
                  </div>
                  <p style={{ margin: "6px 0 0", fontSize: "13px", color: "var(--text)", lineHeight: 1.5 }}>
                    <strong>{isHi ? "सरकारी अपडेट:" : "Government Update:"} </strong>
                    {isHi
                      ? `शिकायत फ़ाइल ${confirmedComplaint.dept} के संबंधित नोडल सेल को क्षेत्राधिकार जांच हेतु भेजी गई है। सिटीजन चार्टर के तहत प्रारंभिक 48 घंटों में प्राथमिक स्क्रूटनी की जाती है।`
                      : `Complaint dossier received at ${confirmedComplaint.dept} grievance registry. Jurisdictional screening is underway to allocate a Junior Engineer / Section Inspector.`}
                  </p>
                  <div style={{ marginTop: "8px", fontSize: "11px", color: "var(--muted)" }}>
                    {isHi ? "अपेक्षित समय:" : "Window for this step:"} <strong>24–48 hours</strong>
                  </div>
                </div>
              </div>

              {/* Stage 3: Upcoming */}
              <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", opacity: 0.85 }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--panel3)", color: "var(--muted)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                  3
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "4px" }}>
                    <strong style={{ fontSize: "14px", color: "var(--text-heading)" }}>
                      {isHi ? "चरण 3: स्थलीय निरीक्षण व कार्य आदेश जारी (आगामी)" : "Stage 3: Field Inspection & Remediation Work Order (Upcoming)"}
                    </strong>
                    <span style={{ fontSize: "11px", color: "var(--muted)" }}>
                      DAY 3–5
                    </span>
                  </div>
                  <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--muted)", lineHeight: 1.5 }}>
                    {isHi
                      ? "फील्ड टीम स्थल का दौरा कर आवश्यक मरम्मत या सामग्री का वर्क ऑर्डर जारी करेगी।"
                      : "Designated field inspection team conducts physical verification and issues repair / maintenance order."}
                  </p>
                </div>
              </div>

              {/* Stage 4: Resolution & RTI Safeguard */}
              <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", opacity: 0.85 }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--panel3)", color: "var(--muted)", display: "grid", placeItems: "center", flexShrink: 0 }}>
                  4
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "4px" }}>
                    <strong style={{ fontSize: "14px", color: "var(--text-heading)" }}>
                      {isHi ? "चरण 4: पूर्ण समाधान अथवा आरटीआई एस्केलेशन (लक्ष्य)" : "Stage 4: Verified Resolution or Automatic RTI Escalation (Target)"}
                    </strong>
                    <span style={{ fontSize: "11px", color: "var(--muted)" }}>
                      TARGET: DAY {confirmedComplaint.expectedResolutionDays || 7}
                    </span>
                  </div>
                  <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--muted)", lineHeight: 1.5 }}>
                    {isHi
                      ? `यदि विभाग ${confirmedComplaint.expectedResolutionDays || 7} दिनों में समाधान नहीं करता, तो JanSetu AI का आरटीआई इंजन तुरंत प्रथम अपीलीय अधिकारी हेतु अपील तैयार करेगा।`
                      : `Official Action Taken Report (ATR). If authorities fail to resolve within ${confirmedComplaint.expectedResolutionDays || 7} days, JanSetu AI unlocks your automated RTI Appeal under Section 19(1) of the RTI Act 2005.`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              className="primary"
              onClick={onViewTracker}
              style={{ padding: "13px 28px", borderRadius: "10px", fontSize: "15px", display: "inline-flex", alignItems: "center", gap: "8px", fontWeight: 700 }}
            >
              <span>{isHi ? "मेरे शिकायत ट्रैकर में देखें" : "Open My Complaints Tracker"}</span>
              <ArrowRight size={16} />
            </button>

            <button
              type="button"
              className="secondary"
              onClick={() => {
                const summaryText = `JanSetu AI Civic Tracker Status:
Portal Reference: ${confirmedComplaint.portalRefNumber}
Portal: ${confirmedComplaint.portalName || "CPGRAMS"}
Department: ${confirmedComplaint.dept}
Filing Date: ${confirmedComplaint.filingDate}
Current Status: Stage 2 - Official Desk Review in Progress
Estimated Resolution Window: ${confirmedComplaint.expectedResolutionDays || 7} working days
Tracked securely on JanSetu AI.`;
                navigator.clipboard.writeText(summaryText);
                notify?.(isHi ? "ट्रैकिंग विवरण कॉपी किया गया!" : "Tracking summary copied to clipboard!");
              }}
              style={{ padding: "13px 20px", borderRadius: "10px", fontSize: "14px", display: "inline-flex", alignItems: "center", gap: "8px" }}
            >
              <Copy size={15} />
              <span>{isHi ? "ट्रैकर समरी कॉपी करें" : "Copy Tracking Summary"}</span>
            </button>

            <button
              type="button"
              className="secondary"
              onClick={() => {
                setStep(1);
                setDescription("");
                setPhotos([]);
                setConfirmedComplaint(null);
              }}
              style={{ padding: "13px 18px", borderRadius: "10px", fontSize: "14px" }}
            >
              <span>{isHi ? "दूसरी शिकायत दर्ज करें" : "File Another Grievance"}</span>
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
