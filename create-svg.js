const { createSVGWindow } = require("svgdom");
const { readFileSync } = require("fs");
const audioSvg = readFileSync("./svg/audio.svg");
const ballTriangle = readFileSync("./svg/ball-triangle.svg");
const window = createSVGWindow();
const SVG = require("svg.js")(window);
const document = window.document;

// create svg.js instance
const canvas = SVG(document.documentElement);
// Width, heightはsvg画像のwidth, heightと統一する
canvas.attr("width", "300");
canvas.attr("height", "300");

canvas.svg(audioSvg.toString());
canvas.svg(ballTriangle.toString());

console.log(canvas.svg());
