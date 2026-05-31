'use server'
import { createClient } from '@supabase/supabase-js'
import type { Branch, Promo, Dish, Category } from '@/types/menu.types'
import { revalidatePath } from 'next/cache'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

function revalidateAll() {
  revalidatePath('/', 'layout')
}

export async function saveBranch(draft: Branch): Promise<{ error?: string }> {
  const supabase = adminClient()
  const { error } = await supabase.from('branches').upsert(draft, { onConflict: 'id' })
  if (error) return { error: error.message }
  revalidateAll()
  return {}
}

export async function toggleBranch(id: string, open: boolean): Promise<{ error?: string }> {
  const supabase = adminClient()
  const { error } = await supabase.from('branches').update({ open }).eq('id', id)
  if (error) return { error: error.message }
  revalidateAll()
  return {}
}

export async function savePromo(draft: Promo): Promise<{ error?: string }> {
  const supabase = adminClient()
  const { error } = await supabase.from('promos').upsert(draft, { onConflict: 'id' })
  if (error) return { error: error.message }
  revalidateAll()
  return {}
}

export async function togglePromo(id: string, active: boolean): Promise<{ error?: string }> {
  const supabase = adminClient()
  const { error } = await supabase.from('promos').update({ active }).eq('id', id)
  if (error) return { error: error.message }
  revalidateAll()
  return {}
}

export async function saveDish(categories: Category[], payload: Dish): Promise<{ error?: string }> {
  const supabase = adminClient()
  const { error: catErr } = await supabase.from('categories').upsert(
    categories.map(c => ({ id: c.id, name_en: c.name_en, name_fa: c.name_fa, name_ar: c.name_ar, icon_paths: c.icon_paths, sort_order: c.sort_order })),
    { onConflict: 'id' }
  )
  if (catErr) return { error: 'Categories: ' + catErr.message }
  const { error } = await supabase.from('dishes').upsert(
    { ...payload, home_hero: payload.home_hero ?? false },
    { onConflict: 'id' }
  )
  if (error) return { error: error.message }
  revalidateAll()
  return {}
}

export async function deleteDish(id: string): Promise<{ error?: string }> {
  const supabase = adminClient()
  const { error } = await supabase.from('dishes').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidateAll()
  return {}
}
