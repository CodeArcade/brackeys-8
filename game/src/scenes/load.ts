import { Game, IScene } from "../game";
import { Container, Graphics, Loader, Text } from "pixi.js";
import { assets, textStyle } from "../assets";
import { MenuScene } from "./menu";
import { Level } from "../models/level-selection/level";
import { Keys, Storage } from "../utils/storage";
import { Sound } from "@pixi/sound";

export class LoadScene extends Container implements IScene {
  private loaderBar!: Container;
  private loaderBarBoder!: Graphics;
  private loaderBarFill!: Graphics;

  static backgroundNoise = Sound.from({
    url: "./assets/sounds/game/background-noise.ogg",
    loop: true,
  });

  private levels: Array<Level> = [
    { id: "Tutorial 1", unlocked: true },
    { id: "Tutorial 2" },
    { id: "Tutorial 3" },
    { id: "Tutorial 4" },
    { id: "Tutorial 5" },
    { id: "World 1 - 1", unlocked: true },
    { id: "World 1 - 2", unlocked: true },
    { id: "World 1 - 3", unlocked: true },
    { id: "World 1 - 4", unlocked: true },
    { id: "World 2 - 4", unlocked: true },
    { id: "World 2 - 5", unlocked: true },
    { id: "World 3 - 1", unlocked: true },
    { id: "World 3 - 2", unlocked: true },
    { id: "World 3 - 3", unlocked: true },
    { id: "World 3 - 4", unlocked: true },
  ];

  load(): void {
    const loaderBarWidth = Game.width * 0.2;
    LoadScene.backgroundNoise.play();

    this.loaderBarFill = new Graphics();
    this.loaderBarFill.beginFill(0x008800, 1);
    this.loaderBarFill.drawRect(0, 0, loaderBarWidth, 50);
    this.loaderBarFill.endFill();
    this.loaderBarFill.scale.x = 0;

    this.loaderBarBoder = new Graphics();
    this.loaderBarBoder.lineStyle(10, 0x0, 1);
    this.loaderBarBoder.drawRect(0, 0, loaderBarWidth, 50);

    this.loaderBar = new Container();
    this.loaderBar.addChild(this.loaderBarFill);
    this.loaderBar.addChild(this.loaderBarBoder);
    this.loaderBar.position.x = Game.width - this.loaderBar.width - 20;
    this.loaderBar.position.y = Game.height - this.loaderBar.height - 20;
    this.addChild(this.loaderBar);

    const subTitle = new Text("Loading", { ...textStyle, fill: 0xffffff });
    subTitle.x = this.loaderBar.position.x;
    subTitle.y = this.loaderBar.position.y - subTitle.height;
    this.addChild(subTitle);

    if (!Storage.get<Array<Level>>(Keys.UnlockedLevels)) {
      Storage.set(Keys.UnlockedLevels, this.levels);
    }

    Loader.shared.add(assets);

    Loader.shared.onProgress.add(this.downloadProgress, this);
    Loader.shared.onComplete.once(this.gameLoaded, this);

    Loader.shared.load();
  }

  update(_delta: number): void {}

  private downloadProgress(loader: Loader): void {
    const progressRatio = loader.progress / 100;
    this.loaderBarFill.scale.x = progressRatio;
  }

  private gameLoaded(): void {
    Game.changeScene(new MenuScene());
  }
}
