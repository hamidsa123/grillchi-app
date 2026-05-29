import type { Locale } from '@/types/menu.types'
import Ic from './Ic'

const MILD: Record<Locale, string> = { en: 'Mild', fa: 'ملایم', ar: 'خفيف' }

export default function Spice({ level, locale }: { level: number; locale: Locale }) {
  if (!level) return <span style={{ color: 'var(--cream-50)' }}>{MILD[locale]}</span>
  return (
    <span style={{ display: 'inline-flex', gap: 3, color: 'var(--sage)' }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{ opacity: i < level ? 1 : 0.22, display: 'inline-flex' }}>
          <Ic name="pepper" size={15} sw={1.6} />
        </span>
      ))}
    </span>
  )
}
