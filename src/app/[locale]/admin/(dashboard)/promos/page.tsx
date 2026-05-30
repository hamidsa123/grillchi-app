import { PROMOS } from '@/lib/data/static'
import type { Promo } from '@/types/menu.types'
import { createClient } from '@/lib/supabase/server'
import PromosClient from './PromosClient'

export default async function PromosPage() {
  let promos: Promo[] = PROMOS
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('promos').select('*').order('sort_order')
    if (data?.length) promos = data as Promo[]
  } catch {}

  return <PromosClient initialPromos={promos} />
}
