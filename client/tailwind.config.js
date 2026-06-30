/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        gold:    { DEFAULT: '#F5A623', light: '#FFD166', dark: '#C47F17' },
        dark:    { DEFAULT: '#0A0A0F', card: '#12121A', border: '#1E1E2E', surface: '#1A1A28' },
        light:   { DEFAULT: '#F5F5F0', card: '#FFFFFF',  border: '#E8E8E0' },
      },
      fontFamily: {
        sans:    ['Inter', 'sans-serif'],
        heading: ['Poppins', 'sans-serif'],
        display: ['Bebas Neue', 'Poppins', 'sans-serif'],
      },
      animation: {
        'spin-slow':   'spin 10s linear infinite',
        'float':       'float 4s ease-in-out infinite',
        'glow-pulse':  'glowPulse 2s ease-in-out infinite',
        'slide-right': 'slideRight 0.6s ease forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%':      { transform: 'translateY(-18px) rotate(1deg)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(245,166,35,0.3)' },
          '50%':      { boxShadow: '0 0 50px rgba(245,166,35,0.7), 0 0 80px rgba(245,166,35,0.3)' },
        },
        slideRight: {
          from: { transform: 'translateX(-100%)', opacity: 0 },
          to:   { transform: 'translateX(0)',      opacity: 1 },
        },
      },
      backgroundImage: {
        'gradient-radial':  'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':   'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gold-gradient':    'linear-gradient(135deg, #F5A623 0%, #FFD166 50%, #C47F17 100%)',
        'dark-gradient':    'linear-gradient(135deg, #0A0A0F 0%, #12121A 100%)',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
