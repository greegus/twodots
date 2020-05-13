const offsetMatrix = [
  [-1,-1], [0,-1], [1,-1],
  [-1,0],  [0,0],  [1,0],
  [-1,1],  [0,1],  [1,1],
]

export const PATTERN_CROSS = [
  0, 1, 0,
  1, 0, 1,
  0, 1, 0
]

export const PATTERN_SQUARE = [
  1, 1, 1,
  1, 0, 1,
  1, 1, 1
]

export const PATTERN_DOWN_SQUARE = [
  0, 0, 0,
  0, 1, 1,
  0, 1, 1
]

export function createMatrix({ width, height }) {
  return [ ...Array(height) ].map(() => [ ...Array(width) ])
}

export function getMatrixRow(matrix, y) {
  return matrix[y]
}

export function getMatrixColumn(matrix, x) {
  return matrix.map(row => (row || [])[x])
}

export function getMatrixCell(matrix, {x, y}) {
  return (getMatrixRow(matrix, y) || [])[x]
}

export function setMatrixCell(matrix, {x, y}, value) {
  matrix[y][x] = value
}

const offsetPosition = (position, offset) => {
  return {
    x: position.x + (offset.x || 0),
    y: position.y + (offset.y || 0)
  }
}

export function getNeighbourCells(matrix, position, pattern = PATTERN_CROSS) {
  return offsetMatrix
    .filter((_, index) => pattern[index])
    .map(offset => offsetPosition(position, offset))
    .map(getMatrixCell)
}