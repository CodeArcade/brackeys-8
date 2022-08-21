import { Game, IScene } from "../game";
import { Container, Text } from "pixi.js";
import { Button } from "../ui/button";
import { centerX } from "../utils/ui";
import { GameScene } from "./game";
import { LevelSelectionScene } from "./levelSelection";

export class MenuScene extends Container implements IScene {
  load(): void {
    const title = new Text("GAME TITLE", { fontSize: 72 });
    title.x = centerX(title);
    title.y = 20;
    this.addChild(title);

    const subTitle = new Text("Menu", { fontSize: 48 });
    subTitle.x = centerX(subTitle);
    subTitle.y = 20 + title.y + title.height;
    this.addChild(subTitle);

    const playButton = new Button(0, 0, "button", "buttonHover", "Play");
    playButton.x = centerX(playButton);
    playButton.y = 40 + subTitle.y + subTitle.height;
    playButton.onClick = () => Game.changeScene(new GameScene(), "continue");
    this.addChild(playButton);

    const levelSelectionButton = new Button(
      0,
      0,
      "button",
      "buttonHover",
      "Level Selection"
    );
    levelSelectionButton.x = centerX(levelSelectionButton);
    levelSelectionButton.y = 20 + playButton.y + playButton.height;
    levelSelectionButton.onClick = () =>
      Game.changeScene(new LevelSelectionScene());
    this.addChild(levelSelectionButton);
  }

  update(_delta: number): void {}
}
