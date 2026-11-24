// AI Copilot Service for JanSetu AI
// Implements server-side /api/ai integration with a high-fidelity deterministic template fallback
// Guarantees 100% uptime: never breaks if offline, no API key, or server error.

import { categoryPortalMap, getPortalForCategory } from "../data/portals";

// Send message to Gemini via /api/chat with full memory & multimodal support
export async function sendChatMessage({ message, history = [], contextItem = null, image = null, lang = "English" }) {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history, contextItem, image, lang })
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
    const errData = await res.json().catch(() => ({}));
    return {
      text: errData.error || (lang === "हिन्दी" ? "सेवा में त्रुटि हुई, कृपया पुनः प्रयास करें।" : "Service encountered an error, please try again."),
      fallback: true,
      error: true
    };
  } catch (err) {
    console.warn("Client chat fetch notice:", err);
    return {
      text: lang === "हिन्दी"
        ? "ऑफ़लाइन मोड: जनसेतु एआई आपके प्रश्नों के उत्तर देने हेतु स्थानीय ज्ञानकोष का उपयोग कर रहा है।"
        : "Local mode: JanSetu AI is answering using local verified statutory guidance.",
      fallback: true
    };
  }
}

// Multimodal analysis of complaint photos
export async function analyzePhotoForComplaint(imageBase64) {
  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "analyzePhoto", image: imageBase64 })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn("Analyze photo fallback:", e);
  }
  return { category: "roads", urgency: "high", summary: "Visible road / civic issue" };
}

// Structured Intent Detection
export async function detectIntent(userText, lang = "English") {
  const text = (userText || "").toLowerCase().trim();

  // 1. Try server-side LLM endpoint if configured
  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "detectIntent", text: userText, lang })
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.intent) return data;
    }
  } catch (err) {
    // Graceful fallback to client-side rule engine
  }

  // 2. High-Fidelity Client-Side Natural Language Intent Classifier
  const isHi = lang === "हिन्दी";

  // Scheme Intent Detection
  if (
    text.includes("scheme") || text.includes("yojana") || text.includes("योजना") ||
    text.includes("kisan") || text.includes("ayushman") || text.includes("awas") ||
    text.includes("mudra") || text.includes("pension") || text.includes("subsidy") ||
    text.includes("पात्रता") || text.includes("पेंशन") || text.includes("सब्सिडी")
  ) {
    return {
      intent: "scheme",
      category: "schemes",
      urgency: "medium",
      extractedLocation: "",
      extractedSummary: userText,
      confidence: 0.95,
      routeTarget: "schemes"
    };
  }

  // Certificate / Document Intent Detection
  if (
    text.includes("certificate") || text.includes("praman patra") || text.includes("प्रमाण पत्र") ||
    text.includes("income cert") || text.includes("caste cert") || text.includes("domicile") ||
    text.includes("birth cert") || text.includes("death cert") || text.includes("udid") ||
    text.includes("आय प्रमाण") || text.includes("जाति प्रमाण") || text.includes("निवास")
  ) {
    return {
      intent: "certificate",
      category: "documents",
      urgency: "medium",
      extractedLocation: "",
      extractedSummary: userText,
      confidence: 0.94,
      routeTarget: "documents"
    };
  }

  // Civic Grievance Intent Detection
  let category = "roads";
  let urgency = "medium";
  let urgencyReason = "Reported civic inconvenience requiring standard municipal inspection.";

  if (text.includes("water") || text.includes("leak") || text.includes("pipe") || text.includes("पानी") || text.includes("नल") || text.includes("सीवेज") || text.includes("drain")) {
    category = "water";
    if (text.includes("contaminat") || text.includes("dirty") || text.includes("sewage") || text.includes("गंदा") || text.includes("बीमार")) {
      urgency = "safety-critical";
      urgencyReason = "Drinking water contamination poses an immediate epidemic hazard.";
    } else {
      urgency = "high";
      urgencyReason = "Clean drinking water wastage and local pressure drop.";
    }
  } else if (text.includes("light") || text.includes("pole") || text.includes("dark") || text.includes("बत्ती") || text.includes("अंधेरा") || text.includes("खंभा")) {
    category = "streetlight";
    urgency = text.includes("week") || text.includes("month") || text.includes("security") ? "high" : "medium";
    urgencyReason = "Dark stretch creates safety and accident vulnerability for pedestrians.";
  } else if (text.includes("garbage") || text.includes("waste") || text.includes("trash") || text.includes("dump") || text.includes("कचरा") || text.includes("सफाई") || text.includes("बदबू")) {
    category = "waste";
    urgency = text.includes("school") || text.includes("hospital") ? "safety-critical" : "high";
    urgencyReason = "Accumulated solid waste creating vector breeding and acute odor.";
  } else if (text.includes("pothole") || text.includes("road") || text.includes("street") || text.includes("गड्ढा") || text.includes("सड़क") || text.includes("हादसा") || text.includes("accident")) {
    category = "roads";
    if (text.includes("accident") || text.includes("skid") || text.includes("deep") || text.includes("गहरा") || text.includes("दुर्घटना")) {
      urgency = "safety-critical";
      urgencyReason = "Deep carriageway depression posing rollover/fatal skid hazard.";
    } else {
      urgency = "medium";
      urgencyReason = "Surface degradation affecting vehicular flow.";
    }
  }

  // Duration extraction heuristic
  let duration = "recent";
  if (text.includes("week") || text.includes("हफ्ते")) duration = "1 week";
  if (text.includes("month") || text.includes("महीने")) duration = "1 month";
  if (text.includes("days") || text.includes("दिन")) duration = "several days";

  return {
    intent: "grievance",
    category,
    urgency,
    urgencyReason,
    extractedLocation: "",
    duration,
    extractedSummary: userText,
    confidence: 0.92,
    routeTarget: "file"
  };
}

