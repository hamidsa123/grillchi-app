'use client'
import { useState } from 'react'
import type { Dish, Category } from '@/types/menu.types'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from '@/i18n/navigation'

interface Props { dish?: Dish; categories: Category[]; locale: string }

const TAGS = ['popular', 'new', 'spicy', 'veg']

// Defined at module level so their identity is stable across re-renders.
// If defined inside DishForm, every setState call creates new function
// references → React treats them as new component types → unmount+remount
// → input loses focus after every keystroke.
function Field({ label, value, type = 'text', dir, onChange }: {
  label: string
  value: string | number
  type?: string
  dir?: 'rtl' | 'ltr'
  onChange: (v: string | number) => void
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        value={value as string}
        dir={dir}
        style={inputStyle}
        onChange={e => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
      />
    </div>
  )
}

function TextareaField({ label, value, dir, onChange }: {
  label: string
  value: string
  dir?: 'rtl' | 'ltr'
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <textarea
        value={value}
        dir={dir}
        rows={3}
        style={{ ...inputStyle, resize: 'vertical' }}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}

export default function DishForm({ dish, categories }: Props) {
  const router = useRouter()
  const isNew = !dish
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [imageUploading, setImageUploading] = useState(false)
  const [imageError, setImageError] = useState('')

  const [form, setForm] = useState({
    id:          dish?.id          ?? '',
    category_id: dish?.category_id ?? categories[0]?.id ?? '',
    price:       dish?.price       ?? 0,
    featured:    dish?.featured    ?? false,
    trending:    dish?.trending    ?? false,
    available:   dish?.available   ?? true,
    hot:         dish?.hot         ?? 0,
    kcal:        dish?.kcal        ?? 0,
    mins:        dish?.mins        ?? 0,
    tags:        dish?.tags        ?? [] as string[],
    image_url:   dish?.image_url   ?? '',
    name_en: dish?.name_en ?? '', name_fa: dish?.name_fa ?? '', name_ar: dish?.name_ar ?? '',
    desc_en: dish?.desc_en ?? '', desc_fa: dish?.desc_fa ?? '', desc_ar: dish?.desc_ar ?? '',
    ing_en: dish?.ing_en?.join(', ') ?? '',
    ing_fa: dish?.ing_fa?.join(', ') ?? '',
    ing_ar: dish?.ing_ar?.join(', ') ?? '',
  })

  const set = (k: string, v: unknown) => setForm(f => ({ ...f, [k]: v }))

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageUploading(true); setImageError('')
    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()
      const path = `dishes/${form.id || Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage.from('menu-images').upload(path, file, { upsert: true })
      if (upErr) { setImageError(upErr.message); setImageUploading(false); return }
      const { data } = supabase.storage.from('menu-images').getPublicUrl(path)
      set('image_url', data.publicUrl)
    } catch (e: unknown) {
      setImageError(e instanceof Error ? e.message : 'Upload failed')
    }
    setImageUploading(false)
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      const supabase = createClient()

      // Seed categories first so the foreign key constraint is always satisfied
      const { error: catErr } = await supabase.from('categories').upsert(
        categories.map(c => ({ id: c.id, name_en: c.name_en, name_fa: c.name_fa, name_ar: c.name_ar, icon_paths: c.icon_paths, sort_order: c.sort_order })),
        { onConflict: 'id' }
      )
      if (catErr) { setError('Categories seed failed: ' + catErr.message); setSaving(false); return }

      const payload = {
        ...form,
        ing_en: form.ing_en.split(',').map(s => s.trim()).filter(Boolean),
        ing_fa: form.ing_fa.split(',').map(s => s.trim()).filter(Boolean),
        ing_ar: form.ing_ar.split(',').map(s => s.trim()).filter(Boolean),
      }
      const { error: err } = await supabase.from('dishes').upsert(payload, { onConflict: 'id' })
      if (err) { setError(err.message); setSaving(false); return }
      router.push('/admin/dishes' as '/')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Unknown error')
      setSaving(false)
    }
  }

  const del = async () => {
    if (!confirm('Delete this dish?')) return
    const supabase = createClient()
    await supabase.from('dishes').delete().eq('id', dish!.id)
    router.push('/admin/dishes' as '/')
  }

  return (
    <form onSubmit={onSubmit}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--cream-bright)' }}>
          {isNew ? 'New dish' : 'Edit dish'}
        </h1>
        <div style={{ display: 'flex', gap: 12 }}>
          {!isNew && (
            <button type="button" onClick={del}
              style={{ ...ghostBtn, color: '#d9967a', borderColor: 'rgba(201,96,63,0.3)' }}>
              Delete
            </button>
          )}
          <button type="submit" disabled={saving} style={primaryBtn}>
            {saving ? 'Saving…' : 'Save dish'}
          </button>
        </div>
      </div>

      {error && (
        <div style={{ marginBottom: 20, padding: 14, borderRadius: 12, background: 'rgba(201,96,63,0.1)', border: '1px solid rgba(201,96,63,0.3)', color: '#d9967a', fontSize: 14 }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

        {/* ── Left column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <section style={card}>
            <h2 style={cardTitle}>Identity</h2>
            <Field label="Slug ID" value={form.id} onChange={v => set('id', v)} />
            <div>
              <label style={labelStyle}>Category</label>
              <select value={form.category_id} onChange={e => set('category_id', e.target.value)} style={inputStyle}>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name_en}</option>)}
              </select>
            </div>
            <Field label="Price (× 1000 Toman)" value={form.price} type="number" onChange={v => set('price', v)} />
          </section>

          <section style={card}>
            <h2 style={cardTitle}>English</h2>
            <Field label="Name (EN)" value={form.name_en} onChange={v => set('name_en', v)} />
            <TextareaField label="Description (EN)" value={form.desc_en} onChange={v => set('desc_en', v)} />
            <Field label="Ingredients (EN) — comma separated" value={form.ing_en} onChange={v => set('ing_en', v)} />
          </section>

          <section style={card}>
            <h2 style={cardTitle}>Persian (فارسی)</h2>
            <Field label="نام" value={form.name_fa} dir="rtl" onChange={v => set('name_fa', v)} />
            <TextareaField label="توضیحات" value={form.desc_fa} dir="rtl" onChange={v => set('desc_fa', v)} />
            <Field label="مواد (با کاما جدا کنید)" value={form.ing_fa} dir="rtl" onChange={v => set('ing_fa', v)} />
          </section>

          <section style={card}>
            <h2 style={cardTitle}>Arabic (عربي)</h2>
            <Field label="الاسم" value={form.name_ar} dir="rtl" onChange={v => set('name_ar', v)} />
            <TextareaField label="الوصف" value={form.desc_ar} dir="rtl" onChange={v => set('desc_ar', v)} />
            <Field label="المكونات (مفصولة بفاصلة)" value={form.ing_ar} dir="rtl" onChange={v => set('ing_ar', v)} />
          </section>
        </div>

        {/* ── Right column ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <section style={card}>
            <h2 style={cardTitle}>Image</h2>
            {form.image_url && (
              <img src={form.image_url} alt=""
                style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 12, marginBottom: 12 }} />
            )}
            <label style={{ ...primaryBtn, display: 'block', textAlign: 'center', cursor: 'pointer' }}>
              {imageUploading ? 'Uploading…' : '+ Upload image'}
              <input type="file" accept="image/*" onChange={uploadImage} style={{ display: 'none' }} />
            </label>
            {imageError && (
              <div style={{ marginTop: 10, padding: 10, borderRadius: 10, background: 'rgba(201,96,63,0.1)', border: '1px solid rgba(201,96,63,0.3)', color: '#d9967a', fontSize: 12 }}>
                {imageError}
              </div>
            )}
          </section>

          <section style={card}>
            <h2 style={cardTitle}>Details</h2>
            <Field label="Calories (kcal)" value={form.kcal ?? 0} type="number" onChange={v => set('kcal', v)} />
            <Field label="Prep time (min)"  value={form.mins ?? 0} type="number" onChange={v => set('mins', v)} />
            <div>
              <label style={labelStyle}>Spice level (0–3)</label>
              <input type="range" min={0} max={3} value={form.hot}
                onChange={e => set('hot', Number(e.target.value))} style={{ width: '100%' }} />
              <div style={{ fontSize: 12, color: 'var(--cream-50)', marginTop: 4 }}>
                {'🌶'.repeat(form.hot) || 'Mild'}
              </div>
            </div>
          </section>

          <section style={card}>
            <h2 style={cardTitle}>Tags</h2>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {TAGS.map(tag => (
                <label key={tag} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14, color: form.tags.includes(tag) ? 'var(--sage)' : 'var(--cream-50)' }}>
                  <input type="checkbox" checked={form.tags.includes(tag)}
                    onChange={e => set('tags', e.target.checked
                      ? [...form.tags, tag]
                      : form.tags.filter((t: string) => t !== tag)
                    )} />
                  {tag}
                </label>
              ))}
            </div>
          </section>

          <section style={card}>
            <h2 style={cardTitle}>Visibility</h2>
            {(['featured', 'trending', 'available'] as const).map((key) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '8px 0', borderBottom: '1px solid var(--hairline)', fontSize: 14, color: 'var(--cream-70)' }}>
                <input type="checkbox"
                  checked={form[key] as boolean}
                  onChange={e => set(key, e.target.checked)} />
                {{ featured: 'Featured on homepage', trending: 'Trending list', available: 'Available to order' }[key]}
              </label>
            ))}
          </section>
        </div>
      </div>
    </form>
  )
}

const labelStyle: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, color: 'var(--cream-50)',
  display: 'block', marginBottom: 6, letterSpacing: '0.06em', textTransform: 'uppercase',
}
const inputStyle: React.CSSProperties = {
  width: '100%', background: 'var(--surface)', border: '1px solid var(--hairline)',
  borderRadius: 10, padding: '10px 14px', color: 'var(--cream)',
  fontFamily: 'var(--font-body)', fontSize: 14, outline: 'none', marginBottom: 16,
}
const card: React.CSSProperties = {
  background: '#14291f', border: '1px solid var(--hairline)',
  borderRadius: 18, padding: 20, display: 'flex', flexDirection: 'column', gap: 4,
}
const cardTitle: React.CSSProperties = {
  fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600,
  color: 'var(--cream-bright)', marginBottom: 16, paddingBottom: 10, borderBottom: '1px solid var(--hairline)',
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
