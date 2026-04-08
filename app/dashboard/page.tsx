'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import { formatCredits, formatDate, truncate } from '@/lib/utils'
import { PLANS, type Profile, type TtsGeneration } from '@/lib/supabase'
import {
  Zap, Coins, Mic2, BarChart3, History, Settings,
  CreditCard, Crown, ArrowUpRight, LogOut, User
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [generations, setGenerations] = useState<TtsGeneration[]>([])
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'overview' | 'history' | 'billing'>('overview')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    const res = await fetch('/api/credits')
    if (!res.ok) { router.push('/login'); return }
    const data = await res.json()
    setProfile(data.profile)
    setGenerations(data.generations || [])
    setTransactions(data.transactions || [])
    setLoading(false)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    toast.success('Signed out!')
  }

  if (loading) return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const planColor = PLANS[profile?.plan || 'free'].color
  const planName = PLANS[profile?.plan || 'free'].name

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
        {/* Welcome */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-white">
              Namaste, {profile?.full_name?.split(' ')[0] || 'there'}! 👋
            </h1>
            <p className="text-white/40 text-sm mt-1">Manage your VoiceFlow account</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/generate" className="btn-gold flex items-center gap-2 text-sm px-5 py-2.5">
              <Zap className="w-4 h-4" /> Generate Voice
            </Link>
            <button onClick={handleSignOut} className="btn-ghost flex items-center gap-2 text-sm px-4 py-2.5">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Coins, label: 'Credits Left', value: formatCredits(profile?.credits || 0), color: 'text-gold-400' },
            { icon: Crown, label: 'Current Plan', value: planName, color: 'text-purple-400' },
            { icon: Mic2, label: 'Total Generated', value: `${generations.length}`, color: 'text-blue-400' },
            { icon: BarChart3, label: 'Chars Processed', value: formatCredits(profile?.total_chars_generated || 0), color: 'text-green-400' },
          ].map(s => (
            <div key={s.label} className="glass rounded-2xl p-5">
              <s.icon className={`w-5 h-5 ${s.color} mb-3`} />
              <p className="text-2xl font-display font-bold text-white">{s.value}</p>
              <p className="text-white/40 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 glass rounded-xl p-1 w-fit mb-6">
          {(['overview', 'history', 'billing'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                tab === t ? 'bg-gold-gradient text-dark-900' : 'text-white/50 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Overview tab */}
        {tab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Plan card */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Your Plan</h3>
                <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: planColor + '20', color: planColor }}>
                  {planName.toUpperCase()}
                </span>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-white/50">Credits used</span>
                  <span className="text-white">{formatCredits((PLANS[profile?.plan || 'free'].credits) - (profile?.credits || 0))}</span>
                </div>
                <div className="h-2 bg-dark-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold-gradient rounded-full transition-all"
                    style={{ width: `${Math.min(100, ((PLANS[profile?.plan || 'free'].credits - (profile?.credits || 0)) / PLANS[profile?.plan || 'free'].credits) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-white/30 mt-1">
                  <span>0</span>
                  <span>{formatCredits(PLANS[profile?.plan || 'free'].credits)} total</span>
                </div>
              </div>
              {profile?.plan === 'free' && (
                <Link href="/pricing" className="btn-gold w-full text-center text-sm py-2.5 flex items-center justify-center gap-2">
                  <Crown className="w-4 h-4" /> Upgrade Plan
                </Link>
              )}
              {profile?.plan_expires_at && (
                <p className="text-white/30 text-xs mt-3 text-center">
                  Plan expires: {formatDate(profile.plan_expires_at)}
                </p>
              )}
            </div>

            {/* Quick actions */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { icon: Zap, label: 'Generate new voice', href: '/generate', color: 'text-gold-400' },
                  { icon: CreditCard, label: 'Buy more credits', href: '/pricing', color: 'text-green-400' },
                  { icon: History, label: 'View generation history', onClick: () => setTab('history'), color: 'text-blue-400' },
                  { icon: User, label: 'Account settings', href: '/dashboard/settings', color: 'text-purple-400' },
                ].map(a => (
                  <Link
                    key={a.label}
                    href={a.href || '#'}
                    onClick={a.onClick}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group"
                  >
                    <a.icon className={`w-5 h-5 ${a.color}`} />
                    <span className="text-white/70 group-hover:text-white text-sm transition-colors">{a.label}</span>
                    <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-white/50 ml-auto transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* History tab */}
        {tab === 'history' && (
          <div className="glass rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5">
              <h3 className="text-white font-semibold">Generation History</h3>
            </div>
            {generations.length === 0 ? (
              <div className="py-16 text-center">
                <Mic2 className="w-10 h-10 text-white/10 mx-auto mb-3" />
                <p className="text-white/30">No generations yet. Create your first voice!</p>
                <Link href="/generate" className="btn-gold inline-flex mt-4 text-sm px-6 py-2.5">Generate Now</Link>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {generations.map(g => (
                  <div key={g.id} className="px-6 py-4 flex items-center gap-4 hover:bg-white/2">
                    <div className="w-9 h-9 rounded-xl bg-dark-700 flex items-center justify-center shrink-0">
                      <Mic2 className="w-4 h-4 text-gold-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white/80 text-sm">{truncate(g.text, 70)}</p>
                      <p className="text-white/30 text-xs mt-0.5">{g.voice_name} · {g.language} · {formatDate(g.created_at)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gold-400 text-sm font-semibold">-{g.credits_used}</p>
                      <p className="text-white/30 text-xs">{g.char_count} chars</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Billing tab */}
        {tab === 'billing' && (
          <div className="space-y-4">
            <div className="glass rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/5">
                <h3 className="text-white font-semibold">Credit Transactions</h3>
              </div>
              {transactions.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-white/30">No transactions yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {transactions.map(t => (
                    <div key={t.id} className="px-6 py-4 flex items-center justify-between">
                      <div>
                        <p className="text-white/80 text-sm">{t.description}</p>
                        <p className="text-white/30 text-xs mt-0.5">{formatDate(t.created_at)}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${t.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {t.amount > 0 ? '+' : ''}{t.amount}
                        </p>
                        <p className="text-white/30 text-xs">Balance: {t.balance_after}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="text-center">
              <Link href="/pricing" className="btn-gold inline-flex items-center gap-2 px-8 py-3">
                <CreditCard className="w-4 h-4" /> Buy More Credits
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
