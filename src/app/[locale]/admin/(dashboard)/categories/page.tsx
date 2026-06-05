export const dynamic = 'force-dynamic'
import { CATEGORIES } from '@/lib/data/static'
import type { Category } from '@/types/menu.types'
import { query } from '@/lib/db'
import CategoriesClient from './CategoriesClient'

export default async function CategoriesPage() {
  let categories: Category[] = CATEGORIES
  try {
    const rows = await query<Category>('SELECT * FROM categories ORDER BY sort_order')
    if (rows.length) categories = rows
  } catch {}

  return <CategoriesClient initialCategories={categories} />
}
