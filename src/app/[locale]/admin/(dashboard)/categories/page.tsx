import { CATEGORIES } from '@/lib/data/static'

export default async function CategoriesPage() {
  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--cream-bright)', marginBottom: 28 }}>Categories</h1>
      <div style={{ background: '#14291f', border: '1px solid var(--hairline)', borderRadius: 18, overflow: 'hidden' }}>
        {CATEGORIES.map((c, i) => (
          <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderBottom: i < CATEGORIES.length - 1 ? '1px solid var(--hairline)' : 'none' }}>
            <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: c.icon_paths }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--cream-bright)' }}>{c.name_en}</div>
              <div style={{ fontSize: 12, color: 'var(--cream-50)', marginTop: 2 }}>{c.name_fa} &nbsp;|&nbsp; {c.name_ar}</div>
            </div>
            <span style={{ fontSize: 12, color: 'var(--cream-30)' }}>#{c.sort_order}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
