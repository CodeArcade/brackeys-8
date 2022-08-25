import { isEmpty, last } from "lodash";
import { Sprite, Texture } from "pixi.js";
import { Tile } from "./tile";

export class Fish extends Sprite {
  path: Array<Tile> = [];
  pathIndex = 0;
  startTile: Tile;
  currentTile: Tile;

  moveSpeed = 50;
  timer = 0;
  swim = false;

  constructor(tile: Tile) {
    super(Texture.from("fisher"));

    this.startTile = tile;
    this.currentTile = tile;
    this.anchor.set(0, 1);

    this.updatePosition();
  }

  private updatePosition(): void {
    this.x = this.currentTile.x;
    this.y = this.currentTile.y;
  }

  update(delta: number): void {
    if (this.swim) {
      this.timer += delta;
      if (this.timer >= this.moveSpeed) {
        this.timer = 0;

        if (!isEmpty(this.path)) {
          if (this.currentTile === last(this.path)!) {
          } else {
            this.currentTile = this.path[this.pathIndex];
            this.pathIndex += 1;
          }
        }
      }
    } else {
      this.currentTile = this.startTile;
      this.pathIndex = 0;
    }

    this.updatePosition();
  }
}
