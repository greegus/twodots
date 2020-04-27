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
