import type { Locale } from '@/types/menu.types'
import { DISHES, BRANCHES } from '@/lib/data/static'
import { notFound } from 'next/navigation'
import DishClient from './DishClient'

export function generateStaticParams() {
  return DISHES.map(d => ({ id: d.id }))
}

export default async function DishPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params
  const dish = DISHES.find(d => d.id === id)
  if (!dish) notFound()
  return <DishClient locale={locale as Locale} dish={dish} branches={BRANCHES} />
}
