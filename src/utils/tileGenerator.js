import config from 'config'

import { getRandomItem } from 'utils/array'

let tileId = 1;

function generateTile(position, type, config = {}) {
  return {
    ...position,
    ...config,
    type,
    id: tileId++
  }
}

export function generateWallTile(position) {
  return generateTile(position, config.tileTypes.WALL, {
    fixed: true
  })
}

export function generateDotTile(position, colors = config.dotColors) {
  return generateTile(position, config.tileTypes.DOT, {
    color: getRandomItem([].concat(colors))
  })
}

export function generateBombTile(position, originalTile) {
  return generateTile(position, config.tileTypes.BOMB, {
    originalTile
  })
}

export function generateAnchorTile(position) {
  return generateTile(position, config.tileTypes.ANCHOR)
}

export function generateRampTile(position, direction) {
  return generateTile(position, config.tileTypes.RAMP, {
    fixed: true,
    direction
  })
}

export function isDot(tile) {
  return tile.type === config.tileTypes.DOT
}

export function isBomb(tile) {
  return tile.type === config.tileTypes.BOMB
}

export function isWall(tile) {
  return tile.type === config.tileTypes.WALL
}

export function isAnchor(tile) {
  return tile.type === config.tileTypes.ANCHOR
}

export default {
  generateWallTile,
  generateDotTile,
  generateBombTile,
  generateAnchorTile,
  generateRampTile,

  isDot,
  isBomb,
  isWall,
  isAnchor
}

