import { Game, IScene } from "../game";
import { Container, Graphics, Loader, Sprite, Texture } from "pixi.js";
import { Button } from "../ui/button";
import { MenuScene } from "./menu";

export class GameScene extends Container implements IScene {
  load(): void {
    const menuButton = new Button(0, 0, "button", "buttonHover", "Menu");
    menuButton.x = 20;
    menuButton.y = 20;
    menuButton.onClick = () => Game.changeScene(new MenuScene());
    this.addChild(menuButton);
  }

  update(_delta: number): void {}
}
