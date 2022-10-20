const { optimize, loadConfig } = require("svgo");
const { readFileSync } = require("fs");
const bg = readFileSync("./svg/parts/bg.svg");
const hito = readFileSync("./svg/parts/hito.svg");
const maru = readFileSync("./svg/parts/maru.svg");
const moji = readFileSync("./svg/parts/moji.svg");
const mono = readFileSync("./svg/parts/mono.svg");

loadConfig().then((config) => {
  const bgResult = optimize(bg.toString(), config);
  const hitoResult = optimize(hito.toString(), config);
  const maruResult = optimize(maru.toString(), config);
  const mojiResult = optimize(moji.toString(), config);
  const monoResult = optimize(mono.toString(), config);

  const svgs = `
  <svg width="986px" height="986px" xmlns="http://www.w3.org/2000/svg">
    ${bgResult.data}
    ${hitoResult.data}
    ${maruResult.data}
    ${mojiResult.data}
    ${monoResult.data}
  </svg>
`;

  console.log(svgs);
});
