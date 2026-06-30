// admin/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'xs': '480px',
      },
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
        dark: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#6c757d',
          600: '#495057',
          700: '#343a40',
          800: '#212529',
          900: '#0f172a',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        'display': ['Poppins', 'Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}