# API Contract — CogniCare Dementia Screening Backend

> **This contract is fixed.** Do not change response shapes without updating this file and coordinating with the frontend team.

---

## Base URL

```
http://localhost:5000   (development)
https://api.cognicare.org  (production)
```

---

## Authentication

- All routes marked **(auth)** require: `Authorization: Bearer <jwt>`
- JWT payload: `{ id, email, name, preferred_language, iat, exp }`
- Token expiry: 7 days

---

## Standard Response Envelopes

**Success:**
```json
{ "data": { ... } }
```

**Error:**
```json
{ "error": "Human-readable message" }
```

---

## Auth Routes

### `POST /api/auth/register`
**Public**

**Request:**
```json
{
  "name": "Sunita Rao",
  "email": "sunita@example.com",
  "password": "securepass123",
  "age": 68,
  "preferred_language": "hi"
}
```

**Response `201`:**
```json
{
  "data": {
    "token": "<jwt>",
    "user": {
      "id": "uuid",
      "name": "Sunita Rao",
      "email": "sunita@example.com",
      "age": 68,
      "preferred_language": "hi",
      "created_at": "2025-01-01T00:00:00Z"
    }
  }
}
```

---

### `POST /api/auth/login`
**Public**

**Request:**
```json
{ "email": "sunita@example.com", "password": "securepass123" }
```

**Response `200`:** same shape as register.

---

### `GET /api/auth/me`
**(auth)**

**Response `200`:**
```json
{ "data": { "user": { ...same user shape... } } }
```

---

## Session Routes

### `POST /api/sessions`
**(auth)** — Create a new test session.

**Response `201`:**
```json
{
  "data": {
    "session": {
      "id": "uuid",
      "user_id": "uuid",
      "started_at": "...",
      "completed_at": null,
      "status": "in_progress",
      "is_baseline": true
    }
  }
}
```
> `is_baseline` is `true` automatically on a user's first session.

---

### `POST /api/sessions/:id/memory`
**(auth)**

**Request:**
```json
{
  "words_shown":    ["apple", "bicycle", "river", "cloud", "table"],
  "words_recalled": ["apple", "river", "table"]
}
```

**Response `201`:**
```json
{
  "data": {
    "score": 40.00,
    "result": { ...full memory_results row... }
  }
}
```
> `score` is an impairment score 0–100 (higher = worse recall).

---

### `POST /api/sessions/:id/speech`
**(auth)**

**Request:**
```json
{
  "transcript": "Um, I remember we went to the, uh, market and then...",
  "duration_seconds": 62
}
```

**Response `201`:**
```json
{
  "data": {
    "pause_ratio": 0.04,
    "wpm": 87.1,
    "vocab_repetition": 0.22,
    "result": { ...full speech_results row... }
  }
}
```
> `pause_ratio` is a proxy derived from hesitation-word frequency (um, uh, er, ah, hmm).
> `wpm` = `word_count / (duration_seconds / 60)`.

---

### `POST /api/sessions/:id/cognitive`
**(auth)**

**Request:**
```json
{
  "avg_reaction_ms": 420,
  "errors": 2,
  "task_type": "go-nogo"
}
```

**Response `201`:**
```json
{ "data": { "saved": true, "result": { ...full cognitive_results row... } } }
```

---

### `POST /api/sessions/:id/finalize`
**(auth)**

All three sub-tests must be submitted before calling this.

**Response `200`:**
```json
{
  "data": {
    "risk_score": {
      "id": "uuid",
      "session_id": "uuid",
      "composite_score": 54.3,
      "risk_level": "medium",
      "summary_text": "Your cognitive screening score is 54.3/100...",
      "flagged_for_referral": false,
      "baseline_deviation_pct": 18.5
    }
  }
}
```

---

### `GET /api/sessions/:id/report`
**(auth)**

**Response `200`:**
```json
{
  "data": {
    "session": { ...test_sessions row... },
    "scores": {
      "memory":    { ...memory_results row... },
      "speech":    { ...speech_results row... },
      "cognitive": { ...cognitive_results row... }
    },
    "summary":              "...",
    "composite_score":      54.3,
    "risk_level":           "medium",
    "flagged_for_referral": false,
    "baseline_deviation_pct": 18.5
  }
}
```

---

## Content Routes (all Public)

### `GET /api/content/case-studies`
```json
{ "data": [ { "id": "uuid", "title": "...", "body": "...", "created_at": "..." } ] }
```

### `GET /api/content/faqs`
```json
{ "data": [ { "id": "uuid", "question": "...", "answer": "...", "sort_order": 1 } ] }
```

### `GET /api/content/reviews`
```json
{ "data": [ { "id": "uuid", "author": "...", "rating": 5, "body": "...", "created_at": "..." } ] }
```

### `GET /api/content/pages`
Per-page SEO metadata for React Helmet:
```json
{
  "data": [
    { "path": "/", "title": "...", "description": "..." },
    ...
  ]
}
```

### `GET /api/content/location`
```json
{
  "data": {
    "name": "CogniCare Foundation",
    "address": "12, Health Avenue, Pune...",
    "lat": 18.5204,
    "lng": 73.8567,
    "phone": "+91-20-12345678",
    "email": "info@cognicare.org",
    "url": "https://cognicare.org"
  }
}
```

### `POST /api/content/contact`
**Public**

**Request:**
```json
{ "name": "...", "email": "...", "message": "...", "phone": "optional" }
```

**Response `200`:**
```json
{ "data": { "success": true, "redirect_url": "/thank-you" } }
```

---

## Analytics

### `POST /api/analytics/event`
**Public**

**Request:**
```json
{ "event_name": "test_completed", "payload": { "session_id": "uuid" } }
```

**Response `201`:**
```json
{ "data": { "logged": true } }
```

---

## Schema

### `GET /api/schema/organization`
**Public** — Returns JSON-LD structured data for the NGO:
```json
{
  "@context": "https://schema.org",
  "@type": "NGO",
  "name": "CogniCare Foundation",
  ...
}
```

---

## Scoring Engine — Weights & Thresholds

| Constant | Value | Description |
|---|---|---|
| `WEIGHTS.memory` | 0.4 | Memory sub-score weight |
| `WEIGHTS.speech` | 0.3 | Speech sub-score weight |
| `WEIGHTS.cognitive` | 0.3 | Cognitive sub-score weight |
| `RISK_THRESHOLDS.low` | 40 | `composite < 40` → **low** |
| `RISK_THRESHOLDS.medium` | 70 | `40 ≤ composite ≤ 70` → **medium**, `> 70` → **high** |
| `BASELINE_DEVIATION_PENALTY_RATE` | 0.10 | Extra pts per 100% deviation from baseline |
| `MAX_BASELINE_PENALTY` | 15 | Maximum penalty points for baseline regression |

> All constants are in `src/services/scoringEngine.js`.

---

## HTTP Status Codes

| Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 400 | Bad request / validation error |
| 401 | Unauthorized (missing/invalid/expired token) |
| 404 | Not found |
| 409 | Conflict (duplicate email, session already completed) |
| 422 | Unprocessable entity (finalize before all sub-tests done) |
| 500 | Internal server error |
