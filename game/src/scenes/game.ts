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
import { cloneDeep, first, isEmpty, remove } from "lodash";
import { StraightTile } from "../models/game/straightTile";
import { BendyTile } from "../models/game/bendyTile";
import { TTile } from "../models/game/tTile";
import { CrossTile } from "../models/game/crossTile";
import { FisherTile } from "../models/game/fisherTile";

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
  private canPlaceTiles: boolean = true;
  private currentlySelected?: Tile;

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
      this.canPlaceTiles = false;

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

      const neighbours = this.getNeighbours(tile.gridX, tile.gridY);
      neighbours.forEach((neighbour) => {
        if (!("fish" in neighbour)) return;

        if (!neighbour.riverEnds) neighbour.riverEnds = [];

        let riverEnd: Rotation;
        if (neighbour.gridX > tile.gridX) {
          riverEnd = Rotation.Left;
        } else if (neighbour.gridX < tile.gridX) {
          riverEnd = Rotation.Right;
        } else if (neighbour.gridY > tile.gridY) {
          riverEnd = Rotation.Top;
        } else {
          riverEnd = Rotation.Bottom;
        }

        remove(neighbour.riverEnds, (x) => x === riverEnd);
        this.setNewLakeTexture(neighbour);
      });

      setTimeout(() => (this.canPlaceTiles = true), 50);
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
      this.hideContextMenu();
      setTimeout(() => (tile.canShowContextMenu = true), 50);
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
      tile.onClick = () => {
        this.hideContextMenu();
      };
    } else if (type === Type.Straight) {
      tile = new StraightTile(baseTile, this.tileDimensions, x, y);
    } else if (type === Type.Fisher) {
      tile = new FisherTile(baseTile, this.tileDimensions, x, y);
      (baseTile as any).fishers.forEach(
        (f: { direction: Rotation; count: number }) => {
          let { direction, count } = f;
          if (count > 0) {
            (tile as FisherTile).addFisher(direction, count);
          }
        }
      );
    } else if (type === Type.Bendy) {
      tile = new BendyTile(baseTile, this.tileDimensions, x, y);
    } else if (type === Type.T) {
      tile = new TTile(baseTile, this.tileDimensions, x, y);
    } else if (type === Type.Cross) {
      tile = new CrossTile(baseTile, this.tileDimensions, x, y);
    } else if (type === Type.Start) {
      tile = new StartTile(
        baseTile,
        this.tileDimensions,
        x,
        y,
        this.level.startFishes
      );

      tile.onClick = () => {
        if (!this.canPlaceTiles) return;
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
      tile.onClick = () => {
        this.hideContextMenu();
      };
    } else {
      tile = new EmptyTile(baseTile, this.tileDimensions, x, y);

      tile.onClick = () => {
        if (this.selectedPlacable && this.canPlaceTiles) {
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

          const neighbours = this.getNeighbours(x, y);
          neighbours.forEach((neighbour) => {
            if (!("fish" in neighbour)) return;

            if (!neighbour.riverEnds) neighbour.riverEnds = [];

            let riverEnd: Rotation;
            if (neighbour.gridX > x) {
              riverEnd = Rotation.Left;
            } else if (neighbour.gridX < x) {
              riverEnd = Rotation.Right;
            } else if (neighbour.gridY > y) {
              riverEnd = Rotation.Top;
            } else {
              riverEnd = Rotation.Bottom;
            }

            neighbour.riverEnds.push(riverEnd);
            this.setNewLakeTexture(neighbour);
          });
        }
      };
    }

    this.currentlySelected = tile;

    tile.onIsActive = (tile: Tile | undefined) => {
      this.resetIsActive();
      if (tile) {
        tile.isActive = true;
      }
    };

    return tile;
  }

  private setNewLakeTexture(lake: Tile): void {
    const riverEndsCount = lake.riverEnds!.length;
    let texture = "";
    // this switch is for runtime improvement ;)
    switch (riverEndsCount) {
      case 1:
        texture = `riverEnd${lake.riverEnds![0]}`;
        break;
      case 2:
      case 3:
        const combinations = [
          {
            texture: "riverStraight0",
            rotations: [Rotation.Left, Rotation.Right],
          },
          {
            texture: "riverStraight1",
            rotations: [Rotation.Top, Rotation.Bottom],
          },
          {
            texture: "riverBendy3",
            rotations: [Rotation.Top, Rotation.Left],
          },
          {
            texture: "riverBendy0",
            rotations: [Rotation.Right, Rotation.Top],
          },
          {
            texture: "riverBendy1",
            rotations: [Rotation.Right, Rotation.Bottom],
          },
          {
            texture: "riverBendy2",
            rotations: [Rotation.Bottom, Rotation.Left],
          },
          {
            texture: "riverT0",
            rotations: [Rotation.Left, Rotation.Top, Rotation.Right],
          },
          {
            texture: "riverT1",
            rotations: [Rotation.Top, Rotation.Right, Rotation.Bottom],
          },
          {
            texture: "riverT2",
            rotations: [Rotation.Right, Rotation.Bottom, Rotation.Left],
          },
          {
            texture: "riverT3",
            rotations: [Rotation.Bottom, Rotation.Left, Rotation.Top],
          },
        ];

        combinations.forEach((c) => {
          if (
            lake.riverEnds!.every((x) => c.rotations.includes(x)) &&
            lake.riverEnds!.length === c.rotations.length
          ) {
            texture = c.texture;
          }
        });
        break;
      case 4:
        texture = "riverCross0";
        break;
      default:
        texture = "lake";
        break;
    }

    lake.sprite.texture = Texture.from(texture);
  }

  private getNeighbours(x: number, y: number): Array<Tile> {
    const neighbours: Array<Tile> = [];

    neighbours.push(this.grid[y - 1][x]!);
    neighbours.push(this.grid[y + 1][x]!);
    neighbours.push(this.grid[y][x + 1]!);
    neighbours.push(this.grid[y][x - 1]!);

    return neighbours;
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
        this.hideContextMenu();

        if (placeable.count < 1 || !this.canPlaceTiles) return;

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

      this.removeChild(button);
      this.addChild(button);
    });
  }

  private startLevel(): void {
    this.togglePlacement(false);

    this.resetValidity();
    console.warn(this.validateTiles());

    this.togglePlacement(true);
  }

  private togglePlacement(enabled: boolean): void {
    this.canPlaceTiles = enabled;
    if (!enabled) {
      this.selectedPlacable = undefined;

      this.hideContextMenu();
    }
  }

  private hideContextMenu(): void {
    const contextMenuButton = first(this.tileContextMenu.children) as Button;
    if (contextMenuButton) {
      const tile = contextMenuButton.tag;
      if (!tile) return;
      tile.isActive = false;
      tile.removeChild(tile.contextMenu!);
    }
  }

  private validateTiles(): boolean {
    let result: boolean = true;

    for (let y = 0; y < this.level.tiles.length; y++) {
      for (let x = 0; x < this.level.tiles[y].length; x++) {
        const tile = this.grid[y][x]!;
        // dont check tiles without river
        if (tile.riverEnds === undefined) continue;

        if (
          !tile.riverEndsWithRotation ||
          isEmpty(tile.riverEndsWithRotation)
        ) {
          if ("fish" in tile) {
            result = false;
          }

          continue;
        }

        for (let end of tile.riverEndsWithRotation) {
          let nextTile: Tile | undefined;
          let xNextTile = tile.gridX;
          let yNextTile = tile.gridY;

          switch (end) {
            case Rotation.Left:
              xNextTile -= 1;
              break;
            case Rotation.Top:
              yNextTile -= 1;
              break;
            case Rotation.Right:
              xNextTile += 1;
              break;
            case Rotation.Bottom:
              yNextTile += 1;
              break;
          }

          nextTile = this.grid[yNextTile][xNextTile];

          if (!nextTile) {
            result = false;
            tile.updateValiditiy(false);

            continue;
          }

          if (!nextTile.riverEndsWithRotation) {
            result = false;
            tile.updateValiditiy(false);

            continue;
          }

          let connected: boolean = false;
          nextTile.riverEndsWithRotation.forEach((entry) => {
            if (connected) return;

            switch (entry) {
              case Rotation.Left:
                if (end === Rotation.Right) {
                  connected = true;
                }
                break;
              case Rotation.Top:
                if (end === Rotation.Bottom) {
                  connected = true;
                }
                break;
              case Rotation.Right:
                if (end === Rotation.Left) {
                  connected = true;
                }
                break;
              case Rotation.Bottom:
                if (end === Rotation.Top) {
                  connected = true;
                }
                break;
            }
          });

          if (!connected) {
            result = false;
            tile.updateValiditiy(false);

            continue;
          }
        }
      }
    }

    return result;
  }

  private validateTile(
    tile: Tile,
    checkedTiles: Array<Tile>,
    riverEntry?: Rotation,
    result?: boolean
  ): boolean {
    console.info("current", tile.gridX, tile.gridY);
    if (!tile.riverEndsWithRotation) {
      console.debug("no river ends with rotation");
      return true;
    }

    const alreadyCheckedTile = first(checkedTiles.filter((x) => x === tile));
    if (alreadyCheckedTile) {
      console.debug("tile already checked");
      return result!;
    }

    console.debug("all ends", tile.riverEndsWithRotation);
    const riverEnds = tile.riverEndsWithRotation.filter(
      (x) => x !== riverEntry
    );
    let nextTile: Tile | undefined;

    console.debug("ends without entry", riverEnds);

    if (isEmpty(riverEnds)) {
      console.debug("no new river ends");
      if (result === undefined) {
        result = true;
        tile.updateValiditiy(result);
      }
      return result;
    }

    riverEnds.forEach((end) => {
      let xNextTile = tile.gridX;
      let yNextTile = tile.gridY;

      switch (end) {
        case Rotation.Left:
          xNextTile -= 1;
          break;
        case Rotation.Top:
          yNextTile -= 1;
          break;
        case Rotation.Right:
          xNextTile += 1;
          break;
        case Rotation.Bottom:
          yNextTile += 1;
          break;
      }
      console.debug("next tile", xNextTile, yNextTile);

      nextTile = this.grid[yNextTile][xNextTile];

      if (!nextTile) {
        console.debug("no next");
        result = false;
        tile.updateValiditiy(result);
        return;
      }

      if (!nextTile.riverEndsWithRotation) {
        console.debug("no river ends");
        result = false;
        tile.updateValiditiy(result);
        return;
      }

      let nextEntry: Rotation | undefined = undefined;
      nextTile.riverEndsWithRotation.forEach((entry) => {
        if (nextEntry) return;
        console.debug("comparing entry and end", { end, entry });

        switch (entry) {
          case Rotation.Left:
            if (end === Rotation.Right) {
              nextEntry = entry;
            }
            break;
          case Rotation.Top:
            if (end === Rotation.Bottom) {
              nextEntry = entry;
            }
            break;
          case Rotation.Right:
            if (end === Rotation.Left) {
              nextEntry = entry;
            }
            break;
          case Rotation.Bottom:
            if (end === Rotation.Top) {
              nextEntry = entry;
            }
            break;
        }
      });

      if (nextEntry !== undefined) {
        console.debug("next entry");
        checkedTiles.push(tile);
        result = this.validateTile(nextTile!, checkedTiles, nextEntry, result);
      } else {
        console.debug("no next entry");
      }
    });

    console.info(
      "ending recursion of",
      tile.gridX,
      tile.gridY,
      "result",
      result
    );

    if (result === undefined) {
      result = false;
    }

    return result;
  }

  private resetValidity(): void {
    for (let y = 0; y < this.level.tiles.length; y++) {
      for (let x = 0; x < this.level.tiles[y].length; x++) {
        this.grid[y][x]?.updateValiditiy(true);
      }
    }
  }

  private resetIsActive(): void {
    for (let y = 0; y < this.level.tiles.length; y++) {
      for (let x = 0; x < this.level.tiles[y].length; x++) {
        this.grid[y][x]!.isActive = false;
      }
    }
  }

  private findStartTile(): StartTile | undefined {
    for (let y = 0; y < this.level.tiles.length; y++) {
      for (let x = 0; x < this.level.tiles[y].length; x++) {
        if (this.grid[y][x]?.baseTile.type === Type.Start) {
          return this.grid[y][x] as StartTile;
        }
      }
    }

    return undefined;
  }

  update(_delta: number): void {
    this.updateUi();
  }
}