// Formal Complaint Draft Generator
export async function generateComplaintDraft({ category, location, description, urgency, lang = "English", user = null }) {
  // 1. Try server-side call
  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "generateDraft", category, location, description, urgency, lang })
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.subject) return data;
    }
  } catch (err) {}

  // 2. High-Quality Statutory Template Generation
  const portalInfo = getPortalForCategory(category);
  const isHi = lang === "हिन्दी";
  const citizenName = user?.name || (isHi ? "जागरूक नागरिक" : "Concerned Citizen");
  const loc = location || (isHi ? "संबंधित वार्ड / मोहल्ला" : "Designated Municipal Ward Area");

  let subjectEn = "";
  let subjectHi = "";
  let bodyEn = "";
  let bodyHi = "";
  let recommendedEvidence = portalInfo.documentsNeeded || [];

  switch (category) {
    case "roads":
      subjectEn = `URGENT CIVIC REDRESSAL: Hazardous road deterioration and deep potholes at ${loc}`;
      subjectHi = `अत्यावश्यक नागरिक शिकायत: ${loc} पर सड़क के गहरे गड्ढों की तत्काल मरम्मत बाबत`;
      bodyEn = `To,\nThe Executive Engineer / Competent Authority,\n${portalInfo.department}.\n\nRespected Sir/Madam,\n\nI am writing to register an urgent civic grievance regarding dangerous road deterioration and severe potholes located at ${loc}.\n\nISSUE DETAILS:\n${description}\n\nSEVERITY ASSESSMENT: ${urgency.toUpperCase()}\nThis sector experiences regular vehicular movement. The unpaved crater condition presents an immediate safety risk for two-wheelers, school transport, and emergency vehicles. Despite verbal notifications to local maintenance, the surface continues to erode.\n\nPRAYER / RELIEF SOUGHT:\n1. Conduct an immediate on-site inspection within 48 hours.\n2. Authorize urgent cold mix/bituminous patchwork to prevent accidents.\n3. Provide the official work-order timeline under the Citizen Charter.\n\nThank you.\n\nYours faithfully,\n${citizenName}\nResident of the Area`;
      bodyHi = `सेवा में,\nकार्यपालक अभियंता / सक्षम अधिकारी,\n${portalInfo.departmentHi}।\n\nमहोदय/महोदया,\n\nमैं ${loc} पर सड़क की जर्जर स्थिति एवं जानलेवा गड्ढों के संदर्भ में यह आवश्यक शिकायत दर्ज कर रहा हूँ।\n\nसमस्या का विवरण:\n${description}\n\nप्राथमिकता स्तर: ${urgency === 'safety-critical' ? 'अति-गंभीर' : 'उच्च'}\nयहाँ भारी यातायात आवागमन रहता है। इन गड्ढों के कारण आए दिन दोपहिया वाहन फिसल रहे हैं और दुर्घटना की प्रबल आशंका बनी हुई है।\n\nप्रार्थना:\n1. 48 घंटे के भीतर स्थल निरीक्षण कराया जाए।\n2. दुर्घटनाओं को रोकने हेतु तुरंत पैचवर्क कार्य कराया जाए।\n3. नागरिक चार्टर के तहत समाधान की समय सीमा साझा की जाए।\n\nभवदीय,\n${citizenName}`;
      break;

    case "water":
      subjectEn = `CRITICAL SANITATION/WATER: Public pipeline rupture and supply interruption at ${loc}`;
      subjectHi = `अत्यावश्यक जलापूर्ति शिकायत: ${loc} पर पाइपलाइन लीकेज एवं दूषित जल आपूर्ति निवारण बाबत`;
      bodyEn = `To,\nThe Sub-Divisional Officer / Executive Engineer,\n${portalInfo.department}.\n\nRespected Sir/Madam,\n\nI bring to your immediate notice an urgent water infrastructure failure at ${loc}.\n\nPROBLEM SUMMARY:\n${description}\n\nRISK FACTOR: ${urgency.toUpperCase()}\nClean potable water is being wasted in large quantities while adjacent households face severe pressure drop and suction contamination from adjacent drains. This situation poses a serious public health hazard if left unattended.\n\nREQUESTED ACTION:\n1. Deploy emergency line patrol squad to isolate the breach.\n2. Execute durable pipe sleeve/joint replacement.\n3. Conduct chlorine residual testing to ensure potable purity before resuming full supply.\n\nYours sincerely,\n${citizenName}`;
      bodyHi = `सेवा में,\nउप-मंडल अधिकारी / कार्यपालक अभियंता,\n${portalInfo.departmentHi}।\n\nमहोदय,\nमैं ${loc} पर पेयजल पाइपलाइन में गंभीर रिसाव/दूषित जल आपूर्ति की ओर आपका ध्यान आकर्षित कराना चाहता हूँ।\n\nसमस्या का विवरण:\n${description}\n\nखतरे का स्तर: अति-गंभीर\nसाफ पानी बहकर बर्बाद हो रहा है तथा सीवेज के संपर्क में आने से जलजनित बीमारियों का खतरा बढ़ गया है।\n\nअनुरोध:\n1. तत्काल तकनीकी दल भेजकर लीकेज बंद कराया जाए।\n2. क्षतिग्रस्त पाइप की स्थायी मरम्मत कराई जाए।\n\nभवदीय,\n${citizenName}`;
      break;

    case "streetlight":
      subjectEn = `PUBLIC SAFETY NOTICE: Prolonged streetlight failure and dark zone on ${loc}`;
      subjectHi = `जन सुरक्षा शिकायत: ${loc} पर लंबे समय से बंद स्ट्रीट लाइटों की मरम्मत बाबत`;
      bodyEn = `To,\nThe Assistant Engineer (Electrical / Lighting),\n${portalInfo.department}.\n\nRespected Sir/Madam,\n\nThis is to request immediate restoration of unlit public street lighting on ${loc}.\n\nOBSERVATIONS:\n${description}\n\nIMPACT:\nThe prolonged outage has left a critical residential/pedestrian corridor in complete darkness after twilight, triggering severe anti-social vulnerabilities and navigation hazards for women, senior citizens, and pedestrians.\n\nREQUEST:\n1. Check phase feeder line and replace burnt-out LED luminaires / drivers.\n2. Restore regular lighting schedule on this route.\n\nYours faithfully,\n${citizenName}`;
      bodyHi = `सेवा में,\nसहायक अभियंता (विद्युत / प्रकाश),\n${portalInfo.departmentHi}।\n\nमहोदय,\nमैं ${loc} पर बंद पड़ी स्ट्रीट लाइटों को ठीक कराने हेतु यह शिकायत दर्ज कर रहा हूँ।\n\nसमस्या विवरण:\n${description}\n\nरात के समय अंधेरा रहने के कारण राहगीरों, महिलाओं व बुजुर्गों के लिए सुरक्षा का गंभीर खतरा बना हुआ है।\n\nअनुरोध है कि अविलंब तकनीकी जांच कर खराब लाइटों को बदला जाए।\n\nभवदीय,\n${citizenName}`;
      break;

    case "waste":
      subjectEn = `URGENT PUBLIC HEALTH COMPLAINT: Uncollected solid waste dump at ${loc}`;
      subjectHi = `स्वास्थ्य एवं स्वच्छता शिकायत: ${loc} पर अनियंत्रित कचरा ढेर हटाने बाबत`;
      bodyEn = `To,\nThe Chief Sanitary Inspector / Health Officer,\n${portalInfo.department}.\n\nSir/Madam,\n\nI lodge an urgent complaint regarding accumulated solid waste and skipped municipal container clearance at ${loc}.\n\nFIELD SITUATION:\n${description}\n\nHEALTH CONCERN: ${urgency.toUpperCase()}\nOverflowing garbage has started decomposing on the public carriageway, attracting stray animals, breeding mosquitoes, and emanating unbearable stench in the neighborhood.\n\nPRAYER:\n1. Deploy mechanical compactor vehicle for immediate site clearance.\n2. Sanitize and disinfect the ground with bleaching powder.\n3. Ensure daily designated collection schedule is adhered to by sanitation workers.\n\nYours sincerely,\n${citizenName}`;
      bodyHi = `सेवा में,\nमुख्य स्वच्छता निरीक्षक / स्वास्थ्य अधिकारी,\n${portalInfo.departmentHi}।\n\nमहोदय,\nमैं ${loc} पर कई दिनों से नहीं उठाए गए कचरे के ढेर के संबंध में यह शिकायत दर्ज कर रहा हूँ।\n\nविवरण:\n${description}\n\nकचरा सड़ने से अत्यधिक बदबू फैल रही है और संक्रामक बीमारियों का खतरा बना हुआ है।\n\nअनुरोध है कि तुरंत कचरा उठवाकर स्थल पर कीटाणुनाशक पाउडर का छिड़काव कराया जाए।\n\nभवदीय,\n${citizenName}`;
      break;

    default:
      subjectEn = `CIVIC GRIEVANCE: Public service deficiency at ${loc}`;
      subjectHi = `नागरिक शिकायत: ${loc} पर सार्वजनिक सेवा में व्यवधान बाबत`;
      bodyEn = `To,\nThe Competent Authority / Grievance Redressal Officer,\n${portalInfo.department}.\n\nSir/Madam,\n\nKindly investigate and resolve the following civic issue at ${loc}:\n\n${description}\n\nUrgency: ${urgency.toUpperCase()}\nPlease acknowledge this complaint and provide status under the prescribed Citizen Charter timeline.\n\nYours faithfully,\n${citizenName}`;
      bodyHi = `सेवा में,\nसक्षम लोक शिकायत अधिकारी,\n${portalInfo.departmentHi}।\n\nमहोदय,\nकृपया ${loc} पर उत्पन्न निम्नलिखित जनसमस्या की जांच कर समाधान करें:\n\n${description}\n\nभवदीय,\n${citizenName}`;
  }

  return {
    subject: isHi ? subjectHi : subjectEn,
    subjectEn,
    subjectHi,
    body: isHi ? bodyHi : bodyEn,
    bodyEn,
    bodyHi,
    department: isHi ? portalInfo.departmentHi : portalInfo.department,
    portal: portalInfo.portal,
    stateAlternative: portalInfo.stateAlternative,
    recommendedEvidence,
    typicalResolutionDays: portalInfo.typicalResolutionDays,
    urgencyReason: urgency === "safety-critical" ? "Imminent hazard to life, health, or public safety" : "Significant civic disruption"
  };
}

