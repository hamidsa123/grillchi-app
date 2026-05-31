export const dynamic = 'force-dynamic'

import type { Locale } from '@/types/menu.types'
import { DISHES, CATEGORIES, BRANCHES } from '@/lib/data/static'
import type { Dish, Category, Branch } from '@/types/menu.types'
import { createClient } from '@/lib/supabase/server'
import MenuClient from './MenuClient'

export default async function MenuPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  let dishes: Dish[]         = DISHES
  let categories: Category[] = CATEGORIES
  let branches: Branch[]     = BRANCHES

  try {
    const supabase = await createClient()
    const [d, c, b] = await Promise.all([
      supabase.from('dishes').select('*').eq('available', true).order('sort_order'),
      supabase.from('categories').select('*').order('sort_order'),
      supabase.from('branches').select('*').order('sort_order'),
    ])
    if (d.data?.length) dishes     = d.data as Dish[]
    if (c.data?.length) categories = c.data as Category[]
    if (b.data?.length) branches   = b.data as Branch[]
  } catch {}

  return <MenuClient locale={locale as Locale} dishes={dishes} categories={categories} branches={branches} activeCat="all" />
}
