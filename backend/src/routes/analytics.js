'use strict';

const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../config/db');

const router = express.Router();

// ─── POST /api/analytics/event ──────────────────────────────
// Logs a custom event server-side (e.g. "test_completed", "high_risk_flagged").
// No auth required — accepts events from both authed and guest contexts.
router.post(
  '/event',
  [
    body('event_name').trim().notEmpty().withMessage('event_name is required'),
    body('payload').optional().isObject().withMessage('payload must be an object'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array()[0].msg });

    const { event_name, payload = {} } = req.body;

    try {
      await db.query(
        `INSERT INTO analytics_events (event_name, payload)
         VALUES ($1, $2)`,
        [event_name, JSON.stringify(payload)]
      );

      return res.status(201).json({ data: { logged: true } });
    } catch (err) {
      console.error('[analytics/event]', err.message);
      return res.status(500).json({ error: 'Failed to log event' });
    }
  }
);

module.exports = router;
