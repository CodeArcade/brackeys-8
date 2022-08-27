import { Vector2 } from "models/Vector2";
import { Container, Rectangle, Sprite, Texture } from "pixi.js";

export default class Box extends Container {
  public tilemap: Texture[] = []
  public readonly tileWidth: number
  private readonly tileHeight: number;

  /**
   * THE BOX HAS TO BE SQUARE. I DONT WANT TO FIX IT!
   */
  constructor(dimensions: Vector2) {
    super();
    const { x: width, y: height } = dimensions

    this.tileWidth = width
    this.tileHeight = height
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        const coordinates: Vector2 = {
          x: x * 33,
          y: y * 33
        }
        const area = {x: 33, y: 33}
        if (x === 2) {
          area.x += 1
        }

        if (y === 2) {
          area.y += 1
        }

        const texturePart = new Texture(Texture.from("panelBrown").baseTexture, new Rectangle(
          coordinates.x, coordinates.y, area.x, area.y
        ))


        this.tilemap.push(texturePart)
      }
    }

    this.width = this.tileWidth * 33 + 1
    this.height = this.tileHeight * 33 + 1
    
    this.drawBox();
  }

  private drawBox() {
    for (let x = 0; x < this.tileWidth; x++) {
      for (let y = 0; y < this.tileHeight; y++) {
        let textureX = 0;
        if (x > 0) {
          textureX = 1
        }
        if (x === this.tileWidth - 1) {
          textureX = 2
        }

        let textureY = 0;
        if (y > 0) {
          textureY = 1
        }
        if (y === this.tileWidth - 1) {
          textureY = 2
        }

        const texture = this.tilemap[textureY + (textureX *3)]

        const sprite = new Sprite(texture);
        sprite.x = x * 33;
        sprite.y = y * 33;
        this.addChild(sprite)
      }
    }
  }
}