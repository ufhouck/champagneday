/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'media', // Enable system-based dark mode
  theme: {
    extend: {
      gridTemplateColumns: {
        '24': 'repeat(24, minmax(2.5rem, 1fr))',
      },
    },
  },
  plugins: [],
};