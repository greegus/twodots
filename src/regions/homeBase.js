import config from 'config'

const { DOT } = config.tileTypes
const { BLUE, RED, YELLOW, GREEN, PINK } = config.dotColors

export default {
  name: 'Homebase',

  background: '#DF8E58',

  levels: [
    {
      id: 1,
      colors: [BLUE, RED, YELLOW],
      moves: 20,
      goals: [
        {tile: { type: DOT, color: RED }, target: 15},
        {tile: { type: DOT, color: BLUE }, target: 15},
        {tile: { type: DOT, color: YELLOW }, target: 15},
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
      colors: [GREEN, YELLOW, RED, BLUE],
      moves: 30,
      goals: [
        { tile: { type: DOT, color: GREEN }, target: 15 },
        { tile: { type: DOT, color: YELLOW }, target: 15 },
        { tile: { type: DOT, color: RED }, target: 15 },
        { tile: { type: DOT, color: BLUE }, target: 15 },
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
      colors: [GREEN, YELLOW, RED, BLUE],
      moves: 20,
      goals: [
        { tile: { type: DOT, color: RED }, target: 50 },
        { tile: { type: DOT, color: BLUE }, target: 50 },
        { tile: { type: DOT, color: YELLOW }, target: 50 },
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
      colors: [PINK, RED, GREEN, YELLOW],
      moves: 20,
      goals: [
        { tile: { type: DOT, color: PINK }, target: 15 },
        { tile: { type: DOT, color: RED }, target: 15 },
        { tile: { type: DOT, color: GREEN }, target: 15 },
        { tile: { type: DOT, color: YELLOW }, target: 15 },
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
      colors: [PINK, BLUE, GREEN, YELLOW],
      moves: 26,
      goals: [
        { tile: { type: DOT, color: PINK }, target: 20 },
        { tile: { type: DOT, color: BLUE }, target: 20 },
        { tile: { type: DOT, color: GREEN }, target: 20 },
        { tile: { type: DOT, color: YELLOW }, target: 20 },
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
      colors: [PINK, BLUE, GREEN, YELLOW, RED],
      moves: 26,
      goals: [
        { tile: { type: DOT, color: RED }, target: 20 },
        { tile: { type: DOT, color: YELLOW }, target: 20 },
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
      colors: [PINK, GREEN, YELLOW, RED],
      moves: 30,
      goals: [
        { tile: { type: DOT, color: PINK }, target: 50 },
        { tile: { type: DOT, color: RED }, target: 50 },
        { tile: { type: DOT, color: GREEN }, target: 50 },
        { tile: { type: DOT, color: YELLOW }, target: 50 },
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
      colors: [PINK, BLUE, RED, YELLOW],
      moves: 23,
      goals: [
        { tile: { type: DOT, color: PINK }, target: 15 },
        { tile: { type: DOT, color: BLUE }, target: 15 },
        { tile: { type: DOT, color: RED }, target: 15 },
        { tile: { type: DOT, color: YELLOW }, target: 15 },
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
      colors: [BLUE, RED],
      moves: 33,
      goals: [
        { tile: { type: DOT, color: BLUE }, target: 80 },
        { tile: { type: DOT, color: RED }, target: 80 },
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
      colors: [BLUE, RED, GREEN, YELLOW],
      moves: 42,
      goals: [
        { tile: { type: DOT, color: BLUE }, target: 30 },
        { tile: { type: DOT, color: RED }, target: 30 },
        { tile: { type: DOT, color: GREEN }, target: 30 },
        { tile: { type: DOT, color: YELLOW }, target: 30 },
      ],
      blueprint: `
        r y g r g r
        W r g r r W
        W W g b W W
        y y r r b b
        r r b g y y
      `,
    },
  ]
}
