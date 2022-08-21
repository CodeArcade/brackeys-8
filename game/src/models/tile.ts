export interface Tile {
    type: string;
    rotation: Rotation;
}

export enum Rotation {
  Left,
  Top,
  Right,
  Bottom
}