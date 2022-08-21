export enum TileType {
  Empty,
  Blocked,
  Start,
  End,
}

export enum Rotation {
  Left,
  Top,
  Right,
  Bottom
}

export interface Tile {
  type: TileType
  rotation: Rotation;
}