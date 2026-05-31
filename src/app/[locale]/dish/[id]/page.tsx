import type { Locale } from '@/types/menu.types'
import { DISHES, BRANCHES } from '@/lib/data/static'
import type { Dish, Branch } from '@/types/menu.types'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import DishClient from './DishClient'

export default async function DishPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id: rawId } = await params
  const id = decodeURIComponent(rawId)

  let dish: Dish | undefined    = DISHES.find(d => d.id === id)
  let branches: Branch[]        = BRANCHES

  try {
    const supabase = await createClient()
    const [d, b] = await Promise.all([
      supabase.from('dishes').select('*').eq('id', id).single(),
      supabase.from('branches').select('*').order('sort_order'),
    ])
    if (d.data) dish       = d.data as Dish
    if (b.data?.length) branches = b.data as Branch[]
  } catch {}

  if (!dish) notFound()
  return <DishClient locale={locale as Locale} dish={dish!} branches={branches} />
}
