const coordinatesMatrix = [
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

export function getNeighbourTiles(tile, tiles, pattern = PATTERN_CROSS) {
  return coordinatesMatrix
    .filter((_, index) => pattern[index])
    .map(([x, y]) => tiles.find(item => tile.x + x === item.x && tile.y + y === item.y))
    .filter(Boolean)
}
