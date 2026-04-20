import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function GET() {
  const supabase = createServerClient()

  // Any response (including table-not-found) means the connection is live
  const { error } = await supabase.from('_pgsodium_key').select('id').limit(1)

  const connected = !error || error.message.includes('schema cache') || error.code === 'PGRST116'

  if (!connected) {
    console.error('[health] Supabase connection error:', error)
    return NextResponse.json({ ok: false, error: error!.message }, { status: 500 })
  }

  console.log('[health] Supabase connection OK')
  return NextResponse.json({ ok: true })
}
