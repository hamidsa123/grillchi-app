'use client'
import { useState } from 'react'
import { useRouter } from '@/i18n/navigation'

export default function LoginPage() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const router = useRouter()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')

    const res = await fetch('/api/auth/login', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password }),
    })

    if (res.ok) {
      router.push('/admin' as '/')
    } else {
      const body = await res.json() as { error?: string }
      setError(body.error ?? 'Login failed')
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0c1c14', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 380, background: '#14291f', border: '1px solid var(--hairline)', borderRadius: 24, padding: 32 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--cream-bright)', marginBottom: 8 }}>GRILLCHI</div>
        <div style={{ fontSize: 13, color: 'var(--cream-50)', marginBottom: 32 }}>Admin Dashboard</div>
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--cream-50)', display: 'block', marginBottom: 8 }}>EMAIL</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 12, padding: '12px 16px', color: 'var(--cream)', fontFamily: 'var(--font-body)', fontSize: 15, outline: 'none' }} />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--cream-50)', display: 'block', marginBottom: 8 }}>PASSWORD</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', background: 'var(--surface)', border: '1px solid var(--hairline)', borderRadius: 12, padding: '12px 16px', color: 'var(--cream)', fontFamily: 'var(--font-body)', fontSize: 15, outline: 'none' }} />
          </div>
          {error && (
            <div style={{ fontSize: 13, color: '#d9967a', background: 'rgba(201,96,63,0.1)', border: '1px solid rgba(201,96,63,0.3)', borderRadius: 10, padding: '10px 14px' }}>
              {error}
            </div>
          )}
          <button type="submit" disabled={loading} style={{ marginTop: 8, height: 50, borderRadius: 999, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', background: loading ? 'var(--cream-30)' : 'var(--cream)', color: '#10231a', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 15 }}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
