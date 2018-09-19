import { SweepGradient } from "../src/index.js";

const demoElement = document.querySelector("#demo");
const dpr = Math.ceil(window.devicePixelRatio) || 1;
demoElement.width = demoElement.getBoundingClientRect().width * dpr;
demoElement.height = demoElement.getBoundingClientRect().height * dpr;
const ctx = demoElement.getContext("2d");
ctx.scale(dpr, dpr);

const g = new SweepGradient(ctx);
g.addColorStop(0.0, "#ffff00");
g.addColorStop(0.25, "#ff00ff");
g.addColorStop(0.5, "red");
g.addColorStop(0.75, "rgba(255,255,0,0)");
g.addColorStop(1.0, "#ffff00");

g.draw();
