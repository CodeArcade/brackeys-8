import { Tile as BaseTile } from "@models";
import { Tile } from "./tile";
import { TileDimensions } from "./tileDimensions";
import { Text } from "pixi.js";
import { Rotation } from "../level/tile";

export class StartTile extends Tile {
  fish: number;

  constructor(
    tile: BaseTile,
    size: TileDimensions,
    x: number,
    y: number,
    fish: number
  ) {
    super(tile, size, x, y);

    this.fish = fish;
    this.buttonMode = true;

    this.riverEnds = [Rotation.Left];

    const text = new Text(`${fish}`);
    text.x = size.tileWidth / 2;
    text.y = -size.tileHeight;
    text.style.fill = "#FFFFFF";
    text.style.dropShadow = true;
    text.style.dropShadowDistance = 2;
    this.addChild(text);
  }

  onButtonOver(): void {
    this.sprite.tint = 0xaadb1e;
  }

  onButtonOut(): void {
    this.sprite.tint = 0xffffff;
  }
}
