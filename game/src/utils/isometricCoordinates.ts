import { Vector2 } from "../models/Vector2";

const i_x = 1;
const i_y = 0.5;
const j_x = -1;
const j_y = 0.5;

export function toScreenCoordinate(tile: Vector2, tileDimensions: Vector2) {
  return {
    x: tile.x * i_x * (tileDimensions.x / 2) + tile.y * j_x * (tileDimensions.x / 2),
    y: tile.x * i_y * tileDimensions.y * .91 + tile.y * j_y * tileDimensions.y * .91
  }
}