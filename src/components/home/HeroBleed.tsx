'use client'
import type { Dish, Locale } from '@/types/menu.types'
import { dishName } from '@/types/menu.types'
import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import PriceDisplay from '@/components/primitives/PriceDisplay'

const CHEF: Record<Locale, string>   = { en: "Chef's selection", fa: 'انتخاب سرآشپز', ar: 'اختيار الشيف' }
const MENU1: Record<Locale, string>  = { en: 'Explore the', fa: 'منوی', ar: 'تصفّح' }
const MENU2: Record<Locale, string>  = { en: 'Menu', fa: 'گریلچی', ar: 'القائمة' }

interface Props { featured: Dish[]; locale: Locale }

export default function HeroBleed({ featured, locale }: Props) {
  const dish = featured[0]
  const content = (
    <div style={{ position: 'relative', margin: '22px 20px 0', height: 440, borderRadius: 26, overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.5)' }}>
      {dish?.image_url ? (
        <Image src={dish.image_url} alt={dishName(dish, 'en')} fill style={{ objectFit: 'cover' }} sizes="(max-width: 500px) 100vw, 500px" priority />
      ) : (
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #1f3b2c, #0c1c14)' }} />
      )}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(12,28,20,0.15) 0%, rgba(12,28,20,0.25) 45%, rgba(10,22,15,0.92) 100%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', insetInline: 24, bottom: 26 }}>
        <div className="eyebrow"><span className="rule" />{CHEF[locale]}</div>
        <h1 className="hero-title" style={{ fontSize: 46, marginTop: 10 }}>{MENU1[locale]} <em>{MENU2[locale]}</em></h1>
        {dish && <div style={{ marginTop: 14 }}><PriceDisplay value={dish.price} locale={locale} big /></div>}
      </div>
    </div>
  )
  return dish ? <Link href={`/dish/${dish.id}` as '/'}>{content}</Link> : content
}
