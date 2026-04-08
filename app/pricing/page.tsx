'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import toast from 'react-hot-toast'
import { Check, Zap, Crown, Star, Upload, QrCode, X, Loader2 } from 'lucide-react'
import Link from 'next/link'

const PLANS = [
  {
    id: 'free', name: 'Free', price: 0, credits: 500, popular: false,
    features: ['500 credits', '5 AI voices', '500 chars/generation', 'Hindi & English only', 'MP3 download'],
    color: '#6b7280', btnText: 'Current Plan', href: '/signup'
  },
  {
    id: 'starter', name: 'Starter', price: 99, credits: 5000, popular: false,
    features: ['5,000 credits', '20 AI voices', '2,000 chars/generation', 'All Indian languages', 'MP3 download', 'Email support'],
    color: '#f5c842', btnText: 'Buy Starter', href: null
  },
  {
    id: 'pro', name: 'Pro', price: 249, credits: 15000, popular: true,
    features: ['15,000 credits', '50 AI voices', '5,000 chars/generation', 'All languages', 'API access', 'Priority support', 'Commercial use'],
    color: '#4f8ef7', btnText: 'Buy Pro', href: null
  },
  {
    id: 'unlimited', name: 'Unlimited', price: 499, credits: 50000, popular: false,
    features: ['50,000 credits', '100+ AI voices', '10,000 chars/generation', 'All languages', 'API access', 'Dedicated support', 'Commercial use', 'Team access'],
    color: '#a855f7', btnText: 'Buy Unlimited', href: null
  },
]

