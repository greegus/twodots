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

export function getNeighbourTiles(tiles, mapTiles, pattern = PATTERN_CROSS) {
  tiles = [].concat(tiles)

  return tiles.reduce((acc, tile) => {
    return acc.concat(coordinatesMatrix
      .filter((_, index) => pattern[index])
      .map(([x, y]) => mapTiles.find(item => tile.x + x === item.x && tile.y + y === item.y))
      .filter(tile => tile && !acc.some(({ id }) => id === tile.id))
    )
  }, [])
}
