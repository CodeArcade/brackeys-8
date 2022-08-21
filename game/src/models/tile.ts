export interface Tile {
    id: number;
    rotation: Rotation;
}

export enum Rotation {
  Left,
  Top,
  Right,
  Bottom
}