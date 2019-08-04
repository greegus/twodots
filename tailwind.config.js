module.exports = {
  important: true,
  theme: {
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
