import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      colors: {
        gold: {
          300: '#fcd97a',
          400: '#f5c842',
          500: '#e6ac00',
          600: '#b88a00',
        },
        dark: {
          900: '#050508',
          800: '#0c0c14',
          700: '#131320',
          600: '#1a1a2e',
          500: '#232340',
        },
        cream: '#faf6f0',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(230, 172, 0, 0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(230, 172, 0, 0.5)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #f5c842 0%, #e6ac00 50%, #b88a00 100%)',
        'dark-gradient': 'linear-gradient(135deg, #050508 0%, #0c0c14 50%, #131320 100%)',
        'mesh-gradient': 'radial-gradient(at 40% 20%, hsla(45,100%,50%,0.08) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(240,100%,56%,0.05) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(280,100%,56%,0.04) 0px, transparent 50%)',
      },
    },
  },
  plugins: [],
}
export default config
