export const dynamic = 'force-dynamic'
import { PROMOS } from '@/lib/data/static'
import type { Promo } from '@/types/menu.types'
import { query } from '@/lib/db'
import PromosClient from './PromosClient'

export default async function PromosPage() {
  let promos: Promo[] = PROMOS
  try {
    const rows = await query<Promo>('SELECT * FROM promos ORDER BY sort_order')
    if (rows.length) promos = rows
  } catch {}

  return <PromosClient initialPromos={promos} />
}
