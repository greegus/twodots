const offsetMatrix = [
  [-1,-1], [0,-1], [1,-1],
  [-1,0],  [0,0],  [1,0],
  [-1,1],  [0,1],  [1,1],
]

export const patterns = {
  CROSS: [
    0, 1, 0,
    1, 0, 1,
    0, 1, 0
  ],

  SQUARE: [
    1, 1, 1,
    1, 0, 1,
    1, 1, 1
  ],

  DOWN_SQUARE: [
    0, 0, 0,
    0, 1, 1,
    0, 1, 1
  ]
}

export function createMatrix({ width, height }) {
  return [ ...Array(height) ].map(() => [ ...Array(width) ])
}

export function getMatrixRow(matrix, y) {
  return matrix[y]
}

export function getMatrixColumn(matrix, x) {
  return matrix.map(row => (row || [])[x])
}

export function getMatrixCell(matrix, { x, y }) {
  return (getMatrixRow(matrix, y) || [])[x]
}

export function setMatrixCell(matrix, { x, y }, value) {
  matrix[y][x] = value
}

export function getNeighbourCells(matrix, position, pattern = patterns.CROSS) {
  return offsetMatrix
    .filter((_, index) => pattern[index])
    .map(([x, y]) => getMatrixCell(matrix, { x: position.x + x, y: position.y + y }))
}