import { isEmpty, last } from "lodash";
import { Sprite, Texture } from "pixi.js";
import { EndTile } from "./endTile";
import { Tile } from "./tile";
import { Tween, update as updateTween, Easing } from "@tweenjs/tween.js";
import { Vector2 } from "models/Vector2";
import { getRandomNumber } from "../../utils/random";
import { Sound } from "@pixi/sound";

export class Fish extends Sprite {
  path: Array<Tile> = [];
  pathIndex = 0;
  startTile: Tile;
  currentTile: Tile;
  addedFish: boolean = false;
  moveSpeed = 750;
  timer = 0;
  swim = false;
  swimTimeElapsed = 0;
  tween?: Tween<Vector2>;
  dead = false;
  static swimSound: Sound = Sound.from({
    url: "./assets/sounds/game/swim.ogg",
    volume: 0.5
  });
  static goalSound: Sound = Sound.from("./assets/sounds/game/goalReached.ogg");

  constructor(tile: Tile) {
    super(Texture.from("fish" + getRandomNumber(0, 4)));

    this.startTile = tile;
    this.currentTile = tile;
    this.anchor.set(0, 1);
    this.scale.set(0.3);

    this.updatePosition({ x: this.currentTile.x, y: this.currentTile.y });
    this.updateTile();
  }

  private updatePosition(coordinates: Vector2): void {
    this.x = coordinates.x + 70;
    this.y = coordinates.y - 50;
  }

  public startSwimming() {
    this.swim = true;
    this.tweenPosition();
    this.animate(0);
  }

  private animate(time: number) {
    requestAnimationFrame(this.animate.bind(this));
    updateTween(time);
  }

  private tweenPosition() {
    if (!Fish.swimSound.isPlaying) {
      Fish.swimSound.play();
    }
    this.tween = new Tween<Vector2>({ x: this.x, y: this.y })
      .to(
        { x: this.currentTile.x + 70, y: this.currentTile.y - 50 },
        this.startTile === this.currentTile ? 1 : this.moveSpeed
      )
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
    if (this.swim && !this.dead) {
      this.swimTimeElapsed = 0;
      if (!isEmpty(this.path)) {
        if (this.currentTile === last(this.path)!) {
          this.tween?.stop();
          this.swim = false;
          this.tween = undefined;
          if (!this.addedFish) {
            this.addedFish = true;
            (this.currentTile as EndTile).addFish();
            Fish.goalSound.play();
          }
        } else {
          const nextTile = this.path[this.pathIndex];
          if (this.currentTile.gridX > nextTile.gridX) {
            this.texture = Texture.from("fish0");
          }
          if (this.currentTile.gridX < nextTile.gridX) {
            this.texture = Texture.from("fish2");
          }
          if (this.currentTile.gridY > nextTile.gridY) {
            this.texture = Texture.from("fish1");
          }
          if (this.currentTile.gridY < nextTile.gridY) {
            this.texture = Texture.from("fish3");
          }

          this.currentTile = nextTile;
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

    this.tint = this.dead ? 0xff0000 : 0xffffff;
  }

  reset(): void {
    this.tween?.stop();
    this.dead = false;
    this.addedFish = false;
    this.swim = false;
    this.currentTile = this.startTile;
    this.pathIndex = 0;
    this.texture = Texture.from("fish" + getRandomNumber(0, 4));
    this.updatePosition({ x: this.currentTile.x, y: this.currentTile.y });
  }
}