export default function PricingPage() {
  const [user, setUser] = useState<any>(null)
  const [selectedPlan, setSelectedPlan] = useState<typeof PLANS[0] | null>(null)
  const [step, setStep] = useState<'qr' | 'confirm'>('qr')
  const [utr, setUtr] = useState('')
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const upiId = process.env.NEXT_PUBLIC_GPAY_UPI_ID || 'yourname@ybl'
  const upiName = process.env.NEXT_PUBLIC_GPAY_NAME || 'VoiceFlow'

  const handleBuy = (plan: typeof PLANS[0]) => {
    if (!user) { window.location.href = '/signup'; return }
    setSelectedPlan(plan)
    setStep('qr')
    setSubmitted(false)
    setUtr('')
    setScreenshot(null)
  }

  const handleScreenshot = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setScreenshot(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async () => {
    if (!utr && !screenshot) return toast.error('Please enter UTR number or upload screenshot')
    setSubmitting(true)
    try {
      const res = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: selectedPlan?.id,
          utrNumber: utr,
          screenshotBase64: screenshot
        })
      })
      const data = await res.json()
      if (!res.ok) return toast.error(data.error)
      setSubmitted(true)
      toast.success('Payment submitted! Credits within 1-2 hours.')
    } catch {
      toast.error('Submission failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const upiLink = selectedPlan
    ? `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${selectedPlan.price}&cu=INR&tn=${encodeURIComponent(`VoiceFlow ${selectedPlan.name} Plan`)}`
    : ''

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />

      <section className="pt-28 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 glass-gold rounded-full px-4 py-1.5 text-xs text-gold-400 mb-4">
              <Zap className="w-3 h-3" /> Seedha Indian prices
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-4">
              Simple <span className="text-gold-gradient">Pricing</span>
            </h1>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              Koi subscription trap nahi. Ek baar pay karo, 30 din use karo.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-4 py-2 text-green-400 text-sm">
              ✅ GPay · PhonePe · Paytm · Any UPI accepted
            </div>
          </div>

          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PLANS.map(plan => (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-6 flex flex-col transition-all duration-300 ${
                  plan.popular
                    ? 'border border-gold-500/40 glow-gold'
                    : 'glass hover:border-white/10'
                }`}
                style={{ background: plan.popular ? 'rgba(245,200,66,0.05)' : undefined }}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-gold-gradient text-dark-900 text-xs font-bold px-3 py-1 rounded-full">
                    <Star className="w-3 h-3 fill-dark-900" /> MOST POPULAR
                  </div>
                )}

                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="w-4 h-4" style={{ color: plan.color }} />
                    <span className="text-white/70 text-sm">{plan.name}</span>
                  </div>
                  <div className="text-4xl font-display font-bold text-white">
                    {plan.price === 0 ? 'Free' : `₹${plan.price}`}
                  </div>
                  <div className="text-sm mt-1" style={{ color: plan.color }}>
                    {plan.credits.toLocaleString('en-IN')} credits · 30 days
                  </div>
                </div>

                <ul className="space-y-2 flex-1 mb-6">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm text-white/60">
                      <Check className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: plan.color }} />
                      {f}
                    </li>
                  ))}
                </ul>

                {plan.price === 0 ? (
                  <Link href="/signup" className="btn-ghost text-center text-sm py-2.5">
                    {plan.btnText}
                  </Link>
                ) : (
                  <button
                    onClick={() => handleBuy(plan)}
                    className="py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95"
                    style={{
                      background: plan.popular ? 'linear-gradient(135deg, #f5c842, #e6ac00)' : `${plan.color}20`,
                      color: plan.popular ? '#050508' : plan.color,
                      border: plan.popular ? 'none' : `1px solid ${plan.color}30`
                    }}
                  >
                    {plan.btnText}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* FAQ */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="font-display text-3xl font-bold text-center text-white mb-10">FAQ</h2>
            <div className="space-y-4">
              {[
                { q: 'Kaise pay karna hai?', a: 'GPay, PhonePe, Paytm ya koi bhi UPI app use kar sakte ho. QR scan karo, pay karo, UTR number ya screenshot submit karo. 1-2 ghante mein credits add ho jayenge.' },
                { q: 'Credits expire hote hain kya?', a: 'Haan, credits 30 din mein expire ho jaate hain paid plans mein. Free plan ke credits kabhi expire nahi hote (sirf 500 credits).' },
                { q: 'Refund policy kya hai?', a: 'Agar credits add nahi hue aur payment confirm ho gayi, toh full refund milega. Ek baar credits use ho gaye toh refund nahi hoga.' },
                { q: 'Commercial use kar sakte hain?', a: 'Pro aur Unlimited plans mein commercial use allowed hai. Free aur Starter sirf personal use ke liye hai.' },
                { q: 'Voices kaisi quality ki hain?', a: 'Hum Microsoft Neural voices use karte hain — same technology jo Fortune 500 companies use karti hain. Crystal clear quality hai.' },
              ].map(faq => (
                <div key={faq.q} className="glass rounded-xl p-5">
                  <p className="text-white font-medium text-sm mb-2">{faq.q}</p>
                  <p className="text-white/50 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Payment Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="glass w-full max-w-md rounded-2xl border border-gold-500/20 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <h3 className="text-white font-semibold">
                Buy {selectedPlan.name} Plan · ₹{selectedPlan.price}
              </h3>
              <button onClick={() => setSelectedPlan(null)} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitted ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-green-400" />
                </div>
                <h4 className="text-white text-xl font-semibold mb-2">Payment Submitted!</h4>
                <p className="text-white/50 text-sm mb-6">
                  Your payment is under review. Credits will be added within 1-2 hours. We'll notify you via email.
                </p>
                <button onClick={() => setSelectedPlan(null)} className="btn-ghost px-8 py-2.5 text-sm">
                  Close
                </button>
              </div>
            ) : (
              <div className="p-6 space-y-5">
                {step === 'qr' && (
                  <>
                    <div className="text-center">
                      <p className="text-white/60 text-sm mb-4">
                        Scan with GPay, PhonePe, Paytm or any UPI app
                      </p>
                      {/* QR placeholder - replace with your actual QR */}
                      <div className="w-48 h-48 mx-auto bg-white rounded-xl flex items-center justify-center mb-4 relative overflow-hidden">
                        <div className="text-center p-4">
                          <QrCode className="w-16 h-16 text-dark-900 mx-auto mb-2" />
                          <p className="text-dark-700 text-xs font-mono">{upiId}</p>
                          <p className="text-dark-600 text-xs">₹{selectedPlan.price}</p>
                        </div>
                      </div>
                      <p className="text-white/40 text-xs">UPI ID: <span className="text-gold-400 font-mono">{upiId}</span></p>
                      <a href={upiLink} className="btn-gold inline-flex items-center gap-2 mt-4 text-sm px-6 py-2.5">
                        Open GPay / UPI App
                      </a>
                    </div>
                    <button onClick={() => setStep('confirm')} className="w-full btn-ghost text-sm py-2.5">
                      I've paid — Enter Details →
                    </button>
                  </>
                )}

                {step === 'confirm' && (
                  <>
                    <div>
                      <label className="text-white/60 text-sm mb-1.5 block">UTR / Transaction Number</label>
                      <input
                        className="input-dark text-sm"
                        placeholder="e.g. 425612789034"
                        value={utr}
                        onChange={e => setUtr(e.target.value)}
                      />
                      <p className="text-white/30 text-xs mt-1">Find this in your payment app transaction details</p>
                    </div>

                    <div className="text-center">
                      <p className="text-white/40 text-xs mb-2">OR upload payment screenshot</p>
                      <label className="cursor-pointer inline-flex items-center gap-2 glass border border-white/10 rounded-xl px-4 py-2.5 text-white/60 hover:text-white hover:border-white/20 text-sm transition-all">
                        <Upload className="w-4 h-4" />
                        {screenshot ? '✓ Screenshot uploaded' : 'Upload Screenshot'}
                        <input type="file" accept="image/*" onChange={handleScreenshot} className="hidden" />
                      </label>
                    </div>

                    <div className="glass-gold rounded-xl p-3 text-xs text-gold-400/70">
                      ⚡ Credits will be added within 1-2 hours after manual verification (usually faster)
                    </div>

                    <div className="flex gap-3">
                      <button onClick={() => setStep('qr')} className="btn-ghost flex-1 text-sm py-2.5">
                        ← Back
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={submitting || (!utr && !screenshot)}
                        className="btn-gold flex-1 text-sm py-2.5 flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : 'Submit Payment'}
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
