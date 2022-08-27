import { Tile as BaseTile } from "@models";
import { Tile } from "./tile";
import { TileDimensions } from "./tileDimensions";
import { Text } from "pixi.js";
import { Rotation } from "../level/tile";
import { textStyle } from "../../assets";

export class EndTile extends Tile {
  fish: number;
  fishReached: number = 0;
  blocking = true;
  text: Text;

  constructor(
    tile: BaseTile,
    size: TileDimensions,
    x: number,
    y: number,
    fish: number
  ) {
    super(tile, size, x, y);

    this.fish = fish;

    this.text = new Text(`${this.fishReached}/${fish}`, textStyle);
    this.text.x = size.tileWidth / 2;
    this.text.y = -size.tileHeight;
    this.text.style.fill = "#FFFFFF";
    this.text.style.dropShadow = true;
    this.text.style.dropShadowDistance = 3;
    this.addChild(this.text);

    this.riverEnds = [];
    this.baseTile.rotation = 0;
  }

  addFish(): void {
    this.fishReached += 1;
    this.text.text = `${this.fishReached}/${this.fish}`;
  }

  reset(): void {
    this.fishReached = 0;
    this.text.text = `${this.fishReached}/${this.fish}`;
  }

  updateRotation(_rotation: Rotation) {
    // not needed every time the same texture
  }
}
