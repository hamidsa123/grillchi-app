'use client'
import { useState } from 'react'
import type { Category } from '@/types/menu.types'
import { saveCategory, deleteCategory } from '../../actions'

const emptyDraft = (sort_order: number): Category => ({
  id: '', name_en: '', name_fa: '', name_ar: '', icon_paths: '', sort_order,
})

function Field({ label, value, dir, onChange, mono }: {
  label: string; value: string; dir?: 'rtl' | 'ltr'; onChange: (v: string) => void; mono?: boolean
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <label style={labelStyle}>{label}</label>
      <input
        value={value}
        dir={dir}
        style={{ ...inputStyle, fontFamily: mono ? 'ui-monospace, monospace' : 'var(--font-body)' }}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}

export default function CategoriesClient({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [editing, setEditing] = useState<string | null>(null)
  const [draft, setDraft]     = useState<Category | null>(null)
  const [isNew, setIsNew]     = useState(false)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  const startEdit = (c: Category) => {
    setEditing(c.id); setDraft({ ...c }); setIsNew(false); setError('')
  }
  const startNew = () => {
    const next = (categories.reduce((m, c) => Math.max(m, c.sort_order), -1)) + 1
    setEditing('__new__'); setDraft(emptyDraft(next)); setIsNew(true); setError('')
  }
  const cancelEdit = () => { setEditing(null); setDraft(null); setIsNew(false); setError('') }
  const setField = (k: keyof Category, v: unknown) =>
    setDraft(d => d ? { ...d, [k]: v } : d)

  const saveEdit = async () => {
    if (!draft) return
    setSaving(true); setError('')
    if (isNew && categories.some(c => c.id === draft.id.trim())) {
      setError('A category with this ID already exists'); setSaving(false); return
    }
    const result = await saveCategory(draft)
    if (result.error) { setError(result.error); setSaving(false); return }
    const saved: Category = { ...draft, id: draft.id.trim() }
    setCategories(cs => {
      const exists = cs.some(c => c.id === saved.id)
      const next = exists ? cs.map(c => c.id === saved.id ? saved : c) : [...cs, saved]
      return [...next].sort((a, b) => a.sort_order - b.sort_order)
    })
    cancelEdit(); setSaving(false)
  }

  const handleDelete = async (c: Category) => {
    if (!confirm(`Delete category "${c.name_en}"?`)) return
    setError('')
    const result = await deleteCategory(c.id)
    if (result.error) { setError(result.error); return }
    setCategories(cs => cs.filter(x => x.id !== c.id))
    if (editing === c.id) cancelEdit()
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--cream-bright)', margin: 0 }}>
          Categories
        </h1>
        {!isNew && (
          <button onClick={startNew} style={primaryBtn}>+ New category</button>
        )}
      </div>

      {error && !editing && (
        <div style={errorBox}>{error}</div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {isNew && draft && (
          <CategoryEditor
            draft={draft} isNew saving={saving} error={error}
            setField={setField} onSave={saveEdit} onCancel={cancelEdit}
          />
        )}

        {categories.map(c => {
          const isEditing = editing === c.id
          if (isEditing && draft) {
            return (
              <CategoryEditor
                key={c.id}
                draft={draft} isNew={false} saving={saving} error={error}
                setField={setField} onSave={saveEdit} onCancel={cancelEdit}
              />
            )
          }
          return (
            <div key={c.id} style={rowStyle}>
              <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: c.icon_paths }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--cream-bright)' }}>
                  {c.name_en}
                  <span style={{ fontSize: 11, color: 'var(--cream-30)', marginInlineStart: 10, fontFamily: 'ui-monospace, monospace' }}>{c.id}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--cream-50)', marginTop: 2 }}>
                  {c.name_fa} &nbsp;|&nbsp; {c.name_ar}
                </div>
              </div>
              <span style={{ fontSize: 12, color: 'var(--cream-30)' }}>#{c.sort_order}</span>
              <button onClick={() => startEdit(c)} style={{ ...primaryBtn, fontSize: 12, padding: '6px 14px' }}>Edit</button>
              <button onClick={() => handleDelete(c)} style={{ ...dangerBtn, fontSize: 12, padding: '6px 14px' }}>Delete</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function CategoryEditor({ draft, isNew, saving, error, setField, onSave, onCancel }: {
  draft: Category
  isNew: boolean
  saving: boolean
  error: string
  setField: (k: keyof Category, v: unknown) => void
  onSave: () => void
  onCancel: () => void
}) {
  return (
    <div style={{ background: '#14291f', border: '1px solid var(--sage)', borderRadius: 18, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
        <Field
          label="ID (slug)"
          value={draft.id}
          onChange={v => setField('id', isNew ? v.toLowerCase() : draft.id)}
          mono
        />
        <Field
          label="Sort order"
          value={String(draft.sort_order)}
          onChange={v => setField('sort_order', Number(v) || 0)}
        />
        <div />
        <Field label="Name (EN)" value={draft.name_en} onChange={v => setField('name_en', v)} />
        <Field label="نام (FA)" value={draft.name_fa} dir="rtl" onChange={v => setField('name_fa', v)} />
        <Field label="الاسم (AR)" value={draft.name_ar} dir="rtl" onChange={v => setField('name_ar', v)} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <label style={labelStyle}>Icon paths (SVG inner content, 24×24 viewBox)</label>
        <textarea
          value={draft.icon_paths}
          onChange={e => setField('icon_paths', e.target.value)}
          rows={3}
          style={{ ...inputStyle, fontFamily: 'ui-monospace, monospace', resize: 'vertical' }}
        />
        {draft.icon_paths && (
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--cream-50)' }}>
            Preview
            <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="var(--sage)" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" dangerouslySetInnerHTML={{ __html: draft.icon_paths }} />
          </div>
        )}
      </div>

      {error && <div style={errorBox}>{error}</div>}

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
        <button onClick={onCancel} style={ghostBtn}>Cancel</button>
        <button onClick={onSave} disabled={saving} style={primaryBtn}>
          {saving ? 'Saving…' : isNew ? 'Create category' : 'Save category'}
        </button>
      </div>
    </div>
  )
}

const rowStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px',
  background: '#14291f', border: '1px solid var(--hairline)', borderRadius: 14,
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
const dangerBtn: React.CSSProperties = {
  padding: '10px 22px', borderRadius: 999, border: '1px solid rgba(201,96,63,0.4)',
  cursor: 'pointer', background: 'transparent', color: '#d9967a',
  fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14,
}
const errorBox: React.CSSProperties = {
  padding: 12, borderRadius: 10, background: 'rgba(201,96,63,0.1)',
  border: '1px solid rgba(201,96,63,0.3)', color: '#d9967a', fontSize: 13,
}
