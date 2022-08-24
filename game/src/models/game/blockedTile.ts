import { Tile as BaseTile } from "@models";
import { Rotation } from "../level/tile";
import { Tile } from "./tile";
import { TileDimensions } from "./tileDimensions";

export class BlockedTile extends Tile {
  blocking = true;

  constructor(tile: BaseTile, size: TileDimensions, x: number, y: number) {
    super(tile, size, x, y);
  }

  public updateRotation(_rotation: Rotation) {
    // not needed every time the same texture
  }
}
