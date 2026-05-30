import { DISHES, CATEGORIES, BRANCHES } from '@/lib/data/static'
import Link from 'next/link'

export default async function AdminDashboard({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const stats = [
    { label: 'Total Dishes', value: DISHES.length, href: `/${locale}/admin/dishes`, icon: '🍽️' },
    { label: 'Categories', value: CATEGORIES.length, href: `/${locale}/admin/categories`, icon: '📋' },
    { label: 'Branches', value: BRANCHES.length, href: `/${locale}/admin/branches`, icon: '📍' },
    { label: 'Open Branches', value: BRANCHES.filter(b => b.open).length, href: `/${locale}/admin/branches`, icon: '🟢' },
  ]

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: 'var(--cream-bright)', marginBottom: 8 }}>Dashboard</h1>
      <p style={{ color: 'var(--cream-50)', marginBottom: 32 }}>Welcome back. Here&apos;s what&apos;s happening at Grillchi.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 40 }}>
        {stats.map(s => (
          <Link key={s.label} href={s.href as '/'} style={{ textDecoration: 'none', display: 'block', background: '#14291f', border: '1px solid var(--hairline)', borderRadius: 18, padding: 20 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 700, color: 'var(--sage)' }}>{s.value}</div>
            <div style={{ fontSize: 13, color: 'var(--cream-50)', marginTop: 4 }}>{s.label}</div>
          </Link>
        ))}
      </div>

      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, color: 'var(--cream-bright)', marginBottom: 16 }}>Quick actions</h2>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {[
          { label: '+ Add dish', href: `/${locale}/admin/dishes/new` },
          { label: '+ Add promo', href: `/${locale}/admin/promos` },
          { label: 'Manage branches', href: `/${locale}/admin/branches` },
        ].map(a => (
          <Link key={a.label} href={a.href as '/'} style={{ padding: '12px 20px', borderRadius: 999, background: 'var(--sage-soft)', border: '1px solid rgba(184,217,160,0.3)', color: 'var(--sage)', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
            {a.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
