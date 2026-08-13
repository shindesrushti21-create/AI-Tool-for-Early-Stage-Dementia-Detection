'use strict';

const express = require('express');
const { body, validationResult } = require('express-validator');

const db                   = require('../config/db');
const { authenticate }     = require('../middleware/auth');
const { computeRiskScore, calcSpeechMetrics, calcMemoryScore } = require('../services/scoringEngine');

const router = express.Router();

// All session routes require authentication
router.use(authenticate);

// ─── Helpers ─────────────────────────────────────────────────

/** Verify that a session exists and belongs to the requesting user */
async function getSessionForUser(sessionId, userId) {
  const { rows } = await db.query(
    'SELECT * FROM test_sessions WHERE id = $1 AND user_id = $2',
    [sessionId, userId]
  );
  return rows[0] || null;
}

/** Get the user's first completed baseline composite score */
async function getBaselineComposite(userId) {
  const { rows } = await db.query(
    `SELECT rs.composite_score
     FROM risk_scores rs
     JOIN test_sessions ts ON rs.session_id = ts.id
     WHERE ts.user_id = $1
       AND ts.is_baseline = true
       AND ts.status = 'completed'
     ORDER BY ts.completed_at ASC
     LIMIT 1`,
    [userId]
  );
  return rows.length > 0 ? parseFloat(rows[0].composite_score) : null;
}

// ─── POST /api/sessions ──────────────────────────────────────
// Create a new test session. Marks as baseline if user has none yet.
router.post('/', async (req, res) => {
  const userId = req.user.id;

  try {
    // Check for any completed sessions (baseline = first completed session)
    const { rows: existingRows } = await db.query(
      `SELECT id FROM test_sessions
       WHERE user_id = $1 AND status = 'completed'
       LIMIT 1`,
      [userId]
    );

    const isBaseline = existingRows.length === 0;

    const { rows } = await db.query(
      `INSERT INTO test_sessions (user_id, is_baseline)
       VALUES ($1, $2)
       RETURNING *`,
      [userId, isBaseline]
    );

    return res.status(201).json({ data: { session: rows[0] } });
  } catch (err) {
    console.error('[sessions/create]', err.message);
    return res.status(500).json({ error: 'Failed to create session' });
  }
});

