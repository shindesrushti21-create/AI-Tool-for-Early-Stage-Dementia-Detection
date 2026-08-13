'use strict';

require('dotenv').config();

const app = require('./src/app');
const { pool } = require('./src/config/db');

const PORT = parseInt(process.env.PORT || '5000', 10);

// Verify DB connectivity before accepting traffic
pool.query('SELECT 1')
  .then(() => {
    console.log('✅  Database connection established');
    app.listen(PORT, () => {
      console.log(`🚀  CogniCare API running on http://localhost:${PORT}`);
      console.log(`📋  Health check: http://localhost:${PORT}/health`);
      console.log(`⏱️   Response-time SLA: ${process.env.RESPONSE_TIME_SLA_MS || 300}ms`);
    });
  })
  .catch((err) => {
    console.error('❌  Could not connect to PostgreSQL:', err.message);
    console.error('    Ensure DATABASE_URL is set correctly in your .env file');
    process.exit(1);
  });
