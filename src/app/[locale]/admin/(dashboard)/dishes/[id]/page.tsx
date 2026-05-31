import { CATEGORIES } from '@/lib/data/static'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import DishForm from '@/components/admin/DishForm'
import type { Dish, Category } from '@/types/menu.types'

export default async function EditDishPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params

  let categories: Category[] = CATEGORIES
  let dish: Dish | undefined

  try {
    const supabase = await createClient()
    const [dishRes, catRes] = await Promise.all([
      supabase.from('dishes').select('*').eq('id', id).single(),
      supabase.from('categories').select('*').order('sort_order'),
    ])
    if (dishRes.data) dish = dishRes.data as Dish
    if (catRes.data?.length) categories = catRes.data as Category[]
  } catch {}

  if (!dish) notFound()
  return <DishForm dish={dish} categories={categories} locale={locale} />
}
