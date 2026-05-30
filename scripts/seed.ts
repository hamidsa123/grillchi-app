/**
 * Seed Supabase with all static data from src/lib/data/static.ts
 * Run: npx tsx scripts/seed.ts
 * Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import { BRANCHES, CATEGORIES, DISHES, PROMOS } from '../src/lib/data/static'

config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function seed() {
  console.log('🌱 Seeding Grillchi database...\n')

  console.log('📍 Inserting branches...')
  const { error: bErr } = await supabase.from('branches').upsert(BRANCHES, { onConflict: 'id' })
  if (bErr) { console.error('❌ Branches:', bErr.message); process.exit(1) }
  console.log(`   ✓ ${BRANCHES.length} branches`)

  console.log('📋 Inserting categories...')
  const { error: cErr } = await supabase.from('categories').upsert(CATEGORIES, { onConflict: 'id' })
  if (cErr) { console.error('❌ Categories:', cErr.message); process.exit(1) }
  console.log(`   ✓ ${CATEGORIES.length} categories`)

  console.log('🍽️  Inserting dishes...')
  const { error: dErr } = await supabase.from('dishes').upsert(DISHES, { onConflict: 'id' })
  if (dErr) { console.error('❌ Dishes:', dErr.message); process.exit(1) }
  console.log(`   ✓ ${DISHES.length} dishes`)

  console.log('📣 Inserting promos...')
  const { error: pErr } = await supabase.from('promos').upsert(PROMOS, { onConflict: 'id' })
  if (pErr) { console.error('❌ Promos:', pErr.message); process.exit(1) }
  console.log(`   ✓ ${PROMOS.length} promos`)

  console.log('\n✅ Seed complete!')
}

seed()
