import tileGenerator from 'utils/tileGenerator'

export function generateMap(blueprint, colors) {
  const symbolToTileMap = {
    '.': undefined,
    '*': position => tileGenerator.generateDotTile(position, colors),
    'r': position => tileGenerator.generateDotTile(position, 'red'),
    'b': position => tileGenerator.generateDotTile(position, 'blue'),
    'y': position => tileGenerator.generateDotTile(position, 'yellow'),
    'g': position => tileGenerator.generateDotTile(position, 'green'),
    'p': position => tileGenerator.generateDotTile(position, 'pink'),
    'W': position => tileGenerator.generateWallTile(position),
    'A': position => tileGenerator.generateAnchorTile(position)
  };

  const tilesMatrix = blueprint
    .trim().split("\n").map((row, y) => {
      return row.trim().split(/\s+/).map((symbol, x) => {
          return symbolToTileMap[symbol] && symbolToTileMap[symbol]({ x, y });
        });
    });

  const size = {
    height: tilesMatrix.length,
    width: tilesMatrix[0].length
  };

  return {
    tiles: tilesMatrix.flatMap(row => row).filter(Boolean),
    size
  };
}