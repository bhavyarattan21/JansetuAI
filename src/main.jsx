import React, {useMemo, useState, useRef, useEffect} from "react";
import {createRoot} from "react-dom/client";
import {
  AlertTriangle, ArrowRight, Bell, Bot, Briefcase, Building2, Camera, Check, CheckCircle2,
  ChevronRight, CircleHelp, ClipboardList, Clock, Construction, Copy, Droplets, ExternalLink,
  FileCheck2, FileText, Globe2, GraduationCap, HandHeart, HeartPulse, Home, Key, Languages,
  Lightbulb, LogOut, MapPin, Menu, Mic, Moon, Phone, PhoneCall, Printer, RefreshCw, Route,
  Search, Settings, ShieldCheck, Sparkles, Sprout, Star, Sun, Trash2, Upload, UserCheck, UserRound, Wrench, X, Zap
} from "lucide-react";
import "./styles.css";

const i18n = {
  English: {
    brandTag: "National Civic Portal • भारत सरकार सहयोग",
    navHome: "Home",
    navReport: "Lodge Grievance",
    navMyGrievances: "My Grievances",
    navSchemes: "Welfare Schemes",
    navDocs: "Certificates",
    navHelp: "Civic Co-Pilot",
    myGrievancesTitle: "My Registered Grievances",
    myGrievancesSub: "Persistent citizen redressal log • Database records stored with tracking references",
    noGrievancesYet: "No Grievances Reported Yet",
    noGrievancesDesc: "Complaints you submit for water supply, roads, streetlights, or sanitation are permanently stored here with live field tracking.",
    filterAll: "All Grievances",
    filterActive: "In Progress",
    filterResolved: "Resolved & Closed",
    viewDossier: "View Tracking Dossier",
    withdrawGrievance: "Withdraw / Delete",
    viewInMyGrievances: "View in My Grievances",
    civicStatus: "GovTech Network Active",
    heroEyebrow: "DIGITAL PUBLIC INFRASTRUCTURE • CITIZEN REDRESSAL & WELFARE",
    heroTitle1: "Civic Resolution &",
    heroTitle2: "Welfare Access Portal.",
    heroDesc: "Directly lodge public grievances with municipal authorities, calculate eligibility for 50+ welfare schemes, and obtain revenue certificates without administrative hurdles.",
    searchPlaceholder: "Search civic service or grievance e.g. pothole, water leak, income certificate, PM schemes...",
    tryLabel: "Direct Links:",
    tryWater: "Water Supply issue",
    tryCert: "Income Certificate",
    tryPothole: "Roads & Potholes",
    trySchemes: "Central Schemes (50+)",
    trustCitizen: "Direct Municipal SLA",
    trustMultilingual: "22 Official Languages",
    trustAi: "DigiLocker Integrated",
    cardWaterTitle: "Water issue",
    cardWaterSub: "Municipal Jal Board (30s)",
    cardCertTitle: "Documents",
    cardCertSub: "View 6 certificates",
    civicAiTitle: "JANSETU",
    civicAiSub: "CITIZEN HELPDESK",
    consoleDeskTitle: "MUNICIPAL GRIEVANCE & OPERATIONS DESK",
    consoleLive: "LIVE INTEGRATION",
    metricResolved: "18,450+",
    metricResolvedLabel: "Resolved Grievances",
    metricSla: "98.2%",
    metricSlaLabel: "SLA Compliance",
    metricAvg: "24-48h",
    metricAvgLabel: "Avg Resolution",
    activityFeed: "Live Municipal Field Updates",
    instantTrackerTitle: "Instant Grievance Tracker",
    instantTrackerSub: "Track any complaint in real time across municipal departments",
    instantTrackerPlaceholder: "Enter Reference ID (e.g. JAN-2026-849102)",
    trackBtn: "Track Complaint",
    welcomeDossierTitle: "Citizen Digital Dossier",
    verifiedResident: "Verified Citizen Resident",
    jurisdictionLabel: "Municipal Jurisdiction",
    allIndiaJurisdiction: "All Districts & Municipal Corporations",
    sec1Kicker: "01 / LODGE CIVIC COMPLAINT",
    sec1Title: "Start with your problem",
    viewAll: "View all categories",
    aiStripKicker: "JANSETU ASSISTANCE",
    aiStripTitle: "Need guidance with government paperwork?",
    aiStripDesc: "Describe your issue or welfare query naturally. Our co-pilot maps you directly to the correct department, documents, and official portals.",
    aiStripBtn: "Open Civic Co-Pilot",
    sec2Kicker: "02 / DISCOVER",
    sec2Title: "Benefits you may be missing",
    exploreAllSchemes: "Explore all schemes",
    checkEligibility: "Check eligibility",
    howToApply: "How to Apply",
    account: "Account",
    signOut: "Sign Out",
    googleVerified: "Google Verified",
    guestMode: "Guest Mode",
    welcomeIn: "YOU'RE IN",
    welcomeNamaste: "Namaste,",
    welcomeDesc: "Your civic journey starts here. JanSetuAI helps you understand government services, report local issues and discover benefits — without the confusing language.",
    welcomeEnter: "Enter JanSetuAI",
    reportIssueTitle: "REPORT AN ISSUE",
    reportHead1: "Let's get it to the right desk.",
    reportHeadDone: "Issue Successfully Logged.",
    reportSub1: "JanSetuAI guides you through a clear, transparent 3-step complaint flow.",
    reportSubDone: "Your complaint is officially registered with the municipal authorities. A field officer has been notified.",
    step1: "1. Issue",
    step2: "2. Details",
    step3: "3. Review",
    step4: "4. Confirmed",
    whatIsIssue: "What is the issue?",
    continueBtn: "Continue",
    tellMore: "Tell us a little more",
    locationLabel: "Location / Landmark",
    locationPlaceholder: "Area, landmark or locality (e.g. Near Bus Stand, Ward 7)",
    descLabel: "Description",
    descPlaceholder: "Describe the issue in your own words (e.g. Water pipe leaking since 2 days, flooding the footpath)...",
    photoLabel: "Photo Evidence (Optional)",
    addPhotoTitle: "Add a photo",
    addPhotoSub: "Click to browse or drag and drop (JPG, PNG, WebP)",
    chooseFile: "Choose file",
    photoAttached: "Attached",
    remove: "Remove",
    backBtn: "Back",
    reviewReportBtn: "Review Report",
    reviewTitle: "Review your grievance report",
    reviewSub: "Please verify the information below before lodging it with the official municipal registry.",
    categoryLabel: "Category",
    targetDeptLabel: "Target Department",
    evidenceLabel: "Photo Attachment",
    confirmSubmitBtn: "Confirm & Submit Complaint",
    registeringBtn: "Registering Issue...",
    submittedKicker: "OFFICIAL CIVIC ACKNOWLEDGEMENT",
    submittedH2: "Issue Submitted Successfully!",
    submittedLead: "Your grievance has been logged into the municipal registry. A work order has been generated and dispatched to the field inspection squad.",
    trackingRefLabel: "Grievance Tracking Reference",
    copyBtn: "Copy",
    copiedBtn: "Copied!",
    timestampLabel: "Submission Timestamp",
    todayTime: "Today,",
    deptLabel: "Assigned Department",
    slaLabel: "Target SLA Resolution",
    slaVal: "Within 24–48 working hours",
    pipelineTitle: "Department Action Pipeline",
    stepRegistered: "1. Registered",
    stepRouted: "2. Routed to Dept",
    stepInspection: "3. Field Inspection",
    stepResolved: "4. Resolved",
    updateNoticeTitle: "We will keep you updated!",
    updateNoticeDesc: "Real-time SMS and WhatsApp progress updates will be sent to your registered phone as municipal officers inspect and resolve this issue.",
    reportAnotherBtn: "Report Another Issue",
    returnHomeBtn: "Return to Home",
    schemesPageKicker: "DISCOVER BENEFITS & WELFARE",
    schemesPageTitle: "Find schemes made for you.",
    schemesPageDesc: "Explore verified central and state welfare programmes with interactive eligibility calculators, document checklists, and direct links to official government portals.",
    schemesSearchPlaceholder: "Search by scheme name, benefit, or keyword (e.g. loan, health, farmer, subsidy)...",
    showingSchemes: "Showing",
    schemesCountLabel: "government schemes",
    keyBenefitLabel: "Key Citizen Benefit",
    askAiAssistant: "Ask AI Assistant",
    eligibilityCheckerTab: "Eligibility Checker",
    docsAndApplyTab: "Documents & How to Apply",
    checkCriteriaTitle: "Check your eligibility criteria:",
    checkCriteriaDesc: "Tick each condition below to verify if your household qualifies:",
    eligibleNotice: "You are eligible for",
    eligibleNoticeSub: "You satisfy all primary criteria. Click 'Documents & How to Apply' to initiate your application.",
    partialNotice: "criteria satisfied.",
    partialNoticeSub: "Tick remaining checkboxes or consult JanSetu AI if you need clarification on your documents.",
    requiredDocsTitle: "Required Documents:",
    stepsTitle: "Step-by-Step Application Process:",
    openOfficialPortal: "Open Official Portal",
    verifiedPortal: "Verified official government portal:",
    docsPageKicker: "CITIZEN CERTIFICATES & DOCUMENTS",
    docsPageTitle: "Government certificates, made straightforward.",
    docsPageDesc: "Know exactly which documents you need, the official issuing office, processing fees, and SLA delivery timelines before applying.",
    helpTitle: "Your civic co-pilot.",
    helpDesc: "Ask in natural language or tap the microphone to speak. JanSetuAI guides you to the right department, documents and civic steps.",
    helpPlaceholder: "Ask or speak: “How do I report a water leak?” or “PM-KISAN eligibility”",
    loginWelcome: "WELCOME TO JANSETUAI",
    loginTitle1: "Your bridge to",
    loginTitle2: "better services.",
    loginDesc: "One simple login to access civic assistance, issue reporting and personalised government-service guidance.",
    loginGoogle: "Continue with Google",
    loginGuest: "Continue as Guest",
    loginPrivacy: "Fast & secure Google authentication. Real credentials or demo accounts supported.",
    loginTagline: "Built for citizens of India • Secure • Simple • Multilingual",
    chatGreeting: "Namaste! I’m JanSetuAI. Tell me your problem or tap a suggestion below — I’ll guide you to the right department.",
    helplineTitle: "Emergency & Citizen Helplines",
    rateExperience: "Rate your grievance filing experience:",
    themeDark: "Dark Mode",
    themeLight: "Light Mode",
    settingsTitle: "Citizen & Portal Settings",
    settingsSub: "Manage your notification preferences, municipal ward, and appearance",
    smsAlertsLabel: "SMS & WhatsApp Updates",
    smsAlertsDesc: "Receive automated municipal resolution alerts on your mobile phone",
    phoneLabel: "Registered Mobile Number",
    wardLabel: "Municipal Ward / Jurisdiction",
    saveSettings: "Save Settings",
    advanceSimulation: "Advance Stage (Simulate Field Work)",
    downloadReceipt: "Print / Save PDF Receipt",
    sendTestAlert: "Send Test SMS / WhatsApp Update"
  },
  हिन्दी: {
    brandTag: "राष्ट्रीय नागरिक सेवा मंच • भारत सरकार सहयोग",
    navHome: "होम",
    navReport: "समस्या दर्ज करें",
    navMyGrievances: "मेरी शिकायतें",
    navSchemes: "सरकारी योजनाएं",
    navDocs: "प्रमाण पत्र",
    navHelp: "नागरिक सहायक",
    myGrievancesTitle: "मेरी पंजीकृत शिकायतें",
    myGrievancesSub: "स्थायी नागरिक शिकायत डेटाबेस • रीयल-टाइम विभागीय प्रगति और रेफरेंस नंबर",
    noGrievancesYet: "अभी कोई शिकायत दर्ज नहीं है",
    noGrievancesDesc: "सड़क, पानी, कचरा अथवा स्ट्रीट लाइट से संबंधित जो भी शिकायत आप दर्ज करेंगे, वह रीयल-टाइम प्रगति के साथ यहाँ सुरक्षित रहेगी।",
    filterAll: "सभी शिकायतें",
    filterActive: "प्रगति पर",
    filterResolved: "समाधान संपन्न",
    viewDossier: "ट्रैकिंग विवरण देखें",
    withdrawGrievance: "शिकायत हटाएं",
    viewInMyGrievances: "मेरी शिकायतों में देखें",
    civicStatus: "नागरिक नेटवर्क सक्रिय",
    heroEyebrow: "डिजिटल पब्लिक इंफ्रास्ट्रक्चर • नागरिक शिकायत निवारण एवं जनकल्याण",
    heroTitle1: "नागरिक समस्या निवारण",
    heroTitle2: "एवं कल्याण मंच।",
    heroDesc: "नगरपालिका और सरकारी विभागों में सीधे शिकायत दर्ज करें, 50+ जनकल्याणकारी योजनाओं की पात्रता जांचें और आवश्यक राजस्व प्रमाण पत्र बिना किसी बिचौलिए के प्राप्त करें।",
    searchPlaceholder: "नागरिक सेवा या समस्या खोजें जैसे- गड्ढा, पानी का रिसाव, आय प्रमाण पत्र, पीएम योजनाएं...",
    tryLabel: "सीधी सेवाएं:",
    tryWater: "पानी की शिकायत",
    tryCert: "आय प्रमाण पत्र",
    tryPothole: "सड़क और गड्ढे",
    trySchemes: "केंद्रीय योजनाएं (50+)",
    trustCitizen: "समयबद्ध विभागीय समाधान",
    trustMultilingual: "22 आधिकारिक भाषाएं",
    trustAi: "डिजिलॉकर एकीकृत",
    cardWaterTitle: "पानी की समस्या",
    cardWaterSub: "जल बोर्ड शिकायत (30s)",
    cardCertTitle: "प्रमाण पत्र",
    cardCertSub: "6 आवश्यक दस्तावेज़ देखें",
    civicAiTitle: "जनसेतु",
    civicAiSub: "नागरिक हेल्पडेस्क",
    consoleDeskTitle: "नगरपालिका शिकायत एवं समाधान डेस्क",
    consoleLive: "लाइव एकीकरण",
    metricResolved: "१८,४५०+",
    metricResolvedLabel: "निस्तारित समस्याएं",
    metricSla: "९८.२%",
    metricSlaLabel: "समयबद्ध निस्तारण",
    metricAvg: "२४-४८ घंटे",
    metricAvgLabel: "औसत समाधान समय",
    activityFeed: "नगरपालिका स्थल समाधान अपडेट",
    instantTrackerTitle: "शिकायत की स्थिति जांचें",
    instantTrackerSub: "नगरपालिका विभागों में किसी भी शिकायत की रीयल-टाइम प्रगति देखें",
    instantTrackerPlaceholder: "शिकायत नंबर दर्ज करें (उदा. JAN-2026-849102)",
    trackBtn: "स्थिति देखें",
    welcomeDossierTitle: "डिजिटल नागरिक प्रोफ़ाइल",
    verifiedResident: "सत्यापित भारतीय नागरिक",
    jurisdictionLabel: "अधिकार क्षेत्र",
    allIndiaJurisdiction: "समस्त जिले एवं नगर निगम",
    sec1Kicker: "01 / शिकायत दर्ज करें",
    sec1Title: "अपनी समस्या चुनें",
    viewAll: "सभी श्रेणियां देखें",
    aiStripKicker: "जनसेतु नागरिक सहायता",
    aiStripTitle: "सरकारी प्रक्रियाओं या कागजी कार्रवाई में मार्गदर्शन चाहिए?",
    aiStripDesc: "अपनी समस्या को अपनी भाषा में बताएं। हमारा सहायक आपको सही विभाग, आवश्यक दस्तावेज़ और आधिकारिक पोर्टल तक सीधे पहुंचाएगा।",
    aiStripBtn: "नागरिक सहायक खोलें",
    sec2Kicker: "02 / खोजें",
    sec2Title: "जनकल्याणकारी सरकारी योजनाएं",
    exploreAllSchemes: "सभी योजनाएं देखें",
    checkEligibility: "पात्रता जांचें",
    howToApply: "आवेदन प्रक्रिया",
    account: "खाता",
    signOut: "साइन आउट",
    googleVerified: "Google सत्यापित",
    guestMode: "अतिथि मोड",
    welcomeIn: "स्वागत है",
    welcomeNamaste: "नमस्ते,",
    welcomeDesc: "आपकी नागरिक यात्रा यहाँ से शुरू होती है। जनसेतु एआई आपको सरकारी सेवाओं को समझने, समस्याओं की रिपोर्ट करने और योजनाओं का लाभ उठाने में मदद करता है।",
    welcomeEnter: "जनसेतु में प्रवेश करें",
    reportIssueTitle: "समस्या दर्ज करें",
    reportHead1: "शिकायत को सही विभाग तक पहुंचाएं।",
    reportHeadDone: "शिकायत सफलतापूर्वक दर्ज हो गई।",
    reportSub1: "जनसेतु एआई आपको 3 आसान चरणों में शिकायत दर्ज करने में मार्गदर्शन करता है।",
    reportSubDone: "आपकी शिकायत आधिकारिक तौर पर नगरपालिका में दर्ज हो चुकी है। फील्ड अधिकारी को सूचित किया गया है।",
    step1: "1. समस्या",
    step2: "2. विवरण",
    step3: "3. समीक्षा",
    step4: "4. पुष्टि",
    whatIsIssue: "आपकी समस्या क्या है?",
    continueBtn: "आगे बढ़ें",
    tellMore: "समस्या का विवरण दें",
    locationLabel: "स्थान / पता / लैंडमार्क",
    locationPlaceholder: "क्षेत्र, लैंडमार्क या मोहल्ला (उदा. बस स्टैंड के पास, वार्ड 7)",
    descLabel: "समस्या का विवरण",
    descPlaceholder: "अपनी समस्या को अपने शब्दों में लिखें (उदा. 2 दिन से पानी की पाइपलाइन टूटी है और पानी बह रहा है)...",
    photoLabel: "फोटो प्रमाण (वैकल्पिक)",
    addPhotoTitle: "फोटो जोड़ें",
    addPhotoSub: "ब्राउज़ करने के लिए क्लिक करें या ड्रैग-ड्रॉप करें (JPG, PNG, WebP)",
    chooseFile: "फ़ाइल चुनें",
    photoAttached: "संलग्न",
    remove: "हटाएं",
    backBtn: "वापस",
    reviewReportBtn: "विवरण की समीक्षा करें",
    reviewTitle: "अपनी शिकायत की समीक्षा करें",
    reviewSub: "आधिकारिक सरकारी रजिस्ट्री में जमा करने से पहले कृपया विवरण की पुष्टि करें।",
    categoryLabel: "समस्या श्रेणी",
    targetDeptLabel: "संबंधित विभाग",
    evidenceLabel: "फोटो प्रमाण",
    confirmSubmitBtn: "शिकायत सबमिट करें",
    registeringBtn: "दर्ज की जा रही है...",
    submittedKicker: "आधिकारिक नागरिक पावती",
    submittedH2: "शिकायत सफलतापूर्वक दर्ज हुई!",
    submittedLead: "आपकी शिकायत केंद्रीय नगरपालिका रजिस्ट्री में दर्ज कर ली गई है। कार्य आदेश जारी कर फील्ड निरीक्षण टीम को भेज दिया गया है।",
    trackingRefLabel: "शिकायत ट्रैकिंग नंबर (रेफरेंस ID)",
    copyBtn: "कॉपी",
    copiedBtn: "कॉपी हो गया!",
    timestampLabel: "दर्ज करने का समय",
    todayTime: "आज,",
    deptLabel: "आवंटित विभाग",
    slaLabel: "समाधान समय सीमा",
    slaVal: "24 से 48 कार्य घंटों के भीतर",
    pipelineTitle: "विभागीय कार्रवाई प्रगति",
    stepRegistered: "1. पंजीकृत",
    stepRouted: "2. विभाग को भेजा",
    stepInspection: "3. स्थल निरीक्षण",
    stepResolved: "4. समाधान",
    updateNoticeTitle: "हम आपको अपडेट रखेंगे!",
    updateNoticeDesc: "जैसे ही नगरपालिका अधिकारी स्थल का निरीक्षण और मरम्मत कार्य शुरू करेंगे, आपको पंजीकृत मोबाइल पर एसएमएस और व्हाट्सएप के माध्यम से रीयल-टाइम अपडेट प्राप्त होंगे।",
    reportAnotherBtn: "दूसरी समस्या दर्ज करें",
    returnHomeBtn: "मुख्य पृष्ठ पर जाएं",
    schemesPageKicker: "जनकल्याणकारी योजनाएं एवं लाभ",
    schemesPageTitle: "अपने लिए उपयुक्त सरकारी योजनाएं खोजें।",
    schemesPageDesc: "पात्रता कैलकुलेटर, दस्तावेज़ सूची और आधिकारिक सरकारी पोर्टल लिंक के साथ केंद्र व राज्य की प्रमुख कल्याणकारी योजनाओं की जानकारी प्राप्त करें।",
    schemesSearchPlaceholder: "योजना का नाम, लाभ या कीवर्ड खोजें (जैसे- ऋण, स्वास्थ्य, किसान, आवास)...",
    showingSchemes: "प्रदर्शित",
    schemesCountLabel: "सरकारी योजनाएं",
    keyBenefitLabel: "मुख्य नागरिक लाभ",
    askAiAssistant: "एआई से पूछें",
    eligibilityCheckerTab: "पात्रता कैलकुलेटर",
    docsAndApplyTab: "दस्तावेज़ एवं आवेदन प्रक्रिया",
    checkCriteriaTitle: "अपनी पात्रता शर्तें जांचें:",
    checkCriteriaDesc: "यह देखने के लिए कि आपका परिवार पात्र है या नहीं, नीचे दिए गए बॉक्स पर टिक करें:",
    eligibleNotice: "आप इस योजना के लिए पात्र हैं!",
    eligibleNoticeSub: "आप सभी प्राथमिक शर्तें पूरी करते हैं। आवेदन शुरू करने के लिए 'दस्तावेज़ एवं आवेदन प्रक्रिया' पर क्लिक करें।",
    partialNotice: "शर्तें पूरी हुईं।",
    partialNoticeSub: "बाकी शर्तें जांचें या किसी भी दस्तावेज़ की स्पष्टता के लिए जनसेतु एआई से पूछें।",
    requiredDocsTitle: "आवश्यक दस्तावेज़:",
    stepsTitle: "चरणबद्ध आवेदन प्रक्रिया:",
    openOfficialPortal: "आधिकारिक पोर्टल खोलें",
    verifiedPortal: "सत्यापित आधिकारिक सरकारी पोर्टल:",
    docsPageKicker: "नागरिक प्रमाण पत्र एवं दस्तावेज़",
    docsPageTitle: "सरकारी प्रमाण पत्र, अब सरल और सुगम।",
    docsPageDesc: "आवश्यक दस्तावेज़, संबंधित तहसील या नगर निगम कार्यालय, सरकारी शुल्क और डिलीवरी की समय सीमा की पूरी जानकारी।",
    helpTitle: "आपका नागरिक एआई सहायक।",
    helpDesc: "अपनी मातृभाषा में लिखें या बोलें। जनसेतु एआई आपको उचित विभाग, प्रक्रिया और सटीक समाधान बताएगा।",
    helpPlaceholder: "पूछें या बोलें: “सड़क के गड्ढे की शिकायत कैसे करें?” या “पीएम किसान की पात्रता”",
    loginWelcome: "जनसेतु एआई में आपका स्वागत है",
    loginTitle1: "सुगम नागरिक सेवाओं का",
    loginTitle2: "डिजिटल सेतु।",
    loginDesc: "नागरिक सहायता, समस्या निवारण और सरकारी योजनाओं के मार्गदर्शन के लिए एक सरल लॉगिन।",
    loginGoogle: "Google से आगे बढ़ें",
    loginGuest: "अतिथि के रूप में जारी रखें",
    loginPrivacy: "सुरक्षित व त्वरित Google प्रमाणीकरण। नागरिक डेटा पूर्णतः सुरक्षित।",
    loginTagline: "भारत के नागरिकों के लिए समर्पित • सुरक्षित • सरल • बहुभाषी",
    chatGreeting: "नमस्ते! मैं जनसेतु एआई हूँ। मुझे अपनी समस्या बताएं या नीचे किसी विकल्प पर टैप करें — मैं आपको सही सरकारी विभाग और समाधान बताऊंगा।",
    helplineTitle: "आपातकालीन एवं नागरिक हेल्पलाइन",
    rateExperience: "शिकायत दर्ज करने के अनुभव को रेट करें:",
    themeDark: "डार्क मोड",
    themeLight: "लाइट मोड",
    settingsTitle: "नागरिक एवं पोर्टल सेटिंग्स",
    settingsSub: "अपनी सूचना प्राथमिकताएं, नगर निगम वार्ड और थीम प्रबंधित करें",
    smsAlertsLabel: "एसएमएस और व्हाट्सएप अपडेट",
    smsAlertsDesc: "अपने पंजीकृत मोबाइल पर नगरपालिका कार्य प्रगति के संदेश प्राप्त करें",
    phoneLabel: "पंजीकृत मोबाइल नंबर",
    wardLabel: "नगर निगम वार्ड / क्षेत्र",
    saveSettings: "सेटिंग्स सहेजें",
    advanceSimulation: "अगला चरण (स्थल कार्य सिमुलेशन)",
    downloadReceipt: "पावती रसीद प्रिंट / डाउनलोड करें",
    sendTestAlert: "टेस्ट एसएमएस / व्हाट्सएप अलर्ट भेजें"
  }
};

