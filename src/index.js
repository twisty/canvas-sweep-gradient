export class SweepGradient {
  constructor(ctx) {
    this.ctx = ctx;
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

    return tinycolor.mix(regionStart.color, regionEnd.color, blend * 100).toRgbString();
  }

  draw() {
    this.drawPerPixel();
    //this.drawUsingArc();
  }

  drawPerPixel() {
    const ctx = this.ctx;
    const rect = ctx.canvas.getBoundingClientRect();
    const centreX = rect.width / 2;
    const centreY = rect.height / 2;
    const step = 1;
    const stops = this.getStops();
    for (let y = 0; y < rect.height; y += step) {
      let dY = y - centreY;
      for (let x = 0; x < rect.width; x += step) {
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
        ctx.fillRect(x, y, step, step);
      }
    }
  }

  drawUsingArc() {
    const degToRad = degree => {
      return (Math.PI / 180) * (degree - 90);
    };

    const ctx = this.ctx;
    const rect = ctx.canvas.getBoundingClientRect();
    const x = rect.width / 2;
    const y = rect.height / 2;
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
