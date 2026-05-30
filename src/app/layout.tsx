import type { ReactNode } from 'react'
import type { Locale } from '@/types/menu.types'
import { Bodoni_Moda, Plus_Jakarta_Sans, Vazirmatn } from 'next/font/google'
import { getLocale } from 'next-intl/server'
import './globals.css'

const bodoni    = Bodoni_Moda({ subsets: ['latin'], variable: '--font-bodoni', display: 'swap', style: ['normal', 'italic'], weight: ['400', '600', '700'] })
const jakarta   = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', display: 'swap', weight: ['400', '500', '600', '700'] })
const vazirmatn = Vazirmatn({ subsets: ['arabic'], variable: '--font-vazirmatn', display: 'swap', weight: ['400', '500', '600', '700', '800'] })

const DIR: Record<Locale, 'ltr' | 'rtl'> = { en: 'ltr', fa: 'rtl', ar: 'rtl' }

export const metadata = {
  title: 'GRILLCHI — Fire-grilled, beautifully served',
  description: 'Premium charcoal-grilled restaurant. Scan, browse and order from your table.',
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  let locale: Locale = 'en'
  try { locale = (await getLocale()) as Locale } catch {}
  const dir = DIR[locale] ?? 'ltr'

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${bodoni.variable} ${jakarta.variable} ${vazirmatn.variable}`}
      suppressHydrationWarning
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <style>{`
          :root {
            --font-display: ${locale === 'en' ? 'var(--font-bodoni), Georgia, serif' : 'var(--font-vazirmatn), system-ui, sans-serif'};
            --font-body:    ${locale === 'en' ? 'var(--font-jakarta), system-ui, sans-serif' : 'var(--font-vazirmatn), system-ui, sans-serif'};
          }
        `}</style>
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
