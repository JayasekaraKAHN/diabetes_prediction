/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'pulse-delayed-2000': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 2s',
        'pulse-delayed-4000': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite 4s',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        }
      }
    },
  },
  plugins: [],
}