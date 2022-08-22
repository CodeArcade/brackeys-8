import { Tile as BaseTile } from "@models";
import { Tile } from "./tile";
import { TileDimensions } from "./tileDimensions";
import { Text } from "pixi.js";

export class EndTile extends Tile {
  fish: number;
  fishReached: number = 0;

  constructor(
    tile: BaseTile,
    size: TileDimensions,
    x: number,
    y: number,
    fish: number
  ) {
    super(tile, "riverEnd", size, x, y);
    this.fish = fish;

    const text = new Text(`${this.fishReached}/${fish}`);
    text.x = size.tileWidth / 2;
    text.y = -size.tileHeight;
    text.style.fill = "#FFFFFF";
    text.style.dropShadow = true;
    text.style.dropShadowDistance = 2;
    this.addChild(text);
  }
}
