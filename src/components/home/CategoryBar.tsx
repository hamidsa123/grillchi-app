'use client'
import type { Category, Locale } from '@/types/menu.types'
import { catName } from '@/types/menu.types'
import { useRouter } from '@/i18n/navigation'
import PathIcon from '@/components/primitives/PathIcon'
import Ic from '@/components/primitives/Ic'

const ALL_LABEL: Record<Locale, string> = { en: 'All dishes', fa: 'همه غذاها', ar: 'كل الأصناف' }

interface Props {
  locale: Locale
  categories: Category[]
  active?: string
  sticky?: boolean
}

export default function CategoryBar({ locale, categories, active, sticky = true }: Props) {
  const router = useRouter()
  const pick = (id: string) => router.push(id === 'all' ? '/menu' : `/menu/${id}` as '/')

  return (
    <div style={sticky ? { position: 'sticky', top: 96, zIndex: 35, padding: '10px 0', marginTop: 28 } : { marginTop: 8 }}>
      <div style={{ display: 'flex', gap: 9, overflowX: 'auto', padding: '4px 20px', scrollbarWidth: 'none', scrollSnapType: 'x proximity' }}>
        <button className={`catpill ${active === 'all' ? 'active' : ''}`} onClick={() => pick('all')}>
          <span className="ci"><Ic name="grid" size={18} sw={1.8} /></span>
          {ALL_LABEL[locale]}
        </button>
        {categories.map(c => (
          <button key={c.id} className={`catpill ${active === c.id ? 'active' : ''}`} onClick={() => pick(c.id)}>
            <span className="ci"><PathIcon d={c.icon_paths} size={19} /></span>
            {catName(c, locale)}
          </button>
        ))}
      </div>
    </div>
  )
}
