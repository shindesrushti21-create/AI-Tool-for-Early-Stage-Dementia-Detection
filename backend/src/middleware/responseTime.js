'use strict';

const responseTime = require('response-time');

const SLA_MS = parseInt(process.env.RESPONSE_TIME_SLA_MS || '300', 10);

/**
 * Response-time logging middleware.
 * Logs every request with its method, path, status code, and duration.
 * Emits a ⚠️  warning when the SLA threshold is exceeded.
 */
const responseTimeMiddleware = responseTime((req, res, time) => {
  const ms = Math.round(time * 10) / 10; // 1 decimal place
  const status = res.statusCode;
  const method = req.method.padEnd(6);
  const path = req.originalUrl;

  if (ms > SLA_MS) {
    console.warn(`⚠️  SLA BREACH  ${method} ${path} → ${status} — ${ms}ms (limit: ${SLA_MS}ms)`);
  } else {
    console.log(`✅  ${method} ${path} → ${status} — ${ms}ms`);
  }
});

module.exports = { responseTimeMiddleware };
