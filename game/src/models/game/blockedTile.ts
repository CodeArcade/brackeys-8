import { Tile as BaseTile } from "@models";
import { Sprite, Texture } from "pixi.js";
import { Rotation } from "../level/tile";
import { Tile } from "./tile";
import { TileDimensions } from "./tileDimensions";

export class BlockedTile extends Tile {
  blocking = true;
  hasFence = false;

  private readonly decorations: string[] = [
    "bigRock1-",
    "bigRock2-",
    "pineTree",
  ];

  constructor(tile: BaseTile, size: TileDimensions, x: number, y: number) {
    super(tile, size, x, y);
  }

  public updateRotation(_rotation: Rotation) {
    // not needed every time the same texture
  }

  public placeDecoration() {
    if (this.hasFence) return;
    const tileRotation = Math.floor(Math.random() * 4);
    const decoration =
      this.decorations[Math.floor(Math.random() * this.decorations.length)];
    const sprite = new Sprite(Texture.from(`${decoration}${tileRotation}`));
    sprite.x = 80;
    sprite.y = -50;
    if (decoration.startsWith("bigRock")) {
      sprite.scale.set(0.6);
    }
    sprite.hitArea = { contains: () => false };
    sprite.anchor.set(0, 1);
    this.addChild(sprite);
  }
}
