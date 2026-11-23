// Seed / Demo Complaints data for JanSetu AI (Centered around Sohna, Haryana)
// All demo entries are strictly flagged with isDemo: true so honest badges render in the UI.

export const initialSeedGrievances = [
  {
    id: "DEMO-SOHNA-01",
    isDemo: true,
    category: "Roads & Potholes",
    categoryHi: "सड़क और गड्ढे",
    portalId: "haryanaCmWindow",
    portalName: "Haryana CM Window",
    portalRefNumber: "HR-CMW-2026-88192",
    dept: "Haryana Public Works Department (B&R) / Sohna Municipal Committee",
    deptHi: "हरियाणा लोक निर्माण विभाग / सोहना नगरपालिका समिति",
    location: "Sohna-Alwar Highway Road, Near Sohna Bus Stand Chowk, Ward 4, Sohna, Haryana",
    desc: "Cluster of 3 severe, jagged potholes spanning 1.5 meters across main carriageway. Multiple two-wheeler commuters have skidded during evening rush hours.",
    urgency: "safety-critical",
    urgencyReason: "High accident risk for two-wheelers and night traffic on state highway corridor.",
    filingDate: "10 Feb 2026, 11:30 AM",
    filingTimestamp: Date.now() - 13 * 86400000, // 13 days ago
    expectedResolutionDays: 5,
    status: "escalated", // draft | filed | follow_up_due | escalated | resolved
    statusHi: "अपील/आरटीआई प्रेषित",
    daysElapsed: 13,
    evidencePhotos: [
      "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=600&q=80"
    ],
    afterPhoto: null,
    resolutionConfirmed: false,
    aiDraftSubject: "Urgent road repair required: Hazardous pothole cluster near Sohna Bus Stand Chowk",
    aiDraftBody: "To,\nThe Executive Engineer,\nHaryana PWD (B&R) / Municipal Committee Sohna.\n\nSir/Madam,\nI bring to your urgent attention the hazardous road condition on Sohna-Alwar Highway near Sohna Bus Stand Chowk, Ward 4. Three deep craters (10-15 cm depth) have developed in the active traffic lane, causing severe accidents for commuters, especially two-wheeler riders. Despite local representations, no cold mix or asphalt patchwork has been initiated. Kindly inspect and authorize emergency patchwork within 48 hours to avert fatal mishaps.\n\nYours faithfully,\nCitizen of Sohna",
    timeline: [
      {
        title: "AI Complaint Draft Prepared",
        date: "10 Feb 2026, 11:15 AM",
        note: "Drafted with priority 'Safety Critical' and Haryana PWD routing.",
        actor: "JanSetu AI Copilot"
      },
      {
        title: "Filed on Haryana CM Window",
        date: "10 Feb 2026, 11:30 AM",
        note: "Citizen confirmed filing. Portal Reference: HR-CMW-2026-88192.",
        actor: "Citizen"
      },
      {
        title: "Typical Resolution Window Elapsed (5 Days)",
        date: "15 Feb 2026, 12:00 PM",
        note: "Target resolution window passed with no progress reported on official portal.",
        actor: "JanSetu Tracker"
      },
      {
        title: "Escalation Package Generated",
        date: "18 Feb 2026, 03:45 PM",
        note: "Formal reminder + RTI Application drafted under Section 6(1) of RTI Act 2005 sent to First Appellate Authority.",
        actor: "Citizen via JanSetu Escalation Engine"
      }
    ],
    escalation: {
      generatedAt: "18 Feb 2026, 03:45 PM",
      reminderLetter: "Subject: REMINDER - Urgent action awaited on Grievance HR-CMW-2026-88192\n\nDear Executive Engineer,\nThis is a formal reminder regarding public grievance HR-CMW-2026-88192 lodged on 10 Feb 2026 regarding crater potholes near Sohna Bus Stand Chowk. Over 8 days have elapsed beyond the citizen charter resolution timeline of 5 working days. Immediate intervention is requested.",
      appellateAppeal: "MEMORANDUM OF FIRST APPEAL\nUnder Citizens Charter & Public Grievance Rules\n\nTo,\nThe Superintending Engineer / First Appellate Authority,\nHaryana PWD (B&R) Circle Gurugram.\n\nSubject: First Appeal against non-redressal of Grievance HR-CMW-2026-88192 within prescribed timeline.\n\nRespected Sir,\nThe appellant filed a formal complaint regarding high-risk potholes on 10 Feb 2026. No corrective action or inspection report has been shared. The appellant prays for an expedited inspection order and directional action against the default.",
      rtiDraft: "APPLICATION FOR INFORMATION UNDER SECTION 6(1) OF THE RTI ACT, 2005\n\nTo,\nThe Public Information Officer (PIO),\nOffice of the Executive Engineer, PWD (B&R), Sohna Division, Haryana.\n\n1. Name of Applicant: Citizen Resident of Sohna\n2. Details of Information Sought:\n   a) Daily progress report on Grievance Reference HR-CMW-2026-88192.\n   b) Names and designations of officials who were assigned to inspect this road stretch since 10 Feb 2026.\n   c) Certified copies of road maintenance contracts, expenditure, and quality test reports for the Sohna Bus Stand road stretch for FY 2025-26.\n   d) Date by which potholes will be permanently repaired.\n\nFee of ₹10 attached via official RTI mode.",
      evidenceSummary: "CIVIC EVIDENCE DOSSIER - PUBLIC SUMMARY\n• Location: Sohna-Alwar Highway, Near Bus Stand Chowk, Sohna (Ward 4)\n• Grievance Ref: HR-CMW-2026-88192 (Haryana CM Window)\n• Date Filed: 10 Feb 2026 (13 Days Pending)\n• Classification: Safety-Critical Hazard (Potholes >12cm deep)\n• Status: Overdue by 8 days beyond citizen charter limit\n• Actions Taken: First Appeal submitted + RTI filed with PWD Gurugram circle."
    }
  },
  {
    id: "DEMO-SOHNA-02",
    isDemo: true,
    category: "Waste Management",
    categoryHi: "कचरा व ठोस अपशिष्ट प्रबंधन",
    portalId: "swachhata",
    portalName: "Swachhata Urban Portal",
    portalRefNumber: "SW-SOHNA-49102",
    dept: "Sanitation & Solid Waste Cell, Sohna Municipal Committee",
    deptHi: "स्वच्छता एवं ठोस अपशिष्ट प्रकोष्ठ, सोहना नगरपालिका समिति",
    location: "Opposite Govt Girls Senior Secondary School, Ward 7, Sohna, Haryana",
    desc: "Secondary waste collection point overflowing for 6 days. Stray cattle foraging and foul odor affecting 400+ school students daily.",
    urgency: "high",
    urgencyReason: "Health and sanitation hazard adjacent to educational institution.",
    filingDate: "16 Feb 2026, 09:00 AM",
    filingTimestamp: Date.now() - 7 * 86400000,
    expectedResolutionDays: 2,
    status: "follow_up_due",
    statusHi: "फॉलो-अप आवश्यक (समय सीमा समाप्त)",
    daysElapsed: 7,
    evidencePhotos: [
      "https://images.unsplash.com/photo-1605600659873-d808a13e4d2a?auto=format&fit=crop&w=600&q=80"
    ],
    afterPhoto: null,
    resolutionConfirmed: false,
    aiDraftSubject: "Urgent sanitation clearance: Overflowing waste dump outside Govt Girls School, Ward 7 Sohna",
    aiDraftBody: "To,\nThe Chief Sanitary Inspector,\nSohna Municipal Committee, Haryana.\n\nRespected Sir/Madam,\nThis is to register serious concern over the uncleared solid waste dumping site directly opposite Govt Girls Senior Secondary School, Ward 7. The municipal skip has been overflowing since last week, causing foul stench, breeding mosquitoes, and posing acute health risks to girl students and local residents. Kindly arrange immediate compactor clearance and implement daily lifting.\n\nYours sincerely,\nConcerned Citizen",
    timeline: [
      {
        title: "AI Complaint Draft Prepared",
        date: "16 Feb 2026, 08:45 AM",
        note: "Drafted with high urgency due to school proximity.",
        actor: "JanSetu AI Copilot"
      },
      {
        title: "Filed on Swachhata Urban Portal",
        date: "16 Feb 2026, 09:00 AM",
        note: "Portal token issued: SW-SOHNA-49102.",
        actor: "Citizen"
      },
      {
        title: "2-Day Standard Sanitation Window Passed",
        date: "18 Feb 2026, 09:00 AM",
        note: "No clearance recorded. Follow-up action recommended.",
        actor: "JanSetu Tracker"
      }
    ]
  },
  {
    id: "DEMO-SOHNA-03",
    isDemo: true,
    category: "Street Lighting",
    categoryHi: "स्ट्रीट लाइट",
    portalId: "haryanaCmWindow",
    portalName: "Haryana CM Window / DHBVN",
    portalRefNumber: "DHBVN-SOH-7182",
    dept: "Municipal Electrical Maintenance / DHBVN Sub-division Sohna",
    deptHi: "नगरपालिका विद्युत प्रकोष्ठ / डीएचबीवीएन उपमंडल सोहना",
    location: "Shiv Kund Road, Poles #12 to #16, Ward 2, Sohna, Haryana",
    desc: "4 consecutive sodium/LED streetlights unlit for 10 days. The pilgrimage stretch towards hot sulphur springs is plunged in complete darkness at night.",
    urgency: "medium",
    urgencyReason: "Night pedestrian security risk on historic civic tourist route.",
    filingDate: "21 Feb 2026, 07:30 PM",
    filingTimestamp: Date.now() - 2 * 86400000,
    expectedResolutionDays: 3,
    status: "filed",
    statusHi: "दर्ज (समय सीमा के भीतर)",
    daysElapsed: 2,
    evidencePhotos: [],
    afterPhoto: null,
    resolutionConfirmed: false,
    aiDraftSubject: "Restoration of unlit street lamps on Shiv Kund Road (Poles 12-16)",
    aiDraftBody: "To,\nThe Sub-Divisional Officer (Electrical),\nDHBVN / Sohna Municipality.\n\nSir,\nKindly repair non-functional streetlights on Poles #12 to #16 on Shiv Kund Road. The area is pitch dark after sundown, causing security issues for elders and tourists visiting the kund. Please replace burned driver units or faulty feeder wires.\n\nThank you,\nLocal Resident",
    timeline: [
      {
        title: "Complaint Prepared & Verified",
        date: "21 Feb 2026, 07:15 PM",
        note: "Tagged under Municipal Electrical Maintenance.",
        actor: "JanSetu AI Copilot"
      },
      {
        title: "Filed on DHBVN Citizen Portal",
        date: "21 Feb 2026, 07:30 PM",
        note: "Reference: DHBVN-SOH-7182. Within standard 3-day SLA window.",
        actor: "Citizen"
      }
    ]
  },
  {
    id: "DEMO-SOHNA-04",
    isDemo: true,
    category: "Water Supply",
    categoryHi: "जल आपूर्ति",
    portalId: "cpgrams",
    portalName: "CPGRAMS / Haryana Public Health Engineering",
    portalRefNumber: "PHED-HR-2026-10492",
    dept: "Public Health Engineering Department (PHED) / Urban Water Division",
    deptHi: "जन स्वास्थ्य अभियांत्रिकी विभाग (PHED), हरियाणा",
    location: "Near Old Tehsil Complex, Badshahpur-Sohna Road, Sohna, Haryana",
    desc: "Underground pipeline rupture leading to contaminated tap water (brown sewage mixing) in 35 households for 3 consecutive days.",
    urgency: "safety-critical",
    urgencyReason: "Drinking water contamination; immediate risk of water-borne epidemics.",
    filingDate: "05 Feb 2026, 10:00 AM",
    filingTimestamp: Date.now() - 18 * 86400000,
    expectedResolutionDays: 2,
    status: "resolved",
    statusHi: "नागरिक द्वारा सत्यापित समाधान",
    daysElapsed: 4,
    evidencePhotos: [
      "https://images.unsplash.com/photo-1584466977773-e625c37cdd50?auto=format&fit=crop&w=600&q=80"
    ],
    afterPhoto: "https://images.unsplash.com/photo-1574482620826-40685ca5ebd2?auto=format&fit=crop&w=600&q=80",
    resolutionConfirmed: true,
    resolutionDate: "09 Feb 2026, 04:30 PM",
    resolutionNotes: "Citizen verified on-site: Water main replaced by PHED maintenance gang, pressure normalized, clean water sample tested and verified by local residents.",
    aiDraftSubject: "Urgent: Sewage mixing in tap water line near Old Tehsil Complex, Sohna",
    aiDraftBody: "To,\nThe Executive Engineer, PHED Division Sohna.\n\nSir,\nSevere contamination reported in domestic water supply lines serving Old Tehsil Complex. Foul-smelling brownish water is being supplied, indicating a suction leak near the adjacent storm drain. Immediate supply shutoff and leak repair requested to protect public health.\n\nCitizen Resident",
    timeline: [
      {
        title: "Complaint Drafted with Top Urgency",
        date: "05 Feb 2026, 09:40 AM",
        note: "Safety-critical flag assigned due to water contamination.",
        actor: "JanSetu AI Copilot"
      },
      {
        title: "Filed on PHED Grievance Portal",
        date: "05 Feb 2026, 10:00 AM",
        note: "Reference: PHED-HR-2026-10492.",
        actor: "Citizen"
      },
      {
        title: "PHED Repair Team Fixed Joint",
        date: "08 Feb 2026, 02:00 PM",
        note: "Pipe joint sealed and line chlorinated.",
        actor: "Department Maintenance"
      },
      {
        title: "Citizen Verified & Confirmed Resolution",
        date: "09 Feb 2026, 04:30 PM",
        note: "Citizen inspected clear water flow and uploaded 'After' photo verification.",
        actor: "Citizen (Verified on JanSetu)"
      }
    ]
  },
  {
    id: "DEMO-SOHNA-05",
    isDemo: true,
    category: "Roads & Potholes",
    categoryHi: "सड़क और गड्ढे",
    portalId: "haryanaCmWindow",
    portalName: "Haryana CM Window",
    portalRefNumber: null,
    dept: "Sohna Municipal Committee / Ward 3 Works Cell",
    deptHi: "सोहना नगरपालिका समिति / वार्ड 3 निर्माण प्रकोष्ठ",
    location: "Gali No. 4, Adarsh Colony, Sohna, Haryana",
    desc: "Damaged drainage slab caved in over roadside gutter. Open gap dangerous for school children and bicycles.",
    urgency: "high",
    urgencyReason: "Open drain slab collapse risk in residential lane.",
    filingDate: "Today, 10:15 AM",
    filingTimestamp: Date.now() - 7200000,
    expectedResolutionDays: 4,
    status: "draft",
    statusHi: "ड्राफ्ट तैयार (पोर्टल पर दर्ज करना बाकी)",
    daysElapsed: 0,
    evidencePhotos: [],
    afterPhoto: null,
    resolutionConfirmed: false,
    aiDraftSubject: "Urgent replacement of caved-in drain cover slab in Gali 4, Adarsh Colony",
    aiDraftBody: "To,\nThe Municipal Engineer,\nSohna Municipal Committee, Haryana.\n\nSir,\nA reinforced concrete slab over the roadside storm drain in Gali No. 4, Adarsh Colony has fractured and fallen in. The exposed cavity creates a serious falling hazard for young pedestrians and vehicles. Kindly arrange a replacement pre-cast slab at the earliest.\n\nYours faithfully,\nResident, Ward 3",
    timeline: [
      {
        title: "AI Draft Ready for Filing",
        date: "Today, 10:15 AM",
        note: "Ready with pre-filled fields. Citizen needs to copy and paste to Haryana CM Window.",
        actor: "JanSetu AI Copilot"
      }
    ]
  }
];

export const demoScenarioTicket = initialSeedGrievances[0]; // Sohna pothole story for 60-second hackathon demo
