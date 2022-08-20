const defaultTheme = require('tailwindcss/defaultTheme')

// See https://tailwindcss.com/docs/configuration for details
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}'
  ],

  // https://github.com/tailwindlabs/tailwindcss-forms
  plugins: [require('daisyui'), require('@tailwindcss/typography')],
  theme: {
    extend: {
      fontFamily: {
        sans: ['ISO', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        'custom-green': '#8BB191',
        'ob-primary': '#F15E40',
        'ob-secondary': '#8BB191',
        'ob-tertiary': '#62cae3',
        'ob-dark': '#0f172a', // slate-900
        'custom-secondary': '#62cae3',
        'custom-avery': '#a5d9cf',
        'custom-primary': '#F07933'
      },
      height: {
        'screen-85': '85vh',
        'screen-80': '80vh',
        'screen-20': '20vh',
        'screen-15': '15vh'
      },
      screens: {
        '3xl': '2560px'
      }
    }
  },
  daisyui: {
    styled: true,
    themes: [{
      light: {
        ...require('daisyui/src/colors/themes')['[data-theme=light]'],
        primary: '#111826',
        'primary-focus': '#1f2933',
        secondary: '#b1c077', // OB brand secondary
        accent: '#F15E40', // OB primary brand
        neutral: '#111826',
        'base-content': '#111827', // text-gray-900
        'base-300': '#4B5563', // text-gray-600
        'base-200': '#9CA3AF', // text-gray-400
        'base-100': '#E5E7EB', // text-gray-200
        '--rounded-box': '0.5rem'
      }
    }],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: ''
  }
}
