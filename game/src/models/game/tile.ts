import { Container, Graphics, Sprite, Texture } from "pixi.js";
import { Tile as BaseTile } from "@models";
import { TileDimensions } from "./tileDimensions";
import { toScreenCoordinate } from "../../utils/isometricCoordinates";
import TileHitbox from "./tileHitbox";
import { Rotation, Type } from "../../models/level/tile";
import { Vector2 } from "models/Vector2";
import { Easing, Tween, update } from "@tweenjs/tween.js";
import _ from "lodash";

export abstract class Tile extends Container {
  baseTile: BaseTile;
  sprite: Sprite;
  gridX: number;
  gridY: number;
  border!: Graphics;
  canBeRemoved: boolean = false;
  isValid = true;
  riverEnds?: Array<Rotation>;
  isActive = false;
  blocking = false;
  canHover = true;
  canBeDeleted = false;

  onClick?: (sender?: Tile) => void;
  onIsActive?: (sender?: Tile) => void;
  onRotation?: (sender?: Tile) => void;
  onRemove?: (sender?: Tile) => void;
  readonly basePosition: Vector2;

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

    this.basePosition = { x: this.x, y: this.y };

    this.on("pointerover", this.onButtonOver)
      .on("pointerout", this.onButtonOut)
      .on("pointerdown", this.onButtonDown);
  }

  unbindEvents(): void {
    window.removeEventListener("keydown", this.keyDownEvent.bind(this));
    window.removeEventListener("wheel", this.wheelRotateEvent.bind(this));
  }

  bindEvents(): void {
    window.addEventListener("keydown", this.keyDownEvent.bind(this));
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
    if (!this.onClick) return;
    this.onClick(this);
  }

  onRightClick() {
    if (this.canBeDeleted) {
      if (this.onRemove) {
        this.onRemove(this);
      }
    }
  }

  onButtonOver(): void {
    if (!this.canHover) return;
    this.canBeDeleted = true;

    if (!this.blocking) {
      new Tween<Vector2>({ x: this.x, y: this.y })
        .to({ y: this.basePosition.y - 7 * 0.91 }, 100)
        .easing(Easing.Quadratic.InOut)
        .onUpdate((coordinates) => {
          this.y = coordinates.y;
        })
        .start();
      this.isActive = true;
      requestAnimationFrame(this.animate.bind(this));
    }

    if (this.isValid) this.sprite.tint = 0xa3f779;
    if (this.blocking) this.sprite.tint = 0xeb4034;
  }

  onButtonOut(): void {
    if (!this.canHover) return;
    this.canBeDeleted = false;

    if (!this.blocking) {
      new Tween<Vector2>({ x: this.x, y: this.y })
        .to({ y: this.basePosition.y }, 100)
        .easing(Easing.Quadratic.InOut)
        .onUpdate((coordinates) => {
          this.y = coordinates.y;
        })
        .start();
      this.isActive = false;
      requestAnimationFrame(this.animate.bind(this));
    }
    if (this.isValid) this.sprite.tint = 0xffffff;
  }

  public updateValiditiy(valid: boolean): void {
    this.isValid = valid;
    this.sprite.tint = valid ? 0xffffff : 0xff0000;
  }

  public keyDownEvent(event: KeyboardEvent) {
    if (!this.isActive) return;
    let rotation = this.baseTile.rotation;
    switch (event.key) {
      case "q":
        rotation -= 1;
        break;
      case "e":
        rotation += 1;
        break;
      case "x":
      case "Escape":
      case "Backspace":
        if (this.canBeDeleted) {
          if (this.onRemove) {
            this.onRemove(this);
          }
        }
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

    if (this.onRotation) {
      this.onRotation(this);
    }
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

  private animate(time: number) {
    window.requestAnimationFrame(this.animate.bind(this));
    update(time);
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
