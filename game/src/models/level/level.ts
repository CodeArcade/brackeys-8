import { Tile, Placeable } from '@models';

export interface Level {
    width: number;
    height: number;
    fishToWin: number;
    tiles: Array<Tile>;
    placeables: Array<Placeable>;
}