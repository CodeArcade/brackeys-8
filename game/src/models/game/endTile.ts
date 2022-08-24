import { Tile as BaseTile } from "@models";
import { Tile } from "./tile";
import { TileDimensions } from "./tileDimensions";
import { Text } from "pixi.js";
import { Rotation } from "../level/tile";

export class EndTile extends Tile {
  fish: number;
  fishReached: number = 0;
  blocking = true;

  constructor(
    tile: BaseTile,
    size: TileDimensions,
    x: number,
    y: number,
    fish: number
  ) {
    super(tile, size, x, y);

    this.fish = fish;

    const text = new Text(`${this.fishReached}/${fish}`);
    text.x = size.tileWidth / 2;
    text.y = -size.tileHeight;
    text.style.fill = "#FFFFFF";
    text.style.dropShadow = true;
    text.style.dropShadowDistance = 2;
    this.addChild(text);

    this.riverEnds = [];
    this.baseTile.rotation = 0;
  }

  public updateRotation(_rotation: Rotation) {
    // not needed every time the same texture
  }
}
