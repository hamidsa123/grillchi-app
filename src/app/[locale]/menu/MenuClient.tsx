'use client'
import type { Dish, Category, Branch, Locale } from '@/types/menu.types'
import { catName, dishName } from '@/types/menu.types'
import { digits } from '@/lib/utils/digits'
import TopBar from '@/components/layout/TopBar'
import BottomNav from '@/components/layout/BottomNav'
import LangSheet from '@/components/sheets/LangSheet'
import BranchSheet from '@/components/sheets/BranchSheet'
import Toast from '@/components/primitives/Toast'
import MenuGrid from '@/components/menu/MenuGrid'
import PathIcon from '@/components/primitives/PathIcon'
import Ic from '@/components/primitives/Ic'
import { useMenuStore } from '@/store/useMenuStore'
import { useRouter } from '@/i18n/navigation'

const T = {
  allDishes:  { en: 'All dishes', fa: 'همه غذاها', ar: 'كل الأصناف' },
  inThisCat:  { en: 'dishes in this category', fa: 'غذا در این دسته', ar: 'صنف في هذه الفئة' },
  brandName:  { en: 'GRILLCHI', fa: 'گریلچی', ar: 'غريلتشي' },
}
const t = (obj: Record<Locale, string>, locale: Locale) => obj[locale]

interface Props {
  locale: Locale
  dishes: Dish[]
  categories: Category[]
  branches: Branch[]
  activeCat: string
}

export default function MenuClient({ locale, dishes, categories, branches, activeCat }: Props) {
  const router = useRouter()
  const { branchId, setBranchId, sheet, openSheet, closeSheet } = useMenuStore()
  const branch = branches.find(b => b.id === branchId) ?? branches[0]
  const isRtl = locale !== 'en'

  const list = activeCat === 'all' ? dishes : dishes.filter(d => d.category_id === activeCat)
  const cat = categories.find(c => c.id === activeCat)
  const title = activeCat === 'all' ? t(T.allDishes, locale) : catName(cat!, locale)

  return (
    <div className="app-bg" style={{ minHeight: '100svh' }}>
      <div className="screen-enter">
        {/* Sticky category nav strip */}
        <div style={{ position: 'sticky', top: 0, zIndex: 30, display: 'flex', gap: 8, overflowX: 'auto', padding: '54px 20px 12px', background: 'linear-gradient(180deg, #10231a 60%, rgba(16,35,26,0))', scrollbarWidth: 'none' }}>
          <button style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--surface)', border: '1px solid var(--hairline)', color: 'var(--cream)', display: 'grid', placeItems: 'center', cursor: 'pointer', flex: '0 0 42px' }} onClick={() => router.push('/')}>
            <Ic name="back" size={20} sw={2.2} className={isRtl ? 'rtl-flip' : undefined} />
          </button>
          <button className={`catpill ${activeCat === 'all' ? 'active' : ''}`} onClick={() => router.push('/menu')}>
            <span className="ci"><Ic name="grid" size={18} sw={1.8} /></span>
            {t(T.allDishes, locale)}
          </button>
          {categories.map(c => (
            <button key={c.id} className={`catpill ${activeCat === c.id ? 'active' : ''}`} onClick={() => router.push(`/menu/${c.id}` as '/')}>
              <span className="ci"><PathIcon d={c.icon_paths} size={19} /></span>
              {catName(c, locale)}
            </button>
          ))}
        </div>

        {/* Category hero */}
        <div style={{ padding: '16px 20px 6px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 40, lineHeight: 1, color: 'var(--cream-bright)', margin: '18px 0 0' }}>{title}</h1>
          <div style={{ fontSize: 13, color: 'var(--cream-50)', marginTop: 10 }}>
            {digits(list.length, locale)} {t(T.inThisCat, locale)}
          </div>
        </div>

        <main className="screen-pad">
          <MenuGrid dishes={list} locale={locale} />
          <div style={{ height: 30 }} />
        </main>
      </div>

      <BottomNav locale={locale} active="menu" onBranch={() => openSheet('branch')} />
      {sheet === 'lang' && <LangSheet locale={locale} onClose={closeSheet} />}
      {sheet === 'branch' && <BranchSheet locale={locale} branches={branches} branchId={branchId} onPick={setBranchId} onClose={closeSheet} />}
      <Toast />
    </div>
  )
}
