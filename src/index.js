import tinycolor from "tinycolor2";

export class SweepGradient {
  constructor(ctx, x0, y0, x1, y1) {
    this.ctx = ctx;
    this.x0 = Math.min(x0, x1);
    this.y0 = Math.min(y0, y1);
    this.x1 = Math.max(x0, x1);
    this.y1 = Math.max(y0, y1);
    this.offsets = {};
    this.colors = {};
  }

  addColorStop(offset, color) {
    const key = offset;
    this.colors[key] = color;
    this.offsets[key] = offset;
  }

  getStops() {
    const stops = Object.values(this.offsets)
      .sort()
      .map(stop => {
        return { stop: stop, color: tinycolor(this.colors[stop]) };
      });
    if (stops[0].stop > 0) {
      stops.unshift({ stop: 0, color: stops[0].color });
    }
    if (stops[stops.length - 1].stop !== 1) {
      stops.push({ stop: 1, color: stops[stops.length - 1].color });
    }
    return stops;
  }

  colourForProportion(stops, proportion) {
    let step = 0;
    for (let i = 0; i < stops.length - 1; i++) {
      let stopA = stops[i];
      let stopB = stops[i + 1];
      if (proportion >= stopA.stop) {
        if (proportion <= stopB.stop) {
          step = i;
          break;
        }
      }
    }

    const regionStart = stops[step];
    const regionEnd = stops[step + 1];

    const propStart = proportion - regionEnd.stop;
    const propEnd = proportion - regionStart.stop;
    const propRange = propEnd - propStart;

    const blend = propEnd / propRange;

    return tinycolor
      .mix(regionStart.color, regionEnd.color, blend * 100)
      .toRgbString();
  }

  draw() {
    this.drawPerPixel();
    //this.drawUsingArc();
  }

  drawPerPixel() {
    const ctx = this.ctx;
    const width = this.x1 - this.x0;
    const height = this.y1 - this.y0;
    const centreX = this.x0 + width / 2;
    const centreY = this.y0 + height / 2;
    const rectSize = 1;
    const stops = this.getStops();
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
        ctx.fillStyle = this.colourForProportion(stops, angle / 360);
        ctx.fillRect(x, y, rectSize, rectSize);
      }
    }
  }

  drawUsingArc() {
    const degToRad = degree => {
      return (Math.PI / 180) * (degree - 90);
    };

    const ctx = this.ctx;
    const width = this.x1 - this.x0;
    const height = this.y1 - this.y0;
    const x = this.x0 + width / 2;
    const y = this.y0 + height / 2;
    const radius = Math.min(x, y);
    const circumference = 2 * Math.PI * radius;
    const degStep = Math.max(1, 360 / circumference);
    const stops = this.getStops();

    for (let i = 0; i < 360; i += degStep) {
      let proportion = i / 360;
      let color = this.colourForProportion(stops, proportion);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.arc(x, y, radius, degToRad(i), degToRad(i + degStep));
      ctx.fill();
    }
  }
}
