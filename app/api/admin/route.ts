import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase-server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

function verifyAdminSecret(request: NextRequest) {
  const secret = request.headers.get('x-admin-secret')
  return secret === process.env.ADMIN_SECRET
}

// GET all pending payments
export async function GET(request: NextRequest) {
  if (!verifyAdminSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createAdminSupabaseClient()
  const { status } = Object.fromEntries(new URL(request.url).searchParams)

  let query = admin
    .from('payment_requests')
    .select('*, profiles(email, full_name, credits, plan)')
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ data })
}

// POST - approve or reject a payment
export async function POST(request: NextRequest) {
  if (!verifyAdminSecret(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { paymentId, action, adminNote } = body // action: 'approve' | 'reject'

  if (!paymentId || !action) {
    return NextResponse.json({ error: 'paymentId and action required' }, { status: 400 })
  }

  const admin = createAdminSupabaseClient()

  // Get payment request
  const { data: payment, error: fetchError } = await admin
    .from('payment_requests')
    .select('*')
    .eq('id', paymentId)
    .single()

  if (fetchError || !payment) {
    return NextResponse.json({ error: 'Payment not found' }, { status: 404 })
  }

  if (payment.status !== 'pending') {
    return NextResponse.json({ error: 'Payment already processed' }, { status: 400 })
  }

  if (action === 'approve') {
    // Get current user credits
    const { data: profile } = await admin
      .from('profiles')
      .select('credits')
      .eq('id', payment.user_id)
      .single()

    const newCredits = (profile?.credits || 0) + payment.credits_to_add

    // Update user credits and plan
    await admin.from('profiles').update({
      credits: newCredits,
      plan: payment.plan,
      plan_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
    }).eq('id', payment.user_id)

    // Log transaction
    await admin.from('credit_transactions').insert({
      user_id: payment.user_id,
      amount: payment.credits_to_add,
      balance_after: newCredits,
      type: 'purchase',
      description: `${payment.plan} plan purchase - ₹${payment.amount}`,
      reference_id: paymentId
    })

    // Update payment status
    await admin.from('payment_requests').update({
      status: 'approved',
      admin_note: adminNote || 'Payment verified',
      approved_at: new Date().toISOString()
    }).eq('id', paymentId)

    return NextResponse.json({
      success: true,
      message: `Approved! Added ${payment.credits_to_add} credits to user.`
    })
  }

  if (action === 'reject') {
    await admin.from('payment_requests').update({
      status: 'rejected',
      admin_note: adminNote || 'Payment not verified'
    }).eq('id', paymentId)

    return NextResponse.json({ success: true, message: 'Payment rejected.' })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
