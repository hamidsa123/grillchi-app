export type Locale = 'en' | 'fa' | 'ar'

export interface I18nText {
  en: string
  fa: string
  ar: string
}

export interface Branch {
  id: string
  open: boolean
  hours: string
  sort_order: number
  name_en: string; name_fa: string; name_ar: string
  city_en: string; city_fa: string; city_ar: string
  dist_en: string; dist_fa: string; dist_ar: string
}

export interface Category {
  id: string
  icon_paths: string
  sort_order: number
  name_en: string; name_fa: string; name_ar: string
}

export interface Dish {
  id: string
  category_id: string
  price: number
  featured: boolean
  trending: boolean
  kcal: number | null
  mins: number | null
  hot: number
  available: boolean
  sort_order: number
  image_url: string | null
  name_en: string; name_fa: string; name_ar: string
  desc_en: string | null; desc_fa: string | null; desc_ar: string | null
  ing_en: string[]; ing_fa: string[]; ing_ar: string[]
  tags: string[]
}

export interface Promo {
  id: string
  dish_id: string | null
  sort_order: number
  active: boolean
  gradient_class: string
  kicker_en: string; kicker_fa: string; kicker_ar: string
  title_en: string; title_fa: string; title_ar: string
  cta_en: string; cta_fa: string; cta_ar: string
}

export interface BrandSettings {
  id: number
  logo_url: string | null
  name_en: string; name_fa: string; name_ar: string
  tagline_en: string; tagline_fa: string; tagline_ar: string
  accent_color: string
}

export function tr<T extends Record<string, string>>(obj: T | null | undefined, locale: Locale): string {
  if (!obj) return ''
  return obj[locale] ?? obj['en'] ?? ''
}

export function dishName(d: Dish, locale: Locale) {
  return locale === 'fa' ? d.name_fa : locale === 'ar' ? d.name_ar : d.name_en
}
export function dishDesc(d: Dish, locale: Locale) {
  return locale === 'fa' ? d.desc_fa : locale === 'ar' ? d.desc_ar : d.desc_en
}
export function dishIng(d: Dish, locale: Locale): string[] {
  return locale === 'fa' ? d.ing_fa : locale === 'ar' ? d.ing_ar : d.ing_en
}
export function catName(c: Category, locale: Locale) {
  return locale === 'fa' ? c.name_fa : locale === 'ar' ? c.name_ar : c.name_en
}
export function branchArea(b: Branch, locale: Locale) {
  return locale === 'fa' ? b.name_fa : locale === 'ar' ? b.name_ar : b.name_en
}
export function branchCity(b: Branch, locale: Locale) {
  return locale === 'fa' ? b.city_fa : locale === 'ar' ? b.city_ar : b.city_en
}
export function branchDist(b: Branch, locale: Locale) {
  return locale === 'fa' ? b.dist_fa : locale === 'ar' ? b.dist_ar : b.dist_en
}
