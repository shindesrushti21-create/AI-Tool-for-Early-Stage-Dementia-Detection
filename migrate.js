'use strict';

/**
 * migrate.js — Run database migrations without needing psql on PATH.
 * Usage:
 *   node migrate.js          → runs 001_init.sql (schema)
 *   node migrate.js seed     → runs seed.sql (demo data)
 *   node migrate.js all      → runs schema then seed
 */

require('dotenv').config();
const fs   = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function runSqlFile(filePath) {
  const absPath = path.resolve(filePath);
  console.log(`\n📄  Reading: ${absPath}`);

  if (!fs.existsSync(absPath)) {
    console.error(`❌  File not found: ${absPath}`);
    process.exit(1);
  }

  const sql = fs.readFileSync(absPath, 'utf8');

  // Split on semicolons but preserve dollar-quoted strings (basic approach)
  // For our schema this simple split is safe.
  console.log(`🔧  Executing SQL script...\n`);

  const client = await pool.connect();
  try {
    await client.query(sql);
    console.log(`  ✅  Successfully executed ${path.basename(filePath)}`);
  } catch (err) {
    console.error(`  ❌  FAILED executing ${path.basename(filePath)}`);
    console.error(`      Error: ${err.message}`);
    throw err;
  } finally {
    client.release();
  }
}

async function main() {
  const arg = process.argv[2] || 'migrate';

  console.log('🚀  CogniCare — Database Migration Runner');
  console.log(`    DATABASE_URL: ${process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@')}\n`);

  try {
    await pool.query('SELECT 1'); // connectivity test
    console.log('✅  Connected to PostgreSQL\n');
  } catch (err) {
    console.error('❌  Cannot connect to database:', err.message);
    console.error('    Check DATABASE_URL in your .env file');
    process.exit(1);
  }

  try {
    if (arg === 'seed') {
      await runSqlFile('migrations/seed.sql');
      console.log('\n🌱  Seed data inserted successfully!');
    } else if (arg === 'all') {
      await runSqlFile('migrations/001_init.sql');
      console.log('\n✅  Schema migration complete!');
      await runSqlFile('migrations/seed.sql');
      console.log('\n🌱  Seed data inserted successfully!');
    } else {
      await runSqlFile('migrations/001_init.sql');
      console.log('\n✅  Schema migration complete!');
    }
  } catch (err) {
    console.error('\n❌  Migration failed:', err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
