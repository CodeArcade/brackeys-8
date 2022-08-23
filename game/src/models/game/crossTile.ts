import { Tile as BaseTile } from "@models";
import { Rotation } from "../level/tile";
import { Tile } from "./tile";
import { TileDimensions } from "./tileDimensions";

export class CrossTile extends Tile {
  constructor(tile: BaseTile, size: TileDimensions, x: number, y: number) {
    super(tile, size, x, y);

    this.riverEnds = [
      Rotation.Left,
      Rotation.Bottom,
      Rotation.Right,
      Rotation.Top,
    ];
  }
}
