'use client'
import type { Dish, Locale } from '@/types/menu.types'
import { dishName } from '@/types/menu.types'
import Image from 'next/image'
import Link from 'next/link'
import Ic from '@/components/primitives/Ic'
import Badges from '@/components/primitives/Badges'
import PriceDisplay from '@/components/primitives/PriceDisplay'
import { useMenuStore } from '@/store/useMenuStore'

const ADDED: Record<Locale, string> = { en: 'Added to your order', fa: 'به سفارش اضافه شد', ar: 'أُضيف إلى طلبك' }

interface Props { dish: Dish; locale: Locale }

export default function GCard({ dish, locale }: Props) {
  const showToast = useMenuStore(s => s.showToast)
  const onAdd = (e: React.MouseEvent) => { e.preventDefault(); showToast(`${dishName(dish, locale)} · ${ADDED[locale]}`) }

  return (
    <Link href={`/dish/${dish.id}` as '/'} style={{ textDecoration: 'none' }}>
      <div style={{ position: 'relative', borderRadius: 22, overflow: 'hidden', background: '#173324', border: '1px solid var(--hairline)', cursor: 'pointer', transition: 'transform 0.3s var(--ease-out)' }}>
        <div style={{ position: 'relative', height: 150 }}>
          {dish.image_url ? (
            <Image src={dish.image_url} alt={dishName(dish, 'en')} fill style={{ objectFit: 'cover' }} sizes="(max-width: 500px) 50vw, 200px" />
          ) : (
            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1f3b2c, #0c1c14)' }} />
          )}
          {dish.tags[0] && (
            <span style={{ position: 'absolute', top: 10, insetInlineStart: 10 }}>
              <Badges tags={[dish.tags[0]]} locale={locale} />
            </span>
          )}
          <button className="add-btn" style={{ position: 'absolute', bottom: -16, insetInlineEnd: 12, width: 36, height: 36 }} onClick={onAdd}>
            <Ic name="plus" size={18} sw={2.2} />
          </button>
        </div>
        <div style={{ padding: '14px 14px 15px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, lineHeight: 1.12, color: 'var(--cream-bright)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: '2.24em' }}>
            {dishName(dish, locale)}
          </div>
          <div style={{ marginTop: 10 }}>
            <PriceDisplay value={dish.price} locale={locale} />
          </div>
        </div>
      </div>
    </Link>
  )
}
