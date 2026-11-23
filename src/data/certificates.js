// Revenue Certificates and Document Readiness Checklists
// Citizens can check off documents they currently have and see exactly how to obtain missing ones.

export const certificatesData = [
  {
    id: "income_cert",
    title: "Income Certificate",
    titleHi: "आय प्रमाण पत्र",
    dept: "Revenue Department / Office of the Tehsildar",
    deptHi: "राजस्व विभाग / तहसीलदार कार्यालय",
    desc: "Official statutory proof of annual household earnings required for fee concessions, scholarship quotas, and welfare schemes.",
    descHi: "वार्षिक पारिवारिक आय का आधिकारिक प्रमाण पत्र, जो छात्रवृत्ति, शुल्क छूट और सरकारी योजनाओं के लिए अनिवार्य है।",
    sla: "7 to 15 working days",
    slaHi: "7 से 15 कार्य दिवस",
    fee: "₹10 to ₹30 (Nominal Govt Fee)",
    portalUrl: "https://saralharyana.gov.in/",
    portalName: "Saral Haryana / State e-District Portal",
    checklistItems: [
      { id: "aadhaar", label: "Aadhaar Card (Applicant & Family Head)", source: "Download from uidai.gov.in" },
      { id: "salary_itr", label: "Salary Slip / Form 16 / ITR or Self-Declaration Affidavit", source: "From employer or certified Notary affidavit" },
      { id: "ration_bpl", label: "Ration Card / Parivar Pehchan Patra (PPP)", source: "Food & Supplies Department or State PPP portal" },
      { id: "patwari_report", label: "Local Patwari / Councillor Verification Report", source: "From your local area Patwari or Ward Councillor" }
    ],
    howToApply: "Submit online on your state e-District / Saral portal with the Patwari verification report and upload proof of earnings.",
    howToApplyHi: "पटवारी या पार्षद की सत्यापन रिपोर्ट के साथ राज्य ई-डिस्ट्रिक्ट पोर्टल पर आवेदन करें।"
  },
  {
    id: "caste_cert",
    title: "Caste / Community Certificate (SC / ST / OBC / EWS)",
    titleHi: "जाति प्रमाण पत्र (अनुसूचित जाति / जनजाति / पिछड़ा वर्ग)",
    dept: "Sub-Divisional Magistrate (SDM) / Tehsildar",
    deptHi: "उप-मंडल मजिस्ट्रेट (एसडीएम) / तहसीलदार",
    desc: "Legal recognition of constitutional community status required for reservation, education quotas, and central subsidies.",
    descHi: "संवैधानिक आरक्षण, शिक्षा व छात्रवृत्ति के लिए आवश्यक वैधानिक जाति प्रमाण पत्र।",
    sla: "14 to 21 working days",
    slaHi: "14 से 21 कार्य दिवस",
    fee: "Free to ₹25",
    portalUrl: "https://saralharyana.gov.in/",
    portalName: "e-District / Saral Haryana",
    checklistItems: [
      { id: "applicant_aadhaar", label: "Aadhaar Card of Applicant", source: "UIDAI Portal" },
      { id: "father_caste_proof", label: "Father's / Paternal Relative's Caste Certificate or 1950/1966 Land Record", source: "Paternal revenue records or Tehsil record room" },
      { id: "residence_proof", label: "Proof of residence in state for minimum prescribed years", source: "Voter ID / Domicile / Electricity Bill" },
      { id: "notary_affidavit", label: "Notarized Affidavit declaring lineage and religion", source: "Local Court / Notary Advocate" }
    ],
    howToApply: "Apply online at e-District with your father's lineage proof or visit the SDM office Citizen Facilitation Centre.",
    howToApplyHi: "पिता के जाति प्रमाण या पूर्वजों के भूमि रिकॉर्ड के साथ ई-डिस्ट्रिक्ट पोर्टल पर आवेदन करें।"
  },
  {
    id: "residence_cert",
    title: "Domicile / Resident Certificate",
    titleHi: "मूल निवास / अधिवास प्रमाण पत्र (डोमिसाइल)",
    dept: "Tehsildar / District Magistrate Office",
    deptHi: "तहसीलदार / जिला मजिस्ट्रेट कार्यालय",
    desc: "Proof of continuous lawful residency in the state for public sector recruitment, local university admissions, and state benefits.",
    descHi: "राज्य में निरंतर वैध निवास का प्रमाण, जो सरकारी नौकरियों, स्कूल/कॉलेज प्रवेश और राज्य योजनाओं में अनिवार्य है।",
    sla: "7 to 10 working days",
    slaHi: "7 से 10 कार्य दिवस",
    fee: "₹20 (User charges)",
    portalUrl: "https://saralharyana.gov.in/",
    portalName: "State e-District / Saral Portal",
    checklistItems: [
      { id: "aadhaar_card", label: "Aadhaar Card with local address", source: "UIDAI updated address" },
      { id: "education_proof", label: "School leaving certificate / 10th marksheet from a local school", source: "School or Board record" },
      { id: "utility_bills", label: "Electricity / Water / Property Tax bills (Last 5-10 years)", source: "Discom / Municipal receipts" },
      { id: "voter_id", label: "Voter ID card in local constituency", source: "Election Commission voter card" }
    ],
    howToApply: "Apply on the state portal. A field verification is routed to your local Patwari before digital sign-off by the Tehsildar.",
    howToApplyHi: "राज्य पोर्टल पर आवश्यक निवास साक्ष्यों के साथ आवेदन करें। पटवारी सत्यापन के बाद डिजिटल हस्ताक्षर युक्त प्रमाण पत्र जारी होता है।"
  },
  {
    id: "birth_cert",
    title: "Birth Certificate",
    titleHi: "जन्म प्रमाण पत्र",
    dept: "Municipal Corporation / Registrar of Births & Deaths",
    deptHi: "नगर पालिका / जन्म-मृत्यु पंजीयक कार्यालय",
    desc: "Fundamental legal identity document recording birth date and parentage; critical for school admission, passport, and Aadhaar.",
    descHi: "जन्म तिथि और माता-पिता का वैधानिक प्रमाण पत्र; स्कूल प्रवेश, पासपोर्ट और आधार के लिए सबसे आवश्यक दस्तावेज।",
    sla: "3 to 7 working days (within 21 days of event)",
    slaHi: "3 से 7 कार्य दिवस",
    fee: "Free if within 21 days; ₹5-₹20 delayed search fee",
    portalUrl: "https://crsorgi.gov.in/",
    portalName: "Civil Registration System (CRS Portal)",
    checklistItems: [
      { id: "hospital_discharge", label: "Hospital Birth Slip / Discharge Summary (Form 1)", source: "Hospital / Nursing home of birth" },
      { id: "parents_aadhaar", label: "Parents' Aadhaar cards & Marriage proof", source: "UIDAI & Marriage Registrar" },
      { id: "address_proof", label: "Parental permanent address proof", source: "Ration card / Electricity bill" }
    ],
    howToApply: "If hospital birth, hospital staff notifies CRS automatically. If home birth, notify the local municipal registrar within 21 days.",
    howToApplyHi: "अस्पताल में जन्म होने पर crsorgi.gov.in पर अस्पताल द्वारा पंजीकृत किया जाता है। घर पर जन्म की स्थिति में 21 दिन के भीतर नगर पालिका में सूचना दें।"
  },
  {
    id: "death_cert",
    title: "Death Certificate",
    titleHi: "मृत्यु प्रमाण पत्र",
    dept: "Municipal Health Officer / Registrar of Births & Deaths",
    deptHi: "नगर पालिका स्वास्थ्य अधिकारी / जन्म-मृत्यु पंजीयक",
    desc: "Statutory record of demise required for legal inheritance, bank account settlement, life insurance claims, and widow pension.",
    descHi: "मृत्यु का वैधानिक अभिलेख जो संपत्ति हस्तांतरण, बैंक खाता निपटान, जीवन बीमा दावा और विधवा पेंशन के लिए अनिवार्य है।",
    sla: "3 to 7 working days",
    slaHi: "3 से 7 कार्य दिवस",
    fee: "Free to ₹10",
    portalUrl: "https://crsorgi.gov.in/",
    portalName: "Civil Registration System (CRS)",
    checklistItems: [
      { id: "medical_cert_cause", label: "Medical Certificate of Cause of Death (MCCD)", source: "Attending Doctor / Hospital" },
      { id: "deceased_aadhaar", label: "Deceased person's Aadhaar & Identity documents", source: "Family records" },
      { id: "cremation_receipt", label: "Cremation / Burial ground receipt", source: "Crematorium / Cemetery caretaker" },
      { id: "applicant_id", label: "Applicant's Photo ID proving relation", source: "Aadhaar / Voter ID" }
    ],
    howToApply: "Submit Form 2 along with the doctor's certificate and cremation ground slip to the Municipal Health Department within 21 days.",
    howToApplyHi: "श्मशान/कब्रिस्तान की रसीद और डॉक्टर के मृत्यु प्रमाण के साथ 21 दिन के भीतर नगर निगम कार्यालय में फॉर्म-2 जमा करें।"
  },
  {
    id: "disability_cert",
    title: "Unique Disability ID (UDID) & Certificate",
    titleHi: "विशिष्ट दिव्यांगता पहचान पत्र (UDID कार्ड)",
    dept: "District Medical Board / Department of Empowerment of Persons with Disabilities",
    deptHi: "जिला मेडिकल बोर्ड / दिव्यांगजन सशक्तिकरण विभाग",
    desc: "Single nationwide electronic card identifying disability benchmark for concessional travel, special quotas, and pensions.",
    descHi: "देशव्यापी डिजिटल कार्ड जो सरकारी नौकरियों, मुफ्त रेल/बस यात्रा और मासिक दिव्यांग पेंशन के लिए मान्य है।",
    sla: "15 to 30 working days (post Medical Board assessment)",
    slaHi: "15 से 30 कार्य दिवस",
    fee: "Free",
    portalUrl: "https://www.swavlambancard.gov.in/",
    portalName: "Swavlamban Portal (Govt. of India)",
    checklistItems: [
      { id: "udid_aadhaar", label: "Aadhaar Card", source: "UIDAI Portal" },
      { id: "medical_reports", label: "Clinical / Diagnostic medical records of impairment", source: "Hospital / Specialist Doctor" },
      { id: "passport_photo", label: "Recent passport photo showing disability clearly", source: "Photographer / Phone camera" }
    ],
    howToApply: "Register on swavlambancard.gov.in, book an appointment slot at the District Civil Hospital for physical assessment by the Medical Board.",
    howToApplyHi: "swavlambancard.gov.in पर पंजीकरण करें और जिला नागरिक अस्पताल के मेडिकल बोर्ड से तारीख लेकर जांच करवाएं।"
  }
];
