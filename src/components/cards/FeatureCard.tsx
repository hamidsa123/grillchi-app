'use client'
import type { Dish, Locale } from '@/types/menu.types'
import { dishName, dishDesc } from '@/types/menu.types'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import Badges from '@/components/primitives/Badges'
import PriceDisplay from '@/components/primitives/PriceDisplay'

interface Props { dish: Dish; locale: Locale }

export default function FeatureCard({ dish, locale }: Props) {
  return (
    <Link href={`/dish/${dish.id}` as '/'} style={{ textDecoration: 'none' }}>
      <div style={{ scrollSnapAlign: 'start', flex: '0 0 264px', position: 'relative', height: 340, borderRadius: 24, overflow: 'hidden', background: '#173324', boxShadow: '0 18px 40px rgba(0,0,0,0.42)', cursor: 'pointer', transition: 'transform 0.4s var(--ease-out)' }}>
        {dish.image_url ? (
          <Image src={dish.image_url} alt={dishName(dish, 'en')} fill style={{ objectFit: 'cover' }} sizes="264px" />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1f3b2c, #0c1c14)' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(12,28,20,0) 30%, rgba(10,20,14,0.55) 62%, rgba(8,18,12,0.94) 100%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 14, insetInline: '14px' }}>
          <div style={{ display: 'flex', gap: 6 }}><Badges tags={dish.tags} locale={locale} /></div>
        </div>
        <div style={{ position: 'absolute', bottom: 0, insetInline: 0, padding: 18 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 22, lineHeight: 1.05, color: 'var(--cream-bright)' }}>{dishName(dish, locale)}</div>
          <div style={{ marginTop: 6, fontSize: 12.5, lineHeight: 1.45, color: 'var(--cream-50)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{dishDesc(dish, locale)}</div>
          <div style={{ marginTop: 14 }}>
            <PriceDisplay value={dish.price} locale={locale} />
          </div>
        </div>
      </div>
    </Link>
  )
}
