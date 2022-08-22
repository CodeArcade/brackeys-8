import { Tile, Placeable } from "@models";

export interface Level {
  width: number;
  height: number;
  goalFishes: number;
  startFishes: number;
  tiles: Array<Array<Tile>>;
  placeables: Array<Placeable>;
}
