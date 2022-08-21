import { Tile } from "@models";

export interface EndTile extends Tile {
  requirement: number;
}