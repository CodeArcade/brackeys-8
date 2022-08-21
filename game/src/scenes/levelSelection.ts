import { Game, IScene } from "../game";
import { Container, Text } from "pixi.js";
import { Button } from "../ui/button";
import { GameScene } from "./game";
import { centerX } from "../utils/ui";
import { MenuScene } from "./menu";

export class LevelSelectionScene extends Container implements IScene {
  private readonly levels = [
    "Tutorial 1",
    "Level 1",
    "Level 1",
    "Level 1",
    "Level 1",
    "Level 1",
    "Level 1",
    "Level 1",
    "Level 1",
    "Level 1",
    "Level 1",
    "Level 1",
    "Level 1",
    "Level 1",
    "Level 1",
    "Level 1",
    "Level 1",
    "Level 1",
    "Level 1",
    "Level 1",
    "Level 1",
    "Level 1",
    "Level 1",
    "Level 1",
    "Level 1",
    "Level 1",
    "Level 1",
    "Level 1",
    "Level 1",
    "Level 1",
    "Level 1",
    "Level 1",
    "Level 1",
    "Level 1",
    "Level 1",
    "Level 1",
    "Level 1",
    "Level 1",
    "Level 1",
    "Level 1",
    "Level 1",
    "Level 1",
    "Level 1",
    "Level 1",
    "Level 1",
    "Level 1",
    "Level 1",
    "Level 1",
  ];

  load(): void {
    const title = new Text("GAME TITLE", { fontSize: 72 });
    title.x = centerX(title);
    title.y = 20;
    this.addChild(title);

    const subTitle = new Text("Level Selection", { fontSize: 48 });
    subTitle.x = centerX(subTitle);
    subTitle.y = 20 + title.y + title.height;
    this.addChild(subTitle);

    const menuButton = new Button(0, 0, "button", "buttonHover", "Menu");
    menuButton.x = 20;
    menuButton.y = 20;
    menuButton.onClick = () => Game.changeScene(new MenuScene());
    this.addChild(menuButton);

    this.addLevelSelection({
      yOffset: 40 + subTitle.y + subTitle.height,
      levelsPerRow: 5,
      padding: 20,
      xOffset: -Infinity,
    });
  }

  private addLevelSelection(
    options = {
      levelsPerRow: 5,
      padding: 20,
      yOffset: -Infinity,
      xOffset: -Infinity,
    }
  ): void {
    let { levelsPerRow, padding, yOffset, xOffset } = options;
    let buttonWidth = -Infinity;

    this.levels.forEach((level, index) => {
      const button = new Button(0, 0, "button", "buttonHover", level);
      if (buttonWidth === -Infinity) {
        buttonWidth = button.width;
        const totalWidth = levelsPerRow * (buttonWidth + padding) - padding;
        if (xOffset === -Infinity) {
          xOffset = centerX({ width: totalWidth });
        }
        if (yOffset === -Infinity) {
          yOffset =
            Game.height -
            ((this.levels.length / levelsPerRow) * button.height +
              padding * (this.levels.length / levelsPerRow) +
              padding);
        }
      }

      const yIndex = Math.floor(index / levelsPerRow);
      const xIndex = index - levelsPerRow * yIndex;

      button.onClick = () => {
        Game.changeScene(new GameScene(), level);
      };
      button.x = xOffset + xIndex * button.width + padding * xIndex;
      button.y = yOffset + yIndex * button.height + padding * yIndex;
      this.addChild(button);
    });
  }

  update(_delta: number): void {}
}
