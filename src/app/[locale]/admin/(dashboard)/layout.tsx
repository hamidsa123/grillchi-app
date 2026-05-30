import { redirect } from 'next/navigation'
import AdminShell from '../AdminShell'

export default async function DashboardLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params

  // Skip auth check if Supabase env vars are not configured (e.g. preview deploy)
  if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect(`/${locale}/admin/login`)
  }

  return <AdminShell locale={locale}>{children}</AdminShell>
}
