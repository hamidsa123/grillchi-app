'use client'
import type { Branch, Locale } from '@/types/menu.types'
import { branchArea } from '@/types/menu.types'
import Ic from '@/components/primitives/Ic'

interface Props {
  locale: Locale
  brand: string
  branch: Branch
  onBranch: () => void
  onLang: () => void
  solid?: boolean
}

export default function TopBar({ locale, brand, branch, onBranch, onLang, solid }: Props) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 40,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      padding: '54px 20px 14px',
      background: solid
        ? '#14291f'
        : 'linear-gradient(180deg, rgba(12,28,20,0.96) 30%, rgba(12,28,20,0) 100%)',
      borderBottom: solid ? '1px solid var(--hairline)' : 'none',
      backdropFilter: 'blur(2px)',
    }}>
      <div style={{
        fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 21,
        letterSpacing: '0.04em', color: 'var(--cream-bright)', lineHeight: 1,
        display: 'flex', alignItems: 'center', gap: 9,
      }}>
        <span style={{
          width: 26, height: 26, display: 'grid', placeItems: 'center',
          borderRadius: '50%', background: 'var(--sage-soft)',
          border: '1px solid rgba(184,217,160,0.3)', color: 'var(--sage)',
        }}>
          <Ic name="flame" size={15} sw={1.9} />
        </span>
        {brand}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button className="chip" onClick={onBranch}>
          <span className="dot" style={{ background: branch.open ? 'var(--sage)' : 'var(--cream-30)', boxShadow: branch.open ? '0 0 8px var(--sage)' : 'none' }} />
          {branchArea(branch, locale)}
          <Ic name="chevronDown" size={15} sw={2} style={{ opacity: 0.6 }} />
        </button>
        <button className="chip" style={{ width: 38, padding: 0, justifyContent: 'center' }} onClick={onLang} aria-label="language">
          <Ic name="globe" size={19} sw={1.7} />
        </button>
      </div>
    </div>
  )
}
