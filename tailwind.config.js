module.exports = {
  important: true,
  theme: {
    fontFamily: {
      'sans': ['Open Sans']
    },

    extend: {
      zIndex: {
        '1': 1
      }
    }
  },
  variants: {},
  plugins: [
    function({ addUtilities }) {
      const newUtilities = ({
        '.grayscale': {
          filter: 'grayscale(100)'
        }
      })

      addUtilities(newUtilities)
    }
  ]
}
