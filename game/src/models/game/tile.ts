import { Container, Graphics, Sprite, Texture } from "pixi.js";
import { Tile as BaseTile } from "@models";
import { TileDimensions } from "./tileDimensions";
import { toScreenCoordinate } from "../../utils/isometricCoordinates";
import TileHitbox from "./tileHitbox";
import { Rotation, Type } from "../../models/level/tile";
import { Button } from "ui/button";
import { Vector2 } from "models/Vector2";

export abstract class Tile extends Container {
  baseTile: BaseTile;
  sprite: Sprite;
  gridX: number;
  gridY: number;
  border!: Graphics;
  canBeRemoved: boolean = false;
  contextMenu?: Container;
  canShowContextMenu: boolean = true;
  isValid = true;
  riverEnds?: Array<Rotation>;
  isActive = false;
  blocking = false;
  canHover = true;

  onClick?: (sender?: Tile) => void;
  onIsActive?: (sender?: Tile) => void;

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

    this.x = isometricCoordinates.x + Tile.Constants.RenderOffset.x;
    this.y = isometricCoordinates.y + Tile.Constants.RenderOffset.y;

    let texture = Tile.getTextureToType(tile.type);
    if (
      this.baseTile.type !== Type.Empty &&
      this.baseTile.type !== Type.Start &&
      this.baseTile.type !== Type.End
    ) {
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

    window.addEventListener("keydown", this.keyRotateEvent.bind(this));
    window.addEventListener("keydown", this.keyHideContextEvent.bind(this));
    window.addEventListener("wheel", this.wheelRotateEvent.bind(this));
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

  onButtonDown(event: any): void {
    switch (event.data.originalEvent.buttons) {
      case 1:
        this.onLeftClick();
        break;
      case 2:
        this.onRightClick();
        break;
    }
  }

  onLeftClick() {
    if (this.isActive) {
      this.showConextMenu();
    }

    if (!this.onClick) return;
    this.onClick(this);
  }

  onRightClick() {}

  onButtonOver(): void {
    if (!this.canHover) return;

    // this.sprite.tint = this.canBeRemoved ? 0xdcdcdc : 0xff0000;
    // this.x -= 10 * 0.5
    if (!this.blocking) {
      this.y -= 7 * 0.91;
      this.isActive = true;
    } else {
      if (this.isValid) this.sprite.tint = 0xff7575;
    }
  }

  onButtonOut(): void {
    if (!this.canHover) return;

    // this.sprite.tint = 0xffffff;
    // this.x += 10 * 0.5
    if (!this.blocking) {
      this.y += 7 * 0.91;
      this.isActive = false;
    } else {
      if (this.isValid) this.sprite.tint = 0xffffff;
    }
  }

  public showConextMenu(): void {
    if (this.contextMenu && this.canShowContextMenu) {
      // this.isActive = true;
      if (!!this.onIsActive) {
        this.onIsActive(this);
      }
      this.addChild(this.contextMenu);
      this.contextMenu.children.forEach((child) => {
        (child as Button).tag = this;
      });
    }
  }

  public hideContextMenu(): void {
    // this.isActive = false;
    if (this.contextMenu) {
      this.contextMenu.children.forEach((child) => {
        (child as Button).tag = undefined;
      });
      this.removeChild(this.contextMenu);
    }
  }

  public updateValiditiy(valid: boolean): void {
    this.isValid = valid;
    this.sprite.tint = valid ? 0xffffff : 0xff0000;
  }

  public keyHideContextEvent(event: KeyboardEvent) {
    if (!this.isActive) return;
    if (event.key === "Escape") {
      this.hideContextMenu();
    }
  }

  public keyRotateEvent(event: KeyboardEvent) {
    if (!this.isActive) return;
    let rotation = this.baseTile.rotation;
    switch (event.key) {
      case "q":
        rotation -= 1;
        break;
      case "e":
        rotation += 1;
        break;
    }

    this.updateRotationFromEvent(rotation);
  }

  public wheelRotateEvent(event: WheelEvent) {
    if (!this.isActive) return;

    this.updateRotationFromEvent(
      (event.deltaY > 0 ? 1 : -1) + this.baseTile.rotation
    );
  }

  private updateRotationFromEvent(rotation: Rotation) {
    if (rotation >= 4) {
      rotation -= 4;
    } else if (rotation < 0) {
      rotation += 4;
    }

    this.updateRotation(rotation);
  }

  public updateRotation(rotation: Rotation) {
    this.baseTile.rotation = rotation;

    let texture = Tile.getTextureToType(this.baseTile.type);
    if (
      this.baseTile.type !== Type.Empty &&
      this.baseTile.type !== Type.Start &&
      this.baseTile.type !== Type.End
    ) {
      texture = `${texture}${rotation}`;
    }
    this.sprite.texture = Texture.from(texture);
  }

  public static getTextureToType(type: string): string {
    switch (type) {
      case Type.Blocked:
      case Type.Fisher:
        return "blockedTile";
      case Type.Start:
        return "lake";
      case Type.End:
        return "lake";
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
        return "blockedTile0";
    }
  }
}

export namespace Tile {
  export namespace Constants {
    export const TileDimensions: TileDimensions = {
      imageWidth: 220,
      imageHeight: 379,
      tileWidth: 180,
      tileHeight: 115,
    };

    export const RenderOffset: Vector2 = {
      x: 600,
      y: 120,
    };
  }
}
