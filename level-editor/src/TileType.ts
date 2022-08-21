export enum TileType {
  Empty = "Empty",
  Blocked = "Blocked",
  Start = "Start",
  End = "End",
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