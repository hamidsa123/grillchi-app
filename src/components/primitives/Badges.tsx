import type { Locale } from '@/types/menu.types'

const BADGE_LABELS: Record<string, Record<Locale, string>> = {
  popular: { en: 'Popular', fa: 'محبوب', ar: 'مميز' },
  new:     { en: 'New',     fa: 'جدید',  ar: 'جديد' },
  spicy:   { en: 'Spicy',   fa: 'تند',   ar: 'حار' },
  veg:     { en: 'Veg',     fa: 'گیاهی', ar: 'نباتي' },
}

interface Props { tags: string[]; locale: Locale }

export default function Badges({ tags, locale }: Props) {
  if (!tags?.length) return null
  return (
    <>
      {tags.map(tag => (
        <span key={tag} className={`badge badge-${tag}`}>
          {BADGE_LABELS[tag]?.[locale] ?? tag}
        </span>
      ))}
    </>
  )
}
