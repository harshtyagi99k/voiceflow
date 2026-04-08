import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'VoiceFlow – Professional Text to Speech for India',
  description: 'Convert any text to natural-sounding speech in Hindi, English, Tamil, Telugu, Bengali and 20+ Indian languages. Premium voices at India-friendly prices.',
  keywords: 'text to speech india, hindi tts, voice generator, ai voice, text to speech hindi',
  openGraph: {
    title: 'VoiceFlow – Professional Text to Speech for India',
    description: 'Natural AI voices in 20+ Indian languages. Start free.',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'VoiceFlow',
    locale: 'en_IN',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="bg-dark-900 text-white font-body antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1a1a2e',
              color: '#fff',
              border: '1px solid rgba(245,200,66,0.2)',
            },
            success: { iconTheme: { primary: '#f5c842', secondary: '#0c0c14' } },
          }}
        />
      </body>
    </html>
  )
}
