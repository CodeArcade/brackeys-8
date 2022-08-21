import { Tile } from "./TileType";

export interface Level {
  name: string;
  width: number;
  height: number;
  startFishes: number;
  goalFishes: number;
  tiles: Tile[][];
}