const getIssueIcon = (id, size = 20) => {
  switch (id) {
    case "water": return <Droplets size={size} />;
    case "roads": return <Route size={size} />;
    case "waste": return <Trash2 size={size} />;
    case "streetlight": return <Lightbulb size={size} />;
    case "documents": return <FileText size={size} />;
    case "benefits": return <HandHeart size={size} />;
    default: return <AlertTriangle size={size} />;
  }
};

const getSchemeIcon = (id, size = 22) => {
  switch (id) {
    case "pmkisan": return <Sprout size={size} />;
    case "pmjay":
    case "ayushman": return <HeartPulse size={size} />;
    case "pmay": return <Home size={size} />;
    case "mudra": return <Briefcase size={size} />;
    case "ssy": return <UserCheck size={size} />;
    case "vishwakarma": return <Wrench size={size} />;
    case "skillindia": return <GraduationCap size={size} />;
    case "startupindia": return <Lightbulb size={size} />;
    default: return <ShieldCheck size={size} />;
  }
};

const issues = [
  {
    id: "water",
    color: "cyan",
    en: { title: "Water Supply", desc: "Report leaks, low pressure, contamination, or water supply interruptions." },
    hi: { title: "जल आपूर्ति", desc: "पानी का रिसाव, कम दबाव, गंदा पानी या पानी न आने की शिकायत करें।" }
  },
  {
    id: "roads",
    color: "amber",
    en: { title: "Roads & Potholes", desc: "Report damaged roads, potholes, broken pavements, and unsafe streets." },
    hi: { title: "सड़क और गड्ढे", desc: "टूटी सड़कें, खतरनाक गड्ढे, टूटे फुटपाथ और असुरक्षित रास्तों की शिकायत करें।" }
  },
  {
    id: "waste",
    color: "green",
    en: { title: "Waste Management", desc: "Report missed garbage collection, overflowing dumpsters, or open dumps." },
    hi: { title: "कचरा प्रबंधन", desc: "कचरा न उठने, भरे हुए कूड़ेदान या सड़क किनारे गंदगी की सूचना दें।" }
  },
  {
    id: "streetlight",
    color: "violet",
    en: { title: "Street Lights", desc: "Report non-functional, broken or dark street lighting in your locality." },
    hi: { title: "स्ट्रीट लाइट", desc: "खराब, बंद, टूटी या झिलमिलाती स्ट्रीट लाइट की शिकायत करें।" }
  },
  {
    id: "documents",
    color: "pink",
    en: { title: "Documents & Certificates", desc: "Income, caste, domicile, birth certificates and citizen revenue services." },
    hi: { title: "दस्तावेज़ और प्रमाण पत्र", desc: "आय, जाति, निवास, जन्म प्रमाण पत्र व सरकारी दस्तावेज़ सेवाएं।" }
  },
  {
    id: "benefits",
    color: "blue",
    en: { title: "Schemes & Welfare", desc: "PM-KISAN, Ayushman Bharat, PMAY housing, loans, and financial aid." },
    hi: { title: "योजनाएं और लाभ", desc: "पीएम-किसान, आयुष्मान भारत, आवास योजना, मुद्रा ऋण व जनकल्याण योजनाएं।" }
  }
];

const documentsData = [
  {
    id: "income",
    title: "Income Certificate (आय प्रमाण पत्र)",
    dept: "Revenue Department / Tehsil Office",
    deptHi: "राजस्व विभाग / तहसील कार्यालय",
    sla: "7 to 15 Working Days",
    slaHi: "7 से 15 कार्य दिवस",
    fee: "₹0 to ₹30",
    desc: "Mandatory for scholarships, fee concessions, government welfare schemes, and EWS quota.",
    descHi: "छात्रवृत्ति, शुल्क छूट, सरकारी कल्याणकारी योजनाओं और ईडब्ल्यूएस कोटे के लिए अनिवार्य।",
    documents: ["Aadhaar Card", "Ration Card", "Salary Slip or Income Affidavit", "Electricity Bill", "Passport Photo"],
    portalUrl: "https://serviceonline.gov.in",
    portalName: "serviceonline.gov.in"
  },
  {
    id: "caste",
    title: "Caste Certificate (जाति प्रमाण पत्र)",
    dept: "Sub-Divisional Magistrate (SDM) / Tehsildar",
    deptHi: "उप-विभागीय मजिस्ट्रेट (SDM) / तहसीलदार",
    sla: "15 to 21 Working Days",
    slaHi: "15 से 21 कार्य दिवस",
    fee: "₹0 to ₹30",
    desc: "Official certification of SC / ST / OBC category for reserved admissions, jobs, and government subsidies.",
    descHi: "आरक्षित दाखिलों, सरकारी नौकरियों और छात्रवृत्तियों हेतु एससी/एसटी/ओबीसी प्रमाण पत्र।",
    documents: ["Aadhaar Card", "Father's Caste Certificate / Lineage Proof", "Ration Card", "School Transfer Certificate"],
    portalUrl: "https://serviceonline.gov.in",
    portalName: "serviceonline.gov.in"
  },
  {
    id: "domicile",
    title: "Domicile / Residence (निवास प्रमाण पत्र)",
    dept: "Tehsildar / District Magistrate",
    deptHi: "तहसीलदार / जिला मजिस्ट्रेट",
    sla: "7 to 14 Working Days",
    slaHi: "7 से 14 कार्य दिवस",
    fee: "₹0 to ₹30",
    desc: "Proof of permanent residence in the state, required for state admissions, scholarships, and state govt jobs.",
    descHi: "राज्य में स्थायी निवास का कानूनी प्रमाण, जो राज्य स्तरीय प्रवेश और सरकारी नौकरियों के लिए आवश्यक है।",
    documents: ["Aadhaar Card", "Electricity or Water Bill (last 3 years)", "Land ownership or Rent deed", "Voter ID / Ration Card"],
    portalUrl: "https://serviceonline.gov.in",
    portalName: "serviceonline.gov.in"
  },
  {
    id: "birth",
    title: "Birth Certificate (जन्म प्रमाण पत्र)",
    dept: "Municipal Corporation / Registrar of Births & Deaths",
    deptHi: "नगर निगम / जन्म एवं मृत्यु पंजीयक कार्यालय",
    sla: "5 to 7 Working Days",
    slaHi: "5 से 7 कार्य दिवस",
    fee: "₹0 to ₹20",
    desc: "Primary legal identity record required for school admissions, Passport, PAN Card, and Voter registration.",
    descHi: "स्कूल प्रवेश, पासपोर्ट, पैन कार्ड और मतदाता पहचान पत्र के लिए अनिवार्य पहचान दस्तावेज़।",
    documents: ["Hospital Discharge Summary / Birth Slip", "Parents' Aadhaar Cards", "Marriage Certificate (if applicable)"],
    portalUrl: "https://crsorgi.gov.in",
    portalName: "crsorgi.gov.in"
  },
  {
    id: "ration",
    title: "Ration Card / Food Security (राशन कार्ड)",
    dept: "Food & Civil Supplies Department",
    deptHi: "खाद्य एवं नागरिक आपूर्ति विभाग",
    sla: "15 to 30 Working Days",
    slaHi: "15 से 30 कार्य दिवस",
    fee: "₹0 to ₹25",
    desc: "Provides subsidized or free food grains under National Food Security Act (NFSA) & Ayushman eligibility.",
    descHi: "राष्ट्रीय खाद्य सुरक्षा अधिनियम (NFSA) के तहत निःशुल्क राशन व आयुष्मान कार्ड पात्रता हेतु।",
    documents: ["Aadhaar Cards of all family members", "Income Proof", "LPG connection book", "Bank Passbook of family head"],
    portalUrl: "https://nfsa.gov.in",
    portalName: "nfsa.gov.in"
  },
  {
    id: "ews",
    title: "EWS Certificate (आर्थिक रूप से कमजोर वर्ग)",
    dept: "District Magistrate / SDM / Tehsildar",
    deptHi: "जिला मजिस्ट्रेट / SDM / तहसीलदार",
    sla: "14 to 21 Working Days",
    slaHi: "14 से 21 कार्य दिवस",
    fee: "₹0 to ₹50",
    desc: "Grants 10% reservation in central/state educational institutions and recruitments for general category citizens.",
    descHi: "सामान्य वर्ग के आर्थिक रूप से कमजोर नागरिकों के लिए 10% आरक्षण प्रमाण पत्र।",
    documents: ["Aadhaar Card", "Family Annual Income Certificate (<₹8 Lakh)", "Land / Residential Flat Proof", "PAN Card"],
    portalUrl: "https://services.india.gov.in",
    portalName: "services.india.gov.in"
  }
];

const helplinesData = [
  { name: "National Emergency", number: "112", tag: "Police / Fire / Ambulance" },
  { name: "Municipal Grievance", number: "1913", tag: "Civic Complaints" },
  { name: "Electricity Faults", number: "1912", tag: "Power Breakdown" },
  { name: "Health Helpline", number: "1075", tag: "Medical & Ayushman" },
  { name: "Women Helpline", number: "181", tag: "Safety & Support" },
  { name: "Cyber Crime", number: "1930", tag: "Fraud & Safety" }
];

