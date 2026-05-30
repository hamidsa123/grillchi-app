import type { Locale } from '@/types/menu.types'
import { DISHES, CATEGORIES, BRANCHES, PROMOS } from '@/lib/data/static'
import HomeClient from './HomeClient'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const featured = DISHES.filter(d => d.featured)
  const trending = DISHES.filter(d => d.trending).slice(0, 5)
  const dishesById = Object.fromEntries(DISHES.map(d => [d.id, d]))

  return (
    <HomeClient
      locale={locale as Locale}
      featured={featured}
      trending={trending}
      categories={CATEGORIES}
      branches={BRANCHES}
      promos={PROMOS}
      dishesById={dishesById}
    />
  )
}
