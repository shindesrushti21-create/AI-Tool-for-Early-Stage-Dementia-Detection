'use strict';

require('dotenv').config();

const express = require('express');
const helmet  = require('helmet');
const cors    = require('cors');
const path    = require('path');

const { responseTimeMiddleware } = require('./middleware/responseTime');

// ─── Routes ──────────────────────────────────────────────────
const authRoutes      = require('./routes/auth');
const sessionRoutes   = require('./routes/sessions');
const contentRoutes   = require('./routes/content');
const analyticsRoutes = require('./routes/analytics');
const schemaRoutes    = require('./routes/schema');

const app = express();

// ─── Security & Parsing ──────────────────────────────────────
app.use(helmet());

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, Postman, mobile apps)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy: origin ${origin} not allowed`));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Response-time SLA Logging ───────────────────────────────
app.use(responseTimeMiddleware);

// ─── Static files (robots.txt, etc.) ─────────────────────────
app.use(express.static(path.join(__dirname, '..', 'public')));

// ─── Health Check ────────────────────────────────────────────
app.get('/health', (_req, res) =>
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
);

// ─── API Routes ──────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/sessions',  sessionRoutes);
app.use('/api/content',   contentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/schema',    schemaRoutes);

// ─── 404 Catch-all ───────────────────────────────────────────
// Must be LAST — catches any route not matched above
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// ─── Global Error Handler ────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[unhandled error]', err.message);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;
