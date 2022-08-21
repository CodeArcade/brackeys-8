import { Container, Graphics, Rectangle, Sprite, Texture } from "pixi.js";
import { Tile as BaseTile } from "@models";

export abstract class Tile extends Container {
  baseTile: BaseTile;
  sprite: Sprite;
  gridX: number;
  gridY: number;
  border: Graphics;

  constructor(
    tile: BaseTile,
    texture: string,
    size: number,
    x: number,
    y: number
  ) {
    super();

    this.baseTile = tile;
    this.width = size;
    this.height = size;
    this.gridX = x;
    this.gridY = y;
    this.x = this.gridX * size;
    this.y = this.gridY * size;
    this.sprite = new Sprite(Texture.from(texture));
    this.sprite.scale.set(this.sprite.width / size, this.sprite.height / size);
    this.sprite.interactive = false;
    this.sprite.buttonMode = false;
    this.sprite.anchor.set(0, 1);
    this.addChild(this.sprite);

    this.border = new Graphics();
    this.border.lineStyle(3, 0x0, 1);
    this.border.drawRect(0, 0, size, size);
    this.addChild(this.border);
  }
}
