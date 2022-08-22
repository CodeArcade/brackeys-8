import { Tile as BaseTile } from "@models";
import { Sound } from "@pixi/sound";
import { Texture } from "pixi.js";
import { Tile } from "./tile";
import { TileDimensions } from "./tileDimensions";

export class EmptyTile extends Tile {
  public buttonSound: Sound;
  public normalTexture: Texture;
  public hoverTexture: Texture;

  constructor(tile: BaseTile, size: TileDimensions, x: number, y: number) {
    super(tile, size, x, y);

    this.normalTexture = Texture.from("emptyTile");
    this.hoverTexture = Texture.from("emptyTile");
    this.buttonSound = Sound.from("assets/sounds/ui/button.mp3");

    this.buttonMode = true;
  }

  onButtonDown(): void {
    if (!this.buttonSound.isPlaying) {
      this.buttonSound.play();
    }

    super.onButtonDown();
  }

  onButtonOver(): void {
    this.sprite.texture = this.hoverTexture;
    this.sprite.tint = 0xffeb2a;
  }

  onButtonOut(): void {
    this.sprite.texture = this.normalTexture;
    this.sprite.tint = 0xffffff;
  }
}
