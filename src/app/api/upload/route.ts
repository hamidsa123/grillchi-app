import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!serviceKey || !url) {
    return NextResponse.json({ error: 'SUPABASE_SERVICE_ROLE_KEY not set in Vercel env vars' }, { status: 500 })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const path = formData.get('path') as string | null

  if (!file || !path) {
    return NextResponse.json({ error: 'file and path are required' }, { status: 400 })
  }

  const supabase = createClient(url, serviceKey)
  const bytes = await file.arrayBuffer()
  const { error } = await supabase.storage
    .from('menu-images')
    .upload(path, bytes, { contentType: file.type, upsert: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data } = supabase.storage.from('menu-images').getPublicUrl(path)
  return NextResponse.json({ url: data.publicUrl })
}
