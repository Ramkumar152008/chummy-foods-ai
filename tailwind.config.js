/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        chummy: {
          yellow: '#FFBD3C',
          yellowHover: '#F0A71C',
          yellowLight: '#FFF7E6',
          plum: '#2E2A39',
          plumLight: '#3F3A4D',
          maroon: '#9B046F',
          maroonLight: '#FCE7F4',
          navy: '#193054',
          cream: '#FDFBF7',
          creamDark: '#F4EFE6',
          green: '#15803D',
          greenLight: '#DCFCE7',
          lime: '#EDFFA7',
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'chummy': '0 10px 30px -5px rgba(46, 42, 57, 0.08), 0 4px 6px -2px rgba(46, 42, 57, 0.04)',
        'chummy-lg': '0 20px 40px -10px rgba(46, 42, 57, 0.12), 0 8px 10px -4px rgba(46, 42, 57, 0.06)',
      },
    },
  },
  plugins: [],
};
