'use client'
import type { Branch, Locale } from '@/types/menu.types'
import { branchArea, branchCity, branchDist } from '@/types/menu.types'
import Sheet from './Sheet'
import Ic from '@/components/primitives/Ic'

const TITLES  = { en: 'Choose your branch', fa: 'انتخاب شعبه', ar: 'اختر الفرع' }
const SUBS    = { en: 'Prices & availability may vary by location', fa: 'قیمت و موجودی بسته به شعبه متفاوت است', ar: 'قد تختلف الأسعار حسب الموقع' }
const OPEN    = { en: 'Open now', fa: 'باز است', ar: 'مفتوح الآن' }
const CLOSED  = { en: 'Closed', fa: 'بسته', ar: 'مغلق' }

interface Props {
  locale: Locale
  branches: Branch[]
  branchId: string
  onPick: (id: string) => void
  onClose: () => void
}

export default function BranchSheet({ locale, branches, branchId, onPick, onClose }: Props) {
  return (
    <Sheet onClose={onClose}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22, color: 'var(--cream-bright)', margin: '0 0 4px' }}>{TITLES[locale]}</h3>
      <p style={{ fontSize: 13, color: 'var(--cream-50)', margin: '0 0 18px' }}>{SUBS[locale]}</p>
      {branches.map(b => (
        <div key={b.id} className={`opt-row ${b.id === branchId ? 'sel' : ''}`} onClick={() => { onPick(b.id); onClose() }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', flex: '0 0 40px', display: 'grid', placeItems: 'center', background: 'var(--surface-2)', border: '1px solid var(--hairline)', color: 'var(--sage)' }}>
            <Ic name="pin" size={20} sw={1.8} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--cream-bright)' }}>
              {branchArea(b, locale)} · {branchCity(b, locale)}
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--cream-50)', marginTop: 2 }}>
              {b.hours} · {branchDist(b, locale)}
            </div>
          </div>
          {b.open
            ? <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--sage)', background: 'var(--sage-soft)', padding: '4px 9px', borderRadius: 999, whiteSpace: 'nowrap' }}>{OPEN[locale]}</span>
            : <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--cream-50)', background: 'var(--cream-07)', padding: '4px 9px', borderRadius: 999, whiteSpace: 'nowrap' }}>{CLOSED[locale]}</span>
          }
        </div>
      ))}
    </Sheet>
  )
}
