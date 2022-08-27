import { Game, IScene } from "../game";
import { Container, Sprite, Text, Texture } from "pixi.js";
import { centerX } from "../utils/ui";
import { MenuScene } from "./menu";
import { Button } from "../ui/button";

export class ControlsScene extends Container implements IScene {
  load(): void {
    this.addChild(new Sprite(Texture.from("menuBackground")))

    const title = new Text(Game.title, { fontSize: 72 });
    title.x = centerX(title);
    title.y = 20;
    this.addChild(title);

    const subTitle = new Text("Controls", { fontSize: 48 });
    subTitle.x = centerX(subTitle);
    subTitle.y = 20 + title.y + title.height;
    this.addChild(subTitle);

    const mouseTitle = new Text("Mouse Controls", { fontSize: 36 });
    mouseTitle.x = centerX(mouseTitle);
    mouseTitle.y = 20 + subTitle.y + subTitle.height;
    this.addChild(mouseTitle);

    let label = this.addLabel(
      "Left Click:",
      "Place Tile",
      20 + mouseTitle.y + mouseTitle.height
    );

    label = this.addLabel(
      "Right Click:",
      "Remove Tile",
      20 + label.height + label.y
    );

    label = this.addLabel(
      "Mouse Wheel:",
      "Rotate Tile",
      20 + label.height + label.y
    );

    const keyboardTitle = new Text("Keyboard Controls", { fontSize: 36 });
    keyboardTitle.x = centerX(keyboardTitle);
    keyboardTitle.y = 20 + label.y + label.height;
    this.addChild(keyboardTitle);

    label = this.addLabel(
      "Q:",
      "Rotate Tile Left",
      20 + keyboardTitle.height + keyboardTitle.y
    );

    label = this.addLabel(
      "E:",
      "Rotate Tile Right",
      20 + label.height + label.y
    );

    label = this.addLabel("X:", "Remove Tile", 20 + label.height + label.y);

    const menuButton = new Button(0, 0, "button", "buttonHover", "Menu");
    menuButton.x = 20;
    menuButton.y = 20;
    menuButton.onClick = () => Game.changeScene(new MenuScene());
    this.addChild(menuButton);
  }

  update(_delta: number): void {}

  private addLabel(
    label: string,
    text: string,
    y: number
  ): { height: number; y: number } {
    const labelText = new Text(label);
    labelText.x = Game.width / 2 - 200;
    labelText.y = y;
    this.addChild(labelText);

    const textText = new Text(text);
    textText.x = Game.width / 2 + 100;
    textText.y = y;
    this.addChild(textText);

    return { height: textText.height, y: textText.y };
  }
}
