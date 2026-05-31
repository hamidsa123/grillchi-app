import { CATEGORIES } from '@/lib/data/static'
import { createClient } from '@/lib/supabase/server'
import type { Category } from '@/types/menu.types'
import DishForm from '@/components/admin/DishForm'

export default async function NewDishPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  let categories: Category[] = CATEGORIES
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('categories').select('*').order('sort_order')
    if (data?.length) categories = data as Category[]
  } catch {}

  return <DishForm categories={categories} locale={locale} />
}
