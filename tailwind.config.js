/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'truth-yellow': '#FFD23F',
        'truth-blue': '#64B5F6',
        'truth-orange': '#FF7043',
        'truth-pink': '#EC407A',
        'truth-green': '#90EE90',
        'truth-red': '#EF5350'
      },
      fontFamily: {
        'anton': ['Anton', 'sans-serif'],
        'inter': ['Inter', 'sans-serif']
      },
      boxShadow: {
        'truth': '8px 8px 0px black',
        'truth-sm': '6px 6px 0px black'
      },
      backgroundImage: {
        'diagonal-stripes': 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255, 255, 255, 0.5) 20px, rgba(255, 255, 255, 0.5) 40px)'
      }
    },
  },
  plugins: [],
}