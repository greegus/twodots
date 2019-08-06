import config from 'config'

const { DOT } = config.tileTypes

export default [
  {
    id: 0,
    colors: ['blue', 'red', 'green', 'pink'],
    moves: 99,
    goals: [
      { tile: { type: DOT, color: 'red' }, target: 99 },
      { tile: { type: DOT, color: 'blue' }, target: 99 },
      { tile: { type: DOT, color: 'green' }, target: 99 }
    ],
    blueprint: `
      r * * * *
      r * * * *
      r r r * *
      r r r * *
      r r r * *
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
  },

  {
    id: 5,
    colors: ['pink', 'blue', 'green', 'yellow'],
    moves: 26,
    goals: [
      { tile: { type: DOT, color: 'pink' }, target: 20 },
      { tile: { type: DOT, color: 'blue' }, target: 20 },
      { tile: { type: DOT, color: 'green' }, target: 20 },
      { tile: { type: DOT, color: 'yellow' }, target: 20 },
    ],
    blueprint: `
      * * X * * X * *
      * * X * * X * *
      * * X * * X * *
      * * X p * X * *
      * * X p * X * *
      * * X y p X * *
      * * X y p X * *
      * * X * * X * *
    `,
  },

  {
    id: 6,
    colors: ['pink', 'blue', 'green', 'yellow', 'red'],
    moves: 26,
    goals: [
      { tile: { type: DOT, color: 'red' }, target: 20 },
      { tile: { type: DOT, color: 'yellow' }, target: 20 },
    ],
    blueprint: `
      g g y p p
      p y g g b
      p y y g b
      r r y r g
      p b b r g
    `,
  },

  {
    id: 7,
    colors: ['pink', 'green', 'yellow', 'red'],
    moves: 30,
    goals: [
      { tile: { type: DOT, color: 'ping' }, target: 50 },
      { tile: { type: DOT, color: 'red' }, target: 50 },
      { tile: { type: DOT, color: 'green' }, target: 50 },
      { tile: { type: DOT, color: 'yellow' }, target: 50 },
    ],
    blueprint: `
      p r g y p p p
      p r g y p r p
      p r g y p p p
      p r g y y y y
      p r g g g g g
      p r r r r r r
      p p p p p p p
    `,
  }
]