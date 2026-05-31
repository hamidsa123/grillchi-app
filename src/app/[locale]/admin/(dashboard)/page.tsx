'use client'
import { useState } from 'react'
import { DISHES, CATEGORIES, BRANCHES } from '@/lib/data/static'
import Link from 'next/link'

const stats = [
  { label: 'Total Dishes',   value: DISHES.length,                       href: '/admin/dishes',   icon: '🍽️' },
  { label: 'Categories',     value: CATEGORIES.length,                   href: '/admin/categories',icon: '📋' },
  { label: 'Branches',       value: BRANCHES.length,                     href: '/admin/branches', icon: '📍' },
  { label: 'Open Branches',  value: BRANCHES.filter(b => b.open).length, href: '/admin/branches', icon: '🟢' },
]

export default function AdminDashboard() {
  const [seeding, setSeeding] = useState(false)
  const [seedMsg, setSeedMsg] = useState('')

  const runSeed = async () => {
    setSeeding(true); setSeedMsg('')
    const res = await fetch('/api/seed', { method: 'POST' })
    const json = await res.json()
    if (res.ok) setSeedMsg(`✓ Seeded: ${json.seeded.dishes} dishes, ${json.seeded.categories} categories, ${json.seeded.branches} branches, ${json.seeded.promos} promos`)
    else setSeedMsg('✗ ' + json.error)
    setSeeding(false)
  }

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
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 40 }}>
        {[
          { label: '+ Add dish',       href: '/admin/dishes/new' },
          { label: '+ Add promo',      href: '/admin/promos' },
          { label: 'Manage branches',  href: '/admin/branches' },
        ].map(a => (
          <Link key={a.label} href={a.href as '/'} style={{ padding: '12px 20px', borderRadius: 999, background: 'var(--sage-soft)', border: '1px solid rgba(184,217,160,0.3)', color: 'var(--sage)', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
            {a.label}
          </Link>
        ))}
      </div>

      {/* Seed panel */}
      <div style={{ background: '#14291f', border: '1px solid var(--hairline)', borderRadius: 18, padding: 24 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: 'var(--cream-bright)', marginBottom: 8 }}>Database seed</h2>
        <p style={{ fontSize: 13, color: 'var(--cream-50)', marginBottom: 16 }}>
          Populate Supabase with all default dishes, categories, branches and promos from the static data file. Safe to run multiple times (upsert).
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <button onClick={runSeed} disabled={seeding} style={{ padding: '10px 22px', borderRadius: 999, border: 'none', cursor: seeding ? 'not-allowed' : 'pointer', background: 'var(--cream)', color: '#10231a', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14 }}>
            {seeding ? 'Seeding…' : '🌱 Seed database'}
          </button>
          {seedMsg && (
            <span style={{ fontSize: 13, color: seedMsg.startsWith('✓') ? 'var(--sage)' : '#d9967a' }}>
              {seedMsg}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
