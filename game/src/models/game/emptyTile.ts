import { Tile as BaseTile } from "@models";
import { Vector2 } from "../Vector2";
import { Sprite, Texture } from "pixi.js";
import { Tile } from "./tile";
import { TileDimensions } from "./tileDimensions";
import { Rotation } from "../level/tile";

export class EmptyTile extends Tile {
  normalTexture: Texture;
  hoverTexture: string;
  showDecoration: boolean = true;
  decorations: Array<Sprite> = [];
  private readonly decorationItems: string[] = [
    "redFlower",
    "shrub1-",
    "grass1-",
    "grass2-",
    "stoneFlat",
    "yellowMushroom",
    "pebble",
  ];

  private readonly decorationPoints: Vector2[] = [
    { x: 10, y: 13 },
    { x: 10, y: 30 },
    { x: -5, y: 50 },
    { x: -35, y: 40 },
    { x: 35, y: 40 },
    { x: 30, y: 55 },
    { x: 0, y: 70 },
  ];

  constructor(tile: BaseTile, size: TileDimensions, x: number, y: number) {
    super(tile, size, x, y);

    this.normalTexture = Texture.from("blockedTile0");
    this.hoverTexture = "blockedTile";
    this.sprite.texture = this.normalTexture;

    this.buttonMode = true;

    const decorationAmount = Math.max(4, Math.floor(Math.random() * 7));

    let usedDecorationPoints: number[] = [];

    let spritesToRender: Sprite[] = [];

    for (let i = 0; i < decorationAmount; i++) {
      const randomDecoration =
        this.decorationItems[
          Math.floor(Math.random() * this.decorationItems.length)
        ];
      const sprite = new Sprite(
        Texture.from(
          this.getDecorationRotation(
            randomDecoration,
            Math.floor(Math.random() * 4)
          )
        )
      );
      let point = -1;
      do {
        point = Math.floor(Math.random() * this.decorationPoints.length);
      } while (point < 0 || usedDecorationPoints.includes(point));
      usedDecorationPoints.push(point);
      sprite.x = this.decorationPoints[point].x + 95;
      sprite.y = this.decorationPoints[point].y - 110;
      sprite.anchor.set(0, 1);

      if (randomDecoration === "stoneFlat" || randomDecoration === "pebble") {
        sprite.scale.set(0.15);
      } else if (randomDecoration.startsWith("grass")) {
        sprite.scale.set(0.4);
      } else {
        sprite.scale.set(0.7);
      }

      spritesToRender.push(sprite);
    }

    spritesToRender = spritesToRender.sort((a, b) => (a.y > b.y ? 1 : -1));
    for (let s of spritesToRender) {
      this.addChild(s);
      this.decorations.push(s);
    }
  }

  getDecorationRotation = (decorationAsset: string, rotation: number) => {
    return `${decorationAsset}${rotation}`;
  };

  onButtonOver(): void {
    if (!this.canHover) return;
    super.onButtonOver();

    this.sprite.texture = Texture.from(
      this.hoverTexture + this.baseTile.rotation
    );

    if (this.showDecoration) {
      this.decorations.forEach((d) => {
        if (this.children.includes(d)) return;

        this.addChild(d);
      });
    } else {
      this.decorations.forEach((d) => {
        this.removeChild(d);
      });
    }
  }

  onButtonOut(): void {
    if (!this.canHover) return;
    super.onButtonOut();
    this.sprite.texture = this.normalTexture;

    this.showDecoration = true;
    this.decorations.forEach((d) => {
      if (this.children.includes(d)) return;

      this.addChild(d);
    });
  }

  public updateRotation(rotation: Rotation) {
    this.baseTile.rotation = rotation;

    this.sprite.texture = Texture.from(`${this.hoverTexture}${rotation}`);

    if (this.onRotation) {
      this.onRotation(this);
    }
  }
}
