# CogniGuard — AI-Based Early Dementia Screening Platform

CogniGuard is a low-cost, accessible mobile and web cognitive screening application built for NGO healthcare field workers, senior patients, and family caregivers. It evaluates short-term memory recall, visual reaction speed, and speech acoustic patterns to detect early subtle signs of Mild Cognitive Impairment (MCI) and dementia.

---

## 🌟 Key Features

- **3-Step Quantitative Screening Sequence**:
  1. **Short-Term Memory Recall (`/test/memory`)**: 5-target word exposure with countdown timer and dual input recall evaluation.
  2. **Visual Reaction Latency (`/test/cognitive`)**: Target matching test measuring millisecond reaction latency and mis-click errors over 5 trials.
  3. **Vernacular Voice Analysis (`/test/speech`)**: Web Speech API real-time speech recognition supporting English (`en-US`) and Hindi (`hi-IN`) voice toggle. Evaluates pause ratios, WPM, and vocabulary repetition rates.
- **Clinical Risk Assessment Report (`/report/:sessionId`)**: Calculates an overall risk index (0–100%), displays domain breakdowns, highlights flagged clinical referral alerts, and offers instant PDF print capability.
- **Senior-Friendly Accessibility**: Built with large typography (18px+ base font), top-bar font scaling controls (`A` / `A+` / `A++`), high-contrast theme toggle, and 48px+ touch target buttons.
- **Dual Backend & Standalone Support**: Built-in client-side mock fallback engine ensures the app functions interactively out of the box, alongside a standalone `server.js` Express backend.

---

## 📋 20-Item Hackathon Checklist Mapping

| # | Item | Location / Implementation |
|---|------|---------------------------|
| 1 | **Custom 404 page** | Dedicated `NotFoundPage.jsx` component mapped to `*` route with friendly message & link to `/dashboard`. |
| 2 | **CTA above the fold** | Landing page hero section features "Start Free Screening" primary button visible without scrolling. |
| 3 | **Internal links** | Header and footer link to FAQs, Case Studies, Reviews, Privacy Policy, and Team page. |
| 4 | **Thank-you page** | `/thank-you` route rendered after registration and form submissions. |
| 5 | **Breadcrumbs** | `Breadcrumbs.jsx` trail component on nested routes (`Dashboard > Test > Memory`). |
| 6 | **Case studies** | `/case-studies` page fetching NGO field trial data from `GET /api/content/case-studies`. |
| 7 | **5 FAQs** | `/faqs` page fetching clinical FAQs from `GET /api/content/faqs` with accessible accordion UI. |
| 8 | **Response time promise** | "Get your results in under 5 minutes" highlighted in landing page hero banner. |
| 9 | **Sticky mobile CTA** | `StickyMobileCTA.jsx` fixed bottom banner on mobile viewports. |
| 10 | **robots.txt** | Served directly from `public/robots.txt`. |
| 11 | **Unique page titles** | `react-helmet-async` `<title>` tags on every route. |
| 12 | **Meta descriptions** | `<meta name="description">` defined per route via Helmet. |
| 13 | **Social share image** | Open Graph `og:image` and Twitter card tags injected in `index.html` head. |
| 14 | **Maps & directions** | Interactive clinic location map iframe and driving directions on landing page (`GET /api/content/location`). |
| 15 | **Real reviews** | `/reviews` page fetching clinician & caregiver reviews (`GET /api/content/reviews`). |
| 16 | **Alt text on images** | Real descriptive `alt` text on all `<img>` elements for accessibility. |
| 17 | **Local schema** | MedicalOrganization JSON-LD schema injected in `index.html` head (`GET /api/schema/organization`). |
| 18 | **Privacy Policy page** | `/privacy-policy` static page explaining health data encryption and confidentiality. |
| 19 | **Google Analytics** | GA `gtag.js` script tag in `index.html` + `POST /api/analytics/event` fired on key screening actions. |
| 20 | **Team photo & bios** | `/team` page showcasing NGO research team photos, bios, and project mission. |

---

## 🚀 Quick Setup & Installation

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the project root:
```env
VITE_API_URL=http://localhost:5000
VITE_GA_MEASUREMENT_ID=G-DEMO123456
```

### 3. Running locally

#### Option A: Running Frontend (Standalone / Client Mock Mode)
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

#### Option B: Running Full Stack (Express Mock Server + Vite Frontend)
In terminal 1 (Start Express API):
```bash
node server.js
```

In terminal 2 (Start React Vite App):
```bash
npm run dev
```

---

## 🔗 REST API Contract Endpoints

- `POST /api/auth/register` — User registration `{ name, email, password, age, preferred_language }`
- `POST /api/auth/login` — User authentication `{ email, password }`
- `GET  /api/auth/me` — Fetch active profile (Bearer header)
- `POST /api/sessions` — Start screening session (Bearer header)
- `POST /api/sessions/:id/memory` — Submit memory recall `{ words_shown, words_recalled }`
- `POST /api/sessions/:id/cognitive` — Submit reaction latency `{ avg_reaction_ms, errors, task_type }`
- `POST /api/sessions/:id/speech` — Submit speech transcript `{ transcript }`
- `POST /api/sessions/:id/finalize` — Calculate overall dementia risk score
- `GET  /api/sessions/:id/report` — Fetch clinical risk report & referral status
- `GET  /api/content/case-studies` — Fetch NGO field studies
- `GET  /api/content/faqs` — Fetch screening FAQs
- `GET  /api/content/reviews` — Fetch patient & doctor reviews
- `GET  /api/content/location` — Fetch clinic map coordinates & address
- `GET  /api/schema/organization` — Fetch JSON-LD schema
- `POST /api/analytics/event` — Log internal metrics
