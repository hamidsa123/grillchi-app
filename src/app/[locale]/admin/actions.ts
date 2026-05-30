'use server'
import { createClient } from '@/lib/supabase/server'
import type { Branch, Promo, Dish, Category } from '@/types/menu.types'
import { revalidatePath } from 'next/cache'

export async function saveBranch(draft: Branch): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from('branches').upsert(draft, { onConflict: 'id' })
  if (error) return { error: error.message }
  revalidatePath('/[locale]/admin/(dashboard)/branches')
  return {}
}

export async function toggleBranch(id: string, open: boolean): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from('branches').update({ open }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/[locale]/admin/(dashboard)/branches')
  return {}
}

export async function savePromo(draft: Promo): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from('promos').upsert(draft, { onConflict: 'id' })
  if (error) return { error: error.message }
  revalidatePath('/[locale]/admin/(dashboard)/promos')
  return {}
}

export async function togglePromo(id: string, active: boolean): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from('promos').update({ active }).eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/[locale]/admin/(dashboard)/promos')
  return {}
}

export async function saveDish(categories: Category[], payload: Dish): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { error: catErr } = await supabase.from('categories').upsert(
    categories.map(c => ({ id: c.id, name_en: c.name_en, name_fa: c.name_fa, name_ar: c.name_ar, icon_paths: c.icon_paths, sort_order: c.sort_order })),
    { onConflict: 'id' }
  )
  if (catErr) return { error: 'Categories: ' + catErr.message }
  const { error } = await supabase.from('dishes').upsert(payload, { onConflict: 'id' })
  if (error) return { error: error.message }
  revalidatePath('/[locale]/admin/(dashboard)/dishes')
  return {}
}

export async function deleteDish(id: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from('dishes').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/[locale]/admin/(dashboard)/dishes')
  return {}
}
