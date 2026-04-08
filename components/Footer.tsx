import Link from 'next/link'
import { Mic2, Twitter, Instagram, Linkedin, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-dark-900 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gold-gradient flex items-center justify-center">
                <Mic2 className="w-5 h-5 text-dark-900" />
              </div>
              <span className="font-display font-bold text-xl text-gold-gradient">VoiceFlow</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed max-w-sm">
              India's most affordable professional text-to-speech platform. Convert any text into natural-sounding voices in 20+ Indian languages.
            </p>
            <div className="flex items-center gap-3 mt-6">
              {[Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg glass flex items-center justify-center text-white/40 hover:text-gold-400 hover:border-gold-500/30 transition-all">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
              <a href="mailto:support@voiceflow.in" className="w-9 h-9 rounded-lg glass flex items-center justify-center text-white/40 hover:text-gold-400 transition-all">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="text-white/80 font-semibold text-sm mb-4">Product</p>
            <ul className="space-y-2.5">
              {['Features', 'Pricing', 'Voices', 'API Docs', 'Changelog'].map(item => (
                <li key={item}>
                  <Link href="#" className="text-white/40 hover:text-white/70 text-sm transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-white/80 font-semibold text-sm mb-4">Company</p>
            <ul className="space-y-2.5">
              {['About Us', 'Contact', 'Privacy Policy', 'Terms of Service', 'Refund Policy'].map(item => (
                <li key={item}>
                  <Link href="#" className="text-white/40 hover:text-white/70 text-sm transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="divider-gold mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">© 2024 VoiceFlow. Made with ❤️ in India.</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white/30 text-xs">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
