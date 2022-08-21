import { Application } from "@pixi/app";
import { DisplayObject } from "@pixi/display";

/**
 * https://www.pixijselementals.com/#the-manager-class
 */
export class Game {
    private constructor() { /*this class is purely static. No constructor to see here*/ }

    private static app: Application;
    private static currentScene: IScene;

    public static get width(): number {
        return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }
    public static get height(): number {
        return Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    }

    public static initialize(background: number): void {
        const app = new Application({
            resizeTo: window, // This line here handles the actual resize!
            resolution: window.devicePixelRatio || 1,
            autoDensity: true,
            backgroundColor: background,
        });

        app.ticker.add(this.update)
        document.body.appendChild(app.view);

        Game.app = app;
    }

    public static changeScene(newScene: IScene): void {
        if (Game.currentScene) {
            Game.app.stage.removeChild(Game.currentScene);
            Game.currentScene.destroy();
        }

        Game.currentScene = newScene;
        Game.app.stage.addChild(Game.currentScene);
    }

    private static update(delta: number): void {
        if (Game.currentScene) {
             Game.currentScene.update(delta);
        }
    }
}

export interface IScene extends DisplayObject {
    load(): void;
    update(delta: number): void;
}