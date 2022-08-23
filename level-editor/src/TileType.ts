export enum TileType {
  Empty = "Empty",
  Blocked = "Blocked",
  Start = "Start",
  End = "End",
  Straight = "Straight",
  Cross = "Cross",
  TCross = "T",
  Bendy = "Bendy",
  Fisher = "Fisher",
  Factory = "Factory"
}

export enum Rotation {
  Left,
  Top,
  Right,
  Bottom,
}

export interface Tile {
  type: TileType;
  rotation: Rotation;
}

export interface FisherTile extends Tile {
  fishers?: {
    direction: Rotation;
    count: number;
  };
}
