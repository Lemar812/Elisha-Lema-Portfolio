/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0A0A0A',
        surface: '#111111',
        primary: '#7C3AED',
        secondary: '#22D3EE',
        highlight: '#FACC15',
        text: {
          primary: '#F9FAFB',
          muted: '#9CA3AF',
        },
        border: '#1F1F1F',
      },
      fontFamily: {
        satoshi: ['Satoshi', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        'button': '12px',
        'card': '18px',
        'image': '16px',
      },
      boxShadow: {
        'premium': '0 10px 30px rgba(0,0,0,0.35)',
      },
    },
  },
  plugins: [],
}
