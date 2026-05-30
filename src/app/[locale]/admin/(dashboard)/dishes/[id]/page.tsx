import { DISHES, CATEGORIES } from '@/lib/data/static'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import DishForm from '@/components/admin/DishForm'
import type { Dish } from '@/types/menu.types'

export default async function EditDishPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params

  let dish: Dish | undefined = DISHES.find(d => d.id === id)
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('dishes').select('*').eq('id', id).single()
    if (data) dish = data as Dish
  } catch {}

  if (!dish) notFound()
  return <DishForm dish={dish} categories={CATEGORIES} locale={locale} />
}
