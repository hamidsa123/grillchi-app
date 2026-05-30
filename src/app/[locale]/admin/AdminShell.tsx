'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Ic from '@/components/primitives/Ic'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from '@/i18n/navigation'

const NAV = [
  { href: '/admin',            icon: 'dashboard', label: 'Dashboard' },
  { href: '/admin/dishes',     icon: 'utensils',  label: 'Dishes' },
  { href: '/admin/categories', icon: 'grid',      label: 'Categories' },
  { href: '/admin/branches',   icon: 'pin',       label: 'Branches' },
  { href: '/admin/promos',     icon: 'star',      label: 'Promos' },
]

export default function AdminShell({ children, locale }: { children: React.ReactNode; locale: string }) {
  const pathname = usePathname()
  const router = useRouter()

  const logout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login' as '/')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100svh', background: '#0c1c14', fontFamily: 'var(--font-body)', color: 'var(--cream)' }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: '#10231a', borderInlineEnd: '1px solid var(--hairline)', display: 'flex', flexDirection: 'column', padding: '24px 0', flexShrink: 0 }}>
        <div style={{ padding: '0 20px 24px', fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--cream-bright)', borderBottom: '1px solid var(--hairline)' }}>
          GRILLCHI <span style={{ fontSize: 11, fontWeight: 400, color: 'var(--cream-50)', display: 'block', marginTop: 2 }}>Admin Panel</span>
        </div>
        <nav style={{ padding: '16px 12px', flex: 1 }}>
          {NAV.map(item => {
            const active = pathname.endsWith(item.href) || (item.href !== '/admin' && pathname.includes(item.href))
            return (
              <Link key={item.href} href={(`/${locale}` + item.href) as '/'} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, marginBottom: 4, background: active ? 'var(--sage-soft)' : 'transparent', color: active ? 'var(--sage)' : 'var(--cream-50)', textDecoration: 'none', fontSize: 14, fontWeight: 500, transition: 'all 0.2s' }}>
                <Ic name={item.icon} size={18} sw={1.8} />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div style={{ padding: '16px 12px', borderTop: '1px solid var(--hairline)' }}>
          <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', width: '100%', background: 'none', border: 'none', color: 'var(--cream-50)', cursor: 'pointer', fontSize: 14, fontWeight: 500, borderRadius: 12 }}>
            <Ic name="logout" size={18} sw={1.8} />Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflowY: 'auto', padding: 32 }}>
        {children}
      </main>
    </div>
  )
}
