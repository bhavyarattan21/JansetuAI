import React, { useState, useRef, useEffect } from "react";
import {
  Bot, Send, Sparkles, User, ArrowRight, CornerDownRight, FileText,
  Trash2, Mic, MicOff, Camera, X, Copy, Check, RefreshCw, AlertCircle
} from "lucide-react";
import { sendChatMessage } from "../services/ai";

export function CivicCoPilot({
  chat,
  setChat,
  contextItem,
  onClearContext,
  onRouteWithComplaint,
  lang,
  t,
  notify
}) {
  const isHi = lang === "हिन्दी";
  const [inputText, setInputText] = useState("");
  const [attachedImage, setAttachedImage] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const userScrolledUpRef = useRef(false);
  const recognitionRef = useRef(null);

  const defaultSuggestions = isHi ? [
    "सड़क के गड्ढे की शिकायत कैसे दर्ज करें?",
    "पीएम-किसान योजना की पात्रता क्या है?",
    "आय प्रमाण पत्र के लिए कौन से दस्तावेज़ चाहिए?",
    "यदि सरकारी पोर्टल पर शिकायत का समाधान न हो तो क्या करें?"
  ] : [
    "How do I prepare a road repair complaint for PWD?",
    "What are the eligibility criteria for PM-KISAN?",
    "Which documents are required for an Income Certificate?",
    "What should I do if the municipal portal ignores my complaint?"
  ];

  // Auto-scroll to newest message unless user scrolled up
  useEffect(() => {
    if (!userScrolledUpRef.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat, isTyping]);

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    userScrolledUpRef.current = scrollHeight - (scrollTop + clientHeight) > 80;
  };

  // Web Speech API Voice Recognition with Robust Error Handling
  const handleToggleVoice = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    if (window.location.protocol !== "https:" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
      notify(isHi ? "वॉयस इनपुट के लिए HTTPS आवश्यक है।" : "Voice input requires a secure HTTPS connection.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      notify(isHi ? "आपके ब्राउज़र में स्पीच रिकग्निशन उपलब्ध नहीं है।" : "Speech recognition is not supported in this browser.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = isHi ? "hi-IN" : "en-IN";
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            setInputText(prev => (prev ? prev + " " : "") + event.results[i][0].transcript);
          } else {
            interim += event.results[i][0].transcript;
          }
        }
      };

      recognition.onerror = (event) => {
        console.warn("Speech error:", event.error);
        setIsListening(false);
        if (event.error === "not-allowed") {
          notify(isHi ? "माइक्रोफ़ोन अनुमति अस्वीकृत। ब्राउज़र सेटिंग्स में अनुमति दें।" : "Microphone permission denied. Please allow mic access in your browser settings.");
        } else if (event.error === "no-speech") {
          notify(isHi ? "कोई आवाज़ नहीं सुनी गई। पुनः प्रयास करें।" : "No speech detected. Please try again.");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (e) {
      console.error("Speech init failure:", e);
      setIsListening(false);
    }
  };

  // Send message
  const handleSend = async (overrideText = null) => {
    const textToSend = (overrideText || inputText).trim();
    if (!textToSend && !attachedImage) return;

    const userMessage = {
      role: "user",
      text: textToSend,
      image: attachedImage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const nextChat = [...chat, userMessage];
    setChat(nextChat);
    setInputText("");
    const imgToSend = attachedImage;
    setAttachedImage(null);
    setIsTyping(true);
    userScrolledUpRef.current = false;

    try {
      // Call Gemini API via /api/chat
      const response = await sendChatMessage({
        message: textToSend,
        history: nextChat,
        contextItem: contextItem,
        image: imgToSend,
        lang: isHi ? "हिन्दी" : "English"
      });

      const assistantMessage = {
        role: "assistant",
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        categorySuggestion: response.categorySuggestion,
        urgencySuggestion: response.urgencySuggestion,
        attachedPhotoRef: imgToSend
      };

      setChat(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      setChat(prev => [
        ...prev,
        {
          role: "assistant",
          text: isHi
            ? "क्षमा करें, संदेश संसाधित करने में समस्या आई। कृपया पुनः प्रयास करें।"
            : "Sorry, there was an issue processing your question. Please try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // Clear conversation handler
  const confirmClearChat = () => {
    setChat([]);
    try {
      localStorage.removeItem("jansetu_chat_v3");
    } catch (e) {}
    setShowClearConfirm(false);
    notify(isHi ? "बातचीत साफ़ कर दी गई।" : "Conversation cleared.");
  };

  // Copy assistant response
  const handleCopyText = (text, idx) => {
    navigator.clipboard?.writeText(text);
    setCopiedIndex(idx);
    notify(isHi ? "उत्तर कॉपी किया गया!" : "Response copied!");
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <main className="page helpPage" style={{ maxWidth: "1380px", width: "95%", margin: "0 auto", paddingBottom: "40px" }}>
      {/* Title */}
      <div className="pageTitle">
        <span className="kicker">INDEPENDENT CIVIC ASSISTANT</span>
        <h1 style={{ fontSize: "28px", margin: "4px 0 6px", color: "var(--text-heading)" }}>
          {t("navHelp")}
        </h1>
        <p style={{ color: "var(--muted)", margin: 0, fontSize: "14px" }}>
          {isHi
            ? "सरकारी प्रक्रियाओं, योजनाओं और शिकायत दर्ज करने के संबंध में कोई भी सवाल पूछें। JanSetu AI निष्पक्ष व तथ्यपरक मार्गदर्शन प्रदान करता है।"
            : "Ask questions on civic grievances, 26+ central welfare schemes, or revenue certificates. JanSetu AI provides verified statutory advice."}
        </p>
      </div>

      {/* Main Single-Scroll Chat Box */}
      <div className="chatWrapper" style={{
        background: "var(--panel)",
        border: "1px solid var(--line)",
        borderRadius: "20px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "calc(100dvh - 260px)",
        minHeight: "520px",
        boxShadow: "var(--shadow-md)",
        position: "relative"
      }}>
        {/* Chat Header */}
        <div style={{
          padding: "14px 20px",
          borderBottom: "1px solid var(--line)",
          background: "var(--panel2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "var(--blue)", color: "#fff", display: "grid", placeItems: "center" }}>
              <Bot size={18} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text-heading)", display: "flex", alignItems: "center", gap: "6px" }}>
                <span>JanSetu Co-Pilot</span>
                <span style={{ fontSize: "10px", padding: "1px 6px", borderRadius: "4px", background: "var(--emerald-subtle)", color: "var(--emerald)", fontWeight: 700 }}>
                  Active
                </span>
              </div>
              <div style={{ fontSize: "11px", color: "var(--muted)" }}>
                Independent Guide • Powered by Gemini AI
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {contextItem && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "var(--blue-subtle)", color: "var(--blue)", padding: "4px 10px", borderRadius: "8px", fontSize: "12px", fontWeight: 600 }}>
                <span>Focus: {contextItem}</span>
                <button type="button" onClick={onClearContext} style={{ background: "none", border: "none", color: "inherit", cursor: "pointer", padding: 0 }}>
                  <X size={12} />
                </button>
              </div>
            )}
            <button
              type="button"
              className="archiveBtn"
              onClick={() => setShowClearConfirm(true)}
              title="Clear Conversation"
              style={{ padding: "6px 10px", fontSize: "12px" }}
            >
              <Trash2 size={13} />
              <span>Clear</span>
            </button>
          </div>
        </div>

        {/* Clear Confirmation Modal */}
        {showClearConfirm && (
          <div style={{
            position: "absolute",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 50,
            display: "grid",
            placeItems: "center",
            padding: "20px"
          }}>
            <div className="panel" style={{ width: "min(360px, 90vw)", padding: "24px", borderRadius: "16px", textAlign: "center" }}>
              <AlertCircle size={32} color="var(--rose)" style={{ margin: "0 auto 12px" }} />
              <h4 style={{ margin: "0 0 6px", fontSize: "16px", color: "var(--text-heading)" }}>
                {isHi ? "बातचीत साफ़ करें?" : "Clear this conversation?"}
              </h4>
              <p style={{ margin: "0 0 18px", fontSize: "13px", color: "var(--muted)" }}>
                {isHi ? "यह क्रिया पूर्व इतिहास को पूरी तरह मिटा देगी।" : "This will remove message history and reset conversation memory."}
              </p>
              <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                <button
                  type="button"
                  className="archiveBtn"
                  onClick={() => setShowClearConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="primary"
                  onClick={confirmClearChat}
                  style={{ background: "var(--rose)", borderColor: "var(--rose)" }}
                >
                  Yes, Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {/* The ONLY Scrollable Area: Message Stream */}
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          style={{
            flex: 1,
            minHeight: 0,
            overflowY: "auto",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}
        >
          {/* Welcome Message */}
          <div style={{ alignSelf: "flex-start", maxWidth: "82%", background: "var(--panel2)", padding: "16px 20px", borderRadius: "16px 16px 16px 2px", fontSize: "14px", lineHeight: 1.6, color: "var(--text)" }}>
            <p style={{ margin: 0 }}>
              {isHi
                ? "नमस्ते! मैं जनसेतु एआई हूँ — आपका स्वतंत्र नागरिक सहायक। आप किसी भी नागरिक समस्या (सड़क, पानी, कचरा, लाइट) का औपचारिक ड्राफ्ट तैयार करवा सकते हैं, 26+ केंद्रीय योजनाओं की पात्रता जांच सकते हैं, या फोटो अपलोड करके विश्लेषण करवा सकते हैं।"
                : "Namaste! I am JanSetu Co-Pilot — your independent civic guide. You can ask about municipal complaints, check 26+ central welfare schemes, or attach a photo for multimodal hazard analysis."}
            </p>
            <div style={{ marginTop: "8px", fontSize: "11px", color: "var(--muted)", display: "flex", alignItems: "center", gap: "4px" }}>
              <Sparkles size={12} color="var(--blue)" />
              <span>Independent civic guide • Please verify on official portals</span>
            </div>
          </div>

          {/* Render Messages */}
          {chat.map((m, idx) => {
            const isUser = m.role === "user";
            return (
              <div
                key={idx}
                style={{
                  alignSelf: isUser ? "flex-end" : "flex-start",
                  maxWidth: "82%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: isUser ? "flex-end" : "flex-start"
                }}
              >
                <div style={{
                  background: isUser ? "var(--blue)" : "var(--panel2)",
                  color: isUser ? "#ffffff" : "var(--text)",
                  padding: "14px 18px",
                  borderRadius: isUser ? "16px 16px 2px 16px" : "16px 16px 16px 2px",
                  fontSize: "14px",
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap"
                }}>
                  {/* Attached Image if user sent photo */}
                  {m.image && (
                    <img
                      src={m.image}
                      alt="Citizen uploaded"
                      style={{ maxWidth: "240px", maxHeight: "180px", borderRadius: "10px", marginBottom: "8px", display: "block" }}
                    />
                  )}
                  {m.text}
                </div>

                {/* Sub-bar for Assistant Messages */}
                {!isUser && (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px", fontSize: "11px", color: "var(--muted)" }}>
                    <span>{m.timestamp || ""}</span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(m.text, idx)}
                      style={{ background: "transparent", border: "none", color: "var(--muted)", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "3px" }}
                    >
                      {copiedIndex === idx ? <Check size={11} color="var(--emerald)" /> : <Copy size={11} />}
                      <span>{copiedIndex === idx ? "Copied" : "Copy"}</span>
                    </button>
                    {/* Routing CTA if photo was analyzed */}
                    {m.categorySuggestion && (
                      <button
                        type="button"
                        onClick={() => onRouteWithComplaint({
                          category: m.categorySuggestion,
                          urgency: m.urgencySuggestion || "high",
                          photo: m.attachedPhotoRef
                        })}
                        style={{ background: "var(--blue-subtle)", border: "none", color: "var(--blue)", fontWeight: 700, padding: "2px 8px", borderRadius: "6px", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}
                      >
                        <span>File Complaint with this Photo</span>
                        <ArrowRight size={11} />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <div style={{ alignSelf: "flex-start", background: "var(--panel2)", padding: "10px 16px", borderRadius: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
              <div className="typingDot" style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--blue)", animation: "pulseMic 1s infinite" }} />
              <div className="typingDot" style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--blue)", animation: "pulseMic 1s infinite 0.2s" }} />
              <div className="typingDot" style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--blue)", animation: "pulseMic 1s infinite 0.4s" }} />
              <span style={{ fontSize: "12px", color: "var(--muted)", marginLeft: "6px" }}>JanSetu Co-Pilot is typing...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div style={{
          padding: "8px 16px",
          background: "var(--panel2)",
          borderTop: "1px solid var(--line)",
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          scrollbarWidth: "none",
          flexShrink: 0
        }}>
          {defaultSuggestions.map((s, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleSend(s)}
              style={{
                background: "var(--panel)",
                border: "1px solid var(--line)",
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                color: "var(--text)",
                whiteSpace: "nowrap",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* Image Attachment Preview if active */}
        {attachedImage && (
          <div style={{ padding: "8px 16px", background: "var(--panel2)", display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
            <img src={attachedImage} alt="Attachment" style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "6px" }} />
            <span style={{ fontSize: "12px", color: "var(--text)" }}>Photo attached for Gemini analysis</span>
            <button type="button" onClick={() => setAttachedImage(null)} style={{ background: "none", border: "none", color: "var(--rose)", cursor: "pointer" }}>
              <X size={16} />
            </button>
          </div>
        )}

        {/* Pinned Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          style={{
            padding: "12px 16px",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "var(--panel)",
            borderTop: "1px solid var(--line)",
            flexShrink: 0
          }}
        >
          {/* Photo Attachment Button */}
          <label style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: "var(--panel2)",
            border: "1px solid var(--line)",
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
            color: attachedImage ? "var(--emerald)" : "var(--muted)",
            flexShrink: 0
          }} title="Attach photo for multimodal analysis">
            <Camera size={18} />
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  const file = e.target.files[0];
                  const reader = new FileReader();
                  reader.onload = () => setAttachedImage(reader.result);
                  reader.readAsDataURL(file);
                }
              }}
            />
          </label>

          {/* Voice Input Button */}
          <button
            type="button"
            className={`micBtn ${isListening ? "activeMic" : ""}`}
            onClick={handleToggleVoice}
            title={isListening ? "Listening... tap to stop" : "Speak in Hindi or English"}
            style={{ width: "40px", height: "40px", borderRadius: "10px", flexShrink: 0 }}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={isListening ? "Listening... speak now" : (isHi ? "यहाँ अपना नागरिक सवाल लिखें..." : "Ask your civic question...")}
            style={{
              flex: 1,
              padding: "11px 16px",
              borderRadius: "12px",
              border: "1px solid var(--line)",
              background: "var(--panel-input)",
              color: "var(--text)",
              fontSize: "14px",
              outline: "none"
            }}
          />

          <button
            type="submit"
            className="primary"
            disabled={(!inputText.trim() && !attachedImage) || isTyping}
            style={{
              width: "44px",
              height: "40px",
              borderRadius: "10px",
              display: "grid",
              placeItems: "center",
              flexShrink: 0
            }}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </main>
  );
}
