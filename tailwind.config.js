/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          50: '#f4f6f8',
          100: '#e8ecf0',
          200: '#c9d2db',
          500: '#5a6b7a',
          700: '#2f3d4a',
          900: '#141c24',
        },
        accent: {
          DEFAULT: '#1a7a5c',
          soft: '#d8f0e7',
          dark: '#0f5240',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"Fraunces"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
