import { Game, IScene } from "../game";
import { Container, Sprite, Text, Texture } from "pixi.js";
import { Button } from "../ui/button";
import { centerX } from "../utils/ui";
import { GameScene } from "./game";
import { LevelSelectionScene } from "./levelSelection";
import { ControlsScene } from "./controls";
import { InstructionsScene } from "./instructions";
import { textStyle } from "../assets";
import Box from "../ui/Box";

export class MenuScene extends Container implements IScene {
  load(): void {
    this.addChild(new Sprite(Texture.from("menuBackground")))

    const title = new Text(Game.title, { ...textStyle, fontSize: 72 });
    title.x = centerX(title);
    title.y = 20;
    this.addChild(title);

    const playButton = new Button(0, 0, "button", "buttonHover", "Play");
    playButton.x = centerX(playButton);
    playButton.y = 40 + title.y + title.height;
    playButton.onClick = () => Game.changeScene(new GameScene(), "continue");
    this.addChild(playButton);

    const levelSelectionButton = new Button(
      0,
      0,
      "button",
      "buttonHover",
      "Select Level"
    );
    levelSelectionButton.x = centerX(levelSelectionButton);
    levelSelectionButton.y = 20 + playButton.y + playButton.height;
    levelSelectionButton.onClick = () =>
      Game.changeScene(new LevelSelectionScene());
    this.addChild(levelSelectionButton);

    const instructionsButton = new Button(
      0,
      0,
      "button",
      "buttonHover",
      "Instructions"
    );
    instructionsButton.x = centerX(instructionsButton);
    instructionsButton.y =
      20 + levelSelectionButton.y + levelSelectionButton.height;
    instructionsButton.onClick = () =>
      Game.changeScene(new InstructionsScene());
    this.addChild(instructionsButton);

    const controlsButton = new Button(
      0,
      0,
      "button",
      "buttonHover",
      "Controls"
    );
    controlsButton.x = centerX(controlsButton);
    controlsButton.y = 20 + instructionsButton.y + instructionsButton.height;
    controlsButton.onClick = () => Game.changeScene(new ControlsScene());
    this.addChild(controlsButton);
  }

  update(_delta: number): void {}
}
