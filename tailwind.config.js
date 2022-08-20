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
          50: '#fef4f2',
          100: '#fee7e2',
          200: '#ffd2c9',
          300: '#fdb3a4',
          400: '#fa876f',
          500: '#f15e40', // Default
          600: '#de4424',
          700: '#bb351a',
          800: '#9b2f19',
          900: '#802d1c'
        },
        'ob-secondary': {
          DEFAULT: '#8BB191',
          50: '#f5f8f5',
          100: '#dee9df',
          200: '#bcd3bf',
          300: '#8bb191', // Default
          400: '#6b9673',
          500: '#517b59',
          600: '#3f6247',
          700: '#35503c',
          800: '#2e4133',
          900: '#29382d'
        },
        'ob-tertiary': {
          DEFAULT: '#62CAE3',
          50: '#eefbfd',
          100: '#d5f2f8',
          200: '#b0e6f1',
          300: '#62cae3', // Default
          400: '#3bb5d5',
          500: '#1f98bb',
          600: '#1d7a9d',
          700: '#1e6380',
          800: '#215269',
          900: '#1f455a'
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
