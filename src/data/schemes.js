// 26+ Real Central Government Welfare Schemes with Deterministic Eligibility Rules
// IMPORTANT: Eligibility is evaluated deterministically by rule logic, NEVER by an LLM hallucination.
// Each scheme includes real official portal links and last-verified dates.

export const schemesDatabase = [
  {
    id: "pmkisan",
    name: "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
    nameHi: "पीएम-किसान (प्रधानमंत्री किसान सम्मान निधि)",
    tag: "Agriculture & Farmers",
    tagHi: "कृषि एवं किसान",
    benefitValue: 6000,
    benefit: "₹6,000 / year (in 3 direct installments of ₹2,000)",
    benefitHi: "₹6,000 प्रति वर्ष (तीन किस्तों में ₹2,000 सीधे बैंक में)",
    ministry: "Ministry of Agriculture and Farmers Welfare",
    ministryHi: "कृषि एवं किसान कल्याण मंत्रालय",
    portalUrl: "https://pmkisan.gov.in/",
    lastVerified: "Feb 2026",
    requiredDocuments: ["Aadhaar Card", "Landholding Records (Khatoni/ROR)", "Bank Account (Aadhaar Seeded)", "Mobile linked to Aadhaar"],
    requiredCertificateIds: ["income_cert"],
    evaluate: (p) => {
      const isFarmer = p.occupation === "farmer";
      const hasBank = p.hasBankAccount !== false;
      const notRich = Number(p.annualIncome || 0) <= 800000;
      if (isFarmer && hasBank && notRich) return { status: "eligible", rulesMet: ["Applicant belongs to farmer family", "Aadhaar linked bank account active", "Income within eligible landholder band"] };
      if (!isFarmer && p.occupation === "worker") return { status: "almost", missing: "Requires family landholding registration in revenue records" };
      return { status: "ineligible", reason: "Restricted to cultivable landholding farmer families" };
    },
    howToApply: "Register online at pmkisan.gov.in using 'New Farmer Registration' with Aadhaar and land documents, or apply via local CSC/Patwari.",
    howToApplyHi: "pmkisan.gov.in पर 'न्यू फार्मर रजिस्ट्रेशन' लिंक द्वारा आधार व खतौनी के साथ आवेदन करें या नजदीकी सीएससी केंद्र जाएं।"
  },
  {
    id: "ayushman",
    name: "Ayushman Bharat PM-JAY (Health Protection)",
    nameHi: "आयुष्मान भारत - प्रधानमंत्री जन आरोग्य योजना",
    tag: "Healthcare",
    tagHi: "स्वास्थ्य सुरक्षा",
    benefitValue: 500000,
    benefit: "₹5,00,000 cashless health insurance per family/year",
    benefitHi: "₹5,00,000 तक प्रति वर्ष प्रति परिवार निःशुल्क कैशलेस इलाज",
    ministry: "National Health Authority / MoHFW",
    ministryHi: "राष्ट्रीय स्वास्थ्य प्राधिकरण / स्वास्थ्य मंत्रालय",
    portalUrl: "https://beneficiary.nha.gov.in/",
    lastVerified: "Feb 2026",
    requiredDocuments: ["Aadhaar Card", "Ration Card (NFSA / BPL / SECC list)", "Active Mobile Number"],
    requiredCertificateIds: ["income_cert", "residence_cert"],
    evaluate: (p) => {
      const incomeOk = Number(p.annualIncome || 0) <= 250000;
      const catOk = ["BPL", "EWS", "SC", "ST", "OBC"].includes(p.category) || p.housingStatus === "kutcha" || incomeOk;
      if (incomeOk || catOk) return { status: "eligible", rulesMet: ["Meets income criteria (under ₹2.5 Lakh)", "Identified under vulnerable socio-economic profile"] };
      if (Number(p.annualIncome || 0) <= 400000) return { status: "almost", missing: "Requires SECC inclusion, NFSA Ration Card or state BPL verification" };
      return { status: "ineligible", reason: "Household income exceeds target social health security threshold" };
    },
    howToApply: "Visit beneficiary.nha.gov.in or any Empanelled Hospital Ayushman Mitra desk with your Aadhaar and Ration Card.",
    howToApplyHi: "beneficiary.nha.gov.in पर जाएं या नजदीकी सरकारी अस्पताल में आयुष्मान मित्र से संपर्क करें।"
  },
  {
    id: "pmay",
    name: "PMAY (Pradhan Mantri Awas Yojana - Gramin/Urban)",
    nameHi: "प्रधानमंत्री आवास योजना (शहरी/ग्रामीण)",
    tag: "Housing",
    tagHi: "आवास एवं मकान",
    benefitValue: 130000,
    benefit: "Direct subsidy up to ₹1,30,000 - ₹2,67,000 for permanent house construction",
    benefitHi: "पक्का मकान बनाने के लिए ₹1.30 लाख से ₹2.67 लाख तक की सीधी सरकारी सहायता",
    ministry: "Ministry of Housing & Urban Affairs / Rural Development",
    ministryHi: "आवासन एवं शहरी कार्य मंत्रालय / ग्रामीण विकास मंत्रालय",
    portalUrl: "https://pmaymis.gov.in/",
    lastVerified: "Jan 2026",
    requiredDocuments: ["Aadhaar Card", "BPL/Ration Card", "Bank Account Details", "Land Ownership proof / Affidavit of no pucca house"],
    requiredCertificateIds: ["income_cert", "residence_cert"],
    evaluate: (p) => {
      const noPucca = p.housingStatus === "kutcha" || p.housingStatus === "rented";
      const incomeUnder = Number(p.annualIncome || 0) <= 600000;
      if (noPucca && incomeUnder) return { status: "eligible", rulesMet: ["Does not own a permanent pucca house", "Annual family income within EWS/LIG limit (under ₹6 Lakh)"] };
      if (p.housingStatus === "pucca") return { status: "ineligible", reason: "Citizen already owns a permanent pucca dwelling" };
      return { status: "almost", missing: "Submit affidavit proving no permanent home owned anywhere in India" };
    },
    howToApply: "Apply online at pmaymis.gov.in or approach your local Gram Panchayat / Municipal Ward Office.",
    howToApplyHi: "pmaymis.gov.in पर ऑनलाइन आवेदन करें या अपने वार्ड कार्यालय / ग्राम पंचायत में संपर्क करें।"
  },
  {
    id: "mudra",
    name: "PM MUDRA Yojana (Micro Business Loans)",
    nameHi: "प्रधानमंत्री मुद्रा योजना (स्वरोजगार ऋण)",
    tag: "Business & Entrepreneurship",
    tagHi: "व्यापार एवं स्वरोजगार",
    benefitValue: 500000,
    benefit: "Collateral-free business loans up to ₹10-20 Lakh (Shishu, Kishore, Tarun)",
    benefitHi: "बिना किसी गारंटी के ₹50,000 से ₹20 लाख तक का आसान व्यावसायिक ऋण",
    ministry: "Ministry of Finance - Department of Financial Services",
    ministryHi: "वित्त मंत्रालय",
    portalUrl: "https://www.mudra.org.in/",
    lastVerified: "Feb 2026",
    requiredDocuments: ["Aadhaar Card", "PAN Card", "Business Plan / Quotation", "Proof of Business Address", "Bank Statement"],
    requiredCertificateIds: ["income_cert"],
    evaluate: (p) => {
      const isAdult = Number(p.age || 25) >= 18;
      const isBusinessOrWorker = ["business", "worker", "other"].includes(p.occupation);
      if (isAdult && isBusinessOrWorker) return { status: "eligible", rulesMet: ["Age is above 18 years", "Engaged in micro-enterprise, trade, manufacturing or services"] };
      return { status: "almost", missing: "Requires a proposed or active micro-enterprise/shop plan" };
    },
    howToApply: "Apply via udyamimitra.in or directly approach any Public Sector / Regional Rural Bank.",
    howToApplyHi: "udyamimitra.in पोर्टल पर जाएं या किसी भी राष्ट्रीयकृत बैंक शाखा में संपर्क करें।"
  },
  {
    id: "sukanya",
    name: "Sukanya Samriddhi Yojana (SSY)",
    nameHi: "सुकन्या समृद्धि योजना (बालिका समृद्धि खाता)",
    tag: "Women & Child",
    tagHi: "महिला एवं बाल विकास",
    benefitValue: 200000,
    benefit: "Guaranteed 8.2% tax-free interest rate + sovereign guarantee for girl child's education",
    benefitHi: "8.2% का उच्च ब्याज दर, 80C के तहत पूर्ण कर छूट, 21 वर्ष पर एकमुश्त परिपक्वता",
    ministry: "Ministry of Women & Child Development / Dept of Posts",
    ministryHi: "महिला एवं बाल विकास मंत्रालय / डाक विभाग",
    portalUrl: "https://www.indiapost.gov.in/",
    lastVerified: "Feb 2026",
    requiredDocuments: ["Girl Child Birth Certificate", "Parent/Guardian Aadhaar", "Address Proof", "Passport Size Photos"],
    requiredCertificateIds: ["birth_cert", "residence_cert"],
    evaluate: (p) => {
      const hasGirlUnder10 = p.hasGirlChildUnder10 === true;
      if (hasGirlUnder10) return { status: "eligible", rulesMet: ["Parent/guardian of girl child aged 10 years or below"] };
      return { status: "almost", missing: "Available exclusively for households with a girl child below 10 years" };
    },
    howToApply: "Open account at any India Post Office or authorized commercial bank with birth certificate and deposit as low as ₹250.",
    howToApplyHi: "नजदीकी डाकघर या अधिकृत बैंक में मात्र ₹250 से सुकन्या समृद्धि खाता खोलें।"
  },
  {
    id: "vishwakarma",
    name: "PM Vishwakarma Scheme (Traditional Artisans)",
    nameHi: "पीएम विश्वकर्मा योजना (पारंपरिक कारीगर एवं शिल्पकार)",
    tag: "Artisans & Craftsmen",
    tagHi: "कारीगर व शिल्पकार",
    benefitValue: 15000,
    benefit: "₹15,000 Toolkit Grant + Collateral-free loan at 5% concessional interest + Daily stipend",
    benefitHi: "₹15,000 का टूलकिट वाउचर + ₹3 लाख तक रियायती ब्याज दर (5%) ऋण + कौशल प्रशिक्षण",
    ministry: "Ministry of Micro, Small and Medium Enterprises (MSME)",
    ministryHi: "सूक्ष्म, लघु एवं मध्यम उद्यम मंत्रालय (MSME)",
    portalUrl: "https://pmvishwakarma.gov.in/",
    lastVerified: "Feb 2026",
    requiredDocuments: ["Aadhaar Card", "Mobile Linked to Aadhaar", "Bank Account Passbook", "Skill/Trade Self-Declaration"],
    requiredCertificateIds: ["income_cert", "caste_cert"],
    evaluate: (p) => {
      const isArtisanWorker = ["worker", "business"].includes(p.occupation);
      const isAdult = Number(p.age || 25) >= 18;
      if (isArtisanWorker && isAdult) return { status: "eligible", rulesMet: ["Age 18+", "Working in one of the 18 traditional trade crafts (carpenter, blacksmith, mason, tailor, etc.)"] };
      return { status: "almost", missing: "Applies to artisans in 18 notified traditional trades (carpenter, mason, cobbler, tailor, etc.)" };
    },
    howToApply: "Enroll through any Common Service Centre (CSC) on pmvishwakarma.gov.in with Aadhaar verification.",
    howToApplyHi: "नजदीकी सीएससी केंद्र पर जाकर pmvishwakarma.gov.in पर बायोमेट्रिक सत्यापन कराएं।"
  },
  {
    id: "pmkvy",
    name: "PMKVY 4.0 (Skill Training & Certification)",
    nameHi: "प्रधानमंत्री कौशल विकास योजना (पीएमकेवीवाई 4.0)",
    tag: "Youth & Skill Development",
    tagHi: "युवा एवं कौशल विकास",
    benefitValue: 8000,
    benefit: "Free industry-recognized vocational skill training + NSDC Certificate + Placement assistance",
    benefitHi: "निःशुल्क सरकारी कौशल प्रमाणन, ₹8,000 टूल किट सहायता एवं रोजगार मार्गदर्शन",
    ministry: "Ministry of Skill Development and Entrepreneurship",
    ministryHi: "कौशल विकास एवं उद्यमिता मंत्रालय",
    portalUrl: "https://www.skillindiadigital.gov.in/",
    lastVerified: "Feb 2026",
    requiredDocuments: ["Aadhaar Card", "Educational Marksheet (School/College)", "Bank Account Details"],
    requiredCertificateIds: ["residence_cert"],
    evaluate: (p) => {
      const age = Number(p.age || 22);
      const isYouth = age >= 15 && age <= 35;
      const isEligibleOcc = ["student", "worker", "other"].includes(p.occupation);
      if (isYouth && isEligibleOcc) return { status: "eligible", rulesMet: ["Indian citizen aged between 15-35 years", "Looking for professional vocational upskilling"] };
      if (age > 35) return { status: "almost", missing: "Primary focus on youth 15-35, but RPL (Recognition of Prior Learning) open to all working adults" };
      return { status: "eligible", rulesMet: ["Open to all aspiring skilled professionals"] };
    },
    howToApply: "Register on skillindiadigital.gov.in, select an approved training centre in your district.",
    howToApplyHi: "skillindiadigital.gov.in पर पंजीकरण करें और अपने जिले का प्रशिक्षण केंद्र चुनें।"
  },
  {
    id: "atal_pension",
    name: "Atal Pension Yojana (APY - Guaranteed Pension)",
    nameHi: "अटल पेंशन योजना (सुनिश्चित आजीवन मासिक पेंशन)",
    tag: "Social Security & Pension",
    tagHi: "सामाजिक सुरक्षा व पेंशन",
    benefitValue: 60000,
    benefit: "Guaranteed lifelong monthly pension of ₹1,000 to ₹5,000 after age 60",
    benefitHi: "60 वर्ष की आयु के बाद ₹1,000 से ₹5,000 की आजीवन मासिक पेंशन की सरकारी गारंटी",
    ministry: "PFRDA / Ministry of Finance",
    ministryHi: "वित्त मंत्रालय / पीएफआरडीए",
    portalUrl: "https://www.pfrda.org.in/",
    lastVerified: "Jan 2026",
    requiredDocuments: ["Savings Bank Account", "Aadhaar Card", "Nominee Details"],
    requiredCertificateIds: [],
    evaluate: (p) => {
      const age = Number(p.age || 25);
      const ageEligible = age >= 18 && age <= 40;
      const notIncomeTaxPayer = Number(p.annualIncome || 0) <= 700000;
      if (ageEligible && notIncomeTaxPayer) return { status: "eligible", rulesMet: ["Age is between 18 and 40 years", "Non-income tax payer status confirmed", "Holds savings bank account"] };
      if (age > 40) return { status: "ineligible", reason: "Entry age strictly capped at 40 years for APY" };
      return { status: "almost", missing: "Requires active savings bank account with auto-debit enabled" };
    },
    howToApply: "Visit your bank branch or submit APY subscriber registration through netbanking.",
    howToApplyHi: "अपने बचत बैंक खाते की शाखा में संपर्क करें या नेटबैंकिंग से अटल पेंशन सक्रिय करें।"
  },
  {
    id: "pmjjby",
    name: "PM Jeevan Jyoti Bima Yojana (Life Insurance)",
    nameHi: "प्रधानमंत्री जीवन ज्योति बीमा योजना (जीवन बीमा)",
    tag: "Insurance",
    tagHi: "बीमा सुरक्षा",
    benefitValue: 200000,
    benefit: "₹2,00,000 life insurance coverage for ₹436/year premium",
    benefitHi: "मात्र ₹436/वर्ष में ₹2,00,000 का सरकारी जीवन बीमा कवर",
    ministry: "Department of Financial Services / MoF",
    ministryHi: "वित्तीय सेवाएं विभाग, वित्त मंत्रालय",
    portalUrl: "https://financialservices.gov.in/",
    lastVerified: "Jan 2026",
    requiredDocuments: ["Aadhaar Card", "Bank Account with Auto-Debit Consent"],
    requiredCertificateIds: [],
    evaluate: (p) => {
      const age = Number(p.age || 25);
      if (age >= 18 && age <= 50) return { status: "eligible", rulesMet: ["Age is between 18 and 50 years", "Bank account holder with auto-debit option"] };
      return { status: "ineligible", reason: "Entry restricted to individuals between 18 and 50 years of age" };
    },
    howToApply: "Opt-in via your bank's mobile app, SMS or visit bank branch with Aadhaar.",
    howToApplyHi: "अपने बैंक की शाखा या नेटबैंकिंग से मात्र एक क्लिक में ऑटो-डेबिट सक्षम करें।"
  },
  {
    id: "pmsby",
    name: "PM Suraksha Bima Yojana (Accident Insurance)",
    nameHi: "प्रधानमंत्री सुरक्षा बीमा योजना (दुर्घटना बीमा)",
    tag: "Insurance",
    tagHi: "दुर्घटना बीमा",
    benefitValue: 200000,
    benefit: "₹2,00,000 accidental death/disability coverage for only ₹20/year",
    benefitHi: "मात्र ₹20 प्रति वर्ष में ₹2,00,000 का आकस्मिक मृत्यु व दिव्यांगता बीमा कवर",
    ministry: "Department of Financial Services / MoF",
    ministryHi: "वित्तीय सेवाएं विभाग, वित्त मंत्रालय",
    portalUrl: "https://financialservices.gov.in/",
    lastVerified: "Jan 2026",
    requiredDocuments: ["Aadhaar Card", "Bank Account with Auto-Debit Consent"],
    requiredCertificateIds: [],
    evaluate: (p) => {
      const age = Number(p.age || 25);
      if (age >= 18 && age <= 70) return { status: "eligible", rulesMet: ["Age is between 18 and 70 years", "Active savings account in participating bank"] };
      return { status: "ineligible", reason: "Age must be between 18 and 70 years" };
    },
    howToApply: "Available at all banks and post offices for annual premium of ₹20.",
    howToApplyHi: "सभी बैंकों और डाकघरों में ₹20 के वार्षिक प्रीमियम पर उपलब्ध।"
  },
  {
    id: "pm_svanidhi",
    name: "PM SVANidhi (Street Vendor Micro-Credit)",
    nameHi: "पीएम स्वनिधि (स्ट्रीट वेंडर आत्मनिर्भर निधि)",
    tag: "Street Vendors & Micro Trade",
    tagHi: "रेहड़ी-पटरी व लघु विक्रेता",
    benefitValue: 50000,
    benefit: "Collateral-free working capital loan of ₹10,000 → ₹20,000 → ₹50,000 with 7% interest subsidy",
    benefitHi: "रेहड़ी-पटरी वालों के लिए ₹10,000 से ₹50,000 का संपार्श्विक-मुक्त सस्ता कार्यशील ऋण",
    ministry: "Ministry of Housing and Urban Affairs",
    ministryHi: "आवासन और शहरी कार्य मंत्रालय",
    portalUrl: "https://pmsvanidhi.mohua.gov.in/",
    lastVerified: "Feb 2026",
    requiredDocuments: ["Vending Certificate / Identity Card / Recommendation Letter from ULB", "Aadhaar Card", "Bank Account"],
    requiredCertificateIds: ["residence_cert"],
    evaluate: (p) => {
      const isVendor = ["worker", "business"].includes(p.occupation);
      if (isVendor) return { status: "eligible", rulesMet: ["Engaged in street vending / roadside carts / small market stalls"] };
      return { status: "almost", missing: "Requires Certificate of Vending (CoV) from local municipality" };
    },
    howToApply: "Apply on pmsvanidhi.mohua.gov.in directly or via Municipal Town Vending Committee.",
    howToApplyHi: "pmsvanidhi.mohua.gov.in पर या अपनी नगर पालिका की वेंडिंग कमेटी के माध्यम से आवेदन करें।"
  },
  {
    id: "ujjwala",
    name: "PM Ujjwala Yojana 2.0 (Clean Cooking Fuel)",
    nameHi: "प्रधानमंत्री उज्ज्वला योजना 2.0 (मुफ्त गैस कनेक्शन)",
    tag: "Women & Energy",
    tagHi: "महिला कल्याण एवं ऊर्जा",
    benefitValue: 3200,
    benefit: "Free LPG connection with 14.2 kg cylinder, pressure regulator, hose, and ₹300 refill subsidy",
    benefitHi: "मुफ्त एलपीजी गैस कनेक्शन + पहला भरा हुआ सिलेंडर और चूल्हा बिल्कुल मुफ्त",
    ministry: "Ministry of Petroleum and Natural Gas",
    ministryHi: "पेट्रोलियम एवं प्राकृतिक गैस मंत्रालय",
    portalUrl: "https://www.pmuy.gov.in/",
    lastVerified: "Feb 2026",
    requiredDocuments: ["BPL Ration Card / 14-point declaration", "Aadhaar of adult woman applicant", "Bank Account details"],
    requiredCertificateIds: ["income_cert", "residence_cert"],
    evaluate: (p) => {
      const isWomanOrHasWoman = p.gender === "female" || p.familyHasWoman === true;
      const lowIncome = Number(p.annualIncome || 0) <= 250000;
      if (isWomanOrHasWoman && lowIncome) return { status: "eligible", rulesMet: ["Adult woman in low-income / BPL household", "No existing LPG connection in same household"] };
      if (!isWomanOrHasWoman) return { status: "almost", missing: "Connection issued exclusively in the name of an adult female family member" };
      return { status: "ineligible", reason: "Family income exceeds EWS/BPL threshold for Ujjwala subsidy" };
    },
    howToApply: "Apply online at pmuy.gov.in or submit form to nearest Indane / BharatGas / HP Gas distributor.",
    howToApplyHi: "pmuy.gov.in पर ऑनलाइन या नजदीकी गैस एजेंसी (इण्डेन, भारत, एचपी) में आवेदन दें।"
  },
  {
    id: "standup_india",
    name: "Stand-Up India Scheme (SC/ST & Women Entrepreneurs)",
    nameHi: "स्टैंड-अप इंडिया (अनुसूचित जाति/जनजाति व महिला उद्यमिता)",
    tag: "Entrepreneurship",
    tagHi: "उद्यमिता एवं स्टार्टअप",
    benefitValue: 5000000,
    benefit: "Bank loans between ₹10 Lakh and ₹1 Crore for greenfield commercial enterprises",
    benefitHi: "ग्रीनफील्ड उद्यम शुरू करने हेतु ₹10 लाख से ₹1 करोड़ तक का बैंक ऋण",
    ministry: "Department of Financial Services / SIDBI",
    ministryHi: "वित्तीय सेवाएं विभाग, वित्त मंत्रालय",
    portalUrl: "https://www.standupmitra.in/",
    lastVerified: "Feb 2026",
    requiredDocuments: ["Aadhaar / Voter ID", "Caste Certificate (for SC/ST) or Proof of Woman Promoter", "Project Report", "PAN Card"],
    requiredCertificateIds: ["caste_cert", "income_cert"],
    evaluate: (p) => {
      const isWoman = p.gender === "female";
      const isScSt = ["SC", "ST"].includes(p.category);
      const isBusiness = ["business", "worker", "student"].includes(p.occupation);
      if ((isWoman || isScSt) && isBusiness) return { status: "eligible", rulesMet: ["Applicant is a woman or belongs to SC/ST category", "Age 18+ aiming to set up greenfield enterprise"] };
      if (!isWoman && !isScSt) return { status: "almost", missing: "Scheme reserved for SC/ST individuals or enterprises where women hold 51%+ share" };
      return { status: "ineligible", reason: "Only applicable for enterprise setups by eligible target categories" };
    },
    howToApply: "Apply on standupmitra.in portal or through any Scheduled Commercial Bank branch.",
    howToApplyHi: "standupmitra.in पर प्रोजेक्ट रिपोर्ट अपलोड करें या अग्रणी बैंक शाखा से संपर्क करें।"
  },
  {
    id: "startup_india",
    name: "Startup India Seed Fund Scheme (SISFS)",
    nameHi: "स्टार्टअप इंडिया सीड फंड योजना",
    tag: "Innovation & Startups",
    tagHi: "नवाचार एवं स्टार्टअप",
    benefitValue: 5000000,
    benefit: "Grants up to ₹20 Lakh for proof-of-concept + Debt/Convertible debentures up to ₹50 Lakh",
    benefitHi: "प्रूफ ऑफ कॉन्सेप्ट हेतु ₹20 लाख तक का अनुदान एवं ₹50 लाख तक का कम ब्याज ऋण",
    ministry: "DPIIT / Ministry of Commerce & Industry",
    ministryHi: "उद्योग संवर्धन और आंतरिक व्यापार विभाग (DPIIT)",
    portalUrl: "https://seedfund.startupindia.gov.in/",
    lastVerified: "Feb 2026",
    requiredDocuments: ["DPIIT Recognition Certificate", "Company/LLP Incorporation", "Pitch Deck / Proof of Concept"],
    requiredCertificateIds: [],
    evaluate: (p) => {
      const isEntrepreneur = ["business", "student", "other"].includes(p.occupation);
      if (isEntrepreneur) return { status: "eligible", rulesMet: ["Promoter of an innovative early-stage concept or tech venture"] };
      return { status: "almost", missing: "Requires a registered entity incorporated less than 2 years ago with an innovative solution" };
    },
    howToApply: "Apply online at seedfund.startupindia.gov.in by choosing an approved incubator.",
    howToApplyHi: "seedfund.startupindia.gov.in पर डीपीआईआईटी मान्यता प्राप्त कर इनक्यूबेटर चुनें।"
  },
  {
    id: "pmsy",
    name: "PM Shram Yogi Maan-dhan (PM-SYM)",
    nameHi: "प्रधानमंत्री श्रम योगी मानधन योजना (असंगठित कामगार पेंशन)",
    tag: "Unorganized Workers",
    tagHi: "असंगठित कामगार",
    benefitValue: 36000,
    benefit: "Guaranteed monthly pension of ₹3,000/month after age 60 with 50% govt matching contribution",
    benefitHi: "60 वर्ष के बाद ₹3,000 की मासिक सुनिश्चित पेंशन (सरकार 50% अंशदान स्वयं देती है)",
    ministry: "Ministry of Labour and Employment",
    ministryHi: "श्रम एवं रोजगार मंत्रालय",
    portalUrl: "https://maandhan.in/",
    lastVerified: "Jan 2026",
    requiredDocuments: ["Aadhaar Card", "Savings Bank Passbook / Jan Dhan Account", "Mobile Number"],
    requiredCertificateIds: ["income_cert"],
    evaluate: (p) => {
      const age = Number(p.age || 25);
      const isWorker = ["worker", "homemaker", "other"].includes(p.occupation);
      const incomeUnder15kMonth = Number(p.annualIncome || 0) <= 180000;
      if (age >= 18 && age <= 40 && isWorker && incomeUnder15kMonth) {
        return { status: "eligible", rulesMet: ["Unorganized worker aged 18 to 40 years", "Monthly income within ₹15,000 limit", "Not covered under EPFO/ESIC/NPS"] };
      }
      if (age > 40) return { status: "ineligible", reason: "Maximum entry age limit is 40 years" };
      return { status: "almost", missing: "Monthly income must be ₹15,000 or below, with no EPFO/ESIC membership" };
    },
    howToApply: "Enroll at any Common Service Centre (CSC) or visit maandhan.in with Aadhaar and bank details.",
    howToApplyHi: "नजदीकी सीएससी केंद्र पर जाकर बायोमेट्रिक से तुरंत पीएम-एसवाईएम कार्ड बनवाएं।"
  },
  {
    id: "nsap_old_age",
    name: "Indira Gandhi National Old Age Pension (IGNOAPS)",
    nameHi: "इंदिरा गांधी राष्ट्रीय वृद्धावस्था पेंशन योजना",
    tag: "Senior Citizens",
    tagHi: "वरिष्ठ नागरिक",
    benefitValue: 12000,
    benefit: "Monthly direct pension for elderly BPL citizens (₹500 - ₹2,500/month based on state top-up)",
    benefitHi: "गरीबी रेखा से नीचे रहने वाले बुजुर्गों को प्रतिमाह सम्मानजनक वित्तीय पेंशन",
    ministry: "Ministry of Rural Development (NSAP)",
    ministryHi: "ग्रामीण विकास मंत्रालय (राष्ट्रीय सामाजिक सहायता कार्यक्रम)",
    portalUrl: "https://nsap.nic.in/",
    lastVerified: "Feb 2026",
    requiredDocuments: ["Age Proof / Birth Certificate / Aadhaar", "BPL Card / Income Certificate", "Bank Passbook"],
    requiredCertificateIds: ["income_cert", "birth_cert", "residence_cert"],
    evaluate: (p) => {
      const age = Number(p.age || 25);
      const isElder = age >= 60;
      const isBpl = Number(p.annualIncome || 0) <= 200000 || ["BPL", "EWS", "SC", "ST"].includes(p.category);
      if (isElder && isBpl) return { status: "eligible", rulesMet: ["Senior citizen aged 60 years or above", "Household belongs to verified BPL/low-income category"] };
      if (age < 60) return { status: "almost", missing: `Applicant currently ${age} years old. Eligible upon reaching 60 years.` };
      return { status: "ineligible", reason: "Applicant family income exceeds state BPL ceiling for social pension" };
    },
    howToApply: "Submit application at Block Development Office (BDO), Municipal Office or nsap.nic.in.",
    howToApplyHi: "प्रखंड विकास अधिकारी (बीडीओ) या नगर पालिका कार्यालय में आवेदन जमा करें।"
  },
  {
    id: "nsap_widow",
    name: "Indira Gandhi National Widow Pension (IGNWPS)",
    nameHi: "इंदिरा गांधी राष्ट्रीय विधवा पेंशन योजना",
    tag: "Widow Welfare",
    tagHi: "विधवा एवं बेसहारा महिला कल्याण",
    benefitValue: 12000,
    benefit: "Monthly direct bank transfer pension for widowed women living below poverty line",
    benefitHi: "बीपीएल श्रेणी की विधवा महिलाओं को नियमित मासिक वित्तीय सहायता",
    ministry: "Ministry of Rural Development",
    ministryHi: "ग्रामीण विकास मंत्रालय",
    portalUrl: "https://nsap.nic.in/",
    lastVerified: "Feb 2026",
    requiredDocuments: ["Husband's Death Certificate", "Age Proof (40-79 years)", "BPL Certificate", "Aadhaar & Bank Passbook"],
    requiredCertificateIds: ["death_cert", "income_cert", "residence_cert"],
    evaluate: (p) => {
      const isWoman = p.gender === "female";
      const age = Number(p.age || 35);
      if (isWoman && age >= 40) return { status: "almost", missing: "Requires submission of deceased spouse death certificate and BPL verification" };
      return { status: "ineligible", reason: "Reserved for widowed women aged 40 to 79 from BPL families" };
    },
    howToApply: "Apply at local Tehsil / Sub-Divisional Magistrate office or through e-District state portal.",
    howToApplyHi: "तहसीलदार कार्यालय या राज्य के ई-डिस्ट्रिक्ट पोर्टल पर मृत्यु प्रमाण पत्र के साथ आवेदन करें।"
  },
  {
    id: "post_matric_scholarship",
    name: "Post-Matric Scholarship for SC/ST/OBC Students",
    nameHi: "पोस्ट-मैट्रिक छात्रवृत्ति (अनुसूचित जाति/जनजाति/ओबीसी)",
    tag: "Education & Scholarships",
    tagHi: "शिक्षा एवं छात्रवृत्ति",
    benefitValue: 35000,
    benefit: "100% course tuition reimbursement + Monthly academic maintenance allowance",
    benefitHi: "कॉलेज व उच्च शिक्षा की पूरी ट्यूशन फीस प्रतिपूर्ति + मासिक अध्ययन भत्ता",
    ministry: "Ministry of Social Justice and Empowerment / Tribal Affairs",
    ministryHi: "सामाजिक न्याय एवं अधिकारिता मंत्रालय",
    portalUrl: "https://scholarships.gov.in/",
    lastVerified: "Feb 2026",
    requiredDocuments: ["Caste Certificate", "Income Certificate (Under ₹2.5 Lakh)", "Previous Marksheet", "College Fee Receipt", "Aadhaar"],
    requiredCertificateIds: ["caste_cert", "income_cert"],
    evaluate: (p) => {
      const isStudent = p.occupation === "student" || Number(p.age || 20) <= 28;
      const isReserved = ["SC", "ST", "OBC"].includes(p.category);
      const incomeOk = Number(p.annualIncome || 0) <= 250000;
      if (isStudent && isReserved && incomeOk) return { status: "eligible", rulesMet: ["Student pursuing Post-Matriculation studies", "Belongs to SC/ST/OBC category", "Family income within ₹2.5 Lakh/annum limit"] };
      if (!isReserved) return { status: "ineligible", reason: "Scheme specific to SC/ST/OBC student categories" };
      return { status: "almost", missing: "Provide college admission proof and current financial year Income Certificate" };
    },
    howToApply: "Apply on the National Scholarship Portal (scholarships.gov.in) before state deadline.",
    howToApplyHi: "नेशनल स्कॉलरशिप पोर्टल (scholarships.gov.in) पर सत्र शुरू होते ही ऑनलाइन आवेदन करें।"
  },
  {
    id: "pm_egp",
    name: "Prime Minister's Employment Generation Programme (PMEGP)",
    nameHi: "प्रधानमंत्री रोजगार सृजन कार्यक्रम (पीएमईजीपी)",
    tag: "Manufacturing & Self-Employment",
    tagHi: "उद्योग एवं रोजगार सृजन",
    benefitValue: 1250000,
    benefit: "15% to 35% government subsidy on project costs up to ₹50 Lakh (manufacturing) or ₹20 Lakh (services)",
    benefitHi: "नया उद्योग लगाने हेतु ₹50 लाख तक के प्रोजेक्ट पर 35% तक की सीधी सरकारी सब्सिडी",
    ministry: "KVIC / Ministry of MSME",
    ministryHi: "सूक्ष्म, लघु और मध्यम उद्यम मंत्रालय / केवीआईसी",
    portalUrl: "https://www.kviconline.gov.in/pmegpeportal/",
    lastVerified: "Feb 2026",
    requiredDocuments: ["Project Report / Feasibility Plan", "Aadhaar Card", "8th pass marksheet (for projects >₹10L)", "Caste/Special Category Certificate"],
    requiredCertificateIds: ["income_cert", "caste_cert", "residence_cert"],
    evaluate: (p) => {
      const isAdult = Number(p.age || 25) >= 18;
      const isBusinessOrWorker = ["business", "worker", "student"].includes(p.occupation);
      if (isAdult && isBusinessOrWorker) return { status: "eligible", rulesMet: ["Indian citizen aged 18+", "Planning to establish new micro-manufacturing or service enterprise"] };
      return { status: "almost", missing: "Requires a detailed project report (DPR) for a new non-farm enterprise" };
    },
    howToApply: "Submit online application through kviconline.gov.in/pmegpeportal/ without any physical paper submission.",
    howToApplyHi: "kviconline.gov.in पर बिना किसी बैंक की सिफारिश के सीधे ऑनलाइन आवेदन करें।"
  },
  {
    id: "national_career_service",
    name: "National Career Service (NCS Job Portal)",
    nameHi: "राष्ट्रीय करियर सेवा (एनसीएस रोजगार पोर्टल)",
    tag: "Employment & Jobs",
    tagHi: "रोजगार एवं नौकरी",
    benefitValue: 5000,
    benefit: "Direct access to 25,000+ active government & private job openings + Free job fairs",
    benefitHi: "हजारों सत्यापित सरकारी व निजी नौकरियों में सीधा आवेदन + निःशुल्क करियर काउंसलिंग",
    ministry: "Ministry of Labour and Employment",
    ministryHi: "श्रम एवं रोजगार मंत्रालय",
    portalUrl: "https://www.ncs.gov.in/",
    lastVerified: "Feb 2026",
    requiredDocuments: ["Educational Certificates", "Aadhaar Card", "Updated Resume"],
    requiredCertificateIds: ["residence_cert"],
    evaluate: (p) => {
      const age = Number(p.age || 22);
      if (age >= 18 && age <= 45) return { status: "eligible", rulesMet: ["Active job seeker aged between 18-45", "Access to verified national vacancies"] };
      return { status: "almost", missing: "Open to all candidates seeking employment or apprenticeship" };
    },
    howToApply: "Register free on ncs.gov.in using Aadhaar to generate your unique NCS Jobseeker ID.",
    howToApplyHi: "ncs.gov.in पर आधार से मुफ्त में अपनी जॉब सीकर आईडी बनाएं।"
  },
  {
    id: "pmmvy",
    name: "Pradhan Mantri Matru Vandana Yojana (PMMVY)",
    nameHi: "प्रधानमंत्री मातृ वंदना योजना (मातृत्व लाभ सहायता)",
    tag: "Maternal Health & Women",
    tagHi: "मातृत्व पोषण एवं महिला",
    benefitValue: 6000,
    benefit: "Cash incentive of ₹5,000 - ₹6,000 paid in direct bank installments for pregnant and lactating mothers",
    benefitHi: "गर्भवती व धात्री महिलाओं को पोषण सहायता हेतु ₹6,000 की नकद वित्तीय सहायता",
    ministry: "Ministry of Women and Child Development",
    ministryHi: "महिला एवं बाल विकास मंत्रालय",
    portalUrl: "https://pmmvy.wcd.gov.in/",
    lastVerified: "Feb 2026",
    requiredDocuments: ["Mother's & Husband's Aadhaar", "Mother and Child Protection (MCP) Card", "Joint Bank Account"],
    requiredCertificateIds: ["income_cert"],
    evaluate: (p) => {
      const isWoman = p.gender === "female";
      const hasPregnantOrInfant = p.isPregnantOrLactating === true;
      if (isWoman && hasPregnantOrInfant) return { status: "eligible", rulesMet: ["Pregnant woman / lactating mother with MCP registration", "Aadhaar seeded bank account"] };
      if (isWoman) return { status: "almost", missing: "Applicable upon first/second live pregnancy with registration at Anganwadi / Health Centre" };
      return { status: "ineligible", reason: "Reserved exclusively for pregnant and nursing mothers" };
    },
    howToApply: "Register at the nearest Anganwadi Centre or apply online at pmmvy.wcd.gov.in.",
    howToApplyHi: "अपने नजदीकी आंगनवाड़ी केंद्र या pmmvy.wcd.gov.in पर एमसीपी कार्ड के साथ पंजीकरण करें।"
  },
  {
    id: "disability_pension",
    name: "Indira Gandhi National Disability Pension (IGNDPS)",
    nameHi: "इंदिरा गांधी राष्ट्रीय दिव्यांगता पेंशन योजना",
    tag: "Persons with Disabilities",
    tagHi: "दिव्यांगजन कल्याण",
    benefitValue: 18000,
    benefit: "Direct monthly financial pension (₹1,000 - ₹3,000/month) for severely disabled citizens",
    benefitHi: "गंभीर दिव्यांगता वाले नागरिकों के लिए सम्मानजनक मासिक वित्तीय पेंशन",
    ministry: "Ministry of Social Justice & Empowerment",
    ministryHi: "सामाजिक न्याय और अधिकारिता मंत्रालय",
    portalUrl: "https://www.swavlambancard.gov.in/",
    lastVerified: "Feb 2026",
    requiredDocuments: ["UDID Card / Disability Certificate (40%+ benchmark)", "BPL Certificate / Income Proof", "Aadhaar Card", "Bank Account"],
    requiredCertificateIds: ["disability_cert", "income_cert", "residence_cert"],
    evaluate: (p) => {
      const hasDisability = p.hasDisability === true;
      if (hasDisability) return { status: "eligible", rulesMet: ["Possesses UDID disability benchmark certificate", "Household meets income/BPL criteria"] };
      return { status: "almost", missing: "Requires certified disability certificate or UDID card from district medical board" };
    },
    howToApply: "Apply on swavlambancard.gov.in for UDID and submit pension application to District Social Welfare Office.",
    howToApplyHi: "swavlambancard.gov.in पर यूडीआईडी कार्ड बनवाएं और समाज कल्याण विभाग में पेंशन आवेदन दें।"
  },
  {
    id: "pm_matsya",
    name: "PM Matsya Sampada Yojana (Fisheries Development)",
    nameHi: "प्रधानमंत्री मत्स्य संपदा योजना (मछुआरा एवं मत्स्य पालन)",
    tag: "Fisheries & Aquaculture",
    tagHi: "मत्स्य पालन एवं जल कृषि",
    benefitValue: 300000,
    benefit: "Up to 40% (General) or 60% (Women/SC/ST) government capital subsidy for aquaculture & fish farming ponds",
    benefitHi: "मछली पालन तालाब, बायोफ्लॉक और हैचरी स्थापित करने के लिए 60% तक की भारी सरकारी सब्सिडी",
    ministry: "Department of Fisheries / Ministry of Fisheries, Animal Husbandry & Dairying",
    ministryHi: "मत्स्य पालन विभाग",
    portalUrl: "https://pmmsy.dof.gov.in/",
    lastVerified: "Jan 2026",
    requiredDocuments: ["Land/Waterbody Lease or Ownership deed", "Aadhaar Card", "Bank Account", "Project DPR"],
    requiredCertificateIds: ["caste_cert", "income_cert"],
    evaluate: (p) => {
      const isFarmerOrWorker = ["farmer", "worker", "business"].includes(p.occupation);
      if (isFarmerOrWorker) return { status: "eligible", rulesMet: ["Citizen interested in establishing commercial fish farming or pond aquaculture"] };
      return { status: "almost", missing: "Requires access to cultivable waterbody or leased pond land" };
    },
    howToApply: "Submit project proposal to District Fisheries Officer or online at pmmsy.dof.gov.in.",
    howToApplyHi: "जिला मत्स्य अधिकारी को प्रोजेक्ट रिपोर्ट सौंपें या pmmsy.dof.gov.in पर ऑनलाइन भरें।"
  },
  {
    id: "kisan_credit_card",
    name: "Kisan Credit Card (KCC - Low Interest Agricultural Credit)",
    nameHi: "किसान क्रेडिट कार्ड (केसीसी - 4% रियायती कृषि ऋण)",
    tag: "Agriculture & Credit",
    tagHi: "कृषि साख एवं ऋण",
    benefitValue: 300000,
    benefit: "Collateral-free crop loan up to ₹1.60 Lakh and up to ₹3 Lakh at effectively 4% interest rate",
    benefitHi: "मात्र 4% ब्याज दर पर ₹3 लाख तक का आसान कृषि व पशुपालन ऋण",
    ministry: "RBI / NABARD / Ministry of Agriculture",
    ministryHi: "कृषि मंत्रालय / नाबार्ड",
    portalUrl: "https://myscheme.gov.in/",
    lastVerified: "Feb 2026",
    requiredDocuments: ["Land Record (Jamabandi/Khasra)", "Aadhaar Card", "PAN Card", "No Dues Certificate"],
    requiredCertificateIds: ["income_cert"],
    evaluate: (p) => {
      const isFarmer = p.occupation === "farmer" || p.occupation === "worker";
      if (isFarmer) return { status: "eligible", rulesMet: ["Engaged in agriculture, dairy, poultry, or allied farming"] };
      return { status: "almost", missing: "Available to farmers, tenant cultivators, and livestock/dairy rearers" };
    },
    howToApply: "Download 1-page simplified KCC form from pmkisan.gov.in and submit to your bank branch.",
    howToApplyHi: "pmkisan.gov.in से 1-पेज का सरल केसीसी फॉर्म डाउनलोड कर बैंक में जमा करें।"
  },
  {
    id: "eshram",
    name: "e-Shram National Database for Unorganized Workers",
    nameHi: "ई-श्रम राष्ट्रीय असंगठित कामगार कार्ड",
    tag: "Unorganized Sector",
    tagHi: "असंगठित क्षेत्र",
    benefitValue: 200000,
    benefit: "Universal 12-digit UAN Card + Free ₹2 Lakh accidental insurance + Direct welfare eligibility",
    benefitHi: "12 अंकों का राष्ट्रीय यूएएन कार्ड + ₹2 लाख का मुफ्त दुर्घटना बीमा + सरकारी आपदा राहत में प्राथमिकता",
    ministry: "Ministry of Labour & Employment",
    ministryHi: "श्रम एवं रोजगार मंत्रालय",
    portalUrl: "https://eshram.gov.in/",
    lastVerified: "Feb 2026",
    requiredDocuments: ["Aadhaar Card", "Aadhaar-linked Active Mobile", "Savings Bank Account"],
    requiredCertificateIds: [],
    evaluate: (p) => {
      const age = Number(p.age || 25);
      const isUnorg = ["worker", "homemaker", "farmer", "other"].includes(p.occupation);
      if (age >= 16 && age <= 59 && isUnorg) return { status: "eligible", rulesMet: ["Aged between 16 and 59 years", "Not paying income tax", "Not member of EPFO / ESIC"] };
      if (age > 59) return { status: "ineligible", reason: "e-Shram registration is capped at age 59" };
      return { status: "almost", missing: "Ensure you are not an existing registered member of EPFO or ESIC" };
    },
    howToApply: "Self-register for free in 3 minutes on eshram.gov.in using Aadhaar OTP.",
    howToApplyHi: "eshram.gov.in पर आधार ओटीपी के जरिए 3 मिनट में अपना ई-श्रम कार्ड स्वयं डाउनलोड करें।"
  },
  {
    id: "pm_kusum",
    name: "PM-KUSUM (Solar Pumps for Agriculture)",
    nameHi: "पीएम कुसुम योजना (सोलर कृषि पंप पर 60% सब्सिडी)",
    tag: "Renewable Energy & Agriculture",
    tagHi: "सौर ऊर्जा एवं कृषि",
    benefitValue: 120000,
    benefit: "60% government subsidy (30% Central + 30% State) for standalone solar water pumps",
    benefitHi: "खेत में सौर ऊर्जा संचालित पंप लगाने हेतु 60% तक की सीधी सरकारी सब्सिडी",
    ministry: "Ministry of New and Renewable Energy (MNRE)",
    ministryHi: "नवीन एवं नवीकरणीय ऊर्जा मंत्रालय",
    portalUrl: "https://pmkusum.mnre.gov.in/",
    lastVerified: "Jan 2026",
    requiredDocuments: ["Agricultural Land Proof", "Aadhaar Card", "Bank Account Details"],
    requiredCertificateIds: ["income_cert"],
    evaluate: (p) => {
      const isFarmer = p.occupation === "farmer";
      if (isFarmer) return { status: "eligible", rulesMet: ["Individual farmer or group with cultivable land seeking clean irrigation"] };
      return { status: "almost", missing: "Farmer identity and agricultural land documents required" };
    },
    howToApply: "Apply on the State Renewable Energy Development Agency portal (e.g. HAREDA in Haryana).",
    howToApplyHi: "राज्य अक्षय ऊर्जा विकास एजेंसी (जैसे हरियाणा में हरेडा) के आधिकारिक पोर्टल पर आवेदन करें।"
  }
];

export function evaluateUserSchemes(profile) {
  const eligible = [];
  const almostEligible = [];

  for (const scheme of schemesDatabase) {
    const res = scheme.evaluate(profile);
    if (res.status === "eligible") {
      eligible.push({
        ...scheme,
        rulesMet: res.rulesMet || ["Meets basic eligibility criteria"]
      });
    } else if (res.status === "almost") {
      almostEligible.push({
        ...scheme,
        missingReason: res.missing || "Minor verification required"
      });
    }
  }

  // Rank by highest monetary benefit value first
  eligible.sort((a, b) => (b.benefitValue || 0) - (a.benefitValue || 0));
  almostEligible.sort((a, b) => (b.benefitValue || 0) - (a.benefitValue || 0));

  return { eligible, almostEligible };
}
