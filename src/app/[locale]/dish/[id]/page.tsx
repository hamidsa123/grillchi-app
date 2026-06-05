import type { Locale } from '@/types/menu.types'
import { DISHES, BRANCHES } from '@/lib/data/static'
import type { Dish, Branch } from '@/types/menu.types'
import { query, queryOne } from '@/lib/db'
import { notFound } from 'next/navigation'
import DishClient from './DishClient'

export default async function DishPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id: rawId } = await params
  const id = decodeURIComponent(rawId)

  let dish: Dish | undefined = DISHES.find(d => d.id === id)
  let branches: Branch[]     = BRANCHES

  try {
    const [d, b] = await Promise.all([
      queryOne<Dish>('SELECT * FROM dishes WHERE id = $1', [id]),
      query<Branch>('SELECT * FROM branches ORDER BY sort_order'),
    ])
    if (d) dish = d
    if (b.length) branches = b
  } catch {}

  if (!dish) notFound()
  return <DishClient locale={locale as Locale} dish={dish!} branches={branches} />
}
