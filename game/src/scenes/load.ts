import { Game, IScene } from "../game";
import { Container, Graphics, Loader, Text } from "pixi.js";
import { assets } from "../assets";
import { MenuScene } from "./menu";
import { centerX } from "../utils/ui";
import { Level } from "../models/level-selection/level";
import { Keys, Storage } from "../utils/storage";

export class LoadScene extends Container implements IScene {
  private loaderBar!: Container;
  private loaderBarBoder!: Graphics;
  private loaderBarFill!: Graphics;

  private levels: Array<Level> = [
    { id: "Tutorial 1", unlocked: true },
    { id: "Tutorial 2" },
    { id: "Tutorial 3" },
    { id: "Tutorial 4" },
    { id: "Tutorial 5" },
    { id: "World 1 - 1", unlocked: true },
    { id: "World 1 - 2", unlocked: true },
  ];

  load(): void {
    const title = new Text(Game.title, { fontSize: 72 });
    title.x = centerX(title);
    title.y = 20;
    this.addChild(title);

    const subTitle = new Text("Loading", { fontSize: 48 });
    subTitle.x = centerX(subTitle);
    subTitle.y = 20 + title.y + title.height;
    this.addChild(subTitle);

    const loaderBarWidth = Game.width * 0.8;

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
    this.loaderBar.position.x = (Game.width - this.loaderBar.width) / 2;
    this.loaderBar.position.y = (Game.height - this.loaderBar.height) / 2;
    this.addChild(this.loaderBar);

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
