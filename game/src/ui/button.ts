import { Sound } from "@pixi/sound";
import { Sprite, Texture, Container, Text } from "pixi.js";

export class Button extends Container {
  public buttonTexture: Texture;
  public hoverTexture: Texture;
  public buttonSprite: Sprite;
  public contentSprite?: Sprite;
  public text?: Text;
  public buttonSound: Sound;
  public tag: any;

  public onClick?: (sender?: Button) => void;

  constructor(
    x: number,
    y: number,
    buttonTexture: string,
    hoverTexture: string,
    text?: string,
    sprite?: string
  ) {
    super();

    this.buttonTexture = Texture.from(buttonTexture);
    this.hoverTexture = Texture.from(hoverTexture);
    this.buttonSound = Sound.from("./assets/sounds/ui/button.ogg");
    this.interactive = true;
    this.buttonMode = true;
    this.x = x;
    this.y = y;
    this.on("pointerover", this.onButtonOver)
      .on("pointerout", this.onButtonOut)
      .on("pointerdown", this.onButtonDown);

    this.buttonSprite = new Sprite(this.buttonTexture);
    this.addChild(this.buttonSprite);

    if (sprite) {
      this.contentSprite = new Sprite(Texture.from(sprite));
      this.contentSprite.scale.set(
        this.buttonSprite.width / this.contentSprite.width,
        this.buttonSprite.height / this.contentSprite.height
      );
      this.addChild(this.contentSprite);
    }

    if (text) {
      this.text = new Text(text);
      this.text.x = this.width / 2 - this.text.width / 2;
      this.text.y = this.height / 2 - this.text.height / 2;

      this.addChild(this.text);
    }
  }

  onButtonDown(): void {
    if (!this.onClick) return;

    if (!this.buttonSound.isPlaying) {
      this.buttonSound.play();
    }

    this.onClick(this);
  }

  onButtonOver(): void {
    this.buttonSprite.texture = this.hoverTexture;
  }

  onButtonOut(): void {
    this.buttonSprite.texture = this.buttonTexture;
  }
}
