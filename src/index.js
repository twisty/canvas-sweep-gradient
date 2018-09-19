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
        return { stop: stop, color: this.colors[stop] };
      });
    if (stops[0].stop > 0) {
      stops.unshift({ stop: 0, color: stops[0].color });
    }
    if (stops[stops.length - 1].stop !== 1) {
      stops.push({ stop: 1, color: stops[stops.length - 1].color });
    }
    return stops;
  }

  colourForProportion(proportion) {
    const stops = this.getStops();
    let step = 0;
    let nextStep = 0;
    for (let i = 0; i < stops.length; i++) {
      if (proportion >= stops[i].stop) {
        nextStep = i + 1;
        if (nextStep === stops.length) {
          nextStep = 0;
        }
        if (proportion <= stops[nextStep].stop) {
          step = i;
        }
      }
    }

    const regionStart = stops[step];
    const regionEnd = stops[nextStep];

    const propStart = proportion - regionEnd.stop;
    const propEnd = proportion - regionStart.stop;
    const propRange = propEnd - propStart;

    const blend = propEnd / propRange;

    const a = tinycolor(regionStart.color);
    const b = tinycolor(regionEnd.color);

    return tinycolor.mix(a, b, blend * 100).toRgbString();
  }

  draw() {
    this.drawUsingArc();
  }

  drawUsingArc() {
    const degToRad = degree => {
      return (Math.PI / 180) * (degree - 90);
    };

    const startDeg = 0;
    const endDeg = 360;
    const ctx = this.ctx;
    const rect = ctx.canvas.getBoundingClientRect();
    const x = rect.width / 2;
    const y = rect.height / 2;
    const radius = Math.min(x, y);
    const circumference = 2 * Math.PI * radius;
    const degStep = Math.max(1, 360 / circumference);

    for (let i = startDeg; i <= endDeg; i += degStep) {
      let proportion = i / (endDeg - startDeg);
      let color = this.colourForProportion(proportion);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.arc(x, y, radius, degToRad(i), degToRad(i + degStep));
      ctx.fill();
    }
  }
}
