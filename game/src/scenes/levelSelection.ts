import { Game, IScene } from '../game';
import { Container, Graphics, Loader, Sprite, Texture, Text } from "pixi.js";
import { Button } from '../ui/button';
import { GameScene } from './game';


export class LevelSelectionScene extends Container implements IScene {

  private readonly levels = ["Tutorial 1", "Level 1", "Level 1", "Level 1", "Level 1", "Level 1", "Level 1", "Level 1", "Level 1", "Level 1", "Level 1", "Level 1", "Level 1", "Level 1", "Level 1", "Level 1", "Level 1", "Level 1", "Level 1", "Level 1", "Level 1", "Level 1", "Level 1", "Level 1", "Level 1", "Level 1", "Level 1", "Level 1", "Level 1", "Level 1", "Level 1", "Level 1", "Level 1", "Level 1", "Level 1", "Level 1", "Level 1", "Level 1", "Level 1", "Level 1", "Level 1", "Level 1", "Level 1", "Level 1", "Level 1", "Level 1", "Level 1", "Level 1"];

  load(): void {
    const text = new Text();    

    this.addLevelSelection();
  }

  private addLevelSelection(options = {levelsPerRow: 5, padding: 20}): void {
    const { levelsPerRow, padding } = options;
    let xOffset = 0;
    let yOffset = Game.height;
    let buttonWidth = -Infinity;

    this.levels.forEach((level, index) => {     
      const button = new Button(0, 0, 'button', 'buttonHover', level);
      if (buttonWidth === -Infinity) {
        buttonWidth = button.width;
        const totalWidth = (levelsPerRow * (buttonWidth + padding)) - padding;
        xOffset = (Game.width / 2) - (totalWidth / 2);
        yOffset -= (this.levels.length / levelsPerRow) * button.height + (padding * (this.levels.length / levelsPerRow)) + padding;
      }

      const yIndex = Math.floor(index / levelsPerRow);
      const xIndex = index - (levelsPerRow * yIndex);

      button.onClick = () => { Game.changeScene(new GameScene(), level) }
      button.x = xOffset + (xIndex * button.width) + (padding * xIndex); 
      button.y = yOffset + (yIndex * button.height) + (padding * yIndex);
      this.addChild(button);
    });
  }

  update(_delta: number): void {}
}