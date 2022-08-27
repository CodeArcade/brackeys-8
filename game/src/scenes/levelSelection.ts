import { Game, IScene } from "../game";
import { Container, Sprite, Text, Texture } from "pixi.js";
import { Button } from "../ui/button";
import { GameScene } from "./game";
import { centerX } from "../utils/ui";
import { MenuScene } from "./menu";
import { Level } from "../models/level-selection/level";
import { Storage, Keys } from "../utils/storage";

export class LevelSelectionScene extends Container implements IScene {
  private levels!: Array<Level>;

  load(): void {
    this.addChild(new Sprite(Texture.from("menuBackground")))

    const title = new Text(Game.title, { fontSize: 72 });
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

    this.levels = Storage.get<Array<Level>>(Keys.UnlockedLevels) || [];

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
      const button = new Button(0, 0, "button", "buttonHover", level.id);
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

      if (level.unlocked) {
        button.onClick = () => {
          Game.changeScene(new GameScene(), level.id);
        };
      } else {
        button.interactive = false;
        button.buttonMode = false;

        button.contentSprite = new Sprite(Texture.from("buttonLock"));
        button.contentSprite.scale.set(2);
        button.contentSprite.x =
          button.width / 2 - button.contentSprite.width / 2;
        button.contentSprite.y =
          button.height / 2 - button.contentSprite.height / 2;
        button.addChild(button.contentSprite);
      }
      button.x = xOffset + xIndex * button.width + padding * xIndex;
      button.y = yOffset + yIndex * button.height + padding * yIndex;
      this.addChild(button);
    });
  }

  update(_delta: number): void {}
}
