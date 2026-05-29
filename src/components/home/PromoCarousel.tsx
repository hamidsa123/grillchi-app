'use client'
import { useState, useEffect, useRef } from 'react'
import type { Promo, Dish, Locale } from '@/types/menu.types'
import Image from 'next/image'
import Link from 'next/link'
import Ic from '@/components/primitives/Ic'

const GRADIENTS = [
  'linear-gradient(120deg, #294a38, #1f3b2c 60%, #14291f)',
  'linear-gradient(120deg, #2d4a2c, #1f3b2c 55%, #122318)',
  'linear-gradient(120deg, #3a4d2e, #25402c 60%, #142a1c)',
]

interface Props { promos: Promo[]; dishesById: Record<string, Dish>; locale: Locale }

export default function PromoCarousel({ promos, dishesById, locale }: Props) {
  const [i, setI] = useState(0)
  const paused = useRef(false)
  const isRtl = locale !== 'en'

  useEffect(() => {
    const t = setInterval(() => { if (!paused.current) setI(p => (p + 1) % promos.length) }, 4200)
    return () => clearInterval(t)
  }, [promos.length])

  const shift = (isRtl ? 1 : -1) * i * 100

  const getLabel = (p: Promo, key: 'kicker' | 'title' | 'cta') => {
    if (locale === 'fa') return p[`${key}_fa`]
    if (locale === 'ar') return p[`${key}_ar`]
    return p[`${key}_en`]
  }

  return (
    <div style={{ marginTop: 36, padding: '0 20px' }}
      onTouchStart={() => { paused.current = true }}
      onMouseEnter={() => { paused.current = true }}
      onMouseLeave={() => { paused.current = false }}>
      <div style={{ position: 'relative', borderRadius: 26, overflow: 'hidden', height: 168, boxShadow: '0 16px 40px rgba(0,0,0,0.4)' }}>
        <div style={{ display: 'flex', height: '100%', transition: 'transform 0.6s var(--ease-out)', transform: `translateX(${shift}%)` }}>
          {promos.map((p, idx) => {
            const dish = p.dish_id ? dishesById[p.dish_id] : null
            const content = (
              <div style={{ flex: '0 0 100%', height: '100%', position: 'relative', display: 'flex', alignItems: 'center', padding: 24, overflow: 'hidden' }}>
                <div style={{ position: 'absolute', inset: 0, background: GRADIENTS[idx % 3], opacity: 0.9 }} />
                {dish?.image_url && (
                  <div style={{ position: 'absolute', insetInlineEnd: -30, top: '50%', transform: 'translateY(-50%)', width: 150, height: 150, borderRadius: '50%', overflow: 'hidden', opacity: 0.95 }}>
                    <Image src={dish.image_url} alt="" fill style={{ objectFit: 'cover', borderRadius: '50%' }} sizes="150px" />
                  </div>
                )}
                <div style={{ position: 'relative', zIndex: 2, maxWidth: '72%' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.16em', textTransform: locale === 'en' ? 'uppercase' : 'none', color: 'var(--sage)' }}>{getLabel(p, 'kicker')}</div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 25, lineHeight: 1.08, color: 'var(--cream-bright)', marginTop: 9 }}>{getLabel(p, 'title')}</div>
                  <span style={{ marginTop: 15, display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 13, fontWeight: 600, color: '#10231a', background: 'var(--cream)', padding: '9px 15px', borderRadius: 999 }}>
                    {getLabel(p, 'cta')}
                    <span className={isRtl ? 'rtl-flip' : undefined}><Ic name="arrow" size={15} sw={2} /></span>
                  </span>
                </div>
              </div>
            )
            return dish ? (
              <Link key={p.id} href={`/dish/${dish.id}` as '/'} style={{ textDecoration: 'none', color: 'inherit', flex: '0 0 100%', display: 'flex' }}>{content}</Link>
            ) : (
              <div key={p.id} style={{ flex: '0 0 100%' }}>{content}</div>
            )
          })}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 7, justifyContent: 'center', marginTop: 14 }}>
        {promos.map((_, idx) => (
          <span key={idx} className={`pd ${idx === i ? 'on' : ''}`} onClick={() => setI(idx)} />
        ))}
      </div>
    </div>
  )
}
