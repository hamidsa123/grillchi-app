// scripts/seed.mts — seeds the DB directly from src/lib/data/static (no Next server needed)
// Run:  npx tsx scripts/seed.mts
import { config } from 'dotenv'
config({ path: '.env.local' })

import pg from 'pg'
import { BRANCHES, CATEGORIES, DISHES, PROMOS } from '../src/lib/data/static'

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
})

async function upsert(table: string, rows: Record<string, unknown>[]) {
  for (const row of rows) {
    const keys = Object.keys(row)
    const values = keys.map((k) => row[k])
    const params = keys.map((_, i) => `$${i + 1}`)
    const updates = keys.filter((k) => k !== 'id').map((k) => `${k} = EXCLUDED.${k}`)
    await pool.query(
      `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${params.join(', ')})
       ON CONFLICT (id) DO UPDATE SET ${updates.join(', ')}`,
      values,
    )
  }
}

async function main() {
  try {
    await upsert('categories', CATEGORIES as unknown as Record<string, unknown>[])
    await upsert('branches', BRANCHES as unknown as Record<string, unknown>[])
    await upsert('dishes', DISHES as unknown as Record<string, unknown>[])
    await upsert('promos', PROMOS as unknown as Record<string, unknown>[])
    console.log(
      `✓ seeded — categories:${CATEGORIES.length} branches:${BRANCHES.length} dishes:${DISHES.length} promos:${PROMOS.length}`,
    )
  } catch (e) {
    console.error('✗ seed failed:', (e as Error).message)
    process.exitCode = 1
  } finally {
    await pool.end()
  }
}

main()
