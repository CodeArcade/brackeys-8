import { Game, IScene } from "../game";
import { Container, Sprite, Texture } from "pixi.js";
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
import { Fish } from "../models/game/fish";
import TileHitbox from "../models/game/tileHitbox";
import { getRandomNumber } from "../utils/random";

export class GameScene extends Container implements IScene {
  private level!: Level;
  private grid!: Array<Array<Tile | undefined>>;
  private placableButtons!: Array<Button>;
  private selectedPlacable?: Placeable;
  private canPlaceTiles: boolean = true;
  private fish: Array<Fish> = [];
  private fisher: Array<FisherTile> = [];
  private fences: Array<Sprite> = [];
  private startButton!: Button;

  load(args: Array<any>): void {
    let level = args[0];
    this.placableButtons = [];

    const menuButton = new Button(0, 0, "button", "buttonHover", "Menu");
    menuButton.x = 20;
    menuButton.y = 20;
    menuButton.onClick = () => Game.changeScene(new MenuScene());
    this.addChild(menuButton);

    this.startButton = new Button(
      0,
      0,
      "buttonSelectTile",
      "buttonSelectTileHover",
      undefined,
      "arrowRight"
    );
    const padding = 20;
    this.startButton.y = Game.height - this.startButton.height - padding;
    this.startButton.x = Game.width - padding - this.startButton.width;
    this.startButton.contentSprite!.scale.set(2);
    this.startButton.contentSprite!.x =
      this.startButton.width / 2 - this.startButton.contentSprite!.width / 2;
    this.startButton.contentSprite!.y =
      this.startButton.height / 2 - this.startButton.contentSprite!.height / 2;
    this.startButton.onClick = () => {
      if (!this.canPlaceTiles) return;
      this.startLevel();
    };
    this.addChild(this.startButton);

    if (level === "continue") {
      const levels = Storage.get<Array<LevelSelection>>(Keys.UnlockedLevels);
      level = levels?.reverse().filter((x) => x.unlocked)[0].id;
    }

    Assets.load(assets.filter((x) => x.name === level)[0].url).then(
      (levelAsset) => {
        this.level = cloneDeep(levelAsset);
        this.generateLevel();
        this.updateLakes();
        this.addTileSelection();
      }
    );
  }

  private generateLevel(): void {
    this.grid = [];

    this.level.height += Tile.Constants.BorderRadius * 2;
    this.level.width += Tile.Constants.BorderRadius * 2;

    for (let i = 0; i < Tile.Constants.BorderRadius; i++) {
      this.level.tiles.unshift([]);
      this.level.tiles.push([]);
    }

    for (let i = 0; i < this.level.height; i++) {
      for (let k = 0; k < Tile.Constants.BorderRadius; k++) {
        this.level.tiles[i].unshift({ rotation: 0, type: Type.Blocked });
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
        if (tile.baseTile.type !== Type.Empty) {
          tile.blocking = true;
        }
        this.addChild(tile);
      }
    }

    this.generateFences();
    this.grid.forEach((row, y) => {
      row.forEach((tile, x) => {
        if (
          y === 0 ||
          y === this.level.height - 1 ||
          x === 0 ||
          x === this.level.width - 1
        )
          return;
        if (tile?.baseTile.type !== Type.Blocked) return;
        if ((tile as BlockedTile).hasFence) return;
        (tile as BlockedTile).placeDecoration();
      });
    });
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
      tile = new BlockedTile(baseTile, Tile.Constants.TileDimensions, x, y);
    } else if (type === Type.Straight) {
      tile = new StraightTile(baseTile, Tile.Constants.TileDimensions, x, y);
    } else if (type === Type.Fisher) {
      tile = new FisherTile(baseTile, Tile.Constants.TileDimensions, x, y);
      (baseTile as any).fishers.forEach(
        (f: { direction: Rotation; count: number }) => {
          let { direction, count } = f;
          if (count > 0) {
            (tile as FisherTile).addFisher(direction, count);
          }
        }
      );
      this.fisher.push(tile as FisherTile);
    } else if (type === Type.Bendy) {
      tile = new BendyTile(baseTile, Tile.Constants.TileDimensions, x, y);
    } else if (type === Type.T) {
      tile = new TTile(baseTile, Tile.Constants.TileDimensions, x, y);
    } else if (type === Type.Cross) {
      tile = new CrossTile(baseTile, Tile.Constants.TileDimensions, x, y);
    } else if (type === Type.Start) {
      tile = new StartTile(
        baseTile,
        Tile.Constants.TileDimensions,
        x,
        y,
        this.level.startFishes
      );

      tile.onClick = () => {
        if (!this.canPlaceTiles) return;
        this.startLevel();
      };

      for (let i = 0; i < this.level.startFishes; i++) {
        this.fish.push(new Fish(tile));
      }
    } else if (type === Type.End) {
      tile = new EndTile(
        baseTile,
        Tile.Constants.TileDimensions,
        x,
        y,
        this.level.goalFishes
      );
    } else {
      tile = new EmptyTile(baseTile, Tile.Constants.TileDimensions, x, y);
      tile.bindEvents();

      tile.onClick = () => {
        if (this.selectedPlacable && this.canPlaceTiles) {
          const placeable = first(
            this.level.placeables.filter(
              (x) => x.type === this.selectedPlacable?.type
            )
          )!;

          if (placeable.count < 1) return;

          placeable.count -= 1;

          this.grid[y][x]!.unbindEvents();
          this.removeChild(this.grid[y][x]!);
          this.grid[y][x] = this.getTile(placeable.type, x, y, {
            type: placeable.type,
            rotation: this.grid[y][x]!.baseTile.rotation,
          });
          this.grid[y][x]!.canBeRemoved = true;
          this.grid[y][x]!.interactive = true;
          this.grid[y][x]!.buttonMode = true;
          this.addChild(this.grid[y][x]!);
          this.grid[y][x]!.bindEvents();

          this.updateLakes();
        }
      };
    }

