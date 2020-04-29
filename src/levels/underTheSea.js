import config from 'config'

const { DOT, ANCHOR } = config.tileTypes
const { BLUE, RED, YELLOW, GREEN, PINK } = config.dotColors

const theme = {
  background: `url(${require('assets/images/backgrounds/aqua.svg')}) repeat center`
}

export default [
  {
    id: 11,
    theme,
    colors: [GREEN, PINK, BLUE],
    moves: 20,
    goals: [
      { tile: { type: ANCHOR }, target: 4 },
    ],
    anchors: {
      maximum: 2
    },
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
    colors: [GREEN, PINK, BLUE, RED, YELLOW],
    moves: 18,
    goals: [
      { tile: { type: ANCHOR }, target: 2 },
    ],
    anchors: {
      maximum: 0
    },
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
    colors: [GREEN, BLUE, RED, YELLOW],
    moves: 20,
    goals: [
      { tile: { type: ANCHOR }, target: 6 },
    ],
    anchors: {
      maximum: 0
    },
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
    colors: [BLUE, RED, YELLOW],
    moves: 30,
    goals: [
      { tile: { type: ANCHOR }, target: 10 },
      { tile: { type: DOT, color: RED }, target: 40 },
      { tile: { type: DOT, color: YELLOW }, target: 35 },
      { tile: { type: DOT, color: BLUE }, target: 10 },
    ],
    anchors: {
      maximum: 2
    },
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
    colors: [BLUE, YELLOW, GREEN],
    moves: 30,
    goals: [
      { tile: { type: ANCHOR }, target: 5 },
    ],
    anchors: {
      maximum: 1
    },
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
    colors: [BLUE, YELLOW, GREEN, PINK, RED],
    moves: 35,
    goals: [
      { tile: { type: DOT, color: PINK }, target: 35 },
      { tile: { type: DOT, color: BLUE }, target: 30 },
      { tile: { type: DOT, color: YELLOW }, target: 25 },
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
    colors: [RED, GREEN, BLUE],
    moves: 29,
    goals: [
      { tile: { type: ANCHOR }, target: 16 },
      { tile: { type: DOT, color: BLUE }, target: 50 },
      { tile: { type: DOT, color: RED }, target: 40 },
      { tile: { type: DOT, color: GREEN }, target: 30 },
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
    colors: [RED, GREEN, PINK, YELLOW],
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
    colors: [RED, GREEN, PINK, YELLOW, BLUE],
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
    colors: [RED, GREEN, PINK, BLUE],
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
    colors: [RED, PINK, BLUE],
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
    colors: [RED, PINK, BLUE, GREEN],
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
    colors: [RED, PINK, BLUE, GREEN],
    moves: 30,
    goals: [
      { tile: { type: DOT, color: PINK }, target: 36 },
      { tile: { type: DOT, color: RED }, target: 36 },
      { tile: { type: DOT, color: BLUE }, target: 36 },
      { tile: { type: DOT, color: GREEN }, target: 36 },
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
    colors: [RED, PINK, BLUE, GREEN],
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
    colors: [RED, PINK, YELLOW, GREEN],
    moves: 21,
    goals: [
      { tile: { type: DOT, color: PINK }, target: 80 },
      { tile: { type: DOT, color: RED }, target: 70 },
      { tile: { type: DOT, color: GREEN }, target: 60 },
      { tile: { type: DOT, color: YELLOW }, target: 50 },
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
    colors: [BLUE, PINK, YELLOW, GREEN],
    moves: 31,
    goals: [
      { tile: { type: DOT, color: PINK }, target: 44 },
      { tile: { type: DOT, color: BLUE }, target: 44 },
      { tile: { type: DOT, color: GREEN }, target: 44 },
      { tile: { type: DOT, color: YELLOW }, target: 44 },
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
    colors: [BLUE, PINK, YELLOW, GREEN, RED],
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
    colors: [BLUE, PINK, YELLOW, GREEN, RED],
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
    colors: [BLUE, PINK, YELLOW, GREEN, RED],
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
    colors: [BLUE, PINK, YELLOW, GREEN, RED],
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
    colors: [BLUE, PINK, YELLOW, RED],
    moves: 39,
    goals: [
      { tile: { type: DOT, color: PINK }, target: 28 },
      { tile: { type: DOT, color: BLUE }, target: 28 },
      { tile: { type: DOT, color: RED }, target: 28 },
      { tile: { type: DOT, color: YELLOW }, target: 28 },
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
    colors: [BLUE, PINK, GREEN, RED, YELLOW],
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
    colors: [BLUE, PINK, GREEN, RED, YELLOW],
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
    colors: [BLUE, PINK, GREEN, RED, YELLOW],
    moves: 35,
    goals: [
      { tile: { type: ANCHOR }, target: 9 },
    ],
    anchors: {
      maximum: 3,
    },
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
    colors: [BLUE, PINK, GREEN, RED, YELLOW],
    moves: 33,
    goals: [
      { tile: { type: DOT, color: PINK }, target: 24 },
      { tile: { type: DOT, color: BLUE }, target: 24 },
      { tile: { type: DOT, color: RED }, target: 24 },
      { tile: { type: DOT, color: GREEN }, target: 24 },
      { tile: { type: ANCHOR }, target: 9 },
    ],
    anchors: {
      maximum: 2,
      dedicatedColumns: [0, 1]
    },
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