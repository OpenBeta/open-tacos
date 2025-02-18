/**
 * This file configures Tailwind CSS for the project.
 * At first, the code lacked a dedicated section for official/brand colors,
 * making it difficult to manage + reference across different components.
 *
 * WHAT I DID:
 *  - Added a "brand" object under the theme.extend.colors section
 *    to store official style-guide colors in one place.
 *  - Kept  existing color keys the same
 *    to avoid breaking original references.
 *  - Left all DaisyUI configurations and themes as they were  -
 *    to make sure there is no interruption with UI components.
 */


const defaultTheme = require('tailwindcss/defaultTheme');

// See https://tailwindcss.com/docs/configuration for details
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}'
  ],

  // Including external Tailwind/DaisyUI plugins
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui'),
    require('tailwindcss-radix')()
  ],

  theme: {
    extend: {
      // merge our custom font with Tailwind's default sans stack
      fontFamily: {
        sans: ['ISO', ...defaultTheme.fontFamily.sans]
      },

      /**
       * OFFICIAL BRAND COLORS
       * Created this brand object to unify the style guide (encourage consistency)
       * Also make referencing key brand colors more convenient + maintainable.
       */

      colors: {
        brand: {
          primary: '#F15E40',    // Official brand primary color
          secondary: '#8BB191',  // Official brand secondary color
          tertiary: '#62cae3',   // Official brand tertiary color
          dark: '#0f172a'        // Official brand dark color
        },

        /**
         * EXISTING CUSTOM COLORS
         * Already defined in our config.
         * Leave them here to avoid breaking older references
         * until we're ready to migrate them (if needed).
         */
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
        shadow: '#84848442',
        tooltip: 'rgb(254 243 199)' // background for DaisyUI tooltip (bg-amber-100)
      },

      // Extend default Tailwind utility classes
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

  /**
   * DAISY UI CONFIGURATION
   * Preserved light theme, accent colors, and other
   * DaisyUI-specific utilities. No changes made here
   * except making sure it still works seamlessly with new brand object.
   */
  daisyui: {
    styled: true,
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['[data-theme=light]'],
          primary: '#111827',
          'primary-focus': 'rgb(51 65 85)',
          'primary-content': '#FFFFFF',
          secondary: '#b1c077', // OB brand secondary
          accent: '#F15E40',    // OB primary brand
          'accent-content': '#FFFFFF',
          neutral: '#111826',
          'neutral-content': 'white',
          info: '#65C3C8',
          error: '#ec4899',
          'base-content': 'rgb(23 23 23)', // neutral-900
          'base-300': 'rgb(115 115 115)',  // neutral-500
          'base-200': 'rgb(250 250 250)',  // neutral-50
          'base-100': 'white',
          '--rounded-box': '0.5rem',
          '--rounded-btn': '0.25rem', // Border radius for buttons
          // '--border-color': '#AABAC0', // Example override for borders
          '--btn-text-case': s => s, // Leaves button text case as-is
          '--input-size-xs': '1.25rem',
          '--input-size-sm': '1.75rem',
          '--input-size-md': '2.25rem',
          '--input-size-lg': '3rem',

          '.btn,.btn-md': {
            height: 'var(--input-size-md)',
            'min-height': 'var(--input-size-md)'
          },
          '.btn-xs': {
            height: 'var(--input-size-xs)',
            'min-height': 'var(--input-size-xs)'
          },
          '.btn-sm': {
            height: 'var(--input-size-sm)',
            'min-height': 'var(--input-size-sm)'
          },
          '.btn-lg': {
            height: 'var(--input-size-lg)',
            'min-height': 'var(--input-size-lg)'
          },
          '.btn-square,.btn-circle': {
            width: 'var(--input-size-md)'
          },
          '.btn-square.btn-xs,.btn-circle.btn-xs': {
            width: 'var(--input-size-xs)'
          },
          '.btn-square.btn-sm,.btn-circle.btn-sm': {
            width: 'var(--input-size-sm)'
          },
          '.btn-square.btn-lg,.btn-circle.btn-lg': {
            width: 'var(--input-size-lg)'
          },
          '.file-input,.select,.input': {
            height: 'var(--input-size-md)'
          },
          '.file-input.file-input-xs,.select.select-xs,.input.input-xs': {
            height: 'var(--input-size-xs)'
          },
          '.file-input.file-input-sm,.select.select-sm,.input.input-sm': {
            height: 'var(--input-size-sm)'
          },
          '.file-input.file-input-lg,.select.select-lg,.input.input-lg': {
            height: 'var(--input-size-lg)'
          }
        }
      }
    ],
    base: true,
    utils: true,
    logs: false,
    rtl: false,
    prefix: ''
  }
};
