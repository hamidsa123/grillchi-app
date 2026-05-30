'use client'
import type { Dish, Locale } from '@/types/menu.types'
import { dishName } from '@/types/menu.types'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'

const ORBS = [
  { size: 132, top: 4,   inlineStart: 6,  cls: 'float-a' },
  { size: 120, top: 120, inlineEnd: 2,    cls: 'float-b' },
  { size: 126, top: 230, inlineStart: 26, cls: 'float-c' },
]

const FLOAT_STYLES: Record<string, React.CSSProperties> = {
  'float-a': { animation: 'floatY 6s ease-in-out infinite' },
  'float-b': { animation: 'floatY 7.5s ease-in-out infinite reverse' },
  'float-c': { animation: 'floatY 6.8s ease-in-out infinite', animationDelay: '-1.5s' },
}

interface Props { featured: Dish[]; locale: Locale }

export default function HeroSerpentine({ featured, locale }: Props) {
  return (
    <div style={{ position: 'relative', marginTop: 26, height: 360 }}>
      <svg style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 86, transform: 'translateX(-50%)', opacity: 0.92, pointerEvents: 'none' }} viewBox="0 0 90 360" fill="none" preserveAspectRatio="none">
        <path d="M45 -10 C 80 55, 12 120, 45 180 C 78 240, 12 305, 45 370" stroke="rgb(229,229,229)" strokeWidth="48" strokeLinecap="round" opacity="0.96" />
      </svg>
      {ORBS.map((orb, idx) => {
        const dish = featured[idx]
        if (!dish) return null
        const nameShort = dishName(dish, locale).split(/[ ‌]/).slice(0, 2).join(' ')
        const posStyle: React.CSSProperties = {
          position: 'absolute',
          width: orb.size, height: orb.size,
          top: orb.top,
          ...(('inlineStart' in orb) ? { insetInlineStart: orb.inlineStart } : { insetInlineEnd: (orb as { inlineEnd: number }).inlineEnd }),
          borderRadius: '50%',
          overflow: 'visible',
          ...FLOAT_STYLES[orb.cls],
        }
        return (
          <Link key={dish.id} href={`/dish/${dish.id}` as '/'} style={{ textDecoration: 'none', ...posStyle }}>
            <div style={{ width: '100%', height: '100%', position: 'relative', borderRadius: '50%', overflow: 'hidden' }}>
              <span className="ring" style={{ inset: -11 }} />
              <span className="ring ring-rev" style={{ inset: -16 }} />
              {dish.image_url ? (
                <Image src={dish.image_url} alt={dishName(dish, 'en')} fill style={{ objectFit: 'cover', borderRadius: '50%', boxShadow: '0 18px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(236,229,209,0.1)' }} sizes={`${orb.size}px`} />
              ) : (
                <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1f3b2c, #0c1c14)', borderRadius: '50%', boxShadow: '0 18px 40px rgba(0,0,0,0.5)' }} />
              )}
            </div>
            <span style={{ position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%)', background: 'var(--cream)', color: '#173324', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 11, padding: '4px 11px', borderRadius: 999, whiteSpace: 'nowrap', boxShadow: '0 6px 16px rgba(0,0,0,0.4)' }}>
              {nameShort}
            </span>
          </Link>
        )
      })}
    </div>
  )
}
