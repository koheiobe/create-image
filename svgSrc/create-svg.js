const { readFileSync, writeFileSync, mkdirSync, existsSync } = require("fs");
const { generateCsv, getCsvIds } = require("./csv-controller");
const {
  getPartsList,
  generateSVGSeedByRoundRobin,
  generateSVGFromSeed,
} = require("./seed-creater");
const { remove } = require("fs-extra");

// パーツのフォルダー構造
// {
//   svg: {
//     parts: {
//       bg,
//       hito,
//       maru,
//       moji,
//       mono,
//     },
//     outputs,
//     answerOutputs,
//   },
// };
const basePartsPath = `./svg/parts`;
const svgPartsFolderNameList = ["bg", "hito", "maru", "moji", "mono"];
const svgOutputsPath = `${basePartsPath}/outputs`;
const csvOutputPath = `${basePartsPath}/partsAnswersList.csv`;

const main = async () => {
  const folderNameFileNameListObj = getPartsList(
    basePartsPath,
    svgPartsFolderNameList
  );
  const seed = generateSVGSeedByRoundRobin(folderNameFileNameListObj);

  let generatedIDs;
  try {
    const csv = readFileSync(csvOutputPath);
    generatedIDs = await getCsvIds(csv);
  } catch (err) {
    console.log(err);
    console.warn("consider that csv file does not exist!");
    generatedIDs = [];
  }

  for (const id of generatedIDs) {
    delete seed[id];
  }

  if (!existsSync(svgOutputsPath)) {
    mkdirSync(svgOutputsPath);
  }
  const idAndSVGs = await generateSVGFromSeed(basePartsPath, seed);
  await generateCsv(seed, csvOutputPath);
  for (const [id, svg] of idAndSVGs) {
    writeFileSync(`${svgOutputsPath}/${id}.svg`, svg);
    // テストのために１枚だけ出力する際は下記をコメントイン
    // break;
  }
};

module.exports = main;
