'use strict';

// ============================================================
// Scoring Engine — Dementia Screening App
// ============================================================
// All weights and thresholds are named constants so they are
// easy to audit, explain to clinical staff, and adjust.
// ============================================================

// ─── Weights (must sum to 1.0) ────────────────────────────────
const WEIGHTS = {
  memory:    0.4,   // Strongest predictor for this domain
  speech:    0.3,
  cognitive: 0.3,
};

// ─── Risk thresholds (composite score 0–100) ─────────────────
// Higher composite = more signs of impairment
const RISK_THRESHOLDS = {
  low:    40,   // composite < 40  → low
  medium: 70,   // 40 ≤ composite ≤ 70 → medium  /  > 70 → high
};

// ─── Baseline deviation penalty ──────────────────────────────
// If user has a prior baseline, we add up to MAX_BASELINE_PENALTY
// points when their score has worsened significantly.
const BASELINE_DEVIATION_PENALTY_RATE = 0.10; // 10 pts per 100% deviation
const MAX_BASELINE_PENALTY            = 15;   // cap at 15 extra points

// ─── Speech normal ranges ────────────────────────────────────
const SPEECH_NORMAL_WPM_MIN = 120;
const SPEECH_NORMAL_WPM_MAX = 180;

// Hesitation/filler words used for pause_ratio proxy
const HESITATION_WORDS = ['um', 'uh', 'er', 'ah', 'hmm', 'like', 'you know'];

// ─── Cognitive reaction time bounds (ms) ─────────────────────
const REACTION_NORMAL_MS = 250;   // fast end of normal
const REACTION_SLOW_MS   = 800;   // above this = maximum impairment
const ERROR_PENALTY_PER  = 5;     // points per error
const ERROR_PENALTY_CAP  = 20;    // capped penalty from errors


// ============================================================
// Sub-Score Calculators (each returns 0–100; higher = worse)
// ============================================================

/**
 * Memory component.
 * Impairment = 1 - (recalled ∩ shown / shown.length)
 * Perfect recall → 0; recalled nothing → 100
 */
function calcMemoryScore(wordsShown, wordsRecalled) {
  if (!wordsShown || wordsShown.length === 0) return 50; // no data → neutral

  const shownSet    = new Set(wordsShown.map((w) => w.trim().toLowerCase()));
  const recalledSet = new Set((wordsRecalled || []).map((w) => w.trim().toLowerCase()));

  let correctCount = 0;
  for (const word of recalledSet) {
    if (shownSet.has(word)) correctCount++;
  }

  const recallRatio = correctCount / shownSet.size;
  return parseFloat(((1 - recallRatio) * 100).toFixed(2));
}

/**
 * Speech component.
 * Combines three sub-metrics:
 *   1. WPM deviation from normal range (120–180 wpm)
 *   2. pause_ratio proxy — hesitation word frequency
 *   3. vocab_repetition — ratio of repeated unique words
 *
 * @param {string} transcript  Raw transcript text
 * @param {number} durationSeconds  Recording duration in seconds
 * @returns {{ pause_ratio, words_per_minute, vocab_repetition, score }}
 */
function calcSpeechMetrics(transcript, durationSeconds) {
  if (!transcript || transcript.trim().length === 0) {
    return { pause_ratio: 0, words_per_minute: 0, vocab_repetition: 0, score: 50 };
  }

  const words     = transcript.trim().split(/\s+/);
  const wordCount = words.length;

  // 1. Words per minute
  const durationMinutes = (durationSeconds || 60) / 60;
  const wpm             = wordCount / durationMinutes;

  // WPM impairment: deviation outside [120, 180] → 0–100
  let wpmScore;
  if (wpm >= SPEECH_NORMAL_WPM_MIN && wpm <= SPEECH_NORMAL_WPM_MAX) {
    wpmScore = 0; // normal
  } else if (wpm < SPEECH_NORMAL_WPM_MIN) {
    // Too slow
    wpmScore = Math.min(100, ((SPEECH_NORMAL_WPM_MIN - wpm) / SPEECH_NORMAL_WPM_MIN) * 100);
  } else {
    // Too fast (also unusual in this context)
    wpmScore = Math.min(100, ((wpm - SPEECH_NORMAL_WPM_MAX) / SPEECH_NORMAL_WPM_MAX) * 100);
  }

  // 2. pause_ratio proxy — fraction of words that are hesitation fillers
  const hesitationCount = words.filter((w) =>
    HESITATION_WORDS.includes(w.replace(/[^a-z]/gi, '').toLowerCase())
  ).length;
  const pause_ratio  = parseFloat((hesitationCount / wordCount).toFixed(4));
  const pauseScore   = Math.min(100, pause_ratio * 500); // scale: 20% filler → 100

  // 3. Vocabulary repetition — unique words / total words (inverted)
  const uniqueWords     = new Set(words.map((w) => w.replace(/[^a-z]/gi, '').toLowerCase()));
  const vocab_repetition = parseFloat((1 - uniqueWords.size / wordCount).toFixed(4));
  const repetitionScore  = Math.min(100, vocab_repetition * 200); // scale: 50% repeat → 100

  // Weighted speech sub-score
  const score = parseFloat(
    (0.4 * wpmScore + 0.3 * pauseScore + 0.3 * repetitionScore).toFixed(2)
  );

  return {
    words_per_minute: parseFloat(wpm.toFixed(2)),
    pause_ratio,
    vocab_repetition,
    score,
  };
}

