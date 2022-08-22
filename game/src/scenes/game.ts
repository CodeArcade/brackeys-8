import { Game, IScene } from "../game";
import { Container } from "pixi.js";
import { Button } from "../ui/button";
import { MenuScene } from "./menu";
import { Storage, Keys } from "../utils/storage";
import { Level as LevelSelection } from "../models/level-selection/level";
import { Level } from "../models/level/level";
import { Assets } from "@pixi/assets";
import { assets } from "../assets";
import { Tile } from "../models/game/tile";
import { Type } from "../models/level/tile";
import { EmptyTile } from "../models/game/emptyTile";
import { TileDimensions } from "models/game/tileDimensions";

export class GameScene extends Container implements IScene {
  private level!: Level;
  private grid!: Array<Array<Tile | undefined>>;

  load(args: Array<any>): void {
    let level = args[0];

    const menuButton = new Button(0, 0, "button", "buttonHover", "Menu");
    menuButton.x = 20;
    menuButton.y = 20;
    menuButton.onClick = () => Game.changeScene(new MenuScene());
    this.addChild(menuButton);

    if (level === "continue") {
      const levels = Storage.get<Array<LevelSelection>>(Keys.UnlockedLevels);
      level = levels?.reverse().filter((x) => x.unlocked)[0].id;
    }

    Assets.load(assets.filter((x) => x.name === level)[0].url).then(
      (levelAsset) => {
        this.level = levelAsset;
        this.generateLevel();
      }
    );
  }

  private generateLevel(): void {
    const tileDimensions: TileDimensions = {
      imageWidth: 220,
      imageHeight: 379,
      tileWidth: 180,
      tileHeight: 115,
    }
    this.grid = [];

    for (let y = 0; y < this.level.height; y++) {
      this.grid.push([]);

      for (let x = 0; x < this.level.width; x++) {
        this.grid[y].push(undefined);
      }
    }

    for (let y = 0; y < this.level.tiles.length; y++) {
      for (let x = 0; x < this.level.tiles[y].length; x++) {
        let tile: Tile;
        if (this.level.tiles[y][x].type === Type.Empty) {
          tile = new EmptyTile(this.level.tiles[y][x], tileDimensions, x, y);
          this.grid[y][x] = tile;
          this.addChild(tile);
        }
      }
    }
  }

  update(_delta: number): void {}
}
