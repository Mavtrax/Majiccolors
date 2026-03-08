/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Bebas Neue'", 'Impact', 'sans-serif'],
        body: ["'DM Sans'", 'sans-serif'],
      },
      colors: {
        ink: '#0a0a0a',
        'ink-light': '#141414',
        'ink-mid': '#1e1e1e',
        spray: {
          orange: '#ff6b00',
          yellow: '#f5c400',
          cyan:   '#00d4ff',
          pink:   '#ff2d78',
          green:  '#39ff14',
          purple: '#b44fff',
        },
      },
    },
  },
  plugins: [],
}
