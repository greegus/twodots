export default [
  {
    id: 1,
    colors: ['blue', 'red', 'yellow'],
    moves: 20,
    goals: [
      {tile: { type: 'dot', color: 'red' }, target: 15},
      {tile: { type: 'dot', color: 'blue' }, target: 15},
      {tile: { type: 'dot', color: 'yellow' }, target: 15},
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
    colors: ['blue', 'red', 'green', 'purple'],
    moves: 12,
    goals: [
      { tile: { type: 'dot', color: 'red' }, target: 1 },
      { tile: { type: 'dot', color: 'blue' }, target: 1 },
      { tile: { type: 'dot', color: 'green' }, target: 1 }
    ],
    blueprint: `
      * * * * *
      * * * * *
      * * * * *
      r r * * *
      r r * * *
    `,
  }
]