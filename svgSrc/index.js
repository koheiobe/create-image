const createSvg = require("./create-svg");
const createSvgWithAnswer = require("./create-svg-with-answer");

const main = async () => {
  await createSvg();
  await createSvgWithAnswer();
};

main();
