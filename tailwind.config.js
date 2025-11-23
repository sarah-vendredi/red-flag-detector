/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'wave': 'wave 0.5s ease-in-out infinite',
        'flag-wave': 'flag-wave 1s ease-in-out infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'rotate(-5deg)' },
          '50%': { transform: 'rotate(5deg)' },
        },
        'flag-wave': {
          '0%, 100%': { transform: 'rotate(0deg) scale(1)' },
          '25%': { transform: 'rotate(-10deg) scale(1.05)' },
          '75%': { transform: 'rotate(10deg) scale(1.05)' },
        }
      }
    },
  },
  plugins: [],
}
