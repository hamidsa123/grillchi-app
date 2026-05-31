import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { BRANCHES, CATEGORIES, DISHES, PROMOS } from '@/lib/data/static'

export async function POST() {
  const url        = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceKey) {
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY not set in Vercel env vars' }, { status: 500 })
  }

  const supabase = createClient(url, serviceKey)

  const { error: catErr } = await supabase.from('categories').upsert(CATEGORIES, { onConflict: 'id' })
  if (catErr) return NextResponse.json({ error: 'categories: ' + catErr.message }, { status: 500 })

  const { error: brErr } = await supabase.from('branches').upsert(BRANCHES, { onConflict: 'id' })
  if (brErr) return NextResponse.json({ error: 'branches: ' + brErr.message }, { status: 500 })

  const dishes = DISHES.map(d => ({ ...d, home_hero: d.home_hero ?? false }))
  const { error: dishErr } = await supabase.from('dishes').upsert(dishes, { onConflict: 'id' })
  if (dishErr) return NextResponse.json({ error: 'dishes: ' + dishErr.message }, { status: 500 })

  const { error: promoErr } = await supabase.from('promos').upsert(PROMOS, { onConflict: 'id' })
  if (promoErr) return NextResponse.json({ error: 'promos: ' + promoErr.message }, { status: 500 })

  return NextResponse.json({
    ok: true,
    seeded: { categories: CATEGORIES.length, branches: BRANCHES.length, dishes: DISHES.length, promos: PROMOS.length },
  })
}
