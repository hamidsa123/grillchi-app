// scripts/migrate.mjs — applies sql/schema.sql to the DB in DATABASE_URL
// Run:  node --env-file=.env.local scripts/migrate.mjs
import { readFileSync } from 'node:fs'
import pg from 'pg'

const sql = readFileSync(new URL('../sql/schema.sql', import.meta.url), 'utf8')
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
})

try {
  await pool.query(sql)
  console.log('✓ schema applied')
} catch (e) {
  console.error('✗ failed:', e.message)
  process.exitCode = 1
} finally {
  await pool.end()
}
