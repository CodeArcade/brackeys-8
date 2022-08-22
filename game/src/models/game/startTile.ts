import { Tile as BaseTile } from "@models";
import { Tile } from "./tile";
import { TileDimensions } from "./tileDimensions";

export class BlockedTile extends Tile {
  constructor(tile: BaseTile, size: TileDimensions, x: number, y: number) {
    super(tile, "blockedTile", size, x, y);
  }
}
