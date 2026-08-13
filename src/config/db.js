'use strict';

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Reasonable connection pool sizing for a small NGO app
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

// Crash loudly if DB is unreachable at startup
pool.on('error', (err) => {
  console.error('[DB] Unexpected pool error:', err.message);
});

/**
 * Execute a parameterised query.
 * Usage: const { rows } = await db.query('SELECT ...', [param1, param2]);
 */
const query = (text, params) => pool.query(text, params);

/**
 * Grab a dedicated client for multi-statement transactions.
 * Caller is responsible for client.release().
 */
const getClient = () => pool.connect();

module.exports = { query, getClient, pool };
