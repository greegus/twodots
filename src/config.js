const dotColors = {
  BLUE: 'blue',
  RED: 'red',
  YELLOW: 'yellow',
  GREEN: 'green',
  PINK: 'pink',
  TEAL: 'teal'
}

const tileSize = 54

export default {
  tileSize,

  gameboardSize: {
    width: 8,
    height: 8
  },

  dotColors,

  defaultTheme: {
    background: 'white',
    colorMap: {
      dots: {
        [dotColors.RED]: '#E53E3E',
        [dotColors.BLUE]: '#3182CE',
        [dotColors.GREEN]: '#48BB78',
        [dotColors.PINK]: '#97266D',
        [dotColors.YELLOW]: '#F6E05E',
        [dotColors.TEAL]: '#81E6D9'
      }
    }
  },

  tileTypes: {
    DOT: 'dot',
    WALL: 'wall',
    BOMB: 'bomb',
    ANCHOR: 'anchor',
    RAMP: 'ramp'
  },

  modifierTypes: {
    ICE: 'ice'
  }
}