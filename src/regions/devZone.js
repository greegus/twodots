import config from 'config'

const { DOT } = config.tileTypes
const { ICE } = config.modifierTypes
const { BLUE } = config.dotColors

export default {
  name: 'Homebase',

  levels: [
    {
      id: 0,
      colors: [BLUE],
      moves: 999,
      goals: [
        // { tile: { type: ANCHOR }, target: 99 },
        { modifier: { type: ICE }, target: 4 },
        { tile: { type: DOT, color: BLUE }, target: 1 },
        // { tile: { type: DOT, color: 'green' }, target: 99 }
      ],
      blueprint: `
        b b   b   b b
        b b,i b,i b b
        b b,i b,i b b
        b b   b   W b
        b b   b   b b
      `
    }
  ]
}
