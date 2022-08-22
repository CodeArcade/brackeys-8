import { Container, Graphics, Rectangle, Sprite, Texture } from "pixi.js";
import { Tile as BaseTile } from "@models";
import { TileDimensions } from "./tileDimensions";
import { toScreenCoordinate } from "../../utils/isometricCoordinates";

export abstract class Tile extends Container {
  baseTile: BaseTile;
  sprite: Sprite;
  gridX: number;
  gridY: number;
  border!: Graphics;

  public onClick?: (sender?: Tile) => void;

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

    const isometricCoordinates = toScreenCoordinate(
      {
        x: this.gridX,
        y: this.gridY,
      },
      {
        x: size.tileWidth,
        y: size.tileHeight,
      }
    );

    this.x = isometricCoordinates.x + 600;
    this.y = isometricCoordinates.y + 120;

    if (texture !== "emptyTile") {
      texture = `${texture}${tile.rotation}`;
    }

    this.sprite = new Sprite(Texture.from(texture));
    this.sprite.scale.set(
      this.sprite.width / size.imageWidth,
      this.sprite.height / size.imageHeight
    );
    this.sprite.interactive = false;
    this.sprite.buttonMode = false;
    this.sprite.hitArea = new Rectangle(
      0,
      -size.tileHeight,
      size.tileWidth - 20,
      size.tileHeight - 20
    );
    this.sprite.anchor.set(0, 1);

    this.addChild(this.sprite);

    this.interactive = true;

    this.on("pointerover", this.onButtonOver)
      .on("pointerout", this.onButtonOut)
      .on("pointerdown", this.onButtonDown);
  }

  onButtonDown(): void {
    if (!this.onClick) return;

    this.onClick(this);
  }

  onButtonOver(): void {
    this.sprite.tint = 0xff0000;
  }

  onButtonOut(): void {
    this.sprite.tint = 0xffffff;
  }
}
