const displayElement = document.querySelector("#demo");
const displayRect = displayElement.getBoundingClientRect();

const width = displayRect.width;
const height = displayRect.height;

/**
 * Setup an off screen canvas context for drawing our gradient.
 * Note: don't the scale the context when generating a graphic for use as a pattern fill.
 */
const offscreenElement = document.createElement("canvas");
offscreenElement.width = width;
offscreenElement.height = height;
const offscreenCtx = offscreenElement.getContext("2d");

/**
 * Setup and draw the gradient.
 */
const x1 = 0;
const y0 = 0;
const x0 = width;
const y1 = height;
const g = new SweepGradient.SweepGradient(offscreenCtx, x0, y0, x1, y1);

g.addColorStop(0.0, "#ffff00");
g.addColorStop(0.25, "#ff00ff");
g.addColorStop(0.5, "red");
g.addColorStop(0.75, "rgba(255,255,0,0)");
g.addColorStop(1.0, "#ffff00");

g.draw();

/**
 * Get the gradient as a pattern.
 */
const gradientPattern = offscreenCtx.createPattern(
  offscreenCtx.canvas,
  "no-repeat"
);

/**
 * Set up the canvas on the page to place our gradient
 */
const dpr = Math.ceil(window.devicePixelRatio) || 1;
displayElement.width = width * dpr;
displayElement.height = height * dpr;
const displayCtx = displayElement.getContext("2d");
displayCtx.scale(dpr, dpr);

/**
 * Draw a circle, which we fill using our gradient pattern.
 */
displayCtx.fillStyle = gradientPattern;
displayCtx.arc(width / 2, height / 2, width / 2, 0, 2 * Math.PI);
displayCtx.fill();