const schemeData = [
  {
    id: "pmkisan",
    name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    tag: "Farmers",
    tagHi: "किसान",
    benefit: "₹6,000 / year (Direct Bank Transfer)",
    benefitHi: "₹6,000 / वर्ष (सीधे बैंक खाते में)",
    ministry: "Ministry of Agriculture & Farmers Welfare",
    shortDesc: "Direct income support of ₹6,000 per year paid in three equal 4-monthly installments.",
    shortDescHi: "किसान परिवारों को प्रति वर्ष ₹6,000 की प्रत्यक्ष आर्थिक सहायता तीन किस्तों में।",
    fullDesc: "Central sector scheme that provides financial assistance to all landholding farmer families across the country to meet agricultural inputs and domestic expenses.",
    criteria: [
      "Small and marginal landholding farmer family with cultivable land in applicant's name",
      "Valid Aadhaar card linked with active bank account (DBT enabled)",
      "Applicant is not an institutional landholder or high-income taxpayer",
      "Family does not hold constitutional posts or retired government employment"
    ],
    documents: [
      "Aadhaar Card",
      "Land Ownership Documents (Khasra / Khatauni / RoR)",
      "Aadhaar-seeded Bank Passbook",
      "Active Mobile Number"
    ],
    steps: [
      "Visit pmkisan.gov.in and click on 'New Farmer Registration' or visit your local CSC center.",
      "Enter your Aadhaar number, select your State, and verify with OTP.",
      "Fill in land survey number, Khasra/Khata details, and bank account info.",
      "State Nodal Officers verify land records; upon approval, ₹2,000 is sent directly to your bank every 4 months."
    ],
    portalUrl: "https://pmkisan.gov.in",
    portalName: "pmkisan.gov.in"
  },
  {
    id: "pmjay",
    name: "Ayushman Bharat (PM-JAY)",
    tag: "Healthcare",
    tagHi: "स्वास्थ्य",
    benefit: "₹5,00,000 / family / year (Cashless)",
    benefitHi: "₹5,00,000 / परिवार / वर्ष (मुफ़्त उपचार)",
    ministry: "National Health Authority (NHA)",
    shortDesc: "Cashless health insurance coverage up to ₹5 Lakh per eligible family per year.",
    shortDescHi: "प्रति वर्ष प्रति पात्र परिवार को ₹5 लाख तक का कैशलेस स्वास्थ्य बीमा कवर।",
    fullDesc: "The world's largest government-sponsored health assurance scheme, providing free secondary and tertiary care hospitalization across 28,000+ public and private empanelled hospitals.",
    criteria: [
      "Family identified under SECC 2011 database or state food security ration lists",
      "Belongs to rural deprivation categories (D1-D7) or recognized urban worker occupations",
      "Holds valid Ration card or Ayushman family authorization letter",
      "No cap on family size, age, or gender"
    ],
    documents: [
      "Aadhaar Card of all family members",
      "Ration Card or PM-JAY Family Letter",
      "Active Mobile Number for e-KYC"
    ],
    steps: [
      "Check your eligibility at mera.pmjay.gov.in or visit any nearest Ayushman Arogya Mandir / empanelled hospital.",
      "Approach the Ayushman Mitra helpdesk at the hospital.",
      "Provide your Aadhaar or Ration card to complete biometric e-KYC.",
      "Receive your Ayushman Golden Card and access 100% cashless medical treatments."
    ],
    portalUrl: "https://pmjay.gov.in",
    portalName: "pmjay.gov.in"
  },
  {
    id: "pmay",
    name: "PM Awas Yojana (PMAY)",
    tag: "Housing",
    tagHi: "आवास",
    benefit: "Up to ₹2.67 Lakh Subsidy / Pucca House",
    benefitHi: "₹2.67 लाख तक की सब्सिडी / पक्का मकान",
    ministry: "Ministry of Housing & Urban Affairs / MoRD",
    shortDesc: "Financial assistance and credit subsidies to build or purchase your first permanent pucca house.",
    shortDescHi: "अपना पहला पक्का घर बनाने या खरीदने के लिए वित्तीय सहायता और गृह ऋण पर सब्सिडी।",
    fullDesc: "A flagship mission addressing housing shortage among EWS, LIG, and rural poor households by providing direct grants and interest subsidies on home loans.",
    criteria: [
      "Beneficiary family must not own a pucca (permanent) house anywhere in India",
      "Annual family household income matches EWS (<₹3 Lakh) or LIG (₹3-6 Lakh) brackets",
      "Female family member must be the owner or co-owner of the property (Urban)",
      "Applicant must not have availed central assistance under any housing scheme earlier"
    ],
    documents: [
      "Aadhaar Cards of all adult family members",
      "Income Certificate / Salary Slip / ITR",
      "Bank Account Statement (last 6 months)",
      "Land Ownership papers or Builder Agreement"
    ],
    steps: [
      "Apply online on pmaymis.gov.in (Citizen Assessment) or via Common Service Center (CSC).",
      "Fill in personal, income, and existing housing details.",
      "Municipal council or Gram Panchayat conducts physical survey & geotagging.",
      "Approved funds or credit interest subsidy are credited directly to your bank account in construction milestones."
    ],
    portalUrl: "https://pmaymis.gov.in",
    portalName: "pmaymis.gov.in"
  },
  {
    id: "mudra",
    name: "PM Mudra Yojana (PMMY)",
    tag: "Business",
    tagHi: "व्यवसाय",
    benefit: "Loans up to ₹10 Lakh (No Collateral)",
    benefitHi: "₹10 लाख तक का ऋण (बिना किसी गारंटी)",
    ministry: "Ministry of Finance",
    shortDesc: "Collateral-free business loans up to ₹10 Lakh for micro enterprises, traders, and artisans.",
    shortDescHi: "छोटे व्यवसायियों, दुकानदारों और कारीगरों के लिए ₹10 लाख तक का बिना गारंटी व्यापारिक ऋण।",
    fullDesc: "Provides non-corporate, non-farm small and micro enterprises with credit up to ₹10 Lakh through banks and MFIs across Shishu (up to ₹50k), Kishore (₹50k-5L), and Tarun (₹5L-10L) categories.",
    criteria: [
      "Any Indian citizen running or proposing an income-generating non-farm business",
      "Includes small manufacturing units, retail shops, food vendors, artisans, and transport operators",
      "Applicant must not be a defaulter with any financial institution",
      "Valid business plan and quotation for machinery or stock"
    ],
    documents: [
      "Aadhaar Card and PAN Card",
      "Business Address Proof & Trade License (if applicable)",
      "Last 6 months Bank Statement",
      "Projected business plan or machinery quotation"
    ],
    steps: [
      "Select your loan category (Shishu, Kishore, or Tarun) based on capital needs.",
      "Apply online at udyamimitra.in or visit any commercial bank / regional rural bank.",
      "Submit application form with KYC, business proposal, and machinery quotation.",
      "Bank evaluates and disburses loan directly with a Mudra RuPay debit card."
    ],
    portalUrl: "https://www.mudra.org.in",
    portalName: "mudra.org.in"
  },
  {
    id: "ssy",
    name: "Sukanya Samriddhi Yojana (SSY)",
    tag: "Women & Child",
    tagHi: "महिला एवं बाल",
    benefit: "8.2% Interest p.a. + 100% Tax Free",
    benefitHi: "8.2% ब्याज दर + पूर्णतः कर-मुक्त",
    ministry: "Ministry of Finance / Dept. of Posts",
    shortDesc: "High-interest savings account for girl children under Beti Bachao Beti Padhao.",
    shortDescHi: "बेटी बचाओ बेटी पढ़ाओ के तहत बेटियों की उच्च शिक्षा व भविष्य हेतु सर्वोत्तम ब्याज दर।",
    fullDesc: "A small-deposit government-backed savings scheme designed exclusively for parents of girl children, offering highest sovereign interest rates and triple tax exemptions (EEE status).",
    criteria: [
      "Girl child must be an Indian citizen under 10 years of age at account opening",
      "Only one account permitted per girl child (maximum 2 accounts per family)",
      "Opened by biological parents or legal guardians",
      "Minimum annual deposit of ₹250 (up to ₹1,50,000 per financial year)"
    ],
    documents: [
      "Birth Certificate of the girl child",
      "Guardian's Identity Proof (Aadhaar / PAN Card)",
      "Guardian's Address Proof",
      "Recent passport-sized photographs"
    ],
    steps: [
      "Collect SSY Account Opening Form (SSA-1) from any Post Office or authorized bank.",
      "Attach girl child's birth certificate and guardian KYC documents.",
      "Make initial deposit (minimum ₹250) in cash, cheque, or demand draft.",
      "Collect passbook to deposit money and track compound growth till child turns 21."
    ],
    portalUrl: "https://www.indiapost.gov.in",
    portalName: "indiapost.gov.in"
  },
  {
    id: "vishwakarma",
    name: "PM Vishwakarma Scheme",
    tag: "Artisans",
    tagHi: "कारीगर",
    benefit: "₹15,000 Toolkit + ₹3 Lakh Loan @ 5%",
    benefitHi: "₹15,000 टूलकिट अनुदान + ₹3 लाख ऋण (5% ब्याज)",
    ministry: "Ministry of MSME",
    shortDesc: "End-to-end holistic support for traditional craftspeople and artisans.",
    shortDescHi: "पारंपरिक कारीगरों और शिल्पकारों को कौशल प्रशिक्षण, आधुनिक टूलकिट और 5% पर ऋण।",
    fullDesc: "Provides formal recognition (PM Vishwakarma Certificate), skill upgradation with ₹500/day stipend, modern toolkit incentive of ₹15,000, and enterprise credit up to ₹3 Lakh at a subsidized 5% interest rate.",
    criteria: [
      "Artisan or craftsperson working with hands and tools in one of 18 traditional trades (carpenter, blacksmith, potter, tailor, cobbler, etc.)",
      "Minimum age 18 years on registration date",
      "Should not have availed similar central/state credit schemes (PMEGP, Mudra, SVANidhi) in past 5 years",
      "Limited to one member per family"
    ],
    documents: [
      "Aadhaar Card (Biometric authentication)",
      "Active Mobile Number",
      "Bank Account details",
      "Ration Card for family verification"
    ],
    steps: [
      "Visit your nearest Common Service Center (CSC) with Aadhaar and mobile for biometric verification.",
      "Gram Panchayat or Urban Local Body verifies your traditional occupation.",
      "Complete 5-7 days of basic skill training with ₹500 daily stipend.",
      "Receive ₹15,000 digital toolkit voucher and apply for 5% enterprise loan."
    ],
    portalUrl: "https://pmvishwakarma.gov.in",
    portalName: "pmvishwakarma.gov.in"
  },
  {
    id: "skillindia",
    name: "Skill India Digital (PMKVY 4.0)",
    tag: "Youth & Skills",
    tagHi: "युवा एवं कौशल",
    benefit: "100% Free Training + Govt Certificate",
    benefitHi: "100% निःशुल्क प्रशिक्षण + सरकारी प्रमाण पत्र",
    ministry: "Ministry of Skill Development & Entrepreneurship",
    shortDesc: "Industry-aligned skill training, AI courses, and placement opportunities for Indian youth.",
    shortDescHi: "युवाओं के लिए निःशुल्क आधुनिक तकनीकी प्रशिक्षण, एआई कोर्सेज और रोजगार सहायता।",
    fullDesc: "Equips students, dropouts, and jobseekers with futuristic technical, coding, green energy, healthcare, and vocational skills with recognized certifications.",
    criteria: [
      "Indian citizen between 15 and 45 years of age",
      "School/college dropouts or unemployed youth seeking job-ready skills",
      "Valid Aadhaar card and active bank account",
      "Willingness to attend certified training center"
    ],
    documents: [
      "Aadhaar Card",
      "Educational qualification certificates / Marksheets (if any)",
      "Bank Account details",
      "Passport-sized photograph"
    ],
    steps: [
      "Create an account on skillindiadigital.gov.in using Aadhaar e-KYC.",
      "Browse course catalog based on your interest, city, or sector.",
      "Enroll in an accredited training center or online course module.",
      "Clear skill assessment to receive Govt of India QR-verified certificate and job support."
    ],
    portalUrl: "https://www.skillindiadigital.gov.in",
    portalName: "skillindiadigital.gov.in"
  },
  {
    id: "startupindia",
    name: "Startup India Initiative",
    tag: "Entrepreneurs",
    tagHi: "उद्यमी",
    benefit: "3-Yr Tax Holiday + Seed Funds",
    benefitHi: "3 साल का टैक्स अवकाश + सीड फंडिंग",
    ministry: "Ministry of Commerce & Industry (DPIIT)",
    shortDesc: "Tax exemptions, patent rebates, and seed funding support for Indian startups.",
    shortDescHi: "भारतीय स्टार्टअप्स के लिए 3 वर्ष का आयकर छूट, पेटेंट शुल्क में 80% छूट और सीड फंड।",
    fullDesc: "Fosters entrepreneurship through DPIIT recognition, 3-year income tax exemption under 80-IAC, fast-track patent examinations with 80% fee rebates, and Startup India Seed Fund access.",
    criteria: [
      "Incorporated as a Private Limited, LLP, or Registered Partnership in India",
      "Incorporation date must be within the past 10 years",
      "Annual turnover has not exceeded ₹100 Crores in any financial year",
      "Working towards innovation, development, or commercialization of new products/services"
    ],
    documents: [
      "Certificate of Incorporation / Registration",
      "PAN Card of the entity",
      "Brief write-up / pitch deck explaining innovation and scalability",
      "Website / App / Prototype link"
    ],
    steps: [
      "Register your business entity on the MCA / RoC portal.",
      "Visit startupindia.gov.in and create a profile.",
      "Submit DPIIT Recognition application along with pitch deck and incorporation docs.",
      "Receive DPIIT Certificate within 48-72 hours to unlock tax benefits, patent discounts, and seed funds."
    ],
    portalUrl: "https://www.startupindia.gov.in",
    portalName: "startupindia.gov.in"
  }
];

const sampleTickets = {
  "JAN-2026-849102": {
    id: "JAN-2026-849102",
    category: "Water Supply",
    categoryHi: "जल आपूर्ति",
    dept: "Jal Board / Municipal Water Works Division",
    deptHi: "जल बोर्ड / नगर निगम जलापूर्ति प्रभाग",
    location: "Ward 7, Near Central Water Tank, MG Colony",
    desc: "Main distribution pipe leakage causing water pressure drop and clean water wastage.",
    date: "14 Feb 2026, 09:30 AM",
    status: "Resolved",
    statusHi: "समाधान संपन्न",
    currentStep: 4,
    slaTarget: "Target SLA: 24h • Completed in 18 hrs",
    officer: "Er. Ramesh Verma (Executive Engineer, Jal Board)",
    officerContact: "011-23849102 (Ext. 402)",
    timeline: [
      { title: "Complaint Registered", time: "14 Feb, 09:30 AM", done: true },
      { title: "Routed to Jal Board Field Squad", time: "14 Feb, 11:15 AM", done: true },
      { title: "On-Site Inspection & Valve Isolation", time: "14 Feb, 02:40 PM", done: true },
      { title: "Pipeline Replacement Completed & Tested", time: "15 Feb, 03:20 AM", done: true }
    ]
  },
  "JAN-2026-719342": {
    id: "JAN-2026-719342",
    category: "Roads & Potholes",
    categoryHi: "सड़क और गड्ढे",
    dept: "Public Works Department (PWD) / Road Infrastructure",
    deptHi: "लोक निर्माण विभाग (PWD) / सड़क अवसंरचना",
    location: "Ring Road Sector 14, Opposite Metro Pillar 84",
    desc: "Cluster of 3 deep potholes hazardous for two-wheelers during night traffic.",
    date: "17 Feb 2026, 02:15 PM",
    status: "Field Inspection in Progress",
    statusHi: "स्थल निरीक्षण प्रगति पर",
    currentStep: 3,
    slaTarget: "Target Completion: Within 36 hours",
    officer: "Er. Priya Sharma (Assistant Divisional Engineer, PWD)",
    officerContact: "011-24901928 (Ext. 118)",
    timeline: [
      { title: "Complaint Registered", time: "17 Feb, 02:15 PM", done: true },
      { title: "Routed to Urban Asphalt Unit", time: "17 Feb, 04:00 PM", done: true },
      { title: "Inspection Squad Deployed On-Site", time: "18 Feb, 10:30 AM", done: true },
      { title: "Cold Mix Patchwork & Compacting", time: "Scheduled Today", done: false }
    ]
  },
  "JAN-2026-552190": {
    id: "JAN-2026-552190",
    category: "Street Lighting",
    categoryHi: "स्ट्रीट लाइट",
    dept: "Electricity Supply & Municipal Lighting Cell",
    deptHi: "विद्युत वितरण एवं स्ट्रीट लाइट प्रकोष्ठ",
    location: "Subhash Park Inner Circle, Poles #104 to #108",
    desc: "5 consecutive streetlights non-operational, dark corner posing security risk.",
    date: "18 Feb 2026, 08:10 AM",
    status: "Routed to Department",
    statusHi: "संबंधित प्रभाग को प्रेषित",
    currentStep: 2,
    slaTarget: "Target Completion: Within 24 hours",
    officer: "Anand Joshi (Superintendent, Municipal Electrical Cell)",
    officerContact: "011-26718900 (Ext. 204)",
    timeline: [
      { title: "Complaint Registered", time: "18 Feb, 08:10 AM", done: true },
      { title: "Dispatched to Zone 3 Maintenance Van", time: "18 Feb, 09:45 AM", done: true },
      { title: "Underground Cable & Fixture Testing", time: "Pending", done: false },
      { title: "LED Fixture Restoration & Verification", time: "Pending", done: false }
    ]
  }
};

