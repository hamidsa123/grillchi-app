export const dynamic = 'force-dynamic'

import type { Locale } from '@/types/menu.types'
import { DISHES, CATEGORIES, BRANCHES, PROMOS } from '@/lib/data/static'
import type { Dish, Category, Branch, Promo } from '@/types/menu.types'
import { query } from '@/lib/db'
import HomeClient from './HomeClient'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  let dishes: Dish[]         = DISHES
  let categories: Category[] = CATEGORIES
  let branches: Branch[]     = BRANCHES
  let promos: Promo[]        = PROMOS

  try {
    const [d, c, b, p] = await Promise.all([
      query<Dish>('SELECT * FROM dishes WHERE available = true ORDER BY sort_order'),
      query<Category>('SELECT * FROM categories ORDER BY sort_order'),
      query<Branch>('SELECT * FROM branches ORDER BY sort_order'),
      query<Promo>('SELECT * FROM promos WHERE active = true ORDER BY sort_order'),
    ])
    if (d.length) dishes     = d
    if (c.length) categories = c
    if (b.length) branches   = b
    if (p.length) promos     = p
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
