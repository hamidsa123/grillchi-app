'use client'
import type { Locale } from '@/types/menu.types'
import Sheet from './Sheet'
import Ic from '@/components/primitives/Ic'
import { useRouter } from '@/i18n/navigation'
import { usePathname } from 'next/navigation'

const LANGS = [
  { id: 'en' as Locale, glyph: 'A',  native: 'English',  name: 'English',  dir: 'LTR' },
  { id: 'fa' as Locale, glyph: 'ف', native: 'فارسی',    name: 'Persian',  dir: 'RTL' },
  { id: 'ar' as Locale, glyph: 'ع', native: 'العربية',  name: 'Arabic',   dir: 'RTL' },
]

const TITLES = { en: 'Choose language', fa: 'انتخاب زبان', ar: 'اختر اللغة' }
const SUBS   = { en: 'The menu adapts to your language', fa: 'منو با زبان شما هماهنگ می‌شود', ar: 'تتكيّف القائمة مع لغتك' }

interface Props { locale: Locale; onClose: () => void }

export default function LangSheet({ locale, onClose }: Props) {
  const router = useRouter()
  const pathname = usePathname()

  const pick = (id: Locale) => {
    const segments = pathname.split('/').filter(Boolean)
    const newPath = '/' + segments.slice(1).join('/') || '/'
    router.push(newPath as '/', { locale: id })
    onClose()
  }

  return (
    <Sheet onClose={onClose}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22, color: 'var(--cream-bright)', margin: '0 0 4px' }}>{TITLES[locale]}</h3>
      <p style={{ fontSize: 13, color: 'var(--cream-50)', margin: '0 0 18px' }}>{SUBS[locale]}</p>
      {LANGS.map(l => (
        <div key={l.id} className={`opt-row ${l.id === locale ? 'sel' : ''}`} onClick={() => pick(l.id)}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', flex: '0 0 40px', display: 'grid', placeItems: 'center', fontSize: 19, background: 'var(--surface-2)', border: '1px solid var(--hairline)', fontFamily: 'var(--font-display)' }}>
            {l.glyph}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--cream-bright)' }}>{l.native}</div>
            <div style={{ fontSize: 12.5, color: 'var(--cream-50)', marginTop: 2 }}>{l.name} · {l.dir}</div>
          </div>
          {l.id === locale && <span style={{ color: 'var(--sage)' }}><Ic name="check" size={22} sw={2.2} /></span>}
        </div>
      ))}
    </Sheet>
  )
}
