import type { Matrix, Point, Size } from "@/types"

const offsetMatrix = [
  [-1, -1], [0, -1], [1, -1],
  [-1, 0], [0, 0], [1, 0],
  [-1, 1], [0, 1], [1, 1],
]

type FilterPattern = [
  0 | 1, 0 | 1, 0 | 1,
  0 | 1, 0 | 1, 0 | 1,
  0 | 1, 0 | 1, 0 | 1
]

export const patterns: Record<'CROSS' | 'SQUARE' | 'DOWN_SQUARE', FilterPattern> = {
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

export function createMatrix<T = any>({ width, height }: Size): T[][] {
  return [...Array(height)].map(() => [...Array(width)])
}

export function getMatrixRow<T = unknown>(matrix: Matrix<T>, y: number): T[] {
  return matrix[y]
}

export function getMatrixColumn<T = unknown>(matrix: Matrix<T>, x: number): T[] {
  return matrix.map(row => (row || [])[x])
}

export function getMatrixCell<T = unknown>(matrix: Matrix<T>, { x, y }: Point): T | undefined {
  return (getMatrixRow(matrix, y) || [])[x]
}

export function setMatrixCell<T = unknown>(matrix: Matrix<T>, { x, y }: Point, value: T) {
  matrix[y][x] = value
}

export function getNeighbourCells<T = unknown>(matrix: Matrix, position: Point, pattern: FilterPattern = patterns.CROSS): T[] {
  return offsetMatrix
    .filter((_, index) => pattern[index])
    .map(([x, y]) => getMatrixCell(matrix, { x: position.x + x, y: position.y + y }))
    .filter(Boolean)
}
