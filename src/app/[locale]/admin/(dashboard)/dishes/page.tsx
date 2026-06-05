export const dynamic = 'force-dynamic'
import { query } from '@/lib/db'
import { DISHES } from '@/lib/data/static'
import Link from 'next/link'
import type { Dish } from '@/types/menu.types'

export default async function DishesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  let dishes: Dish[] = DISHES
  try {
    const rows = await query<Dish>('SELECT * FROM dishes ORDER BY sort_order')
    if (rows.length) dishes = rows
  } catch {}

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--cream-bright)' }}>Dishes</h1>
        <Link href={`/${locale}/admin/dishes/new` as '/'} style={{ padding: '10px 20px', borderRadius: 999, background: 'var(--cream)', color: '#10231a', textDecoration: 'none', fontSize: 14, fontWeight: 700 }}>
          + Add dish
        </Link>
      </div>

      <div style={{ background: '#14291f', border: '1px solid var(--hairline)', borderRadius: 18, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--hairline)' }}>
              {['Name', 'Category', 'Price (×1000 T)', 'Tags', 'Hero', 'Featured', 'Trending', 'Available', 'Actions'].map(h => (
                <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: 'var(--cream-50)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dishes.map(d => (
              <tr key={d.id} style={{ borderBottom: '1px solid var(--hairline)' }}>
                <td style={{ padding: '14px 16px', fontSize: 14, color: 'var(--cream-bright)', fontWeight: 500 }}>{d.name_en}</td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--cream-50)' }}>{d.category_id}</td>
                <td style={{ padding: '14px 16px', fontSize: 13, color: 'var(--sage)', fontWeight: 600 }}>{d.price}</td>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    {d.tags.map(tag => <span key={tag} style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: 'var(--sage-soft)', color: 'var(--sage)' }}>{tag}</span>)}
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: d.home_hero ? 'var(--sage)' : 'var(--cream-30)' }}>{d.home_hero ? '✓' : '—'}</span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: d.featured ? 'var(--sage)' : 'var(--cream-30)' }}>{d.featured ? '✓' : '—'}</span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: d.trending ? 'var(--sage)' : 'var(--cream-30)' }}>{d.trending ? '✓' : '—'}</span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: d.available ? 'var(--sage)' : '#d9967a' }}>{d.available ? 'Yes' : 'No'}</span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <Link href={`/${locale}/admin/dishes/${d.id}` as '/'} style={{ fontSize: 13, color: 'var(--sage)', textDecoration: 'none', fontWeight: 600 }}>Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
