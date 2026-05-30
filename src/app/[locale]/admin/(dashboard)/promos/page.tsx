'use client'
import { useState, useEffect } from 'react'
import { PROMOS, DISHES } from '@/lib/data/static'
import type { Promo } from '@/types/menu.types'
import { createClient } from '@/lib/supabase/client'

const dishesById = Object.fromEntries(DISHES.map(d => [d.id, d]))
const dishOptions = DISHES.map(d => ({ id: d.id, label: d.name_en }))

// Defined at module level to keep identity stable across re-renders
function PromoField({ label, value, dir, onChange }: {
  label: string; value: string; dir?: 'rtl' | 'ltr'; onChange: (v: string) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={labelStyle}>{label}</label>
      <input value={value} dir={dir} style={inputStyle} onChange={e => onChange(e.target.value)} />
    </div>
  )
}

export default function PromosPage() {
  const [promos, setPromos] = useState<Promo[]>(PROMOS)
  const [editing, setEditing] = useState<string | null>(null)
  const [draft, setDraft]     = useState<Promo | null>(null)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    const supabase = createClient()
    supabase.from('promos').select('*').order('sort_order')
      .then(({ data }) => { if (data?.length) setPromos(data as Promo[]) })
      .catch(() => {})
  }, [])

  const startEdit = (p: Promo) => { setEditing(p.id); setDraft({ ...p }); setError('') }
  const cancelEdit = () => { setEditing(null); setDraft(null) }
  const setField = (k: keyof Promo, v: unknown) => setDraft(d => d ? { ...d, [k]: v } : d)

  const saveEdit = async () => {
    if (!draft) return
    setSaving(true); setError('')
    try {
      const supabase = createClient()
      const { error: err } = await supabase.from('promos').upsert(draft, { onConflict: 'id' })
      if (err) { setError(err.message); setSaving(false); return }
      setPromos(ps => ps.map(p => p.id === draft.id ? draft : p))
      setEditing(null); setDraft(null); setSaving(false)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error')
      setSaving(false)
    }
  }

  const toggleActive = async (p: Promo) => {
    try {
      const supabase = createClient()
      const updated = { ...p, active: !p.active }
      await supabase.from('promos').upsert(updated, { onConflict: 'id' })
      setPromos(ps => ps.map(pr => pr.id === p.id ? updated : pr))
    } catch {}
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--cream-bright)', marginBottom: 28 }}>
        Promotions
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {promos.map(p => {
          const isEditing = editing === p.id
          const dish = p.dish_id ? dishesById[p.dish_id] : null

          return (
            <div key={p.id} style={{ background: '#14291f', border: `1px solid ${isEditing ? 'var(--sage)' : 'var(--hairline)'}`, borderRadius: 18, padding: 24, transition: 'border-color .2s' }}>

              {isEditing && draft ? (
                /* ── Edit mode ── */
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                    <PromoField label="Kicker (EN)" value={draft.kicker_en} onChange={v => setField('kicker_en', v)} />
                    <PromoField label="کیکر (FA)" value={draft.kicker_fa} dir="rtl" onChange={v => setField('kicker_fa', v)} />
                    <PromoField label="الكيكر (AR)" value={draft.kicker_ar} dir="rtl" onChange={v => setField('kicker_ar', v)} />
                    <PromoField label="Title (EN)" value={draft.title_en} onChange={v => setField('title_en', v)} />
                    <PromoField label="عنوان (FA)" value={draft.title_fa} dir="rtl" onChange={v => setField('title_fa', v)} />
                    <PromoField label="العنوان (AR)" value={draft.title_ar} dir="rtl" onChange={v => setField('title_ar', v)} />
                    <PromoField label="CTA (EN)" value={draft.cta_en} onChange={v => setField('cta_en', v)} />
                    <PromoField label="دکمه (FA)" value={draft.cta_fa} dir="rtl" onChange={v => setField('cta_fa', v)} />
                    <PromoField label="الزر (AR)" value={draft.cta_ar} dir="rtl" onChange={v => setField('cta_ar', v)} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <label style={labelStyle}>Linked dish</label>
                      <select value={draft.dish_id ?? ''} style={inputStyle}
                        onChange={e => setField('dish_id', e.target.value || null)}>
                        <option value="">— no dish —</option>
                        {dishOptions.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                      </select>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: 22 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, color: 'var(--cream-70)' }}>
                        <input type="checkbox" checked={draft.active} onChange={e => setField('active', e.target.checked)} />
                        Active (visible on menu)
                      </label>
                    </div>
                  </div>

                  {error && (
                    <div style={{ padding: 12, borderRadius: 10, background: 'rgba(201,96,63,0.1)', border: '1px solid rgba(201,96,63,0.3)', color: '#d9967a', fontSize: 13 }}>
                      {error}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                    <button onClick={cancelEdit} style={ghostBtn}>Cancel</button>
                    <button onClick={saveEdit} disabled={saving} style={primaryBtn}>
                      {saving ? 'Saving…' : 'Save promo'}
                    </button>
                  </div>
                </div>
              ) : (
                /* ── View mode ── */
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--sage)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
                      {p.kicker_en}
                    </div>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, color: 'var(--cream-bright)' }}>
                      {p.title_en}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--cream-50)', marginTop: 4 }}>
                      CTA: {p.cta_en}
                    </div>
                    {dish && (
                      <div style={{ fontSize: 12, color: 'var(--cream-30)', marginTop: 6 }}>
                        Linked: {dish.name_en}
                      </div>
                    )}
                    <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--hairline)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <div style={{ fontSize: 12, color: 'var(--cream-50)' }}>FA: {p.kicker_fa} · {p.title_fa}</div>
                      <div style={{ fontSize: 12, color: 'var(--cream-50)' }}>AR: {p.kicker_ar} · {p.title_ar}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, flexShrink: 0 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 999, background: p.active ? 'var(--sage-soft)' : 'var(--surface)', color: p.active ? 'var(--sage)' : 'var(--cream-30)' }}>
                      {p.active ? 'Active' : 'Hidden'}
                    </span>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => toggleActive(p)} style={{ ...ghostBtn, fontSize: 12, padding: '6px 14px' }}>
                        {p.active ? 'Hide' : 'Show'}
                      </button>
                      <button onClick={() => startEdit(p)} style={{ ...primaryBtn, fontSize: 12, padding: '6px 14px' }}>
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, color: 'var(--cream-50)',
  letterSpacing: '0.06em', textTransform: 'uppercase',
}
const inputStyle: React.CSSProperties = {
  width: '100%', background: 'var(--surface)', border: '1px solid var(--hairline)',
  borderRadius: 10, padding: '9px 13px', color: 'var(--cream)',
  fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none',
}
const primaryBtn: React.CSSProperties = {
  padding: '10px 22px', borderRadius: 999, border: 'none', cursor: 'pointer',
  background: 'var(--cream)', color: '#10231a', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 14,
}
const ghostBtn: React.CSSProperties = {
  padding: '10px 22px', borderRadius: 999, border: '1px solid var(--hairline)',
  cursor: 'pointer', background: 'transparent', color: 'var(--cream-50)',
  fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14,
}
