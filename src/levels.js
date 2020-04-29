import config from 'config'

import aquaBackground from 'assets/images/backgrounds/aqua.svg'

const { DOT, ANCHOR } = config.tileTypes

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
      * * W * * W * *
      * * W * * W * *
      * * W * * W * *
      * * W p * W * *
      * * W p * W * *
      * * W y p W * *
      * * W y p W * *
      * * W * * W * *
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
      { tile: { type: DOT, color: 'pink' }, target: 50 },
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
  },

  {
    id: 8,
    colors: ['pink', 'blue', 'red', 'yellow'],
    moves: 23,
    goals: [
      { tile: { type: DOT, color: 'pink' }, target: 15 },
      { tile: { type: DOT, color: 'blue' }, target: 15 },
      { tile: { type: DOT, color: 'red' }, target: 15 },
      { tile: { type: DOT, color: 'yellow' }, target: 15 },
    ],
    blueprint: `
      b b b y
      y p b y
      W W r b
      p y y r
      p p W W
      y b r y
      b y r r
    `,
  },

  {
    id: 9,
    colors: ['blue', 'red'],
    moves: 33,
    goals: [
      { tile: { type: DOT, color: 'blue' }, target: 80 },
      { tile: { type: DOT, color: 'red' }, target: 80 },
    ],
    blueprint: `
      r r r W r r b
      b W r W b W b
      b r b r r r b
      W W r W r W W
      r r r b r b b
      r W b W r W b
      b b r W b b b
    `,
  },

  {
    id: 10,
    colors: ['blue', 'red', 'green', 'yellow'],
    moves: 42,
    goals: [
      { tile: { type: DOT, color: 'blue' }, target: 30 },
      { tile: { type: DOT, color: 'red' }, target: 30 },
      { tile: { type: DOT, color: 'green' }, target: 30 },
      { tile: { type: DOT, color: 'yellow' }, target: 30 },
    ],
    blueprint: `
      r y g r g r
      W r g r r W
      W W g b W W
      y y r r b b
      r r b g y y
    `,
  },

  {
    id: 11,
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
    background: aquaBackground,
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
    background: aquaBackground,
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
    background: aquaBackground,
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
    background: aquaBackground,
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
    background: aquaBackground,
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
    background: aquaBackground,
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
    background: aquaBackground,
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
    background: aquaBackground,
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
    background: aquaBackground,
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
    background: aquaBackground,
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
    background: aquaBackground,
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
    background: aquaBackground,
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
    background: aquaBackground,
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
    background: aquaBackground,
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
    background: aquaBackground,
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
    background: aquaBackground,
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
    background: aquaBackground,
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
  },
]