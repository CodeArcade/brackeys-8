import { Game } from "../game";

export function centerX(object: Partial<{ width: number }>): number {
  if (!object || !object.width) return 0;

  return Game.width / 2 - object.width / 2;
}

export function centerY(object: Partial<{ height: number }>): number {
  if (!object || !object.height) return 0;

  return Game.height / 2 - object.height / 2;
}
