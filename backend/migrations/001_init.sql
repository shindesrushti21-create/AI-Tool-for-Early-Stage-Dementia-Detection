-- ============================================================
-- Migration 001: Initial Schema
-- Dementia Screening App
-- Run: psql $DATABASE_URL -f migrations/001_init.sql
-- ============================================================

-- gen_random_uuid() is built-in in PostgreSQL 13+

-- ─── Users ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT        NOT NULL,
  email            TEXT        UNIQUE NOT NULL,
  password_hash    TEXT        NOT NULL,
  age              INT,
  preferred_language TEXT      DEFAULT 'en',
  created_at       TIMESTAMP   DEFAULT now()
);

-- ─── Test Sessions ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS test_sessions (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        REFERENCES users(id) ON DELETE CASCADE,
  started_at   TIMESTAMP   DEFAULT now(),
  completed_at TIMESTAMP,
  status       TEXT        DEFAULT 'in_progress',   -- 'in_progress' | 'completed'
  is_baseline  BOOLEAN     DEFAULT false
);

-- ─── Memory Results ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS memory_results (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id   UUID        REFERENCES test_sessions(id) ON DELETE CASCADE,
  words_shown  TEXT[],
  words_recalled TEXT[],
  score        NUMERIC                                -- 0–100 impairment score
);

-- ─── Speech Results ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS speech_results (
  id                 UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id         UUID      REFERENCES test_sessions(id) ON DELETE CASCADE,
  transcript         TEXT,
  duration_seconds   NUMERIC,
  pause_ratio        NUMERIC,   -- proxy: hesitation-word frequency 0–1
  words_per_minute   NUMERIC,
  vocab_repetition   NUMERIC    -- 0–1 ratio of repeated unique words
);

-- ─── Cognitive Results ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS cognitive_results (
  id               UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id       UUID      REFERENCES test_sessions(id) ON DELETE CASCADE,
  avg_reaction_ms  NUMERIC,
  errors           INT,
  task_type        TEXT
);

-- ─── Risk Scores ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS risk_scores (
  id                    UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id            UUID      REFERENCES test_sessions(id) ON DELETE CASCADE,
  composite_score       NUMERIC,
  risk_level            TEXT,     -- 'low' | 'medium' | 'high'
  summary_text          TEXT,
  flagged_for_referral  BOOLEAN   DEFAULT false,
  baseline_deviation_pct NUMERIC  -- % change from user's first session (NULL if baseline)
);

-- ─── Content Tables ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS case_studies (
  id         UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  title      TEXT,
  body       TEXT,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE IF NOT EXISTS faqs (
  id         UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  question   TEXT,
  answer     TEXT,
  sort_order INT
);

CREATE TABLE IF NOT EXISTS reviews (
  id         UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  author     TEXT,
  rating     INT       CHECK (rating BETWEEN 1 AND 5),
  body       TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- ─── Analytics Events ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS analytics_events (
  id          UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name  TEXT,
  payload     JSONB,
  created_at  TIMESTAMP DEFAULT now()
);

-- ─── Indexes ─────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_test_sessions_user_id    ON test_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_test_sessions_status     ON test_sessions(status);
CREATE INDEX IF NOT EXISTS idx_memory_results_session   ON memory_results(session_id);
CREATE INDEX IF NOT EXISTS idx_speech_results_session   ON speech_results(session_id);
CREATE INDEX IF NOT EXISTS idx_cognitive_results_session ON cognitive_results(session_id);
CREATE INDEX IF NOT EXISTS idx_risk_scores_session      ON risk_scores(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_name     ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at     ON analytics_events(created_at);
