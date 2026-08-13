'use strict';

require('dotenv').config();

const app = require('./src/app');
const { pool } = require('./src/config/db');

const PORT = parseInt(process.env.PORT || '5000', 10);

// Verify DB connectivity before accepting traffic
pool.query('SELECT 1')
  .then(() => {
    console.log('✅  Database connection established');
    startServer();
  })
  .catch((err) => {
    console.warn('⚠️   Could not connect to PostgreSQL database:', err.message);
    console.warn('💡  Running API server in standalone mode. Set DATABASE_URL in .env to connect PostgreSQL.');
    startServer();
  });

function startServer() {
  app.listen(PORT, () => {
    console.log(`🚀  CogniCare API running on http://localhost:${PORT}`);
    console.log(`📋  Health check: http://localhost:${PORT}/health`);
    console.log(`⏱️   Response-time SLA: ${process.env.RESPONSE_TIME_SLA_MS || 300}ms`);
  });
}
