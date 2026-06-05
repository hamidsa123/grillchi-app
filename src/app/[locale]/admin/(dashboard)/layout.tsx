import { redirect } from 'next/navigation'
import { verifySession } from '@/lib/auth'
import AdminShell from '../AdminShell'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const ok = await verifySession()
  if (!ok) redirect(`/${locale}/admin/login`)
  return <AdminShell locale={locale}>{children}</AdminShell>
}
