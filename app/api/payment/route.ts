import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabaseClient, createServerSupabaseClient } from '@/lib/supabase-server'

const PLAN_CREDITS: Record<string, { credits: number; amount: number }> = {
  starter: { credits: 5000, amount: 99 },
  pro: { credits: 15000, amount: 249 },
  unlimited: { credits: 50000, amount: 499 },
}

export async function POST(request: NextRequest) {
  try {
    // ✅ FIX: await lagaya
    const supabase = await createServerSupabaseClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { plan, utrNumber, screenshotBase64 } = body

    if (!plan || !PLAN_CREDITS[plan]) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    if (!utrNumber && !screenshotBase64) {
      return NextResponse.json(
        { error: 'Please provide UTR number or payment screenshot' },
        { status: 400 }
      )
    }

    const planData = PLAN_CREDITS[plan]
    const admin = createAdminSupabaseClient()

    let screenshotUrl: string | null = null

    // Upload screenshot
    if (screenshotBase64) {
      const base64Data = screenshotBase64.replace(/^data:image\/\w+;base64,/, '')
      const buffer = Buffer.from(base64Data, 'base64')
      const fileName = `${user.id}/${Date.now()}.jpg`

      const { data: uploadData, error: uploadError } = await admin.storage
        .from('payment-screenshots')
        .upload(fileName, buffer, { contentType: 'image/jpeg' })

      if (!uploadError && uploadData) {
        const { data: { publicUrl } } = admin.storage
          .from('payment-screenshots')
          .getPublicUrl(fileName)

        screenshotUrl = publicUrl
      }
    }

    // Insert request
    const { data: paymentRequest, error } = await admin
      .from('payment_requests')
      .insert({
        user_id: user.id,
        plan,
        amount: planData.amount,
        utr_number: utrNumber || null,
        screenshot_url: screenshotUrl,
        status: 'pending',
        credits_to_add: planData.credits,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Payment request submitted! Credits will be added after verification.',
      requestId: paymentRequest.id,
    })

  } catch (error: any) {
    console.error('Payment error:', error)
    return NextResponse.json(
      { error: 'Failed to submit payment request' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  // ✅ FIX: await lagaya
  const supabase = await createServerSupabaseClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createAdminSupabaseClient()

  const { data } = await admin
    .from('payment_requests')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return NextResponse.json({ data })
}