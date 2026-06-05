import { NextRequest, NextResponse } from 'next/server'
import { compareSync } from 'bcryptjs'
import { createSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { email, password } = (await req.json()) as { email?: string; password?: string }

  if (
    !email ||
    !password ||
    email !== process.env.ADMIN_EMAIL ||
    !process.env.ADMIN_PASSWORD_HASH ||
    !compareSync(password, process.env.ADMIN_PASSWORD_HASH)
  ) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  await createSession()
  return NextResponse.json({ ok: true })
}
