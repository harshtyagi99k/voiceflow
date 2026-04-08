'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import { Mic2, Menu, X, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [user, setUser] = useState<any>(null)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const navLinks = [
    { href: '/#features', label: 'Features' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/#voices', label: 'Voices' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      scrolled ? 'py-3 bg-dark-900/90 backdrop-blur-xl border-b border-white/5' : 'py-5'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gold-gradient flex items-center justify-center glow-gold group-hover:glow-gold-strong transition-all">
            <Mic2 className="w-5 h-5 text-dark-900" />
          </div>
          <span className="font-display font-bold text-xl text-gold-gradient">VoiceFlow</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-white/60 hover:text-white text-sm transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link href="/dashboard" className="btn-ghost text-sm py-2 px-4">
                Dashboard
              </Link>
              <Link href="/generate" className="btn-gold text-sm py-2 px-4 flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                Generate
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-ghost text-sm py-2 px-4">
                Sign In
              </Link>
              <Link href="/signup" className="btn-gold text-sm py-2 px-4">
                Start Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-white/70" onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-dark-800 border-t border-white/5 px-4 py-6 space-y-4">
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} className="block text-white/70 hover:text-white py-1" onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          <div className="pt-2 space-y-2">
            {user ? (
              <>
                <Link href="/dashboard" className="block btn-ghost text-center text-sm" onClick={() => setOpen(false)}>Dashboard</Link>
                <Link href="/generate" className="block btn-gold text-center text-sm" onClick={() => setOpen(false)}>Generate Voice</Link>
              </>
            ) : (
              <>
                <Link href="/login" className="block btn-ghost text-center text-sm" onClick={() => setOpen(false)}>Sign In</Link>
                <Link href="/signup" className="block btn-gold text-center text-sm" onClick={() => setOpen(false)}>Start Free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
