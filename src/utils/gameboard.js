import tileGenerator from 'utils/tileGenerator'
import { createIceModifier } from 'utils/modifiers'

export function generateGameboard(blueprint, colors) {
  const symbolToTileMap = {
    '.': undefined,
    '*': position => tileGenerator.generateDotTile(position, colors),
    'r': position => tileGenerator.generateDotTile(position, 'red'),
    'b': position => tileGenerator.generateDotTile(position, 'blue'),
    'y': position => tileGenerator.generateDotTile(position, 'yellow'),
    'g': position => tileGenerator.generateDotTile(position, 'green'),
    'p': position => tileGenerator.generateDotTile(position, 'pink'),
    't': position => tileGenerator.generateDotTile(position, 'teal'),
    'W': position => tileGenerator.generateWallTile(position),
    'A': position => tileGenerator.generateAnchorTile(position),
    'Rr': position => tileGenerator.generateRampTile(position, 'right'),
    'Rl': position => tileGenerator.generateRampTile(position, 'left')
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