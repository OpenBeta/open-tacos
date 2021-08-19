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
    },
  },
};
