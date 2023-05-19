export type Matrix<T = any> = T[][]

export type Player = {
  name: string;
  level: number;
  scoreByLevel: Record<number, number>;
}

export enum DotColors {
  BLUE = 'blue',
  RED = 'red',
  YELLOW = 'yellow',
  GREEN = 'green',
  PINK = 'pink',
  TEAL = 'teal'
}

export enum TileType {
  DOT = 'dot',
  WALL = 'wall',
  BOMB = 'bomb',
  ANCHOR = 'anchor',
  RAMP = 'ramp'
}

export enum ModifierType {
  ICE = 'ice'
}

export type Region = {
  name: string;
  background?: string;
  levels: LevelBlueprint[];
}

export type LevelBlueprint = {
  id: number;
  colors: DotColors[];
  moves: number;
  goals: Goal[];
  blueprint: string;
  theme?: Partial<Theme>;
  anchors?: {
    maximum: number;
    dedicatedColumns?: number[];
  };
}

export type Level = LevelBlueprint & {
  theme: Theme
}

export type Goal = {
  tile: { type: Tile, color?: DotColors };
  target: number;
} | {
  modifier: { type: Modifier };
  target: number;
}

export type Theme = {
  background?: string;
  colorMap: {
    dots: Record<DotColors, string>;
  }
}

export type Point = {
  x: number;
  y: number;
}

export type Size = {
  width: number;
  height: number;
}

export type MapObject = {
  id: string;
  position: Point;
}

// Tiles

export type WallTile = MapObject & {
  type: TileType.WALL;
  static?: boolean
}

export type DotTile = MapObject & {
  type: TileType.DOT;
  color: DotColors;
}

export type BombTile = MapObject & {
  type: TileType.BOMB;
  originalTile: Tile;
}

export type AnchorTile = MapObject & {
  type: TileType.ANCHOR;
}

export type RampTile = MapObject & {
  type: TileType.RAMP;
  orientation: 'left' | 'right';
  static?: boolean;
}

export type Tile = | WallTile | DotTile | BombTile | AnchorTile | RampTile;

// Modifiers

export type IceModifier = MapObject & {
  tile: Tile;
  type: ModifierType.ICE;
  cracks: number;
}

export type Modifier = IceModifier;

export type Gameboard = {
  tiles: Tile[];
  modifiers: Modifier[];
  size: Size
}