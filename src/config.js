const dotColors = {
  red:  { hex: '#E53E3E' },
  blue:  { hex: '#3182CE' },
  green:  { hex: '#48BB78' },
  pink:  { hex: '#97266D' },
  yellow:  { hex: '#F6E05E' },
  teal:  { hex: '#81E6D9' }
}

export default {
  tileSize: 54,

  dotColors: Object.keys(dotColors),

  colorsMap: Object.entries(dotColors)
    .reduce((acc, [key, { hex }]) => ({ ...acc, [key]: hex }), {}),

  tileTypes: {
    DOT: 'dot',
    WALL: 'wall',
    BOMB: 'bomb',
    ANCHOR: 'anchor',
    RAMP: 'ramp'
  }
}