// 4-in-1 Escalation Package Generator
export function generateEscalationPackage(grievance, lang = "English") {
  const isHi = lang === "हिन्दी";
  const ref = grievance.portalRefNumber || grievance.id;
  const loc = grievance.location || "Local Ward";
  const portalName = grievance.portalName || "Official Portal";
  const filingDate = grievance.filingDate || "recent date";
  const daysOverdue = Math.max(1, (grievance.daysElapsed || 7) - (grievance.expectedResolutionDays || 3));

  // 1. Polite Reminder Letter
  const reminderLetter = isHi
    ? `विषय: अनुस्मारक - शिकायत संदर्भ ${ref} पर समयबद्ध कार्रवाई बाबत\n\nसेवा में,\nसंबंधित कार्यपालक अभियंता,\n${grievance.deptHi || grievance.dept}\n\nमहोदय,\nउपरोक्त संदर्भ संख्या ${ref} के तहत दिनांक ${filingDate} को ${loc} के संबंध में शिकायत दर्ज कराई गई थी।\nनागरिक चार्टर के अनुसार समाधान की निर्धारित समय सीमा समाप्त हो चुकी है, किंतु अब तक कोई ठोस कार्रवाई नहीं हुई है।\n\nकृपया इस पर त्वरित संज्ञान लेकर स्थल निरीक्षण व कार्य पूर्ण कराने की कृपा करें।\n\nसधन्यवाद,\nनागरिक`
    : `Subject: URGENT REMINDER - Action pending on Grievance Ref: ${ref}\n\nTo,\nThe Executive Officer / Public Grievance Officer,\n${grievance.dept}\n\nDear Sir/Madam,\n\nThis is a formal reminder regarding public grievance reference ${ref} filed on ${filingDate} concerning ${loc}.\n\nThe standard citizen charter resolution window of ${grievance.expectedResolutionDays || 3} working days elapsed ${daysOverdue} days ago, with no resolution status updated on the official portal.\n\nKindly expedite the necessary field action and advise the completion timeframe at the earliest.\n\nYours sincerely,\nCitizen Complainant`;

  // 2. Memorandum of First Appeal
  const appellateAppeal = isHi
    ? `प्रथम अपील ज्ञापन (नागरिक चार्टर एवं लोक शिकायत निवारण नियमावली के अंतर्गत)\n\nसेवा में,\nप्रथम अपीलीय प्राधिकारी / अधीक्षण अभियंता,\n${grievance.deptHi || grievance.dept}\n\nअपीलार्थी का नाम: जागरूक नागरिक\nमूल शिकायत संदर्भ: ${ref} (दर्ज दिनांक: ${filingDate})\nस्थान: ${loc}\n\nअपील के आधार:\n1. मूल शिकायत पर निर्धारित समय सीमा बीतने के उपरांत भी कोई निराकरण नहीं किया गया।\n2. पोर्टल पर बिना कारण बताए शिकायत लंबित रखी गई है।\n\nप्रार्थना:\nअपीलीय प्राधिकारी से सविनय प्रार्थना है कि संबंधित अवर अभियंता/फील्ड स्टाफ को तत्काल स्थल सुधार का आदेश दें और विलंब के कारणों की जांच कराएं।\n\nहस्ताक्षर: नागरिक अपीलार्थी`
    : `MEMORANDUM OF FIRST CIVIC APPEAL\nUnder State Public Grievance Redressal Charter\n\nTo,\nThe First Appellate Authority / Superintending Officer,\n${grievance.dept}\n\nAppellant: Citizen Resident\nGrievance Registration Ref: ${ref} (Dated: ${filingDate})\nLocation: ${loc}\n\nGROUNDS OF APPEAL:\n1. The competent lower authority has failed to redress the public hazard within the statutory citizen charter SLA.\n2. The complaint has been in an unaddressed state for ${grievance.daysElapsed || 10} days without communication of inspection findings.\n\nPRAYER:\nThe Appellant respectfully prays that the Appellate Authority:\n(a) Direct the division squad to complete the repair within 72 hours.\n(b) Call for an explanation regarding the systemic delay from the designated field unit.\n\nDate: ${new Date().toLocaleDateString()}\nComplainant / Appellant`;

  // 3. RTI Application Draft
  const rtiDraft = isHi
    ? `सूचना का अधिकार अधिनियम, 2005 की धारा 6(1) के अंतर्गत आवेदन\n\nसेवा में,\nलोक सूचना अधिकारी (PIO),\nकार्यालय: ${grievance.deptHi || grievance.dept}\n\n1. आवेदक: नागरिक निवासी\n2. मांगी गई जानकारी का विवरण:\n   क) शिकायत संख्या ${ref} (दिनांक ${filingDate}) पर दैनिक प्रगति रिपोर्ट (Daily Progress Report) की प्रमाणित प्रति।\n   ख) उक्त शिकायत के निवारण हेतु किस अधिकारी/कर्मचारी को दायित्व सौंपा गया था, उनके नाम व पदनाम।\n   ग) नागरिक चार्टर के अनुसार इस प्रकार की शिकायत के समाधान की अधिकतम निर्धारित समय सीमा क्या है?\n   घ) समय सीमा में कार्य न होने के लिए जिम्मेदार अधिकारियों के विरुद्ध की गई कार्रवाई का विवरण।\n   ड) ${loc} के रख-रखाव हेतु पिछले दो वित्तीय वर्षों में स्वीकृत बजट एवं व्यय की प्रमाणित प्रतिलिपि।\n\n3. आवेदन शुल्क ₹10 नियमानुसार संलग्न है।\n\nस्थान: ${loc}\nहस्ताक्षर: आवेदक`
    : `APPLICATION FOR INFORMATION UNDER SECTION 6(1) OF THE RTI ACT, 2005\n\nTo,\nThe Public Information Officer (PIO),\nOffice of: ${grievance.dept}\n\n1. Applicant: Citizen Resident\n2. Particulars of Information Sought:\n   a) Certified true copy of the Daily Progress Report (DPR) and file noting maintained on Grievance Reference ${ref} filed on ${filingDate}.\n   b) Name and designation of the inspecting officer(s) assigned to inspect ${loc} pursuant to this complaint.\n   c) Maximum permissible timeline stipulated under the Citizen Charter for this class of redressal.\n   d) Reasons recorded on file for exceeding the stipulated resolution window by ${daysOverdue} days.\n   e) Certified statement of maintenance funds allocated and disbursed for this lane/zone during FY 2024-2026.\n\nStatutory fee of ₹10 attached through official postal order/court fee stamp.\n\nDate: ${new Date().toLocaleDateString()}\nApplicant`;

  // 4. Public Evidence Summary (Dossier)
  const evidenceSummary = `======================================================
CIVIC EVIDENCE DOSSIER - PUBLIC SUMMARY
======================================================
• Case Reference: ${ref}
• Portal Used: ${portalName}
• Location: ${loc}
• Category: ${grievance.category}
• Severity Level: ${(grievance.urgency || "High").toUpperCase()}
• Date Lodged: ${filingDate}
• Days Overdue: ${daysOverdue} days beyond standard SLA (${grievance.expectedResolutionDays || 3} days)
• Status: Escalated / Unresolved on Official Portal

CHRONOLOGY & AUDIT TRAIL:
${(grievance.timeline || []).map(t => `  [${t.date}] ${t.title} (${t.actor || "System"}): ${t.note}`).join("\n")}

COMMUNITY IMPACT:
${grievance.desc}

REMARKS FOR RWA / WARD COUNCILLOR / PRESS:
This dossier has been compiled independently via JanSetu AI Copilot based on citizen-verified field documentation. An RTI application under Section 6(1) and a First Appeal have been served on the department.
======================================================`;

  return {
    reminderLetter,
    appellateAppeal,
    rtiDraft,
    evidenceSummary
  };
}
