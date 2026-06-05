export const dynamic = 'force-dynamic'
import { CATEGORIES } from '@/lib/data/static'
import { query } from '@/lib/db'
import type { Category } from '@/types/menu.types'
import DishForm from '@/components/admin/DishForm'

export default async function NewDishPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  let categories: Category[] = CATEGORIES
  try {
    const rows = await query<Category>('SELECT * FROM categories ORDER BY sort_order')
    if (rows.length) categories = rows
  } catch {}

  return <DishForm categories={categories} locale={locale} />
}
