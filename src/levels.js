import config from 'config'

const { DOT } = config.tileTypes

export default [
  {
    id: 0,
    colors: ['blue', 'red', 'green', 'pink'],
    moves: 1,
    goals: [
      { tile: { type: DOT, color: 'red' }, target: 1 },
      { tile: { type: DOT, color: 'blue' }, target: 1 },
      { tile: { type: DOT, color: 'green' }, target: 1 }
    ],
    blueprint: `
      * * * * *
      * * * * *
      * * * * *
      r r * * *
      r r * * *
    `,
  },

  //

  {
    id: 1,
    colors: ['blue', 'red', 'yellow'],
    moves: 20,
    goals: [
      {tile: { type: DOT, color: 'red' }, target: 15},
      {tile: { type: DOT, color: 'blue' }, target: 15},
      {tile: { type: DOT, color: 'yellow' }, target: 15},
    ],
    blueprint: `
      r r r r
      b y b y
      b y b y
      b y b y
      b y b y
    `
  },

  {
    id: 2,
    colors: ['green', 'yellow', 'red', 'blue'],
    moves: 30,
    goals: [
      { tile: { type: DOT, color: 'green' }, target: 15 },
      { tile: { type: DOT, color: 'yellow' }, target: 15 },
      { tile: { type: DOT, color: 'red' }, target: 15 },
      { tile: { type: DOT, color: 'blue' }, target: 15 },
    ],
    blueprint: `
      r r g r r
      r y g y r
      r y g y r
      y y g y y
      b b b b b
    `,
  },

  {
    id: 3,
    colors: ['green', 'yellow', 'red', 'blue'],
    moves: 20,
    goals: [
      { tile: { type: DOT, color: 'red' }, target: 50 },
      { tile: { type: DOT, color: 'blue' }, target: 50 },
      { tile: { type: DOT, color: 'yellow' }, target: 50 },
    ],
    blueprint: `
      r y b r b r
      y r y b r b
      b y r r b r
      r b r r y b
      b r b y r y
      r y r b y r
    `,
  },

  {
    id: 4,
    colors: ['pink', 'red', 'green', 'yellow'],
    moves: 20,
    goals: [
      { tile: { type: DOT, color: 'pink' }, target: 15 },
      { tile: { type: DOT, color: 'red' }, target: 15 },
      { tile: { type: DOT, color: 'green' }, target: 15 },
      { tile: { type: DOT, color: 'yellow' }, target: 15 },
    ],
    blueprint: `
      p p r p
      g g y g
      r y y g
      g y r r
      p g p y
      p p y g
    `,
  }
]