import type { Locale } from '@/types/menu.types'
import { formatPrice } from '@/lib/utils/digits'

const CURR: Record<Locale, string> = { en: 'Toman', fa: 'تومان', ar: 'تومان' }

interface Props { value: number; locale: Locale; big?: boolean }

export default function PriceDisplay({ value, locale, big }: Props) {
  return (
    <span className="price-display" style={big ? { fontSize: 26 } : undefined}>
      {formatPrice(value, locale)}
      <span className="price-cur">{CURR[locale]}</span>
    </span>
  )
}
