import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'g-950': '#0c1c14',
        'g-900': '#10231a',
        'g-850': '#14291f',
        'g-800': '#173324',
        'g-700': '#1f3b2c',
        'g-600': '#294a38',
        'g-500': '#345844',
        cream: 'rgb(var(--cream-rgb) / <alpha-value>)',
        'cream-bright': '#f4eedd',
        sage: 'rgb(var(--sage-rgb) / <alpha-value>)',
        'sage-deep': '#93bd78',
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      screens: {},
      animation: {
        'float-a': 'floatY 6s ease-in-out infinite',
        'float-b': 'floatY 7.5s ease-in-out infinite reverse',
        'float-c': 'floatY 6.8s ease-in-out infinite -1.5s',
        'spin-slow': 'spin 26s linear infinite',
        'spin-reverse': 'spin 34s linear infinite reverse',
        'page-in': 'pageIn 0.5s cubic-bezier(0.16,1,0.3,1) both',
        'sheet-up': 'sheetUp 0.42s cubic-bezier(0.16,1,0.3,1) both',
        'toast-up': 'toastUp 0.4s cubic-bezier(0.34,1.56,0.64,1) both',
        'fade-in': 'fadeIn 0.3s ease both',
      },
      keyframes: {
        floatY: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pageIn: {
          from: { transform: 'translateY(16px)' },
          to: { transform: 'translateY(0)' },
        },
        sheetUp: {
          from: { transform: 'translateY(100%)' },
          to: { transform: 'translateY(0)' },
        },
        toastUp: {
          from: { opacity: '0', transform: 'translateY(16px) scale(0.9)' },
          to: { opacity: '1', transform: 'none' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      boxShadow: {
        card: '0 18px 40px rgba(0,0,0,0.42)',
        'card-float': '0 18px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(236,229,209,0.1)',
        btn: '0 10px 26px rgba(0,0,0,0.35)',
        sheet: '0 -20px 50px rgba(0,0,0,0.5)',
        toast: '0 12px 30px rgba(0,0,0,0.5)',
        orb: '0 18px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(236,229,209,0.1)',
      },
    },
  },
  plugins: [],
}

export default config
