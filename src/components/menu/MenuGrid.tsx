import type { Dish, Locale } from '@/types/menu.types'
import GCard from './GCard'
import Reveal from '@/components/primitives/Reveal'

interface Props { dishes: Dish[]; locale: Locale }

export default function MenuGrid({ dishes, locale }: Props) {
  return (
    <div style={{ padding: '8px 20px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      {dishes.map((d, i) => (
        <Reveal key={d.id} delay={i % 2 * 70}>
          <GCard dish={d} locale={locale} />
        </Reveal>
      ))}
    </div>
  )
}
