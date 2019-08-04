module.exports = {
  important: true,
  theme: {
    fontFamily: {
      'sans': ['Montserrat', 'Open Sans']
    },

    extend: {
      zIndex: {
        '1': 1
      }
    }
  },
  variants: {},
  plugins: [
    function({ addUtilities, addComponents, theme}) {
      // utilities

      addUtilities({
        '.grayscale': {
          filter: 'grayscale(100)'
        }
      })

      // buttons

      addComponents({
        '.btn': {
          color: 'white',
          backgroundColor: theme('colors.green.500'),
          padding: '.5rem 1rem .65rem',
          borderRadius: '999px',
          boxShadow: `inset 0 -.25rem 0 0 ${theme('colors.green.600')}`,
          fontWeight: '300',
          transition: 'filter .15s',
          outline: 'none',

          '&.btn-lg': {
            padding: '.5rem 2rem .65rem',
            fontSize: theme('fontSize.2xl')
          },

          '&:hover': {
            filter: 'brightness(110%)'
          },

          '&:focus': {
            outline: 'none',
          }
        }
      })
    }
  ]
}
