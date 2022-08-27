import { TextStyle } from "pixi.js";

export const assets: Array<{ name: string; url: string }> = [
  //#region LEVEL
  { name: "Tutorial 1", url: "./assets/levels/tutorial-1.json" },
  { name: "Tutorial 2", url: "./assets/levels/tutorial-2.json" },
  { name: "Tutorial 3", url: "./assets/levels/tutorial-3.json" },
  { name: "Tutorial 4", url: "./assets/levels/tutorial-4.json" },
  { name: "Tutorial 5", url: "./assets/levels/tutorial-5.json" },
  { name: "World 1 - 1", url: "./assets/levels/World 1 - 1.json" },
  { name: "World 1 - 2", url: "./assets/levels/World 1 - 2.json" },
  { name: "World 1 - 3", url: "./assets/levels/World 1 - 3.json" },
  { name: "World 1 - 4", url: "./assets/levels/World 1 - 4.json" },
  { name: "World 2 - 4", url: "./assets/levels/World 2 - 4.json" },
  { name: "World 2 - 5", url: "./assets/levels/World 2 - 5.json" },
  { name: "World 3 - 1", url: "./assets/levels/World 3 - 1.json" },
  { name: "World 3 - 2", url: "./assets/levels/World 3 - 2.json" },
  //#endregion
  //#region UI
  { name: "button", url: "./assets/sprites/ui/button.png" },
  { name: "buttonHover", url: "./assets/sprites/ui/buttonHover.png" },
  { name: "buttonLock", url: "./assets/sprites/ui/buttonLock.png" },
  { name: "buttonSelectTile", url: "./assets/sprites/ui/buttonSelectTile.png" },
  { name: "arrowRight", url: "./assets/sprites/ui/arrowRight.png" },
  {
    name: "buttonSelectTileHover",
    url: "./assets/sprites/ui/buttonSelectTileHover.png",
  },
  { name: "menuBackground", url: "./assets/sprites/ui/menu-background.png" },
  //#endregion
  //#region SPRITES
  { name: "fisher0", url: "./assets/sprites/entities/fisher_0.png" },
  { name: "fisher1", url: "./assets/sprites/entities/fisher_1.png" },
  { name: "fisher2", url: "./assets/sprites/entities/fisher_2.png" },
  { name: "fisher3", url: "./assets/sprites/entities/fisher_3.png" },
  { name: "fish0", url: "./assets/sprites/entities/fish_0.png" },
  { name: "fish1", url: "./assets/sprites/entities/fish_1.png" },
  { name: "fish2", url: "./assets/sprites/entities/fish_2.png" },
  { name: "fish3", url: "./assets/sprites/entities/fish_3.png" },
  //#endregion
  //#region TERRAIN
  { name: "emptyTile", url: "./assets/sprites/terrain/emptyTile.png" },
  {
    name: "emptyTileHover",
    url: "./assets/sprites/terrain/emptyTileHover.png",
  },
  { name: "blockedTile0", url: "./assets/sprites/terrain/empty_0.png" },
  { name: "blockedTile1", url: "./assets/sprites/terrain/empty_1.png" },
  { name: "blockedTile2", url: "./assets/sprites/terrain/empty_2.png" },
  { name: "blockedTile3", url: "./assets/sprites/terrain/empty_3.png" },
  { name: "riverEnd0", url: "./assets/sprites/terrain/river-end_0.png" },
  { name: "riverEnd1", url: "./assets/sprites/terrain/river-end_1.png" },
  { name: "riverEnd2", url: "./assets/sprites/terrain/river-end_2.png" },
  { name: "riverEnd3", url: "./assets/sprites/terrain/river-end_3.png" },
  { name: "riverBendy0", url: "./assets/sprites/terrain/river-bendy_0.png" },
  { name: "riverBendy1", url: "./assets/sprites/terrain/river-bendy_1.png" },
  { name: "riverBendy2", url: "./assets/sprites/terrain/river-bendy_2.png" },
  { name: "riverBendy3", url: "./assets/sprites/terrain/river-bendy_3.png" },
  { name: "riverCross0", url: "./assets/sprites/terrain/river-cross_0.png" },
  { name: "riverCross1", url: "./assets/sprites/terrain/river-cross_1.png" },
  { name: "riverCross2", url: "./assets/sprites/terrain/river-cross_2.png" },
  { name: "riverCross3", url: "./assets/sprites/terrain/river-cross_3.png" },
  {
    name: "riverStraight0",
    url: "./assets/sprites/terrain/river-straight_0.png",
  },
  {
    name: "riverStraight1",
    url: "./assets/sprites/terrain/river-straight_1.png",
  },
  {
    name: "riverStraight2",
    url: "./assets/sprites/terrain/river-straight_2.png",
  },
  {
    name: "riverStraight3",
    url: "./assets/sprites/terrain/river-straight_3.png",
  },
  { name: "riverT0", url: "./assets/sprites/terrain/river-t_0.png" },
  { name: "riverT1", url: "./assets/sprites/terrain/river-t_1.png" },
  { name: "riverT2", url: "./assets/sprites/terrain/river-t_2.png" },
  { name: "riverT3", url: "./assets/sprites/terrain/river-t_3.png" },
  { name: "lake", url: "./assets/sprites/terrain/lake.png" },
  //#endregion
  //#region decoration
  { name: "redFlower0", url: "./assets/sprites/decoration/redFlower0.png" },
  { name: "redFlower1", url: "./assets/sprites/decoration/redFlower1.png" },
  { name: "redFlower2", url: "./assets/sprites/decoration/redFlower2.png" },
  { name: "redFlower3", url: "./assets/sprites/decoration/redFlower3.png" },
  { name: "shrub1-0", url: "./assets/sprites/decoration/shrub1-0.png" },
  { name: "shrub1-1", url: "./assets/sprites/decoration/shrub1-1.png" },
  { name: "shrub1-2", url: "./assets/sprites/decoration/shrub1-2.png" },
  { name: "shrub1-3", url: "./assets/sprites/decoration/shrub1-3.png" },
  { name: "grass1-0", url: "./assets/sprites/decoration/grass1-0.png" },
  { name: "grass1-1", url: "./assets/sprites/decoration/grass1-1.png" },
  { name: "grass1-2", url: "./assets/sprites/decoration/grass1-2.png" },
  { name: "grass1-3", url: "./assets/sprites/decoration/grass1-3.png" },
  { name: "grass2-0", url: "./assets/sprites/decoration/grass2-0.png" },
  { name: "grass2-1", url: "./assets/sprites/decoration/grass2-1.png" },
  { name: "grass2-2", url: "./assets/sprites/decoration/grass2-2.png" },
  { name: "grass2-3", url: "./assets/sprites/decoration/grass2-3.png" },
  { name: "stoneFlat0", url: "./assets/sprites/decoration/stoneFlat0.png" },
  { name: "stoneFlat1", url: "./assets/sprites/decoration/stoneFlat1.png" },
  { name: "stoneFlat2", url: "./assets/sprites/decoration/stoneFlat2.png" },
  { name: "stoneFlat3", url: "./assets/sprites/decoration/stoneFlat3.png" },
  {
    name: "yellowMushroom0",
    url: "./assets/sprites/decoration/yellowMushroom0.png",
  },
  {
    name: "yellowMushroom1",
    url: "./assets/sprites/decoration/yellowMushroom1.png",
  },
  {
    name: "yellowMushroom2",
    url: "./assets/sprites/decoration/yellowMushroom2.png",
  },
  {
    name: "yellowMushroom3",
    url: "./assets/sprites/decoration/yellowMushroom3.png",
  },
  { name: "pebble0", url: "./assets/sprites/decoration/pebble0.png" },
  { name: "pebble1", url: "./assets/sprites/decoration/pebble1.png" },
  { name: "pebble2", url: "./assets/sprites/decoration/pebble2.png" },
  { name: "pebble3", url: "./assets/sprites/decoration/pebble3.png" },
  { name: "fence0", url: "./assets/sprites/decoration/fence0.png" },
  { name: "fence1", url: "./assets/sprites/decoration/fence1.png" },
  { name: "fence2", url: "./assets/sprites/decoration/fence2.png" },
  { name: "fence3", url: "./assets/sprites/decoration/fence3.png" },
  { name: "bendyFence0", url: "./assets/sprites/decoration/bendyFence0.png" },
  { name: "bendyFence1", url: "./assets/sprites/decoration/bendyFence1.png" },
  { name: "bendyFence2", url: "./assets/sprites/decoration/bendyFence2.png" },
  { name: "bendyFence3", url: "./assets/sprites/decoration/bendyFence3.png" },
  //#endregion
  //#region BigDecoration
  { name: "bigRock1-0", url: "./assets/sprites/decoration/bigRock1-0.png" },
  { name: "bigRock1-1", url: "./assets/sprites/decoration/bigRock1-1.png" },
  { name: "bigRock1-2", url: "./assets/sprites/decoration/bigRock1-2.png" },
  { name: "bigRock1-3", url: "./assets/sprites/decoration/bigRock1-3.png" },
  { name: "bigRock2-0", url: "./assets/sprites/decoration/bigRock2-0.png" },
  { name: "bigRock2-1", url: "./assets/sprites/decoration/bigRock2-1.png" },
  { name: "bigRock2-2", url: "./assets/sprites/decoration/bigRock2-2.png" },
  { name: "bigRock2-3", url: "./assets/sprites/decoration/bigRock2-3.png" },
  { name: "pineTree0", url: "./assets/sprites/decoration/pineTree0.png" },
  { name: "pineTree1", url: "./assets/sprites/decoration/pineTree1.png" },
  { name: "pineTree2", url: "./assets/sprites/decoration/pineTree2.png" },
  { name: "pineTree3", url: "./assets/sprites/decoration/pineTree3.png" },
  //#endregion
];

export const textStyle = new TextStyle({
  fontFamily: '"Fredoka One", sans-serif',
  fill: 0xffffff,
  dropShadow: true,
  dropShadowColor: 0,
  dropShadowDistance: 3,
});
