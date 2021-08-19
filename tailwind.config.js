const defaultTheme = require('tailwindcss/defaultTheme')

// See https://tailwindcss.com/docs/configuration for details
module.exports = {
  purge: ["./src/**/*.js"],
  // https://github.com/tailwindlabs/tailwindcss-forms
  plugins: [require("@tailwindcss/forms")],
  variants: {
    extend: {
      backgroundColor: ["even"],
    },
  },
  theme: {
    extend: {
      fontFamily: {
        sans: ["ISO", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'custom-green': '#8BB191',//'#FF4500CC',
        'custom-mango': '#FFB000',
        'custom-teal': '#00A6A5',
        'custom-mint': '#0DD3BB',
      },
    },
  },
};
