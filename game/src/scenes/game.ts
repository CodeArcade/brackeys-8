import { Game, IScene } from "../game";
import { Container, Texture } from "pixi.js";
import { Button } from "../ui/button";
import { MenuScene } from "./menu";
import { Storage, Keys } from "../utils/storage";
import { Level as LevelSelection } from "../models/level-selection/level";
import { Level } from "../models/level/level";
import { Assets } from "@pixi/assets";
import { assets } from "../assets";
import { Tile } from "../models/game/tile";
import { Rotation, Type } from "../models/level/tile";
import { EmptyTile } from "../models/game/emptyTile";
import { TileDimensions } from "../models/game/tileDimensions";
import { BlockedTile } from "../models/game/blockedTile";
import { StartTile } from "../models/game/startTile";
import { EndTile } from "../models/game/endTile";
import { Placeable } from "@models";
import { cloneDeep, first, last, toNumber } from "lodash";

export class GameScene extends Container implements IScene {
  private level!: Level;
  private grid!: Array<Array<Tile | undefined>>;
  private placableButtons!: Array<Button>;
  private readonly tileDimensions: TileDimensions = {
    imageWidth: 220,
    imageHeight: 379,
    tileWidth: 180,
    tileHeight: 115,
  };
  private selectedPlacable?: Placeable;

  load(args: Array<any>): void {
    let level = args[0];
    this.placableButtons = [];

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
            this.startLevel();
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

          tile.onClick = () => {
            if (this.selectedPlacable) {
              const placeable = first(
                this.level.placeables.filter(
                  (x) => x.type === this.selectedPlacable?.type
                )
              )!;

              placeable.count -= 1;

              if (placeable.count <= 0) {
                this.selectedPlacable = undefined;
              }
            }
          };
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
      { type: Type.Blocked, count: 4, rotation: 0 },
      { type: Type.Start, count: 4, rotation: 0 },
      { type: Type.Blocked, count: 4, rotation: 0 },
    ];
    this.level.placeables.forEach((placeable, index) => {
      const texture = Tile.getTextureToType(placeable.type) + "0";
      const button = new Button(
        0,
        0,
        "buttonSelectTile",
        "buttonSelectTileHover",
        `${placeable.count}`,
        texture
      );

      if (yOffset === -Infinity) {
        yOffset = Game.height - button.height - padding;
      }

      button.x = xOffset + index * button.width + index * padding;
      button.y = yOffset;

      button.text!.y = padding;

      button.tag = placeable;

      button.onClick = () => {
        if (placeable.count < 1) return;

        if (this.selectedPlacable && this.selectedPlacable === placeable) {
          this.selectedPlacable = undefined;
        } else {
          this.selectedPlacable = cloneDeep(placeable);
          this.selectedPlacable.rotation = Rotation.Bottom;
          this.selectedPlacable.texture = texture;
        }

        // TODO: set selected tile as active in Hand
        // reduce this counter by one if placed
        // increase counter by on if removed
        // can not be selected if count === 0
      };

      this.placableButtons.push(button);
      this.addChild(button);
    });
  }

  private updateUi(): void {
    if (!this.grid) return;

    this.grid.forEach((row) => {
      row.forEach((cell) => {
        if (cell?.baseTile.type === Type.Empty) {
          const empty = cell as EmptyTile;
          empty.hoverTexture = Texture.from(
            this.selectedPlacable ? this.selectedPlacable.texture! : "emptyTile"
          );
        }
      });
    });

    this.placableButtons.forEach((button) => {
      button.text!.text = `${button.tag.count}`;
    });
  }

  private startLevel(): void {
    // TODO: validate Tiles
    // Move fish
    // disable tile placement
  }

  update(_delta: number): void {
    this.updateUi();
  }
}
