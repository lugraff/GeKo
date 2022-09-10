/** @type {import('tailwindcss').Config} */
module.exports = {
  //darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      textA: '#ffffff',
      textB: '#000000',
      primary: '#9de04b',
      secondary: '#d9d9d9',
      tertiary: '#b4b4b4',
      warning: '#ffcc00',
      danger: '#f54b4c',
      selection: '#37473a',
      bgA: '#303442',
      bgB: '#282b31',
    },
    extend: {},
  },
  plugins: [
    require('tailwind-scrollbar')
  ],
}