    if (!tile.onRotation) {
      tile.onRotation = () => {
        this.updateLakes();
      };
    }

    if (!tile.onRemove) {
      tile.onRemove = (tile) => {
        if (!tile) return;
        if (tile.blocking) return;
        if (tile.baseTile.type === Type.Empty) return;
        const x = tile.gridX;
        const y = tile.gridY;

        this.canPlaceTiles = false;

        const placeable = first(
          this.level.placeables.filter((x) => x.type === tile!.baseTile.type)
        )!;
        tile.unbindEvents();
        tile.canBeDeleted = false;
        this.removeChild(tile);
        this.grid[y][x] = this.getTile(Type.Empty, x, y);
        this.addChild(this.grid[y][x]!);
        this.grid[y][x]!.bindEvents();

        placeable.count += 1;

        this.updateLakes();

        setTimeout(() => (this.canPlaceTiles = true), 50);
      };
    }

    return tile;
  }

  private updateLakes(): void {
    const lakeTiles = [this.findStartTile(), this.findEndTile()];
    lakeTiles.forEach((lakeTile) => {
      if (!lakeTile) return;
      if (!lakeTile.riverEnds) lakeTile.riverEnds = [];
      const neighbours = this.getNeighbours(lakeTile.gridX, lakeTile.gridY);

      neighbours.forEach((neighbour) => {
        let riverEnd: Rotation | undefined = undefined;
        if (
          neighbour.riverEndsWithRotation?.includes(Rotation.Right) &&
          lakeTile.gridX > neighbour.gridX
        ) {
          riverEnd = Rotation.Left;
        } else if (
          neighbour.riverEndsWithRotation?.includes(Rotation.Left) &&
          lakeTile.gridX < neighbour.gridX
        ) {
          riverEnd = Rotation.Right;
        } else if (
          neighbour.riverEndsWithRotation?.includes(Rotation.Bottom) &&
          lakeTile.gridY > neighbour.gridY
        ) {
          riverEnd = Rotation.Top;
        } else if (
          neighbour.riverEndsWithRotation?.includes(Rotation.Top) &&
          lakeTile.gridY < neighbour.gridY
        ) {
          riverEnd = Rotation.Bottom;
        }

        if (riverEnd !== undefined && !lakeTile.riverEnds?.includes(riverEnd)) {
          lakeTile.riverEnds!.push(riverEnd);
        } else if (riverEnd === undefined) {
          if (lakeTile.gridX > neighbour.gridX) {
            riverEnd = Rotation.Left;
          } else if (lakeTile.gridX < neighbour.gridX) {
            riverEnd = Rotation.Right;
          } else if (lakeTile.gridY > neighbour.gridY) {
            riverEnd = Rotation.Top;
          } else if (lakeTile.gridY < neighbour.gridY) {
            riverEnd = Rotation.Bottom;
          }

          remove(lakeTile.riverEnds!, (x) => x === riverEnd);
        }
        this.setNewLakeTexture(lakeTile);
      });
    });
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
          empty.showDecoration = !this.selectedPlacable;
          empty.hoverTexture = this.selectedPlacable
            ? this.selectedPlacable.texture!
            : "blockedTile";
        }

        this.removeChild(cell!);
        this.addChild(cell!);
      });
    });

    this.fences.forEach((fence) => {
      this.removeChild(fence);
      this.addChild(fence);
    });

    this.fish = this.fish.sort((a, b) => (a.y > b.y ? 1 : -1));

    this.fish.forEach((f) => {
      this.removeChild(f);
      this.addChild(f);
    });

    this.placableButtons.forEach((button) => {
      button.text!.text = `${button.tag.count}`;
      button.buttonSprite.tint =
        button.tag.type === this.selectedPlacable?.type ? 0xffeb2a : 0xffffff;

      this.removeChild(button);
      this.addChild(button);
    });

    this.removeChild(this.startButton);
    this.addChild(this.startButton);
  }

  private startLevel(): void {
    if (!this.canPlaceTiles) return;
    this.togglePlacement(false);

    this.resetValidity();
    if (this.validateTiles()) {
      const path = this.findShortestPath();
      this.fish.forEach((f, i) => {
        f.path = path;
        setTimeout(() => f.startSwimming(), i * 750);
      });
    } else {
      this.togglePlacement(true);
    }

    this.findStartTile()!.sprite.tint = 0xffffff;
  }

  private togglePlacement(enabled: boolean): void {
    this.canPlaceTiles = enabled;

    this.grid.forEach((row) => {
      row.forEach((cell) => {
        cell!.canHover = enabled;
        if (!enabled) {
          cell!.isActive = false;
        }
      });
    });

    if (!enabled) {
      this.selectedPlacable = undefined;
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

  private findShortestPath(): Array<Tile> {
    const paths: Array<Array<Tile>> = [];

    for (let i = 0; i < 1000; i++) {
      paths.push(this.findPath());
    }

    const lengths = paths.map((x) => x.length);
    const min = Math.min.apply(Math, lengths);
    return paths[lengths.indexOf(min)];
  }

  private findPath(): Array<Tile> {
    const startTile = this.findStartTile()!;
    const endTile = this.findEndTile()!;
    let currentTile: Tile = startTile;
    const visited: Array<Tile> = [currentTile];
    const path: Array<Tile> = [];
    const stack: Array<Tile> = [currentTile];
    let foundEnd: boolean = false;

    while (stack.length > 0) {
      currentTile = stack.pop()!;

      const connectableNeighbours = this.getNeighbours(
        currentTile.gridX,
        currentTile.gridY
      ).filter((x) => !visited.includes(x) && this.canConnect(currentTile, x));

      if (connectableNeighbours?.length > 0) {
        stack.push(currentTile);
        if (!foundEnd && !path.includes(currentTile)) {
          path.push(currentTile);
        }

        const index = getRandomNumber(0, connectableNeighbours.length - 1);
        const targetTile = connectableNeighbours[index];

        visited.push(targetTile);

        if (targetTile === endTile) {
          path.push(targetTile);
          foundEnd = true;
          continue;
        }

        stack.push(targetTile);
      }
    }

    return path;
  }

  private canConnect(tile1: Tile, tile2: Tile): boolean {
    if (!tile2.riverEndsWithRotation || !tile1.riverEndsWithRotation) {
      return false;
    }

    if (tile1.gridX > tile2.gridX) {
      return (
        tile1.riverEndsWithRotation.includes(Rotation.Left) &&
        tile2.riverEndsWithRotation.includes(Rotation.Right)
      );
    }

    if (tile1.gridX < tile2.gridX) {
      return (
        tile1.riverEndsWithRotation.includes(Rotation.Right) &&
        tile2.riverEndsWithRotation.includes(Rotation.Left)
      );
    }

    if (tile1.gridY > tile2.gridY) {
      return (
        tile1.riverEndsWithRotation.includes(Rotation.Top) &&
        tile2.riverEndsWithRotation.includes(Rotation.Bottom)
      );
    }

    if (tile1.gridY < tile2.gridY) {
      return (
        tile1.riverEndsWithRotation.includes(Rotation.Bottom) &&
        tile2.riverEndsWithRotation.includes(Rotation.Top)
      );
    }

    return false;
  }

  private resetValidity(): void {
    for (let y = 0; y < this.level.tiles.length; y++) {
      for (let x = 0; x < this.level.tiles[y].length; x++) {
        this.grid[y][x]?.updateValiditiy(true);
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

  private findEndTile(): EndTile | undefined {
    if (!this.level) return undefined;

    for (let y = 0; y < this.level.tiles.length; y++) {
      for (let x = 0; x < this.level.tiles[y].length; x++) {
        if (this.grid[y][x]?.baseTile.type === Type.End) {
          return this.grid[y][x] as EndTile;
        }
      }
    }

    return undefined;
  }

  private checkWin(): void {
    const endTile = this.findEndTile()!;

    if (
      endTile &&
      endTile.fishReached >= endTile.fish &&
      this.fish.every((x) => x.dead || x.addedFish)
    ) {
      const levels = Storage.get<Array<LevelSelection>>(Keys.UnlockedLevels)!;
      let levelIndex = -Infinity;

      for (let i = 0; i < levels.length; i++) {
        if (levelIndex !== -Infinity) break;

        if (levels[i].id === this.level.name) {
          levelIndex = i;
        }
      }

      console.log(levels);
      console.log(levelIndex);
      if (levelIndex + 1 < levels.length) {
        const level = levels[levelIndex + 1];
        console.log(level);
        level.unlocked = true;
        Storage.set(Keys.UnlockedLevels, levels);
        Game.changeScene(new GameScene(), level.id);
      } else {
        Game.changeScene(new MenuScene());
      }
    }

    if (
      endTile &&
      endTile.fishReached < endTile.fish &&
      this.fish.every((x) => x.dead || x.addedFish)
    ) {
      this.fish.forEach((f) => {
        f.reset();
      });

      this.fisher.forEach((f) => {
        f.fisher.forEach((f2) => {
          f2.caught = 0;
        });
      });

      endTile.reset();

      this.togglePlacement(true);
    }
  }

  private updateFish(delta: number): void {
    this.fish.forEach((fish) => {
      fish.update(delta);

      if (fish.dead) return;

      const fishers = this.getNeighbours(
        fish.currentTile.gridX,
        fish.currentTile.gridY
      ).filter((x) => "fisher" in x);
      fishers.forEach((fisher) => {
        let directionToFisher: Rotation;
        if (fisher.gridX > fish.currentTile.gridX)
          directionToFisher = Rotation.Left;
        if (fisher.gridX < fish.currentTile.gridX)
          directionToFisher = Rotation.Right;
        if (fisher.gridY > fish.currentTile.gridY)
          directionToFisher = Rotation.Top;
        if (fisher.gridY < fish.currentTile.gridY)
          directionToFisher = Rotation.Bottom;

        const actualFisher = first(
          (fisher as FisherTile).fisher.filter(
            (x) => x.rotation === directionToFisher
          )
        );
        if (!actualFisher) return;

        if (actualFisher.caught < actualFisher.count) {
          fish.dead = true;
          actualFisher.caught += 1;
        }
      });
    });
  }

  update(delta: number): void {
    this.updateUi();

    this.updateFish(delta);
    this.checkWin();
  }

  private generateFences() {
    const topBendyFenceTile =
      this.grid[Tile.Constants.BorderRadius - 1][
        Tile.Constants.BorderRadius - 1
      ];
    const topBendyFence = new Sprite(Texture.from("bendyFence3"));
    (topBendyFenceTile as BlockedTile).hasFence = true;
    topBendyFence.anchor.set(0, 1);
    topBendyFence.hitArea = new TileHitbox(
      "bendyFence3",
      Tile.Constants.TileDimensions.tileWidth,
      Tile.Constants.TileDimensions.tileHeight
    );
    topBendyFence.x = topBendyFenceTile!.x;
    topBendyFence.y = topBendyFenceTile!.y;
    this.addChild(topBendyFence);
    this.fences.push(topBendyFence);

    const rightBendyFence = new Sprite(Texture.from("bendyFence0"));
    const rightBendyFenceTile =
      this.grid[Tile.Constants.BorderRadius - 1][
        this.level.width - Tile.Constants.BorderRadius
      ];
    (rightBendyFenceTile as BlockedTile).hasFence = true;
    rightBendyFence.anchor.set(0, 1);
    rightBendyFence.hitArea = new TileHitbox(
      "bendyFence0",
      Tile.Constants.TileDimensions.tileWidth,
      Tile.Constants.TileDimensions.tileHeight
    );
    rightBendyFence.x = rightBendyFenceTile!.x;
    rightBendyFence.y = rightBendyFenceTile!.y;
    this.addChild(rightBendyFence);
    this.fences.push(rightBendyFence);

    const bottomBendyFence = new Sprite(Texture.from("bendyFence1"));
    const bottomBendyFenceTile =
      this.grid[this.level.height - Tile.Constants.BorderRadius][
        this.level.width - Tile.Constants.BorderRadius
      ];
    (bottomBendyFenceTile as BlockedTile).hasFence = true;
    bottomBendyFence.anchor.set(0, 1);
    bottomBendyFence.hitArea = new TileHitbox(
      "bendyFence1",
      Tile.Constants.TileDimensions.tileWidth,
      Tile.Constants.TileDimensions.tileHeight
    );
    bottomBendyFence.x = bottomBendyFenceTile!.x;
    bottomBendyFence.y = bottomBendyFenceTile!.y;
    this.addChild(bottomBendyFence);
    this.fences.push(bottomBendyFence);

    const leftBendyFence = new Sprite(Texture.from("bendyFence2"));
    const leftBendyFenceTile =
      this.grid[this.level.height - Tile.Constants.BorderRadius][
        Tile.Constants.BorderRadius - 1
      ];
    (leftBendyFenceTile as BlockedTile).hasFence = true;
    leftBendyFence.anchor.set(0, 1);
    leftBendyFence.hitArea = new TileHitbox(
      "bendyFence2",
      Tile.Constants.TileDimensions.tileWidth,
      Tile.Constants.TileDimensions.tileHeight
    );
    leftBendyFence.x = leftBendyFenceTile!.x;
    leftBendyFence.y = leftBendyFenceTile!.y;
    this.addChild(leftBendyFence);
    this.fences.push(leftBendyFence);

    // place fences from top to right
    // and bottom to right
    for (let i = 0; i < 2; i++) {
      for (
        let x = Tile.Constants.BorderRadius;
        x < this.level.width - Tile.Constants.BorderRadius;
        x++
      ) {
        const y =
          i === 0
            ? Tile.Constants.BorderRadius - 1
            : this.level.height - Tile.Constants.BorderRadius;
        const fenceVariant = i === 0 ? 1 : 3;
        const fence = new Sprite(Texture.from(`fence${fenceVariant}`));
        fence.anchor.set(0, 1);
        fence.hitArea = new TileHitbox(
          `fence${fenceVariant}`,
          Tile.Constants.TileDimensions.tileWidth,
          Tile.Constants.TileDimensions.tileHeight
        );
        const tile = this.grid[y][x];
        (tile as BlockedTile).hasFence = true;
        fence.x = tile!.x;
        fence.y = tile!.y;
        this.addChild(fence);
        this.fences.push(fence);
      }
    }

    // place fences from top to left
    for (let i = 0; i < 2; i++) {
      for (
        let y = Tile.Constants.BorderRadius;
        y < this.level.height - Tile.Constants.BorderRadius;
        y++
      ) {
        const x =
          i === 0
            ? Tile.Constants.BorderRadius - 1
            : this.level.width - Tile.Constants.BorderRadius;
        const fenceVariant = i === 0 ? 0 : 2;
        const fence = new Sprite(Texture.from(`fence${fenceVariant}`));
        fence.anchor.set(0, 1);
        fence.hitArea = new TileHitbox(
          `fence${fenceVariant}`,
          Tile.Constants.TileDimensions.tileWidth,
          Tile.Constants.TileDimensions.tileHeight
        );
        const tile = this.grid[y][x];
        (tile as BlockedTile).hasFence = true;
        fence.x = tile!.x;
        fence.y = tile!.y;
        this.addChild(fence);
        this.fences.push(fence);
      }
    }

    this.fences = this.fences.sort((a, b) => (a.y > b.y ? 1 : -1));
  }
}
