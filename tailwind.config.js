const defaultTheme = require('tailwindcss/defaultTheme')

// See https://tailwindcss.com/docs/configuration for details
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}'
  ],

  // https://github.com/tailwindlabs/tailwindcss-forms
  plugins: [require('@tailwindcss/typography'), require('daisyui'), require('tailwindcss-radix')()],
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
        'custom-primary': '#F07933',
        'area-cue': '#004F6E', // background cue for Areas
        'sport-climb-cue': '#00b896', // cue for sport climbs
        tooltip: 'rgb(254 243 199)' // background for Daist tooltip bg-amber-100
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
        ...require('daisyui/src/theming/themes')['[data-theme=light]'],
        primary: '#111827',
        'primary-focus': '#111827',
        secondary: '#b1c077', // OB brand secondary
        accent: '#F15E40', // OB primary brand
        neutral: '#111826',
        info: '#65C3C8',
        error: '#ec4899',
        'base-content': '#111827', // gray-900
        'base-300': '#4B5563', // gray-600
        'base-200': '#9ca3af', // gray-400
        'base-100': '#ffffff', // white
        '--rounded-box': '0.5rem',
        '--rounded-btn': '0.5rem', // border radius rounded-btn utility class, used in buttons and similar element

        '--btn-text-case': s => s
      }
    }],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: ''
  }
}
