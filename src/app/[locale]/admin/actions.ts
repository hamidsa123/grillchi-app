'use server'
import type { Branch, Promo, Dish, Category } from '@/types/menu.types'
import { query } from '@/lib/db'
import { revalidatePath } from 'next/cache'

function revalidateAll() {
  revalidatePath('/', 'layout')
}

export async function saveBranch(draft: Branch): Promise<{ error?: string }> {
  try {
    await query(
      `INSERT INTO branches
         (id,name_en,name_fa,name_ar,city_en,city_fa,city_ar,dist_en,dist_fa,dist_ar,open,hours,sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       ON CONFLICT (id) DO UPDATE SET
         name_en=EXCLUDED.name_en, name_fa=EXCLUDED.name_fa, name_ar=EXCLUDED.name_ar,
         city_en=EXCLUDED.city_en, city_fa=EXCLUDED.city_fa, city_ar=EXCLUDED.city_ar,
         dist_en=EXCLUDED.dist_en, dist_fa=EXCLUDED.dist_fa, dist_ar=EXCLUDED.dist_ar,
         open=EXCLUDED.open, hours=EXCLUDED.hours, sort_order=EXCLUDED.sort_order`,
      [draft.id, draft.name_en, draft.name_fa, draft.name_ar,
       draft.city_en, draft.city_fa, draft.city_ar,
       draft.dist_en, draft.dist_fa, draft.dist_ar,
       draft.open, draft.hours, draft.sort_order],
    )
  } catch (e) {
    return { error: String(e) }
  }
  revalidateAll()
  return {}
}

export async function toggleBranch(id: string, open: boolean): Promise<{ error?: string }> {
  try {
    await query('UPDATE branches SET open=$1 WHERE id=$2', [open, id])
  } catch (e) {
    return { error: String(e) }
  }
  revalidateAll()
  return {}
}

export async function savePromo(draft: Promo): Promise<{ error?: string }> {
  try {
    await query(
      `INSERT INTO promos
         (id,dish_id,sort_order,active,gradient_class,
          kicker_en,kicker_fa,kicker_ar,title_en,title_fa,title_ar,cta_en,cta_fa,cta_ar)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       ON CONFLICT (id) DO UPDATE SET
         dish_id=EXCLUDED.dish_id, sort_order=EXCLUDED.sort_order, active=EXCLUDED.active,
         gradient_class=EXCLUDED.gradient_class,
         kicker_en=EXCLUDED.kicker_en, kicker_fa=EXCLUDED.kicker_fa, kicker_ar=EXCLUDED.kicker_ar,
         title_en=EXCLUDED.title_en, title_fa=EXCLUDED.title_fa, title_ar=EXCLUDED.title_ar,
         cta_en=EXCLUDED.cta_en, cta_fa=EXCLUDED.cta_fa, cta_ar=EXCLUDED.cta_ar`,
      [draft.id, draft.dish_id, draft.sort_order, draft.active, draft.gradient_class,
       draft.kicker_en, draft.kicker_fa, draft.kicker_ar,
       draft.title_en, draft.title_fa, draft.title_ar,
       draft.cta_en, draft.cta_fa, draft.cta_ar],
    )
  } catch (e) {
    return { error: String(e) }
  }
  revalidateAll()
  return {}
}

export async function togglePromo(id: string, active: boolean): Promise<{ error?: string }> {
  try {
    await query('UPDATE promos SET active=$1 WHERE id=$2', [active, id])
  } catch (e) {
    return { error: String(e) }
  }
  revalidateAll()
  return {}
}

