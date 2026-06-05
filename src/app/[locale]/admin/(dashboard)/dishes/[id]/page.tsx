export const dynamic = 'force-dynamic'
import { CATEGORIES } from '@/lib/data/static'
import { query, queryOne } from '@/lib/db'
import { notFound } from 'next/navigation'
import DishForm from '@/components/admin/DishForm'
import type { Dish, Category } from '@/types/menu.types'

export default async function EditDishPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params

  let categories: Category[] = CATEGORIES
  let dish: Dish | undefined

  try {
    const [dishRow, catRows] = await Promise.all([
      queryOne<Dish>('SELECT * FROM dishes WHERE id = $1', [id]),
      query<Category>('SELECT * FROM categories ORDER BY sort_order'),
    ])
    if (dishRow) dish = dishRow
    if (catRows.length) categories = catRows
  } catch {}

  if (!dish) notFound()
  return <DishForm dish={dish} categories={categories} locale={locale} />
}
