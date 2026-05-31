export const dynamic = 'force-dynamic'

import type { Locale } from '@/types/menu.types'
import { DISHES, CATEGORIES, BRANCHES, PROMOS } from '@/lib/data/static'
import type { Dish, Category, Branch, Promo } from '@/types/menu.types'
import { createClient } from '@/lib/supabase/server'
import HomeClient from './HomeClient'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  let dishes: Dish[]         = DISHES
  let categories: Category[] = CATEGORIES
  let branches: Branch[]     = BRANCHES
  let promos: Promo[]        = PROMOS

  try {
    const supabase = await createClient()
    const [d, c, b, p] = await Promise.all([
      supabase.from('dishes').select('*').eq('available', true).order('sort_order'),
      supabase.from('categories').select('*').order('sort_order'),
      supabase.from('branches').select('*').order('sort_order'),
      supabase.from('promos').select('*').eq('active', true).order('sort_order'),
    ])
    if (d.data?.length) dishes     = d.data as Dish[]
    if (c.data?.length) categories = c.data as Category[]
    if (b.data?.length) branches   = b.data as Branch[]
    if (p.data?.length) promos     = p.data as Promo[]
  } catch {}

  const hero     = dishes.filter(d => d.home_hero).slice(0, 3)
  const trending = dishes.filter(d => d.trending).slice(0, 5)
  const dishesById = Object.fromEntries(dishes.map(d => [d.id, d]))

  return (
    <HomeClient
      locale={locale as Locale}
      hero={hero}
      trending={trending}
      categories={categories}
      branches={branches}
      promos={promos}
      dishesById={dishesById}
    />
  )
}
