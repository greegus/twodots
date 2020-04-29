import config from 'config'

const { DOT, ANCHOR } = config.tileTypes

const theme = {
  background: `url(${require('assets/images/backgrounds/aqua.svg')}) repeat center`
}

export default [
  {
    id: 11,
    theme,
    colors: ['green', 'pink', 'blue'],
    moves: 20,
    maxAnchors: 2,
    goals: [
      { tile: { type: ANCHOR }, target: 4 },
    ],
    blueprint: `
      g p b p g
      g p b p g
      g b A b g
      g p b p g
      g p b p g
    `,
  },

  {
    id: 12,
    theme,
    colors: ['green', 'pink', 'blue', 'red', 'yellow'],
    moves: 18,
    maxAnchors: 0,
    goals: [
      { tile: { type: ANCHOR }, target: 2 },
    ],
    blueprint: `
      y A p b A r
      r y p y r g
      p y r p g y
      g y p g b y
      p y r g y p
      r y r b p p
    `,
  },

  {
    id: 13,
    theme,
    colors: ['green', 'blue', 'red', 'yellow'],
    moves: 20,
    maxAnchors: 0,
    goals: [
      { tile: { type: ANCHOR }, target: 6 },
    ],
    blueprint: `
      b A A A A A A b
      r r g b g g b y
      g b g b b r g y
      b y g r b b g r
      g r g r r y g b
    `,
  },

  {
    id: 14,
    theme,
    colors: ['blue', 'red', 'yellow'],
    moves: 30,
    maxAnchors: 2,
    goals: [
      { tile: { type: ANCHOR }, target: 10 },
      { tile: { type: DOT, color: 'red' }, target: 40 },
      { tile: { type: DOT, color: 'yellow' }, target: 35 },
      { tile: { type: DOT, color: 'blue' }, target: 10 },
    ],
    blueprint: `
      A W W A
      r r b y
      r r r r
      b y y y
      y y y y
    `,
  },

  {
    id: 15,
    theme,
    colors: ['blue', 'yellow', 'green'],
    moves: 30,
    maxAnchors: 1,
    goals: [
      { tile: { type: ANCHOR }, target: 5 },
    ],
    blueprint: `
      g g p p
      b p y b
      b p p p
      W b b b
      W g g b
      g b p y
      g b y p
    `,
  },

  {
    id: 16,
    theme,
    colors: ['blue', 'yellow', 'green', 'blue', 'pink', 'red'],
    moves: 35,
    goals: [
      { tile: { type: DOT, color: 'pink' }, target: 35 },
      { tile: { type: DOT, color: 'blue' }, target: 30 },
      { tile: { type: DOT, color: 'yellow' }, target: 25 },
    ],
    blueprint: `
      * * * * * * *
      * * * * * * *
      * * * * * * *
      W * * * * * W
      W * * * * * W
      W * p p p * W
      W W p p p W W
    `,
  },

  {
    id: 17,
    theme,
    colors: ['red', 'green', 'blue'],
    moves: 29,
    goals: [
      { tile: { type: ANCHOR }, target: 16 },
      { tile: { type: DOT, color: 'blue' }, target: 50 },
      { tile: { type: DOT, color: 'red' }, target: 40 },
      { tile: { type: DOT, color: 'green' }, target: 30 },
    ],
    blueprint: `
      A * * * A
      * A * A *
      * * A * *
      * * * * *
    `,
  },

  {
    id: 18,
    theme,
    colors: ['red', 'green', 'pink', 'yellow'],
    moves: 27,
    goals: [
      { tile: { type: ANCHOR }, target: 7 },
    ],
    blueprint: `
      A W g g W A
      * W g g W *
      * * W W * *
      * * * * * *
      * * * * * *
      * * * * * *
      * * * * * *
      * * * * * *
    `,
  },

  {
    id: 19,
    theme,
    colors: ['red', 'green', 'pink', 'yellow', 'blue'],
    moves: 31,
    goals: [
      { tile: { type: ANCHOR }, target: 8 },
    ],
    blueprint: `
      * A * A * A *
      W W W W W W W
      * * * * * * *
      * * * * * * *
      * * * * * * *
      * * * * * * *
      * * * * * * *
      * * * * * * *
    `,
  },

  {
    id: 20,
    theme,
    colors: ['red', 'green', 'pink', 'blue'],
    moves: 39,
    goals: [
      { tile: { type: ANCHOR }, target: 9 },
    ],
    blueprint: `
      A * * A * * A
      * * * * * * *
      * * * * * * *
      * * * * * * *
    `,
  },

  {
    id: 21,
    theme,
    colors: ['red', 'pink', 'blue'],
    moves: 40,
    goals: [
      { tile: { type: ANCHOR }, target: 10 },
    ],
    blueprint: `
      *  * * * *
      *  * * * *
      *  * * * *
      *  * * * *
      Rr * * * Rl
      W  * * * W
      W  * * * W
    `,
  },

  {
    id: 22,
    theme,
    colors: ['red', 'pink', 'blue', 'green'],
    moves: 17,
    goals: [
      { tile: { type: ANCHOR }, target: 4 },
    ],
    blueprint: `
      * A A A *
      * * * * *
      * * * * *
      * * * * *
      * * * * *
    `,
  },

  {
    id: 23,
    theme,
    colors: ['red', 'pink', 'blue', 'green'],
    moves: 30,
    goals: [
      { tile: { type: DOT, color: 'pink' }, target: 36 },
      { tile: { type: DOT, color: 'red' }, target: 36 },
      { tile: { type: DOT, color: 'blue' }, target: 36 },
      { tile: { type: DOT, color: 'green' }, target: 36 },
    ],
    blueprint: `
      * * * *
      * * * *
      * W W *
      * W W *
      * r * *
      * r r *
      * * r *
      W g g W
      * g * *
    `,
  },

  {
    id: 24,
    theme,
    colors: ['red', 'pink', 'blue', 'green'],
    moves: 33,
    goals: [
      { tile: { type: ANCHOR }, target: 8 },
    ],
    blueprint: `
      A * * * A
      * * A * *
      * * * * *
      W * * * W
      W * * * W
      * * * * *
      * * * * *
      * * * * *
    `,
  },

  {
    id: 25,
    theme,
    colors: ['red', 'pink', 'yellow', 'green'],
    moves: 21,
    goals: [
      { tile: { type: DOT, color: 'pink' }, target: 80 },
      { tile: { type: DOT, color: 'red' }, target: 70 },
      { tile: { type: DOT, color: 'green' }, target: 60 },
      { tile: { type: DOT, color: 'yellow' }, target: 50 },
    ],
    blueprint: `
      * * * * * * *
      * * * * * * *
      * * * * * * *
      * * * * * * *
      * * * * * * *
      * * * * * * *
    `,
  },

  {
    id: 26,
    theme,
    colors: ['blue', 'pink', 'yellow', 'green'],
    moves: 31,
    goals: [
      { tile: { type: DOT, color: 'pink' }, target: 44 },
      { tile: { type: DOT, color: 'blue' }, target: 44 },
      { tile: { type: DOT, color: 'green' }, target: 44 },
      { tile: { type: DOT, color: 'yellow' }, target: 44 },
    ],
    blueprint: `
      g g g g g
      g W W W g
      y y W b b
      p p W p p
      p W W W p
      p p p p p
      y y g b b
      y g g g b
    `,
  },

  {
    id: 27,
    theme,
    colors: ['blue', 'pink', 'yellow', 'green', 'red'],
    moves: 30,
    goals: [
      { tile: { type: ANCHOR }, target: 9 },
    ],
    blueprint: `
     * * * * * * *
     * * * * * * *
     * * * * * * *
     * * r r * * *
     * * r r * * *
     * * * * * * *
     W A A A A A W
     p b g r g b y
    `,
  },

  {
    id: 28,
    theme,
    colors: ['blue', 'pink', 'yellow', 'green', 'red'],
    moves: 17,
    goals: [
      { tile: { type: ANCHOR }, target: 4 },
    ],
    blueprint: `
     W W W A A W W W
     W W W * * W W W
     W W W * * W W W
     W W * g g * W W
     W W * g g * W W
     W * * * * * * W
     W * * y y * * W
     * * * y y * * *
    `,
  },

  {
    id: 29,
    theme,
    colors: ['blue', 'pink', 'yellow', 'green', 'red'],
    moves: 32,
    goals: [
      { tile: { type: ANCHOR }, target: 6 },
    ],
    blueprint: `
     W W W A  W  W W W
     W W W *  W  W W W
     W W * Rr p  W W W
     W * * W  p  p W W
     * * * r  Rl * * *
     * * r r  W  * * *
     * * * Rr g  * * *
     * * * W  g  g * *
    `,
  },

  {
    id: 30,
    theme,
    colors: ['blue', 'pink', 'yellow', 'green', 'red'],
    moves: 20,
    goals: [
      { tile: { type: ANCHOR }, target: 9 },
    ],
    blueprint: `
     * * * A A * * *
     * * * g b * * *
     * * * r r * * *
     * * * b r * * *
     * W * r r * W *
     * W * b b * W *
    `,
  },

  {
    id: 31,
    theme,
    colors: ['blue', 'pink', 'yellow', 'red'],
    moves: 39,
    goals: [
      { tile: { type: DOT, color: 'pink' }, target: 28 },
      { tile: { type: DOT, color: 'blue' }, target: 28 },
      { tile: { type: DOT, color: 'red' }, target: 28 },
      { tile: { type: DOT, color: 'yellow' }, target: 28 },
      { tile: { type: ANCHOR }, target: 7 },
    ],
    blueprint: `
      W W W W W W
      W * * * * W
      * * * * * *
      * * * * * *
      * * * * * *
      * * * * * *
      W W W W W W
      W A A A A W
      W * * * * W
      `,
  },

  {
    id: 32,
    theme,
    colors: ['blue', 'pink', 'green', 'red', 'yellow'],
    moves: 29,
    goals: [
      { tile: { type: ANCHOR }, target: 12 },
    ],
    blueprint: `
      W A A A A A A W
      W W W W W W W W
      * * * * * * * *
      * * * * * * * *
      * * * * * * * *
      * * * * * * * *
      * * * * * * * *
      * * * * * * * *
      `,
  },

  {
    id: 33,
    theme,
    colors: ['blue', 'pink', 'green', 'red', 'yellow'],
    moves: 31,
    goals: [
      { tile: { type: ANCHOR }, target: 5 },
    ],
    blueprint: `
      A W A W A W A
      * W * W * W *
      * * * * * * *
      * * * * * * *
      * * * * * * *
      * * * * * * *
      * * * * * * *
      * W * W * W *
      `,
  },

  {
    id: 34,
    theme,
    colors: ['blue', 'pink', 'green', 'red', 'yellow'],
    moves: 35,
    goals: [
      { tile: { type: ANCHOR }, target: 9 },
    ],
    blueprint: `
      * A * A A * A *
      * * * * * * * *
      * * * * * * * *
      * * * * * * * *
      * * * * * * * *
      * * * * * * * *
      * * * * * * * *
      * W W W W W W *
      * * * * * * * *
      `,
  },

  {
    id: 35,
    theme,
    colors: ['blue', 'pink', 'green', 'red', 'yellow'],
    moves: 33,
    goals: [
      { tile: { type: DOT, color: 'pink' }, target: 24 },
      { tile: { type: DOT, color: 'blue' }, target: 24 },
      { tile: { type: DOT, color: 'red' }, target: 24 },
      { tile: { type: DOT, color: 'green' }, target: 24 },
      { tile: { type: ANCHOR }, target: 9 },
    ],
    blueprint: `
      y A W * * * * *
      A g W * * * * *
      g A W * * * * *
      A r W * * * * *
      r A W * * * * *
      A b W * * * * *
      b p W * * * * *
      `,
  }
]