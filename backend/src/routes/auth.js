'use strict';

const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const db             = require('../config/db');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// ─── Helpers ─────────────────────────────────────────────────

const signToken = (user) =>
  jwt.sign(
    {
      id:                 user.id,
      email:              user.email,
      name:               user.name,
      preferred_language: user.preferred_language,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

const safeUser = (u) => ({
  id:                 u.id,
  name:               u.name,
  email:              u.email,
  age:                u.age,
  preferred_language: u.preferred_language,
  created_at:         u.created_at,
});

// ─── POST /api/auth/register ─────────────────────────────────
router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('age').optional().isInt({ min: 1, max: 130 }).withMessage('Age must be a positive integer'),
    body('preferred_language').optional().isLength({ min: 2, max: 10 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { name, email, password, age, preferred_language = 'en' } = req.body;

    try {
      // Check for existing user
      const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
      if (existing.rows.length > 0) {
        return res.status(409).json({ error: 'An account with this email already exists' });
      }

      const password_hash = await bcrypt.hash(password, 12);

      const { rows } = await db.query(
        `INSERT INTO users (name, email, password_hash, age, preferred_language)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, name, email, age, preferred_language, created_at`,
        [name, email, password_hash, age || null, preferred_language]
      );

      const user  = rows[0];
      const token = signToken(user);

      return res.status(201).json({ data: { token, user: safeUser(user) } });
    } catch (err) {
      console.error('[auth/register]', err.message);
      return res.status(500).json({ error: 'Registration failed, please try again' });
    }
  }
);

// ─── POST /api/auth/login ────────────────────────────────────
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array()[0].msg });
    }

    const { email, password } = req.body;

    try {
      const { rows } = await db.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (rows.length === 0) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const user = rows[0];
      const match = await bcrypt.compare(password, user.password_hash);

      if (!match) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const token = signToken(user);
      return res.status(200).json({ data: { token, user: safeUser(user) } });
    } catch (err) {
      console.error('[auth/login]', err.message);
      return res.status(500).json({ error: 'Login failed, please try again' });
    }
  }
);

// ─── GET /api/auth/me ────────────────────────────────────────
router.get('/me', authenticate, async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT id, name, email, age, preferred_language, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ data: { user: safeUser(rows[0]) } });
  } catch (err) {
    console.error('[auth/me]', err.message);
    return res.status(500).json({ error: 'Failed to fetch user' });
  }
});

module.exports = router;
