'use client'
import type { Dish, Branch, Locale } from '@/types/menu.types'
import { dishName, dishDesc, dishIng } from '@/types/menu.types'
import { digits } from '@/lib/utils/digits'
import Image from 'next/image'
import Badges from '@/components/primitives/Badges'
import Spice from '@/components/primitives/Spice'
import Ic from '@/components/primitives/Ic'
import Toast from '@/components/primitives/Toast'
import { useRouter } from '@/i18n/navigation'

const T = {
  energy:     { en: 'Energy', fa: 'انرژی', ar: 'الطاقة' },
  kcal:       { en: 'kcal', fa: 'کالری', ar: 'سعرة' },
  prep:       { en: 'Prep time', fa: 'زمان آماده‌سازی', ar: 'وقت التحضير' },
  spiceLvl:   { en: 'Spice', fa: 'تندی', ar: 'الحرارة' },
  ingredients:{ en: 'Ingredients', fa: 'مواد تشکیل‌دهنده', ar: 'المكوّنات' },
  mins:       { en: 'min', fa: 'دقیقه', ar: 'دقيقة' },
}
const t = (obj: Record<Locale, string>, locale: Locale) => obj[locale]

interface Props { dish: Dish; locale: Locale; branches: Branch[] }

export default function DishClient({ dish, locale, branches: _ }: Props) {
  const router = useRouter()
  const isRtl = locale !== 'en'

  return (
    <div className="app-bg" style={{ minHeight: '100svh', paddingBottom: 40 }}>
      <div className="screen-enter">
        {/* Hero image */}
        <div style={{ position: 'relative', height: 460 }}>
          {dish.image_url ? (
            <Image src={dish.image_url} alt={dishName(dish, 'en')} fill style={{ objectFit: 'cover' }} sizes="100vw" priority />
          ) : (
            <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1f3b2c, #0c1c14)' }} />
          )}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(10,22,15,0.45) 0%, rgba(10,22,15,0) 28%, rgba(12,28,20,0) 55%, rgba(11,24,17,0.96) 100%)', pointerEvents: 'none' }} />
        </div>

        {/* Floating top bar */}
        <div style={{ position: 'absolute', top: 0, insetInline: 0, zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '54px 20px 0', pointerEvents: 'none' }}>
          <button style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--surface)', border: '1px solid var(--hairline)', color: 'var(--cream)', display: 'grid', placeItems: 'center', cursor: 'pointer', pointerEvents: 'auto', backdropFilter: 'blur(8px)' }} onClick={() => router.back()}>
            <Ic name="back" size={20} sw={2.2} className={isRtl ? 'rtl-flip' : undefined} />
          </button>
          <button style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--surface)', border: '1px solid var(--hairline)', color: 'var(--cream)', display: 'grid', placeItems: 'center', cursor: 'pointer', pointerEvents: 'auto', backdropFilter: 'blur(8px)' }}>
            <Ic name="heart" size={19} sw={1.8} />
          </button>
        </div>

        {/* Detail body */}
        <div style={{ position: 'relative', marginTop: -54, padding: '0 20px', zIndex: 5 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <Badges tags={dish.tags} locale={locale} />
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 38, lineHeight: 1.02, color: 'var(--cream-bright)', margin: 0 }}>
            {dishName(dish, locale)}
          </h1>
          <p style={{ marginTop: 14, fontSize: 14.5, lineHeight: 1.6, color: 'var(--cream-70)' }}>
            {dishDesc(dish, locale)}
          </p>

          {/* Specs */}
          <div style={{ display: 'flex', gap: 12, marginTop: 22 }}>
            {[
              { value: `${digits(dish.kcal ?? 0, locale)}`, label: `${t(T.energy, locale)} · ${t(T.kcal, locale)}` },
              { value: `${digits(dish.mins ?? 0, locale)}′`, label: t(T.prep, locale) },
              { value: null, label: t(T.spiceLvl, locale), spice: true },
            ].map((spec, i) => (
              <div key={i} style={{ flex: 1, padding: '15px 14px', borderRadius: 18, background: 'var(--surface)', border: '1px solid var(--hairline)', textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: spec.spice ? 16 : 20, color: 'var(--cream-bright)', display: 'flex', justifyContent: 'center', alignItems: 'center', height: 25 }}>
                  {spec.spice ? <Spice level={dish.hot} locale={locale} /> : spec.value}
                </div>
                <div style={{ fontSize: 11, color: 'var(--cream-50)', marginTop: 4 }}>{spec.label}</div>
              </div>
            ))}
          </div>

          {/* Ingredients */}
          <div style={{ marginTop: 26 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 18, color: 'var(--cream-bright)', marginBottom: 12 }}>
              {t(T.ingredients, locale)}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {dishIng(dish, locale).map((x, i) => (
                <span key={i} style={{ padding: '9px 14px', borderRadius: 999, background: 'var(--surface)', border: '1px solid var(--hairline)', fontSize: 13, color: 'var(--cream-70)' }}>{x}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Toast />
    </div>
  )
}