function App(){
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem("jansetu_lang") || "English";
  });
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("jansetu_theme") || "dark";
  });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [smsAlerts, setSmsAlerts] = useState(() => {
    return localStorage.getItem("jansetu_sms_alerts") !== "false";
  });
  const [mobilePhone, setMobilePhone] = useState(() => {
    return localStorage.getItem("jansetu_phone") || "+91 98765 43210";
  });
  const [selectedWard, setSelectedWard] = useState(() => {
    return localStorage.getItem("jansetu_ward") || "Ward 7 - Civil Lines / Central Zone";
  });
  const [grievances, setGrievances] = useState(() => {
    try {
      const saved = localStorage.getItem("jansetu_grievances_db");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error("Failed to parse grievances from storage", e);
    }
    return Object.values(sampleTickets);
  });
  const [query, setQuery] = useState("");
  const [active, setActive] = useState("home");
  const [auth, setAuth] = useState("login"); // login -> welcome -> app
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("jansetu_current_user");
      if (savedUser) return JSON.parse(savedUser);
    } catch(e) {}
    return null;
  });
  const [credentialsModalOpen, setCredentialsModalOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState("");
  const [selectedSchemeModal, setSelectedSchemeModal] = useState(null); // { scheme, tab }
  const [trackerModalOpen, setTrackerModalOpen] = useState(false);
  const [trackingSearchId, setTrackingSearchId] = useState("");
  const [trackedRecord, setTrackedRecord] = useState(null);
  const [chat, setChat] = useState([]);
  const [message, setMessage] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    // Sync with disk database on launch
    fetch('/api/grievances')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setGrievances(data);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("jansetu_grievances_db", JSON.stringify(grievances));
      fetch('/api/grievances', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(grievances)
      }).catch(() => {});
    } catch (e) {
      console.error("Failed to persist grievances to storage", e);
    }
  }, [grievances]);

  const handleAddNewGrievance = (record) => {
    setGrievances(prev => [record, ...prev]);
  };

  const handleAdvanceStage = (id) => {
    setGrievances(prev => prev.map(g => {
      if (g.id !== id) return g;
      const nextStep = Math.min(4, (g.currentStep || 1) + 1);
      const isResolved = nextStep === 4;
      const updatedTimeline = (g.timeline || []).map((step, idx) => {
        if (idx < nextStep) return { ...step, done: true, time: step.time === "Pending" ? "Completed Just Now" : step.time };
        return step;
      });
      return {
        ...g,
        currentStep: nextStep,
        status: isResolved ? "Resolved" : (nextStep === 3 ? "Field Inspection" : "Routed to Dept"),
        statusHi: isResolved ? "समाधान संपन्न" : (nextStep === 3 ? "स्थल निरीक्षण प्रगति पर" : "संबंधित प्रभाग को प्रेषित"),
        timeline: updatedTimeline
      };
    }));
    notify(lang === "हिन्दी" ? `शिकायत ${id} की स्थिति अद्यतन की गई!` : `Grievance ${id} status advanced!`);
  };

  const handleDeleteGrievance = (id) => {
    setGrievances(prev => prev.filter(g => g.id !== id));
    notify(lang === "हिन्दी" ? `शिकायत ${id} हटाई गई` : `Grievance ${id} withdrawn and removed`);
  };

  const t = useMemo(() => {
    return (key) => i18n[lang]?.[key] || i18n.English[key] || key;
  }, [lang]);

  const toggleLanguage = () => {
    const nextLang = lang === "English" ? "हिन्दी" : "English";
    setLangState(nextLang);
    localStorage.setItem("jansetu_lang", nextLang);
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("jansetu_theme", nextTheme);
    notify(nextTheme === "light" ? (lang === "हिन्दी" ? "लाइट मोड सक्रिय" : "Light Mode activated") : (lang === "हिन्दी" ? "डार्क मोड सक्रिय" : "Dark Mode activated"));
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.body.className = theme === "light" ? "light-theme" : "dark-theme";
  }, [theme]);

  useEffect(() => {
    setChat([
      { from: "ai", text: i18n[lang]?.chatGreeting || i18n.English.chatGreeting }
    ]);
  }, [lang]);

  const filteredIssues = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return issues;
    return issues.filter(x => {
      const enMatch = `${x.en.title} ${x.en.desc}`.toLowerCase().includes(q);
      const hiMatch = `${x.hi.title} ${x.hi.desc}`.toLowerCase().includes(q);
      return enMatch || hiMatch;
    });
  }, [query]);

  const notify = (text) => {
    setToast(text);
    setTimeout(() => setToast(""), 2800);
  };

  const handleUserLogin = (u) => {
    const enrichedUser = {
      ...u,
      phone: mobilePhone,
      ward: selectedWard,
      loginTime: u?.loginTime || new Date().toLocaleString()
    };
    setUser(enrichedUser);
    try {
      localStorage.setItem("jansetu_current_user", JSON.stringify(enrichedUser));
      const raw = localStorage.getItem("jansetu_users_registry");
      let users = raw ? JSON.parse(raw) : [];
      const idx = users.findIndex(item => item.email === enrichedUser.email);
      if (idx >= 0) {
        users[idx] = { ...users[idx], ...enrichedUser, lastSeen: new Date().toLocaleString() };
      } else {
        users.push({ ...enrichedUser, firstSeen: new Date().toLocaleString(), lastSeen: new Date().toLocaleString() });
      }
      localStorage.setItem("jansetu_users_registry", JSON.stringify(users));
      fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enrichedUser)
      }).catch(() => {});
    } catch(e) {
      console.error("Failed to persist user credentials", e);
    }
    setAuth("welcome");
  };

  const handleLogout = () => {
    setUser(null);
    try {
      localStorage.removeItem("jansetu_current_user");
    } catch(e) {}
    setAuth("login");
    setProfileOpen(false);
    setMobileNavOpen(false);
    notify(lang === "हिन्दी" ? "सफलतापूर्वक साइन आउट किया गया" : "Signed out successfully");
  };

  const handleSelectIssue = (issueId) => {
    setSelectedIssueId(issueId);
    setActive("report");
    setMobileNavOpen(false);
  };

  const openScheme = (scheme, tab = "eligibility") => {
    setSelectedSchemeModal({ scheme, tab });
  };

  const askAIAboutScheme = (schemeName) => {
    setSelectedSchemeModal(null);
    setActive("help");
    setMobileNavOpen(false);
    const question = lang === "हिन्दी" 
      ? `${schemeName} की पात्रता शर्तें और आवश्यक दस्तावेज़ क्या हैं?` 
      : `Tell me the eligibility criteria and documents required for ${schemeName}`;
    setMessage(question);
    sendMessage(question);
  };

  const askAIAboutDoc = (docTitle) => {
    setActive("help");
    setMobileNavOpen(false);
    const question = lang === "हिन्दी"
      ? `${docTitle} के लिए आवेदन कैसे करें और कौन से दस्तावेज़ चाहिए?`
      : `How to apply for ${docTitle} and what documents are required?`;
    setMessage(question);
    sendMessage(question);
  };

  const handleOpenTracker = (ticketIdOrObj) => {
    let found = null;
    if (ticketIdOrObj && typeof ticketIdOrObj === "object" && ticketIdOrObj.id) {
      found = ticketIdOrObj;
    } else {
      const id = (ticketIdOrObj || trackingSearchId || "JAN-2026-849102").trim().toUpperCase();
      found = grievances.find(g => g.id === id) || sampleTickets[id] || {
        id: id || "JAN-2026-849102",
        category: "Municipal Services",
        categoryHi: "नगरपालिका सेवाएं",
        dept: "Central Grievance Redressal Cell",
        deptHi: "केंद्रीय नागरिक शिकायत निवारण प्रकोष्ठ",
        location: "Verified Municipal Zone",
        desc: "Complaint logged and dispatched to designated field officer.",
        date: "Recent Submission",
        status: "In Progress",
        statusHi: "प्रगति पर",
        currentStep: 2,
        slaTarget: "Resolution within SLA timeline (24-48h)",
        officer: "Designated Municipal Inspector",
        officerContact: "1913 (Citizen Helpline)",
        timeline: [
          { title: "Complaint Registered", time: "Logged", done: true },
          { title: "Routed to Department", time: "In Progress", done: true },
          { title: "Field Inspection", time: "Pending", done: false },
          { title: "Resolution", time: "Pending", done: false }
        ]
      };
    }
    setTrackedRecord(found);
    setTrackerModalOpen(true);
  };

  const handleHeroSearch = (e) => {
    if (e) e.preventDefault();
    const q = query.toLowerCase().trim();
    if (!q) {
      setActive("report");
      return;
    }

    if (q.includes("water") || q.includes("paani") || q.includes("पानी")) {
      handleSelectIssue("water");
    } else if (q.includes("road") || q.includes("pothole") || q.includes("sadak") || q.includes("सड़क") || q.includes("गड्ढा")) {
      handleSelectIssue("roads");
    } else if (q.includes("waste") || q.includes("garbage") || q.includes("kachra") || q.includes("कचरा") || q.includes("सफाई")) {
      handleSelectIssue("waste");
    } else if (q.includes("light") || q.includes("bijli") || q.includes("लाइट") || q.includes("बिजली")) {
      handleSelectIssue("streetlight");
    } else if (q.includes("cert") || q.includes("income") || q.includes("caste") || q.includes("domicile") || q.includes("प्रमाण पत्र")) {
      setActive("documents");
    } else if (q.includes("scheme") || q.includes("yojana") || q.includes("योजना") || q.includes("pmkisan") || q.includes("ayushman") || q.includes("mudra")) {
      setActive("schemes");
    } else {
      setActive("help");
      sendMessage(query);
    }
  };

  const sendMessage = (customText) => {
    const m = (customText || message).trim();
    if (!m) return;
    setChat(c => [...c, { from: "user", text: m }]);
    const lower = m.toLowerCase();

    let replyObj = {
      from: "ai",
      text: lang === "हिन्दी"
        ? "मैं आपको सही नागरिक सेवा खोजने में मदद कर सकता हूँ। आप सड़क, पानी, कचरा, स्ट्रीट लाइट या पीएम योजनाओं के बारे में पूछ सकते हैं।"
        : "I can help you find the right civic service. Ask about potholes, water leaks, certificates, or government welfare schemes.",
      action: null
    };

    if (lower.includes("water") || lower.includes("paani") || lower.includes("पानी")) {
      replyObj = {
        from: "ai",
        text: lang === "हिन्दी"
          ? "जल आपूर्ति समस्या: आप अपने वार्ड का नाम व रिसाव की फोटो संलग्न कर तुरंत शिकायत दर्ज कर सकते हैं। जल बोर्ड को यह सीधे प्रेषित होगी।"
          : "Water Supply Issue: You can prepare your locality and an optional photo to submit a formal complaint directly to the Jal Board.",
        action: { label: lang === "हिन्दी" ? "जल आपूर्ति शिकायत दर्ज करें →" : "Report Water Issue Now →", type: "issue", target: "water" }
      };
    } else if (lower.includes("road") || lower.includes("pothole") || lower.includes("sadak") || lower.includes("सड़क") || lower.includes("गड्ढा")) {
      replyObj = {
        from: "ai",
        text: lang === "हिन्दी"
          ? "सड़क या गड्ढे की समस्या: लोक निर्माण विभाग (PWD) 24-48 घंटों में स्थल निरीक्षण करता है। सटीक लोकेशन और फोटो के साथ शिकायत दर्ज करें।"
          : "Road & Potholes: The Public Works Department (PWD) prioritizes reported potholes. Submit location landmark and photo for fast resolution.",
        action: { label: lang === "हिन्दी" ? "गड्ढे की शिकायत दर्ज करें →" : "Report Pothole Now →", type: "issue", target: "roads" }
      };
    } else if (lower.includes("waste") || lower.includes("garbage") || lower.includes("kachra") || lower.includes("कचरा") || lower.includes("सफाई")) {
      replyObj = {
        from: "ai",
        text: lang === "हिन्दी"
          ? "कचरा प्रबंधन: नगर निगम का ठोस अपशिष्ट स्वच्छता दस्ता स्थल पर पहुंचकर सफाई करता है। मोहल्ले की जानकारी देकर शिकायत दर्ज करें।"
          : "Waste Management: The Municipal Sanitation Squad clears reported overflowing bins and garbage heaps within SLA timeframes.",
        action: { label: lang === "हिन्दी" ? "कचरा प्रबंधन शिकायत दर्ज करें →" : "Report Garbage Now →", type: "issue", target: "waste" }
      };
    } else if (lower.includes("light") || lower.includes("street") || lower.includes("लाइट") || lower.includes("बिजली")) {
      replyObj = {
        from: "ai",
        text: lang === "हिन्दी"
          ? "स्ट्रीट लाइट: खराब या बंद स्ट्रीट लाइट की सूचना सीधे विद्युत वितरण सेल को दी जाती है। पोल नंबर या पता दर्ज करें।"
          : "Street Lights: Non-functional lights can be reported with pole number or street landmark directly to the electrical wing.",
        action: { label: lang === "हिन्दी" ? "स्ट्रीट लाइट शिकायत दर्ज करें →" : "Report Street Light →", type: "issue", target: "streetlight" }
      };
    } else if (lower.includes("scheme") || lower.includes("yojana") || lower.includes("योजना") || lower.includes("pmkisan") || lower.includes("ayushman") || lower.includes("pmay") || lower.includes("mudra")) {
      replyObj = {
        from: "ai",
        text: lang === "हिन्दी"
          ? "सरकारी योजनाएं: पीएम-किसान (₹6,000/वर्ष), आयुष्मान भारत (₹5 लाख कैशलेस स्वास्थ्य बीमा), और पीएम आवास योजना के लिए हमारा इंटरएक्टिव पात्रता कैलकुलेटर उपलब्ध है।"
          : "Government Schemes: We have interactive eligibility calculators for PM-KISAN (₹6k/yr), Ayushman Bharat (₹5L health cover), and PMAY housing.",
        action: { label: lang === "हिन्दी" ? "सभी योजनाएं व पात्रता देखें →" : "Explore Welfare Schemes →", type: "nav", target: "schemes" }
      };
    } else if (lower.includes("cert") || lower.includes("income") || lower.includes("caste") || lower.includes("domicile") || lower.includes("प्रमाण पत्र") || lower.includes("दस्तावेज़")) {
      replyObj = {
        from: "ai",
        text: lang === "हिन्दी"
          ? "सरकारी प्रमाण पत्र: आय, जाति, निवास व जन्म प्रमाण पत्र के लिए आवश्यक दस्तावेज़, तहसील कार्यालय, सरकारी शुल्क व ई-डिस्ट्रिक्ट पोर्टल की पूरी जानकारी उपलब्ध है।"
          : "Certificates & Revenue Docs: Full guide on required documents, Tehsil office SLA, official fees (₹0-₹30), and official state e-District portal links.",
        action: { label: lang === "हिन्दी" ? "प्रमाण पत्र गाइड देखें →" : "View Certificate Hub →", type: "nav", target: "documents" }
      };
    }

    setTimeout(() => setChat(c => [...c, replyObj]), 300);
    setMessage("");
  };

  const handleChatAction = (action) => {
    if (!action) return;
    if (action.type === "issue") {
      handleSelectIssue(action.target);
    } else if (action.type === "nav") {
      setActive(action.target);
    }
  };

  if (auth === "login") {
    return <LoginPage onLogin={handleUserLogin} notify={notify} lang={lang} toggleLanguage={toggleLanguage} t={t} />;
  }

  if (auth === "welcome") {
    return <WelcomePage user={user} onContinue={() => { setAuth("app"); setActive("home"); }} lang={lang} t={t} />;
  }

  return (
    <div className="app" onClick={() => { if (profileOpen) setProfileOpen(false); }}>
      <div className="tricolorBar"></div>
      {toast && <div className="toast"><CheckCircle2 size={18} />{toast}</div>}

      <header className="topbar">
        <div className="brand" onClick={() => { setActive("home"); setMobileNavOpen(false); }}>
          <div className="brandEmblem">
            <Building2 size={20} />
          </div>
          <div className="brandInfo">
            <b>जनसेतु <span>JanSetu AI</span></b>
            <span className="brandSubtitle">{t("brandTag")}</span>
          </div>
        </div>

        <nav>
          <button className={active === "home" ? "active" : ""} onClick={() => setActive("home")}>
            <Home size={16} /> {t("navHome")}
          </button>
          <button className={active === "report" ? "active" : ""} onClick={() => { setSelectedIssueId(""); setActive("report"); }}>
            <FileText size={16} /> {t("navReport")}
          </button>
          <button className={active === "my-grievances" ? "active" : ""} onClick={() => setActive("my-grievances")}>
            <ClipboardList size={16} /> {t("navMyGrievances")}
            {grievances.length > 0 && <span className="navCounterPill">{grievances.length}</span>}
          </button>
          <button className={active === "schemes" ? "active" : ""} onClick={() => setActive("schemes")}>
            <ShieldCheck size={16} /> {t("navSchemes")}
          </button>
          <button className={active === "documents" ? "active" : ""} onClick={() => setActive("documents")}>
            <FileCheck2 size={16} /> {t("navDocs")}
          </button>
          <button className={active === "help" ? "active" : ""} onClick={() => setActive("help")}>
            <Bot size={16} /> {t("navHelp")}
          </button>
        </nav>

        <div className="actions">
          <button
            className="themeToggleBtn"
            onClick={toggleTheme}
            title={theme === "dark" ? (lang === "हिन्दी" ? "लाइट मोड में बदलें" : "Switch to Light Mode") : (lang === "हिन्दी" ? "डार्क मोड में बदलें" : "Switch to Dark Mode")}
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <Sun size={16} color="#fbbf24" /> : <Moon size={16} color="#2563eb" />}
          </button>

          <button className="lang" onClick={toggleLanguage} title="Switch English / हिन्दी">
            <Languages size={16} /> {lang}
          </button>

          <button
            className="settingsIconBtn"
            onClick={() => setSettingsOpen(true)}
            title={t("settingsTitle")}
            aria-label="Open Settings"
          >
            <Settings size={16} />
          </button>

          <div className="profileMenuWrapper" onClick={e => e.stopPropagation()}>
            <button
              className="profile"
              title={user?.name || t("account")}
              onClick={() => setProfileOpen(p => !p)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: profileOpen ? 'var(--panel-hover)' : undefined }}
            >
              {user?.picture ? (
                <img src={user.picture} alt={user.name} style={{ width: 22, height: 22, borderRadius: '50%' }} />
              ) : (
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg, var(--blue), var(--emerald))', color: '#fff', fontSize: '11px', fontWeight: 700, display: 'grid', placeItems: 'center' }}>
                  {user?.name ? user.name[0].toUpperCase() : "C"}
                </div>
              )}
              <span style={{ fontSize: '12px', fontWeight: 600, maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user?.name?.split(" ")[0] || t("account")}
              </span>
            </button>

            {profileOpen && (
              <div className="profileDropdown">
                <div className="profileInfo">
                  <div className="profileInfoHeader">
                    <div className="profileAvatarLarge">
                      {user?.picture ? (
                        <img src={user.picture} alt={user.name} />
                      ) : (
                        user?.name ? user.name[0].toUpperCase() : "C"
                      )}
                    </div>
                    <div style={{ overflow: 'hidden' }}>
                      <div className="profileInfoName">{user?.name || (lang === "हिन्दी" ? "नागरिक उपयोगकर्ता" : "Citizen User")}</div>
                      <div className="profileInfoEmail">{user?.email || "Google Citizen"}</div>
                    </div>
                  </div>
                  <span className="profileBadge">
                    <ShieldCheck size={12} />
                    {user?.provider === "guest" ? t("guestMode") : t("googleVerified")}
                  </span>
                </div>

                <div className="dropdownSettingsGroup">
                  <button className="dropdownActionRow" onClick={() => { setCredentialsModalOpen(true); setProfileOpen(false); }}>
                    <span className="dropdownActionLabel">
                      <Key size={15} color="var(--emerald)" />
                      {lang === "हिन्दी" ? "नागरिक क्रेडेंशियल व पहचान" : "Citizen Credentials & ID"}
                    </span>
                    <ChevronRight size={14} color="var(--muted)" />
                  </button>

                  <button className="dropdownActionRow" onClick={() => { setActive("my-grievances"); setProfileOpen(false); }}>
                    <span className="dropdownActionLabel">
                      <ClipboardList size={15} color="var(--blue-light)" />
                      {t("navMyGrievances")}
                    </span>
                    <span className="dropdownActionValue" style={{ background: 'var(--blue)', color: '#fff', padding: '1px 7px', borderRadius: '10px', fontSize: '11px', fontWeight: 700 }}>
                      {grievances.length}
                    </span>
                  </button>

                  <button className="dropdownActionRow" onClick={toggleTheme}>
                    <span className="dropdownActionLabel">
                      {theme === "dark" ? <Sun size={15} color="#fbbf24" /> : <Moon size={15} color="#2563eb" />}
                      {theme === "dark" ? t("themeLight") : t("themeDark")}
                    </span>
                    <span className="dropdownActionValue">
                      {theme === "dark" ? "Dark" : "Light"}
                    </span>
                  </button>

                  <button className="dropdownActionRow" onClick={toggleLanguage}>
                    <span className="dropdownActionLabel">
                      <Languages size={15} />
                      {lang === "English" ? "हिन्दी में बदलें" : "English"}
                    </span>
                    <span className="dropdownActionValue">{lang}</span>
                  </button>

                  <button className="dropdownActionRow" onClick={() => { setSettingsOpen(true); setProfileOpen(false); }}>
                    <span className="dropdownActionLabel">
                      <Settings size={15} />
                      {t("settingsTitle")}
                    </span>
                    <ChevronRight size={14} color="var(--muted)" />
                  </button>
                </div>

                <button className="signOutBtn" onClick={handleLogout}>
                  <LogOut size={15} /> {t("signOut")}
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="mobileMenuToggle"
            onClick={() => setMobileNavOpen(m => !m)}
            aria-label="Toggle navigation"
          >
            {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileNavOpen && (
        <div className="mobileNavDrawer">
          <button className={`mobileNavLink ${active === "home" ? "active" : ""}`} onClick={() => { setActive("home"); setMobileNavOpen(false); }}>
            <Home size={18} /> {t("navHome")}
          </button>
          <button className={`mobileNavLink ${active === "report" ? "active" : ""}`} onClick={() => { setSelectedIssueId(""); setActive("report"); setMobileNavOpen(false); }}>
            <FileText size={18} /> {t("navReport")}
          </button>
          <button className={`mobileNavLink ${active === "my-grievances" ? "active" : ""}`} onClick={() => { setActive("my-grievances"); setMobileNavOpen(false); }}>
            <ClipboardList size={18} /> {t("navMyGrievances")}
            {grievances.length > 0 && <span className="navCounterPill">{grievances.length}</span>}
          </button>
          <button className={`mobileNavLink ${active === "schemes" ? "active" : ""}`} onClick={() => { setActive("schemes"); setMobileNavOpen(false); }}>
            <ShieldCheck size={18} /> {t("navSchemes")}
          </button>
          <button className={`mobileNavLink ${active === "documents" ? "active" : ""}`} onClick={() => { setActive("documents"); setMobileNavOpen(false); }}>
            <FileCheck2 size={18} /> {t("navDocs")}
          </button>
          <button className={`mobileNavLink ${active === "help" ? "active" : ""}`} onClick={() => { setActive("help"); setMobileNavOpen(false); }}>
            <Bot size={18} /> {t("navHelp")}
          </button>
          <button className="mobileNavLink" onClick={() => { toggleTheme(); setMobileNavOpen(false); }}>
            {theme === "dark" ? <Sun size={18} color="#fbbf24" /> : <Moon size={18} color="#2563eb" />}
            {theme === "dark" ? t("themeLight") : t("themeDark")}
          </button>
          <button className="mobileNavLink" onClick={() => { toggleLanguage(); setMobileNavOpen(false); }}>
            <Languages size={18} /> {lang === "English" ? "हिन्दी में बदलें" : "Switch to English"}
          </button>
          <button className="mobileNavLink" onClick={() => { setSettingsOpen(true); setMobileNavOpen(false); }}>
            <Settings size={18} /> {t("settingsTitle")}
          </button>
        </div>
      )}

      {active === "home" && (
        <main>
          <section className="hero">
            <div className="heroCopy">
              <div className="eyebrow"><span className="dot"></span> {t("heroEyebrow")}</div>
              <h1>{t("heroTitle1")}<br /><span className="gradientText">{t("heroTitle2")}</span></h1>
              <p>{t("heroDesc")}</p>
              
              <form className="searchBox" onSubmit={handleHeroSearch}>
                <Search size={20} />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder={t("searchPlaceholder")}
                />
                <button type="submit">
                  <span>{lang === "हिन्दी" ? "खोजें" : "Search"}</span>
                  <ArrowRight size={17} />
                </button>
              </form>

              <div className="quick">
                <span>{t("tryLabel")}</span>
                <button type="button" onClick={() => handleSelectIssue("water")}>{t("tryWater")}</button>
                <button type="button" onClick={() => setActive("documents")}>{t("tryCert")}</button>
                <button type="button" onClick={() => handleSelectIssue("roads")}>{t("tryPothole")}</button>
                <button type="button" onClick={() => setActive("schemes")}>{t("trySchemes")}</button>
              </div>

              <div className="trust">
                <span><ShieldCheck size={16} /> {t("trustCitizen")}</span>
                <span><Globe2 size={16} /> {t("trustMultilingual")}</span>
                <span><CheckCircle2 size={16} /> {t("trustAi")}</span>
              </div>
            </div>

            {/* Civic Operations & Live Resolution Console */}
            <div className="heroConsole">
              <div className="consoleHeader">
                <div className="consoleTitle">
                  <span className="consoleLivePulse"></span>
                  {t("consoleDeskTitle")}
                </div>
                <span className="consoleBadge">{t("consoleLive")}</span>
              </div>

              <div className="consoleMetrics">
                <div className="metricBlock">
                  <span className="metricNum">{t("metricResolved")}</span>
                  <span className="metricLabel">{t("metricResolvedLabel")}</span>
                </div>
                <div className="metricBlock">
                  <span className="metricNum">{t("metricSla")}</span>
                  <span className="metricLabel">{t("metricSlaLabel")}</span>
                </div>
                <div className="metricBlock">
                  <span className="metricNum">{t("metricAvg")}</span>
                  <span className="metricLabel">{t("metricAvgLabel")}</span>
                </div>
              </div>

              <div className="consoleActivityStream">
                <div className="activityFeedTitle">
                  <span>{t("activityFeed")}</span>
                  <span style={{ fontSize: '10px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={12} /> Auto-Sync
                  </span>
                </div>

                <div className="activityRow" onClick={() => handleOpenTracker("JAN-2026-849102")} style={{ cursor: 'pointer' }} title="Click to view resolution proof">
                  <div className="activityIconWrap"><Droplets size={16} color="var(--blue-light)" /></div>
                  <div className="activityDetails">
                    <div className="activityTitle">
                      {lang === "हिन्दी" ? "जल बोर्ड: मुख्य पाइपलाइन रिसाव ठीक किया गया" : "Jal Board: Main Pipeline Leak Repaired"}
                    </div>
                    <div className="activityMeta">Sector 12, Ward 7 • Ref: JAN-2026-849102</div>
                  </div>
                  <span className="activityTime">12m ago</span>
                </div>

                <div className="activityRow" onClick={() => handleOpenTracker("JAN-2026-719342")} style={{ cursor: 'pointer' }} title="Click to view inspection details">
                  <div className="activityIconWrap" style={{ background: 'rgba(245, 158, 11, 0.15)', borderColor: 'rgba(245, 158, 11, 0.3)' }}><Route size={16} color="#fbbf24" /></div>
                  <div className="activityDetails">
                    <div className="activityTitle">
                      {lang === "हिन्दी" ? "पीडब्ल्यूडी: रिंग रोड पर गड्ढों का निरीक्षण" : "PWD: Asphalt Patchwork Deployed"}
                    </div>
                    <div className="activityMeta">Ring Road Metro Sec 14 • Ref: JAN-2026-719342</div>
                  </div>
                  <span className="activityTime" style={{ color: '#fbbf24' }}>34m ago</span>
                </div>

                <div className="activityRow" onClick={() => handleOpenTracker("JAN-2026-552190")} style={{ cursor: 'pointer' }} title="Click to view routing status">
                  <div className="activityIconWrap" style={{ background: 'rgba(139, 92, 246, 0.15)', borderColor: 'rgba(139, 92, 246, 0.3)' }}><Zap size={16} color="#c084fc" /></div>
                  <div className="activityDetails">
                    <div className="activityTitle">
                      {lang === "हिन्दी" ? "विद्युत प्रभाग: 5 स्ट्रीट लाइट पोल जांचे गए" : "Electricity Cell: 5 Lights Routed"}
                    </div>
                    <div className="activityMeta">Subhash Park Inner Circle • Ref: JAN-2026-552190</div>
                  </div>
                  <span className="activityTime">58m ago</span>
                </div>
              </div>

              <div className="consoleFooter">
                <button className="consoleBtnPrimary" onClick={() => { setSelectedIssueId(""); setActive("report"); }}>
                  <FileText size={15} /> {lang === "हिन्दी" ? "शिकायत दर्ज करें" : "Lodge Grievance"}
                </button>
                <button className="consoleBtnSec" onClick={() => handleOpenTracker("JAN-2026-849102")}>
                  <Search size={15} /> {lang === "हिन्दी" ? "शिकायत ट्रैक करें" : "Track Ticket"}
                </button>
              </div>
            </div>
          </section>

          <section className="section">
            <div className="sectionHead">
              <div><span className="kicker">{t("sec1Kicker")}</span><h2>{t("sec1Title")}</h2></div>
              <button onClick={() => { setSelectedIssueId(""); setActive("report"); }}>{t("viewAll")} <ArrowRight size={16} /></button>
            </div>
            <div className="issueGrid">
              {filteredIssues.map(i => {
                const issueText = lang === "हिन्दी" ? i.hi : i.en;
                return (
                  <button
                    className="issueCard"
                    key={i.id}
                    onClick={() => {
                      if (i.id === "documents") {
                        setActive("documents");
                      } else if (i.id === "benefits") {
                        setActive("schemes");
                      } else {
                        handleSelectIssue(i.id);
                      }
                      notify(`${issueText.title} selected`);
                    }}
                  >
                    <div className={`issueIcon ${i.color}`}>{i.icon}</div>
                    <div><h3>{issueText.title}</h3><p>{issueText.desc}</p></div>
                    <ChevronRight size={18} />
                  </button>
                );
              })}
            </div>
          </section>

          <section className="aiStrip">
            <div className="aiBadge"><Bot size={22} /></div>
            <div>
              <span className="kicker">{t("aiStripKicker")}</span>
              <h2>{t("aiStripTitle")}</h2>
              <p>{t("aiStripDesc")}</p>
            </div>
            <button onClick={() => setActive("help")}>{t("aiStripBtn")} <ArrowRight size={17} /></button>
          </section>

          <section className="section schemesPreview">
            <div className="sectionHead">
              <div>
                <span className="kicker">{t("sec2Kicker")}</span>
                <h2>{t("sec2Title")}</h2>
              </div>
              <button onClick={() => setActive("schemes")}>
                {t("exploreAllSchemes")} ({schemeData.length}) <ArrowRight size={16} />
              </button>
            </div>
            <div className="schemeGrid">
              {schemeData.slice(0, 4).map(s => (
                <div className="schemeCard" key={s.id}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>{lang === "हिन्दी" ? s.tagHi : s.tag}</span>
                    <span style={{ color: 'var(--blue-light)' }}>{getSchemeIcon(s.id, 18)}</span>
                  </div>
                  <h3>{s.name}</h3>
                  <div className="benefitBadge"><Sparkles size={12} /> {lang === "हिन्दी" ? s.benefitHi : s.benefit}</div>
                  <p>{lang === "हिन्दी" ? s.shortDescHi : s.shortDesc}</p>
                  <div className="schemeCardActions">
                    <button className="schemeBtnPrimary" onClick={() => openScheme(s, "eligibility")}>
                      {t("checkEligibility")} <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Emergency Helplines Strip */}
          <div className="helplineBanner">
            <div className="helplineInfo">
              <div className="helplineIcon"><PhoneCall size={20} /></div>
              <div>
                <strong style={{ fontSize: '14px', color: '#fff', display: 'block' }}>{t("helplineTitle")}</strong>
                <span style={{ fontSize: '11px', color: '#889cb2' }}>Toll-Free National & Municipal Citizen Emergency Services</span>
              </div>
            </div>
            <div className="helplinePills">
              {helplinesData.map(h => (
                <a key={h.number} href={`tel:${h.number}`} className="helplinePill" title={`${h.name} (${h.tag})`}>
                  <span>{h.name}:</span>
                  <b>{h.number}</b>
                </a>
              ))}
            </div>
          </div>
        </main>
      )}

      {active === "report" && (
        <Report 
          onBack={() => setActive("home")} 
          notify={notify} 
          lang={lang} 
          t={t} 
          initialIssueId={selectedIssueId} 
          onOpenDocs={() => setActive("documents")}
          onGrievanceCreated={handleAddNewGrievance}
          onViewMyGrievances={() => setActive("my-grievances")}
        />
      )}

      {active === "my-grievances" && (
        <MyGrievances
          grievances={grievances}
          onAdvanceStage={handleAdvanceStage}
          onDeleteGrievance={handleDeleteGrievance}
          onViewTracker={handleOpenTracker}
          onLodgeNew={() => { setSelectedIssueId(""); setActive("report"); }}
          lang={lang}
          t={t}
          notify={notify}
        />
      )}

      {active === "schemes" && <Schemes onOpenScheme={openScheme} notify={notify} lang={lang} t={t} />}
      {active === "documents" && <Documents onAskAI={askAIAboutDoc} notify={notify} lang={lang} t={t} />}
      {active === "help" && <Help chat={chat} message={message} setMessage={setMessage} sendMessage={sendMessage} onAction={handleChatAction} lang={lang} t={t} />}

      {selectedSchemeModal && (
        <SchemeModal
          scheme={selectedSchemeModal.scheme}
          initialTab={selectedSchemeModal.tab}
          onClose={() => setSelectedSchemeModal(null)}
          onAskAI={askAIAboutScheme}
          notify={notify}
          lang={lang}
          t={t}
        />
      )}

      {trackerModalOpen && trackedRecord && (
        <TrackerModal
          record={trackedRecord}
          onClose={() => setTrackerModalOpen(false)}
          lang={lang}
          t={t}
          notify={notify}
        />
      )}

      {settingsOpen && (
        <SettingsModal
          isOpen={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          theme={theme}
          toggleTheme={toggleTheme}
          lang={lang}
          toggleLanguage={toggleLanguage}
          smsAlerts={smsAlerts}
          setSmsAlerts={setSmsAlerts}
          mobilePhone={mobilePhone}
          setMobilePhone={setMobilePhone}
          selectedWard={selectedWard}
          setSelectedWard={setSelectedWard}
          notify={notify}
          t={t}
        />
      )}

      {credentialsModalOpen && (
        <CitizenCredentialsModal
          user={user}
          onClose={() => setCredentialsModalOpen(false)}
          lang={lang}
          t={t}
          mobilePhone={mobilePhone}
          selectedWard={selectedWard}
          grievancesCount={grievances.length}
          notify={notify}
        />
      )}

      <footer>
        <div className="brand">
          <div className="brandEmblem" style={{ width: 34, height: 34, borderRadius: 10 }}>
            <Building2 size={17} />
          </div>
          <div className="brandInfo">
            <b>जनसेतु | JanSetu AI</b>
            <span className="brandSubtitle">{t("brandTag")}</span>
          </div>
        </div>
        <div className="footerGovLine">
          <span>{lang === "हिन्दी" ? "नागरिक सेवा एवं शिकायत निवारण मंच • भारत सरकार सहयोग" : "Citizen Service & Grievance Redressal Portal • Digital India Initiative"}</span>
        </div>
        <span>© 2026 JanSetu AI</span>
      </footer>
    </div>
  );
}

function Documents({onAskAI, notify, lang, t}){
  return (
    <main className="page">
      <div className="pageTitle">
        <span className="kicker">{t("docsPageKicker")}</span>
        <h1>{t("docsPageTitle")}</h1>
        <p>{t("docsPageDesc")}</p>
      </div>

      <div className="docsHubGrid">
        {documentsData.map(doc => (
          <div className="docHubCard" key={doc.id}>
            <div className="docHubBadge">
              <FileCheck2 size={13} /> {lang === "हिन्दी" ? doc.deptHi : doc.dept}
            </div>
            <h3>{doc.title}</h3>
            <p>{lang === "हिन्दी" ? doc.descHi : doc.desc}</p>

            <div style={{ marginBottom: '14px' }}>
              <span style={{ fontSize: '11px', color: '#778a9e', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                {lang === "हिन्दी" ? "आवश्यक दस्तावेज़:" : "Required Checklist:"}
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                {doc.documents.map((d, idx) => (
                  <span key={idx} style={{ background: '#0e223b', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', padding: '3px 7px', fontSize: '10px', color: '#ccdbeb', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Check size={11} color="var(--emerald)" /> {d}
                  </span>
                ))}
              </div>
            </div>

            <div className="docMetaRow">
              <div>
                <span>{lang === "हिन्दी" ? "समय सीमा:" : "Govt SLA:"} </span>
                <strong>{lang === "हिन्दी" ? doc.slaHi : doc.sla}</strong>
              </div>
              <div>
                <span>{lang === "हिन्दी" ? "शुल्क:" : "Fee:"} </span>
                <strong style={{ color: 'var(--cyan)' }}>{doc.fee}</strong>
              </div>
            </div>

            <div className="docHubActions">
              <button className="docHelpBtn" onClick={() => onAskAI(doc.title)}>
                <Bot size={14} /> {t("askAiAssistant")}
              </button>
              <a href={doc.portalUrl} target="_blank" rel="noopener noreferrer" className="docApplyBtn">
                {t("openOfficialPortal")} <ExternalLink size={13} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

function SchemeModal({scheme, initialTab = "eligibility", onClose, onAskAI, notify, lang, t}){
  const [tab, setTab] = useState(initialTab); // 'eligibility' | 'apply'
  const [checkedCriteria, setCheckedCriteria] = useState({});

  const toggleCheck = (idx) => {
    setCheckedCriteria(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const totalCriteria = scheme.criteria.length;
  const checkedCount = Object.values(checkedCriteria).filter(Boolean).length;
  const isFullyEligible = checkedCount === totalCriteria;

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="schemeModal" onClick={e => e.stopPropagation()}>
        <button className="modalClose" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <div className="schemeModalHeader">
          <div className="schemeModalIcon">{getSchemeIcon(scheme.id, 24)}</div>
          <div className="schemeModalTitles">
            <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--orange)', letterSpacing: '1.5px', fontWeight: 700 }}>
              {lang === "हिन्दी" ? scheme.tagHi : scheme.tag} • {scheme.ministry}
            </span>
            <h2>{scheme.name}</h2>
            <p>{scheme.fullDesc}</p>
          </div>
        </div>

        <div className="schemeBenefitBanner">
          <div>
            <div className="benefitLabel">{t("keyBenefitLabel")}</div>
            <div className="benefitVal">{lang === "हिन्दी" ? scheme.benefitHi : scheme.benefit}</div>
          </div>
          <button
            type="button"
            className="schemeBtnSec"
            style={{ background: 'rgba(72,225,209,0.1)', color: 'var(--cyan)', border: '1px solid rgba(72,225,209,0.3)', padding: '8px 14px', borderRadius: '10px' }}
            onClick={() => onAskAI(scheme.name)}
          >
            <Bot size={15} /> {t("askAiAssistant")}
          </button>
        </div>

        <div className="schemeNavTabs">
          <button className={tab === "eligibility" ? "active" : ""} onClick={() => setTab("eligibility")}>
            {t("eligibilityCheckerTab")} ({checkedCount}/{totalCriteria})
          </button>
          <button className={tab === "apply" ? "active" : ""} onClick={() => setTab("apply")}>
            {t("docsAndApplyTab")}
          </button>
        </div>

        {tab === "eligibility" && (
          <div className="eligibilitySection">
            <h4>{t("checkCriteriaTitle")}</h4>
            <p style={{ fontSize: '12px', color: '#8698ac', margin: '-6px 0 14px' }}>
              {t("checkCriteriaDesc")}
            </p>

            <div className="criteriaList">
              {scheme.criteria.map((crit, idx) => {
                const isChecked = !!checkedCriteria[idx];
                return (
                  <div
                    key={idx}
                    className={`criteriaItem ${isChecked ? "checked" : ""}`}
                    onClick={() => toggleCheck(idx)}
                  >
                    <div className="criteriaCheck">
                      {isChecked && <Check size={14} strokeWidth={3} />}
                    </div>
                    <div className="criteriaText">{crit}</div>
                  </div>
                );
              })}
            </div>

            <div className={`eligibilityResult ${isFullyEligible ? "eligible" : "partial"}`}>
              {isFullyEligible ? (
                <>
                  <CheckCircle2 size={24} style={{ flexShrink: 0 }} />
                  <div>
                    <strong>{t("eligibleNotice")} {scheme.name}!</strong>
                    <div style={{ fontSize: '12px', opacity: 0.9, marginTop: '2px' }}>
                      {t("eligibleNoticeSub")}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <FileCheck2 size={24} style={{ flexShrink: 0 }} />
                  <div>
                    <strong>{checkedCount}/{totalCriteria} {t("partialNotice")}</strong>
                    <div style={{ fontSize: '12px', opacity: 0.9, marginTop: '2px' }}>
                      {t("partialNoticeSub")}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {tab === "apply" && (
          <div className="applySection">
            <h4>{t("requiredDocsTitle")}</h4>
            <div className="docsGrid">
              {scheme.documents.map((doc, idx) => (
                <div key={idx} className="docChip">
                  <Check size={14} color="var(--cyan)" />
                  <span>{doc}</span>
                </div>
              ))}
            </div>

            <h4>{t("stepsTitle")}</h4>
            <div className="stepList">
              {scheme.steps.map((step, idx) => (
                <div key={idx} className="stepItem">
                  <div className="stepNum">{idx + 1}</div>
                  <div className="stepContent">{step}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="schemeModalFooter">
          <div style={{ fontSize: '11px', color: '#728498' }}>
            {t("verifiedPortal")} <strong>{scheme.portalName}</strong>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button className="schemeBtnSec" onClick={onClose}>{t("backBtn")}</button>
            <a
              href={scheme.portalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="officialGovLink"
            >
              {t("openOfficialPortal")} <ExternalLink size={15} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Schemes({onOpenScheme, notify, lang, t}){
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");

  const categoriesEn = ["All", "Farmers", "Healthcare", "Housing", "Business", "Women & Child", "Artisans", "Youth & Skills", "Entrepreneurs"];
  const categoriesHi = ["सभी", "किसान", "स्वास्थ्य", "आवास", "व्यवसाय", "महिला एवं बाल", "कारीगर", "युवा एवं कौशल", "उद्यमी"];
  const categories = lang === "हिन्दी" ? categoriesHi : categoriesEn;

  const filtered = useMemo(() => {
    return schemeData.filter(s => {
      const tagMatches = selectedTag === "All" || selectedTag === "सभी" || 
        s.tag.toLowerCase().includes(selectedTag.toLowerCase()) || 
        s.tagHi.toLowerCase().includes(selectedTag.toLowerCase());

      const q = search.toLowerCase().trim();
      const matchesSearch = !q ||
        s.name.toLowerCase().includes(q) ||
        s.shortDesc.toLowerCase().includes(q) ||
        s.shortDescHi.toLowerCase().includes(q) ||
        s.benefit.toLowerCase().includes(q) ||
        s.benefitHi.toLowerCase().includes(q);

      return tagMatches && matchesSearch;
    });
  }, [search, selectedTag]);

  return (
    <main className="page">
      <div className="pageTitle">
        <span className="kicker">{t("schemesPageKicker")}</span>
        <h1>{t("schemesPageTitle")}</h1>
        <p>{t("schemesPageDesc")}</p>
      </div>

      <div className="schemesControls">
        <div className="schemeSearch">
          <Search size={18} color="var(--cyan)" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t("schemesSearchPlaceholder")}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ background: 'none', border: 0, color: '#889bb0', cursor: 'pointer' }}>
              <X size={16} />
            </button>
          )}
        </div>

        <div className="schemeCategoryPills">
          {categories.map((cat, idx) => {
            const isCatActive = selectedTag === cat || (idx === 0 && (selectedTag === "All" || selectedTag === "सभी"));
            return (
              <button
                key={cat}
                className={isCatActive ? "active" : ""}
                onClick={() => setSelectedTag(cat)}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ fontSize: '12px', color: '#74879c', marginBottom: '16px' }}>
        {t("showingSchemes")} <strong>{filtered.length}</strong> {t("schemesCountLabel")}
      </div>

      <div className="schemeGrid big">
        {filtered.map(s => (
          <div className="schemeCard" key={s.id}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>{lang === "हिन्दी" ? s.tagHi : s.tag}</span>
              <span style={{ color: 'var(--blue-light)' }}>{getSchemeIcon(s.id, 18)}</span>
            </div>
            <h3>{s.name}</h3>
            <div className="benefitBadge"><Sparkles size={12} /> {lang === "हिन्दी" ? s.benefitHi : s.benefit}</div>
            <p>{lang === "हिन्दी" ? s.shortDescHi : s.shortDesc}</p>
            <div className="schemeCardActions">
              <button className="schemeBtnSec" onClick={() => onOpenScheme(s, "apply")}>
                {t("howToApply")}
              </button>
              <button className="schemeBtnPrimary" onClick={() => onOpenScheme(s, "eligibility")}>
                {t("checkEligibility")} <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

function LoginPage({onLogin, notify, lang, toggleLanguage, t}){
  const [clientId, setClientId] = useState(() => {
    return localStorage.getItem("jansetu_google_client_id") || import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
  });
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [tempClientId, setTempClientId] = useState(clientId);
  const [gsiLoaded, setGsiLoaded] = useState(false);
  const googleBtnContainerRef = useRef(null);

  useEffect(() => {
    const handleAuthMessage = (event) => {
      if (event.data?.type === "GOOGLE_POPUP_AUTH_SUCCESS" && event.data.user) {
        onLogin(event.data.user);
        notify?.(lang === "हिन्दी" ? "Google से सफलतापूर्वक लॉग इन हुआ!" : "Signed in with Google!");
      }
    };
    window.addEventListener("message", handleAuthMessage);
    return () => window.removeEventListener("message", handleAuthMessage);
  }, [onLogin, notify, lang]);

  useEffect(() => {
    if (!clientId) return;

    let attempts = 0;
    const maxAttempts = 15;

    const initGoogleGsi = () => {
      attempts++;
      if (window.google?.accounts?.id && googleBtnContainerRef.current) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: (response) => {
              if (response?.credential) {
                try {
                  const base64Url = response.credential.split('.')[1];
                  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                  const jsonPayload = decodeURIComponent(
                    atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
                  );
                  const data = JSON.parse(jsonPayload);
                  onLogin({
                    name: data.name || "Google Citizen",
                    email: data.email,
                    picture: data.picture,
                    provider: "google",
                    sub: data.sub || ("GOOGLE-" + Math.floor(100000000000 + Math.random() * 900000000000)),
                    email_verified: data.email_verified ?? true,
                    clientId: clientId,
                    issuer: data.iss || "https://accounts.google.com",
                    loginTime: new Date().toLocaleString(),
                    jwtRawSnippet: response.credential ? `${response.credential.slice(0, 20)}...${response.credential.slice(-16)}` : null
                  });
                  notify?.(lang === "हिन्दी" ? "Google से सफलतापूर्वक लॉग इन हुआ!" : "Signed in successfully with Google!");
                } catch (err) {
                  console.error("JWT parse error:", err);
                }
              }
            },
            auto_select: false,
          });

          googleBtnContainerRef.current.innerHTML = "";
          window.google.accounts.id.renderButton(googleBtnContainerRef.current, {
            theme: "outline",
            size: "large",
            width: 320,
            text: "continue_with",
            shape: "rectangular",
            logo_alignment: "left"
          });
          setGsiLoaded(true);
        } catch (e) {
          console.warn("Google GSI initialization notice:", e);
        }
      } else if (attempts < maxAttempts) {
        setTimeout(initGoogleGsi, 300);
      }
    };

    initGoogleGsi();
  }, [clientId, onLogin, notify, lang]);

  const launchGooglePopup = () => {
    if (clientId && window.google?.accounts?.id) {
      try {
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            openSimulatedGooglePopup();
          }
        });
        return;
      } catch (e) {
        console.warn("GSI prompt fallback:", e);
      }
    }
    openSimulatedGooglePopup();
  };

  const openSimulatedGooglePopup = () => {
    const width = 500;
    const height = 620;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2.5;

    const popup = window.open(
      "about:blank",
      "GoogleAccountsSignIn",
      `width=${width},height=${height},left=${left},top=${top},status=0,toolbar=0,menubar=0,location=1,resizable=yes`
    );

    if (!popup) {
      notify?.("Popup was blocked. Please allow popups for localhost.");
      return;
    }

    const popupContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Sign in – Google Accounts</title>
  <link rel="icon" href="https://www.google.com/favicon.ico">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #ffffff; color: #202124; min-height: 100vh; display: flex; flex-direction: column; justify-content: space-between; }
    .card { width: 100%; max-width: 448px; margin: 36px auto auto; padding: 36px 40px 30px; border: 1px solid #dadce0; border-radius: 8px; }
    .logo { text-align: center; margin-bottom: 12px; }
    .logo svg { width: 44px; height: 44px; }
    h1 { font-size: 24px; font-weight: 400; text-align: center; color: #202124; margin-bottom: 6px; }
    .subtitle { font-size: 16px; color: #202124; text-align: center; }
    .app-tag { color: #1a73e8; font-weight: 500; }
    .account-list { margin-top: 26px; border-top: 1px solid #dadce0; }
    .account-item { display: flex; align-items: center; padding: 12px 14px; border-bottom: 1px solid #dadce0; cursor: pointer; transition: background 0.15s; border-radius: 4px; }
    .account-item:hover { background: #f8f9fa; }
    .avatar { width: 40px; height: 40px; border-radius: 50%; display: grid; place-items: center; color: white; font-weight: 600; font-size: 17px; margin-right: 14px; flex-shrink: 0; }
    .acc-details { flex: 1; overflow: hidden; }
    .acc-name { font-size: 14px; font-weight: 500; color: #3c4043; }
    .acc-email { font-size: 12px; color: #5f6368; margin-top: 2px; }
    .add-row { display: flex; align-items: center; padding: 14px; cursor: pointer; color: #1a73e8; font-size: 14px; font-weight: 500; border-bottom: 1px solid #dadce0; }
    .add-row:hover { background: #f8f9fa; }
    .add-icon { width: 32px; height: 32px; border-radius: 50%; background: #f1f3f4; display: grid; place-items: center; margin-right: 14px; color: #5f6368; }
    .disclaimer { font-size: 12px; color: #5f6368; line-height: 1.5; margin-top: 24px; }
    .disclaimer a { color: #1a73e8; text-decoration: none; }
    .footer { padding: 16px 40px; display: flex; justify-content: space-between; font-size: 12px; color: #5f6368; max-width: 448px; margin: 0 auto; width: 100%; }
    .footer a { color: #5f6368; text-decoration: none; margin-left: 18px; }
    .input-box { display: none; margin-top: 20px; }
    .input-field { width: 100%; padding: 13px 15px; border: 1px solid #dadce0; border-radius: 4px; font-size: 15px; margin-bottom: 14px; outline: none; }
    .input-field:focus { border-color: #1a73e8; box-shadow: 0 0 0 1px #1a73e8; }
    .btn-next { background: #1a73e8; color: #fff; border: 0; padding: 10px 24px; border-radius: 4px; font-weight: 500; font-size: 14px; float: right; cursor: pointer; }
    .btn-next:hover { background: #1557b0; }
    .btn-back { background: transparent; border: 0; color: #1a73e8; font-weight: 500; font-size: 14px; padding: 10px 0; cursor: pointer; }
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">
      <svg viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      </svg>
    </div>
    <h1>Choose an account</h1>
    <div class="subtitle">to continue to <span class="app-tag">JanSetuAI</span></div>

    <div id="accountListView">
      <div class="account-list">
        <div class="account-item" onclick="selectAcc('Namrata Sharma', 'namrata.sharma@gmail.com')">
          <div class="avatar" style="background:#4285f4;">N</div>
          <div class="acc-details">
            <div class="acc-name">Namrata Sharma</div>
            <div class="acc-email">namrata.sharma@gmail.com</div>
          </div>
        </div>

        <div class="account-item" onclick="selectAcc('Aryan Verma', 'aryan.verma@gmail.com')">
          <div class="avatar" style="background:#0f9d58;">A</div>
          <div class="acc-details">
            <div class="acc-name">Aryan Verma</div>
            <div class="acc-email">aryan.verma@gmail.com</div>
          </div>
        </div>

        <div class="add-row" onclick="openCustom()">
          <div class="add-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7.5" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
          </div>
          Use another account
        </div>
      </div>

      <div class="disclaimer">
        To continue, Google will share your name, email address, and profile picture with JanSetuAI.
      </div>
    </div>

    <div id="customInputView" class="input-box">
      <input id="inName" class="input-field" type="text" placeholder="Full name (e.g. Priyanshu Singh)" />
      <input id="inEmail" class="input-field" type="email" placeholder="Email (@gmail.com)" />
      <div style="overflow:hidden; margin-top:8px;">
        <button class="btn-back" type="button" onclick="closeCustom()">Back</button>
        <button class="btn-next" type="button" onclick="submitCustom()">Next</button>
      </div>
    </div>
  </div>

  <div class="footer">
    <div>English (India)</div>
    <div>
      <a href="#">Help</a>
      <a href="#">Privacy</a>
      <a href="#">Terms</a>
    </div>
  </div>

  <script>
    function selectAcc(name, email) {
      if (window.opener) {
        window.opener.postMessage({
          type: 'GOOGLE_POPUP_AUTH_SUCCESS',
          user: { name: name, email: email, provider: 'google' }
        }, '*');
      }
      window.close();
    }
    function openCustom() {
      document.getElementById('accountListView').style.display = 'none';
      document.getElementById('customInputView').style.display = 'block';
      document.getElementById('inName').focus();
    }
    function closeCustom() {
      document.getElementById('customInputView').style.display = 'none';
      document.getElementById('accountListView').style.display = 'block';
    }
    function submitCustom() {
      var name = document.getElementById('inName').value.trim() || 'Google User';
      var email = document.getElementById('inEmail').value.trim() || 'user@gmail.com';
      selectAcc(name, email);
    }
  </script>
</body>
</html>`;

    popup.document.open();
    popup.document.write(popupContent);
    popup.document.close();
  };

  const handleSaveClientId = (e) => {
    e.preventDefault();
    const cleanId = tempClientId.trim();
    setClientId(cleanId);
    if (cleanId) {
      localStorage.setItem("jansetu_google_client_id", cleanId);
      notify?.(lang === "हिन्दी" ? "Google OAuth Client ID सहेजा गया!" : "Google OAuth Client ID saved! Initializing Google Identity...");
    } else {
      localStorage.removeItem("jansetu_google_client_id");
      notify?.(lang === "हिन्दी" ? "Client ID हटाया गया।" : "Removed Client ID.");
    }
    setShowConfigModal(false);
  };

  return (
    <div className="authPage">
      <div className="tricolorBar"></div>
      
      <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 10 }}>
        <button className="lang" onClick={toggleLanguage} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: '8px 14px' }}>
          <Languages size={16} /> {lang}
        </button>
      </div>

      <div className="authShell">
        <div className="authBrand">
          <div className="brandEmblem" style={{ width: 44, height: 44, borderRadius: 14 }}>
            <Building2 size={22} />
          </div>
          <div className="brandInfo">
            <b>जनसेतु <span>JanSetu AI</span></b>
            <span className="brandSubtitle">{t("brandTag")}</span>
          </div>
        </div>
        <div className="loginCard">
          <div className="loginIcon"><Building2 size={28} /></div>
          <span className="kicker">{t("loginWelcome")}</span>
          <h1>{t("loginTitle1")}<br /><em>{t("loginTitle2")}</em></h1>
          <p>{t("loginDesc")}</p>

          <div
            ref={googleBtnContainerRef}
            style={{ display: gsiLoaded ? 'flex' : 'none', justifyContent: 'center', margin: '12px 0' }}
          />

          {!gsiLoaded && (
            <button className="googleBtn" onClick={launchGooglePopup}>
              <span className="googleG">G</span>
              {t("loginGoogle")}
            </button>
          )}

          <div className="divider"><span>or</span></div>
          <button className="guestBtn" onClick={() => onLogin({
            name: lang === "हिन्दी" ? "नागरिक (अतिथि)" : "Guest Citizen",
            email: "guest@jansetu.demo",
            provider: "guest",
            sub: "GUEST-DEMO-849102",
            email_verified: false,
            clientId: "local-guest-session",
            issuer: "JanSetu Local Demo Authority",
            loginTime: new Date().toLocaleString(),
            jwtRawSnippet: "LOCAL-DEMO-GUEST-BEARER-TOKEN"
          })}>
            {t("loginGuest")}
          </button>

          <div style={{ marginTop: '16px' }}>
            <button
              type="button"
              onClick={() => setShowConfigModal(true)}
              style={{ background: 'none', border: 0, color: '#62768e', fontSize: '11px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            >
              <Key size={12} /> {clientId ? (lang === "हिन्दी" ? "Google OAuth कॉन्फ़िगरेशन" : "Manage Google Cloud Client ID (Configured)") : (lang === "हिन्दी" ? "Google Client ID जोड़ें" : "Connect Google Cloud OAuth Client ID")}
            </button>
          </div>

          <small className="privacy">
            <ShieldCheck size={13} /> {t("loginPrivacy")}
          </small>
        </div>
        <div className="authFooter"><span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}><ShieldCheck size={14} color="var(--emerald)" /> {t("loginTagline")}</span></div>
      </div>

      {showConfigModal && (
        <div className="modalOverlay" onClick={() => setShowConfigModal(false)}>
          <div className="googleModal" onClick={e => e.stopPropagation()}>
            <button className="modalClose" onClick={() => setShowConfigModal(false)} aria-label="Close">
              <X size={18} />
            </button>

            <div className="googleHeader">
              <div className="googleLogoIcon"><span className="googleG">G</span></div>
              <div className="googleHeaderTitle">
                <h3>Google Cloud OAuth Configuration</h3>
                <p>Connect your official Google Identity Services Client ID</p>
              </div>
            </div>

            <form onSubmit={handleSaveClientId}>
              <p style={{ fontSize: '12px', color: '#8697aa', lineHeight: '1.5', margin: '0 0 14px' }}>
                To run the official Google-hosted sign-in popup directly on <code>accounts.google.com</code>, create an OAuth 2.0 Web Client in <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" style={{ color: 'var(--blue-light)' }}>Google Cloud Console</a> with Authorized JavaScript Origin: <code>http://localhost:5173</code>.
              </p>

              <div className="modalInputGroup">
                <label>Google Web Client ID</label>
                <input
                  type="text"
                  value={tempClientId}
                  onChange={e => setTempClientId(e.target.value)}
                  placeholder="e.g. 123456789-abc.apps.googleusercontent.com"
                  autoFocus
                />
              </div>

              <button type="submit" className="modalSubmitBtn">
                Save and Enable Official Google Sign-In
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function WelcomePage({user, onContinue, lang, t}){
  return (
    <div className="welcomePage">
      <div className="tricolorBar"></div>
      <div className="welcomeGrid">
        <div className="welcomeCopy">
          <div className="authBrand" style={{ justifyContent: 'flex-start', marginBottom: '24px' }}>
            <div className="brandEmblem" style={{ width: 44, height: 44, borderRadius: 14 }}>
              <Building2 size={22} />
            </div>
            <div className="brandInfo">
              <b>जनसेतु <span>JanSetu AI</span></b>
              <span className="brandSubtitle">{t("brandTag")}</span>
            </div>
          </div>
          <span className="kicker">{t("welcomeIn")}</span>
          <h1>{t("welcomeNamaste")} <em>{user?.name || (lang === "हिन्दी" ? "नागरिक" : "Citizen")}.</em></h1>
          <p>{t("welcomeDesc")}</p>
          <button className="primary welcomeBtn" onClick={onContinue}>
            {t("welcomeEnter")} <ArrowRight size={18} />
          </button>
        </div>

        <div className="welcomeDossierCard">
          <div className="dossierHeader">
            <div className="dossierAvatar">
              {user?.name ? user.name[0].toUpperCase() : "C"}
            </div>
            <div>
              <div className="dossierName">{user?.name || (lang === "हिन्दी" ? "नागरिक उपयोगकर्ता" : "Citizen User")}</div>
              <div className="dossierRole" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><CheckCircle2 size={12} color="var(--emerald)" /> {t("verifiedResident")}</div>
            </div>
          </div>

          <div className="dossierRow">
            <label>{lang === "हिन्दी" ? "प्रमाणीकरण प्रदाता:" : "Auth Channel:"}</label>
            <span>{user?.provider === "guest" ? t("guestMode") : t("googleVerified")}</span>
          </div>

          <div className="dossierRow">
            <label>{t("jurisdictionLabel")}:</label>
            <span>{t("allIndiaJurisdiction")}</span>
          </div>

          <div className="dossierRow">
            <label>{lang === "हिन्दी" ? "नागरिक सेवा स्तर (SLA):" : "Citizen SLA:"}</label>
            <span style={{ color: '#10b981' }}>24-48 Hours Target</span>
          </div>

          <div className="dossierRow">
            <label>{lang === "हिन्दी" ? "सक्रिय सेवाएं:" : "Active Portals:"}</label>
            <span>Grievances • 8 Schemes • 6 Certs</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrackerModal({record, onClose, lang, t, notify}){
  const [copied, setCopied] = useState(false);

  const copyId = () => {
    navigator.clipboard?.writeText(record.id);
    setCopied(true);
    notify?.(lang === "हिन्दी" ? "शिकायत नंबर कॉपी किया गया!" : "Reference ID copied to clipboard!");
    setTimeout(() => setCopied(false), 2200);
  };

  const isHi = lang === "हिन्दी";

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="acknowledgementTicket" onClick={e => e.stopPropagation()} style={{ width: 'min(680px, 94vw)', margin: 'auto' }}>
        <div className="ticketTopBar">
          <div className="ticketIdWrap">
            <span className="ticketIdLabel">{t("trackingRefLabel")}</span>
            <span className="ticketIdVal">
              {record.id}
              <button className="copyBtn" onClick={copyId}>
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? t("copiedBtn") : t("copyBtn")}
              </button>
            </span>
          </div>
          <button className="modalClose" onClick={onClose} style={{ position: 'static' }}>
            <X size={18} />
          </button>
        </div>

        <div className="ticketBody">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                background: record.currentStep === 4 ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
                color: record.currentStep === 4 ? '#34d399' : '#fbbf24',
                border: `1px solid ${record.currentStep === 4 ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                {record.currentStep === 4 ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                {isHi ? record.statusHi : record.status}
              </span>
            </div>
            <span style={{ fontSize: '11px', color: '#8da4be' }}>
              {record.date}
            </span>
          </div>

          <div className="ticketDetailsGrid">
            <div className="ticketDetailBox">
              <label>{t("categoryLabel")}</label>
              <span>{isHi ? record.categoryHi : record.category}</span>
            </div>
            <div className="ticketDetailBox">
              <label>{t("deptLabel")}</label>
              <span>{isHi ? record.deptHi : record.dept}</span>
            </div>
            <div className="ticketDetailBox" style={{ gridColumn: 'span 2' }}>
              <label>{t("locationLabel")}</label>
              <span>{record.location}</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="trackingProgress">
            <div className="trackingTitle">
              <span>{t("pipelineTitle")}</span>
              <span style={{ color: '#38bdf8' }}>{record.slaTarget}</span>
            </div>
            <div className="trackingTimeline">
              {record.timeline.map((item, idx) => (
                <div
                  key={idx}
                  className={`trackStep ${item.done ? 'active' : ''} ${record.currentStep === idx + 1 ? 'current' : ''}`}
                >
                  <div className="trackNode">{item.done ? <Check size={14} strokeWidth={3} /> : idx + 1}</div>
                  <div className="trackLabel">
                    <strong>{item.title}</strong>
                    <small style={{ display: 'block', color: '#6e8297', fontSize: '9px', marginTop: '2px' }}>
                      {item.time}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Officer Details */}
          <div style={{ background: '#0e2038', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '12px 14px', marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <span style={{ fontSize: '10px', textTransform: 'uppercase', color: '#73879e', letterSpacing: '1px', display: 'block' }}>
                {isHi ? "नियुक्त नोडल अधिकारी:" : "Designated Nodal Officer:"}
              </span>
              <strong style={{ fontSize: '13px', color: '#e5eff9', display: 'block', marginTop: '2px' }}>
                {record.officer}
              </strong>
            </div>
            <span style={{ fontSize: '11px', color: '#38bdf8', background: 'rgba(56,189,248,0.1)', border: '1px solid rgba(56,189,248,0.2)', padding: '4px 8px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <Phone size={12} /> {record.officerContact}
            </span>
          </div>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button className="primary" onClick={onClose} style={{ marginLeft: 0 }}>
              {isHi ? "बंद करें" : "Close Tracker"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsModal({isOpen, onClose, theme, toggleTheme, lang, toggleLanguage, smsAlerts, setSmsAlerts, mobilePhone, setMobilePhone, selectedWard, setSelectedWard, notify, t}){
  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("jansetu_sms_alerts", smsAlerts);
    localStorage.setItem("jansetu_phone", mobilePhone);
    localStorage.setItem("jansetu_ward", selectedWard);
    notify?.(lang === "हिन्दी" ? "सेटिंग्स सफलतापूर्वक सहेजी गईं!" : "Settings saved successfully!");
    onClose();
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="settingsModal" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="activityIconWrap">
              <Settings size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text-heading)' }}>{t("settingsTitle")}</h3>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--muted)' }}>{t("settingsSub")}</p>
            </div>
          </div>
          <button className="modalClose" onClick={onClose} aria-label="Close" style={{ position: 'static' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className="settingsSection" style={{ borderTop: 0, paddingTop: 0 }}>
            <span className="settingsSectionTitle">Appearance & Theme</span>
            <div className="settingsOptionRow">
              <div className="settingsOptionInfo">
                <strong>{theme === "dark" ? t("themeDark") : t("themeLight")}</strong>
                <small>{theme === "dark" ? "High-contrast dark civic theme" : "Clean daylight civic theme"}</small>
              </div>
              <button
                type="button"
                className="secondary"
                onClick={toggleTheme}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px' }}
              >
                {theme === "dark" ? <Sun size={15} color="#fbbf24" /> : <Moon size={15} color="#2563eb" />}
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </button>
            </div>

            <div className="settingsOptionRow">
              <div className="settingsOptionInfo">
                <strong>Language / भाषा</strong>
                <small>Current: {lang === "English" ? "English (Official)" : "हिन्दी (राजभाषा)"}</small>
              </div>
              <button
                type="button"
                className="secondary"
                onClick={toggleLanguage}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px' }}
              >
                <Languages size={15} />
                {lang === "English" ? "हिन्दी" : "English"}
              </button>
            </div>
          </div>

          <div className="settingsSection">
            <span className="settingsSectionTitle">Notifications & Citizen Alerts</span>
            <div className="settingsOptionRow">
              <div className="settingsOptionInfo">
                <strong>{t("smsAlertsLabel")}</strong>
                <small>{t("smsAlertsDesc")}</small>
              </div>
              <div
                className={`toggleSwitch ${smsAlerts ? 'active' : ''}`}
                onClick={() => setSmsAlerts(prev => !prev)}
                role="button"
                tabIndex={0}
              >
                <div className="toggleKnob"></div>
              </div>
            </div>

            <div style={{ marginTop: '12px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--muted)', marginBottom: '6px' }}>
                {t("phoneLabel")}
              </label>
              <div className="inputFake">
                <Phone size={16} />
                <input
                  type="text"
                  value={mobilePhone}
                  onChange={e => setMobilePhone(e.target.value)}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
          </div>

          <div className="settingsSection">
            <span className="settingsSectionTitle">Jurisdiction & Municipal Zone</span>
            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: 'var(--muted)', marginBottom: '6px' }}>
                {t("wardLabel")}
              </label>
              <select
                value={selectedWard}
                onChange={e => setSelectedWard(e.target.value)}
                style={{
                  width: '100%',
                  height: '46px',
                  background: 'var(--panel2)',
                  border: '1px solid var(--line)',
                  borderRadius: '10px',
                  color: 'var(--text)',
                  padding: '0 14px',
                  outline: 'none',
                  fontSize: '13px'
                }}
              >
                <option value="Ward 7 - Civil Lines / Central Zone">Ward 7 - Civil Lines / Central Zone</option>
                <option value="Ward 12 - South Municipal Corporation">Ward 12 - South Municipal Corporation</option>
                <option value="Ward 24 - Outer Ring Road / Urban Extension">Ward 24 - Outer Ring Road / Urban Extension</option>
                <option value="Ward 35 - East Zone / Jal Vihar">Ward 35 - East Zone / Jal Vihar</option>
                <option value="Ward 48 - Industrial & Rural Area">Ward 48 - Industrial & Rural Area</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" className="secondary" onClick={onClose}>
              {lang === "हिन्दी" ? "रद्द करें" : "Cancel"}
            </button>
            <button type="submit" className="primary" style={{ marginLeft: 0 }}>
              {t("saveSettings")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CitizenCredentialsModal({ user, onClose, lang, t, mobilePhone, selectedWard, grievancesCount, notify }) {
  const [copied, setCopied] = useState(false);
  const [showRawJson, setShowRawJson] = useState(false);

  const credentialsPayload = {
    name: user?.name || "Citizen User",
    email: user?.email || "N/A",
    provider: user?.provider || "google",
    google_subject_id: user?.sub || "GOOGLE-000000000000",
    email_verified: user?.email_verified ?? true,
    client_id: user?.clientId || "Configured via Google Cloud Console",
    token_issuer: user?.issuer || "https://accounts.google.com",
    registered_phone: mobilePhone,
    municipal_ward: selectedWard,
    active_grievances: grievancesCount,
    login_session: user?.loginTime || new Date().toLocaleString()
  };

  const handleCopyJson = () => {
    navigator.clipboard?.writeText(JSON.stringify(credentialsPayload, null, 2));
    setCopied(true);
    notify?.(lang === "हिन्दी" ? "नागरिक क्रेडेंशियल कॉपी किए गए!" : "Citizen credentials JSON copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="googleModal" style={{ maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <button className="modalClose" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        <div className="googleHeader">
          <div className="dossierAvatar" style={{ width: 48, height: 48, fontSize: '18px' }}>
            {user?.picture ? (
              <img src={user.picture} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%' }} />
            ) : (
              user?.name ? user.name[0].toUpperCase() : "C"
            )}
          </div>
          <div className="googleHeaderTitle">
            <h3>{lang === "हिन्दी" ? "नागरिक क्रेडेंशियल एवं पहचान दस्तावेज़" : "Citizen Identity & OAuth Credentials"}</h3>
            <p>{lang === "हिन्दी" ? "आधिकारिक Google व जनसेतु नागरिक प्रोफाइल विवरण" : "Verified Identity Services token & municipal records"}</p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '14px 0 18px', padding: '10px 14px', background: 'var(--panel2)', borderRadius: '10px', border: '1px solid var(--line)' }}>
          <ShieldCheck size={18} color="var(--emerald)" />
          <div style={{ fontSize: '12px', color: 'var(--text)' }}>
            <strong>{user?.provider === "guest" ? (lang === "हिन्दी" ? "अतिथि मोड सत्र" : "Guest Citizen Session") : (lang === "हिन्दी" ? "गूगल क्लाउड प्रमाणित निवासी" : "Google Cloud OAuth 2.0 Verified Resident")}</strong>
            <span style={{ display: 'block', fontSize: '11px', color: 'var(--muted)' }}>
              {user?.provider === "guest" ? "Temporary demo access" : "Identity cryptographically verified by accounts.google.com"}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className="dossierRow">
            <label>{lang === "हिन्दी" ? "पूरा नाम:" : "Full Name:"}</label>
            <strong style={{ color: 'var(--text-heading)' }}>{user?.name || "Citizen"}</strong>
          </div>

          <div className="dossierRow">
            <label>{lang === "हिन्दी" ? "ईमेल पता:" : "Email Address:"}</label>
            <strong style={{ color: 'var(--blue-light)', fontFamily: 'monospace' }}>{user?.email || "N/A"}</strong>
          </div>

          <div className="dossierRow">
            <label>{lang === "हिन्दी" ? "गूगल यूजर आईडी (sub):" : "Google Subject ID (sub):"}</label>
            <span style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--text-heading)' }}>{user?.sub || "N/A"}</span>
          </div>

          <div className="dossierRow">
            <label>{lang === "हिन्दी" ? "ईमेल सत्यापन:" : "Email Verified:"}</label>
            <span style={{ color: 'var(--emerald)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={13} /> {user?.email_verified ? "True (Verified by Google)" : "Demo Status"}
            </span>
          </div>

          <div className="dossierRow">
            <label>{lang === "हिन्दी" ? "पंजीकृत मोबाइल नंबर:" : "Registered Phone:"}</label>
            <strong style={{ color: 'var(--text-heading)' }}>{mobilePhone}</strong>
          </div>

          <div className="dossierRow">
            <label>{lang === "हिन्दी" ? "नगर निगम वार्ड व जोन:" : "Assigned Municipal Ward:"}</label>
            <strong style={{ color: 'var(--text-heading)' }}>{selectedWard}</strong>
          </div>

          <div className="dossierRow">
            <label>{lang === "हिन्दी" ? "कुल दर्ज शिकायतें:" : "Grievances Filed:"}</label>
            <span style={{ background: 'var(--blue)', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 700 }}>
              {grievancesCount}
            </span>
          </div>

          <div className="dossierRow">
            <label>{lang === "हिन्दी" ? "प्रमाणीकरण प्रदाता:" : "Auth Channel:"}</label>
            <span>{user?.provider === "google" ? "Google Identity Services (GSI)" : "Guest Session"}</span>
          </div>

          {user?.clientId && (
            <div className="dossierRow">
              <label>{lang === "हिन्दी" ? "गूगल क्लाइंट आईडी:" : "Google Client ID:"}</label>
              <span style={{ fontFamily: 'monospace', fontSize: '10px', color: 'var(--muted)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={user.clientId}>
                {user.clientId}
              </span>
            </div>
          )}

          {user?.loginTime && (
            <div className="dossierRow">
              <label>{lang === "हिन्दी" ? "लॉगिन समय:" : "Session Login Time:"}</label>
              <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{user.loginTime}</span>
            </div>
          )}
        </div>

        {showRawJson && (
          <div style={{ marginTop: '16px' }}>
            <label style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '1px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
              Raw Decoded Token Credentials
            </label>
            <pre style={{ background: '#0a101d', border: '1px solid var(--line)', borderRadius: '10px', padding: '12px', fontSize: '11px', color: '#38bdf8', overflowX: 'auto', maxHeight: '180px' }}>
              {JSON.stringify(credentialsPayload, null, 2)}
            </pre>
          </div>
        )}

        <div style={{ marginTop: '22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <button
            type="button"
            className="secondary"
            style={{ padding: '8px 12px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            onClick={() => setShowRawJson(r => !r)}
          >
            {showRawJson ? "Hide Raw JSON" : "Inspect Raw JSON"}
          </button>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="secondary"
              style={{ padding: '8px 14px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
              onClick={handleCopyJson}
            >
              <Copy size={13} /> {copied ? (lang === "हिन्दी" ? "कॉपी हो गया!" : "Copied!") : (lang === "हिन्दी" ? "क्रेडेंशियल कॉपी करें" : "Copy Credentials JSON")}
            </button>
            <button
              type="button"
              className="primary"
              style={{ padding: '8px 16px', fontSize: '12px', marginLeft: 0 }}
              onClick={onClose}
            >
              {lang === "हिन्दी" ? "बंद करें" : "Close"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MyGrievances({
  grievances,
  onAdvanceStage,
  onDeleteGrievance,
  onViewTracker,
  onLodgeNew,
  lang,
  t,
  notify
}) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return grievances.filter(g => {
      if (filter === "active" && (g.currentStep || 1) >= 4) return false;
      if (filter === "resolved" && (g.currentStep || 1) < 4) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesId = (g.id || "").toLowerCase().includes(q);
        const matchesCategory = (g.category || "").toLowerCase().includes(q) || (g.categoryHi || "").toLowerCase().includes(q);
        const matchesLocation = (g.location || "").toLowerCase().includes(q);
        const matchesDesc = (g.desc || "").toLowerCase().includes(q);
        return matchesId || matchesCategory || matchesLocation || matchesDesc;
      }
      return true;
    });
  }, [grievances, filter, search]);

  const activeCount = useMemo(() => grievances.filter(g => (g.currentStep || 1) < 4).length, [grievances]);
  const resolvedCount = useMemo(() => grievances.filter(g => (g.currentStep || 1) >= 4).length, [grievances]);

  return (
    <main className="page">
      <div className="pageTitle" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <span className="kicker">
            <ClipboardList size={13} style={{ marginRight: 5, verticalAlign: 'middle' }} />
            {lang === "हिन्दी" ? "नागरिक निवारण डेटाबेस" : "CITIZEN REDRESSAL DATABASE"}
          </span>
          <h1>{t("myGrievancesTitle")}</h1>
          <p>{t("myGrievancesSub")}</p>
        </div>
        <button className="primary" onClick={onLodgeNew} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 18px', borderRadius: '12px', fontWeight: 600 }}>
          <FileText size={16} /> {lang === "हिन्दी" ? "+ नई शिकायत दर्ज करें" : "+ Lodge New Grievance"}
        </button>
      </div>

      <div className="grievanceStatsGrid">
        <div className="grievanceStatCard">
          <div className="statCardIcon" style={{ background: 'var(--blue-subtle)', color: 'var(--blue-light)' }}>
            <ClipboardList size={22} />
          </div>
          <div className="statCardContent">
            <div className="statCardNum" style={{ color: 'var(--blue-light)' }}>{grievances.length}</div>
            <div className="statCardLabel">{lang === "हिन्दी" ? "कुल दर्ज शिकायतें" : "Total Grievances"}</div>
          </div>
        </div>

        <div className="grievanceStatCard">
          <div className="statCardIcon" style={{ background: 'rgba(245, 158, 11, 0.12)', color: 'var(--amber)' }}>
            <Clock size={22} />
          </div>
          <div className="statCardContent">
            <div className="statCardNum" style={{ color: 'var(--amber)' }}>{activeCount}</div>
            <div className="statCardLabel">{lang === "हिन्दी" ? "प्रगति पर (सक्रिय)" : "In Progress (Active)"}</div>
          </div>
        </div>

        <div className="grievanceStatCard">
          <div className="statCardIcon" style={{ background: 'rgba(16, 185, 129, 0.12)', color: 'var(--emerald)' }}>
            <CheckCircle2 size={22} />
          </div>
          <div className="statCardContent">
            <div className="statCardNum" style={{ color: 'var(--emerald)' }}>{resolvedCount}</div>
            <div className="statCardLabel">{lang === "हिन्दी" ? "समाधान संपन्न" : "Resolved & Closed"}</div>
          </div>
        </div>
      </div>

      <div className="grievanceFiltersRow">
        <div className="grievanceTabs">
          <button
            className={`grievanceTabBtn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            {t("filterAll")} ({grievances.length})
          </button>
          <button
            className={`grievanceTabBtn ${filter === "active" ? "active" : ""}`}
            onClick={() => setFilter("active")}
          >
            {t("filterActive")} ({activeCount})
          </button>
          <button
            className={`grievanceTabBtn ${filter === "resolved" ? "active" : ""}`}
            onClick={() => setFilter("resolved")}
          >
            {t("filterResolved")} ({resolvedCount})
          </button>
        </div>

        <div className="schemeSearch" style={{ maxWidth: '320px', margin: 0 }}>
          <Search size={15} />
          <input
            type="text"
            placeholder={lang === "हिन्दी" ? "शिकायत संख्या, श्रेणी या स्थान खोजें..." : "Search ID, category, or location..."}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', padding: 0 }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="emptyGrievancesCard">
          <div className="emptyGrievanceIcon">
            <ClipboardList size={34} />
          </div>
          <h3 style={{ margin: '0 0 8px', color: 'var(--text-heading)', fontSize: '18px' }}>
            {grievances.length === 0 ? t("noGrievancesYet") : (lang === "हिन्दी" ? "कोई शिकायत नहीं मिली" : "No Matching Grievances Found")}
          </h3>
          <p style={{ margin: '0 auto 20px', color: 'var(--muted)', maxWidth: '440px', fontSize: '13px', lineHeight: '1.5' }}>
            {grievances.length === 0
              ? t("noGrievancesDesc")
              : (lang === "हिन्दी" ? "खोजे गए शब्दों के लिए कोई रिकॉर्ड उपलब्ध नहीं है। कृपया फ़िल्टर बदलें।" : "No grievances match your search query or filter criteria.")}
          </p>
          <button className="primary" onClick={onLodgeNew}>
            <FileText size={16} /> {lang === "हिन्दी" ? "+ नई शिकायत दर्ज करें" : "+ Lodge a Grievance"}
          </button>
        </div>
      ) : (
        <div className="grievanceCardList">
          {filtered.map(item => {
            const isResolved = (item.currentStep || 1) >= 4;
            const categoryKey = ((item.category || "") + " " + (item.categoryHi || "")).toLowerCase();
            let iconId = "water";
            if (categoryKey.includes("road") || categoryKey.includes("pothole") || categoryKey.includes("सड़क") || categoryKey.includes("गड्ढे")) iconId = "roads";
            else if (categoryKey.includes("waste") || categoryKey.includes("garbage") || categoryKey.includes("कचरा") || categoryKey.includes("सफाई")) iconId = "waste";
            else if (categoryKey.includes("light") || categoryKey.includes("street") || categoryKey.includes("बिजली") || categoryKey.includes("लाइट")) iconId = "streetlight";

            return (
              <div className="myGrievanceCard" key={item.id}>
                <div className="grievanceCardHeader">
                  <div className="grievanceCardLeft">
                    <div className="grievanceCategoryIcon">
                      {getIssueIcon(iconId, 22)}
                    </div>
                    <div className="grievanceCardTitles">
                      <h3>{lang === "हिन्दी" ? item.categoryHi || item.category : item.category}</h3>
                      <p>{lang === "हिन्दी" ? item.deptHi || item.dept : item.dept}</p>
                    </div>
                  </div>

                  <div className="grievanceCardBadges">
                    <span
                      className="ticketPill"
                      title="Click to copy ID"
                      onClick={() => {
                        navigator.clipboard?.writeText(item.id);
                        notify(lang === "हिन्दी" ? "टिकट संख्या कॉपी की गई: " + item.id : "Ticket ID copied: " + item.id);
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      <Copy size={12} /> {item.id}
                    </span>

                    <span className={`statusPill ${isResolved ? 'resolved' : (item.currentStep > 1 ? 'inProgress' : 'routed')}`}>
                      {isResolved ? <CheckCircle2 size={13} /> : <Clock size={13} />}
                      {isResolved 
                        ? (lang === "हिन्दी" ? "समाधान संपन्न" : "Resolved") 
                        : (item.currentStep === 1 
                            ? (lang === "हिन्दी" ? "दर्ज की गई" : "Registered")
                            : (item.currentStep === 2 
                                ? (lang === "हिन्दी" ? "विभाग को प्रेषित" : "Routed to Dept")
                                : (lang === "हिन्दी" ? "स्थल निरीक्षण" : "Field Inspection")))}
                    </span>
                  </div>
                </div>

                <div className="grievanceCardBody">
                  <div className="grievanceDescBlock">
                    <p>{item.desc}</p>
                    <div className="grievanceLocationRow">
                      <MapPin size={14} color="var(--orange)" />
                      <span>{item.location}</span>
                    </div>
                    {item.photoName && (
                      <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--blue-light)', display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                        <Camera size={13} /> {item.photoName}
                      </div>
                    )}
                  </div>

                  <div className="grievanceMetaBlock">
                    <div>
                      <span>{lang === "हिन्दी" ? "दर्ज दिनांक: " : "Filed On: "}</span>
                      <strong>{item.date}</strong>
                    </div>
                    <div>
                      <span>{lang === "हिन्दी" ? "नोडल अधिकारी: " : "Nodal Officer: "}</span>
                      <strong>{item.officer}</strong>
                    </div>
                    <div>
                      <span>{lang === "हिन्दी" ? "हेल्पलाइन: " : "Contact: "}</span>
                      <strong style={{ color: 'var(--blue-light)' }}>{item.officerContact}</strong>
                    </div>
                    <div>
                      <span>{lang === "हिन्दी" ? "लक्ष्य समय सीमा: " : "SLA Timeline: "}</span>
                      <strong style={{ color: isResolved ? 'var(--emerald)' : 'var(--amber)' }}>{item.slaTarget}</strong>
                    </div>
                  </div>
                </div>

                <div className="grievanceCardFooter">
                  <div style={{ fontSize: '12px', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} />
                    <span>
                      {lang === "हिन्दी" ? `वर्तमान चरण: ${item.currentStep} / 4` : `Progress Stage: ${item.currentStep} of 4`}
                    </span>
                  </div>

                  <div className="grievanceActionBtns">
                    {!isResolved && (
                      <button
                        type="button"
                        className="simulateAdvanceBtn"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                        onClick={() => onAdvanceStage(item.id)}
                        title="Simulate advancing to next stage"
                      >
                        <ArrowRight size={13} />
                        {item.currentStep === 1 && (lang === "हिन्दी" ? "विभाग को भेजें" : "Route to Dept")}
                        {item.currentStep === 2 && (lang === "हिन्दी" ? "स्थल निरीक्षण शुरू करें" : "Deploy Inspection")}
                        {item.currentStep === 3 && (lang === "हिन्दी" ? "समाधान संपन्न करें" : "Mark Resolved")}
                      </button>
                    )}

                    <button
                      type="button"
                      className="secondary"
                      style={{ padding: '6px 12px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                      onClick={() => onViewTracker(item)}
                    >
                      <Search size={13} /> {t("viewDossier")}
                    </button>

                    <button
                      type="button"
                      className="secondary"
                      style={{ padding: '6px 10px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      onClick={() => window.print()}
                      title={t("downloadReceipt")}
                    >
                      <Printer size={13} />
                    </button>

                    <button
                      type="button"
                      className="secondary"
                      style={{ padding: '6px 10px', fontSize: '12px', color: 'var(--red)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                      onClick={() => onDeleteGrievance(item.id)}
                      title={t("withdrawGrievance")}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}

function Report({onBack, notify, lang, t, initialIssueId, onOpenDocs, onGrievanceCreated, onViewMyGrievances}){
  const [step, setStep] = useState(initialIssueId ? 2 : 1);
  const [type, setType] = useState(initialIssueId || "");
  const [location, setLocation] = useState("");
  const [desc, setDesc] = useState("");
  const [photo, setPhoto] = useState(null); // { file, url, name, size }
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [submittedTime, setSubmittedTime] = useState("");
  const [copied, setCopied] = useState(false);
  const [rating, setRating] = useState(0);
  const [pipelineStage, setPipelineStage] = useState(2);
  const [inspectedStep, setInspectedStep] = useState(2);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (initialIssueId) {
      setType(initialIssueId);
      setStep(2);
    }
  }, [initialIssueId]);

  const selectedIssue = issues.find(i => i.id === type);
  const selectedIssueText = selectedIssue ? (lang === "हिन्दी" ? selectedIssue.hi : selectedIssue.en) : null;

  const departmentMap = {
    water: lang === "हिन्दी" ? "जल बोर्ड / नगर निगम जलापूर्ति प्रभाग" : "Jal Board / Municipal Water Works Division",
    roads: lang === "हिन्दी" ? "लोक निर्माण विभाग (PWD) / सड़क अवसंरचना" : "Public Works Department (PWD) / Road Infrastructure",
    waste: lang === "हिन्दी" ? "नगर निगम ठोस अपशिष्ट एवं स्वच्छता ब्यूरो" : "Municipal Solid Waste & Sanitation Bureau",
    streetlight: lang === "हिन्दी" ? "विद्युत वितरण एवं स्ट्रीट लाइट प्रकोष्ठ" : "Electricity Supply & Street Lighting Cell",
    documents: lang === "हिन्दी" ? "नागरिक सुविधा केंद्र / राजस्व तहसीलदार" : "Citizen Service Center / Revenue Tehsildar",
    benefits: lang === "हिन्दी" ? "प्रत्यक्ष लाभ वितरण एवं समाज कल्याण प्रभाग" : "Direct Benefit Delivery & Social Welfare Division"
  };

  const handleCopyId = () => {
    if (!ticketId) return;
    navigator.clipboard.writeText(ticketId);
    setCopied(true);
    notify?.(t("copiedBtn") + ": " + ticketId);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const generatedId = "JAN-2026-" + Math.floor(100000 + Math.random() * 899999);
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setTicketId(generatedId);
      setSubmittedTime(timeStr);
      setIsSubmitting(false);
      setStep(4);
      setPipelineStage(2);
      setInspectedStep(2);

      const categoryName = selectedIssue?.en?.title || (type === "water" ? "Water Supply" : type === "roads" ? "Roads & Potholes" : type === "waste" ? "Waste Management" : type === "streetlight" ? "Street Lighting" : "Municipal Grievance");
      const categoryNameHi = selectedIssue?.hi?.title || (type === "water" ? "जल आपूर्ति" : type === "roads" ? "सड़क और गड्ढे" : type === "waste" ? "कचरा प्रबंधन" : type === "streetlight" ? "स्ट्रीट लाइट" : "नागरिक शिकायत");
      const deptName = departmentMap[type] || "Municipal Services Division";

      const newGrievanceRecord = {
        id: generatedId,
        category: categoryName,
        categoryHi: categoryNameHi,
        dept: deptName,
        deptHi: deptName,
        location: location.trim() || (lang === "हिन्दी" ? "वार्ड 7, केंद्रीय नगर क्षेत्र" : "Ward 7, Central Municipal Area"),
        desc: desc.trim() || (lang === "हिन्दी" ? "नागरिक पोर्टल के माध्यम से शिकायत दर्ज की गई।" : "Complaint registered via JanSetu AI Citizen Portal."),
        date: new Date().toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' }) + `, ${timeStr}`,
        status: "Routed to Dept",
        statusHi: "संबंधित प्रभाग को प्रेषित",
        currentStep: 2,
        slaTarget: "Target Completion: Within 24-48 hours",
        officer: "Er. Ramesh Verma (Executive Engineer, Jal Board)",
        officerContact: "1913 (Citizen Helpline)",
        photoName: photo ? photo.name : null,
        timeline: [
          { title: "Complaint Registered", time: timeStr, done: true },
          { title: "Routed to Department", time: "Dispatched", done: true },
          { title: "Field Inspection", time: "Pending", done: false },
          { title: "Resolution & Verification", time: "Pending", done: false }
        ]
      };

      onGrievanceCreated?.(newGrievanceRecord);
      notify?.((lang === "हिन्दी" ? "शिकायत सफलतापूर्वक दर्ज! नंबर: " : "Complaint registered! Reference: ") + generatedId);
    }, 700);
  };

  const handleResetReport = () => {
    setStep(1);
    setType("");
    setLocation("");
    setDesc("");
    setPhoto(null);
    setTicketId("");
    setRating(0);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        notify(lang === "हिन्दी" ? "कृपया एक मान्य फोटो फ़ाइल चुनें (JPG, PNG)" : "Please select an image file (JPG, PNG, WebP)");
        return;
      }
      const sizeStr = file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${(file.size / 1024).toFixed(0)} KB`;

      setPhoto({
        file,
        url: URL.createObjectURL(file),
        name: file.name,
        size: sizeStr
      });
      notify((lang === "हिन्दी" ? "फोटो संलग्न: " : "Photo selected: ") + file.name);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        notify(lang === "हिन्दी" ? "कृपया एक मान्य फोटो फ़ाइल डालें" : "Please drop an image file (JPG, PNG, WebP)");
        return;
      }
      const sizeStr = file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${(file.size / 1024).toFixed(0)} KB`;

      setPhoto({
        file,
        url: URL.createObjectURL(file),
        name: file.name,
        size: sizeStr
      });
      notify((lang === "हिन्दी" ? "फोटो जोड़ी गई: " : "Photo added: ") + file.name);
    }
  };

  const removePhoto = (e) => {
    if (e) e.stopPropagation();
    if (photo?.url) {
      URL.revokeObjectURL(photo.url);
    }
    setPhoto(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    notify(lang === "हिन्दी" ? "फोटो हटाई गई" : "Photo removed");
  };

  return (
    <main className="page">
      <div className="pageTitle">
        <button className="back" onClick={onBack}>← {t("backBtn")}</button>
        <span className="kicker">{t("reportIssueTitle")}</span>
        <h1>{step === 4 ? t("reportHeadDone") : t("reportHead1")}</h1>
        <p>{step === 4 ? t("reportSubDone") : t("reportSub1")}</p>
      </div>

      <div className="steps">
        <span className={step >= 1 ? "on" : ""}>{t("step1")}</span>
        <i></i>
        <span className={step >= 2 ? "on" : ""}>{t("step2")}</span>
        <i></i>
        <span className={step >= 3 ? "on" : ""}>{t("step3")}</span>
        <i></i>
        <span className={step >= 4 ? "on" : ""}>{t("step4")}</span>
      </div>

      <div className="formCard">
        {step === 1 && (
          <>
            <h2>{t("whatIsIssue")}</h2>
            <div className="choiceGrid">
              {/* Display all 6 categories cleanly */}
              {issues.map(i => {
                const iText = lang === "हिन्दी" ? i.hi : i.en;
                return (
                  <button className={type === i.id ? "selected" : ""} onClick={() => setType(i.id)} key={i.id}>
                    <b>{i.icon}</b>
                    <strong>{iText.title}</strong>
                    <small>{iText.desc}</small>
                  </button>
                );
              })}
            </div>
            <button className="primary" disabled={!type} onClick={() => setStep(2)}>
              {t("continueBtn")} <ArrowRight size={17} />
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2>{t("tellMore")}</h2>

            <label>{t("locationLabel")}</label>
            <div className="inputFake">
              <MapPin size={17} />
              <input
                value={location}
                onChange={e => setLocation(e.target.value)}
                placeholder={t("locationPlaceholder")}
              />
            </div>

            <label>{t("descLabel")}</label>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder={t("descPlaceholder")}
            ></textarea>

            <label>{t("photoLabel")}</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            {!photo ? (
              <div
                className={`upload ${isDragging ? "dragover" : ""}`}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
              >
                <div className="uploadIconWrap">
                  <Camera size={20} />
                </div>
                <div className="uploadText">
                  <strong>{t("addPhotoTitle")}</strong>
                  <small>{t("addPhotoSub")}</small>
                </div>
                <button type="button" className="uploadBtn" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>
                  {t("chooseFile")}
                </button>
              </div>
            ) : (
              <div className="photoPreviewCard">
                <img src={photo.url} alt="Attached issue" className="photoThumbnail" />
                <div className="photoMeta">
                  <div className="photoName">{photo.name}</div>
                  <div className="photoSize">{photo.size} • {t("photoAttached")}</div>
                </div>
                <button type="button" className="removePhotoBtn" onClick={removePhoto}>
                  <Trash2 size={13} /> {t("remove")}
                </button>
              </div>
            )}

            <div className="rowBtns">
              <button className="secondary" onClick={() => setStep(1)}>{t("backBtn")}</button>
              <button className="primary" onClick={() => setStep(3)}>{t("reviewReportBtn")} <ArrowRight size={17} /></button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2>{t("reviewTitle")}</h2>
            <p style={{ fontSize: '13px', color: '#8ba0b8', marginTop: '-6px', marginBottom: '20px' }}>
              {t("reviewSub")}
            </p>

            <div className="reviewSummary" style={{ maxWidth: '100%', margin: '0 0 24px' }}>
              <div className="reviewRow">
                <span className="reviewLabel">{t("categoryLabel")}</span>
                <span className="reviewValue">{selectedIssue?.icon} {selectedIssueText?.title || "Civic Issue"}</span>
              </div>
              <div className="reviewRow">
                <span className="reviewLabel">{t("targetDeptLabel")}</span>
                <span className="reviewValue" style={{ color: 'var(--cyan)' }}>{departmentMap[type] || "Municipal Civic Works"}</span>
              </div>
              <div className="reviewRow">
                <span className="reviewLabel">{t("locationLabel")}</span>
                <span className="reviewValue">{location.trim() || (lang === "हिन्दी" ? "नागरिक द्वारा दर्ज" : "Area provided by citizen")}</span>
              </div>
              <div className="reviewRow">
                <span className="reviewLabel">{t("descLabel")}</span>
                <span className="reviewValue">{desc.trim() || (lang === "हिन्दी" ? "मानक नागरिक शिकायत" : "Standard civic grievance report")}</span>
              </div>
              <div className="reviewRow">
                <span className="reviewLabel">{t("evidenceLabel")}</span>
                <span className="reviewValue">
                  {photo ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
                      <img src={photo.url} alt="Evidence" className="reviewPhotoPreview" />
                      <span style={{ fontSize: '11px', color: 'var(--cyan)' }}>{photo.name}</span>
                    </div>
                  ) : (
                    <span style={{ color: '#6e8095' }}>{lang === "हिन्दी" ? "कोई फोटो संलग्न नहीं" : "None attached"}</span>
                  )}
                </span>
              </div>
            </div>

            <div className="rowBtns">
              <button className="secondary" onClick={() => setStep(2)}>← {t("backBtn")}</button>
              <button className="primary" onClick={handleFinalSubmit} disabled={isSubmitting}>
                {isSubmitting ? t("registeringBtn") : t("confirmSubmitBtn")} <ArrowRight size={17} />
              </button>
            </div>
          </>
        )}

        {step === 4 && (
          <div className="submittedContainer">
            <div className="submittedIconGlow">
              <CheckCircle2 size={50} strokeWidth={2.4} />
            </div>

            <span className="kicker" style={{ letterSpacing: '2px' }}>{t("submittedKicker")}</span>
            <h2>{t("submittedH2")}</h2>
            <p className="subLead">{t("submittedLead")}</p>

            <div className="acknowledgementTicket">
              <div className="ticketTopBar">
                <div className="ticketIdWrap">
                  <span className="ticketIdLabel">{t("trackingRefLabel")}</span>
                  <span className="ticketIdVal">
                    {ticketId}
                    <button className="copyBtn" onClick={handleCopyId}>
                      {copied ? <Check size={12} color="var(--cyan)" /> : <Copy size={12} />}
                      {copied ? t("copiedBtn") : t("copyBtn")}
                    </button>
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span className="ticketIdLabel">{t("timestampLabel")}</span>
                  <div style={{ fontSize: '13px', color: '#cce0f5', fontWeight: 600, marginTop: '2px' }}>
                    {t("todayTime")} {submittedTime}
                  </div>
                </div>
              </div>

              <div className="ticketBody">
                <div className="ticketDetailsGrid">
                  <div className="ticketDetailBox">
                    <label>{t("deptLabel")}</label>
                    <span>{departmentMap[type] || "Municipal Civic Works"}</span>
                  </div>
                  <div className="ticketDetailBox">
                    <label>{t("slaLabel")}</label>
                    <span>{t("slaVal")}</span>
                  </div>
                  <div className="ticketDetailBox">
                    <label>{t("locationLabel")}</label>
                    <span>{location.trim() || (lang === "हिन्दी" ? "मोहल्ला / क्षेत्र दर्ज" : "Locality Provided")}</span>
                  </div>
                  <div className="ticketDetailBox">
                    <label>{t("evidenceLabel")}</label>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                      {photo ? <><Camera size={13} color="var(--blue-light)" /> 1 Photo ({photo.name})</> : (lang === "हिन्दी" ? "कोई फोटो नहीं" : "No photo attached")}
                    </span>
                  </div>
                </div>

                <div className="trackingProgress">
                  <div className="trackingTitle">
                    <span>{t("pipelineTitle")}</span>
                    <span style={{ color: 'var(--blue-light)', textTransform: 'none', fontWeight: 600 }}>
                      {lang === "हिन्दी" ? `चरण ${pipelineStage} / 4 (${pipelineStage === 4 ? "समाधान संपन्न" : "प्रगति पर"})` : `Stage ${pipelineStage} of 4 (${pipelineStage === 4 ? "Resolved" : "In Progress"})`}
                    </span>
                  </div>
                  <div className="trackingTimeline">
                    {[1, 2, 3, 4].map(sNum => {
                      const isCompleted = sNum < pipelineStage;
                      const isCurrent = sNum === pipelineStage;
                      const isSelected = inspectedStep === sNum;
                      const labels = {
                        1: t("stepRegistered"),
                        2: t("stepRouted"),
                        3: t("stepInspection"),
                        4: t("stepResolved")
                      };

                      return (
                        <div
                          key={sNum}
                          className={`trackStep ${isCompleted ? 'active' : ''} ${isCurrent ? 'current' : ''} ${isSelected ? 'selectedPreview' : ''}`}
                          onClick={() => setInspectedStep(sNum)}
                          title={`Click to view Stage ${sNum} details`}
                        >
                          <div className="trackNode">
                            {isCompleted ? <Check size={14} strokeWidth={3} /> : (isCurrent ? <Clock size={14} /> : sNum)}
                          </div>
                          <div className="trackLabel">{labels[sNum]}</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Stage Inspector Detail Box */}
                  <div className="pipelineStageCard">
                    <div className="pipelineStageIcon">
                      {inspectedStep === 1 && <CheckCircle2 size={18} />}
                      {inspectedStep === 2 && <Clock size={18} />}
                      {inspectedStep === 3 && <MapPin size={18} />}
                      {inspectedStep === 4 && <ShieldCheck size={18} />}
                    </div>
                    <div className="pipelineStageInfo">
                      <strong>
                        {inspectedStep === 1 && (lang === "हिन्दी" ? "चरण 1: शिकायत आधिकारिक रूप से दर्ज" : "Stage 1: Grievance Registered & Timestamped")}
                        {inspectedStep === 2 && (lang === "हिन्दी" ? "चरण 2: संबंधित विभाग को कार्य आदेश जारी" : "Stage 2: Routed to Executive Engineer")}
                        {inspectedStep === 3 && (lang === "हिन्दी" ? "चरण 3: स्थल निरीक्षण एवं उपकरण दस्ता रवाना" : "Stage 3: Field Inspection Squad Dispatched")}
                        {inspectedStep === 4 && (lang === "हिन्दी" ? "चरण 4: समस्या का पूर्ण समाधान एवं सत्यापन" : "Stage 4: Problem Resolved & Verified")}
                      </strong>
                      <p>
                        {inspectedStep === 1 && (lang === "हिन्दी" ? `डिजिटल शिकायत केंद्रीय नगर निगम डेटाबेस में दर्ज हो गई है। जीपीएस लैंडमार्क एवं फोटो प्रमाण संलग्न हैं।` : `Grievance registered in Central Municipal Registry. Reference ID ${ticketId} generated. Geotagging & photo evidence verified.`)}
                        {inspectedStep === 2 && (lang === "हिन्दी" ? `कार्य आदेश #WO-492 जारी कर ${departmentMap[type] || 'नगर निगम'} के अधिशासी अभियंता को भेजा गया। समय सीमा: 24-48 घंटे।` : `Work Order #WO-492 assigned to ${departmentMap[type] || 'Municipal Works'}. Designated SLA resolution window: 24–48 working hours.`)}
                        {inspectedStep === 3 && (lang === "हिन्दी" ? `क्षेत्रीय निरीक्षण दल आवश्यक मशीनरी और तकनीकी कर्मियों के साथ ${location || 'स्थल'} के लिए रवाना हुआ। स्थल परीक्षण जारी है।` : `Municipal field inspection squad deployed to ${location || 'reported site'} with repair machinery. Safety perimeter established.`)}
                        {inspectedStep === 4 && (lang === "हिन्दी" ? `क्षेत्रीय जोनल पर्यवेक्षक द्वारा मरम्मत कार्य का भौतिक सत्यापन संपन्न हुआ। नागरिक संतुष्टि फीडबैक कॉल शेड्यूल है।` : `Repair works completed on-site. Verified by Zonal Quality Inspector. Citizen satisfaction callback scheduled.`)}
                      </p>
                    </div>
                  </div>

                  {/* Interactive Simulation Controls */}
                  <div className="pipelineSimulationRow">
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                      {pipelineStage < 4 ? (
                        <button
                          type="button"
                          className="simulateAdvanceBtn"
                          onClick={() => {
                            const next = pipelineStage + 1;
                            setPipelineStage(next);
                            setInspectedStep(next);
                            notify(lang === "हिन्दी" ? `प्रगति अपडेट: चरण ${next} शुरू हुआ!` : `Live Status Updated: Stage ${next} initiated!`);
                          }}
                        >
                          <ArrowRight size={14} />
                          {pipelineStage === 2 
                            ? (lang === "हिन्दी" ? "सिमुलेशन: स्थल निरीक्षण शुरू करें" : "Simulate: Begin Field Inspection (Step 3)")
                            : (lang === "हिन्दी" ? "सिमुलेशन: कार्य पूर्ण करें (हल हुआ)" : "Simulate: Mark Issue Resolved (Step 4)")}
                        </button>
                      ) : (
                        <span style={{ fontSize: '12px', color: 'var(--emerald)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                          <CheckCircle2 size={16} /> {lang === "हिन्दी" ? "शिकायत का पूर्ण निस्तारण संपन्न!" : "Grievance Fully Resolved & Closed!"}
                        </span>
                      )}

                      <button
                        type="button"
                        className="secondary"
                        style={{ padding: '8px 12px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        onClick={() => {
                          notify(lang === "हिन्दी" ? "अलर्ट: पंजीकृत मोबाइल पर एसएमएस भेजा गया!" : "SMS update sent to registered phone!");
                        }}
                      >
                        <Bell size={14} /> {t("sendTestAlert")}
                      </button>

                      <button
                        type="button"
                        className="secondary"
                        style={{ padding: '8px 12px', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        onClick={() => window.print()}
                      >
                        <Printer size={14} /> {t("downloadReceipt")}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="updateNoticeBox">
                  <div className="updateNoticeIcon">
                    <Bell size={20} />
                  </div>
                  <div className="updateNoticeText">
                    <strong>{t("updateNoticeTitle")}</strong> {t("updateNoticeDesc")}
                  </div>
                </div>

                {/* Rating feedback */}
                <div className="ratingContainer">
                  <span style={{ fontSize: '12px', color: '#8da1b6' }}>{t("rateExperience")}</span>
                  <div className="ratingStars">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        className="starBtn"
                        onClick={() => {
                          setRating(star);
                          notify(lang === "हिन्दी" ? `धन्यवाद! आपने ${star} स्टार रेटिंग दी।` : `Thank you! Rated ${star} stars.`);
                        }}
                      >
                        <Star size={18} fill={star <= rating ? "#f59e0b" : "none"} color={star <= rating ? "#f59e0b" : "var(--muted)"} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="submittedActions">
              <button className="secondary" onClick={handleResetReport}>
                <RefreshCw size={15} /> {t("reportAnotherBtn")}
              </button>
              {onViewMyGrievances && (
                <button
                  className="secondary"
                  style={{ borderColor: 'var(--blue)', color: 'var(--blue-light)', fontWeight: 600 }}
                  onClick={onViewMyGrievances}
                >
                  <ClipboardList size={15} /> {t("viewInMyGrievances")}
                </button>
              )}
              <button className="primary" onClick={onBack}>
                {t("returnHomeBtn")} <ArrowRight size={17} />
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function Help({chat, message, setMessage, sendMessage, onAction, lang, t}){
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const chipsEn = [
    { text: "Water pipe leakage on road", icon: <Droplets size={13} color="var(--blue-light)" /> },
    { text: "Pothole complaint near market", icon: <Route size={13} color="#fbbf24" /> },
    { text: "How to apply for PM-KISAN?", icon: <Sprout size={13} color="var(--emerald)" /> },
    { text: "Ayushman Bharat card eligibility", icon: <HeartPulse size={13} color="#f43f5e" /> },
    { text: "Income certificate required documents", icon: <FileText size={13} color="var(--cyan)" /> },
    { text: "Street light not working", icon: <Lightbulb size={13} color="#eab308" /> }
  ];

  const chipsHi = [
    { text: "सड़क पर पानी का रिसाव", icon: <Droplets size={13} color="var(--blue-light)" /> },
    { text: "मुख्य मार्ग पर गड्ढे की शिकायत", icon: <Route size={13} color="#fbbf24" /> },
    { text: "पीएम-किसान योजना में आवेदन कैसे करें?", icon: <Sprout size={13} color="var(--emerald)" /> },
    { text: "आयुष्मान भारत कार्ड की पात्रता", icon: <HeartPulse size={13} color="#f43f5e" /> },
    { text: "आय प्रमाण पत्र के लिए आवश्यक दस्तावेज़", icon: <FileText size={13} color="var(--cyan)" /> },
    { text: "स्ट्रीट लाइट 3 दिन से बंद है", icon: <Lightbulb size={13} color="#eab308" /> }
  ];

  const chips = lang === "हिन्दी" ? chipsHi : chipsEn;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const handleStartVoice = () => {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      alert(lang === "हिन्दी" ? "आपके ब्राउज़र में वॉइस इनपुट उपलब्ध नहीं है। Chrome या Edge का उपयोग करें।" : "Speech Recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    try {
      const recognition = new SpeechRec();
      recognition.lang = lang === "हिन्दी" ? "hi-IN" : "en-IN";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        if (transcript) {
          setMessage(transcript);
          sendMessage(transcript);
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.warn("Speech API start error:", err);
      setIsListening(false);
    }
  };

  return (
    <main className="page helpPage">
      <div className="pageTitle">
        <span className="kicker">JANSETU AI CO-PILOT</span>
        <h1>{t("helpTitle")}</h1>
        <p>{t("helpDesc")}</p>
      </div>

      <div className="chat">
        <div className="chatHead">
          <div className="aiBadge"><Bot size={20} /></div>
          <div>
            <b>{lang === "हिन्दी" ? "जनसेतु एआई नागरिक सहायक" : "JanSetuAI Civic Co-pilot"}</b>
            <small>{lang === "हिन्दी" ? "ऑनलाइन • रीयल-टाइम समाधान" : "Online • Real-time Guidance"}</small>
          </div>
          <button 
            type="button" 
            onClick={() => setMessage("")} 
            title="Clear input"
            style={{ marginLeft: 'auto', background: 'none', border: 0, color: '#718498', fontSize: '11px', cursor: 'pointer' }}
          >
            Clear
          </button>
        </div>

        <div className="messages">
          {chat.map((m, i) => (
            <div className={`bubble ${m.from}`} key={i}>
              <div>{m.text}</div>
              {m.action && (
                <button 
                  type="button" 
                  className="chatActionBtn" 
                  onClick={() => onAction(m.action)}
                >
                  {m.action.label}
                </button>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="chatChipsContainer">
          {chips.map((chip, idx) => (
            <button
              key={idx}
              type="button"
              className="chatChip"
              onClick={() => sendMessage(chip.text)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              {chip.icon}
              <span>{chip.text}</span>
            </button>
          ))}
        </div>

        <div className="chatInput">
          <button 
            type="button" 
            className={isListening ? "micListeningBtn" : ""}
            onClick={handleStartVoice} 
            title={isListening ? "Listening..." : "Click to speak"}
          >
            <Mic size={18} />
          </button>
          
          <input
            value={message}
            onChange={e => setMessage(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder={isListening ? (lang === "हिन्दी" ? "सुन रहा हूँ... बोलिए" : "Listening... speak now") : t("helpPlaceholder")}
          />
          
          <button type="button" onClick={() => sendMessage()} title="Send message">
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
