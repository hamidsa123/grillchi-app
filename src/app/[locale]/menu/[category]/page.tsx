export const dynamic = 'force-dynamic'

import type { Locale } from '@/types/menu.types'
import { DISHES, CATEGORIES, BRANCHES } from '@/lib/data/static'
import type { Dish, Category, Branch } from '@/types/menu.types'
import { query } from '@/lib/db'
import { notFound } from 'next/navigation'
import MenuClient from '../MenuClient'

export default async function CategoryPage({ params }: { params: Promise<{ locale: string; category: string }> }) {
  const { locale, category } = await params

  let dishes: Dish[]         = DISHES
  let categories: Category[] = CATEGORIES
  let branches: Branch[]     = BRANCHES

  try {
    const [d, c, b] = await Promise.all([
      query<Dish>('SELECT * FROM dishes WHERE available = true ORDER BY sort_order'),
      query<Category>('SELECT * FROM categories ORDER BY sort_order'),
      query<Branch>('SELECT * FROM branches ORDER BY sort_order'),
    ])
    if (d.length) dishes     = d
    if (c.length) categories = c
    if (b.length) branches   = b
  } catch {}

  const cat = categories.find(c => c.id === category)
  if (!cat) notFound()

  return <MenuClient locale={locale as Locale} dishes={dishes} categories={categories} branches={branches} activeCat={category} />
}
