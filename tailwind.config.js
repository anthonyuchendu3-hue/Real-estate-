/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7f4',
          100: '#d9ebe4',
          200: '#b3d7c9',
          300: '#8cc3ae',
          400: '#66af93',
          500: '#4a8c73',
          600: '#3b705c',
          700: '#2c5445',
          800: '#1e382e',
          900: '#0f1c17',
        },
        gold: {
          500: '#D4AF37',
          600: '#C5A028',
        },
        warm: {
          50: '#fdf8f3',
          100: '#f6ede2',
          200: '#eddac2',
          300: '#e4c7a2',
          400: '#dbb482',
          500: '#c99b5e',
        },
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'display': ['Poppins', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}