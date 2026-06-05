export const dynamic = 'force-dynamic'
import { BRANCHES } from '@/lib/data/static'
import type { Branch } from '@/types/menu.types'
import { query } from '@/lib/db'
import BranchesClient from './BranchesClient'

export default async function BranchesPage() {
  let branches: Branch[] = BRANCHES
  try {
    const rows = await query<Branch>('SELECT * FROM branches ORDER BY sort_order')
    if (rows.length) branches = rows
  } catch {}

  return <BranchesClient initialBranches={branches} />
}
