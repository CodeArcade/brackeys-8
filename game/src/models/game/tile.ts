import { Container, Graphics, Sprite, Texture } from "pixi.js";
import { Tile as BaseTile } from "@models";
import { TileDimensions } from "./tileDimensions";
import { toScreenCoordinate } from "../../utils/isometricCoordinates";
import TileHitbox from "./tileHitbox";
import { Rotation, Type } from "../../models/level/tile";
import { Button } from "ui/button";

export abstract class Tile extends Container {
  baseTile: BaseTile;
  sprite: Sprite;
  gridX: number;
  gridY: number;
  border!: Graphics;
  canBeRemoved: boolean = false;
  contextMenu?: Container;
  canShowContextMenu: boolean = true;
  protected riverEnds?: Array<Rotation>;

  public onClick?: (sender?: Tile) => void;

  constructor(tile: BaseTile, size: TileDimensions, x: number, y: number) {
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

    let texture = Tile.getTextureToType(tile.type);
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
    this.sprite.hitArea = new TileHitbox(
      texture,
      size.tileWidth,
      size.tileHeight
    );
    this.sprite.anchor.set(0, 1);

    this.addChild(this.sprite);

    this.interactive = true;

    this.on("pointerover", this.onButtonOver)
      .on("pointerout", this.onButtonOut)
      .on("pointerdown", this.onButtonDown);
  }

  public get riverEndsWithRotation() {
    return this.riverEnds?.map((end) => {
      let rotation = end + this.baseTile.rotation;
      if (rotation >= 4) {
        rotation -= 4;
      } else if (rotation < 0) {
        rotation += 4;
      }

      return rotation as Rotation;
    });
  }

  onButtonDown(): void {
    this.showConextMenu();

    if (!this.onClick) return;
    this.onClick(this);
  }

  onButtonOver(): void {
    this.sprite.tint = this.canBeRemoved ? 0xdcdcdc : 0xff0000;
  }

  onButtonOut(): void {
    this.sprite.tint = 0xffffff;
  }

  public showConextMenu(): void {
    if (this.contextMenu && this.canShowContextMenu) {
      this.addChild(this.contextMenu);
      this.contextMenu.children.forEach((child) => {
        (child as Button).tag = this;
      });
    }
  }

  public updateRotation(rotation: Rotation) {
    this.baseTile.rotation = rotation;

    let texture = Tile.getTextureToType(this.baseTile.type);
    if (texture !== "emptyTile") {
      texture = `${texture}${rotation}`;
    }
    this.sprite.texture = Texture.from(texture);
  }

  public static getTextureToType(type: string): string {
    switch (type) {
      case Type.Blocked:
        return "blockedTile";
      case Type.Start:
        return "riverEnd";
      case Type.End:
        return "riverEnd";
      case Type.Straight:
        return "riverStraight";
      case Type.Bendy:
        return "riverBendy";
      case Type.Cross:
        return "riverCross";
      case Type.T:
        return "riverT";
      case Type.Straight:
        return "riverStraight";
      default:
        return "emptyTile";
    }
  }
}
