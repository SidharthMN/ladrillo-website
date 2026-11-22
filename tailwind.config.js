/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        terracotta: {
          50: '#fdf4f2',
          100: '#fbe7e4',
          500: '#b8332a',
          600: '#9e251e',
          700: '#831e17',
        },
        stonecharcoal: {
          800: '#1e2227',
          900: '#14171b',
          950: '#0c0e11',
        },
        architect: {
          slate: '#64748b',
          light: '#f8fafc',
          border: '#334155',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Cinzel"', 'serif'],
      },
    },
  },
  plugins: [],
};