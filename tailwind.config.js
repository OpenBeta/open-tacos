const defaultTheme = require('tailwindcss/defaultTheme')

// See https://tailwindcss.com/docs/configuration for details
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}'
  ],

  // https://github.com/tailwindlabs/tailwindcss-forms
  plugins: [require('daisyui'), require('@tailwindcss/typography'), require('tailwindcss-radix')()],
  theme: {
    extend: {
      fontFamily: {
        sans: ['ISO', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        'custom-green': '#8BB191',
        'ob-primary': {
          DEFAULT: '#F15E40',
          50: '#FEEEEB',
          100: '#FCDED8',
          200: '#F9BEB2',
          300: '#F79E8C',
          400: '#F47E66',
          500: '#F15E40',
          600: '#E83511',
          700: '#B4290D',
          800: '#7F1D09',
          900: '#4B1106'
        },
        'ob-secondary': {
          DEFAULT: '#8BB191',
          50: '#E0EAE2',
          100: '#D4E2D6',
          200: '#BCD2BF',
          300: '#A3C1A8',
          400: '#8BB191',
          500: '#699A71',
          600: '#527A58',
          700: '#3B5840',
          800: '#253728',
          900: '#0E150F'
        },
        'ob-tertiary': {
          DEFAULT: '#62CAE3',
          50: '#DBF3F9',
          100: '#CAEDF6',
          200: '#A7E1EF',
          300: '#85D6E9',
          400: '#62CAE3',
          500: '#32BADB',
          600: '#2098B5',
          700: '#187085',
          800: '#0F4855',
          900: '#072026'
        },
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
