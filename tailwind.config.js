/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f4ff', 100: '#e0e9ff', 200: '#c1d3fe', 300: '#93b4fd',
          400: '#608bfa', 500: '#3b63f6', 600: '#2a46eb', 700: '#2234d8',
          800: '#222caf', 900: '#212c89', 950: '#161a52'
        }
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      }
    }
  },
  plugins: []
};
