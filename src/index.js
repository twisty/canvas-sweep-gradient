export class SweepGradient {
  constructor(ctx, x0, y0, x1, y1) {
    this.ctx = ctx;
    this.x0 = Math.min(x0, x1);
    this.y0 = Math.min(y0, y1);
    this.x1 = Math.max(x0, x1);
    this.y1 = Math.max(y0, y1);

    this.width = this.x1 - this.x0;
    this.height = this.y1 - this.y0;

    this.gradientWidth = 2 * (this.width + this.height);
    this.gradientHeight = 1;

    let offscreenCanvas = this.getOffscreenCanvas(
      this.gradientWidth,
      this.gradientHeight
    );
    this.offscreenCtx = offscreenCanvas.getContext("2d");
    this.offscreenGradient = this.offscreenCtx.createLinearGradient(
      0,
      0,
      this.gradientWidth,
      this.gradientHeight
    );
  }

  addColorStop(offset, color) {
    this.offscreenGradient.addColorStop(offset, color);
  }

  getOffscreenCanvas(w, h) {
    if (window.OffscreenCanvas) {
      return new window.OffscreenCanvas(w, h);
    }
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = w;
    offscreenCanvas.height = h;
    return offscreenCanvas;
  }

  getOffscreenGradientData() {
    const w = this.gradientWidth;
    const h = this.gradientHeight;
    this.offscreenCtx.fillStyle = this.offscreenGradient;
    this.offscreenCtx.fillRect(0, 0, w, h);
    const imageData = this.offscreenCtx.getImageData(0, 0, w, h);
    return imageData.data;
  }

  colourForProportion(gradientData, proportion) {
    const x = Math.floor((gradientData.length / 4) * proportion) * 4;
    return gradientData.slice(x, x + 4);
  }

  draw() {
    const gradientData = this.getOffscreenGradientData();
    const ctx = this.ctx;
    const centreX = this.x0 + this.width / 2;
    const centreY = this.y0 + this.height / 2;
    const rectSize = 1;
    for (let y = this.y0; y < this.y1; y += rectSize) {
      let dY = y - centreY;
      for (let x = this.x0; x < this.x1; x += rectSize) {
        let dX = x - centreX;
        let angle = (Math.atan(dX / dY) * 180) / Math.PI;
        if (dX < 0) {
          angle = 360 - angle;
          if (dY >= 0) {
            angle = angle - 180;
          }
        } else {
          angle = angle * -1;
          if (dY >= 0) {
            angle = angle + 180;
          }
        }
        let rgba = this.colourForProportion(gradientData, angle / 360);
        let [r, g, b, a] = rgba;
        ctx.fillStyle = `rgba(${r},${g},${b},${a / 255})`;
        ctx.fillRect(x, y, rectSize, rectSize);
      }
    }
  }
}
