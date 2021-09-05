const defaultTheme = require('tailwindcss/defaultTheme')

// See https://tailwindcss.com/docs/configuration for details
module.exports = {
  purge: ["./src/**/*.js"],
  // https://github.com/tailwindlabs/tailwindcss-forms
  plugins: [require("@tailwindcss/forms")],
  variants: {
    extend: {
      backgroundColor: ["even"],
      opacity: ['disabled']
    },
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ["ISO", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'custom-green': '#8BB191',
        'custom-secondary': '#62cae3',
        'custom-avery': '#a5d9cf',
        'custom-primary': '#e7811d',
      },
    },
  },
};
