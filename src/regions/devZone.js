import config from 'config'

const { DOT } = config.tileTypes
const { BLUE, RED, YELLOW, GREEN, PINK } = config.dotColors

export default {
  name: 'Homebase',

  levels: [
    {
      id: 0,
      colors: ['blue', 'red', 'green', 'pink'],
      moves: 6,
      goals: [
        // { tile: { type: ANCHOR }, target: 99 },
        { tile: { type: DOT, color: 'blue' }, target: 1 },
        { tile: { type: DOT, color: 'green' }, target: 99 }
      ],
      blueprint: `
        b b b b
        b b b b
        b b b b
        b b b b
      `
    }
  ]
}
