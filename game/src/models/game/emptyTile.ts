import { Tile as BaseTile } from "@models";
import { Easing, Tween, update } from "@tweenjs/tween.js";
import { Vector2 } from "models/Vector2";
import { Sprite, Texture } from "pixi.js";
import { Tile } from "./tile";
import { TileDimensions } from "./tileDimensions";

export class EmptyTile extends Tile {
  public normalTexture: Texture;

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

  readonly basePosition: Vector2;

  constructor(tile: BaseTile, size: TileDimensions, x: number, y: number) {
    super(tile, size, x, y);

    this.basePosition = {x: this.x, y: this.y}

    this.normalTexture = Texture.from("blockedTile0");
    this.sprite.texture = this.normalTexture;

    this.buttonMode = true;

    const decorationAmount = Math.max(2, Math.floor(Math.random() * 5));

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
        sprite.scale.set(0.3);
      } else if (randomDecoration.startsWith("grass")) {
        sprite.scale.set(0.7);
      }

      spritesToRender.push(sprite);
    }

    spritesToRender = spritesToRender.sort((a, b) => (a.y > b.y ? 1 : -1));
    for (let s of spritesToRender) {
      this.addChild(s);
    }
  }

  getDecorationRotation = (decorationAsset: string, rotation: number) => {
    return `${decorationAsset}${rotation}`;
  };

  private animate(time: number) {
    window.requestAnimationFrame(this.animate.bind(this))
    update(time)
  }

  onButtonOver(): void {
    if (!this.blocking) {
      new Tween<Vector2>({x: this.x, y: this.y})
        .to({y: this.y - 7 * 0.91}, 100)
        .easing(Easing.Quadratic.InOut)
        .onUpdate((coordinates) => {
          this.y = coordinates.y
        })
        .start()
      this.isActive = true;
      requestAnimationFrame(this.animate.bind(this))
    }

    if (this.isValid) this.sprite.tint = 0xa3f779;
  }

  onButtonOut(): void {
    if (!this.blocking) {
      new Tween<Vector2>({x: this.x, y: this.y})
        .to({y: this.basePosition.y}, 100)
        .easing(Easing.Quadratic.InOut)
        .onUpdate((coordinates) => {
          this.y = coordinates.y
        })
        .start()
      this.isActive = false;
      requestAnimationFrame(this.animate.bind(this))
    }
    if (this.isValid) this.sprite.tint = 0xffffff;
  }
}
