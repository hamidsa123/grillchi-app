import { NextResponse } from 'next/server'
import { queryOne } from '@/lib/db'

export async function GET() {
  try {
    const row = await queryOne<{
      dishes: number
      categories: number
      branches: number
      open_branches: number
    }>(
      `SELECT
         (SELECT COUNT(*)::int FROM dishes)            AS dishes,
         (SELECT COUNT(*)::int FROM categories)        AS categories,
         (SELECT COUNT(*)::int FROM branches)          AS branches,
         (SELECT COUNT(*)::int FROM branches WHERE open = true) AS open_branches`,
    )
    return NextResponse.json({
      counts: {
        dishes:       row?.dishes       ?? 0,
        categories:   row?.categories   ?? 0,
        branches:     row?.branches     ?? 0,
        openBranches: row?.open_branches ?? 0,
      },
    })
  } catch {
    return NextResponse.json({ counts: { dishes: 0, categories: 0, branches: 0, openBranches: 0 } })
  }
}
