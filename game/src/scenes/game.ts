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
import { Tile as BaseTile } from "../models/level/tile";
import { Rotation, Type } from "../models/level/tile";
import { EmptyTile } from "../models/game/emptyTile";
import { TileDimensions } from "../models/game/tileDimensions";
import { BlockedTile } from "../models/game/blockedTile";
import { StartTile } from "../models/game/startTile";
import { EndTile } from "../models/game/endTile";
import { Placeable } from "@models";
import { cloneDeep, first } from "lodash";

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
  private tileBorderRadius = 2;

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

    this.level.height += this.tileBorderRadius * 2;
    this.level.width += this.tileBorderRadius * 2;

    for (let i = 0; i < this.tileBorderRadius; i++) {
      this.level.tiles.unshift([]);
      this.level.tiles.push([]);
    }

    for (let i = 0; i < this.level.height; i++) {
      for (let k = 0; k < this.tileBorderRadius; k++) {
        this.level.tiles[i].unshift({ rotation: 0, type: Type.Blocked });
        this.level.tiles[i].push({ rotation: 0, type: Type.Blocked });
      }

      for (let j = 0; j < this.level.width; j++) {
        if (!this.level.tiles[i][j]) {
          this.level.tiles[i][j] = { rotation: 0, type: Type.Blocked };
        }
      }
    }

    console.warn(this.level);

    for (let y = 0; y < this.level.height; y++) {
      this.grid.push([]);

      for (let x = 0; x < this.level.width; x++) {
        this.grid[y].push(undefined);
      }
    }

    for (let y = 0; y < this.level.tiles.length; y++) {
      for (let x = 0; x < this.level.tiles[y].length; x++) {
        let tile: Tile = this.getTile(this.level.tiles[y][x].type, x, y);
        this.grid[y][x] = tile;
        this.addChild(tile);
      }
    }
  }

  private getTile(
    type: string,
    x: number,
    y: number,
    baseTile?: BaseTile
  ): Tile {
    if (!baseTile) {
      baseTile = this.level.tiles[y][x];
    }

    let tile: Tile;
    if (type === Type.Blocked) {
      tile = new BlockedTile(baseTile, this.tileDimensions, x, y);
    } else if (type === Type.Start) {
      tile = new StartTile(
        baseTile,
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
        baseTile,
        this.tileDimensions,
        x,
        y,
        this.level.goalFishes
      );
    } else {
      tile = new EmptyTile(baseTile, this.tileDimensions, x, y);

      tile.onClick = () => {
        if (this.selectedPlacable) {
          const placeable = first(
            this.level.placeables.filter(
              (x) => x.type === this.selectedPlacable?.type
            )
          )!;

          if (placeable.count < 1) return;

          placeable.count -= 1;

          this.removeChild(this.grid[y][x]!);
          this.grid[y][x] = this.getTile(placeable.type, x, y, {
            type: placeable.type,
            rotation: placeable.rotation,
          });
          this.grid[y][x]!.canBeRemoved = true;
          this.grid[y][x]!.interactive = true;
          this.grid[y][x]!.buttonMode = true;
          this.grid[y][x]!.onClick = () => {
            this.removeChild(this.grid[y][x]!);
            this.grid[y][x] = this.getTile(Type.Empty, x, y);
            this.addChild(this.grid[y][x]!);
            placeable.count += 1;
          };
          this.addChild(this.grid[y][x]!);
        }
      };
    }

    return tile;
  }

  private addTileSelection(): void {
    let yOffset = -Infinity;
    const xOffset = 20;
    const padding = 20;

    // TODO: entfernen
    this.level.placeables = [
      { type: Type.Blocked, count: 4, rotation: 0 },
      { type: Type.Start, count: 4, rotation: 0 },
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

        this.removeChild(cell!);
        this.addChild(cell!);
      });
    });

    this.placableButtons.forEach((button) => {
      button.text!.text = `${button.tag.count}`;
      button.buttonSprite.tint =
        button.tag.type === this.selectedPlacable?.type ? 0xffeb2a : 0xffffff;
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
