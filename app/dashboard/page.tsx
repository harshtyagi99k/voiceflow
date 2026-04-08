'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import Link from 'next/link'
import { formatCredits, formatDate, truncate } from '@/lib/utils'
import { PLANS, type Profile, type TtsGeneration } from '@/lib/supabase'
import {
  Zap, Coins, Mic2, BarChart3, History,
  CreditCard, Crown, ArrowUpRight, LogOut
} from 'lucide-react'

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [generations, setGenerations] = useState<TtsGeneration[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'overview' | 'history' | 'billing'>('overview')

  const supabase = createClient()

  useEffect(() => {
    const checkAndLoad = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        window.location.href = '/login'
        return
      }

      const res = await fetch('/api/credits')

      if (!res.ok) {
        window.location.href = '/login'
        return
      }

      const data = await res.json()

      setProfile(data.profile)
      setGenerations(data.generations || [])
      setTransactions(data.transactions || [])
      setLoading(false)
    }

    checkAndLoad()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    )
  }

  const currentPlan = PLANS[profile?.plan ?? 'free']

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-6">

        <h1 className="text-2xl font-bold mb-4">
          Dashboard
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>Credits: {profile?.credits ?? 0}</div>
          <div>Plan: {currentPlan.name}</div>
          <div>Total: {generations.length}</div>
          <div>Chars: {profile?.total_chars_generated ?? 0}</div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {(['overview', 'history', 'billing'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}>
              {t}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div>
            <Link href="/generate">Generate</Link>
            <br />
            <Link href="/pricing">Buy Credits</Link>
          </div>
        )}

        {/* History */}
        {tab === 'history' && (
          <div>
            {generations.map(g => (
              <div key={g.id}>
                {truncate(g.text, 30)} - {g.credits_used}
              </div>
            ))}
          </div>
        )}

        {/* Billing */}
        {tab === 'billing' && (
          <div>
            {transactions.map(t => (
              <div key={t.id}>
                {t.description} - {t.amount}
              </div>
            ))}
          </div>
        )}

        <button onClick={handleSignOut} className="mt-6">
          Logout
        </button>

      </div>
    </div>
  )
}