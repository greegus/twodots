import { createWallTile, createDotTile, createAnchorTile, createRampTile } from 'utils/tiles'
import { createIceModifier } from 'utils/modifiers'

export function generateGameboard(blueprint, colors) {
  const symbolToTileMap = {
    '.': undefined,
    '*': position => createDotTile(position, colors),
    'r': position => createDotTile(position, 'red'),
    'b': position => createDotTile(position, 'blue'),
    'y': position => createDotTile(position, 'yellow'),
    'g': position => createDotTile(position, 'green'),
    'p': position => createDotTile(position, 'pink'),
    't': position => createDotTile(position, 'teal'),
    'W': position => createWallTile(position),
    'A': position => createAnchorTile(position),
    'Rr': position => createRampTile(position, 'right'),
    'Rl': position => createRampTile(position, 'left')
  };

  const symbolToModifierMap = {
    'i': position => createIceModifier(position)
  }

  let width = 0, height = 0

  const modifiers = []
  const tiles = []

  blueprint.trim().split("\n").forEach((row, y) => {
    height = y + 1

    row.trim().split(/\s+/).map((symbol, x) => {
      width = Math.max(width, x + 1)

      const position = { x, y }
      const [tileSymbol, modifierSymbol] = symbol.split(',')

      const tile = symbolToTileMap[tileSymbol] && symbolToTileMap[tileSymbol](position);

      if (tile) {
        tiles.push(tile)
      }

      const modifier = symbolToModifierMap[modifierSymbol] && symbolToModifierMap[modifierSymbol](position)

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