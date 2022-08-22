export interface Tile {
  type: string;
  rotation: Rotation;
}

export enum Rotation {
  Left,
  Top,
  Right,
  Bottom,
}

export enum Type {
  Empty = "Empty",
  Blocked = "Blocked",
  Start = "Start",
  End = "End",
}
