import type { Locale } from '@/types/menu.types'

const FA = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹']
const AR = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩']

export function digits(str: string | number, locale: Locale): string {
  const s = String(str)
  if (locale === 'fa') return s.replace(/[0-9]/g, d => FA[+d])
  if (locale === 'ar') return s.replace(/[0-9]/g, d => AR[+d])
  return s
}

export function formatPrice(thousands: number, locale: Locale): string {
  const full = thousands * 1000
  const sep = full.toLocaleString('en-US')
  return digits(sep, locale)
}
