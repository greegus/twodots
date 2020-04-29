import config from 'config'

const { DOT, ANCHOR } = config.tileTypes

import homeBase from './homeBase'
import underTheSea from './underTheSea'

export default [
  {
    id: 0,
    colors: ['blue', 'red', 'green', 'pink'],
    moves: 6,
    goals: [
      { tile: { type: ANCHOR }, target: 99 },
      { tile: { type: DOT, color: 'blue' }, target: 99 },
      { tile: { type: DOT, color: 'green' }, target: 99 }
    ],
    // blueprint: `
    //   b g b r
    //   Rr . . Rl
    //   W . y W
    // `
    blueprint: `
      * * * *
      * b * *
      * b * *
      * b * *
    `
  },

  ...homeBase,
  ...underTheSea,
]