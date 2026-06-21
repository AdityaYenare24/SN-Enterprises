// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        // Brand palette — industrial yellow, deep black, steel grey
        brand: {
          yellow:  '#F5C400',
          'yellow-dark': '#D4A900',
          black:   '#0A0A0A',
          'dark':  '#111111',
          'dark2': '#1A1A1A',
          'dark3': '#242424',
          steel:   '#2D2D2D',
          grey:    '#6B6B6B',
          'grey-light': '#9A9A9A',
          white:   '#F5F5F0',
        },
      },
      fontFamily: {
        display: ['Oswald', 'sans-serif'],
        body:    ['DM Sans', 'sans-serif'],
        mono:    ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-up':      'fadeUp 0.6s ease forwards',
        'fade-in':      'fadeIn 0.5s ease forwards',
        'slide-left':   'slideLeft 0.6s ease forwards',
        'slide-right':  'slideRight 0.6s ease forwards',
        'pulse-slow':   'pulse 3s infinite',
        'spin-slow':    'spin 8s linear infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: 0, transform: 'translateY(30px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideLeft: {
          '0%':   { opacity: 0, transform: 'translateX(40px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        slideRight: {
          '0%':   { opacity: 0, transform: 'translateX(-40px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(rgba(245,196,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(245,196,0,0.05) 1px, transparent 1px)",
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E\")",
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
      boxShadow: {
        'yellow': '0 0 30px rgba(245,196,0,0.3)',
        'yellow-sm': '0 0 12px rgba(245,196,0,0.2)',
        'card': '0 4px 40px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
};
