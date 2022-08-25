import { isEmpty, last } from "lodash";
import { Sprite, Texture } from "pixi.js";
import { Tile } from "./tile";
import { Tween, update as updateTween, Easing } from "@tweenjs/tween.js";
import { Vector2 } from "models/Vector2";

export class Fish extends Sprite {
  path: Array<Tile> = [];
  pathIndex = 0;
  startTile: Tile;
  currentTile: Tile;

  moveSpeed = 500;
  timer = 0;
  swim = false;
  swimTimeElapsed = 0;

  tween?: Tween<Vector2>;

  constructor(tile: Tile) {
    super(Texture.from("fisher"));

    this.startTile = tile;
    this.currentTile = tile;
    this.anchor.set(0, 1);

    this.updatePosition({ x: this.currentTile.x, y: this.currentTile.y });
    this.updateTile();
  }

  private updatePosition(coordinates: Vector2): void {
    console.warn("updating position:", coordinates);
    this.x = coordinates.x;
    this.y = coordinates.y;
  }

  public startSwimming() {
    this.swim = true;
    this.tweenPosition();
    this.animate(0)
  }

  private animate(time: number) {
    requestAnimationFrame(this.animate.bind(this));
    updateTween(time);
  }

  private tweenPosition() {
    this.tween = new Tween<Vector2>({ x: this.x, y: this.y })
      .to({ x: this.currentTile.x, y: this.currentTile.y }, 1000)
      .easing(Easing.Quadratic.InOut)
      .onUpdate((coordinates) => {
        this.position.set(coordinates.x, coordinates.y);
      })
      .onComplete(() => {
        this.updateTile();
      })
      .start();
  }

  private updateTile() {
    if (this.swim) {
      this.swimTimeElapsed = 0;
      if (!isEmpty(this.path)) {
        if (this.currentTile === last(this.path)!) {
          this.tween?.stop();
          this.swim = false;
          this.tween = undefined;
        } else {
          this.currentTile = this.path[this.pathIndex];
          this.pathIndex += 1;
          this.tweenPosition();
        }
      }
    }
  }

  update(delta: number): void {
    if (this.swim) {
      this.swimTimeElapsed += delta;
    } else if (this.swimTimeElapsed !== 0) {
      this.swimTimeElapsed = 0;
    }
    // if (this.swim) {
    //   this.timer += delta;
    //   if (this.timer >= this.moveSpeed) {
    //     this.timer = 0;

    //     if (!isEmpty(this.path)) {
    //       if (this.currentTile === last(this.path)!) {
    //       } else {
    //         this.currentTile = this.path[this.pathIndex];
    //         this.pathIndex += 1;
    //       }
    //     }
    //   }
    // } else {
    //   this.currentTile = this.startTile;
    //   this.pathIndex = 0;
    // }
  }
}
