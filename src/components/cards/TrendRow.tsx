'use client'
import type { Dish, Locale } from '@/types/menu.types'
import { dishName } from '@/types/menu.types'
import { digits } from '@/lib/utils/digits'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import Ic from '@/components/primitives/Ic'
import PriceDisplay from '@/components/primitives/PriceDisplay'

const MINS: Record<Locale, string> = { en: 'min', fa: 'دقیقه', ar: 'دقيقة' }
const KCAL: Record<Locale, string> = { en: 'kcal', fa: 'کالری', ar: 'سعرة' }

interface Props { dish: Dish; rank: number; locale: Locale }

export default function TrendRow({ dish, rank, locale }: Props) {
  return (
    <Link href={`/dish/${dish.id}` as '/'} style={{ textDecoration: 'none' }}>
      <div className="trend-row">
        <div style={{ position: 'relative', flex: '0 0 76px', width: 76, height: 76 }}>
          {dish.image_url ? (
            <Image src={dish.image_url} alt={dishName(dish, 'en')} fill style={{ objectFit: 'cover', borderRadius: '50%', boxShadow: '0 8px 18px rgba(0,0,0,0.4)' }} sizes="76px" />
          ) : (
            <div style={{ width: 76, height: 76, borderRadius: '50%', background: 'linear-gradient(135deg, #1f3b2c, #0c1c14)', boxShadow: '0 8px 18px rgba(0,0,0,0.4)' }} />
          )}
          <span style={{ position: 'absolute', top: -4, insetInlineStart: -4, width: 24, height: 24, borderRadius: '50%', background: 'var(--sage)', color: '#10231a', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 12, display: 'grid', placeItems: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.4)' }}>
            {digits(rank, locale)}
          </span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 17, color: 'var(--cream-bright)', lineHeight: 1.1 }}>{dishName(dish, locale)}</div>
          <div style={{ marginTop: 5, display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--cream-50)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <Ic name="clock" size={13} sw={1.8} style={{ color: 'var(--sage)' }} />
              {digits(dish.mins ?? 0, locale)} {MINS[locale]}
            </span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--cream-30)' }} />
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <Ic name="bolt" size={13} sw={1.8} style={{ color: 'var(--sage)' }} />
              {digits(dish.kcal ?? 0, locale)} {KCAL[locale]}
            </span>
          </div>
        </div>
        <div style={{ textAlign: 'end' }}>
          <PriceDisplay value={dish.price} locale={locale} />
        </div>
      </div>
    </Link>
  )
}
