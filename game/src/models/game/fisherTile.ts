import { Tile as BaseTile } from "@models";
import { Tile } from "./tile";
import { Sprite, Texture, Text, Graphics } from "pixi.js";
import { Rotation } from "../level/tile";
import { BlockedTile } from "./blockedTile";
import { TileDimensions } from "./tileDimensions";
import { toScreenCoordinate } from "../../utils/isometricCoordinates";
import { Vector2 } from "models/Vector2";

export class FisherTile extends BlockedTile {
  fisher: Array<{
    rotation: Rotation;
    count: number;
    sprite: Sprite;
    caught: number;
  }> = [];

  constructor(tile: BaseTile, size: TileDimensions, x: number, y: number) {
    super(tile, size, x, y);
  }

  addFisher(rotation: Rotation, count: number): void {
    for (let i = 0; i < count; i++) {
      const sprite = new Sprite(
        Texture.from(this.getRotateSpriteTexture(rotation))
      );

      const coordinates = this.getCoordinates();

      switch (rotation) {
        case Rotation.Left:
          sprite.x =
            coordinates.x +
            Tile.Constants.RenderOffset.x -
            this.x +
            35 +
            i * 20 + (count === 1 ? 20 : 0);
          sprite.y = coordinates.y - this.y - 15 - i * 10 - (count === 1 ? 10 : 0);
          break;
        case Rotation.Top:
          sprite.x =
            coordinates.x +
            Tile.Constants.RenderOffset.x -
            this.x +
            100 +
            i * 20 + (count === 1 ? 20 : 0);
          sprite.y = coordinates.y - this.y - 35 + i * 10 + (count === 1 ? 10 : 0);
          break;
        case Rotation.Right:
          sprite.x =
            coordinates.x +
            Tile.Constants.RenderOffset.x -
            this.x +
            140 -
            i * 20 - (count === 1 ? 20 : 0);
          sprite.y = coordinates.y - this.y + i * 10 + (count === 1 ? 10 : 0);
          break;
        case Rotation.Bottom:
          sprite.x =
            coordinates.x +
            Tile.Constants.RenderOffset.x -
            this.x + 35 +
            i * 20 + (count === 1 ? 20 : 0);
          sprite.y = coordinates.y - this.y + i * 10 + (count === 1 ? 10 : 0);

          break;
      }
      sprite.scale.set(0.2);

      const loaderBarBoder = new Graphics();
      loaderBarBoder.lineStyle(10, 0x0, 1);
      loaderBarBoder.drawRect(0, 0, 50, 50);

      const f = {
        rotation,
        sprite,
        count,
        caught: 0,
      };
      this.fisher.push(f);
      this.addChild(sprite);
    }
  }

  private getCoordinates(): Vector2 {
    const coordinates = toScreenCoordinate(
      { x: this.gridX, y: this.gridY },
      {
        x: Tile.Constants.TileDimensions.tileWidth,
        y: Tile.Constants.TileDimensions.tileHeight,
      }
    );
    return coordinates;
  }

  private getRotateSpriteTexture(rotation: Rotation): string {
    return "fisher";
  }
}