/**
 * Cognitive component.
 * Combines reaction time normalised 0–100 plus an error penalty.
 * Reaction 250ms → 0 (best); 800ms+ → 100 (worst)
 */
function calcCognitiveScore(avgReactionMs, errors) {
  const rxMs = avgReactionMs || REACTION_SLOW_MS;

  const rxNorm = Math.min(
    100,
    Math.max(0, ((rxMs - REACTION_NORMAL_MS) / (REACTION_SLOW_MS - REACTION_NORMAL_MS)) * 100)
  );

  const errorPenalty = Math.min(ERROR_PENALTY_CAP, (errors || 0) * ERROR_PENALTY_PER);

  return parseFloat(Math.min(100, rxNorm + errorPenalty).toFixed(2));
}


// ============================================================
// Composite Scorer
// ============================================================

/**
 * Compute the composite risk score and risk level.
 *
 * @param {object} memResult   - { words_shown, words_recalled }
 * @param {object} speechResult - { transcript, duration_seconds }
 * @param {object} cogResult   - { avg_reaction_ms, errors }
 * @param {number|null} baselineComposite - composite score from user's baseline session
 * @returns {{
 *   composite_score: number,
 *   risk_level: 'low'|'medium'|'high',
 *   flagged_for_referral: boolean,
 *   summary_text: string,
 *   baseline_deviation_pct: number|null,
 *   sub_scores: { memory, speech, cognitive }
 * }}
 */
function computeRiskScore(memResult, speechResult, cogResult, baselineComposite = null) {
  // ── Sub-scores ───────────────────────────────────────────
  const memoryScore    = calcMemoryScore(memResult.words_shown, memResult.words_recalled);
  const speechMetrics  = calcSpeechMetrics(speechResult.transcript, speechResult.duration_seconds);
  const cognitiveScore = calcCognitiveScore(cogResult.avg_reaction_ms, cogResult.errors);

  // ── Weighted composite ───────────────────────────────────
  let composite = parseFloat(
    (
      WEIGHTS.memory    * memoryScore    +
      WEIGHTS.speech    * speechMetrics.score +
      WEIGHTS.cognitive * cognitiveScore
    ).toFixed(2)
  );

  // ── Baseline deviation penalty ───────────────────────────
  let baselineDeviationPct = null;
  if (baselineComposite !== null && baselineComposite > 0) {
    baselineDeviationPct = parseFloat(
      (((composite - baselineComposite) / baselineComposite) * 100).toFixed(2)
    );

    if (baselineDeviationPct > 0) {
      // Positive deviation = worsened → apply penalty
      const penalty = Math.min(
        MAX_BASELINE_PENALTY,
        baselineDeviationPct * BASELINE_DEVIATION_PENALTY_RATE
      );
      composite = parseFloat(Math.min(100, composite + penalty).toFixed(2));
    }
  }

  // ── Risk level ───────────────────────────────────────────
  let risk_level;
  if (composite < RISK_THRESHOLDS.low) {
    risk_level = 'low';
  } else if (composite <= RISK_THRESHOLDS.medium) {
    risk_level = 'medium';
  } else {
    risk_level = 'high';
  }

  const flagged_for_referral = risk_level === 'high';

  // ── Summary text (English; extend via language map) ───────
  const summary_text = buildSummaryText(risk_level, composite, baselineDeviationPct, flagged_for_referral);

  return {
    composite_score:       composite,
    risk_level,
    flagged_for_referral,
    summary_text,
    baseline_deviation_pct: baselineDeviationPct,
    sub_scores: {
      memory:    memoryScore,
      speech:    speechMetrics.score,
      cognitive: cognitiveScore,
    },
  };
}

/**
 * Generate a human-readable summary in English.
 * i18n extension point: replace this with a language-keyed map lookup
 * using the user's preferred_language field.
 */
function buildSummaryText(riskLevel, composite, deviationPct, flagged) {
  const deviationNote = deviationPct !== null
    ? ` Your score has ${deviationPct > 0 ? 'increased' : 'improved'} by ${Math.abs(deviationPct).toFixed(1)}% compared to your baseline.`
    : '';

  const referralNote = flagged
    ? ' We strongly recommend consulting a neurologist or geriatrician at your earliest convenience.'
    : '';

  switch (riskLevel) {
    case 'low':
      return `Your cognitive screening score is ${composite}/100, indicating a low risk of cognitive impairment at this time.${deviationNote} Continue regular screenings every 6 months.`;

    case 'medium':
      return `Your cognitive screening score is ${composite}/100, indicating a moderate risk of cognitive impairment.${deviationNote} We recommend discussing these results with a healthcare provider.${referralNote}`;

    case 'high':
      return `Your cognitive screening score is ${composite}/100, indicating a high risk of cognitive impairment.${deviationNote}${referralNote}`;

    default:
      return `Screening complete. Composite score: ${composite}/100.`;
  }
}


module.exports = {
  computeRiskScore,
  calcMemoryScore,
  calcSpeechMetrics,
  calcCognitiveScore,
  // Export constants for documentation/testing
  WEIGHTS,
  RISK_THRESHOLDS,
  BASELINE_DEVIATION_PENALTY_RATE,
  MAX_BASELINE_PENALTY,
};
