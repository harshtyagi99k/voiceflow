import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase-server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminSupabaseClient()
  const { data: profile } = await admin
    .from('profiles').select('*').eq('id', user.id).single()

  const { data: transactions } = await admin
    .from('credit_transactions')
    .select('*').eq('user_id', user.id)
    .order('created_at', { ascending: false }).limit(20)

  const { data: generations } = await admin
    .from('tts_generations')
    .select('*').eq('user_id', user.id)
    .order('created_at', { ascending: false }).limit(20)

  return NextResponse.json({ profile, transactions, generations })
}