// ─── POST /api/sessions/:id/memory ──────────────────────────
router.post(
  '/:id/memory',
  [
    body('words_shown').isArray({ min: 1 }).withMessage('words_shown must be a non-empty array'),
    body('words_recalled').isArray().withMessage('words_recalled must be an array'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

    const session = await getSessionForUser(req.params.id, req.user.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (session.status === 'completed') return res.status(409).json({ error: 'Session already completed' });

    const { words_shown, words_recalled } = req.body;

    try {
      // Compute memory impairment score (0–100, higher = worse)
      const score = calcMemoryScore(words_shown, words_recalled);

      // Upsert: remove old result if re-submitted before finalize
      await db.query('DELETE FROM memory_results WHERE session_id = $1', [req.params.id]);

      const { rows } = await db.query(
        `INSERT INTO memory_results (session_id, words_shown, words_recalled, score)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [req.params.id, words_shown, words_recalled, score]
      );

      return res.status(201).json({ data: { score: rows[0].score, result: rows[0] } });
    } catch (err) {
      console.error('[sessions/memory]', err.message);
      return res.status(500).json({ error: 'Failed to save memory result' });
    }
  }
);

// ─── POST /api/sessions/:id/speech ──────────────────────────
// Payload: { transcript: string, duration_seconds: number }
router.post(
  '/:id/speech',
  [
    body('transcript').notEmpty().withMessage('transcript is required'),
    body('duration_seconds')
      .isFloat({ min: 1 })
      .withMessage('duration_seconds must be a positive number'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

    const session = await getSessionForUser(req.params.id, req.user.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (session.status === 'completed') return res.status(409).json({ error: 'Session already completed' });

    const { transcript, duration_seconds } = req.body;

    try {
      const metrics = calcSpeechMetrics(transcript, duration_seconds);

      await db.query('DELETE FROM speech_results WHERE session_id = $1', [req.params.id]);

      const { rows } = await db.query(
        `INSERT INTO speech_results
           (session_id, transcript, duration_seconds, pause_ratio, words_per_minute, vocab_repetition)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          req.params.id,
          transcript,
          duration_seconds,
          metrics.pause_ratio,
          metrics.words_per_minute,
          metrics.vocab_repetition,
        ]
      );

      return res.status(201).json({
        data: {
          pause_ratio:      rows[0].pause_ratio,
          wpm:              rows[0].words_per_minute,
          vocab_repetition: rows[0].vocab_repetition,
          result:           rows[0],
        },
      });
    } catch (err) {
      console.error('[sessions/speech]', err.message);
      return res.status(500).json({ error: 'Failed to save speech result' });
    }
  }
);

// ─── POST /api/sessions/:id/cognitive ───────────────────────
router.post(
  '/:id/cognitive',
  [
    body('avg_reaction_ms').isFloat({ min: 0 }).withMessage('avg_reaction_ms must be a positive number'),
    body('errors').isInt({ min: 0 }).withMessage('errors must be a non-negative integer'),
    body('task_type').notEmpty().withMessage('task_type is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

    const session = await getSessionForUser(req.params.id, req.user.id);
    if (!session) return res.status(404).json({ error: 'Session not found' });
    if (session.status === 'completed') return res.status(409).json({ error: 'Session already completed' });

    const { avg_reaction_ms, errors: errCount, task_type } = req.body;

    try {
      await db.query('DELETE FROM cognitive_results WHERE session_id = $1', [req.params.id]);

      const { rows } = await db.query(
        `INSERT INTO cognitive_results (session_id, avg_reaction_ms, errors, task_type)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [req.params.id, avg_reaction_ms, errCount, task_type]
      );

      return res.status(201).json({ data: { saved: true, result: rows[0] } });
    } catch (err) {
      console.error('[sessions/cognitive]', err.message);
      return res.status(500).json({ error: 'Failed to save cognitive result' });
    }
  }
);

// ─── POST /api/sessions/:id/finalize ────────────────────────
router.post('/:id/finalize', async (req, res) => {
  const session = await getSessionForUser(req.params.id, req.user.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  if (session.status === 'completed') return res.status(409).json({ error: 'Session already completed' });

  try {
    // Fetch all three sub-results
    const [memRows, speechRows, cogRows] = await Promise.all([
      db.query('SELECT * FROM memory_results   WHERE session_id = $1', [req.params.id]),
      db.query('SELECT * FROM speech_results   WHERE session_id = $1', [req.params.id]),
      db.query('SELECT * FROM cognitive_results WHERE session_id = $1', [req.params.id]),
    ]);

    if (!memRows.rows[0] || !speechRows.rows[0] || !cogRows.rows[0]) {
      return res.status(422).json({
        error: 'Cannot finalize: all three sub-tests (memory, speech, cognitive) must be completed first',
      });
    }

    // Get baseline composite for comparison (null if this IS the baseline)
    const baselineComposite = session.is_baseline
      ? null
      : await getBaselineComposite(req.user.id);

    // Compute composite risk score
    const memResult    = memRows.rows[0];
    const speechResult = speechRows.rows[0];
    const cogResult    = cogRows.rows[0];

    const riskResult = computeRiskScore(
      { words_shown: memResult.words_shown, words_recalled: memResult.words_recalled },
      { transcript: speechResult.transcript, duration_seconds: parseFloat(speechResult.duration_seconds) },
      { avg_reaction_ms: parseFloat(cogResult.avg_reaction_ms), errors: cogResult.errors },
      baselineComposite
    );

    // Save risk score + mark session completed in a transaction
    const client = await db.getClient();
    try {
      await client.query('BEGIN');

      const { rows: riskRows } = await client.query(
        `INSERT INTO risk_scores
           (session_id, composite_score, risk_level, summary_text, flagged_for_referral, baseline_deviation_pct)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          req.params.id,
          riskResult.composite_score,
          riskResult.risk_level,
          riskResult.summary_text,
          riskResult.flagged_for_referral,
          riskResult.baseline_deviation_pct,
        ]
      );

      await client.query(
        `UPDATE test_sessions
         SET status = 'completed', completed_at = now()
         WHERE id = $1`,
        [req.params.id]
      );

      await client.query('COMMIT');

      // Log a server-side analytics event for high-risk finalisations
      if (riskResult.flagged_for_referral) {
        db.query(
          `INSERT INTO analytics_events (event_name, payload)
           VALUES ('high_risk_flagged', $1)`,
          [JSON.stringify({ session_id: req.params.id, user_id: req.user.id, composite_score: riskResult.composite_score })]
        ).catch(() => {}); // fire-and-forget
      }

      return res.status(200).json({ data: { risk_score: riskRows[0] } });
    } catch (txErr) {
      await client.query('ROLLBACK');
      throw txErr;
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('[sessions/finalize]', err.message);
    return res.status(500).json({ error: 'Failed to finalize session' });
  }
});

// ─── GET /api/sessions/:id/report ───────────────────────────
router.get('/:id/report', async (req, res) => {
  const session = await getSessionForUser(req.params.id, req.user.id);
  if (!session) return res.status(404).json({ error: 'Session not found' });

  try {
    const [memRows, speechRows, cogRows, riskRows] = await Promise.all([
      db.query('SELECT * FROM memory_results    WHERE session_id = $1', [req.params.id]),
      db.query('SELECT * FROM speech_results    WHERE session_id = $1', [req.params.id]),
      db.query('SELECT * FROM cognitive_results  WHERE session_id = $1', [req.params.id]),
      db.query('SELECT * FROM risk_scores        WHERE session_id = $1', [req.params.id]),
    ]);

    const riskScore = riskRows.rows[0] || null;

    return res.status(200).json({
      data: {
        session,
        scores: {
          memory:    memRows.rows[0]    || null,
          speech:    speechRows.rows[0] || null,
          cognitive: cogRows.rows[0]    || null,
        },
        summary:              riskScore?.summary_text          || null,
        composite_score:      riskScore?.composite_score       || null,
        risk_level:           riskScore?.risk_level            || null,
        flagged_for_referral: riskScore?.flagged_for_referral  || false,
        baseline_deviation_pct: riskScore?.baseline_deviation_pct || null,
      },
    });
  } catch (err) {
    console.error('[sessions/report]', err.message);
    return res.status(500).json({ error: 'Failed to fetch report' });
  }
});

module.exports = router;
