'use client'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase'
import { VOICES } from '@/lib/voices'
import { calcCredits, PLANS, type Profile } from '@/lib/supabase'
import { formatCredits } from '@/lib/utils'
import toast from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import {
  Mic2, Zap, Download, Play, Pause, ChevronDown,
  Sliders, Coins, AlertCircle, Loader2, RefreshCw
} from 'lucide-react'
import Link from 'next/link'

const LANG_GROUPS: Record<string, typeof VOICES> = {}
VOICES.forEach(v => {
  if (!LANG_GROUPS[v.lang]) LANG_GROUPS[v.lang] = []
  LANG_GROUPS[v.lang].push(v)
})

export default function GeneratePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [text, setText] = useState('')
  const [selectedVoice, setSelectedVoice] = useState(VOICES[0].id)
  const [rate, setRate] = useState(0) // -50 to +100
  const [pitch, setPitch] = useState(0) // -20 to +20
  const [loading, setLoading] = useState(false)
  const [audioData, setAudioData] = useState<string | null>(null)
  const [playing, setPlaying] = useState(false)
  const [lastResult, setLastResult] = useState<{ creditsUsed: number; creditsRemaining: number } | null>(null)
  const [showVoicePicker, setShowVoicePicker] = useState(false)
  const [searchVoice, setSearchVoice] = useState('')
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const supabase = createClient()

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const res = await fetch('/api/credits')
    const { profile } = await res.json()
    setProfile(profile)
  }

  const charCount = text.length
  const creditsNeeded = calcCredits(charCount)
  const selectedVoiceObj = VOICES.find(v => v.id === selectedVoice)

  const planLimits: Record<string, number> = {
    free: 500, starter: 2000, pro: 5000, unlimited: 10000
  }
  const maxChars = planLimits[profile?.plan || 'free'] || 500

  const handleGenerate = async () => {
    if (!text.trim()) return toast.error('Please enter some text')
    if (charCount > maxChars) return toast.error(`Upgrade plan for ${charCount} chars (limit: ${maxChars})`)
    if (profile && profile.credits < creditsNeeded) {
      return toast.error(`Need ${creditsNeeded} credits, you have ${profile.credits}. Please recharge!`)
    }

    setLoading(true)
    setAudioData(null)

    try {
      const rateStr = rate >= 0 ? `+${rate}%` : `${rate}%`
      const pitchStr = pitch >= 0 ? `+${pitch}Hz` : `${pitch}Hz`

      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voiceId: selectedVoice, rate: rateStr, pitch: pitchStr })
      })

      const data = await res.json()
      if (!res.ok) return toast.error(data.error)

      setAudioData(data.audio)
      setLastResult({ creditsUsed: data.creditsUsed, creditsRemaining: data.creditsRemaining })
      setProfile(prev => prev ? { ...prev, credits: data.creditsRemaining } : prev)
      toast.success(`Generated! Used ${data.creditsUsed} credits ✨`)
    } catch {
      toast.error('Generation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const togglePlay = () => {
    if (!audioRef.current) return
    if (playing) { audioRef.current.pause(); setPlaying(false) }
    else { audioRef.current.play(); setPlaying(true) }
  }

  const handleDownload = () => {
    if (!audioData) return
    const blob = new Blob([Buffer.from(audioData, 'base64')], { type: 'audio/mp3' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `voiceflow-${Date.now()}.mp3`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredVoices = VOICES.filter(v =>
    v.name.toLowerCase().includes(searchVoice.toLowerCase()) ||
    v.lang.toLowerCase().includes(searchVoice.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-white">Generate Voice</h1>
            <p className="text-white/50 text-sm mt-1">Convert text to natural AI speech</p>
          </div>
          {profile && (
            <div className="flex items-center gap-3">
              <div className="glass-gold rounded-xl px-4 py-2 flex items-center gap-2">
                <Coins className="w-4 h-4 text-gold-400" />
                <span className="text-gold-400 font-semibold">{formatCredits(profile.credits)}</span>
                <span className="text-white/40 text-sm">credits</span>
              </div>
              <Link href="/pricing" className="btn-ghost text-sm py-2 px-4">
                Recharge
              </Link>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Text input */}
          <div className="lg:col-span-2 space-y-4">
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-white/80 font-medium text-sm">Your Text</label>
                <span className={`text-xs ${charCount > maxChars ? 'text-red-400' : 'text-white/30'}`}>
                  {charCount} / {maxChars} chars
                </span>
              </div>
              <textarea
                className="input-dark resize-none text-sm leading-relaxed min-h-[200px]"
                placeholder="Type or paste your text here in Hindi, English, or any Indian language...

उदाहरण: नमस्ते! आज का मौसम बहुत सुहाना है।"
                value={text}
                onChange={e => setText(e.target.value)}
              />
              {charCount > maxChars && (
                <div className="flex items-center gap-2 mt-2 text-red-400 text-xs">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Upgrade your plan for more characters per generation
                </div>
              )}
            </div>

            {/* Audio player */}
            {audioData && (
              <div className="glass-gold rounded-2xl p-6">
                <audio
                  ref={audioRef}
                  src={`data:audio/mp3;base64,${audioData}`}
                  onEnded={() => setPlaying(false)}
                  className="hidden"
                />
                <div className="flex items-center gap-4">
                  <button onClick={togglePlay} className="w-12 h-12 rounded-full bg-gold-gradient flex items-center justify-center shrink-0 glow-gold">
                    {playing ? <Pause className="w-5 h-5 text-dark-900" /> : <Play className="w-5 h-5 text-dark-900 fill-dark-900" />}
                  </button>
                  <div className="flex-1">
                    <p className="text-white/80 text-sm font-medium mb-1">Generated Audio</p>
                    <div className="h-8 bg-dark-700 rounded-lg relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center gap-0.5 px-3">
                        {Array.from({ length: 60 }).map((_, i) => (
                          <div key={i} className="w-0.5 rounded-full bg-gold-500/50 flex-shrink-0" style={{ height: `${Math.random() * 80 + 10}%` }} />
                        ))}
                      </div>
                    </div>
                    {lastResult && (
                      <p className="text-white/30 text-xs mt-1">
                        {lastResult.creditsUsed} credits used · {lastResult.creditsRemaining} remaining
                      </p>
                    )}
                  </div>
                  <button onClick={handleDownload} className="btn-ghost text-sm py-2 px-4 flex items-center gap-2">
                    <Download className="w-4 h-4" /> MP3
                  </button>
                </div>
              </div>
            )}

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={loading || !text.trim()}
              className="btn-gold w-full py-4 text-base flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed glow-gold"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Generating audio...</>
              ) : (
                <><Zap className="w-5 h-5" /> Generate Voice · {creditsNeeded} credits</>
              )}
            </button>
          </div>

          {/* RIGHT: Settings */}
          <div className="space-y-4">
            {/* Voice selector */}
            <div className="glass rounded-2xl p-5">
              <p className="text-white/80 font-medium text-sm mb-3 flex items-center gap-2">
                <Mic2 className="w-4 h-4 text-gold-400" /> Voice
              </p>
              <button
                onClick={() => setShowVoicePicker(!showVoicePicker)}
                className="w-full glass border border-white/10 rounded-xl px-4 py-3 flex items-center justify-between text-sm hover:border-gold-500/30 transition-all"
              >
                <div className="text-left">
                  <p className="text-white font-medium">{selectedVoiceObj?.name}</p>
                  <p className="text-white/40 text-xs">{selectedVoiceObj?.lang} · {selectedVoiceObj?.gender}</p>
                </div>
                <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${showVoicePicker ? 'rotate-180' : ''}`} />
              </button>

              {showVoicePicker && (
                <div className="mt-3 glass rounded-xl border border-white/10 overflow-hidden">
                  <div className="p-2 border-b border-white/5">
                    <input
                      className="input-dark text-sm py-2"
                      placeholder="Search voices..."
                      value={searchVoice}
                      onChange={e => setSearchVoice(e.target.value)}
                    />
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {filteredVoices.map(v => (
                      <button
                        key={v.id}
                        onClick={() => { setSelectedVoice(v.id); setShowVoicePicker(false) }}
                        className={`w-full px-4 py-2.5 text-left hover:bg-white/5 flex items-center justify-between transition-colors ${selectedVoice === v.id ? 'bg-gold-500/10' : ''}`}
                      >
                        <div>
                          <p className={`text-sm ${selectedVoice === v.id ? 'text-gold-400' : 'text-white/80'}`}>{v.name}</p>
                          <p className="text-white/30 text-xs">{v.lang}</p>
                        </div>
                        <span className="text-white/30 text-xs">{v.gender}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Speed & Pitch */}
            <div className="glass rounded-2xl p-5">
              <p className="text-white/80 font-medium text-sm mb-4 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-gold-400" /> Voice Settings
              </p>
              <div className="space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-white/60 text-xs">Speed</label>
                    <span className="text-gold-400 text-xs font-mono">{rate >= 0 ? '+' : ''}{rate}%</span>
                  </div>
                  <input type="range" min="-50" max="100" value={rate} onChange={e => setRate(+e.target.value)}
                    className="w-full accent-yellow-400 h-1 rounded-full bg-dark-600 appearance-none cursor-pointer" />
                  <div className="flex justify-between text-white/20 text-xs mt-1">
                    <span>Slow</span><span>Normal</span><span>Fast</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-white/60 text-xs">Pitch</label>
                    <span className="text-gold-400 text-xs font-mono">{pitch >= 0 ? '+' : ''}{pitch}Hz</span>
                  </div>
                  <input type="range" min="-20" max="20" value={pitch} onChange={e => setPitch(+e.target.value)}
                    className="w-full accent-yellow-400 h-1 rounded-full bg-dark-600 appearance-none cursor-pointer" />
                  <div className="flex justify-between text-white/20 text-xs mt-1">
                    <span>Low</span><span>Normal</span><span>High</span>
                  </div>
                </div>
                <button onClick={() => { setRate(0); setPitch(0) }} className="flex items-center gap-1.5 text-white/30 hover:text-white/60 text-xs transition-colors">
                  <RefreshCw className="w-3 h-3" /> Reset to defaults
                </button>
              </div>
            </div>

            {/* Credits info */}
            <div className="glass rounded-2xl p-5">
              <p className="text-white/80 font-medium text-sm mb-3 flex items-center gap-2">
                <Coins className="w-4 h-4 text-gold-400" /> Credits
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/50">Characters</span>
                  <span className="text-white">{charCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Credits needed</span>
                  <span className="text-gold-400 font-semibold">{creditsNeeded}</span>
                </div>
                <div className="divider-gold my-2" />
                <div className="flex justify-between">
                  <span className="text-white/50">Your balance</span>
                  <span className={`font-semibold ${profile && profile.credits < creditsNeeded ? 'text-red-400' : 'text-green-400'}`}>
                    {profile ? formatCredits(profile.credits) : '—'}
                  </span>
                </div>
              </div>
              {profile && profile.credits < creditsNeeded && (
                <Link href="/pricing" className="btn-gold w-full text-center text-sm py-2.5 mt-3 block">
                  Recharge Credits
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