export async function saveDish(
  categories: Category[],
  payload: Dish,
): Promise<{ error?: string }> {
  const id = (payload.id ?? '').trim()
  if (!id) return { error: 'Slug ID is required' }
  if (!/^[a-z0-9-]+$/.test(id)) return { error: 'Slug ID must be lowercase letters, digits, or dashes' }
  if (!payload.category_id?.trim()) return { error: 'Category is required' }
  if (!payload.name_en?.trim() || !payload.name_fa?.trim() || !payload.name_ar?.trim()) {
    return { error: 'All three names (EN/FA/AR) are required' }
  }
  payload = { ...payload, id }
  try {
    for (const c of categories) {
      await query(
        `INSERT INTO categories (id,name_en,name_fa,name_ar,icon_paths,sort_order)
         VALUES ($1,$2,$3,$4,$5,$6)
         ON CONFLICT (id) DO UPDATE SET
           name_en=EXCLUDED.name_en, name_fa=EXCLUDED.name_fa, name_ar=EXCLUDED.name_ar,
           icon_paths=EXCLUDED.icon_paths, sort_order=EXCLUDED.sort_order`,
        [c.id, c.name_en, c.name_fa, c.name_ar, c.icon_paths, c.sort_order],
      )
    }
    const d = payload
    await query(
      `INSERT INTO dishes
         (id,category_id,name_en,name_fa,name_ar,desc_en,desc_fa,desc_ar,
          ing_en,ing_fa,ing_ar,price,kcal,mins,hot,tags,
          featured,trending,home_hero,available,image_url,sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22)
       ON CONFLICT (id) DO UPDATE SET
         category_id=EXCLUDED.category_id,
         name_en=EXCLUDED.name_en, name_fa=EXCLUDED.name_fa, name_ar=EXCLUDED.name_ar,
         desc_en=EXCLUDED.desc_en, desc_fa=EXCLUDED.desc_fa, desc_ar=EXCLUDED.desc_ar,
         ing_en=EXCLUDED.ing_en, ing_fa=EXCLUDED.ing_fa, ing_ar=EXCLUDED.ing_ar,
         price=EXCLUDED.price, kcal=EXCLUDED.kcal, mins=EXCLUDED.mins, hot=EXCLUDED.hot,
         tags=EXCLUDED.tags, featured=EXCLUDED.featured, trending=EXCLUDED.trending,
         home_hero=EXCLUDED.home_hero, available=EXCLUDED.available,
         image_url=EXCLUDED.image_url, sort_order=EXCLUDED.sort_order`,
      [d.id, d.category_id, d.name_en, d.name_fa, d.name_ar,
       d.desc_en ?? null, d.desc_fa ?? null, d.desc_ar ?? null,
       d.ing_en, d.ing_fa, d.ing_ar,
       d.price, d.kcal ?? null, d.mins ?? null, d.hot, d.tags,
       d.featured, d.trending, d.home_hero ?? false, d.available,
       d.image_url ?? null, d.sort_order ?? 0],
    )
  } catch (e) {
    return { error: String(e) }
  }
  revalidateAll()
  return {}
}

export async function deleteDish(id: string): Promise<{ error?: string }> {
  try {
    await query('DELETE FROM dishes WHERE id=$1', [id])
  } catch (e) {
    return { error: String(e) }
  }
  revalidateAll()
  return {}
}

export async function saveCategory(draft: Category): Promise<{ error?: string }> {
  const id = draft.id.trim()
  if (!id) return { error: 'ID is required' }
  if (!/^[a-z0-9-]+$/.test(id)) return { error: 'ID must be lowercase letters, digits, or dashes' }
  if (!draft.name_en.trim() || !draft.name_fa.trim() || !draft.name_ar.trim()) {
    return { error: 'All three names (EN/FA/AR) are required' }
  }
  try {
    await query(
      `INSERT INTO categories (id,name_en,name_fa,name_ar,icon_paths,sort_order)
       VALUES ($1,$2,$3,$4,$5,$6)
       ON CONFLICT (id) DO UPDATE SET
         name_en=EXCLUDED.name_en, name_fa=EXCLUDED.name_fa, name_ar=EXCLUDED.name_ar,
         icon_paths=EXCLUDED.icon_paths, sort_order=EXCLUDED.sort_order`,
      [id, draft.name_en, draft.name_fa, draft.name_ar, draft.icon_paths, draft.sort_order],
    )
  } catch (e) {
    return { error: String(e) }
  }
  revalidateAll()
  return {}
}

export async function deleteCategory(id: string): Promise<{ error?: string }> {
  try {
    const used = await query<{ count: string }>(
      'SELECT COUNT(*)::text AS count FROM dishes WHERE category_id=$1',
      [id],
    )
    if (Number(used[0]?.count ?? 0) > 0) {
      return { error: `Cannot delete: ${used[0].count} dish(es) still use this category` }
    }
    await query('DELETE FROM categories WHERE id=$1', [id])
  } catch (e) {
    return { error: String(e) }
  }
  revalidateAll()
  return {}
}
