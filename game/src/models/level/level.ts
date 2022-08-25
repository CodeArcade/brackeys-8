import { Tile, Placeable } from "@models";

export interface Level {
  name: string;
  width: number;
  height: number;
  goalFishes: number;
  startFishes: number;
  tiles: Array<Array<Tile>>;
  placeables: Array<Placeable>;
}
