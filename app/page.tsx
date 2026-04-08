import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import {
  Mic2, Zap, Globe, Download, Shield, BarChart3,
  Star, ArrowRight, Check, Play, ChevronRight, Sparkles
} from 'lucide-react'

export default function Home() {
  return (
    <main className="relative overflow-hidden">
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center pt-24 pb-16 px-4 noise grid-bg">
        {/* Background orbs */}
        <div className="orb w-[600px] h-[600px] bg-gold-500/8 top-0 left-1/2 -translate-x-1/2 -translate-y-1/4" />
        <div className="orb w-[400px] h-[400px] bg-purple-600/5 bottom-0 left-0" />
        <div className="orb w-[300px] h-[300px] bg-blue-600/5 bottom-0 right-0" />

        <div className="max-w-7xl mx-auto w-full z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 glass-gold rounded-full px-4 py-2 mb-8 text-sm text-gold-400">
              <Sparkles className="w-4 h-4" />
              <span>20+ Indian Languages · Microsoft Neural Voices</span>
              <Sparkles className="w-4 h-4" />
            </div>

            {/* Headline */}
            <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.1] mb-6">
              <span className="text-white">Your Words.</span>
              <br />
              <span className="shimmer-text">Any Voice.</span>
              <br />
              <span className="text-white/80 text-4xl md:text-6xl font-normal">
                ₹99 mein shuru karo.
              </span>
            </h1>

            <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Professional AI voices in Hindi, English, Tamil, Telugu, Bengali and 20+ languages.
              Used by content creators, educators & businesses across India.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Link href="/signup" className="btn-gold text-base px-8 py-4 flex items-center gap-2 glow-gold w-full sm:w-auto justify-center">
                <Zap className="w-5 h-5" />
                Start Free – 500 Credits
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="#demo" className="btn-ghost text-base px-8 py-4 flex items-center gap-2 w-full sm:w-auto justify-center">
                <Play className="w-5 h-5" />
                Hear Demo Voices
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-center">
              {[
                { num: '50,000+', label: 'Voices Generated' },
                { num: '20+', label: 'Indian Languages' },
                { num: '₹99', label: 'Starting Price' },
                { num: '99.9%', label: 'Uptime' },
              ].map(s => (
                <div key={s.label}>
                  <div className="text-2xl font-display font-bold text-gold-gradient">{s.num}</div>
                  <div className="text-white/40 text-sm mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Demo card */}
          <div id="demo" className="mt-20 max-w-3xl mx-auto">
            <div className="glass rounded-2xl p-6 border border-gold-500/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-white/30 text-sm ml-2">VoiceFlow Generator</span>
              </div>
              <div className="bg-dark-800 rounded-xl p-4 mb-4 border border-white/5">
                <p className="text-white/70 text-sm leading-relaxed">
                  "नमस्ते! मैं VoiceFlow हूँ। आपके शब्दों को प्राकृतिक आवाज़ में बदलना मेरा काम है।
                  India की सबसे सस्ती text-to-speech service।"
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 glass-gold rounded-lg px-3 py-2 text-sm text-gold-400">
                  <Mic2 className="w-4 h-4" />
                  Swara (Hindi Female)
                </div>
                <div className="flex-1 h-10 bg-dark-700 rounded-lg relative overflow-hidden">
                  {/* Fake waveform */}
                  <div className="absolute inset-0 flex items-center justify-center gap-0.5 px-4">
                    {Array.from({ length: 50 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-1 rounded-full bg-gold-500/60"
                        style={{ height: `${Math.random() * 70 + 15}%` }}
                      />
                    ))}
                  </div>
                </div>
                <button className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center">
                  <Play className="w-4 h-4 text-dark-900 fill-dark-900" />
                </button>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-white/30">
                <span>1 credit used · 0:04 duration</span>
                <span className="flex items-center gap-1"><Download className="w-3 h-3" /> Download MP3</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUST BAR ===== */}
      <section className="py-10 border-y border-white/5 bg-dark-800/50">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-white/30 text-sm mb-6">Trusted by creators & educators across India</p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {['Content Creators', 'EdTech Companies', 'Podcast Studios', 'Marketing Agencies', 'YouTubers', 'E-learning Platforms'].map(b => (
              <div key={b} className="text-white/20 text-sm font-semibold tracking-wide">{b}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 glass-gold rounded-full px-4 py-1.5 text-xs text-gold-400 mb-4">
              <Zap className="w-3 h-3" /> Features
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Sab kuch jo aapko chahiye
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Enterprise-grade TTS technology, India-friendly pricing. No compromise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Globe,
                title: '20+ Indian Languages',
                desc: 'Hindi, English, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi and more.',
                color: 'text-gold-400',
              },
              {
                icon: Mic2,
                title: 'Neural AI Voices',
                desc: 'Microsoft Neural voices — the same technology used by Fortune 500 companies. Crystal clear quality.',
                color: 'text-blue-400',
              },
              {
                icon: Zap,
                title: 'Generate in Seconds',
                desc: 'No waiting. Type your text, choose a voice, download your audio. Done in under 3 seconds.',
                color: 'text-green-400',
              },
              {
                icon: Download,
                title: 'MP3 Download',
                desc: 'Download your audio files in high-quality MP3 format. Use them anywhere — YouTube, podcasts, ads.',
                color: 'text-purple-400',
              },
              {
                icon: BarChart3,
                title: 'Credit System',
                desc: 'Simple, transparent pricing. 1 credit = 2 characters. No hidden fees. Buy only what you need.',
                color: 'text-orange-400',
              },
              {
                icon: Shield,
                title: 'Secure & Private',
                desc: 'Your data is encrypted. We never store your generated audio. 100% private.',
                color: 'text-red-400',
              },
            ].map((f) => (
              <div key={f.title} className="glass rounded-2xl p-6 hover:border-gold-500/20 transition-all duration-300 group">
                <div className={`w-12 h-12 rounded-xl bg-dark-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== VOICES SECTION ===== */}
      <section id="voices" className="py-24 px-4 bg-dark-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Premium Voices
            </h2>
            <p className="text-white/50">100+ voices across all major Indian and world languages</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Swara', lang: 'Hindi', gender: '♀', flag: '🇮🇳' },
              { name: 'Madhur', lang: 'Hindi', gender: '♂', flag: '🇮🇳' },
              { name: 'Neerja', lang: 'English-IN', gender: '♀', flag: '🇮🇳' },
              { name: 'Pallavi', lang: 'Tamil', gender: '♀', flag: '🇮🇳' },
              { name: 'Shruti', lang: 'Telugu', gender: '♀', flag: '🇮🇳' },
              { name: 'Aarohi', lang: 'Marathi', gender: '♀', flag: '🇮🇳' },
              { name: 'Dhwani', lang: 'Gujarati', gender: '♀', flag: '🇮🇳' },
              { name: 'Sapna', lang: 'Kannada', gender: '♀', flag: '🇮🇳' },
            ].map(v => (
              <div key={v.name} className="glass-gold rounded-xl p-4 flex items-center gap-3 hover:glow-gold transition-all cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-dark-700 flex items-center justify-center text-xl">
                  {v.flag}
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{v.name} {v.gender}</p>
                  <p className="text-white/40 text-xs">{v.lang}</p>
                </div>
                <Play className="w-4 h-4 text-gold-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/generate" className="btn-ghost inline-flex items-center gap-2 text-sm">
              View all 100+ voices <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== PRICING PREVIEW ===== */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              India-First Pricing
            </h2>
            <p className="text-white/50">Seedha rupees mein. Koi dollar conversion nahi.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: 'Free',
                price: '₹0',
                credits: '500',
                popular: false,
                features: ['5 voices', '500 chars/gen', 'MP3 download', 'Email support'],
              },
              {
                name: 'Starter',
                price: '₹99',
                credits: '5,000',
                popular: false,
                features: ['20 voices', '2000 chars/gen', 'MP3 download', 'Priority support'],
              },
              {
                name: 'Pro',
                price: '₹249',
                credits: '15,000',
                popular: true,
                features: ['50 voices', '5000 chars/gen', 'API access', 'Priority support', 'Commercial use'],
              },
              {
                name: 'Unlimited',
                price: '₹499',
                credits: '50,000',
                popular: false,
                features: ['100+ voices', '10000 chars/gen', 'API access', 'Dedicated support', 'Commercial use'],
              },
            ].map(p => (
              <div
                key={p.name}
                className={`relative rounded-2xl p-6 flex flex-col ${
                  p.popular
                    ? 'glass-gold glow-gold border-gold-500/30'
                    : 'glass'
                }`}
              >
                {p.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold-gradient text-dark-900 text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <p className="text-white/60 text-sm mb-1">{p.name}</p>
                <p className="text-3xl font-display font-bold text-white mb-1">{p.price}</p>
                <p className="text-gold-400 text-sm font-medium mb-6">{p.credits} credits</p>
                <ul className="space-y-2 flex-1 mb-6">
                  {p.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm text-white/60">
                      <Check className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={p.name === 'Free' ? '/signup' : '/pricing'}
                  className={p.popular ? 'btn-gold text-center text-sm' : 'btn-ghost text-center text-sm'}
                >
                  {p.name === 'Free' ? 'Get Started Free' : 'Get Plan'}
                </Link>
              </div>
            ))}
          </div>
          <p className="text-center text-white/30 text-sm mt-8">
            💳 Pay via GPay · PhonePe · Paytm · Any UPI app. Instant activation.
          </p>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-24 px-4 bg-dark-800/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-4xl font-bold text-center text-white mb-16">
            Customers love VoiceFlow
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                text: '"Finally ek affordable TTS tool jo Hindi mein proper kaam karta hai! Pro plan se meri YouTube automation poori ho gayi."',
                name: 'Rahul Verma',
                role: 'YouTube Content Creator, Delhi',
              },
              {
                text: '"Mere e-learning course ke liye bahut kaam aaya. Voice quality amazing hai. ₹249 mein 15,000 credits — unbeatable!"',
                name: 'Priya Sharma',
                role: 'EdTech Founder, Bangalore',
              },
              {
                text: '"Tamil voice quality is superb! I use it for my podcast intros and ads. My audience can\'t tell it\'s AI!"',
                name: 'Karthik Raj',
                role: 'Podcast Creator, Chennai',
              },
            ].map(t => (
              <div key={t.name} className="glass rounded-2xl p-6">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-gold-400 fill-gold-400" />
                  ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-6 italic">{t.text}</p>
                <div>
                  <p className="text-white font-medium text-sm">{t.name}</p>
                  <p className="text-white/40 text-xs">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass-gold rounded-3xl p-12 relative overflow-hidden">
            <div className="orb w-[300px] h-[300px] bg-gold-500/10 top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 relative z-10">
              Aaj hi shuru karo.
              <br />
              <span className="text-gold-gradient">Free mein.</span>
            </h2>
            <p className="text-white/60 mb-8 relative z-10">
              500 free credits milenge signup pe. Koi credit card nahi chahiye.
            </p>
            <Link href="/signup" className="btn-gold text-lg px-10 py-4 inline-flex items-center gap-2 glow-gold-strong relative z-10">
              <Zap className="w-5 h-5" />
              Create Free Account
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
