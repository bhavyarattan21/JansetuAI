# JanSetu AI — Prepared right. Filed fast. Followed up.

[![Deploy with Vercel](https://vercel.com/button)](https://jansetu-ai-eight-theta.vercel.app/)
> **The independent AI copilot that sits in front of government portals.**  
> *JanSetu AI is not connected to any government agency and does not claim official authority. We prepare complaints, track follow-ups, and generate escalations when government portals ignore them.*

---

## 🏛️ Why JanSetu AI?

Government portals (CPGRAMS, State e-District, Municipal portals) have no public APIs for automated complaint filing. Direct portal use by citizens suffers from three major failure points:

1. **Citizens pick the wrong department, portal, or category.**
2. **They write weak, incomplete complaints and miss required statutory evidence.**
3. **They never follow up, and the complaint is quietly ignored or closed.**

**JanSetu AI solves this at the citizen's side:**
- **Prepared Right:** Generates formal statutory notices with jurisdiction-mapped authorities, urgency tags, and evidence checklists.
- **Filed Fast:** Provides a 30-second copy-paste flow directly into official portals (CPGRAMS, Saral Haryana, e-District).
- **Followed Up:** Automatically detects when SLAs expire and generates 1-click **Right to Information (RTI) applications** and First Appeals.

---

## ✨ Key Features

### 1. Civic Co-Pilot (Multimodal AI)
- **Gemini REST API Integration (`/api/chat` & `/api/ai`):** Server-side rate limited, sanitized, and prompt-injection defended.
- **Multimodal Photo Analysis:** Upload a photo of a civic hazard (pothole, water leak, garbage dump) — AI automatically determines the category, responsible authority, and hazard urgency.
- **Voice Input:** Native Web Speech API with live transcript preview and graceful browser fallbacks.
- **Template Fallback:** 100% resilient — the app functions seamlessly even without an external API key.

### 2. Prepare & File Flow (2-Column Desktop & Mobile Optimized)
- **Form Left, Interactive Map & Tips Right.**
- **Location Picker:** Interactive Google Maps JavaScript API marker with reverse geocoding + automatic fallback to Leaflet & OpenStreetMap.
- **Multi-Photo Evidence:** Camera capture (`capture="environment"`) and gallery picker (up to 3 photos, client-side canvas compression under 1600px at 0.8 quality, 5 MB limit).
- **Privacy First:** Automatic warning reminding citizens to avoid capturing faces or vehicle registration numbers.

### 3. Honest Redressal Tracker ("My Complaints")
- **True Status Pipeline:** *Draft Ready* → *Filed (Confirmed by Citizen with Portal Ref ID)* → *Follow-up Due* → *Escalated* → *Citizen-Verified Resolution*.
- **5-Second Soft Delete with Interactive Undo:** Accidental deletions can be reversed with one tap.
- **Event Audit Timeline:** Chronological logging of citizen-verified actions.

### 4. Overdue Escalation Engine
- Generates 1-click **Right to Information (RTI Act 2005, Section 6(1))** applications.
- Generates formal reminder notices and Nodal Officer appeals.
- Exports complete evidence dossiers as downloadable PDFs or formatted text with direct portal submission links.

### 5. Profile-Based Welfare Schemes & Document Hub
- **25+ Real Central & State Schemes:** Deterministic rules-based eligibility matching across farmers, healthcare, housing, women & children, and artisans.
- **Statutory Document Readiness Checklists:** Interactive checkboxes for Income, Caste, Domicile, Birth, Death, and Disability certificates.
- **Department Monogram Badges:** Clean, institutional monograms (`REV`, `SDM`, `DM`, `CRS`, `DMB`) with statutory authority mapping.

### 6. 1-Click 60-Second Demo Scenario
- Specifically designed for hackathon evaluation: loads a real-world Sohna highway pothole case with overdue timeline, enabling instant demonstration of the RTI escalation engine.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/bhavyarattan21/JansetuAI.git
cd JansetuAI

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Run local development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

| Variable | Description | Default / Fallback |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Google Gemini API Key for AI copilot | High-fidelity template fallback |
| `GEMINI_MODEL` | Gemini Model (e.g. `gemini-2.5-flash`) | `gemini-2.5-flash` |
| `VITE_GOOGLE_MAPS_API_KEY` | Google Maps JavaScript API key | Leaflet + OpenStreetMap fallback |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth 2.0 Web Client ID | Interactive popup & 1-click citizen access |

---

## 📱 Progressive Web App (PWA)

JanSetu AI is fully installable on mobile devices:
- Includes Web App Manifest (`/manifest.json`)
- Offline application shell caching via Service Worker (`/sw.js`)
- Responsive design tailored for 360px, 390px, 768px, 1024px, and 1440px viewport widths.

---

## 🔒 Honest Civic Commitment

- JanSetu AI does **not** claim to be an official government portal.
- We do not display fake government seals, simulated work orders, or fictional nodal officers.
- Every stat and claim presented in the interface is verifiable and accurate.
