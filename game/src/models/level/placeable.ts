import { Tile } from "./tile";

export interface Placeable extends Tile {
  count: number;
  texture?: string;
}
