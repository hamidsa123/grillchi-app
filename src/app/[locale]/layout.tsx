import type { ReactNode } from 'react'
import type { Locale } from '@/types/menu.types'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Bodoni_Moda, Plus_Jakarta_Sans, Vazirmatn } from 'next/font/google'
import { routing } from '@/i18n/routing'

const bodoni = Bodoni_Moda({ subsets: ['latin'], variable: '--font-bodoni', display: 'swap', style: ['normal', 'italic'], weight: ['400', '600', '700'] })
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta', display: 'swap', weight: ['400', '500', '600', '700'] })
const vazirmatn = Vazirmatn({ subsets: ['arabic'], variable: '--font-vazirmatn', display: 'swap', weight: ['400', '500', '600', '700', '800'] })

const DIR: Record<Locale, 'ltr' | 'rtl'> = { en: 'ltr', fa: 'rtl', ar: 'rtl' }

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }))
}

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!routing.locales.includes(locale as Locale)) notFound()

  const messages = await getMessages()
  const dir = DIR[locale as Locale]

  return (
    <html lang={locale} dir={dir} className={`${bodoni.variable} ${jakarta.variable} ${vazirmatn.variable}`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <style>{`
          :root {
            --font-display: ${locale === 'en' ? 'var(--font-bodoni), Georgia, serif' : 'var(--font-vazirmatn), system-ui, sans-serif'};
            --font-body: ${locale === 'en' ? 'var(--font-jakarta), system-ui, sans-serif' : 'var(--font-vazirmatn), system-ui, sans-serif'};
          }
        `}</style>
      </head>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
