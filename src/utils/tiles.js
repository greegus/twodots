import config from 'config'

import { getRandomItem } from 'utils/array'

import DotTile from 'components/canvas/tiles/DotTile'
import WallTile from 'components/canvas/tiles/WallTile'
import BombTile from 'components/canvas/tiles/BombTile'
import AnchorTile from 'components/canvas/tiles/AnchorTile'
import RampTile from 'components/canvas/tiles/RampTile'

import DotTilePreview from 'components/canvas/tiles/previews/DotTile'
import AnchorTilePreview from 'components/canvas/tiles/previews/AnchorTile'

let tileId = 1;

function createTile(position, type, config = {}) {
  return {
    ...config,
    ...position,
    id: `tile.${tileId++}`,
    type
  }
}

export function createWallTile(position) {
  return createTile(position, config.tileTypes.WALL, {
    static: true
  })
}

export function createDotTile(position, colors = config.dotColors) {
  return createTile(position, config.tileTypes.DOT, {
    color: getRandomItem([].concat(colors))
  })
}

export function createBombTile(position, originalTile) {
  return createTile(position, config.tileTypes.BOMB, {
    originalTile
  })
}

export function createAnchorTile(position) {
  return createTile(position, config.tileTypes.ANCHOR)
}

export function createRampTile(position, orientation) {
  return createTile(position, config.tileTypes.RAMP, {
    static: true,
    orientation
  })
}

export function isDot(tile) {
  return tile?.type === config.tileTypes.DOT
}

export function isBomb(tile) {
  return tile?.type === config.tileTypes.BOMB
}

export function isWall(tile) {
  return tile?.type === config.tileTypes.WALL
}

export function isAnchor(tile) {
  return tile?.type === config.tileTypes.ANCHOR
}

export function isRamp(tile) {
  return tile?.type === config.tileTypes.RAMP
}

export function getTileComponent(type) {
  return {
    [config.tileTypes.DOT]: DotTile,
    [config.tileTypes.WALL]: WallTile,
    [config.tileTypes.BOMB]: BombTile,
    [config.tileTypes.ANCHOR]: AnchorTile,
    [config.tileTypes.RAMP]: RampTile
  }[type]
}

export function getTilePreviewComponent(type) {
  return {
    [config.tileTypes.DOT]: DotTilePreview,
    [config.tileTypes.ANCHOR]: AnchorTilePreview
  }[type]
}