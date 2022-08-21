import { Game, IScene } from '../game';
import { Container, Graphics, Loader } from "pixi.js";
import { assets } from '../assets';
import { LevelSelectionScene } from './levelSelection';

export class LoadScene extends Container implements IScene {

    private loaderBar!: Container;
    private loaderBarBoder!: Graphics;
    private loaderBarFill!: Graphics;

    load(): void {
        const loaderBarWidth = Game.width * 0.8;

        this.loaderBarFill = new Graphics();
        this.loaderBarFill.beginFill(0x008800, 1)
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
      Game.changeScene(new LevelSelectionScene());
  }
}