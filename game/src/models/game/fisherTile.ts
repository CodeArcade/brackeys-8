import { Tile as BaseTile } from "@models";
import { Tile } from "./tile";
import { Sprite, Texture, Text, Graphics } from "pixi.js";
import { Rotation } from "../level/tile";
import { BlockedTile } from "./blockedTile";
import { TileDimensions } from "./tileDimensions";
import { toScreenCoordinate } from "../../utils/isometricCoordinates";

export class FisherTile extends BlockedTile {
  fisher: Array<{
    rotation: Rotation;
    count: number;
    sprite: Sprite;
    text: Text;
    caught: number;
  }> = [];

  constructor(tile: BaseTile, size: TileDimensions, x: number, y: number) {
    super(tile, size, x, y);
  }

  addFisher(rotation: Rotation, count: number): void {
    const sprite = new Sprite(
      Texture.from(this.getRotateSpriteTexture(rotation))
    );

    switch (rotation) {
      case Rotation.Left:
        const coordinates = toScreenCoordinate(
          { x: this.gridX, y: this.gridY },
          {
            x: Tile.Constants.TileDimensions.tileWidth,
            y: Tile.Constants.TileDimensions.tileHeight,
          }
        );
        sprite.x = coordinates.x + Tile.Constants.RenderOffset.x - this.x + 55;
        sprite.y = coordinates.y - this.y - 25;
        console.warn(`Tree: x: ${sprite.x} y: ${sprite.y}`);
        console.warn(`Tile: x: ${this.x} y: ${this.y}`);
        break;
      case Rotation.Top:
        sprite.anchor.set(-2.8, 1.9);
        break;
      case Rotation.Right:
        sprite.anchor.set(-2.8, 1.5);
        break;
      case Rotation.Bottom:
        sprite.anchor.set(-1.3, 1.5);
        break;
    }
    sprite.scale.set(0.2);

    const loaderBarBoder = new Graphics();
    loaderBarBoder.lineStyle(10, 0x0, 1);
    loaderBarBoder.drawRect(0, 0, 50, 50);

    const text = new Text(`0/${count}`);
    text.style.fontSize = 18;
    text.style.fill = "#FFFFFF";
    text.style.dropShadow = true;
    text.style.dropShadowDistance = 2;
    text.x = sprite.x;
    text.y = sprite.y;

    const f = {
      rotation,
      sprite,
      count,
      caught: 0,
      text,
    };
    this.fisher.push(f);
    this.addChild(text);
    this.addChild(sprite);
  }

  private getRotateSpriteTexture(rotation: Rotation): string {
    return "fisher";
  }
}
