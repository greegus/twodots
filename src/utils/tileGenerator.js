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

export function generateAnchorTile(position) {
  return {
    ...position,
    id: tileId++,
    type: config.tileTypes.ANCHOR
  }
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

  isDot,
  isBomb,
  isWall,
  isAnchor
}

