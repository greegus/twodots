import config from 'config'

import { getRandomItem } from 'utils/array'

let tileId = 1;

export function generateWallTile(position) {
  return {
    ...position,
    id: tileId++,
    type: config.tileTypes.WALL,
    fixed: true
  };
}

export function generateDotTile(position, colors = config.dotColors) {
  return {
    ...position,
    id: tileId++,
    type: config.tileTypes.DOT,
    color: getRandomItem([].concat(colors))
  };
}

export function generateBombTile(position, originalTile) {
  return {
    ...position,
    originalTile,
    id: tileId++,
    type: config.tileTypes.BOMB
  }
}

export default {
  generateWallTile,
  generateDotTile,
  generateBombTile
}

