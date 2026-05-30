'use client'
import type { Locale } from '@/types/menu.types'
import Ic from '@/components/primitives/Ic'
import { useRouter } from '@/i18n/navigation'

const LABELS: Record<string, Record<Locale, string>> = {
  home:    { en: 'Home',   fa: 'خانه',       ar: 'الرئيسية' },
  menu:    { en: 'Menu',   fa: 'منو',         ar: 'القائمة' },
  offers:  { en: 'Offers', fa: 'پیشنهادها',  ar: 'العروض' },
  branch:  { en: 'Branch', fa: 'شعبه',        ar: 'الفرع' },
}

const ITEMS = [
  { id: 'home',   icon: 'home',  href: '' },
  { id: 'menu',   icon: 'grid',  href: '/menu' },
  { id: 'offers', icon: 'flame', href: '' },
  { id: 'branch', icon: 'pin',   href: '' },
]

interface Props {
  locale: Locale
  active: string
  onBranch: () => void
}

export default function BottomNav({ locale, active, onBranch }: Props) {
  const router = useRouter()

  const handleNav = (item: typeof ITEMS[0]) => {
    if (item.id === 'branch') { onBranch(); return }
    if (item.href) router.push(item.href as '/')
    else router.push('/')
  }

  return (
    <div style={{
      position: 'fixed', bottom: 0, insetInline: 0, zIndex: 45,
      display: 'flex', justifyContent: 'space-around', alignItems: 'center',
      padding: '12px 14px 30px',
      background: 'linear-gradient(180deg, rgba(12,28,20,0) 0%, rgba(11,24,17,0.92) 38%)',
    }}>
      <div className="botbar-glass" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%', padding: '8px 10px' }}>
        {ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => handleNav(item)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              background: 'none', border: 'none', cursor: 'pointer',
              color: active === item.id ? 'var(--sage)' : 'var(--cream-30)',
              fontFamily: 'var(--font-body)', fontSize: 9.5, fontWeight: 600,
              padding: '7px 0', borderRadius: 999,
              transition: 'color 0.25s',
            }}
          >
            <span style={{ width: 24, height: 24, display: 'grid', placeItems: 'center', transition: 'transform 0.25s var(--ease-spring)', transform: active === item.id ? 'translateY(-1px)' : 'none' }}>
              <Ic name={item.icon} size={22} sw={active === item.id ? 2.1 : 1.8} />
            </span>
            {LABELS[item.id][locale]}
          </button>
        ))}
      </div>
    </div>
  )
}
