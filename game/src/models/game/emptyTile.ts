import { Tile as BaseTile } from "@models";
import { Sound } from "@pixi/sound";
import { Rectangle, Texture } from "pixi.js";
import { Tile } from "./tile";
import { TileDimensions } from "./tileDimensions";

export class EmptyTile extends Tile {
  public buttonSound: Sound;
  public normalTexture: Texture;
  public hoverTexture: Texture;
  public onClick?: (sender?: EmptyTile) => void;

  constructor(tile: BaseTile, size: TileDimensions, x: number, y: number) {
    super(tile, "emptyTile", size, x, y);

    this.normalTexture = Texture.from("emptyTile");
    this.hoverTexture = Texture.from("emptyTileHover");
    this.buttonSound = Sound.from("assets/sounds/ui/button.mp3");

    this.interactive = true;
    this.buttonMode = true;
    this.sprite.hitArea = new Rectangle(0, 0, size.tileWidth, size.tileHeight);

    this.on("pointerover", this.onButtonOver)
      .on("pointerout", this.onButtonOut)
      .on("pointerdown", this.onButtonDown);
  }

  onButtonDown(): void {
    if (!this.onClick) return;

    if (!this.buttonSound.isPlaying) {
      this.buttonSound.play();
    }

    this.onClick(this);
  }

  onButtonOver(): void {
    this.sprite.texture = this.hoverTexture;
  }

  onButtonOut(): void {
    this.sprite.texture = this.normalTexture;
  }
}
