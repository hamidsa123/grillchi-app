import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return NextResponse.json({ counts: { dishes: 0, categories: 0, branches: 0, openBranches: 0 } })

  const supabase = createClient(url, key)
  const [d, c, b, ob] = await Promise.all([
    supabase.from('dishes').select('id', { count: 'exact', head: true }),
    supabase.from('categories').select('id', { count: 'exact', head: true }),
    supabase.from('branches').select('id', { count: 'exact', head: true }),
    supabase.from('branches').select('id', { count: 'exact', head: true }).eq('open', true),
  ])

  return NextResponse.json({
    counts: {
      dishes:       d.count ?? 0,
      categories:   c.count ?? 0,
      branches:     b.count ?? 0,
      openBranches: ob.count ?? 0,
    }
  })
}
