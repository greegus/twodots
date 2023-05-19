import { config } from '@/config'
import { getRandomItem } from '@/utils/array'
import type { Point, TileType, Tile, DotColors } from '@/types.d'

import DotTileComponent from '@/components/canvas/tiles/DotTile.vue'
import WallTileComponent from '@/components/canvas/tiles/WallTile.vue'
import BombTileComponent from '@/components/canvas/tiles/BombTile.vue'
import AnchorTileComponent from '@/components/canvas/tiles/AnchorTile.vue'
import RampTileComponent from '@/components/canvas/tiles/RampTile.vue'

import DotTilePreview from '@/components/canvas/tiles/previews/DotTile.vue'
import AnchorTilePreview from '@/components/canvas/tiles/previews/AnchorTile.vue'
import type { WallTile, DotTile, RampTile, BombTile, AnchorTile } from '@/types.d'
import type { Component } from 'vue'

let tileId = 1;

function createTile<T extends Tile>(position: Point, type: TileType, config: Partial<Omit<T, 'id' | 'position' | 'type'>> = {}): T {
  return {
    ...config,
    id: `tile.${tileId++}`,
    position,
    type
  } as T
}

export function createWallTile(position: Point) {
  return createTile<WallTile>(position, config.tileTypes.WALL, {
    static: true
  })
}

export function createDotTile(position: Point, colors: DotColors | DotColors[] = Object.values(config.dotColors)): DotTile {
  return createTile(position, config.tileTypes.DOT, {
    color: getRandomItem([].concat(colors))
  })
}

export function createBombTile(position: Point, originalTile: Tile) {
  return createTile<BombTile>(position, config.tileTypes.BOMB, {
    originalTile
  })
}

export function createAnchorTile(position: Point) {
  return createTile<AnchorTile>(position, config.tileTypes.ANCHOR)
}

export function createRampTile(position: Point, orientation: RampTile['orientation']) {
  return createTile<RampTile>(position, config.tileTypes.RAMP, {
    static: true,
    orientation
  })
}

export function isDot(tile: Tile): boolean {
  return tile?.type === config.tileTypes.DOT
}

export function isBomb(tile: Tile): boolean {
  return tile?.type === config.tileTypes.BOMB
}

export function isWall(tile: Tile): boolean {
  return tile?.type === config.tileTypes.WALL
}

export function isAnchor(tile: Tile): boolean {
  return tile?.type === config.tileTypes.ANCHOR
}

export function isRamp(tile: Tile): boolean {
  return tile?.type === config.tileTypes.RAMP
}

export function getTileComponent(type: TileType): Component {
  const typeToComponentMap = {
    [config.tileTypes.DOT]: DotTileComponent,
    [config.tileTypes.WALL]: WallTileComponent,
    [config.tileTypes.BOMB]: BombTileComponent,
    [config.tileTypes.ANCHOR]: AnchorTileComponent,
    [config.tileTypes.RAMP]: RampTileComponent
  }

  return typeToComponentMap[type]
}

export function getTilePreviewComponent(type: TileType): Component | undefined {
  const typeToComponentMap = {
    [config.tileTypes.DOT]: DotTilePreview,
    [config.tileTypes.ANCHOR]: AnchorTilePreview
  }

  return typeToComponentMap[type]
}