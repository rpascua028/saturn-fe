module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Path to your components
  ],
  theme: {
    extend: {
      colors: { // Ensure custom colors are within the 'colors' key

        'curu-blue': '#6a82fb',
        'curu-purple': '#c32ff5',
      },
      fontFamily: {
        'lucky': ['"LuckyFellas"', 'sans-serif'],
        'montserrat': ['"Montserrat"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
