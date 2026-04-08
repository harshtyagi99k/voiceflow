import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/supabase-server'
import { createServerSupabaseClient } from '@/lib/supabase-server'
import { generateSpeech } from '@/lib/tts'
import { VOICES } from '@/lib/voices'
import { calcCredits } from '@/lib/supabase'

export const maxDuration = 30

export async function POST(request: NextRequest) {
  try {
    // Auth check
    const supabase = createServerSupabaseClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { text, voiceId, rate = '+0%', pitch = '+0Hz' } = body

    if (!text || !voiceId) {
      return NextResponse.json({ error: 'text and voiceId are required' }, { status: 400 })
    }

    const cleanText = text.trim()
    if (cleanText.length === 0) return NextResponse.json({ error: 'Text is empty' }, { status: 400 })
    if (cleanText.length > 10000) return NextResponse.json({ error: 'Text too long (max 10000 chars)' }, { status: 400 })

    // Validate voice
    const voice = VOICES.find(v => v.id === voiceId)
    if (!voice) return NextResponse.json({ error: 'Invalid voice' }, { status: 400 })

    // Get user profile with credits
    const admin = createAdminSupabaseClient()
    const { data: profile, error: profileError } = await admin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Check plan limits
    const planLimits: Record<string, number> = {
      free: 500, starter: 2000, pro: 5000, unlimited: 10000
    }
    const maxChars = planLimits[profile.plan] || 500
    if (cleanText.length > maxChars) {
      return NextResponse.json({
        error: `Your ${profile.plan} plan allows max ${maxChars} characters per generation. Upgrade to generate longer texts.`
      }, { status: 403 })
    }

    // Calculate credits
    const creditsRequired = calcCredits(cleanText.length)
    if (profile.credits < creditsRequired) {
      return NextResponse.json({
        error: `Not enough credits. You need ${creditsRequired} credits but have ${profile.credits}. Please recharge.`
      }, { status: 402 })
    }

    // Generate speech
    const audioBuffer = await generateSpeech(cleanText, { voice: voiceId, rate, pitch })

    // Deduct credits
    const newCredits = profile.credits - creditsRequired
    await admin.from('profiles').update({
      credits: newCredits,
      total_chars_generated: (profile.total_chars_generated || 0) + cleanText.length
    }).eq('id', user.id)

    // Log transaction
    await admin.from('credit_transactions').insert({
      user_id: user.id,
      amount: -creditsRequired,
      balance_after: newCredits,
      type: 'usage',
      description: `TTS: "${cleanText.slice(0, 50)}..." (${cleanText.length} chars, ${voice.name})`
    })

    // Log generation
    await admin.from('tts_generations').insert({
      user_id: user.id,
      text: cleanText.slice(0, 500),
      voice_name: voice.name,
      language: voice.lang,
      char_count: cleanText.length,
      credits_used: creditsRequired,
      status: 'completed'
    })

    // Return audio as base64
    const base64Audio = audioBuffer.toString('base64')

    return NextResponse.json({
      success: true,
      audio: base64Audio,
      creditsUsed: creditsRequired,
      creditsRemaining: newCredits,
      duration: Math.ceil(cleanText.length / 15), // rough seconds estimate
    })

  } catch (error: any) {
    console.error('TTS Error:', error)
    return NextResponse.json({ error: 'Failed to generate speech. Please try again.' }, { status: 500 })
  }
}
