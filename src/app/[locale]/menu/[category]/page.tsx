import type { Locale } from '@/types/menu.types'
import { DISHES, CATEGORIES, BRANCHES } from '@/lib/data/static'
import { notFound } from 'next/navigation'
import MenuClient from '../MenuClient'

export function generateStaticParams() {
  return CATEGORIES.map(c => ({ category: c.id }))
}

export default async function CategoryPage({ params }: { params: Promise<{ locale: string; category: string }> }) {
  const { locale, category } = await params
  const cat = CATEGORIES.find(c => c.id === category)
  if (!cat) notFound()
  return <MenuClient locale={locale as Locale} dishes={DISHES} categories={CATEGORIES} branches={BRANCHES} activeCat={category} />
}
