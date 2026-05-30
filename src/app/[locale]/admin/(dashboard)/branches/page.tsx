import { BRANCHES } from '@/lib/data/static'
import type { Branch } from '@/types/menu.types'
import { createClient } from '@/lib/supabase/server'
import BranchesClient from './BranchesClient'

export default async function BranchesPage() {
  let branches: Branch[] = BRANCHES
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('branches').select('*').order('sort_order')
    if (data?.length) branches = data as Branch[]
  } catch {}

  return <BranchesClient initialBranches={branches} />
}
