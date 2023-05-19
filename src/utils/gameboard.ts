import { createWallTile, createDotTile, createAnchorTile, createRampTile } from '@/utils/tiles'
import { createIceModifier } from '@/utils/modifiers'
import { DotColors, type Gameboard, type Level, type Matrix, type Modifier, type Point, type Tile } from '@/types.d';
import { getNeighbourCells, patterns } from '@/utils/matrix';
import { isDot } from '@/utils/tiles';

export function generateGameboard({ colors, blueprint }: Level): Gameboard {
  const symbolToTileMap: Record<string, ((p: Point) => Tile) | undefined> = {
    '.': undefined,
    '*': position => createDotTile(position, colors),
    'r': position => createDotTile(position, DotColors.RED),
    'b': position => createDotTile(position, DotColors.BLUE),
    'y': position => createDotTile(position, DotColors.YELLOW),
    'g': position => createDotTile(position, DotColors.GREEN),
    'p': position => createDotTile(position, DotColors.PINK),
    't': position => createDotTile(position, DotColors.TEAL),
    'W': position => createWallTile(position),
    'A': position => createAnchorTile(position),
    'Rr': position => createRampTile(position, 'right'),
    'Rl': position => createRampTile(position, 'left')
  };

  const symbolToModifierMap: Record<string, ((p: Point) => Modifier) | undefined> = {
    'i': position => createIceModifier(position)
  }

  let width = 0, height = 0

  const modifiers: Modifier[] = []
  const tiles: Tile[] = []

  blueprint.trim().split("\n").forEach((row, y) => {
    height = y + 1

    row.trim().split(/\s+/).map((symbol, x) => {
      width = Math.max(width, x + 1)

      const position = { x, y }
      const [tileSymbol, modifierSymbol] = symbol.split(',')

      const tile = symbolToTileMap[tileSymbol]?.(position);

      if (tile) {
        tiles.push(tile)
      }

      const modifier = symbolToModifierMap[modifierSymbol]?.(position)

      if (modifier) {
        modifiers.push(modifier)
      }
    });
  });

  const size = {
    height,
    width
  };

  return {
    size,
    tiles,
    modifiers,
  };
}

export function getAvailableDotSquares(tilesMatrix: Matrix<Tile>): Tile[][] {
  return tilesMatrix.flat()
    .filter(isDot)
    .reduce((squares, tile) => {
      const squareTiles = getNeighbourCells<Tile>(tilesMatrix, tile.position, patterns.DOWN_SQUARE)
      const hasSameColor = squareTiles.every(tileInSquare => tileInSquare?.color === tile.color)

      if (hasSameColor && squareTiles.length === 4) {
        squares.push(squareTiles)
      }

      return squares
    }, [] as Tile[][])
}

export function hasAnyHorizontalMoves(tilesMatrix: Matrix<Tile>): boolean {
  return tilesMatrix.some((row, y) => {
    return row.some((tile, x) => {
      const rightTile = tilesMatrix[y]?.[x + 1]

      return tile?.color === rightTile?.color
    })
  })
}

export function hasAnyVerticalMoves(tilesMatrix: Matrix<Tile>): boolean {
  return tilesMatrix.some((row, y) => {
    return row.some((tile, x) => {
      const bottomTile = tilesMatrix[y + 1]?.[x]

      return tile?.color === bottomTile?.color
    })
  })
}
