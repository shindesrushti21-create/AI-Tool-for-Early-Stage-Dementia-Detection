# CogniCare — Backend API

Early dementia / cognitive screening backend. Node.js + Express + PostgreSQL + JWT.

---

## Prerequisites

| Requirement | Minimum Version |
|---|---|
| Node.js | 18.x |
| npm | 9.x |
| PostgreSQL | 14.x |

---

## Quick Start

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd Backend-Dementia
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Open `.env` and set:

| Variable | Description |
|---|---|
| `DATABASE_URL` | Full PostgreSQL connection string |
| `JWT_SECRET` | Long random secret (e.g. `openssl rand -base64 64`) |
| `JWT_EXPIRES_IN` | Token lifetime (default `7d`) |
| `PORT` | Server port (default `5000`) |
| `CORS_ORIGIN` | Frontend origin(s), comma-separated (default `http://localhost:3000`) |
| `RESPONSE_TIME_SLA_MS` | SLA threshold in ms (default `300`) |
| `NGO_NAME` / `NGO_ADDRESS` / `NGO_LAT` / `NGO_LNG` | NGO details for schema + location endpoints |

### 3. Create the Database

```bash
# Create DB (if it doesn't exist yet)
createdb dementia_screening

# Or using psql
psql -U postgres -c "CREATE DATABASE dementia_screening;"
```

### 4. Run Migrations

```bash
# Linux / macOS
npm run migrate

# Windows (PowerShell)
psql %DATABASE_URL% -f migrations/001_init.sql
```

### 5. Seed Demo Data

```bash
# Linux / macOS
npm run seed

# Windows (PowerShell)
psql %DATABASE_URL% -f migrations/seed.sql
```

This inserts 5 case studies, 5 FAQs, and 3 reviews for the content endpoints.

### 6. Start the Server

```bash
# Development (auto-restart on file changes)
npm run dev

# Production
npm start
```

Server starts at `http://localhost:5000`.

---

## Verify It's Running

```bash
curl http://localhost:5000/health
# → { "status": "ok", "timestamp": "..." }

curl http://localhost:5000/robots.txt
# → User-agent: * ...

curl http://localhost:5000/api/content/faqs
# → { "data": [ ... 5 FAQs ... ] }
```

---

## Project Structure

```
Backend-Dementia/
├── src/
│   ├── config/
│   │   └── db.js                  # pg.Pool singleton
│   ├── middleware/
│   │   ├── auth.js                # JWT Bearer verification
│   │   └── responseTime.js        # SLA response-time logging
│   ├── routes/
│   │   ├── auth.js                # POST /register, /login; GET /me
│   │   ├── sessions.js            # Full session lifecycle
│   │   ├── content.js             # Case studies, FAQs, reviews, pages, location, contact
│   │   ├── analytics.js           # POST /api/analytics/event
│   │   └── schema.js              # GET /api/schema/organization (JSON-LD)
│   ├── services/
│   │   └── scoringEngine.js       # Composite risk scoring logic
│   └── app.js                     # Express wiring
├── migrations/
│   ├── 001_init.sql               # Schema DDL
│   └── seed.sql                   # Demo data
├── public/
│   └── robots.txt                 # Served as static file
├── docs/
│   └── api-contract.md            # Full API contract
├── .env.example
├── server.js                      # Entry point
└── package.json
```

---

## Scoring Engine

All weights and thresholds are named constants in [`src/services/scoringEngine.js`](src/services/scoringEngine.js).

### Sub-scores (0–100, higher = more impaired)

| Component | Formula |
|---|---|
| **Memory** | `(1 - recalled∩shown / total_shown) × 100` |
| **Speech** | Weighted: WPM deviation (40%) + hesitation frequency (30%) + vocab repetition (30%) |
| **Cognitive** | Normalised reaction time + error penalty (5 pts/error, capped at 20) |

### Composite

```
composite = 0.4 × memory + 0.3 × speech + 0.3 × cognitive
```

If a prior baseline session exists:
```
baseline_deviation_pct = (composite - baseline) / baseline × 100
penalty = min(15, deviation_pct × 0.10)   # up to +15pts for regression
composite = min(100, composite + penalty)
```

### Risk Levels

| Range | Level | Referral |
|---|---|---|
| composite < 40 | `low` | No |
| 40 ≤ composite ≤ 70 | `medium` | Recommended |
| composite > 70 | `high` | **Flagged** |

---

## API Contract

See [`docs/api-contract.md`](docs/api-contract.md) for full request/response shapes.

All protected routes require: `Authorization: Bearer <jwt>`

| Route | Auth | Description |
|---|---|---|
| `POST /api/auth/register` | No | Register new user |
| `POST /api/auth/login` | No | Login, get token |
| `GET /api/auth/me` | Yes | Current user profile |
| `POST /api/sessions` | Yes | Start a new session |
| `POST /api/sessions/:id/memory` | Yes | Submit memory recall |
| `POST /api/sessions/:id/speech` | Yes | Submit speech sample |
| `POST /api/sessions/:id/cognitive` | Yes | Submit reaction time |
| `POST /api/sessions/:id/finalize` | Yes | Compute risk score |
| `GET /api/sessions/:id/report` | Yes | Full session report |
| `GET /api/content/case-studies` | No | Fetch case studies |
| `GET /api/content/faqs` | No | Fetch FAQs |
| `GET /api/content/reviews` | No | Fetch reviews |
| `GET /api/content/pages` | No | SEO page metadata |
| `GET /api/content/location` | No | NGO location for map |
| `POST /api/content/contact` | No | Contact form |
| `POST /api/analytics/event` | No | Log custom event |
| `GET /api/schema/organization` | No | JSON-LD NGO schema |
| `GET /health` | No | Health check |

---

## Response-Time SLA

Every request is logged to console with timing:
```
✅  POST   /api/sessions → 201 — 12.3ms
⚠️  SLA BREACH  POST /api/sessions/:id/finalize → 200 — 342ms (limit: 300ms)
```

Threshold is set via `RESPONSE_TIME_SLA_MS` in `.env` (default 300ms).

---

## i18n / Preferred Language

- `preferred_language` is stored on the `users` table (e.g. `'en'`, `'hi'`, `'mr'`).
- The scoring engine generates summary text in English currently.
- To extend: add a language map in `src/services/scoringEngine.js` → `buildSummaryText()`.
- The frontend uses `preferred_language` from the JWT payload to render UI in the appropriate language.

---

## Checklist Items Handled by This Backend

| Item | How |
|---|---|
| `robots.txt` | `express.static('public')` → `public/robots.txt` |
| Unique page titles / meta | `GET /api/content/pages` returns per-route metadata |
| JSON-LD schema | `GET /api/schema/organization` |
| Analytics events | `POST /api/analytics/event` + auto-log on high-risk finalize |
| Response-time SLA | `responseTime` middleware, console warnings |
| Case studies / FAQs / Reviews | DB-backed `GET /api/content/*` endpoints |
| Custom 404 | Express catch-all → `{ error: 'Not found' }` |
| Thank-you redirect | `POST /api/content/contact` → `{ redirect_url: '/thank-you' }` |
| Maps / directions | `GET /api/content/location` → lat/lng + address |
