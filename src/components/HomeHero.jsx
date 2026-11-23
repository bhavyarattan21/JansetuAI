import React, { useState, useEffect } from "react";
import {
  Search, Mic, MicOff, ArrowRight, Sparkles, Droplets, Construction,
  Trash2, Lightbulb, FileCheck2, BookOpen, ShieldCheck, CheckCircle2,
  AlertTriangle, Clock, FileText, CornerDownRight, Zap
} from "lucide-react";
import { detectIntent } from "../services/ai";

export function HomeHero({
  onRouteFlow,
  onLaunchDemoScenario,
  lang,
  t
}) {
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  // Web Speech API initialization
  useEffect(() => {
    if (typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      setSpeechSupported(true);
    }
  }, []);

  const handleStartVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert(lang === "हिन्दी" ? "आपका ब्राउज़र वॉयस इनपुट का समर्थन नहीं करता है।" : "Voice input is not supported in this browser.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === "हिन्दी" ? "hi-IN" : "en-IN";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        // Automatically trigger intent detection on completed speech
        processUserProblem(transcript);
      };

      recognition.onerror = (event) => {
        console.warn("Speech recognition notice:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error("Speech init error:", e);
      setIsListening(false);
    }
  };

  const processUserProblem = async (text) => {
    const promptText = (text || inputText).trim();
    if (!promptText) return;

    setIsAnalyzing(true);
    try {
      const result = await detectIntent(promptText, lang);
      onRouteFlow(result);
    } catch (err) {
      console.error("Intent error:", err);
      onRouteFlow({ intent: "grievance", category: "roads", extractedSummary: promptText });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <main className="page" style={{ paddingTop: "24px" }}>
      {/* Hero Header */}
      <div className="pageTitle" style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
        <span className="kicker" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
          <Sparkles size={14} color="var(--blue)" />
          {t("heroKicker")}
        </span>
        <h1 style={{ fontSize: "clamp(28px, 4.5vw, 44px)", lineHeight: 1.15, margin: "14px 0" }}>
          {t("heroTitle")}
        </h1>
        <p style={{ fontSize: "16px", color: "var(--muted)", maxWidth: "660px", margin: "0 auto", lineHeight: 1.6 }}>
          {t("heroSubtitle")}
        </p>
      </div>

      {/* Front Door: Giant Search / Voice Bar */}
      <div className="heroCoPilotBox">
        <form
          className="heroInputWrap"
          onSubmit={(e) => {
            e.preventDefault();
            processUserProblem();
          }}
        >
          <Search size={20} className="heroSearchIcon" />
          <input
            type="text"
            className="heroInputText"
            placeholder={t("heroInputPlaceholder")}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isAnalyzing}
          />
          <div className="heroInputActions">
            {speechSupported && (
              <button
                type="button"
                className={`micBtn ${isListening ? "activeMic" : ""}`}
                onClick={handleStartVoice}
                title={isListening ? t("listeningTooltip") : t("micTooltip")}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
            )}
            <button
              type="submit"
              className="heroActionSubmitBtn"
              disabled={isAnalyzing || !inputText.trim()}
            >
              {isAnalyzing ? (
                <span>{t("detectingIntent")}</span>
              ) : (
                <>
                  <span>Analyze</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Category Chips + One-Click Demo Scenario */}
        <div className="categoryChipsRow">
          <span>{t("quickChipsLabel")}</span>
          <button
            type="button"
            className="chipBtn"
            onClick={() => onRouteFlow({ intent: "grievance", category: "water" })}
          >
            <Droplets size={13} color="var(--blue)" />
            {t("chipWater")}
          </button>
          <button
            type="button"
            className="chipBtn"
            onClick={() => onRouteFlow({ intent: "grievance", category: "roads" })}
          >
            <Construction size={13} color="var(--amber)" />
            {t("chipRoads")}
          </button>
          <button
            type="button"
            className="chipBtn"
            onClick={() => onRouteFlow({ intent: "grievance", category: "waste" })}
          >
            <Trash2 size={13} color="var(--emerald)" />
            {t("chipWaste")}
          </button>
          <button
            type="button"
            className="chipBtn"
            onClick={() => onRouteFlow({ intent: "grievance", category: "streetlight" })}
          >
            <Lightbulb size={13} color="var(--saffron)" />
            {t("chipLight")}
          </button>
          <button
            type="button"
            className="chipBtn"
            onClick={() => onRouteFlow({ intent: "scheme", category: "schemes" })}
          >
            <BookOpen size={13} color="var(--blue)" />
            {t("chipSchemes")}
          </button>
          <button
            type="button"
            className="chipBtn"
            onClick={() => onRouteFlow({ intent: "certificate", category: "documents" })}
          >
            <FileCheck2 size={13} color="var(--emerald)" />
            {t("chipDocs")}
          </button>

          {/* 60-Second Demo Scenario CTA Button */}
          <button
            type="button"
            className="demoScenarioHeroBtn"
            onClick={onLaunchDemoScenario}
            title="Load realistic Sohna, Haryana pothole story"
          >
            <Zap size={14} />
            {t("demoScenarioBtn")}
          </button>
        </div>
      </div>

      {/* 3-Step "How It Works" Flow */}
      <div style={{ margin: "56px 0 32px", width: "100%" }}>
        <div className="sectionTitleBlock">
          <span className="kicker">3 SIMPLE STEPS</span>
          <h2>{t("howItWorksTitle")}</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
          <div className="failureCard" style={{ borderTop: "4px solid var(--blue)" }}>
            <span style={{ fontSize: "28px", fontWeight: 800, color: "var(--blue)", marginBottom: "8px" }}>
              {t("howStep1Num")}
            </span>
            <h3>{t("howStep1Title")}</h3>
            <p>{t("howStep1Desc")}</p>
          </div>

          <div className="failureCard" style={{ borderTop: "4px solid var(--saffron)" }}>
            <span style={{ fontSize: "28px", fontWeight: 800, color: "var(--saffron)", marginBottom: "8px" }}>
              {t("howStep2Num")}
            </span>
            <h3>{t("howStep2Title")}</h3>
            <p>{t("howStep2Desc")}</p>
          </div>

          <div className="failureCard" style={{ borderTop: "4px solid var(--emerald)" }}>
            <span style={{ fontSize: "28px", fontWeight: 800, color: "var(--emerald)", marginBottom: "8px" }}>
              {t("howStep3Num")}
            </span>
            <h3>{t("howStep3Title")}</h3>
            <p>{t("howStep3Desc")}</p>
          </div>
        </div>
      </div>

      {/* Why JanSetu AI Section (The 3 Real Failure Points) */}
      <section className="whyJanSetuSection">
        <div className="sectionTitleBlock">
          <span className="kicker">HONEST PRODUCT VALUE</span>
          <h2>{t("whyJanSetuTitle")}</h2>
          <p>{t("whyJanSetuSub")}</p>
        </div>

        <div className="failureGrid">
          {/* Failure Point 1 */}
          <div className="failureCard">
            <span className="failureBadBadge">
              <AlertTriangle size={13} /> Failure Point 1
            </span>
            <h3>{t("fail1Title")}</h3>
            <p>{t("fail1Desc")}</p>
            <div className="fixBox">
              <h4>
                <CheckCircle2 size={14} /> {t("fix1Title")}
              </h4>
              <p>{t("fix1Desc")}</p>
            </div>
          </div>

          {/* Failure Point 2 */}
          <div className="failureCard">
            <span className="failureBadBadge">
              <AlertTriangle size={13} /> Failure Point 2
            </span>
            <h3>{t("fail2Title")}</h3>
            <p>{t("fail2Desc")}</p>
            <div className="fixBox">
              <h4>
                <CheckCircle2 size={14} /> {t("fix2Title")}
              </h4>
              <p>{t("fix2Desc")}</p>
            </div>
          </div>

          {/* Failure Point 3 */}
          <div className="failureCard">
            <span className="failureBadBadge">
              <AlertTriangle size={13} /> Failure Point 3
            </span>
            <h3>{t("fail3Title")}</h3>
            <p>{t("fail3Desc")}</p>
            <div className="fixBox">
              <h4>
                <CheckCircle2 size={14} /> {t("fix3Title")}
              </h4>
              <p>{t("fix3Desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <div className="comparisonTableWrap">
        <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--line)", background: "var(--panel)" }}>
          <h3 style={{ margin: 0, fontSize: "18px", color: "var(--text-heading)" }}>
            {t("compTitle")}
          </h3>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className="compTable">
            <thead>
              <tr>
                <th style={{ width: "25%" }}>{t("compCol1")}</th>
                <th style={{ width: "37%" }}>{t("compCol2")}</th>
                <th style={{ width: "38%" }}>{t("compCol3")}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>{t("compRow1Head")}</strong></td>
                <td className="colBad">{t("compRow1Old")}</td>
                <td className="colGood">{t("compRow1New")}</td>
              </tr>
              <tr>
                <td><strong>{t("compRow2Head")}</strong></td>
                <td className="colBad">{t("compRow2Old")}</td>
                <td className="colGood">{t("compRow2New")}</td>
              </tr>
              <tr>
                <td><strong>{t("compRow3Head")}</strong></td>
                <td className="colBad">{t("compRow3Old")}</td>
                <td className="colGood">{t("compRow3New")}</td>
              </tr>
              <tr>
                <td><strong>{t("compRow4Head")}</strong></td>
                <td className="colBad">{t("compRow4Old")}</td>
                <td className="colGood">{t("compRow4New")}</td>
              </tr>
              <tr>
                <td><strong>{t("compRow5Head")}</strong></td>
                <td className="colBad">{t("compRow5Old")}</td>
                <td className="colGood">{t("compRow5New")}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
