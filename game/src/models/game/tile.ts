import { Container, Graphics, Sprite, Texture } from "pixi.js";
import { Tile as BaseTile } from "@models";
import { TileDimensions } from "./tileDimensions";
import { toScreenCoordinate } from "../../utils/isometricCoordinates";

export abstract class Tile extends Container {
  baseTile: BaseTile;
  sprite: Sprite;
  gridX: number;
  gridY: number;
  border!: Graphics;

  constructor(
    tile: BaseTile,
    texture: string,
    size: TileDimensions,
    x: number,
    y: number
  ) {
    super();

    this.baseTile = tile;
    this.width = size.tileWidth;
    this.height = size.tileHeight;
    this.gridX = x;
    this.gridY = y;

    const isometricCoordinates = toScreenCoordinate({
      x: this.gridX,
      y: this.gridY,
    }, {
      x: size.tileWidth,
      y: size.tileHeight,
    });

    // this.x = this.gridX * size.tileWidth
    // this.y = this.gridY * size.tileHeight
    this.x = isometricCoordinates.x + 600;
    this.y = isometricCoordinates.y + 120;
    this.sprite = new Sprite(Texture.from(texture));
    this.sprite.scale.set(
      this.sprite.width / size.imageWidth,
      this.sprite.height / size.imageHeight
    );
    this.sprite.interactive = false;
    this.sprite.buttonMode = false;
    this.sprite.anchor.set(0, 1);
    this.addChild(this.sprite);

    // this.border = new Graphics();
    // this.border.lineStyle(3, 0x0, 1);
    // this.border.drawRect(0, 0, size, size);
    // this.addChild(this.border);
  }
}
