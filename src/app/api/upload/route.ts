import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs/promises'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const uploadsDir = () => path.resolve(/* turbopackIgnore: true */ process.env.UPLOADS_DIR ?? '/uploads')

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file     = formData.get('file') as File | null
  const filePath = formData.get('path') as string | null

  if (!file || !filePath) {
    return NextResponse.json({ error: 'file and path are required' }, { status: 400 })
  }

  // Strip leading slashes then resolve; guard against traversal
  const rel      = filePath.replace(/^\/+/, '')
  const base     = uploadsDir()
  const fullPath = path.resolve(/* turbopackIgnore: true */ base, rel)
  if (!fullPath.startsWith(base + path.sep) && fullPath !== base) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
  }

  await fs.mkdir(path.dirname(fullPath), { recursive: true })
  const bytes = await file.arrayBuffer()
  await fs.writeFile(fullPath, Buffer.from(bytes))

  return NextResponse.json({ url: `/api/img/${rel}` })
}
