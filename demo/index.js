const displayElement = document.querySelector("#demo");
const displayRect = displayElement.getBoundingClientRect();
const width = displayRect.width;
const height = displayRect.height;
displayElement.width = width;
displayElement.height = height;
const ctx = displayElement.getContext("2d");

const start = new Date();

/**
 * Setup and draw the gradient.
 */
const x0 = 0;
const y0 = 0;
const x1 = width;
const y1 = height;
const g = new SweepGradient.SweepGradient(ctx, x0, y0, x1, y1);

g.addColorStop(0.0, "#ff0");
g.addColorStop(0.25, "#ff00ff");
g.addColorStop(0.5, "red");
g.addColorStop(0.75, "rgba(255,255,0,0)");
g.addColorStop(1.0, "#ffff00");

g.draw();

var end = new Date();
var elapsed = end.getTime() - start.getTime();
console.log(`${elapsed} milliseconds`);
