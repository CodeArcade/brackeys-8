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
import { TileDimensions } from "../models/game/tileDimensions";
import { BlockedTile } from "../models/game/blockedTile";
import { StartTile } from "../models/game/startTile";
import { EndTile } from "../models/game/endTile";

export class GameScene extends Container implements IScene {
  private level!: Level;
  private grid!: Array<Array<Tile | undefined>>;
  private readonly tileDimensions: TileDimensions = {
    imageWidth: 220,
    imageHeight: 379,
    tileWidth: 180,
    tileHeight: 115,
  };

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
        this.addTileSelection();
      }
    );
  }

  private generateLevel(): void {
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
        const type = this.level.tiles[y][x].type;
        if (type === Type.Blocked) {
          tile = new BlockedTile(
            this.level.tiles[y][x],
            this.tileDimensions,
            x,
            y
          );
        } else if (type === Type.Start) {
          tile = new StartTile(
            this.level.tiles[y][x],
            this.tileDimensions,
            x,
            y,
            this.level.startFishes
          );

          tile.onClick = () => {
            console.warn("start");
          };
        } else if (type === Type.End) {
          tile = new EndTile(
            this.level.tiles[y][x],
            this.tileDimensions,
            x,
            y,
            this.level.goalFishes
          );
        } else {
          tile = new EmptyTile(
            this.level.tiles[y][x],
            this.tileDimensions,
            x,
            y
          );
        }

        this.grid[y][x] = tile;
        this.addChild(tile);
      }
    }
  }

  private addTileSelection(): void {
    let yOffset = -Infinity;
    const xOffset = 20;
    const padding = 20;

    // TODO: entfernen
    this.level.placeables = [
      { id: 1, count: 4 },
      { id: 2, count: 3 },
      { id: 3, count: 1 },
    ];
    this.level.placeables.forEach((placeable, index) => {
      const button = new Button(
        0,
        0,
        "buttonSelectTile",
        "buttonSelectTileHover",
        placeable.count.toString(),
        "emptyTileHover"
      );

      if (yOffset === -Infinity) {
        yOffset = Game.height - button.height - padding;
      }

      button.x = xOffset + index * button.width + index * padding;
      button.y = yOffset;

      button.text!.y = padding;

      button.onClick = () => {
        // TODO: set selected tile as active in Hand
        // reduce this counter by one if placed
        // increase counter by on if removed
        // can not be selected if count === 0
      };

      this.addChild(button);
    });
  }

  update(_delta: number): void {}
}
