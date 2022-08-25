import { Tile as BaseTile } from "@models";
import { Tile } from "./tile";
import { TileDimensions } from "./tileDimensions";
import { Text } from "pixi.js";
import { Rotation } from "../level/tile";

export class StartTile extends Tile {
  fish: number;
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
    this.buttonMode = true;

    const text = new Text(`${fish}`);
    text.x = size.tileWidth / 2;
    text.y = -size.tileHeight;
    text.style.fill = "#FFFFFF";
    text.style.dropShadow = true;
    text.style.dropShadowDistance = 2;
    this.addChild(text);

    this.riverEnds = [];
    this.baseTile.rotation = 0;
  }

  onButtonOver(): void {
    if (!this.blocking) {
      this.y -= 7 * 0.91;
      this.isActive = true;
    } else {
      this.sprite.tint = 0x83c663;
    }
  }

  public updateRotation(_rotation: Rotation) {
    // not needed every time the same texture
  }
}
