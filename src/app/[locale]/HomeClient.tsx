'use client'
import { useState } from 'react'
import type { Dish, Category, Branch, Promo, Locale } from '@/types/menu.types'
import { dishName, branchArea } from '@/types/menu.types'
import TopBar from '@/components/layout/TopBar'
import BottomNav from '@/components/layout/BottomNav'
import LangSheet from '@/components/sheets/LangSheet'
import BranchSheet from '@/components/sheets/BranchSheet'
import Toast from '@/components/primitives/Toast'
import CategoryBar from '@/components/home/CategoryBar'
import HeroSerpentine from '@/components/home/HeroSerpentine'
import PromoCarousel from '@/components/home/PromoCarousel'
import FeatureCard from '@/components/cards/FeatureCard'
import TrendRow from '@/components/cards/TrendRow'
import Reveal from '@/components/primitives/Reveal'
import Ic from '@/components/primitives/Ic'
import { useMenuStore } from '@/store/useMenuStore'
import { useRouter } from '@/i18n/navigation'

const T = {
  tagline:  { en: 'Fire-grilled, beautifully served', fa: 'غذای اصیل، روی آتش', ar: 'مشويات على الفحم، بإتقان' },
  ourMenu:  { en: 'Explore the', fa: 'منوی', ar: 'تصفّح' },
  ourMenu2: { en: 'Menu', fa: 'گریلچی', ar: 'القائمة' },
  heroSub:  { en: 'Charcoal-fired classics, reimagined. Scan, browse and order — right from your table.', fa: 'کلاسیک‌های روی آتش، با نگاهی نو. اسکن کنید، انتخاب کنید و سفارش دهید — از سر میز.', ar: 'كلاسيكيات الفحم بإطلالة جديدة. امسح، تصفّح واطلب — من طاولتك مباشرة.' },
  browse:   { en: 'Browse full menu', fa: 'مشاهده منوی کامل', ar: 'تصفّح القائمة' },
  waiter:   { en: 'Call waiter', fa: 'صدا زدن گارسون', ar: 'نادِ النادل' },
  chefPicks:{ en: "Chef's selection", fa: 'انتخاب سرآشپز', ar: 'اختيار الشيف' },
  featured: { en: 'Featured', fa: 'پیشنهاد ویژه', ar: 'مميزة' },
  trending: { en: 'Trending now', fa: 'پرطرفدارها', ar: 'الأكثر رواجاً' },
  trendSub: { en: 'What everyone is ordering today', fa: 'پرسفارش‌ترین‌های امروز', ar: 'الأكثر طلباً اليوم' },
  seeAll:   { en: 'See all', fa: 'مشاهده همه', ar: 'عرض الكل' },
  brandName:{ en: 'GRILLCHI', fa: 'گریلچی', ar: 'غريلتشي' },
}
const t = (obj: Record<Locale, string>, locale: Locale) => obj[locale]
const isRtlLocale = (locale: Locale) => locale !== 'en'

interface Props {
  locale: Locale
  hero: Dish[]
  featured: Dish[]
  trending: Dish[]
  categories: Category[]
  branches: Branch[]
  promos: Promo[]
  dishesById: Record<string, Dish>
}

export default function HomeClient({ locale, hero, featured, trending, categories, branches, promos, dishesById }: Props) {
  const router = useRouter()
  const { branchId, setBranchId, sheet, openSheet, closeSheet } = useMenuStore()
  const branch = branches.find(b => b.id === branchId) ?? branches[0]

  return (
    <div className="app-bg" style={{ minHeight: '100svh' }}>
      <div className="screen-enter">
        <TopBar locale={locale} brand={t(T.brandName, locale)} branch={branch} onBranch={() => openSheet('branch')} onLang={() => openSheet('lang')} />

        <main className="screen-pad">
          {/* Hero text */}
          <div style={{ padding: '18px 20px 8px' }}>
            <Reveal as="div">
              <div className="eyebrow"><span className="rule" />{t(T.tagline, locale)}</div>
              <h1 className="hero-title">{t(T.ourMenu, locale)} <em>{t(T.ourMenu2, locale)}</em></h1>
              <p style={{ margin: '16px 0 0', maxWidth: '86%', fontSize: 14.5, lineHeight: 1.55, color: 'var(--cream-50)' }}>{t(T.heroSub, locale)}</p>
            </Reveal>
          </div>

          {/* Hero image composition */}
          <HeroSerpentine featured={hero} locale={locale} />

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', margin: '26px 20px 0' }}>
            <button onClick={() => router.push('/menu')} style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14.5, border: 'none', cursor: 'pointer', borderRadius: 999, background: 'var(--cream)', color: '#173324', padding: '15px 26px', display: 'inline-flex', alignItems: 'center', gap: 9, boxShadow: '0 10px 26px rgba(0,0,0,0.35)', transition: 'transform 0.22s var(--ease-spring)' }}>
              <Ic name="utensils" size={18} sw={1.8} />{t(T.browse, locale)}
            </button>
            <button style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14.5, border: '1px solid var(--hairline)', cursor: 'pointer', borderRadius: 999, background: 'transparent', color: 'var(--cream-70)', padding: '15px 18px' }}>
              {t(T.waiter, locale)}
            </button>
          </div>

          {/* Category bar */}
          <CategoryBar locale={locale} categories={categories} sticky={false} />

          {/* Featured */}
          <div style={{ marginTop: 38 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 20px 16px' }}>
              <div>
                <div className="eyebrow" style={{ marginBottom: 8 }}>{t(T.chefPicks, locale)}</div>
                <div className="section-title">{t(T.featured, locale)}</div>
              </div>
              <button onClick={() => router.push('/menu')} style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--sage)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5, background: 'none', border: 'none', fontFamily: 'var(--font-body)' }}>
                {t(T.seeAll, locale)}<Ic name="arrow" size={14} sw={2} className={isRtlLocale(locale) ? 'rtl-flip' : undefined} />
              </button>
            </div>
            <div style={{ display: 'flex', gap: 16, overflowX: 'auto', padding: '4px 20px 8px', scrollbarWidth: 'none', scrollSnapType: 'x mandatory' }}>
              {featured.map(d => <FeatureCard key={d.id} dish={d} locale={locale} />)}
            </div>
          </div>

          {/* Trending */}
          <div style={{ marginTop: 38 }}>
            <div style={{ padding: '0 20px 16px' }}>
              <div className="section-title"><em>{t(T.trending, locale)}</em></div>
              <div style={{ fontSize: 13, color: 'var(--cream-50)', marginTop: 6 }}>{t(T.trendSub, locale)}</div>
            </div>
            <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {trending.map((d, i) => (
                <Reveal key={d.id} delay={i * 60}>
                  <TrendRow dish={d} rank={i + 1} locale={locale} />
                </Reveal>
              ))}
            </div>
          </div>

          {/* Promos */}
          <PromoCarousel promos={promos} dishesById={dishesById} locale={locale} />
          <div style={{ height: 30 }} />
        </main>
      </div>

      <BottomNav locale={locale} active="home" onBranch={() => openSheet('branch')} />
      {sheet === 'lang' && <LangSheet locale={locale} onClose={closeSheet} />}
      {sheet === 'branch' && <BranchSheet locale={locale} branches={branches} branchId={branchId} onPick={setBranchId} onClose={closeSheet} />}
      <Toast />
    </div>
  )
}
