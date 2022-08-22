import { Sprite, IHitArea, Texture } from "pixi.js";

export default class TileHitbox extends Sprite implements IHitArea {
  constructor(texture: string, width: number, height: number) {
    super(Texture.from(texture));

    this.width = width;
    this.height = height;
  }
  contains(x: number, y: number): boolean {
    y += 379; // image size is 379px
    const tempPoint = { x: 0, y: 0 };
    this.worldTransform.applyInverse({ x, y }, tempPoint);
    const width = this._texture.orig.width;
    const height = this._texture.orig.height;
    const x1 = -width * this.anchor.x;

    let y1 = 0;
    let flag = false;

    if (tempPoint.x >= x1 && tempPoint.x < x1 + width) {
      y1 = -height * this.anchor.y;

      if (tempPoint.y >= y1 && tempPoint.y < y1 + height) {
        flag = true;
      }
    }

    if (!flag) {
      return false;
    }

    const tex = this.texture;
    const baseTex: any = this.texture.baseTexture;
    const res = baseTex.resolution;

    if (!baseTex.hitmap) {
      if (!this.generateHitmap(baseTex, 32)) {
        return false;
      }
    }

    const hitmap = baseTex.hitmap;
    let dx = Math.round((tempPoint.x - x1 + tex.frame.x) * res);
    let dy = Math.round((tempPoint.y - y1 + tex.frame.y) * res);
    let ind = dx + dy * baseTex.realWidth;
    let ind1 = ind % 32;
    let ind2 = (ind / 32) | 0;
    return (hitmap[ind2] & (1 << ind1)) !== 0;
  }

  private generateHitmap(baseTex: any, threshold: number) {
    //check sprite props
    if (!baseTex.resource) {
      //renderTexture
      return false;
    }
    const imgSource = baseTex.resource.source;
    let canvas = null;
    if (!imgSource) {
      return false;
    }
    let context = null;
    if (imgSource.getContext) {
      canvas = imgSource;
      context = canvas.getContext("2d");
    } else if (imgSource instanceof Image) {
      canvas = document.createElement("canvas");
      canvas.width = imgSource.width;
      canvas.height = imgSource.height;
      context = canvas.getContext("2d");
      context?.drawImage(imgSource, 0, 0);
    } else {
      //unknown source;
      return false;
    }

    const w = canvas.width,
      h = canvas.height;
    let imageData = context.getImageData(0, 0, w, h);
    //create array
    let hitmap = (baseTex.hitmap = new Uint32Array(Math.ceil((w * h) / 32)));
    //fill array
    for (let i = 0; i < w * h; i++) {
      //lower resolution to make it faster
      let ind1 = i % 32;
      let ind2 = (i / 32) | 0;
      //check every 4th value of image data (alpha number; opacity of the pixel)
      //if it's visible add to the array
      if (imageData.data[i * 4 + 3] >= threshold) {
        hitmap[ind2] = hitmap[ind2] | (1 << ind1);
        // console.log(`hitmap[${ind2}]:`, hitmap[ind2]);
      }
    }
    return true;
  }
}
