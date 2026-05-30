'use client'
import type { Dish, Locale } from '@/types/menu.types'
import { dishName } from '@/types/menu.types'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'

const CHEF: Record<Locale, string> = { en: "Chef's selection", fa: 'انتخاب سرآشپز', ar: 'اختيار الشيف' }

interface Props { featured: Dish[]; locale: Locale }

export default function HeroStacked({ featured, locale }: Props) {
  const dish = featured[0]
  const label = CHEF[locale].toUpperCase()

  const orb = (
    <div style={{ margin: '26px auto 0', width: 268, height: 268, position: 'relative' }}>
      <span className="ring" style={{ inset: -18, animation: 'spin 30s linear infinite' }} />
      <svg style={{ position: 'absolute', inset: -18, width: 'calc(100% + 36px)', height: 'calc(100% + 36px)', animation: 'spin 40s linear infinite' }} viewBox="0 0 300 300">
        <defs><path id="arc" d="M40 150 A110 110 0 0 1 260 150" /></defs>
        <text fill="var(--sage)" fontSize="13" letterSpacing="4" fontFamily="var(--font-body)" fontWeight="600">
          <textPath href="#arc" startOffset="50%" textAnchor="middle">{label}</textPath>
        </text>
      </svg>
      {dish?.image_url ? (
        <Image src={dish.image_url} alt={dish ? dishName(dish, 'en') : ''} fill style={{ objectFit: 'cover', borderRadius: '50%', boxShadow: '0 22px 50px rgba(0,0,0,0.55), 0 0 0 1px rgba(236,229,209,0.1)' }} sizes="268px" />
      ) : (
        <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'linear-gradient(135deg, #1f3b2c, #0c1c14)' }} />
      )}
    </div>
  )

  return (
    <div style={{ textAlign: 'center', paddingTop: 6 }}>
      {dish ? <Link href={`/dish/${dish.id}` as '/'}>{orb}</Link> : orb}
    </div>
  )
}
