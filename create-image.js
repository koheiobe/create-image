var Canvas = require("canvas");

var fs = require("fs");

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 480;
const FONT_SIZE = 48;
const COMMENT = "hello world";

async function main() {
  const canvas = Canvas.createCanvas(640, 480); // 640x480の空のキャンバスを作る

  const ctx = canvas.getContext("2d"); // ここからはブラウザと共通
  const image = await Canvas.loadImage(
    "./svg/parts/outputAnswers/bg-hito-maru-moji-te-mono.svg"
  );

  ctx.font = `bold ${FONT_SIZE}px serif`;
  // const fontInfo = ctx.measureText(COMMENT);

  // const left = (CANVAS_WIDTH - fontInfo.width) / 2;
  // const top = CANVAS_HEIGHT - fontInfo.emHeightAscent;
  ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  // ctx.fillText(COMMENT, left, top);

  canvas.toBuffer((err, buf) => {
    fs.writeFileSync("test.png", buf);
  });
}

main();
