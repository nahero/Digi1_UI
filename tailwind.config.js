const colors = require('tailwindcss/colors');

module.exports = {
  purge: [],
  // use purge when building for production to remove any unused classes and get the smallest css file size
  // purge: [
  //   './src/**/*.html',
  //   './src/**/*.js',
  // ],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    colors: {
      gray: colors.trueGray,
      yellow: colors.amber,
      white: colors.white
    },
    extend: {
      outline: {
        none: '2px solid transparent !important',
      }
    },
    container: {
      center: true,
      padding: "2rem"
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
