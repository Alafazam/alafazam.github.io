import typography from '@tailwindcss/typography'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/content/**/*.md",
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [
    typography,
  ],
} 