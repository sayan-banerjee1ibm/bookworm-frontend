/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#121212',
        darkCard: '#1a1a1a',
        darkSurface: '#242424',
        darkInput: '#2a2a2a',
        darkBorder: '#333333',
        brandBlue: '#1a73e8',
        brandBlueHover: '#1557b0'
      }
    },
  },
  plugins: [],
}
