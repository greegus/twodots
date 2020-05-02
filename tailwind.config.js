module.exports = {
  important: true,
  theme: {
    fontFamily: {
      'sans': ['Montserrat', 'Open Sans']
    },

    extend: {
      fontSize: {
        '2xs': '.575rem'
      },

      spacing: {
        '9': '2.25rem',
        '14': '3.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
        '128': '42rem',
        '160': '72rem',
      },

      minWidth: theme => theme('spacing'),

      maxWidth: theme => theme('spacing'),

      minHeight: theme => theme('spacing'),

      maxHeight: theme => theme('spacing'),

      zIndex: {
        '1': 1
      },

      height: {
        '1/2': '50%'
      },

      borderRadius: {
        'xl': '.85rem',
        '2xl': '1.15rem'
      },

      transitionProperty: {
        'visibility': 'visibility, opacity'
      },

      boxShadow: theme => ({
        'inset': 'inset 0 0 0 1px rgba(#000, .1)',
        'outline-error': `0 0 0 3px rgba(${theme('colors.red.500')}, .5)`
      })
    },
  },

  variants: {},

  plugins: [
    function({ addUtilities}) {
      addUtilities({
        '.grayscale': {
          filter: 'grayscale(100)'
        }
      })
    }
  ]
}
