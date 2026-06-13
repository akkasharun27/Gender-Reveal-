#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');

function loadDotEnv() {
  if (process.env.DATABASE_URL) return;
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return;
  const src = fs.readFileSync(envPath, 'utf8');
  src.split(/\n/).forEach((line) => {
    const m = line.match(/^\s*([^=\s]+)=(.*)$/);
    if (!m) return;
    let key = m[1];
    let val = m[2] || '';
    val = val.trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
    process.env[key] = process.env[key] || val;
  });
}

loadDotEnv();

let clientLib;
try {
  clientLib = require('@neondatabase/serverless');
} catch {
  clientLib = null;
}

async function run() {
  const conn = process.env.DATABASE_URL;
  if (!conn) {
    console.error('DATABASE_URL is not set. Add it to your environment or .env file.');
    process.exit(1);
  }

  const migrationsDir = path.join(process.cwd(), 'migrations');
  if (!fs.existsSync(migrationsDir)) {
    console.error('Migrations directory not found:', migrationsDir);
    process.exit(1);
  }

  const migrationFiles = fs.readdirSync(migrationsDir)
    .filter((file) => file.endsWith('.sql'))
    .sort();

  if (migrationFiles.length === 0) {
    console.error('No migration files found in:', migrationsDir);
    process.exit(1);
  }

  let client = null;
  // try neon exports variations
  try {
    if (clientLib) {
      if (typeof clientLib.createClient === 'function') {
        client = clientLib.createClient({ connectionString: conn });
      } else if (typeof clientLib.Client === 'function') {
        client = new clientLib.Client({ connectionString: conn });
      } else if (clientLib.default && typeof clientLib.default.createClient === 'function') {
        client = clientLib.default.createClient({ connectionString: conn });
      }
    }
  } catch {
    // fallthrough
  }

  // fallback to pg if available
  if (!client) {
    try {
      const { Client } = require('pg');
      client = new Client({ connectionString: conn });
    } catch {
      console.error('Could not create a DB client from @neondatabase/serverless or pg. Install one of them.');
      process.exit(1);
    }
  }

  try {
    if (typeof client.connect === 'function') await client.connect();
    for (const file of migrationFiles) {
      const sqlPath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(sqlPath, 'utf8');
      console.log('Applying migration:', file);
      await client.query(sql);
    }
    console.log('Migrations applied successfully');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  } finally {
    try { if (typeof client.end === 'function') await client.end(); } catch {}
  }
}

run();
