import { CATEGORIES } from '@/lib/data/static'
import DishForm from '@/components/admin/DishForm'

export default async function NewDishPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <DishForm categories={CATEGORIES} locale={locale} />
}
