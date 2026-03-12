export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0a0a0f',
        cream: '#f5f0e8',
        gold: '#c9a84c',
        'gold-light': '#e8d08a',
        slate: '#1e2a3a',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        mono: ['"DM Mono"', 'monospace'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
