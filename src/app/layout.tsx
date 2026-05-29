import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GRILLCHI — Fire-grilled, beautifully served',
  description: 'Premium charcoal-grilled restaurant. Scan, browse and order from your table.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
