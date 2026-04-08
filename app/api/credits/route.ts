import { NextResponse } from 'next/server'
import { createServerSupabaseClient, createAdminSupabaseClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    // ✅ IMPORTANT: await lagana hai
    const supabase = await createServerSupabaseClient()

    // ✅ Get logged-in user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // ✅ Admin client (DB access)
    const admin = createAdminSupabaseClient()

    // ✅ Fetch credits from DB (table name adjust kar sakta hai)
    const { data, error } = await admin
      .from('users') // ⚠️ ensure table name correct hai
      .select('credits')
      .eq('id', user.id)
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to fetch credits' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      credits: data?.credits || 0,
    })
  } catch (err) {
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}