import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const COOKIE = 'gc_session'
const EXPIRY = '7d'

function secret() {
  const s = process.env.AUTH_SECRET
  if (!s) throw new Error('AUTH_SECRET env var is not set')
  return new TextEncoder().encode(s)
}

export async function createSession(): Promise<void> {
  const token = await new SignJWT({ admin: true })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(EXPIRY)
    .sign(secret())

  const store = await cookies()
  store.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  })
}

export async function verifySession(): Promise<boolean> {
  try {
    const store = await cookies()
    const token = store.get(COOKIE)?.value
    if (!token) return false
    await jwtVerify(token, secret())
    return true
  } catch {
    return false
  }
}

export async function destroySession(): Promise<void> {
  const store = await cookies()
  store.delete(COOKIE)
}
