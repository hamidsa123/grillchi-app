import { NextRequest } from 'next/server'
import path from 'path'
import fs from 'fs/promises'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MIME: Record<string, string> = {
  jpg:  'image/jpeg',
  jpeg: 'image/jpeg',
  png:  'image/png',
  webp: 'image/webp',
  gif:  'image/gif',
  avif: 'image/avif',
}

const uploadsDir = () => path.resolve(/* turbopackIgnore: true */ process.env.UPLOADS_DIR ?? '/uploads')

export async function GET(
  _req: NextRequest,
  ctx: { params: Promise<{ path: string[] }> },
) {
  const segments = (await ctx.params).path
  const base     = uploadsDir()
  const fullPath = path.resolve(/* turbopackIgnore: true */ base, segments.join('/'))

  // Path traversal guard
  if (!fullPath.startsWith(base + path.sep) && fullPath !== base) {
    return new Response('Forbidden', { status: 403 })
  }

  try {
    const data        = await fs.readFile(fullPath)
    const ext         = path.extname(fullPath).slice(1).toLowerCase()
    const contentType = MIME[ext] ?? 'application/octet-stream'
    return new Response(data, {
      headers: {
        'Content-Type':  contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch {
    return new Response('Not found', { status: 404 })
  }
}
