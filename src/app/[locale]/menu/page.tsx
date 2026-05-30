import type { Locale } from '@/types/menu.types'
import { DISHES, CATEGORIES, BRANCHES } from '@/lib/data/static'
import MenuClient from './MenuClient'

export default async function MenuPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <MenuClient locale={locale as Locale} dishes={DISHES} categories={CATEGORIES} branches={BRANCHES} activeCat="all" />
}
