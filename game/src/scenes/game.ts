import { Game, IScene } from '../Game';
import { Container, Graphics, Loader, Sprite, Texture } from "pixi.js";
import { Button } from '../ui/button';

export class GameScene extends Container implements IScene {

  load(): void {
   
  }

  update(_delta: number): void {}
}