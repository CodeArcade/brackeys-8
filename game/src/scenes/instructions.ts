import { Game, IScene } from "../game";
import { Container, Sprite, Text, Texture } from "pixi.js";
import { Button } from "../ui/button";
import { centerX } from "../utils/ui";
import { MenuScene } from "./menu";
import { textStyle } from "../assets";

export class InstructionsScene extends Container implements IScene {
  load(): void {
    this.addChild(new Sprite(Texture.from("menuBackground")))

    const title = new Text(Game.title, { ...textStyle ,fontSize: 72 });
    title.x = centerX(title);
    title.y = 20;
    this.addChild(title);

    const menuButton = new Button(0, 0, "button", "buttonHover", "Menu");
    menuButton.x = 20;
    menuButton.y = 20;
    menuButton.onClick = () => Game.changeScene(new MenuScene());
    this.addChild(menuButton);

    const instructionsText = new Text(
      "Fish plan to move from one lake to another.\r\nBut they don't want to leave alone.\r\nSo they need to take their buddies with 'em.\r\n\r\nUse the given river pieces to guide the fish to their new home.",
      { ...textStyle, align: "center" }
    );
    instructionsText.x = centerX(instructionsText);
    instructionsText.y = 20 + title.y + title.height;
    this.addChild(instructionsText);
  }

  update(_delta: number): void {}
}
