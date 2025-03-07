/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a365d',
          light: '#2c5282',
          dark: '#0f172a',
        },
        secondary: '#2d3748',
        accent: '#4299e1',
      },
      boxShadow: {
        card: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'modal-appear': 'modal-appear 0.2s ease-out',
      },
      keyframes: {
        'modal-appear': {
          '0%': { opacity: 0, transform: 'scale(0.95)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};