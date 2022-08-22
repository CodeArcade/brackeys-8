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
import { StraightTile } from "../models/game/straightTile";

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
  private tileContextMenu!: Container;

  load(args: Array<any>): void {
    let level = args[0];
    this.placableButtons = [];

    const menuButton = new Button(0, 0, "button", "buttonHover", "Menu");
    menuButton.x = 20;
    menuButton.y = 20;
    menuButton.onClick = () => Game.changeScene(new MenuScene());
    this.addChild(menuButton);

    this.generateContextMenu();

    if (level === "continue") {
      const levels = Storage.get<Array<LevelSelection>>(Keys.UnlockedLevels);
      level = levels?.reverse().filter((x) => x.unlocked)[0].id;
    }

    Assets.load(assets.filter((x) => x.name === level)[0].url).then(
      (levelAsset) => {
        this.level = cloneDeep(levelAsset);
        this.generateLevel();
        this.addTileSelection();
      }
    );
  }

  private generateContextMenu(): void {
    const padding = 20;
    this.tileContextMenu = new Container();
    this.tileContextMenu.y = -this.tileDimensions.tileHeight - padding * 2;
    this.tileContextMenu.x = padding;

    const rotateLeftButton = new Button(
      0,
      0,
      "buttonSelectTile",
      "buttonSelectTileHover",
      "<-"
    );
    rotateLeftButton.scale.set(0.5);
    rotateLeftButton.onClick = () => {
      const tile = removeButton.tag as Tile;
      let rotation = tile.baseTile.rotation;

      rotation -= 1;
      if (rotation < 0) {
        rotation = 3;
      }
      tile.updateRotation(rotation);
    };

    const removeButton = new Button(
      rotateLeftButton.x + rotateLeftButton.width + padding,
      -padding - padding / 2,
      "buttonSelectTile",
      "buttonSelectTileHover",
      "X"
    );
    removeButton.scale.set(0.5);
    removeButton.onClick = () => {
      const tile = removeButton.tag as Tile;
      const placeable = first(
        this.level.placeables.filter((x) => x.type === tile.baseTile.type)
      )!;
      this.removeChild(tile);
      this.grid[tile.gridY][tile.gridX] = this.getTile(
        Type.Empty,
        tile.gridX,
        tile.gridY
      );
      this.addChild(this.grid[tile.gridY][tile.gridX]!);
      placeable.count += 1;
    };

    const hideButton = new Button(
      rotateLeftButton.x + rotateLeftButton.width + padding,
      padding + padding / 2,
      "buttonSelectTile",
      "buttonSelectTileHover",
      "Hide"
    );
    hideButton.scale.set(0.5);
    hideButton.onClick = () => {
      const tile = removeButton.tag as Tile;
      tile.canShowContextMenu = false;
      tile.removeChild(tile.contextMenu!);
      setTimeout(() => (tile.canShowContextMenu = true), 250);
    };

    const rotateRightButton = new Button(
      removeButton.x + removeButton.width + padding,
      0,
      "buttonSelectTile",
      "buttonSelectTileHover",
      "->"
    );
    rotateRightButton.scale.set(0.5);
    rotateRightButton.onClick = () => {
      const tile = removeButton.tag as Tile;
      let rotation = tile.baseTile.rotation;

      rotation += 1;
      if (rotation > 3) {
        rotation = 0;
      }
      tile.updateRotation(rotation);
    };

    this.tileContextMenu.addChild(removeButton);
    this.tileContextMenu.addChild(hideButton);
    this.tileContextMenu.addChild(rotateLeftButton);
    this.tileContextMenu.addChild(rotateRightButton);
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
    } else if (type === Type.Straight) {
      tile = new StraightTile(baseTile, this.tileDimensions, x, y);
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
            rotation: this.selectedPlacable.rotation,
          });
          this.grid[y][x]!.canBeRemoved = true;
          this.grid[y][x]!.interactive = true;
          this.grid[y][x]!.buttonMode = true;
          this.grid[y][x]!.contextMenu = this.tileContextMenu;
          this.grid[y][x]!.showConextMenu();
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

    this.level.placeables.forEach((placeable, index) => {
      placeable.rotation = 0;
      const texture = Tile.getTextureToType(placeable.type);
      const button = new Button(
        0,
        0,
        "buttonSelectTile",
        "buttonSelectTileHover",
        `${placeable.count}`,
        texture + "0"
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

        if (
          this.selectedPlacable &&
          this.selectedPlacable.type === placeable.type
        ) {
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
            this.selectedPlacable
              ? this.selectedPlacable.texture! + this.selectedPlacable!.rotation
              : "emptyTile"
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
