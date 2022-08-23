export enum TileType {
  Empty = "Empty",
  Blocked = "Blocked",
  Start = "Start",
  End = "End",
  Straight = "Straight",
  Cross = "Cross",
  TCross = "T",
  Bendy = "Bendy"
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