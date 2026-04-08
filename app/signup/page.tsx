'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import toast from 'react-hot-toast'
import { Mic2, Eye, EyeOff, ArrowLeft, Check } from 'lucide-react'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignup = async () => {
    if (!name || !email || !password) return toast.error('Please fill all fields')
    if (password.length < 6) return toast.error('Password must be at least 6 characters')
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } }
    })
    setLoading(false)
    if (error) return toast.error(error.message)

    // Check if session exists (email confirm OFF) or need to confirm
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      toast.success('Account created! 500 free credits added 🎉')
      router.push('/dashboard')
      router.refresh()
    } else {
      toast.success('Check karo apna email — confirmation link aaya hoga!')
    }
  }

  const handleGoogleSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/dashboard` }
    })
    if (error) toast.error(error.message)
  }

  return (
    <div className="min-h-screen bg-dark-900 grid-bg flex items-center justify-center px-4 py-16">
      <div className="orb w-[400px] h-[400px] bg-gold-500/6 top-0 left-1/2 -translate-x-1/2" />
      <div className="w-full max-w-md relative z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-white/40 hover:text-white text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <div className="glass rounded-2xl p-8 border border-white/5">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gold-gradient flex items-center justify-center glow-gold mb-4">
              <Mic2 className="w-6 h-6 text-dark-900" />
            </div>
            <h1 className="font-display text-2xl font-bold text-white">Create Account</h1>
            <p className="text-white/40 text-sm mt-1">Get 500 free credits instantly</p>
          </div>

          {/* Free perks */}
          <div className="glass-gold rounded-xl p-4 mb-6">
            <p className="text-gold-400 text-xs font-semibold mb-2">✨ FREE PLAN INCLUDES</p>
            <div className="grid grid-cols-2 gap-1.5">
              {['500 free credits', '5 AI voices', 'Hindi & English', 'MP3 download'].map(f => (
                <div key={f} className="flex items-center gap-1.5 text-white/60 text-xs">
                  <Check className="w-3 h-3 text-gold-400" /> {f}
                </div>
              ))}
            </div>
          </div>

          {/* Google */}
          <button onClick={handleGoogleSignup} className="w-full glass border border-white/10 rounded-xl py-3 flex items-center justify-center gap-3 text-white/70 hover:text-white hover:border-white/20 transition-all mb-6">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="relative flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-xs">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">Full Name</label>
              <input type="text" className="input-dark" placeholder="Rahul Kumar" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">Email</label>
              <input type="email" className="input-dark" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="text-white/60 text-sm mb-1.5 block">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} className="input-dark pr-12" placeholder="Min. 6 characters" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSignup()} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button onClick={handleSignup} disabled={loading} className="btn-gold w-full py-3.5 text-base disabled:opacity-50">
              {loading ? 'Creating account...' : 'Create Free Account'}
            </button>
          </div>

          <p className="text-center text-white/30 text-xs mt-4">
            By signing up you agree to our <Link href="/terms" className="text-white/50 hover:text-white">Terms</Link> & <Link href="/privacy" className="text-white/50 hover:text-white">Privacy Policy</Link>
          </p>

          <p className="text-center text-white/40 text-sm mt-4">
            Already have an account?{' '}
            <Link href="/login" className="text-gold-400 hover:text-gold-300">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
