import { Application } from "@pixi/app";
import { DisplayObject } from "@pixi/display";
import { Ticker } from "@pixi/ticker";
import { Container } from "pixi.js";

/**
 * https://www.pixijselementals.com/#the-manager-class
 */
export class Game {
  private constructor() {
    /*this class is purely static. No constructor to see here*/
  }

  private static app: Application;
  private static currentScene: IScene;

  public static get scaleFactor() {
    return {
      x: this.width / this.baseDimensions.width,
      y: this.height / this.baseDimensions.height,
    };
    // return (Game.baseDimensions.height / Game.baseDimensions.width) / (Game.height / Game.width);
  }

  public static get width(): number {
    return Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );
  }

  public static get height(): number {
    return Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );
  }

  private static baseDimensions = { width: Game.width, height: Game.height };
  
  public static initialize(background: number): void {
    const app = new Application({
      resizeTo: window, // This line here handles the actual resize!
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      backgroundColor: background,
    });

    document.body.appendChild(app.view);
    Ticker.shared.add(this.update);

    Game.app = app;
    console.warn(Game.baseDimensions)


    window.onresize = () => {
      const { x, y } = Game.scaleFactor;
      this.app.stage.scale.set(x, y);
    };
  }

  public static changeScene(newScene: IScene, ...args: Array<any>): void {
    console.warn("changing scene to:", newScene);

    if (Game.currentScene) {
      Game.app.stage.removeChild(Game.currentScene);
      Game.currentScene.destroy();
    }

    Game.currentScene = newScene;
    Game.app.stage.addChild(Game.currentScene);
    newScene.load(args);
  }

  private static update(delta: number): void {
    if (Game.currentScene) {
      Game.currentScene.update(delta);
    }
  }
}

export interface IScene extends DisplayObject {
  load(...args: Array<any>): void;
  update(delta: number): void;
}
