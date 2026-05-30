'use client'
import { useState } from 'react'
import type { Branch } from '@/types/menu.types'
import { saveBranch, toggleBranch } from '../../actions'

function BranchField({ label, value, dir, onChange }: {
  label: string; value: string; dir?: 'rtl' | 'ltr'; onChange: (v: string) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={labelStyle}>{label}</label>
      <input value={value} dir={dir} style={inputStyle} onChange={e => onChange(e.target.value)} />
    </div>
  )
}

export default function BranchesClient({ initialBranches }: { initialBranches: Branch[] }) {
  const [branches, setBranches] = useState<Branch[]>(initialBranches)
  const [editing, setEditing] = useState<string | null>(null)
  const [draft, setDraft]     = useState<Branch | null>(null)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  const startEdit = (b: Branch) => { setEditing(b.id); setDraft({ ...b }); setError('') }
  const cancelEdit = () => { setEditing(null); setDraft(null) }
  const setField = (k: keyof Branch, v: unknown) => setDraft(d => d ? { ...d, [k]: v } : d)

  const saveEdit = async () => {
    if (!draft) return
    setSaving(true); setError('')
    const result = await saveBranch(draft)
    if (result.error) { setError(result.error); setSaving(false); return }
    setBranches(bs => bs.map(b => b.id === draft.id ? draft : b))
    setEditing(null); setDraft(null); setSaving(false)
  }

  const handleToggle = async (b: Branch) => {
    const updated = { ...b, open: !b.open }
    await toggleBranch(b.id, !b.open)
    setBranches(bs => bs.map(br => br.id === b.id ? updated : br))
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--cream-bright)', marginBottom: 28 }}>
        Branches
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {branches.map(b => {
          const isEditing = editing === b.id

          return (
            <div key={b.id} style={{ background: '#14291f', border: `1px solid ${isEditing ? 'var(--sage)' : 'var(--hairline)'}`, borderRadius: 18, padding: 24, transition: 'border-color .2s' }}>

              {isEditing && draft ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                    <BranchField label="Name (EN)" value={draft.name_en} onChange={v => setField('name_en', v)} />
                    <BranchField label="نام (FA)" value={draft.name_fa} dir="rtl" onChange={v => setField('name_fa', v)} />
                    <BranchField label="الاسم (AR)" value={draft.name_ar} dir="rtl" onChange={v => setField('name_ar', v)} />
                    <BranchField label="City (EN)" value={draft.city_en} onChange={v => setField('city_en', v)} />
                    <BranchField label="شهر (FA)" value={draft.city_fa} dir="rtl" onChange={v => setField('city_fa', v)} />
                    <BranchField label="المدينة (AR)" value={draft.city_ar} dir="rtl" onChange={v => setField('city_ar', v)} />
                    <BranchField label="Distance (EN)" value={draft.dist_en} onChange={v => setField('dist_en', v)} />
                    <BranchField label="فاصله (FA)" value={draft.dist_fa} dir="rtl" onChange={v => setField('dist_fa', v)} />
                    <BranchField label="المسافة (AR)" value={draft.dist_ar} dir="rtl" onChange={v => setField('dist_ar', v)} />
                  </div>
                  <BranchField label="Hours" value={draft.hours} onChange={v => setField('hours', v)} />

                  {error && (
                    <div style={{ padding: 12, borderRadius: 10, background: 'rgba(201,96,63,0.1)', border: '1px solid rgba(201,96,63,0.3)', color: '#d9967a', fontSize: 13 }}>
                      {error}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                    <button onClick={cancelEdit} style={ghostBtn}>Cancel</button>
                    <button onClick={saveEdit} disabled={saving} style={primaryBtn}>
                      {saving ? 'Saving…' : 'Save branch'}
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 16, color: 'var(--cream-bright)' }}>
                      {b.name_en} · {b.city_en}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--cream-50)', marginTop: 4 }}>
                      {b.hours} &nbsp;·&nbsp; {b.dist_en}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--cream-30)', marginTop: 4 }}>
                      FA: {b.name_fa} &nbsp;|&nbsp; AR: {b.name_ar}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: b.open ? 'var(--sage)' : 'var(--cream-30)', background: b.open ? 'var(--sage-soft)' : 'var(--surface)', padding: '4px 12px', borderRadius: 999 }}>
                      {b.open ? 'Open' : 'Closed'}
                    </span>
                    <button onClick={() => handleToggle(b)} style={{ ...ghostBtn, fontSize: 12, padding: '6px 14px' }}>
                      {b.open ? 'Close now' : 'Open now'}
                    </button>
                    <button onClick={() => startEdit(b)} style={{ ...primaryBtn, fontSize: 12, padding: '6px 14px' }}>
                      Edit
                    </button>
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
