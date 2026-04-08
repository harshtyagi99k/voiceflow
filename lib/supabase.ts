import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export type Profile = {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  credits: number
  plan: 'free' | 'starter' | 'pro' | 'unlimited'
  plan_expires_at: string | null
  total_chars_generated: number
  is_admin: boolean
  created_at: string
}

export type PaymentRequest = {
  id: string
  user_id: string
  plan: string
  amount: number
  utr_number: string | null
  screenshot_url: string | null
  status: 'pending' | 'approved' | 'rejected'
  admin_note: string | null
  credits_to_add: number
  created_at: string
}

export type TtsGeneration = {
  id: string
  user_id: string
  text: string
  voice_name: string
  language: string
  char_count: number
  credits_used: number
  audio_url: string | null
  status: string
  created_at: string
}

export const PLANS = {
  free: { name: 'Free', price: 0, credits: 500, color: '#888' },
  starter: { name: 'Starter', price: 99, credits: 5000, color: '#f5c842' },
  pro: { name: 'Pro', price: 249, credits: 15000, color: '#4f8ef7' },
  unlimited: { name: 'Unlimited', price: 499, credits: 50000, color: '#a855f7' },
}

// Credits cost: 1 credit = 2 characters
export const CREDITS_PER_CHAR = 0.5
export function calcCredits(chars: number) {
  return Math.max(1, Math.ceil(chars * CREDITS_PER_CHAR))
}
